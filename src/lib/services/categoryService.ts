import { supabaseBrowserClient } from '../supabaseClient';
import { CATEGORY_META } from '@/data/categories';
import { isSupabaseConfigured, withTimeout } from './serviceUtils';

export async function getDynamicCategories() {
  const fallback = Object.values(CATEGORY_META);

  if (!isSupabaseConfigured()) {
    return fallback;
  }

  try {
    const { data, error } = await withTimeout(
      supabaseBrowserClient
        .from('categories')
        .select('*')
        .order('name')
    );
    
    if (error || !data || data.length === 0) {
      return fallback;
    }
    return data;
  } catch {
    return fallback;
  }
}
