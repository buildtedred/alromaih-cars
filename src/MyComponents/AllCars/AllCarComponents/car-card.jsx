"use client"

import { useState } from "react"
import { Heart, Calendar, Droplet, ChevronLeft } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import Link from "next/link"
import LoadingUi from "@/MyComponents/LoadingUi/LoadingUi"

export function CarCard({ car, loading }) {
  const [isLiked, setIsLiked] = useState(false)

  const handleLikeClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setIsLiked(!isLiked)
  }

  if (loading) {
    return <LoadingUi />
  }

  return (
    <Link href={`/car-details/${car.slug || car.id}`} className="block w-full h-full">
      <div className="relative bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group h-full w-full flex flex-col">
        {/* Image Section */}
        <div className="relative h-0 pb-[56.25%] overflow-hidden">
          <Image
            src={car.image_url || "/placeholder.svg?height=300&width=500"}
            alt={`${car.mfg_year} ${car.vehicle_brand_id?.name} ${car.name}`}
            fill
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

          {/* New Badge in Upper Corner */}
          <span className="absolute top-2 right-2 bg-[#71308A] text-white px-2 py-1 rounded-full text-xs font-semibold">
            {car.condition || "Used"}
          </span>

          {/* Like Button */}
          <button
            onClick={handleLikeClick}
            className="absolute top-2 left-2 bg-white rounded-full p-1.5 shadow-md z-10 hover:bg-gray-100 transition-colors"
          >
            <Heart className={cn("w-4 h-4", isLiked ? "fill-purple-500 text-purple-500" : "text-gray-600")} />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col justify-between flex-grow">
          {/* Title and Price */}
          <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
            <h2 className="text-base font-semibold truncate mb-1 sm:mb-0 sm:mr-2">{car.name}</h2>
            <div className="text-base font-bold text-[#71308A] whitespace-nowrap">
              ₹{car.current_market_value?.toLocaleString() || "N/A"}
            </div>
          </div>

          {/* Car Details */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{car.mfg_year || "N/A"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Droplet className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{car.vehicle_fuel_type_id?.name || "N/A"}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0"
              >
                <path d="M12 2v2" />
                <path d="M12 14v2" />
                <path d="M12 18v2" />
                <path d="M8 6h8v3a4 4 0 0 1-8 0V6z" />
                <path d="M12 22c-4 0-7-3-7-7V5h14v10c0 4-3 7-7 7z" />
              </svg>
              <span className="truncate">{car.transmission || "N/A"}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0"
              >
                <path d="M12 20s-8-2.2-8-10V5l8-3 8 3v5c0 7.8-8 10-8 10z" />
                <path d="M12 20V10" />
              </svg>
              <span className="truncate">{car.seat_capacity || "N/A"} seats</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-2 border-t mt-auto">
            <button className="text-[#71308A] hover:text-[#5a2670] text-sm flex items-center gap-1 transition-colors duration-300">
              <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              <span className="truncate">View details</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

