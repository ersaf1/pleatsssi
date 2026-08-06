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
}

export async function getDynamicBanners(type?: 'hero' | 'promo' | 'lifestyle'): Promise<Banner[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    let query = supabaseBrowserClient.from('banners').select('*').eq('is_active', true).order('sort_order', { ascending: true });
    if (type) {
      query = query.eq('type', type);
    }
    const { data, error } = await withTimeout(query);
    if (error || !data || data.length === 0) {
      return []; // Fallback to empty if not configured
    }
    return data as Banner[];
  } catch {
    return [];
  }
}
