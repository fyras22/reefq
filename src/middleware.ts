import { type NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseMiddlewareClient } from '@/lib/supabase/middleware'
import { createRateLimiter } from './components/middleware/RateLimiter';

/**
 * Security Headers Configuration
 * These headers follow best practices for web security
 */
const securityHeaders = {
  // Prevent the browser from attempting to guess the type of content
  'X-Content-Type-Options': 'nosniff',
  
  // Helps prevent cross-site scripting attacks
  'X-XSS-Protection': '1; mode=block',
  
  // Prevent clickjacking by controlling iframe embedding
  'X-Frame-Options': 'SAMEORIGIN',
  
  // Control how much information is sent to other sites
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Set permissions for browser features
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
  
  // Control where resources can be loaded from 
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel-analytics.com https://*.supabase.co;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://*.vercel-analytics.com https://*.supabase.co;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self';
    connect-src 'self' wss://*.supabase.co https://*.vercel-analytics.com https://api.upstash.com https://*.supabase.co;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim(),
  
  // Forces HTTPS
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
};

/**
 * Configure API rate limiting
 */
const apiRateLimiter = createRateLimiter({
  // Allow 100 requests per 15 minutes
  limit: 100,
  windowMs: 15 * 60 * 1000,
  
  // Custom message
  message: JSON.stringify({
    error: {
      message: 'Too many requests from this IP, please try again after 15 minutes',
      code: 'TOO_MANY_REQUESTS',
    }
  }),
  
  // Enable standard header format
  standardHeaders: true,
  legacyHeaders: false,
  
  // Skip rate limiting for certain scenarios
  skip: (ip, request) => {
    // Skip rate limiting for local development
    if (process.env.NODE_ENV === 'development' && ip === '::1') {
      return true;
    }
    // Skip for health checks
    if (request.url.includes('/api/health')) {
      return true;
    }
    return false;
  }
});

/**
 * Configure more aggressive rate limiting for authentication endpoints 
 */
const authRateLimiter = createRateLimiter({
  // Much stricter limits for auth endpoints
  limit: 10, 
  windowMs: 10 * 60 * 1000, // 10 minutes
  
  message: JSON.stringify({
    error: {
      message: 'Too many authentication attempts, please try again after 10 minutes',
      code: 'TOO_MANY_AUTH_ATTEMPTS',
    }
  }),
});

/**
 * Check if a route should be public or protected
 */
function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [
    // Auth routes might change with Supabase UI, adjust as needed
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-email', // Supabase might handle this differently (e.g., /auth/confirm route)
    '/auth/callback', // Default Supabase redirect
    '/auth/confirm', // Default Supabase email confirm
    '/api/auth', // Supabase auth callback routes often live under /api/auth
    '/',
    '/about',
    '/contact',
    '/api/health',
    '/api/public',
    '/_next',
    '/images',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/demo',
    '/demo/jewelry',
    '/assets',
  ];
  
  // Match specific files and common static/API patterns
  if (pathname.match(/\.(jpg|jpeg|png|webp|svg|css|js|glb|usdz|ico|txt|xml)$/)) {
    return true;
  }
  if (pathname.startsWith('/_next/') || pathname.startsWith('/api/auth/callback')) {
      return true;
  }

  // Check if the pathname starts with any defined public route prefixes
  return publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));
}

/**
 * Check if the user is authenticated by looking for auth cookies
 */
function isAuthenticated(request: NextRequest): boolean {
  const sessionToken = 
    request.cookies.get('next-auth.session-token') || 
    request.cookies.get('__Secure-next-auth.session-token');
  
  return !!sessionToken;
}

/**
 * Handle redirect for authenticated users trying to access auth pages
 */
function handleAuthPageRedirect(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  
  // Check if this is an auth page
  const isAuthPage = 
    pathname.startsWith('/auth/login') || 
    pathname.startsWith('/auth/register') || 
    pathname.startsWith('/auth/forgot-password');
  
  // If authenticated user is trying to access auth page, redirect to dashboard
  if (isAuthPage && isAuthenticated(request)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return null;
}

/**
 * Main middleware function
 */
export async function middleware(request: NextRequest) {
  // 1. Initialize Supabase client and response object
  // This handles session refreshing
  const { supabase, response } = createSupabaseMiddlewareClient(request);

  // 2. Get user session info
  const { data: { user } } = await supabase.auth.getUser();
  const authenticated = !!user;

  // 3. Apply security headers to the response
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  const { pathname } = request.nextUrl;

  // 4. Handle redirects for authenticated users trying to access auth pages
  const isAuthPage = pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register') || pathname.startsWith('/auth/forgot-password');
  if (isAuthPage && authenticated) {
    // Redirect authenticated users away from login/register to the dashboard or home
    return NextResponse.redirect(new URL('/dashboard', request.url)); // Adjust target URL if needed
  }

  // 5. Apply rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    // Apply stricter limits to potential auth-related API calls
    if (pathname.startsWith('/api/auth/') || pathname.includes('login') || pathname.includes('register') || pathname.includes('password')) {
       const limitedResponse = await authRateLimiter(request);
       if (limitedResponse) return limitedResponse;
    } else {
       // Apply standard limits to other API routes
       const limitedResponse = await apiRateLimiter(request);
       if (limitedResponse) return limitedResponse;
    }
  }

  // 6. Authentication check for protected routes
  if (!isPublicRoute(pathname)) {
    if (!authenticated) {
      // Redirect unauthenticated users trying to access protected routes to login
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('redirectedFrom', pathname); // Pass original path
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 7. Set Cache-Control headers (restored from previous logic)
   if (pathname.match(/\.(jpg|jpeg|png|webp|svg|css|js|glb|usdz)$/)) {
     response.headers.set('Cache-Control', 'public, max-age=86400, immutable');
   } else if (pathname.startsWith('/api/')) {
     response.headers.set('Cache-Control', 'no-store, max-age=0');
   } else {
     // For general pages, let Next.js/Vercel handle caching or set a moderate default
     // response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate'); // Example: No cache for dynamic pages
   }

  // 8. Server Timing (optional)
  response.headers.set('Server-Timing', `middleware;dur=0`); // Basic timing

  // 9. Return the response (potentially modified by Supabase client for cookie handling)
  return response;
}

/**
 * Configure which routes use this middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     * It's important exclusions match files/paths that should NEVER trigger the middleware.
     */
    '/((?!_next/static|_next/image|favicon.ico|images/|assets/).*)', // Exclude static asset folders explicitly
  ],
} 