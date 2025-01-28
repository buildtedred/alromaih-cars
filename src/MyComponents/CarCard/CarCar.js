"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, Calendar, Droplet, ChevronLeft, Gift } from "lucide-react"
import { useBrands } from "@/contexts/AllDataProvider"
import "react-loading-skeleton/dist/skeleton.css"
import { Skeleton } from "@/components/ui/skeleton"

const CarCard = () => {
  const { brands, loading, error } = useBrands()
  const [favorites, setFavorites] = useState([])

  const handleFavorite = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites((prev) => (prev.includes(id) ? prev.filter((carId) => carId !== id) : [...prev, id]))
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-8 lg:px-[5rem]">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">مجموعة سياراتنا</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch justify-items-center">
          {Array(6)
            .fill()
            .map((_, index) => (
              <div key={index} className="relative bg-white rounded-lg overflow-hidden shadow-lg w-full max-w-[400px]">
                <div className="p-1 rtl">
                  <div className="flex flex-col space-y-3">
                    <Skeleton className="h-[200px] w-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="rounded-full h-6 w-6" />
                        <Skeleton className="rounded-full h-6 w-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    )
  }

  if (error) return <p>Error: {error}</p>

  return (
    <div className="container mx-auto px-4 sm:px-8 lg:px-[5rem]">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">مجموعة سياراتنا</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch justify-items-center">
        {brands?.data?.map((brand) =>
          brand.car_models?.map((car) => (
            <Link key={car.id} href={`car-details/${car.name.en.slug}`} className="block w-full max-w-[400px]">
              <div className="relative bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group h-full">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={car.image_url ? `https://xn--mgbml9eg4a.com${car.image_url}` : "/default-car.jpg"}
                    alt={car.name || "Car image"}
                    fill
                    objectFit="cover"
                    className="transition-transform duration-300 ease-in-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <span className="absolute top-4 right-4 bg-brand-primary text-white px-3 py-1 rounded-full text-sm">
                    {car.name.en.condition}
                  </span>
                  <button
                    className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100 transition-colors"
                    onClick={(e) => handleFavorite(e, car.id)}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites.includes(car.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                      }`}
                    />
                  </button>
                  {car.discount && (
                    <div className="absolute bottom-4 left-4 bg-red-500 text-white rounded-full p-2 shadow-md z-10 flex items-center justify-center">
                      <Gift className="w-4 h-4" />
                      <span className="text-xs font-bold ml-1">{car.name.en.discount}</span>
                    </div>
                  )}
                </div>
                <div className="p-5 rtl">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold">{car.name.en.name}</h2>
                    <div className="text-xl font-bold text-brand-primary">{car.price}</div>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">{car.monthlyInstallment}</div>
                  <div className="flex justify-between items-center mb-4 text-sm text-brand-primary">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{car.year_of_manufacture}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-brand-primary">{car.name.en.condition}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplet className="w-4 h-4" />
                      <span>{car.name.en.fuel_consumption}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <button
                      className="text-brand-primary hover:text-brand-dark text-sm flex items-center gap-1 transition-colors duration-300"
                      onClick={(e) => e.preventDefault()}
                    >
                      View details
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="text-sm text-brand-primary">{car.interestedPeople} people are interested</div>
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

