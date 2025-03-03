"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Search, ChevronDown } from "lucide-react"
import { RangeSlider } from "../AllCarComponents/range-slider"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { SidebarSeparator } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const scrollbarStyles = `
/* Hide default scrollbar */
.custom-scrollbar-container {
  scrollbar-width: thin;
  scrollbar-color: #71308A transparent;
}
.custom-scrollbar-container::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar-container::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar-container::-webkit-scrollbar-thumb {
  background-color: #71308A;
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

function CarFilterSidebarComponent({ onFilterChange, carModels, filters, language = "en" }) {
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

  const toggleBrand = useCallback((brandName) => {
    setExpandedBrands((prev) => (prev.includes(brandName) ? prev.filter((b) => b !== brandName) : [...prev, brandName]))
  }, [])

  const handleBrandCheck = useCallback(
    (brandName, checked) => {
      setLocalFilters((prev) => {
        const updatedBrands = { ...prev.brands }
        if (checked) {
          const brand = brandsData.find((b) => b.name[language] === brandName)
          updatedBrands[brandName] = brand ? brand.models.map((model) => model.name[language].name) : []
        } else {
          delete updatedBrands[brandName]
        }
        return { ...prev, brands: updatedBrands }
      })
    },
    [language],
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

  const years = useMemo(() => {
    return [...new Set(carModels.map((car) => car.year_of_manufacture))].sort((a, b) => b - a)
  }, [carModels])

  const fuelTypes = useMemo(() => {
    return [...new Set(carModels.flatMap((car) => car.vehicle_fuel_types.map((fuel) => fuel.fuel_type[language])))]
  }, [carModels, language])

  const transmissions = useMemo(() => {
    return [...new Set(carModels.map((car) => car.name[language].transmission).filter(Boolean))]
  }, [carModels, language])

  const seats = useMemo(() => {
    return [...new Set(carModels.map((car) => car.seating_capacity))].sort((a, b) => a - b)
  }, [carModels])

  const brandsData = useMemo(() => {
    const brands = {}
    carModels.forEach((car) => {
      if (!brands[car.brand_name[language]]) {
        brands[car.brand_name[language]] = {
          id: car.brand_id,
          name: car.brand_name,
          models: [],
        }
      }
      brands[car.brand_name[language]].models.push(car)
    })
    return Object.values(brands)
  }, [carModels, language])

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
          model.name[language].name.toLowerCase().includes(searchTerm.toLowerCase()),
        )

        if (brand.name[language].toLowerCase().includes(searchTerm.toLowerCase()) || filteredModels.length > 0) {
          return {
            ...brand,
            models: filteredModels,
          }
        }

        return null
      })
      .filter(Boolean)
  }, [brandsData, searchTerm, language])

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className={`bg-white rounded-lg shadow flex flex-col h-screen ${isRTL ? "rtl" : "ltr"}`}>
      <style>{scrollbarStyles}</style>
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-[#71308A]">{t.filters}</h2>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="custom-scrollbar-container h-full overflow-y-auto pr-2" >
          <div className="p-4 space-y-6">
            {/* Price Range Section */}
            <Collapsible open={openSections.priceRange} onOpenChange={() => toggleSection("priceRange")}>
              <CollapsibleTrigger className="flex justify-between items-center w-full">
                <h3 className="text-lg font-semibold text-[#71308A]">{t.priceRange}</h3>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${openSections.priceRange ? "rotate-180" : ""}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <RangeSlider
                  min={0}
                  max={1000000}
                  value={localFilters.priceRange}
                  onValueChange={handlePriceRangeChange}
                  onValueCommit={handlePriceRangeChange}
                  step={10000}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-[#71308A]">
                  <div>{formatPrice(localFilters.priceRange[0])}</div>
                  <div>{formatPrice(localFilters.priceRange[1])}</div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <SidebarSeparator />

            {/* Brands Section */}
            <Collapsible open={openSections.brands} onOpenChange={() => toggleSection("brands")}>
              <CollapsibleTrigger className="flex justify-between items-center w-full">
                <h3 className="text-lg font-semibold text-[#71308A]">{t.brandsAndModels}</h3>
                <ChevronDown className={`w-4 h-4 transition-transform ${openSections.brands ? "rotate-180" : ""}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 pl-8 border rounded-md focus:outline-none focus:ring-[#71308A]"
                  />
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-2">
                  {filteredBrandsData.map((brand) => (
                    <div key={brand.id} className="mb-2 border-b pb-2">
                      <div className="flex items-center justify-between w-full p-2 hover:bg-[#71308A]/10 rounded">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={isBrandChecked(brand.name[language])}
                            onCheckedChange={(checked) => handleBrandCheck(brand.name[language], checked)}
                            className="rounded border-[#71308A] text-[#71308A] focus:ring-[#71308A] data-[state=checked]:bg-[#71308A] data-[state=checked]:text-white checkbox-icon"
                          />
                          <span className="text-sm">{brand.name[language]}</span>
                        </div>
                        <button onClick={() => toggleBrand(brand.name[language])}>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform text-[#71308A] ${
                              expandedBrands.includes(brand.name[language]) ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                      {(expandedBrands.includes(brand.name[language]) || searchTerm) && (
                        <div className="ml-16 mt-2 space-y-2">
                          {brand.models.map((model) => (
                            <div key={model.id} className="flex items-center gap-2">
                              <Checkbox
                                checked={isModelChecked(brand.name[language], model.name[language].name)}
                                onCheckedChange={(checked) =>
                                  handleModelCheck(brand.name[language], model.name[language].name, checked)
                                }
                                className="rounded border-[#71308A] text-[#71308A] focus:ring-[#71308A] data-[state=checked]:bg-[#71308A] data-[state=checked]:text-white checkbox-icon"
                              />
                              <span className="text-sm">{model.name[language].name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <SidebarSeparator />

            {/* Year Section */}
            <Collapsible open={openSections.year} onOpenChange={() => toggleSection("year")}>
              <CollapsibleTrigger className="flex justify-between items-center w-full">
                <h3 className="text-lg font-semibold text-[#71308A]">{t.year}</h3>
                <ChevronDown className={`w-4 h-4 transition-transform ${openSections.year ? "rotate-180" : ""}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <div className="space-y-3">
                  {years.map((year) => (
                    <div key={year} className="flex items-center space-x-2">
                      <button onClick={() => handleYearChange(year)} className="flex items-center focus:outline-none">
                        <div
                          className={`w-4 h-4 rounded-full border-2 border-[#71308A] flex items-center justify-center ${
                            localFilters.year === year.toString() ? "bg-[#71308A]" : "bg-white"
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

            <SidebarSeparator />

            {/* Fuel Type Section */}
            <Collapsible open={openSections.fuelType} onOpenChange={() => toggleSection("fuelType")}>
              <CollapsibleTrigger className="flex justify-between items-center w-full">
                <h3 className="text-lg font-semibold text-[#71308A]">{t.fuelType}</h3>
                <ChevronDown className={`w-4 h-4 transition-transform ${openSections.fuelType ? "rotate-180" : ""}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <div className="space-y-3">
                  {fuelTypes.map((fuelType) => (
                    <div key={fuelType} className="flex items-center space-x-2">
                      <Checkbox
                        checked={Array.isArray(localFilters.fuelTypes) && localFilters.fuelTypes.includes(fuelType)}
                        onCheckedChange={(checked) => handleFuelTypeChange(fuelType, checked)}
                        className="rounded-sm border-[#71308A] text-[#71308A] focus:ring-[#71308A] data-[state=checked]:bg-[#71308A] data-[state=checked]:text-white checkbox-icon"
                      />
                      <Label className="text-sm font-medium leading-none">{fuelType}</Label>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <SidebarSeparator />

            {/* Transmission Section */}
            <Collapsible open={openSections.transmission} onOpenChange={() => toggleSection("transmission")}>
              <CollapsibleTrigger className="flex justify-between items-center w-full">
                <h3 className="text-lg font-semibold text-[#71308A]">{t.transmission}</h3>
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
                        className="rounded-sm border-[#71308A] text-[#71308A] focus:ring-[#71308A] data-[state=checked]:bg-[#71308A] data-[state=checked]:text-white checkbox-icon"
                      />
                      <Label className="text-sm font-medium leading-none">{transmission}</Label>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <SidebarSeparator />

            {/* Seats Section */}
            <Collapsible open={openSections.seats} onOpenChange={() => toggleSection("seats")}>
              <CollapsibleTrigger className="flex justify-between items-center w-full">
                <h3 className="text-lg font-semibold text-[#71308A]">{t.seats}</h3>
                <ChevronDown className={`w-4 h-4 transition-transform ${openSections.seats ? "rotate-180" : ""}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <div className="space-y-3">
                  {seats.map((seat) => (
                    <div key={seat} className="flex items-center space-x-2">
                      <Checkbox
                        checked={localFilters.seats.includes(seat)}
                        onCheckedChange={(checked) => handleSeatChange(seat, checked)}
                        className="rounded-sm border-[#71308A] text-[#71308A] focus:ring-[#71308A] data-[state=checked]:bg-[#71308A] data-[state=checked]:text-white checkbox-icon"
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
      {/* Add sticky positioning to keep the button always visible */}
      {/* <div className="sticky bottom-0 p-4 border-t bg-white">
        <Button
          onClick={() => {
            const clearedFilters = {
              priceRange: [0, 1000000],
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
          className="w-full border-[#71308A] text-[#71308A] hover:bg-[#71308A] hover:text-white transition-colors"
        >
          {t.clearAllFilters}
        </Button>
      </div> */}
    </div>
  )
}

export default CarFilterSidebarComponent

