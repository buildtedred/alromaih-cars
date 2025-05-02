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
} from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Import mock data
import carsData, { specNames, specCategories, overviewCategories } from "@/app/api/mock-data"

// Add custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--primary);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: var(--primary-dark);
  }

  /* Custom dialog styles */
  .custom-dialog {
    border-radius: 15px !important;
    overflow: hidden !important;
  }
  
  .custom-dialog-content {
    border-radius: 15px !important;
    overflow: hidden !important;
    padding: 0 !important;
    border: 1px solid #e5e7eb !important;
  }
`

const CarOverview = ({ carId = 1 }) => {
  const pathname = usePathname()
  const isEnglish = pathname.startsWith("/en")
  const [showSpecDialog, setShowSpecDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Get car details from mock data
  const carDetails = carsData.find((car) => car.id === carId) || carsData[0]

  // Set default selected category when dialog opens
  useEffect(() => {
    if (showSpecDialog && !selectedCategory && specCategories.length > 0) {
      setSelectedCategory(specCategories[0])
    }
  }, [showSpecDialog])

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
  const overviewData = overviewCategories.map((row) =>
    row.map((item) => {
      let value = ""

      if (item.key === "brand") {
        value = carDetails.brand
      } else if (item.key === "year") {
        value = carDetails.specs.year.toString()
      } else if (carDetails.specs[item.key]) {
        value = isEnglish ? carDetails.specs[item.key].en : carDetails.specs[item.key].ar
      }

      return {
        icon: getIconComponent(item.icon),
        label: item.label.en,
        labelAr: item.label.ar,
        value: value,
      }
    }),
  )

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    setShowSpecDialog(true)
  }

  // Get specs for a category
  const getCategorySpecs = (categoryId) => {
    const category = specCategories.find((cat) => cat.id === categoryId)
    if (!category) return []

    return category.specs
      .map((specKey) => {
        return {
          label: specNames[specKey]?.en || specKey,
          labelAr: specNames[specKey]?.ar || specKey,
          value: carDetails.specs[specKey]?.en || "",
          valueAr: carDetails.specs[specKey]?.ar || "",
        }
      })
      .filter((spec) => spec.value || spec.valueAr)
  }

  return (
    <div className="space-y-6">
      <style jsx global>
        {scrollbarStyles}
      </style>

      {/* Car Information Section */}
      <div className="bg-brand-light/30 rounded-[5px] border border-gray-200 overflow-hidden">
        <div className="p-4">
          <h2 className={`text-xl font-semibold text-brand-primary mb-4 ${!isEnglish ? "text-right" : ""}`}>
            {isEnglish ? "Car Information" : "معلومات السيارة"}
          </h2>
          <div className="divide-y divide-gray-200">
            {overviewData.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-3 gap-4 px-4 py-3">
                {row.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 justify-start">
                    <div className="flex-shrink-0">{item.icon}</div>
                    <div className={`${!isEnglish ? "text-right" : "text-left"}`}>
                      <div className="text-sm text-gray-500">{isEnglish ? item.label : item.labelAr}</div>
                      <div className="font-semibold text-brand-primary">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Car Specifications Section */}
      <div className="bg-brand-light/30 rounded-[5px] border border-gray-200 overflow-hidden">
        <div className="p-4">
          <h2 className={`text-xl font-semibold text-brand-primary mb-4 ${!isEnglish ? "text-right" : ""}`}>
            {isEnglish ? "Car Specifications" : "صفات السيارة"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className={`flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  selectedCategory?.id === category.id && showSpecDialog ? "bg-brand-light" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-brand-primary">
                    {/* Use appropriate icon based on category */}
                    {category.id === "transmission" ? (
                      <Wrench className="w-5 h-5" />
                    ) : category.id === "engine" ? (
                      <Settings className="w-5 h-5" />
                    ) : category.id === "dimensions" ? (
                      <Car className="w-5 h-5" />
                    ) : category.id === "capacity" ? (
                      <Users className="w-5 h-5" />
                    ) : category.id === "safety" ? (
                      <Shield className="w-5 h-5" />
                    ) : (
                      <Car className="w-5 h-5" />
                    )}
                  </span>
                  <span className={`font-medium ${!isEnglish ? "text-right" : ""}`}>
                    {isEnglish ? category.name.en : category.name.ar}
                  </span>
                </div>
                {isEnglish ? (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronLeft className="w-5 h-5 text-gray-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={showSpecDialog} onOpenChange={setShowSpecDialog} className="rounded-10px">
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-lg border-gray-200 custom-dialog">
          <DialogHeader className="sr-only">
            <DialogTitle>{isEnglish ? "Car Specifications" : "صفات السيارة"}</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <div className="flex">
              {/* Left side - Categories */}
              <div className="w-1/3 border-r flex flex-col h-[70vh] bg-white">
                <div className="p-4 border-b">
                  <h3 className={`text-lg font-semibold text-brand-primary pr-8 ${!isEnglish ? "text-right" : ""}`}>
                    {isEnglish ? "Car Specifications" : "صفات السيارة"}
                  </h3>
                </div>
                <div className="overflow-y-auto flex-1 custom-scrollbar">
                  {specCategories.map((category) => (
                    <button
                      key={category.id}
                      onMouseEnter={() => setSelectedCategory(category)}
                      className={`w-full flex items-center gap-2 p-4 hover:bg-gray-50 transition-colors ${
                        selectedCategory?.id === category.id ? "bg-brand-light" : ""
                      }`}
                    >
                      <span className="text-brand-primary">
                        {/* Use appropriate icon based on category */}
                        {category.id === "transmission" ? (
                          <Wrench className="w-5 h-5" />
                        ) : category.id === "engine" ? (
                          <Settings className="w-5 h-5" />
                        ) : category.id === "dimensions" ? (
                          <Car className="w-5 h-5" />
                        ) : category.id === "capacity" ? (
                          <Users className="w-5 h-5" />
                        ) : category.id === "safety" ? (
                          <Shield className="w-5 h-5" />
                        ) : (
                          <Car className="w-5 h-5" />
                        )}
                      </span>
                      <span className={`flex-1 text-sm font-medium ${!isEnglish ? "text-right" : "text-left"}`}>
                        {isEnglish ? category.name.en : category.name.ar}
                      </span>
                      {isEnglish ? (
                        <ChevronRight
                          className={`w-4 h-4 text-gray-400 ${
                            selectedCategory?.id === category.id ? "text-brand-primary" : ""
                          }`}
                        />
                      ) : (
                        <ChevronLeft
                          className={`w-4 h-4 text-gray-400 ${
                            selectedCategory?.id === category.id ? "text-brand-primary" : ""
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right side - Details */}
              <div className="flex-1 p-6 h-[70vh] overflow-y-auto custom-scrollbar bg-white">
                {selectedCategory && (
                  <>
                    <h3 className="text-lg font-semibold text-brand-primary mb-6 flex items-center gap-2">
                      {/* Use appropriate icon based on category */}
                      {selectedCategory.id === "transmission" ? (
                        <Wrench className="w-5 h-5" />
                      ) : selectedCategory.id === "engine" ? (
                        <Settings className="w-5 h-5" />
                      ) : selectedCategory.id === "dimensions" ? (
                        <Car className="w-5 h-5" />
                      ) : selectedCategory.id === "capacity" ? (
                        <Users className="w-5 h-5" />
                      ) : selectedCategory.id === "safety" ? (
                        <Shield className="w-5 h-5" />
                      ) : (
                        <Car className="w-5 h-5" />
                      )}
                      <span className={`${!isEnglish ? "text-right" : ""}`}>
                        {isEnglish ? selectedCategory.name.en : selectedCategory.name.ar}
                      </span>
                    </h3>
                    <div className="space-y-4">
                      {getCategorySpecs(selectedCategory.id).map((detail, index) => (
                        <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                          <div className={`flex justify-between items-start ${!isEnglish ? "flex-row-reverse" : ""}`}>
                            <span className="text-gray-600 max-w-[45%]">
                              {isEnglish ? detail.label : detail.labelAr}
                            </span>
                            <span className="font-medium text-brand-primary text-right max-w-[45%] break-words">
                              {isEnglish ? detail.value : detail.valueAr}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CarOverview
