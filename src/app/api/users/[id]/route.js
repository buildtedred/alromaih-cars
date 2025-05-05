import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create Supabase client with service role key for admin operations
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export async function GET(request, { params }) {
  try {
    const { id } = params

    // Get user from Supabase Auth
    const { data, error } = await supabase.auth.admin.getUserById(id)

    if (error) {
      throw error
    }

    if (!data.user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Format user for the client
    const formattedUser = {
      id: data.user.id,
      email: data.user.email,
      phone: data.user.phone || "",
      created_at: data.user.created_at,
      last_sign_in_at: data.user.last_sign_in_at,
      confirmed_at: data.user.email_confirmed_at,
      is_confirmed: !!data.user.email_confirmed_at,
      full_name: data.user.user_metadata?.full_name || "",
      avatar_url: data.user.user_metadata?.avatar_url || "",
      role: data.user.app_metadata?.role || "user",
      status: data.user.banned ? "banned" : data.user.email_confirmed_at ? "active" : "pending",
    }

    return NextResponse.json({ user: formattedUser })
  } catch (error) {
    console.error("Error in user API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const { email, phone, user_metadata, app_metadata } = await request.json()

    // Update user using service role key
    const { data, error } = await supabase.auth.admin.updateUserById(id, {
      email,
      phone,
      user_metadata,
      app_metadata,
    })

    if (error) {
      throw error
    }

    return NextResponse.json({ user: data.user })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params

    // Delete user using service role key
    const { error } = await supabase.auth.admin.deleteUser(id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
