import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Whether the site is in coming soon mode
const COMING_SOON_ENABLED = true; // Set this to false on launch day

// Routes that should always be accessible even in coming soon mode
const ALLOWED_PATHS = [
  '/coming-soon',
  '/_next',
  '/api',
  '/fonts',
  '/images',
  '/logo.png',
  '/favicon.ico',
  '/.well-known',
];

// Check if the current path should be allowed or redirected
function isAllowedPath(path: string): boolean {
  return ALLOWED_PATHS.some(allowedPath => 
    path === allowedPath || path.startsWith(allowedPath + '/')
  );
}

export function middleware(request: NextRequest) {
  // Early return if coming soon is disabled
  if (!COMING_SOON_ENABLED) {
    return NextResponse.next();
  }

  const path = request.nextUrl.pathname;

  // Allow certain paths even in coming soon mode
  if (isAllowedPath(path)) {
    return NextResponse.next();
  }

  // Redirect all other paths to coming-soon
  const url = request.nextUrl.clone();
  url.pathname = '/coming-soon';
  return NextResponse.redirect(url);
}

// Configure paths that should trigger this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public image files)
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|api).*)',
  ],
};