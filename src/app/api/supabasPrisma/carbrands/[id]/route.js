import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const brand = await prisma.carBrand.findUnique({
      where: { id },
      
        include: { cars: true },
      
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json(brand, { status: 200 });
  } catch (error) {
    console.error("Error fetching brand:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { name, image } = await request.json();

    if (!name || !image) {
      return NextResponse.json({ error: "Name and image are required" }, { status: 400 });
    }

    // Generate a slug
    const slug = name.toLowerCase().replace(/\s+/g, "-");

    // Update brand in database
    const updatedBrand = await prisma.carBrand.update({
      where: { id },
      data: {
        name,
        slug,
        image, // Updating image URL
      },
    });

    console.log("✅ Brand updated:", updatedBrand);

    return NextResponse.json(updatedBrand, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating brand:", error);
    return NextResponse.json({ error: "Failed to update car brand" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Delete brand from database
    await prisma.carBrand.delete({
      where: { id },
    });

    console.log("✅ Brand deleted");

    return NextResponse.json({ message: "Brand deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting brand:", error);
    return NextResponse.json({ error: "Failed to delete car brand" }, { status: 500 });
  }
}