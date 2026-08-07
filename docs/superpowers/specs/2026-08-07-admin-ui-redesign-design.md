# Admin UI Redesign Specification (High-Contrast & Modern Aesthetic)

## 1. Overview & Objectives
The goal of this redesign is to modernize and clarify the entire PLEATSSSI Admin Suite (`/id/admin/*`). The user requested a significantly clearer, more distinct, and visual-heavy admin interface ("lebih jelas").

Key improvements:
- High contrast color palette with deep emerald accent (`#0B4F3A`), slate text (`#0F172A`), and ultra-clean white cards against subtle slate backgrounds (`#F8FAFC`).
- Improved visual hierarchy: bold metric KPI cards, clear status badges (In Stock, Low Stock, Out of Stock, Live DB, Fallback Mode), distinct active navigation states, and high-readability data tables.
- Enhanced Admin Login Page with password visibility toggles, security badges, and clear error alert states.
- Polished top navigation bar with breadcrumb tracking, user profile avatars, and quick action shortcuts.

---

## 2. Design Tokens & UI Component Standards

### 2.1 Color Palette
- **Canvas Background**: `#F8FAFC` (Slate-50) for high contrast behind white cards
- **Card Background**: `#FFFFFF` (Pure White) with `#E2E8F0` border
- **Primary / Accent**: `#0B4F3A` (Deep Emerald Green)
- **Primary Hover**: `#083C2C` (Darker Emerald)
- **Text Primary**: `#0F172A` (Slate 900 - High Contrast)
- **Text Secondary**: `#475569` (Slate 600)
- **Text Muted**: `#94A3B8` (Slate 400)

### 2.2 Status Badges & Indicators
- **Success / Active / Live DB / Published**:
  - Background: `bg-emerald-50`
  - Text: `text-emerald-700 font-semibold`
  - Border: `border border-emerald-200`
- **Warning / Low Stock / Fallback Mode / Pending**:
  - Background: `bg-amber-50`
  - Text: `text-amber-700 font-semibold`
  - Border: `border border-amber-200`
- **Danger / Out of Stock / Cancelled / Error**:
  - Background: `bg-rose-50`
  - Text: `text-rose-700 font-semibold`
  - Border: `border border-rose-200`
- **Neutral / Draft / Inactive**:
  - Background: `bg-slate-100`
  - Text: `text-slate-700 font-semibold`
  - Border: `border border-slate-200`

---

## 3. Targeted Pages & Component Specifications

### 3.1 Admin Login Page (`/id/admin/login/page.tsx`)
- **Card Container**: Centered glassmorphic card on `#F8FAFC` background with subtle shadow and emerald header border.
- **Brand Header**: Security lock badge with emerald gradient circle, serif title, and clear subtitle instructions.
- **Password Input**: Integrated eye icon button (`Eye` / `EyeOff` from `lucide-react`) allowing toggle of password visibility.
- **Error State**: Prominent red banner with `AlertCircle` icon, clear contrast text, and auto-dismiss / re-validation states.
- **Action Button**: Full-width `#0B4F3A` button with hover state, focus ring, loading spinner, and right arrow icon.

### 3.2 Admin Layout & Navigation (`/id/admin/layout.tsx`)
- **Sidebar**:
  - Dark/Light contrast sidebar with active nav item indicator (`#0B4F3A` background with crisp white icon/text and left accent border).
  - Navigation item hover states with smooth transition and icon color change.
  - Footer user profile card with user avatar initials badge, email display, and red-highlighted logout button.
- **Topbar Bar**:
  - Breadcrumbs display (`Admin > Dashboard` or `Admin > Products`).
  - Quick action toolbar: View Storefront button, DB Status indicator pill, and Mobile drawer toggle button.

### 3.3 Admin Dashboard (`/id/admin/dashboard/page.tsx`)
- **Page Header**: Distinct page title with live database status badge (Live DB connected vs Static fallback mode) and explicit refresh trigger.
- **KPI Metric Cards**:
  - 4 major stat cards: Total Products, Active Categories, Total Orders, Active Banners.
  - Large bold numbers (`text-3xl font-bold text-slate-900`), icon container with emerald tint, subtext details, and hover border highlights.
- **Quick Action Grid**:
  - Interactive cards pointing to Products, Categories, Banners, and Orders with hover transition and clear action links.
- **Active Data Summaries**:
  - High-visibility categories summary table with clear status badges and action links.
  - System status panel with storage bucket details and live environment telemetry.

### 3.4 Admin Data Management Pages (`products`, `categories`, `orders`, `banners`, `coupons`, `info-pages`)
- **Products Page (`/id/admin/products/page.tsx`)**:
  - Enhanced search bar and category/status filter dropdowns with crisp borders.
  - High-contrast table view: product thumbnails with image fallback, stock status badges (In Stock, Low Stock < 5, Out of Stock = 0), price/discount display, and clear action button group (Edit, Delete, Preview).
- **Categories, Orders, Banners, Coupons, Info Pages**:
  - Standardized table layout, bold header text, sharp cell borders, clear badges for status/role, and action buttons.

---

## 4. Self-Review Checklist
- [x] Scope focus: Explicitly targets admin login and all admin pages.
- [x] Design consistency: Shared color tokens and status badge rules across all admin files.
- [x] Technical feasibility: Pure Tailwind v4 + React state + Lucide icons.
