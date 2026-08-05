### Task 1: Design System Tokens & Typography Setup

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/id/layout.tsx`

**Interfaces:**
- Consumes: Google Fonts (`Italiana`, `Outfit`).
- Produces: CSS variables and utility classes (`font-display`, `font-sans`, `bg-cream-bg`, `bg-cream-surface`, `text-charcoal`, `bg-emerald-accent`, `border-sand`).

- [ ] **Step 1: Update `src/app/globals.css` with font imports & CSS variables**

Add `@import url('https://fonts.googleapis.com/css2?family=Italiana&family=Outfit:wght@300;400;500;600;700&display=swap');` at top of `globals.css` and configure theme colors.

- [ ] **Step 2: Update root `layout.tsx` to set default body background & text**

Apply `bg-[#FAF7F2] text-[#1A1918] font-sans antialiased` to the root HTML body.

- [ ] **Step 3: Run `npx vitest run` to verify tests pass**

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx src/app/id/layout.tsx
git commit -m "style: configure bright cream design system tokens and Google Fonts"
```

---

