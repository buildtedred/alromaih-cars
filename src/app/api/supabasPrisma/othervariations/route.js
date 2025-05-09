import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// Helper function to separate language data
function separateLanguageData(variations) {
  if (!variations) return { en: [], ar: [] }

  if (!Array.isArray(variations)) {
    variations = [variations]
  }

  // Process English variations
  const enVariations = variations.map((variation) => ({
    id: variation.id,
    carId: variation.carId,
    name: variation.name,
    colorName: variation.colorName,
    colorHex: variation.colorHex,
    images: variation.images,
    price: variation.price,
  }))

  // Process Arabic variations
  const arVariations = variations.map((variation) => ({
    id: variation.id,
    carId: variation.carId,
    name: variation.name_ar || variation.name,
    colorName: variation.colorName_ar || variation.colorName,
    colorHex: variation.colorHex,
    images: variation.images,
    price: variation.price,
  }))

  return { en: enVariations, ar: arVariations }
}

// GET: Fetch All Variations
export async function GET() {
  try {
    const variations = await prisma.otherVariation.findMany()

    // Separate English and Arabic data
    const { en, ar } = separateLanguageData(variations)

    return NextResponse.json({ en, ar }, { status: 200 })
  } catch (error) {
    console.error("❌ Error fetching variations:", error)
    return NextResponse.json({ error: "Failed to fetch variations" }, { status: 500 })
  }
}

// POST: Add a New Variation
export async function POST(request) {
  try {
    console.log("🔹 API HIT: Received POST request for variation")

    const { carId, name, name_ar, colorName, colorName_ar, colorHex, images, price } = await request.json()

    console.log("Data received:", {
      carId,
      name,
      name_ar,
      colorName,
      colorName_ar,
      colorHex,
      images,
      price,
    })

    // ✅ Validate Required Fields
    if (!carId || !name || !colorName || !colorHex || !images || !price) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // ✅ Save Variation to Database (Keep images as an array)
    const newVariation = await prisma.otherVariation.create({
      data: {
        carId,
        name,
        name_ar,
        colorName,
        colorName_ar,
        colorHex,
        images, // ✅ Keep images as an array
        price: Number.parseFloat(price),
      },
    })

    return NextResponse.json(newVariation, { status: 201 })
  } catch (error) {
    console.error("❌ Error creating variation:", error)
    return NextResponse.json({ error: "Failed to create variation" }, { status: 500 })
  }
}
