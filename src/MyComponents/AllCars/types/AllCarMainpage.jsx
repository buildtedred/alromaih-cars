"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import carsData from "@/app/api/mock-data" // Import your existing mock data
import { Search, ChevronDown, ChevronUp, X, Filter, Check, SlidersHorizontal, Sparkles } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { PromoSlider } from "../AllCarComponents/promo-slider"
import { RangeSlider } from "../AllCarComponents/range-slider"
import { CarGrid } from "../AllCarComponents/car-grid"
import CarSkeletonUI from "@/app/[locale]/all-cars/CarSkeletonUI"
import { useDetailContext } from "@/contexts/detailProvider"

// Update the scrollbarStyles to use primary color and have a more premium look
const scrollbarStyles = `
/* Premium scrollbar */
.custom-scrollbar-container {
  scrollbar-width: thin;
  scrollbar-color: #46194F transparent;
}
.custom-scrollbar-container::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar-container::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar-container::-webkit-scrollbar-thumb {
  background-color: #46194F;
  border-radius: 20px;
}
.custom-scrollbar-container::-webkit-scrollbar-thumb:hover {
  background-color: #46194F;
  opacity: 0.9;
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

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(70, 25, 79, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(70, 25, 79, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(70, 25, 79, 0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out forwards;
}

.animate-slideUp {
  animation: slideUp 0.3s ease-out forwards;
}

.animate-pulse {
  animation: pulse 1.5s infinite;
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
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

/* Premium hover effects */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(70, 25, 79, 0.1), 0 8px 10px -6px rgba(70, 25, 79, 0.1);
}

/* Premium filter section */
.filter-section {
  border-radius: 16px;
  transition: all 0.3s ease;
  overflow: hidden;
  border: 1px solid rgba(70, 25, 79, 0.08);
  margin-bottom: 12px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.filter-section:hover {
  border-color: rgba(70, 25, 79, 0.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.filter-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(to right, rgba(70, 25, 79, 0.02), transparent);
}

.filter-section-header:hover h4 {
  color: #46194F;
}

.filter-section-content {
  padding: 0 20px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease, padding 0.4s ease;
}

.filter-section.expanded .filter-section-content {
  max-height: 500px;
  padding: 0 20px 20px;
}

.filter-section.expanded {
  border-color: rgba(70, 25, 79, 0.15);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

/* Premium button styling */
.premium-button {
  position: relative;
  overflow: hidden;
  padding: 14px 24px;
  border-radius: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.4s ease;
  box-shadow: 0 4px 15px rgba(70, 25, 79, 0.2);
  background-size: 200% auto;
  border: none;
  cursor: pointer;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.premium-button:hover {
  background-position: right center;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(70, 25, 79, 0.3);
}

.premium-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(70, 25, 79, 0.2);
}

.premium-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.6s ease;
}

.premium-button:hover::before {
  left: 100%;
}

.primary-button {
  background: linear-gradient(135deg, #46194F 0%, #6a2a7a 50%, #46194F 100%);
  color: white;
  background-size: 200% auto;
}

.secondary-button {
  background: white;
  color: #46194F;
  border: 2px solid #46194F;
}

.secondary-button:hover {
  background-color: rgba(70, 25, 79, 0.05);
}

/* Update the filter button styling */
.filter-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #46194F 0%, #6a2a7a 50%, #46194F 100%);
  background-size: 200% auto;
  color: white;
  border: none;
  border-radius: 14px;
  padding: 16px 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.4s ease;
  box-shadow: 0 4px 15px rgba(70, 25, 79, 0.2);
  width: 100%;
  margin: 16px 0;
  position: relative;
  overflow: hidden;
}

.filter-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.6s ease;
}

.filter-button:hover::before {
  left: 100%;
}

.filter-button:hover {
  background-position: right center;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(70, 25, 79, 0.3);
}

.filter-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(70, 25, 79, 0.2);
}

/* Premium card */
.premium-card {
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.premium-card:hover {
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

/* Premium checkbox styling */
.checkbox-container {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 12px;
  transition: all 0.2s ease;
  margin-bottom: 4px;
}

.checkbox-container:hover {
  background-color: rgba(70, 25, 79, 0.05);
}

.checkbox-container.selected {
  background-color: rgba(70, 25, 79, 0.1);
  border: 1px solid rgba(70, 25, 79, 0.2);
}

/* Year button styling */
.year-button {
  padding: 12px;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  text-align: center;
  border: 1px solid rgba(70, 25, 79, 0.1);
  background: white;
}

.year-button:hover {
  background-color: rgba(70, 25, 79, 0.05);
  border-color: rgba(70, 25, 79, 0.2);
}

.year-button.selected {
  background: linear-gradient(135deg, #46194F 0%, #5a2266 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(70, 25, 79, 0.3);
  border-color: transparent;
}

/* Premium input styling */
.premium-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 2px solid rgba(70, 25, 79, 0.1);
  transition: all 0.3s ease;
  background-color: white;
  font-size: 15px;
}

.premium-input:focus {
  outline: none;
  border-color: #46194F;
  box-shadow: 0 0 0 3px rgba(70, 25, 79, 0.1);
}

.premium-input::placeholder {
  color: rgba(0, 0, 0, 0.4);
}

/* Search input specific styling */
.search-input {
  padding-left: 30px; /* Space for the icon */
}

.search-input::placeholder {
  padding-left: 5px; /* Add padding to the placeholder text */
  font-size: 13px;
}

/* Filter header styling */
.filter-header {
  background: linear-gradient(135deg, rgba(70, 25, 79, 0.15) 0%, rgba(70, 25, 79, 0.05) 100%);
  border-bottom: 1px solid rgba(70, 25, 79, 0.1);
  padding: 20px;
  border-radius: 20px 20px 0 0;
}

/* Filter badge */
.filter-badge {
  background: linear-gradient(135deg, #46194F 0%, #6a2a7a 100%);
  color: white;
  border-radius: 20px;
  padding: 4px 12px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(70, 25, 79, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* Filter footer */
.filter-footer {
  background: linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.9) 100%);
  backdrop-filter: blur(5px);
  border-top: 1px solid rgba(70, 25, 79, 0.1);
  padding: 16px 20px;
  border-radius: 0 0 20px 20px;
}

/* Mobile filter header */
.mobile-filter-header {
  background: linear-gradient(135deg, #46194F 0%, #5a2266 100%);
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 20;
}

/* Mobile filter footer */
.mobile-filter-footer {
  background: white;
  border-top: 1px solid rgba(70, 25, 79, 0.1);
  padding: 16px;
  position: sticky;
  bottom: 0;
  z-index: 20;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 12px;
}

/* Price display */
.price-display {
  background: linear-gradient(135deg, rgba(70, 25, 79, 0.1) 0%, rgba(70, 25, 79, 0.05) 100%);
  padding: 8px 16px;
  border-radius: 12px;
  font-weight: 500;
  color: #46194F;
  display: inline-block;
  border: 1px solid rgba(70, 25, 79, 0.1);
}
`

// Update the CarFilterSidebar component with a more premium design
const CarFilterSidebar = ({ onFilterChange, filters, language, cars, isMobile = false, onClose }) => {
  const {searchbrands}=useDetailContext()
  const [expandedBrands, setExpandedBrands] = useState([])
  const [searchTerm, setSearchTerm] = useState(searchbrands?.brand)
  // Add state to track which sections are expanded
  const [expandedSections, setExpandedSections] = useState({
    priceRange: true,
    brandsAndModels: true,
    year: true,
    fuelType: true,
    transmission: true,
    seats: true,
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

  // Function to apply filters and close sidebar on mobile
  const applyFilters = () => {
    if (isMobile && onClose) {
      onClose()
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

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <div className="premium-card h-full flex flex-col">
      {/* Mobile filter header */}
      {isMobile ? (
        <div className="mobile-filter-header">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {language === "ar" ? "الفلاتر" : "Filters"}
            {activeFiltersCount > 0 && (
              <span className="ml-2 bg-white text-brand-primary rounded-full px-2.5 py-0.5 text-xs font-bold">
                {activeFiltersCount}
              </span>
            )}
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-white hover:bg-white/20">
            <X className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        /* Desktop filter header */
        <div className="filter-header">
          <h3 className="text-xl font-bold text-brand-primary flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {language === "ar" ? "الفلاتر" : "Filters"}
            {activeFiltersCount > 0 && (
              <span className="ml-2 filter-badge">
                <Sparkles className="h-3.5 w-3.5" />
                {activeFiltersCount}
              </span>
            )}
          </h3>
        </div>
      )}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar-container">
        <div className="p-5 space-y-5">
          {/* Price Range Section */}
          <div className={`filter-section ${expandedSections.priceRange ? "expanded" : ""}`}>
            <div className="filter-section-header" onClick={(e) => toggleSection("priceRange", e)}>
              <h4 className="font-semibold text-brand-primary text-lg">
                {language === "ar" ? "نطاق السعر" : "Price Range"}
              </h4>
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-brand-primary/10">
                <ChevronDown
                  className={`h-5 w-5 text-brand-primary transition-transform duration-300 ${
                    expandedSections.priceRange ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            <div className="filter-section-content">
              <RangeSlider
                min={0}
                max={maxPrice}
                value={filters.priceRange}
                onValueChange={handlePriceRangeChange}
                onValueCommit={handlePriceRangeChange}
                step={10000}
                className="mb-2 mt-6"
              />

              {/* Price range display */}
              <div className="flex justify-between text-sm mt-6 font-medium">
                <span className="price-display">{formatPrice(filters.priceRange[0])}</span>
                <span className="price-display">{formatPrice(filters.priceRange[1])}</span>
              </div>
            </div>
          </div>

          {/* Brands + Models Section */}
          <div className={`filter-section ${expandedSections.brandsAndModels ? "expanded" : ""}`}>
            <div className="filter-section-header" onClick={(e) => toggleSection("brandsAndModels", e)}>
              <h4 className="font-semibold text-brand-primary text-lg">
                {language === "ar" ? "الماركات + الموديلات" : "Brands + Models"}
              </h4>
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-brand-primary/10">
                <ChevronDown
                  className={`h-5 w-5 text-brand-primary transition-transform duration-300 ${
                    expandedSections.brandsAndModels ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            <div className="filter-section-content">
              {/* Search box */}
              <div className="relative mb-5 mt-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-primary h-4 w-4" />
                  <input
                    type="text"
                    placeholder={language === "ar" ? "ابحث عن الماركات والموديلات" : "Search brands and models"}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="premium-input search-input text-sm"
                  />
                </div>
              </div>

              {/* Brand list */}
              <div className="space-y-4">
                {filteredBrands.map((brand) => (
                  <div key={brand} className="border-b border-gray-100 pb-4">
                    <div
                      className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                        areAllModelsSelected(brand)
                          ? "bg-brand-primary/10 border border-brand-primary/30"
                          : "hover:bg-brand-primary/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={`brand-${brand}`}
                          checked={areAllModelsSelected(brand) }
                          onCheckedChange={(checked) => handleBrandCheck(brand, checked)}
                          className="rounded-sm border-brand-primary text-brand-primary focus:ring-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:text-white h-4 w-4"
                        />
                        <Label htmlFor={`brand-${brand}`} className="text-sm font-medium cursor-pointer">
                          {brand}
                        </Label>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => toggleBrand(brand, e)}
                        className="transition-all duration-200 hover:bg-brand-primary/10 p-2 rounded-full"
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
                      <div className="ml-8 mt-3 space-y-2 animate-slideUp">
                        {modelsByBrand[brand]?.map((model) => (
                          <div
                            key={model.id}
                            className={`flex items-center gap-3 transition-all duration-200 p-2.5 rounded-lg ${
                              filters.selectedModels?.includes(model.id)
                                ? "bg-brand-primary/5 border border-brand-primary/20"
                                : "hover:bg-brand-primary/5"
                            }`}
                          >
                            <Checkbox
                              id={`model-${model.id}`}
                              checked={filters.selectedModels?.includes(model.id)}
                              onCheckedChange={(checked) => handleModelCheck(model.id, checked)}
                              className="rounded-sm border-brand-primary text-brand-primary focus:ring-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:text-white h-3.5 w-3.5"
                            />
                            <Label htmlFor={`model-${model.id}`} className="text-xs font-medium cursor-pointer">
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
          </div>

          {/* Year Section */}
          <div className={`filter-section ${expandedSections.year ? "expanded" : ""}`}>
            <div className="filter-section-header" onClick={(e) => toggleSection("year", e)}>
              <h4 className="font-semibold text-brand-primary text-lg">{language === "ar" ? "السنة" : "Year"}</h4>
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-brand-primary/10">
                <ChevronDown
                  className={`h-5 w-5 text-brand-primary transition-transform duration-300 ${
                    expandedSections.year ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            <div className="filter-section-content">
              <div className="grid grid-cols-3 gap-3 mt-3">
                {/* Extract unique years from cars data */}
                {[...new Set(cars.map((car) => car.specs.year))]
                  .sort((a, b) => b - a) // Sort years in descending order
                  .map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleYearChange(year)}
                      className={`year-button ${filters.year === year.toString() ? "selected" : ""}`}
                    >
                      <span>{year}</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Fuel Type Section */}
          <div className={`filter-section ${expandedSections.fuelType ? "expanded" : ""}`}>
            <div className="filter-section-header" onClick={(e) => toggleSection("fuelType", e)}>
              <h4 className="font-semibold text-brand-primary text-lg">
                {language === "ar" ? "نوع الوقود" : "Fuel Type"}
              </h4>
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-brand-primary/10">
                <ChevronDown
                  className={`h-5 w-5 text-brand-primary transition-transform duration-300 ${
                    expandedSections.fuelType ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            <div className="filter-section-content">
              <div className="grid grid-cols-2 gap-3 mt-3">
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
                    <div
                      key={fuelType}
                      className={`checkbox-container ${
                        Array.isArray(filters.fuelTypes) && filters.fuelTypes.includes(fuelType) ? "selected" : ""
                      }`}
                    >
                      <Checkbox
                        id={`fuel-${fuelType}`}
                        checked={Array.isArray(filters.fuelTypes) && filters.fuelTypes.includes(fuelType)}
                        onCheckedChange={(checked) => handleFuelTypeChange(fuelType, checked)}
                        className="rounded-sm border-brand-primary text-brand-primary focus:ring-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:text-white h-4 w-4"
                      />
                      <Label htmlFor={`fuel-${fuelType}`} className="text-sm font-medium cursor-pointer">
                        {fuelType}
                      </Label>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Transmission Section */}
          <div className={`filter-section ${expandedSections.transmission ? "expanded" : ""}`}>
            <div className="filter-section-header" onClick={(e) => toggleSection("transmission", e)}>
              <h4 className="font-semibold text-brand-primary text-lg">
                {language === "ar" ? "ناقل الحركة" : "Transmission"}
              </h4>
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-brand-primary/10">
                <ChevronDown
                  className={`h-5 w-5 text-brand-primary transition-transform duration-300 ${
                    expandedSections.transmission ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            <div className="filter-section-content">
              <div className="grid grid-cols-2 gap-3 mt-3">
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
                    <div
                      key={transmission}
                      className={`checkbox-container ${
                        Array.isArray(filters.transmission) && filters.transmission.includes(transmission)
                          ? "selected"
                          : ""
                      }`}
                    >
                      <Checkbox
                        id={`transmission-${transmission}`}
                        checked={Array.isArray(filters.transmission) && filters.transmission.includes(transmission)}
                        onCheckedChange={(checked) => handleTransmissionChange(transmission, checked)}
                        className="rounded-sm border-brand-primary text-brand-primary focus:ring-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:text-white h-4 w-4"
                      />
                      <Label htmlFor={`transmission-${transmission}`} className="text-sm font-medium cursor-pointer">
                        {transmission}
                      </Label>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Seats Section */}
          <div className={`filter-section ${expandedSections.seats ? "expanded" : ""}`}>
            <div className="filter-section-header" onClick={(e) => toggleSection("seats", e)}>
              <h4 className="font-semibold text-brand-primary text-lg">{language === "ar" ? "المقاعد" : "Seats"}</h4>
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-brand-primary/10">
                <ChevronDown
                  className={`h-5 w-5 text-brand-primary transition-transform duration-300 ${
                    expandedSections.seats ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            <div className="filter-section-content">
              <div className="grid grid-cols-2 gap-3 mt-3">
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
                    <div
                      key={seatOption}
                      className={`checkbox-container ${filters.seats?.includes(seatOption) ? "selected" : ""}`}
                    >
                      <Checkbox
                        id={`seats-${seatOption}`}
                        checked={filters.seats?.includes(seatOption)}
                        onCheckedChange={(checked) => handleSeatChange(seatOption, checked)}
                        className="rounded-sm border-brand-primary text-brand-primary focus:ring-brand-primary data-[state=checked]:bg-brand-primary data-[state=checked]:text-white h-4 w-4"
                      />
                      <Label htmlFor={`seats-${seatOption}`} className="text-sm font-medium cursor-pointer">
                        {seatOption}
                      </Label>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter footer */}
      {isMobile ? (
        <div className="mobile-filter-footer">
          <Button
            onClick={() => {
              // Reset all filters
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
            className="premium-button secondary-button flex-1"
          >
            <X className="h-4 w-4" />
            {language === "ar" ? "إعادة تعيين" : "Clear All"}
          </Button>
          <Button onClick={applyFilters} className="premium-button primary-button flex-1 py-3 text-lg">
            <Check className="h-5 w-5" />
            {language === "ar" ? "تطبيق" : "Apply"}
          </Button>
        </div>
      ) : (
        <div className="filter-footer">
          <Button
            onClick={() => {
              // Reset all filters
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
            className="premium-button secondary-button w-full"
          >
            <X className="h-4 w-4" />
            {language === "ar" ? "إعادة تعيين الفلاتر" : "Clear All Filters"}
          </Button>
        </div>
      )}
    </div>
  )
}

// Update the desktop sidebar container to fix scrolling
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

  // Calculate maxPrice early
  const maxPrice = useMemo(() => {
    return Math.max(...(cars.length ? cars.map((car) => car.cashPrice || 0) : [250000]), 250000)
  }, [cars])

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
    // Define the cleared filters with the same structure as the initial state
    const clearedFilters = {
      priceRange: [0, maxPrice],
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
  }, [maxPrice])

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

  const activeFiltersCount = getActiveFiltersCount()

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
    return <CarSkeletonUI />
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
          {/* Desktop sidebar - Fixed the height and overflow issues */}
          <div className="md:w-80 hidden md:block">
            <div className="sticky top-20 h-[calc(100vh-8rem)] overflow-hidden">
              <CarFilterSidebar
                onFilterChange={handleFilterChange}
                filters={filters}
                language={currentLocale}
                cars={cars}
              />
            </div>
          </div>

          {/* Mobile filter overlay */}
          {isSidebarOpen && (
            <>
              <div className="filter-overlay md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
              <div className="filter-sidebar-mobile md:hidden">
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

          <div className="flex-1">
            {/* Promo Slider */}
            <PromoSlider />

            {/* Mobile Filter Button - Now positioned below the promo slider */}
            <div className="md:hidden px-2 mt-4">
              <button className="filter-button" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <SlidersHorizontal className="h-5 w-5" />
                <span>
                  {currentLocale === "ar" ? "الفلاتر" : "Filters"}
                  {activeFiltersCount > 0 && (
                    <span className="ml-2 bg-white text-brand-primary rounded-full px-2.5 py-0.5 text-xs font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </span>
              </button>
            </div>

            {/* Car Grid */}
            <div className="mb-8 mt-6">
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
                    className="premium-input pl-3 pr-10 py-2.5"
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
                        className={`px-4 py-2 rounded-lg transition-all duration-300 hover-lift ${
                          currentPage === i + 1
                            ? "bg-brand-primary text-white shadow-md"
                            : "bg-white text-brand-primary border border-brand-primary/30 hover:bg-brand-light/50"
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
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-500 animate-fadeIn">
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    {currentLocale === "ar" ? "لا توجد سيارات متطابقة" : "No matching cars found"}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {currentLocale === "ar"
                      ? "حاول تعديل معايير البحث الخاصة بك"
                      : "Try adjusting your search criteria"}
                  </p>
                  <Button
                    onClick={() => {
                      console.log("Reset button clicked")
                      clearAllFilters()
                    }}
                    className="premium-button primary-button px-6 py-2.5 inline-flex"
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
