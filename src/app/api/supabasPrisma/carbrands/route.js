import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure Prisma is correctly imported

// Process specifications to extract language-specific data
function processSpecifications(specifications) {
  if (!specifications || !Array.isArray(specifications)) return { en: [], ar: [] };

  // Extract English specifications
  const enSpecs = specifications.map((category) => ({
    title: category.title || "",
    details: Array.isArray(category.details)
      ? category.details.map((detail) => ({
          label: detail.label || "",
          value: detail.value || "",
        }))
      : [],
  }));

  // Extract Arabic specifications
  const arSpecs = specifications.map((category) => ({
    title: category.titleAr || category.title || "",
    details: Array.isArray(category.details)
      ? category.details.map((detail) => ({
          label: detail.labelAr || detail.label || "",
          value: detail.valueAr || detail.value || "",
        }))
      : [],
  }));

  return { en: enSpecs, ar: arSpecs };
}

// Process other variations data to separate English and Arabic
function processOtherVariationsData(otherVariations) {
  if (!otherVariations || !Array.isArray(otherVariations)) return { en: [], ar: [] };
  
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
  }));
  
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
  }));
  
  return { en: enOtherVariations, ar: arOtherVariations };
}

export async function GET() {
  try {
    const brands = await prisma.carBrand.findMany({
      include: {
        cars: {
          include: {
            otherVariations: true,
          },
        },
      },
    });

    const en = brands.map((brand) => {
      // Process cars and their variations
      const processedCars = brand.cars.map(car => {
        // Process otherVariations for this car
        const { en: enVariations } = processOtherVariationsData(car.otherVariations);
        
        // Process specifications for this car
        const { en: enSpecs } = processSpecifications(car.specifications);
        
        return {
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
          brandId: car.brandId,
          createdAt: car.createdAt,
          updatedAt: car.updatedAt,
          variations: enVariations, // Use English variations
        };
      });
      
      return {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        image: brand.image,
        createdAt: brand.createdAt,
        updatedAt: brand.updatedAt,
        cars: processedCars,
      };
    });

    const ar = brands
      .filter((brand) => brand.name_ar)
      .map((brand) => {
        // Process cars and their variations
        const processedCars = brand.cars
          .filter((car) => car.name_ar || car.model_ar)
          .map(car => {
            // Process otherVariations for this car
            const { ar: arVariations } = processOtherVariationsData(car.otherVariations);
            
            // Process specifications for this car
            const { ar: arSpecs } = processSpecifications(car.specifications);
            
            return {
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
              brandId: car.brandId,
              createdAt: car.createdAt,
              updatedAt: car.updatedAt,
              variations: arVariations, // Use Arabic variations
            };
          });
        
        return {
          id: brand.id,
          name: brand.name_ar,
          slug: brand.slug,
          image: brand.image,
          createdAt: brand.createdAt,
          updatedAt: brand.updatedAt,
          cars: processedCars,
        };
      });

    return NextResponse.json({ en, ar }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching brands:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, name_ar, image } = await request.json();
    
    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    
    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const newBrand = await prisma.carBrand.create({
      data: {
        name,
        name_ar: name_ar || null, // Optional Arabic name
        slug,
        image,
      },
    });

    return NextResponse.json(newBrand, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating brand:", error);
    
    // Handle unique constraint violations
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field';
      return NextResponse.json({ error: `A brand with this ${field} already exists` }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Failed to create car brand" }, { status: 500 });
  }
}