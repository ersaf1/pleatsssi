import type { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  title?: string;
}

export function ProductGrid({ products, title }: ProductGridProps) {
  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 pb-16 xl:px-8">
      {title && (
        <h2 className="mb-8 text-center font-['Italiana',serif] text-2xl md:text-3xl font-normal uppercase tracking-[0.2em] text-[#1A1918]">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
