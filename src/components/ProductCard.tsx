'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useEffect, useCallback } from 'react';
import type { Product } from '@/data/products';
import { cn } from '@/lib/utils';
import { gsap, ScrollTrigger } from '@/lib/gsap';

interface ProductCardProps {
  product: Product;
  className?: string;
  /** Stagger index — controls the reveal delay wave */
  animDelay?: number;
}

export function ProductCard({ product, className, animDelay = 0 }: ProductCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const priceRef = useRef<HTMLParagraphElement>(null);
  const swatchesRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);

  /* ─────────────────────────────────────────────────────────────────────
     SCROLL ENTRANCE — couture curtain reveal
     ───────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const card = cardRef.current;
    const imageWrap = imageWrapRef.current;
    const name = nameRef.current;
    const price = priceRef.current;
    const swatches = swatchesRef.current;

    if (!card || !imageWrap) return;

    // Set initial hidden states
    gsap.set(imageWrap, { clipPath: 'inset(100% 0% 0% 0%)' });
    gsap.set([name, price].filter(Boolean), { y: 24, opacity: 0 });
    if (swatches) gsap.set(Array.from(swatches.children), { scale: 0, opacity: 0 });

    const st = ScrollTrigger.create({
      trigger: card,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({
          delay: animDelay,
          defaults: { ease: 'expo.out' },
        });

        // 1. Curtain wipes UP — image emerges from below like a fashion show
        tl.to(imageWrap, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.1,
          ease: 'expo.inOut',
        })
          // 2. Shimmer sweep across image
          .fromTo(
            shimmerRef.current,
            { x: '-110%', opacity: 1 },
            { x: '110%', opacity: 0.6, duration: 0.7, ease: 'power2.out' },
            '-=0.2'
          )
          // 3. Product name slides up from mask
          .to(
            name,
            { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
            '-=0.3'
          )
          // 4. Price slides up with slight delay
          .to(
            price,
            { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' },
            '-=0.3'
          )
          // 5. Swatches pop in one by one
          .to(
            swatches ? Array.from(swatches.children) : [],
            {
              scale: 1,
              opacity: 1,
              duration: 0.3,
              stagger: 0.05,
              ease: 'back.out(2)',
            },
            '-=0.2'
          );
      },
    });

    return () => {
      st.kill();
    };
  }, [animDelay]);

  /* ─────────────────────────────────────────────────────────────────────
     3D MAGNETIC TILT — editorial hover feel
     ───────────────────────────────────────────────────────────────────── */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = cardRef.current;
    if (!el) return;

    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);   // -1 to 1
      const dy = (e.clientY - cy) / (rect.height / 2);  // -1 to 1

      gsap.to(el, {
        rotateY: dx * 6,         // max ±6° tilt
        rotateX: -dy * 4,        // max ±4° tilt
        transformPerspective: 800,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)',
      overwrite: 'auto',
    });
  }, []);

  return (
    <Link
      ref={cardRef}
      href={`/id/products/${product.id}`}
      className={cn(
        'group block',
        // perspective needed for 3D tilt
        '[transform-style:preserve-3d]',
        className
      )}
      style={{ willChange: 'transform' }}
      aria-label={`${product.name}, ${product.price}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Image container with clipPath mask ── */}
      <div
        ref={imageWrapRef}
        className="relative aspect-[3/4] overflow-hidden rounded-sm border border-[#EADFD4]/60 bg-[#F5F0E6]"
        style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      >
        {/* Shimmer overlay */}
        <div
          ref={shimmerRef}
          className="pointer-events-none absolute inset-0 z-10 -translate-x-full"
          style={{
            background:
              'linear-gradient(105deg, transparent 30%, rgba(250,247,242,0.55) 50%, transparent 70%)',
          }}
        />

        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.06] group-hover:opacity-0"
        />
        <Image
          src={product.hoverImage}
          alt=""
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-100"
          aria-hidden="true"
        />

        {product.discount && (
          <span className="absolute left-2.5 top-2.5 z-10 bg-[#0B4F3A] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-[#FAF7F2] shadow-sm">
            {product.discount}
          </span>
        )}

        {/* Subtle vignette on hover — depth effect */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(26,25,24,0.18) 100%)',
          }}
        />
      </div>

      {/* ── Text info ── */}
      <div className="px-0.5 pt-3.5">
        {/* Name masked reveal */}
        <div className="overflow-hidden">
          <h3
            ref={nameRef}
            className="text-[13px] font-normal leading-snug text-[#1A1918] transition-colors duration-300 group-hover:text-[#0B4F3A]"
          >
            {product.name}
          </h3>
        </div>

        {/* Price masked reveal */}
        <div className="overflow-hidden">
          <p ref={priceRef} className="mt-1 text-[13px] font-medium">
            {product.originalPrice ? (
              <>
                <span className="mr-2 font-normal text-[#786E65] line-through">{product.originalPrice}</span>
                <span className="font-semibold text-[#0B4F3A]">{product.price}</span>
              </>
            ) : (
              <span className="text-[#1A1918]">{product.price}</span>
            )}
          </p>
        </div>

        {/* Swatches */}
        {product.swatches.length > 1 && (
          <div ref={swatchesRef} className="mt-2.5 flex items-center gap-1.5">
            {product.swatches.slice(0, 5).map((swatch) => (
              <span
                key={swatch}
                className="relative block h-3.5 w-3.5 overflow-hidden rounded-full border border-[#EADFD4] transition-transform duration-200 hover:scale-[1.4]"
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
