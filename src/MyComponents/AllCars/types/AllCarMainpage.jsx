"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { CarGrid } from "../AllCarComponents/car-grid"
import { PromoSlider } from "../AllCarComponents/promo-slider"
import CarFilterSidebar from "./car-filter-sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import LoadingUi from "@/MyComponents/LoadingUi/LoadingUi"
import { useOdoo } from "@/contexts/OdooContext"
import { useLanguageContext } from "@/contexts/LanguageSwitcherContext"

const AllCarMainpage = () => {
  const { testData, loadingtestData, } = useOdoo();
  const { isEnglish } = useLanguageContext()
  const getAllData = testData
  ? isEnglish
    ? testData.en_US // English data
    : testData.ar_001 // Arabic data
  : null;

  console.log(getAllData)
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
    setLoading(true);
    if (getAllData) {
      setCars(getAllData);
      setLoading(false);
    }
  }, [getAllData]);

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
      if (
        car.current_market_value < filters.priceRange[0] ||
        car.current_market_value > filters.priceRange[1]
      )
        return false;
      
      if (filters.year && car.mfg_year.toString() !== filters.year.toString())
        return false;
      
      if (
        filters.fuelTypes.length > 0 &&
        !filters.fuelTypes.includes(car.vehicle_fuel_type_id?.name)
      )
        return false;
      
      const transmission = car.vehicle_specification_ids.find(
        (spec) => spec.display_name === "Transmission Type"
      )?.used;
      
      if (filters.transmission.length > 0 && !filters.transmission.includes(transmission))
        return false;
      
      const seatingCapacity = car.vehicle_specification_ids.find(
        (spec) => spec.display_name === "Seating Capacity"
      )?.used;
      
      if (filters.seats.length > 0 && !filters.seats.includes(seatingCapacity))
        return false;
      
      if (Object.keys(filters.brands).length > 0) {
        const carBrand = car.vehicle_brand_id?.name.toLowerCase();
        const selectedBrand = Object.keys(filters.brands).find(
          (brand) => brand.toLowerCase() === carBrand
        );
        
        if (!selectedBrand || (filters.brands[selectedBrand].length > 0 &&
          !filters.brands[selectedBrand].includes(car.name))) {
          return false;
        }
      }
      
      return true;
    });
  }, [cars, filters, isEnglish]);

  if (loading) {
    return (
      <LoadingUi/>
    )
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
              {/* <CarFilterSidebar onFilterChange={handleFilterChange} carModels={cars} filters={filters} /> */}
            </div>
          </div>
          <div className="flex-1 " >
            <PromoSlider />
            <CarGrid loading={loading} cars={filteredCars} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllCarMainpage
