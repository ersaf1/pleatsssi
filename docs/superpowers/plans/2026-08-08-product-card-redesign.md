# Product Card Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign product cards with Parisian haute-couture aesthetics, distinct model hover crossfade, and floating action pill while ensuring valid model hover images in dataset.

**Architecture:** Update dataset model image mappings, revamp `ProductCard.tsx` with smooth CSS/Tailwind transitions and GSAP scroll triggers, and verify rendering across grid/carousel pages.

**Tech Stack:** Next.js 16 (App Router, React 19, TypeScript), Tailwind CSS v4, Lucide React icons, GSAP / ScrollTrigger.

## Global Constraints

- Design system colors: Emerald `#0B4F3A`, Sand Warm `#FAF7F2` / `#F5F0E6`, Charcoal `#1A1918`, Muted `#786E65`, Border `#EADFD4`.
- Respect strict TypeScript mode (no `any`).
- Responsive mobile-first design.

---

### Task 1: Product Dataset Model Hover Image Alignment

**Files:**
- Modify: `src/data/pleatsssi-products.json`
- Verify: `src/data/products.ts`

**Interfaces:**
- Produces: Updated `pleatsssi-products.json` where products have distinct `hoverImage` paths showcasing model photos or secondary editorial views rather than duplicate flat shots.

- [ ] **Step 1: Inspect product folders in public/images/products/**
  Verify existing product image directories (e.g., `RAIA ONE`, `AURORA ONE`, `AGATE`, etc.) to map secondary model/top/skirt photos to `hoverImage`.

- [ ] **Step 2: Update pleatsssi-products.json hoverImage properties**
  Set distinct model hover images across product entries in `src/data/pleatsssi-products.json`.

- [ ] **Step 3: Verify TypeScript build & data parsing**
  Run `npm run typecheck` to confirm JSON data matches `Product` interface.

- [ ] **Step 4: Commit task changes**
  ```bash
  git add src/data/pleatsssi-products.json
  git commit -m "feat(data): update product hoverImage paths with model editorial shots"
  ```

---

### Task 2: Refactor ProductCard Component Layout & Model Hover Transition

**Files:**
- Modify: `src/components/ProductCard.tsx`

**Interfaces:**
- Consumes: `Product` interface from `src/data/products.ts`
- Produces: Redesigned `ProductCard` component featuring:
  - `aspect-[3/4]` frame with `rounded-md`, `#FAF7F2` background, and `#EADFD4` border.
  - Dual-layer image crossfade: Product flat shot -> Model photo on hover.
  - Floating Action Pill (`"Lihat Detail"` + Heart icon) with `backdrop-blur-md bg-[#1A1918]/90 text-white` sliding up on hover.
  - Status badge in signature emerald (`#0B4F3A`).
  - Refined typography with emerald title hover transition.

- [ ] **Step 1: Redesign ProductCard component structure**
  Update `ProductCard.tsx` with floating action pill, glassmorphism blur, rounded-md framing, and model hover transition.

- [ ] **Step 2: Run typecheck and linting**
  Run: `npm run typecheck`
  Expected: PASS

- [ ] **Step 3: Commit component redesign**
  ```bash
  git add src/components/ProductCard.tsx
  git commit -m "feat(ui): redesign ProductCard with couture frame, model hover, and floating actions"
  ```

---

### Task 3: End-to-End Verification & Build Check

**Files:**
- Check: `src/components/ProductGrid.tsx`
- Check: `src/components/ProductCarousel.tsx`

- [ ] **Step 1: Run full project check**
  Run: `npm run check`
  Expected: Lint, Typecheck, and Next.js Build all pass without errors.

- [ ] **Step 2: Final commit**
  ```bash
  git add -A
  git commit -m "chore: verify product card redesign in grid and carousel"
  ```
