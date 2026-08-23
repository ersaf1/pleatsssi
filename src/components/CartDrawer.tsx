'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { gsap } from '@/lib/gsap';
import { useCartStore } from '@/store/useCartStore';
import { cn } from '@/lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatIDR(n: number) {
  return 'IDR' + n.toLocaleString('id-ID');
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const { items, removeItem, updateQuantity } = useCartStore();

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  /* ── Animation: open/close ── */
  useEffect(() => {
    const drawer = drawerRef.current;
    const backdrop = backdropRef.current;
    if (!drawer || !backdrop) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.set(drawer, { x: '100%', display: 'flex' });
      gsap.set(backdrop, { opacity: 0, display: 'block' });
      gsap.to(backdrop, { opacity: 1, duration: 0.35, ease: 'power2.out' });
      gsap.to(drawer, { x: '0%', duration: 0.55, ease: 'expo.out' });
    } else {
      document.body.style.overflow = '';
      gsap.to(backdrop, { opacity: 0, duration: 0.25, ease: 'power2.in' });
      gsap.to(drawer, {
        x: '100%',
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(drawer, { display: 'none' });
          gsap.set(backdrop, { display: 'none' });
        },
      });
    }
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={onClose}
        className="cart-drawer-backdrop fixed inset-0 z-[60] bg-[#1A1918]/50 hidden"
        style={{ willChange: 'opacity' }}
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className="fixed right-0 top-0 z-[70] h-full w-full max-w-[420px] bg-[#FAF7F2] shadow-[−8px_0_48px_rgba(26,25,24,0.18)] hidden flex-col"
        style={{ willChange: 'transform' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EADFD4] px-6 py-5">
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} strokeWidth={1.5} className="text-[#1A1918]" />
            <span className="font-['Italiana',serif] text-lg uppercase tracking-[0.12em] text-[#1A1918]">
              Keranjang
            </span>
            {itemCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0B4F3A] text-[10px] font-semibold text-[#FAF7F2] tabular-nums">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup keranjang"
            className="flex h-8 w-8 items-center justify-center text-[#786E65] hover:text-[#1A1918] transition-colors duration-200"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center border border-[#EADFD4] rounded-sm">
                <ShoppingBag size={24} strokeWidth={1} className="text-[#EADFD4]" />
              </div>
              <div>
                <p className="font-['Italiana',serif] text-xl text-[#1A1918] uppercase tracking-[0.1em] mb-1">
                  Keranjang Kosong
                </p>
                <p className="text-[12px] text-[#786E65] tracking-wide">
                  Temukan koleksi pilihan kami
                </p>
              </div>
              <Link
                href="/id/new-arrivals"
                onClick={onClose}
                className="inline-flex items-center gap-2 border border-[#1A1918] bg-[#1A1918] text-[#FAF7F2] px-6 py-3 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-[#0B4F3A] hover:border-[#0B4F3A] transition-colors duration-300"
              >
                Mulai Belanja
                <ArrowRight size={12} strokeWidth={2} />
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-[#EADFD4]">
              {items.map((item) => (
                <li key={item.variantId} className="flex gap-4 py-5">
                  {/* Image */}
                  <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-sm border border-[#EADFD4] bg-[#F5F0E6]">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#1A1918] leading-tight truncate">
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#786E65] tracking-wide">
                        {item.variantLabel}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-[#EADFD4]">
                        <button
                          onClick={() =>
                            item.quantity > 1
                              ? updateQuantity(item.variantId, item.quantity - 1)
                              : removeItem(item.variantId)
                          }
                          className="flex h-7 w-7 items-center justify-center text-[#786E65] hover:text-[#1A1918] transition-colors"
                          aria-label="Kurangi"
                        >
                          <Minus size={10} strokeWidth={2} />
                        </button>
                        <span className="flex h-7 w-7 items-center justify-center text-[11px] font-semibold text-[#1A1918] tabular-nums border-x border-[#EADFD4]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.stockAvailable}
                          className={cn(
                            'flex h-7 w-7 items-center justify-center transition-colors',
                            item.quantity >= item.stockAvailable
                              ? 'text-[#EADFD4]'
                              : 'text-[#786E65] hover:text-[#1A1918]'
                          )}
                          aria-label="Tambah"
                        >
                          <Plus size={10} strokeWidth={2} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-[12px] font-semibold text-[#1A1918] tabular-nums">
                          {formatIDR(item.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-[10px] text-[#786E65] tabular-nums">
                            {formatIDR(item.price)} /pcs
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.variantId)}
                    aria-label="Hapus dari keranjang"
                    className="flex-shrink-0 self-start mt-0.5 text-[#EADFD4] hover:text-[#8C2323] transition-colors duration-200"
                  >
                    <X size={14} strokeWidth={1.5} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer — only visible with items */}
        {items.length > 0 && (
          <div className="border-t border-[#EADFD4] px-6 py-6 space-y-4">
            {/* Subtotal */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[12px] uppercase tracking-[0.12em] text-[#786E65]">Subtotal</span>
                <span className="text-[14px] font-semibold text-[#1A1918] tabular-nums">
                  {formatIDR(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#786E65]">Pengiriman</span>
                <span className="text-[11px] text-[#0B4F3A] font-medium">Dihitung saat checkout</span>
              </div>
            </div>

            {/* Tax note */}
            <p className="text-[10px] text-[#786E65] border-t border-[#EADFD4] pt-3">
              Pajak &amp; bea cukai sudah termasuk dalam harga produk.
            </p>

            {/* CTA */}
            <Link
              href="/id/checkout"
              onClick={onClose}
              className="relative flex w-full items-center justify-between overflow-hidden bg-[#1A1918] px-6 py-4 text-[#FAF7F2] group hover:bg-[#0B4F3A] transition-colors duration-300"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
              <span className="text-[11px] uppercase tracking-[0.22em] font-semibold">
                Lanjut ke Pembayaran
              </span>
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>

            <Link
              href="/id/new-arrivals"
              onClick={onClose}
              className="block text-center text-[11px] uppercase tracking-[0.18em] text-[#786E65] hover:text-[#1A1918] transition-colors duration-200 font-medium"
            >
              Lanjut Belanja
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
