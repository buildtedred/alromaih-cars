"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Search, ChevronDown } from "lucide-react"
import { RangeSlider } from "../AllCarComponents/range-slider"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

// Custom styles for the sidebar
const customStyles = `
  /* Custom styles for details/summary elements */
  details {
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    margin-bottom: 0.5rem;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }
  
  details:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    border-color: #71308A50;
  }
  
  summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    cursor: pointer;
    background-color: white;
    transition: all 0.3s ease;
  }
  
  summary:hover {
    background-color: #f9fafb;
    color: #71308A;
  }
  
  summary::-webkit-details-marker {
    display: none;
  }
  
  details[open] > summary {
    background-color: #f9f6fb;
    border-bottom: 1px solid #e5e7eb;
  }
  
  details[open] > summary .chevron {
    transform: rotate(180deg);
  }
  
  .chevron {
    transition: transform 0.5s ease;
  }
  
  details > div {
    padding: 0.75rem;
    border-top: 1px solid #e5e7eb;
    animation: slideDown 0.4s ease-out;
    background-color: #fafafa;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Checkbox transitions */
  input[type="checkbox"] {
    transition: all 0.2s ease-in-out;
  }
  
  /* Input field transitions */
  input[type="text"] {
    transition: all 0.3s ease-in-out;
  }
  
  input[type="text"]:focus {
    box-shadow: 0 0 0 2px rgba(113, 48, 138, 0.2);
    border-color: #71308A;
  }
  
  /* Button transitions */
  button {
    transition: all 0.3s ease-in-out;
  }
  
  /* Scrollbar styles */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #71308A transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #71308A;
    border-radius: 4px;
  }
  
  /* Brand and model item transitions */
  .brand-item {
    transition: all 0.3s ease;
  }
  
  .brand-item:hover {
    background-color: rgba(113, 48, 138, 0.05);
    transform: translateX(2px);
  }
  
  .model-item {
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(-5px);
  }
  
  .model-item-visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  /* Filter section transitions */
  .filter-section {
    transition: all 0.3s ease;
  }
  
  /* Clear filters button transition */
  .clear-button {
    transition: all 0.3s ease;
  }
  
  .clear-button:hover {
    background-color: #71308A10;
    transform: translateY(-1px);
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

function CarFilterSidebar({ onFilterChange, filters = {}, language = "en", cars = [] }) {
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

  // Track which sections are expanded
  const [expandedSections, setExpandedSections] = useState({
    priceRange: false,
    brandsAndModels: false,
    year: false,
    fuelType: false,
    transmission: false,
    seats: false,
  })

  const t = translations[language] || translations.en
  const isRTL = language === "ar"

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Extract brands and models from cars data
  const brandsData = useMemo(() => {
    if (!cars || !Array.isArray(cars) || cars.length === 0) return []

    const brands = {}

    cars.forEach((car) => {
      if (!car || !car.brand) return

      const brandName = car.brand
      const modelName = typeof car.name === "object" ? car.name[language] || car.name.en : car.name

      if (!brands[brandName]) {
        brands[brandName] = {
          id: brandName,
          name: brandName,
          models: [],
        }
      }

      // Check if this model is already added
      const modelExists = brands[brandName].models.some((model) => model.name === modelName)
      if (!modelExists && modelName) {
        brands[brandName].models.push({
          id: car.id,
          name: modelName,
        })
      }
    })

    return Object.values(brands)
  }, [cars, language])

  // Toggle brand expansion
  const toggleBrand = useCallback((brandName) => {
    setExpandedBrands((prev) => (prev.includes(brandName) ? prev.filter((b) => b !== brandName) : [...prev, brandName]))
  }, [])

  // Handle brand checkbox change
  const handleBrandCheck = useCallback(
    (brandName, checked) => {
      setLocalFilters((prev) => {
        const updatedBrands = { ...prev.brands }

        if (checked) {
          // When a brand is checked, also expand it to show models
          if (!expandedBrands.includes(brandName)) {
            setExpandedBrands((prev) => [...prev, brandName])
          }

          const brand = brandsData.find((b) => b.name === brandName)
          updatedBrands[brandName] = brand ? brand.models.map((model) => model.name) : []
        } else {
          delete updatedBrands[brandName]
        }

        return { ...prev, brands: updatedBrands }
      })
    },
    [brandsData, expandedBrands],
  )

  // Handle model checkbox change
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

  // Handle fuel type checkbox change
  const handleFuelTypeChange = useCallback((fuelType, checked) => {
    setLocalFilters((prev) => {
      const currentFuelTypes = Array.isArray(prev.fuelTypes) ? prev.fuelTypes : []

      return {
        ...prev,
        fuelTypes: checked ? [...currentFuelTypes, fuelType] : currentFuelTypes.filter((type) => type !== fuelType),
      }
    })
  }, [])

  // Handle year checkbox change
  const handleYearChange = useCallback((year, checked) => {
    setLocalFilters((prev) => ({
      ...prev,
      year: checked ? year.toString() : "",
    }))
  }, [])

  // Handle transmission checkbox change
  const handleTransmissionChange = useCallback((transmission, checked) => {
    setLocalFilters((prev) => {
      const currentTransmission = Array.isArray(prev.transmission) ? prev.transmission : []

      return {
        ...prev,
        transmission: checked
          ? [...currentTransmission, transmission]
          : currentTransmission.filter((t) => t !== transmission),
      }
    })
  }, [])

  // Handle price range change
  const handlePriceRangeChange = useCallback((newValue) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      const validatedValue = [
        Math.max(0, Math.min(1000000, Number(newValue[0]) || 0)),
        Math.max(0, Math.min(1000000, Number(newValue[1]) || 1000000)),
      ]

      setLocalFilters((prev) => ({
        ...prev,
        priceRange: validatedValue,
      }))
    }
  }, [])

  // Handle seat checkbox change
  const handleSeatChange = useCallback((seat, checked) => {
    setLocalFilters((prev) => {
      const currentSeats = Array.isArray(prev.seats) ? prev.seats : []

      return {
        ...prev,
        seats: checked ? [...currentSeats, seat] : currentSeats.filter((s) => s !== seat),
      }
    })
  }, [])

  // Apply filter changes
  useEffect(() => {
    if (JSON.stringify(localFilters) !== JSON.stringify(filters)) {
      onFilterChange(localFilters)
    }
  }, [localFilters, filters, onFilterChange])

  // Check if a brand is checked
  const isBrandChecked = useCallback(
    (brandName) => {
      return !!localFilters.brands && !!localFilters.brands[brandName]
    },
    [localFilters.brands],
  )

  // Check if a model is checked
  const isModelChecked = useCallback(
    (brandName, modelName) => {
      return (
        !!localFilters.brands && !!localFilters.brands[brandName] && localFilters.brands[brandName].includes(modelName)
      )
    },
    [localFilters.brands],
  )

  // Format price based on language
  const formatPrice = useCallback(
    (price) => {
      return isRTL ? `${price.toLocaleString("ar-EG")} د.إ` : `₹ ${price.toLocaleString("en-IN")}`
    },
    [isRTL],
  )

  // Filter brands based on search term
  const filteredBrandsData = useMemo(() => {
    if (!searchTerm) return brandsData

    return brandsData
      .map((brand) => {
        const brandMatches = brand.name.toLowerCase().includes(searchTerm.toLowerCase())
        const filteredModels = brand.models.filter((model) =>
          model.name.toLowerCase().includes(searchTerm.toLowerCase()),
        )

        if (brandMatches || filteredModels.length > 0) {
          if (filteredModels.length > 0 && !expandedBrands.includes(brand.name)) {
            setExpandedBrands((prev) => [...prev, brand.name])
          }

          return {
            ...brand,
            models: brandMatches ? brand.models : filteredModels,
          }
        }

        return null
      })
      .filter(Boolean)
  }, [brandsData, searchTerm, expandedBrands])

  // Find max price for range slider
  const maxPrice = useMemo(() => {
    if (!cars || !Array.isArray(cars) || cars.length === 0) return 1000000
    return Math.max(...cars.map((car) => car.cashPrice || 0)) + 100000
  }, [cars])

  // Extract unique years, fuel types, transmissions, and seats from cars data
  const uniqueYears = useMemo(() => {
    if (!cars || !Array.isArray(cars)) return []
    return [...new Set(cars.map((car) => car.specs?.year).filter(Boolean))].sort((a, b) => b - a)
  }, [cars])

  const uniqueFuelTypes = useMemo(() => {
    if (!cars || !Array.isArray(cars)) return []
    return [
      ...new Set(
        cars
          .map((car) => {
            if (!car.specs?.fuelType) return null
            return typeof car.specs.fuelType === "object"
              ? car.specs.fuelType[language] || car.specs.fuelType.en
              : car.specs.fuelType
          })
          .filter(Boolean),
      ),
    ]
  }, [cars, language])

  const uniqueTransmissions = useMemo(() => {
    if (!cars || !Array.isArray(cars)) return []
    return [
      ...new Set(
        cars
          .map((car) => {
            if (!car.specs?.transmission) return null
            return typeof car.specs.transmission === "object"
              ? car.specs.transmission[language] || car.specs.transmission.en
              : car.specs.transmission
          })
          .filter(Boolean),
      ),
    ]
  }, [cars, language])

  const uniqueSeats = useMemo(() => {
    if (!cars || !Array.isArray(cars)) return []
    return [
      ...new Set(
        cars
          .map((car) => {
            if (!car.specs?.seats) return null
            return typeof car.specs.seats === "object"
              ? car.specs.seats[language] || car.specs.seats.en
              : car.specs.seats
          })
          .filter(Boolean),
      ),
    ]
  }, [cars, language])

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    const clearedFilters = {
      priceRange: [0, maxPrice],
      brands: {},
      year: "",
      fuelTypes: [],
      transmission: [],
      seats: [],
    }

    setLocalFilters(clearedFilters)
    setSearchTerm("")
    setExpandedBrands([])
    onFilterChange(clearedFilters)
  }, [maxPrice, onFilterChange])

  return (
    <div className={`bg-white rounded-lg shadow flex flex-col h-[calc(100vh-2rem)] ${isRTL ? "rtl" : "ltr"}`}>
      <style>{customStyles}</style>

      {/* Header */}
      <div className="p-3 border-b sticky top-0 bg-white z-10">
        <h2 className="text-lg font-bold text-brand-primary">{t.filters}</h2>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto custom-scrollbar p-3 pb-16">
        {/* Price Range Section */}
        <details open={expandedSections.priceRange} className="filter-section">
          <summary
            onClick={(e) => {
              e.preventDefault()
              toggleSection("priceRange")
            }}
          >
            <h3 className="text-base font-semibold text-brand-primary">{t.priceRange}</h3>
            <ChevronDown
              className={`w-4 h-4 text-brand-primary chevron ${expandedSections.priceRange ? "rotate-180" : ""}`}
            />
          </summary>
          <div>
            <RangeSlider
              min={0}
              max={maxPrice}
              value={localFilters.priceRange}
              onValueChange={handlePriceRangeChange}
              onValueCommit={handlePriceRangeChange}
              step={10000}
              className="mb-2 mt-4"
            />
            <div className="flex justify-between text-sm text-brand-primary">
              <div>{formatPrice(localFilters.priceRange[0])}</div>
              <div>{formatPrice(localFilters.priceRange[1])}</div>
            </div>
          </div>
        </details>

        {/* Brands Section */}
        <details open={expandedSections.brandsAndModels} className="filter-section">
          <summary
            onClick={(e) => {
              e.preventDefault()
              toggleSection("brandsAndModels")
            }}
          >
            <h3 className="text-base font-semibold text-brand-primary">{t.brandsAndModels}</h3>
            <ChevronDown
              className={`w-4 h-4 text-brand-primary chevron ${expandedSections.brandsAndModels ? "rotate-180" : ""}`}
            />
          </summary>
          <div>
            <div className="relative mb-3">
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-8 border-2 border-brand-primary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm"
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {filteredBrandsData.map((brand) => (
                <div key={brand.id} className="mb-1 border-b pb-1">
                  <div className="flex items-center justify-between w-full p-1 hover:bg-brand-primary/10 rounded-md brand-item">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={isBrandChecked(brand.name)}
                        onCheckedChange={(checked) => handleBrandCheck(brand.name, checked)}
                        className="rounded-md border-brand-primary text-brand-primary focus:ring-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:text-white transition-all duration-300"
                      />
                      <span className="text-sm">{brand.name}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        toggleBrand(brand.name)
                      }}
                      className="transition-all duration-300 hover:bg-brand-primary/10 rounded-full p-1"
                      type="button"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-500 text-brand-primary ${
                          expandedBrands.includes(brand.name) ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                  {(expandedBrands.includes(brand.name) || searchTerm) && (
                    <div className="ml-6 mt-1 space-y-1">
                      {brand.models.map((model, index) => (
                        <div
                          key={model.id}
                          className={`flex items-center gap-2 model-item ${expandedBrands.includes(brand.name) ? "model-item-visible" : ""}`}
                          style={{ transitionDelay: `${index * 50}ms` }}
                        >
                          <Checkbox
                            checked={isModelChecked(brand.name, model.name)}
                            onCheckedChange={(checked) => handleModelCheck(brand.name, model.name, checked)}
                            className="rounded-md border-brand-primary text-brand-primary focus:ring-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:text-white transition-all duration-300"
                          />
                          <span className="text-sm">{model.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </details>

        {/* Year Section */}
        <details open={expandedSections.year} className="filter-section">
          <summary
            onClick={(e) => {
              e.preventDefault()
              toggleSection("year")
            }}
          >
            <h3 className="text-base font-semibold text-brand-primary">{t.year}</h3>
            <ChevronDown
              className={`w-4 h-4 text-brand-primary chevron ${expandedSections.year ? "rotate-180" : ""}`}
            />
          </summary>
          <div>
            <div className="space-y-2">
              {uniqueYears.map((year) => (
                <div key={year} className="flex items-center space-x-2">
                  <Checkbox
                    id={`year-${year}`}
                    checked={localFilters.year === year.toString()}
                    onCheckedChange={(checked) => handleYearChange(year, checked)}
                    className="rounded-md border-brand-primary text-brand-primary focus:ring-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:text-white"
                  />
                  <Label htmlFor={`year-${year}`} className="text-sm font-medium leading-none cursor-pointer">
                    {year}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </details>

        {/* Fuel Type Section */}
        <details open={expandedSections.fuelType} className="filter-section">
          <summary
            onClick={(e) => {
              e.preventDefault()
              toggleSection("fuelType")
            }}
          >
            <h3 className="text-base font-semibold text-brand-primary">{t.fuelType}</h3>
            <ChevronDown
              className={`w-4 h-4 text-brand-primary chevron ${expandedSections.fuelType ? "rotate-180" : ""}`}
            />
          </summary>
          <div>
            <div className="space-y-2">
              {uniqueFuelTypes.map((fuelType) => (
                <div key={fuelType} className="flex items-center space-x-2">
                  <Checkbox
                    id={`fuel-${fuelType}`}
                    checked={Array.isArray(localFilters.fuelTypes) && localFilters.fuelTypes.includes(fuelType)}
                    onCheckedChange={(checked) => handleFuelTypeChange(fuelType, checked)}
                    className="rounded-md border-brand-primary text-brand-primary focus:ring-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:text-white"
                  />
                  <Label htmlFor={`fuel-${fuelType}`} className="text-sm font-medium leading-none cursor-pointer">
                    {fuelType}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </details>

        {/* Transmission Section */}
        <details open={expandedSections.transmission} className="filter-section">
          <summary
            onClick={(e) => {
              e.preventDefault()
              toggleSection("transmission")
            }}
          >
            <h3 className="text-base font-semibold text-brand-primary">{t.transmission}</h3>
            <ChevronDown
              className={`w-4 h-4 text-brand-primary chevron ${expandedSections.transmission ? "rotate-180" : ""}`}
            />
          </summary>
          <div>
            <div className="space-y-2">
              {uniqueTransmissions.map((transmission) => (
                <div key={transmission} className="flex items-center space-x-2">
                  <Checkbox
                    id={`transmission-${transmission}`}
                    checked={
                      Array.isArray(localFilters.transmission) && localFilters.transmission.includes(transmission)
                    }
                    onCheckedChange={(checked) => handleTransmissionChange(transmission, checked)}
                    className="rounded-md border-brand-primary text-brand-primary focus:ring-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:text-white"
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
        </details>

        {/* Seats Section */}
        <details open={expandedSections.seats} className="filter-section">
          <summary
            onClick={(e) => {
              e.preventDefault()
              toggleSection("seats")
            }}
          >
            <h3 className="text-base font-semibold text-brand-primary">{t.seats}</h3>
            <ChevronDown
              className={`w-4 h-4 text-brand-primary chevron ${expandedSections.seats ? "rotate-180" : ""}`}
            />
          </summary>
          <div>
            <div className="space-y-2">
              {uniqueSeats.map((seatOption) => (
                <div key={seatOption} className="flex items-center space-x-2">
                  <Checkbox
                    id={`seats-${seatOption}`}
                    checked={localFilters.seats.includes(seatOption)}
                    onCheckedChange={(checked) => handleSeatChange(seatOption, checked)}
                    className="rounded-md border-brand-primary text-brand-primary focus:ring-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:text-white"
                  />
                  <Label htmlFor={`seats-${seatOption}`} className="text-sm font-medium leading-none cursor-pointer">
                    {seatOption}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </details>
      </div>

      {/* Footer */}
      <div className="p-3 border-t sticky bottom-0 bg-white z-10 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <Button
          onClick={clearAllFilters}
          variant="outline"
          className="w-full border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-500 clear-button hover:shadow-md"
        >
          {t.clearAllFilters}
        </Button>
      </div>
    </div>
  )
}

export default CarFilterSidebar
