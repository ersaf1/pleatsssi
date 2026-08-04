import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { INFO_PAGES } from "@/data/info-pages";

export const metadata: Metadata = {
  title: "Panduan Ukuran | CHARLES & KEITH Indonesia",
  description: INFO_PAGES["panduan-ukuran"].intro,
};

export default function SizeGuidePage() {
  return <InfoPage content={INFO_PAGES["panduan-ukuran"]} />;
}
