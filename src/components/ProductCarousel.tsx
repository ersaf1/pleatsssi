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
      <h2 className="mb-8 text-center font-['Italiana',serif] text-2xl font-normal uppercase tracking-[0.2em] text-[#1A1918] md:text-3xl">
        {title}
      </h2>
      <div className="group relative">
        <button
          type="button"
          aria-label="Geser ke kiri"
          onClick={() => scroll(-1)}
          className="absolute -left-4 top-[40%] z-10 hidden h-11 w-11 items-center justify-center rounded-full border border-[#EADFD4] bg-[#FAF7F2]/90 text-[#1A1918] shadow-sm backdrop-blur-sm transition-all hover:border-[#0B4F3A]/40 hover:bg-[#F5F0E6] hover:text-[#0B4F3A] md:flex"
        >
          <ChevronLeft size={20} strokeWidth={1.5} />
        </button>

        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] md:gap-8 [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              className="w-[45%] flex-shrink-0 snap-start sm:w-[40%] md:w-[30%] xl:w-[23.5%]"
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Geser ke kanan"
          onClick={() => scroll(1)}
          className="absolute -right-4 top-[40%] z-10 hidden h-11 w-11 items-center justify-center rounded-full border border-[#EADFD4] bg-[#FAF7F2]/90 text-[#1A1918] shadow-sm backdrop-blur-sm transition-all hover:border-[#0B4F3A]/40 hover:bg-[#F5F0E6] hover:text-[#0B4F3A] md:flex"
        >
          <ChevronRight size={20} strokeWidth={1.5} />
        </button>
      </div>
    </section>
  );
}
