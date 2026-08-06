"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, User, Heart, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileNav } from "./MobileNav";
import { AnnouncementBanner } from "./AnnouncementBanner";

interface NavItem {
  label: string;
  href: string;
  isSale?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "PRODUK BARU", href: "/id/new-arrivals" },
  { label: "ROK", href: "/id/skirts" },
  { label: "ATASAN", href: "/id/tops" },
  { label: "CELANA", href: "/id/pants" },
  { label: "TRENDING NOW", href: "/id/trending-now" },
  { label: "STORIES", href: "/id/press/editorials" },
  { label: "SALE", href: "/id/sale", isSale: true },
];

const NAV_LINK_BASE =
  "text-[12px] uppercase tracking-[0.15em] px-3 py-2.5 transition-colors relative group font-medium";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50">
        <AnnouncementBanner />

        <div
          className={cn(
            "backdrop-blur-md bg-[#FAF7F2]/90 border-b border-[#EADFD4] transition-colors duration-300 shadow-sm"
          )}
        >
          {/* ── Top row ─────────────────────────────────────────────── */}
          <div className="flex items-center h-[64px] px-4 xl:px-8">
            {/* Left — desktop: search icon | mobile: hamburger */}
            <div className="flex-1 flex items-center">
              {/* Desktop search */}
              <button
                aria-label="Search"
                className="hidden xl:flex items-center justify-center p-1.5 text-[#1A1918] hover:text-[#0B4F3A] transition-colors"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>

              {/* Mobile hamburger */}
              <button
                aria-label="Open navigation menu"
                onClick={() => setIsMenuOpen(true)}
                className="flex xl:hidden items-center justify-center p-1.5 text-[#1A1918] hover:text-[#0B4F3A] transition-colors"
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Center — logo */}
            <div className="flex-1 flex justify-center">
              <Link
                href="/"
                className="font-['Italiana',serif] text-2xl xl:text-3xl text-[#1A1918] tracking-[0.25em] uppercase whitespace-nowrap transition-opacity hover:opacity-80"
              >
                PLEATSSSI
              </Link>
            </div>

            {/* Right — desktop: country + icons | mobile: search + cart */}
            <div className="flex-1 flex items-center justify-end gap-1">
              {/* Desktop utility icons */}
              <div className="hidden xl:flex items-center gap-1">
                {/* Country selector */}
                <button
                  aria-label="Select country: Indonesia"
                  className="px-2.5 py-1 text-[12px] uppercase tracking-[0.15em] text-[#1A1918] hover:text-[#0B4F3A] transition-colors font-medium"
                >
                  ID
                </button>

                {/* Wishlist */}
                <button
                  aria-label="Wishlist"
                  className="p-2 text-[#1A1918] hover:text-[#0B4F3A] transition-colors"
                >
                  <Heart size={20} strokeWidth={1.5} />
                </button>

                {/* Account */}
                <button
                  aria-label="My account"
                  className="p-2 text-[#1A1918] hover:text-[#0B4F3A] transition-colors"
                >
                  <User size={20} strokeWidth={1.5} />
                </button>

                {/* Cart */}
                <button
                  aria-label="Shopping bag, 0 items"
                  className="relative p-2 text-[#1A1918] hover:text-[#0B4F3A] transition-colors"
                >
                  <ShoppingBag size={20} strokeWidth={1.5} />
                  <span
                    aria-hidden="true"
                    className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0B4F3A] text-[#FAF7F2] text-[10px] font-semibold leading-none"
                  >
                    0
                  </span>
                </button>
              </div>

              {/* Mobile: search + cart */}
              <div className="flex xl:hidden items-center gap-1">
                <button
                  aria-label="Search"
                  className="p-2 text-[#1A1918] hover:text-[#0B4F3A] transition-colors"
                >
                  <Search size={20} strokeWidth={1.5} />
                </button>
                <button
                  aria-label="Shopping bag, 0 items"
                  className="relative p-2 text-[#1A1918] hover:text-[#0B4F3A] transition-colors"
                >
                  <ShoppingBag size={20} strokeWidth={1.5} />
                  <span
                    aria-hidden="true"
                    className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0B4F3A] text-[#FAF7F2] text-[10px] font-semibold leading-none"
                  >
                    0
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* ── Nav row (desktop only) ───────────────────────────────── */}
          <nav
            className="hidden xl:flex items-center justify-center border-t border-[#EADFD4]/60 px-8"
            aria-label="Main navigation"
          >
            <ul className="flex items-center gap-1" role="list">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      NAV_LINK_BASE,
                      item.isSale
                        ? "text-[#0B4F3A] font-semibold hover:text-[#073628]"
                        : "text-[#1A1918] hover:text-[#0B4F3A]"
                    )}
                  >
                    {item.label}
                    {/* hover underline */}
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#0B4F3A] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* Mobile slide-in drawer */}
      <MobileNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}

