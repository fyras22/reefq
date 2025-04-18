import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { languages, defaultLanguage } from './app/i18n-settings';

export async function middleware(request: NextRequest) {
  // Check if request is for a page (not an asset)
  if (
    !request.nextUrl.pathname.startsWith('/_next') &&
    !request.nextUrl.pathname.startsWith('/api') &&
    !request.nextUrl.pathname.includes('.')
  ) {
    // Get the preferred language from cookies
    const langCookie = request.cookies.get('NEXT_LOCALE')?.value;
    
    // Detect language from Accept-Language header if no cookie exists
    let language = langCookie;
    if (!language || !languages.includes(language)) {
      const acceptLanguage = request.headers.get('Accept-Language') || '';
      const acceptLangs = acceptLanguage.split(',').map(lang => lang.split(';')[0].trim().split('-')[0]);
      language = acceptLangs.find(lang => languages.includes(lang)) || defaultLanguage;
    }
    
    // Clone the response
    const response = NextResponse.next();
    
    // Set the language cookie to ensure consistent language between server and client
    // This is crucial to avoid hydration errors
    response.cookies.set('NEXT_LOCALE', language, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'strict'
    });
    
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 