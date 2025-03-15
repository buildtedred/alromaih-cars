import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import { updateSession } from './utils/supabase/middleware';

// Initialize next-intl middleware
const intlMiddleware = createMiddleware(routing);

export async function middleware(request) {
  const { pathname, origin } = request.nextUrl;

  // ✅ Agar user `/` par aaye toh `/en` par redirect karein
  if (pathname === '/') {
    return NextResponse.redirect(`${origin}/en`);
  }

  // ✅ Agar `/dashboard` hai toh Supabase auth check karein
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/ar/dashboard') || pathname.startsWith('/en/dashboard')) {
    const supabaseResponse = await updateSession(request);
    if (supabaseResponse) return supabaseResponse;
  }

  // ✅ Baaki sab ke liye intl middleware run karein
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/', // ✅ Root `/` redirect hoga `/en` par
    '/dashboard/:path*', // ✅ Dashboard protected hoga
    '/(ar|en)/dashboard/:path*', // ✅ Translated dashboard protected hoga
  ],
};
