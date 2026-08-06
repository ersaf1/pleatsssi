import type { Metadata } from "next";
import { CATEGORY_META } from "@/data/categories";
import { getDynamicCategories } from "@/lib/services/categoryService";
import { CategoryPage } from "@/components/CategoryPage";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const dynamicCategories = await getDynamicCategories();
  const meta = CATEGORY_META[category] || dynamicCategories.find((c: { slug: string }) => c.slug === category);
  if (!meta) return {};
  const label = (meta as { breadcrumbLabel?: string; name?: string }).breadcrumbLabel || (meta as { name?: string }).name || category;
  return {
    title: `${label} | PLEATSSSI Indonesia`,
    description: meta.description || "",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  return <CategoryPage slug={category} />;
}
