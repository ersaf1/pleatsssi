# Pleatsssi UI Redesign — Architectural & Design Specification

## 1. Overview & Vision
The goal of this redesign is to transform the Pleatsssi e-commerce visual identity from a generic clone look into an authentic, highly distinguished luxury brand. The aesthetic follows a **Bright Cream Minimalist Architectural High-Fashion** design system with rich cream tones, high-contrast charcoal typography, and deep emerald accents.

---

## 2. Design System Tokens & Color Palette

### 2.1 Color Tokens (`src/app/globals.css`)
- **Primary Background**: `Cream Chiffon` (`#FAF7F2`)
- **Secondary Background / Section Surface**: `Ivory Linen` (`#F5F0E6`)
- **Card Background**: `Pure Alabaster` (`#FFFFFF`)
- **Primary Text**: `Deep Charcoal` (`#1A1918`)
- **Secondary Text / Muted Labels**: `Muted Bronze` (`#786E65`)
- **Borders & Dividers**: `Warm Sand` (`#EADFD4`)
- **Brand Accent Primary**: `Deep Emerald Green` (`#0B4F3A`)
- **Brand Accent Hover**: `Dark Emerald` (`#073628`)
- **High-Light Accent**: `Warm Champagne Gold` (`#C5A059`)

### 2.2 Typography Hierarchy
- **Google Fonts Import**:
  - `Italiana` (Serif Display for Headlines, Branding, & Section Titles)
  - `Outfit` (Sans-serif for Navigation, UI Controls, Buttons, & Body text)
- **Tracking / Letter Spacing**:
  - Brand Logo & Headings: `letter-spacing: 0.25em; text-transform: uppercase;`
  - Navigation & Buttons: `letter-spacing: 0.15em; text-transform: uppercase;`

---

## 3. Component Architecture & Style Guidelines

### 3.1 Global Header & Navigation (`src/components/Header.tsx`)
- Floating sticky bar with `backdrop-blur-md bg-[#FAF7F2]/90 border-b border-[#EADFD4]`.
- Centered brand logo: **PLEATSSSI** using font-family `Italiana`, size `2rem`, letter spacing `0.25em`.
- Nav links with animated bottom border underline in `Deep Emerald`.
- Integrated user auth status & cart counter badge.

### 3.2 Hero & Editorial Banners (`src/components/HeroBanner.tsx`, `src/components/DualLifestyleBanner.tsx`)
- Architectural grid layout framed by warm cream borders (`#EADFD4`).
- High-contrast editorial typography using `Italiana`.
- Clean minimal CTA buttons (`bg-[#0B4F3A] text-white hover:bg-[#073628] rounded-sm`).

### 3.3 Product Card & Grid (`src/components/ProductCard.tsx`, `src/components/ProductGrid.tsx`)
- 3:4 aspect ratio luxury product image container with warm cream image background.
- Smooth scale transition (`transition-transform duration-500 ease-out hover:scale-105`).
- Price formatted cleanly in IDR with Deep Emerald accent for sale badges.

### 3.4 Product Detail & Category Pages (`src/components/ProductDetail.tsx`, `src/components/CategoryHero.tsx`, `src/components/CategoryPage.tsx`)
- Asymmetric layout featuring multi-angle gallery grid, variant selectors, stock indicators, and primary "Tambah ke Keranjang" CTA.

---

## 4. Implementation Steps
1. Update `src/app/globals.css` with Google Fonts (`Italiana`, `Outfit`) and color CSS variables.
2. Refactor `Header.tsx`, `AnnouncementBanner.tsx`, `Footer.tsx` to use the new cream aesthetic.
3. Update `HeroBanner.tsx`, `DualLifestyleBanner.tsx`, `CategoryHero.tsx`.
4. Update `ProductCard.tsx`, `ProductGrid.tsx`, `ProductCarousel.tsx`.
5. Update `ProductDetail.tsx`, `CategoryPage.tsx`, `InfoPage.tsx`.
6. Run `npm run check` (typecheck + tests + build) to ensure complete visual and functional pristine state.
