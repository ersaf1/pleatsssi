'use client';

import Link from 'next/link';
import { X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavItem } from './Header';
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: 'PRODUK BARU', href: '/id/new-arrivals' },
  { label: 'ROK', href: '/id/skirts' },
  { label: 'ATASAN', href: '/id/tops' },
  { label: 'CELANA', href: '/id/pants' },
  { label: 'TRENDING NOW', href: '/id/trending-now' },
  { label: 'STORIES', href: '/id/press/editorials' },
  { label: 'SALE', href: '/id/sale', isSale: true },
];

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navItems?: NavItem[];
}

export function MobileNav({ isOpen, onClose, navItems = DEFAULT_NAV_ITEMS }: MobileNavProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const drawer = drawerRef.current;
    const backdrop = backdropRef.current;
    const items = itemsRef.current
      ? Array.from(itemsRef.current.querySelectorAll('li'))
      : [];

    if (!drawer || !backdrop) return;

    if (isOpen) {
      // Open: drawer slides in + backdrop fades + items stagger
      gsap.set(drawer, { x: '-100%' });
      gsap.set(backdrop, { opacity: 0, pointerEvents: 'auto' });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to(backdrop, { opacity: 1, duration: 0.25 })
        .to(drawer, { x: '0%', duration: 0.38 }, '-=0.15')
        .fromTo(
          items,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.3, stagger: 0.04 },
          '-=0.1'
        );
    } else {
      // Close: items fade out then drawer slides out
      const tl = gsap.timeline({ defaults: { ease: 'power2.in' } });
      tl.to(items, { opacity: 0, x: -12, duration: 0.15, stagger: 0.02 })
        .to(drawer, { x: '-100%', duration: 0.28 }, '-=0.05')
        .to(backdrop, { opacity: 0, duration: 0.2, onComplete: () => {
          gsap.set(backdrop, { pointerEvents: 'none' });
        }}, '-=0.15');
    }
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-black/50 z-40 xl:hidden opacity-0 pointer-events-none"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={cn(
          'fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-[#FAF7F2] z-50 xl:hidden',
          'flex flex-col border-r border-[#EADFD4]',
          '-translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EADFD4]">
          <Link
            href="/"
            onClick={onClose}
            className="font-['Italiana',serif] uppercase tracking-[0.25em] text-xl text-[#1A1918] transition-all hover:tracking-[0.35em] duration-300"
          >
            PLEATSSSI
          </Link>
          <button
            onClick={onClose}
            aria-label="Close navigation menu"
            className="p-1 text-[#1A1918] hover:text-[#0B4F3A] transition-all hover:scale-110 active:scale-90"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto">
          <ul ref={itemsRef} role="list">
            {navItems.map((item) => (
              <li key={item.href} className="border-b border-[#EADFD4]/60">
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center justify-between px-5 py-4',
                    'text-[12px] uppercase tracking-[0.15em] font-medium',
                    'transition-all duration-200 group',
                    item.isSale
                      ? 'text-[#0B4F3A] font-semibold hover:text-[#073628] hover:bg-[#F5F0E6]'
                      : 'text-[#1A1918] hover:text-[#0B4F3A] hover:bg-[#F5F0E6]'
                  )}
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">{item.label}</span>
                  <ChevronRight
                    size={16}
                    strokeWidth={1.5}
                    className="text-[#786E65] flex-shrink-0 group-hover:translate-x-1 group-hover:text-[#0B4F3A] transition-all duration-200"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
