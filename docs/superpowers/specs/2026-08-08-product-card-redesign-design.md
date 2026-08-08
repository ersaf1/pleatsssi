# Product Card Redesign - Minimalist Couture Card with Model Hover & Floating Actions

**Date:** 2026-08-08  
**Status:** Approved by User  
**Target Brand:** Pleatsssi (Luxury Pleated Fashion)

---

## 1. Executive Summary

Redesign the product card component (`ProductCard.tsx`) and underlying product dataset (`pleatsssi-products.json`) to distinguish Pleatsssi's brand identity from generic minimalist e-commerce layouts (such as Charles & Keith). The new design introduces a Parisian haute-couture aesthetic, distinct editorial typography, model photo hover transitions, and interactive floating action controls.

---

## 2. Visual Identity & Framing

### 2.1 Container & Image Framing
- **Aspect Ratio:** `aspect-[3/4]` portrait view, optimized for high-fashion outerwear, tops, skirts, and pants.
- **Borders & Background:** Rounded corners (`rounded-md`), subtle luxury border (`border-[#EADFD4]`), soft warm background fill (`#FAF7F2`).
- **Badges:** Minimalist floating status pill for discount / new arrival / signature pleats in deep emerald (`#0B4F3A`) with subtle letter spacing (`tracking-[0.15em]`).

### 2.2 Typography & Pricing Details
- **Product Title:** Refined font mix (`text-[13.5px] font-medium text-[#1A1918]`) transitioning seamlessly to signature emerald (`#0B4F3A`) on card hover.
- **Pricing Display:** Clean layout showing original price strikethrough in warm muted grey (`#786E65`) alongside active price in emerald or dark charcoal.
- **Color Swatches:** Round color swatches with hover scale effect (`hover:scale-125 transition-transform duration-200`) and border rings.

---

## 3. Interactive Behaviors & Hover Effects

### 3.1 Model Photo Crossfade & Slide Reveal
- **Primary Image:** High-resolution product studio shot / flat lay.
- **Hover Image:** High-fashion editorial shot showcasing a model wearing the Pleatsssi pleated outfit in motion or full-body pose.
- **Transition Animation:** 
  - Dual-layer smooth opacity crossfade paired with a subtle zoom scale (`group-hover:scale-[1.04]`).
  - Subtle radial vignette background depth overlay on hover.

### 3.2 Floating Action Controls
- **Action Pill:** Centered bottom floating bar featuring:
  - `"Lihat Detail"` / `"Quick View"` button (`bg-[#1A1918]/90 text-[#FAF7F2] backdrop-blur-md hover:bg-[#0B4F3A]`).
  - Heart icon button for quick Wishlist save.
- **Entrance Trigger:** Smooth `translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100` transition (0.35s ease-out).

---

## 4. Model Image Dataset Updates

- Update `src/data/pleatsssi-products.json` and `src/data/products.ts`.
- Ensure all active products have distinct `hoverImage` paths pointing to high-quality model photos.
- Provide curated editorial model assets in `public/images/products/` or AI-generated model renders matching Pleatsssi pleated garments.

---

## 5. Scope & Integration Points

1. **`src/components/ProductCard.tsx`**: Update layout, hover logic, model image crossfade, and floating action pill.
2. **`src/data/pleatsssi-products.json`**: Update `hoverImage` entries for product items.
3. **`src/components/ProductGrid.tsx` & `ProductCarousel.tsx`**: Verify grid spacing, GSAP scroll triggers, and responsive layout compatibility across desktop and mobile views.

---

## 6. Self-Review Checklist

- [x] **Placeholder scan:** No TBDs, TODOs, or unmapped handlers.
- [x] **Internal consistency:** Matches Pleatsssi color tokens (`#0B4F3A`, `#FAF7F2`, `#1A1918`, `#EADFD4`).
- [x] **Scope check:** Self-contained within `ProductCard`, product data, and product display containers.
- [x] **Ambiguity check:** Hover behavior, model image transition, and floating actions strictly specified.
