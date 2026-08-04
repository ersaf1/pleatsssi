import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { INFO_PAGES } from "@/data/info-pages";

export const metadata: Metadata = {
  title: "Hubungi Kami | CHARLES & KEITH Indonesia",
  description: INFO_PAGES["hubungi-kami"].intro,
};

export default function ContactPage() {
  return <InfoPage content={INFO_PAGES["hubungi-kami"]} />;
}
