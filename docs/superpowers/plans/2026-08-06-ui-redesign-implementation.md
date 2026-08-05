# Pleatsssi UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the visual design of Pleatsssi from a cloned visual style into an authentic, highly distinguished luxury brand featuring a Bright Cream Minimalist Architectural High-Fashion design system.

**Architecture:** Update global design system CSS variables in `globals.css` to import `Italiana` and `Outfit` Google Fonts, then refactor all UI components to use the warm cream palette (`#FAF7F2` / `#F5F0E6`), high-contrast charcoal typography (`#1A1918`), and deep emerald accents (`#0B4F3A`).

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS v4, Google Fonts (`Italiana`, `Outfit`), Lucide React icons.

## Global Constraints

- Palette: Background Warm Cream (`#FAF7F2`), Secondary Cream Surface (`#F5F0E6`), Card White (`#FFFFFF`), Text Deep Charcoal (`#1A1918`), Accent Deep Emerald (`#0B4F3A`), Border Warm Sand (`#EADFD4`).
- Typography: Brand/Headings `Italiana` (Serif display), Body/Controls `Outfit` (Sans-serif with wide letter-spacing `tracking-[0.2em]`).
- Do not break existing API, Auth, Zustand cart store, or Midtrans payment functionality.
- All 43 unit tests must remain 100% passing.

---

### Task 1: Design System Tokens & Typography Setup

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/id/layout.tsx`

**Interfaces:**
- Consumes: Google Fonts (`Italiana`, `Outfit`).
- Produces: CSS variables and utility classes (`font-display`, `font-sans`, `bg-cream-bg`, `bg-cream-surface`, `text-charcoal`, `bg-emerald-accent`, `border-sand`).

- [ ] **Step 1: Update `src/app/globals.css` with font imports & CSS variables**

Add `@import url('https://fonts.googleapis.com/css2?family=Italiana&family=Outfit:wght@300;400;500;600;700&display=swap');` at top of `globals.css` and configure theme colors.

- [ ] **Step 2: Update root `layout.tsx` to set default body background & text**

Apply `bg-[#FAF7F2] text-[#1A1918] font-sans antialiased` to the root HTML body.

- [ ] **Step 3: Run `npx vitest run` to verify tests pass**

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx src/app/id/layout.tsx
git commit -m "style: configure bright cream design system tokens and Google Fonts"
```

---

### Task 2: Global Header, Announcement Banner, & Footer Redesign

**Files:**
- Modify: `src/components/Header.tsx`
- Modify: `src/components/AnnouncementBanner.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/components/MobileNav.tsx`

**Interfaces:**
- Consumes: Design system tokens.
- Produces: Cream luxury header with Italiana logotype, Deep Emerald announcements, and architectural footer.

- [ ] **Step 1: Refactor `AnnouncementBanner.tsx`**
Update background to `#0B4F3A` (Deep Emerald) with champagne gold/cream text and wide letter spacing.

- [ ] **Step 2: Refactor `Header.tsx`**
Apply floating glass header with `backdrop-blur-md bg-[#FAF7F2]/90 border-b border-[#EADFD4]`, centered **PLEATSSSI** logo in `Italiana` serif font, and updated cart counter badge in Deep Emerald.

- [ ] **Step 3: Refactor `Footer.tsx` & `MobileNav.tsx`**
Update background to `#F5F0E6` (Ivory Linen) with warm sand borders and editorial link styling.

- [ ] **Step 4: Run `npx vitest run` to verify tests pass**

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.tsx src/components/AnnouncementBanner.tsx src/components/Footer.tsx src/components/MobileNav.tsx
git commit -m "style: redesign header, announcement banner, and footer for Pleatsssi"
```

---

### Task 3: Hero Banners & Home Page Sections Redesign

**Files:**
- Modify: `src/components/HeroBanner.tsx`
- Modify: `src/components/DualLifestyleBanner.tsx`

**Interfaces:**
- Consumes: `Italiana` font and warm cream framing tokens.
- Produces: High-fashion editorial home page banners.

- [ ] **Step 1: Refactor `HeroBanner.tsx`**
Update typography to use `Italiana` display serif font for campaign headers, warm cream framing overlay, and Deep Emerald primary action buttons.

- [ ] **Step 2: Refactor `DualLifestyleBanner.tsx`**
Apply dual-column architectural grid with subtle image zoom transitions and cream borders.

- [ ] **Step 3: Run `npx vitest run` to verify tests pass**

- [ ] **Step 4: Commit**

```bash
git add src/components/HeroBanner.tsx src/components/DualLifestyleBanner.tsx
git commit -m "style: redesign home page hero and lifestyle banners"
```

---

### Task 4: Product Grid, Product Card, & Carousel Redesign

**Files:**
- Modify: `src/components/ProductCard.tsx`
- Modify: `src/components/ProductGrid.tsx`
- Modify: `src/components/ProductCarousel.tsx`

**Interfaces:**
- Consumes: Product data interface.
- Produces: Luxury product cards with 3:4 aspect ratio, warm cream image container, Deep Emerald sale badges, and smooth hover zoom.

- [ ] **Step 1: Refactor `ProductCard.tsx`**
Set image container background to `#F5F0E6`, apply 3:4 aspect ratio framing, Deep Charcoal product titles, and Deep Emerald price/sale tags.

- [ ] **Step 2: Refactor `ProductGrid.tsx` & `ProductCarousel.tsx`**
Apply architectural grid spacing (`gap-6 md:gap-8`), editorial section titles in `Italiana`, and minimal scroll buttons.

- [ ] **Step 3: Run `npx vitest run` to verify tests pass**

- [ ] **Step 4: Commit**

```bash
git add src/components/ProductCard.tsx src/components/ProductGrid.tsx src/components/ProductCarousel.tsx
git commit -m "style: redesign product card, grid, and carousel components"
```

---

### Task 5: Category & Product Detail Page Redesign

**Files:**
- Modify: `src/components/CategoryHero.tsx`
- Modify: `src/components/CategoryPage.tsx`
- Modify: `src/components/ProductDetail.tsx`
- Modify: `src/components/InfoPage.tsx`

**Interfaces:**
- Consumes: Category metadata, product detail data, Zustand cart store (`useCartStore`).
- Produces: High-fashion PDP and Category pages with warm cream styling and Deep Emerald CTAs.

- [ ] **Step 1: Refactor `CategoryHero.tsx` & `CategoryPage.tsx`**
Update category hero headers with `Italiana` serif typography and warm cream background framing.

- [ ] **Step 2: Refactor `ProductDetail.tsx`**
Update PDP gallery grid, variant selectors, stock badges, and primary "Tambah ke Keranjang" button with Deep Emerald styling (`bg-[#0B4F3A] hover:bg-[#073628]`).

- [ ] **Step 3: Refactor `InfoPage.tsx`**
Update static info pages (FAQ, Return policy, Privacy policy) with warm cream container and editorial typography.

- [ ] **Step 4: Run full verification (`npx vitest run` && `npx tsc --noEmit` && `npm run build`)**

- [ ] **Step 5: Commit**

```bash
git add src/components/CategoryHero.tsx src/components/CategoryPage.tsx src/components/ProductDetail.tsx src/components/InfoPage.tsx
git commit -m "style: redesign category, product detail, and info pages"
```
