'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

export interface HeroBannerData {
  imageDesktop: string;
  imageMobile: string;
  title: string;
  subtitle?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
}

interface HeroBannerProps {
  data?: HeroBannerData;
}

const FALLBACK: HeroBannerData = {
  imageDesktop: '/images/hero-desktop.png',
  imageMobile: '/images/hero-mobile.png',
  title: 'Koleksi Terbaru PLEATSSSI',
  subtitle: 'Koleksi Terbaru',
  ctaLabel: 'Belanja Sekarang',
  ctaUrl: '/id/new-arrivals',
};

export function HeroBanner({ data = FALLBACK }: HeroBannerProps) {
  const href = data.ctaUrl || '#';
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Image reveals by unmasking from bottom
      tl.fromTo(
        imageRef.current,
        { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.08 },
        { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.2, ease: 'power2.inOut' }
      )
        // Card glides up
        .fromTo(
          cardRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.4'
        )
        // Subtitle letter spacing open
        .fromTo(
          subtitleRef.current,
          { opacity: 0, letterSpacing: '0.5em' },
          { opacity: 1, letterSpacing: '0.25em', duration: 0.5 },
          '-=0.3'
        )
        // Title split reveal
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.2'
        )
        // CTA button bounces in
        .fromTo(
          ctaRef.current,
          { opacity: 0, scale: 0.88 },
          { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)' },
          '-=0.1'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden border-b border-[#EADFD4] bg-[#FAF7F2]">
      <a href={href} className="block relative group">
        <div ref={imageRef} className="w-full overflow-hidden">
          <picture>
            <source media="(min-width: 768px)" srcSet={data.imageDesktop} />
            <Image
              src={data.imageMobile || data.imageDesktop}
              alt={data.title}
              width={1920}
              height={1080}
              className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              priority
            />
          </picture>
        </div>

        {/* Warm cream editorial framing overlay */}
        <div
          ref={cardRef}
          className="absolute bottom-6 left-6 right-6 md:right-auto md:bottom-12 md:left-12 max-w-md bg-[#FAF7F2]/95 backdrop-blur-md p-6 md:p-8 border border-[#EADFD4] shadow-lg rounded-sm"
        >
          {data.subtitle && (
            <p ref={subtitleRef} className="text-[11px] uppercase tracking-[0.25em] text-[#786E65] font-medium mb-2">
              {data.subtitle}
            </p>
          )}
          <h1 ref={titleRef} className="font-['Italiana',serif] text-2xl md:text-4xl text-[#1A1918] uppercase tracking-[0.15em] mb-4 leading-tight">
            {data.title}
          </h1>
          {data.ctaLabel && (
            <span ref={ctaRef} className="inline-flex items-center justify-center bg-[#0B4F3A] group-hover:bg-[#073628] text-[#FAF7F2] px-6 py-3 text-[12px] uppercase tracking-[0.2em] font-medium transition-all duration-300 rounded-sm shadow-sm group-hover:shadow-md group-hover:translate-y-[-1px]">
              {data.ctaLabel}
            </span>
          )}
        </div>
      </a>
    </section>
  );
}
