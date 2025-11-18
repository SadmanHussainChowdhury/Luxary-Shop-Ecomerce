import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { locales, defaultLocale } from './i18n/config';

// Create the i18n middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export default async function middleware(request: NextRequest) {
  // Handle locale routing first
  const response = intlMiddleware(request);
  
  // Only check auth for dashboard routes (admin routes are now public)
  const pathname = request.nextUrl.pathname;
  const isDashboardRoute = pathname.includes('/dashboard');
  
  if (isDashboardRoute) {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token) {
      // Extract locale from pathname
      const locale = locales.find(loc => pathname.startsWith(`/${loc}/`)) || defaultLocale;
      const loginUrl = new URL(`/${locale}/auth/login`, request.url);
      return Response.redirect(loginUrl);
    }
  }
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
