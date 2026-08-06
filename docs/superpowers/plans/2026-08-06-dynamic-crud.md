# Dynamic CRUD and Database Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Pleatsssi website fully dynamic by moving all products, categories, info-pages, and banners to Supabase database, enabling image uploads directly to Supabase Storage, and building an Admin Dashboard at `/id/admin` with full CRUD functionalities.

**Architecture:** Database migrations for missing tables, a dynamic service layer with a robust static fallback to prevent runtime crashes, an automated local-asset-uploading seed script, and a role-guarded admin router `/id/admin` built with Next.js Server Actions / APIs.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, Supabase JS, Vitest, TypeScript.

## Global Constraints
- Target database is PostgreSQL (via Supabase).
- All new database table primary keys must be UUID.
- No hardcoded data or external URLs for images in the storefront (all images must be uploaded to Storage).
- A robust fallback mechanism must return static data if Supabase credentials are missing or empty.
- Access to the `/id/admin` dashboard must be restricted to authenticated users with `admin` or `owner` roles.

---

### Task 1: SQL Migration and Database Setup

**Files:**
- Create: `supabase/migrations/20260806000000_dynamic_tables.sql`
- Test: `tests/database_structure.test.ts`

**Interfaces:**
- Consumes: Existing migrations in `supabase/migrations/`
- Produces: Tables `info_pages`, `banners`, `coupons` inside the database.

- [ ] **Step 1: Create SQL migration file**
  Create `supabase/migrations/20260806000000_dynamic_tables.sql` with the following content:
  ```sql
  -- Table for Info Pages
  CREATE TABLE IF NOT EXISTS info_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
  );

  -- Table for Banners
  CREATE TABLE IF NOT EXISTS banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('hero', 'promo', 'lifestyle')),
    title VARCHAR(150),
    subtitle VARCHAR(255),
    image_url_desktop TEXT NOT NULL,
    image_url_mobile TEXT NOT NULL,
    cta_label VARCHAR(100),
    cta_url VARCHAR(255),
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
  );

  -- Table for Coupons
  CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(30) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('fixed', 'percentage')),
    value DECIMAL(12,2) NOT NULL,
    min_purchase DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    max_discount DECIMAL(12,2),
    quota INTEGER,
    used_count INTEGER NOT NULL DEFAULT 0,
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
  );
  ```

- [ ] **Step 2: Create a unit test for verifying env/config**
  Create `tests/database_structure.test.ts` to check SQL schemas and env definitions:
  ```typescript
  import { expect, test } from 'vitest';
  import fs from 'fs';
  import path from 'path';

  test('migration file exists', () => {
    const filePath = path.join(__dirname, '../supabase/migrations/20260806000000_dynamic_tables.sql');
    expect(fs.existsSync(filePath)).toBe(true);
  });
  ```

- [ ] **Step 3: Run tests to verify setup**
  Run: `npm test tests/database_structure.test.ts`
  Expected: PASS

- [ ] **Step 4: Commit migration and setup**
  Commit:
  ```bash
  git add supabase/migrations/20260806000000_dynamic_tables.sql tests/database_structure.test.ts
  git commit -m "feat: add database migration for banners, coupons, and info pages"
  ```

---

### Task 2: Dynamic Services & Mapping Layer (Storefront)

**Files:**
- Create: `src/lib/services/productService.ts`
- Create: `src/lib/services/categoryService.ts`
- Create: `src/lib/services/bannerService.ts`
- Create: `src/lib/services/infoPageService.ts`
- Test: `tests/services.test.ts`

**Interfaces:**
- Consumes: `supabaseBrowserClient` from `src/lib/supabaseClient.ts`, static files in `src/data/*`
- Produces: Query methods `getDynamicProducts()`, `getDynamicCategories()`, `getDynamicBanners()`, `getDynamicInfoPages()`.

- [ ] **Step 1: Write info page service**
  Create `src/lib/services/infoPageService.ts`:
  ```typescript
  import { supabaseBrowserClient } from '../supabaseClient';
  import { INFO_PAGES as STATIC_INFO } from '@/data/info-pages';

  export async function getDynamicInfoPage(slug: string) {
    try {
      const { data, error } = await supabaseBrowserClient
        .from('info_pages')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error || !data) {
        return STATIC_INFO[slug] ? { title: STATIC_INFO[slug].title, content: STATIC_INFO[slug].content } : null;
      }
      return data;
    } catch {
      return STATIC_INFO[slug] ? { title: STATIC_INFO[slug].title, content: STATIC_INFO[slug].content } : null;
    }
  }
  ```

- [ ] **Step 2: Write banner service**
  Create `src/lib/services/bannerService.ts`:
  ```typescript
  import { supabaseBrowserClient } from '../supabaseClient';

  export interface Banner {
    id: string;
    type: 'hero' | 'promo' | 'lifestyle';
    title: string | null;
    subtitle: string | null;
    image_url_desktop: string;
    image_url_mobile: string;
    cta_label: string | null;
    cta_url: string | null;
    sort_order: number;
    is_active: boolean;
  }

  export async function getDynamicBanners(type?: 'hero' | 'promo' | 'lifestyle'): Promise<Banner[]> {
    try {
      let query = supabaseBrowserClient.from('banners').select('*').eq('is_active', true).order('sort_order', { ascending: true });
      if (type) {
        query = query.eq('type', type);
      }
      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return []; // Fallback to empty if not configured
      }
      return data as Banner[];
    } catch {
      return [];
    }
  }
  ```

- [ ] **Step 3: Write category service**
  Create `src/lib/services/categoryService.ts`:
  ```typescript
  import { supabaseBrowserClient } from '../supabaseClient';
  import { CATEGORY_META } from '@/data/categories';

  export async function getDynamicCategories() {
    try {
      const { data, error } = await supabaseBrowserClient
        .from('categories')
        .select('*')
        .order('name');
      
      if (error || !data || data.length === 0) {
        return Object.values(CATEGORY_META);
      }
      return data;
    } catch {
      return Object.values(CATEGORY_META);
    }
  }
  ```

- [ ] **Step 4: Write product service**
  Create `src/lib/services/productService.ts`:
  ```typescript
  import { supabaseBrowserClient } from '../supabaseClient';
  import { PRODUCTS as STATIC_PRODUCTS, type Product } from '@/data/products';

  export async function getDynamicProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabaseBrowserClient
        .from('products')
        .select(`
          id,
          name,
          slug,
          description,
          material,
          price,
          discount,
          status,
          categories(id, name, slug),
          product_variants(id, color, color_hex, size, sku, stock),
          product_images(id, image_url, sort_order, is_primary)
        `)
        .eq('status', 'published');

      if (error || !data || data.length === 0) {
        return STATIC_PRODUCTS;
      }
      
      // Map DB structure to Product interface
      return data.map((p: any) => {
        const primaryImage = p.product_images?.find((img: any) => img.is_primary)?.image_url || p.product_images?.[0]?.image_url || '';
        const hoverImage = p.product_images?.[1]?.image_url || primaryImage;
        const swatches = Array.from(new Set(p.product_variants?.map((v: any) => v.color_hex).filter(Boolean))) as string[];
        
        return {
          id: p.id,
          name: p.name,
          color: p.product_variants?.[0]?.color || '',
          price: `IDR${Number(p.price).toLocaleString('en-US')}`,
          originalPrice: p.discount > 0 ? `IDR${Number(p.price * (1 + p.discount/100)).toLocaleString('en-US')}` : null,
          discount: p.discount > 0 ? `${p.discount}% OFF` : null,
          priceValue: Number(p.price),
          installment: `IDR${Math.round(Number(p.price) / 3).toLocaleString('en-US')}`,
          image: primaryImage,
          hoverImage: hoverImage,
          swatches: swatches,
          gallery: p.product_images?.map((img: any) => img.image_url) || [],
          category: p.categories?.slug || 'others',
          collections: ['new-arrivals'], // default mapped collection
          isSale: p.discount > 0,
          pdpUrl: `/id/products/${p.id}`
        };
      }) as Product[];
    } catch {
      return STATIC_PRODUCTS;
    }
  }
  ```

- [ ] **Step 5: Write unit tests for fallback logic**
  Create `tests/services.test.ts`:
  ```typescript
  import { expect, test } from 'vitest';
  import { getDynamicInfoPage } from '../src/lib/services/infoPageService';
  import { getDynamicProducts } from '../src/lib/services/productService';

  test('info page service returns fallback when DB error occurs', async () => {
    const page = await getDynamicInfoPage('faq');
    expect(page).toBeDefined();
    expect(page?.title).toContain('TANYA JAWAB');
  });

  test('product service returns fallback static products when DB error occurs', async () => {
    const products = await getDynamicProducts();
    expect(products.length).toBeGreaterThan(0);
    expect(products[0].priceValue).toBeGreaterThan(0);
  });
  ```

- [ ] **Step 6: Run tests and commit**
  Run: `npm test tests/services.test.ts`
  Expected: PASS
  Commit:
  ```bash
  git add src/lib/services/ tests/services.test.ts
  git commit -m "feat: implement dynamic database services with static fallback"
  ```

---

### Task 3: Seeding & Local Image Upload Script

**Files:**
- Create: `scripts/seed-supabase.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: Local files in `src/data/` and local product image assets in `public/images/`
- Produces: Populated data in Supabase Database and uploaded image assets in Supabase Storage.

- [ ] **Step 1: Write seeding script**
  Create `scripts/seed-supabase.ts` with connection details to loop through `categories`, `products` and upload images to bucket `pleatsssi-assets`:
  ```typescript
  import { createClient } from '@supabase/supabase-js';
  import fs from 'fs';
  import path from 'path';
  import dotenv from 'dotenv';

  dotenv.config();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing credentials.");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  async function seed() {
    console.log("Seeding process started...");
    
    // Seed Categories
    const categories = [
      { name: "Rok", slug: "skirts" },
      { name: "Atasan", slug: "tops" },
      { name: "Celana", slug: "pants" },
      { name: "Lainnya", slug: "others" }
    ];

    for (const cat of categories) {
      const { data, error } = await supabase.from('categories').upsert(cat, { onConflict: 'slug' }).select();
      if (error) console.error("Category seed error", error);
      else console.log(`Category seeded: ${cat.slug}`);
    }

    console.log("Categories seeded successfully.");
  }

  seed();
  ```

- [ ] **Step 2: Add seed command to script configurations**
  Add script running definitions to `package.json`:
  ```json
  "scripts": {
    ...
    "db:seed": "node --import tsx scripts/seed-supabase.ts"
  }
  ```

- [ ] **Step 3: Commit seeding config**
  Commit:
  ```bash
  git add scripts/seed-supabase.ts package.json
  git commit -m "feat: add database seeding script placeholder"
  ```

---

### Task 4: Dynamic Storefront Integration

**Files:**
- Modify: `src/app/id/[category]/page.tsx`
- Modify: `src/app/id/products/[id]/page.tsx`
- Modify: `src/app/id/faq/page.tsx`
- Modify: `src/app/id/privacy-policy/page.tsx`
- Modify: `src/app/id/terms-of-use/page.tsx`

**Interfaces:**
- Consumes: Services created in Task 2.
- Produces: Dynamic pages fetching records live from Supabase.

- [ ] **Step 1: Refactor Category listing page to dynamic**
  Edit `src/app/id/[category]/page.tsx` to remove `dynamicParams = false` and load dynamic categories/products.
  ```typescript
  import type { Metadata } from "next";
  import { getDynamicCategories } from "@/lib/services/categoryService";
  import { CategoryPage } from "@/components/CategoryPage";

  export const dynamic = "force-dynamic";

  export default async function Page({
    params,
  }: {
    params: Promise<{ category: string }>;
  }) {
    const { category } = await params;
    return <CategoryPage slug={category} />;
  }
  ```

- [ ] **Step 2: Refactor Product details page to dynamic**
  Edit `src/app/id/products/[id]/page.tsx` to fetch dynamic products using `getDynamicProducts()` and detail rendering methods.
  ```typescript
  import { notFound } from "next/navigation";
  import { getDynamicProducts } from "@/lib/services/productService";
  import { ProductDetail } from "@/components/ProductDetail";

  export const dynamic = "force-dynamic";

  export default async function ProductPage({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const { id } = await params;
    const products = await getDynamicProducts();
    const product = products.find(p => p.id === id);
    if (!product) notFound();

    return (
      <ProductDetail
        product={product}
        variants={[product]}
        relatedProducts={products.slice(0, 4)}
        pairingProducts={products.slice(0, 4)}
      />
    );
  }
  ```

- [ ] **Step 3: Refactor static info pages to fetch dynamic content**
  Update `src/app/id/faq/page.tsx`, `src/app/id/privacy-policy/page.tsx`, `src/app/id/terms-of-use/page.tsx` to read content using `getDynamicInfoPage()`.

- [ ] **Step 4: Test storefront loading and commit**
  Run verification checks: `npm run check`
  Commit:
  ```bash
  git add src/app/id/
  git commit -m "feat: integrate dynamic services to storefront routes"
  ```

---

### Task 5: Admin Authentication and Middleware Setup

**Files:**
- Modify: `src/middleware.ts`
- Create: `src/app/id/admin/login/page.tsx`
- Create: `src/app/id/admin/layout.tsx`

**Interfaces:**
- Consumes: Supabase authentication session.
- Produces: Protected admin layouts.

- [ ] **Step 1: Create Admin Login Page**
  Create `src/app/id/admin/login/page.tsx` providing email & password inputs sending POST calls to `/api/auth/login`.

- [ ] **Step 2: Create Admin Layout**
  Create `src/app/id/admin/layout.tsx` rendering dashboard shell layout for authenticated admin roles.

- [ ] **Step 3: Setup routing guards in middleware**
  Update `src/middleware.ts` to redirect non-admin/owner roles trying to access `/id/admin/*` to `/id/admin/login`.

- [ ] **Step 4: Commit Auth guards**
  Commit:
  ```bash
  git add src/middleware.ts src/app/id/admin/
  git commit -m "feat: setup admin routes, authentication layout, and middleware role check"
  ```

---

### Task 6: Admin Dashboard Layout and Category CRUD

**Files:**
- Create: `src/app/id/admin/dashboard/page.tsx`
- Create: `src/app/id/admin/categories/page.tsx`

**Interfaces:**
- Consumes: `categories` table.
- Produces: Category list and forms for CRUD operations with photo uploading.

- [ ] **Step 1: Implement Category CRUD**
  Develop `src/app/id/admin/categories/page.tsx` to provide listing table of categories, creation modal with image uploader, and deletion functions.

- [ ] **Step 2: Commit Category CRUD**
  Commit:
  ```bash
  git add src/app/id/admin/categories/
  git commit -m "feat: add admin dashboard layout and category CRUD panel"
  ```

---

### Task 7: Admin Product & Variant CRUD

**Files:**
- Create: `src/app/id/admin/products/page.tsx`

**Interfaces:**
- Consumes: `products`, `product_variants`, `product_images` tables.
- Produces: UI panels managing product listings, metadata forms, variant combinations, and file-uploading gallery widgets.

- [ ] **Step 1: Implement Product editor panel**
  Create `src/app/id/admin/products/page.tsx` to enable product attributes management (name, slug, price, material, size chart) and variants details.

- [ ] **Step 2: Commit Product CRUD**
  Commit:
  ```bash
  git add src/app/id/admin/products/
  git commit -m "feat: implement product CRUD with variant and image upload handlers"
  ```

---

### Task 8: Admin Banner, Coupon, Info Page CRUD & Order Manager

**Files:**
- Create: `src/app/id/admin/banners/page.tsx`
- Create: `src/app/id/admin/coupons/page.tsx`
- Create: `src/app/id/admin/info-pages/page.tsx`
- Create: `src/app/id/admin/orders/page.tsx`

**Interfaces:**
- Consumes: `banners`, `coupons`, `info_pages`, and `orders` tables.
- Produces: Admin CRUD controls for assets, coupons, informational contents, and fulfillment tracking page.

- [ ] **Step 1: Create Banners, Coupons, and Info Pages panels**
  Implement panels inside `/id/admin/banners`, `/id/admin/coupons`, and `/id/admin/info-pages`.

- [ ] **Step 2: Create Order Fulfillment list**
  Create `/id/admin/orders/page.tsx` allowing statuses processing update logs and shipping number insertions.

- [ ] **Step 3: Test and commit final dashboard**
  Run: `npm run check`
  Commit:
  ```bash
  git add src/app/id/admin/
  git commit -m "feat: complete remaining banners, coupons, info pages, and orders CRUD views"
  ```
