'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export interface LifestylePanel {
  image: string;
  category: string;
  subtitle?: string | null;
  cta: string;
  href: string;
}

interface DualLifestyleBannerProps {
  panels?: LifestylePanel[];
}

const FALLBACK_PANELS: LifestylePanel[] = [
  { image: '/images/lifestyle-1.jpg', category: 'Koleksi Baru', subtitle: 'New Arrivals', cta: 'Belanja Sekarang', href: '/id/new-arrivals' },
  { image: '/images/lifestyle-2.jpg', category: 'Atasan Premium', subtitle: 'Tops Collection', cta: 'Lihat Koleksi', href: '/id/tops' },
  { image: '/images/lifestyle-3.jpg', category: 'Rok Elegan', subtitle: 'Skirts Edit', cta: 'Lihat Koleksi', href: '/id/skirts' },
  { image: '/images/lifestyle-4.jpg', category: 'Celana Modern', subtitle: 'Pants Collection', cta: 'Lihat Koleksi', href: '/id/pants' },
  { image: '/images/lifestyle-5.jpg', category: 'Trending Now', subtitle: 'Most Wanted', cta: 'Lihat Koleksi', href: '/id/trending-now' },
];

export function DualLifestyleBanner({ panels = FALLBACK_PANELS }: DualLifestyleBannerProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      panelRefs.current.forEach((panel, i) => {
        if (!panel) return;

        const img = panel.querySelector<HTMLElement>('[data-panel-img]');
        const card = panel.querySelector<HTMLElement>('[data-panel-card]');
        const line = panel.querySelector<HTMLElement>('[data-panel-line]');

        // Panel: clip-path curtain from bottom — starts visible, enhances on scroll
        gsap.fromTo(
          panel,
          { clipPath: 'inset(8% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.1,
            ease: 'power4.inOut',
            delay: i * 0.1,
            scrollTrigger: {
              trigger: panel,
              start: 'top 92%',
              toggleActions: 'play none none none',
              once: true,
            } satisfies ScrollTrigger.Vars,
          }
        );

        // Image: Ken Burns while panel reveals
        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.14 },
            {
              scale: 1.0,
              duration: 1.8,
              ease: 'power2.out',
              delay: i * 0.1,
              scrollTrigger: {
                trigger: panel,
                start: 'top 88%',
                toggleActions: 'play none none none',
                once: true,
              } satisfies ScrollTrigger.Vars,
            }
          );
        }

        // Card overlay rises with blur
        if (card) {
          gsap.fromTo(
            card,
            { opacity: 0, y: 32, filter: 'blur(8px)' },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.8,
              ease: 'power3.out',
              delay: i * 0.1 + 0.4,
              scrollTrigger: {
                trigger: panel,
                start: 'top 88%',
                toggleActions: 'play none none none',
                once: true,
              } satisfies ScrollTrigger.Vars,
            }
          );
        }

        // Decorative line expands
        if (line) {
          gsap.fromTo(
            line,
            { scaleX: 0, transformOrigin: 'left center' },
            {
              scaleX: 1,
              duration: 0.5,
              ease: 'power2.inOut',
              delay: i * 0.1 + 0.7,
              scrollTrigger: {
                trigger: panel,
                start: 'top 88%',
                toggleActions: 'play none none none',
                once: true,
              } satisfies ScrollTrigger.Vars,
            }
          );
        }

        // Parallax scroll on image
        if (img) {
          gsap.to(img, {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5,
            } satisfies ScrollTrigger.Vars,
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const topPanels = panels.slice(0, 2);
  const bottomPanels = panels.slice(2);

  const renderPanel = (panel: LifestylePanel, i: number, heightClass: string) => (
    <div
      key={i}
      ref={(el) => { panelRefs.current[i] = el; }}
      className={`relative overflow-hidden group ${heightClass}`}
      style={{ willChange: 'clip-path, opacity' }}
    >
      {/* Image with parallax target */}
      <div
        data-panel-img
        className="absolute inset-[-8%] will-change-transform"
      >
        <Image
          src={panel.image}
          alt={panel.category}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {/* Gradient overlay — deepens on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1918]/75 via-[#1A1918]/20 to-transparent transition-opacity duration-700 group-hover:opacity-90" />

      {/* Top gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1918]/20 to-transparent pointer-events-none" />

      {/* Corner index */}
      <span className="absolute top-5 right-5 text-[9px] uppercase tracking-[0.3em] text-[#FAF7F2]/30 font-medium pointer-events-none">
        0{i + 1}
      </span>

      {/* Content card */}
      <div
        data-panel-card
        className="absolute bottom-0 left-0 right-0 p-6 md:p-8"
        style={{ willChange: 'opacity, transform, filter' }}
      >
        <span
          data-panel-line
          className="mb-4 block h-[1px] w-10 bg-[#FAF7F2]/60"
          style={{ willChange: 'transform' }}
        />
        {panel.subtitle && (
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#FAF7F2]/65 mb-1.5 font-medium">
            {panel.subtitle}
          </p>
        )}
        <h2 className="font-['Italiana',serif] text-xl md:text-2xl text-[#FAF7F2] uppercase tracking-[0.08em] mb-5 leading-tight">
          {panel.category}
        </h2>
        <Link
          href={panel.href}
          className="inline-flex items-center gap-2.5 group/cta"
        >
          <span className="relative text-[10px] uppercase tracking-[0.22em] font-semibold text-[#FAF7F2] overflow-hidden">
            {panel.cta}
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#FAF7F2]/60 scale-x-0 group-hover/cta:scale-x-100 transition-transform duration-300 origin-left" />
          </span>
          <span className="flex items-center justify-center w-7 h-7 border border-[#FAF7F2]/40 group-hover/cta:border-[#FAF7F2] group-hover/cta:bg-[#FAF7F2]/15 transition-all duration-300">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#FAF7F2" strokeWidth="1.5">
              <path d="M1 5h8M6 2l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>
      </div>

      {/* Hover zoom overlay — subtle scale */}
      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.02] pointer-events-none" />
    </div>
  );

  return (
    <section ref={sectionRef} className="bg-[#1A1918] py-3 px-3 md:py-4 md:px-4">
      {/* Section header */}
      <div className="flex items-center justify-between max-w-[1920px] mx-auto mb-3 md:mb-4 px-1">
        <div className="flex items-center gap-4">
          <span className="h-[1px] w-8 bg-[#EADFD4]/40" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#EADFD4]/50 font-medium">
            Koleksi Editorial
          </span>
        </div>
        <Link
          href="/id/new-arrivals"
          className="text-[10px] uppercase tracking-[0.22em] text-[#EADFD4]/50 hover:text-[#EADFD4] transition-colors duration-200 font-medium"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="flex flex-col gap-3 md:gap-4 w-full max-w-[1920px] mx-auto">
        {/* Top row: 2 large panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {topPanels.map((panel, i) => renderPanel(panel, i, 'relative h-[70vw] md:h-[58vw] max-h-[720px] min-h-[320px]'))}
        </div>
        {/* Bottom row: up to 3 smaller panels */}
        {bottomPanels.length > 0 && (
          <div className={`grid grid-cols-1 gap-3 md:gap-4 ${bottomPanels.length === 1 ? 'md:grid-cols-1' : bottomPanels.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
            {bottomPanels.map((panel, i) => renderPanel(panel, i + 2, 'relative h-[60vw] md:h-[42vw] max-h-[520px] min-h-[260px]'))}
          </div>
        )}
      </div>
    </section>
  );
}
