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
  const pathname = request.nextUrl.pathname;

  // Protect checkout and profile routes
  if (!user && (pathname.startsWith('/id/profile') || pathname.startsWith('/id/checkout'))) {
    return NextResponse.redirect(new URL('/id/login', request.url));
  }

  // Admin route protection: /id/admin/*
  if (pathname.startsWith('/id/admin')) {
    const isLoginPage = pathname === '/id/admin/login';

    if (!user) {
      if (!isLoginPage) {
        return NextResponse.redirect(new URL('/id/admin/login', request.url));
      }
      return response;
    }

    // Determine user role (check user_metadata first, then query users profile)
    let role = user.user_metadata?.role;

    if (!role || (role !== 'admin' && role !== 'owner')) {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role) {
        role = profile.role;
      }
    }

    const isAdminOrOwner = role === 'admin' || role === 'owner';

    if (isLoginPage) {
      if (isAdminOrOwner) {
        return NextResponse.redirect(new URL('/id/admin/dashboard', request.url));
      }
      return response;
    }

    if (!isAdminOrOwner) {
      return NextResponse.redirect(new URL('/id/admin/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/id/profile/:path*', '/id/checkout/:path*', '/id/admin', '/id/admin/:path*'],
};
