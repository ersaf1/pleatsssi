import { supabaseBrowserClient } from '../supabaseClient';
import { isSupabaseConfigured, withTimeout } from './serviceUtils';

export interface ShippingAddress {
  recipient_name?: string;
  phone_number?: string;
  address_line1?: string;
  address_line2?: string;
  district?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  notes?: string;
  [key: string]: unknown;
}

export interface AdminOrderItem {
  id: string;
  order_id: string;
  product_variant_id: string;
  product_name: string;
  variant_label: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface AdminPayment {
  id: string;
  order_id: string;
  snap_token?: string | null;
  payment_method?: string | null;
  midtrans_transaction_id?: string | null;
  status: string;
  gross_amount: number;
  paid_at?: string | null;
  created_at?: string;
}

export interface AdminOrder {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'expired' | 'refunded';
  subtotal: number;
  discount_amount: number;
  shipping_cost: number;
  total: number;
  coupon_id?: string | null;
  shipping_address: ShippingAddress;
  courier?: string | null;
  tracking_number?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  order_items?: AdminOrderItem[];
  payments?: AdminPayment | null;
}

export interface UpdateOrderFulfillmentInput {
  status?: AdminOrder['status'];
  payment_status?: AdminOrder['payment_status'];
  courier?: string | null;
  tracking_number?: string | null;
  notes?: string | null;
}

export const MOCK_ORDERS: AdminOrder[] = [
  {
    id: 'ord-1001-mock-uuid-0001',
    user_id: 'usr-0001-mock-uuid-0001',
    order_number: 'ORD-20260806-001',
    status: 'processing',
    payment_status: 'paid',
    subtotal: 550000,
    discount_amount: 50000,
    shipping_cost: 20000,
    total: 520000,
    shipping_address: {
      recipient_name: 'Siti Rahmawati',
      phone_number: '081234567890',
      address_line1: 'Jl. Sudirman No. 45, Kebayoran Baru',
      city: 'Jakarta Selatan',
      province: 'DKI Jakarta',
      postal_code: '12190',
      notes: 'Titip di sekuriti jika rumah kosong',
    },
    courier: 'JNE Reguler',
    tracking_number: 'JNE8892019482',
    notes: 'Pembayaran terkonfirmasi via Midtrans Bank Transfer.',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 3600000).toISOString(),
    order_items: [
      {
        id: 'item-101',
        order_id: 'ord-1001-mock-uuid-0001',
        product_variant_id: 'var-101',
        product_name: 'AGATE SKIRT',
        variant_label: 'Classic Black / Free Size',
        price: 350000,
        quantity: 1,
        subtotal: 350000,
      },
      {
        id: 'item-102',
        order_id: 'ord-1001-mock-uuid-0001',
        product_variant_id: 'var-102',
        product_name: 'PLEATED TOP',
        variant_label: 'Ivory White / Free Size',
        price: 200000,
        quantity: 1,
        subtotal: 200000,
      },
    ],
    payments: {
      id: 'pay-101',
      order_id: 'ord-1001-mock-uuid-0001',
      snap_token: 'snap-token-mock-001',
      payment_method: 'bank_transfer_bca',
      midtrans_transaction_id: 'TRX-MIDTRANS-99201',
      status: 'settlement',
      gross_amount: 520000,
      paid_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
  },
  {
    id: 'ord-1002-mock-uuid-0002',
    user_id: 'usr-0002-mock-uuid-0002',
    order_number: 'ORD-20260806-002',
    status: 'shipped',
    payment_status: 'paid',
    subtotal: 420000,
    discount_amount: 0,
    shipping_cost: 15000,
    total: 435000,
    shipping_address: {
      recipient_name: 'Budi Santoso',
      phone_number: '085698765432',
      address_line1: 'Jl. Dago No. 120',
      city: 'Bandung',
      province: 'Jawa Barat',
      postal_code: '40132',
    },
    courier: 'SiCepat BEST',
    tracking_number: '003928174920',
    notes: 'Resi diinput oleh admin.',
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    order_items: [
      {
        id: 'item-103',
        order_id: 'ord-1002-mock-uuid-0002',
        product_variant_id: 'var-103',
        product_name: 'LOTUS PLEATED PANTS',
        variant_label: 'Sage Green / All Size',
        price: 420000,
        quantity: 1,
        subtotal: 420000,
      },
    ],
    payments: {
      id: 'pay-102',
      order_id: 'ord-1002-mock-uuid-0002',
      snap_token: 'snap-token-mock-002',
      payment_method: 'gopay',
      midtrans_transaction_id: 'TRX-MIDTRANS-99202',
      status: 'settlement',
      gross_amount: 435000,
      paid_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    },
  },
  {
    id: 'ord-1003-mock-uuid-0003',
    user_id: 'usr-0003-mock-uuid-0003',
    order_number: 'ORD-20260806-003',
    status: 'pending',
    payment_status: 'pending',
    subtotal: 280000,
    discount_amount: 0,
    shipping_cost: 25000,
    total: 305000,
    shipping_address: {
      recipient_name: 'Anita Wijaya',
      phone_number: '081901234567',
      address_line1: 'Jl. Pemuda No. 88',
      city: 'Surabaya',
      province: 'Jawa Timur',
      postal_code: '60271',
    },
    courier: null,
    tracking_number: null,
    notes: 'Menunggu konfirmasi pembayaran.',
    created_at: new Date(Date.now() - 1 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 3600000).toISOString(),
    order_items: [
      {
        id: 'item-104',
        order_id: 'ord-1003-mock-uuid-0003',
        product_variant_id: 'var-104',
        product_name: 'AURORA WRAP SKIRT',
        variant_label: 'Dusty Pink / Free Size',
        price: 280000,
        quantity: 1,
        subtotal: 280000,
      },
    ],
    payments: null,
  },
];

export async function getAdminOrders(): Promise<AdminOrder[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_ORDERS;
  }

  try {
    const { data, error } = await withTimeout(
      supabaseBrowserClient
        .from('orders')
        .select(`
          *,
          order_items (*),
          payments (*)
        `)
        .order('created_at', { ascending: false })
    );

    if (error || !data) {
      return MOCK_ORDERS;
    }

    const formatted: AdminOrder[] = data.map((ord) => {
      const pmts = Array.isArray(ord.payments) ? ord.payments[0] : ord.payments;
      return {
        id: ord.id,
        user_id: ord.user_id,
        order_number: ord.order_number,
        status: ord.status,
        payment_status: ord.payment_status,
        subtotal: Number(ord.subtotal),
        discount_amount: Number(ord.discount_amount || 0),
        shipping_cost: Number(ord.shipping_cost || 0),
        total: Number(ord.total),
        coupon_id: ord.coupon_id ?? null,
        shipping_address: typeof ord.shipping_address === 'string' ? JSON.parse(ord.shipping_address) : ord.shipping_address || {},
        courier: ord.courier ?? null,
        tracking_number: ord.tracking_number ?? null,
        notes: ord.notes ?? null,
        created_at: ord.created_at,
        updated_at: ord.updated_at,
        order_items: Array.isArray(ord.order_items)
          ? ord.order_items.map((item: Record<string, unknown>) => ({
              id: String(item.id),
              order_id: String(item.order_id),
              product_variant_id: String(item.product_variant_id),
              product_name: String(item.product_name),
              variant_label: String(item.variant_label),
              price: Number(item.price),
              quantity: Number(item.quantity),
              subtotal: Number(item.subtotal),
            }))
          : [],
        payments: pmts
          ? {
              id: pmts.id,
              order_id: pmts.order_id,
              snap_token: pmts.snap_token ?? null,
              payment_method: pmts.payment_method ?? null,
              midtrans_transaction_id: pmts.midtrans_transaction_id ?? null,
              status: pmts.status,
              gross_amount: Number(pmts.gross_amount),
              paid_at: pmts.paid_at ?? null,
              created_at: pmts.created_at,
            }
          : null,
      };
    });

    return formatted;
  } catch {
    return MOCK_ORDERS;
  }
}

export async function updateOrderFulfillment(
  id: string,
  input: UpdateOrderFulfillmentInput
): Promise<{ data: AdminOrder | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'Supabase is not configured.' };
  }

  try {
    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (input.status !== undefined) updatePayload.status = input.status;
    if (input.payment_status !== undefined) updatePayload.payment_status = input.payment_status;

    // Preserve options clearing behavior: explicit null for optional fields courier, tracking_number, notes
    if (input.courier !== undefined) {
      updatePayload.courier = input.courier && input.courier.trim() ? input.courier.trim() : null;
    }
    if (input.tracking_number !== undefined) {
      updatePayload.tracking_number = input.tracking_number && input.tracking_number.trim() ? input.tracking_number.trim() : null;
    }
    if (input.notes !== undefined) {
      updatePayload.notes = input.notes && input.notes.trim() ? input.notes.trim() : null;
    }

    const { data: updatedOrd, error: ordErr } = await supabaseBrowserClient
      .from('orders')
      .update(updatePayload)
      .eq('id', id)
      .select(`
        *,
        order_items (*),
        payments (*)
      `)
      .single();

    if (ordErr || !updatedOrd) {
      return { data: null, error: ordErr?.message || 'Failed to update order.' };
    }

    // Sync payments status if payment_status changed and payments record exists
    if (input.payment_status !== undefined) {
      const pmtStatusMap: Record<string, string> = {
        paid: 'settlement',
        pending: 'pending',
        failed: 'deny',
        expired: 'expire',
        refunded: 'refund',
      };

      const mappedStatus = pmtStatusMap[input.payment_status] || input.payment_status;
      await supabaseBrowserClient
        .from('payments')
        .update({
          status: mappedStatus,
          updated_at: new Date().toISOString(),
          paid_at: input.payment_status === 'paid' ? new Date().toISOString() : undefined,
        })
        .eq('order_id', id);
    }

    const pmts = Array.isArray(updatedOrd.payments) ? updatedOrd.payments[0] : updatedOrd.payments;
    const formatted: AdminOrder = {
      id: updatedOrd.id,
      user_id: updatedOrd.user_id,
      order_number: updatedOrd.order_number,
      status: updatedOrd.status,
      payment_status: updatedOrd.payment_status,
      subtotal: Number(updatedOrd.subtotal),
      discount_amount: Number(updatedOrd.discount_amount || 0),
      shipping_cost: Number(updatedOrd.shipping_cost || 0),
      total: Number(updatedOrd.total),
      coupon_id: updatedOrd.coupon_id ?? null,
      shipping_address: typeof updatedOrd.shipping_address === 'string' ? JSON.parse(updatedOrd.shipping_address) : updatedOrd.shipping_address || {},
      courier: updatedOrd.courier ?? null,
      tracking_number: updatedOrd.tracking_number ?? null,
      notes: updatedOrd.notes ?? null,
      created_at: updatedOrd.created_at,
      updated_at: updatedOrd.updated_at,
      order_items: Array.isArray(updatedOrd.order_items)
        ? updatedOrd.order_items.map((item: Record<string, unknown>) => ({
            id: String(item.id),
            order_id: String(item.order_id),
            product_variant_id: String(item.product_variant_id),
            product_name: String(item.product_name),
            variant_label: String(item.variant_label),
            price: Number(item.price),
            quantity: Number(item.quantity),
            subtotal: Number(item.subtotal),
          }))
        : [],
      payments: pmts
        ? {
            id: pmts.id,
            order_id: pmts.order_id,
            snap_token: pmts.snap_token ?? null,
            payment_method: pmts.payment_method ?? null,
            midtrans_transaction_id: pmts.midtrans_transaction_id ?? null,
            status: pmts.status,
            gross_amount: Number(pmts.gross_amount),
            paid_at: pmts.paid_at ?? null,
            created_at: pmts.created_at,
          }
        : null,
    };

    return { data: formatted, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update order.';
    return { data: null, error: msg };
  }
}

export async function deleteOrder(id: string): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase is not configured.' };
  }

  try {
    const { error } = await supabaseBrowserClient.from('orders').delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete order.';
    return { success: false, error: msg };
  }
}
