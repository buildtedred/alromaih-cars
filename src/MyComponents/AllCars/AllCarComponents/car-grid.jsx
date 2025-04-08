import CarCard from "@/MyComponents/Cards/CarCard.js"

export function CarGrid({ cars, loading, locale }) {
  // Check if cars is undefined, null, or empty
  if (!cars || !Array.isArray(cars) || cars.length === 0) {
    console.log("CarGrid received empty cars array")
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No cars available at the moment.</p>
      </div>
    )
  }

  console.log("CarGrid rendering with cars:", cars.length)

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      {processedCars.map((car, index) => (
        <div
          key={car.id}
          className="flex justify-center w-full transition-all duration-500 hover:translate-y-[-5px]"
          style={{
            animationName: "fadeIn",
            animationDuration: "0.5s",
            animationTimingFunction: "ease-out",
            animationFillMode: "forwards",
            animationDelay: `${index * 100}ms`,
            opacity: 0,
          }}
        >
          <CarCard car={car} locale={locale} />
        </div>
      ))}
    </div>
  )
}

// Add keyframes for fadeIn animation
const style = document.createElement("style")
style.textContent = `
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`
document.head.appendChild(style)
