"use client";

import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "PRODUK BARU", href: "/id/new-arrivals" },
  { label: "ROK", href: "/id/skirts" },
  { label: "ATASAN", href: "/id/tops" },
  { label: "CELANA", href: "/id/pants" },
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
          "fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-[#FAF7F2] z-50 xl:hidden",
          "flex flex-col border-r border-[#EADFD4]",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
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
            className="font-['Italiana',serif] uppercase tracking-[0.25em] text-xl text-[#1A1918]"
          >
            PLEATSSSI
          </Link>
          <button
            onClick={onClose}
            aria-label="Close navigation menu"
            className="p-1 text-[#1A1918] hover:text-[#0B4F3A] transition-colors"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto">
          <ul role="list">
            {NAV_ITEMS.map((item) => (
              <li key={item.href} className="border-b border-[#EADFD4]/60">
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between px-5 py-4",
                    "text-[12px] uppercase tracking-[0.15em] font-medium",
                    "transition-colors",
                    'isSale' in item && item.isSale
                      ? "text-[#0B4F3A] font-semibold hover:text-[#073628]"
                      : "text-[#1A1918] hover:text-[#0B4F3A]"
                  )}
                >
                  <span>{item.label}</span>
                  <ChevronRight size={16} strokeWidth={1.5} className="text-[#786E65] flex-shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

