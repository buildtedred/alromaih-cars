import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function updateSession(request) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
      },
    }
  );

  // ✅ IMPORTANT: `auth.getUser()` MUST be called to maintain session
  const { data: { user } } = await supabase.auth.getUser();

  // ✅ Agar user **logged in nahi hai** aur `/login` page nahi hai, toh redirect karein
  if (!user && !request.nextUrl.pathname.startsWith('/login')) {
    const url = new URL('/login', request.nextUrl.origin);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
