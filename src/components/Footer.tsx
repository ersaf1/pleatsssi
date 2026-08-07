'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/pleatsssi/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12.073h2.54V9.845c0-2.522 1.492-3.915 3.777-3.915 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.988C20.343 21.128 24 16.991 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/pleatsssi/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@pleatsssi',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: 'Twitter/X',
    href: 'https://twitter.com/pleatsssi',
    icon: <X className="w-5 h-5" />,
  },
  {
    name: 'Pinterest',
    href: 'https://www.pinterest.com/pleatsssi',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@pleatsssi',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.84 1.56V6.8a4.85 4.85 0 01-1.07-.11z" />
      </svg>
    ),
  },
];

const navColumns = [
  {
    heading: 'Layanan Pelanggan',
    links: [
      { label: 'FAQ', href: '/id/faq' },
      { label: 'Pengiriman & Pelacakan', href: '/id/pengiriman-pelacakan' },
      { label: 'Pengembalian', href: '/id/pengembalian' },
      { label: 'Panduan Ukuran', href: '/id/panduan-ukuran' },
      { label: 'Perawatan Produk', href: '/id/perawatan-produk' },
      { label: 'Lokasi Toko', href: '/id/lokasi-toko' },
      { label: 'Hubungi Kami', href: '/id/hubungi-kami' },
    ],
  },
  {
    heading: 'Informasi',
    links: [
      { label: 'Terms of Use', href: '/id/terms-of-use' },
      { label: 'Privacy Policy', href: '/id/privacy-policy' },
      { label: 'Cookies Policy', href: '/id/cookies-policy' },
      { label: 'customer_care@ptkcg.co.id', href: 'mailto:customer_care@ptkcg.co.id' },
    ],
  },
];

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const newsletterRef = useRef<HTMLElement>(null);
  const socialRef = useRef<HTMLElement>(null);
  const colsRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inputRef.current) inputRef.current.value = '';
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Newsletter section reveals
      gsap.fromTo(
        newsletterRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: newsletterRef.current,
            start: 'top 90%',
            once: true,
          } satisfies ScrollTrigger.Vars,
        }
      );

      // Social icons stagger in
      const socials = socialRef.current
        ? Array.from(socialRef.current.querySelectorAll('a'))
        : [];
      gsap.fromTo(
        socials,
        { opacity: 0, y: 16, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: 'back.out(1.4)',
          stagger: 0.05,
          scrollTrigger: {
            trigger: socialRef.current,
            start: 'top 92%',
            once: true,
          } satisfies ScrollTrigger.Vars,
        }
      );

      // Nav columns stagger
      const cols = colsRef.current
        ? Array.from(colsRef.current.querySelectorAll('[data-footer-col]'))
        : [];
      gsap.fromTo(
        cols,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: colsRef.current,
            start: 'top 92%',
            once: true,
          } satisfies ScrollTrigger.Vars,
        }
      );

      // Bottom copyright
      gsap.fromTo(
        bottomRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: bottomRef.current,
            start: 'top 99%',
            once: true,
          } satisfies ScrollTrigger.Vars,
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="bg-[#F5F0E6] text-[#1A1918] font-sans text-[15px] w-full py-16 px-6 md:px-12 border-t border-[#EADFD4]"
    >
      <div className="xl:grid xl:grid-cols-2 xl:gap-16">
        {/* Left column: Newsletter + Social */}
        <div>
          {/* Newsletter */}
          <section ref={newsletterRef}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1A1918] mb-4">
              DAFTAR UNTUK MENDAPATKAN INFO FASHION TERBARU
            </h2>
            <form onSubmit={handleSubmit} className="flex">
              <input
                ref={inputRef}
                type="email"
                placeholder="Masukkan email anda di sini"
                required
                className="bg-[#FAF7F2] border border-[#EADFD4] px-4 py-2.5 text-sm flex-1 outline-none min-w-0 text-[#1A1918] placeholder:text-[#786E65] focus:border-[#0B4F3A] transition-all duration-300 focus:shadow-[0_0_0_2px_rgba(11,79,58,0.1)]"
              />
              <button
                type="submit"
                className="bg-[#0B4F3A] text-[#FAF7F2] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-[#073628] active:scale-[0.97] transition-all duration-200 whitespace-nowrap"
              >
                SUBSCRIBE
              </button>
            </form>
            <p className="text-xs text-[#786E65] mt-3 leading-relaxed">
              Dengan berlangganan, Anda menyetujui{' '}
              <Link href="/id/terms-of-use" className="underline text-[#1A1918] hover:text-[#0B4F3A] transition-colors">
                Syarat &amp; Ketentuan
              </Link>{' '}
              dan{' '}
              <Link href="/id/privacy-policy" className="underline text-[#1A1918] hover:text-[#0B4F3A] transition-colors">
                Kebijakan Privasi
              </Link>{' '}
              PLEATSSSI
            </p>
          </section>

          {/* Social Links */}
          <section ref={socialRef}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1A1918] mb-4 mt-10">
              IKUTI KAMI
            </h2>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="text-[#1A1918] hover:text-[#0B4F3A] transition-all duration-200 hover:scale-125 hover:-translate-y-1"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </section>
        </div>

        {/* Right column: Nav columns */}
        <div ref={colsRef} className="mt-12 xl:mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {navColumns.map((col) => (
              <div key={col.heading} data-footer-col>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1A1918] mb-4">
                  {col.heading}
                </h3>
                <ul>
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith('/') ? (
                        <Link
                          href={link.href}
                          className="text-sm text-[#786E65] hover:text-[#0B4F3A] block mb-2.5 transition-all duration-200 hover:translate-x-1"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          className="text-sm text-[#786E65] hover:text-[#0B4F3A] block mb-2.5 transition-all duration-200 hover:translate-x-1"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div ref={bottomRef} className="border-t border-[#EADFD4] mt-12 pt-8">
        <p className="text-xs text-[#786E65] text-center tracking-wider">
          &copy; PLEATSSSI 2026
        </p>
      </div>
    </footer>
  );
}
