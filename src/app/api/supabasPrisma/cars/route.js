import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createClient } from "@supabase/supabase-js"
import slugify from "slugify"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Helper function to generate a unique slug
async function generateUniqueSlug(model, year) {
  // Create base slug from model and year
  const baseSlug = slugify(`${model}-${year}`, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  })

  let slug = baseSlug
  let counter = 1

  // Check if slug exists and generate a unique one
  while (true) {
    const existingCar = await prisma.allCar.findUnique({
      where: { slug },
    })

    if (!existingCar) break

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

// Process brand data to extract language-specific data
function processBrand(brand) {
  if (!brand) return { en: null, ar: null }
  
  // English brand data
  const enBrand = {
    id: brand.id,
    name: brand.name,
    description: brand.description,
    logo: brand.logo,
    slug: brand.slug,
    // Add other English brand fields as needed
  }
  
  // Arabic brand data
  const arBrand = {
    id: brand.id,
    name: brand.name_ar || brand.name,
    description: brand.description_ar || brand.description,
    logo: brand.logo,
    slug: brand.slug,
    // Add other Arabic brand fields as needed
  }
  
  return { en: enBrand, ar: arBrand }
}

// Process variations to extract language-specific data
function processVariations(variations) {
  if (!variations || !Array.isArray(variations)) return { en: [], ar: [] }
  
  // English variations
  const enVariations = variations.map(variation => ({
    id: variation.id,
    name: variation.name,
    colorName: variation.colorName,
    colorHex: variation.colorHex,
    price: variation.price,
    images: variation.images,
    carId: variation.carId,
    // Add other English variation fields as needed
  }))
  
  // Arabic variations
  const arVariations = variations.map(variation => ({
    id: variation.id,
    name: variation.name_ar || variation.name,
    colorName: variation.colorName_ar || variation.colorName,
    colorHex: variation.colorHex,
    price: variation.price,
    images: variation.images,
    carId: variation.carId,
    // Add other Arabic variation fields as needed
  }))
  
  return { en: enVariations, ar: arVariations }
}

// Process other variations to extract language-specific data
function processOtherVariations(otherVariations) {
  if (!otherVariations || !Array.isArray(otherVariations)) return { en: [], ar: [] }
  
  // English other variations
  const enOtherVariations = otherVariations.map(variation => ({
    id: variation.id,
    name: variation.name,
    colorName: variation.colorName,
    colorHex: variation.colorHex,
    price: variation.price,
    images: variation.images,
    carId: variation.carId,
    // Add other English variation fields as needed
  }))
  
  // Arabic other variations
  const arOtherVariations = otherVariations.map(variation => ({
    id: variation.id,
    name: variation.name_ar || variation.name,
    colorName: variation.colorName_ar || variation.colorName,
    colorHex: variation.colorHex,
    price: variation.price,
    images: variation.images,
    carId: variation.carId,
    // Add other Arabic variation fields as needed
  }))
  
  return { en: enOtherVariations, ar: arOtherVariations }
}

// ✅ **GET: Fetch All Cars**
export async function GET() {
  try {
    const cars = await prisma.allCar.findMany({
      include: {
        brand: true, // Include brand details
        variations: true, // Include car variations
        otherVariations: true, // Include other car variations
      },
    })

    // Process all cars to separate English and Arabic data
    const processedCars = cars.map((car) => {
      // Process specifications
      const { en: enSpecs, ar: arSpecs } = processSpecifications(car.specifications)
      
      // Process brand
      const { en: enBrand, ar: arBrand } = processBrand(car.brand)
      
      // Process variations
      const { en: enVariations, ar: arVariations } = processVariations(car.variations)
      
      // Process other variations
      const { en: enOtherVariations, ar: arOtherVariations } = processOtherVariations(car.otherVariations)
      
      return { 
        ...car, 
        enSpecs, 
        arSpecs,
        enBrand,
        arBrand,
        enVariations,
        arVariations,
        enOtherVariations,
        arOtherVariations
      }
    })

    // Mapping English data for cars
    const en = processedCars.map((car) => ({
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
      specifications: car.enSpecs, // Use English specifications only
      brand: car.enBrand, // Use English brand data
      variations: car.enVariations, // Use English variations data
      otherVariations: car.enOtherVariations, // Use English other variations data
    }))

    // Mapping Arabic data (only include those with Arabic fields)
    const ar = processedCars
      .filter((car) => car.model_ar) // Ensure Arabic model exists
      .map((car) => ({
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
        specifications: car.arSpecs, // Use Arabic specifications only
        brand: car.arBrand, // Use Arabic brand data
        variations: car.arVariations, // Use Arabic variations data
        otherVariations: car.arOtherVariations, // Use Arabic other variations data
      }))

    // Returning both 'en' and 'ar' data for all cars
    return NextResponse.json({ en, ar }, { status: 200 })
  } catch (error) {
    console.error("❌ Error fetching cars:", error)
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 })
  }
}

// ✅ **POST: Add a New Car**
export async function POST(req) {
  try {
    const body = await req.json()

    // Check if required fields exist
    if (!body.model || !body.year || !body.brandId) {
      return NextResponse.json({ error: "Required fields missing (model, year, brandId)" }, { status: 400 })
    }

    // Generate a unique slug for the car
    const slug = await generateUniqueSlug(body.model, body.year)

    // Prepare the data object
    const data = {
      slug,
      model: body.model,
      model_ar: body.model_ar || null,

      description: body.description || null,
      description_ar: body.description_ar || null,

      color: body.color || null,
      color_ar: body.color_ar || null,

      condition: body.condition || null,
      condition_ar: body.condition_ar || null,

      bodyType: body.bodyType || null,
      bodyType_ar: body.bodyType_ar || null,

      fuelType: body.fuelType || null,
      fuelType_ar: body.fuelType_ar || null,

      fuelTankCapacity: body.fuelTankCapacity || null,
      fuelTankCapacity_ar: body.fuelTankCapacity_ar || null,

      transmission: body.transmission || null,
      transmission_ar: body.transmission_ar || null,

      wheelDrive: body.wheelDrive || null,
      wheelDrive_ar: body.wheelDrive_ar || null,

      infotainment: body.infotainment || null,
      infotainment_ar: body.infotainment_ar || null,

      manufactured: body.manufactured || null,
      manufactured_ar: body.manufactured_ar || null,

      safetyRating: body.safetyRating || null,
      safetyRating_ar: body.safetyRating_ar || null,

      warranty: body.warranty || null,
      warranty_ar: body.warranty_ar || null,

      registration: body.registration || null,
      registration_ar: body.registration_ar || null,

      insuranceStatus: body.insuranceStatus || null,
      insuranceStatus_ar: body.insuranceStatus_ar || null,

      year: body.year ? Number.parseInt(body.year) : null,
      year_ar: body.year_ar || null,

      price: body.price ? Number.parseFloat(body.price) : null,
      price_ar: body.price_ar || null,

      mileage: body.mileage ? Number.parseInt(body.mileage) : null,
      mileage_ar: body.mileage_ar || null,

      engineSize: body.engineSize ? Number.parseFloat(body.engineSize) : null,
      engineSize_ar: body.engineSize_ar || null,

      horsepower: body.horsepower ? Number.parseInt(body.horsepower) : null,
      horsepower_ar: body.horsepower_ar || null,

      torque: body.torque ? Number.parseInt(body.torque) : null,
      torque_ar: body.torque_ar || null,

      topSpeed: body.topSpeed ? Number.parseInt(body.topSpeed) : null,
      topSpeed_ar: body.topSpeed_ar || null,

      acceleration: body.acceleration ? Number.parseFloat(body.acceleration) : null,
      acceleration_ar: body.acceleration_ar || null,

      fuelEconomy: body.fuelEconomy ? Number.parseFloat(body.fuelEconomy) : null,
      fuelEconomy_ar: body.fuelEconomy_ar || null,

      seats: body.seats ? Number.parseInt(body.seats) : null,
      seats_ar: body.seats_ar || null,

      doors: body.doors ? Number.parseInt(body.doors) : null,
      doors_ar: body.doors_ar || null,

      ownerCount: body.ownerCount ? Number.parseInt(body.ownerCount) : null,
      ownerCount_ar: body.ownerCount_ar || null,

      gps: body.gps || false,
      sunroof: body.sunroof || false,
      parkingSensors: body.parkingSensors || false,
      cruiseControl: body.cruiseControl || false,
      leatherSeats: body.leatherSeats || false,
      heatedSeats: body.heatedSeats || false,
      bluetooth: body.bluetooth || false,
      climateControl: body.climateControl || false,
      keylessEntry: body.keylessEntry || false,
      rearCamera: body.rearCamera || false,

      taxValidity: body.taxValidity ? new Date(body.taxValidity) : null,
      images: body.images || [],
      specifications: body.specifications || null,

      brandId: body.brandId,
    }

    // Try creating the car record
    const newCar = await prisma.allCar.create({ data })

    return NextResponse.json(newCar, { status: 201 })
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