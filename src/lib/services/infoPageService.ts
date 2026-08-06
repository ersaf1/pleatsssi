import { supabaseBrowserClient } from '../supabaseClient';
import { INFO_PAGES, INFO_PAGES as STATIC_INFO } from '@/data/info-pages';
import type { InfoPageContent } from '@/components/InfoPage';
import { isSupabaseConfigured, withTimeout } from './serviceUtils';

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
