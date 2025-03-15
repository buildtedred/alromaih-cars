import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get("image")

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`

    console.log("Uploading to Supabase bucket: Alromaih")
    console.log("File name:", fileName)
    console.log("File type:", file.type)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from("Alromaih").upload(fileName, buffer, {
      contentType: file.type,
      upsert: true, // Changed to true to overwrite existing files
    })

    if (error) {
      console.error("Supabase storage error:", error)
      return NextResponse.json({ error: "Failed to upload file to storage: " + error.message }, { status: 500 })
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("Alromaih").getPublicUrl(data.path)

    console.log("Upload successful. Public URL:", publicUrl)

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to process upload: " + error.message }, { status: 500 })
  }
}

