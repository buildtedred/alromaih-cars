"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Check, X, Heart, Share2, Printer, Download, BarChart3, Gauge, Fuel, Sparkles, Award, Zap, Shield, Maximize, Users, TrendingUp, TrendingDown, Minus, ArrowLeft, ArrowRight } from 'lucide-react'
import carsData, { specNames, specCategories } from "@/app/api/mock-data"
import { toggleWishlistItem, isInWishlist } from "@/lib/wishlist-utils"
import ShareDialog from "./share-dialog"
import { Breadcrumb } from "../breadcrumb"

// Print styles
const printStyles = `
  @media print {
    body {
      background-color: white !important;
      color: black !important;
      font-size: 12pt;
    }
    
    @page {
      size: A4;
      margin: 1.5cm;
    }
    
    .no-print {
      display: none !important;
      
    }
    
    .print-only {
      display: block !important;
    }
    
    .print-break-after {
      page-break-after: always;
    }
    
    .print-break-avoid {
      page-break-inside: avoid;
    }
    
    .print-full-width {
      width: 100% !important;
      max-width: 100% !important;
    }
    
    .print-container {
      padding: 0 !important;
      margin: 0 !important;
      background-color: white !important;
    }
    
    .print-shadow-none {
      box-shadow: none !important;
      border: 1px solid #ddd !important;
    }
    
    .print-header {
      background: #46194F !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color: white !important;
      padding: 15px !important;
      margin-bottom: 20px !important;
      text-align: center !important;
    }
    
    .print-section {
      margin-bottom: 20px !important;
      page-break-inside: avoid;
    }
    
    .print-table {
      width: 100% !important;
      border-collapse: collapse !important;
      margin-bottom: 20px !important;
    }
    
    .print-table th, .print-table td {
      border: 1px solid #ddd !important;
      padding: 8px !important;
      text-align: left !important;
    }
    
    .print-table th {
      background-color: #f2f2f2 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    
    .print-car-card {
      page-break-inside: avoid;
      margin-bottom: 15px !important;
    }
    
    .print-footer {
      text-align: center;
      font-size: 10pt;
      color: #666;
      margin-top: 20px;
    }
    
    .print-page-number:after {
      content: counter(page);
    }
  }
`

const CarComparisonResults = ({ car1Id, car2Id, car3Id, onCompareAgain }) => {
  const pathname = usePathname()
  const currentLocale = pathname.startsWith("/ar") ? "ar" : "en"
  const isRTL = currentLocale === "ar"
  const contentRef = useRef(null)

  const [car1, setCar1] = useState(null)
  const [car2, setCar2] = useState(null)
  const [car3, setCar3] = useState(null)
  const [openCategories, setOpenCategories] = useState({
    transmission: true, // Open the first category by default
    engine: false,
    dimensions: false,
    capacity: false,
    safety: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [activeCarIndex, setActiveCarIndex] = useState(0) // For mobile carousel
  const [activeTab, setActiveTab] = useState("specs") // specs, features, price
  const [favorites, setFavorites] = useState([])
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)

  const handlePrint = () => {
    // Create a style element for print styles
    const style = document.createElement("style")
    style.innerHTML = printStyles
    document.head.appendChild(style)

    // Set up print-specific classes
    const content = contentRef.current
    if (content) {
      content.classList.add("print-container")

      // Hide elements that shouldn't be printed
      const noPrintElements = content.querySelectorAll(".no-print")
      noPrintElements.forEach((el) => {
        el.setAttribute("data-original-display", el.style.display)
        el.style.display = "none"
      })

      // Show print-only elements
      const printOnlyElements = content.querySelectorAll(".print-only")
      printOnlyElements.forEach((el) => {
        el.setAttribute("data-original-display", el.style.display)
        el.style.display = "block"
      })

      // Add print classes to elements
      const carCards = content.querySelectorAll(".car-card")
      carCards.forEach((card) => card.classList.add("print-car-card", "print-break-avoid"))

      const tables = content.querySelectorAll("table")
      tables.forEach((table) => table.classList.add("print-table"))

      const sections = content.querySelectorAll("section")
      sections.forEach((section) => section.classList.add("print-section"))
    }

    // Print the document
    window.print()

    // Clean up after printing
    setTimeout(() => {
      if (content) {
        content.classList.remove("print-container")

        // Restore display of no-print elements
        const noPrintElements = content.querySelectorAll(".no-print")
        noPrintElements.forEach((el) => {
          el.style.display = el.getAttribute("data-original-display") || ""
          el.removeAttribute("data-original-display")
        })

        // Restore display of print-only elements
        const printOnlyElements = content.querySelectorAll(".print-only")
        printOnlyElements.forEach((el) => {
          el.style.display = el.getAttribute("data-original-display") || ""
          el.removeAttribute("data-original-display")
        })
      }

      // Remove the style element
      document.head.removeChild(style)
    }, 1000)
  }

  const handleDownload = async () => {
    if (isGeneratingPDF) return

    setIsGeneratingPDF(true)

    try {
      // Import the PDF component and generate the PDF
      const { generatePDF } = await import("./car-comparison-pdf")
      const pdfBlob = await generatePDF(
        {
          car1,
          car2,
          car3: car3 ? car3 : null,
        },
        currentLocale,
      )

      // Create a download link and trigger the download
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `car-comparison-${new Date().toISOString().slice(0, 10)}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleShare = () => {
    setIsShareDialogOpen(true)
  }

  // Determine if we have 2 or 3 cars to compare
  const hasThirdCar = !!car3Id

  useEffect(() => {
    setIsLoading(true)

    const findCarById = (id) => {
      const foundCar = carsData.find((car) => car.id === id)
      return foundCar || carsData[0]
    }

    const timer = setTimeout(() => {
      setCar1(findCarById(car1Id || 1))
      setCar2(findCarById(car2Id || 4))
      if (car3Id) {
        setCar3(findCarById(car3Id))
      }
      setIsLoading(false)
    }, 0)

    return () => clearTimeout(timer)
  }, [car1Id, car2Id, car3Id])

  const toggleCategory = (categoryId) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  const getText = (textObj) => {
    if (!textObj) return ""
    return typeof textObj === "object" ? textObj[currentLocale] || textObj.en : textObj
  }

  // Get user-friendly spec name
  const getSpecName = (spec) => {
    return getText(specNames[spec] || { en: spec, ar: spec })
  }

  // Get the active car based on the current index
  const getActiveCar = () => {
    if (activeCarIndex === 0) return car1
    if (activeCarIndex === 1) return car2
    return car3
  }

  // Navigate between cars on mobile
  const navigateToPreviousCar = () => {
    if (activeCarIndex > 0) {
      setActiveCarIndex(activeCarIndex - 1)
    } else if (hasThirdCar) {
      setActiveCarIndex(2) // Cycle to the last car
    } else {
      setActiveCarIndex(1) // Cycle to the second car
    }
  }

  const navigateToNextCar = () => {
    if (hasThirdCar && activeCarIndex < 2) {
      setActiveCarIndex(activeCarIndex + 1)
    } else if (!hasThirdCar && activeCarIndex < 1) {
      setActiveCarIndex(activeCarIndex + 1)
    } else {
      setActiveCarIndex(0) // Cycle back to the first car
    }
  }

  // Toggle favorite status
  const toggleFavorite = (carId) => {
    // Find the car object by ID
    const carToToggle = carId === car1.id ? car1 : carId === car2.id ? car2 : car3

    // Toggle in localStorage using the wishlist utility
    toggleWishlistItem(carToToggle)

    // Update local state
    setFavorites((prev) => {
      if (prev.includes(carId)) {
        return prev.filter((id) => id !== carId)
      } else {
        return [...prev, carId]
      }
    })
  }

  // Get status badge for car
  const getStatusBadge = (status) => {
    if (!status) return null

    let badgeClass = ""
    let badgeText = ""
    let icon = null

    switch (status) {
      case "new":
        badgeClass = "bg-brand-primary bg-opacity-90 text-white"
        badgeText = isRTL ? "جديد" : "New"
        icon = <Sparkles className="w-3 h-3" />
        break
      case "discount":
        badgeClass = "bg-brand-primary bg-opacity-70 text-white"
        badgeText = isRTL ? "خصم" : "Discount"
        icon = (
          <div className="w-3 h-3 relative">
            <Image src={car1.icons.currency || "/placeholder.svg"} alt="Currency" width={12} height={12} />
          </div>
        )
        break
      case "unavailable":
        badgeClass = "bg-brand-primary bg-opacity-50 text-white"
        badgeText = isRTL ? "غير متوفر" : "Unavailable"
        icon = <X className="w-3 h-3" />
        break
      default:
        return null
    }

    return (
      <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-md ${badgeClass}`}>
        {icon}
        {badgeText}
      </div>
    )
  }

  // Get icon for spec category
  const getSpecIcon = (categoryId) => {
    switch (categoryId) {
      case "transmission":
        return <Gauge className="w-5 h-5" />
      case "engine":
        return <Zap className="w-5 h-5" />
      case "dimensions":
        return <Maximize className="w-5 h-5" />
      case "capacity":
        return <Users className="w-5 h-5" />
      case "safety":
        return <Shield className="w-5 h-5" />
      default:
        return <BarChart3 className="w-5 h-5" />
    }
  }

  // Get price comparison icon
  const getPriceComparisonIcon = (car, lowestPrice, highestPrice) => {
    if (car.cashPrice === highestPrice) {
      return <TrendingUp className="w-4 h-4 text-brand-primary" />
    } else if (car.cashPrice === lowestPrice) {
      return <TrendingDown className="w-4 h-4 text-brand-primary" />
    } else {
      return <Minus className="w-4 h-4 text-brand-primary text-opacity-50" />
    }
  }

  // Initialize favorites from localStorage
  useEffect(() => {
    if (car1 && car2) {
      const initialFavorites = []
      if (isInWishlist(car1.id)) initialFavorites.push(car1.id)
      if (isInWishlist(car2.id)) initialFavorites.push(car2.id)
      if (hasThirdCar && car3 && isInWishlist(car3.id)) initialFavorites.push(car3.id)
      setFavorites(initialFavorites)
    }
  }, [car1, car2, car3, hasThirdCar])

  if (isLoading || !car1 || !car2 || (hasThirdCar && !car3)) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-center items-center h-60">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-brand-light mb-6"></div>
            <div className="h-6 w-64 bg-brand-light rounded mb-4"></div>
            <div className="h-4 w-48 bg-brand-light rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  // Create a reusable car card component
  const CarCard = ({ car }) => (
    <div className="flex flex-col h-full car-card">
      {/* Car Image with Gradient Overlay */}
      <div className="relative h-56 bg-gradient-to-br from-brand-primary to-[#2D0F33] rounded-t-xl overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),_transparent_70%)]"></div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent"></div>

        <Image
          src={car.image || "/placeholder.svg?height=200&width=300"}
          alt={getText(car.name)}
          fill
          style={{ objectFit: "contain" }}
          className="p-4 z-10"
        />

        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-20">{getStatusBadge(car.status)}</div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            toggleFavorite(car.id)
          }}
          className="absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center z-20 transition-all bg-white/20 text-white hover:bg-white/30"
        >
          <Heart className={`w-4 h-4 ${favorites.includes(car.id) ? "fill-brand-primary" : ""}`} />
        </button>

        {/* Car Name Overlay */}
        <div className="absolute bottom-4 left-0 w-full px-5 z-20">
          <h3 className="text-xl font-bold text-white">{getText(car.name)}</h3>
          <p className="text-sm text-gray-300">{getText(car.modelYear)}</p>
        </div>
      </div>

      {/* Car Info */}
      <div className="flex-1 p-6 border border-gray-200 rounded-b-xl bg-white">
        {/* Brand Logo */}
        <div className="h-12 flex items-center justify-center mb-5 border-b border-brand-light pb-5">
          <Image
            src={car.brandLogo || "/placeholder.svg?height=30&width=100"}
            alt={car.brand}
            width={100}
            height={30}
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Price */}
        <div className="mb-6 bg-gradient-to-r from-brand-light to-white rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">{isRTL ? "سعر الكاش" : "Cash Price"}</span>
            <span className="text-xl font-bold text-brand-primary flex items-center">
              <Image
                src={car.icons.currency || "/placeholder.svg"}
                alt="Currency"
                width={18}
                height={18}
                className={isRTL ? "ml-1" : "mr-1"}
              />
              {car.cashPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Key Specs */}
        <div className="grid grid-cols-2 gap-4">
          {/* Engine */}
          <div className="bg-brand-light bg-opacity-30 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-brand-primary bg-opacity-20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-brand-primary" />
              </div>
              <span className="text-sm font-medium text-gray-700">{isRTL ? "المحرك" : "Engine"}</span>
            </div>
            <p className="text-sm font-medium ml-11">{getText(car.specs.engine)}</p>
            <p className="text-xs text-gray-500 ml-11">{getText(car.specs.power)}</p>
          </div>

          {/* Transmission */}
          <div className="bg-brand-light bg-opacity-30 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-brand-primary bg-opacity-20 flex items-center justify-center">
                <Gauge className="w-4 h-4 text-brand-primary" />
              </div>
              <span className="text-sm font-medium text-gray-700">{isRTL ? "ناقل الحركة" : "Transmission"}</span>
            </div>
            <p className="text-sm font-medium ml-11">{getText(car.specs.transmission)}</p>
          </div>

          {/* Fuel */}
          <div className="bg-brand-light bg-opacity-30 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-brand-primary bg-opacity-20 flex items-center justify-center">
                <Fuel className="w-4 h-4 text-brand-primary" />
              </div>
              <span className="text-sm font-medium text-gray-700">{isRTL ? "الوقود" : "Fuel"}</span>
            </div>
            <p className="text-sm font-medium ml-11">{getText(car.specs.fuelType)}</p>
          </div>

          {/* Seats */}
          <div className="bg-brand-light bg-opacity-30 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-brand-primary bg-opacity-20 flex items-center justify-center">
                <Users className="w-4 h-4 text-brand-primary" />
              </div>
              <span className="text-sm font-medium text-gray-700">{isRTL ? "المقاعد" : "Seats"}</span>
            </div>
            <p className="text-sm font-medium ml-11">{getText(car.specs.seats)}</p>
          </div>
        </div>
      </div>
    </div>
  )

  // Calculate price-related values
  const highestPrice = Math.max(car1.cashPrice, car2.cashPrice, car3?.cashPrice || 0)
  const lowestPrice = Math.min(car1.cashPrice, car2.cashPrice, car3?.cashPrice || Number.POSITIVE_INFINITY)
  const priceDifference = highestPrice - lowestPrice

  // Generate breadcrumb items
  const getBreadcrumbItems = () => {
    const items = [
      {
        label: isRTL ? "المقارنات" : "Comparisons",
        href: `/${currentLocale}/compare-cars`,
      },
    ]

    // Add car names if they're loaded
    if (car1 && car2) {
      const car1Name = getText(car1.name)
      const car2Name = getText(car2.name)

      if (hasThirdCar && car3) {
        items.push({
          label: `${car1Name} vs ${car2Name} vs ${getText(car3.name)}`,
        })
      } else {
        items.push({
          label: `${car1Name} vs ${car2Name}`,
        })
      }
    }

    return items
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="max-w-7xl mx-auto" ref={contentRef}>
      {/* Breadcrumb Navigation */}
      <div
      onClick={onCompareAgain} 
       className="mb-4 px-4 sm:px-0">
        <Breadcrumb  items={getBreadcrumbItems()} className="text-sm" />
      </div>
      {/* Header with Gradient Background */}
      <div className="relative mb-10 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-[#2D0F33]"></div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=1200')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 px-6 py-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-3">{isRTL ? "قارن بين السيارات" : "Compare Cars"}</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            {isRTL
              ? "مقارنة تفصيلية بين السيارات لمساعدتك في اتخاذ القرار الأفضل"
              : "Detailed car comparison to help you make the best decision"}
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-6 no-print">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-white/20 text-white hover:bg-white/30 transition-colors backdrop-blur-sm"
              style={{ borderRadius: "5px" }}
            >
              <Printer className="w-4 h-4" />
              <span>{isRTL ? "طباعة" : "Print"}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-white/20 text-white hover:bg-white/30 transition-colors backdrop-blur-sm"
              style={{ borderRadius: "5px" }}
            >
              <Share2 className="w-4 h-4" />
              <span>{isRTL ? "مشاركة" : "Share"}</span>
            </button>
            {isShareDialogOpen && (
              <ShareDialog
                isOpen={isShareDialogOpen}
                onClose={() => setIsShareDialogOpen(false)}
                carData={{ car1, car2, car3: hasThirdCar ? car3 : null }}
                currentLocale={currentLocale}
              />
            )}
            <button
              onClick={handleDownload}
              disabled={isGeneratingPDF}
              className={`flex items-center gap-2 px-4 py-2 rounded-md bg-white/20 text-white hover:bg-white/30 transition-colors backdrop-blur-sm ${isGeneratingPDF ? "opacity-50 cursor-wait" : ""}`}
              style={{ borderRadius: "5px" }}
            >
              <Download className="w-4 h-4" />
              <span>
                {isRTL
                  ? isGeneratingPDF
                    ? "جاري التحميل..."
                    : "تحميل"
                  : isGeneratingPDF
                    ? "Generating..."
                    : "Download"}
              </span>
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -ml-32 -mb-32"></div>
      </div>
      {/* Mobile Car Carousel */}
      <div className="md:hidden mb-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-brand-light">
          {/* Car Image with Gradient Overlay */}
          <div className="relative h-56 bg-gradient-to-br from-brand-primary to-[#2D0F33]">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),_transparent_70%)]"></div>
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent"></div>

            <Image
              src={getActiveCar().image || "/placeholder.svg?height=200&width=300"}
              alt={getText(getActiveCar().name)}
              fill
              style={{ objectFit: "contain" }}
              className="p-4 z-10"
            />

            {/* Status Badge */}
            <div className="absolute top-4 right-4 z-20">{getStatusBadge(getActiveCar().status)}</div>

            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.preventDefault()
                toggleFavorite(getActiveCar().id)
              }}
              className="absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center z-20 transition-all bg-white/20 text-white hover:bg-white/30"
            >
              <Heart className={`w-4 h-4 ${favorites.includes(getActiveCar().id) ? "fill-brand-primary" : ""}`} />
            </button>

            {/* Car Name Overlay */}
            <div className="absolute bottom-4 left-0 w-full px-5 z-20">
              <h3 className="text-xl font-bold text-white">{getText(getActiveCar().name)}</h3>
              <p className="text-sm text-gray-300">{getText(getActiveCar().modelYear)}</p>
            </div>
          </div>

          {/* Car Info */}
          <div className="p-5">
            {/* Brand Logo */}
            <div className="h-12 flex items-center justify-center mb-5 border-b border-brand-light pb-5">
              <Image
                src={getActiveCar().brandLogo || "/placeholder.svg?height=30&width=100"}
                alt={getActiveCar().brand}
                width={100}
                height={30}
                style={{ objectFit: "contain" }}
              />
            </div>

            {/* Price */}
            <div className="mb-6 bg-gradient-to-r from-brand-light to-white rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">{isRTL ? "سعر الكاش" : "Cash Price"}</span>
                <span className="text-xl font-bold text-brand-primary flex items-center">
                  <Image
                    src={getActiveCar().icons.currency || "/placeholder.svg"}
                    alt="Currency"
                    width={18}
                    height={18}
                    className={isRTL ? "ml-1" : "mr-1"}
                  />
                  {getActiveCar().cashPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Key Specs */}
            <div className="grid grid-cols-2 gap-4">
              {/* Engine */}
              <div className="bg-brand-light bg-opacity-30 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-brand-primary bg-opacity-20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-brand-primary" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{isRTL ? "المحرك" : "Engine"}</span>
                </div>
                <p className="text-sm font-medium ml-11">{getText(getActiveCar().specs.engine)}</p>
                <p className="text-xs text-gray-500 ml-11">{getText(getActiveCar().specs.power)}</p>
              </div>

              {/* Transmission */}
              <div className="bg-brand-light bg-opacity-30 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-brand-primary bg-opacity-20 flex items-center justify-center">
                    <Gauge className="w-4 h-4 text-brand-primary" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{isRTL ? "ناقل الحركة" : "Transmission"}</span>
                </div>
                <p className="text-sm font-medium ml-11">{getText(getActiveCar().specs.transmission)}</p>
              </div>

              {/* Fuel */}
              <div className="bg-brand-light bg-opacity-30 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-brand-primary bg-opacity-20 flex items-center justify-center">
                    <Fuel className="w-4 h-4 text-brand-primary" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{isRTL ? "الوقود" : "Fuel"}</span>
                </div>
                <p className="text-sm font-medium ml-11">{getText(getActiveCar().specs.fuelType)}</p>
              </div>

              {/* Seats */}
              <div className="bg-brand-light bg-opacity-30 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-brand-primary bg-opacity-20 flex items-center justify-center">
                    <Users className="w-4 h-4 text-brand-primary" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{isRTL ? "المقاعد" : "Seats"}</span>
                </div>
                <p className="text-sm font-medium ml-11">{getText(getActiveCar().specs.seats)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center mt-6 gap-4">
          <button
            onClick={navigateToPreviousCar}
            className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center border border-brand-light active:bg-gray-100"
            aria-label={isRTL ? "السيارة السابقة" : "Previous car"}
          >
            {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>

          {/* Dots */}
          <div className="flex gap-3">
            {[0, 1, ...(hasThirdCar ? [2] : [])].map((index) => (
              <button
                key={index}
                onClick={() => setActiveCarIndex(index)}
                className={`w-4 h-4 rounded-full transition-all ${
                  activeCarIndex === index
                    ? "bg-gradient-to-r from-brand-primary to-[#2D0F33] scale-110 shadow-md"
                    : "bg-brand-light"
                }`}
                aria-label={`Car ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={navigateToNextCar}
            className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center border border-brand-light active:bg-gray-100"
            aria-label={isRTL ? "السيارة التالية" : "Next car"}
          >
            {isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {/* Desktop Car Comparison */}
      <div className="hidden md:block mb-10">
        <div className={`grid ${hasThirdCar ? "grid-cols-3" : "grid-cols-2"} gap-6 relative`}>
          {/* Car 1 */}
          <div className="shadow-xl rounded-xl overflow-hidden">
            <CarCard car={car1} />
          </div>

          {/* VS Badge for 2 cars */}
          {!hasThirdCar && (
            <div className="absolute left-1/2 top-28 transform -translate-x-1/2 z-10 shadow-xl rounded-full p-2 bg-gradient-to-r from-white to-gray-100 border border-gray-200">
              <div className="bg-white rounded-full p-1">
                <Image src="/icons/Vs.svg" alt="VS" width={60} height={60} />
              </div>
            </div>
          )}

          {/* Car 2 */}
          <div className="shadow-xl rounded-xl overflow-hidden">
            <CarCard car={car2} />
          </div>

          {/* VS Badges for 3 cars */}
          {hasThirdCar && (
            <>
              <div className="absolute left-1/3 top-28 transform -translate-x-1/2 z-10 shadow-xl rounded-full p-2 bg-gradient-to-r from-white to-gray-100 border border-gray-200">
                <div className="bg-white rounded-full p-1">
                  <Image src="/icons/VS.svg" alt="VS" width={60} height={60} />
                </div>
              </div>
              <div className="absolute left-2/3 top-28 transform -translate-x-1/2 z-10 shadow-xl rounded-full p-2 bg-gradient-to-r from-white to-gray-100 border border-gray-200">
                <div className="bg-white rounded-full p-1">
                  <Image src="/icons/VS.svg" alt="VS" width={60} height={60} />
                </div>
              </div>
            </>
          )}

          {/* Car 3 (if present) */}
          {hasThirdCar && (
            <div className="shadow-xl rounded-xl overflow-hidden">
              <CarCard car={car3} />
            </div>
          )}
        </div>
      </div>
      {/* Tabs Navigation */}
      <div className="flex border-b border-brand-light mb-6 overflow-x-auto scrollbar-hide no-print w-full">
        <div className="flex min-w-full">
          <button
            onClick={() => setActiveTab("specs")}
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 flex-1 justify-center ${
              activeTab === "specs"
                ? "text-brand-primary border-b-2 border-brand-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="whitespace-nowrap">{isRTL ? "المواصفات" : "Specifications"}</span>
          </button>
          <button
            onClick={() => setActiveTab("features")}
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 flex-1 justify-center ${
              activeTab === "features"
                ? "text-brand-primary border-b-2 border-brand-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Award className="w-4 h-4" />
            <span className="whitespace-nowrap">{isRTL ? "الميزات" : "Features"}</span>
          </button>
          <button
            onClick={() => setActiveTab("price")}
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 flex-1 justify-center ${
              activeTab === "price"
                ? "text-brand-primary border-b-2 border-brand-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="w-4 h-4 relative">
              <Image src={car1?.icons?.currency || "/placeholder.svg"} alt="Currency" width={16} height={16} />
            </div>
            <span className="whitespace-nowrap">{isRTL ? "الأسعار" : "Price"}</span>
          </button>
        </div>
      </div>
      {/* Tab Content */}
      {activeTab === "specs" && (
        <div className="mb-10 section">
          {specCategories.map((category) => (
            <div key={category.id} className="mb-6">
              {/* Category Header */}
              <div
                className={`flex items-center justify-between p-4 cursor-pointer rounded-xl transition-all ${
                  openCategories[category.id]
                    ? "bg-gradient-to-r from-brand-primary to-[#2D0F33] text-white shadow-lg"
                    : "bg-white shadow border border-brand-light hover:bg-brand-light hover:bg-opacity-30"
                }`}
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      openCategories[category.id] ? "bg-white/20" : "bg-brand-primary/10"
                    }`}
                  >
                    {getSpecIcon(category.id)}
                  </div>
                  <span className="font-medium">{getText(category.name)}</span>
                </div>
                {openCategories[category.id] ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>

              {/* Specifications Table - Desktop View */}
              {openCategories[category.id] && (
                <>
                  <div className="mt-3 bg-white rounded-xl shadow-lg overflow-hidden border border-brand-light hidden md:block">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-brand-light bg-opacity-30">
                          <th className="py-4 px-6 text-left text-sm font-medium text-gray-700 border-b border-brand-light">
                            {isRTL ? "المواصفات" : "Specification"}
                          </th>
                          <th className="py-4 px-6 text-center text-sm font-medium text-gray-700 border-b border-brand-light">
                            {getText(car1.name)}
                          </th>
                          <th className="py-4 px-6 text-center text-sm font-medium text-gray-700 border-b border-brand-light">
                            {getText(car2.name)}
                          </th>
                          {hasThirdCar && (
                            <th className="py-4 px-6 text-center text-sm font-medium text-gray-700 border-b border-brand-light">
                              {getText(car3.name)}
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {category.specs.map((spec, index) => (
                          <tr key={spec} className={index % 2 === 0 ? "bg-white" : "bg-brand-light bg-opacity-10"}>
                            <td className="py-4 px-6 text-sm font-medium text-gray-900 border-b border-brand-light">
                              {getSpecName(spec)}
                            </td>
                            <td className="py-4 px-6 text-center text-sm border-b border-brand-light">
                              <div className="flex justify-center">
                                <span className="px-4 py-1 rounded-full bg-brand-light text-brand-primary font-medium">
                                  {car1?.specs[spec] ? getText(car1.specs[spec]) : "-"}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-center text-sm border-b border-brand-light">
                              <div className="flex justify-center">
                                <span className="px-4 py-1 rounded-full bg-brand-light text-brand-primary font-medium">
                                  {car2?.specs[spec] ? getText(car2.specs[spec]) : "-"}
                                </span>
                              </div>
                            </td>
                            {hasThirdCar && (
                              <td className="py-4 px-6 text-center text-sm border-b border-brand-light">
                                <div className="flex justify-center">
                                  <span className="px-4 py-1 rounded-full bg-brand-light text-brand-primary font-medium">
                                    {car3?.specs[spec] ? getText(car3.specs[spec]) : "-"}
                                  </span>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile View - Card-based layout */}
                  <div className="md:hidden mt-3 space-y-4 px-2">
                    {category.specs.map((spec) => (
                      <div
                        key={spec}
                        className="bg-white rounded-xl shadow-sm border border-brand-light overflow-hidden"
                      >
                        <div className="bg-brand-light bg-opacity-30 py-3 px-4 border-b border-brand-light">
                          <span className="font-medium text-gray-800">{getSpecName(spec)}</span>
                        </div>

                        <div className="divide-y divide-brand-light">
                          {/* Car 1 */}
                          <div className="p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 relative">
                                <Image
                                  src={car1.brandLogo || "/placeholder.svg?height=20&width=20"}
                                  alt={car1.brand}
                                  width={20}
                                  height={20}
                                  style={{ objectFit: "contain" }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 truncate max-w-[120px]">{getText(car1.name)}</span>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-brand-light text-brand-primary text-sm font-medium">
                              {car1?.specs[spec] ? getText(car1.specs[spec]) : "-"}
                            </span>
                          </div>

                          {/* Car 2 */}
                          <div className="p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 relative">
                                <Image
                                  src={car2.brandLogo || "/placeholder.svg?height=20&width=20"}
                                  alt={car2.brand}
                                  width={20}
                                  height={20}
                                  style={{ objectFit: "contain" }}
                                />
                              </div>
                              <span className="text-sm text-gray-600">{getText(car2.name)}</span>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-brand-light text-brand-primary text-sm font-medium">
                              {car2?.specs[spec] ? getText(car2.specs[spec]) : "-"}
                            </span>
                          </div>

                          {/* Car 3 (if present) */}
                          {hasThirdCar && (
                            <div className="p-4 flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 relative">
                                  <Image
                                    src={car3.brandLogo || "/placeholder.svg?height=20&width=20"}
                                    alt={car3.brand}
                                    width={20}
                                    height={20}
                                    style={{ objectFit: "contain" }}
                                  />
                                </div>
                                <span className="text-sm text-gray-600">{getText(car3.name)}</span>
                              </div>
                              <span className="px-3 py-1 rounded-full bg-brand-light text-brand-primary text-sm font-medium">
                                {car3?.specs[spec] ? getText(car3.specs[spec]) : "-"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === "features" && (
        <div className="mb-10 section">
          {/* Desktop View */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-brand-light hidden md:block">
            <div className="bg-gradient-to-r from-brand-primary to-[#2D0F33] text-white p-5">
              <h2 className="text-lg font-medium">{isRTL ? "مقارنة الميزات" : "Feature Comparison"}</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-brand-light bg-opacity-30">
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700 border-b border-brand-light">
                    {isRTL ? "الميزات" : "Features"}
                  </th>
                  <th className="py-4 px-6 text-center text-sm font-medium text-gray-700 border-b border-brand-light">
                    {getText(car1.name)}
                  </th>
                  <th className="py-4 px-6 text-center text-sm font-medium text-gray-700 border-b border-brand-light">
                    {getText(car2.name)}
                  </th>
                  {hasThirdCar && (
                    <th className="py-4 px-6 text-center text-sm font-medium text-gray-700 border-b border-brand-light">
                      {getText(car3.name)}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {Object.entries(car1.features).map(([feature, value], index) => (
                  <tr key={feature} className={index % 2 === 0 ? "bg-white" : "bg-brand-light bg-opacity-10"}>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900 border-b border-brand-light">
                      {isRTL
                        ? feature
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())
                            .replace("Exterior Features", "ميزات خارجية")
                            .replace("Interior", "داخلي")
                            .replace("Exterior", "خارجي")
                            .replace("Engine", "محرك")
                            .replace("Safety", "سلامة")
                            .replace("Technology", "تكنولوجيا")
                            .replace("Entertainment", "ترفيه")
                            .replace("Comfort", "راحة")
                        : feature.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </td>
                    <td className="py-4 px-6 text-center text-sm border-b border-brand-light">
                      <div className="flex justify-center">
                        {car1.features[feature] ? (
                          <div className="w-8 h-8 rounded-full bg-brand-primary bg-opacity-20 flex items-center justify-center">
                            <Check className="w-5 h-5 text-brand-primary" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-brand-primary bg-opacity-10 flex items-center justify-center">
                            <X className="w-5 h-5 text-brand-primary text-opacity-70" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center text-sm border-b border-brand-light">
                      <div className="flex justify-center">
                        {car2.features[feature] ? (
                          <div className="w-8 h-8 rounded-full bg-brand-primary bg-opacity-20 flex items-center justify-center">
                            <Check className="w-5 h-5 text-brand-primary" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-brand-primary bg-opacity-10 flex items-center justify-center">
                            <X className="w-5 h-5 text-brand-primary text-opacity-70" />
                          </div>
                        )}
                      </div>
                    </td>
                    {hasThirdCar && (
                      <td className="py-4 px-6 text-center text-sm border-b border-brand-light">
                        <div className="flex justify-center">
                          {car3.features[feature] ? (
                            <div className="w-8 h-8 rounded-full bg-brand-primary bg-opacity-20 flex items-center justify-center">
                              <Check className="w-5 h-5 text-brand-primary" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-brand-primary bg-opacity-10 flex items-center justify-center">
                              <X className="w-5 h-5 text-brand-primary text-opacity-70" />
                            </div>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View - Card-based layout */}
          <div className="md:hidden space-y-4 px-2">
            {Object.entries(car1.features).map(([feature, value], index) => {
              const featureName = isRTL
                ? feature
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())
                    .replace("Exterior Features", "ميزات خارجية")
                    .replace("Interior", "داخلي")
                    .replace("Exterior", "خارجي")
                    .replace("Engine", "محرك")
                    .replace("Safety", "سلامة")
                    .replace("Technology", "تكنولوجيا")
                    .replace("Entertainment", "ترفيه")
                    .replace("Comfort", "راحة")
                : feature.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())

              return (
                <div key={feature} className="bg-white rounded-xl shadow-sm border border-brand-light overflow-hidden">
                  <div className="bg-gradient-to-r from-brand-primary to-[#2D0F33] py-3 px-4 text-white">
                    <span className="font-medium text-sm">{featureName}</span>
                  </div>

                  <div className="divide-y divide-brand-light">
                    {/* Car 1 */}
                    <div className="p-4 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 relative">
                          <Image
                            src={car1.brandLogo || "/placeholder.svg?height=20&width=20"}
                            alt={car1.brand}
                            width={20}
                            height={20}
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{getText(car1.name)}</span>
                      </div>
                      {car1.features[feature] ? (
                        <div className="w-8 h-8 rounded-full bg-brand-primary bg-opacity-20 flex items-center justify-center">
                          <Check className="w-5 h-5 text-brand-primary" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-brand-primary bg-opacity-10 flex items-center justify-center">
                          <X className="w-5 h-5 text-brand-primary text-opacity-70" />
                        </div>
                      )}
                    </div>

                    {/* Car 2 */}
                    <div className="p-4 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 relative">
                          <Image
                            src={car2.brandLogo || "/placeholder.svg?height=20&width=20"}
                            alt={car2.brand}
                            width={20}
                            height={20}
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{getText(car2.name)}</span>
                      </div>
                      {car2.features[feature] ? (
                        <div className="w-8 h-8 rounded-full bg-brand-primary bg-opacity-20 flex items-center justify-center">
                          <Check className="w-5 h-5 text-brand-primary" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-brand-primary bg-opacity-10 flex items-center justify-center">
                          <X className="w-5 h-5 text-brand-primary text-opacity-70" />
                        </div>
                      )}
                    </div>

                    {/* Car 3 (if present) */}
                    {hasThirdCar && (
                      <div className="bg-white rounded-xl shadow-sm border border-brand-light overflow-hidden">
                        <div className="bg-gradient-to-r from-brand-primary to-[#2D0F33] p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                              <div className="w-8 h-8 relative">
                                <Image
                                  src={car3.brandLogo || "/placeholder.svg?height=24&width=24"}
                                  alt={car3.brand}
                                  fill
                                  style={{ objectFit: "contain" }}
                                />
                              </div>
                            </div>
                            <span className="text-white font-medium">{getText(car3.name)}</span>
                          </div>
                          {getStatusBadge(car3.status)}
                        </div>
                        <div className="p-4 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 relative">
                              <Image
                                src={car3.brandLogo || "/placeholder.svg?height=20&width=20"}
                                alt={car3.brand}
                                width={20}
                                height={20}
                                style={{ objectFit: "contain" }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">{getText(car3.name)}</span>
                          </div>
                          {car3.features[feature] ? (
                            <div className="w-8 h-8 rounded-full bg-brand-primary bg-opacity-20 flex items-center justify-center">
                              <Check className="w-5 h-5 text-brand-primary" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-brand-primary bg-opacity-10 flex items-center justify-center">
                              <X className="w-5 h-5 text-brand-primary text-opacity-70" />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === "price" && (
        <div className="mb-10 section">
          {/* Desktop View */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-brand-light">
            <div className="bg-gradient-to-r from-brand-primary to-[#2D0F33] text-white p-5">
              <h2 className="text-lg font-medium">{isRTL ? "مقارنة الأسعار" : "Price Comparison"}</h2>
            </div>

            {/* Desktop Price Cards */}
            <div className="p-8 hidden md:block">
              {/* Price Cards */}
              <div className={`grid ${hasThirdCar ? "grid-cols-3" : "grid-cols-2"} gap-6 mb-10`}>
                {/* Car 1 Price Card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-brand-light relative">
                  <div className="absolute top-0 right-0 w-24 h-24">
                    <div className="absolute transform rotate-45 bg-brand-primary text-white font-medium py-1 text-xs text-center w-32 top-6 -right-8">
                      {car1.cashPrice === highestPrice
                        ? isRTL
                          ? "الأعلى سعراً"
                          : "Highest Price"
                        : car1.cashPrice === lowestPrice
                          ? isRTL
                            ? "الأقل سعراً"
                            : "Lowest Price"
                          : ""}
                    </div>
                  </div>

                  <div className="p-6 flex items-center border-b border-brand-light">
                    <div className="w-16 h-16 relative mr-4">
                      <Image
                        src={car1.image || "/placeholder.svg?height=64&width=64"}
                        alt={getText(car1.name)}
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{getText(car1.name)}</h3>
                      <div className="flex items-center mt-1">
                        <div className="w-6 h-6 relative mr-2">
                          <Image
                            src={car1.brandLogo || "/placeholder.svg?height=24&width=24"}
                            alt={car1.brand}
                            fill
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{car1.brand}</span>
                        <div className="ml-3">{getStatusBadge(car1.status)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-6">
                      <div className="text-sm text-gray-500 mb-1">{isRTL ? "سعر الكاش" : "Cash Price"}</div>
                      <div className="flex items-center">
                        <Image
                          src={car1.icons.currency || "/placeholder.svg"}
                          alt="Currency"
                          width={24}
                          height={24}
                          className="mr-2"
                        />
                        <span className="text-3xl font-bold text-brand-primary">{car1.cashPrice.toLocaleString()}</span>
                        {getPriceComparisonIcon(car1, lowestPrice, highestPrice)}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-1">{isRTL ? "القسط الشهري" : "Monthly Installment"}</div>
                      <div className="flex items-center">
                        <Image
                          src={car1.icons.currency || "/placeholder.svg"}
                          alt="Currency"
                          width={20}
                          height={20}
                          className="mr-2"
                        />
                        <span className="text-xl font-semibold text-gray-800">
                          {car1.installmentPrice.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">{isRTL ? "/ شهر" : "/ month"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Car 2 Price Card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-brand-light relative">
                  <div className="absolute top-0 right-0 w-24 h-24">
                    <div className="absolute transform rotate-45 bg-brand-primary text-white font-medium py-1 text-xs text-center w-32 top-6 -right-8">
                      {car2.cashPrice === highestPrice
                        ? isRTL
                          ? "الأعلى سعراً"
                          : "Highest Price"
                        : car2.cashPrice === lowestPrice
                          ? isRTL
                            ? "الأقل سعراً"
                            : "Lowest Price"
                          : ""}
                    </div>
                  </div>

                  <div className="p-6 flex items-center border-b border-brand-light">
                    <div className="w-16 h-16 relative mr-4">
                      <Image
                        src={car2.image || "/placeholder.svg?height=64&width=64"}
                        alt={getText(car2.name)}
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{getText(car2.name)}</h3>
                      <div className="flex items-center mt-1">
                        <div className="w-6 h-6 relative mr-2">
                          <Image
                            src={car2.brandLogo || "/placeholder.svg?height=24&width=24"}
                            alt={car2.brand}
                            fill
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{car2.brand}</span>
                        <div className="ml-3">{getStatusBadge(car2.status)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-6">
                      <div className="text-sm text-gray-500 mb-1">{isRTL ? "سعر الكاش" : "Cash Price"}</div>
                      <div className="flex items-center">
                        <Image
                          src={car2.icons.currency || "/placeholder.svg"}
                          alt="Currency"
                          width={24}
                          height={24}
                          className="mr-2"
                        />
                        <span className="text-3xl font-bold text-brand-primary">{car2.cashPrice.toLocaleString()}</span>
                        {getPriceComparisonIcon(car2, lowestPrice, highestPrice)}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-1">{isRTL ? "القسط الشهري" : "Monthly Installment"}</div>
                      <div className="flex items-center">
                        <Image
                          src={car2.icons.currency || "/placeholder.svg"}
                          alt="Currency"
                          width={20}
                          height={20}
                          className="mr-2"
                        />
                        <span className="text-xl font-semibold text-gray-800">
                          {car2.installmentPrice.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">{isRTL ? "/ شهر" : "/ month"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Car 3 Price Card (if present) */}
                {hasThirdCar && (
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-brand-light relative">
                    <div className="absolute top-0 right-0 w-24 h-24">
                      <div className="absolute transform rotate-45 bg-brand-primary text-white font-medium py-1 text-xs text-center w-32 top-6 -right-8">
                        {car3.cashPrice === highestPrice
                          ? isRTL
                            ? "الأعلى سعراً"
                            : "Highest Price"
                          : car3.cashPrice === lowestPrice
                            ? isRTL
                              ? "الأقل سعراً"
                              : "Lowest Price"
                            : ""}
                      </div>
                    </div>

                    <div className="p-6 flex items-center border-b border-brand-light">
                      <div className="w-16 h-16 relative mr-4">
                        <Image
                          src={car3.image || "/placeholder.svg?height=64&width=64"}
                          alt={getText(car3.name)}
                          fill
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{getText(car3.name)}</h3>
                        <div className="flex items-center mt-1">
                          <div className="w-6 h-6 relative mr-2">
                            <Image
                              src={car3.brandLogo || "/placeholder.svg?height=24&width=24"}
                              alt={car3.brand}
                              fill
                              style={{ objectFit: "contain" }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{car3.brand}</span>
                          <div className="ml-3">{getStatusBadge(car3.status)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="mb-6">
                        <div className="text-sm text-gray-500 mb-1">{isRTL ? "سعر الكاش" : "Cash Price"}</div>
                        <div className="flex items-center">
                          <Image
                            src={car3.icons.currency || "/placeholder.svg"}
                            alt="Currency"
                            width={24}
                            height={24}
                            className="mr-2"
                          />
                          <span className="text-3xl font-bold text-brand-primary">
                            {car3.cashPrice.toLocaleString()}
                          </span>
                          {getPriceComparisonIcon(car3, lowestPrice, highestPrice)}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          {isRTL ? "القسط الشهري" : "Monthly Installment"}
                        </div>
                        <div className="flex items-center">
                          <Image
                            src={car3.icons.currency || "/placeholder.svg"}
                            alt="Currency"
                            width={20}
                            height={20}
                            className="mr-2"
                          />
                          <span className="text-xl font-semibold text-gray-800">
                            {car3.installmentPrice.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">{isRTL ? "/ شهر" : "/ month"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Price Comparison Summary */}
            <div className="bg-white rounded-xl p-6 mb-10 border border-brand-light">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-5 h-5 mr-2 relative">
                  <Image
                    src={car1.icons.currency || "/placeholder.svg"}
                    alt="Currency"
                    width={20}
                    height={20}
                    className="text-brand-primary"
                  />
                </div>
                {isRTL ? "ملخص المقارنة السعرية" : "Price Comparison Summary"}
              </h3>

              <div className="grid grid-cols-3 gap-8">
                {/* Highest Price */}
                <div className="bg-white rounded-xl p-5 shadow-md border border-brand-light">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-gray-600">{isRTL ? "أعلى سعر" : "Highest Price"}</div>
                    <TrendingUp className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div className="flex items-center">
                    <Image
                      src={
                        car1.cashPrice >= car2.cashPrice && car1.cashPrice >= (car3?.cashPrice || 0)
                          ? car1.icons.currency
                          : car2.cashPrice >= car1.cashPrice && car2.cashPrice >= (car3?.cashPrice || 0)
                            ? car2.icons.currency
                            : car3.icons.currency || "/placeholder.svg"
                      }
                      alt="Currency"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    <span className="text-2xl font-bold text-gray-900">{highestPrice.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {car1.cashPrice === highestPrice
                      ? getText(car1.name)
                      : car2.cashPrice === highestPrice
                        ? getText(car2.name)
                        : getText(car3?.name || "")}
                  </div>
                </div>

                {/* Lowest Price */}
                <div className="bg-white rounded-xl p-5 shadow-md border border-brand-light">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-gray-600">{isRTL ? "أقل سعر" : "Lowest Price"}</div>
                    <TrendingDown className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div className="flex items-center">
                    <Image
                      src={
                        car1.cashPrice <= car2.cashPrice &&
                        car1.cashPrice <= (car3?.cashPrice || Number.POSITIVE_INFINITY)
                          ? car1.icons.currency
                          : car2.cashPrice <= car1.cashPrice &&
                              car2.cashPrice <= (car3?.cashPrice || Number.POSITIVE_INFINITY)
                            ? car2.icons.currency
                            : car3.icons.currency || "/placeholder.svg"
                      }
                      alt="Currency"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    <span className="text-2xl font-bold text-gray-900">{lowestPrice.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {car1.cashPrice === lowestPrice
                      ? getText(car1.name)
                      : car2.cashPrice === lowestPrice
                        ? getText(car2.name)
                        : getText(car3?.name || "")}
                  </div>
                </div>

                {/* Price Difference */}
                <div className="bg-white rounded-xl p-5 shadow-md border border-brand-light">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-gray-600">
                      {isRTL ? "الفرق السعري" : "Price Difference"}
                    </div>
                    <div className="w-5 h-5 relative">
                      <Image
                        src={car1.icons.currency || "/placeholder.svg"}
                        alt="Currency"
                        width={20}
                        height={20}
                        className="text-brand-primary"
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Image
                      src={car1.icons.currency || "/placeholder.svg"}
                      alt="Currency"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    <span className="text-2xl font-bold text-gray-900">{priceDifference.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {Math.round((priceDifference / lowestPrice) * 100)}% {isRTL ? "من السعر الأقل" : "of lowest price"}
                  </div>
                </div>
              </div>
            </div>

            {/* Price Comparison Table */}
            <div className="bg-white rounded-xl shadow-md border border-brand-light overflow-hidden">
              <div className="bg-gradient-to-r from-brand-primary to-[#2D0F33] text-white p-4">
                <h3 className="text-lg font-medium">{isRTL ? "جدول مقارنة الأسعار" : "Price Comparison Table"}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-4 px-6 text-left text-sm font-medium text-gray-700 border-b border-r border-gray-200">
                        {isRTL ? "السيارة" : "Car"}
                      </th>
                      <th className="py-4 px-6 text-center text-sm font-medium text-gray-700 border-b border-r border-gray-200">
                        {isRTL ? "سعر الكاش" : "Cash Price"}
                      </th>
                      <th className="py-4 px-6 text-center text-sm font-medium text-gray-700 border-b border-r border-gray-200">
                        {isRTL ? "القسط الشهري" : "Monthly Installment"}
                      </th>
                      <th className="py-4 px-6 text-center text-sm font-medium text-gray-700 border-b border-gray-200">
                        {isRTL ? "الحالة" : "Status"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Car 1 */}
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 border-b border-r border-gray-200">
                        <div className="flex items-center">
                          <div className="w-12 h-12 relative mr-3">
                            <Image
                              src={car1.image || "/placeholder.svg?height=48&width=48"}
                              alt={getText(car1.name)}
                              fill
                              style={{ objectFit: "contain" }}
                            />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{getText(car1.name)}</div>
                            <div className="text-sm text-gray-500">{car1.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center border-b border-r border-gray-200">
                        <div className="flex items-center justify-center">
                          <Image
                            src={car1.icons.currency || "/placeholder.svg"}
                            alt="Currency"
                            width={16}
                            height={16}
                            className="mr-1"
                          />
                          <span className="font-bold text-brand-primary">{car1.cashPrice.toLocaleString()}</span>
                          {getPriceComparisonIcon(car1, lowestPrice, highestPrice)}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center border-b border-r border-gray-200">
                        <div className="flex items-center justify-center">
                          <Image
                            src={car1.icons.currency || "/placeholder.svg"}
                            alt="Currency"
                            width={14}
                            height={14}
                            className="mr-1"
                          />
                          <span className="font-medium">{car1.installmentPrice.toLocaleString()}</span>
                          <span className="text-xs text-gray-500 ml-1">{isRTL ? "/ شهر" : "/ month"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center border-b border-gray-200">
                        <div className="flex justify-center">{getStatusBadge(car1.status)}</div>
                      </td>
                    </tr>

                    {/* Car 2 */}
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 border-b border-r border-gray-200">
                        <div className="flex items-center">
                          <div className="w-12 h-12 relative mr-3">
                            <Image
                              src={car2.image || "/placeholder.svg?height=48&width=48"}
                              alt={getText(car2.name)}
                              fill
                              style={{ objectFit: "contain" }}
                            />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{getText(car2.name)}</div>
                            <div className="text-sm text-gray-500">{car2.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center border-b border-r border-gray-200">
                        <div className="flex items-center justify-center">
                          <Image
                            src={car2.icons.currency || "/placeholder.svg"}
                            alt="Currency"
                            width={16}
                            height={16}
                            className="mr-1"
                          />
                          <span className="font-bold text-brand-primary">{car2.cashPrice.toLocaleString()}</span>
                          {getPriceComparisonIcon(car2, lowestPrice, highestPrice)}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center border-b border-r border-gray-200">
                        <div className="flex items-center justify-center">
                          <Image
                            src={car2.icons.currency || "/placeholder.svg"}
                            alt="Currency"
                            width={14}
                            height={14}
                            className="mr-1"
                          />
                          <span className="font-medium">{car2.installmentPrice.toLocaleString()}</span>
                          <span className="text-xs text-gray-500 ml-1">{isRTL ? "/ شهر" : "/ month"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center border-b border-gray-200">
                        <div className="flex justify-center">{getStatusBadge(car2.status)}</div>
                      </td>
                    </tr>

                    {/* Car 3 (if present) */}
                    {hasThirdCar && (
                      <tr className="hover:bg-gray-50">
                        <td className="py-4 px-6 border-b border-r border-gray-200">
                          <div className="flex items-center">
                            <div className="w-12 h-12 relative mr-3">
                              <Image
                                src={car3.image || "/placeholder.svg?height=48&width=48"}
                                alt={getText(car3.name)}
                                fill
                                style={{ objectFit: "contain" }}
                              />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{getText(car3.name)}</div>
                              <div className="text-sm text-gray-500">{car3.brand}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center border-b border-r border-gray-200">
                          <div className="flex items-center justify-center">
                            <Image
                              src={car3.icons.currency || "/placeholder.svg"}
                              alt="Currency"
                              width={16}
                              height={16}
                              className="mr-1"
                            />
                            <span className="font-bold text-brand-primary">{car3.cashPrice.toLocaleString()}</span>
                            {getPriceComparisonIcon(car3, lowestPrice, highestPrice)}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center border-b border-r border-gray-200">
                          <div className="flex items-center justify-center">
                            <Image
                              src={car3.icons.currency || "/placeholder.svg"}
                              alt="Currency"
                              width={14}
                              height={14}
                              className="mr-1"
                            />
                            <span className="font-medium">{car3.installmentPrice.toLocaleString()}</span>
                            <span className="text-xs text-gray-500 ml-1">{isRTL ? "/ شهر" : "/ month"}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center border-b border-gray-200">
                          <div className="flex justify-center">{getStatusBadge(car3.status)}</div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Price View */}
            <div className="md:hidden p-4 space-y-6">
              {/* Mobile Price Cards */}
              <div className="space-y-4">
                {/* Car 1 Price Card */}
                <div className="bg-white rounded-xl shadow-sm border border-brand-light overflow-hidden">
                  <div className="bg-gradient-to-r from-brand-primary to-[#2D0F33] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 relative">
                          <Image
                            src={car1.brandLogo || "/placeholder.svg?height=24&width=24"}
                            alt={car1.brand}
                            fill
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                      </div>
                      <span className="text-white font-medium text-sm md:text-base">{getText(car1.name)}</span>
                    </div>
                    {getStatusBadge(car1.status)}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-600">{isRTL ? "سعر الكاش" : "Cash Price"}</span>
                      <span className="text-lg font-bold text-brand-primary flex items-center">
                        <Image
                          src={car1.icons.currency || "/placeholder.svg"}
                          alt="Currency"
                          width={16}
                          height={16}
                          className="inline mr-1"
                        />
                        {car1.cashPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{isRTL ? "القسط الشهري" : "Monthly Installment"}</span>
                      <span className="text-base font-semibold text-brand-primary flex items-center">
                        <Image
                          src={car1.icons.currency || "/placeholder.svg"}
                          alt="Currency"
                          width={14}
                          height={14}
                          className="inline mr-1"
                        />
                        {car1.installmentPrice.toLocaleString()}
                        <span className="text-xs text-gray-500 ml-1">{isRTL ? "/ شهر" : "/ month"}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Car 2 Price Card */}
                <div className="bg-white rounded-xl shadow-sm border border-brand-light overflow-hidden">
                  <div className="bg-gradient-to-r from-brand-primary to-[#2D0F33] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 relative">
                          <Image
                            src={car2.brandLogo || "/placeholder.svg?height=24&width=24"}
                            alt={car2.brand}
                            fill
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                      </div>
                      <span className="text-white font-medium text-sm md:text-base">{getText(car2.name)}</span>
                    </div>
                    {getStatusBadge(car2.status)}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-600">{isRTL ? "سعر الكاش" : "Cash Price"}</span>
                      <span className="text-lg font-bold text-brand-primary flex items-center">
                        <Image
                          src={car2.icons.currency || "/placeholder.svg"}
                          alt="Currency"
                          width={16}
                          height={16}
                          className="inline mr-1"
                        />
                        {car2.cashPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{isRTL ? "القسط الشهري" : "Monthly Installment"}</span>
                      <span className="text-base font-semibold text-brand-primary flex items-center">
                        <Image
                          src={car2.icons.currency || "/placeholder.svg"}
                          alt="Currency"
                          width={14}
                          height={14}
                          className="inline mr-1"
                        />
                        {car2.installmentPrice.toLocaleString()}
                        <span className="text-xs text-gray-500 ml-1">{isRTL ? "/ شهر" : "/ month"}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Car 3 Price Card (if present) */}
                {hasThirdCar && (
                  <div className="bg-white rounded-xl shadow-sm border border-brand-light overflow-hidden">
                    <div className="bg-gradient-to-r from-brand-primary to-[#2D0F33] p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <div className="w-8 h-8 relative">
                            <Image
                              src={car3.brandLogo || "/placeholder.svg?height=24&width=24"}
                              alt={car3.brand}
                              fill
                              style={{ objectFit: "contain" }}
                            />
                          </div>
                        </div>
                        <span className="text-white font-medium text-sm md:text-base">{getText(car3.name)}</span>
                      </div>
                      {getStatusBadge(car3.status)}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-600">{isRTL ? "سعر الكاش" : "Cash Price"}</span>
                        <span className="text-lg font-bold text-brand-primary flex items-center">
                          <Image
                            src={car3.icons.currency || "/placeholder.svg"}
                            alt="Currency"
                            width={16}
                            height={16}
                            className="inline mr-1"
                          />
                          {car3.cashPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{isRTL ? "القسط الشهري" : "Monthly Installment"}</span>
                        <span className="text-base font-semibold text-brand-primary flex items-center">
                          <Image
                            src={car3.icons.currency || "/placeholder.svg"}
                            alt="Currency"
                            width={14}
                            height={14}
                            className="inline mr-1"
                          />
                          {car3.installmentPrice.toLocaleString()}
                          <span className="text-xs text-gray-500 ml-1">{isRTL ? "/ شهر" : "/ month"}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Comparison Summary - Mobile */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-brand-light">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-5 h-5 mr-2 relative">
                    <Image
                      src={car1.icons.currency || "/placeholder.svg"}
                      alt="Currency"
                      width={20}
                      height={20}
                      className="text-brand-primary"
                    />
                  </div>
                  {isRTL ? "ملخص المقارنة السعرية" : "Price Comparison Summary"}
                </h3>

                <div className="space-y-3">
                  {/* Highest Price */}
                  <div className="bg-white rounded-lg p-3 border border-brand-light">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium text-gray-600 flex items-center">
                        <TrendingUp className="w-4 h-4 text-brand-primary mr-1" />
                        {isRTL ? "أعلى سعر" : "Highest Price"}
                      </div>
                      <div className="flex items-center">
                        <Image
                          src={car1.icons.currency || "/placeholder.svg"}
                          alt="Currency"
                          width={14}
                          height={14}
                          className="mr-1"
                        />
                        <span className="font-bold text-brand-primary">{highestPrice.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 pl-5">
                      {car1.cashPrice === highestPrice
                        ? getText(car1.name)
                        : car2.cashPrice === highestPrice
                          ? getText(car2.name)
                          : getText(car3?.name || "")}
                    </div>
                  </div>

                  {/* Lowest Price */}
                  <div className="bg-white rounded-lg p-3 border border-brand-light">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium text-gray-600 flex items-center">
                        <TrendingDown className="w-4 h-4 text-brand-primary mr-1" />
                        {isRTL ? "أقل سعر" : "Lowest Price"}
                      </div>
                      <div className="flex items-center">
                        <Image
                          src={car1.icons.currency || "/placeholder.svg"}
                          alt="Currency"
                          width={14}
                          height={14}
                          className="mr-1"
                        />
                        <span className="font-bold text-brand-primary">{lowestPrice.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 pl-5">
                      {car1.cashPrice === lowestPrice
                        ? getText(car1.name)
                        : car2.cashPrice === lowestPrice
                          ? getText(car2.name)
                          : getText(car3?.name || "")}
                    </div>
                  </div>

                  {/* Price Difference */}
                  <div className="bg-white rounded-lg p-3 border border-brand-light">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium text-gray-600">
                        {isRTL ? "الفرق السعري" : "Price Difference"}
                      </div>
                      <div className="flex items-center">
                        <Image
                          src={car1.icons.currency || "/placeholder.svg"}
                          alt="Currency"
                          width={14}
                          height={14}
                          className="mr-1"
                        />
                        <span className="font-bold text-brand-primary">{priceDifference.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      {Math.round((priceDifference / lowestPrice) * 100)}%{" "}
                      {isRTL ? "من السعر الأقل" : "of lowest price"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Price Comparison Table */}
              <div className="bg-white rounded-xl shadow-sm border border-brand-light overflow-hidden">
                <div className="bg-gradient-to-r from-brand-primary to-[#2D0F33] text-white p-3">
                  <h3 className="text-base font-medium">{isRTL ? "جدول مقارنة الأسعار" : "Price Comparison Table"}</h3>
                </div>

                <div className="divide-y divide-gray-100">
                  {/* Car 1 */}
                  <div className="p-3">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 relative mr-2 bg-gray-50 rounded-md flex items-center justify-center">
                        <Image
                          src={car1.image || "/placeholder.svg?height=40&width=40"}
                          alt={getText(car1.name)}
                          width={36}
                          height={36}
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{getText(car1.name)}</div>
                        <div className="text-xs text-gray-500">{car1.brand}</div>
                      </div>
                      <div className="ml-auto">{getStatusBadge(car1.status)}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="bg-gray-50 p-2 rounded-md">
                        <div className="text-xs text-gray-500">{isRTL ? "سعر الكاش" : "Cash Price"}</div>
                        <div className="flex items-center text-sm font-medium">
                          <Image
                            src={car1.icons.currency || "/placeholder.svg"}
                            alt="Currency"
                            width={12}
                            height={12}
                            className="mr-1"
                          />
                          {car1.cashPrice.toLocaleString()}
                          {getPriceComparisonIcon(car1, lowestPrice, highestPrice)}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-2 rounded-md">
                        <div className="text-xs text-gray-500">{isRTL ? "القسط الشهري" : "Monthly"}</div>
                        <div className="flex items-center text-sm">
                          <Image
                            src={car1.icons.currency || "/placeholder.svg"}
                            alt="Currency"
                            width={12}
                            height={12}
                            className="mr-1"
                          />
                          {car1.installmentPrice.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Car 2 */}
                  <div className="p-3">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 relative mr-2 bg-gray-50 rounded-md flex items-center justify-center">
                        <Image
                          src={car2.image || "/placeholder.svg?height=40&width=40"}
                          alt={getText(car2.name)}
                          width={36}
                          height={36}
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{getText(car2.name)}</div>
                        <div className="text-xs text-gray-500">{car2.brand}</div>
                      </div>
                      <div className="ml-auto">{getStatusBadge(car2.status)}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="bg-gray-50 p-2 rounded-md">
                        <div className="text-xs text-gray-500">{isRTL ? "سعر الكاش" : "Cash Price"}</div>
                        <div className="flex items-center text-sm font-medium">
                          <Image
                            src={car2.icons.currency || "/placeholder.svg"}
                            alt="Currency"
                            width={12}
                            height={12}
                            className="mr-1"
                          />
                          {car2.cashPrice.toLocaleString()}
                          {getPriceComparisonIcon(car2, lowestPrice, highestPrice)}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-2 rounded-md">
                        <div className="text-xs text-gray-500">{isRTL ? "القسط الشهري" : "Monthly"}</div>
                        <div className="flex items-center text-sm">
                          <Image
                            src={car2.icons.currency || "/placeholder.svg"}
                            alt="Currency"
                            width={12}
                            height={12}
                            className="mr-1"
                          />
                          {car2.installmentPrice.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Car 3 (if present) */}
                  {hasThirdCar && (
                    <div className="p-3">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 relative mr-2 bg-gray-50 rounded-md flex items-center justify-center">
                          <Image
                            src={car3.image || "/placeholder.svg?height=40&width=40"}
                            alt={getText(car3.name)}
                            width={36}
                            height={36}
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{getText(car3.name)}</div>
                          <div className="text-xs text-gray-500">{car3.brand}</div>
                        </div>
                        <div className="ml-auto">{getStatusBadge(car3.status)}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="bg-gray-50 p-2 rounded-md">
                          <div className="text-xs text-gray-500">{isRTL ? "سعر الكاش" : "Cash Price"}</div>
                          <div className="flex items-center text-sm font-medium">
                            <Image
                              src={car3.icons.currency || "/placeholder.svg"}
                              alt="Currency"
                              width={12}
                              height={12}
                              className="mr-1"
                            />
                            {car3.cashPrice.toLocaleString()}
                            {getPriceComparisonIcon(car3, lowestPrice, highestPrice)}
                          </div>
                        </div>

                        <div className="bg-gray-50 p-2 rounded-md">
                          <div className="text-xs text-gray-500">{isRTL ? "القسط الشهري" : "Monthly"}</div>
                          <div className="flex items-center text-sm">
                            <Image
                              src={car3.icons.currency || "/placeholder.svg"}
                              alt="Currency"
                              width={12}
                              height={12}
                              className="mr-1"
                            />
                            {car3.installmentPrice.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compare Again Button */}
      <div className="flex justify-center mb-8 px-4 no-print">
        <button
          onClick={onCompareAgain}
          className="w-full sm:w-auto bg-gradient-to-r from-brand-primary to-[#2D0F33] text-white px-6 py-4 rounded-xl text-base font-medium flex items-center justify-center gap-3 shadow-lg hover:opacity-90 transition-colors"
        >
          {isRTL ? (
            <>
              <ArrowRight className="w-5 h-5" /> قارن سيارة أخرى
            </>
          ) : (
            <>
              <ArrowLeft className="w-5 h-5" /> Compare Another Car
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default CarComparisonResults
