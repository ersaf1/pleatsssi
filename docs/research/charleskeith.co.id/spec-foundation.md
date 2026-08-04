# SPEC: Foundation / Global Styles
Files:
- src/app/globals.css
- src/app/layout.tsx
- src/lib/fonts.ts (or inline in layout)

## Typography
### Font: futura-pt (Adobe Typekit)
- Typekit kit ID: exv2fdk
- Load via: <link rel="stylesheet" href="https://use.typekit.net/exv2fdk.css">
- Weights available:
  - futura-pt: 400 normal, 400 italic, 600 normal, 600 italic
  - futura-pt-bold: 700 normal, 700 italic

### How to load in Next.js layout.tsx
```tsx
// In <head> via metadata or directly:
// Add to layout.tsx <head>:
<link rel="stylesheet" href="https://use.typekit.net/exv2fdk.css" />
```

Or via next/font/local if self-hosting (not needed — Typekit CDN is fine).

### Tailwind font config
In globals.css (Tailwind v4 with @theme):
```css
@theme {
  --font-sans: "futura-pt", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
```

## Color Tokens
```css
@theme {
  --color-ck-black: #000000;
  --color-ck-white: #ffffff;
  --color-ck-gray: #333333;
  --color-ck-light-gray: #f0f0f0;
  --color-ck-border: #e5e5e5;
  --color-ck-secondary: #cccccc;
  --color-ck-sale: #cc0000;
}
```

## Base CSS Reset / Global Styles
```css
* {
  box-sizing: border-box;
}

body {
  font-family: var(--font-sans);
  font-size: 15px;
  color: #000;
  background: #fff;
  -webkit-font-smoothing: antialiased;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  max-width: 100%;
  height: auto;
}
```

## Breakpoints (match original exactly)
```css
@theme {
  --breakpoint-sm: 375px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1920px;
}
```

## layout.tsx metadata
```tsx
export const metadata = {
  title: "CHARLES & KEITH Indonesia - Belanja di situs resmi",
  description: "Belanja di situs resmi CHARLES & KEITH untuk fashion wanita dan fashion anak-anak terbaru, termasuk tas, sepatu, dan aksesori. Lihat koleksi baru hari ini.",
  themeColor: "#000000",
}
```

## Public assets to download
Run these downloads into public/images/:

### Hero images
- Desktop: https://www.charleskeith.co.id/on/demandware.static/-/Library-Sites-CharlesKeithID/default/dw5660d2c2/images/kcg/Spring26/charles-keith-home-s-1-week-31-1920x1025.png
  → public/images/hero-desktop.png
  
- Mobile: https://www.charleskeith.co.id/on/demandware.static/-/Library-Sites-CharlesKeithID/default/dwc878a740/images/kcg/Spring26/charles-keith-home-s-1-week-31-600x1000.png
  → public/images/hero-mobile.png

### Lifestyle banners
- Shoes: https://www.charleskeith.co.id/on/demandware.static/-/Library-Sites-CharlesKeithID/default/dw17412d48/images/kcg/Spring26/charles-keith-home-d-1-week-31-600x800-rev.png
  → public/images/lifestyle-shoes.png

- New This Week: https://www.charleskeith.co.id/on/demandware.static/-/Library-Sites-CharlesKeithID/in_ID/v1785752822902/images/kcg/Spring26/charles-keith-home-d-2-week-31-600x1000-rev.png
  → public/images/lifestyle-new.png
