# Product Card Redesign & Family Grouping Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign product cards with Parisian haute-couture aesthetics, distinct model hover crossfade, floating action pill, and group products by base family name (e.g. BAGGY, AGATE, ALPHA) into 1 consolidated card per family on visual catalog views.

**Architecture:** Add `groupProductsByFamily` helper in `src/data/products.ts`, update `ProductCard.tsx` with couture styling + floating actions + model hover, and integrate grouped product display into `ProductGrid.tsx`.

**Tech Stack:** Next.js 16 (App Router, React 19, TypeScript), Tailwind CSS v4, Lucide React icons, GSAP / ScrollTrigger.

## Global Constraints

- Design system colors: Emerald `#0B4F3A`, Sand Warm `#FAF7F2` / `#F5F0E6`, Charcoal `#1A1918`, Muted `#786E65`, Border `#EADFD4`.
- Respect strict TypeScript mode (no `any`).
- Responsive mobile-first design.

---

### Task 1: Product Family Consolidation Helper & Data Mapping

**Files:**
- Modify: `src/data/products.ts`
- Modify: `src/data/pleatsssi-products.json`

**Interfaces:**
- Produces: 
  - `GroupedProduct` interface & `groupProductsByFamily(products: Product[]): GroupedProduct[]` helper in `src/data/products.ts`.
  - Updated `pleatsssi-products.json` with distinct `hoverImage` paths for model photos.

- [ ] **Step 1: Implement family extraction helper in products.ts**
  Create `groupProductsByFamily` function that groups items like `BAGGY SHORT PANTS`, `BAGGY SKIRT`, `BAGGY PANTS` under base name `"BAGGY"` with piece count, price range, and combined gallery/swatches.

- [ ] **Step 2: Update model hover images in pleatsssi-products.json**
  Set distinct model hover images across product families.

- [ ] **Step 3: Verify TypeScript build & type check**
  Run: `npm run typecheck`
  Expected: PASS

- [ ] **Step 4: Commit Task 1 changes**
  ```bash
  git add src/data/products.ts src/data/pleatsssi-products.json
  git commit -m "feat(data): add groupProductsByFamily helper and update model hover images"
  ```

---

### Task 2: Refactor ProductCard Component with Model Hover & Floating Actions

**Files:**
- Modify: `src/components/ProductCard.tsx`

**Interfaces:**
- Consumes: `Product` or `GroupedProduct` interface from `src/data/products.ts`
- Produces: Redesigned `ProductCard` component featuring:
  - `aspect-[3/4]` frame with `rounded-md`, `#FAF7F2` background, and `#EADFD4` border.
  - Dual-layer image crossfade: Product flat shot -> Model photo on hover.
  - Floating Action Pill (`"Lihat Detail"` + Heart icon) with `backdrop-blur-md bg-[#1A1918]/90 text-white` sliding up on hover.
  - Family pieces pill (e.g. `"3 Varian Model"`) if grouped.
  - Status badge in signature emerald (`#0B4F3A`).
  - Refined typography with emerald title hover transition.

- [ ] **Step 1: Redesign ProductCard component structure**
  Update `ProductCard.tsx` with floating action pill, glassmorphism blur, rounded-md framing, piece badge, and model hover transition.

- [ ] **Step 2: Run typecheck and linting**
  Run: `npm run typecheck`
  Expected: PASS

- [ ] **Step 3: Commit Task 2 changes**
  ```bash
  git add src/components/ProductCard.tsx
  git commit -m "feat(ui): redesign ProductCard with couture frame, model hover, and floating actions"
  ```

---

### Task 3: ProductGrid & Catalog Integration & Verification

**Files:**
- Modify: `src/components/ProductGrid.tsx`
- Modify: `src/components/CategoryPage.tsx`

- [ ] **Step 1: Integrate family grouping in ProductGrid**
  Update `ProductGrid.tsx` to automatically group products by family when rendering visual grids.

- [ ] **Step 2: Run full project check**
  Run: `npm run check`
  Expected: Lint, Typecheck, and Next.js Build all pass without errors.

- [ ] **Step 3: Commit Task 3 changes**
  ```bash
  git add src/components/ProductGrid.tsx src/components/CategoryPage.tsx
  git commit -m "feat(grid): integrate product family grouping in catalog grid"
  ```
