'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useEffect, useCallback, useState } from 'react';
import { Heart } from 'lucide-react';
import type { Product, GroupedProduct } from '@/data/products';
import { cn } from '@/lib/utils';
import { gsap, ScrollTrigger } from '@/lib/gsap';

interface ProductCardProps {
  product: Product | GroupedProduct;
  className?: string;
  animDelay?: number;
}

export function ProductCard({ product, className, animDelay = 0 }: ProductCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement & { src: string }>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const priceRef = useRef<HTMLParagraphElement>(null);
  const swatchesRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const hoverImgRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isGrouped = 'items' in product && Array.isArray(product.items);
  const groupedProduct = isGrouped ? (product as GroupedProduct) : null;
  const singleProduct = !isGrouped ? (product as Product) : null;

  const productId = isGrouped ? (groupedProduct?.items[0]?.id || product.id) : product.id;
  const name = isGrouped ? groupedProduct?.familyName : singleProduct?.name;
  const priceDisplay = isGrouped ? groupedProduct?.priceDisplay : singleProduct?.price;
  const originalPrice = singleProduct?.originalPrice ?? null;
  const discount = product.discount ?? null;
  const pieceCount = isGrouped ? groupedProduct?.pieceCount : undefined;
  const swatches = product.swatches || [];
  const hoverImage = product.hoverImage || product.image;

  /* ── Scroll entrance: clip-path curtain + stagger ── */
  useEffect(() => {
    const card = cardRef.current;
    const imageWrap = imageWrapRef.current;
    const nameEl = nameRef.current;
    const priceEl = priceRef.current;
    const swatchesEl = swatchesRef.current;

    if (!card || !imageWrap) return;

    gsap.set(imageWrap, { clipPath: 'inset(100% 0% 0% 0%)' });
    gsap.set([nameEl, priceEl].filter(Boolean), { y: 20, opacity: 0 });
    if (swatchesEl) gsap.set(swatchesEl, { y: 12, opacity: 0 });

    const st = ScrollTrigger.create({
      trigger: card,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
        tl
          .to(imageWrap, {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.0,
            delay: animDelay * 0.08,
          })
          .to(
            [nameEl, priceEl].filter(Boolean),
            { y: 0, opacity: 1, duration: 0.55, stagger: 0.06 },
            '-=0.5'
          )
          .to(
            swatchesEl,
            { y: 0, opacity: 1, duration: 0.4 },
            '-=0.3'
          );
      },
    });

    return () => {
      st.kill();
    };
  }, [animDelay]);

  /* ── 3-axis tilt on mouse move ── */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (!card) return;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateX: -y * 5,
        rotateY: x * 5,
        transformPerspective: 900,
        duration: 0.4,
        ease: 'power2.out',
      });
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    // Shimmer sweep
    if (shimmerRef.current) {
      gsap.fromTo(
        shimmerRef.current,
        { x: '-110%' },
        { x: '110%', duration: 0.7, ease: 'power1.inOut' }
      );
    }
    // Hover image cross-fade
    if (hoverImgRef.current && hoverImage !== product.image) {
      gsap.to(hoverImgRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' });
    }
  }, [hoverImage, product.image]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    const card = cardRef.current;
    if (!card) return;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)',
    });
    if (hoverImgRef.current) {
      gsap.to(hoverImgRef.current, { opacity: 0, duration: 0.4, ease: 'power2.in' });
    }
  }, []);

  const href = `/id/products/${productId}`;

  return (
    <Link
      ref={cardRef}
      href={href}
      className={cn('group relative block overflow-hidden bg-[#FAF7F2]', className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      {/* Image container */}
      <div
        ref={imageWrapRef}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F0E6]"
        style={{ willChange: 'clip-path' }}
      >
        {/* Primary image */}
        <Image
          src={product.image}
          alt={name || ''}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />

        {/* Hover image cross-fade */}
        {hoverImage && hoverImage !== product.image && (
          <div
            ref={hoverImgRef}
            className="absolute inset-0 opacity-0"
            style={{ willChange: 'opacity' }}
          >
            <Image
              src={hoverImage}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          </div>
        )}

        {/* Shimmer */}
        <div
          ref={shimmerRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%)',
            transform: 'translateX(-110%)',
            willChange: 'transform',
          }}
        />

        {/* Gradient vignette on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1918]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount && (
            <span className="bg-[#8C2323] text-[#FAF7F2] text-[9px] uppercase tracking-[0.18em] font-semibold px-2.5 py-1 shadow-sm">
              {discount}
            </span>
          )}
          {pieceCount && pieceCount > 1 && (
            <span className="bg-[#1A1918] text-[#FAF7F2] text-[9px] uppercase tracking-[0.18em] font-semibold px-2.5 py-1 shadow-sm">
              {pieceCount} Warna
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          aria-label={isWishlisted ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted((v) => !v);
          }}
          className={cn(
            'absolute top-3 right-3 flex h-8 w-8 items-center justify-center transition-all duration-300',
            'opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0',
            isWishlisted
              ? 'text-[#8C2323]'
              : 'text-[#FAF7F2] hover:text-[#8C2323]'
          )}
        >
          <Heart
            size={16}
            strokeWidth={1.5}
            fill={isWishlisted ? 'currentColor' : 'none'}
          />
        </button>

        {/* Quick-view pill on hover */}
        <div className="absolute bottom-3 inset-x-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
          <div className="bg-[#FAF7F2]/95 backdrop-blur-sm text-[#1A1918] text-[10px] uppercase tracking-[0.2em] font-semibold py-2.5 text-center shadow-sm">
            Lihat Produk
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="px-1 pt-3 pb-1">
        <h3
          ref={nameRef}
          className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#1A1918] leading-tight truncate"
          style={{ willChange: 'transform, opacity' }}
        >
          {name}
        </h3>
        <p
          ref={priceRef}
          className="mt-1 text-[12px] text-[#1A1918] tabular-nums"
          style={{ willChange: 'transform, opacity' }}
        >
          {originalPrice ? (
            <>
              <span className="mr-2 text-[#786E65] line-through font-normal">{originalPrice}</span>
              <span className="font-semibold text-[#0B4F3A]">{priceDisplay}</span>
            </>
          ) : (
            <span className="font-medium">{priceDisplay}</span>
          )}
        </p>

        {/* Swatches */}
        {swatches.length > 1 && (
          <div ref={swatchesRef} className="mt-2 flex items-center gap-1.5" style={{ willChange: 'transform, opacity' }}>
            {swatches.slice(0, 5).map((swatch, idx) => (
              <span
                key={`${swatch}-${idx}`}
                className="relative block h-3.5 w-3.5 overflow-hidden rounded-full border border-[#EADFD4] transition-transform duration-200 hover:scale-[1.4]"
              >
                <Image src={swatch} alt="" fill sizes="14px" className="object-cover" />
              </span>
            ))}
            {swatches.length > 5 && (
              <span className="text-[10px] text-[#786E65] font-medium">+{swatches.length - 5}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
