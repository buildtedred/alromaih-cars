"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Check, Car, ArrowRight, ArrowLeft, Plus, Minus } from "lucide-react"
import { usePathname } from "next/navigation"
import CarComparisonResults from "./car-comparison-results"
import carsData from "@/app/api/mock-data"

const CarComparisonSelector = () => {
  const pathname = usePathname()
  const currentLocale = pathname.startsWith("/ar") ? "ar" : "en"
  const isRTL = currentLocale === "ar"

  // State to control whether to show results
  const [showResults, setShowResults] = useState(false)
  const [selectedCarIds, setSelectedCarIds] = useState({ car1: null, car2: null, car3: null })
  const [cars, setCars] = useState([])
  const [showThirdCar, setShowThirdCar] = useState(false)

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

  const [thirdCar, setThirdCar] = useState({
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
    thirdCarBrand: false,
    thirdCarModel: false,
    thirdCarYear: false,
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
    } else if (car === "second") {
      setSecondCar({ ...secondCar, brand, model: null })
    } else if (car === "third") {
      setThirdCar({ ...thirdCar, brand, model: null })
    }
    toggleDropdown(car === "first" ? "firstCarBrand" : car === "second" ? "secondCarBrand" : "thirdCarBrand")
  }

  const selectModel = (car, model) => {
    if (car === "first") {
      setFirstCar({ ...firstCar, model })
    } else if (car === "second") {
      setSecondCar({ ...secondCar, model })
    } else if (car === "third") {
      setThirdCar({ ...thirdCar, model })
    }
    toggleDropdown(car === "first" ? "firstCarModel" : car === "second" ? "secondCarModel" : "thirdCarModel")
  }

  const selectYear = (car, year) => {
    if (car === "first") {
      setFirstCar({ ...firstCar, year })
    } else if (car === "second") {
      setSecondCar({ ...secondCar, year })
    } else if (car === "third") {
      setThirdCar({ ...thirdCar, year })
    }
    toggleDropdown(car === "first" ? "firstCarYear" : car === "second" ? "secondCarYear" : "thirdCarYear")
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

  // Otherwise, render the car selection form
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-md p-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-brand-primary mb-2">{isRTL ? "قارن بين السيارات" : "Compare Cars"}</h1>
        <p className="text-gray-600">
          {isRTL ? "اختر سيارتين أو ثلاث للمقارنة بينهم الآن" : "Select two or three cars to compare them now"}
        </p>
      </div>

      {/* Car Selection Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        {/* First Car Panel */}
        <div className="bg-gradient-to-b from-[#f8f6f9] to-[#f0ebf1] rounded-2xl p-6 shadow-sm">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-brand-primary bg-opacity-10 rounded-full flex items-center justify-center">
              <Car className="w-10 h-10 text-brand-primary" />
            </div>
          </div>
          <h3 className="text-center text-brand-primary text-xl font-bold mb-6">
            {isRTL ? "السيارة الأولى" : "First Car"}
          </h3>

          {/* Brand Dropdown */}
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">{isRTL ? "الشركة المصنعة" : "Brand"}</label>
            <button
              onClick={() => toggleDropdown("firstCarBrand")}
              className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-xl bg-white hover:border-brand-primary transition-colors"
            >
              <span>
                {firstCar.brand ? getText(firstCar.brand.name) : isRTL ? "اختر الشركة المصنعة" : "Select Brand"}
              </span>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            {openDropdowns.firstCarBrand && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                {brands.map((brand) => (
                  <div
                    key={brand.id}
                    className="p-3 hover:bg-brand-light cursor-pointer flex items-center justify-between"
                    onClick={() => selectBrand("first", brand)}
                  >
                    <span>{getText(brand.name)}</span>
                    {firstCar.brand && firstCar.brand.id === brand.id && (
                      <Check className="h-5 w-5 text-brand-primary" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Model Dropdown */}
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">{isRTL ? "الطراز" : "Model"}</label>
            <button
              onClick={() => toggleDropdown("firstCarModel")}
              className={`w-full flex items-center justify-between p-3 border rounded-xl ${
                firstCar.brand
                  ? "border-gray-200 bg-white hover:border-brand-primary"
                  : "border-gray-200 bg-gray-50 cursor-not-allowed text-gray-400"
              } transition-colors`}
              disabled={!firstCar.brand}
            >
              <span>{firstCar.model ? getText(firstCar.model.name) : isRTL ? "اختر الطراز" : "Select Model"}</span>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            {openDropdowns.firstCarModel && firstCar.brand && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                {models[firstCar.brand.id]?.map((model) => (
                  <div
                    key={model.id}
                    className="p-3 hover:bg-brand-light cursor-pointer flex items-center justify-between"
                    onClick={() => selectModel("first", model)}
                  >
                    <span>{getText(model.name)}</span>
                    {firstCar.model && firstCar.model.id === model.id && (
                      <Check className="h-5 w-5 text-brand-primary" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Year Dropdown */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">{isRTL ? "السنة" : "Year"}</label>
            <button
              onClick={() => toggleDropdown("firstCarYear")}
              className={`w-full flex items-center justify-between p-3 border rounded-xl ${
                firstCar.model
                  ? "border-gray-200 bg-white hover:border-brand-primary"
                  : "border-gray-200 bg-gray-50 cursor-not-allowed text-gray-400"
              } transition-colors`}
              disabled={!firstCar.model}
            >
              <span>{firstCar.year || (isRTL ? "اختر السنة" : "Select Year")}</span>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            {openDropdowns.firstCarYear && firstCar.model && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                {years.map((year) => (
                  <div
                    key={year}
                    className="p-3 hover:bg-brand-light cursor-pointer flex items-center justify-between"
                    onClick={() => selectYear("first", year)}
                  >
                    <span>{year}</span>
                    {firstCar.year === year && <Check className="h-5 w-5 text-brand-primary" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Second Car Panel */}
        <div className="bg-gradient-to-b from-[#f8f6f9] to-[#f0ebf1] rounded-2xl p-6 shadow-sm">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-brand-primary bg-opacity-10 rounded-full flex items-center justify-center">
              <Car className="w-10 h-10 text-brand-primary" />
            </div>
          </div>
          <h3 className="text-center text-brand-primary text-xl font-bold mb-6">
            {isRTL ? "السيارة الثانية" : "Second Car"}
          </h3>

          {/* Brand Dropdown */}
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">{isRTL ? "الشركة المصنعة" : "Brand"}</label>
            <button
              onClick={() => toggleDropdown("secondCarBrand")}
              className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-xl bg-white hover:border-brand-primary transition-colors"
            >
              <span>
                {secondCar.brand ? getText(secondCar.brand.name) : isRTL ? "اختر الشركة المصنعة" : "Select Brand"}
              </span>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            {openDropdowns.secondCarBrand && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                {brands.map((brand) => (
                  <div
                    key={brand.id}
                    className="p-3 hover:bg-brand-light cursor-pointer flex items-center justify-between"
                    onClick={() => selectBrand("second", brand)}
                  >
                    <span>{getText(brand.name)}</span>
                    {secondCar.brand && secondCar.brand.id === brand.id && (
                      <Check className="h-5 w-5 text-brand-primary" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Model Dropdown */}
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">{isRTL ? "الطراز" : "Model"}</label>
            <button
              onClick={() => toggleDropdown("secondCarModel")}
              className={`w-full flex items-center justify-between p-3 border rounded-xl ${
                secondCar.brand
                  ? "border-gray-200 bg-white hover:border-brand-primary"
                  : "border-gray-200 bg-gray-50 cursor-not-allowed text-gray-400"
              } transition-colors`}
              disabled={!secondCar.brand}
            >
              <span>{secondCar.model ? getText(secondCar.model.name) : isRTL ? "اختر الطراز" : "Select Model"}</span>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            {openDropdowns.secondCarModel && secondCar.brand && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                {models[secondCar.brand.id]?.map((model) => (
                  <div
                    key={model.id}
                    className="p-3 hover:bg-brand-light cursor-pointer flex items-center justify-between"
                    onClick={() => selectModel("second", model)}
                  >
                    <span>{getText(model.name)}</span>
                    {secondCar.model && secondCar.model.id === model.id && (
                      <Check className="h-5 w-5 text-brand-primary" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Year Dropdown */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">{isRTL ? "السنة" : "Year"}</label>
            <button
              onClick={() => toggleDropdown("secondCarYear")}
              className={`w-full flex items-center justify-between p-3 border rounded-xl ${
                secondCar.model
                  ? "border-gray-200 bg-white hover:border-brand-primary"
                  : "border-gray-200 bg-gray-50 cursor-not-allowed text-gray-400"
              } transition-colors`}
              disabled={!secondCar.model}
            >
              <span>{secondCar.year || (isRTL ? "اختر السنة" : "Select Year")}</span>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            {openDropdowns.secondCarYear && secondCar.model && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                {years.map((year) => (
                  <div
                    key={year}
                    className="p-3 hover:bg-brand-light cursor-pointer flex items-center justify-between"
                    onClick={() => selectYear("second", year)}
                  >
                    <span>{year}</span>
                    {secondCar.year === year && <Check className="h-5 w-5 text-brand-primary" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Third Car Panel (conditionally rendered) */}
        {showThirdCar ? (
          <div className="bg-gradient-to-b from-[#f8f6f9] to-[#f0ebf1] rounded-2xl p-6 shadow-sm relative">
            {/* Remove Third Car Button */}
            <button
              onClick={toggleThirdCar}
              className="absolute top-3 right-3 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-500 hover:bg-red-200 transition-colors"
              aria-label={isRTL ? "إزالة السيارة الثالثة" : "Remove third car"}
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-brand-primary bg-opacity-10 rounded-full flex items-center justify-center">
                <Car className="w-10 h-10 text-brand-primary" />
              </div>
            </div>
            <h3 className="text-center text-brand-primary text-xl font-bold mb-6">
              {isRTL ? "السيارة الثالثة" : "Third Car"}
            </h3>

            {/* Brand Dropdown */}
            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isRTL ? "الشركة المصنعة" : "Brand"}
              </label>
              <button
                onClick={() => toggleDropdown("thirdCarBrand")}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-xl bg-white hover:border-brand-primary transition-colors"
              >
                <span>
                  {thirdCar.brand ? getText(thirdCar.brand.name) : isRTL ? "اختر الشركة المصنعة" : "Select Brand"}
                </span>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </button>
              {openDropdowns.thirdCarBrand && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                  {brands.map((brand) => (
                    <div
                      key={brand.id}
                      className="p-3 hover:bg-brand-light cursor-pointer flex items-center justify-between"
                      onClick={() => selectBrand("third", brand)}
                    >
                      <span>{getText(brand.name)}</span>
                      {thirdCar.brand && thirdCar.brand.id === brand.id && (
                        <Check className="h-5 w-5 text-brand-primary" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Model Dropdown */}
            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">{isRTL ? "الطراز" : "Model"}</label>
              <button
                onClick={() => toggleDropdown("thirdCarModel")}
                className={`w-full flex items-center justify-between p-3 border rounded-xl ${
                  thirdCar.brand
                    ? "border-gray-200 bg-white hover:border-brand-primary"
                    : "border-gray-200 bg-gray-50 cursor-not-allowed text-gray-400"
                } transition-colors`}
                disabled={!thirdCar.brand}
              >
                <span>{thirdCar.model ? getText(thirdCar.model.name) : isRTL ? "اختر الطراز" : "Select Model"}</span>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </button>
              {openDropdowns.thirdCarModel && thirdCar.brand && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                  {models[thirdCar.brand.id]?.map((model) => (
                    <div
                      key={model.id}
                      className="p-3 hover:bg-brand-light cursor-pointer flex items-center justify-between"
                      onClick={() => selectModel("third", model)}
                    >
                      <span>{getText(model.name)}</span>
                      {thirdCar.model && thirdCar.model.id === model.id && (
                        <Check className="h-5 w-5 text-brand-primary" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Year Dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">{isRTL ? "السنة" : "Year"}</label>
              <button
                onClick={() => toggleDropdown("thirdCarYear")}
                className={`w-full flex items-center justify-between p-3 border rounded-xl ${
                  thirdCar.model
                    ? "border-gray-200 bg-white hover:border-brand-primary"
                    : "border-gray-200 bg-gray-50 cursor-not-allowed text-gray-400"
                } transition-colors`}
                disabled={!thirdCar.model}
              >
                <span>{thirdCar.year || (isRTL ? "اختر السنة" : "Select Year")}</span>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </button>
              {openDropdowns.thirdCarYear && thirdCar.model && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                  {years.map((year) => (
                    <div
                      key={year}
                      className="p-3 hover:bg-brand-light cursor-pointer flex items-center justify-between"
                      onClick={() => selectYear("third", year)}
                    >
                      <span>{year}</span>
                      {thirdCar.year === year && <Check className="h-5 w-5 text-brand-primary" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <button
              onClick={toggleThirdCar}
              className="h-full w-full border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center p-6 hover:border-brand-primary hover:bg-brand-light bg-opacity-30 transition-colors"
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

      {/* Compare Button */}
      <div className="flex justify-center">
        <button
          onClick={handleCompare}
          className={`bg-brand-primary text-white px-10 py-4 rounded-full hover:bg-opacity-90 transition-colors text-lg font-medium shadow-md flex items-center gap-2 ${
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
