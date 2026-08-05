### Task 5: Category & Product Detail Page Redesign

**Files:**
- Modify: `src/components/CategoryHero.tsx`
- Modify: `src/components/CategoryPage.tsx`
- Modify: `src/components/ProductDetail.tsx`
- Modify: `src/components/InfoPage.tsx`

**Interfaces:**
- Consumes: Category metadata, product detail data, Zustand cart store (`useCartStore`).
- Produces: High-fashion PDP and Category pages with warm cream styling and Deep Emerald CTAs.

- [ ] **Step 1: Refactor `CategoryHero.tsx` & `CategoryPage.tsx`**
Update category hero headers with `Italiana` serif typography and warm cream background framing.

- [ ] **Step 2: Refactor `ProductDetail.tsx`**
Update PDP gallery grid, variant selectors, stock badges, and primary "Tambah ke Keranjang" button with Deep Emerald styling (`bg-[#0B4F3A] hover:bg-[#073628]`).

- [ ] **Step 3: Refactor `InfoPage.tsx`**
Update static info pages (FAQ, Return policy, Privacy policy) with warm cream container and editorial typography.

- [ ] **Step 4: Run full verification (`npx vitest run` && `npx tsc --noEmit` && `npm run build`)**

- [ ] **Step 5: Commit**

```bash
git add src/components/CategoryHero.tsx src/components/CategoryPage.tsx src/components/ProductDetail.tsx src/components/InfoPage.tsx
git commit -m "style: redesign category, product detail, and info pages"
```
