"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import carsData from "@/app/api/mock-data" // Import your existing mock data
import LoadingUi from "@/MyComponents/LoadingUi/LoadingUi"
import { Search, ChevronDown, ChevronUp } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { PromoSlider } from "../AllCarComponents/promo-slider"
import { RangeSlider } from "../AllCarComponents/range-slider"
import { CarGrid } from "../AllCarComponents/car-grid"

// Update the scrollbarStyles to use the exact hex color from Tailwind config
const scrollbarStyles = `
/* Hide default scrollbar */
.custom-scrollbar-container {
  scrollbar-width: thin;
  scrollbar-color: #46194F transparent;
}
.custom-scrollbar-container::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar-container::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar-container::-webkit-scrollbar-thumb {
  background-color: #46194F;
  border-radius: 4px;
}
.flex-1.overflow-hidden.relative {
  overflow: hidden !important;
}
.h-screen {
  overflow: hidden !important;
}

/* Animation keyframes */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out forwards;
}
`

// Fixed CarFilterSidebar component with working checkboxes
const CarFilterSidebar = ({ onFilterChange, filters, language, cars }) => {
  const [expandedBrands, setExpandedBrands] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  // Get max price for range slider
  const maxPrice = useMemo(() => {
    return Math.max(...cars.map((car) => car.cashPrice)) + 100000
  }, [cars])

  // Get all unique brands
  const brands = useMemo(() => {
    return [...new Set(cars.map((car) => car.brand))]
  }, [cars])

  // Get models by brand
  const modelsByBrand = useMemo(() => {
    const models = {}
    brands.forEach((brand) => {
      models[brand] = cars
        .filter((car) => car.brand === brand)
        .map((car) => {
          const modelName = typeof car.name === "object" ? car.name[language] || car.name.en : car.name
          return { id: car.id, name: modelName }
        })
    })
    return models
  }, [cars, brands, language])

  // Filter brands based on search term
  const filteredBrands = useMemo(() => {
    if (!searchTerm) return brands
    return brands.filter(
      (brand) =>
        brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        modelsByBrand[brand]?.some((model) => model.name.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [brands, modelsByBrand, searchTerm])

  const toggleBrand = (brand) => {
    setExpandedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
  }

  // Check if all models of a brand are selected
  const areAllModelsSelected = useCallback(
    (brand) => {
      const brandModels = modelsByBrand[brand] || []
      if (brandModels.length === 0) return false

      return brandModels.every((model) => filters.selectedModels?.includes(model.id))
    },
    [filters.selectedModels, modelsByBrand],
  )

  // Handle brand checkbox change
  const handleBrandCheck = useCallback(
    (brand, checked) => {
      const brandModels = modelsByBrand[brand] || []
      const modelIds = brandModels.map((model) => model.id)

      let updatedModels = [...(filters.selectedModels || [])]

      if (checked) {
        // Add all models of this brand that aren't already selected
        modelIds.forEach((id) => {
          if (!updatedModels.includes(id)) {
            updatedModels.push(id)
          }
        })
      } else {
        // Remove all models of this brand
        updatedModels = updatedModels.filter((id) => !modelIds.includes(id))
      }

      onFilterChange({ selectedModels: updatedModels })
    },
    [filters.selectedModels, modelsByBrand, onFilterChange],
  )

  // Handle model checkbox change
  const handleModelCheck = useCallback(
    (modelId, checked) => {
      let updatedModels = [...(filters.selectedModels || [])]

      if (checked) {
        if (!updatedModels.includes(modelId)) {
          updatedModels.push(modelId)
        }
      } else {
        updatedModels = updatedModels.filter((id) => id !== modelId)
      }

      onFilterChange({ selectedModels: updatedModels })
    },
    [filters.selectedModels, onFilterChange],
  )

  const formatPrice = (price) => {
    return language === "ar" ? `${price.toLocaleString()} ريال` : `₹ ${price.toLocaleString()}`
  }

  // Update the handleYearChange function to toggle selection
  const handleYearChange = (year) => {
    // If the year is already selected, unselect it by setting to empty string
    // Otherwise, select the year
    onFilterChange({ year: filters.year === year.toString() ? "" : year.toString() })
  }

  const handleFuelTypeChange = (fuelType, checked) => {
    let updatedFuelTypes = Array.isArray(filters.fuelTypes) ? [...filters.fuelTypes] : []

    if (checked) {
      if (!updatedFuelTypes.includes(fuelType)) {
        updatedFuelTypes.push(fuelType)
      }
    } else {
      updatedFuelTypes = updatedFuelTypes.filter((type) => type !== fuelType)
    }

    onFilterChange({ fuelTypes: updatedFuelTypes })
  }

  const handleTransmissionChange = (transmission, checked) => {
    let updatedTransmission = Array.isArray(filters.transmission) ? [...filters.transmission] : []

    if (checked) {
      if (!updatedTransmission.includes(transmission)) {
        updatedTransmission.push(transmission)
      }
    } else {
      updatedTransmission = updatedTransmission.filter((trans) => trans !== transmission)
    }

    onFilterChange({ transmission: updatedTransmission })
  }

  const handleSeatChange = (seatOption, checked) => {
    let updatedSeats = filters.seats ? [...filters.seats] : []

    if (checked) {
      if (!updatedSeats.includes(seatOption)) {
        updatedSeats.push(seatOption)
      }
    } else {
      updatedSeats = updatedSeats.filter((seat) => seat !== seatOption)
    }

    onFilterChange({ seats: updatedSeats })
  }

  // Fixed: Improved range slider handling to ensure values are properly validated
  const handlePriceRangeChange = (newValue) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      // Ensure values are numbers and within range
      const validatedValue = [
        Math.max(0, Math.min(maxPrice, Number(newValue[0]) || 0)),
        Math.max(0, Math.min(maxPrice, Number(newValue[1]) || maxPrice)),
      ]
      console.log("Range slider value changed:", validatedValue)
      onFilterChange({ priceRange: validatedValue })
    }
  }

  return (
    <div className="bg-white rounded-[4px] shadow-md overflow-hidden flex flex-col h-full">
      {/* Fixed header */}
      <div className="p-4 border-b sticky top-0 bg-white z-10">
        <h3 className="text-xl font-bold text-brand-primary">{language === "ar" ? "الفلاتر" : "Filters"}</h3>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto custom-scrollbar-container">
        <div className="divide-y">
          {/* Price Range Section */}
          <div className="p-4 group cursor-pointer hover:bg-gray-50 rounded-[4px] transition-all duration-200">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-brand-primary text-lg">
                {language === "ar" ? "نطاق السعر" : "Price Range"}
              </h4>
              <ChevronDown className="h-5 w-5 text-brand-primary transition-transform duration-300" />
            </div>

            {/* Use the provided RangeSlider component */}
            <div className="transition-all duration-300 ease-in-out">
              <RangeSlider
                min={0}
                max={maxPrice}
                value={filters.priceRange}
                onValueChange={handlePriceRangeChange}
                onValueCommit={handlePriceRangeChange}
                step={10000}
                className="mb-2"
              />

              {/* Price range display */}
              <div className="flex justify-between text-sm text-brand-primary mt-4">
                <span>{formatPrice(filters.priceRange[0])}</span>
                <span>{formatPrice(filters.priceRange[1])}</span>
              </div>
            </div>
          </div>

          {/* Brands + Models Section */}
          <div className="p-4 group cursor-pointer hover:bg-gray-50 rounded-[4px] transition-all duration-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-brand-primary text-lg">
                {language === "ar" ? "الماركات + الموديلات" : "Brands + Models"}
              </h4>
              <ChevronDown className="h-5 w-5 text-brand-primary transition-transform duration-300" />
            </div>

            {/* Search box */}
            <div className="relative mb-4 transition-all duration-300 ease-in-out">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder={language === "ar" ? "ابحث عن الماركات والموديلات" : "Search brands and models"}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border rounded-[4px] focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
            </div>

            {/* Brand list */}
            <div className="space-y-1 transition-all duration-300 ease-in-out">
              {filteredBrands.map((brand) => (
                <div key={brand} className="border-b pb-2">
                  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-[4px]">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`brand-${brand}`}
                        checked={areAllModelsSelected(brand)}
                        onCheckedChange={(checked) => handleBrandCheck(brand, checked)}
                        className="rounded-[4px] border-brand-primary text-brand-primary focus:ring-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:text-white"
                      />
                      <Label htmlFor={`brand-${brand}`} className="text-sm font-medium leading-none cursor-pointer">
                        {brand}
                      </Label>
                    </div>
                    <button
                      onClick={() => toggleBrand(brand)}
                      className="transition-all duration-200 hover:bg-gray-100 p-1 rounded-full"
                    >
                      {expandedBrands.includes(brand) ? (
                        <ChevronUp className="h-4 w-4 text-brand-primary transition-transform duration-300" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-brand-primary transition-transform duration-300" />
                      )}
                    </button>
                  </div>

                  {/* Models under this brand (expandable) */}
                  {(expandedBrands.includes(brand) || searchTerm) && (
                    <div className="ml-8 mt-1 space-y-1 transition-all duration-300 ease-in-out">
                      {modelsByBrand[brand]?.map((model) => (
                        <div key={model.id} className="flex items-center gap-2 transition-opacity duration-200">
                          <Checkbox
                            id={`model-${model.id}`}
                            checked={filters.selectedModels?.includes(model.id)}
                            onCheckedChange={(checked) => handleModelCheck(model.id, checked)}
                            className="rounded-[4px] border-brand-primary text-brand-primary focus:ring-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:text-white"
                          />
                          <Label
                            htmlFor={`model-${model.id}`}
                            className="text-xs font-medium leading-none cursor-pointer"
                          >
                            {model.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Year Section */}
          <div className="p-4 group cursor-pointer hover:bg-gray-50 rounded-[4px] transition-all duration-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-brand-primary text-lg">{language === "ar" ? "السنة" : "Year"}</h4>
              <ChevronDown className="h-5 w-5 text-brand-primary transition-transform duration-300" />
            </div>

            {/* In the Year Section, update the button onClick handler to toggle selection */}
            <div className="space-y-3 transition-all duration-300 ease-in-out">
              {/* Extract unique years from cars data */}
              {[...new Set(cars.map((car) => car.specs.year))]
                .sort((a, b) => b - a) // Sort years in descending order
                .map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearChange(year)}
                    className="flex items-center focus:outline-none transition-all duration-200 hover:opacity-80"
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 border-brand-primary flex items-center justify-center transition-colors duration-200 ${
                        filters.year === year.toString() ? "bg-brand-primary" : "bg-white"
                      }`}
                    >
                      {filters.year === year.toString() && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <Label className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {year}
                    </Label>
                  </button>
                ))}
            </div>
          </div>

          {/* Fuel Type Section */}
          <div className="p-4 group cursor-pointer hover:bg-gray-50 rounded-[4px] transition-all duration-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-brand-primary text-lg">
                {language === "ar" ? "نوع الوقود" : "Fuel Type"}
              </h4>
              <ChevronDown className="h-5 w-5 text-brand-primary transition-transform duration-300" />
            </div>

            <div className="space-y-3 transition-all duration-300 ease-in-out">
              {/* Extract unique fuel types from cars data */}
              {[
                ...new Set(
                  cars.map((car) => {
                    // Handle both object and string fuel types
                    return typeof car.specs.fuelType === "object"
                      ? car.specs.fuelType[language] || car.specs.fuelType.en
                      : car.specs.fuelType
                  }),
                ),
              ]
                .filter(Boolean) // Remove any undefined or null values
                .map((fuelType) => (
                  <div key={fuelType} className="flex items-center space-x-2">
                    <Checkbox
                      id={`fuel-${fuelType}`}
                      checked={Array.isArray(filters.fuelTypes) && filters.fuelTypes.includes(fuelType)}
                      onCheckedChange={(checked) => handleFuelTypeChange(fuelType, checked)}
                      className="rounded-[4px] border-brand-primary text-brand-primary focus:ring-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:text-white"
                    />
                    <Label htmlFor={`fuel-${fuelType}`} className="text-sm font-medium leading-none cursor-pointer">
                      {fuelType}
                    </Label>
                  </div>
                ))}
            </div>
          </div>

          {/* Transmission Section */}
          <div className="p-4 group cursor-pointer hover:bg-gray-50 rounded-[4px] transition-all duration-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-brand-primary text-lg">
                {language === "ar" ? "ناقل الحركة" : "Transmission"}
              </h4>
              <ChevronDown className="h-5 w-5 text-brand-primary transition-transform duration-300" />
            </div>

            <div className="space-y-3 transition-all duration-300 ease-in-out">
              {/* Extract unique transmission types from cars data */}
              {[
                ...new Set(
                  cars.map((car) => {
                    // Handle both object and string transmission types
                    return typeof car.specs.transmission === "object"
                      ? car.specs.transmission[language] || car.specs.transmission.en
                      : car.specs.transmission
                  }),
                ),
              ]
                .filter(Boolean) // Remove any undefined or null values
                .map((transmission) => (
                  <div key={transmission} className="flex items-center space-x-2">
                    <Checkbox
                      id={`transmission-${transmission}`}
                      checked={Array.isArray(filters.transmission) && filters.transmission.includes(transmission)}
                      onCheckedChange={(checked) => handleTransmissionChange(transmission, checked)}
                      className="rounded-[4px] border-brand-primary text-brand-primary focus:ring-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:text-white"
                    />
                    <Label
                      htmlFor={`transmission-${transmission}`}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {transmission}
                    </Label>
                  </div>
                ))}
            </div>
          </div>

          {/* Seats Section */}
          <div className="p-4 group cursor-pointer hover:bg-gray-50 rounded-[4px] transition-all duration-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-brand-primary text-lg">{language === "ar" ? "المقاعد" : "Seats"}</h4>
              <ChevronDown className="h-5 w-5 text-brand-primary transition-transform duration-300" />
            </div>

            <div className="space-y-3 transition-all duration-300 ease-in-out">
              {/* Extract unique seat options from cars data */}
              {[
                ...new Set(
                  cars.map((car) => {
                    // Handle both object and string seats types
                    return typeof car.specs.seats === "object"
                      ? car.specs.seats[language] || car.specs.seats.en
                      : car.specs.seats
                  }),
                ),
              ]
                .filter(Boolean) // Remove any undefined or null values
                .map((seatOption) => (
                  <div key={seatOption} className="flex items-center space-x-2">
                    <Checkbox
                      id={`seats-${seatOption}`}
                      checked={filters.seats?.includes(seatOption)}
                      onCheckedChange={(checked) => handleSeatChange(seatOption, checked)}
                      className="rounded-[4px] border-brand-primary text-brand-primary focus:ring-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:text-white"
                    />
                    <Label htmlFor={`seats-${seatOption}`} className="text-sm font-medium leading-none cursor-pointer">
                      {seatOption}
                    </Label>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed footer */}
      <div className="p-4 border-t sticky bottom-0 bg-white z-10">
        <Button
          onClick={() => {
            // Fixed: Improved reset functionality to ensure all filters are properly reset
            const resetFilters = {
              priceRange: [0, maxPrice],
              selectedModels: [],
              year: "",
              fuelTypes: [],
              transmission: [],
              seats: [],
            }
            console.log("Resetting filters to:", resetFilters)
            onFilterChange(resetFilters)
          }}
          variant="outline"
          className="w-full border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white rounded-[4px]"
        >
          {language === "ar" ? "إعادة تعيين الفلاتر" : "Clear All Filters"}
        </Button>
      </div>
    </div>
  )
}

const AllCarMainpage = () => {
  const pathname = usePathname()
  const currentLocale = pathname?.startsWith("/ar") ? "ar" : "en"

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [filters, setFilters] = useState({
    priceRange: [0, 250000],
    selectedModels: [], // Changed from brands object to selectedModels array
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

  // Use your existing mock data
  useEffect(() => {
    setLoading(true)
    // Simulate API delay
    const timer = setTimeout(() => {
      setCars(carsData)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleFilterChange = useCallback((updatedFilters) => {
    console.log("Updating filters:", updatedFilters)
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...updatedFilters,
    }))
    setCurrentPage(1)
  }, [])

  // Fixed: Improved clearAllFilters function to properly reset all filters
  const clearAllFilters = useCallback(() => {
    // Find the maximum price from the cars data
    const maxCarPrice = Math.max(...cars.map((car) => car.cashPrice || 0), 250000)

    // Define the cleared filters with the same structure as the initial state
    const clearedFilters = {
      priceRange: [0, maxCarPrice],
      selectedModels: [],
      year: "",
      fuelTypes: [],
      transmission: [],
      seats: [],
    }

    console.log("Clearing all filters:", clearedFilters)

    // Update the filters state
    setFilters(clearedFilters)

    // Reset to the first page
    setCurrentPage(1)
  }, [cars])

  const handleSortChange = (option) => {
    setSortOption(option)
  }

  // Fixed: Improved filteredCars function to properly handle price range filtering
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      try {
        // Price range filter - make sure we have valid numbers
        const minPrice = Number(filters.priceRange[0]) || 0
        const maxPrice = Number(filters.priceRange[1]) || Number.MAX_SAFE_INTEGER
        const carPrice = Number(car.cashPrice) || 0

        if (carPrice < minPrice || carPrice > maxPrice) return false

        // Year filter
        if (filters.year && car.specs.year.toString() !== filters.year.toString()) return false

        // Model filter - if any models are selected, only show those models
        if (filters.selectedModels && filters.selectedModels.length > 0) {
          if (!filters.selectedModels.includes(car.id)) {
            return false
          }
        }

        // Fuel Type filter
        if (filters.fuelTypes && filters.fuelTypes.length > 0) {
          const carFuelType =
            typeof car.specs.fuelType === "object"
              ? car.specs.fuelType[currentLocale] || car.specs.fuelType.en
              : car.specs.fuelType

          if (!filters.fuelTypes.includes(carFuelType)) {
            return false
          }
        }

        // Transmission filter
        if (filters.transmission && filters.transmission.length > 0) {
          const carTransmission =
            typeof car.specs.transmission === "object"
              ? car.specs.transmission[currentLocale] || car.specs.transmission.en
              : car.specs.transmission

          if (!filters.transmission.includes(carTransmission)) {
            return false
          }
        }

        // Seats filter
        if (filters.seats && filters.seats.length > 0) {
          const carSeats =
            typeof car.specs.seats === "object" ? car.specs.seats[currentLocale] || car.specs.seats.en : car.specs.seats

          if (!filters.seats.includes(carSeats)) {
            return false
          }
        }

        return true
      } catch (error) {
        console.error("Error filtering car:", error, car)
        return false
      }
    })
  }, [cars, filters, currentLocale])

  // Sort cars based on selected option
  const sortedCars = useMemo(() => {
    const sorted = [...filteredCars]

    switch (sortOption) {
      case "price-low":
        return sorted.sort((a, b) => a.cashPrice - b.cashPrice)
      case "price-high":
        return sorted.sort((a, b) => b.cashPrice - a.cashPrice)
      case "newest":
        return sorted.sort((a, b) => b.specs.year - a.specs.year)
      default:
        return sorted
    }
  }, [filteredCars, sortOption])

  // Pagination
  const indexOfLastCar = currentPage * carsPerPage
  const indexOfFirstCar = indexOfLastCar - carsPerPage
  const currentCars = sortedCars.slice(indexOfFirstCar, indexOfLastCar)
  const totalPages = Math.ceil(sortedCars.length / carsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Process cars to handle localized text objects
  const processedCars = currentCars.map((car) => {
    return {
      ...car,
      name: typeof car.name === "object" ? car.name[currentLocale] || car.name.en || "" : car.name,
      modelYear:
        typeof car.modelYear === "object" ? car.modelYear[currentLocale] || car.modelYear.en || "" : car.modelYear,
      specs: {
        ...car.specs,
        fuelType:
          typeof car.specs?.fuelType === "object"
            ? car.specs.fuelType[currentLocale] || car.specs.fuelType.en || ""
            : car.specs?.fuelType,
        seats:
          typeof car.specs?.seats === "object"
            ? car.specs.seats[currentLocale] || car.specs.seats.en || ""
            : car.specs?.seats,
        transmission:
          typeof car.specs?.transmission === "object"
            ? car.specs.transmission[currentLocale] || car.specs.transmission.en || ""
            : car.specs?.transmission,
        engine:
          typeof car.specs?.engine === "object"
            ? car.specs.engine[currentLocale] || car.specs.engine.en || ""
            : car.specs?.engine,
        power:
          typeof car.specs?.power === "object"
            ? car.specs.power[currentLocale] || car.specs.power.en || ""
            : car.specs?.power,
      },
    }
  })

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
      <style>{scrollbarStyles}</style>
      <div className="container m-auto px-2 sm:px-3 md:px-4 lg:px-[5rem] xl:px-[7rem] py-4">
        <div className="relative flex flex-col md:flex-row gap-8">
          <Button
            className="md:hidden mb-4 bg-brand-primary hover:bg-brand-dark text-white rounded-[4px] transition-all duration-300 transform hover:scale-105 hover:shadow-md"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen
              ? currentLocale === "ar"
                ? "إغلاق الفلاتر"
                : "Close Filters"
              : currentLocale === "ar"
                ? "فتح الفلاتر"
                : "Open Filters"}
          </Button>

          <div className={`md:w-80 ${isSidebarOpen ? "block" : "hidden md:block"}`}>
            <div className="sticky top-20 h-[calc(100vh-5rem)]">
              <CarFilterSidebar
                onFilterChange={handleFilterChange}
                filters={filters}
                language={currentLocale}
                cars={cars}
              />
            </div>
          </div>

          <div className="flex-1">
            <PromoSlider />

            {/* Car Grid */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-brand-primary">
                  {currentLocale === "ar" ? "السيارات المتاحة" : "Available Cars"}
                  <span className="ml-2 text-sm font-normal text-gray-500">({filteredCars.length})</span>
                </h2>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">{currentLocale === "ar" ? "ترتيب حسب:" : "Sort by:"}</label>
                  <select
                    value={sortOption}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="p-2 border rounded-[4px] text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all duration-300 hover:border-brand-primary cursor-pointer"
                  >
                    <option value="relevance">{currentLocale === "ar" ? "الصلة" : "Relevance"}</option>
                    <option value="price-low">
                      {currentLocale === "ar" ? "السعر: من الأقل إلى الأعلى" : "Price: Low to High"}
                    </option>
                    <option value="price-high">
                      {currentLocale === "ar" ? "السعر: من الأعلى إلى الأقل" : "Price: High to Low"}
                    </option>
                    <option value="newest">{currentLocale === "ar" ? "الأحدث" : "Newest"}</option>
                  </select>
                </div>
              </div>

              {/* Car Cards */}
              <CarGrid cars={processedCars} loading={loading} locale={currentLocale} />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`px-3 py-1 rounded-[4px] transition-all duration-300 transform hover:scale-105 ${
                          currentPage === i + 1
                            ? "bg-brand-primary text-white shadow-md"
                            : "bg-white text-brand-primary border border-brand-primary hover:bg-brand-primary/10"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {filteredCars.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-[4px] transition-all duration-500 animate-fadeIn">
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    {currentLocale === "ar" ? "لا توجد سيارات متطابقة" : "No matching cars found"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {currentLocale === "ar"
                      ? "حاول تعديل معايير البحث الخاصة بك"
                      : "Try adjusting your search criteria"}
                  </p>
                  <Button
                    onClick={() => {
                      console.log("Reset button clicked")
                      clearAllFilters()
                    }}
                    className="bg-brand-primary hover:bg-brand-dark text-white rounded-[4px] transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                  >
                    {currentLocale === "ar" ? "إعادة تعيين الفلاتر" : "Reset Filters"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllCarMainpage
