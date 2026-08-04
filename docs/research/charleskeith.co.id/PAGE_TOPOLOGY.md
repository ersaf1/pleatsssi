# Charles & Keith Indonesia — Page Topology
URL: https://www.charleskeith.co.id/id
Captured: 2026-08-04

## Page Sections (top → bottom)

### 1. Announcement Banner (header_banner)
- Thin rotating carousel bar at top of page
- bg: #f0f0f0, text: #000, font-size: 15px
- 5 rotating promo messages (auto-rotates every 5s):
  1. "Bea Cukai & Pajak Dibayar. Tidak Ada Biaya Tersembunyi Saat Pembayaran"
  2. "Nikmati Gratis Pengiriman atau ambil pesanan di toko"
  3. "Beli Sekarang, Bayar Nanti dengan Cicilan 0% Atome"
  4. "Gratis Pengiriman untuk Area JABODETABEK*"
  5. "Pengembalian Tanpa Repot Dalam Waktu 30 Hari Pemesanan"
- Desktop only (hidden on mobile with d-none d-xl-block)

### 2. Main Header / Navigation (page_header)
- Sticky header, white bg (#fff), black text
- Left: Search icon (desktop), hamburger (mobile)
- Center: CHARLES & KEITH logo (SVG/text, uppercase)
- Right: Country selector, Wishlist icon, Account icon, Cart icon
- Below logo: horizontal nav bar with 10 items:
  - PRODUK BARU, SEPATU, TAS, DOMPET, AKSESORI, KOLEKSI ANAK-ANAK, GIFTS, TRENDING NOW, STORIES, SALE
- SALE is typically styled in red/accent color
- Has mega-menu dropdowns on hover (desktop)
- Mobile: hamburger opens slide-in drawer

### 3. Hero Banner (homepage_2023_banner-hero)
- Full-width hero image, height ~762px desktop
- Desktop image: 1920x1025px
- Mobile image: 600x1000px
- Text overlay (bottom-left position):
  - H1: "Get Ready For Fall: Bags" — white text on image
  - CTA: "Belanja Sekarang" (Shop Now) — underlined link
- Links to /id/bags
- Uses <picture> with <source media="(min-width: 768px)">

### 4. Dual Lifestyle Banner (homepage_2023_banner-lifestyle_wrapper)
- CSS Grid layout, 2 columns on desktop
- Left panel: Shoes Collection
  - Image: charles-keith-home-d-1-week-31-600x800-rev.png
  - Text overlay: "Shoes Collection" + "Belanja Sekarang"
- Right panel: New This Week
  - Image: charles-keith-home-d-2-week-31-600x1000-rev.png
  - Text overlay: "New This Week" + "Belanja Sekarang"
- Callout text positioned absolute, bottom-left of each panel

### 5. Product Grid / New Arrivals (homepage product section)
- Section heading
- Grid of product tiles (4 columns desktop, 2 mobile)
- Each tile: product image, name, price

### 6. Footer (page_footer page_footer_revamped)
- Mobile: newsletter + social links at top
- Desktop: multi-column layout
- Newsletter signup: email input + SUBSCRIBE button
  - Placeholder: "Masukkan email anda di sini"
  - Heading: "DAFTAR UNTUK MENDAPATKAN INFO FASHION TERBARU"
- Social links section "IKUTI KAMI":
  - Facebook: charleskeith.id
  - Instagram: charleskeithofficial
  - YouTube: CharlesKeithChannel
  - Twitter: charles_keith
  - Pinterest: charleskeithofficial
  - TikTok: charleskeithofficial
- Footer nav columns (typical): Customer Service, About Us, Legal
- Contact: customer_care@ptkcg.co.id
- Legal links: Syarat & Ketentuan, Kebijakan Privasi

## Breakpoints
- xs: 0
- sm: 375px
- md: 768px
- lg: 1024px
- xl: 1280px
- hd: 1920px

## Typography
- Font: futura-pt (Adobe Fonts / Typekit — kit: exv2fdk)
  - 400 normal, 400 italic
  - 600 normal, 600 italic (futura-pt)
  - 700 normal, 700 italic (futura-pt-bold)
- Base font size: 15px
- Letter spacing: normal
- All caps used heavily for headings and nav

## Color Palette
- Background: #ffffff
- Text primary: #000000
- Text secondary: #333333
- Nav link: #333333
- Announcement bar bg: #f0f0f0
- Primary (CSS var): #333
- Secondary (CSS var): #ccc
- Dark: #000
- White: #fff

## Interactions
- Announcement banner: auto-rotating carousel (5s interval)
- Header: sticky on scroll
- Nav: mega-menu dropdowns on hover (desktop)
- Nav: slide-in drawer on mobile (hamburger toggle)
- Hero: static image (no slider on current week)
- Footer: newsletter form submission
