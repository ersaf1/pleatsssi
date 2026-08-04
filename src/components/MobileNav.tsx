"use client";

import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
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
] as const;

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 xl:hidden",
          "transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 xl:hidden",
          "flex flex-col",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <Link
            href="/"
            onClick={onClose}
            className="font-bold uppercase tracking-widest text-base text-black"
          >
            CHARLES &amp; KEITH
          </Link>
          <button
            onClick={onClose}
            aria-label="Close navigation menu"
            className="p-1 text-black hover:text-gray-600 transition-colors"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto">
          <ul role="list">
            {NAV_ITEMS.map((item) => (
              <li key={item.href} className="border-b border-gray-100">
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between px-5 py-4",
                    "text-[13px] uppercase tracking-wider font-normal",
                    "transition-colors",
                    'isSale' in item && item.isSale
                      ? "text-red-600 hover:text-red-700"
                      : "text-[#333] hover:text-black"
                  )}
                >
                  <span>{item.label}</span>
                  <ChevronRight size={16} strokeWidth={1.5} className="text-gray-400 flex-shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
