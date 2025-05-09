import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import slugify from "slugify"

// Helper function to generate a unique slug
async function generateUniqueSlug(model, year, currentSlug, id) {
  // Create base slug from model and year
  const baseSlug = slugify(`${model}-${year}`, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  })

  // If the slug hasn't changed, return the current slug
  if (baseSlug === currentSlug) {
    return currentSlug
  }

  let slug = baseSlug
  let counter = 1

  // Check if slug exists and generate a unique one
  while (true) {
    const existingCar = await prisma.allCar.findUnique({
      where: { slug },
    })

    if (!existingCar || existingCar.id === id) break

    // If slug exists, append counter and try again
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

// Process specifications to extract language-specific data
function processSpecifications(specifications) {
  if (!specifications || !Array.isArray(specifications)) return { en: [], ar: [] }

  // Extract English specifications
  const enSpecs = specifications.map((category) => ({
    title: category.title || "",
    details: Array.isArray(category.details)
      ? category.details.map((detail) => ({
          label: detail.label || "",
          value: detail.value || "",
        }))
      : [],
  }))

  // Extract Arabic specifications
  const arSpecs = specifications.map((category) => ({
    title: category.titleAr || category.title || "",
    details: Array.isArray(category.details)
      ? category.details.map((detail) => ({
          label: detail.labelAr || detail.label || "",
          value: detail.valueAr || detail.value || "",
        }))
      : [],
  }))

  return { en: enSpecs, ar: arSpecs }
}

// ✅ **GET: Fetch a Single Car by ID**
export async function GET(request, { params }) {
  try {
    const { id } = params

    const car = await prisma.allCar.findUnique({
      where: { id },
      include: {
        brand: true,
        variations: true,
        otherVariations: true,
      },
    })

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    // Process specifications to separate English and Arabic data
    const { en: enSpecs, ar: arSpecs } = processSpecifications(car.specifications)

    // Add the processed specifications to the car object
    const processedCar = {
      ...car,
      enSpecs,
      arSpecs,
    }

    return NextResponse.json(processedCar, { status: 200 })
  } catch (error) {
    console.error("❌ Error fetching car:", error)
    return NextResponse.json({ error: "Failed to fetch car: " + error.message }, { status: 500 })
  }
}

// ✅ **PUT: Update a Car**
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()

    // Get the current car to check if we need to update the slug
    const currentCar = await prisma.allCar.findUnique({
      where: { id },
      select: { slug: true },
    })

    if (!currentCar) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    // Generate a new slug if model or year has changed
    let slug = currentCar.slug
    if (body.model && body.year) {
      slug = await generateUniqueSlug(body.model, body.year, currentCar.slug, id)
    }

    // Prepare the data object
    const data = {
      slug,
      ...(body.model && { model: body.model }),
      ...(body.model_ar && { model_ar: body.model_ar }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.description_ar !== undefined && { description_ar: body.description_ar }),
      ...(body.color !== undefined && { color: body.color }),
      ...(body.color_ar !== undefined && { color_ar: body.color_ar }),
      ...(body.condition !== undefined && { condition: body.condition }),
      ...(body.condition_ar !== undefined && { condition_ar: body.condition_ar }),
      ...(body.bodyType !== undefined && { bodyType: body.bodyType }),
      ...(body.bodyType_ar !== undefined && { bodyType_ar: body.bodyType_ar }),
      ...(body.fuelType !== undefined && { fuelType: body.fuelType }),
      ...(body.fuelType_ar !== undefined && { fuelType_ar: body.fuelType_ar }),
      ...(body.fuelTankCapacity !== undefined && { fuelTankCapacity: body.fuelTankCapacity }),
      ...(body.fuelTankCapacity_ar !== undefined && { fuelTankCapacity_ar: body.fuelTankCapacity_ar }),
      ...(body.transmission !== undefined && { transmission: body.transmission }),
      ...(body.transmission_ar !== undefined && { transmission_ar: body.transmission_ar }),
      ...(body.wheelDrive !== undefined && { wheelDrive: body.wheelDrive }),
      ...(body.wheelDrive_ar !== undefined && { wheelDrive_ar: body.wheelDrive_ar }),
      ...(body.infotainment !== undefined && { infotainment: body.infotainment }),
      ...(body.infotainment_ar !== undefined && { infotainment_ar: body.infotainment_ar }),
      ...(body.manufactured !== undefined && { manufactured: body.manufactured }),
      ...(body.manufactured_ar !== undefined && { manufactured_ar: body.manufactured_ar }),
      ...(body.safetyRating !== undefined && { safetyRating: body.safetyRating }),
      ...(body.safetyRating_ar !== undefined && { safetyRating_ar: body.safetyRating_ar }),
      ...(body.warranty !== undefined && { warranty: body.warranty }),
      ...(body.warranty_ar !== undefined && { warranty_ar: body.warranty_ar }),
      ...(body.registration !== undefined && { registration: body.registration }),
      ...(body.registration_ar !== undefined && { registration_ar: body.registration_ar }),
      ...(body.insuranceStatus !== undefined && { insuranceStatus: body.insuranceStatus }),
      ...(body.insuranceStatus_ar !== undefined && { insuranceStatus_ar: body.insuranceStatus_ar }),
      ...(body.year !== undefined && { year: body.year ? Number.parseInt(body.year) : null }),
      ...(body.year_ar !== undefined && { year_ar: body.year_ar }),
      ...(body.price !== undefined && { price: body.price ? Number.parseFloat(body.price) : null }),
      ...(body.price_ar !== undefined && { price_ar: body.price_ar }),
      ...(body.mileage !== undefined && { mileage: body.mileage ? Number.parseInt(body.mileage) : null }),
      ...(body.mileage_ar !== undefined && { mileage_ar: body.mileage_ar }),
      ...(body.engineSize !== undefined && { engineSize: body.engineSize ? Number.parseFloat(body.engineSize) : null }),
      ...(body.engineSize_ar !== undefined && { engineSize_ar: body.engineSize_ar }),
      ...(body.horsepower !== undefined && { horsepower: body.horsepower ? Number.parseInt(body.horsepower) : null }),
      ...(body.horsepower_ar !== undefined && { horsepower_ar: body.horsepower_ar }),
      ...(body.torque !== undefined && { torque: body.torque ? Number.parseInt(body.torque) : null }),
      ...(body.torque_ar !== undefined && { torque_ar: body.torque_ar }),
      ...(body.topSpeed !== undefined && { topSpeed: body.topSpeed ? Number.parseInt(body.topSpeed) : null }),
      ...(body.topSpeed_ar !== undefined && { topSpeed_ar: body.topSpeed_ar }),
      ...(body.acceleration !== undefined && {
        acceleration: body.acceleration ? Number.parseFloat(body.acceleration) : null,
      }),
      ...(body.acceleration_ar !== undefined && { acceleration_ar: body.acceleration_ar }),
      ...(body.fuelEconomy !== undefined && {
        fuelEconomy: body.fuelEconomy ? Number.parseFloat(body.fuelEconomy) : null,
      }),
      ...(body.fuelEconomy_ar !== undefined && { fuelEconomy_ar: body.fuelEconomy_ar }),
      ...(body.seats !== undefined && { seats: body.seats ? Number.parseInt(body.seats) : null }),
      ...(body.seats_ar !== undefined && { seats_ar: body.seats_ar }),
      ...(body.doors !== undefined && { doors: body.doors ? Number.parseInt(body.doors) : null }),
      ...(body.doors_ar !== undefined && { doors_ar: body.doors_ar }),
      ...(body.ownerCount !== undefined && { ownerCount: body.ownerCount ? Number.parseInt(body.ownerCount) : null }),
      ...(body.ownerCount_ar !== undefined && { ownerCount_ar: body.ownerCount_ar }),
      ...(body.gps !== undefined && { gps: body.gps }),
      ...(body.sunroof !== undefined && { sunroof: body.sunroof }),
      ...(body.parkingSensors !== undefined && { parkingSensors: body.parkingSensors }),
      ...(body.cruiseControl !== undefined && { cruiseControl: body.cruiseControl }),
      ...(body.leatherSeats !== undefined && { leatherSeats: body.leatherSeats }),
      ...(body.heatedSeats !== undefined && { heatedSeats: body.heatedSeats }),
      ...(body.bluetooth !== undefined && { bluetooth: body.bluetooth }),
      ...(body.climateControl !== undefined && { climateControl: body.climateControl }),
      ...(body.keylessEntry !== undefined && { keylessEntry: body.keylessEntry }),
      ...(body.rearCamera !== undefined && { rearCamera: body.rearCamera }),
      ...(body.taxValidity !== undefined && { taxValidity: body.taxValidity ? new Date(body.taxValidity) : null }),
      ...(body.images !== undefined && { images: body.images }),
      ...(body.specifications !== undefined && { specifications: body.specifications }),
      ...(body.brandId && { brandId: body.brandId }),
    }

    // Update the car record
    const updatedCar = await prisma.allCar.update({
      where: { id },
      data,
      include: {
        brand: true,
        variations: true,
        otherVariations: true,
      },
    })

    // Process specifications to separate English and Arabic data
    const { en: enSpecs, ar: arSpecs } = processSpecifications(updatedCar.specifications)

    // Add the processed specifications to the car object
    const processedCar = {
      ...updatedCar,
      enSpecs,
      arSpecs,
    }

    return NextResponse.json(processedCar, { status: 200 })
  } catch (error) {
    // Enhanced error handling
    if (error.code === "P2002") {
      // Prisma unique constraint violation (e.g., duplicate slug)
      return NextResponse.json(
        { error: "Unique constraint violation: A car with this slug already exists" },
        { status: 400 },
      )
    } else if (error.code === "P2003") {
      // Foreign key constraint violation (invalid brandId)
      return NextResponse.json({ error: "Invalid brand ID, brand does not exist" }, { status: 400 })
    } else if (error instanceof SyntaxError) {
      // Handle invalid JSON body format
      return NextResponse.json({ error: "Invalid JSON format in the request body" }, { status: 400 })
    } else {
      // General error
      console.error("Unexpected error:", error)
      return NextResponse.json({ error: "Something went wrong: " + error.message }, { status: 500 })
    }
  }
}

// ✅ **DELETE: Delete a Car**
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    await prisma.allCar.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Car deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("❌ Error deleting car:", error)
    return NextResponse.json({ error: "Failed to delete car: " + error.message }, { status: 500 })
  }
}
