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
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition-opacity duration-300 group-hover:opacity-0"
        />
        <Image
          src={product.hoverImage}
          alt=""
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        />
        {product.discount && (
          <span className="absolute left-2 top-2 bg-[#cc0000] px-2 py-0.5 text-[11px] uppercase tracking-wider text-white">
            {product.discount}
          </span>
        )}
      </div>

      <div className="pt-3">
        <h3 className="text-[13px] leading-snug text-[#333] transition-colors group-hover:text-black">
          {product.name}
        </h3>
        <p className="mt-1 text-[13px]">
          {product.originalPrice ? (
            <>
              <span className="mr-2 text-gray-400 line-through">{product.originalPrice}</span>
              <span className="text-[#cc0000]">{product.price}</span>
            </>
          ) : (
            <span className="text-black">{product.price}</span>
          )}
        </p>
        {product.swatches.length > 1 && (
          <div className="mt-2 flex items-center gap-1.5">
            {product.swatches.slice(0, 5).map((swatch) => (
              <span
                key={swatch}
                className="relative block h-4 w-4 overflow-hidden rounded-full border border-black/10"
              >
                <Image src={swatch} alt="" fill sizes="16px" className="object-cover" />
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
