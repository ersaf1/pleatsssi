import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { INFO_PAGES } from "@/data/info-pages";

export const metadata: Metadata = {
  title: "Perawatan Produk | PLEATSSSI Indonesia",
  description: INFO_PAGES["perawatan-produk"].intro,
};

export default function ProductCarePage() {
  return <InfoPage content={INFO_PAGES["perawatan-produk"]} />;
}
