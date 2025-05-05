import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request) {
  const cookieStore = cookies()

  // Create a Supabase client using the new SSR package
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (name) => cookieStore.get(name)?.value,
      set: (name, value, options) => cookieStore.set(name, value, options),
      remove: (name, options) => cookieStore.set(name, "", { ...options, maxAge: 0 }),
    },
  })

  try {
    // Check if the current user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create profiles table if it doesn't exist
    const { error: createTableError } = await supabase.rpc('create_profiles_if_not_exists')

    if (createTableError && !createTableError.message.includes('does not exist')) {
      throw createTableError
    }

    // If the RPC function doesn't exist, create the table directly
    if (createTableError && createTableError.message.includes('does not exist')) {
      const { error } = await supabase.from('profiles').select('id').limit(1)
      
      if (error && error.code === '42P01') { // Table doesn't exist
        // Create the profiles table
        await supabase.query(`
          CREATE TABLE IF NOT EXISTS profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            full_name TEXT,
            avatar_url TEXT,
            role TEXT DEFAULT 'user',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
          );
        `)
      }
    }

    // Set the current user as admin
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({ 
        id: user.id,
        full_name: user.user_metadata?.full_name || 'Admin User',
        role: 'admin'
      })

    if (upsertError) {
      throw upsertError
    }

    // Also update the user's app_metadata in auth
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { app_metadata: { role: 'admin' } }
    )

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ 
      success: true,
      message: "Profiles table created and current user set as admin"
    })
  } catch (error) {
    console.error("Error setting up profiles:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
