import { supabaseBrowserClient } from '../supabaseClient';

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

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  if (url.includes('your-supabase-project') || url.includes('placeholder') || url.includes('example.com')) return false;
  if (key.includes('your-anon-key') || key.includes('placeholder')) return false;
  return true;
}

function withTimeout<T>(promise: PromiseLike<T>, ms: number = 2000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Supabase query timeout')), ms);
    promise.then(
      (res) => {
        clearTimeout(timer);
        resolve(res);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
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
