import type { Metadata } from "next";
import { CATEGORY_META, CATEGORY_ROUTE_SLUGS } from "@/data/categories";
import { CategoryPage } from "@/components/CategoryPage";

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORY_ROUTE_SLUGS.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_META[category];
  if (!meta) return {};
  return {
    title: `${meta.breadcrumbLabel} | CHARLES & KEITH Indonesia`,
    description: meta.description,
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
