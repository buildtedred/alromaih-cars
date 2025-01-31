"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import CarFilterSidebar from "./car-filter-sidebar"
import { CarGrid } from "./components/car-grid"
import { PromoSlider } from "./components/promo-slider"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export default function Page() {
  const [sortOption, setSortOption] = useState("relevance")
  const [filters, setFilters] = useState({
    priceRange: [0, 1000000],
    brands: {},
    year: "",
    fuelTypes: [],
    transmission: [],
    seats: [],
  })
  const [carModels, setCarModels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [carsPerPage] = useState(12)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const fetchCarModels = async () => {
      setLoading(true)
      try {
        const response = await fetch("https://xn--mgbml9eg4a.com/api/car_models")
        const result = await response.json()
        if (result.status === "success") {
          setCarModels(result.data)
        } else {
          throw new Error("Failed to fetch car models")
        }
      } catch (error) {
        setError("Error fetching car models")
        console.error("Error fetching car models:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCarModels()
  }, [])

  const filteredCars = useMemo(() => {
    return carModels.filter((car) => {
      if (car.price < filters.priceRange[0] || car.price > filters.priceRange[1]) return false

      if (Object.keys(filters.brands).length > 0) {
        const carBrand = Object.keys(filters.brands).find(
          (brand) => brand.toLowerCase() === car.brand_name.en.toLowerCase(),
        )
        if (
          !carBrand ||
          (filters.brands[carBrand].length > 0 && !filters.brands[carBrand].includes(car.name.en.name))
        ) {
          return false
        }
      }

      if (filters.year && car.year_of_manufacture.toString() !== filters.year.toString()) return false
      if (
        filters.fuelTypes.length > 0 &&
        !car.vehicle_fuel_types.some((fuel) => filters.fuelTypes.includes(fuel.fuel_type.en))
      )
        return false
      if (filters.transmission.length > 0 && !filters.transmission.includes(car.name.en.transmission)) return false
      if (filters.seats.length > 0 && !filters.seats.includes(car.seating_capacity)) return false

      return true
    })
  }, [carModels, filters])

  const sortedCars = useMemo(() => {
    return [...filteredCars].sort((a, b) => {
      switch (sortOption) {
        case "price_low_to_high":
          return a.price - b.price
        case "price_high_to_low":
          return b.price - a.price
        case "year_newest_first":
          return b.year_of_manufacture - a.year_of_manufacture
        default:
          return 0
      }
    })
  }, [filteredCars, sortOption])

  const indexOfLastCar = currentPage * carsPerPage
  const indexOfFirstCar = indexOfLastCar - carsPerPage
  const currentCars = sortedCars.slice(indexOfFirstCar, indexOfLastCar)

  const paginate = useCallback((pageNumber) => {
    setCurrentPage(pageNumber)
  }, [])

  const handleSortChange = useCallback((newSortOption) => {
    setSortOption(newSortOption)
  }, [])

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
      year: newFilters.year ? Number(newFilters.year) : "",
    }))
    setCurrentPage(1)
  }, [])

  const clearAllFilters = useCallback(() => {
    setFilters({
      priceRange: [0, 1000000],
      brands: {},
      year: "",
      fuelTypes: [],
      transmission: [],
      seats: [],
    })
    setCurrentPage(1)
  }, [])

  const appliedFiltersCount = useMemo(() => {
    return Object.values(filters).reduce((count, filter) => {
      if (Array.isArray(filter)) {
        return count + (filter.length > 0 ? 1 : 0)
      }
      if (typeof filter === "object") {
        return count + (Object.keys(filter).length > 0 ? 1 : 0)
      }
      return count + (filter ? 1 : 0)
    }, 0)
  }, [filters])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-4">
        <div className="relative flex flex-col md:flex-row">
          <Button className="md:hidden mb-4" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? "Close Filters" : "Open Filters"}
          </Button>
          <div className={`md:w-80 md:mr-8 ${isSidebarOpen ? "block" : "hidden md:block"}`}>
            <CarFilterSidebar onFilterChange={handleFilterChange} carModels={carModels} filters={filters} />
          </div>
          <div className="flex-1">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                <span className="text-[#71308A]">{filteredCars.length}</span> Cars
              </h2>
              <div className="flex items-center space-x-4">
                {appliedFiltersCount > 0 && (
                  <Button variant="outline" onClick={clearAllFilters}>
                    Clear All Filters <X className="ml-2 h-4 w-4" />
                  </Button>
                )}
                <select
                  className="border rounded p-2"
                  value={sortOption}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option value="relevance">Relevance</option>
                  <option value="price_low_to_high">Price: Low to High</option>
                  <option value="price_high_to_low">Price: High to Low</option>
                  <option value="year_newest_first">Year: Newest First</option>
                </select>
              </div>
            </div>
            <PromoSlider />
            <CarGrid cars={currentCars} loading={loading} error={error} />
            {!loading && !error && (
              <div className="mt-8 flex justify-center">
                {Array.from({ length: Math.ceil(sortedCars.length / carsPerPage) }, (_, i) => (
                  <Button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    className="mx-1"
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

