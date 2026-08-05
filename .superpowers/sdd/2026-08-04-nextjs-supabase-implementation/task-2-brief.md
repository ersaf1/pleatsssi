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

