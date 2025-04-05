import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';
import { locales } from './i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { rateLimit } from '@/lib/rate-limit';
import { generateCSRFToken, validateCSRFToken } from '@/lib/security';

// List of paths that should bypass CSRF validation
const CSRF_EXEMPT_PATHS = [
  '/api/auth/callback',
  '/api/webhooks',
  '/api/healthcheck',
];

// List of public paths that don't require authentication
const PUBLIC_PATHS = [
  '/api/healthcheck',
  '/api/metrics',
  '/_next',
  '/fonts',
  '/images',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/manifest.json',
];

// Define rate limiting configurations for different paths
const API_RATE_LIMIT = {
  limit: 100, // 100 requests
  interval: 60 * 1000, // per minute
  uniqueTokenPerInterval: 500,
};

const AUTH_RATE_LIMIT = {
  limit: 5, // 5 requests
  interval: 60 * 1000, // per minute
  uniqueTokenPerInterval: 500,
};

// Rate limiters for different paths
const apiLimiter = rateLimit({
  ...API_RATE_LIMIT,
});

const authLimiter = rateLimit({
  ...AUTH_RATE_LIMIT,
});

/**
 * Add security headers to the response
 */
function addSecurityHeaders(headers: Headers): Headers {
  // HSTS header
  headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );
  
  // XSS Protection
  headers.set('X-XSS-Protection', '1; mode=block');
  
  // Click-jacking protection
  headers.set('X-Frame-Options', 'DENY');
  
  // Disable MIME type sniffing
  headers.set('X-Content-Type-Options', 'nosniff');
  
  // Referrer Policy
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  headers.set(
    'Content-Security-Policy',
    `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-insights.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; img-src 'self' data: blob: *.amazonaws.com; font-src 'self' fonts.gstatic.com; connect-src 'self' *.vercel-insights.com vitals.vercel-analytics.com; frame-src 'self'; object-src 'none'; base-uri 'self';`
  );
  
  // Permissions Policy
  headers.set(
    'Permissions-Policy',
    'camera=self, microphone=self, geolocation=self, interest-cohort=()'
  );
  
  return headers;
}

/**
 * Determine if a route requires CSRF protection
 */
function requiresCSRF(request: NextRequest): boolean {
  const url = new URL(request.url);
  
  // Skip CSRF for exempted paths
  for (const exemptPath of CSRF_EXEMPT_PATHS) {
    if (url.pathname.startsWith(exemptPath)) {
      return false;
    }
  }
  
  // Only check CSRF for mutations (non-GET, HEAD, OPTIONS)
  const method = request.method.toUpperCase();
  return !['GET', 'HEAD', 'OPTIONS'].includes(method) && url.pathname.startsWith('/api/');
}

/**
 * Check if a path is public and doesn't require authentication
 */
function isPublicPath(path: string): boolean {
  return PUBLIC_PATHS.some(publicPath => path.startsWith(publicPath));
}

/**
 * Get the preferred locale from the request
 */
function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const localesArray = [...locales];

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const defaultLocale = 'en';

  return matchLocale(languages, localesArray, defaultLocale);
}

/**
 * Apply rate limiting to the request based on path
 */
async function applyRateLimit(request: NextRequest): Promise<NextResponse | null> {
  const ip = request.ip || 'anonymous';
  const url = new URL(request.url);
  
  // Apply auth rate limiting
  if (url.pathname.startsWith('/api/auth')) {
    const { success, limit, remaining } = await authLimiter.check(ip);
    
    if (!success) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests', retryAfter: 60 }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'Retry-After': '60',
          },
        }
      );
    }
  }
  
  // Apply API rate limiting
  if (url.pathname.startsWith('/api/')) {
    const { success, limit, remaining } = await apiLimiter.check(ip);
    
    if (!success) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests', retryAfter: 60 }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'Retry-After': '60',
          },
        }
      );
    }
  }
  
  return null;
}

/**
 * Main middleware handler
 */
export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Skip for public assets
  if (
    pathname.includes('.') || 
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static')
  ) {
    return NextResponse.next();
  }
  
  // Check rate limiting first
  const rateLimitResponse = await applyRateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  
  // Add default security headers for all responses
  const response = NextResponse.next();
  addSecurityHeaders(response.headers);
  
  // Check authentication if not a public path
  if (!isPublicPath(pathname)) {
    const session = await auth();
    if (!session?.user) {
      // Redirect to login for non-API paths
      if (!pathname.startsWith('/api/')) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
      
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }
  
  // Check CSRF protection
  if (requiresCSRF(request)) {
    const csrfToken = request.headers.get('x-csrf-token');
    
    if (!csrfToken || !validateCSRFToken(csrfToken)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid CSRF token' }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }
  
  // Handle locale redirects for internationalization
  if (
    !pathname.startsWith('/api/') && 
    !pathname.startsWith('/_next') &&
    !pathname.startsWith('/static') &&
    !pathname.includes('.')
  ) {
    const pathnameIsMissingLocale = locales.every(locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`);
    
    if (pathnameIsMissingLocale) {
      const locale = getLocale(request);
      
      // Redirect to the same pathname but with locale prefix
      return NextResponse.redirect(new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url));
    }
  }
  
  return response;
}

/**
 * Configure which routes use this middleware
 */
export const config = {
  matcher: [
    // Apply middleware to all routes except static files
    '/((?!_next/static|_next/image|static|images|favicon.ico).*)',
  ],
}; 