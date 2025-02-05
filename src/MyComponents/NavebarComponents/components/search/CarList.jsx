import Image from "next/image"
import { Users, Fuel } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/i18n/routing"

export default function CarList({ cars }) {
  if (cars.length === 0) {
    return <p className="text-center text-gray-500 py-4">No cars found matching your search.</p>
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cars.map((car) => (
        <Link key={car.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="relative h-48">
            <Image
              src={`https://xn--mgbml9eg4a.com${car.image_url}`}
              alt={car.name.en.name}
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg"
            />
            <Badge variant="secondary" className="absolute top-2 right-2 capitalize text-xs">
              {car.name.en.condition}
            </Badge>
          </div>
          <div className="p-4">
            <h2 className="text-lg font-semibold truncate">{car.name.en.name}</h2>
            <p className="text-sm text-gray-600 truncate">{car.brandName}</p>
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{car.seating_capacity}</span>
                </div>
                <div className="flex items-center">
                  <Fuel className="h-4 w-4 mr-1" />
                  <span>{car.vehicle_fuel_types[0]?.fuel_type.en || "N/A"}</span>
                </div>
              </div>
              <div className="text-lg font-bold">
                ${car.price}
                <span className="text-xs text-gray-600">/day</span>
              </div>
            </div>
            <Button size="sm" variant="outline" className="w-full mt-3">
              Show Details
            </Button>
          </div>
        </Link>
      ))}
    </div>
  )
}

