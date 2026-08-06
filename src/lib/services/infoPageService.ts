import { supabaseBrowserClient } from '../supabaseClient';
import { INFO_PAGES as STATIC_INFO } from '@/data/info-pages';
import { isSupabaseConfigured, withTimeout } from './serviceUtils';

export async function getDynamicInfoPage(slug: string) {
  const staticPage = STATIC_INFO[slug];
  const fallback = staticPage ? { title: staticPage.title, content: (staticPage as any).content || JSON.stringify(staticPage) } : null;

  if (!isSupabaseConfigured()) {
    return fallback;
  }

  try {
    const { data, error } = await withTimeout(
      supabaseBrowserClient
        .from('info_pages')
        .select('*')
        .eq('slug', slug)
        .single()
    );
    
    if (error || !data) {
      return fallback;
    }
    return data;
  } catch {
    return fallback;
  }
}
