'use client';

import Image from 'next/image';
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
  {
    image: '/images/lifestyle-shoes.png',
    category: 'Shoes Collection',
    subtitle: 'Koleksi Sepatu',
    cta: 'Belanja Sekarang',
    href: '#',
  },
  {
    image: '/images/lifestyle-new.png',
    category: 'New This Week',
    subtitle: 'Rilisan Terbaru',
    cta: 'Belanja Sekarang',
    href: '#',
  },
];

export function DualLifestyleBanner({ panels = FALLBACK_PANELS }: DualLifestyleBannerProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      panelRefs.current.forEach((panel, i) => {
        if (!panel) return;

        // Panel slides in from alternating sides
        gsap.fromTo(
          panel,
          { opacity: 0, x: i % 2 === 0 ? -60 : 60, scale: 0.96 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            delay: i * 0.12,
            scrollTrigger: {
              trigger: panel,
              start: 'top 85%',
              toggleActions: 'play none none none',
              once: true,
            } satisfies ScrollTrigger.Vars,
          }
        );

        // Overlay card rises up
        const card = panel.querySelector<HTMLElement>('[data-panel-card]');
        if (card) {
          gsap.fromTo(
            card,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              delay: 0.2 + i * 0.12,
              scrollTrigger: {
                trigger: panel,
                start: 'top 85%',
                toggleActions: 'play none none none',
                once: true,
              } satisfies ScrollTrigger.Vars,
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#FAF7F2] p-4 md:p-8 border-b border-[#EADFD4]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full max-w-[1920px] mx-auto">
        {panels.map((panel, i) => (
          <a
            key={panel.category}
            ref={(el) => { panelRefs.current[i] = el; }}
            href={panel.href}
            className="relative block overflow-hidden group border border-[#EADFD4] rounded-sm bg-[#F5F0E6] will-change-transform"
          >
            <div className="overflow-hidden w-full">
              <Image
                src={panel.image}
                alt={panel.category}
                width={960}
                height={640}
                className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div
              data-panel-card
              className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 bg-[#FAF7F2]/95 backdrop-blur-md p-5 md:p-6 border border-[#EADFD4] shadow-md rounded-sm transition-all duration-500 group-hover:shadow-xl group-hover:bg-[#FAF7F2]"
            >
              {panel.subtitle && (
                <p className="text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#786E65] font-medium mb-1">
                  {panel.subtitle}
                </p>
              )}
              <h2 className="font-['Italiana',serif] text-xl md:text-2xl text-[#1A1918] uppercase tracking-[0.15em] font-normal mb-3">
                {panel.category}
              </h2>
              <span className="inline-flex items-center gap-2 text-[11px] md:text-[12px] uppercase tracking-[0.2em] font-medium text-[#0B4F3A] group-hover:text-[#073628] transition-all duration-300 border-b border-[#0B4F3A]/40 pb-0.5 group-hover:gap-3">
                {panel.cta}
                <svg
                  className="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 12 12"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path d="M1 6h10M7 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
