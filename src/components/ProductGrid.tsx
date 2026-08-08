'use client';

import { useRef, useEffect } from 'react';
import type { Product, GroupedProduct } from '@/data/products';
import { groupProductsByFamily } from '@/data/products';
import { ProductCard } from './ProductCard';
import { gsap, ScrollTrigger } from '@/lib/gsap';

interface ProductGridProps {
  products: (Product | GroupedProduct)[];
  title?: string;
  groupByFamily?: boolean;
}

/**
 * Computes a wave-stagger delay based on (row, col) position.
 * Cards in the same row stagger left→right; each row adds a base delay.
 */
function waveDelay(index: number, cols: number): number {
  const row = Math.floor(index / cols);
  const col = index % cols;
  return row * 0.04 + col * 0.07;
}

export function ProductGrid({ products, title, groupByFamily = true }: ProductGridProps) {
  const displayProducts: (Product | GroupedProduct)[] = (() => {
    if (groupByFamily === false) {
      return products;
    }
    const isAlreadyGrouped = products.some((p) => 'items' in p || 'familyName' in p);
    if (isAlreadyGrouped) {
      return products;
    }
    return groupProductsByFamily(products as Product[]);
  })();

  const titleWrapRef = useRef<HTMLDivElement>(null);
  const lineLeftRef = useRef<HTMLSpanElement>(null);
  const lineRightRef = useRef<HTMLSpanElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!titleWrapRef.current) return;

    const words = Array.from(
      titleWrapRef.current.querySelectorAll<HTMLElement>('[data-word]')
    );
    if (!words.length) return;

    gsap.set(words, { y: '110%', opacity: 0 });
    gsap.set([lineLeftRef.current, lineRightRef.current], { scaleX: 0, opacity: 0 });

    const st = ScrollTrigger.create({
      trigger: titleWrapRef.current,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
        tl.to(words, { y: '0%', opacity: 1, duration: 0.85, stagger: { each: 0.07 } })
          .to(
            [lineLeftRef.current, lineRightRef.current],
            { scaleX: 1, opacity: 1, duration: 0.55, ease: 'power3.inOut' },
            '-=0.35'
          );
      },
    });

    return () => st.kill();
  }, [title]);

  return (
    <section ref={sectionRef} className="mx-auto w-full max-w-[1600px] px-4 pb-16 xl:px-8">
      {title && (
        <div
          ref={titleWrapRef}
          className="mb-10 flex items-center gap-4 md:gap-6"
        >
          <span
            ref={lineLeftRef}
            className="hidden md:block flex-1 h-px bg-gradient-to-r from-transparent to-[#EADFD4] origin-right"
            aria-hidden="true"
          />
          <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-0" aria-label={title}>
            {title.trim().split(/\s+/).map((word, i) => (
              <div key={i} className="overflow-hidden leading-none pb-1">
                <span
                  data-word
                  className="block font-['Italiana',serif] text-2xl md:text-3xl font-normal uppercase tracking-[0.2em] text-[#1A1918]"
                >
                  {word}
                </span>
              </div>
            ))}
          </div>
          <span
            ref={lineRightRef}
            className="hidden md:block flex-1 h-px bg-gradient-to-l from-transparent to-[#EADFD4] origin-left"
            aria-hidden="true"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8 xl:grid-cols-4">
        {displayProducts.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            // Wave stagger: assumes 2 cols mobile, 3 cols tablet, 4 cols desktop
            // We use 4 as the base since desktop is the richest animation target
            animDelay={waveDelay(i, 4)}
          />
        ))}
      </div>
    </section>
  );
}
