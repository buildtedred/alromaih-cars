import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ✅ **GET: Fetch a Car by ID**
export async function GET(request, { params }) {
  try {
    const { id } = params;
    console.log("🔍 Fetching car with ID:", id);

    const car = await prisma.allCar.findUnique({
      where: { id: id },
      include: { brand: true }, // Include related brand details
    });

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    return NextResponse.json(car, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching car:", error);
    return NextResponse.json({ error: "Failed to fetch car" }, { status: 500 });
  }
}

// ✅ **PUT: Update a Car**
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { model, year, brandId, image } = await request.json();

    if (!model || !year || !brandId) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const updatedCar = await prisma.allCar.update({
      where: { id: id },
      data: {
        model,
        year: parseInt(year),
        brandId,
        image, // Update image directly
      },
    });

    return NextResponse.json(updatedCar, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating car:", error);
    return NextResponse.json({ error: "Failed to update car" }, { status: 500 });
  }
}

// ✅ **DELETE: Remove a Car**
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Find car to delete
    const car = await prisma.allCar.findUnique({
      where: { id: id },
    });

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    // Delete image from Supabase storage
    if (car.image) {
      const fileName = car.image.split("/").pop();
      const { error } = await supabase.storage.from("Alromaih").remove([fileName]);
      if (error) {
        console.error("❌ Error deleting image:", error);
      }
    }

    // Delete car from database
    await prisma.allCar.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Car deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting car:", error);
    return NextResponse.json({ error: "Failed to delete car" }, { status: 500 });
  }
}