import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { INFO_PAGES } from "@/data/info-pages";

export const metadata: Metadata = {
  title: "Privacy Policy | CHARLES & KEITH Indonesia",
  description: INFO_PAGES["privacy-policy"].intro,
};

export default function PrivacyPolicyPage() {
  return <InfoPage content={INFO_PAGES["privacy-policy"]} />;
}
