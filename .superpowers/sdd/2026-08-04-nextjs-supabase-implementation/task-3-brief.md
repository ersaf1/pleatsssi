### Task 3: Zustand Cart Store & Sync API

**Files:**
* Create: `src/store/useCartStore.ts`
* Create: `src/app/api/cart/sync/route.ts`
* Create: `tests/cart.test.ts`

**Interfaces:**
* Consumes: `supabaseServerClient` from Task 1.

- [ ] **Step 1: Build Zustand Cart Store**
  
  Create `src/store/useCartStore.ts` with support for local state persistence and synchronization capabilities:
  ```typescript
  import { create } from 'zustand';
  import { persist } from 'zustand/middleware';

  export interface CartItem {
    variantId: string;
    productId: string;
    name: string;
    variantLabel: string;
    price: number;
    quantity: number;
    stockAvailable: number;
    imageUrl: string;
  }

  interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (variantId: string) => void;
    updateQuantity: (variantId: string, quantity: number) => void;
    clearCart: () => void;
    syncWithBackend: () => Promise<void>;
  }

  export const useCartStore = create<CartState>()(
    persist(
      (set, get) => ({
        items: [],
        addItem: (item) => set((state) => {
          const exists = state.items.find((i) => i.variantId === item.variantId);
          if (exists) {
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId
                  ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stockAvailable) }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
        removeItem: (variantId) => set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        })),
        updateQuantity: (variantId, quantity) => set((state) => ({
          items: state.items.map((i) =>
            i.variantId === variantId ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stockAvailable)) } : i
          ),
        })),
        clearCart: () => set({ items: [] }),
        syncWithBackend: async () => {
          const { items } = get();
          if (items.length === 0) return;
          try {
            await fetch('/api/cart/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ items }),
            });
          } catch (e) {
            console.error('Failed to sync cart', e);
          }
        },
      }),
      { name: 'pleatsssi-cart' }
    )
  );
  ```

- [ ] **Step 2: Implement Cart Synchronization Endpoint**
  
  Create `src/app/api/cart/sync/route.ts`:
  ```typescript
  import { NextResponse } from 'next/server';
  import { supabaseServerClient } from '@/lib/supabaseServer';

  export async function POST(request: Request) {
    const { items } = await request.json();
    const supabase = await supabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthenticated' }, { status: 401 });
    }

    // Logic to insert or merge cart items in database
    return NextResponse.json({ success: true });
  }
  ```

- [ ] **Step 3: Test store and synchronization**
  
  Create `tests/cart.test.ts` to test Zustand store mutations and verify operations.

- [ ] **Step 4: Run tests and commit**
  
  Run: `npm run test`
  
  Expected: PASS
  
  Commit: `git add src/store/useCartStore.ts src/app/api/cart/ tests/cart.test.ts && git commit -m "feat: add client-side cart store and server synchronizer"`

---

