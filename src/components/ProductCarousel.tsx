'use client';

import { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '@/data/products';
import { ProductCard } from './ProductCard';
import { gsap, ScrollTrigger } from '@/lib/gsap';

interface ProductCarouselProps {
  title: string;
  products: Product[];
}

export function ProductCarousel({ title, products }: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const lineLeftRef = useRef<HTMLSpanElement>(null);
  const lineRightRef = useRef<HTMLSpanElement>(null);
  const leftBtnRef = useRef<HTMLButtonElement>(null);
  const rightBtnRef = useRef<HTMLButtonElement>(null);

  const scroll = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.75, behavior: 'smooth' });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = titleWrapRef.current
        ? Array.from(titleWrapRef.current.querySelectorAll<HTMLElement>('[data-word]'))
        : [];

      // Set initial state for all words — hidden below mask
      gsap.set(words, { y: '110%', opacity: 0 });
      gsap.set([lineLeftRef.current, lineRightRef.current], { scaleX: 0, opacity: 0 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

          // 1. Words cascade UP from clip mask — editorial stagger
          tl.to(words, {
            y: '0%',
            opacity: 1,
            duration: 0.9,
            stagger: {
              each: 0.07,
              ease: 'power2.out',
            },
          })
            // 2. Decorative lines grow outward from center simultaneously
            .to(
              [lineLeftRef.current, lineRightRef.current],
              {
                scaleX: 1,
                opacity: 1,
                duration: 0.6,
                ease: 'power3.inOut',
              },
              '-=0.4'
            )
            // 3. Nav arrows drop in
            .fromTo(
              [leftBtnRef.current, rightBtnRef.current].filter(Boolean),
              { opacity: 0, scale: 0.5, rotate: -15 },
              {
                opacity: 1,
                scale: 1,
                rotate: 0,
                duration: 0.45,
                ease: 'back.out(2)',
                stagger: 0.08,
              },
              '-=0.3'
            );
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (products.length === 0) return null;

  // Split title into individual words for per-word animation
  const words = title.trim().split(/\s+/);

  return (
    <section ref={sectionRef} className="mx-auto w-full max-w-[1600px] px-4 py-12 xl:px-8">
      {/* ── Title with masked word reveal + decorative lines ── */}
      <div className="mb-10 flex items-center gap-4 md:gap-6">
        {/* Left decorative line — grows from right (origin-right) */}
        <span
          ref={lineLeftRef}
          className="hidden md:block flex-1 h-px bg-gradient-to-r from-transparent to-[#EADFD4] origin-right"
          aria-hidden="true"
        />

        {/* Title words wrapped in overflow:hidden clips */}
        <div
          ref={titleWrapRef}
          className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-0"
          aria-label={title}
        >
          {words.map((word, i) => (
            <div key={i} className="overflow-hidden leading-none pb-1">
              <span
                data-word
                className="block font-['Italiana',serif] text-2xl font-normal uppercase tracking-[0.22em] text-[#1A1918] md:text-3xl"
              >
                {word}
              </span>
            </div>
          ))}
        </div>

        {/* Right decorative line — grows from left (origin-left) */}
        <span
          ref={lineRightRef}
          className="hidden md:block flex-1 h-px bg-gradient-to-l from-transparent to-[#EADFD4] origin-left"
          aria-hidden="true"
        />
      </div>

      {/* ── Track + Nav ── */}
      <div className="group relative">
        <button
          ref={leftBtnRef}
          type="button"
          aria-label="Geser ke kiri"
          onClick={() => scroll(-1)}
          className="absolute -left-4 top-[40%] z-10 hidden h-11 w-11 items-center justify-center rounded-full border border-[#EADFD4] bg-[#FAF7F2]/90 text-[#1A1918] shadow-sm backdrop-blur-sm transition-all hover:border-[#0B4F3A]/60 hover:bg-[#F5F0E6] hover:text-[#0B4F3A] hover:scale-110 active:scale-95 md:flex"
        >
          <ChevronLeft size={20} strokeWidth={1.5} />
        </button>

        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] md:gap-8 [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              animDelay={i * 0.08}
              className="w-[45%] flex-shrink-0 snap-start sm:w-[40%] md:w-[30%] xl:w-[23.5%]"
            />
          ))}
        </div>

        <button
          ref={rightBtnRef}
          type="button"
          aria-label="Geser ke kanan"
          onClick={() => scroll(1)}
          className="absolute -right-4 top-[40%] z-10 hidden h-11 w-11 items-center justify-center rounded-full border border-[#EADFD4] bg-[#FAF7F2]/90 text-[#1A1918] shadow-sm backdrop-blur-sm transition-all hover:border-[#0B4F3A]/60 hover:bg-[#F5F0E6] hover:text-[#0B4F3A] hover:scale-110 active:scale-95 md:flex"
        >
          <ChevronRight size={20} strokeWidth={1.5} />
        </button>
      </div>
    </section>
  );
}
