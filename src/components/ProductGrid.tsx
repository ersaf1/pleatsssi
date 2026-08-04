import type { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 pb-16 xl:px-8">
      <div className="grid grid-cols-2 gap-x-2 gap-y-8 md:grid-cols-3 md:gap-x-4 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
