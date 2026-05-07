import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Simple password protection gate for the MVP demo.
 * To bypass, a 'clash_access' cookie must be set to 'granted'.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
    // Redirect to the gate page
    const url = request.nextUrl.clone();
    url.pathname = '/gate';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Apply to all routes except API (for now)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
