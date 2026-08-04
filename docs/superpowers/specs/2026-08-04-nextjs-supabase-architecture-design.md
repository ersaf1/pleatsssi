# Technical Design: Next.js + Supabase E-Commerce Architecture for Pleatsssi

**Date:** 2026-08-04  
**Author:** AI Coding Assistant  
**Status:** Approved  

---

## 1. Executive Summary & Architecture

The Pleatsssi website is being developed as a modern, high-performance, single-instance **Next.js 16 monolith** instead of the decoupled Vite frontend + Laravel API backend described in the initial documentation. 

This design unifies all elements inside a Next.js App Router workspace:
* **Frontend Components & Pages**: React 19 Client/Server Components using Tailwind CSS v4.
* **Backend APIs**: Next.js Route Handlers (`src/app/api/`) connecting directly to the Supabase client.
* **Database**: PostgreSQL hosted on Supabase.
* **Authentication**: Supabase Auth (Email + Password, Google OAuth) using cookie-based SSR sessions.
* **Storage**: Supabase Storage Buckets for product images and digital assets.
* **Payment Gateway**: Midtrans Snap integration via Server-to-Server API and Client-side Pop-up.

```
+-----------------------------------------------------------+
|                      Next.js 16 App                       |
|  +-------------------------+   +-----------------------+  |
|  |   Frontend Pages/UI     |   |    API Route Handlers |  |
|  |   (React 19 Components) |   |    (zod, supabase-js) |  |
|  +------------+------------+   +-----------+-----------+  |
+---------------|----------------------------|--------------+
                | (Auth Session Cookie)      | (Read/Write SQL & Storage)
                v                            v
      +--------------------------------------------------+
      |                   Supabase Services              |
      |   [ Auth ]        [ PostgreSQL ]     [ Storage ] |
      +--------------------------------------------------+
```

---

## 2. Database Schema (Supabase/PostgreSQL)

All primary keys will use UUIDs. Row Level Security (RLS) policies will enforce read/write permissions.

### 2.1 Schema Definition

#### `users` (Custom metadata linked to Supabase auth.users)
* **id**: `UUID` (PK, references auth.users.id)
* **name**: `VARCHAR(150)` (NOT NULL)
* **email**: `VARCHAR(150)` (NOT NULL, UNIQUE)
* **phone**: `VARCHAR(20)` (NULLABLE)
* **role**: `VARCHAR(20)` (NOT NULL, DEFAULT 'customer') - Values: `'customer'`, `'admin'`, `'owner'`
* **avatar_url**: `TEXT` (NULLABLE)
* **created_at**: `TIMESTAMP` (NOT NULL, DEFAULT now())
* **updated_at**: `TIMESTAMP` (NOT NULL, DEFAULT now())

#### `categories`
* **id**: `UUID` (PK, DEFAULT gen_random_uuid())
* **parent_id**: `UUID` (FK, references categories.id, ON DELETE SET NULL)
* **name**: `VARCHAR(100)` (NOT NULL)
* **slug**: `VARCHAR(100)` (NOT NULL, UNIQUE)
* **description**: `TEXT` (NULLABLE)
* **created_at**: `TIMESTAMP` (NOT NULL, DEFAULT now())

#### `products`
* **id**: `UUID` (PK, DEFAULT gen_random_uuid())
* **category_id**: `UUID` (FK, references categories.id, ON DELETE RESTRICT)
* **size_chart_id**: `UUID` (FK, references size_charts.id, ON DELETE SET NULL)
* **name**: `VARCHAR(150)` (NOT NULL)
* **slug**: `VARCHAR(150)` (NOT NULL, UNIQUE)
* **description**: `TEXT` (NULLABLE)
* **material**: `TEXT` (NULLABLE)
* **price**: `DECIMAL(12,2)` (NOT NULL)
* **discount**: `INTEGER` (NOT NULL, DEFAULT 0)
* **status**: `VARCHAR(20)` (NOT NULL, DEFAULT 'draft') - Values: `'draft'`, `'published'`, `'archived'`
* **created_at**: `TIMESTAMP` (NOT NULL, DEFAULT now())

#### `product_variants`
* **id**: `UUID` (PK, DEFAULT gen_random_uuid())
* **product_id**: `UUID` (FK, references products.id, ON DELETE CASCADE)
* **color**: `VARCHAR(50)` (NOT NULL)
* **color_hex**: `VARCHAR(7)` (NOT NULL)
* **size**: `VARCHAR(10)` (NOT NULL)
* **sku**: `VARCHAR(100)` (NOT NULL, UNIQUE)
* **stock**: `INTEGER` (NOT NULL, DEFAULT 0)
* **created_at**: `TIMESTAMP` (NOT NULL, DEFAULT now())

#### `product_images`
* **id**: `UUID` (PK, DEFAULT gen_random_uuid())
* **product_id**: `UUID` (FK, references products.id, ON DELETE CASCADE)
* **variant_id**: `UUID` (FK, references product_variants.id, ON DELETE CASCADE, NULLABLE)
* **image_url**: `TEXT` (NOT NULL)
* **sort_order**: `INTEGER` (NOT NULL, DEFAULT 0)

#### `orders`
* **id**: `UUID` (PK, DEFAULT gen_random_uuid())
* **order_number**: `VARCHAR(50)` (NOT NULL, UNIQUE)
* **user_id**: `UUID` (FK, references users.id, ON DELETE RESTRICT)
* **coupon_id**: `UUID` (FK, references coupons.id, ON DELETE SET NULL, NULLABLE)
* **status**: `VARCHAR(20)` (NOT NULL, DEFAULT 'pending') - Values: `'pending'`, `'processing'`, `'shipped'`, `'completed'`, `'cancelled'`, `'expired'`
* **total**: `DECIMAL(12,2)` (NOT NULL)
* **discount_amount**: `DECIMAL(12,2)` (NOT NULL, DEFAULT 0)
* **shipping_cost**: `DECIMAL(12,2)` (NOT NULL)
* **courier**: `VARCHAR(50)` (NOT NULL)
* **tracking_number**: `VARCHAR(100)` (NULLABLE)
* **notes**: `TEXT` (NULLABLE)
* **created_at**: `TIMESTAMP` (NOT NULL, DEFAULT now())

#### `order_items`
* **id**: `UUID` (PK, DEFAULT gen_random_uuid())
* **order_id**: `UUID` (FK, references orders.id, ON DELETE CASCADE)
* **product_variant_id**: `UUID` (FK, references product_variants.id, ON DELETE RESTRICT)
* **product_name**: `VARCHAR(150)` (NOT NULL)
* **variant_label**: `VARCHAR(100)` (NOT NULL)
* **price**: `DECIMAL(12,2)` (NOT NULL)
* **quantity**: `INTEGER` (NOT NULL)

#### `payments`
* **id**: `UUID` (PK, DEFAULT gen_random_uuid())
* **order_id**: `UUID` (FK, references orders.id, ON DELETE CASCADE)
* **transaction_id**: `VARCHAR(100)` (NULLABLE, UNIQUE)
* **payment_type**: `VARCHAR(50)` (NULLABLE)
* **gross_amount**: `DECIMAL(12,2)` (NOT NULL)
* **snap_token**: `VARCHAR(255)` (NULLABLE)
* **status**: `VARCHAR(20)` (NOT NULL, DEFAULT 'pending')
* **created_at**: `TIMESTAMP` (NOT NULL, DEFAULT now())
* **updated_at**: `TIMESTAMP` (NOT NULL, DEFAULT now())

#### `coupons`
* **id**: `UUID` (PK, DEFAULT gen_random_uuid())
* **code**: `VARCHAR(50)` (NOT NULL, UNIQUE)
* **type**: `VARCHAR(20)` (NOT NULL) - Values: `'percentage'`, `'fixed'`
* **value**: `DECIMAL(12,2)` (NOT NULL)
* **min_purchase**: `DECIMAL(12,2)` (NOT NULL, DEFAULT 0)
* **max_discount**: `DECIMAL(12,2)` (NULLABLE)
* **quota**: `INTEGER` (NOT NULL)
* **starts_at**: `TIMESTAMP` (NOT NULL)
* **expires_at**: `TIMESTAMP` (NOT NULL)
* **created_at**: `TIMESTAMP` (NOT NULL, DEFAULT now())

### 2.2 Row Level Security (RLS) Rules
* **Tabel Publik** (`products`, `categories`, `product_variants`, `product_images`, `size_charts`):
  * `SELECT`: Diizinkan untuk semua user (`public` / `anon`).
  * `ALL`: Diizinkan hanya jika metadata user auth memiliki `role = 'admin'` atau `role = 'owner'`.
* **Tabel Privat Pengguna** (`orders`, `order_items`, `payments`, `addresses`, `wishlist`, `reviews`):
  * `SELECT`, `INSERT`, `UPDATE`: Diizinkan hanya jika `auth.uid() = user_id`.
  * `DELETE`: Dinonaktifkan (data transaksi historis hanya bisa dimodifikasi statusnya).

---

## 3. Core API Routes & Endpoints

Next.js API Route Handlers will be created under `src/app/api/`:

### 3.1 Auth & Session Synchronization (`/api/auth/`)
Supabase client sessions will be persisted via cookies. A Server Action or Next.js middleware will handle route guarding.
* `POST /api/auth/login`: Verifies credentials and sets cookies.
* `POST /api/auth/register`: Inserts user auth details and initializes custom profile entry.
* `POST /api/auth/logout`: Revokes session cookies.

### 3.2 Cart Sync (`/api/cart/`)
* `GET /api/cart`: Fetches items from `cart_items` in PostgreSQL for logged-in user.
* `POST /api/cart/sync`: Accepts the guest localStorage cart list and merges it with database entries upon authentication.

### 3.3 Checkout (`/api/checkout/`)
* `POST /api/checkout`:
  1. Validates dynamic stock levels in a PostgreSQL transaction.
  2. Creates records inside `orders` and `order_items`.
  3. Contacts Midtrans snap client API.
  4. Stores the generated `snap_token` in `payments` table and returns it to the client.

### 3.4 Webhook Callback (`/api/webhooks/midtrans/`)
* `POST /api/webhooks/midtrans`:
  1. Computes signature key using SHA-512 comparison: `SHA512(order_id + status_code + gross_amount + ServerKey)`.
  2. Updates order status (`processing` if settlement, `cancelled`/`expired` if failure).
  3. Increments variant stock if order fails/cancels.

---

## 4. Client-side State Management (Zustand)

### 4.1 Cart Store (`src/store/useCartStore.ts`)
```typescript
interface CartItem {
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
```

---

## 5. Security & Validation Rules

1. **API Validation**: Every Route Handler must parse incoming parameters using `zod`.
2. **Token Leak Protection**: Server Keys (like Midtrans `SERVER_KEY` and Supabase `SERVICE_ROLE_KEY`) must never be used in code that runs client-side. They must remain pure server-side environment variables.
3. **Database Integrity**: PostgreSQL triggers will handle automatic updates for `updated_at` timestamps and decrementing/incrementing inventory levels when orders status logs are modified.
