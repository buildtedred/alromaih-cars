"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import {
  Calendar,
  GaugeCircle,
  Car,
  Fuel,
  Users,
  Shield,
  ChevronRight,
  ChevronLeft,
  Settings,
  Wrench,
  Gauge,
  Sparkles,
  X,
  Info,
} from "lucide-react"

const CarOverview = ({ carId = 1 }) => {
  const pathname = usePathname()
  const isEnglish = pathname.startsWith("/en")
  const [showSpecDialog, setShowSpecDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [carData, setCarData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch car data from mock data
  useEffect(() => {
    const fetchCarData = async () => {
      try {
        setLoading(true)

        // Dynamic import to get the mock data
        const { default: carsData, specNames, specCategories, overviewCategories } = await import("@/app/api/mock-data")

        // Find the car by ID or use the first one
        const car = carsData.find((car) => car.id === carId) || carsData[0]

        // Set the car data with the necessary categories and spec names
        setCarData({
          car,
          specNames,
          specCategories,
          overviewCategories,
        })

        setLoading(false)
      } catch (error) {
        console.error("Error loading mock data:", error)
        setLoading(false)
      }
    }

    fetchCarData()
  }, [carId])

  // Check device size
  useEffect(() => {
    const checkDeviceSize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }

    // Initial check
    checkDeviceSize()

    // Add event listener for window resize
    window.addEventListener("resize", checkDeviceSize)

    // Cleanup
    return () => window.removeEventListener("resize", checkDeviceSize)
  }, [])

  // Improved body scroll locking - Fixed to prevent background movement and maintain scroll position
  useEffect(() => {
    if (showSpecDialog) {
      // Store the current scroll position as a pixel value
      const scrollY = window.scrollY

      // Save the scroll position as a data attribute on the body
      document.body.setAttribute("data-scroll-position", scrollY.toString())

      // Apply fixed positioning to body with current scroll position
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = "100%"
      document.body.style.overflow = "hidden"
    } else {
      // Get the stored scroll position from the data attribute
      const scrollY = Number.parseInt(document.body.getAttribute("data-scroll-position") || "0")

      // Reset the body styles
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      document.body.style.overflow = ""

      // Scroll back to the original position
      window.scrollTo(0, scrollY)
    }

    return () => {
      // If component unmounts while dialog is open, restore scroll
      if (showSpecDialog) {
        const scrollY = Number.parseInt(document.body.getAttribute("data-scroll-position") || "0")

        // Reset the body styles
        document.body.style.position = ""
        document.body.style.top = ""
        document.body.style.width = ""
        document.body.style.overflow = ""

        // Scroll back to the original position
        window.scrollTo(0, scrollY)
      }
    }
  }, [showSpecDialog])

  // Set default selected category when dialog opens
  useEffect(() => {
    if (showSpecDialog && carData?.specCategories && carData.specCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(carData.specCategories[0])
    }
  }, [showSpecDialog, carData, selectedCategory])

  // If still loading, show loading state
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-gray-200 h-64 rounded-xl"></div>
        <div className="bg-gray-200 h-64 rounded-xl"></div>
      </div>
    )
  }

  // If no data, don't render anything
  if (!carData) {
    return null
  }

  const { car, specNames, specCategories, overviewCategories } = carData

  // Get the icon component based on icon name
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case "calendar":
        return <Calendar className="w-5 h-5 text-brand-primary" />
      case "gaugeCircle":
        return <GaugeCircle className="w-5 h-5 text-brand-primary" />
      case "gauge":
        return <Gauge className="w-5 h-5 text-brand-primary" />
      case "fuel":
        return <Fuel className="w-5 h-5 text-brand-primary" />
      case "car":
        return <Car className="w-5 h-5 text-brand-primary" />
      case "settings":
        return <Settings className="w-5 h-5 text-brand-primary" />
      case "wrench":
        return <Wrench className="w-5 h-5 text-brand-primary" />
      case "users":
        return <Users className="w-5 h-5 text-brand-primary" />
      case "shield":
        return <Shield className="w-5 h-5 text-brand-primary" />
      default:
        return <Car className="w-5 h-5 text-brand-primary" />
    }
  }

  // Generate overview data from car details and overview categories
  const overviewData =
    (overviewCategories &&
      overviewCategories.map((row) =>
        row.map((item) => {
          let value = ""

          if (item.key === "brand") {
            value = car.brand || ""
          } else if (item.key === "year" && car?.specs?.year) {
            value = car.specs.year.toString()
          } else if (car?.specs && car?.specs[item.key]) {
            value = isEnglish ? car.specs[item.key].en : car.specs[item.key].ar
          }

          return {
            icon: getIconComponent(item.icon),
            label: item.label?.en || "",
            labelAr: item.label?.ar || "",
            value: value,
          }
        }),
      )) ||
    []

  const handleCategoryClick = (category) => {
    setShowSpecDialog(true)
    setSelectedCategory(category)
  }

  // Get specs for a category
  const getCategorySpecs = (categoryId) => {
    if (!specCategories || !categoryId) return []

    const category = specCategories.find((cat) => cat.id === categoryId)
    if (!category || !category.specs) return []

    return category.specs
      .map((specKey) => {
        return {
          label: specNames?.[specKey]?.en || specKey,
          labelAr: specNames?.[specKey]?.ar || specKey,
          value: car?.specs?.[specKey]?.en || "",
          valueAr: car?.specs?.[specKey]?.ar || "",
        }
      })
      .filter((spec) => spec.value || spec.valueAr)
  }

  // Get category icon
  const getCategoryIcon = (categoryId) => {
    switch (categoryId) {
      case "transmission":
        return <Wrench className="w-5 h-5" />
      case "engine":
        return <Settings className="w-5 h-5" />
      case "dimensions":
        return <Car className="w-5 h-5" />
      case "capacity":
        return <Users className="w-5 h-5" />
      case "safety":
        return <Shield className="w-5 h-5" />
      default:
        return <Car className="w-5 h-5" />
    }
  }

  // Reset selected category when dialog closes
  const handleDialogChange = (open) => {
    setShowSpecDialog(open)
    if (!open) {
      // Only reset when closing
      setSelectedCategory(null)
    }
  }

  // CUSTOM DIALOG IMPLEMENTATION - Centered and Full Screen on Mobile
  const renderCustomDialog = () => {
    if (!showSpecDialog) return null

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setShowSpecDialog(false)} />

        {/* Dialog Content - Full screen on mobile, centered with max-width on larger screens */}
        <div className="fixed inset-0 sm:relative sm:inset-auto transform transition-all w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl overflow-hidden bg-white sm:rounded-xl sm:mx-auto h-full sm:h-[80vh] shadow-2xl">
          <div className="flex flex-col h-full">
            {/* Header - with left-aligned title and close button on right */}
            <div className="flex items-center justify-between p-4 bg-brand-primary text-white">
              <h3 className="text-lg font-semibold">{isEnglish ? "Car Specifications" : "صفات السيارة"}</h3>
              <button
                onClick={() => setShowSpecDialog(false)}
                className="rounded-full p-2 bg-white/20 text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
                <span className="sr-only">Close</span>
              </button>
            </div>

            {/* Category Tabs - Horizontal Scrolling */}
            <div className="w-full bg-white border-b border-gray-200">
              <div className="flex overflow-x-auto py-3 px-3 gap-2">
                {specCategories &&
                  specCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-[5px] whitespace-nowrap text-sm font-medium transition-colors flex-shrink-0
                        ${
                          selectedCategory?.id === category.id
                            ? "bg-brand-primary text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }
                      `}
                    >
                      <span className={selectedCategory?.id === category.id ? "text-white" : "text-brand-primary"}>
                        {getCategoryIcon(category.id)}
                      </span>
                      <span>{isEnglish ? category.name?.en : category.name?.ar}</span>
                    </button>
                  ))}
              </div>
            </div>

            {/* Category Title */}
            <div className="px-4 py-3 bg-white border-b border-gray-200">
              <h3 className="text-lg font-semibold text-brand-primary flex items-center">
                {selectedCategory && (
                  <>
                    <span className="bg-brand-primary/10 p-1.5 rounded-full mr-2 text-brand-primary">
                      {selectedCategory && getCategoryIcon(selectedCategory.id)}
                    </span>
                    {selectedCategory && (isEnglish ? selectedCategory.name?.en : selectedCategory.name?.ar)}
                  </>
                )}
              </h3>
            </div>

            {/* Specs Content - Vertical Scrolling */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {selectedCategory && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getCategorySpecs(selectedCategory.id).map((detail, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-brand-primary/20"
                      >
                        <div className={`${!isEnglish ? "text-right" : ""}`}>
                          <div className="text-sm text-gray-500 mb-1 flex items-center">
                            <Info className="w-3.5 h-3.5 mr-1.5 text-brand-primary/60" />
                            {isEnglish ? detail.label : detail.labelAr}
                          </div>
                          <div className="text-base font-semibold text-brand-primary">
                            {isEnglish ? detail.value : detail.valueAr}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 font-noto">
      {/* Car Information Section */}
      <div className="bg-white rounded-xl border border-brand-primary/10 shadow-md overflow-hidden">
        <div className="pt-4 sm:pt-6 pb-4 sm:pb-6">
          <h2
            className={`text-lg sm:text-xl font-bold text-brand-primary mb-3 sm:mb-5 flex items-center ${!isEnglish ? " pr-4 sm:pr-6" : "pl-4 sm:pl-6"}`}
          >
            <Sparkles
              className={`w-4 h-4 sm:w-5 sm:h-5 ${isEnglish ? "mr-1 sm:mr-2" : "ml-1 sm:ml-2"} text-brand-primary/70`}
            />
            {isEnglish ? "Car Information" : "معلومات السيارة"}
          </h2>
          <div className="divide-y divide-brand-primary/5">
            {overviewData &&
              overviewData.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-5 py-3 sm:py-4 px-3 sm:px-4 md:px-6"
                >
                  {row &&
                    row.map((item, index) => (
                      <div
                        key={index}
                        className="premium-card flex items-center gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 bg-gradient-to-br from-white to-brand-light/20 rounded-lg border border-brand-primary/5 shadow-sm hover:shadow-md transition-all hover:border-brand-primary/20"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex-shrink-0 bg-brand-primary/10 p-2 sm:p-3 rounded-full shadow-sm">
                          {item.icon}
                        </div>
                        <div className={`${!isEnglish ? "text-right" : "text-left"}`}>
                          <div className="text-[10px] xs:text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">
                            {isEnglish ? item.label : item.labelAr}
                          </div>
                          <div className="font-bold text-brand-primary text-xs sm:text-sm md:text-base">
                            {item.value}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Car Specifications Section */}
      <div className="bg-white rounded-xl border border-brand-primary/10 shadow-md overflow-hidden">
        <div className="pt-4 sm:pt-6 pb-4 sm:pb-6">
          <h2
            className={`text-lg sm:text-xl font-bold text-brand-primary mb-3 sm:mb-5 flex items-center ${!isEnglish ? "pr-4 sm:pr-6" : "pl-4 sm:pl-6"}`}
          >
            <Sparkles
              className={`w-4 h-4 sm:w-5 sm:h-5 ${isEnglish ? "mr-1 sm:mr-2" : "ml-1 sm:ml-2"} text-brand-primary/70`}
            />
            {isEnglish ? "Car Specifications" : "صفات السيارة"}
          </h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 md:gap-4 px-3 sm:px-4 md:px-6">
            {specCategories &&
              specCategories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="premium-card flex items-center justify-between p-3 sm:p-4 border border-brand-primary/10 rounded-lg bg-gradient-to-br from-white to-brand-light/20 shadow-sm hover:shadow-md transition-all hover:border-brand-primary/30 hover:-translate-y-0.5 active:translate-y-0"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-brand-primary bg-brand-primary/10 p-2 sm:p-3 rounded-full shadow-sm">
                      {getCategoryIcon(category.id)}
                    </span>
                    <span className={`text-xs sm:text-sm md:text-base font-bold ${!isEnglish ? "text-right" : ""}`}>
                      {isEnglish ? category.name?.en : category.name?.ar}
                    </span>
                  </div>
                  <div className="animate-shimmer h-full w-6 sm:w-10 rounded-full"></div>
                  {isEnglish ? (
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                  ) : (
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                  )}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Render custom dialog for all screen sizes */}
      {renderCustomDialog()}
    </div>
  )
}

export default CarOverview
