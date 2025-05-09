import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

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

// Process other variations data to separate English and Arabic
function processOtherVariationsData(otherVariations) {
  if (!otherVariations || !Array.isArray(otherVariations)) return { en: [], ar: [] }
  
  // Create English version of other variations
  const enOtherVariations = otherVariations.map(variation => ({
    id: variation.id,
    name: variation.name,
    colorName: variation.colorName,
    colorHex: variation.colorHex,
    price: variation.price,
    images: variation.images,
    carId: variation.carId,
    createdAt: variation.createdAt,
    updatedAt: variation.updatedAt,
  }))
  
  // Create Arabic version of other variations
  const arOtherVariations = otherVariations.map(variation => ({
    id: variation.id,
    name: variation.name_ar || variation.name,
    colorName: variation.colorName_ar || variation.colorName,
    colorHex: variation.colorHex,
    price: variation.price,
    images: variation.images,
    carId: variation.carId,
    createdAt: variation.createdAt,
    updatedAt: variation.updatedAt,
  }))
  
  return { en: enOtherVariations, ar: arOtherVariations }
}

// Process car data to separate English and Arabic
function processCarData(car) {
  if (!car) return { en: null, ar: null }
  
  // Process specifications if they exist
  const { en: enSpecs, ar: arSpecs } = processSpecifications(car.specifications)
  
  // Process otherVariations if they exist
  const { en: enOtherVariations, ar: arOtherVariations } = processOtherVariationsData(car.otherVariations)
  
  // Create English version of car
  const enCar = {
    id: car.id,
    slug: car.slug,
    model: car.model,
    description: car.description,
    color: car.color,
    condition: car.condition,
    bodyType: car.bodyType,
    fuelType: car.fuelType,
    fuelTankCapacity: car.fuelTankCapacity,
    transmission: car.transmission,
    wheelDrive: car.wheelDrive,
    infotainment: car.infotainment,
    manufactured: car.manufactured,
    safetyRating: car.safetyRating,
    warranty: car.warranty,
    registration: car.registration,
    insuranceStatus: car.insuranceStatus,
    year: car.year,
    price: car.price,
    mileage: car.mileage,
    engineSize: car.engineSize,
    horsepower: car.horsepower,
    torque: car.torque,
    topSpeed: car.topSpeed,
    acceleration: car.acceleration,
    fuelEconomy: car.fuelEconomy,
    seats: car.seats,
    doors: car.doors,
    ownerCount: car.ownerCount,
    gps: car.gps,
    sunroof: car.sunroof,
    parkingSensors: car.parkingSensors,
    cruiseControl: car.cruiseControl,
    leatherSeats: car.leatherSeats,
    heatedSeats: car.heatedSeats,
    bluetooth: car.bluetooth,
    climateControl: car.climateControl,
    keylessEntry: car.keylessEntry,
    rearCamera: car.rearCamera,
    taxValidity: car.taxValidity,
    images: car.images,
    specifications: enSpecs,
    otherVariations: enOtherVariations,
    brandId: car.brandId,
    createdAt: car.createdAt,
    updatedAt: car.updatedAt,
  }
  
  // Create Arabic version of car
  const arCar = {
    id: car.id,
    slug: car.slug,
    model: car.model_ar || car.model,
    description: car.description_ar,
    color: car.color_ar,
    condition: car.condition_ar,
    bodyType: car.bodyType_ar,
    fuelType: car.fuelType_ar,
    fuelTankCapacity: car.fuelTankCapacity_ar,
    transmission: car.transmission_ar,
    wheelDrive: car.wheelDrive_ar,
    infotainment: car.infotainment_ar,
    manufactured: car.manufactured_ar,
    safetyRating: car.safetyRating_ar,
    warranty: car.warranty_ar,
    registration: car.registration_ar,
    insuranceStatus: car.insuranceStatus_ar,
    year: car.year,
    year_ar: car.year_ar,
    price: car.price,
    price_ar: car.price_ar,
    mileage: car.mileage,
    mileage_ar: car.mileage_ar,
    engineSize: car.engineSize,
    engineSize_ar: car.engineSize_ar,
    horsepower: car.horsepower,
    horsepower_ar: car.horsepower_ar,
    torque: car.torque,
    torque_ar: car.torque_ar,
    topSpeed: car.topSpeed,
    topSpeed_ar: car.topSpeed_ar,
    acceleration: car.acceleration,
    acceleration_ar: car.acceleration_ar,
    fuelEconomy: car.fuelEconomy,
    fuelEconomy_ar: car.fuelEconomy_ar,
    seats: car.seats,
    seats_ar: car.seats_ar,
    doors: car.doors,
    doors_ar: car.doors_ar,
    ownerCount: car.ownerCount,
    ownerCount_ar: car.ownerCount_ar,
    gps: car.gps,
    sunroof: car.sunroof,
    parkingSensors: car.parkingSensors,
    cruiseControl: car.cruiseControl,
    leatherSeats: car.leatherSeats,
    heatedSeats: car.heatedSeats,
    bluetooth: car.bluetooth,
    climateControl: car.climateControl,
    keylessEntry: car.keylessEntry,
    rearCamera: car.rearCamera,
    taxValidity: car.taxValidity,
    images: car.images,
    specifications: arSpecs,
    otherVariations: arOtherVariations,
    brandId: car.brandId,
    createdAt: car.createdAt,
    updatedAt: car.updatedAt,
  }
  
  return { en: enCar, ar: arCar }
}

// Process cars data to separate English and Arabic
function processCarsData(cars) {
  if (!cars || !Array.isArray(cars)) return { en: [], ar: [] }
  
  const processedCars = cars.map(car => processCarData(car))
  
  const enCars = processedCars.map(car => car.en)
  const arCars = processedCars.map(car => car.ar)
  
  return { en: enCars, ar: arCars }
}

// GET: Fetch a Brand by Slug with all related data
export async function GET(request, { params }) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    const brand = await prisma.carBrand.findUnique({
      where: { slug },
      include: {
        cars: {
          include: {
            otherVariations: true,
          }
        },
      },
    })

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 })
    }

    // Process cars data to separate English and Arabic
    const { en: enCars, ar: arCars } = processCarsData(brand.cars)

    // Create English version of brand
    const en = {
      id: brand.id,
      name: brand.name,
      description: brand.description,
      logo: brand.logo,
      slug: brand.slug,
      createdAt: brand.createdAt,
      updatedAt: brand.updatedAt,
      cars: enCars, // Use English cars
    }

    // Create Arabic version of brand
    const ar = {
      id: brand.id,
      name: brand.name_ar || brand.name,
      description: brand.description_ar || brand.description,
      logo: brand.logo,
      slug: brand.slug,
      createdAt: brand.createdAt,
      updatedAt: brand.updatedAt,
      cars: arCars, // Use Arabic cars
    }

    // Return the response with both English and Arabic data
    return NextResponse.json({ en, ar }, { status: 200 })
  } catch (error) {
    console.error("❌ Error fetching brand by slug:", error)
    return NextResponse.json({ error: "Failed to fetch brand: " + error.message }, { status: 500 })
  }
}