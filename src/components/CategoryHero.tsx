import Link from "next/link";
import type { CategoryMeta } from "@/data/categories";

interface CategoryHeroProps {
  meta: CategoryMeta;
  productCount: number;
}

export function CategoryHero({ meta, productCount }: CategoryHeroProps) {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 pb-8 pt-8 xl:px-8">
      <nav aria-label="Breadcrumb" className="text-[12px] text-gray-500">
        <Link href="/" className="transition-colors hover:text-black">
          Beranda
        </Link>
        <span className="mx-2" aria-hidden="true">
          |
        </span>
        <span className="text-black">{meta.breadcrumbLabel}</span>
      </nav>

      <div className="pt-8 text-center">
        <h1 className="text-xl font-bold uppercase tracking-[0.2em] md:text-2xl">{meta.title}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-[13px] leading-relaxed text-gray-600">
          {meta.description}
        </p>
        <p className="mt-3 text-[12px] uppercase tracking-wider text-gray-500">
          {productCount} Produk
        </p>
      </div>
    </div>
  );
}
