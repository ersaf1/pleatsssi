# Admin UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Admin Login page, Admin Layout shell, Admin Dashboard, and Admin Data Management pages to establish a modern, high-contrast visual system with maximum clarity.

**Architecture:** Use high-contrast color tokens (Slate 50 canvas, pure white card containers, Slate 900 text, and Deep Emerald `#0B4F3A` primary accents), status badges with clear color distinction, password eye toggles, topbar breadcrumbs, and distinct table grids.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide React icons, Supabase Browser Client.

## Global Constraints
- High contrast color palette (Deep Emerald `#0B4F3A`, Slate `#0F172A`, Slate Background `#F8FAFC`).
- Consistent status badge color logic: Emerald (Success/Active/Live), Amber (Warning/Low Stock/Fallback/Pending), Rose (Danger/Out of Stock/Cancelled/Error), Slate (Neutral/Draft).
- No structural breaking changes to existing Supabase data calls or router paths.

---

### Task 1: Redesign Admin Login Page (`src/app/id/admin/login/page.tsx`)

**Files:**
- Modify: [src/app/id/admin/login/page.tsx](file:///C:/Users/lulus/Dominator/pleatsssi/src/app/id/admin/login/page.tsx)

**Interfaces:**
- Consumes: `/api/auth/login` endpoint, `supabaseBrowserClient`.
- Produces: Polished high-contrast login screen with password show/hide toggle and enhanced error feedback.

- [ ] **Step 1: Add showPassword state and Eye/EyeOff icons**
  Import `Eye`, `EyeOff` from `lucide-react`. Add `showPassword` state initialized to `false`.

- [ ] **Step 2: Update UI JSX with high-contrast card, labels, password toggle, and error alert**
  Apply `#F8FAFC` page background, `#0B4F3A` emerald lock emblem header, bold uppercase form labels, custom password toggle icon button inside relative container, and bright error banner.

- [ ] **Step 3: Verify TypeScript and compilation**
  Run: `npx tsc --noEmit`

---

### Task 2: Redesign Admin Layout Shell & Navigation Header (`src/app/id/admin/layout.tsx`)

**Files:**
- Modify: [src/app/id/admin/layout.tsx](file:///C:/Users/lulus/Dominator/pleatsssi/src/app/id/admin/layout.tsx)

**Interfaces:**
- Consumes: Next.js `usePathname`, `useRouter`, Lucide icons.
- Produces: High-contrast sidebar shell and sticky desktop/mobile header with breadcrumb tracking and user avatar card.

- [ ] **Step 1: Update navigation items and layout header state**
  Add breadcrumb title resolution based on `pathname`.

- [ ] **Step 2: Refine sidebar navigation styles**
  Implement sharp active indicator (`bg-[#0B4F3A]` with white text and left accent border), active badge support, polished user profile avatar card with initials, and red sign-out button.

- [ ] **Step 3: Add Topbar Header with Breadcrumbs & Live Storefront Link**
  On desktop, add a header bar above `<main>` showing breadcrumb navigation (e.g. `Admin > Dashboard`) and quick action buttons.

- [ ] **Step 4: Verify TypeScript compilation**
  Run: `npx tsc --noEmit`

---

### Task 3: Redesign Admin Dashboard Page (`src/app/id/admin/dashboard/page.tsx`)

**Files:**
- Modify: [src/app/id/admin/dashboard/page.tsx](file:///C:/Users/lulus/Dominator/pleatsssi/src/app/id/admin/dashboard/page.tsx)

**Interfaces:**
- Consumes: `PRODUCTS`, `CATEGORY_META`, `supabaseBrowserClient`.
- Produces: Modern metric KPI grid, DB mode indicator badge, quick action panel, and active categories summary table.

- [ ] **Step 1: Update Header and DB Mode Badge**
  Make the DB connection status pill highly visible (Emerald for Live DB, Amber for Static Fallback Mode) with bold text and icons.

- [ ] **Step 2: Redesign 4 Stat KPI Cards**
  Enhance metric cards with large bold numbers (`text-3xl font-bold text-slate-900`), icon badges in emerald tint, hover border state, and explicit direct links.

- [ ] **Step 3: Redesign Quick Action Cards & Active Categories Table**
  Style quick action cards with hover lift/border effects. Update categories summary table with `#F8FAFC` header, alternating rows, monospace slug pill, and direct edit link.

- [ ] **Step 4: Verify TypeScript compilation**
  Run: `npx tsc --noEmit`

---

### Task 4: Redesign Admin Products Page (`src/app/id/admin/products/page.tsx`)

**Files:**
- Modify: [src/app/id/admin/products/page.tsx](file:///C:/Users/lulus/Dominator/pleatsssi/src/app/id/admin/products/page.tsx)

**Interfaces:**
- Consumes: `getAdminProducts`, `createProduct`, `updateProduct`, `deleteProduct`.
- Produces: High-clarity product list table with stock status badges (In Stock, Low Stock, Out of Stock) and modal form updates.

- [ ] **Step 1: Update Filter & Search Control Bar**
  Style search input and category/status filter dropdowns with crisp borders and high contrast labels.

- [ ] **Step 2: Redesign Products Data Table & Status Badges**
  Add explicit stock status badges (`In Stock` - green, `Low Stock < 5` - amber, `Out of Stock` - rose), price & discount pills, product thumbnail fallback, and prominent action buttons.

- [ ] **Step 3: Verify TypeScript compilation**
  Run: `npx tsc --noEmit`

---

### Task 5: Redesign Admin Categories, Orders, Banners, Coupons & Info Pages

**Files:**
- Modify: [src/app/id/admin/categories/page.tsx](file:///C:/Users/lulus/Dominator/pleatsssi/src/app/id/admin/categories/page.tsx)
- Modify: [src/app/id/admin/orders/page.tsx](file:///C:/Users/lulus/Dominator/pleatsssi/src/app/id/admin/orders/page.tsx)
- Modify: [src/app/id/admin/banners/page.tsx](file:///C:/Users/lulus/Dominator/pleatsssi/src/app/id/admin/banners/page.tsx)
- Modify: [src/app/id/admin/coupons/page.tsx](file:///C:/Users/lulus/Dominator/pleatsssi/src/app/id/admin/coupons/page.tsx)
- Modify: [src/app/id/admin/info-pages/page.tsx](file:///C:/Users/lulus/Dominator/pleatsssi/src/app/id/admin/info-pages/page.tsx)

**Interfaces:**
- Consumes: Standard admin services for categories, orders, banners, coupons, info pages.
- Produces: Consistent high-contrast headers, status badges, table grids, and forms across all remaining admin modules.

- [ ] **Step 1: Upgrade Orders Page table and status badges**
  Format status badges for order states (`pending`, `paid`, `shipped`, `delivered`, `cancelled`).

- [ ] **Step 2: Upgrade Categories, Banners, Coupons, and Info Pages styling**
  Apply high-contrast tables, search/filter controls, modal inputs, and status badges.

- [ ] **Step 3: Verify TypeScript compilation**
  Run: `npx tsc --noEmit`

---

### Task 6: Full Verification & Build Test

- [ ] **Step 1: Run typecheck and linter**
  Run: `npm run check` or `npm run typecheck`
- [ ] **Step 2: Verify production build**
  Run: `npm run build`
