import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { INFO_PAGES } from "@/data/info-pages";

export const metadata: Metadata = {
  title: "Pengiriman & Pelacakan | PLEATSSSI Indonesia",
  description: INFO_PAGES["pengiriman-pelacakan"].intro,
};

export default function ShippingTrackingPage() {
  return <InfoPage content={INFO_PAGES["pengiriman-pelacakan"]} />;
}
