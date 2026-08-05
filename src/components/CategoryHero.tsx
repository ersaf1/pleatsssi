import Link from "next/link";
import type { CategoryMeta } from "@/data/categories";

interface CategoryHeroProps {
  meta: CategoryMeta;
  productCount: number;
}

export function CategoryHero({ meta, productCount }: CategoryHeroProps) {
  return (
    <div className="w-full border-b border-[#EADFD4] bg-[#FAF7F2]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-8 md:py-12 xl:px-8">
        <nav aria-label="Breadcrumb" className="text-[12px] text-[#786E65]">
          <Link href="/" className="transition-colors hover:text-[#0B4F3A]">
            Beranda
          </Link>
          <span className="mx-2 text-[#D4C9B8]" aria-hidden="true">
            |
          </span>
          <span className="font-medium text-[#1A1918]">{meta.breadcrumbLabel}</span>
        </nav>

        <div className="mx-auto mt-6 max-w-3xl text-center">
          <h1 className="font-['Italiana',serif] text-2xl font-normal uppercase tracking-[0.2em] text-[#1A1918] md:text-4xl">
            {meta.title}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-[13px] leading-relaxed text-[#786E65] md:text-sm">
            {meta.description}
          </p>
          <div className="mt-4 inline-block rounded-full border border-[#EADFD4] bg-[#F5F0E6] px-4 py-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#0B4F3A]">
              {productCount} Produk
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

