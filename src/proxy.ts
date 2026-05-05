/**
 * Next.js proxy (formerly middleware) — auth stub.
 * Redirects unauthenticated users to /login for protected routes.
 * Full implementation in Phase 1 (Supabase Auth).
 *
 * DEVIATION DEV-005: Next.js 16 renamed middleware.ts to proxy.ts with
 * a `proxy` export instead of `middleware`. See docs/DEVIATIONS.md.
 *
 * See srs.md §10, coding_standards.md §3.4
 */

import { type NextRequest, NextResponse } from 'next/server';

/**
 * Protected route patterns — anything under /(app)
 */
const PROTECTED_PATHS = ['/lobby/', '/duel/', '/history'];

/**
 * Auth proxy stub.
 * In Phase 0: always allows — no Supabase client yet.
 * In Phase 1: will validate the Supabase JWT cookie via @supabase/ssr.
 */
export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  // Phase 0 stub — will be replaced in Phase 1
  // When Supabase is wired: check cookie, redirect if null
  if (isProtected) {
    // TODO(Phase 1): validate Supabase session cookie
    // const session = await getServerSession(request);
    // if (!session) {
    //   return NextResponse.redirect(new URL('/login', request.url));
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - API routes
     * - Static files
     * - _next internals
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
