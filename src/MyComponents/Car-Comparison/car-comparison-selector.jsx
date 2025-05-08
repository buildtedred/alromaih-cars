"use client"

import { useState, useEffect } from "react"
import { Car, ArrowRight, ArrowLeft, Plus, Minus } from "lucide-react"
import { usePathname } from "next/navigation"
import CarComparisonResults from "./car-comparison-results"
import carsData, { brandNames } from "@/app/api/mock-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Breadcrumb } from "../breadcrumb"

// Add custom styles for RTL dropdown and fix dropdown scrolling issues
const rtlDropdownStyles = `
  .rtl-select-trigger .select-trigger-icon {
    margin-left: 0;
    margin-right: auto;
  }
  
  .rtl-select-content {
    direction: rtl;
    text-align: right;
  }
  
  .rtl-select-item {
    direction: rtl;
    text-align: right;
  }

  /* Fixed height dropdown with scrollbar */
  .select-content {
    max-height: 200px;
    overflow-y: auto;
    border-radius: 5px !important;
  }

  /* Custom scrollbar styling */
  .select-content::-webkit-scrollbar {
    width: 6px;
  }

  .select-content::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  .select-content::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  .select-content::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  /* Fix for dropdown trigger */
  .select-trigger {
    border-radius: 5px !important;
  }

  /* Fix for dropdown items */
  .select-item {
    border-radius: 3px !important;
  }
`

const CarComparisonSelector = () => {
  const pathname = usePathname()
  const currentLocale = pathname.startsWith("/ar") ? "ar" : "en"
  const isRTL = currentLocale === "ar"

  // Add RTL styles on component mount
  useEffect(() => {
    if (isRTL) {
      const styleElement = document.createElement("style")
      styleElement.innerHTML = rtlDropdownStyles
      document.head.appendChild(styleElement)

      return () => {
        document.head.removeChild(styleElement)
      }
    }
  }, [isRTL])

  // State to control whether to show results
  const [showResults, setShowResults] = useState(false)
  const [selectedCarIds, setSelectedCarIds] = useState({ car1: null, car2: null, car3: null })
  const [cars, setCars] = useState([])
  const [showThirdCar, setShowThirdCar] = useState(false)
  const [activeCarIndex, setActiveCarIndex] = useState(0) // For mobile tab navigation
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Make sure we have data
    if (carsData && carsData.length > 0) {
      setCars(carsData)
      console.log("Cars data loaded:", carsData.length)
    } else {
      console.error("No cars data available")
    }
  }, [])

  // Extract unique brands from cars
  const brands = [...new Set(cars.map((car) => car.brand))]
    .map((brandName) => {
      // Find the brand object from brandNames
      const brandKey = Object.keys(brandNames).find((key) => key === brandName)
      const brand = brandKey ? brandNames[brandKey] : { en: brandName, ar: brandName }

      return {
        id: brandName?.toLowerCase(),
        name: brand,
      }
    })
    .filter((brand) => brand.id) // Filter out any undefined brands

  // Extract unique years from cars data
  const years = [...new Set(cars.map((car) => car.specs?.year))]
    .filter(Boolean)
    .sort((a, b) => b - a) // Sort years in descending order
    .map(String) // Convert to string

  // Add this new function to get years for a specific model
  const getYearsForModel = (modelId) => {
    if (!modelId) return []

    const car = cars.find((car) => car.id === modelId)
    if (car && car.specs?.year) {
      return [String(car.specs.year)]
    }
    return []
  }

  // State for selected values
  const [firstCar, setFirstCar] = useState({
    brand: null,
    model: null,
    year: null,
  })

  const [secondCar, setSecondCar] = useState({
    brand: null,
    model: null,
    year: null,
  })

  const [thirdCar, setThirdCar] = useState({
    brand: null,
    model: null,
    year: null,
  })

  // Get available models for a brand, excluding already selected models
  const getAvailableModels = (brandId, currentSelection) => {
    if (!brandId) return []

    // Get all models for this brand
    const allModels = cars
      .filter((car) => car.brand?.toLowerCase() === brandId)
      .map((car) => ({
        id: car.id,
        name: car.name,
      }))

    // Get IDs of already selected models (excluding the current selection)
    const selectedModelIds = [firstCar.model?.id, secondCar.model?.id, thirdCar.model?.id].filter(
      (id) => id !== null && id !== currentSelection?.id,
    )

    // Filter out already selected models
    return allModels.filter((model) => !selectedModelIds.includes(model.id))
  }

  const selectBrand = (car, brand) => {
    if (car === "first") {
      setFirstCar({ ...firstCar, brand, model: null })
    } else if (car === "second") {
      setSecondCar({ ...secondCar, brand, model: null })
    } else if (car === "third") {
      setThirdCar({ ...thirdCar, brand, model: null })
    }
  }

  const selectModel = (car, model) => {
    if (car === "first") {
      const modelYear = model ? getYearsForModel(model.id)[0] : null
      setFirstCar({ ...firstCar, model, year: modelYear })
    } else if (car === "second") {
      const modelYear = model ? getYearsForModel(model.id)[0] : null
      setSecondCar({ ...secondCar, model, year: modelYear })
    } else if (car === "third") {
      const modelYear = model ? getYearsForModel(model.id)[0] : null
      setThirdCar({ ...thirdCar, model, year: modelYear })
    }
  }

  const selectYear = (car, year) => {
    if (car === "first") {
      setFirstCar({ ...firstCar, year })
    } else if (car === "second") {
      setSecondCar({ ...secondCar, year })
    } else if (car === "third") {
      setThirdCar({ ...thirdCar, year })
    }
  }

  const getText = (textObj) => {
    if (!textObj) return ""
    return typeof textObj === "object" ? textObj[currentLocale] || textObj.en : textObj
  }

  const toggleThirdCar = () => {
    setShowThirdCar(!showThirdCar)
    if (!showThirdCar) {
      // Reset third car when adding
      setThirdCar({
        brand: null,
        model: null,
        year: null,
      })
    }
  }

  const handleCompare = () => {
    // Show results on the same page
    if (firstCar.model && secondCar.model) {
      setSelectedCarIds({
        car1: firstCar.model.id,
        car2: secondCar.model.id,
        car3: showThirdCar && thirdCar.model ? thirdCar.model.id : null,
      })
      setShowResults(true)
    }
  }

  const handleCompareAgain = () => {
    setShowResults(false)
  }

  // Check if we can compare (at least 2 cars selected)
  const canCompare = firstCar.model && secondCar.model && (!showThirdCar || !thirdCar.model || thirdCar.model)

  // Generate breadcrumb items
  const getBreadcrumbItems = () => {
    return [
      {
        label: isRTL ? "الرئيسية" : "Home",
        href: `/${currentLocale}`,
      },
      {
        label: isRTL ? "المقارنات" : "Comparisons",
      },
    ]
  }

  // Custom dropdown component that handles RTL properly
  const CustomSelect = ({ value, onValueChange, placeholder, disabled, options, className }) => {
    return (
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          className={`w-full p-3 border rounded-xl ${className} ${isRTL ? "flex-row-reverse" : ""} select-trigger`}
          style={{ borderRadius: "5px" }}
        >
          <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent
          className={`${isRTL ? "rtl-select-content" : ""} select-content`}
          align={isRTL ? "end" : "start"}
          style={{ maxHeight: "200px", overflowY: "auto", borderRadius: "5px" }}
          sideOffset={5}
          position="popper"
          avoidCollisions={true}
        >
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className={`${isRTL ? "rtl-select-item" : ""} select-item`}
              style={{ borderRadius: "3px" }}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  // If showing results, render the comparison results component
  if (showResults) {
    return (
      <div className="w-full">
        <CarComparisonResults
          car1Id={selectedCarIds.car1}
          car2Id={selectedCarIds.car2}
          car3Id={selectedCarIds.car3}
          onCompareAgain={handleCompareAgain}
        />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-md p-4 md:p-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* Breadcrumb Navigation */}
      <div className="mb-4 px-4 sm:px-0">
        <Breadcrumb items={getBreadcrumbItems()} className="text-sm" />
      </div>

      {/* Header */}
      <div className="text-center mb-6 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-primary mb-2">
          {isRTL ? "قارن بين السيارات" : "Compare Cars"}
        </h1>
        <p className="text-gray-600">
          {isRTL ? "اختر سيارتين أو ثلاث للمقارنة بينهم الآن" : "Select two or three cars to compare them now"}
        </p>
      </div>

      {/* Car Selection Tabs - Only visible on small screens */}
      <div className="flex md:hidden rounded-xl bg-gray-100 p-1 mb-6 shadow-sm overflow-x-auto">
        <button
          onClick={() => setActiveCarIndex(0)}
          className={`flex-1 py-3 px-4 text-center font-medium rounded-lg transition-all duration-300 ${
            activeCarIndex === 0
              ? "bg-white text-brand-primary shadow-sm"
              : "text-gray-600 hover:bg-white hover:bg-opacity-50"
          }`}
        >
          <div className="flex flex-col items-center">
            <Car className="w-5 h-5 mb-1" />
            <span>{isRTL ? "السيارة 1" : "Car 1"}</span>
          </div>
        </button>
        <button
          onClick={() => setActiveCarIndex(1)}
          className={`flex-1 py-3 px-4 text-center font-medium rounded-lg transition-all duration-300 ${
            activeCarIndex === 1
              ? "bg-white text-brand-primary shadow-sm"
              : "text-gray-600 hover:bg-white hover:bg-opacity-50"
          }`}
        >
          <div className="flex flex-col items-center">
            <Car className="w-5 h-5 mb-1" />
            <span>{isRTL ? "السيارة 2" : "Car 2"}</span>
          </div>
        </button>
        {showThirdCar && (
          <button
            onClick={() => setActiveCarIndex(2)}
            className={`flex-1 py-3 px-4 text-center font-medium rounded-lg transition-all duration-300 ${
              activeCarIndex === 2
                ? "bg-white text-brand-primary shadow-sm"
                : "text-gray-600 hover:bg-white hover:bg-opacity-50"
            }`}
          >
            <div className="flex flex-col items-center">
              <Car className="w-5 h-5 mb-1" />
              <span>{isRTL ? "السيارة 3" : "Car 3"}</span>
            </div>
          </button>
        )}
      </div>

      {/* Car Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* First Car Panel */}
        <div
          className={`bg-gradient-to-b from-[#f8f6f9] to-[#f0ebf1] rounded-xl p-5 shadow-md ${activeCarIndex === 0 ? "block" : "hidden md:block"}`}
        >
          <div className="hidden md:flex md:justify-center mb-6">
            <div className="w-16 h-16 bg-brand-primary bg-opacity-10 rounded-full flex items-center justify-center">
              <Car className="w-8 h-8 text-brand-primary" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-brand-primary mb-5 md:text-center">
            {isRTL ? "السيارة الأولى" : "First Car"}
          </h3>

          {/* Brand Dropdown */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">{isRTL ? "الشركة المصنعة" : "Brand"}</label>
            <CustomSelect
              value={firstCar.brand ? firstCar.brand.id : ""}
              onValueChange={(value) => {
                const selectedBrand = brands.find((brand) => brand.id === value)
                selectBrand("first", selectedBrand)
              }}
              placeholder={isRTL ? "اختر الشركة المصنعة" : "Select Brand"}
              options={brands.map((brand) => ({
                value: brand.id,
                label: getText(brand.name),
              }))}
              className="border-brand-primary bg-white focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50 focus-visible:outline-none"
            />
          </div>

          {/* Model Dropdown */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">{isRTL ? "الطراز" : "Model"}</label>
            <CustomSelect
              value={firstCar.model ? firstCar.model.id.toString() : ""}
              onValueChange={(value) => {
                const selectedModel = getAvailableModels(firstCar.brand?.id, firstCar.model).find(
                  (model) => model.id.toString() === value,
                )
                selectModel("first", selectedModel)
              }}
              placeholder={isRTL ? "اختر الطراز" : "Select Model"}
              options={
                firstCar.brand
                  ? getAvailableModels(firstCar.brand.id, firstCar.model).map((model) => ({
                      value: model.id.toString(),
                      label: getText(model.name),
                    }))
                  : []
              }
              disabled={!firstCar.brand}
              className={
                firstCar.brand
                  ? "border-brand-primary bg-white focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50 focus-visible:outline-none"
                  : "border-gray-300 bg-gray-50 cursor-not-allowed text-gray-400"
              }
            />
          </div>

          {/* Year Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{isRTL ? "السنة" : "Year"}</label>
            <CustomSelect
              value={firstCar.year || ""}
              onValueChange={(value) => selectYear("first", value)}
              placeholder={isRTL ? "اختر السنة" : "Select Year"}
              options={
                firstCar.model
                  ? getYearsForModel(firstCar.model.id).map((year) => ({
                      value: year,
                      label: year,
                    }))
                  : years.map((year) => ({
                      value: year,
                      label: year,
                    }))
              }
              disabled={!firstCar.model}
              className={
                firstCar.model
                  ? "border-brand-primary bg-white focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50 focus-visible:outline-none"
                  : "border-gray-300 bg-gray-50 cursor-not-allowed text-gray-400"
              }
            />
          </div>
        </div>

        {/* Second Car Panel */}
        <div
          className={`bg-gradient-to-b from-[#f8f6f9] to-[#f0ebf1] rounded-xl p-5 shadow-md ${activeCarIndex === 1 ? "block" : "hidden md:block"}`}
        >
          <div className="hidden md:flex md:justify-center mb-6">
            <div className="w-16 h-16 bg-brand-primary bg-opacity-10 rounded-full flex items-center justify-center">
              <Car className="w-8 h-8 text-brand-primary" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-brand-primary mb-5 md:text-center">
            {isRTL ? "السيارة الثانية" : "Second Car"}
          </h3>

          {/* Brand Dropdown */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">{isRTL ? "الشركة المصنعة" : "Brand"}</label>
            <CustomSelect
              value={secondCar.brand ? secondCar.brand.id : ""}
              onValueChange={(value) => {
                const selectedBrand = brands.find((brand) => brand.id === value)
                selectBrand("second", selectedBrand)
              }}
              placeholder={isRTL ? "اختر الشركة المصنعة" : "Select Brand"}
              options={brands.map((brand) => ({
                value: brand.id,
                label: getText(brand.name),
              }))}
              className="border-brand-primary bg-white focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50 focus-visible:outline-none"
            />
          </div>

          {/* Model Dropdown */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">{isRTL ? "الطراز" : "Model"}</label>
            <CustomSelect
              value={secondCar.model ? secondCar.model.id.toString() : ""}
              onValueChange={(value) => {
                const selectedModel = getAvailableModels(secondCar.brand?.id, secondCar.model).find(
                  (model) => model.id.toString() === value,
                )
                selectModel("second", selectedModel)
              }}
              placeholder={isRTL ? "اختر الطراز" : "Select Model"}
              options={
                secondCar.brand
                  ? getAvailableModels(secondCar.brand.id, secondCar.model).map((model) => ({
                      value: model.id.toString(),
                      label: getText(model.name),
                    }))
                  : []
              }
              disabled={!secondCar.brand}
              className={
                secondCar.brand
                  ? "border-brand-primary bg-white focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50 focus-visible:outline-none"
                  : "border-gray-300 bg-gray-50 cursor-not-allowed text-gray-400"
              }
            />
          </div>

          {/* Year Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{isRTL ? "السنة" : "Year"}</label>
            <CustomSelect
              value={secondCar.year || ""}
              onValueChange={(value) => selectYear("second", value)}
              placeholder={isRTL ? "اختر السنة" : "Select Year"}
              options={
                secondCar.model
                  ? getYearsForModel(secondCar.model.id).map((year) => ({
                      value: year,
                      label: year,
                    }))
                  : years.map((year) => ({
                      value: year,
                      label: year,
                    }))
              }
              disabled={!secondCar.model}
              className={
                secondCar.model
                  ? "border-brand-primary bg-white focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50 focus-visible:outline-none"
                  : "border-gray-300 bg-gray-50 cursor-not-allowed text-gray-400"
              }
            />
          </div>
        </div>

        {/* Third Car Panel or Add Third Car Button */}
        {showThirdCar ? (
          <div
            className={`bg-gradient-to-b from-[#f8f6f9] to-[#f0ebf1] rounded-xl p-5 shadow-md relative ${activeCarIndex === 2 ? "block" : "hidden md:block"}`}
          >
            <button
              onClick={toggleThirdCar}
              className="absolute top-3 right-3 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-500"
              aria-label={isRTL ? "إزالة السيارة الثالثة" : "Remove third car"}
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="hidden md:flex md:justify-center mb-6">
              <div className="w-16 h-16 bg-brand-primary bg-opacity-10 rounded-full flex items-center justify-center">
                <Car className="w-8 h-8 text-brand-primary" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-brand-primary mb-5 md:text-center">
              {isRTL ? "السيارة الثالثة" : "Third Car"}
            </h3>

            {/* Brand Dropdown */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isRTL ? "الشركة المصنعة" : "Brand"}
              </label>
              <CustomSelect
                value={thirdCar.brand ? thirdCar.brand.id : ""}
                onValueChange={(value) => {
                  const selectedBrand = brands.find((brand) => brand.id === value)
                  selectBrand("third", selectedBrand)
                }}
                placeholder={isRTL ? "اختر الشركة المصنعة" : "Select Brand"}
                options={brands.map((brand) => ({
                  value: brand.id,
                  label: getText(brand.name),
                }))}
                className="border-brand-primary bg-white focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50 focus-visible:outline-none"
              />
            </div>

            {/* Model Dropdown */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">{isRTL ? "الطراز" : "Model"}</label>
              <CustomSelect
                value={thirdCar.model ? thirdCar.model.id.toString() : ""}
                onValueChange={(value) => {
                  const selectedModel = getAvailableModels(thirdCar.brand?.id, thirdCar.model).find(
                    (model) => model.id.toString() === value,
                  )
                  selectModel("third", selectedModel)
                }}
                placeholder={isRTL ? "اختر الطراز" : "Select Model"}
                options={
                  thirdCar.brand
                    ? getAvailableModels(thirdCar.brand.id, thirdCar.model).map((model) => ({
                        value: model.id.toString(),
                        label: getText(model.name),
                      }))
                    : []
                }
                disabled={!thirdCar.brand}
                className={
                  thirdCar.brand
                    ? "border-brand-primary bg-white focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50 focus-visible:outline-none"
                    : "border-gray-300 bg-gray-50 cursor-not-allowed text-gray-400"
                }
              />
            </div>

            {/* Year Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{isRTL ? "السنة" : "Year"}</label>
              <CustomSelect
                value={thirdCar.year || ""}
                onValueChange={(value) => selectYear("third", value)}
                placeholder={isRTL ? "اختر السنة" : "Select Year"}
                options={
                  thirdCar.model
                    ? getYearsForModel(thirdCar.model.id).map((year) => ({
                        value: year,
                        label: year,
                      }))
                    : years.map((year) => ({
                        value: year,
                        label: year,
                      }))
                }
                disabled={!thirdCar.model}
                className={
                  thirdCar.model
                    ? "border-brand-primary bg-white focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50 focus-visible:outline-none"
                    : "border-gray-300 bg-gray-50 cursor-not-allowed text-gray-400"
                }
              />
            </div>
          </div>
        ) : (
          <div className="hidden md:flex md:items-center md:justify-center">
            <button
              onClick={toggleThirdCar}
              className="h-full w-full border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 hover:border-brand-primary hover:bg-brand-light hover:bg-opacity-30 transition-colors"
            >
              <div className="w-16 h-16 bg-brand-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-brand-primary" />
              </div>
              <p className="text-brand-primary font-medium">
                {isRTL ? "إضافة سيارة ثالثة للمقارنة" : "Add a third car to compare"}
              </p>
            </button>
          </div>
        )}
      </div>

      {/* Car Summary Cards - Only visible on mobile */}
      <div className="md:hidden mt-6 mb-6">
        {(firstCar.model || secondCar.model || (showThirdCar && thirdCar.model)) && (
          <>
            <h3 className="text-xl font-bold text-brand-primary mb-4">
              {isRTL ? "السيارات المختارة" : "Selected Cars"}
            </h3>

            <div className="space-y-3">
              {/* First Car Summary */}
              {firstCar.model && (
                <div
                  className="p-4 border border-brand-light rounded-xl flex items-center bg-white shadow-md hover:shadow-lg transition-shadow active:bg-gray-50"
                  onClick={() => setActiveCarIndex(0)}
                  style={{ borderRadius: "5px" }}
                >
                  <div className="w-10 h-10 bg-brand-primary bg-opacity-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <Car className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{getText(firstCar.model.name)}</p>
                    {firstCar.brand && (
                      <div className="flex items-center mt-1">
                        <p className="text-sm text-gray-500">{getText(firstCar.brand.name)}</p>
                        {firstCar.year && <p className="text-sm text-gray-400 ml-2">{firstCar.year}</p>}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Second Car Summary */}
              {secondCar.model && (
                <div
                  className="p-4 border border-brand-light rounded-xl flex items-center bg-white shadow-md hover:shadow-lg transition-shadow active:bg-gray-50"
                  onClick={() => setActiveCarIndex(1)}
                  style={{ borderRadius: "5px" }}
                >
                  <div className="w-10 h-10 bg-brand-primary bg-opacity-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <Car className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{getText(secondCar.model.name)}</p>
                    {secondCar.brand && (
                      <div className="flex items-center mt-1">
                        <p className="text-sm text-gray-500">{getText(secondCar.brand.name)}</p>
                        {secondCar.year && <p className="text-sm text-gray-400 ml-2">{secondCar.year}</p>}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Third Car Summary (if enabled) */}
              {showThirdCar && thirdCar.model && (
                <div
                  className="p-4 border border-brand-light rounded-xl flex items-center bg-white shadow-md hover:shadow-lg transition-shadow active:bg-gray-50"
                  onClick={() => setActiveCarIndex(2)}
                  style={{ borderRadius: "5px" }}
                >
                  <div className="w-10 h-10 bg-brand-primary bg-opacity-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <Car className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{getText(thirdCar.model.name)}</p>
                    {thirdCar.brand && (
                      <div className="flex items-center mt-1">
                        <p className="text-sm text-gray-500">{getText(thirdCar.brand.name)}</p>
                        {thirdCar.year && <p className="text-sm text-gray-400 ml-2">{thirdCar.year}</p>}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Add Third Car Button - Only visible on mobile */}
      {!showThirdCar && (
        <button
          onClick={toggleThirdCar}
          className="md:hidden w-full p-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white mb-6"
        >
          <Plus className="w-5 h-5 text-brand-primary mr-2" />
          <span className="text-brand-primary font-medium">
            {isRTL ? "إضافة سيارة ثالثة للمقارنة" : "Add a third car"}
          </span>
        </button>
      )}

      {/* Compare Button */}
      <div className="flex justify-center mt-6">
        <div className={`${!canCompare ? "opacity-50 pointer-events-none" : ""} ${isRTL ? "rtl" : ""}`}>
          <div className={`${isMobileMenuOpen ? "button-container-mask-mobile" : "button-container-mask md:w-auto"}`}>
            <span className={`${isMobileMenuOpen ? "mask-text-mobile" : "mask-text"}`}>
              {isRTL ? "عرض المقارنة" : "Show Comparison"}
            </span>
            <button
              onClick={handleCompare}
              disabled={!canCompare}
              className={`${isMobileMenuOpen ? "mask-button-mobile" : "mask-button"}`}
            >
              {isRTL ? (
                <>
                  عرض المقارنة <ArrowLeft className="w-5 h-5" />
                </>
              ) : (
                <>
                  Show Comparison <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarComparisonSelector
