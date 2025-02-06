"use client"
import { useState } from "react"
import Image from "next/image"
import { Heart, Share2, X, Calculator, Check, FileText } from 'lucide-react'
import styles from "./CompactCarListing.module.css"
import { FinanceCalculator } from "./FinanceCalculator"
import { Skeleton } from "@/components/ui/skeleton"
import { usePathname } from "next/navigation"
import CarOverview from "./car-overview"

const CompactCarListing = ({ car_Details }) => {
  const pathname = usePathname()
  const isEnglish = pathname.startsWith("/en")

  const [activeImage, setActiveImage] = useState(0)
  const [activeTab, setActiveTab] = useState(car_Details?.specifications?.[0] || "الخارج")
  const [activePaymentTab, setActivePaymentTab] = useState("الدفع نقداً")
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)
  const [visibleThumbnails, setVisibleThumbnails] = useState(6)

  const handleLoadMore = () => {
    setVisibleThumbnails(car_Details?.additional_images?.length)
  }

  const remainingCount = car_Details?.additional_images?.length - visibleThumbnails || 0

  if (!car_Details) {
    return (
      <div className="min-h-screen bg-white rtl">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-36 py-8">
          <div className="mb-8 pb-6 border-b border-gray-200">
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-[250px] space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <div className="flex-1 space-y-4">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white rtl">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-36 py-8">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-semibold mb-1">
                {isEnglish ? car_Details?.name?.en?.name : car_Details?.name?.ar?.name}
              </h1>
              <div className="flex items-center gap-2 text-[#71308A]">
                <span className="inline-block w-4 h-4">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span className="text-sm">فحص شامل 200 نقطة</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300"
                title={isEnglish ? "Download PDF" : "تحميل PDF"}
              >
                <FileText className="h-4 w-4 text-gray-600" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300">
                <Share2 className="h-4 w-4 text-gray-600" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300">
                <Heart className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column */}
          <div className="w-full lg:w-[250px]">
            <div className="space-y-3">
              <div className="bg-gray-100 rounded-lg p-3">
                <h2 className="text-2xl font-bold mb-1">{car_Details?.price?.toLocaleString()} ريال</h2>
                <p className="text-xs text-gray-500">شامل الضريبة</p>
              </div>

              <div className="border border-[#71308A] rounded-lg overflow-hidden">
                <div className="flex">
                  <button
                    onClick={() => setActivePaymentTab("التمويل")}
                    className={`flex-1 py-2 text-sm font-medium ${
                      activePaymentTab === "التمويل" ? "bg-[#71308A] text-white" : "bg-white text-[#71308A]"
                    }`}
                  >
                    التمويل
                  </button>
                  <button
                    onClick={() => setActivePaymentTab("الدفع نقداً")}
                    className={`flex-1 py-2 text-sm font-medium ${
                      activePaymentTab === "الدفع نقداً" ? "bg-[#71308A] text-white" : "bg-white text-[#71308A]"
                    }`}
                  >
                    الدفع نقداً
                  </button>
                </div>
                <div className="p-4 bg-white">
                  {activePaymentTab === "الدفع نقداً" ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1 text-[#71308A]">السعر النقدي</h3>
                        <p className="text-3xl font-bold text-gray-900">{car_Details?.price?.toLocaleString()} ريال</p>
                        <p className="text-sm text-gray-500">شامل الضريبة</p>
                      </div>
                      <button className="w-full py-3 text-sm text-white bg-[#71308A] rounded-lg font-medium hover:bg-[#5f2873] transition-colors">
                        طلب شراء
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1 text-[#71308A]">التمويل</h3>
                        <p className="text-sm text-gray-500">القسط الشهري يبدأ من</p>
                        <p className="text-3xl font-bold text-gray-900">١٬٢٩٩ ريال</p>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">
                          الدفعة الأولى: <span className="text-[#71308A]">20%</span>
                        </p>
                      </div>
                      <button
                        onClick={() => setIsCalculatorOpen(true)}
                        className="w-full py-3 text-sm text-white bg-[#71308A] rounded-lg font-medium hover:bg-[#5f2873] transition-colors flex items-center justify-center"
                      >
                        <Calculator className="w-4 h-4 mr-2" />
                        حاسبة التمويل
                      </button>
                      <button className="w-full py-3 text-sm text-[#71308A] bg-white border border-[#71308A] rounded-lg font-medium hover:bg-gray-50 transition-colors">
                        تقدم بطلب تمويل
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/5 h-auto sm:h-[400px] ">
                <div className={`${styles.thumbnailContainer} ${styles.customScrollbar} p-1`}>
                  {car_Details?.additional_images?.slice(0, visibleThumbnails).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`${styles.thumbnailButton} ${activeImage === index ? "ring-2 ring-[#71308A]" : ""}`}
                    >
                      <Image
                        src={`https://xn--mgbml9eg4a.com${image.image_url}`}
                        alt={`Car thumbnail ${index + 1}`}
                        layout="fill"
                        objectFit="cover"
                      />
                    </button>
                  ))}
                  {remainingCount > 0 && (
                    <button
                      onClick={handleLoadMore}
                      className={`${styles.thumbnailButton} bg-gray-200 flex items-center justify-center`}
                    >
                      <span className="text-gray-600 font-semibold">+{remainingCount}</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="w-full sm:w-4/5">
                <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
                  <Image
                    src={`https://xn--mgbml9eg4a.com${car_Details?.additional_images[activeImage]?.image_url || "/placeholder.svg"}`}
                    alt={car_Details?.additional_images[activeImage]}
                    layout="fill"
                    className={`${styles.mainImage}`}
                  />
                </div>
              </div>
            </div>
            <div className="mb-6">
              <CarOverview
                carDetails={{
                  ...car_Details,
                  vehicle_fuel_types:
                    car_Details.vehicle_fuel_types && car_Details.vehicle_fuel_types.length > 0
                      ? car_Details.vehicle_fuel_types
                      : [{ fuel_type: { en: "N/A", ar: "غير متوفر" } }],
                }}
              />
            </div>
            <div className="mt-6">
              <div className="flex overflow-x-auto border-b mb-4">
                {car_Details?.specifications?.map((tab, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                      activeTab === tab ? "text-[#71308A] border-b-2 border-[#71308A]" : "text-gray-500"
                    }`}
                  >
                    {isEnglish ? tab?.en?.name : tab?.ar?.name}
                  </button>
                ))}
              </div>

              <div>
                <h3 className="text-base font-semibold mb-3">
                  {isEnglish ? activeTab?.en?.name : activeTab?.ar?.name}
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {isEnglish
                    ? activeTab?.en?.values?.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-[#71308A] flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </span>
                          {item}
                        </li>
                      ))
                    : activeTab?.ar?.values?.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-[#71308A] flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </span>
                          {item}
                        </li>
                      ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Finance Calculator Modal */}
      {isCalculatorOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md mx-4 sm:mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">حاسبة التمويل</h2>
              <button onClick={() => setIsCalculatorOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <FinanceCalculator carPrice={car_Details.price} />
          </div>
        </div>
      )}
    </div>
  )
}

export default CompactCarListing
