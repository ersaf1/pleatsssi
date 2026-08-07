'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

const MESSAGES = [
  'Bea Cukai & Pajak Dibayar. Tidak Ada Biaya Tersembunyi Saat Pembayaran',
  'Nikmati Gratis Pengiriman atau ambil pesanan di toko',
  'Beli Sekarang, Bayar Nanti dengan Cicilan 0% Atome',
  'Gratis Pengiriman untuk Area JABODETABEK*',
  'Pengembalian Tanpa Repot Dalam Waktu 30 Hari Pemesanan',
] as const;

export function AnnouncementBanner() {
  const indexRef = useRef(0);
  const textRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── Mount animation ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.1 }
      );
    });
    return () => ctx.revert();
  }, []);

  /* ── Rotating message animation via GSAP ── */
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const interval = setInterval(() => {
      // Fade + slide out
      gsap.to(el, {
        opacity: 0,
        y: -10,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          indexRef.current = (indexRef.current + 1) % MESSAGES.length;
          el.textContent = MESSAGES[indexRef.current];
          // Fade + slide in
          gsap.fromTo(
            el,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
          );
        },
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="hidden xl:flex items-center justify-center w-full h-10 bg-[#0B4F3A] overflow-hidden"
      aria-live="polite"
      aria-atomic="true"
    >
      <p
        ref={textRef}
        className="text-[#FAF7F2] text-[12px] font-medium tracking-[0.18em] uppercase text-center px-4"
      >
        {MESSAGES[0]}
      </p>
    </div>
  );
}
