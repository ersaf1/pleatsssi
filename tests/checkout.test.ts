import { expect, test, vi, describe, beforeEach } from 'vitest';
import { type SupabaseClient } from '@supabase/supabase-js';
import { POST as checkoutPOST } from '@/app/api/checkout/route';
import { supabaseServerClient } from '@/lib/supabaseServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { snap } from '@/lib/midtrans';

// Mock supabaseServerClient
vi.mock('@/lib/supabaseServer', () => ({
  supabaseServerClient: vi.fn(),
}));

// Mock supabaseAdmin client
vi.mock('@/lib/supabaseAdmin', () => ({
  supabaseAdmin: {
    rpc: vi.fn(),
  },
}));

// Mock Midtrans snap client
vi.mock('@/lib/midtrans', () => ({
  snap: {
    createTransaction: vi.fn(),
  },
}));

describe('Checkout API Endpoint', () => {
  const mockGetUser = vi.fn();
  const mockIn = vi.fn();
  const mockSingle = vi.fn();
  const mockEq = vi.fn();
  const mockInsert = vi.fn();

  const mockSupabase = {
    auth: {
      getUser: mockGetUser,
    },
    from: vi.fn().mockImplementation((table: string) => {
      if (table === 'product_variants') {
        return {
          select: vi.fn().mockReturnValue({
            in: mockIn,
          }),
        };
      }
      if (table === 'orders') {
        return {
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: mockSingle,
            }),
          }),
          delete: vi.fn().mockReturnValue({
            eq: mockEq,
          }),
        };
      }
      if (table === 'order_items' || table === 'payments') {
        return {
          insert: mockInsert,
        };
      }
      return {};
    }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(supabaseAdmin.rpc).mockResolvedValue({ error: null });
    vi.mocked(supabaseServerClient).mockResolvedValue(mockSupabase as unknown as SupabaseClient);
  });

  const validItems = [
    {
      variantId: 'var-1',
      name: 'Client Item Name (Ignored)',
      variantLabel: 'Client Label (Ignored)',
      price: 999999, // Manipulated price
      quantity: 2,
    },
  ];

  test('returns 401 if unauthenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: new Error('User not found') });

    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify({
        addressId: 'addr-1',
        courier: 'jne',
        items: validItems,
      }),
    });

    const response = await checkoutPOST(req);
    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe('Unauthenticated');
  });

  test('returns 400 if addressId is missing or empty', async () => {
    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify({
        addressId: '   ',
        courier: 'jne',
        items: validItems,
      }),
    });

    const response = await checkoutPOST(req);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.message).toContain('addressId must be a non-empty string');
  });

  test('returns 400 if courier is missing or empty', async () => {
    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify({
        addressId: 'addr-1',
        courier: '',
        items: validItems,
      }),
    });

    const response = await checkoutPOST(req);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.message).toContain('courier must be a non-empty string');
  });

  test('returns 400 if items is not an array or empty', async () => {
    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify({
        addressId: 'addr-1',
        courier: 'jne',
        items: [],
      }),
    });

    const response = await checkoutPOST(req);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.message).toContain('items must be a non-empty array');
  });

  test('returns 400 if items list contains invalid variantId or quantity', async () => {
    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify({
        addressId: 'addr-1',
        courier: 'jne',
        items: [
          {
            variantId: '',
            quantity: 2,
          },
        ],
      }),
    });

    const response = await checkoutPOST(req);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.message).toContain('each item must have a valid variantId');
  });

  test('returns 400 if variants fetch fails', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1', email: 'user@example.com' } }, error: null });
    mockIn.mockResolvedValue({ data: null, error: { message: 'Database fetch error' } });

    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify({
        addressId: 'addr-1',
        courier: 'jne',
        items: validItems,
      }),
    });

    const response = await checkoutPOST(req);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe('Database fetch error');
  });

  test('returns 400 if variant is not found in database', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1', email: 'user@example.com' } }, error: null });
    mockIn.mockResolvedValue({ data: [], error: null }); // No variants returned

    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify({
        addressId: 'addr-1',
        courier: 'jne',
        items: validItems,
      }),
    });

    const response = await checkoutPOST(req);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.message).toContain('Variant var-1 not found');
  });

  test('returns 400 if stock is insufficient', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1', email: 'user@example.com' } }, error: null });
    // Variant stock is 1, but we requested quantity 2
    mockIn.mockResolvedValue({
      data: [{ id: 'var-1', stock: 1, sku: 'SKU-001', color: 'Red', size: 'S', products: { price: 100000, discount: 0, name: 'Item 1' } }],
      error: null,
    });

    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify({
        addressId: 'addr-1',
        courier: 'jne',
        items: validItems,
      }),
    });

    const response = await checkoutPOST(req);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.message).toContain('Insufficient stock for SKU SKU-001');
  });

  test('returns 400 if aggregated stock check fails due to duplicate items', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1', email: 'user@example.com' } }, error: null });
    // Variant stock is 3. We request 2 separate entries of quantity 2 each (total 4).
    mockIn.mockResolvedValue({
      data: [{ id: 'var-1', stock: 3, sku: 'SKU-001', color: 'Red', size: 'S', products: { price: 100000, discount: 0, name: 'Item 1' } }],
      error: null,
    });

    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify({
        addressId: 'addr-1',
        courier: 'jne',
        items: [
          { variantId: 'var-1', quantity: 2 },
          { variantId: 'var-1', quantity: 2 },
        ],
      }),
    });

    const response = await checkoutPOST(req);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.message).toContain('Insufficient stock for SKU SKU-001');
  });

  test('returns 400 if order creation fails', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1', email: 'user@example.com' } }, error: null });
    mockIn.mockResolvedValue({
      data: [{ id: 'var-1', stock: 10, sku: 'SKU-001', color: 'Red', size: 'S', products: { price: 100000, discount: 0, name: 'Item 1' } }],
      error: null,
    });
    mockSingle.mockResolvedValue({ data: null, error: { message: 'Order insert failure' } });

    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify({
        addressId: 'addr-1',
        courier: 'jne',
        items: validItems,
      }),
    });

    const response = await checkoutPOST(req);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe('Order insert failure');
  });

  test('returns 400 and cleans up order if order_items insert fails', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1', email: 'user@example.com' } }, error: null });
    mockIn.mockResolvedValue({
      data: [{ id: 'var-1', stock: 10, sku: 'SKU-001', color: 'Red', size: 'S', products: { price: 100000, discount: 0, name: 'Item 1' } }],
      error: null,
    });
    mockSingle.mockResolvedValue({ data: { id: 'order-123' }, error: null });
    mockInsert.mockResolvedValueOnce({ error: { message: 'Order items insert failure' } }); // first call is order_items insert
    mockEq.mockResolvedValue({ data: null, error: null }); // order deletion cleanup success

    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify({
        addressId: 'addr-1',
        courier: 'jne',
        items: validItems,
      }),
    });

    const response = await checkoutPOST(req);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe('Order items insert failure');
    expect(mockEq).toHaveBeenCalledWith('id', 'order-123');
  });

  test('returns 500 and cleans up order if Midtrans Snap transaction fails', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1', email: 'user@example.com' } }, error: null });
    mockIn.mockResolvedValue({
      data: [{ id: 'var-1', stock: 10, sku: 'SKU-001', color: 'Red', size: 'S', products: { price: 100000, discount: 0, name: 'Item 1' } }],
      error: null,
    });
    mockSingle.mockResolvedValue({ data: { id: 'order-123' }, error: null });
    mockInsert.mockResolvedValueOnce({ error: null }); // order_items insert success
    vi.mocked(snap.createTransaction).mockRejectedValue(new Error('Midtrans API Timeout'));
    mockEq.mockResolvedValue({ data: null, error: null }); // order deletion cleanup success

    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify({
        addressId: 'addr-1',
        courier: 'jne',
        items: validItems,
      }),
    });

    const response = await checkoutPOST(req);
    expect(response.status).toBe(500);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe('Midtrans API Timeout');
    expect(mockEq).toHaveBeenCalledWith('id', 'order-123');
  });

  test('returns 400 and cleans up order if payments insert fails', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1', email: 'user@example.com' } }, error: null });
    mockIn.mockResolvedValue({
      data: [{ id: 'var-1', stock: 10, sku: 'SKU-001', color: 'Red', size: 'S', products: { price: 100000, discount: 0, name: 'Item 1' } }],
      error: null,
    });
    mockSingle.mockResolvedValue({ data: { id: 'order-123' }, error: null });
    mockInsert
      .mockResolvedValueOnce({ error: null }) // order_items insert success
      .mockResolvedValueOnce({ error: { message: 'Payments insert failure' } }); // payments insert failure
    vi.mocked(snap.createTransaction).mockResolvedValue({ token: 'snap-token', redirect_url: 'http://redirect' });
    mockEq.mockResolvedValue({ data: null, error: null }); // order deletion cleanup success

    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify({
        addressId: 'addr-1',
        courier: 'jne',
        items: validItems,
      }),
    });

    const response = await checkoutPOST(req);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe('Payments insert failure');
    expect(mockEq).toHaveBeenCalledWith('id', 'order-123');
  });

  test('successful checkout flow secures price, name, and label from database', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1', email: 'user@example.com' } }, error: null });
    
    // DB has price 100,000 and 10% discount -> secure price is 90,000.
    // Database name is 'Secure Item 1', color is 'Black', size is 'M'.
    mockIn.mockResolvedValue({
      data: [{ id: 'var-1', stock: 10, sku: 'SKU-001', color: 'Black', size: 'M', products: { price: 100000, discount: 10, name: 'Secure Item 1' } }],
      error: null,
    });
    mockSingle.mockResolvedValue({ data: { id: 'order-123' }, error: null });
    mockInsert
      .mockResolvedValueOnce({ error: null }) // order_items insert success
      .mockResolvedValueOnce({ error: null }); // payments insert success
    vi.mocked(snap.createTransaction).mockResolvedValue({ token: 'snap-token-123', redirect_url: 'http://redirect-url-123' });

    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify({
        addressId: 'addr-1',
        courier: 'jne',
        items: validItems, // client payload claims price is 999999 and name is 'Client Item Name (Ignored)'
      }),
    });

    const response = await checkoutPOST(req);
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.token).toBe('snap-token-123');
    expect(json.redirectUrl).toBe('http://redirect-url-123');

    // Verify orders insertion called with secure calculated total (90,000 * 2 = 180,000)
    const mockFrom = mockSupabase.from;
    const ordersInsertCall = vi.mocked(mockFrom).mock.calls.find(call => call[0] === 'orders');
    expect(ordersInsertCall).toBeDefined();

    // Verify order_items insertion uses secure database attributes
    const itemsInsertCall = vi.mocked(mockFrom).mock.calls.find(call => call[0] === 'order_items');
    expect(itemsInsertCall).toBeDefined();
    expect(mockInsert).toHaveBeenNthCalledWith(1, [
      {
        order_id: 'order-123',
        product_variant_id: 'var-1',
        product_name: 'Secure Item 1',
        variant_label: 'Black / M',
        price: 90000,
        quantity: 2,
        subtotal: 180000,
      },
    ]);
  });
});
