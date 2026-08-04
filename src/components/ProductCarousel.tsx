"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";

interface ProductCarouselProps {
  title: string;
  products: Product[];
}

export function ProductCarousel({ title, products }: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.75, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 py-12 xl:px-8">
      <h2 className="mb-6 text-center text-lg font-bold uppercase tracking-[0.2em]">{title}</h2>
      <div className="relative">
        <button
          type="button"
          aria-label="Geser ke kiri"
          onClick={() => scroll(-1)}
          className="absolute -left-3 top-[38%] z-10 hidden h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-colors hover:bg-gray-50 md:flex"
        >
          <ChevronLeft size={20} strokeWidth={1.5} />
        </button>

        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              className="w-[46%] flex-shrink-0 snap-start md:w-[31%] xl:w-[23.5%]"
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Geser ke kanan"
          onClick={() => scroll(1)}
          className="absolute -right-3 top-[38%] z-10 hidden h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-colors hover:bg-gray-50 md:flex"
        >
          <ChevronRight size={20} strokeWidth={1.5} />
        </button>
      </div>
    </section>
  );
}
