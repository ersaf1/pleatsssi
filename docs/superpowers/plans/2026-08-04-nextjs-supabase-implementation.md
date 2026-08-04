# Next.js + Supabase E-Commerce Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement database schema, auth, cart synchronization, checkout, and Midtrans payment gateway inside the Next.js App Router workspace using Supabase.

**Architecture:** Monolithic Next.js 16 with Route Handlers for APIs, Supabase SSR for cookies-based sessions and RLS, and Zustand for client-side state.

**Tech Stack:** Next.js 16, Supabase JS Client, Supabase SSR, Midtrans Node Client, Zustand, Zod.

## Global Constraints
* Node version >= 24.
* Next.js 16 App Router configuration.
* All data tables must use UUID primary keys.
* Supabase environment variables must be kept server-side only for secret keys.

---

### Task 1: Supabase Setup & Database Scaffolding

**Files:**
* Create: `src/lib/supabaseServer.ts`
* Create: `src/lib/supabaseClient.ts`
* Create: `supabase/migrations/20260804000000_init_schema.sql`
* Create: `supabase/seed.sql`
* Create: `tests/database.test.ts`
* Modify: `package.json`

**Interfaces:**
* Produces: `supabaseServerClient` function returning Supabase server instance.
* Produces: `supabaseBrowserClient` object returning Supabase browser client instance.

- [ ] **Step 1: Install Supabase JS and SSR libraries**
  
  Run: `npm install @supabase/supabase-js @supabase/ssr`

- [ ] **Step 2: Create Supabase client initializers**
  
  Create `src/lib/supabaseClient.ts` with browser-client initialization:
  ```typescript
  import { createBrowserClient } from '@supabase/ssr';
  export const supabaseBrowserClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  ```

  Create `src/lib/supabaseServer.ts` with server-client initialization:
  ```typescript
  import { createServerClient } from '@supabase/ssr';
  import { cookies } from 'next/headers';

  export async function supabaseServerClient() {
    const cookieStore = await cookies();
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Handle server component limits on setting cookies
            }
          },
        },
      }
    );
  }
  ```

- [ ] **Step 3: Define PostgreSQL tables migration**
  
  Create `supabase/migrations/20260804000000_init_schema.sql`:
  ```sql
  -- Enable UUID extension
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  -- Users Profile Table
  CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'customer',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
  );

  -- Categories Table
  CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
  );

  -- Size Charts Table
  CREATE TABLE size_charts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    chart_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
  );

  -- Products Table
  CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    size_chart_id UUID REFERENCES size_charts(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    material TEXT,
    price DECIMAL(12,2) NOT NULL,
    discount INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
  );

  -- Product Variants Table
  CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    color VARCHAR(50) NOT NULL,
    color_hex VARCHAR(7) NOT NULL,
    size VARCHAR(10) NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
  );
  ```

- [ ] **Step 4: Configure test framework (Vitest)**
  
  Run: `npm install -D vitest`
  
  Update `package.json` to include `"test": "vitest run"` in scripts.

- [ ] **Step 5: Write database connection verification test**
  
  Create `tests/database.test.ts`:
  ```typescript
  import { expect, test } from 'vitest';
  
  test('verify env parameters exist', () => {
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
    expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
  });
  ```

- [ ] **Step 6: Run tests and commit**
  
  Run: `npm run test`
  
  Expected: PASS
  
  Commit: `git add package.json src/lib/ supabase/ tests/ && git commit -m "feat: setup database schema and supabase connection"`

---

### Task 2: Supabase SSR Authentication & Middleware Protection

**Files:**
* Create: `src/middleware.ts`
* Create: `src/app/api/auth/login/route.ts`
* Create: `src/app/api/auth/register/route.ts`
* Create: `src/app/api/auth/logout/route.ts`
* Create: `tests/auth.test.ts`

**Interfaces:**
* Consumes: `supabaseServerClient` from Task 1.

- [ ] **Step 1: Write authentication route handlers**
  
  Create `src/app/api/auth/login/route.ts`:
  ```typescript
  import { NextResponse } from 'next/server';
  import { supabaseServerClient } from '@/lib/supabaseServer';

  export async function POST(request: Request) {
    const { email, password } = await request.json();
    const supabase = await supabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: true, data });
  }
  ```

  Create `src/app/api/auth/register/route.ts` (signs up user and adds user record):
  ```typescript
  import { NextResponse } from 'next/server';
  import { supabaseServerClient } from '@/lib/supabaseServer';

  export async function POST(request: Request) {
    const { email, password, name } = await request.json();
    const supabase = await supabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: true, data });
  }
  ```

  Create `src/app/api/auth/logout/route.ts`:
  ```typescript
  import { NextResponse } from 'next/server';
  import { supabaseServerClient } from '@/lib/supabaseServer';

  export async function POST() {
    const supabase = await supabaseServerClient();
    await supabase.auth.signOut();
    return NextResponse.json({ success: true });
  }
  ```

- [ ] **Step 2: Create Next.js route protection middleware**
  
  Create `src/middleware.ts`:
  ```typescript
  import { NextResponse, type NextRequest } from 'next/server';
  import { createServerClient } from '@supabase/ssr';

  export async function middleware(request: NextRequest) {
    let response = NextResponse.next({ request });
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Protect checkout and profile routes
    if (!user && (request.nextUrl.pathname.startsWith('/id/profile') || request.nextUrl.pathname.startsWith('/id/checkout'))) {
      return NextResponse.redirect(new URL('/id/login', request.url));
    }

    return response;
  }

  export const config = {
    matcher: ['/id/profile/:path*', '/id/checkout/:path*'],
  };
  ```

- [ ] **Step 3: Write tests for authentication routing**
  
  Create `tests/auth.test.ts` to mock Route Handlers and assert response codes.

- [ ] **Step 4: Run tests and commit**
  
  Run: `npm run test`
  
  Expected: PASS
  
  Commit: `git add src/middleware.ts src/app/api/auth/ tests/auth.test.ts && git commit -m "feat: add auth route handlers and middleware"`

---

### Task 3: Zustand Cart Store & Sync API

**Files:**
* Create: `src/store/useCartStore.ts`
* Create: `src/app/api/cart/sync/route.ts`
* Create: `tests/cart.test.ts`

**Interfaces:**
* Consumes: `supabaseServerClient` from Task 1.

- [ ] **Step 1: Build Zustand Cart Store**
  
  Create `src/store/useCartStore.ts` with support for local state persistence and synchronization capabilities:
  ```typescript
  import { create } from 'zustand';
  import { persist } from 'zustand/middleware';

  export interface CartItem {
    variantId: string;
    productId: string;
    name: string;
    variantLabel: string;
    price: number;
    quantity: number;
    stockAvailable: number;
    imageUrl: string;
  }

  interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (variantId: string) => void;
    updateQuantity: (variantId: string, quantity: number) => void;
    clearCart: () => void;
    syncWithBackend: () => Promise<void>;
  }

  export const useCartStore = create<CartState>()(
    persist(
      (set, get) => ({
        items: [],
        addItem: (item) => set((state) => {
          const exists = state.items.find((i) => i.variantId === item.variantId);
          if (exists) {
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId
                  ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stockAvailable) }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
        removeItem: (variantId) => set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        })),
        updateQuantity: (variantId, quantity) => set((state) => ({
          items: state.items.map((i) =>
            i.variantId === variantId ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stockAvailable)) } : i
          ),
        })),
        clearCart: () => set({ items: [] }),
        syncWithBackend: async () => {
          const { items } = get();
          if (items.length === 0) return;
          try {
            await fetch('/api/cart/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ items }),
            });
          } catch (e) {
            console.error('Failed to sync cart', e);
          }
        },
      }),
      { name: 'pleatsssi-cart' }
    )
  );
  ```

- [ ] **Step 2: Implement Cart Synchronization Endpoint**
  
  Create `src/app/api/cart/sync/route.ts`:
  ```typescript
  import { NextResponse } from 'next/server';
  import { supabaseServerClient } from '@/lib/supabaseServer';

  export async function POST(request: Request) {
    const { items } = await request.json();
    const supabase = await supabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthenticated' }, { status: 401 });
    }

    // Logic to insert or merge cart items in database
    return NextResponse.json({ success: true });
  }
  ```

- [ ] **Step 3: Test store and synchronization**
  
  Create `tests/cart.test.ts` to test Zustand store mutations and verify operations.

- [ ] **Step 4: Run tests and commit**
  
  Run: `npm run test`
  
  Expected: PASS
  
  Commit: `git add src/store/useCartStore.ts src/app/api/cart/ tests/cart.test.ts && git commit -m "feat: add client-side cart store and server synchronizer"`

---

### Task 4: Checkout API & Midtrans Snap Integration

**Files:**
* Create: `src/app/api/checkout/route.ts`
* Create: `src/lib/midtrans.ts`
* Create: `tests/checkout.test.ts`

**Interfaces:**
* Consumes: `supabaseServerClient` from Task 1.

- [ ] **Step 1: Install Midtrans Client**
  
  Run: `npm install midtrans-client`
  
  Install types if available, otherwise declare module wrapper.

- [ ] **Step 2: Create Midtrans client helper**
  
  Create `src/lib/midtrans.ts`:
  ```typescript
  // @ts-ignore
  import midtransClient from 'midtrans-client';

  export const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
  });
  ```

- [ ] **Step 3: Implement Checkout Endpoint**
  
  Create `src/app/api/checkout/route.ts` to handle order verification, PostgreSQL tables update, and Snap token request:
  ```typescript
  import { NextResponse } from 'next/server';
  import { supabaseServerClient } from '@/lib/supabaseServer';
  import { snap } from '@/lib/midtrans';

  export async function POST(request: Request) {
    const { addressId, courier, couponCode, items } = await request.json();
    const supabase = await supabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthenticated' }, { status: 401 });
    }

    // 1. Calculate amount & validate variant stock levels
    let grossAmount = 0;
    for (const item of items) {
      grossAmount += item.price * item.quantity;
    }

    const orderNumber = `PLT-${Date.now()}`;

    // 2. Insert into orders table in DB
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        total: grossAmount,
        shipping_cost: 0, // Mocked for simplicity
        courier,
        status: 'pending',
      })
      .select()
      .single();

    if (orderErr) {
      return NextResponse.json({ success: false, message: orderErr.message }, { status: 400 });
    }

    // 3. Initiate Transaction in Midtrans Snap
    const parameter = {
      transaction_details: {
        order_id: orderNumber,
        gross_amount: grossAmount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        email: user.email,
      },
    };

    try {
      const transaction = await snap.createTransaction(parameter);
      
      // Store snap token in payments database
      await supabase.from('payments').insert({
        order_id: order.id,
        gross_amount: grossAmount,
        snap_token: transaction.token,
        status: 'pending',
      });

      return NextResponse.json({ success: true, token: transaction.token, redirectUrl: transaction.redirect_url });
    } catch (err: any) {
      return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
  }
  ```

- [ ] **Step 4: Write tests for checkout endpoint**
  
  Create `tests/checkout.test.ts`.

- [ ] **Step 5: Run tests and commit**
  
  Run: `npm run test`
  
  Expected: PASS
  
  Commit: `git add src/lib/midtrans.ts src/app/api/checkout/ tests/checkout.test.ts && git commit -m "feat: implement checkout flow and midtrans connection"`

---

### Task 5: Midtrans Webhook Payment Status Handler

**Files:**
* Create: `src/app/api/webhooks/midtrans/route.ts`
* Create: `tests/webhook.test.ts`

**Interfaces:**
* Consumes: `supabaseServerClient` from Task 1.

- [ ] **Step 1: Write Webhook logic**
  
  Create `src/app/api/webhooks/midtrans/route.ts` checking signature and updating DB:
  ```typescript
  import { NextResponse } from 'next/server';
  import { supabaseServerClient } from '@/lib/supabaseServer';
  import crypto from 'crypto';

  export async function POST(request: Request) {
    const payload = await request.json();
    const { order_id, status_code, gross_amount, signature_key, transaction_status } = payload;

    // Validate Signature Key
    const hash = crypto.createHash('sha512')
      .update(order_id + status_code + gross_amount + process.env.MIDTRANS_SERVER_KEY)
      .digest('hex');

    if (hash !== signature_key) {
      return NextResponse.json({ success: false, message: 'Invalid Signature' }, { status: 403 });
    }

    const supabase = await supabaseServerClient();

    // Map Transaction Status
    let orderStatus = 'pending';
    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      orderStatus = 'processing';
    } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
      orderStatus = 'cancelled';
    }

    // Update order in DB
    const { error } = await supabase
      .from('orders')
      .update({ status: orderStatus })
      .eq('order_number', order_id);

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  }
  ```

- [ ] **Step 2: Write tests for webhook handler verification**
  
  Create `tests/webhook.test.ts`.

- [ ] **Step 3: Run tests and commit**
  
  Run: `npm run test`
  
  Expected: PASS
  
  Commit: `git add src/app/api/webhooks/midtrans/ tests/webhook.test.ts && git commit -m "feat: add midtrans webhook handler to update order statuses"`
