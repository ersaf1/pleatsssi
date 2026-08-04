# SPEC: AnnouncementBanner Component
Component: src/components/AnnouncementBanner.tsx

## Purpose
Rotating promotional text bar at the very top of the page. Desktop only (hidden on mobile).

## Visual Design
- Background: #f0f0f0
- Text color: #000000
- Font: futura-pt, 15px, weight 400
- Height: ~40px
- Full width

## Content — 5 rotating messages (auto-rotates every 5s)
1. "Bea Cukai & Pajak Dibayar. Tidak Ada Biaya Tersembunyi Saat Pembayaran"
2. "Nikmati Gratis Pengiriman atau ambil pesanan di toko"
3. "Beli Sekarang, Bayar Nanti dengan Cicilan 0% Atome"
4. "Gratis Pengiriman untuk Area JABODETABEK*"
5. "Pengembalian Tanpa Repot Dalam Waktu 30 Hari Pemesanan"

## Behavior
- Auto-rotates every 5 seconds
- Fade or slide transition between messages
- Hidden on mobile (hidden md:flex or similar — show at xl breakpoint: xl:flex)
- Each message is a non-link text (or href="javascript:void(0)")

## Implementation Notes
- Use useState for current index, useEffect for timer
- Tailwind: `hidden xl:flex items-center justify-center w-full`
- bg: `bg-[#f0f0f0]`
- text: `text-black text-[15px] font-normal`
- height: `h-10`
- Use futura-pt font class
- Animate with opacity transition (fade in/out)
- No prev/next buttons visible

## Responsive
- Desktop (xl+): visible
- Mobile/tablet: hidden
