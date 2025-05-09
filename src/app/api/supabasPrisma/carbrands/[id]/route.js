import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const brand = await prisma.carBrand.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        name_ar: true,
        slug: true,
        image: true,
        cars: {
          include: {
            otherVariations: true,
          },
        },
      },
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const en = {
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      image: brand.image,
      cars: brand.cars,
    };

    const ar = brand.name_ar
      ? {
          id: brand.id,
          name_ar: brand.name_ar,
          slug: brand.slug,
          image: brand.image,
          cars: brand.cars,
        }
      : null;

    return NextResponse.json({ en, ar }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching brand:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { name, name_ar, image } = await request.json();

    if (!name || !image) {
      return NextResponse.json({ error: "Name and image are required" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const updatedBrand = await prisma.carBrand.update({
      where: { id },
      data: {
        name,
        name_ar: name_ar || null,
        slug,
        image,
      },
    });

    return NextResponse.json(updatedBrand, { status: 200 });
  } catch (error) {
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