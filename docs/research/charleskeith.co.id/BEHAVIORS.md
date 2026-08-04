# Charles & Keith Indonesia — Behaviors & Interactions
URL: https://www.charleskeith.co.id/id
Captured: 2026-08-04

## Header Behaviors

### Announcement Banner
- Auto-rotating text carousel, interval: 5 seconds
- Owl Carousel library used
- Desktop only (hidden on mobile)
- No manual prev/next controls visible
- Clicking any message opens a modal (data-target="#rotatingBannerModal")

### Sticky Header
- `.page_header--sticky` class — header sticks to top on scroll
- Transparent mode on hero: `.page_header-inner_transparent` with white text
- Transitions to solid white bg as user scrolls past hero

### Desktop Navigation
- Horizontal nav with 10 top-level items
- Hover on nav item opens mega-menu dropdown
- Mega menu shows: product images + category links
- Click outside closes mega menu
- Search: click search icon opens inline search bar

### Mobile Navigation
- Hamburger button (`.js-hamburger_menu--close`) toggles drawer
- Drawer slides in from left
- Each nav item has arrow-right icon (`.nav-arrow-icon`)
- Clicking nav item with children expands sub-level
- Back arrow (`.back-nav-icon`) returns to parent level
- Close button (`.burger_close`) closes drawer

## Hero Banner
- Full-width static image (no slider this week)
- Responsive: different image served at md breakpoint
- CTA text overlaid bottom-left of image
- Smooth scroll to next section not detected

## Lifestyle Dual Banner
- Two panels side by side (desktop), stacked (mobile)
- Text callout positioned absolutely, bottom area
- Hover effect: likely subtle scale or overlay (standard CK pattern)

## Product Grid
- Standard e-commerce product tiles
- Hover on tile: quick-add or wishlist appears
- Lazy loading images

## Footer
- Newsletter form: POST to /on/demandware.store/.../Newsletter-Subscribe
- reCAPTCHA v3 on newsletter form
- Email validation with regex pattern
- Social icons: linked to respective platform profiles
- "IKUTI KAMI" = "FOLLOW US" heading

## Scroll Library
- No Lenis or Locomotive Scroll detected
- Standard browser scroll

## Modals
- body has `modal-open` class → a modal is open on load (likely cookie consent or promo)
- Rotating banner modal: #rotatingBannerModal

## CSS Framework
- Bootstrap 4/5 utility classes (d-none, d-xl-block, d-grid, container, row, col-*)
- Custom BEM-style classes for components (page_header, header_banner, etc.)
- Swiper CSS vars present but may not be actively used on homepage

## SVG Icons
- Icons referenced via SVG `<use xlink:href="#icon-name">` sprite system
- Key icons:
  - `#search-mobile` — search icon
  - `#arrow` — nav arrow right
  - `#arrow-left` — back nav arrow
  - `#menu-close` — hamburger close icon
- No inline SVG sprite found (likely loaded separately)
