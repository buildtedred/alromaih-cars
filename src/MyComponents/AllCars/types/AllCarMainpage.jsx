"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { CarGrid } from "../AllCarComponents/car-grid"
import { PromoSlider } from "../AllCarComponents/promo-slider"
import CarFilterSidebar from "./car-filter-sidebar"
import LoadingUi from "@/MyComponents/LoadingUi/LoadingUi"

// Sample static data to replace API calls
const sampleCarsData = [
  {
    id: 1,
    name: "Toyota Camry",
    slug: "toyota-camry",
    mfg_year: 2022,
    current_market_value: 2500000,
    condition: "New",
    transmission: "Automatic",
    seat_capacity: 5,
    image_url: "/placeholder.svg?height=300&width=500",
    vehicle_brand_id: { id: 1, name: "Toyota" },
    vehicle_fuel_type_id: { id: 1, name: "Petrol" },
  },
  {
    id: 2,
    name: "Honda Civic",
    slug: "honda-civic",
    mfg_year: 2021,
    current_market_value: 2200000,
    condition: "Used",
    transmission: "Automatic",
    seat_capacity: 5,
    image_url: "/placeholder.svg?height=300&width=500",
    vehicle_brand_id: { id: 2, name: "Honda" },
    vehicle_fuel_type_id: { id: 1, name: "Petrol" },
  },
  {
    id: 3,
    name: "Hyundai Creta",
    slug: "hyundai-creta",
    mfg_year: 2023,
    current_market_value: 1800000,
    condition: "New",
    transmission: "Manual",
    seat_capacity: 5,
    image_url: "/placeholder.svg?height=300&width=500",
    vehicle_brand_id: { id: 3, name: "Hyundai" },
    vehicle_fuel_type_id: { id: 2, name: "Diesel" },
  },
  {
    id: 4,
    name: "Maruti Swift",
    slug: "maruti-swift",
    mfg_year: 2020,
    current_market_value: 800000,
    condition: "Used",
    transmission: "Manual",
    seat_capacity: 5,
    image_url: "/placeholder.svg?height=300&width=500",
    vehicle_brand_id: { id: 4, name: "Maruti" },
    vehicle_fuel_type_id: { id: 1, name: "Petrol" },
  },
  {
    id: 5,
    name: "Tata Nexon",
    slug: "tata-nexon",
    mfg_year: 2022,
    current_market_value: 1200000,
    condition: "New",
    transmission: "Automatic",
    seat_capacity: 5,
    image_url: "/placeholder.svg?height=300&width=500",
    vehicle_brand_id: { id: 5, name: "Tata" },
    vehicle_fuel_type_id: { id: 3, name: "Electric" },
  },
  {
    id: 6,
    name: "Mahindra XUV700",
    slug: "mahindra-xuv700",
    mfg_year: 2023,
    current_market_value: 2800000,
    condition: "New",
    transmission: "Automatic",
    seat_capacity: 7,
    image_url: "/placeholder.svg?height=300&width=500",
    vehicle_brand_id: { id: 6, name: "Mahindra" },
    vehicle_fuel_type_id: { id: 2, name: "Diesel" },
  },
]

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
  const [language, setLanguage] = useState("en") // Default language

  // Simulate API call with static data
  useEffect(() => {
    setLoading(true)
    // Simulate API delay
    const timer = setTimeout(() => {
      setCars(sampleCarsData)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

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
      // Price range filter
      if (car.current_market_value < filters.priceRange[0] || car.current_market_value > filters.priceRange[1])
        return false

      // Year filter
      if (filters.year && car.mfg_year.toString() !== filters.year.toString()) return false

      // Fuel type filter
      if (filters.fuelTypes.length > 0 && !filters.fuelTypes.includes(car.vehicle_fuel_type_id?.name)) return false

      // Transmission filter
      if (filters.transmission.length > 0 && !filters.transmission.includes(car.transmission)) return false

      // Seats filter
      if (filters.seats.length > 0 && !filters.seats.includes(car.seat_capacity.toString())) return false

      // Brand and model filter
      if (Object.keys(filters.brands).length > 0) {
        const carBrand = car.vehicle_brand_id?.name.toLowerCase()
        const selectedBrand = Object.keys(filters.brands).find((brand) => brand.toLowerCase() === carBrand)

        if (
          !selectedBrand ||
          (filters.brands[selectedBrand].length > 0 && !filters.brands[selectedBrand].includes(car.name))
        ) {
          return false
        }
      }

      return true
    })
  }, [cars, filters])

  if (loading) {
    return <LoadingUi />
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
              <CarFilterSidebar
                onFilterChange={handleFilterChange}
                carModels={cars}
                filters={filters}
                language={language}
              />
            </div>
          </div>
          <div className="flex-1 ">
            <PromoSlider />
            <CarGrid loading={loading} cars={filteredCars} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllCarMainpage

