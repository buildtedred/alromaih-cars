import CarCardItem from "@/MyComponents/Cards/car-listing"

export function CarGrid({ cars, loading }) {
  if (!cars || cars.length === 0) {
    return <p className="text-center text-gray-500">No cars available at the moment.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      {cars.map((car) => (
        <div key={car.id}>
          <CarCardItem car={car} />
        </div>
      ))}
    </div>
  )
}

