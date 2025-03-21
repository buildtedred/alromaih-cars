import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ✅ **GET: Fetch All Cars**
export async function GET() {
  try {
    const cars = await prisma.allCar.findMany({
      include: {
        brand: true, // ✅ Include brand details
        // variations: true, // ✅ Include variations
        otherVariations: true, // ✅ Include variations
      },
    });

    return NextResponse.json(cars, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching cars:", error);
    return NextResponse.json(
      { error: "Failed to fetch cars" },
      { status: 500 }
    );
  }
}


// ✅ **POST: Add a New Car**
export async function POST(request) {
  try {
    console.log("🔹 API HIT: Received POST request");

    const { model, year, brandId, images, specifications } =
      await request.json();

    if (
      !model ||
      !year ||
      !brandId ||
      !images ||
      !specifications
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }


    const newCar = await prisma.allCar.create({
      data: {
        model,
        year: parseInt(year),
        brandId,
        images,
        spacification: specifications, // ✅ Storing Specifications as JSON
      },
    });

  
    return NextResponse.json(newCar, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating car:", error);
    return NextResponse.json(
      { error: "Failed to create car" },
      { status: 500 }
    );
  }
}

// ✅ **DELETE: Delete a Car**
export async function DELETE(request) {
  try {
    const { id } = request.query;

    if (!id) {
      return NextResponse.json(
        { error: "Car ID is required" },
        { status: 400 }
      );
    }

    await prisma.allCar.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: "Car deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting car:", error);
    return NextResponse.json(
      { error: "Failed to delete car" },
      { status: 500 }
    );
  }
}
