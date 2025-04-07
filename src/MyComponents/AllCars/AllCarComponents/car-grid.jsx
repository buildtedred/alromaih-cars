// Optimize the grid layout for tablet sizes
import CarCard from "@/MyComponents/Cards/CarCard.js"

export function CarGrid({ cars, loading, locale }) {
  if (!cars || cars.length === 0) {
    return <p className="text-center text-gray-500">No cars available at the moment.</p>
  }

  // Process cars to ensure localized fields are properly handled
  const processedCars = cars.map((car) => {
    // Create a new car object with processed fields
    return {
      ...car,
      // Ensure name is a string
      name: typeof car.name === "object" ? car.name[locale] || car.name.en || "" : car.name,
      // Process other localized fields as needed
      modelYear: typeof car.modelYear === "object" ? car.modelYear[locale] || car.modelYear.en || "" : car.modelYear,
      // Ensure specs fields are properly processed
      specs: {
        ...car.specs,
        fuelType:
          typeof car.specs?.fuelType === "object"
            ? car.specs.fuelType[locale] || car.specs.fuelType.en || ""
            : car.specs?.fuelType,
        seats:
          typeof car.specs?.seats === "object" ? car.specs.seats[locale] || car.specs.seats.en || "" : car.specs?.seats,
        transmission:
          typeof car.specs?.transmission === "object"
            ? car.specs.transmission[locale] || car.specs.transmission.en || ""
            : car.specs?.transmission,
        engine:
          typeof car.specs?.engine === "object"
            ? car.specs.engine[locale] || car.specs.engine.en || ""
            : car.specs?.engine,
        power:
          typeof car.specs?.power === "object" ? car.specs.power[locale] || car.specs.power.en || "" : car.specs?.power,
      },
    }
  })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {processedCars.map((car) => (
        <div key={car.id}>
          <CarCard car={car} locale={locale} />
        </div>
      ))}
    </div>
  )
}

