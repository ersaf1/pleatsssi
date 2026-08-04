# SPEC: Header / Navigation Component
Component: src/components/Header.tsx
Sub-components: src/components/MegaMenu.tsx (optional), src/components/MobileNav.tsx (optional)

## Purpose
Main site header with logo, navigation links, and utility icons. Sticky on scroll.

## Visual Design
- Background: #ffffff
- Text/icon color: #000 (or #333 for nav links)
- Font: futura-pt, 15px (nav), uppercase for nav items
- Height: ~60–70px (nav row), plus announcement bar above
- Full width, sticky top-0

## Layout Structure (Desktop, 3-column flex)
```
[Search Icon]    [CHARLES & KEITH Logo]    [Country | Wishlist | Account | Cart]
```
Below logo row: full-width horizontal nav
```
[PRODUK BARU] [SEPATU] [TAS] [DOMPET] [AKSESORI] [KOLEKSI ANAK-ANAK] [GIFTS] [TRENDING NOW] [STORIES] [SALE]
```

## Nav Items (10 total)
1. PRODUK BARU → /id/new-arrivals
2. SEPATU → /id/shoes
3. TAS → /id/bags
4. DOMPET → /id/wallets
5. AKSESORI → /id/accessories
6. KOLEKSI ANAK-ANAK → /id/kids
7. GIFTS → /id/curated/gifts
8. TRENDING NOW → /id/trending-now
9. STORIES → /id/press/editorials
10. SALE → /id/sale (typically styled red/accent)

## Logo
- Text: "CHARLES & KEITH"
- All caps, centered in header
- Font: futura-pt-bold, weight 700, large (~20–24px)
- Links to /id

## Header Utility Icons (right side, desktop)
- Country selector: "ID" flag/text (Indonesia)
- Wishlist: heart icon (Lucide `Heart`)
- Account: person icon (Lucide `User`)
- Cart: bag/cart icon with item count badge (Lucide `ShoppingBag`)

## Mobile Layout
- Left: hamburger menu (Lucide `Menu`)
- Center: CHARLES & KEITH logo
- Right: Search + Cart icons

## Sticky Behavior
- `sticky top-0 z-50`
- White background always on desktop scroll
- Border bottom: 1px solid #e5e5e5 or subtle shadow

## SALE Item Styling
- Text color: red (#e00 or similar)
- Otherwise same as other nav items

## Hover State (Desktop Nav)
- Underline or color darkens on hover
- Mega-menu opens below (implement as basic dropdown with placeholder content)

## Mobile Drawer (MobileNav)
- Slides in from left on hamburger click
- Full height, white background
- Each item shows arrow-right icon (Lucide `ChevronRight`)
- Close button top-right (Lucide `X`)
- Same 10 nav items listed vertically

## Implementation Notes
- Use `useState` for mobile drawer open/closed
- Use `useEffect` for sticky scroll detection (or just CSS sticky)
- All nav links use Next.js `<Link>` component (href="#" for demo)
- Tailwind classes:
  - Header: `sticky top-0 z-50 bg-white border-b border-gray-100`
  - Logo: `font-bold uppercase tracking-widest text-xl`
  - Nav items: `text-[15px] uppercase tracking-wide text-[#333] hover:text-black`
  - SALE: `text-red-600`
- futura-pt font applied via className on root element

## Responsive Breakpoints
- Mobile (< 1280px): hamburger + logo + icons
- Desktop (xl, 1280px+): full 3-col + nav row
