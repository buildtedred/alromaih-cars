"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import carsData from "@/app/api/mock-data" // Import your mock data with brand SVGs
import { Search, ChevronDown, ChevronUp, X, Filter, Plus, Minus, RefreshCw } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CarGrid } from "../AllCarComponents/car-grid"
import { PromoSlider } from "../AllCarComponents/promo-slider"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { useDetailContext } from "@/contexts/detailProvider"
import { Breadcrumb } from "../../breadcrumb" // Import the Breadcrumb component

// Add this new component for selected filters display
const SelectedFilters = ({ selectedFilters, onRemoveFilter, onClearAll, language }) => {
  if (!selectedFilters || selectedFilters.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <Button
        onClick={onClearAll}
        className="bg-brand-primary text-white hover:bg-brand-primary/90 rounded-full px-4 py-2 h-9 flex items-center gap-1"
      >
        <RefreshCw className="h-4 w-4" />
        {language === "ar" ? "مسح الكل" : "Clear All"}
      </Button>

      {selectedFilters.map((filter, index) => (
        <div
          key={index}
          className="bg-white border border-brand-primary text-brand-primary rounded-full px-3 py-1 flex items-center gap-1"
        >
          <span className="text-sm font-medium">{filter.label}</span>
          <button
            onClick={() => onRemoveFilter(filter.id, filter.type)}
            className="ml-1 rounded-full hover:bg-brand-light/50 p-1"
            aria-label={`Remove ${filter.label} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  )
}

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
    <div className="relative pt-1 pb-2 bg-brand-light p-1 rounded-lg" dir={isRTL ? "rtl" : "ltr"}>
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
      <div className="flex justify-between mt-4 text-xs bg-brand-light">
        {/* Min price control */}
        <div className="flex items-center">
          <button
            onClick={decrementMin}
            className="w-5 h-5 flex items-center justify-center border-2 border-brand-primary rounded-[4px]"
            aria-label="Decrease minimum price"
          >
            <Minus size={10} strokeWidth={4} className="text-brand-primary" />
          </button>

          <div className="mx-1 px-1 py-0.5 rounded-[4px] text-center">
            <div className="flex items-center justify-center">
              <span className="text-brand-primary font-bold text-[10px] flex items-center gap-1">
                <img src="/icons/Currency.svg" alt="Currency" className="w-3 h-3" />
                {formatPrice(safeValue[0])}
              </span>
            </div>
          </div>
          <button
            onClick={incrementMin}
            className="w-5 h-5 flex items-center justify-center border-2 border-brand-primary rounded-[4px]"
            aria-label="Increase minimum price"
          >
            <Plus size={10} strokeWidth={4} className="text-brand-primary" />
          </button>
        </div>

        {/* Max price control */}
        <div className="flex items-center ">
          <button
            onClick={decrementMax}
            className="w-5 h-5 flex items-center justify-center border-2 border-brand-primary rounded-[4px]"
            aria-label="Decrease maximum price"
          >
            <Minus size={10} strokeWidth={4} className="text-brand-primary " />
          </button>
          <div className="mx-1 px-1 py-0.5 border rounded-[4px] text-center">
            <div className="flex items-center justify-center">
              <span className="text-brand-primary font-bold text-[10px] flex items-center gap-1">
                <img src="/icons/Currency.svg" alt="Currency" className="w-3 h-3" />
                {formatPrice(safeValue[1])}
              </span>
            </div>
          </div>
          <button
            onClick={incrementMax}
            className="w-5 h-5 flex items-center justify-center border-2 border-brand-primary rounded-[4px]"
            aria-label="Increase maximum price"
          >
            <Plus size={10} strokeWidth={4} className="text-brand-primary" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Car Filter Sidebar Component
const CarFilterSidebar = ({ onFilterChange, filters, language, cars, isMobile = false, onClose }) => {
  const { searchbrands } = useDetailContext()
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
    onFilterChange({
      year: filters.year === year.toString() ? "" : year.toString(),
    })
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
      className="h-full flex flex-col rounded-xl overflow-hidden bg-brand-light shadow-md"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="flex items-center justify-end text-brand-primary hover:text-brand-primary bg-brand-light p-3 border-b border-brand-primary/25 sm:p-0 sm:border-0">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 rounded-full p-0 hover:bg-transparent hover:text-brand-primary hover:border-brand-primary hover:border"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filter header */}
      <div className="text-brand-primary p-4 flex justify-between items-center rounded-t-xl border-b border-brand-primary/25">
        <h3 className="text-xl font-bold text-brand-primary">
          {language === "ar" ? "فلترة النتائج" : "Filter Results"}
        </h3>
        <button
          onClick={() => {
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
          className="text-brand-primary font-medium text-sm hover:underline"
        >
          <span>{language === "ar" ? "إعادة تعيين" : "Reset"}</span>
        </button>
      </div>

      {/* Scrollable content */}
      <div
        className="flex-1 overflow-y-auto p-4"
        style={{
          maxHeight: isMobile ? "calc(100vh - 0px)" : "calc(100vh - 0px)",
          scrollbarWidth: "thin",
          scrollbarColor: "#46194F transparent",
        }}
      >
        {/* Price Range Section */}
        <div className="border-b border-brand-primary/25 pb-3 mb-3">
          <div
            className="flex justify-between items-center cursor-pointer py-1"
            onClick={(e) => toggleSection("priceRange", e)}
          >
            <h4 className="font-bold text-brand-primary text-base">
              {language === "ar" ? "مدى السعر" : "Price Range"}
            </h4>
            <div className="h-6 w-6 flex items-center justify-center">
              {expandedSections.priceRange ? (
                <ChevronUp className="h-5 w-5 text-brand-primary" />
              ) : (
                <ChevronDown className="h-5 w-5 text-brand-primary" />
              )}
            </div>
          </div>

          {expandedSections.priceRange && (
            <div className="pt-1">
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
        <div className="border-b border-brand-primary/25 pb-3 mb-3">
          <div
            className="flex justify-between items-center cursor-pointer py-1"
            onClick={(e) => toggleSection("brandsAndModels", e)}
          >
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
            <div className="pt-1">
              {/* Search box */}
              <div className="relative mb-3 ">
                <div className="relative ">
                  <Search className="absolute left-2 top-1/2  transform -translate-y-1/2 text-brand-primary/40  h-3 w-3" />
                  <input
                    type="text"
                    placeholder={language === "ar" ? "ابحث..." : "Search..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border bg-brand-light border-brand-primary rounded-[5px] py-1 text-brand-primary  px-7 text-xs focus:outline-none focus:ring-1 focus:ring-brand-primary"
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
                        className="h-4 w-4 rounded-[5px] border-2 border-brand-primary focus:ring-brand-primary"
                        style={{
                          backgroundColor: areAllModelsSelected(brand) ? "#46194F" : "transparent",
                          borderColor: areAllModelsSelected(brand) ? "#46194F" : "",
                        }}
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
                              className="h-3.5 w-3.5  rounded-[5px] border-brand-primary focus:ring-brand-primary"
                              style={{
                                backgroundColor: filters.selectedModels?.includes(model.id) ? "#46194F" : "transparent",
                                borderColor: filters.selectedModels?.includes(model.id) ? "#46194F" : "",
                              }}
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
        <div className="border-b border-brand-primary/25 pb-3 mb-3">
          <div
            className="flex justify-between items-center cursor-pointer py-1"
            onClick={(e) => toggleSection("year", e)}
          >
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
            <div className="pt-1">
              {/* Extract unique years from cars data */}
              {[...new Set(cars.map((car) => car.specs?.year))]
                .filter(Boolean)
                .sort((a, b) => b - a) // Sort years in descending order
                .map((year) => (
                  <div key={year} className="flex items-center mb-2">
                    <div className="flex items-center cursor-pointer" onClick={() => handleYearChange(year)}>
                      <div
                        className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                          filters.year === year.toString() ? "border-brand-primary" : "border-brand-primary"
                        }`}
                      >
                        {filters.year === year.toString() && (
                          <div className="h-2 w-2 rounded-full bg-brand-primary"></div>
                        )}
                      </div>
                      <label className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">{year}</label>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Fuel Type Section */}
        <div className="border-b border-brand-primary/25 pb-3 mb-3">
          <div
            className="flex justify-between items-center cursor-pointer py-1"
            onClick={(e) => toggleSection("fuelType", e)}
          >
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
            <div className="pt-1">
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
                      className="h-4 w-4 rounded-[5px] border-brand-primary border-2 focus:ring-brand-primary"
                      style={{
                        backgroundColor:
                          Array.isArray(filters.fuelTypes) && filters.fuelTypes.includes(fuelType)
                            ? "#46194F"
                            : "transparent",
                        borderColor:
                          Array.isArray(filters.fuelTypes) && filters.fuelTypes.includes(fuelType) ? "#46194F" : "",
                      }}
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
        <div className="border-b border-brand-primary/25 pb-3 mb-3">
          <div
            className="flex justify-between items-center cursor-pointer py-1"
            onClick={(e) => toggleSection("transmission", e)}
          >
            <h4 className="font-bold text-brand-primary text-base">
              {language === "ar" ? "ناقل الحركة" : "Transmission"}
            </h4>
            <div className="h-6 w-6 flex items-center justify-center">
              {expandedSections.transmission ? (
                <ChevronUp className="h-5 w-5 text-brand-primary" />
              ) : (
                <ChevronDown className="h-5 w-5 text-brand-primary" />
              )}
            </div>
          </div>

          {expandedSections.transmission && (
            <div className="pt-1">
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
                      className="h-4 w-4 rounded-[5px] border-brand-primary border-2 focus:ring-brand-primary"
                      style={{
                        backgroundColor:
                          Array.isArray(filters.transmission) && filters.transmission.includes(transmission)
                            ? "#46194F"
                            : "transparent",
                        borderColor:
                          Array.isArray(filters.transmission) && filters.transmission.includes(transmission)
                            ? "#46194F"
                            : "",
                      }}
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
        <div className="border-b border-brand-primary/25 pb-3 mb-3">
          <div
            className="flex justify-between items-center cursor-pointer py-1"
            onClick={(e) => toggleSection("seats", e)}
          >
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
            <div className="pt-1">
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
                      className="h-4 w-4 rounded-[5px] border-brand-primary border-2 focus:ring-brand-primary"
                      style={{
                        backgroundColor: filters.seats?.includes(seatOption) ? "#46194F" : "transparent",
                        borderColor: filters.seats?.includes(seatOption) ? "#46194F" : "",
                      }}
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
      {/* <div
        className="bg-brand-light border-t border-gray-200 p-4 rounded-b-xl shadow-sm"
        style={{ boxShadow: "0 -2px 6px rgba(0, 0, 0, 0.05)" }}
      >
       
      </div> */}
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

  // Get selected brands from selected models
  const getSelectedBrands = useMemo(() => {
    if (!filters.selectedModels?.length || !cars.length) return []

    const brands = new Set()
    filters.selectedModels.forEach((modelId) => {
      const car = cars.find((car) => car.id === modelId)
      if (car?.brand) {
        brands.add(car.brand)
      }
    })

    return Array.from(brands)
  }, [filters.selectedModels, cars])

  // Generate breadcrumb items with brand name if available
  // UPDATED: Only show brand in breadcrumb if exactly ONE brand is selected
  const getBreadcrumbItems = () => {
    const selectedBrands = getSelectedBrands

    // If no brands or more than one brand is selected, show default "Cars" breadcrumb
    if (selectedBrands.length !== 1) {
      return [
        {
          label: currentLocale === "ar" ? "السيارات" : "Cars",
        },
      ]
    }

    // If exactly one brand is selected, show that brand in the breadcrumb
    return [
      {
        label: selectedBrands[0] + (currentLocale === "ar" ? " السيارات" : " Cars"),
      },
    ]
  }

  const language = currentLocale

  const formatPrice = (price) => {
    return language === "ar" ? `${price.toLocaleString()}` : `₹ ${price.toLocaleString()}`
  }

  // Add a new function to get selected filters
  const getSelectedFilters = useCallback(() => {
    const selectedFilters = []

    // Add brand filters
    if (filters.selectedModels?.length > 0) {
      // Group by brand
      const selectedBrands = new Set()

      filters.selectedModels.forEach((modelId) => {
        const car = cars.find((car) => car.id === modelId)
        if (car && car.brand) {
          selectedBrands.add(car.brand)
        }
      })

      // Add each brand as a filter
      Array.from(selectedBrands).forEach((brand) => {
        selectedFilters.push({
          id: brand,
          type: "brand",
          label: brand,
        })
      })
    }

    // Add year filter if selected
    if (filters.year) {
      selectedFilters.push({
        id: filters.year,
        type: "year",
        label: `${currentLocale === "ar" ? "سنة: " : "Year: "}${filters.year}`,
      })
    }

    // Add fuel type filters
    if (filters.fuelTypes?.length > 0) {
      filters.fuelTypes.forEach((fuelType) => {
        selectedFilters.push({
          id: fuelType,
          type: "fuelType",
          label: `${currentLocale === "ar" ? "الوقود: " : "Fuel: "}${fuelType}`,
        })
      })
    }

    // Add transmission filters
    if (filters.transmission?.length > 0) {
      filters.transmission.forEach((transmission) => {
        selectedFilters.push({
          id: transmission,
          type: "transmission",
          label: `${currentLocale === "ar" ? "ناقل الحركة: " : "Transmission: "}${transmission}`,
        })
      })
    }

    // Add seats filters
    if (filters.seats?.length > 0) {
      filters.seats.forEach((seat) => {
        selectedFilters.push({
          id: seat,
          type: "seats",
          label: `${currentLocale === "ar" ? "المقاعد: " : "Seats: "}${seat}`,
        })
      })
    }

    return selectedFilters
  }, [filters, cars, currentLocale])

  // Function to remove a specific filter
  const handleRemoveFilter = useCallback(
    (filterId, filterType) => {
      switch (filterType) {
        case "brand":
          // Remove all models of this brand
          setFilters((prevFilters) => ({
            ...prevFilters,
            selectedModels: prevFilters.selectedModels.filter((modelId) => {
              const car = cars.find((car) => car.id === modelId)
              return car && car.brand !== filterId
            }),
          }))
          break
        case "year":
          setFilters((prevFilters) => ({
            ...prevFilters,
            year: "",
          }))
          break
        case "fuelType":
          setFilters((prevFilters) => ({
            ...prevFilters,
            fuelTypes: prevFilters.fuelTypes.filter((fuelType) => fuelType !== filterId),
          }))
          break
        case "transmission":
          setFilters((prevFilters) => ({
            ...prevFilters,
            transmission: prevFilters.transmission.filter((transmission) => transmission !== filterId),
          }))
          break
        case "seats":
          setFilters((prevFilters) => ({
            ...prevFilters,
            seats: prevFilters.seats.filter((seats) => seats !== filterId),
          }))
          break
        default:
          break
      }
    },
    [cars],
  )

  // Function to clear all filters
  const handleClearAllFilters = () => {
    setFilters({
      priceRange: [40000, 250000],
      selectedModels: [],
      year: "",
      fuelTypes: [],
      transmission: [],
      seats: [],
    })
  }

  // Replace the main return statement in AllCarMainpage component with this updated layout
  return (
    <div className="container mx-auto py-0 sm:py-8" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop Sidebar - Only shown on desktop */}
        <div className="hidden lg:block lg:w-[280px] sticky top-4 self-start max-h-[calc(100vh-2rem)] rounded-xl overflow-hidden shadow-md">
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

          {/* Breadcrumb Navigation - Moved to where tags were */}
          <div className="mb-4">
            <Breadcrumb items={getBreadcrumbItems()} />
          </div>

          {/* PromoSlider - Now appears after the breadcrumb */}
          <div className="mb-6">
            <PromoSlider />
          </div>

          {/* Mobile-only filter button */}
          <div className="lg:hidden mb-4">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="w-full bg-brand-primary text-white py-3 px-4 rounded-[5px] flex items-center justify-center gap-2"
              aria-label={currentLocale === "ar" ? "فلترة السيارات" : "Filter Cars"}
            >
              <Filter className="h-5 w-5" />
              <span>{currentLocale === "ar" ? "فلترة النتائج" : "Filter Results"}</span>
            </button>
          </div>
          
          {/* Available Cars Header with Tags moved here */}
          <div className="bg-brand-light rounded-[10px] p-4 mb-6 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
              <div>
                <h2 className="text-xl font-bold text-brand-primary mb-2 md:mb-0 flex items-center gap-2">
                  <span>{isRTL ? "السيارات المتاحة" : "Available Cars"}</span>
                  <span className="bg-brand-primary text-brand-light px-2 py-1 rounded-full text-sm">
                    {filteredCars.length}
                  </span>
                </h2>
              </div>

              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <span className="text-sm font-medium text-brand-primary">{isRTL ? "الترتيب:" : "Sort:"}</span>
                <div className="relative">
                  <select
                    className="border bg-brand-light border-brand-primary text-brand-primary rounded-[5px] py-1 pl-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary appearance-none"
                    value={sortOption}
                    onChange={handleSortChange}
                    aria-label={isRTL ? "رتب حسب" : "Sort by"}
                  >
                    <option value="relevance">{isRTL ? "الصلة" : "Relevance"}</option>
                    <option value="price-asc">{isRTL ? "السعر: من الأقل للأعلى" : "Price: Low to High"}</option>
                    <option value="price-desc">{isRTL ? "السعر: من الأعلى للأقل" : "Price: High to Low"}</option>
                    <option value="newest">{isRTL ? "الأحدث" : "Newest First"}</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

          </div>
            {/* Selected Filters - Moved to Available Cars section */}
            <SelectedFilters
              selectedFilters={getSelectedFilters()}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
              language={currentLocale}
            />

          {/* Results Section */}
          <div id="results-top" style={{ animation: "0.2s ease-out forwards fadeIn" }}>
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
                  onClick={handleClearAllFilters}
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

      {/* Mobile Filter Sidebar - Only shown when active on mobile */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed top-0 left-0 right-0 bottom-0 bg-black/60 z-40 overflow-hidden backdrop-blur-[3px]"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div
            className="fixed top-0 left-0 right-0 bottom-0 bg-white z-50 overflow-y-auto shadow-lg"
            style={{ animation: "0.3s ease-out forwards slideIn" }}
          >
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
    </div>
  )
}

export default AllCarMainpage
