import { notFound } from "next/navigation";
import { CATEGORY_META } from "@/data/categories";
import { getProductsByCategory, getProductsByCollection, type Product } from "@/data/products";
import { CategoryHero } from "./CategoryHero";
import { ProductGrid } from "./ProductGrid";

interface CategoryPageProps {
  slug: string;
}

export function CategoryPage({ slug }: CategoryPageProps) {
  const meta = CATEGORY_META[slug];
  if (!meta) notFound();

  const products: Product[] =
    meta.kind === "category"
      ? getProductsByCategory(slug as Product["category"])
      : getProductsByCollection(slug);

  return (
    <div className="min-h-screen bg-[#FAF7F2]/30 pb-8">
      <CategoryHero meta={meta} productCount={products.length} />
      <div className="pt-8">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}

