import { expect, test, vi, describe, beforeEach } from 'vitest';
import { type SupabaseClient } from '@supabase/supabase-js';

// Use vi.hoisted to ensure localStorage mock is set up before store import is evaluated (due to ESM hoisting)
vi.hoisted(() => {
  const mockStore: Record<string, string> = {};
  (global as unknown as { __mockLocalStorage: Record<string, string> }).__mockLocalStorage = mockStore;
  
  const localStorageMock = {
    getItem: (key: string) => mockStore[key] || null,
    setItem: (key: string, value: string) => {
      mockStore[key] = value;
    },
    removeItem: (key: string) => {
      delete mockStore[key];
    },
    clear: () => {
      for (const key in mockStore) {
        delete mockStore[key];
      }
    },
    length: 0,
    key: () => '',
  };

  global.localStorage = localStorageMock;
  global.window = {
    localStorage: localStorageMock,
  } as unknown as Window & typeof globalThis;
});

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Import store, route handler, and Supabase client
import { useCartStore, type CartItem } from '../src/store/useCartStore';
import { POST as syncPOST } from '../src/app/api/cart/sync/route';
import { supabaseServerClient } from '../src/lib/supabaseServer';

// Mock supabaseServerClient
vi.mock('../src/lib/supabaseServer', () => ({
  supabaseServerClient: vi.fn(),
}));

describe('Cart Store & API Sync', () => {
  const mockGetUser = vi.fn();
  const mockSelect = vi.fn();
  const mockEq = vi.fn();
  const mockUpsert = vi.fn();

  const mockSupabase = {
    auth: {
      getUser: mockGetUser,
    },
    from: vi.fn().mockReturnValue({
      select: mockSelect,
      upsert: mockUpsert,
    }),
  };

  beforeEach(() => {
    // Reset Zustand store state
    useCartStore.getState().clearCart();
    // Clear localStorage mock
    const mockStore = (global as unknown as { __mockLocalStorage: Record<string, string> }).__mockLocalStorage;
    for (const key in mockStore) {
      delete mockStore[key];
    }
    // Clear all vitest mocks
    vi.clearAllMocks();
    
    // Set default mock implementations
    vi.mocked(supabaseServerClient).mockResolvedValue(mockSupabase as unknown as SupabaseClient);
    mockSelect.mockReturnValue({ eq: mockEq });
  });

  describe('Zustand Cart Store', () => {
    const itemA: CartItem = {
      variantId: 'var-a',
      productId: 'prod-1',
      name: 'Dress A',
      variantLabel: 'Black / S',
      price: 100000,
      quantity: 1,
      stockAvailable: 5,
      imageUrl: 'http://example.com/a.jpg',
    };

    const itemB: CartItem = {
      variantId: 'var-b',
      productId: 'prod-2',
      name: 'Dress B',
      variantLabel: 'White / M',
      price: 150000,
      quantity: 2,
      stockAvailable: 3,
      imageUrl: 'http://example.com/b.jpg',
    };

    test('addItem adds a new item', () => {
      useCartStore.getState().addItem(itemA);
      expect(useCartStore.getState().items).toEqual([itemA]);
    });

    test('addItem increments quantity if variant already exists, capped at stockAvailable', () => {
      useCartStore.getState().addItem(itemA);
      
      // Add same item with quantity 2 (total 3)
      useCartStore.getState().addItem({ ...itemA, quantity: 2 });
      expect(useCartStore.getState().items[0].quantity).toBe(3);

      // Add another 3 items (total 6, but capped at stockAvailable = 5)
      useCartStore.getState().addItem({ ...itemA, quantity: 3 });
      expect(useCartStore.getState().items[0].quantity).toBe(5);
    });

    test('removeItem removes an item by variantId', () => {
      useCartStore.getState().addItem(itemA);
      useCartStore.getState().addItem(itemB);
      expect(useCartStore.getState().items.length).toBe(2);

      useCartStore.getState().removeItem('var-a');
      expect(useCartStore.getState().items).toEqual([itemB]);
    });

    test('updateQuantity updates quantity, keeping it between 1 and stockAvailable', () => {
      useCartStore.getState().addItem(itemA);

      // Update to 3 (valid)
      useCartStore.getState().updateQuantity('var-a', 3);
      expect(useCartStore.getState().items[0].quantity).toBe(3);

      // Update to 10 (exceeds stockAvailable = 5, caps at 5)
      useCartStore.getState().updateQuantity('var-a', 10);
      expect(useCartStore.getState().items[0].quantity).toBe(5);

      // Update to 0 (below 1, floor at 1)
      useCartStore.getState().updateQuantity('var-a', 0);
      expect(useCartStore.getState().items[0].quantity).toBe(1);
    });

    test('clearCart empties the cart items', () => {
      useCartStore.getState().addItem(itemA);
      useCartStore.getState().addItem(itemB);
      useCartStore.getState().clearCart();
      expect(useCartStore.getState().items).toEqual([]);
    });

    test('syncWithBackend makes POST request with items', async () => {
      useCartStore.getState().addItem(itemA);
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      await useCartStore.getState().syncWithBackend();

      expect(mockFetch).toHaveBeenCalledWith('/api/cart/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [itemA] }),
      });
    });

    test('syncWithBackend does not make request if cart is empty', async () => {
      await useCartStore.getState().syncWithBackend();
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/cart/sync API Endpoint', () => {
    const guestItems = [
      {
        variantId: 'var-1',
        productId: 'prod-1',
        name: 'Dress 1',
        variantLabel: 'Red / S',
        price: 200000,
        quantity: 2,
        stockAvailable: 10,
        imageUrl: 'image.jpg',
      },
      {
        variantId: 'var-2',
        productId: 'prod-2',
        name: 'Dress 2',
        variantLabel: 'Blue / M',
        price: 250000,
        quantity: 1,
        stockAvailable: 5,
        imageUrl: 'image.jpg',
      },
    ];

    test('returns 401 if unauthenticated', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: new Error('User not found') });

      const req = new Request('http://localhost/api/cart/sync', {
        method: 'POST',
        body: JSON.stringify({ items: guestItems }),
      });

      const response = await syncPOST(req);
      expect(response.status).toBe(401);
      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.message).toBe('Unauthenticated');
    });

    test('returns 400 if items is not an array', async () => {
      const req = new Request('http://localhost/api/cart/sync', {
        method: 'POST',
        body: JSON.stringify({ items: 'not-an-array' }),
      });

      const response = await syncPOST(req);
      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.message).toContain('items must be an array');
    });

    test('returns 200 early if items array is empty', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-id-123' } }, error: null });

      const req = new Request('http://localhost/api/cart/sync', {
        method: 'POST',
        body: JSON.stringify({ items: [] }),
      });

      const response = await syncPOST(req);
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.message).toBe('No items to sync');
      expect(mockSupabase.from).not.toHaveBeenCalled();
    });

    test('returns 400 if fetching database cart fails', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-id-123' } }, error: null });
      mockEq.mockResolvedValue({ data: null, error: { message: 'Database fetch error' } });

      const req = new Request('http://localhost/api/cart/sync', {
        method: 'POST',
        body: JSON.stringify({ items: guestItems }),
      });

      const response = await syncPOST(req);
      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.message).toBe('Database fetch error');
    });

    test('successfully merges guest cart items with DB cart items and upserts them', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-id-123' } }, error: null });
      
      // Database already has: var-1 with quantity 3, var-3 with quantity 1
      mockEq.mockResolvedValue({
        data: [
          { product_variant_id: 'var-1', quantity: 3 },
          { product_variant_id: 'var-3', quantity: 1 },
        ],
        error: null,
      });

      mockUpsert.mockResolvedValue({ error: null });

      const req = new Request('http://localhost/api/cart/sync', {
        method: 'POST',
        body: JSON.stringify({ items: guestItems }),
      });

      const response = await syncPOST(req);
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.success).toBe(true);

      // Expected merged result:
      // var-1: DB quantity 3 + guest quantity 2 = 5
      // var-2: guest quantity 1
      // var-3: DB quantity 1 (preserved)
      expect(mockUpsert).toHaveBeenCalledWith(
        [
          { user_id: 'user-id-123', product_variant_id: 'var-1', quantity: 5 },
          { user_id: 'user-id-123', product_variant_id: 'var-3', quantity: 1 },
          { user_id: 'user-id-123', product_variant_id: 'var-2', quantity: 1 },
        ],
        { onConflict: 'user_id,product_variant_id' }
      );
    });

    test('returns 400 if upserting merged items fails', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-id-123' } }, error: null });
      mockEq.mockResolvedValue({ data: [], error: null });
      mockUpsert.mockResolvedValue({ error: { message: 'Database upsert error' } });

      const req = new Request('http://localhost/api/cart/sync', {
        method: 'POST',
        body: JSON.stringify({ items: guestItems }),
      });

      const response = await syncPOST(req);
      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.message).toBe('Database upsert error');
    });
  });
});
