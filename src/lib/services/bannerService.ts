import { supabaseBrowserClient } from '../supabaseClient';
import { isSupabaseConfigured, withTimeout } from './serviceUtils';

export interface Banner {
  id: string;
  type: 'hero' | 'promo' | 'lifestyle';
  title: string | null;
  subtitle: string | null;
  image_url_desktop: string;
  image_url_mobile: string;
  cta_label: string | null;
  cta_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateBannerInput {
  type: 'hero' | 'promo' | 'lifestyle';
  title?: string | null;
  subtitle?: string | null;
  image_url_desktop: string;
  image_url_mobile: string;
  cta_label?: string | null;
  cta_url?: string | null;
  sort_order?: number;
  is_active?: boolean;
}

export interface UpdateBannerInput {
  type?: 'hero' | 'promo' | 'lifestyle';
  title?: string | null;
  subtitle?: string | null;
  image_url_desktop?: string;
  image_url_mobile?: string;
  cta_label?: string | null;
  cta_url?: string | null;
  sort_order?: number;
  is_active?: boolean;
}

export const MOCK_BANNERS: Banner[] = [
  {
    id: 'b1111111-1111-1111-1111-111111111111',
    type: 'hero',
    title: 'Koleksi Terbaru PLEATSSSI',
    subtitle: 'Temukan keanggunan lipit modern untuk gaya sehari-hari',
    image_url_desktop: '/images/hero-desktop.png',
    image_url_mobile: '/images/hero-mobile.png',
    cta_label: 'Belanja Sekarang',
    cta_url: '/id/new-arrivals',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    type: 'lifestyle',
    title: 'Gaya Sepatu Lipit',
    subtitle: 'Paduan sempurna atasan dan bawahan lipit',
    image_url_desktop: '/images/lifestyle-shoes.png',
    image_url_mobile: '/images/lifestyle-shoes.png',
    cta_label: 'Jelajahi Koleksi',
    cta_url: '/id/skirts',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 'b3333333-3333-3333-3333-333333333333',
    type: 'lifestyle',
    title: 'Koleksi Musim Baru',
    subtitle: 'Warna dan desain segar untuk penampilan Anda',
    image_url_desktop: '/images/lifestyle-new.png',
    image_url_mobile: '/images/lifestyle-new.png',
    cta_label: 'Lihat Produk',
    cta_url: '/id/tops',
    sort_order: 2,
    is_active: true,
  },
];

export async function getDynamicBanners(type?: 'hero' | 'promo' | 'lifestyle'): Promise<Banner[]> {
  if (!isSupabaseConfigured()) {
    if (type) {
      return MOCK_BANNERS.filter((b) => b.is_active && b.type === type);
    }
    return MOCK_BANNERS.filter((b) => b.is_active);
  }

  try {
    let query = supabaseBrowserClient.from('banners').select('*').eq('is_active', true).order('sort_order', { ascending: true });
    if (type) {
      query = query.eq('type', type);
    }
    const { data, error } = await withTimeout(query);
    if (error || !data || data.length === 0) {
      return type ? MOCK_BANNERS.filter((b) => b.type === type) : MOCK_BANNERS;
    }
    return data as Banner[];
  } catch {
    return type ? MOCK_BANNERS.filter((b) => b.type === type) : MOCK_BANNERS;
  }
}

export async function getAllBanners(): Promise<Banner[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_BANNERS;
  }

  try {
    const { data, error } = await withTimeout(
      supabaseBrowserClient.from('banners').select('*').order('sort_order', { ascending: true })
    );

    if (error || !data) {
      return MOCK_BANNERS;
    }
    return data as Banner[];
  } catch {
    return MOCK_BANNERS;
  }
}

export async function createBanner(
  input: CreateBannerInput
): Promise<{ data: Banner | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'Supabase is not configured.' };
  }

  try {
    const payload = {
      type: input.type,
      title: input.title && input.title.trim() ? input.title.trim() : null,
      subtitle: input.subtitle && input.subtitle.trim() ? input.subtitle.trim() : null,
      image_url_desktop: input.image_url_desktop.trim(),
      image_url_mobile: input.image_url_mobile.trim() || input.image_url_desktop.trim(),
      cta_label: input.cta_label && input.cta_label.trim() ? input.cta_label.trim() : null,
      cta_url: input.cta_url && input.cta_url.trim() ? input.cta_url.trim() : null,
      sort_order: input.sort_order ?? 0,
      is_active: input.is_active ?? true,
    };

    const { data, error } = await supabaseBrowserClient
      .from('banners')
      .insert(payload)
      .select('*')
      .single();

    if (error || !data) {
      return { data: null, error: error?.message || 'Failed to create banner.' };
    }

    return { data: data as Banner, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create banner.';
    return { data: null, error: msg };
  }
}

export async function updateBanner(
  id: string,
  input: UpdateBannerInput
): Promise<{ data: Banner | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'Supabase is not configured.' };
  }

  try {
    const updatePayload: Record<string, unknown> = {};

    if (input.type !== undefined) updatePayload.type = input.type;
    if (input.image_url_desktop !== undefined) updatePayload.image_url_desktop = input.image_url_desktop.trim();
    if (input.image_url_mobile !== undefined) updatePayload.image_url_mobile = input.image_url_mobile.trim();
    if (input.sort_order !== undefined) updatePayload.sort_order = input.sort_order;
    if (input.is_active !== undefined) updatePayload.is_active = input.is_active;

    // Preserve options clearing behavior: setting optional fields to null if empty/cleared
    if (input.title !== undefined) {
      updatePayload.title = input.title && input.title.trim() ? input.title.trim() : null;
    }
    if (input.subtitle !== undefined) {
      updatePayload.subtitle = input.subtitle && input.subtitle.trim() ? input.subtitle.trim() : null;
    }
    if (input.cta_label !== undefined) {
      updatePayload.cta_label = input.cta_label && input.cta_label.trim() ? input.cta_label.trim() : null;
    }
    if (input.cta_url !== undefined) {
      updatePayload.cta_url = input.cta_url && input.cta_url.trim() ? input.cta_url.trim() : null;
    }

    const { data, error } = await supabaseBrowserClient
      .from('banners')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      return { data: null, error: error?.message || 'Failed to update banner.' };
    }

    return { data: data as Banner, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update banner.';
    return { data: null, error: msg };
  }
}

export async function deleteBanner(id: string): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase is not configured.' };
  }

  try {
    const { error } = await supabaseBrowserClient.from('banners').delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete banner.';
    return { success: false, error: msg };
  }
}

export async function uploadBannerImage(file: File): Promise<{ url: string | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { url: null, error: 'Supabase is not configured.' };
  }

  try {
    const fileExt = file.name.split('.').pop() || 'png';
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
    const filePath = `banners/${Date.now()}_${cleanFileName}.${fileExt}`;

    const { error: uploadError } = await supabaseBrowserClient.storage
      .from('pleatsssi-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    const { data } = supabaseBrowserClient.storage
      .from('pleatsssi-assets')
      .getPublicUrl(filePath);

    return { url: data.publicUrl, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to upload image.';
    return { url: null, error: msg };
  }
}
