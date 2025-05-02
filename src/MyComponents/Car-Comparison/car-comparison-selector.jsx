"use client"

import { useState, useEffect } from "react"
import { Car, ArrowRight, ArrowLeft, Plus, Minus, ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"
import CarComparisonResults from "./car-comparison-results"
import carsData from "@/app/api/mock-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Breadcrumb } from "../breadcrumb"

const CarComparisonSelector = () => {
  const pathname = usePathname()
  const currentLocale = pathname.startsWith("/ar") ? "ar" : "en"
  const isRTL = currentLocale === "ar"

  // State to control whether to show results
  const [showResults, setShowResults] = useState(false)
  const [selectedCarIds, setSelectedCarIds] = useState({ car1: null, car2: null, car3: null })
  const [cars, setCars] = useState([])
  const [showThirdCar, setShowThirdCar] = useState(false)
  const [activeCarIndex, setActiveCarIndex] = useState(0) // For mobile tab navigation

  useEffect(() => {
    // Set cars from the imported data
    setCars(carsData)
  }, [])

  // Extract unique brands from cars
  const brands = [...new Set(cars.map((car) => car.brand))].map((brandName) => ({
    id: brandName.toLowerCase(),
    name: { en: brandName, ar: brandName },
  }))

  // Extract unique years from cars data
  const years = [...new Set(cars.map((car) => car.specs?.year))]
    .filter(Boolean)
    .sort((a, b) => b - a) // Sort years in descending order
    .map(String) // Convert to string

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
      .filter((car) => car.brand.toLowerCase() === brandId)
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
      setFirstCar({ ...firstCar, model })
    } else if (car === "second") {
      setSecondCar({ ...secondCar, model })
    } else if (car === "third") {
      setThirdCar({ ...thirdCar, model })
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
    <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-md p-4 md:p-8">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <Select
              value={firstCar.brand ? firstCar.brand.id : ""}
              onValueChange={(value) => {
                const selectedBrand = brands.find((brand) => brand.id === value)
                selectBrand("first", selectedBrand)
              }}
            >
              <SelectTrigger className="w-full p-3 border border-brand-primary rounded-xl bg-white focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50 focus-visible:outline-none">
                <SelectValue placeholder={isRTL ? "اختر الشركة المصنعة" : "Select Brand"} />
              </SelectTrigger>
              <SelectContent className="border border-brand-light shadow-lg rounded-lg">
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {getText(brand.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Model Dropdown */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">{isRTL ? "الطراز" : "Model"}</label>
            <Select
              value={firstCar.model ? firstCar.model.id.toString() : ""}
              onValueChange={(value) => {
                const selectedModel = getAvailableModels(firstCar.brand?.id, firstCar.model).find(
                  (model) => model.id.toString() === value,
                )
                selectModel("first", selectedModel)
              }}
              disabled={!firstCar.brand}
            >
              <SelectTrigger
                className={`w-full p-3 border rounded-xl ${
                  firstCar.brand
                    ? "border-brand-primary bg-white focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50 focus-visible:outline-none"
                    : "border-gray-300 bg-gray-50 cursor-not-allowed text-gray-400"
                }`}
              >
                <SelectValue placeholder={isRTL ? "اختر الطراز" : "Select Model"} />
              </SelectTrigger>
              <SelectContent className="border border-brand-light shadow-lg rounded-lg">
                {firstCar.brand &&
                  getAvailableModels(firstCar.brand.id, firstCar.model).map((model) => (
                    <SelectItem key={model.id} value={model.id.toString()}>
                      {getText(model.name)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{isRTL ? "السنة" : "Year"}</label>
            <Select
              value={firstCar.year || ""}
              onValueChange={(value) => selectYear("first", value)}
              disabled={!firstCar.model}
            >
              <SelectTrigger
                className={`w-full p-3 border rounded-xl ${
                  firstCar.model
                    ? "border-brand-primary bg-white focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50 focus-visible:outline-none"
                    : "border-gray-300 bg-gray-50 cursor-not-allowed text-gray-400"
                }`}
              >
                <SelectValue placeholder={isRTL ? "اختر السنة" : "Select Year"} />
              </SelectTrigger>
              <SelectContent className="border border-brand-light shadow-lg rounded-lg">
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Select
              value={secondCar.brand ? secondCar.brand.id : ""}
              onValueChange={(value) => {
                const selectedBrand = brands.find((brand) => brand.id === value)
                selectBrand("second", selectedBrand)
              }}
            >
              <SelectTrigger className="w-full p-3 border border-brand-primary rounded-xl bg-white focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50 focus-visible:outline-none">
                <SelectValue placeholder={isRTL ? "اختر الشركة المصنعة" : "Select Brand"} />
              </SelectTrigger>
              <SelectContent className="border border-brand-light shadow-lg rounded-lg">
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {getText(brand.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Model Dropdown */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">{isRTL ? "الطراز" : "Model"}</label>
            <Select
              value={secondCar.model ? secondCar.model.id.toString() : ""}
              onValueChange={(value) => {
                const selectedModel = getAvailableModels(secondCar.brand?.id, secondCar.model).find(
                  (model) => model.id.toString() === value,
                )
                selectModel("second", selectedModel)
              }}
              disabled={!secondCar.brand}
            >
              <SelectTrigger
                className={`w-full p-3 border rounded-xl ${
                  secondCar.brand
                    ? "border-brand-primary bg-white focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50 focus-visible:outline-none"
                    : "border-gray-300 bg-gray-50 cursor-not-allowed text-gray-400"
                }`}
              >
                <SelectValue placeholder={isRTL ? "اختر الطراز" : "Select Model"} />
              </SelectTrigger>
              <SelectContent className="border border-brand-light shadow-lg rounded-lg">
                {secondCar.brand &&
                  getAvailableModels(secondCar.brand.id, secondCar.model).map((model) => (
                    <SelectItem key={model.id} value={model.id.toString()}>
                      {getText(model.name)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{isRTL ? "السنة" : "Year"}</label>
            <Select
              value={secondCar.year || ""}
              onValueChange={(value) => selectYear("second", value)}
              disabled={!secondCar.model}
            >
              <SelectTrigger
                className={`w-full p-3 border rounded-xl ${
                  secondCar.model
                    ? "border-brand-primary bg-white focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50 focus-visible:outline-none"
                    : "border-gray-300 bg-gray-50 cursor-not-allowed text-gray-400"
                }`}
              >
                <SelectValue placeholder={isRTL ? "اختر السنة" : "Select Year"} />
              </SelectTrigger>
              <SelectContent className="border border-brand-light shadow-lg rounded-lg">
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              <Select
                value={thirdCar.brand ? thirdCar.brand.id : ""}
                onValueChange={(value) => {
                  const selectedBrand = brands.find((brand) => brand.id === value)
                  selectBrand("third", selectedBrand)
                }}
              >
                <SelectTrigger className="w-full p-3 border border-brand-primary rounded-xl bg-white focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50 focus-visible:outline-none">
                  <SelectValue placeholder={isRTL ? "اختر الشركة المصنعة" : "Select Brand"} />
                </SelectTrigger>
                <SelectContent className="border border-brand-light shadow-lg rounded-lg">
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {getText(brand.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Model Dropdown */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">{isRTL ? "الطراز" : "Model"}</label>
              <Select
                value={thirdCar.model ? thirdCar.model.id.toString() : ""}
                onValueChange={(value) => {
                  const selectedModel = getAvailableModels(thirdCar.brand?.id, thirdCar.model).find(
                    (model) => model.id.toString() === value,
                  )
                  selectModel("third", selectedModel)
                }}
                disabled={!thirdCar.brand}
              >
                <SelectTrigger
                  className={`w-full p-3 border rounded-xl ${
                    thirdCar.brand
                      ? "border-brand-primary bg-white focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50 focus-visible:outline-none"
                      : "border-gray-300 bg-gray-50 cursor-not-allowed text-gray-400"
                  }`}
                >
                  <SelectValue placeholder={isRTL ? "اختر الطراز" : "Select Model"} />
                </SelectTrigger>
                <SelectContent className="border border-brand-light shadow-lg rounded-lg">
                  {thirdCar.brand &&
                    getAvailableModels(thirdCar.brand.id, thirdCar.model).map((model) => (
                      <SelectItem key={model.id} value={model.id.toString()}>
                        {getText(model.name)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{isRTL ? "السنة" : "Year"}</label>
              <Select
                value={thirdCar.year || ""}
                onValueChange={(value) => selectYear("third", value)}
                disabled={!thirdCar.model}
              >
                <SelectTrigger
                  className={`w-full p-3 border rounded-xl ${
                    thirdCar.model
                      ? "border-brand-primary bg-white focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50 focus-visible:outline-none"
                      : "border-gray-300 bg-gray-50 cursor-not-allowed text-gray-400"
                  }`}
                >
                  <SelectValue placeholder={isRTL ? "اختر السنة" : "Select Year"} />
                </SelectTrigger>
                <SelectContent className="border border-brand-light shadow-lg rounded-lg">
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <h3 className="text-lg font-medium text-gray-700 mb-3">{isRTL ? "السيارات المختارة" : "Selected Cars"}</h3>

            <div className="space-y-3">
              {/* First Car Summary */}
              {firstCar.model && (
                <div
                  className="p-4 border border-gray-200 rounded-lg flex justify-between items-center bg-white shadow-sm"
                  onClick={() => setActiveCarIndex(0)}
                >
                  <div className="flex items-center">
                    <Car className="w-5 h-5 text-brand-primary mr-2" />
                    <div>
                      <p className="font-medium">{getText(firstCar.model.name)}</p>
                      {firstCar.brand && <p className="text-sm text-gray-500">{getText(firstCar.brand.name)}</p>}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              )}

              {/* Second Car Summary */}
              {secondCar.model && (
                <div
                  className="p-4 border border-gray-200 rounded-lg flex justify-between items-center bg-white shadow-sm"
                  onClick={() => setActiveCarIndex(1)}
                >
                  <div className="flex items-center">
                    <Car className="w-5 h-5 text-brand-primary mr-2" />
                    <div>
                      <p className="font-medium">{getText(secondCar.model.name)}</p>
                      {secondCar.brand && <p className="text-sm text-gray-500">{getText(secondCar.brand.name)}</p>}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              )}

              {/* Third Car Summary (if enabled) */}
              {showThirdCar && thirdCar.model && (
                <div
                  className="p-4 border border-gray-200 rounded-lg flex justify-between items-center bg-white shadow-sm"
                  onClick={() => setActiveCarIndex(2)}
                >
                  <div className="flex items-center">
                    <Car className="w-5 h-5 text-brand-primary mr-2" />
                    <div>
                      <p className="font-medium">{getText(thirdCar.model.name)}</p>
                      {thirdCar.brand && <p className="text-sm text-gray-500">{getText(thirdCar.brand.name)}</p>}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
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
        <button
          onClick={handleCompare}
          className={`bg-brand-primary text-white px-6 py-4 md:px-10 md:py-4 rounded-lg md:rounded-full text-lg font-medium flex items-center gap-2 w-full md:w-auto md:shadow-md justify-center md:justify-start ${
            !canCompare ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!canCompare}
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
  )
}

export default CarComparisonSelector
