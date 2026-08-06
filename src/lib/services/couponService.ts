import { supabaseBrowserClient } from '../supabaseClient';
import { isSupabaseConfigured, withTimeout } from './serviceUtils';

export interface Coupon {
  id: string;
  code: string;
  type: 'fixed' | 'percentage';
  value: number;
  min_purchase: number;
  max_discount: number | null;
  quota: number | null;
  used_count: number;
  starts_at: string;
  expires_at: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCouponInput {
  code: string;
  type: 'fixed' | 'percentage';
  value: number;
  min_purchase?: number;
  max_discount?: number | null;
  quota?: number | null;
  starts_at: string;
  expires_at: string;
  is_active?: boolean;
}

export interface UpdateCouponInput {
  code?: string;
  type?: 'fixed' | 'percentage';
  value?: number;
  min_purchase?: number;
  max_discount?: number | null;
  quota?: number | null;
  starts_at?: string;
  expires_at?: string;
  is_active?: boolean;
}

export const MOCK_COUPONS: Coupon[] = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    min_purchase: 100000,
    max_discount: 50000,
    quota: 100,
    used_count: 24,
    starts_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    expires_at: new Date(Date.now() + 60 * 86400000).toISOString(),
    is_active: true,
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    code: 'FLATSALE50K',
    type: 'fixed',
    value: 50000,
    min_purchase: 250000,
    max_discount: null,
    quota: 50,
    used_count: 15,
    starts_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    expires_at: new Date(Date.now() + 30 * 86400000).toISOString(),
    is_active: true,
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    code: 'VIPMEMBER',
    type: 'percentage',
    value: 15,
    min_purchase: 500000,
    max_discount: 150000,
    quota: null,
    used_count: 8,
    starts_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    expires_at: new Date(Date.now() + 90 * 86400000).toISOString(),
    is_active: true,
  },
];

export async function getAllCoupons(): Promise<Coupon[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_COUPONS;
  }

  try {
    const { data, error } = await withTimeout(
      supabaseBrowserClient.from('coupons').select('*').order('created_at', { ascending: false })
    );

    if (error || !data) {
      return MOCK_COUPONS;
    }
    return data as Coupon[];
  } catch {
    return MOCK_COUPONS;
  }
}

export async function getCouponByCode(code: string): Promise<Coupon | null> {
  const cleanCode = code.trim().toUpperCase();
  if (!isSupabaseConfigured()) {
    return MOCK_COUPONS.find((c) => c.code === cleanCode && c.is_active) || null;
  }

  try {
    const { data, error } = await withTimeout(
      supabaseBrowserClient
        .from('coupons')
        .select('*')
        .eq('code', cleanCode)
        .eq('is_active', true)
        .single()
    );

    if (error || !data) {
      return null;
    }
    return data as Coupon;
  } catch {
    return null;
  }
}

export async function createCoupon(
  input: CreateCouponInput
): Promise<{ data: Coupon | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'Supabase is not configured.' };
  }

  try {
    const payload = {
      code: input.code.trim().toUpperCase(),
      type: input.type,
      value: input.value,
      min_purchase: input.min_purchase ?? 0,
      max_discount: input.max_discount !== undefined && input.max_discount !== null ? input.max_discount : null,
      quota: input.quota !== undefined && input.quota !== null ? input.quota : null,
      used_count: 0,
      starts_at: input.starts_at,
      expires_at: input.expires_at,
      is_active: input.is_active ?? true,
    };

    const { data, error } = await supabaseBrowserClient
      .from('coupons')
      .insert(payload)
      .select('*')
      .single();

    if (error || !data) {
      return { data: null, error: error?.message || 'Failed to create coupon.' };
    }

    return { data: data as Coupon, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create coupon.';
    return { data: null, error: msg };
  }
}

export async function updateCoupon(
  id: string,
  input: UpdateCouponInput
): Promise<{ data: Coupon | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'Supabase is not configured.' };
  }

  try {
    const updatePayload: Record<string, unknown> = {};

    if (input.code !== undefined) updatePayload.code = input.code.trim().toUpperCase();
    if (input.type !== undefined) updatePayload.type = input.type;
    if (input.value !== undefined) updatePayload.value = input.value;
    if (input.min_purchase !== undefined) updatePayload.min_purchase = input.min_purchase;
    if (input.starts_at !== undefined) updatePayload.starts_at = input.starts_at;
    if (input.expires_at !== undefined) updatePayload.expires_at = input.expires_at;
    if (input.is_active !== undefined) updatePayload.is_active = input.is_active;

    // Option clearing: explicit null for optional fields max_discount & quota
    if (input.max_discount !== undefined) {
      updatePayload.max_discount = input.max_discount !== null && !isNaN(input.max_discount) ? input.max_discount : null;
    }
    if (input.quota !== undefined) {
      updatePayload.quota = input.quota !== null && !isNaN(input.quota) ? input.quota : null;
    }

    const { data, error } = await supabaseBrowserClient
      .from('coupons')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      return { data: null, error: error?.message || 'Failed to update coupon.' };
    }

    return { data: data as Coupon, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update coupon.';
    return { data: null, error: msg };
  }
}

export async function deleteCoupon(id: string): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase is not configured.' };
  }

  try {
    const { error } = await supabaseBrowserClient.from('coupons').delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete coupon.';
    return { success: false, error: msg };
  }
}
