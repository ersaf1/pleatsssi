import { notFound } from "next/navigation";
import { CATEGORY_META, type CategoryMeta } from "@/data/categories";
import { type Product } from "@/data/products";
import { CategoryHero } from "./CategoryHero";
import { ProductGrid } from "./ProductGrid";
import { getDynamicProducts } from "@/lib/services/productService";

interface CategoryPageProps {
  slug: string;
  initialMeta?: CategoryMeta;
}

export async function CategoryPage({ slug, initialMeta }: CategoryPageProps) {
  const meta = initialMeta || CATEGORY_META[slug];
  if (!meta) notFound();

  const allProducts = await getDynamicProducts();

  const products: Product[] =
    meta.kind === "category"
      ? allProducts.filter((p) => p.category === slug)
      : allProducts.filter(
          (p) =>
            p.collections?.includes(slug) ||
            (slug === "sale" && p.isSale)
        );

  return (
    <div className="min-h-screen bg-[#FAF7F2]/30 pb-8">
      <CategoryHero meta={meta} productCount={products.length} />
      <div className="pt-8">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}

