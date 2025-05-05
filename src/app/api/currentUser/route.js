// app/api/currentUser/route.js
import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabaseServerClient';

export async function GET() {
  const cookieStore = cookies();

  const supabase = createSupabaseServerClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return Response.json({ error: error?.message || 'Not authenticated' }, { status: 401 });
  }

  return Response.json({ user }, { status: 200 });
}
