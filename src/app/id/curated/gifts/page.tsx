import type { Metadata } from "next";
import { CATEGORY_META } from "@/data/categories";
import { CategoryPage } from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: `${CATEGORY_META.gifts.breadcrumbLabel} | PLEATSSSI Indonesia`,
  description: CATEGORY_META.gifts.description,
};

export default async function GiftsPage() {
  return <CategoryPage slug="gifts" />;
}
