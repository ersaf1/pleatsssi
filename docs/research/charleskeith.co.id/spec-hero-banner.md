# SPEC: HeroBanner Component
Component: src/components/HeroBanner.tsx

## Purpose
Full-width hero image with text overlay and CTA button. Top section of page content below header.

## Visual Design
- Full viewport width
- Desktop height: ~762px (aspect ratio ~1920:1025)
- Mobile height: auto (aspect ratio ~600:1000, portrait)
- No background color (image fills area)
- Text overlay positioned bottom-left

## Images
- Desktop (min-width: 768px): 
  https://www.charleskeith.co.id/on/demandware.static/-/Library-Sites-CharlesKeithID/default/dw5660d2c2/images/kcg/Spring26/charles-keith-home-s-1-week-31-1920x1025.png
  - Save to: /public/images/hero-desktop.png
  
- Mobile (default):
  https://www.charleskeith.co.id/on/demandware.static/-/Library-Sites-CharlesKeithID/default/dwc878a740/images/kcg/Spring26/charles-keith-home-s-1-week-31-600x1000.png
  - Save to: /public/images/hero-mobile.png

## Text Content (overlay, bottom-left of image)
- H1: "Get Ready For Fall: Bags"
  - font: futura-pt, uppercase or title case
  - color: white (#fff)
  - font-size: ~24–32px desktop, ~20px mobile
  - font-weight: 600
- CTA Link: "Belanja Sekarang" (= "Shop Now")
  - color: white
  - underline decoration
  - font-size: ~15px
  - links to /id/bags (use href="#" for demo)

## HTML Structure
```jsx
<section className="relative w-full">
  <a href="#" className="block">
    <picture>
      <source media="(min-width: 768px)" srcSet="/images/hero-desktop.png" />
      <img src="/images/hero-mobile.png" alt="" className="w-full h-auto" />
    </picture>
    <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
      <h1 className="text-white font-semibold text-2xl md:text-3xl uppercase mb-2">
        Get Ready For Fall: Bags
      </h1>
      <p className="text-white text-[15px] underline">Belanja Sekarang</p>
    </div>
  </a>
</section>
```

## Implementation Notes
- Use Next.js `<Image>` component with fill or explicit dimensions
  OR use standard `<picture>` + `<img>` for responsive src switching
- The entire hero is wrapped in an `<a>` tag (the whole banner is clickable)
- Text overlay: `position: absolute`, `bottom-left` area
- fetchpriority="high" on the img tag
- No slider/carousel needed — single static image

## Responsive
- Desktop: wide landscape image (1920x1025)
- Mobile: tall portrait image (600x1000)
- Text overlay position adjusts: bottom-8 left-8 on mobile, bottom-12 left-12 on desktop
