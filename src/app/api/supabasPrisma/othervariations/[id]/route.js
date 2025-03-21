import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ GET: Fetch a Single Variation
export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Variation ID is required" }, { status: 400 });
    }

    // ✅ Remove parseInt() since ID is a UUID (string)
    const variation = await prisma.otherVariation.findUnique({
      where: { id }, // ✅ Keep ID as string
    });

    if (!variation) {
      return NextResponse.json({ error: "Variation not found" }, { status: 404 });
    }

    return NextResponse.json(variation, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching variation:", error);
    return NextResponse.json({ error: "Failed to fetch variation" }, { status: 500 });
  }
}


// ✅ PUT: Update a Variation
export async function PUT(request, { params }) {
  try {
    // ✅ Await the params before using them
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Variation ID is required" }, { status: 400 });
    }

    const { name, colorName, colorHex, images, price } = await request.json();

    const updatedVariation = await prisma.otherVariation.update({
      where: { id },
      data: {
        name,
        colorName,
        colorHex,
        images,
        price: parseFloat(price),
      },
    });

    return NextResponse.json(updatedVariation, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating variation:", error);
    return NextResponse.json({ error: "Failed to update variation" }, { status: 500 });
  }
}

// ✅ DELETE: Remove a Variation
export async function DELETE(req, { params }) {
  const { id } = params; // Get variation ID from URL
  console.log("Deleting Variation with ID:", id);

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    // ✅ Delete from the database using Prisma
    await prisma.otherVariation.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Variation deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting variation:", error);
    return NextResponse.json({ error: "Failed to delete variation" }, { status: 500 });
  }
}
