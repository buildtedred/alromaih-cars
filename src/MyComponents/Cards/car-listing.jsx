"use client"

import { useState, useEffect } from "react"
import CarCard from "./CarCard"
import { fetchCars } from "@/app/api/mock-data.js"
import { usePathname } from "next/navigation"

const CarListing = () => {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState([])
  const pathname = usePathname()
  // Detect language from URL path
  const currentLocale = pathname.startsWith("/ar") ? "ar" : "en"

  // Fetch cars data
  useEffect(() => {
    const getCars = async () => {
      setLoading(true)
      try {
        const carsData = await fetchCars()
        setCars(carsData)
      } catch (error) {
        console.error("Error fetching cars:", error)
      } finally {
        setLoading(false)
      }
    }

    getCars()
  }, [])

  // Handle favorite toggle
  const handleFavoriteToggle = (carId) => {
    setFavorites((prev) => (prev.includes(carId) ? prev.filter((id) => id !== carId) : [...prev, carId]))
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[400px] bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div dir={currentLocale === "ar" ? "rtl" : "ltr"} className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cars.map((car) => (
          <CarCard
            key={car.id}
            car={car}
            onFavoriteToggle={handleFavoriteToggle}
            isFavorite={favorites.includes(car.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default CarListing

