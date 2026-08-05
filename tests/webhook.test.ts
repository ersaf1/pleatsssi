/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, test, vi, describe, beforeEach, afterEach } from 'vitest';
import crypto from 'crypto';
import { POST as webhookPOST } from '@/app/api/webhooks/midtrans/route';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Mock supabaseAdmin client
vi.mock('@/lib/supabaseAdmin', () => ({
  supabaseAdmin: {
    rpc: vi.fn(),
    from: vi.fn(),
  },
}));

describe('Midtrans Webhook Payment Status Handler', () => {
  const originalServerKey = process.env.MIDTRANS_SERVER_KEY;

  // Mock functions for Supabase queries
  const mockSingleOrder = vi.fn();
  const mockUpdate = vi.fn();
  const mockSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.MIDTRANS_SERVER_KEY = 'test_server_key';

    // Mock supabaseAdmin.rpc default return
    vi.mocked(supabaseAdmin.rpc).mockResolvedValue({ error: null });

    // Mock supabaseAdmin.from
    vi.mocked(supabaseAdmin.from).mockImplementation((table: string) => {
      if (table === 'orders') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: mockSingleOrder,
            }),
          }),
          update: mockUpdate,
        } as any;
      }
      if (table === 'payments') {
        return {
          update: mockUpdate,
        } as any;
      }
      if (table === 'order_items') {
        return {
          select: vi.fn().mockReturnValue({
            eq: mockSelect,
          }),
        } as any;
      }
      return {} as any;
    });

    // Default mock response setups
    mockUpdate.mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) });
  });

  afterEach(() => {
    process.env.MIDTRANS_SERVER_KEY = originalServerKey;
  });

  // Helper to generate a valid signature key for tests
  function generateSignature(orderId: string, statusCode: string, grossAmount: string, serverKey: string): string {
    return crypto
      .createHash('sha512')
      .update(orderId + statusCode + grossAmount + serverKey)
      .digest('hex');
  }

  test('returns 400 if required payload parameters are missing', async () => {
    const req = new Request('http://localhost/api/webhooks/midtrans', {
      method: 'POST',
      body: JSON.stringify({
        order_id: 'PLT-12345',
      }),
    });

    const response = await webhookPOST(req);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.message).toContain('Missing required payload parameters');
  });

  test('returns 500 if MIDTRANS_SERVER_KEY is not defined', async () => {
    delete process.env.MIDTRANS_SERVER_KEY;

    const payload = {
      order_id: 'PLT-12345',
      status_code: '200',
      gross_amount: '150000.00',
      signature_key: 'dummy',
      transaction_status: 'settlement',
    };

    const req = new Request('http://localhost/api/webhooks/midtrans', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const response = await webhookPOST(req);
    expect(response.status).toBe(500);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.message).toContain('MIDTRANS_SERVER_KEY is not defined');
  });

  test('returns 403 if signature is invalid', async () => {
    const payload = {
      order_id: 'PLT-12345',
      status_code: '200',
      gross_amount: '150000.00',
      signature_key: 'wrong_signature_hash',
      transaction_status: 'settlement',
    };

    const req = new Request('http://localhost/api/webhooks/midtrans', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const response = await webhookPOST(req);
    expect(response.status).toBe(403);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe('Invalid Signature');
  });

  test('returns 404 if order is not found in database', async () => {
    const signature = generateSignature('PLT-12345', '200', '150000.00', 'test_server_key');
    const payload = {
      order_id: 'PLT-12345',
      status_code: '200',
      gross_amount: '150000.00',
      signature_key: signature,
      transaction_status: 'settlement',
    };

    // Mock order fetch returning order not found
    mockSingleOrder.mockResolvedValueOnce({ data: null, error: { message: 'Order not found' } });

    const req = new Request('http://localhost/api/webhooks/midtrans', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const response = await webhookPOST(req);
    expect(response.status).toBe(404);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe('Order not found');
  });

  test('successfully processes payment settlement, updates order/payment statuses, and leaves stock unchanged', async () => {
    const orderNumber = 'PLT-SUCCESS-123';
    const grossAmount = '180000.00';
    const signature = generateSignature(orderNumber, '200', grossAmount, 'test_server_key');
    const payload = {
      order_id: orderNumber,
      status_code: '200',
      gross_amount: grossAmount,
      signature_key: signature,
      transaction_status: 'settlement',
      payment_type: 'bank_transfer',
      transaction_id: 'midtrans-tx-999',
    };

    // Mock Order query (currently 'pending' status)
    mockSingleOrder.mockResolvedValueOnce({
      data: { id: 'order-uuid-1', status: 'pending', payment_status: 'pending' },
      error: null,
    });

    const mockOrderEq = vi.fn().mockResolvedValue({ error: null });
    const mockPaymentEq = vi.fn().mockResolvedValue({ error: null });

    mockUpdate.mockImplementation((fields: { status?: string }) => {
      // If updating orders table
      if (fields.status === 'processing') {
        return { eq: mockOrderEq } as any;
      }
      // If updating payments table
      if (fields.status === 'settlement') {
        return { eq: mockPaymentEq } as any;
      }
      return { eq: vi.fn().mockResolvedValue({ error: null }) } as any;
    });

    const req = new Request('http://localhost/api/webhooks/midtrans', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const response = await webhookPOST(req);
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.success).toBe(true);

    // Verify order table update: status -> processing, payment_status -> paid
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'processing',
        payment_status: 'paid',
      })
    );
    expect(mockOrderEq).toHaveBeenCalledWith('id', 'order-uuid-1');

    // Verify payment table update
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'settlement',
        payment_method: 'bank_transfer',
        midtrans_transaction_id: 'midtrans-tx-999',
        raw_payload: payload,
      })
    );
    expect(mockPaymentEq).toHaveBeenCalledWith('order_id', 'order-uuid-1');

    // Verify stock release is NOT queried (since status didn't change to cancelled)
    const orderItemsFetch = vi.mocked(supabaseAdmin.from).mock.calls.some(call => call[0] === 'order_items');
    expect(orderItemsFetch).toBe(false);
  });

  test('restores variant stock levels via atomic RPC if order transitions to cancelled status', async () => {
    const orderNumber = 'PLT-CANCEL-123';
    const grossAmount = '250000.00';
    const signature = generateSignature(orderNumber, '407', grossAmount, 'test_server_key');
    const payload = {
      order_id: orderNumber,
      status_code: '407',
      gross_amount: grossAmount,
      signature_key: signature,
      transaction_status: 'cancel',
      payment_type: 'gopay',
      transaction_id: 'midtrans-tx-cancel',
    };

    // 1. Mock Order query (currently 'pending' status)
    mockSingleOrder.mockResolvedValueOnce({
      data: { id: 'order-uuid-2', status: 'pending', payment_status: 'pending' },
      error: null,
    });

    // 2. Mock order items query returning 2 items
    mockSelect.mockResolvedValueOnce({
      data: [
        { product_variant_id: 'var-1', quantity: 2 },
        { product_variant_id: 'var-2', quantity: 1 },
      ],
      error: null,
    });

    const req = new Request('http://localhost/api/webhooks/midtrans', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const response = await webhookPOST(req);
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.success).toBe(true);

    // Verify orders updated to cancelled/failed
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'cancelled',
        payment_status: 'failed',
      })
    );

    // Verify payments updated
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'cancel',
        payment_method: 'gopay',
      })
    );

    // Verify atomic RPC stock increments were called
    expect(supabaseAdmin.rpc).toHaveBeenCalledWith('adjust_variant_stock', {
      variant_id: 'var-1',
      qty: 2,
    });
    expect(supabaseAdmin.rpc).toHaveBeenCalledWith('adjust_variant_stock', {
      variant_id: 'var-2',
      qty: 1,
    });
  });

  test('does not restore stock levels if order was already cancelled', async () => {
    const orderNumber = 'PLT-ALREADY-CANCELLED';
    const grossAmount = '120000.00';
    const signature = generateSignature(orderNumber, '407', grossAmount, 'test_server_key');
    const payload = {
      order_id: orderNumber,
      status_code: '407',
      gross_amount: grossAmount,
      signature_key: signature,
      transaction_status: 'cancel',
      payment_type: 'gopay',
      transaction_id: 'midtrans-tx-already',
    };

    // Mock Order query (already 'cancelled' status)
    mockSingleOrder.mockResolvedValueOnce({
      data: { id: 'order-uuid-3', status: 'cancelled', payment_status: 'failed' },
      error: null,
    });

    const req = new Request('http://localhost/api/webhooks/midtrans', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const response = await webhookPOST(req);
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.success).toBe(true);

    // Verify order_items query is NOT called (since status was already cancelled)
    const orderItemsFetch = vi.mocked(supabaseAdmin.from).mock.calls.some(call => call[0] === 'order_items');
    expect(orderItemsFetch).toBe(false);
  });
});
