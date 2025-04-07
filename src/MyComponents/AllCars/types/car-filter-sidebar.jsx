"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Search, ChevronDown } from "lucide-react"
import { RangeSlider } from "./AllCarComponents/range-slider"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

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
`

const translations = {
  en: {
    filters: "Filters",
    priceRange: "Price Range",
    brandsAndModels: "Brands + Models",
    searchPlaceholder: "Search brands and models",
    year: "Year",
    fuelType: "Fuel Type",
    transmission: "Transmission",
    seats: "Seats",
    clearAllFilters: "Clear All Filters",
  },
  ar: {
    filters: "الفلاتر",
    priceRange: "نطاق السعر",
    brandsAndModels: "الماركات + الموديلات",
    searchPlaceholder: "البحث عن الماركات والموديلات",
    year: "السنة",
    fuelType: "نوع الوقود",
    transmission: "ناقل الحركة",
    seats: "المقاعد",
    clearAllFilters: "مسح جميع الفلاتر",
  },
}

function CarFilterSidebar({ onFilterChange, carModels, filters, language = "en" }) {
  const [localFilters, setLocalFilters] = useState({
    priceRange: filters.priceRange || [0, 1000000],
    brands: filters.brands || {},
    year: filters.year || "",
    fuelTypes: filters.fuelTypes || [],
    transmission: filters.transmission || [],
    seats: filters.seats || [],
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedBrands, setExpandedBrands] = useState([])
  const [openSections, setOpenSections] = useState({
    priceRange: true,
    brands: true,
    year: true,
    fuelType: true,
    transmission: true,
    seats: true,
  })

  const t = translations[language]
  const isRTL = language === "ar"

  const brandsData = useMemo(() => {
    if (!carModels || carModels.length === 0) return []

    const brands = {}
    carModels.forEach((car) => {
      const brandName = car.vehicle_brand_id?.name
      if (!brandName) return

      if (!brands[brandName]) {
        brands[brandName] = {
          id: car.vehicle_brand_id.id,
          name: brandName,
          models: [],
        }
      }

      // Check if this model is already added
      const modelExists = brands[brandName].models.some((model) => model.id === car.id)
      if (!modelExists) {
        brands[brandName].models.push({
          id: car.id,
          name: car.name,
          slug: car.slug,
        })
      }
    })

    return Object.values(brands)
  }, [carModels])

  const toggleBrand = useCallback((brandName) => {
    setExpandedBrands((prev) => (prev.includes(brandName) ? prev.filter((b) => b !== brandName) : [...prev, brandName]))
  }, [])

  const handleBrandCheck = useCallback(
    (brandName, checked) => {
      setLocalFilters((prev) => {
        const updatedBrands = { ...prev.brands }
        if (checked) {
          const brand = brandsData.find((b) => b.name === brandName)
          updatedBrands[brandName] = brand ? brand.models.map((model) => model.name) : []
        } else {
          delete updatedBrands[brandName]
        }
        return { ...prev, brands: updatedBrands }
      })
    },
    [brandsData],
  )

  const handleModelCheck = useCallback((brandName, modelName, checked) => {
    setLocalFilters((prev) => {
      const updatedBrands = { ...prev.brands }
      if (checked) {
        if (!updatedBrands[brandName]) {
          updatedBrands[brandName] = []
        }
        updatedBrands[brandName] = [...updatedBrands[brandName], modelName]
      } else {
        updatedBrands[brandName] = updatedBrands[brandName].filter((m) => m !== modelName)
        if (updatedBrands[brandName].length === 0) {
          delete updatedBrands[brandName]
        }
      }
      return { ...prev, brands: updatedBrands }
    })
  }, [])

  const handleFuelTypeChange = useCallback((fuelType, checked) => {
    setLocalFilters((prev) => ({
      ...prev,
      fuelTypes: checked ? [...prev.fuelTypes, fuelType] : prev.fuelTypes.filter((type) => type !== fuelType),
    }))
  }, [])

  const handleYearChange = useCallback((year) => {
    setLocalFilters((prev) => ({
      ...prev,
      year: prev.year === year.toString() ? "" : year.toString(),
    }))
  }, [])

  const handleTransmissionChange = useCallback((transmission, checked) => {
    setLocalFilters((prev) => ({
      ...prev,
      transmission: checked
        ? [...prev.transmission, transmission]
        : prev.transmission.filter((t) => t !== transmission),
    }))
  }, [])

  const handlePriceRangeChange = useCallback((newValue) => {
    setLocalFilters((prev) => ({
      ...prev,
      priceRange: newValue,
    }))
  }, [])

  const handleSeatChange = useCallback((seat, checked) => {
    setLocalFilters((prev) => ({
      ...prev,
      seats: checked ? [...prev.seats, seat] : prev.seats.filter((s) => s !== seat),
    }))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (JSON.stringify(localFilters) !== JSON.stringify(filters)) {
        console.log("Sending updated filters:", localFilters)
        onFilterChange(localFilters)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [localFilters, filters, onFilterChange])

  // Extract unique years from car models
  const years = useMemo(() => {
    if (!carModels || carModels.length === 0) return []
    return [...new Set(carModels.map((car) => car.mfg_year))].sort((a, b) => b - a)
  }, [carModels])

  // Extract unique fuel types from car models
  const fuelTypes = useMemo(() => {
    if (!carModels || carModels.length === 0) return []
    return [...new Set(carModels.map((car) => car.vehicle_fuel_type_id?.name).filter(Boolean))]
  }, [carModels])

  // Extract unique transmissions from car models
  const transmissions = useMemo(() => {
    if (!carModels || carModels.length === 0) return []
    return [...new Set(carModels.map((car) => car.transmission).filter(Boolean))]
  }, [carModels])

  // Extract unique seat capacities from car models
  const seats = useMemo(() => {
    if (!carModels || carModels.length === 0) return []

    // Get seat capacities from both direct property and specifications
    const allSeats = carModels.flatMap((car) => {
      const directSeats = car.seat_capacity?.toString()
      const specSeats = car.vehicle_specification_ids?.find((spec) => spec.display_name === "Seating Capacity")?.used

      return [directSeats, specSeats].filter(Boolean)
    })

    return [...new Set(allSeats)].sort()
  }, [carModels])

  const isBrandChecked = useCallback(
    (brandName) => {
      return !!localFilters.brands && !!localFilters.brands[brandName]
    },
    [localFilters.brands],
  )

  const isModelChecked = useCallback(
    (brandName, modelName) => {
      return (
        !!localFilters.brands && !!localFilters.brands[brandName] && localFilters.brands[brandName].includes(modelName)
      )
    },
    [localFilters.brands],
  )

  const formatPrice = useCallback(
    (price) => {
      return isRTL ? `${price.toLocaleString("ar-EG")} د.إ` : `₹ ${price.toLocaleString("en-IN")}`
    },
    [isRTL],
  )

  const filteredBrandsData = useMemo(() => {
    if (!searchTerm) return brandsData

    return brandsData
      .map((brand) => {
        const filteredModels = brand.models.filter((model) =>
          model.name.toLowerCase().includes(searchTerm.toLowerCase()),
        )

        if (brand.name.toLowerCase().includes(searchTerm.toLowerCase()) || filteredModels.length > 0) {
          return {
            ...brand,
            models: filteredModels,
          }
        }

        return null
      })
      .filter(Boolean)
  }, [brandsData, searchTerm])

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  // Find max price for range slider
  const maxPrice = useMemo(() => {
    if (!carModels || carModels.length === 0) return 1000000
    return Math.max(...carModels.map((car) => car.current_market_value || 0)) + 100000
  }, [carModels])

  return (
    <div className={`bg-white rounded-lg shadow flex flex-col h-screen ${isRTL ? "rtl" : "ltr"}`}>
      <style>{scrollbarStyles}</style>
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-brand-primary">{t.filters}</h2>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="custom-scrollbar-container h-full overflow-y-auto pr-2">
          <div className="p-4 space-y-6">
            {/* Price Range Section */}
            <Collapsible open={openSections.priceRange} onOpenChange={() => toggleSection("priceRange")}>
              <CollapsibleTrigger className="flex justify-between items-center w-full">
                <h3 className="text-lg font-semibold text-brand-primary">{t.priceRange}</h3>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${openSections.priceRange ? "rotate-180" : ""}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <RangeSlider
                  min={0}
                  max={maxPrice}
                  value={localFilters.priceRange}
                  onValueChange={handlePriceRangeChange}
                  onValueCommit={handlePriceRangeChange}
                  step={10000}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-brand-primary">
                  <div>{formatPrice(localFilters.priceRange[0])}</div>
                  <div>{formatPrice(localFilters.priceRange[1])}</div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Brands Section */}
            <Collapsible open={openSections.brands} onOpenChange={() => toggleSection("brands")}>
              <CollapsibleTrigger className="flex justify-between items-center w-full">
                <h3 className="text-lg font-semibold text-brand-primary">{t.brandsAndModels}</h3>
                <ChevronDown className={`w-4 h-4 transition-transform ${openSections.brands ? "rotate-180" : ""}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 pl-8 border rounded-md focus:outline-none focus:ring-brand-primary"
                  />
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-2">
                  {filteredBrandsData.map((brand) => (
                    <div key={brand.id} className="mb-2 border-b pb-2">
                      <div className="flex items-center justify-between w-full p-2 hover:bg-brand-primary/10 rounded">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={isBrandChecked(brand.name)}
                            onCheckedChange={(checked) => handleBrandCheck(brand.name, checked)}
                            className="rounded border-brand-primary text-brand-primary focus:ring-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:text-white checkbox-icon"
                          />
                          <span className="text-sm">{brand.name}</span>
                        </div>
                        <button onClick={() => toggleBrand(brand.name)}>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform text-brand-primary ${
                              expandedBrands.includes(brand.name) ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                      {(expandedBrands.includes(brand.name) || searchTerm) && (
                        <div className="ml-16 mt-2 space-y-2">
                          {brand.models.map((model) => (
                            <div key={model.id} className="flex items-center gap-2">
                              <Checkbox
                                checked={isModelChecked(brand.name, model.name)}
                                onCheckedChange={(checked) => handleModelCheck(brand.name, model.name, checked)}
                                className="rounded border-brand-primary text-brand-primary focus:ring-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:text-white checkbox-icon"
                              />
                              <span className="text-sm">{model.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Year Section */}
            <Collapsible open={openSections.year} onOpenChange={() => toggleSection("year")}>
              <CollapsibleTrigger className="flex justify-between items-center w-full">
                <h3 className="text-lg font-semibold text-brand-primary">{t.year}</h3>
                <ChevronDown className={`w-4 h-4 transition-transform ${openSections.year ? "rotate-180" : ""}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <div className="space-y-3">
                  {years.map((year) => (
                    <div key={year} className="flex items-center space-x-2">
                      <button onClick={() => handleYearChange(year)} className="flex items-center focus:outline-none">
                        <div
                          className={`w-4 h-4 rounded-full border-2 border-brand-primary flex items-center justify-center ${
                            localFilters.year === year.toString() ? "bg-brand-primary" : "bg-white"
                          }`}
                        >
                          {localFilters.year === year.toString() && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <Label className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {year}
                        </Label>
                      </button>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Fuel Type Section */}
            <Collapsible open={openSections.fuelType} onOpenChange={() => toggleSection("fuelType")}>
              <CollapsibleTrigger className="flex justify-between items-center w-full">
                <h3 className="text-lg font-semibold text-brand-primary">{t.fuelType}</h3>
                <ChevronDown className={`w-4 h-4 transition-transform ${openSections.fuelType ? "rotate-180" : ""}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <div className="space-y-3">
                  {fuelTypes.map((fuelType) => (
                    <div key={fuelType} className="flex items-center space-x-2">
                      <Checkbox
                        checked={Array.isArray(localFilters.fuelTypes) && localFilters.fuelTypes.includes(fuelType)}
                        onCheckedChange={(checked) => handleFuelTypeChange(fuelType, checked)}
                        className="rounded-sm border-brand-primary text-brand-primary focus:ring-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:text-white checkbox-icon"
                      />
                      <Label className="text-sm font-medium leading-none">{fuelType}</Label>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Transmission Section */}
            <Collapsible open={openSections.transmission} onOpenChange={() => toggleSection("transmission")}>
              <CollapsibleTrigger className="flex justify-between items-center w-full">
                <h3 className="text-lg font-semibold text-brand-primary">{t.transmission}</h3>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${openSections.transmission ? "rotate-180" : ""}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <div className="space-y-3">
                  {transmissions.map((transmission) => (
                    <div key={transmission} className="flex items-center space-x-2">
                      <Checkbox
                        checked={
                          Array.isArray(localFilters.transmission) && localFilters.transmission.includes(transmission)
                        }
                        onCheckedChange={(checked) => handleTransmissionChange(transmission, checked)}
                        className="rounded-sm border-brand-primary text-brand-primary focus:ring-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:text-white checkbox-icon"
                      />
                      <Label className="text-sm font-medium leading-none">{transmission}</Label>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Seats Section */}
            <Collapsible open={openSections.seats} onOpenChange={() => toggleSection("seats")}>
              <CollapsibleTrigger className="flex justify-between items-center w-full">
                <h3 className="text-lg font-semibold text-brand-primary">{t.seats}</h3>
                <ChevronDown className={`w-4 h-4 transition-transform ${openSections.seats ? "rotate-180" : ""}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <div className="space-y-3">
                  {seats.map((seat) => (
                    <div key={seat} className="flex items-center space-x-2">
                      <Checkbox
                        checked={localFilters.seats.includes(seat)}
                        onCheckedChange={(checked) => handleSeatChange(seat, checked)}
                        className="rounded-sm border-brand-primary text-brand-primary focus:ring-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:text-white checkbox-icon"
                      />
                      <Label className="text-sm font-medium leading-none">
                        {seat} {t.seats}
                      </Label>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 p-4 border-t bg-white">
        <Button
          onClick={() => {
            const clearedFilters = {
              priceRange: [0, maxPrice],
              brands: {},
              year: "",
              fuelTypes: [],
              transmission: [],
              seats: [],
            }
            setLocalFilters(clearedFilters)
            onFilterChange(clearedFilters)
          }}
          variant="outline"
          className="w-full border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-colors"
        >
          {t.clearAllFilters}
        </Button>
      </div>
    </div>
  )
}

export default CarFilterSidebar

