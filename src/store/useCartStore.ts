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
        return {
          items: [
            ...state.items,
            { ...item, quantity: Math.min(item.quantity, item.stockAvailable) },
          ],
        };
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
          const res = await fetch('/api/cart/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items }),
          });
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
        } catch (e) {
          console.error('Failed to sync cart', e);
          throw e;
        }
      },

    }),
    { name: 'pleatsssi-cart' }
  )
);
