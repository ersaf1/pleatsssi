import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { INFO_PAGES } from "@/data/info-pages";

export const metadata: Metadata = {
  title: "FAQ | CHARLES & KEITH Indonesia",
  description: INFO_PAGES.faq.intro,
};

export default function FaqPage() {
  return <InfoPage content={INFO_PAGES.faq} />;
}
