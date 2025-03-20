import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
      const cars = await prisma.otherVariation.findMany();
  
      return NextResponse.json(cars, { status: 200 });
    } catch (error) {
      console.error("❌ Error fetching cars:", error);
      return NextResponse.json(
        { error: "Failed to fetch cars" },
        { status: 500 }
      );
    }
  }
  
// ✅ POST: Add a New Variation
export async function POST(request) {
  try {
    console.log("🔹 API HIT: Received POST request for variation");

    const { carId, name, colorName, colorHex, images, price } =
      await request.json();
    console.log("Data received:", {
      carId,
      name,
      colorName,
      colorHex,
      images,
      price,
    });

    // ✅ Validate Required Fields
    if (!carId || !name || !colorName || !colorHex || !images || !price) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Save Variation to Database (Keep images as an array)
    const newVariation = await prisma.otherVariation.create({
      data: {
        carId,
        name,
        colorName,
        colorHex,
        images, // ✅ Keep images as an array
        price: parseFloat(price),
      },
    });

    return NextResponse.json(newVariation, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating variation:", error);
    return NextResponse.json(
      { error: "Failed to create variation" },
      { status: 500 }
    );
  }
}
