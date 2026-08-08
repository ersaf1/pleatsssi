# Product Card Redesign - Minimalist Couture Card with Model Hover, Floating Actions & Family Grouping

**Date:** 2026-08-08  
**Status:** Approved by User  
**Target Brand:** Pleatsssi (Luxury Pleated Fashion)

---

## 1. Executive Summary

Redesign the product card component (`ProductCard.tsx`), product grid display (`ProductGrid.tsx`), and product data service (`src/data/products.ts`) to distinguish Pleatsssi's brand identity from generic minimalist e-commerce layouts. 

Key improvements:
1. **Haute-Couture Visual Aesthetics:** Soft warm backgrounds, delicate borders, elegant typography mix.
2. **Model Photo Hover & Floating Actions:** Crossfade transition into high-fashion model shots with a floating "Lihat Detail" / Quick View pill button.
3. **Product Family Consolidation:** Group individual family items (e.g., `BAGGY SHORT PANTS`, `BAGGY SKIRT`, `BAGGY PANTS`) into **1 consolidated product card** per family (e.g., `BAGGY`) on grid/catalog views so the catalog is clean, organized, and un-cluttered.

---

## 2. Product Family Grouping Architecture

### 2.1 Family Extraction Logic
- Products sharing a common prefix/family name (e.g., `BAGGY`, `AGATE`, `ALPHA`, `AURORA`, `BOLDEN`, `RAIA`) are aggregated into a single `ProductFamilyGroup`.
- Example grouping:
  - `BAGGY SHORT PANTS` + `BAGGY SKIRT` + `BAGGY PANTS` ➔ **BAGGY** (1 Card)
  - `AGATE SKIRT` + `AGATE TOP` ➔ **AGATE** (1 Card)
  - `AURORA TOO TOP` + `AURORA TOO SKIRT` + `AURORA TOO SHORT TOP` ➔ **AURORA TOO** (1 Card)

### 2.2 Grouped Card Attributes
- **Title:** Family Base Name (e.g., `"BAGGY"`) with item breakdown subtext (e.g., `"Pants · Skirt · Short Pants"`).
- **Pricing:** Displays starting price or price range (e.g. `"IDR865,000 - IDR960,000"` or `"Mulai IDR865,000"`).
- **Images:** 
  - `image`: Primary top or signature piece in the family.
  - `hoverImage`: High-fashion editorial model photo wearing the family outfit.
- **Family Swatches / Pieces:** Micro-indicators showing available pieces (Top, Skirt, Pants) and color variants.

---

## 3. Visual Identity & Framing

### 3.1 Container & Image Framing
- **Aspect Ratio:** `aspect-[3/4]` portrait view, optimized for high-fashion outerwear, tops, skirts, and pants.
- **Borders & Background:** Rounded corners (`rounded-md`), subtle luxury border (`border-[#EADFD4]`), soft warm background fill (`#FAF7F2`).
- **Badges:** Minimalist floating status pill for discount / new arrival / signature pleats in deep emerald (`#0B4F3A`) with subtle letter spacing (`tracking-[0.15em]`).

### 3.2 Typography & Pricing Details
- **Product Title:** Refined font mix (`text-[13.5px] font-medium text-[#1A1918]`) transitioning seamlessly to signature emerald (`#0B4F3A`) on card hover.
- **Sub-item Pill / Tag:** Subtle text badge indicating family pieces (`"3 Model Pleats"`).
- **Pricing Display:** Clean layout showing price or range in charcoal `#1A1918`.
- **Color Swatches:** Round color/variant swatches with hover scale effect.

---

## 4. Interactive Behaviors & Hover Effects

### 4.1 Model Photo Crossfade & Slide Reveal
- **Primary Image:** High-resolution product studio shot / flat lay.
- **Hover Image:** High-fashion editorial shot showcasing a model wearing the Pleatsssi pleated outfit in motion or full-body pose.
- **Transition Animation:** 
  - Dual-layer smooth opacity crossfade paired with a subtle zoom scale (`group-hover:scale-[1.04]`).
  - Subtle radial vignette background depth overlay on hover.

### 4.2 Floating Action Controls
- **Action Pill:** Centered bottom floating bar featuring:
  - `"Lihat Detail"` / `"Quick View"` button (`bg-[#1A1918]/90 text-[#FAF7F2] backdrop-blur-md hover:bg-[#0B4F3A]`).
  - Heart icon button for quick Wishlist save.
- **Entrance Trigger:** Smooth `translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100` transition (0.35s ease-out).

---

## 5. Dataset & Service Updates

- Update `src/data/products.ts` with helper `getGroupedProducts(products: Product[])` to aggregate products by family.
- Update `src/data/pleatsssi-products.json` ensuring model hover images are mapped for each product family.
- Update `ProductGrid.tsx` and collection pages to consume grouped products for visual catalog views.

---

## 6. Self-Review Checklist

- [x] **Placeholder scan:** No TBDs, TODOs, or unmapped handlers.
- [x] **Internal consistency:** Matches Pleatsssi color tokens (`#0B4F3A`, `#FAF7F2`, `#1A1918`, `#EADFD4`).
- [x] **Scope check:** Self-contained within `ProductCard`, `ProductGrid`, and product data helpers.
- [x] **Ambiguity check:** Family consolidation rules, hover model transitions, and floating actions explicitly defined.
