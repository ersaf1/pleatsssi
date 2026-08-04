# Task 5 Report: Midtrans Webhook Payment Status Handler

## Implementation Details
We implemented the webhook handler route for Midtrans callbacks that securely verifies the SHA-512 signature key, updates PostgreSQL tables for both orders and payments, and correctly restores stock levels upon order cancellation or expiration.

1. **Midtrans Webhook Callback Route Handler (`src/app/api/webhooks/midtrans/route.ts`)**:
   - Parses the incoming webhook payload.
   - Computes and validates the signature key using `SHA512(order_id + status_code + gross_amount + MIDTRANS_SERVER_KEY)` to secure against counterfeit notifications.
   - Fetches the targeted order securely by its `order_number`.
   - Maps the Midtrans `transaction_status` to both `orders.status` (e.g., `'processing'` or `'cancelled'`) and `orders.payment_status` (e.g., `'paid'`, `'failed'`, `'expired'`).
   - Updates the matching entry in the `payments` table with the transaction status, payment method (`payment_type`), Midtrans unique transaction ID, raw payload, and transaction timestamps (`paid_at` and `updated_at`).
   - Restores/increments the variant stock in the `product_variants` table if the order changes to `'cancelled'` status, avoiding double incrementing if the webhook fires multiple times.

2. **Database Migration Sync (`supabase/migrations/20260804000100_checkout_tables.sql`)**:
   - Discovered that the `snap_token` column (which is required by the checkout route handler to store the Midtrans Snap token) was missing from the `payments` table definition in the migrations.
   - Fixed the migration to add the `snap_token VARCHAR(255)` column, matching the architectural specification.

---

## Test Coverage & Results
We created a comprehensive set of unit tests in `tests/webhook.test.ts` using Vitest to verify all parts of the webhook flow:

- **Missing Parameters**: Verifies a `400 Bad Request` is returned if key parameters are absent.
- **Server Configuration Check**: Verifies a `500 Internal Server Error` is returned if `MIDTRANS_SERVER_KEY` is not configured in environment variables.
- **Signature Security Verification**: Verifies a `403 Forbidden` is returned when the calculated signature does not match the payload's signature.
- **Order Presence Validation**: Verifies a `404 Not Found` is returned if the order number does not match any database record.
- **Successful Payment Status Handler**: Verifies `transaction_status` `'settlement'` or `'capture'` updates order status to `'processing'` and payment status to `'paid'`, updates the `payments` record details, and does not alter stock.
- **Failure / Cancel Status Handler**: Verifies `transaction_status` `'cancel'` updates order status to `'cancelled'`, maps payment status to `'failed'`, and increments variant stock in the database.
- **Idempotency Verification**: Verifies that if an order has already transitioned to `'cancelled'`, subsequent cancel requests do not increment the stock again.

### Test Results
Run: `npm run test`
```
 ✓ tests/database.test.ts (1 test) 7ms
 ✓ tests/webhook.test.ts (7 tests) 54ms
 ✓ tests/checkout.test.ts (14 tests) 69ms
 ✓ tests/auth.test.ts (6 tests) 27ms
 ✓ tests/cart.test.ts (15 tests) 50ms

 Test Files  5 passed (5)
      Tests  43 passed (43)
```

---

## Files Changed
- `src/app/api/webhooks/midtrans/route.ts` (created)
- `tests/webhook.test.ts` (created)
- `supabase/migrations/20260804000100_checkout_tables.sql` (modified to add `snap_token`)

---

## Self-Review Findings & Concerns
- All tests are passing cleanly.
- Types, linting, and build compiled successfully under `npm run check`.
- We successfully fixed a migration schema discrepancy for `snap_token` from previous tasks. No other structural concerns are present.

---

## Code Review Fixes (Atomic Stock & Test Isolation)
Based on review findings, we implemented the following critical updates:

1. **Atomic Stock Updates via RPC**:
   - Added the `adjust_variant_stock(variant_id UUID, qty INT)` PostgreSQL function in `supabase/migrations/20260804000100_checkout_tables.sql` to avoid race conditions.
   - Updated the checkout route (`src/app/api/checkout/route.ts`) to decrement variant stock levels atomically during checkout. Integrated stock rollback operations if checkout steps fail (such as database insertion errors or Midtrans API errors).
   - Updated the webhook handler (`src/app/api/webhooks/midtrans/route.ts`) to call the atomic RPC function instead of non-atomic read-then-write code when restoring variant stock.

2. **Test Robustness & Isolation**:
   - Refactored `tests/webhook.test.ts` to separate the mocks for order fetching (`mockSingleOrder`) and variant fetching (`mockSingleVariant`).
   - Mocked the atomic RPC function `adjust_variant_stock` in both `tests/checkout.test.ts` and `tests/webhook.test.ts` to verify the execution of stock changes.
   - All tests now verify proper parameters passed to `supabase.rpc('adjust_variant_stock', ...)` for stock additions and subtractions.
