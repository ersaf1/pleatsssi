import { supabaseBrowserClient } from '../supabaseClient';
import { INFO_PAGES, INFO_PAGES as STATIC_INFO } from '@/data/info-pages';
import type { InfoPageContent } from '@/components/InfoPage';
import { isSupabaseConfigured, withTimeout } from './serviceUtils';

export interface InfoPageItem {
  id: string;
  slug: string;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export function parseInfoContent(
  pageData: Record<string, unknown> | null,
  fallbackKey: string
): InfoPageContent {
  const fallback = INFO_PAGES[fallbackKey];
  if (!pageData) return fallback;
  if (Array.isArray(pageData.sections)) return pageData as unknown as InfoPageContent;
  if (pageData.content) {
    if (typeof pageData.content === "object" && pageData.content !== null && "sections" in pageData.content) {
      return pageData.content as unknown as InfoPageContent;
    }
    if (typeof pageData.content === "string") {
      try {
        const parsed = JSON.parse(pageData.content);
        if (parsed.sections && Array.isArray(parsed.sections)) return parsed as InfoPageContent;
      } catch {
        return {
          title: (pageData.title as string) || fallback.title,
          intro: (pageData.intro as string) || fallback.intro,
          sections: [{ heading: (pageData.title as string) || fallback.title, paragraphs: [pageData.content as string] }],
        };
      }
    }
  }
  return fallback;
}

export async function getDynamicInfoPage(slug: string) {
  const staticPage = STATIC_INFO[slug];
  const fallback = staticPage ? { title: staticPage.title, content: (staticPage as unknown as Record<string, unknown>).content || JSON.stringify(staticPage) } : null;

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

export async function getAllInfoPages(): Promise<InfoPageItem[]> {
  const staticItems: InfoPageItem[] = Object.entries(STATIC_INFO).map(([slug, page], index) => ({
    id: `info-static-${slug}-${index}`,
    slug,
    title: page.title,
    content: JSON.stringify({ intro: page.intro, sections: page.sections }, null, 2),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  if (!isSupabaseConfigured()) {
    return staticItems;
  }

  try {
    const { data, error } = await withTimeout(
      supabaseBrowserClient.from('info_pages').select('*').order('title', { ascending: true })
    );

    if (error || !data || data.length === 0) {
      return staticItems;
    }
    return data as InfoPageItem[];
  } catch {
    return staticItems;
  }
}

export async function createOrUpdateInfoPage(input: {
  id?: string;
  slug: string;
  title: string;
  content: string;
}): Promise<{ data: InfoPageItem | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'Supabase is not configured.' };
  }

  try {
    const payload = {
      slug: input.slug.trim().toLowerCase(),
      title: input.title.trim(),
      content: input.content,
      updated_at: new Date().toISOString(),
    };

    if (input.id && !input.id.startsWith('info-static-')) {
      const { data, error } = await supabaseBrowserClient
        .from('info_pages')
        .update(payload)
        .eq('id', input.id)
        .select('*')
        .single();

      if (error || !data) {
        return { data: null, error: error?.message || 'Failed to update info page.' };
      }
      return { data: data as InfoPageItem, error: null };
    } else {
      const { data, error } = await supabaseBrowserClient
        .from('info_pages')
        .upsert(payload, { onConflict: 'slug' })
        .select('*')
        .single();

      if (error || !data) {
        return { data: null, error: error?.message || 'Failed to create info page.' };
      }
      return { data: data as InfoPageItem, error: null };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to save info page.';
    return { data: null, error: msg };
  }
}

export async function deleteInfoPage(id: string): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase is not configured.' };
  }

  try {
    const { error } = await supabaseBrowserClient.from('info_pages').delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete info page.';
    return { success: false, error: msg };
  }
}
