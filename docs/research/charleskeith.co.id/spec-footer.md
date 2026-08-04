# SPEC: Footer Component
Component: src/components/Footer.tsx

## Purpose
Site footer with newsletter signup, social links, navigation columns, and legal info.

## Visual Design
- Background: #ffffff
- Text: #000
- Font: futura-pt, 15px
- Full width
- Padding: generous top/bottom (py-12 or similar)

## Layout

### Mobile Layout (stacked)
1. Newsletter section (top)
2. Social links "IKUTI KAMI"
3. Footer nav columns (accordion-style or flat)

### Desktop Layout (multi-column grid)
- Left group: newsletter + social
- Right group: nav columns (Customer Service, About, Legal, etc.)

## Section 1: Newsletter
- Heading: "DAFTAR UNTUK MENDAPATKAN INFO FASHION TERBARU" (all caps, bold)
- Email input: placeholder "Masukkan email anda di sini"
- Submit button: "SUBSCRIBE" (uppercase, black button or outlined)
- Fine print: "Dengan berlangganan, Anda menyetujui Syarat & Ketentuan dan Kebijakan Privasi CHARLES & KEITH"
  - "Syarat & Ketentuan" = Terms & Conditions (underlined link)
  - "Kebijakan Privasi" = Privacy Policy (underlined link)

## Section 2: Social Links
- Heading: "IKUTI KAMI" (= "FOLLOW US", uppercase)
- Social icons row:
  - Facebook: https://www.facebook.com/charleskeith.id/
  - Instagram: https://instagram.com/charleskeithofficial/
  - YouTube: https://www.youtube.com/user/CharlesKeithChannel
  - Twitter/X: https://twitter.com/charles_keith
  - Pinterest: https://www.pinterest.com/charleskeithofficial
  - TikTok: https://www.tiktok.com/@charleskeithofficial
- Use Lucide icons or simple SVG placeholders: Facebook, Instagram, Youtube, Twitter, Pinterest
- Icon size: ~24px
- Color: #000, hover: #555

## Section 3: Contact
- Email: customer_care@ptkcg.co.id

## Footer Nav Links (approximate — typical CK footer)
Column 1: Customer Service
- Help Centre
- Order Status
- Returns & Exchanges
- Store Locator

Column 2: About CHARLES & KEITH
- Our Story
- Sustainability
- Careers
- Press

Column 3: Legal
- Terms & Conditions (Syarat & Ketentuan)
- Privacy Policy (Kebijakan Privasi)

## Bottom Bar
- Copyright: "© CHARLES & KEITH 2024"
- Payment methods icons (optional)

## Implementation Notes
- Newsletter input: `<input type="email">` with placeholder
- Subscribe button: `<button type="submit">SUBSCRIBE</button>`
- No actual form submission needed for demo — preventDefault()
- Social icons: use Lucide where available (Instagram, Youtube, Twitter, Facebook)
  For Pinterest and TikTok use simple SVG or text fallback
- Tailwind:
  - Heading: `text-sm font-bold uppercase tracking-widest`
  - Input: `border border-black px-4 py-2 text-sm flex-1`
  - Button: `bg-black text-white px-6 py-2 text-sm uppercase tracking-wide`
  - Social icon: `w-6 h-6 text-black hover:text-gray-500 transition`
- Font: futura-pt throughout

## Responsive
- Mobile: full width stacked layout
- Desktop (xl+): multi-column, newsletter + social on left, nav columns on right
