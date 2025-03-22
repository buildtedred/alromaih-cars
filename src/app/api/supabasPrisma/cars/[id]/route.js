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
    const body = await request.json();
    console.log("🔹 API HIT: Received PUT request", body);

    // Validate required fields
    if (!body.model || !body.brandId) {
      return NextResponse.json(
        { error: "Model and Brand ID are required" },
        { status: 400 }
      );
    }

    // Check if the car exists
    const existingCar = await prisma.allCar.findUnique({ where: { id } });
    if (!existingCar) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    // Update Car Data
    const updatedCar = await prisma.allCar.update({
      where: { id },
      data: {
        model: body.model,
        year: body.year ? parseInt(body.year) : null,
        brandId: body.brandId,
        description: body.description || null,
        price: body.price ? parseFloat(body.price) : null,
        color: body.color || null,
        condition: body.condition || null,
        bodyType: body.bodyType || null,
        mileage: body.mileage ? parseInt(body.mileage) : null,
        fuelType: body.fuelType || null,
        fuelTankCapacity: body.fuelTankCapacity || null,
        transmission: body.transmission || null,
        engineSize: body.engineSize ? parseFloat(body.engineSize) : null,
        horsepower: body.horsepower ? parseInt(body.horsepower) : null,
        torque: body.torque ? parseInt(body.torque) : null,
        wheelDrive: body.wheelDrive || null,
        topSpeed: body.topSpeed ? parseInt(body.topSpeed) : null,
        acceleration: body.acceleration ? parseFloat(body.acceleration) : null,
        fuelEconomy: body.fuelEconomy ? parseFloat(body.fuelEconomy) : null,
        seats: body.seats ? parseInt(body.seats) : null,
        doors: body.doors ? parseInt(body.doors) : null,
        infotainment: body.infotainment || null,
        gps: body.gps || null,
        sunroof: body.sunroof || null,
        parkingSensors: body.parkingSensors || null,
        cruiseControl: body.cruiseControl || null,
        leatherSeats: body.leatherSeats || null,
        heatedSeats: body.heatedSeats || null,
        bluetooth: body.bluetooth || null,
        climateControl: body.climateControl || null,
        keylessEntry: body.keylessEntry || null,
        rearCamera: body.rearCamera || null,
        manufactured: body.manufactured || null,
        safetyRating: body.safetyRating || null,
        warranty: body.warranty || null,
        registration: body.registration || null,
        ownerCount: body.ownerCount ? parseInt(body.ownerCount) : null,
        insuranceStatus: body.insuranceStatus || null,
        taxValidity: body.taxValidity && !isNaN(new Date(body.taxValidity).getTime()) ? new Date(body.taxValidity) : null,
        images: body.images || [],
        spacification: body.specifications || {},
      },
    });

    return NextResponse.json(
      { message: "Car updated successfully", updatedCar },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating car:", {
      message: error.message,
    });
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
