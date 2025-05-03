import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure Prisma is correctly imported

export async function GET() {
  try {
    const carBrands = await prisma.carBrand.findMany(
      {
        include: { cars: true },
      }
    );
    return NextResponse.json(carBrands, { status: 200 });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    
    const { name, image } = await request.json();
    console.log("🔹 API HIT: Received POST request",image);

    if (!name || !image) {
      console.error("🚨 Missing name or image");
      return NextResponse.json({ error: "Name and image are required" }, { status: 400 });
    }

    // Generate a slug
    const slug = name.toLowerCase().replace(/\s+/g, "-");

    // Save brand in database
    const newBrand = await prisma.carBrand.create({
      data: {
        name,
        slug,
        image, // Saving image URL
      },
    });

    return NextResponse.json(newBrand, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating brand:", error);
    return NextResponse.json({ error: "Failed to create car brand" }, { status: 500 });
  }
}