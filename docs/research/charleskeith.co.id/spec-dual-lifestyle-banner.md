# SPEC: DualLifestyleBanner Component
Component: src/components/DualLifestyleBanner.tsx

## Purpose
Two side-by-side editorial lifestyle images with text overlays. Below the hero banner.

## Visual Design
- Full width, CSS Grid: 2 equal columns on desktop
- Single column (stacked) on mobile
- Each panel: portrait image (~600x800px ratio) with text overlay

## Panel 1 — Shoes Collection
- Image URL: https://www.charleskeith.co.id/on/demandware.static/-/Library-Sites-CharlesKeithID/default/dw17412d48/images/kcg/Spring26/charles-keith-home-d-1-week-31-600x800-rev.png
- Save to: /public/images/lifestyle-shoes.png
- Text overlay:
  - Heading: "Shoes Collection"
  - CTA: "Belanja Sekarang"
  - Link: /id/shoes (use href="#" for demo)

## Panel 2 — New This Week
- Image URL: https://www.charleskeith.co.id/on/demandware.static/-/Library-Sites-CharlesKeithID/in_ID/v1785752822902/images/kcg/Spring26/charles-keith-home-d-2-week-31-600x1000-rev.png
- Save to: /public/images/lifestyle-new.png
- Text overlay:
  - Heading: "New This Week"
  - CTA: "Belanja Sekarang"
  - Link: /id/new-arrivals (use href="#" for demo)

## Text Overlay Design
- Positioned: absolute, bottom-left of each panel (approx bottom-8 left-6)
- Heading: futura-pt, ~15–18px, uppercase or mixed case, color: #000 or #fff depending on image
- CTA "Belanja Sekarang": futura-pt, 14–15px, underline
- Background: none (text directly on image)
- NOTE: Check desktop screenshot — text may be dark or light depending on image background

## HTML Structure
```jsx
<section className="grid grid-cols-1 md:grid-cols-2 w-full">
  {/* Panel 1 */}
  <a href="#" className="relative block overflow-hidden">
    <img src="/images/lifestyle-shoes.png" alt="Shoes Collection" className="w-full h-auto" />
    <div className="absolute bottom-8 left-6">
      <p className="text-sm uppercase tracking-wide font-semibold mb-1">Shoes Collection</p>
      <p className="text-sm underline">Belanja Sekarang</p>
    </div>
  </a>
  {/* Panel 2 */}
  <a href="#" className="relative block overflow-hidden">
    <img src="/images/lifestyle-new.png" alt="New This Week" className="w-full h-auto" />
    <div className="absolute bottom-8 left-6">
      <p className="text-sm uppercase tracking-wide font-semibold mb-1">New This Week</p>
      <p className="text-sm underline">Belanja Sekarang</p>
    </div>
  </a>
</section>
```

## Implementation Notes
- CSS Grid, not flexbox — matches original `d-grid homepage_2023_banner-lifestyle_wrapper`
- Each panel is a clickable link
- Images: use Next.js Image or standard img
- The callout text uses `position: absolute` inside a `position: relative` container
- Hover: subtle scale transform (scale-105 on image) is common CK pattern

## Responsive
- Mobile: grid-cols-1 (stacked)
- Desktop (md+): grid-cols-2 (side by side)
