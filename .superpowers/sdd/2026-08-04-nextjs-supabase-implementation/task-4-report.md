# Task 4 Report: Checkout API & Midtrans Snap Integration

## What Was Implemented

1. **Installed dependencies**:
   - Installed `midtrans-client` for payment gateway Snap transactions.
2. **Created custom type definition**:
   - Added `src/types/midtrans-client.d.ts` declaring types for the `midtrans-client` module, resolving any TypeScript strict checks and ESLint `no-explicit-any` errors cleanly.
3. **Midtrans client helper**:
   - Created `src/lib/midtrans.ts` exporting a configured instance of `midtransClient.Snap` using sandbox parameters.
4. **Checkout Route Handler (`src/app/api/checkout/route.ts`)**:
   - Built the endpoint `POST /api/checkout`.
   - Validated that `items` is a non-empty array with valid `variantId`, positive `price`, and positive `quantity`.
   - Authenticated users using the Supabase server client.
   - Checked item stock levels from the `product_variants` table.
   - Calculated total `grossAmount` dynamically.
   - Inserted the order into the `orders` table (populating historical totals, `shipping_address`, and courier).
   - Inserted ordered products into the `order_items` table.
   - Requested a Snap token/redirect URL from Midtrans.
   - Registered the transaction details in the `payments` table.
   - Included robust error cleanups (deleting created orders/items if subsequent operations like Snap or payment insertion fail).

## Files Changed

- `package.json`
- `package-lock.json`
- `src/lib/midtrans.ts`
- `src/types/midtrans-client.d.ts`
- `src/app/api/checkout/route.ts`
- `tests/checkout.test.ts`

## What Was Tested & Test Results

- Created a suite of tests in `tests/checkout.test.ts` verifying:
  - 401 returns when the user is unauthenticated.
  - 400 returns when payload structure is invalid.
  - 400 returns when variant does not exist or has insufficient stock.
  - Order insertion failure returns 400.
  - Order items insertion failure triggers order rollback/deletion and returns 400.
  - Midtrans API failure triggers order rollback/deletion and returns 500.
  - Payment record insertion failure triggers order rollback/deletion and returns 400.
  - Successful checkout flow inserts records correctly, interacts with mocked Midtrans Snap, and returns the Snap token/redirect URL on code 200.
- Ran tests with Vitest:
  - All 11 new tests passed.
  - Full suite of 33 tests passes cleanly.
- Ran `npm run check` (Linting, typecheck, production Next.js build):
  - Linting: Passed (0 errors, 1 warning on a pre-existing component).
  - Typecheck: Passed (0 errors).
  - Next.js Build: Passed successfully.

## Self-Review Findings & Actions

- Tested edge cases like empty items list or negative quantities which return 400.
- Cleared a linter warning in the checkout endpoint (unused `couponCode` parameter) by removing it from the destructured request body.
- Checked TypeScript strict type safety using `Record<string, unknown>` for the Midtrans client wrapper parameters.

## Issues/Concerns
- None.

---

## Code Review Fixes Report

We addressed the code review feedback with the following implementations:

1. **Security Vulnerability: Client-Side Price Trust (Must Fix)**
   - Modified `src/app/api/checkout/route.ts` to retrieve pricing, discounts, and item names directly from the server-side database (`product_variants` and `products` joined query) instead of relying on the price and name fields submitted in the request body.
   - Computes `grossAmount` using securely retrieved server prices.

2. **Missing Database Migrations (Should Fix)**
   - Created the migration file `supabase/migrations/20260804000100_checkout_tables.sql` defining full SQL schemas, indexes, and RLS policies for the `orders`, `order_items`, and `payments` tables.

3. **Order Number Collision Risk (Should Fix)**
   - Updated the identifier generation algorithm to append a collision-resistant random suffix: `PLT-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`.

4. **Rollback Failure Risk (Should Fix)**
   - Configured `order_items` and `payments` tables with `ON DELETE CASCADE` constraints referencing the `orders(id)` primary key. Deleting a rolled-back order automatically cleans up all child constraints safely on the database.

5. **Minor / Nice to Have Items**
   - **Duplicate Stock Bypass Check**: Added aggregation logic which sums quantities by `variantId` before verifying stock levels against the database.
   - **Input Validation**: Added type checks and presence checks for `addressId` and `courier`.
   - **Test Coverage**: Added three new tests in `tests/checkout.test.ts` specifically checking validation of `addressId`/`courier`, stock aggregate checks for duplicate items, and secure database pricing overrides.

