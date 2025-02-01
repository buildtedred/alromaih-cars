"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { CarGrid } from "../AllCarComponents/car-grid"
import { PromoSlider } from "../AllCarComponents/promo-slider"
import CarFilterSidebar from "./car-filter-sidebar"

const AllCarMainpage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [filters, setFilters] = useState({
    priceRange: [0, 5000000],
    brands: {},
    year: "",
    fuelTypes: [],
    transmission: [],
    seats: [],
  })
  const [sortOption, setSortOption] = useState("relevance")
  const [currentPage, setCurrentPage] = useState(1)
  const [carsPerPage] = useState(9)
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true)
      try {
        const response = await fetch("https://xn--mgbml9eg4a.com/api/car_models")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (data.status === "success") {
          setCars(data.data)
        } else {
          throw new Error("Failed to fetch car data: " + data.message)
        }
      } catch (error) {
        setError("Error fetching car data: " + error.message)
        console.error("Error fetching car data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [])

  useEffect(() => {
    console.log("Cars updated:", cars)
  }, [cars])

  const handleFilterChange = useCallback((updatedFilters) => {
    console.log("Updating filters:", updatedFilters)
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...updatedFilters,
      year: updatedFilters.year ? updatedFilters.year.toString() : "",
    }))
    setCurrentPage(1)
  }, [])

  const clearAllFilters = () => {
    setFilters({
      priceRange: [0, 5000000],
      brands: {},
      year: "",
      fuelTypes: [],
      transmission: [],
      seats: [],
    })
    setCurrentPage(1)
  }

  const handleSortChange = (option) => {
    setSortOption(option)
  }

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      if (car.price < filters.priceRange[0] || car.price > filters.priceRange[1]) return false
      if (filters.year && car.year_of_manufacture.toString() !== filters.year.toString()) return false
      if (
        filters.fuelTypes.length > 0 &&
        !car.vehicle_fuel_types.some((fuel) => filters.fuelTypes.includes(fuel.fuel_type.en))
      )
        return false
      if (filters.transmission.length > 0 && !filters.transmission.includes(car.name.en.transmission)) return false
      if (filters.seats.length > 0 && !filters.seats.includes(car.seating_capacity)) return false
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
      return true
    })
  }, [cars, filters])

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

  const currentCars = sortedCars.slice((currentPage - 1) * carsPerPage, currentPage * carsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

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

  useEffect(() => {
    console.log("Current filters:", filters)
    console.log("Filtered cars:", filteredCars)
  }, [filters, filteredCars])

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>
  }

  if (cars.length === 0) {
    return <div className="text-center mt-8">No cars found.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container m-auto md:px-[9rem] px-4 py-4">
        <div className="relative flex flex-col md:flex-row">
          <Button
            className="md:hidden mb-4 bg-[#71308A] hover:bg-[#71308A]/90 text-white"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? "Close Filters" : "Open Filters"}
          </Button>
          <div className={`md:w-80 md:mr-8 ${isSidebarOpen ? "block" : "hidden md:block"}`}>
            <div className="sticky top-20 max-h-[calc(100vh-.2rem)] ">
              <CarFilterSidebar onFilterChange={handleFilterChange} carModels={cars} filters={filters} />
            </div>
          </div>
          <div className="flex-1 " >
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
            <CarGrid cars={currentCars} />
            {sortedCars.length > carsPerPage && (
              <div className="mt-8 flex justify-center">
                {Array.from({ length: Math.ceil(sortedCars.length / carsPerPage) }, (_, i) => (
                  <Button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    className={`mx-1 ${
                      currentPage === i + 1
                        ? "bg-[#71308A] hover:bg-[#71308A]/90 text-white"
                        : "text-[#71308A] border-[#71308A] hover:bg-[#71308A] hover:text-white"
                    }`}
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

export default AllCarMainpage

