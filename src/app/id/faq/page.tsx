import type { Metadata } from "next";
import { InfoPage, type InfoPageContent } from "@/components/InfoPage";
import { INFO_PAGES } from "@/data/info-pages";
import { getDynamicInfoPage } from "@/lib/services/infoPageService";

export const dynamic = "force-dynamic";

function parseInfoContent(pageData: Record<string, unknown> | null, fallbackKey: string): InfoPageContent {
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
          sections: [{ heading: (pageData.title as string) || fallback.title, paragraphs: [pageData.content] }],
        };
      }
    }
  }
  return fallback;
}

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getDynamicInfoPage("faq");
  const content = parseInfoContent(pageData, "faq");
  return {
    title: `${content.title} | PLEATSSSI Indonesia`,
    description: content.intro || INFO_PAGES.faq.intro,
  };
}

export default async function FaqPage() {
  const pageData = await getDynamicInfoPage("faq");
  const content = parseInfoContent(pageData, "faq");
  return <InfoPage content={content} />;
}
