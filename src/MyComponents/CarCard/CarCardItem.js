"use client"

import { Heart, Calendar, Droplet, ChevronLeft, Gift, Users, Fuel, Zap, Cog } from "lucide-react"
import { Link } from "@/i18n/routing"
import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useLanguageContext } from "@/contexts/LanguageSwitcherContext"

const CarCardItem = ({ car, favorites, handleFavorite }) => {
  console.log("car", car)
  const { isEnglish } = useLanguageContext()
  const [isLiked, setIsLiked] = useState(false)

  const handleLikeClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setIsLiked(!isLiked)
  }

  // const truncateName = (name, maxLength = 20) => {
  //   if (name.length <= maxLength) return name
  //   return name.slice(0, maxLength) + "..."
  // }

  return (
  
    <Link href={`/car-details/${car?.name}`} className="block group">
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full">
        {/* Car Image */}
        <div className="relative w-full pt-[75%] overflow-hidden">
          <Image
            src={
              car.image_1920
                ? `data:image/png;base64,${car.image_1920}` // Base64 Image
                : "/default-car.jpg"
            }
            alt={isEnglish ? car.name : car.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            className="transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {/* <span className="absolute top-2 right-2 bg-brand-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
            {isEnglish ? car.name.en.condition : car.name.ar.condition}
          </span> */}
          {/* Like Button */}
          <button
            onClick={handleLikeClick}
            className="absolute top-2 left-2 bg-white rounded-full p-1.5 shadow-md z-10 hover:bg-gray-100 transition-colors"
          >
            <Heart className={cn("w-4 h-4", isLiked ? "fill-purple-500 text-purple-500" : "text-gray-600")} />
          </button>
          {/* {car.discount && (
            <div className="absolute bottom-2 left-2 bg-red-500 text-white rounded-full px-3 py-1 shadow-md z-10 flex items-center justify-center">
              <Gift className="w-4 h-4 mr-1" />
              <span className="text-xs font-bold">{car.name.en.discount}</span>
            </div>
          )} */}
        </div>

        {/* Car Details */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-semibold text-gray-800 truncate">
              {isEnglish ? car?.name : car.name}
            </h2>
            <div className="text-lg font-bold text-brand-primary">{car.list_price}</div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-3">
            {/* Year of Manufacture */}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{car.year_ids[0]?.name || "N/A"}</span>
            </div>

            {/* Fuel Type */}
            <div className="flex items-center gap-1">
              <Droplet className="w-4 h-4" />
              {/* <span>
                {isEnglish
                  ? car.vehicle_fuel_types[0]?.fuel_type.en || "N/A"
                  : car.vehicle_fuel_types[0]?.fuel_type.ar || "N/A"}
              </span> */}
            </div>

            {/* Transmission */}
            <div className="flex items-center gap-1">
              <Cog className="w-4 h-4" />
              {/* <span>{car.name.en.transmission || "N/A"}</span> */}
            </div>

            {/* Seating Capacity */}
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {/* <span>{car.seating_capacity || "N/A"} seats</span> */}
            </div>

            {/* Fuel Tank Capacity */}
            <div className="flex items-center gap-1">
              <Fuel className="w-4 h-4" />
              <span>
                {/* {isEnglish ? car.name.en.fuel_tank_capacity || "N/A" : car.name.ar.fuel_tank_capacity || "N/A"} */}
              </span>
            </div>

            {/* Power */}
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              {/* <span>{isEnglish ? car.name.en.power || "N/A" : car.name.ar.power || "N/A"}</span> */}
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
              {/* {isEnglish ? `${car.interestedPeople} interested` : `${car.interestedPeople} مهتم`} */}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CarCardItem

