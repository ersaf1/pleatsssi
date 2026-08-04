import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { INFO_PAGES } from "@/data/info-pages";

export const metadata: Metadata = {
  title: "Lokasi Toko | CHARLES & KEITH Indonesia",
  description: INFO_PAGES["lokasi-toko"].intro,
};

export default function StoreLocatorPage() {
  return <InfoPage content={INFO_PAGES["lokasi-toko"]} />;
}
