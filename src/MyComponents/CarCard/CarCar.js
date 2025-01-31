"use client"

import { useState } from "react"
import { Heart, Calendar, Droplet, ChevronLeft, Gift } from "lucide-react"
import { useBrands } from "@/contexts/AllDataProvider"
import "react-loading-skeleton/dist/skeleton.css"
import { Skeleton } from "@/components/ui/skeleton"
import { Link } from "@/i18n/routing"
import Image from "next/image"
import { usePathname } from "next/navigation"

const CarCard = () => {
  const pathname = usePathname()
  const { brands, loading, error } = useBrands()
  const [favorites, setFavorites] = useState([])

  const handleFavorite = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites((prev) => (prev.includes(id) ? prev.filter((carId) => carId !== id) : [...prev, id]))
  }

  if (loading) {
    return (
      <div className="max-w-[calc(100%-18rem)] mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">مجموعة سياراتنا</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill()
            .map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    )
  }

  if (error) return <p className="text-center text-red-500 text-xl mt-8">Error: {error}</p>

  const isEnglish = pathname.startsWith("/en")

  return (
    <div className="max-w-[calc(100%-10rem)] mx-auto  py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">مجموعة سياراتنا</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands?.data?.map((brand) =>
          brand.car_models?.map((car) => (
            <Link
              key={car.id}
              href={`/car-details/${isEnglish ? car.name.en.slug : car.name.ar.slug}`}
              className="block group"
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={car.image_url ? `https://xn--mgbml9eg4a.com${car.image_url}` : "/default-car.jpg"}
                    alt={car.name || "Car image"}
                    fill
                    objectFit="cover"
                    className="transition-transform duration-300 ease-in-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="absolute top-2 right-2 bg-brand-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {isEnglish ? car.name.en.condition : car.name.ar.condition}
                  </span>
                  <button
                    className="absolute top-2 left-2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100 transition-colors"
                    onClick={(e) => handleFavorite(e, car.id)}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites.includes(car.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                      }`}
                    />
                  </button>
                  {car.discount && (
                    <div className="absolute bottom-2 left-2 bg-red-500 text-white rounded-full px-3 py-1 shadow-md z-10 flex items-center justify-center">
                      <Gift className="w-4 h-4 mr-1" />
                      <span className="text-xs font-bold">{car.name.en.discount}</span>
                    </div>
                  )}
                </div>
                <div className="p-4 rtl">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-semibold text-gray-800 truncate">
                      {isEnglish ? car.name.en.name : car.name.ar.name}
                    </h2>
                    <div className="text-lg font-bold text-brand-primary">{car.price}</div>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">{car.monthlyInstallment}</div>
                  <div className="flex justify-between items-center mb-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{car.year_of_manufacture}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-brand-primary">{car.name.en.condition}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Droplet className="w-4 h-4" />
                      <span>{car.name.en.fuel_consumption}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <button
                      className="text-brand-primary hover:text-brand-dark text-sm flex items-center gap-1 transition-colors duration-300"
                      onClick={(e) => e.preventDefault()}
                    >
                      <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                      {isEnglish ? "View details" : "عرض التفاصيل"}
                    </button>
                    <div className="text-xs text-brand-primary">
                      {isEnglish ? `${car.interestedPeople} interested` : `${car.interestedPeople} مهتم`}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )),
        )}
      </div>
    </div>
  )
}

export default CarCard

