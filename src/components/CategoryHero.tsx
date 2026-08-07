'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import type { CategoryMeta } from '@/data/categories';
import { gsap } from '@/lib/gsap';

interface CategoryHeroProps {
  meta: CategoryMeta;
  productCount: number;
}

export function CategoryHero({ meta, productCount }: CategoryHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const breadcrumbRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(breadcrumbRef.current, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.4 })
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 24, letterSpacing: '0.4em' },
          { opacity: 1, y: 0, letterSpacing: '0.2em', duration: 0.6 },
          '-=0.1'
        )
        .fromTo(descRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2')
        .fromTo(
          badgeRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.5)' },
          '-=0.15'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full border-b border-[#EADFD4] bg-[#FAF7F2]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-8 md:py-12 xl:px-8">
        <nav ref={breadcrumbRef} aria-label="Breadcrumb" className="text-[12px] text-[#786E65]">
          <Link href="/" className="transition-colors hover:text-[#0B4F3A]">
            Beranda
          </Link>
          <span className="mx-2 text-[#D4C9B8]" aria-hidden="true">|</span>
          <span className="font-medium text-[#1A1918]">{meta.breadcrumbLabel}</span>
        </nav>

        <div className="mx-auto mt-6 max-w-3xl text-center">
          <h1
            ref={titleRef}
            className="font-['Italiana',serif] text-2xl font-normal uppercase tracking-[0.2em] text-[#1A1918] md:text-4xl"
          >
            {meta.title}
          </h1>
          <p
            ref={descRef}
            className="mx-auto mt-3 max-w-2xl text-[13px] leading-relaxed text-[#786E65] md:text-sm"
          >
            {meta.description}
          </p>
          <div ref={badgeRef} className="mt-4 inline-block rounded-full border border-[#EADFD4] bg-[#F5F0E6] px-4 py-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#0B4F3A]">
              {productCount} Produk
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
