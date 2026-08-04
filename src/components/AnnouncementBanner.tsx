"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const MESSAGES = [
  "Bea Cukai & Pajak Dibayar. Tidak Ada Biaya Tersembunyi Saat Pembayaran",
  "Nikmati Gratis Pengiriman atau ambil pesanan di toko",
  "Beli Sekarang, Bayar Nanti dengan Cicilan 0% Atome",
  "Gratis Pengiriman untuk Area JABODETABEK*",
  "Pengembalian Tanpa Repot Dalam Waktu 30 Hari Pemesanan",
] as const;

export function AnnouncementBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out, swap, fade in
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % MESSAGES.length);
        setVisible(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        "hidden xl:flex items-center justify-center w-full h-10",
        "bg-[#f0f0f0]"
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      <p
        className={cn(
          "text-black text-[15px] font-normal tracking-normal text-center px-4",
          "transition-opacity duration-300",
          visible ? "opacity-100" : "opacity-0"
        )}
      >
        {MESSAGES[currentIndex]}
      </p>
    </div>
  );
}
