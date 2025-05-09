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

// Process brand data to separate English and Arabic
function processBrandData(brand) {
  if (!brand) return { en: null, ar: null }

  // Create English version of brand
  const enBrand = {
    id: brand.id,
    name: brand.name,
    description: brand.description,
    logo: brand.logo,
    slug: brand.slug,
    createdAt: brand.createdAt,
    updatedAt: brand.updatedAt,
  }

  // Create Arabic version of brand
  const arBrand = {
    id: brand.id,
    name: brand.name_ar || brand.name,
    description: brand.description_ar || brand.description,
    logo: brand.logo,
    slug: brand.slug,
    createdAt: brand.createdAt,
    updatedAt: brand.updatedAt,
  }

  return { en: enBrand, ar: arBrand }
}

// Process variations data to separate English and Arabic
function processVariationsData(variations) {
  if (!variations || !Array.isArray(variations)) return { en: [], ar: [] }
  
  // Create English version of variations
  const enVariations = variations.map(variation => ({
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
  
  // Create Arabic version of variations
  const arVariations = variations.map(variation => ({
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
  
  return { en: enVariations, ar: arVariations }
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

// GET: Fetch a Single Car by Slug with separated EN and AR data
export async function GET(request, { params }) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    const car = await prisma.allCar.findUnique({
      where: { slug },
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

    // Process brand data to separate English and Arabic
    const { en: enBrand, ar: arBrand } = processBrandData(car.brand)
    
    // Process variations data to separate English and Arabic
    const { en: enVariations, ar: arVariations } = processVariationsData(car.variations)
    
    // Process other variations data to separate English and Arabic
    const { en: enOtherVariations, ar: arOtherVariations } = processOtherVariationsData(car.otherVariations)

    // Create English version
    const en = {
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
      specifications: enSpecs, // Use English specifications
      brand: enBrand, // Use English brand
      variations: enVariations, // Use English variations
      otherVariations: enOtherVariations, // Use English other variations
    }

    // Create Arabic version
    const ar = {
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
      specifications: arSpecs, // Use Arabic specifications
      brand: arBrand, // Use Arabic brand
      variations: arVariations, // Use Arabic variations
      otherVariations: arOtherVariations, // Use Arabic other variations
    }

    // Return the response in the same format as "get all" endpoint
    return NextResponse.json({ en, ar }, { status: 200 })
  } catch (error) {
    console.error("❌ Error fetching car by slug:", error)
    return NextResponse.json({ error: "Failed to fetch car: " + error.message }, { status: 500 })
  }
}