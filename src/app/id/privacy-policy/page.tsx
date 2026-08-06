import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { INFO_PAGES } from "@/data/info-pages";
import { getDynamicInfoPage, parseInfoContent } from "@/lib/services/infoPageService";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getDynamicInfoPage("privacy-policy");
  const content = parseInfoContent(pageData, "privacy-policy");
  return {
    title: `${content.title} | PLEATSSSI Indonesia`,
    description: content.intro || INFO_PAGES["privacy-policy"].intro,
  };
}

export default async function PrivacyPolicyPage() {
  const pageData = await getDynamicInfoPage("privacy-policy");
  const content = parseInfoContent(pageData, "privacy-policy");
  return <InfoPage content={content} />;
}
