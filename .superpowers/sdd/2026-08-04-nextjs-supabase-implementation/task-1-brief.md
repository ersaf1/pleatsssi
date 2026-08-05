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

