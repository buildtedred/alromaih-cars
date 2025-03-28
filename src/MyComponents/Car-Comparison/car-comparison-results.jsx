"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import carsData from "@/app/api/mock-data"
import Link from "next/link"

const CarComparisonResults = ({ car1Id, car2Id, onCompareAgain }) => {
  const pathname = usePathname()
  const currentLocale = pathname.startsWith("/ar") ? "ar" : "en"
  const isRTL = currentLocale === "ar"

  const [car1, setCar1] = useState(null)
  const [car2, setCar2] = useState(null)
  const [openCategories, setOpenCategories] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Set loading state
    setIsLoading(true)

    // Find cars by ID from the imported carsData
    const findCarById = (id) => {
      const foundCar = carsData.find((car) => car.id === id)
      return foundCar || carsData[0]
    }

    // Use setTimeout to ensure this runs after initial render
    const timer = setTimeout(() => {
      setCar1(findCarById(car1Id || 1))
      setCar2(findCarById(car2Id || 4))
      setIsLoading(false)
    }, 0)

    return () => clearTimeout(timer)
  }, [car1Id, car2Id])

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
      icon: "/icons/engine.svg",
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

  if (isLoading || !car1 || !car2) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
        <p className="text-center text-gray-600">Loading comparison data...</p>
      </div>
    )
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">{isRTL ? "قارن بين السيارات" : "Compare Cars"}</h1>
      </div>

      {/* Car Comparison Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
        {/* First Car */}
        <div className="flex-1 bg-[#f5f3f7] rounded-[20px] p-6 relative max-w-md">
          <div className="h-48 relative mb-6">
            <Image
              src={car1.image || "/placeholder.svg?height=160&width=240"}
              alt={getText(car1.name)}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>

          <div className="text-center mb-4">
            <div className="h-10 relative">
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
              <p className="text-gray-600 text-sm">{isRTL ? "سعر الكاش" : "Cash Price"}</p>
              <p className="text-brand-primary text-2xl font-bold">
                {isRTL ? `${car1.cashPrice.toLocaleString()} ريال` : `${car1.cashPrice.toLocaleString()} ريال`}
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
        <div className="flex-shrink-0">
          <div className="text-5xl font-bold text-brand-primary">VS</div>
        </div>

        {/* Second Car */}
        <div className="flex-1 bg-[#f5f3f7] rounded-[20px] p-6 relative max-w-md">
          <div className="h-48 relative mb-6">
            <Image
              src={car2.image || "/placeholder.svg?height=160&width=240"}
              alt={getText(car2.name)}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>

          <div className="text-center mb-4">
            <div className="h-10 relative">
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
              <p className="text-gray-600 text-sm">{isRTL ? "سعر الكاش" : "Cash Price"}</p>
              <p className="text-brand-primary text-2xl font-bold">
                {isRTL ? `${car2.cashPrice.toLocaleString()} ريال` : `${car2.cashPrice.toLocaleString()} ريال`}
              </p>
            </div>

            <div className="text-right">
              <h4 className="text-brand-primary text-xl font-bold">{getText(car2.name)}</h4>
              <p className="text-sm text-gray-600">{getText(car2.specs.engine)}</p>
              <p className="text-sm text-gray-600">{getText(car2.specs.power)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compare Again Button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={onCompareAgain}
          className="bg-brand-primary text-white px-8 py-3 rounded-[10px] hover:bg-brand-dark transition-colors text-lg"
        >
          {isRTL ? "قارن لسيارة أخرى" : "Compare Another Car"}
        </button>
      </div>

      {/* Specifications Comparison Section - Styled to match the image */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center mb-4 text-brand-primary">
          {isRTL ? "مقارنة صفات السيارة" : "Car Features Comparison"}
        </h2>

        {/* Top border line - continuous without a gap */}
        <div className="h-[2px] bg-brand-primary w-full mb-4"></div>

        {specCategories.map((category, categoryIndex) => (
          <div key={category.id} className="mb-4">
            {/* Category Header with Icon - Clickable */}
            <div
              className="flex items-center justify-between mb-2 cursor-pointer pl-2"
              onClick={() => toggleCategory(category.id)}
            >
              <div className="flex items-center">
                <div className="w-6 h-6 relative mr-3">
                  <Image
                    src="/icons/down-arrow.svg"
                    alt="Toggle"
                    width={24}
                    height={24}
                    className={`transition-transform duration-300 ${openCategories[category.id] ? "rotate-180" : ""}`}
                  />
                </div>
                <span className="text-brand-primary text-xl font-bold">{getText(category.name)}</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 relative">
                  <Image
                    src={category.icon || "/placeholder.svg?height=32&width=32"}
                    alt={getText(category.name)}
                    width={32}
                    height={32}
                    className="text-brand-primary"
                  />
                </div>
              </div>
            </div>

            {/* Collapsible Content */}
            {openCategories[category.id] && (
              <>
                {/* Brand Logos */}
                <div className="flex mb-4">
                  <div className="w-1/2 flex justify-center">
                    <div className="h-10 w-32 relative">
                      <Image
                        src={car1.brandLogo || "/placeholder.svg?height=40&width=120"}
                        alt={car1.brand}
                        width={120}
                        height={40}
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  </div>
                  <div className="w-1/2 flex justify-center">
                    <div className="h-10 w-32 relative">
                      <Image
                        src={car2.brandLogo || "/placeholder.svg?height=40&width=120"}
                        alt={car2.brand}
                        width={120}
                        height={40}
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Specs Table */}
                <div className="relative">
                  {/* Center divider line that doesn't touch the horizontal lines */}
                  <div className="absolute top-4 bottom-4 left-1/2 w-[2px] bg-brand-primary transform -translate-x-[1px]"></div>

                  {category.specs.map((spec, index) => (
                    <div key={spec} className="flex">
                      {/* Left Car Specs */}
                      <div className="w-1/2 py-3">
                        <div className="flex justify-between px-12">
                          <div className="text-gray-700">{car1.specs[spec] ? getText(car1.specs[spec]) : "-"}</div>
                          <div className="text-brand-primary font-medium">{getSpecName(spec)}</div>
                        </div>
                        <div className="h-[1px] bg-brand-primary w-[calc(100%-80px)] mx-auto mt-3 opacity-30"></div>
                      </div>

                      {/* Right Car Specs */}
                      <div className="w-1/2 py-3">
                        <div className="flex justify-between px-12">
                          <div className="text-brand-primary font-medium">{getSpecName(spec)}</div>
                          <div className="text-gray-700">{car2.specs[spec] ? getText(car2.specs[spec]) : "-"}</div>
                        </div>
                        <div className="h-[1px] bg-brand-primary w-[calc(100%-80px)] mx-auto mt-3 opacity-30"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Add bottom border after each category */}
            <div className="h-[1px] bg-brand-primary w-full my-4 opacity-30"></div>
          </div>
        ))}

        {/* Bottom border line - continuous without a gap */}
        <div className="h-[2px] bg-brand-primary w-full mt-4"></div>
      </div>

      {/* Return Link */}
      <div className="text-center mb-8">
        <Link href={`/${currentLocale}`} className="text-brand-primary hover:underline">
          {isRTL ? "العودة إلى قائمة السيارات" : "Back to Car Listing"}
        </Link>
      </div>
    </div>
  )
}

export default CarComparisonResults

