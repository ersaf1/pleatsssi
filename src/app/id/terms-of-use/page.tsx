import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { INFO_PAGES } from "@/data/info-pages";

export const metadata: Metadata = {
  title: "Terms of Use | CHARLES & KEITH Indonesia",
  description: INFO_PAGES["terms-of-use"].intro,
};

export default function TermsOfUsePage() {
  return <InfoPage content={INFO_PAGES["terms-of-use"]} />;
}
