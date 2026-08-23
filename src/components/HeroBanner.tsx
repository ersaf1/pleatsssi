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
  imageMobile: '/images/hero-desktop.png',
  title: 'Koleksi Terbaru PLEATSSSI',
  subtitle: 'New Season',
  ctaLabel: 'Belanja Sekarang',
  ctaUrl: '/id/new-arrivals',
};

export function HeroBanner({ data = FALLBACK }: HeroBannerProps) {
  const href = data.ctaUrl || '#';
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Phase 1: Image curtain lift with scale drift ── */
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      tl
        // Image unmasks from bottom with Ken Burns scale
        .fromTo(
          imageRef.current,
          { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.12 },
          { clipPath: 'inset(0% 0% 0% 0%)', scale: 1.04, duration: 1.6, ease: 'power4.inOut' }
        )
        // Overlay fades from opaque to reveal image
        .fromTo(
          overlayRef.current,
          { opacity: 0.6 },
          { opacity: 0.28, duration: 1.2, ease: 'power2.out' },
          '-=1.0'
        )
        // Card materializes — blur to sharp
        .fromTo(
          cardRef.current,
          { opacity: 0, y: 56, filter: 'blur(12px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' },
          '-=0.5'
        )
        // Decorative line expands
        .fromTo(
          lineRef.current,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 0.5, ease: 'power2.inOut' },
          '-=0.6'
        )
        // Subtitle letter-spacing opens
        .fromTo(
          subtitleRef.current,
          { opacity: 0, letterSpacing: '0.6em' },
          { opacity: 1, letterSpacing: '0.3em', duration: 0.7, ease: 'power2.out' },
          '-=0.4'
        )
        // Title chars cascade down
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 28, skewY: 2 },
          { opacity: 1, y: 0, skewY: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.4'
        )
        // CTA appears with backdrop
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 16, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.4)' },
          '-=0.2'
        )
        // Scroll indicator floats in
        .fromTo(
          scrollIndicatorRef.current,
          { opacity: 0, y: -12 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.2'
        );

      /* ── Scroll indicator loop ── */
      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        duration: 1.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 2,
      });

      /* ── Slow Ken Burns on image while reading ── */
      gsap.to(imageRef.current, {
        scale: 1.0,
        duration: 10,
        ease: 'none',
        delay: 1.6,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Magnetic CTA hover ── */
  const handleCtaMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ctaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: 'power2.out' });
  };
  const handleCtaMouseLeave = () => {
    gsap.to(ctaRef.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: 'min(100svh, 900px)' }}
    >
      {/* ── Image layer ── */}
      <div ref={imageRef} className="absolute inset-0 will-change-transform">
        <Image
          src={data.imageDesktop}
          alt={data.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* ── Gradient overlay ── */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, rgba(26,25,24,0.65) 0%, rgba(26,25,24,0.18) 55%, rgba(26,25,24,0.08) 100%)',
        }}
      />

      {/* ── Bottom gradient for card readability ── */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(26,25,24,0.55) 0%, transparent 100%)',
        }}
      />

      {/* ── Content card ── */}
      <div
        ref={cardRef}
        className="absolute bottom-10 left-6 md:bottom-16 md:left-14 max-w-[420px] will-change-transform"
      >
        {/* Accent line */}
        <span
          ref={lineRef}
          className="mb-5 block h-[1px] w-12 bg-[#FAF7F2]/70"
        />

        {data.subtitle && (
          <p
            ref={subtitleRef}
            className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[#FAF7F2]/75 font-medium"
          >
            {data.subtitle}
          </p>
        )}

        <h1
          ref={titleRef}
          className="font-['Italiana',serif] text-[2.4rem] md:text-[3.2rem] text-[#FAF7F2] uppercase leading-[1.05] tracking-[0.06em] mb-7 will-change-transform"
          style={{ textShadow: '0 2px 24px rgba(26,25,24,0.4)' }}
        >
          {data.title}
        </h1>

        {data.ctaLabel && (
          <a
            ref={ctaRef}
            href={href}
            onMouseMove={handleCtaMouseMove}
            onMouseLeave={handleCtaMouseLeave}
            className="inline-flex items-center gap-3 group"
            style={{ willChange: 'transform' }}
          >
            <span className="relative inline-flex items-center justify-center bg-[#FAF7F2] text-[#1A1918] px-8 py-3.5 text-[11px] uppercase tracking-[0.22em] font-semibold transition-all duration-300 group-hover:bg-[#0B4F3A] group-hover:text-[#FAF7F2] shadow-[0_4px_24px_rgba(26,25,24,0.3)] group-hover:shadow-[0_8px_32px_rgba(11,79,58,0.45)] overflow-hidden">
              {/* Shimmer sweep */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              {data.ctaLabel}
            </span>
            {/* Arrow */}
            <span className="flex items-center justify-center w-10 h-10 border border-[#FAF7F2]/50 group-hover:border-[#0B4F3A] group-hover:bg-[#0B4F3A] transition-all duration-300 text-[#FAF7F2]">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 7h10M8 3l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        )}
      </div>

      {/* ── Scroll indicator ── */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[9px] uppercase tracking-[0.25em] text-[#FAF7F2]/50 rotate-90 origin-center mb-1">Scroll</span>
        <span className="w-[1px] h-8 bg-gradient-to-b from-[#FAF7F2]/50 to-transparent" />
      </div>

      {/* ── Corner brand mark ── */}
      <div className="absolute top-6 right-6 hidden md:block pointer-events-none">
        <span className="text-[9px] uppercase tracking-[0.3em] text-[#FAF7F2]/40 font-medium">
          Since 2020
        </span>
      </div>
    </section>
  );
}
