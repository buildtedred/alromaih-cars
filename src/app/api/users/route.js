import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Create Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET(request) {
  try {
    // Get URL parameters for pagination
    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const perPage = Number.parseInt(url.searchParams.get("perPage") || "10")

    // Get users from Supabase Auth using service role key
    const { data, error } = await supabase.auth.admin.listUsers({
      page: page,
      perPage: perPage,
    })

    if (error) {
      throw error
    }

    // Format users for the client
    const formattedUsers = data.users.map((user) => ({
      id: user.id,
      email: user.email,
      phone: user.phone || "",
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      confirmed_at: user.email_confirmed_at,
      is_confirmed: !!user.email_confirmed_at,
      full_name: user.user_metadata?.full_name || "",
      avatar_url: user.user_metadata?.avatar_url || "",
      role: user.app_metadata?.role || "user",
      status: user.banned ? "banned" : user.email_confirmed_at ? "active" : "pending",
    }))

    return NextResponse.json({
      users: formattedUsers,
      count: data.count || formattedUsers.length,
    })
  } catch (error) {
    console.error("Error in users API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    // Get request body
    const { email, password, email_confirm, phone, user_metadata, app_metadata } = await request.json()

    // Create new user using service role key
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm,
      phone,
      user_metadata,
      app_metadata: app_metadata || { role: "user" },
    })

    if (error) {
      throw error
    }

    return NextResponse.json({ user: data.user })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
