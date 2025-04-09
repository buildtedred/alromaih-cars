"use client"

import { useState, useEffect } from "react"
import { Plus, Check } from "lucide-react"
import { usePathname } from "next/navigation"
import CarComparisonResults from "./car-comparison-results"
import carsData from "@/app/api/mock-data"

const CarComparisonSelector = () => {
  const pathname = usePathname()
  const currentLocale = pathname.startsWith("/ar") ? "ar" : "en"
  const isRTL = currentLocale === "ar"

  // State to control whether to show results
  const [showResults, setShowResults] = useState(false)
  const [selectedCarIds, setSelectedCarIds] = useState({ car1: null, car2: null })
  const [cars, setCars] = useState([])

  useEffect(() => {
    // Set cars from the imported data
    setCars(carsData)
  }, [])

  // Extract unique brands from cars
  const brands = [...new Set(cars.map((car) => car.brand))].map((brandName) => ({
    id: brandName.toLowerCase(),
    name: { en: brandName, ar: brandName },
  }))

  // Group models by brand
  const models = brands.reduce((acc, brand) => {
    acc[brand.id] = cars
      .filter((car) => car.brand.toLowerCase() === brand.id)
      .map((car) => ({
        id: car.id,
        name: car.name,
      }))
    return acc
  }, {})

  const years = ["2024", "2023", "2022", "2021", "2020"]

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

  // State for dropdown visibility
  const [openDropdowns, setOpenDropdowns] = useState({
    firstCarBrand: false,
    firstCarModel: false,
    firstCarYear: false,
    secondCarBrand: false,
    secondCarModel: false,
    secondCarYear: false,
  })

  const toggleDropdown = (dropdown) => {
    setOpenDropdowns({
      ...openDropdowns,
      [dropdown]: !openDropdowns[dropdown],
    })
  }

  const selectBrand = (car, brand) => {
    if (car === "first") {
      setFirstCar({ ...firstCar, brand, model: null })
    } else {
      setSecondCar({ ...secondCar, brand, model: null })
    }
    toggleDropdown(car === "first" ? "firstCarBrand" : "secondCarBrand")
  }

  const selectModel = (car, model) => {
    if (car === "first") {
      setFirstCar({ ...firstCar, model })
    } else {
      setSecondCar({ ...secondCar, model })
    }
    toggleDropdown(car === "first" ? "firstCarModel" : "secondCarModel")
  }

  const selectYear = (car, year) => {
    if (car === "first") {
      setFirstCar({ ...firstCar, year })
    } else {
      setSecondCar({ ...secondCar, year })
    }
    toggleDropdown(car === "first" ? "firstCarYear" : "secondCarYear")
  }

  const getText = (textObj) => {
    if (!textObj) return ""
    return typeof textObj === "object" ? textObj[currentLocale] || textObj.en : textObj
  }

  const handleCompare = () => {
    // Show results on the same page
    if (firstCar.model && secondCar.model) {
      setSelectedCarIds({
        car1: firstCar.model.id,
        car2: secondCar.model.id,
      })
      setShowResults(true)
    }
  }

  const handleCompareAgain = () => {
    setShowResults(false)
  }

  // If showing results, render the comparison results component
  if (showResults) {
    return (
      <div className="w-full">
        <CarComparisonResults
          car1Id={selectedCarIds.car1}
          car2Id={selectedCarIds.car2}
          onCompareAgain={handleCompareAgain}
        />
      </div>
    )
  }

  // Otherwise, render the car selection form
  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm py-2">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">{isRTL ? "قارن بين السيارات" : "Compare Cars"}</h1>
        <p className="text-sm text-gray-600 mt-2">
          {isRTL ? "اختر سيارتين للمقارنة بينهما الآن" : "Select two cars to compare them now"}
        </p>
      </div>

      {/* Car Selection Panels */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6 ">
        {/* First Car Panel */}
        <div className="border border-gray-200 rounded-lg p-4 order-2 md:order-1">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-brand-primary bg-opacity-10 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-brand-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z" />
              </svg>
            </div>
          </div>
          <h3 className="text-center text-brand-primary font-bold mb-4">
            {isRTL ? "أضف السيارة الثانية" : "Add Second Car"}
          </h3>

          {/* Brand Dropdown */}
          <div className="mb-2 relative">
            <button
              onClick={() => toggleDropdown("secondCarBrand")}
              className="w-full flex items-center justify-between p-2 border border-gray-200 rounded-md"
            >
              <span className="text-sm">
                {secondCar.brand ? getText(secondCar.brand.name) : isRTL ? "الشركة المصنعة" : "Brand"}
              </span>
              <Check className="h-4 w-4 text-brand-primary" />
            </button>
            {openDropdowns.secondCarBrand && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                {brands.map((brand) => (
                  <div
                    key={brand.id}
                    className="p-2 hover:bg-brand-light cursor-pointer"
                    onClick={() => selectBrand("second", brand)}
                  >
                    {getText(brand.name)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Model Dropdown */}
          <div className="mb-2 relative">
            <button
              onClick={() => toggleDropdown("secondCarModel")}
              className={`w-full flex items-center justify-between p-2 border rounded-md ${
                secondCar.brand ? "border-gray-200" : "border-gray-200 bg-gray-100 cursor-not-allowed"
              }`}
              disabled={!secondCar.brand}
            >
              <span className="text-sm">
                {secondCar.model ? getText(secondCar.model.name) : isRTL ? "الطراز" : "Model"}
              </span>
              <Check className="h-4 w-4 text-brand-primary" />
            </button>
            {openDropdowns.secondCarModel && secondCar.brand && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                {models[secondCar.brand.id]?.map((model) => (
                  <div
                    key={model.id}
                    className="p-2 hover:bg-brand-light cursor-pointer"
                    onClick={() => selectModel("second", model)}
                  >
                    {getText(model.name)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Year Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("secondCarYear")}
              className={`w-full flex items-center justify-between p-2 border rounded-md ${
                secondCar.model ? "border-gray-200" : "border-gray-200 bg-gray-100 cursor-not-allowed"
              }`}
              disabled={!secondCar.model}
            >
              <span className="text-sm">{secondCar.year || (isRTL ? "السنة" : "Year")}</span>
              <Check className="h-4 w-4 text-brand-primary" />
            </button>
            {openDropdowns.secondCarYear && secondCar.model && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                {years.map((year) => (
                  <div
                    key={year}
                    className="p-2 hover:bg-brand-light cursor-pointer"
                    onClick={() => selectYear("second", year)}
                  >
                    {year}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Second Car Panel */}
        <div className="border border-gray-200 rounded-lg p-4 order-1 md:order-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-brand-primary bg-opacity-10 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-brand-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z" />
              </svg>
            </div>
          </div>
          <h3 className="text-center text-brand-primary font-bold mb-4">
            {isRTL ? "أضف السيارة الأولى" : "Add First Car"}
          </h3>

          {/* Brand Dropdown */}
          <div className="mb-2 relative">
            <button
              onClick={() => toggleDropdown("firstCarBrand")}
              className="w-full flex items-center justify-between p-2 border border-gray-200 rounded-md"
            >
              <span className="text-sm">
                {firstCar.brand ? getText(firstCar.brand.name) : isRTL ? "الشركة المصنعة" : "Brand"}
              </span>
              <Check className="h-4 w-4 text-brand-primary" />
            </button>
            {openDropdowns.firstCarBrand && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                {brands.map((brand) => (
                  <div
                    key={brand.id}
                    className="p-2 hover:bg-brand-light cursor-pointer"
                    onClick={() => selectBrand("first", brand)}
                  >
                    {getText(brand.name)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Model Dropdown */}
          <div className="mb-2 relative">
            <button
              onClick={() => toggleDropdown("firstCarModel")}
              className={`w-full flex items-center justify-between p-2 border rounded-md ${
                firstCar.brand ? "border-gray-200" : "border-gray-200 bg-gray-100 cursor-not-allowed"
              }`}
              disabled={!firstCar.brand}
            >
              <span className="text-sm">
                {firstCar.model ? getText(firstCar.model.name) : isRTL ? "الطراز" : "Model"}
              </span>
              <Check className="h-4 w-4 text-brand-primary" />
            </button>
            {openDropdowns.firstCarModel && firstCar.brand && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                {models[firstCar.brand.id]?.map((model) => (
                  <div
                    key={model.id}
                    className="p-2 hover:bg-brand-light cursor-pointer"
                    onClick={() => selectModel("first", model)}
                  >
                    {getText(model.name)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Year Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("firstCarYear")}
              className={`w-full flex items-center justify-between p-2 border rounded-md ${
                firstCar.model ? "border-gray-200" : "border-gray-200 bg-gray-100 cursor-not-allowed"
              }`}
              disabled={!firstCar.model}
            >
              <span className="text-sm">{firstCar.year || (isRTL ? "السنة" : "Year")}</span>
              <Check className="h-4 w-4 text-brand-primary" />
            </button>
            {openDropdowns.firstCarYear && firstCar.model && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                {years.map((year) => (
                  <div
                    key={year}
                    className="p-2 hover:bg-brand-light cursor-pointer"
                    onClick={() => selectYear("first", year)}
                  >
                    {year}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add More Cars Button */}
      <div className="flex justify-start mb-6">
        <button className="flex items-center text-brand-primary">
          <Plus className="h-5 w-5 mr-1" />
          <span>{isRTL ? "أضف سيارة أخرى" : "Add Another Car"}</span>
        </button>
      </div>

      {/* Compare Button */}
      <div className="flex justify-center">
        <button
          onClick={handleCompare}
          className={`bg-brand-primary text-white px-8 py-2 rounded-[10px] hover:bg-brand-dark transition-colors ${
            !(firstCar.year && secondCar.year) ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!(firstCar.year && secondCar.year)}
        >
          {isRTL ? "عرض المقارنة" : "Show Comparison"}
        </button>
      </div>
    </div>
  )
}

export default CarComparisonSelector

