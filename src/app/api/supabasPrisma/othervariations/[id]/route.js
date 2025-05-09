import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// Helper function to separate language data
function separateLanguageData(variation) {
  if (!variation) return { en: null, ar: null }

  // Process English variation
  const enVariation = {
    id: variation.id,
    carId: variation.carId,
    name: variation.name,
    colorName: variation.colorName,
    colorHex: variation.colorHex,
    images: variation.images,
    price: variation.price,
  }

  // Process Arabic variation
  const arVariation = {
    id: variation.id,
    carId: variation.carId,
    name: variation.name_ar || variation.name,
    colorName: variation.colorName_ar || variation.colorName,
    colorHex: variation.colorHex,
    images: variation.images,
    price: variation.price,
  }

  return { en: enVariation, ar: arVariation }
}

// ✅ GET: Fetch a Single Variation
export async function GET(request, { params }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Variation ID is required" }, { status: 400 })
    }

    // ✅ Remove parseInt() since ID is a UUID (string)
    const variation = await prisma.otherVariation.findUnique({
      where: { id }, // ✅ Keep ID as string
    })

    if (!variation) {
      return NextResponse.json({ error: "Variation not found" }, { status: 404 })
    }

    // Separate English and Arabic data
    const { en, ar } = separateLanguageData(variation)

    return NextResponse.json({ en, ar }, { status: 200 })
  } catch (error) {
    console.error("❌ Error fetching variation:", error)
    return NextResponse.json({ error: "Failed to fetch variation" }, { status: 500 })
  }
}

// ✅ PUT: Update a Variation
export async function PUT(request, { params }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Variation ID is required" }, { status: 400 })
    }

    const { name, name_ar, colorName, colorName_ar, colorHex, images, price } = await request.json()

    const updatedVariation = await prisma.otherVariation.update({
      where: { id },
      data: {
        name,
        name_ar,
        colorName,
        colorName_ar,
        colorHex,
        images,
        price: Number.parseFloat(price),
      },
    })

    // Separate English and Arabic data
    const { en, ar } = separateLanguageData(updatedVariation)

    return NextResponse.json({ en, ar }, { status: 200 })
  } catch (error) {
    console.error("❌ Error updating variation:", error)
    return NextResponse.json({ error: "Failed to update variation" }, { status: 500 })
  }
}

// ✅ DELETE: Remove a Variation
export async function DELETE(req, { params }) {
  const { id } = params // Get variation ID from URL
  console.log("Deleting Variation with ID:", id)

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 })
  }

  try {
    // ✅ Delete from the database using Prisma
    await prisma.otherVariation.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Variation deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting variation:", error)
    return NextResponse.json({ error: "Failed to delete variation" }, { status: 500 })
  }
}
