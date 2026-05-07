/**
 * Next.js proxy (formerly middleware) — Auth Gate.
 * Validates the Supabase session and redirects to /login if missing.
 * See srs.md §10, coding_standards.md §3.4
 *
 * DEV NOTE: In local env (SOCIOS_ENV=local), auth is bypassed on lobby/duel
 * routes so the UI can be tested without logging in.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Protected route patterns — anything under /(app) that requires auth
 * in production. In local mode these are accessible without a session.
 */
const PROTECTED_PATHS = ['/duel/', '/history'];

// Lobby is publicly viewable (stake selection requires auth — enforced in server action)
const SEMI_PROTECTED_PATHS = ['/lobby/'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Password Gate (from former middleware.ts)
  // Allow access to the gate page and static assets
  if (
    pathname === '/gate' ||
    pathname.startsWith('/_next') ||
    pathname.includes('favicon.ico') ||
    pathname.includes('.png') ||
    pathname.includes('.jpg')
  ) {
    return NextResponse.next();
  }

  // Check for the access cookie
  const accessCookie = request.cookies.get('clash_access');
  if (accessCookie?.value !== 'granted') {
    const url = request.nextUrl.clone();
    url.pathname = '/gate';
    return NextResponse.redirect(url);
  }

  // 2. Supabase Auth Refresh (original proxy.ts logic)
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env['NEXT_PUBLIC_SUPABASE_URL']!,
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const isLocal = process.env['SOCIOS_ENV'] === 'local' || accessCookie?.value === 'granted';

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  const isSemiProtected = SEMI_PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  // Refresh auth token
  const { data: { user } } = await supabase.auth.getUser();

  // Block fully protected routes without auth (unless local dev)
  if (isProtected && !user && !isLocal) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Semi-protected: lobby is viewable, but the stake action will require auth
  void isSemiProtected;

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
