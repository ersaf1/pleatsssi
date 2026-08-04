# Task 3 Report: Zustand Cart Store & Sync API

## What was implemented
1. **Client-side Zustand Cart Store** (`src/store/useCartStore.ts`):
   - Created the Zustand store with `persist` middleware to persist the cart items in `localStorage` under key `pleatsssi-cart`.
   - Implemented state mutations:
     - `addItem`: Adds an item to the cart, merges quantities if the variant exists, and caps the quantity at `stockAvailable`.
     - `removeItem`: Removes an item by `variantId`.
     - `updateQuantity`: Updates quantity for a variant, bounds the quantity between `1` and `stockAvailable`.
     - `clearCart`: Empties the cart.
     - `syncWithBackend`: Performs a `POST` request to `/api/cart/sync` sending the current items array (only if items are present).
2. **Server-side API Sync Endpoint** (`src/app/api/cart/sync/route.ts`):
   - Authenticates user using Supabase SSR (`supabaseServerClient()`). Returns `401` if unauthenticated.
   - Parses guest cart items from the request body. Validates that it's an array, otherwise returns `400`.
   - Merges the guest items in-memory with any existing items in the database `cart_items` table.
   - Performs a database `upsert` of the merged items back to the `cart_items` table.
3. **Database Scaffolding Update** (`supabase/migrations/20260804000000_init_schema.sql`):
   - Added the table schema for `cart_items` with appropriate foreign key relationships (`user_id` and `product_variant_id`), constraints (`quantity > 0`), and a unique constraint on `(user_id, product_variant_id)` to support correct and safe upsert merges.

## What was tested and test results
- **Unit and API tests** (`tests/cart.test.ts`):
  - Mocked `localStorage` and `window` dynamically using Vitest's `vi.hoisted` to handle ESM hoisting cleanly and prevent any warnings or errors.
  - Implemented mock handlers for Supabase SSR and fetch endpoints.
  - Added coverage for:
    - Adding new items to the store.
    - Adding existing items with quantity updates and stock level capping.
    - Removing items from the store.
    - Updating quantities with boundary limits (1 to stock available).
    - Clearing the cart.
    - Backend sync requests logic.
    - API endpoint responses for: unauthenticated access, invalid payloads, empty synchronizations, database fetch errors, database upsert errors, and correct database merging.
- **Verification results**:
  - `npm run test`: Passed (20/20 tests passing, clean console output).
  - `npm run typecheck`: Passed.
  - `npm run lint`: Passed (0 errors, 1 unrelated warning).
  - `npm run check` (Lint + Typecheck + Production Build): Passed.

## Files Changed
- `package.json` (modified: added `zustand`)
- `package-lock.json` (modified: locked `zustand` dependencies)
- `src/store/useCartStore.ts` (new)
- `src/app/api/cart/sync/route.ts` (new)
- `tests/cart.test.ts` (new)
- `supabase/migrations/20260804000000_init_schema.sql` (modified: appended `cart_items` table definition)

## Self-Review Findings
- Avoided using `any` across typescript types by utilizing type-safe castings like `unknown as SupabaseClient` and specific interface assertions for `global` and `global.window` objects.
- Handled edge cases: body parsing failures, empty arrays, invalid payloads, and database operation failures.

## Issues or Concerns
- None. The client store and server synchronizer compile, test, and build cleanly.

---

## Fixes Implemented (Code Review Feedback)

We successfully addressed all code review feedback points:
1. **Critical: Enabled Row Level Security (RLS) on `cart_items`**:
   - Enabled RLS on the `cart_items` table in `supabase/migrations/20260804000000_init_schema.sql` and added a policy for `SELECT`, `INSERT`, `UPDATE`, and `DELETE` restricting access to only instances where `auth.uid() = user_id`.
2. **Important: Handled Silent HTTP Failures on Client Sync**:
   - Updated `syncWithBackend` in `src/store/useCartStore.ts` to check `res.ok` and throw an error on HTTP failure status codes, alerting callers of any sync failures.
3. **Important: Added Server-side Input Validation**:
   - Restructured `/api/cart/sync/route.ts` to validate that all items have `quantity > 0` and a valid `variantId` before making any database queries, rejecting bad requests with a `400` status.
4. **Minor: Inconsistent Path Alias in Tests**:
   - Refactored relative path imports in `tests/cart.test.ts` to use standard `@/*` path aliases.
5. **Minor: Quantity Capping on Initial Add**:
   - Updated the initial add logic in `useCartStore.ts` to cap the quantity at `stockAvailable` when adding the item to the cart for the first time.
6. **Tests Added & Updated**:
   - Added unit test cases for the initial add quantity capping logic and server-side quantity validation.
   - All tests (22/22) pass successfully without any warnings.

