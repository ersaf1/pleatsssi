'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from '@/lib/gsap';

/**
 * PageTransition — mounts a full-screen cream overlay that:
 *  - plays OUT (reveal → wipe away) on initial load
 *  - plays IN (fill) → OUT (reveal) on every route change
 *
 * Overlay uses a clip-path so the wipe feels like a luxury fabric drape.
 */
export function PageTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    const overlay = overlayRef.current;
    const logo = logoRef.current;
    if (!overlay || !logo) return;

    if (isFirstRender.current) {
      // ── Initial page load: wipe away upward ──
      isFirstRender.current = false;
      gsap.set(overlay, { clipPath: 'inset(0% 0% 0% 0%)', pointerEvents: 'all' });
      gsap.set(logo, { opacity: 0, y: 12 });

      const tl = gsap.timeline();
      tl.to(logo, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', delay: 0.1 })
        .to(logo, { opacity: 0, duration: 0.25, delay: 0.3 }, '>')
        .to(
          overlay,
          {
            clipPath: 'inset(0% 0% 100% 0%)',
            duration: 0.7,
            ease: 'expo.inOut',
            onComplete: () => {
              gsap.set(overlay, { pointerEvents: 'none' });
            },
          },
          '-=0.1'
        );
    } else {
      // ── Route change: fill UP then wipe UP away ──
      gsap.set(overlay, { clipPath: 'inset(100% 0% 0% 0%)', pointerEvents: 'all' });
      gsap.set(logo, { opacity: 0, y: 8 });

      const tl = gsap.timeline();
      tl.to(overlay, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.45,
        ease: 'expo.in',
      })
        .to(logo, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }, '-=0.05')
        .to(logo, { opacity: 0, duration: 0.15, delay: 0.2 }, '>')
        .to(
          overlay,
          {
            clipPath: 'inset(0% 0% 100% 0%)',
            duration: 0.5,
            ease: 'expo.inOut',
            onComplete: () => {
              gsap.set(overlay, { pointerEvents: 'none' });
            },
          },
          '-=0.05'
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9998] flex items-center justify-center bg-[#FAF7F2]"
      style={{ clipPath: 'inset(0% 0% 100% 0%)' }}
    >
      <span
        ref={logoRef}
        className="font-['Italiana',serif] text-3xl uppercase tracking-[0.4em] text-[#1A1918] opacity-0 select-none"
      >
        PLEATSSSI
      </span>
    </div>
  );
}
