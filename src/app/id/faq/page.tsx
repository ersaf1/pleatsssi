import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { INFO_PAGES } from "@/data/info-pages";
import { getDynamicInfoPage, parseInfoContent } from "@/lib/services/infoPageService";

export const dynamic = "force-dynamic";

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
