import type { Metadata } from "next";
import { CATEGORY_META } from "@/data/categories";
import { CategoryPage } from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: `${CATEGORY_META.gifts.breadcrumbLabel} | CHARLES & KEITH Indonesia`,
  description: CATEGORY_META.gifts.description,
};

export default function GiftsPage() {
  return <CategoryPage slug="gifts" />;
}
