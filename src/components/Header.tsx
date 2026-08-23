'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, Menu, User, Heart, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MobileNav } from './MobileNav';
import { AnnouncementBanner } from './AnnouncementBanner';
import { CartDrawer } from './CartDrawer';
import { AuthModal } from './AuthModal';
import { supabaseBrowserClient } from '@/lib/supabaseClient';
import { gsap } from '@/lib/gsap';
import { useCartStore } from '@/store/useCartStore';

export interface NavItem {
  label: string;
  href: string;
  isSale?: boolean;
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: 'PRODUK BARU', href: '/id/new-arrivals' },
  { label: 'ROK', href: '/id/skirts' },
  { label: 'ATASAN', href: '/id/tops' },
  { label: 'CELANA', href: '/id/pants' },
  { label: 'TRENDING NOW', href: '/id/trending-now' },
  { label: 'STORIES', href: '/id/press/editorials' },
  { label: 'SALE', href: '/id/sale', isSale: true },
];

const NAV_LINK_BASE =
  'text-[12px] uppercase tracking-[0.15em] px-3 py-2.5 transition-colors relative group font-medium';

interface HeaderProps {
  navItems?: NavItem[];
}

export function Header({ navItems = DEFAULT_NAV_ITEMS }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const cartBtnRef = useRef<HTMLButtonElement>(null);

  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  useEffect(() => {
    supabaseBrowserClient.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setCurrentUser(user.user_metadata?.name || user.email || 'Pelanggan');
      }
    });

    const { data: { subscription } } = supabaseBrowserClient.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user.user_metadata?.name || session.user.email || 'Pelanggan');
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /* ── Bounce cart icon when count changes ── */
  useEffect(() => {
    if (itemCount > 0 && cartBtnRef.current) {
      gsap.fromTo(
        cartBtnRef.current,
        { scale: 1 },
        { scale: 1.25, duration: 0.15, ease: 'power2.out', yoyo: true, repeat: 1 }
      );
    }
  }, [itemCount]);

  /* ── Mount animation ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(headerRef.current, { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
        .fromTo(logoRef.current, { opacity: 0, y: -12, letterSpacing: '0.5em' }, { opacity: 1, y: 0, letterSpacing: '0.25em', duration: 0.6 }, '-=0.3')
        .fromTo(iconsRef.current, { opacity: 0, x: 16 }, { opacity: 1, x: 0, duration: 0.5 }, '-=0.4')
        .fromTo(
          navRef.current ? Array.from(navRef.current.querySelectorAll('li')) : [],
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 },
          '-=0.3'
        );
    });
    return () => ctx.revert();
  }, []);

  const CartButton = ({ className }: { className?: string }) => (
    <button
      ref={cartBtnRef}
      aria-label={`Keranjang belanja, ${itemCount} item`}
      onClick={() => setIsCartOpen(true)}
      className={cn(
        'relative p-2 text-[#1A1918] hover:text-[#0B4F3A] transition-all hover:scale-110 active:scale-90',
        className
      )}
      style={{ willChange: 'transform' }}
    >
      <ShoppingBag size={20} strokeWidth={1.5} />
      {itemCount > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0B4F3A] text-[#FAF7F2] text-[10px] font-semibold leading-none tabular-nums"
        >
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </button>
  );

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-50">
        <AnnouncementBanner />
        <div className="backdrop-blur-md bg-[#FAF7F2]/92 border-b border-[#EADFD4] transition-colors duration-300 shadow-[0_1px_12px_rgba(26,25,24,0.06)]">

          {/* ── Top row ── */}
          <div className="flex items-center h-[64px] px-4 xl:px-8">
            {/* Left */}
            <div className="flex-1 flex items-center">
              <button aria-label="Cari produk" className="hidden xl:flex items-center justify-center p-1.5 text-[#1A1918] hover:text-[#0B4F3A] transition-colors hover:scale-110 active:scale-95">
                <Search size={20} strokeWidth={1.5} />
              </button>
              <button
                aria-label="Buka menu navigasi"
                onClick={() => setIsMenuOpen(true)}
                className="flex xl:hidden items-center justify-center p-1.5 text-[#1A1918] hover:text-[#0B4F3A] transition-all hover:scale-110 active:scale-95"
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Center — logo */}
            <div className="flex-1 flex justify-center">
              <Link
                ref={logoRef}
                href="/"
                className="font-['Italiana',serif] text-2xl xl:text-3xl text-[#1A1918] tracking-[0.25em] uppercase whitespace-nowrap transition-all duration-300 hover:opacity-75 hover:tracking-[0.32em]"
              >
                PLEATSSSI
              </Link>
            </div>

            {/* Right */}
            <div ref={iconsRef} className="flex-1 flex items-center justify-end gap-1">
              {/* Desktop */}
              <div className="hidden xl:flex items-center gap-1">
                <button aria-label="Indonesia" className="px-2.5 py-1 text-[12px] uppercase tracking-[0.15em] text-[#1A1918] hover:text-[#0B4F3A] transition-colors font-medium">
                  ID
                </button>
                <button aria-label="Wishlist" className="p-2 text-[#1A1918] hover:text-[#0B4F3A] transition-all hover:scale-110 active:scale-90">
                  <Heart size={20} strokeWidth={1.5} />
                </button>
                {/* User Account Button & Dropdown */}
                <div className="relative">
                  <button
                    aria-label="Akun saya"
                    onClick={() => {
                      if (!currentUser) {
                        setIsAuthOpen(true);
                      } else {
                        setIsUserMenuOpen(!isUserMenuOpen);
                      }
                    }}
                    className={cn(
                      "p-2 text-[#1A1918] hover:text-[#0B4F3A] transition-all hover:scale-110 active:scale-90 flex items-center gap-1",
                      currentUser && "text-[#0B4F3A]"
                    )}
                  >
                    <User size={20} strokeWidth={1.5} />
                    {currentUser && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider max-w-[80px] truncate">
                        {currentUser.split(' ')[0]}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Menu when logged in */}
                  {currentUser && isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#FAF7F2] border border-[#EADFD4] shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-4 py-2 border-b border-[#EADFD4]">
                        <p className="text-[10px] uppercase tracking-wider text-[#786E65]">Masuk Sebagai</p>
                        <p className="text-xs font-semibold text-[#1A1918] truncate">{currentUser}</p>
                      </div>
                      <button
                        onClick={async () => {
                          await supabaseBrowserClient.auth.signOut();
                          setCurrentUser(null);
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-[#8C2323] hover:bg-[#8C2323]/10 font-semibold transition-colors uppercase tracking-wider"
                      >
                        Keluar (Logout)
                      </button>
                    </div>
                  )}
                </div>
                <CartButton />
              </div>

              {/* Mobile */}
              <div className="flex xl:hidden items-center gap-1">
                <button
                  aria-label="Akun saya"
                  onClick={() => {
                    if (!currentUser) {
                      setIsAuthOpen(true);
                    } else {
                      setIsUserMenuOpen(!isUserMenuOpen);
                    }
                  }}
                  className={cn(
                    "p-2 text-[#1A1918] hover:text-[#0B4F3A] transition-all hover:scale-110 active:scale-90",
                    currentUser && "text-[#0B4F3A]"
                  )}
                >
                  <User size={20} strokeWidth={1.5} />
                </button>
                <button aria-label="Cari produk" className="p-2 text-[#1A1918] hover:text-[#0B4F3A] transition-all hover:scale-110 active:scale-90">
                  <Search size={20} strokeWidth={1.5} />
                </button>
                <CartButton />
              </div>
            </div>
          </div>

          {/* ── Nav row (desktop) ── */}
          <nav
            ref={navRef}
            className="hidden xl:flex items-center justify-center border-t border-[#EADFD4]/60 px-8"
            aria-label="Navigasi utama"
          >
            <ul className="flex items-center gap-1" role="list">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      NAV_LINK_BASE,
                      item.isSale
                        ? 'text-[#0B4F3A] font-semibold hover:text-[#073628]'
                        : 'text-[#1A1918] hover:text-[#0B4F3A]'
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-3 right-3 h-[1.5px] bg-[#0B4F3A] scale-x-0 group-hover:scale-x-100 transition-transform duration-250 origin-left"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <MobileNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} navItems={navItems} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
