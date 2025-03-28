"use client"

import { useState, useEffect } from "react"
import { Search, ChevronLeft } from "lucide-react"
import { usePathname } from "next/navigation"
import carsData from "@/app/api/mock-data" // Import the mock data
import Image from "next/image"

export default function FindPerfectCar() {
  const pathname = usePathname()
  const isArabic = pathname?.startsWith("/ar")

  const [paymentMethod, setPaymentMethod] = useState("")
  const [activeStep, setActiveStep] = useState(0)
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [selectedModel, setSelectedModel] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCar, setSelectedCar] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cars, setCars] = useState([])

  // Derived data from mock data
  const [carBrands, setCarBrands] = useState([])
  const [carModels, setCarModels] = useState({})
  const [carCategories, setCarCategories] = useState([])
  const [carYears, setCarYears] = useState([])

  const getText = (textObj) => {
    if (!textObj) return ""
    const currentLocale = pathname?.startsWith("/ar") ? "ar" : "en"
    return typeof textObj === "object" ? textObj[currentLocale] || textObj.en || "" : String(textObj)
  }

  // Use mock data instead of API call
  useEffect(() => {
    try {
      setLoading(true)

      // Add category field to each car based on the model name
      const processedCars = carsData.map((car) => {
        // Determine category based on model name
        let category = "SUV" // Default category
        const modelName = getText(car.name).toLowerCase()

        if (modelName.includes("x70") || modelName.includes("x90") || modelName.includes("x95")) {
          category = "SUV"
        } else if (modelName.includes("t1") || modelName.includes("t2")) {
          category = "Crossover"
        } else if (modelName.includes("dashing") || modelName.includes("camry") || modelName.includes("accord")) {
          category = "Sedan"
        }

        return { ...car, category }
      })

      setCars(processedCars)

      // Extract unique brands, models, categories, and years
      const brands = [...new Set(processedCars.map((car) => car.brand))]
      setCarBrands(brands)

      const categories = [...new Set(processedCars.map((car) => car.category))]
      setCarCategories(categories)

      const years = [...new Set(processedCars.map((car) => car.specs.year))]
      setCarYears(years.sort((a, b) => b - a)) // Sort years in descending order

      // Group models by brand
      const modelsByBrand = {}
      brands.forEach((brand) => {
        modelsByBrand[brand] = [
          ...new Set(processedCars.filter((car) => car.brand === brand).map((car) => getText(car.name))),
        ]
      })
      setCarModels(modelsByBrand)

      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setLoading(false)
    }
  }, [])

  const steps = [
    { id: 0, title: isArabic ? "اختر العلامة التجارية" : "Choose the brand", completed: false },
    { id: 1, title: isArabic ? "اختر الموديل" : "Select model", completed: false },
    { id: 2, title: isArabic ? "اختر الفئة" : "Select category", completed: false },
  ]

  const handleBack = () => {
    if (paymentMethod === "finance" && activeStep > 0) {
      // If we're showing the result and going back, reset showResult
      if (showResult) {
        setShowResult(false)
        return
      }

      setActiveStep(activeStep - 1)
      if (activeStep === 1) {
        setSelectedModel(null)
      } else if (activeStep === 2) {
        setSelectedCategory(null)
      }
    } else if (paymentMethod === "finance" && activeStep === 0) {
      setPaymentMethod("")
      setSelectedBrand(null)
      setSelectedModel(null)
      setSelectedCategory(null)
      setSelectedCar(null)
      setShowResult(false)
    }
  }

  const handleCarSelection = () => {
    // Find the car that matches the selected criteria
    const matchedCar = cars.find(
      (car) =>
        car.brand === selectedBrand && getText(car.name).includes(selectedModel) && car.category === selectedCategory,
    )

    if (matchedCar) {
      setSelectedCar(matchedCar)
      setShowResult(true)
    } else {
      // If no exact match, try to find a car with just the brand and model
      const fallbackCar = cars.find((car) => car.brand === selectedBrand && getText(car.name).includes(selectedModel))

      if (fallbackCar) {
        setSelectedCar(fallbackCar)
        setShowResult(true)
      } else {
        // Show an error or message that no car was found
        setError("No matching car found. Please try different criteria.")
      }
    }
  }

  const renderResult = () => {
    if (!selectedCar) return null

    return (
      <div className="p-8 pt-12 md:w-2/3 bg-brand-light/30">
        <div className="space-y-8">
          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2">
            {selectedBrand && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-brand-primary/20 text-sm text-brand-primary">
                {selectedBrand}
              </div>
            )}
            {selectedModel && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-brand-primary/20 text-sm text-brand-primary">
                {selectedModel}
              </div>
            )}
            {selectedCategory && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-brand-primary/20 text-sm text-brand-primary">
                {selectedCategory}
              </div>
            )}
          </div>

          {/* Car Details */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-brand-dark">{getText(selectedCar.name)}</h2>
            <p className="text-brand-primary">{getText(selectedCar.modelYear)}</p>
            <p className="text-xl font-bold text-brand-dark">{selectedCar.cashPrice.toLocaleString()} ريال</p>
          </div>

          {/* Car Image */}
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-white p-4">
            <img
              src={selectedCar.image || "/placeholder.svg"}
              alt={getText(selectedCar.name)}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Brand Logo */}
          <div className="flex justify-center">
            <div className="h-12 w-32 relative">
              <Image
                src={selectedCar.brandLogo || "/placeholder.svg?height=48&width=128"}
                alt={selectedCar.brand}
                width={128}
                height={48}
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>

          {/* Car Specifications */}
          <div className="bg-white rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-bold text-brand-dark">{isArabic ? "المواصفات" : "Specifications"}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{isArabic ? "المحرك" : "Engine"}</p>
                <p className="font-medium">{getText(selectedCar.specs.engine)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{isArabic ? "القوة الحصانية" : "Horsepower"}</p>
                <p className="font-medium">{getText(selectedCar.specs.power)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{isArabic ? "ناقل الحركة" : "Transmission"}</p>
                <p className="font-medium">{getText(selectedCar.specs.transmission)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{isArabic ? "نظام الدفع" : "Drivetrain"}</p>
                <p className="font-medium">{getText(selectedCar.specs.driveType)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{isArabic ? "عزم الدوران" : "Torque"}</p>
                <p className="font-medium">{getText(selectedCar.specs.torque)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{isArabic ? "نوع الوقود" : "Fuel Type"}</p>
                <p className="font-medium">{getText(selectedCar.specs.fuelType)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{isArabic ? "التسارع" : "Acceleration"}</p>
                <p className="font-medium">{getText(selectedCar.specs.acceleration)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{isArabic ? "المقاعد" : "Seats"}</p>
                <p className="font-medium">{getText(selectedCar.specs.seats)}</p>
              </div>
            </div>
          </div>

          {/* Additional Specifications */}
          <div className="bg-white rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-bold text-brand-dark">
              {isArabic ? "مواصفات إضافية" : "Additional Specifications"}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{isArabic ? "الطول" : "Length"}</p>
                <p className="font-medium">{getText(selectedCar.specs.length)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{isArabic ? "العرض" : "Width"}</p>
                <p className="font-medium">{getText(selectedCar.specs.width)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{isArabic ? "الارتفاع" : "Height"}</p>
                <p className="font-medium">{getText(selectedCar.specs.height)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{isArabic ? "قاعدة العجلات" : "Wheelbase"}</p>
                <p className="font-medium">{getText(selectedCar.specs.wheelbase)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{isArabic ? "سعة خزان الوقود" : "Fuel Tank"}</p>
                <p className="font-medium">{getText(selectedCar.specs.fuelTank)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{isArabic ? "سعة الحمولة" : "Cargo Capacity"}</p>
                <p className="font-medium">{getText(selectedCar.specs.cargoCapacity)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{isArabic ? "الوسائد الهوائية" : "Airbags"}</p>
                <p className="font-medium">{getText(selectedCar.specs.airbags)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{isArabic ? "المكابح" : "Brakes"}</p>
                <p className="font-medium">{getText(selectedCar.specs.brakes)}</p>
              </div>
            </div>
          </div>

          {/* Car Details Button */}
          <div className="text-center">
            <button
              className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark transition-colors"
              onClick={() => console.log("View car details")}
            >
              {isArabic ? "تواصل مع الوكيل" : "Contact Dealer"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderStepContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-brand-primary text-white rounded-lg"
            >
              {isArabic ? "إعادة المحاولة" : "Retry"}
            </button>
          </div>
        </div>
      )
    }

    if (showResult && selectedCar) {
      return renderResult()
    }

    switch (activeStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={isArabic ? "��بحث عن العلامة التجارية" : "Search brand"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-brand-primary/20 focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {carBrands
                .filter((brand) => brand.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((brand) => {
                  // Find a car with this brand to get the brandLogo
                  const carWithBrand = cars.find((car) => car.brand === brand)
                  const brandLogo = carWithBrand ? carWithBrand.brandLogo : "/placeholder.svg?height=32&width=64"

                  return (
                    <button
                      key={brand}
                      onClick={() => {
                        setSelectedBrand(brand)
                        setActiveStep(1)
                      }}
                      className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center justify-center"
                    >
                      {/* Brand Logo */}
                      <div className="h-8 w-16 relative mb-2">
                        <Image
                          src={brandLogo || "/placeholder.svg"}
                          alt={brand}
                          width={64}
                          height={32}
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                      <span className="font-medium">{brand}</span>
                    </button>
                  )
                })}
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={isArabic ? "ابحث عن الموديل" : "Search Model"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-brand-primary/20 focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedBrand && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-brand-primary/20 text-sm text-brand-primary">
                  {selectedBrand}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {selectedBrand &&
                carModels[selectedBrand]
                  ?.filter((model) => model.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((model) => (
                    <button
                      key={model}
                      onClick={() => {
                        setSelectedModel(model)
                        setActiveStep(2)
                      }}
                      className="p-4 bg-white rounded-lg border border-brand-primary/10 hover:border-brand-primary/30 transition-colors text-brand-dark"
                    >
                      {model}
                    </button>
                  ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={isArabic ? "ابحث عن الفئة" : "Search category"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-brand-primary/20 focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedBrand && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-brand-primary/20 text-sm text-brand-primary">
                  {selectedBrand}
                </div>
              )}
              {selectedModel && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-brand-primary/20 text-sm text-brand-primary">
                  {selectedModel}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {carCategories
                .filter((category) => category.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category)
                      handleCarSelection()
                    }}
                    className="p-4 bg-white rounded-lg border border-brand-primary/10 hover:border-brand-primary/30 transition-colors text-brand-dark"
                  >
                    {category}
                  </button>
                ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (!paymentMethod) {
    return (
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto rounded-xl overflow-hidden bg-brand-light/30">
        {/* Left side - Payment Method Selection */}
        <div className="p-8 md:w-1/2">
          <h1 className="text-2xl font-bold text-brand-primary mb-6">
            {isArabic ? "اختر طريقة الدفع" : "Choose Payment Method"}
          </h1>

          <p className="text-sm text-brand-primary mb-6">
            {isArabic
              ? "اختر الطريقة التي تناسبك لامتلاك سيارتك الجديدة سواء من خلال التمويل المريح أو الدفع النقدي المباشر."
              : "Choose the way that suits you to own your new car whether through convenient financing or direct cash payment."}
          </p>

          {/* Update the payment method buttons to be narrower and match the design in the image */}
          <div className="flex flex-col gap-3 mt-4">
            <button
              onClick={() => setPaymentMethod("cash")}
              className="flex items-center gap-3 px-4 py-3 rounded-md bg-white border border-brand-primary/20 hover:border-brand-primary/50 transition-colors w-40"
            >
              <div className="w-6 h-6 relative">
                <Image src="/icons/cash.svg" alt="Cash" width={24} height={24} className="text-brand-primary" />
              </div>
              <span className="text-brand-primary font-medium">{isArabic ? "نقدي" : "Cash"}</span>
            </button>

            <button
              onClick={() => setPaymentMethod("finance")}
              className="flex items-center gap-3 px-4 py-3 rounded-md bg-white border border-brand-primary/20 hover:border-brand-primary/50 transition-colors w-40"
            >
              <div className="w-6 h-6 relative">
                <Image src="/icons/finance.svg" alt="Finance" width={24} height={24} className="text-brand-primary" />
              </div>
              <span className="text-brand-primary font-medium">{isArabic ? "تمويل" : "Finance"}</span>
            </button>
          </div>
        </div>

        {/* Right side - Process Diagram */}
        <div className="p-8 md:w-1/2 flex items-center justify-center">
          {/* Update the circular diagram to match the image exactly */}
          <div className="relative w-64 h-64">
            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-brand-primary/10 z-10"></div>

            {/* Top circle - Compare & Explore */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 text-center">
              <p className="text-xs text-brand-primary font-medium mb-2">
                {isArabic ? "قارن واستكشف" : "Compare & Explore"}
              </p>
              <div className="w-20 h-20 rounded-full bg-brand-light mx-auto flex items-center justify-center">
                <Image src="/icons/CompareCar.svg" alt="Compare & Explore" width={40} height={40} />
              </div>
            </div>

            {/* Right circle - Get Suitable Price */}
            <div className="absolute top-1/2 right-0 transform translate-x-1/4 -translate-y-1/2 text-center">
              <div className="w-20 h-20 rounded-full bg-brand-light mx-auto flex items-center justify-center mb-2">
                <Image src="/icons/Get-Suitable-Price.svg" alt="Get Suitable Price" width={40} height={40} />
              </div>
              <p className="text-xs text-brand-primary font-medium whitespace-nowrap">
                {isArabic ? "احصل على السعر المناسب" : "Get Suitable Price"}
              </p>
            </div>

            {/* Bottom circle - Car Home Delivery */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/4 text-center">
              <div className="w-20 h-20 rounded-full bg-brand-light mx-auto flex items-center justify-center mb-2">
                <Image src="/icons/Car-Home-Delivery.svg" alt="Car Home Delivery" width={40} height={40} />
              </div>
              <p className="text-xs text-brand-primary font-medium">
                {isArabic ? "توصيل السيارة للمنزل" : "Car Home Delivery"}
              </p>
            </div>

            {/* Left circle - Discover Car */}
            <div className="absolute top-1/2 left-0 transform -translate-x-1/4 -translate-y-1/2 text-center">
              <div className="w-20 h-20 rounded-full bg-brand-light mx-auto flex items-center justify-center mb-2">
                <Image src="/icons/DiscoverCar.svg" alt="Discover Car" width={40} height={40} />
              </div>
              <p className="text-xs text-brand-primary font-medium">{isArabic ? "اكتشف السيارة" : "Discover Car"}</p>
            </div>

            {/* Connecting lines as curved paths to match the image */}
            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 200 200" fill="none">
              <path
                d="M100 40 C 90 60, 80 80, 80 100"
                stroke="currentColor"
                className="text-brand-primary"
                strokeWidth="1"
              />
              <path
                d="M120 100 C 140 80, 160 60, 160 100"
                stroke="currentColor"
                className="text-brand-primary"
                strokeWidth="1"
              />
              <path
                d="M100 160 C 110 140, 120 120, 120 100"
                stroke="currentColor"
                className="text-brand-primary"
                strokeWidth="1"
              />
              <path
                d="M40 100 C 60 120, 80 140, 80 100"
                stroke="currentColor"
                className="text-brand-primary"
                strokeWidth="1"
              />
            </svg>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto rounded-xl overflow-hidden bg-brand-light/30">
      {paymentMethod === "cash" ? (
        <>
          {/* Left side - Payment Method Selection (Selected Cash) */}
          <div className="p-8 md:w-1/2">
            <h1 className="text-2xl font-bold text-brand-primary mb-6">
              {isArabic ? "اختر طريقة الدفع" : "Choose Payment Method"}
            </h1>

            <p className="text-sm text-brand-primary mb-6">
              {isArabic
                ? "اختر الطريقة التي تناسبك لامتلاك سيارتك الجديدة سواء من خلال التمويل المريح أو الدفع النقدي المباشر."
                : "Choose the way that suits you to own your new car whether through convenient financing or direct cash payment."}
            </p>

            {/* Update the selected cash button style */}
            <div className="flex flex-col gap-3 mt-4">
              <button
                onClick={() => setPaymentMethod("cash")}
                className="flex items-center gap-3 px-4 py-3 rounded-md bg-white border-2 border-brand-primary transition-colors w-40"
              >
                <div className="w-6 h-6 relative">
                  <Image src="/icons/cash.svg" alt="Cash" width={24} height={24} className="text-brand-primary" />
                </div>
                <span className="text-brand-primary font-medium">{isArabic ? "نقدي" : "Cash"}</span>
              </button>

              <button
                onClick={() => setPaymentMethod("finance")}
                className="flex items-center gap-3 px-4 py-3 rounded-md bg-white border border-brand-primary/20 hover:border-brand-primary/50 transition-colors w-40"
              >
                <div className="w-6 h-6 relative">
                  <Image src="/icons/finance.svg" alt="Finance" width={24} height={24} className="text-brand-primary" />
                </div>
                <span className="text-brand-primary font-medium">{isArabic ? "تمويل" : "Finance"}</span>
              </button>
            </div>
          </div>

          {/* Right side - Process Diagram */}
          <div className="p-8 md:w-1/2 flex items-center justify-center">
            {/* Update the circular diagram to match the image exactly */}
            <div className="relative w-64 h-64">
              {/* Center circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-brand-primary/10 z-10"></div>

              {/* Top circle - Compare & Explore */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 text-center">
                <p className="text-xs text-brand-primary font-medium mb-2">
                  {isArabic ? "قارن واستكشف" : "Compare & Explore"}
                </p>
                <div className="w-20 h-20 rounded-full bg-brand-light mx-auto flex items-center justify-center">
                  <Image src="/icons/CompareCar.svg" alt="Compare & Explore" width={40} height={40} />
                </div>
              </div>

              {/* Right circle - Get Suitable Price */}
              <div className="absolute top-1/2 right-0 transform translate-x-1/4 -translate-y-1/2 text-center">
                <div className="w-20 h-20 rounded-full bg-brand-light mx-auto flex items-center justify-center mb-2">
                  <Image src="/icons/Get-Suitable-Price.svg" alt="Get Suitable Price" width={40} height={40} />
                </div>
                <p className="text-xs text-brand-primary font-medium whitespace-nowrap">
                  {isArabic ? "احصل على السعر المناسب" : "Get Suitable Price"}
                </p>
              </div>

              {/* Bottom circle - Car Home Delivery */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/4 text-center">
                <div className="w-20 h-20 rounded-full bg-brand-light mx-auto flex items-center justify-center mb-2">
                  <Image src="/icons/Car-Home-Delivery.svg" alt="Car Home Delivery" width={40} height={40} />
                </div>
                <p className="text-xs text-brand-primary font-medium">
                  {isArabic ? "توصيل السيارة للمنزل" : "Car Home Delivery"}
                </p>
              </div>

              {/* Left circle - Discover Car */}
              <div className="absolute top-1/2 left-0 transform -translate-x-1/4 -translate-y-1/2 text-center">
                <div className="w-20 h-20 rounded-full bg-brand-light mx-auto flex items-center justify-center mb-2">
                  <Image src="/icons/DiscoverCar.svg" alt="Discover Car" width={40} height={40} />
                </div>
                <p className="text-xs text-brand-primary font-medium">{isArabic ? "اكتشف السيارة" : "Discover Car"}</p>
              </div>

              {/* Connecting lines as curved paths to match the image */}
              <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 200 200" fill="none">
                <path
                  d="M100 40 C 90 60, 80 80, 80 100"
                  stroke="currentColor"
                  className="text-brand-primary"
                  strokeWidth="1"
                />
                <path
                  d="M120 100 C 140 80, 160 60, 160 100"
                  stroke="currentColor"
                  className="text-brand-primary"
                  strokeWidth="1"
                />
                <path
                  d="M100 160 C 110 140, 120 120, 120 100"
                  stroke="currentColor"
                  className="text-brand-primary"
                  strokeWidth="1"
                />
                <path
                  d="M40 100 C 60 120, 80 140, 80 100"
                  stroke="currentColor"
                  className="text-brand-primary"
                  strokeWidth="1"
                />
              </svg>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col md:flex-row w-full relative">
          <button
            onClick={handleBack}
            className="absolute top-0 left-0 p-4 hover:bg-brand-primary/5 rounded-br-xl transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6 text-brand-primary" />
            <span className="sr-only">{isArabic ? "العودة" : "Go back"}</span>
          </button>

          <div className="p-8 md:w-1/3 border-r border-brand-primary/10 bg-brand-light/30">
            <div className="relative mt-12">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-start mb-8 relative">
                  <div className="flex flex-col items-center mr-4">
                    <div
                      className={`w-10 h-10 flex items-center justify-center relative overflow-visible
                        ${
                          index < activeStep || (index === 2 && showResult && selectedCar)
                            ? ""
                            : index === activeStep
                              ? "bg-brand-primary text-white rounded-lg"
                              : "bg-brand-primary/10 text-brand-primary/30 rounded-lg"
                        }`}
                    >
                      {index < activeStep || (index === 2 && showResult && selectedCar) ? (
                        <svg
                          width="25"
                          height="24"
                          viewBox="0 0 25 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-brand-primary"
                        >
                          <path
                            d="M4.67195 0.0805694C7.03552 -0.150928 9.70639 0.20298 12.1013 0.0772385C13.5792 0.466122 13.4754 2.5546 11.9241 2.73613C9.78548 2.98678 7.20853 2.56542 5.02208 2.7403C3.97828 2.82357 3.08937 3.57136 2.75489 4.5623C2.51104 9.30301 2.72194 14.0979 2.64697 18.8577C2.73759 20.1693 3.68912 21.1336 4.96276 21.3168L18.6548 21.3193C19.8197 21.2227 20.852 20.2708 21.011 19.0884C21.2895 17.0099 20.8413 14.386 21.025 12.2459C21.17 10.5521 23.2823 10.4222 23.6736 12.0044C23.5501 14.331 23.8582 16.8642 23.6778 19.1658C23.4809 21.6798 21.3686 23.7691 18.8987 23.9965L4.83754 23.9998C2.28531 23.7708 0.257859 21.7381 0 19.1658L0.00576682 4.83877C0.257859 2.40221 2.23918 0.318729 4.67195 0.0805694Z"
                            fill="currentColor"
                          />
                          <path
                            d="M23.4779 1.38704C24.5819 1.24381 25.3167 2.3555 24.862 3.34645C20.9661 7.51757 16.8387 11.4872 12.8571 15.5842C12.1544 16.1696 11.5703 16.1971 10.8511 15.615C9.29566 13.8346 7.23773 12.235 5.73177 10.4421C4.5232 9.00315 5.88006 7.40099 7.40003 8.31949L11.8611 12.7729L22.8749 1.65018C23.0339 1.51028 23.2695 1.41452 23.4779 1.38704Z"
                            fill="currentColor"
                          />
                        </svg>
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-0.5 h-8 ${index < activeStep ? "bg-brand-primary" : "bg-brand-primary/20"}`} />
                    )}
                  </div>
                  <div className={`flex-1 pt-2 ${index === activeStep ? "" : "opacity-50"}`}>
                    <h4 className="text-sm font-medium text-brand-primary">{step.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 pt-12 md:w-2/3 bg-brand-light/30">{renderStepContent()}</div>
        </div>
      )}
    </div>
  )
}

