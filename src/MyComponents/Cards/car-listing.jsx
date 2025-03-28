"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import CarCard from "./CarCard.js"
import carsData from "@/app/api/mock-data"

export default function CarListing() {
  const pathname = usePathname()
  const currentLocale = pathname.startsWith("/ar") ? "ar" : "en"
  const isRTL = currentLocale === "ar"
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState({})

  useEffect(() => {
    // Fetch cars data
    const fetchData = () => {
      setLoading(true)
      // Use the imported carsData directly
      setCars(carsData)
      setLoading(false)
    }

    fetchData()
  }, [])

  const handleFavoriteToggle = (carId) => {
    setFavorites(prev => ({
      ...prev,
      [carId]: !prev[carId]
    }))
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="px-4 md:px-4 lg:px-[7rem]">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="flex justify-center w-full">
              <CarCard 
                car={car} 
                locale={currentLocale} 
                onFavoriteToggle={handleFavoriteToggle}
                isFavorite={favorites[car.id]}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
