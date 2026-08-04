import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { INFO_PAGES } from "@/data/info-pages";

export const metadata: Metadata = {
  title: "Cookies Policy | CHARLES & KEITH Indonesia",
  description: INFO_PAGES["cookies-policy"].intro,
};

export default function CookiesPolicyPage() {
  return <InfoPage content={INFO_PAGES["cookies-policy"]} />;
}
