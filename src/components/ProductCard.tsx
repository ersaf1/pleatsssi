import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <Link
      href={`/id/products/${product.id}`}
      className={cn("group block", className)}
      aria-label={`${product.name}, ${product.price}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-[#EADFD4]/60 bg-[#F5F0E6]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition-all duration-500 ease-out group-hover:scale-105 group-hover:opacity-0"
        />
        <Image
          src={product.hoverImage}
          alt=""
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover opacity-0 transition-all duration-500 ease-out group-hover:scale-105 group-hover:opacity-100"
          aria-hidden="true"
        />
        {product.discount && (
          <span className="absolute left-2.5 top-2.5 bg-[#0B4F3A] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-[#FAF7F2] shadow-sm">
            {product.discount}
          </span>
        )}
      </div>

      <div className="px-0.5 pt-3.5">
        <h3 className="text-[13px] font-normal leading-snug text-[#1A1918] transition-colors group-hover:text-[#0B4F3A]">
          {product.name}
        </h3>
        <p className="mt-1 text-[13px] font-medium">
          {product.originalPrice ? (
            <>
              <span className="mr-2 font-normal text-[#786E65] line-through">{product.originalPrice}</span>
              <span className="font-semibold text-[#0B4F3A]">{product.price}</span>
            </>
          ) : (
            <span className="text-[#1A1918]">{product.price}</span>
          )}
        </p>
        {product.swatches.length > 1 && (
          <div className="mt-2.5 flex items-center gap-1.5">
            {product.swatches.slice(0, 5).map((swatch) => (
              <span
                key={swatch}
                className="relative block h-3.5 w-3.5 overflow-hidden rounded-full border border-[#EADFD4]"
              >
                <Image src={swatch} alt="" fill sizes="14px" className="object-cover" />
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
