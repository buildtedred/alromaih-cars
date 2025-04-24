"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronDown, ChevronUp, ArrowLeft, ArrowRight } from "lucide-react"
import carsData from "@/app/api/mock-data"

const CarComparisonResults = ({ car1Id, car2Id, car3Id, onCompareAgain }) => {
  const pathname = usePathname()
  const currentLocale = pathname.startsWith("/ar") ? "ar" : "en"
  const isRTL = currentLocale === "ar"

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

  // Specification categories with their icons
  const specCategories = [
    {
      id: "transmission",
      name: { en: "Transmission", ar: "ناقل الحركة" },
      icon: "/icons/transmission.svg",
      specs: ["transmission", "driveType", "drivingMode"],
    },
    {
      id: "engine",
      name: { en: "Engine & Performance", ar: "المحرك والأداء" },
      icon: "/icons/Horse.svg",
      specs: ["engine", "power", "torque", "acceleration"],
    },
    {
      id: "dimensions",
      name: { en: "Dimensions", ar: "الأبعاد" },
      icon: "/icons/dimensions.svg",
      specs: ["length", "width", "height", "wheelbase"],
    },
    {
      id: "capacity",
      name: { en: "Capacity", ar: "السعة" },
      icon: "/icons/seats.svg",
      specs: ["seats", "fuelTank", "cargoCapacity"],
    },
    {
      id: "safety",
      name: { en: "Safety", ar: "السلامة" },
      icon: "/icons/safety.svg",
      specs: ["airbags", "brakes", "parkingSensors", "camera"],
    },
  ]

  // Get user-friendly spec name
  const getSpecName = (spec) => {
    const specNames = {
      transmission: { en: "Transmission", ar: "ناقل الحركة" },
      driveType: { en: "Drive Type", ar: "نوع الجر" },
      drivingMode: { en: "Driving Mode", ar: "وضع القيادة" },
      engine: { en: "Engine", ar: "المحرك" },
      power: { en: "Power", ar: "القوة" },
      torque: { en: "Torque", ar: "عزم الدوران" },
      acceleration: { en: "0-100 km/h", ar: "التسارع 0-100 كم/س" },
      length: { en: "Length", ar: "الطول" },
      width: { en: "Width", ar: "العرض" },
      height: { en: "Height", ar: "الارتفاع" },
      wheelbase: { en: "Wheelbase", ar: "قاعدة العجلات" },
      seats: { en: "Seating Capacity", ar: "عدد المقاعد" },
      fuelTank: { en: "Fuel Tank Capacity", ar: "سعة خزان الوقود" },
      cargoCapacity: { en: "Cargo Capacity", ar: "سعة الحمولة" },
      airbags: { en: "Airbags", ar: "الوسائد الهوائية" },
      brakes: { en: "Brakes", ar: "المكابح" },
      parkingSensors: { en: "Parking Sensors", ar: "حساسات الركن" },
      camera: { en: "Rear Camera", ar: "كاميرا خلفية" },
    }
    return getText(specNames[spec] || { en: spec, ar: spec })
  }

  if (isLoading || !car1 || !car2 || (hasThirdCar && !car3)) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-md">
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-brand-light mb-4"></div>
            <div className="h-4 w-48 bg-brand-light rounded mb-2"></div>
            <div className="h-3 w-36 bg-brand-light rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-brand-primary mb-2">{isRTL ? "قارن بين السيارات" : "Compare Cars"}</h1>
        <p className="text-gray-600">{isRTL ? "مقارنة تفصيلية بين السيارات" : "Detailed car comparison"}</p>
      </div>

      {/* Car Comparison Section */}
      <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 mb-10">
        {/* First Car */}
        <div
          className={`flex-1 bg-gradient-to-b from-[#f8f6f9] to-[#f0ebf1] rounded-3xl p-8 shadow-md relative ${hasThirdCar ? "max-w-sm" : "max-w-md"}`}
        >
          <div className="h-48 relative mb-6">
            <Image
              src={car1.image || "/placeholder.svg?height=160&width=240"}
              alt={getText(car1.name)}
              fill
              style={{ objectFit: "contain" }}
              className="drop-shadow-md"
            />
          </div>

          <div className="text-center mb-6">
            <div className="h-12 relative">
              <Image
                src={car1.brandLogo || "/placeholder.svg?height=40&width=120"}
                alt={car1.brand}
                width={120}
                height={40}
                style={{ objectFit: "contain", margin: "0 auto" }}
              />
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="text-gray-600 text-sm font-medium">{isRTL ? "سعر الكاش" : "Cash Price"}</p>
              <p className="text-brand-primary text-2xl font-bold">
                {isRTL ? `${car1.cashPrice.toLocaleString()} ريال` : `${car1.cashPrice.toLocaleString()} SAR`}
              </p>
            </div>

            <div className="text-right">
              <h4 className="text-brand-primary text-xl font-bold">{getText(car1.name)}</h4>
              <p className="text-sm text-gray-600">{getText(car1.specs.engine)}</p>
              <p className="text-sm text-gray-600">{getText(car1.specs.power)}</p>
            </div>
          </div>
        </div>

        {/* VS Badge */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg">
            <span className="text-xl font-bold">VS</span>
          </div>
        </div>

        {/* Second Car */}
        <div
          className={`flex-1 bg-gradient-to-b from-[#f8f6f9] to-[#f0ebf1] rounded-3xl p-8 shadow-md relative ${hasThirdCar ? "max-w-sm" : "max-w-md"}`}
        >
          <div className="h-48 relative mb-6">
            <Image
              src={car2.image || "/placeholder.svg?height=160&width=240"}
              alt={getText(car2.name)}
              fill
              style={{ objectFit: "contain" }}
              className="drop-shadow-md"
            />
          </div>

          <div className="text-center mb-6">
            <div className="h-12 relative">
              <Image
                src={car2.brandLogo || "/placeholder.svg?height=40&width=120"}
                alt={car2.brand}
                width={120}
                height={40}
                style={{ objectFit: "contain", margin: "0 auto" }}
              />
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="text-gray-600 text-sm font-medium">{isRTL ? "سعر الكاش" : "Cash Price"}</p>
              <p className="text-brand-primary text-2xl font-bold">
                {isRTL ? `${car2.cashPrice.toLocaleString()} ريال` : `${car2.cashPrice.toLocaleString()} SAR`}
              </p>
            </div>

            <div className="text-right">
              <h4 className="text-brand-primary text-xl font-bold">{getText(car2.name)}</h4>
              <p className="text-sm text-gray-600">{getText(car2.specs.engine)}</p>
              <p className="text-sm text-gray-600">{getText(car2.specs.power)}</p>
            </div>
          </div>
        </div>

        {/* Third Car (conditionally rendered) */}
        {hasThirdCar && (
          <>
            {/* VS Badge */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold">VS</span>
              </div>
            </div>

            {/* Third Car */}
            <div className="flex-1 bg-gradient-to-b from-[#f8f6f9] to-[#f0ebf1] rounded-3xl p-8 shadow-md relative max-w-sm">
              <div className="h-48 relative mb-6">
                <Image
                  src={car3.image || "/placeholder.svg?height=160&width=240"}
                  alt={getText(car3.name)}
                  fill
                  style={{ objectFit: "contain" }}
                  className="drop-shadow-md"
                />
              </div>

              <div className="text-center mb-6">
                <div className="h-12 relative">
                  <Image
                    src={car3.brandLogo || "/placeholder.svg?height=40&width=120"}
                    alt={car3.brand}
                    width={120}
                    height={40}
                    style={{ objectFit: "contain", margin: "0 auto" }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{isRTL ? "سعر الكاش" : "Cash Price"}</p>
                  <p className="text-brand-primary text-2xl font-bold">
                    {isRTL ? `${car3.cashPrice.toLocaleString()} ريال` : `${car3.cashPrice.toLocaleString()} SAR`}
                  </p>
                </div>

                <div className="text-right">
                  <h4 className="text-brand-primary text-xl font-bold">{getText(car3.name)}</h4>
                  <p className="text-sm text-gray-600">{getText(car3.specs.engine)}</p>
                  <p className="text-sm text-gray-600">{getText(car3.specs.power)}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Compare Again Button */}
      <div className="flex justify-center mb-12">
        <button
          onClick={onCompareAgain}
          className="bg-brand-primary text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-colors text-lg font-medium shadow-md flex items-center gap-2"
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

      {/* Specifications Comparison Section */}
      <div className="mb-12 bg-white rounded-3xl shadow-md overflow-hidden">
        <div className="bg-brand-primary text-white py-4 px-6">
          <h2 className="text-2xl font-bold text-center">{isRTL ? "مقارنة المواصفات" : "Specifications Comparison"}</h2>
        </div>

        <div className="p-6">
          {specCategories.map((category, categoryIndex) => (
            <div key={category.id} className="mb-6 last:mb-0">
              {/* Category Header with Icon - Clickable */}
              <div
                className={`flex items-center justify-between p-4 cursor-pointer rounded-xl transition-colors ${
                  openCategories[category.id] ? "bg-brand-light" : "hover:bg-gray-50"
                }`}
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-primary bg-opacity-10 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 relative">
                      <Image
                        src={category.icon || "/placeholder.svg?height=24&width=24"}
                        alt={getText(category.name)}
                        width={24}
                        height={24}
                      />
                    </div>
                  </div>
                  <span className="text-brand-primary text-xl font-bold">{getText(category.name)}</span>
                </div>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-light">
                  {openCategories[category.id] ? (
                    <ChevronUp className="w-5 h-5 text-brand-primary" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-brand-primary" />
                  )}
                </div>
              </div>

              {/* Collapsible Content */}
              {openCategories[category.id] && (
                <div className="mt-4 bg-white rounded-xl overflow-hidden border border-gray-100">
                  {/* Car Names */}
                  <div className="flex border-b border-gray-100">
                    <div className={`${hasThirdCar ? "w-1/3" : "w-1/2"} py-3 px-6 bg-brand-light bg-opacity-30`}>
                      <div className="flex items-center justify-center">
                        <h4 className="font-bold text-brand-primary">{getText(car1.name)}</h4>
                      </div>
                    </div>
                    <div className={`${hasThirdCar ? "w-1/3" : "w-1/2"} py-3 px-6 bg-brand-light bg-opacity-30`}>
                      <div className="flex items-center justify-center">
                        <h4 className="font-bold text-brand-primary">{getText(car2.name)}</h4>
                      </div>
                    </div>
                    {hasThirdCar && (
                      <div className="w-1/3 py-3 px-6 bg-brand-light bg-opacity-30">
                        <div className="flex items-center justify-center">
                          <h4 className="font-bold text-brand-primary">{getText(car3.name)}</h4>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Specs Rows */}
                  {category.specs.map((spec, index) => (
                    <div key={spec} className="flex border-b last:border-b-0 border-gray-100">
                      {/* First Car Specs */}
                      <div
                        className={`${hasThirdCar ? "w-1/3" : "w-1/2"} py-4 px-6 flex items-center justify-center border-r border-gray-100`}
                      >
                        <div className="text-center">
                          <div className="text-gray-800 font-medium">
                            {car1.specs[spec] ? getText(car1.specs[spec]) : "-"}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{getSpecName(spec)}</div>
                        </div>
                      </div>

                      {/* Second Car Specs */}
                      <div
                        className={`${hasThirdCar ? "w-1/3 border-r" : "w-1/2"} py-4 px-6 flex items-center justify-center ${hasThirdCar ? "border-r border-gray-100" : ""}`}
                      >
                        <div className="text-center">
                          <div className="text-gray-800 font-medium">
                            {car2.specs[spec] ? getText(car2.specs[spec]) : "-"}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{getSpecName(spec)}</div>
                        </div>
                      </div>

                      {/* Third Car Specs (conditionally rendered) */}
                      {hasThirdCar && (
                        <div className="w-1/3 py-4 px-6 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-gray-800 font-medium">
                              {car3.specs[spec] ? getText(car3.specs[spec]) : "-"}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{getSpecName(spec)}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Return Link */}
      <div className="text-center mb-12">
        <Link
          href={`/${currentLocale}`}
          className="inline-flex items-center gap-2 text-brand-primary hover:underline font-medium"
        >
          {isRTL ? (
            <>
              <ArrowRight className="w-4 h-4" /> العودة إلى قائمة السيارات
            </>
          ) : (
            <>
              <ArrowLeft className="w-4 h-4" /> Back to Car Listing
            </>
          )}
        </Link>
      </div>
    </div>
  )
}

export default CarComparisonResults
