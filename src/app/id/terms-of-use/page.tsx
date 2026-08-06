import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { INFO_PAGES } from "@/data/info-pages";
import { getDynamicInfoPage, parseInfoContent } from "@/lib/services/infoPageService";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getDynamicInfoPage("terms-of-use");
  const content = parseInfoContent(pageData, "terms-of-use");
  return {
    title: `${content.title} | PLEATSSSI Indonesia`,
    description: content.intro || INFO_PAGES["terms-of-use"].intro,
  };
}

export default async function TermsOfUsePage() {
  const pageData = await getDynamicInfoPage("terms-of-use");
  const content = parseInfoContent(pageData, "terms-of-use");
  return <InfoPage content={content} />;
}
