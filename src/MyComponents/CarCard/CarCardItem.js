"use client"

import { Heart, Calendar, Droplet, ChevronLeft, Users, Fuel, Zap, Cog } from "lucide-react"
import { Link } from "@/i18n/routing"
import Image from "next/image"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useLanguageContext } from "@/contexts/LanguageSwitcherContext"

const CarCardItem = ({ car, favorites, handleFavorite }) => {
  const { isEnglish } = useLanguageContext()
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    // Set initial like state based on favorites prop
    if (favorites && favorites.includes(car?.id)) {
      setIsLiked(true)
    }
  }, [favorites, car?.id])

  const handleLikeClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setIsLiked(!isLiked)
    if (handleFavorite) {
      handleFavorite(car?.id)
    }
  }

  // Format price with currency
  const formatPrice = (price) => {
    if (!price) return "N/A"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Handle nested brand and model objects
  const getModelName = () => {
    if (car?.model?.name) {
      return car.model.name
    }
    return car?.model || "N/A"
  }

  const getBrandName = () => {
    if (car?.brand?.name) {
      return car.brand.name
    }
    return car?.brand || ""
  }

  // Get fuel tank capacity from specifications if available
  const getFuelTankCapacity = () => {
    if (car?.specifications?.fuel_tank_capacity) {
      return `${car.specifications.fuel_tank_capacity}L`
    }
    return "N/A"
  }

  return (
    <Link href={`/car-details/${car?.id}`} className="block group">
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full">
        {/* Car Image */}
        <div className="relative w-full pt-[75%] overflow-hidden">
          <Image
            src={
              car.image
                ? `${car.image}` // Base64 Image
                : "/default-car.jpg"
            }
            alt={`${getBrandName()} ${getModelName()}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            className="transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Condition badge if available */}
          {car.condition && (
            <span className="absolute top-2 right-2 bg-brand-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
              {car.condition}
            </span>
          )}

          {/* Like Button */}
          <button
            onClick={handleLikeClick}
            className="absolute top-2 left-2 bg-white rounded-full p-1.5 shadow-md z-10 hover:bg-gray-100 transition-colors"
          >
            <Heart className={cn("w-4 h-4", isLiked ? "fill-purple-500 text-purple-500" : "text-gray-600")} />
          </button>

          {/* Brand logo if available */}
          {car.brand?.image && (
            <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md z-10">
              <Image
                src={car.brand.image || "/placeholder.svg"}
                alt={getBrandName()}
                width={24}
                height={24}
                className="rounded-full"
              />
            </div>
          )}
        </div>

        {/* Car Details */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 truncate">
                {getBrandName()} {getModelName()}
              </h2>
              {car.year && <p className="text-xs text-gray-500">{car.year}</p>}
            </div>
            <div className="text-lg font-bold text-brand-primary">{formatPrice(car.price)}</div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-3">
            {/* Year of Manufacture */}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{car.manufacture || car.year || "N/A"}</span>
            </div>

            {/* Fuel Type */}
            <div className="flex items-center gap-1">
              <Droplet className="w-4 h-4" />
              <span>{car?.fuelType || car?.specifications?.fuel_type || "N/A"}</span>
            </div>

            {/* Transmission */}
            <div className="flex items-center gap-1">
              <Cog className="w-4 h-4" />
              <span>{car?.transmission || "N/A"}</span>
            </div>

            {/* Seating Capacity */}
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{car?.seat || "N/A"} seats</span>
            </div>

            {/* Fuel Tank Capacity */}
            <div className="flex items-center gap-1">
              <Fuel className="w-4 h-4" />
              <span>{getFuelTankCapacity()}</span>
            </div>

            {/* Power */}
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span>{car?.power || "N/A"}</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <button
              className="text-brand-primary hover:text-brand-dark text-xs sm:text-sm flex items-center gap-1 transition-colors duration-300 whitespace-nowrap"
              onClick={(e) => e.preventDefault()}
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 rtl:rotate-180" />
              <span className="truncate">{isEnglish ? "View details" : "عرض التفاصيل"}</span>
            </button>
            <div className="text-xs text-brand-primary whitespace-nowrap ml-2">
              {car.views && <span>{isEnglish ? `${car.views} views` : `${car.views} مشاهدة`}</span>}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CarCardItem

