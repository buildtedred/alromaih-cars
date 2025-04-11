"use client"

import { useState, useEffect } from "react"
import { Search, X, ArrowLeft, ArrowRight, Check } from "lucide-react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

// Import mock data (assuming this exists in your project)
import carsData from "@/app/api/mock-data"

// Custom scrollbar styles
const scrollbarStyles = `
  .scrollbar-custom::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  .scrollbar-custom::-webkit-scrollbar-track {
    background: rgba(113, 48, 138, 0.05);
    border-radius: 10px;
  }
  
  .scrollbar-custom::-webkit-scrollbar-thumb {
    background: #71308a;
    border-radius: 10px;
  }
  
  .scrollbar-custom::-webkit-scrollbar-thumb:hover {
    background: #4a1d6e;
  }
`

export default function CarFinderModal() {
  const pathname = usePathname()
  const isArabic = pathname?.startsWith("/ar")
  const [isOpen, setIsOpen] = useState(false)
  const [initialPaymentMethod, setInitialPaymentMethod] = useState("")

  const openModalWithPaymentMethod = (method) => {
    setInitialPaymentMethod(method)
    setIsOpen(true)
  }

  return (
    <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto rounded-xl overflow-hidden bg-brand-light/30 shadow-lg">
      {/* Left side - Payment Method Selection */}
      <div className="p-4 sm:p-6 md:p-8 md:w-1/2">
        <h1 className="text-xl sm:text-2xl font-bold text-brand-primary mb-4 sm:mb-6">
          {isArabic ? "اختر طريقة الدفع" : "Choose Payment Method"}
        </h1>

        <p className="text-xs sm:text-sm text-brand-primary mb-4 sm:mb-6">
          {isArabic
            ? "اختر الطريقة التي تناسبك لامتلاك سيارتك الجديدة سواء من خلال التمويل المريح أو الدفع النقدي المباشر."
            : "Choose the way that suits you to own your new car whether through convenient financing or direct cash payment."}
        </p>

        {/* Payment method buttons that open the modal */}
        <div className="flex flex-row sm:flex-col gap-3 mt-4">
          <button
            onClick={() => openModalWithPaymentMethod("cash")}
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-md bg-white shadow-lg hover:border-brand-primary/50 transition-colors w-full sm:w-40"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 relative">
              <Image src="/icons/cash.svg" alt="Cash" width={24} height={24} className="text-brand-primary" />
            </div>
            <span className="text-brand-primary font-medium text-sm sm:text-base">{isArabic ? "نقدي" : "Cash"}</span>
          </button>

          <button
            onClick={() => openModalWithPaymentMethod("finance")}
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-md bg-white shadow-lg hover:border-brand-primary/50 transition-colors w-full sm:w-40"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 relative">
              <Image src="/icons/finance.svg" alt="Finance" width={24} height={24} className="text-brand-primary" />
            </div>
            <span className="text-brand-primary font-medium text-sm sm:text-base">
              {isArabic ? "تمويل" : "Finance"}
            </span>
          </button>
        </div>
      </div>

      {/* Right side - Process Diagram */}
      <div className="p-4 sm:p-6 md:p-8 md:w-1/2 flex items-center justify-center">
        {/* Circular diagram - make it smaller on mobile */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64">
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

          {/* Connecting lines as curved paths */}
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

      {/* Modal Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-6xl p-0 border-none bg-transparent">
          <DialogTitle className="sr-only">{isArabic ? "اختيار السيارة" : "Car Selection"}</DialogTitle>
          <CarFinderContent initialPaymentMethod={initialPaymentMethod} onClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CarFinderContent({ initialPaymentMethod, onClose }) {
  const pathname = usePathname()
  const isArabic = pathname?.startsWith("/ar")

  const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod || "")
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
  const [showFinanceModal, setShowFinanceModal] = useState(false)
  const [financeDetails, setFinanceDetails] = useState({
    downPayment: 20,
    loanTerm: 60,
    interestRate: 3.5,
    monthlyPayment: 0,
  })
  const [activeTab, setActiveTab] = useState("specs")

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

  // Calculate monthly payment when car or finance details change
  useEffect(() => {
    if (selectedCar && paymentMethod === "finance") {
      calculateMonthlyPayment()
    }
  }, [selectedCar, financeDetails.downPayment, financeDetails.loanTerm, financeDetails.interestRate])

  const calculateMonthlyPayment = () => {
    if (!selectedCar) return

    const carPrice = selectedCar.cashPrice
    const downPaymentAmount = (carPrice * financeDetails.downPayment) / 100
    const loanAmount = carPrice - downPaymentAmount
    const monthlyInterest = financeDetails.interestRate / 100 / 12
    const months = financeDetails.loanTerm

    // Monthly payment formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const monthlyPayment =
      (loanAmount * monthlyInterest * Math.pow(1 + monthlyInterest, months)) /
      (Math.pow(1 + monthlyInterest, months) - 1)

    setFinanceDetails((prev) => ({
      ...prev,
      monthlyPayment: Math.round(monthlyPayment),
    }))
  }

  const steps = [
    { id: 0, title: isArabic ? "اختر العلامة التجارية" : "Choose the brand", completed: false },
    { id: 1, title: isArabic ? "اختر الموديل" : "Select model", completed: false },
    { id: 2, title: isArabic ? "اختر الفئة" : "Select category", completed: false },
  ]

  const handleBack = () => {
    if (activeStep > 0) {
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
    } else {
      // If at first step, close the modal
      onClose()
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

  const handleFinanceModalClose = () => {
    setShowFinanceModal(false)
  }

  const handleFinanceDetailChange = (field, value) => {
    setFinanceDetails((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const renderFinanceModal = () => {
    if (!showFinanceModal || !selectedCar) return null

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-xl font-bold text-brand-primary">{isArabic ? "تفاصيل التمويل" : "Finance Details"}</h3>
            <button onClick={handleFinanceModalClose} className="p-2 rounded-full hover:bg-gray-100">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">{isArabic ? "السيارة" : "Car"}</span>
                <span className="font-medium">{getText(selectedCar.name)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">{isArabic ? "السعر الإجمالي" : "Total Price"}</span>
                <span className="font-medium">{selectedCar.cashPrice.toLocaleString()} ريال</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {isArabic ? "الدفعة المقدمة (%)" : "Down Payment (%)"}
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={financeDetails.downPayment}
                    onChange={(e) => handleFinanceDetailChange("downPayment", Number.parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-2 w-12 text-center">{financeDetails.downPayment}%</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {((selectedCar.cashPrice * financeDetails.downPayment) / 100).toLocaleString()} ريال
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {isArabic ? "مدة القرض (شهر)" : "Loan Term (months)"}
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="12"
                    max="84"
                    step="12"
                    value={financeDetails.loanTerm}
                    onChange={(e) => handleFinanceDetailChange("loanTerm", Number.parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-2 w-12 text-center">{financeDetails.loanTerm}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {isArabic ? "معدل الفائدة (%)" : "Interest Rate (%)"}
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={financeDetails.interestRate}
                    onChange={(e) => handleFinanceDetailChange("interestRate", Number.parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-2 w-12 text-center">{financeDetails.interestRate}%</span>
                </div>
              </div>
            </div>

            <div className="bg-brand-light/30 p-4 rounded-lg mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm">{isArabic ? "القسط الشهري" : "Monthly Payment"}</span>
                <span className="font-bold text-xl text-brand-primary">
                  {financeDetails.monthlyPayment.toLocaleString()} ريال
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{isArabic ? "إجمالي المدفوعات" : "Total Payments"}</span>
                <span>{(financeDetails.monthlyPayment * financeDetails.loanTerm).toLocaleString()} ريال</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleFinanceModalClose}
                className="flex-1 py-2 border border-brand-primary text-brand-primary rounded-lg hover:bg-brand-primary/5"
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </button>
              <button className="flex-1 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90">
                {isArabic ? "تقديم طلب التمويل" : "Apply for Financing"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderResult = () => {
    if (!selectedCar) return null

    return (
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 w-full bg-brand-light/30 h-[calc(100vh-180px)] overflow-y-auto scrollbar-custom">
        {/* Back button */}
        {isArabic ? (
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-brand-primary mb-4 hover:text-brand-dark transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>رجوع</span>
          </button>
        ) : (
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-brand-primary mb-4 hover:text-brand-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        )}

        <div className="space-y-4">
          {/* Filter Tags */}
          <div className={`flex flex-wrap gap-2 ${isArabic ? "justify-end" : ""}`}>
            {selectedBrand && (
              <div className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full bg-white border border-brand-primary/20 text-xs sm:text-sm text-brand-primary">
                {selectedBrand}
              </div>
            )}
            {selectedModel && (
              <div className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full bg-white border border-brand-primary/20 text-xs sm:text-sm text-brand-primary">
                {selectedModel}
              </div>
            )}
            {selectedCategory && (
              <div className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full bg-white border border-brand-primary/20 text-xs sm:text-sm text-brand-primary">
                {selectedCategory}
              </div>
            )}
          </div>

          {/* Car Basic Info - Compact for Mobile */}
          <div className="bg-white rounded-lg p-3 flex items-center gap-3 md:hidden">
            <div className="w-16 h-16 relative shrink-0">
              <Image
                src={selectedCar.brandLogo || "/placeholder.svg?height=64&width=64"}
                alt={selectedCar.brand}
                width={64}
                height={64}
                style={{ objectFit: "contain" }}
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-dark">{getText(selectedCar.name)}</h2>
              <p className="text-sm text-brand-primary">{getText(selectedCar.modelYear)}</p>
              <p className="text-base font-bold text-brand-dark">{selectedCar.cashPrice.toLocaleString()} ريال</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column - Car Image and Basic Info */}
            <div className={`space-y-4 ${isArabic ? "md:order-2" : ""}`}>
              {/* Car Details - Desktop Only */}
              <div className={`hidden md:block text-center md:text-left space-y-2 ${isArabic ? "md:text-right" : ""}`}>
                <h2 className="text-xl md:text-2xl font-bold text-brand-dark">{getText(selectedCar.name)}</h2>
                <p className="text-brand-primary">{getText(selectedCar.modelYear)}</p>
                <p className="text-lg md:text-xl font-bold text-brand-dark">
                  {selectedCar.cashPrice.toLocaleString()} ريال
                </p>
              </div>

              {/* Car Image */}
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-white p-4">
                <img
                  src={selectedCar.image || "/placeholder.svg"}
                  alt={getText(selectedCar.name)}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Brand Logo - Desktop Only */}
              <div className={`hidden md:flex justify-center md:justify-start ${isArabic ? "md:justify-end" : ""}`}>
                <div className="h-10 w-28 relative">
                  <Image
                    src={selectedCar.brandLogo || "/placeholder.svg?height=40&width=112"}
                    alt={selectedCar.brand}
                    width={112}
                    height={40}
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>

              {/* Action Buttons - Mobile View */}
              <div className="flex flex-col gap-3 md:hidden">
                <button
                  className="w-full py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark transition-colors"
                  onClick={() => console.log("View car details")}
                >
                  {isArabic ? "تواصل مع الوكيل" : "Contact Dealer"}
                </button>
              </div>
            </div>

            {/* Right Column - Specifications */}
            <div className={`space-y-4 ${isArabic ? "md:order-1" : ""}`}>
              {/* Tabs for Mobile */}
              <div className="flex border-b border-gray-200 md:hidden">
                <button
                  className={`flex-1 py-2 text-sm font-medium ${
                    activeTab === "specs" ? "text-brand-primary border-b-2 border-brand-primary" : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("specs")}
                >
                  {isArabic ? "المواصفات" : "Specifications"}
                </button>
                <button
                  className={`flex-1 py-2 text-sm font-medium ${
                    activeTab === "additional" ? "text-brand-primary border-b-2 border-brand-primary" : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("additional")}
                >
                  {isArabic ? "مواصفات إضافية" : "Additional"}
                </button>
              </div>

              {/* Car Specifications */}
              <div
                className={`bg-white rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3 ${activeTab !== "specs" && "hidden md:block"}`}
              >
                <h3
                  className={`text-sm sm:text-base md:text-lg font-bold text-brand-dark ${isArabic ? "text-right" : ""}`}
                >
                  {isArabic ? "المواصفات" : "Specifications"}
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className={`space-y-0.5 sm:space-y-1 ${isArabic ? "text-right" : ""}`}>
                    <p className="text-xs text-muted-foreground">{isArabic ? "المحرك" : "Engine"}</p>
                    <p className="text-xs sm:text-sm md:text-base font-medium">{getText(selectedCar.specs.engine)}</p>
                  </div>
                  <div className={`space-y-0.5 sm:space-y-1 ${isArabic ? "text-right" : ""}`}>
                    <p className="text-xs text-muted-foreground">{isArabic ? "القوة الحصانية" : "Horsepower"}</p>
                    <p className="text-xs sm:text-sm md:text-base font-medium">{getText(selectedCar.specs.power)}</p>
                  </div>
                  <div className={`space-y-0.5 sm:space-y-1 ${isArabic ? "text-right" : ""}`}>
                    <p className="text-xs text-muted-foreground">{isArabic ? "ناقل الحركة" : "Transmission"}</p>
                    <p className="text-xs sm:text-sm md:text-base font-medium">
                      {getText(selectedCar.specs.transmission)}
                    </p>
                  </div>
                  <div className={`space-y-0.5 sm:space-y-1 ${isArabic ? "text-right" : ""}`}>
                    <p className="text-xs text-muted-foreground">{isArabic ? "نظام الدفع" : "Drivetrain"}</p>
                    <p className="text-xs sm:text-sm md:text-base font-medium">
                      {getText(selectedCar.specs.driveType)}
                    </p>
                  </div>
                  <div className={`space-y-0.5 sm:space-y-1 ${isArabic ? "text-right" : ""}`}>
                    <p className="text-xs text-muted-foreground">{isArabic ? "عزم الدوران" : "Torque"}</p>
                    <p className="text-xs sm:text-sm md:text-base font-medium">{getText(selectedCar.specs.torque)}</p>
                  </div>
                  <div className={`space-y-0.5 sm:space-y-1 ${isArabic ? "text-right" : ""}`}>
                    <p className="text-xs text-muted-foreground">{isArabic ? "نوع الوقود" : "Fuel Type"}</p>
                    <p className="text-xs sm:text-sm md:text-base font-medium">{getText(selectedCar.specs.fuelType)}</p>
                  </div>
                  <div className={`space-y-0.5 sm:space-y-1 ${isArabic ? "text-right" : ""}`}>
                    <p className="text-xs text-muted-foreground">{isArabic ? "التسارع" : "Acceleration"}</p>
                    <p className="text-xs sm:text-sm md:text-base font-medium">
                      {getText(selectedCar.specs.acceleration)}
                    </p>
                  </div>
                  <div className={`space-y-0.5 sm:space-y-1 ${isArabic ? "text-right" : ""}`}>
                    <p className="text-xs text-muted-foreground">{isArabic ? "المقاعد" : "Seats"}</p>
                    <p className="text-xs sm:text-sm md:text-base font-medium">{getText(selectedCar.specs.seats)}</p>
                  </div>
                </div>
              </div>

              {/* Additional Specifications */}
              <div
                className={`bg-white rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3 ${activeTab !== "additional" && "hidden md:block"}`}
              >
                <h3
                  className={`text-sm sm:text-base md:text-lg font-bold text-brand-dark ${isArabic ? "text-right" : ""}`}
                >
                  {isArabic ? "مواصفات إضافية" : "Additional Specifications"}
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className={`space-y-0.5 sm:space-y-1 ${isArabic ? "text-right" : ""}`}>
                    <p className="text-xs text-muted-foreground">{isArabic ? "الطول" : "Length"}</p>
                    <p className="text-xs sm:text-sm md:text-base font-medium">{getText(selectedCar.specs.length)}</p>
                  </div>
                  <div className={`space-y-0.5 sm:space-y-1 ${isArabic ? "text-right" : ""}`}>
                    <p className="text-xs text-muted-foreground">{isArabic ? "العرض" : "Width"}</p>
                    <p className="text-xs sm:text-sm md:text-base font-medium">{getText(selectedCar.specs.width)}</p>
                  </div>
                  <div className={`space-y-0.5 sm:space-y-1 ${isArabic ? "text-right" : ""}`}>
                    <p className="text-xs text-muted-foreground">{isArabic ? "الارتفاع" : "Height"}</p>
                    <p className="text-xs sm:text-sm md:text-base font-medium">{getText(selectedCar.specs.height)}</p>
                  </div>
                  <div className={`space-y-0.5 sm:space-y-1 ${isArabic ? "text-right" : ""}`}>
                    <p className="text-xs text-muted-foreground">{isArabic ? "قاعدة العجلات" : "Wheelbase"}</p>
                    <p className="text-xs sm:text-sm md:text-base font-medium">
                      {getText(selectedCar.specs.wheelbase)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Desktop View */}
              <div className="hidden md:flex md:flex-row gap-3 mt-4">
                <button
                  className="flex-1 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark transition-colors"
                  onClick={() => console.log("View car details")}
                >
                  {isArabic ? "تواصل مع الوكيل" : "Contact Dealer"}
                </button>
              </div>
            </div>
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
          <div className="p-4 md:p-6 lg:p-8 space-y-6 h-[calc(100vh-180px)] overflow-y-auto scrollbar-custom">
            {/* Back button */}
            {isArabic ? (
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-brand-primary mb-4 hover:text-brand-dark transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                <span>رجوع</span>
              </button>
            ) : (
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-brand-primary mb-4 hover:text-brand-dark transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            <div className="relative">
              <Search
                className={`absolute ${isArabic ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5`}
              />
              <input
                type="text"
                placeholder={isArabic ? "ابحث عن العلامة التجارية" : "Search brand"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${isArabic ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 rounded-lg border border-brand-primary/20 focus:outline-none focus:border-brand-primary text-sm sm:text-base ${isArabic ? "text-right" : ""}`}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-4">
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
          <div className="p-4 md:p-6 lg:p-8 space-y-6 h-[calc(100vh-180px)] overflow-y-auto scrollbar-custom">
            {/* Back button */}
            {isArabic ? (
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-brand-primary mb-4 hover:text-brand-dark transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                <span>رجوع</span>
              </button>
            ) : (
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-brand-primary mb-4 hover:text-brand-dark transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            <div className="relative">
              <Search
                className={`absolute ${isArabic ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`}
              />
              <input
                type="text"
                placeholder={isArabic ? "ابحث عن الموديل" : "Search Model"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${isArabic ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 rounded-lg border border-brand-primary/20 focus:outline-none focus:border-brand-primary text-sm sm:text-base ${isArabic ? "text-right" : ""}`}
              />
            </div>

            <div className={`flex flex-wrap gap-2 ${isArabic ? "justify-end" : ""}`}>
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
          <div className="p-4 md:p-6 lg:p-8 space-y-6 h-[calc(100vh-180px)] overflow-y-auto scrollbar-custom">
            {/* Back button */}
            {isArabic ? (
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-brand-primary mb-4 hover:text-brand-dark transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                <span>رجوع</span>
              </button>
            ) : (
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-brand-primary mb-4 hover:text-brand-dark transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            <div className="relative">
              <Search
                className={`absolute ${isArabic ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`}
              />
              <input
                type="text"
                placeholder={isArabic ? "ابحث عن الفئة" : "Search category"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${isArabic ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 rounded-lg border border-brand-primary/20 focus:outline-none focus:border-brand-primary text-sm sm:text-base ${isArabic ? "text-right" : ""}`}
              />
            </div>

            <div className={`flex flex-wrap gap-2 ${isArabic ? "justify-end" : ""}`}>
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

  return (
    <div className="flex flex-col w-full relative border border-brand-primary/20 shadow-lg rounded-xl overflow-hidden bg-white">
      {/* Vertical Steps Indicator for Mobile */}
      <div className="flex flex-col md:flex-row w-full">
        <div
          className={`p-4 pt-6 w-full md:w-1/4 bg-brand-light/30 border-b md:border-b-0 ${
            isArabic ? "md:border-l" : "md:border-r"
          } border-brand-primary/10 ${isArabic ? "md:order-1" : "md:order-1"}`}
        >
          {/* Mobile Steps (Horizontal) */}
          <div className="flex md:hidden justify-between items-center w-full px-2 py-3">
            {isArabic
              ? // Arabic - reversed order
                [...steps]
                  .reverse()
                  .map((step, index) => {
                    const actualIndex = steps.length - 1 - index
                    return (
                      <div key={step.id} className="flex flex-col items-center relative">
                        {/* Step Circle */}
                        <div
                          className={`
                w-8 h-8 rounded-full flex items-center justify-center z-10
                ${
                  actualIndex < activeStep || (actualIndex === 2 && showResult && selectedCar)
                    ? "bg-brand-primary text-white"
                    : actualIndex === activeStep
                      ? "bg-brand-primary text-white"
                      : "bg-gray-200 text-gray-500"
                }
              `}
                        >
                          {actualIndex < activeStep || (actualIndex === 2 && showResult && selectedCar) ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <span>{actualIndex + 1}</span>
                          )}
                        </div>

                        {/* Step Label */}
                        <span
                          className={`text-xs mt-2 text-center max-w-[80px] px-1 ${
                            actualIndex === activeStep ? "text-brand-primary font-medium" : "text-gray-500"
                          }`}
                        >
                          {step.title}
                        </span>

                        {/* Connecting Line */}
                        {index < steps.length - 1 && (
                          <div className="absolute top-4 right-[calc(100%_-_8px)] w-[calc(100%_-_16px)] h-0.5 -z-0">
                            <div
                              className={`h-full ${actualIndex > activeStep ? "bg-brand-primary" : "bg-gray-200"}`}
                            ></div>
                          </div>
                        )}
                      </div>
                    )
                  })
              : // English - normal order
                steps.map((step, index) => (
                  <div key={step.id} className="flex flex-col items-center relative">
                    {/* Step Circle */}
                    <div
                      className={`
            w-8 h-8 rounded-full flex items-center justify-center z-10
            ${
              index < activeStep || (index === 2 && showResult && selectedCar)
                ? "bg-brand-primary text-white"
                : index === activeStep
                  ? "bg-brand-primary text-white"
                  : "bg-gray-200 text-gray-500"
            }
          `}
                    >
                      {index < activeStep || (index === 2 && showResult && selectedCar) ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>

                    {/* Step Label */}
                    <span
                      className={`text-xs mt-2 text-center max-w-[80px] px-1 ${
                        index === activeStep ? "text-brand-primary font-medium" : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </span>

                    {/* Connecting Line */}
                    {index < steps.length - 1 && (
                      <div className="absolute top-4 left-[calc(100%_-_8px)] w-[calc(100%_-_16px)] h-0.5 -z-0">
                        <div className={`h-full ${index < activeStep ? "bg-brand-primary" : "bg-gray-200"}`}></div>
                      </div>
                    )}
                  </div>
                ))}
          </div>

          {/* Desktop Steps (Vertical) */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Vertical Line */}
              <div
                className={`absolute ${isArabic ? "right-4" : "left-4"} top-4 w-0.5 h-[calc(100%_-_32px)] bg-gray-200`}
              ></div>

              {steps.map((step, index) => (
                <div key={step.id} className="flex items-start mb-8 relative">
                  {/* Step Circle */}
                  <div
                    className={`
            w-8 h-8 rounded-full flex items-center justify-center z-10
            ${
              index < activeStep || (index === 2 && showResult && selectedCar)
                ? "bg-brand-primary text-white"
                : index === activeStep
                  ? "bg-brand-primary text-white"
                  : "bg-gray-200 text-gray-500"
            }
          `}
                  >
                    {index < activeStep || (index === 2 && showResult && selectedCar) ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className={`${isArabic ? "ml-6 mr-2" : "ml-4"} ${isArabic ? "text-right" : ""}`}>
                    <p
                      className={`text-sm font-medium ${index === activeStep ? "text-brand-primary" : "text-gray-600"}`}
                    >
                      {step.title}
                    </p>

                    {/* Selected Value */}
                    {index === 0 && selectedBrand && (
                      <p className="text-xs text-brand-primary/70 mt-1">{selectedBrand}</p>
                    )}
                    {index === 1 && selectedModel && (
                      <p className="text-xs text-brand-primary/70 mt-1">{selectedModel}</p>
                    )}
                    {index === 2 && selectedCategory && (
                      <p className="text-xs text-brand-primary/70 mt-1">{selectedCategory}</p>
                    )}
                  </div>

                  {/* Colored Line Segment */}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute ${isArabic ? "right-4" : "left-4"} top-8 w-0.5 h-[calc(100%_-_8px)] bg-brand-primary`}
                      style={{ opacity: index < activeStep ? 1 : 0 }}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`w-full md:w-3/4 bg-brand-light/10 ${isArabic ? "md:order-2" : "md:order-2"}`}>
          {renderStepContent()}
        </div>
      </div>
      {renderFinanceModal()}
    </div>
  )
}
