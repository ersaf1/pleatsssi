import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { INFO_PAGES } from "@/data/info-pages";

export const metadata: Metadata = {
  title: "Pengembalian | PLEATSSSI Indonesia",
  description: INFO_PAGES.pengembalian.intro,
};

export default function ReturnsPage() {
  return <InfoPage content={INFO_PAGES.pengembalian} />;
}
