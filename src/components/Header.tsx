"use client";

import { useState, useEffect } from "react";
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
  { label: "SEPATU", href: "/id/shoes" },
  { label: "TAS", href: "/id/bags" },
  { label: "DOMPET", href: "/id/wallets" },
  { label: "AKSESORI", href: "/id/accessories" },
  { label: "KOLEKSI ANAK-ANAK", href: "/id/kids" },
  { label: "GIFTS", href: "/id/curated/gifts" },
  { label: "TRENDING NOW", href: "/id/trending-now" },
  { label: "STORIES", href: "/id/press/editorials" },
  { label: "SALE", href: "/id/sale", isSale: true },
];

const NAV_LINK_BASE =
  "text-[13px] uppercase tracking-wider px-3 py-2 transition-colors relative group";

interface HeaderProps {
  /**
   * overlay — transparan di atas hero (homepage), berubah putih saat scroll.
   * solid   — selalu putih dengan teks hitam (halaman dalam).
   */
  theme?: "overlay" | "solid";
}

export function Header({ theme = "overlay" }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isSolidTheme = theme === "solid";
  const dark = isSolidTheme || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Sticky header: announcement banner in flow, logo+nav absolutely overlays the hero below */}
      <header className="sticky top-0 z-50">
        {/* Announcement banner — in flow (gray strip, desktop only) */}
        <AnnouncementBanner />

        {/* Logo row + nav — absolute so it overlays the hero image (overlay theme) */}
        <div
          className={cn(
            "inset-x-0 transition-colors duration-300",
            !isSolidTheme && "absolute",
            dark ? "bg-white border-b border-gray-100" : "bg-transparent border-b border-transparent"
          )}
        >
          {/* ── Top row ─────────────────────────────────────────────── */}
          <div className="flex items-center h-[60px] px-4 xl:px-8">
            {/* Left — desktop: search icon | mobile: hamburger */}
            <div className="flex-1 flex items-center">
              {/* Desktop search */}
              <button
                aria-label="Search"
                className={cn("hidden xl:flex items-center justify-center p-1 transition-colors", dark ? "text-black hover:text-gray-600" : "text-white hover:text-gray-200")}
              >
                <Search size={20} strokeWidth={1.5} />
              </button>

              {/* Mobile hamburger */}
              <button
                aria-label="Open navigation menu"
                onClick={() => setIsMenuOpen(true)}
                className={cn("flex xl:hidden items-center justify-center p-1 transition-colors", dark ? "text-black hover:text-gray-600" : "text-white hover:text-gray-200")}
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Center — logo */}
            <div className="flex-1 flex justify-center">
              <Link
                href="/"
                className={cn("font-bold uppercase tracking-widest text-lg whitespace-nowrap transition-colors", dark ? "text-black" : "text-white")}
              >
                CHARLES &amp; KEITH
              </Link>
            </div>

            {/* Right — desktop: country + icons | mobile: search + cart */}
            <div className="flex-1 flex items-center justify-end gap-1">
              {/* Desktop utility icons */}
              <div className="hidden xl:flex items-center gap-1">
                {/* Country selector */}
                <button
                  aria-label="Select country: Indonesia"
                  className={cn("px-2 py-1 text-[13px] uppercase tracking-wider transition-colors font-normal", dark ? "text-[#333] hover:text-black" : "text-white hover:text-gray-200")}
                >
                  ID
                </button>

                {/* Wishlist */}
                <button
                  aria-label="Wishlist"
                  className={cn("p-2 transition-colors", dark ? "text-black hover:text-gray-600" : "text-white hover:text-gray-200")}
                >
                  <Heart size={20} strokeWidth={1.5} />
                </button>

                {/* Account */}
                <button
                  aria-label="My account"
                  className={cn("p-2 transition-colors", dark ? "text-black hover:text-gray-600" : "text-white hover:text-gray-200")}
                >
                  <User size={20} strokeWidth={1.5} />
                </button>

                {/* Cart */}
                <button
                  aria-label="Shopping bag, 0 items"
                  className={cn("relative p-2 transition-colors", dark ? "text-black hover:text-gray-600" : "text-white hover:text-gray-200")}
                >
                  <ShoppingBag size={20} strokeWidth={1.5} />
                  <span
                    aria-hidden="true"
                    className={cn("absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-normal leading-none", dark ? "bg-black text-white" : "bg-white text-black")}
                  >
                    0
                  </span>
                </button>
              </div>

              {/* Mobile: search + cart */}
              <div className="flex xl:hidden items-center gap-1">
                <button
                  aria-label="Search"
                  className={cn("p-2 transition-colors", dark ? "text-black hover:text-gray-600" : "text-white hover:text-gray-200")}
                >
                  <Search size={20} strokeWidth={1.5} />
                </button>
                <button
                  aria-label="Shopping bag, 0 items"
                  className={cn("relative p-2 transition-colors", dark ? "text-black hover:text-gray-600" : "text-white hover:text-gray-200")}
                >
                  <ShoppingBag size={20} strokeWidth={1.5} />
                  <span
                    aria-hidden="true"
                    className={cn("absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-normal leading-none", dark ? "bg-black text-white" : "bg-white text-black")}
                  >
                    0
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* ── Nav row (desktop only) ───────────────────────────────── */}
          <nav
            className={cn("hidden xl:flex items-center justify-center border-t px-8", dark ? "border-gray-100" : "border-white/20")}
            aria-label="Main navigation"
          >
            <ul className="flex items-center" role="list">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      NAV_LINK_BASE,
                      item.isSale
                        ? "text-red-500 hover:text-red-400"
                        : dark ? "text-[#333] hover:text-black" : "text-white hover:text-gray-200"
                    )}
                  >
                    {item.label}
                    {/* hover underline */}
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-3 right-3 h-px bg-current scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
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
