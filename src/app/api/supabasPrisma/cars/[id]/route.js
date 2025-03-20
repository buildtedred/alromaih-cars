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
    // console.log("🔍 Fetching car with ID:", id);

    const car = await prisma.allCar.findUnique({
      where: { id: id },
      include: {
        brand: true, // ✅ Include brand details
        // variations: true, // ✅ Include variations
        otherVariations: true, // ✅ Include variations
      }
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
    const { model, year, brandId, images, specifications, variations } =
      await request.json();

    // ✅ Validate required fields
    if (
      !model ||
      !year ||
      !brandId ||
      !images ||
      !specifications ||
      !variations
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Convert `year` to integer
    const parsedYear = parseInt(year, 10);
    if (isNaN(parsedYear)) {
      return NextResponse.json(
        { error: "Year must be a valid number" },
        { status: 400 }
      );
    }

    // ✅ Check if the car exists
    const existingCar = await prisma.allCar.findUnique({ where: { id } });
    if (!existingCar)
      return NextResponse.json({ error: "Car not found" }, { status: 404 });

        // ✅ Format Variations Properly
        const formattedVariations = variations.map((v) => ({
          id: v.id || undefined, // ✅ Preserve existing ID if available
          name: v.name || "Default Name",
          colorName: v.colorName || "Unknown",
          colorHex: v.colorHex || "#000000",
          images: v.images || [],
          price: parseFloat(v.price) || 0,
          carId: id, // ✅ Ensure each variation is linked to the car
        }));
    // ✅ Update Car Data
    const updatedCar = await prisma.allCar.update({
      where: { id },
      data: {
        model,
        year: parsedYear,
        brandId,
        images,
        spacification: specifications,
      },
    });

    // ✅ Update Variations Using Transactions
        // ✅ Update Variations Using Transactions
        await prisma.$transaction(
          formattedVariations.map((v) =>
            prisma.variation.upsert({
              where: { id: v.id || "" }, // ✅ Update if exists, else create new
              update: { name: v.name, colorName: v.colorName, colorHex: v.colorHex, images: v.images, price: v.price },
              create: v,
            })
          )
        );

    return NextResponse.json(
      { message: "Car updated successfully", updatedCar },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating car:", error);
    return NextResponse.json(
      { error: "Failed to update car", details: error.message },
      { status: 500 }
    );
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
      const { error } = await supabase.storage
        .from("Alromaih")
        .remove([fileName]);
      if (error) {
        console.error("❌ Error deleting image:", error);
      }
    }

    // Delete car from database
    await prisma.allCar.delete({
      where: { id: id },
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
