import type { Metadata } from "next";
import { CATEGORY_META, type CategoryMeta } from "@/data/categories";
import { getDynamicCategories } from "@/lib/services/categoryService";
import { CategoryPage } from "@/components/CategoryPage";

export const dynamic = "force-dynamic";

async function getCategoryMeta(slug: string): Promise<CategoryMeta | null> {
  if (CATEGORY_META[slug]) {
    return CATEGORY_META[slug];
  }
  const dynamicCategories = await getDynamicCategories();
  const dbCat = dynamicCategories.find((c: { slug: string; name?: string; description?: string }) => c.slug === slug);
  if (dbCat) {
    const name = dbCat.name || slug;
    return {
      slug: dbCat.slug,
      title: name.toUpperCase(),
      breadcrumbLabel: name,
      description: dbCat.description || "",
      kind: "category",
    };
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const meta = await getCategoryMeta(category);
  if (!meta) return {};
  return {
    title: `${meta.breadcrumbLabel} | PLEATSSSI Indonesia`,
    description: meta.description,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const meta = await getCategoryMeta(category);
  return <CategoryPage slug={category} initialMeta={meta ?? undefined} />;
}
