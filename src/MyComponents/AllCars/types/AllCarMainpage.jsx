"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import carsData from "@/app/api/mock-data" // Import your mock data with brand SVGs
import { Search, ChevronDown, ChevronUp, X, Filter, Plus, Minus } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CarGrid } from "../AllCarComponents/car-grid"
import { PromoSlider } from "../AllCarComponents/promo-slider"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { useDetailContext } from "@/contexts/detailProvider"

// Custom styles for the component
const scrollbarStyles = `
/* Premium scrollbar */
.custom-scrollbar-container {
  scrollbar-width: thin;
  scrollbar-color: #46194F transparent;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}
.custom-scrollbar-container::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar-container::-webkit-scrollbar-track {
  background: rgba(70, 25, 79, 0.05);
  border-radius: 20px;
}
.custom-scrollbar-container::-webkit-scrollbar-thumb {
  background-color: #46194F;
  border-radius: 20px;
  border: 2px solid transparent;
  background-clip: padding-box;
}
.custom-scrollbar-container::-webkit-scrollbar-thumb:hover {
  background-color: #5a2266;
}

/* Animation keyframes */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out forwards;
}

.animate-slideUp {
  animation: slideUp 0.3s ease-out forwards;
}

/* Mobile filter overlay */
.filter-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 40;
  overflow: hidden;
  backdrop-filter: blur(3px);
}

.filter-sidebar-mobile {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  z-index: 50;
  overflow-y: auto;
  animation: slideIn 0.3s ease-out forwards;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
}

@keyframes slideIn {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

/* Custom checkbox styling with brand primary color */
[data-state="checked"] {
  background-color: transparent !important;
  border-color: #46194F !important;
  color: white !important;
}

/* In checkbox  background colors that might be applied */
.checkbox-custom[data-state="checked"] {
  background-color: #46194F !important;
  border-color: #46194F !important;
  color: white !important;
}

/* Make sure all checkboxes have the correct border radius */
.checkbox-custom {
  border-radius: 5px !important;
}

/* Custom radio button styling with brand primary color */
.custom-radio {
  appearance: none;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  outline: none;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.custom-radio:checked {
  border-color: #46194F;
  background-color: white;
}

.custom-radio:checked::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #46194F;
}

.custom-radio:focus {
  box-shadow: 0 0 0 2px rgba(70, 25, 79, 0.2);
}

/* Price range slider styling */
.price-slider {
  position: relative;
  width: 100%;
  height: 2px;
  background-color: #e5e7eb;
  margin: 2rem 0;
}

.price-slider-range {
  position: absolute;
  height: 100%;
  background-color: #46194F;
}

.price-slider-thumb {
  position: absolute;
  width: 16px;
  height: 16px;
  background-color: #46194F;
  border-radius: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
}

/* Filter section styling */
.filter-section {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
}

.filter-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 0.25rem 0;
}

.filter-section-content {
  padding-top: 0.25rem;
}

/* Light purple background for the filter sidebar */
.filter-sidebar {
  background-color: #f8f5fa;
}

/* Price display buttons */
.price-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.price-button:hover {
  background-color: rgba(70, 25, 79, 0.1);
}

.price-display {
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  min-width: 100px;
  justify-content: center;
}
`

// Custom Range Slider Component
const RangeSlider = ({ min, max, value, onValueChange, step = 1000, isRTL = true }) => {
  const safeValue = useMemo(() => {
    if (!value || !Array.isArray(value) || value.length !== 2) {
      return [min, max]
    }
    return [
      Math.max(min, Math.min(max, Number(value[0]) || min)),
      Math.max(min, Math.min(max, Number(value[1]) || max)),
    ]
  }, [value, min, max])

  const handleValueChange = (newValue) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      // Ensure left thumb doesn't go beyond right thumb
      if (newValue[0] >= newValue[1]) {
        newValue[0] = newValue[1] - step
      }

      // Strictly clamp values to min/max range
      const validatedValue = [
        Math.max(min, Math.min(max, Number(newValue[0]) || min)),
        Math.max(min, Math.min(max, Number(newValue[1]) || max)),
      ]
      onValueChange(validatedValue)
    }
  }

  const formatPrice = (price) => {
    return price.toLocaleString()
  }

  const incrementMin = () => {
    const newMin = Math.min(safeValue[0] + step, safeValue[1] - step)
    handleValueChange([newMin, safeValue[1]])
  }

  const decrementMin = () => {
    const newMin = Math.max(safeValue[0] - step, min)
    handleValueChange([newMin, safeValue[1]])
  }

  const incrementMax = () => {
    const newMax = Math.min(safeValue[1] + step, max)
    handleValueChange([safeValue[0], newMax])
  }

  const decrementMax = () => {
    const newMax = Math.max(safeValue[1] - step, safeValue[0] + step)
    handleValueChange([safeValue[0], newMax])
  }

  // Calculate positions for car icons based on the actual price values
  const minPercent = ((safeValue[0] - min) / (max - min)) * 100
  const maxPercent = ((safeValue[1] - min) / (max - min)) * 100

  // Calculate if cars are close enough to crash/overlap
  const distance = maxPercent - minPercent
  const isOverlapping = distance < 15

  // Calculate normalized price values for scaling (0 to 1)
  const minNormalized = (safeValue[0] - min) / (max - min)
  const maxNormalized = (safeValue[1] - min) / (max - min)

  // Calculate scale factors based on normalized price values
  const minScale = 0.8 + minNormalized * 0.4 // Scale from 0.8 to 1.2
  const maxScale = 1.0 + maxNormalized * 0.6 // Scale from 1.0 to 1.6

  return (
    <div className="relative pt-1 pb-2 bg-[#f8f5fa] p-1 rounded-lg" dir={isRTL ? "rtl" : "ltr"}>
      {/* Car icons with slider */}
      <div className="relative h-16 mb-4">
        <div className="relative w-full h-full">
          {/* First car (left/min) */}
          <div
            className="absolute transition-all duration-300"
            style={{
              left: `${minPercent}%`,
              top: "5px",
              transform: isOverlapping
                ? `translateX(-50%) rotate(-10deg) translateY(-15px) scale(${minScale})`
                : `translateX(-50%) scale(${minScale})`,
              transformOrigin: "bottom right",
              zIndex: isOverlapping ? 2 : 1,
            }}
          >
            <img src="/icons/RangCar.svg" alt="Min price car" width={60} height={40} className="text-brand-primary" />
          </div>

          {/* Second car (right/max) */}
          <div
            className="absolute transition-all duration-300"
            style={{
              left: `${maxPercent}%`,
              top: "5px",
              transform: isOverlapping
                ? `translateX(-50%) rotate(10deg) translateY(-15px) scale(${maxScale})`
                : `translateX(-50%) scale(${maxScale})`,
              transformOrigin: "bottom left",
              zIndex: isOverlapping ? 1 : 2,
            }}
          >
            <img src="/icons/RangCar2.svg" alt="Max price car" width={60} height={40} className="text-brand-primary" />
          </div>

          {/* Slider track and thumbs */}
          <div className="absolute top-10 left-0 right-0">
            <SliderPrimitive.Root
              min={min}
              max={max}
              value={safeValue}
              onValueChange={handleValueChange}
              step={step}
              className="relative flex items-center w-full h-5 select-none touch-none"
              aria-label="Price Range"
            >
              <SliderPrimitive.Track className="relative h-[2px] grow rounded-full bg-gray-300">
                <SliderPrimitive.Range className="absolute h-[2px] rounded-full bg-brand-primary transition-all duration-300" />
              </SliderPrimitive.Track>
              <SliderPrimitive.Thumb
                className="block w-[15px] h-[15px] bg-brand-primary rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-all duration-300"
                aria-label="Minimum price"
              />
              <SliderPrimitive.Thumb
                className="block w-[15px] h-[15px] bg-brand-primary rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-all duration-300"
                aria-label="Maximum price"
              />
            </SliderPrimitive.Root>
          </div>
        </div>
      </div>

      {/* Price controls with plus/minus buttons - Smaller version */}
      <div className="flex justify-between mt-4 text-xs">
        {/* Min price control */}
        <div className="flex items-center">
          <button
            onClick={decrementMin}
            className="w-5 h-5 flex items-center justify-center border border-gray-300 rounded-md bg-white"
            aria-label="Decrease minimum price"
          >
            <Minus size={8} className="text-brand-primary" />
          </button>
          <div className="mx-1 px-1 py-0.5 bg-white border border-gray-300 rounded-md text-center">
            <div className="flex items-center justify-center">
              <span className="text-brand-primary font-bold text-[10px]">₹{formatPrice(safeValue[0])}</span>
            </div>
          </div>
          <button
            onClick={incrementMin}
            className="w-5 h-5 flex items-center justify-center border border-gray-300 rounded-md bg-white"
            aria-label="Increase minimum price"
          >
            <Plus size={8} className="text-brand-primary" />
          </button>
        </div>

        {/* Max price control */}
        <div className="flex items-center">
          <button
            onClick={decrementMax}
            className="w-5 h-5 flex items-center justify-center border border-gray-300 rounded-md bg-white"
            aria-label="Decrease maximum price"
          >
            <Minus size={8} className="text-brand-primary" />
          </button>
          <div className="mx-1 px-1 py-0.5 bg-white border border-gray-300 rounded-md text-center">
            <div className="flex items-center justify-center">
              <span className="text-brand-primary font-bold text-[10px]">₹{formatPrice(safeValue[1])}</span>
            </div>
          </div>
          <button
            onClick={incrementMax}
            className="w-5 h-5 flex items-center justify-center border border-gray-300 rounded-md bg-white"
            aria-label="Increase maximum price"
          >
            <Plus size={8} className="text-brand-primary" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Car Filter Sidebar Component
const CarFilterSidebar = ({ onFilterChange, filters, language, cars, isMobile = false, onClose }) => {
  const {searchbrands}=useDetailContext()
  const [expandedBrands, setExpandedBrands] = useState([])
  const [searchTerm, setSearchTerm] = useState(searchbrands?.brand)
  // Add state to track which sections are expanded
  const [expandedSections, setExpandedSections] = useState({
    priceRange: true,
    brandsAndModels: true,
    year: false,
    fuelType: false,
    transmission: false,
    seats: false,
  })

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

  // Toggle section expansion
  const toggleSection = (section, e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const toggleBrand = (brand, e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
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
    return language === "ar" ? `${price.toLocaleString()}` : `₹ ${price.toLocaleString()}`
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

  // Handle price range change
  const handlePriceRangeChange = (newValue) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      const validatedValue = [
        Math.max(0, Math.min(maxPrice, Number(newValue[0]) || 0)),
        Math.max(0, Math.min(maxPrice, Number(newValue[1]) || maxPrice)),
      ]
      onFilterChange({ priceRange: validatedValue })
    }
  }

  // Calculate active filters count
  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.selectedModels?.length > 0) count++
    if (filters.year) count++
    if (filters.fuelTypes?.length > 0) count++
    if (filters.transmission?.length > 0) count++
    if (filters.seats?.length > 0) count++
    // Check if price range is different from default
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) count++
    return count
  }

  // Helper function to get brand logo
  const getBrandLogo = (brandName) => {
    // Find a car with this brand
    const car = cars.find((car) => car.brand?.toLowerCase() === brandName.toLowerCase())
    // Return the brand logo if found, otherwise return a placeholder
    return car?.brandLogo || `/placeholder.svg?height=20&width=20`
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <div
      className="filter-sidebar h-full flex flex-col rounded-lg overflow-hidden"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* Filter header */}
      <div className="bg-brand-primary text-white p-4 flex justify-between items-center">
        <h3 className="text-xl font-bold text-center w-full">
          {language === "ar" ? "فلترة النتائج" : "Filter Results"}
        </h3>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-white hover:bg-white/20">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Scrollable content */}
      <div
        className="flex-1 overflow-y-auto custom-scrollbar-container p-4"
        style={{ maxHeight: isMobile ? "calc(100vh - 160px)" : "auto" }}
      >
        {/* Price Range Section */}
        <div className="filter-section">
          <div className="filter-section-header" onClick={(e) => toggleSection("priceRange", e)}>
            <h4 className="font-bold text-brand-primary text-base">{language === "ar" ? "مدى السعر" : "Price Range"}</h4>
            <div className="h-6 w-6 flex items-center justify-center">
              {expandedSections.priceRange ? (
                <ChevronUp className="h-5 w-5 text-brand-primary" />
              ) : (
                <ChevronDown className="h-5 w-5 text-brand-primary" />
              )}
            </div>
          </div>

          {expandedSections.priceRange && (
            <div className="filter-section-content">
              <RangeSlider
                min={40000}
                max={250000}
                value={filters.priceRange}
                onValueChange={handlePriceRangeChange}
                step={10000}
                isRTL={language === "ar"}
              />
            </div>
          )}
        </div>

        {/* Brands + Models Section */}
        <div className="filter-section">
          <div className="filter-section-header" onClick={(e) => toggleSection("brandsAndModels", e)}>
            <h4 className="font-bold text-brand-primary text-base">
              {language === "ar" ? "اختر العلامة التجارية والطراز المناسب لك" : "Choose Brand & Model"}
            </h4>
            <div className="h-6 w-6 flex items-center justify-center">
              {expandedSections.brandsAndModels ? (
                <ChevronUp className="h-5 w-5 text-brand-primary" />
              ) : (
                <ChevronDown className="h-5 w-5 text-brand-primary" />
              )}
            </div>
          </div>

          {expandedSections.brandsAndModels && (
            <div className="filter-section-content">
              {/* Search box */}
              <div className="relative mb-3">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                  <input
                    type="text"
                    placeholder={language === "ar" ? "ابحث..." : "Search..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-1 px-7 text-xs focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
              </div>

              {/* Brand list */}
              <div className="space-y-2">
                {filteredBrands.map((brand) => (
                  <div key={brand} className="mb-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`brand-${brand}`}
                        checked={areAllModelsSelected(brand)}
                        onCheckedChange={(checked) => handleBrandCheck(brand, checked)}
                        className="h-4 w-4 rounded-[5px] border-gray-300 focus:ring-brand-primary checkbox-custom"
                      />
                      <Label
                        htmlFor={`brand-${brand}`}
                        className="text-xs font-medium cursor-pointer flex items-center gap-1 flex-1"
                      >
                        <img
                          src={getBrandLogo(brand) || "/placeholder.svg"}
                          alt={brand}
                          className="h-5 w-5 object-contain"
                        />
                        {brand}
                      </Label>
                      <div className="text-xs text-gray-500 mr-2">({modelsByBrand[brand]?.length || 0})</div>
                      <button
                        onClick={(e) => toggleBrand(brand, e)}
                        className="h-6 w-6 flex items-center justify-center text-brand-primary"
                      >
                        {expandedBrands.includes(brand) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {/* Models list - shown when brand is expanded */}
                    {expandedBrands.includes(brand) && (
                      <div className="ml-6 mt-2 space-y-1 border-l-2 border-brand-primary/20 pl-3">
                        {modelsByBrand[brand]?.map((model) => (
                          <div key={model.id} className="flex items-center gap-2">
                            <Checkbox
                              id={`model-${model.id}`}
                              checked={filters.selectedModels?.includes(model.id)}
                              onCheckedChange={(checked) => handleModelCheck(model.id, checked)}
                              className="h-3.5 w-3.5 rounded-[5px] border-gray-300 text-brand-primary focus:ring-brand-primary checkbox-custom"
                            />
                            <Label
                              htmlFor={`model-${model.id}`}
                              className="text-[10px] font-medium cursor-pointer text-gray-700"
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
          )}
        </div>

        {/* Year Section */}
        <div className="filter-section">
          <div className="filter-section-header" onClick={(e) => toggleSection("year", e)}>
            <h4 className="font-bold text-brand-primary text-base">{language === "ar" ? "السنة" : "Year"}</h4>
            <div className="h-6 w-6 flex items-center justify-center">
              {expandedSections.year ? (
                <ChevronUp className="h-5 w-5 text-brand-primary" />
              ) : (
                <ChevronDown className="h-5 w-5 text-brand-primary" />
              )}
            </div>
          </div>

          {expandedSections.year && (
            <div className="filter-section-content">
              {/* Extract unique years from cars data */}
              {[...new Set(cars.map((car) => car.specs?.year))]
                .filter(Boolean)
                .sort((a, b) => b - a) // Sort years in descending order
                .map((year) => (
                  <div key={year} className="flex items-center mb-2">
                    <div className="flex items-center cursor-pointer" onClick={() => handleYearChange(year)}>
                      <div
                        className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                          filters.year === year.toString() ? "border-brand-primary" : "border-gray-300"
                        }`}
                      >
                        {filters.year === year.toString() && <div className="h-2 w-2 rounded-full bg-brand-primary"></div>}
                      </div>
                      <label className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">{year}</label>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Fuel Type Section */}
        <div className="filter-section">
          <div className="filter-section-header" onClick={(e) => toggleSection("fuelType", e)}>
            <h4 className="font-bold text-brand-primary text-base">{language === "ar" ? "نوع الوقود" : "Fuel Type"}</h4>
            <div className="h-6 w-6 flex items-center justify-center">
              {expandedSections.fuelType ? (
                <ChevronUp className="h-5 w-5 text-brand-primary" />
              ) : (
                <ChevronDown className="h-5 w-5 text-brand-primary" />
              )}
            </div>
          </div>

          {expandedSections.fuelType && (
            <div className="filter-section-content">
              {/* Extract unique fuel types from cars data */}
              {[
                ...new Set(
                  cars.map((car) => {
                    // Handle both object and string fuel types
                    return typeof car.specs?.fuelType === "object"
                      ? car.specs.fuelType[language] || car.specs.fuelType.en
                      : car.specs?.fuelType
                  }),
                ),
              ]
                .filter(Boolean) // Remove any undefined or null values
                .map((fuelType) => (
                  <div key={fuelType} className="flex items-center mb-2">
                    <Checkbox
                      id={`fuel-${fuelType}`}
                      checked={Array.isArray(filters.fuelTypes) && filters.fuelTypes.includes(fuelType)}
                      onCheckedChange={(checked) => handleFuelTypeChange(fuelType, checked)}
                      className="h-4 w-4 rounded-[5px] border-gray-300 focus:ring-brand-primary checkbox-custom"
                    />
                    <Label htmlFor={`fuel-${fuelType}`} className="ml-2 text-sm font-medium text-gray-700">
                      {fuelType}
                    </Label>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Transmission Section */}
        <div className="filter-section">
          <div className="filter-section-header" onClick={(e) => toggleSection("transmission", e)}>
            <h4 className="font-bold text-brand-primary text-base">{language === "ar" ? "ناقل الحركة" : "Transmission"}</h4>
            <div className="h-6 w-6 flex items-center justify-center">
              {expandedSections.transmission ? (
                <ChevronUp className="h-5 w-5 text-brand-primary" />
              ) : (
                <ChevronDown className="h-5 w-5 text-brand-primary" />
              )}
            </div>
          </div>

          {expandedSections.transmission && (
            <div className="filter-section-content">
              {/* Extract unique transmission types from cars data */}
              {[
                ...new Set(
                  cars.map((car) => {
                    // Handle both object and string transmission types
                    return typeof car.specs?.transmission === "object"
                      ? car.specs.transmission[language] || car.specs.transmission.en
                      : car.specs?.transmission
                  }),
                ),
              ]
                .filter(Boolean) // Remove any undefined or null values
                .map((transmission) => (
                  <div key={transmission} className="flex items-center mb-2">
                    <Checkbox
                      id={`transmission-${transmission}`}
                      checked={Array.isArray(filters.transmission) && filters.transmission.includes(transmission)}
                      onCheckedChange={(checked) => handleTransmissionChange(transmission, checked)}
                      className="h-4 w-4 rounded-[5px] border-gray-300 focus:ring-brand-primary checkbox-custom"
                    />
                    <Label htmlFor={`transmission-${transmission}`} className="ml-2 text-sm font-medium text-gray-700">
                      {transmission}
                    </Label>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Seats Section */}
        <div className="filter-section">
          <div className="filter-section-header" onClick={(e) => toggleSection("seats", e)}>
            <h4 className="font-bold text-brand-primary text-base">
              {language === "ar" ? "عدد المقاعد" : "Number of Seats"}
            </h4>
            <div className="h-6 w-6 flex items-center justify-center">
              {expandedSections.seats ? (
                <ChevronUp className="h-5 w-5 text-brand-primary" />
              ) : (
                <ChevronDown className="h-5 w-5 text-brand-primary" />
              )}
            </div>
          </div>

          {expandedSections.seats && (
            <div className="filter-section-content">
              {/* Extract unique seat options from cars data */}
              {[
                ...new Set(
                  cars.map((car) => {
                    // Handle both object and string seats types
                    return typeof car.specs?.seats === "object"
                      ? car.specs.seats[language] || car.specs.seats.en
                      : car.specs?.seats
                  }),
                ),
              ]
                .filter(Boolean) // Remove any undefined or null values
                .map((seatOption) => (
                  <div key={seatOption} className="flex items-center mb-2">
                    <Checkbox
                      id={`seats-${seatOption}`}
                      checked={filters.seats?.includes(seatOption)}
                      onCheckedChange={(checked) => handleSeatChange(seatOption, checked)}
                      className="h-4 w-4 rounded-[5px] border-gray-300 focus:ring-brand-primary checkbox-custom"
                    />
                    <Label htmlFor={`seats-${seatOption}`} className="ml-2 text-sm font-medium text-gray-700">
                      {language === "ar" ? `${seatOption} مقاعد` : `${seatOption} Seats`}
                    </Label>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter footer */}
      <div className="bg-white border-t border-gray-200 p-4 rounded-b-lg">
        <Button
          onClick={() => {
            // Reset all filters
            const resetFilters = {
              priceRange: [40000, 250000],
              selectedModels: [],
              year: "",
              fuelTypes: [],
              transmission: [],
              seats: [],
            }
            onFilterChange(resetFilters)
          }}
          className="w-full bg-white text-brand-primary border border-brand-primary hover:bg-brand-primary/10"
        >
          <X className="h-4 w-4 mr-2" />
          {language === "ar" ? "إعادة تعيين" : "Reset"}
        </Button>
      </div>
    </div>
  )
}

// Main AllCarMainpage Component
const AllCarMainpage = () => {
  const pathname = usePathname()
  const currentLocale = pathname?.startsWith("/ar") ? "ar" : "en"
  const isRTL = currentLocale === "ar"

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [filters, setFilters] = useState({
    priceRange: [40000, 250000],
    selectedModels: [],
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

  // Add effect to prevent body scrolling when filter is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isSidebarOpen])

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }))
    setCurrentPage(1) // Reset to first page when filters change
  }, [])

  // Handle sort change
  const handleSortChange = (e) => {
    setSortOption(e.target.value)
    setCurrentPage(1) // Reset to first page when sort changes
  }

  // Apply filters and sort to cars
  const filteredCars = useMemo(() => {
    if (!cars.length) return []

    return cars
      .filter((car) => {
        // Filter by price range
        if (car.cashPrice < filters.priceRange[0] || car.cashPrice > filters.priceRange[1]) {
          return false
        }

        // Filter by selected models
        if (filters.selectedModels?.length > 0 && !filters.selectedModels.includes(car.id)) {
          return false
        }

        // Filter by year
        if (filters.year && (!car.specs?.year || car.specs.year.toString() !== filters.year)) {
          return false
        }

        // Filter by fuel type
        if (filters.fuelTypes?.length > 0) {
          const carFuelType =
            typeof car.specs?.fuelType === "object"
              ? car.specs.fuelType[currentLocale] || car.specs.fuelType.en
              : car.specs?.fuelType
          if (!carFuelType || !filters.fuelTypes.includes(carFuelType)) {
            return false
          }
        }

        // Filter by transmission
        if (filters.transmission?.length > 0) {
          const carTransmission =
            typeof car.specs?.transmission === "object"
              ? car.specs.transmission[currentLocale] || car.specs.transmission.en
              : car.specs?.transmission
          if (!carTransmission || !filters.transmission.includes(carTransmission)) {
            return false
          }
        }

        // Filter by seats
        if (filters.seats?.length > 0) {
          const carSeats =
            typeof car.specs?.seats === "object"
              ? car.specs.seats[currentLocale] || car.specs.seats.en
              : car.specs?.seats
          if (!carSeats || !filters.seats.includes(carSeats)) {
            return false
          }
        }

        return true
      })
      .sort((a, b) => {
        switch (sortOption) {
          case "price-asc":
            return a.cashPrice - b.cashPrice
          case "price-desc":
            return b.cashPrice - a.cashPrice
          case "newest":
            return Number.parseInt(b.specs?.year || 0) - Number.parseInt(a.specs?.year || 0)
          default:
            return 0
        }
      })
  }, [cars, filters, sortOption, currentLocale])

  // Calculate pagination
  const totalPages = Math.ceil(filteredCars.length / carsPerPage)
  const currentCars = filteredCars.slice((currentPage - 1) * carsPerPage, currentPage * carsPerPage)

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    // Scroll to top of results
    window.scrollTo({
      top: document.getElementById("results-top")?.offsetTop || 0,
      behavior: "smooth",
    })
  }

  return (
    <>
      <style jsx global>
        {scrollbarStyles}
      </style>
      <div className="container mx-auto  py-8" dir={isRTL ? "rtl" : "ltr"}>
        {/* Mobile Filter Button - Only shown on mobile */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="w-full bg-brand-primary text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2"
            aria-label={currentLocale === "ar" ? "فلترة السيارات" : "Filter Cars"}
          >
            <Filter className="h-5 w-5" />
            <span>{currentLocale === "ar" ? "فلترة النتائج" : "Filter Results"}</span>
          </button>
        </div>

        {/* Mobile Filter Sidebar - Only shown when active on mobile */}
        {isSidebarOpen && (
          <>
            <div className="filter-overlay" onClick={() => setIsSidebarOpen(false)} />
            <div className="filter-sidebar-mobile">
              <CarFilterSidebar
                onFilterChange={handleFilterChange}
                filters={filters}
                language={currentLocale}
                cars={cars}
                isMobile={true}
                onClose={() => setIsSidebarOpen(false)}
              />
            </div>
          </>
        )}

        {/* Main content grid */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar - Only shown on desktop */}
          <div className="hidden lg:block lg:w-[280px] sticky top-4 self-start">
            <CarFilterSidebar
              onFilterChange={handleFilterChange}
              filters={filters}
              language={currentLocale}
              cars={cars}
              isMobile={false}
            />
          </div>

          {/* Main content */}
          <div className="flex-1">
            {/* PromoSlider - Added as requested */}
            <div className="mb-6">
              <PromoSlider />
            </div>

            {/* Available Cars Header */}
            <div className="bg-white rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center mb-6 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-brand-primary mb-2 md:mb-0 flex items-center gap-2">
                  <span>{isRTL ? "السيارات المتاحة" : "Available Cars"}</span>
                  <span className="bg-brand-primary text-white px-2 py-1 rounded-full text-sm">{filteredCars.length}</span>
                </h2>
              </div>

              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <span className="text-sm font-medium text-gray-600">{isRTL ? "الترتيب:" : "Sort:"}</span>
                <select
                  className="border border-gray-300 rounded-md py-1 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  value={sortOption}
                  onChange={handleSortChange}
                  aria-label={isRTL ? "رتب حسب" : "Sort by"}
                >
                  <option value="relevance">{isRTL ? "الصلة" : "Relevance"}</option>
                  <option value="price-asc">{isRTL ? "السعر: من الأقل للأعلى" : "Price: Low to High"}</option>
                  <option value="price-desc">{isRTL ? "السعر: من الأعلى للأقل" : "Price: High to Low"}</option>
                  <option value="newest">{isRTL ? "الأحدث" : "Newest First"}</option>
                </select>
              </div>
            </div>

            {/* Results Section */}
            <div id="results-top" className="animate-fadeIn">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-brand-primary font-medium">{isRTL ? "جارٍ التحميل..." : "Loading..."}</p>
                </div>
              ) : currentCars.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center shadow-md border border-gray-100">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{isRTL ? "لم يتم العثور على سيارات" : "No Cars Found"}</h3>
                  <p className="text-gray-600 mb-6">
                    {isRTL
                      ? "لم نتمكن من العثور على أي سيارات تطابق معايير البحث الخاصة بك. يرجى تعديل الفلاتر والمحاولة مرة أخرى."
                      : "We couldn't find any cars matching your search criteria. Please adjust your filters and try again."}
                  </p>
                  <Button
                    onClick={() => {
                      // Reset all filters
                      const resetFilters = {
                        priceRange: [40000, 250000],
                        selectedModels: [],
                        year: "",
                        fuelTypes: [],
                        transmission: [],
                        seats: [],
                      }
                      setFilters(resetFilters)
                    }}
                    className="bg-brand-primary text-white hover:bg-brand-primary/90"
                  >
                    {isRTL ? "إعادة تعيين الفلاتر" : "Reset Filters"}
                  </Button>
                </div>
              ) : (
                <>
                  <CarGrid cars={currentCars} loading={false} locale={currentLocale} />

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="w-10 h-10 rounded-full flex items-center justify-center border border-brand-primary bg-white text-brand-primary hover:bg-brand-primary/10 disabled:opacity-50 disabled:cursor-not-allowed p-0"
                          aria-label={isRTL ? "الصفحة السابقة" : "Previous Page"}
                        >
                          <ChevronDown className={`h-5 w-5 ${isRTL ? "rotate-90" : "-rotate-90"}`} />
                        </Button>

                        {Array.from({ length: totalPages }, (_, i) => (
                          <Button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center p-0 ${
                              currentPage === i + 1
                                ? "bg-brand-primary text-white"
                                : "border border-brand-primary bg-white text-brand-primary hover:bg-brand-primary/10"
                            }`}
                            aria-label={`${isRTL ? "الصفحة" : "Page"} ${i + 1}`}
                            aria-current={currentPage === i + 1 ? "page" : undefined}
                          >
                            {i + 1}
                          </Button>
                        ))}

                        <Button
                          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="w-10 h-10 rounded-full flex items-center justify-center border border-brand-primary bg-white text-brand-primary hover:bg-brand-primary/10 disabled:opacity-50 disabled:cursor-not-allowed p-0"
                          aria-label={isRTL ? "الصفحة التالية" : "Next Page"}
                        >
                          <ChevronDown className={`h-5 w-5 ${isRTL ? "-rotate-90" : "rotate-90"}`} />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AllCarMainpage
