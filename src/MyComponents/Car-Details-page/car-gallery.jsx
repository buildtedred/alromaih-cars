"use client"
import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import { X } from 'lucide-react'
import styles from "./CompactCarListing.module.css"
import { FinanceCalculator } from "./FinanceCalculator"
import { Skeleton } from "@/components/ui/skeleton"
import { usePathname } from "next/navigation"
import CarOverview from "./car-overview"
import { MultiStepPopup } from "./MultiStepPopup"
import PriceCardSimple from "./PriceCard"
import { useDetailContext } from "@/contexts/detailProvider"

const CompactCarListing = ({ brand_Details }) => {
    const {car_Details, loading } = useDetailContext();
  const pathname = usePathname()
  const isEnglish = pathname.startsWith("/en")

  const [activeImage, setActiveImage] = useState(0)
  const [activePaymentTab, setActivePaymentTab] = useState("cash")
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)
  const [pdfCarDetails, setPdfCarDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPdfLoading, setIsPdfLoading] = useState(true)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [currentMainImage, setCurrentMainImage] = useState(car_Details?.image || "")

  // Process gallery images
  const galleryImages = car_Details?.gallery || []
  const additionalImages = car_Details?.additional_images || []

  // Combine gallery and additional_images
  const allImages = [...(currentMainImage ? [currentMainImage] : []), ...additionalImages]

  useEffect(() => {
    // Simulate loading for demo purposes
    const timer = setTimeout(() => {
      setIsLoading(false)
      setIsPdfLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [car_Details])

  // Handle color change
  const handleColorChange = (imageUrl) => {
    if (imageUrl) {
      setCurrentMainImage(imageUrl)
      setActiveImage(0) // Reset to first image which will be the new color image
    }
  }

  const preparePdfCarDetails = useCallback(async () => {
    if (!car_Details) return null
    return {
      ...car_Details,
      // Add any additional processing for PDF if needed
    }
  }, [car_Details])

  useEffect(() => {
    preparePdfCarDetails().then((details) => {
      setPdfCarDetails(details)
      setIsPdfLoading(false)
    })
  }, [preparePdfCarDetails])

  const renderThumbnails = () => (
    <div className="w-full sm:w-1/5 h-auto sm:h-[400px] mb-4">
      <div className={`${styles.thumbnailContainer} ${styles.customScrollbar} p-1`}>
        {isLoading
          ? Array(6)
              .fill(0)
              .map((_, index) => <Skeleton key={index} className="w-full aspect-square rounded-lg mb-2" />)
          : allImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`${styles.thumbnailButton} ${activeImage === index ? "ring-2 ring-brand-primary" : ""}`}
              >
                <Image
                  src={image || "/placeholder.svg?height=80&width=80"}
                  alt={`${getBrandName()} ${getModelName()} thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
              </button>
            ))}
      </div>
    </div>
  )

  const renderMainCarGallery = () => (
    <div className="w-full sm:w-4/5">
      <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
        {isLoading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <Image
            src={allImages[activeImage] || "/placeholder.svg?height=450&width=800"}
            alt={`${getBrandName()} ${getModelName()} - ${activeImage === 0 ? "Main view" : `View ${activeImage + 1}`}`}
            width={800}
            height={450}
            className={`${styles.mainImage} object-cover`}
          />
        )}
      </div>
    </div>
  )

  // Get model name
  const getModelName = () => {
    if (car_Details?.model?.name) {
      return car_Details.model.name
    }
    return car_Details?.model || "N/A"
  }

  // Get brand name
  const getBrandName = () => {
    if (car_Details?.brand?.name) {
      return car_Details.brand.name
    }
    return car_Details?.brand || ""
  }

  // Format price
  const formatPrice = (price) => {
    if (!price) return "N/A"
    // Just format the number without currency symbol
    return new Intl.NumberFormat(isEnglish ? "en-US" : "ar-SA", {
      maximumFractionDigits: 0,
    }).format(price)
  }

  const renderPaymentCard = () => {
    if (isLoading) {
      return <Skeleton className="h-64 w-full rounded-lg" />
    }

    return (
      <div className="space-y-3">
        <div className="border-2 border-brand-primary rounded-[10px] overflow-hidden bg-white">
          <div className="text-sm text-center p-2 text-brand-primary border-b border-brand-primary">
            {isEnglish ? "Choose the best payment method" : "اختر الطريقة المناسبة لشراء هذه السيارة؟"}
          </div>
          <div className="flex border-b border-brand-primary">
            <button
              onClick={() => setActivePaymentTab("finance")}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                activePaymentTab === "finance"
                  ? "bg-brand-primary text-white"
                  : "bg-white text-brand-primary hover:bg-brand-light"
              }`}
            >
              {isEnglish ? "Finance" : "التمويل"}
            </button>
            <button
              onClick={() => setActivePaymentTab("cash")}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                activePaymentTab === "cash" ? "bg-brand-primary text-white" : "bg-white text-brand-primary hover:bg-brand-light"
              }`}
            >
              {isEnglish ? "Cash" : "كاش"}
            </button>
          </div>

          <div className="p-4">
            {activePaymentTab === "cash" ? (
              <div className="space-y-4">
                <div className="text-left">
                  <p className="text-brand-primary font-medium mb-2">{isEnglish ? "Cash Price" : "سعر الكاش"}</p>
                  <p className="text-3xl font-bold text-brand-primary mb-1 flex items-center gap-1">
                    <RiyalIcon />
                    <span>{formatPrice(car_Details?.pricing?.base_price || 146000)}</span>
                  </p>
                  <p className="text-sm text-brand-primary/70">
                    {isEnglish ? "Including tax and plates" : "شامل الضريبة واللوحات"}
                  </p>
                </div>
                <button
                  onClick={() => setIsPopupOpen(true)}
                  className="w-full py-3 text-sm text-white bg-brand-primary rounded-[5px] font-medium hover:bg-brand-primary/90 transition-colors"
                >
                  {isEnglish ? "Request Purchase" : "طلب شراء"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-left">
                  <p className="text-brand-primary font-medium mb-2">{isEnglish ? "Monthly Payment" : "يبدأ القسط من"}</p>
                  <p className="text-3xl font-bold text-brand-primary mb-1 flex items-center gap-1">
                    <RiyalIcon />
                    <span>{formatPrice(car_Details?.pricing?.monthly_installment || 1940)}</span>
                  </p>
                  <p className="text-sm text-brand-primary/70">
                    {isEnglish ? "Insurance rate not included" : "غير شامل نسبة التأمين"}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded bg-brand-light">
                    <p className="text-xs text-brand-primary mb-1">{isEnglish ? "Monthly" : "القسط"}</p>
                    <p className="text-sm font-medium text-brand-primary flex items-center gap-1">
                      <RiyalIcon />
                      <span>1,940</span>
                    </p>
                  </div>
                  <div className="p-2 rounded bg-brand-light">
                    <p className="text-xs text-brand-primary mb-1">{isEnglish ? "Down Payment" : "الدفعة الأولى"}</p>
                    <p className="text-sm font-medium text-brand-primary flex items-center gap-1">
                      <RiyalIcon />
                      <span>0</span>
                    </p>
                  </div>
                  <div className="p-2 rounded bg-brand-light">
                    <p className="text-xs text-brand-primary mb-1">{isEnglish ? "Period" : "مدة القسط"}</p>
                    <p className="text-sm font-medium text-brand-primary">5 {isEnglish ? "years" : "سنوات"}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsPopupOpen(true)}
                  className="w-full py-3 text-sm text-white bg-brand-primary rounded-[5px] font-medium hover:bg-brand-primary/90 transition-colors"
                >
                  {isEnglish ? "Request Purchase" : "طلب شراء"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const RiyalIcon = () => (
    <svg
      width="16"
      height="18"
      viewBox="0 0 23 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block text-brand-primary"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.02881 14.04L8.01881 12.77V2.07C8.53881 1.31 9.67881 0.47 10.4288 0V12.24L13.3188 11.65V3.32C13.8088 2.63 15.0088 1.74 15.7388 1.3V11.13L22.5588 9.7C22.5888 10.78 22.3888 11.75 21.8388 12.55L15.7388 13.81V16.53L22.6088 15.12C22.6388 16.2 22.4388 17.17 21.8888 17.97L13.3288 19.73V14.33L10.4288 14.9V18.46C9.99881 19.48 9.13881 20.5 8.55881 21.27C8.39881 21.48 8.41881 21.56 8.15881 21.62L0.00881353 23.34C-0.0411865 22.6 0.108814 21.62 0.788814 20.51L8.00881 19.01V15.46L1.23881 16.88C1.18881 16.14 1.33881 15.16 2.01881 14.05L2.02881 14.04ZM14.1488 22.23L22.6188 20.52C22.6488 21.6 22.3188 22.56 21.8988 23.37L13.3288 25.13C13.3688 24.25 13.6288 23.29 14.1588 22.22L14.1488 22.23Z"
        fill="currentColor"
      />
    </svg>
  )

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-36 py-8">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column */}
          <div className="w-full lg:w-[350px]">
            <div className="space-y-3">
              {isLoading ? (
                <>
                  <Skeleton className="h-24 w-full rounded-lg" />
                  <Skeleton className="h-64 w-full rounded-lg" />
                </>
              ) : (
                <>
                  <PriceCardSimple
                    car_Details={car_Details}
                    isEnglish={isEnglish}
                    onColorChange={handleColorChange}
                    pdfCarDetails={pdfCarDetails}
                    isPdfLoading={isPdfLoading}
                    brandDetails={brand_Details}
                  />
                  {renderPaymentCard()}
                </>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row gap-4">
              {renderThumbnails()}
              {renderMainCarGallery()}
            </div>
            <div className="mb-6">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : (
                <CarOverview carDetails={car_Details} />
              )}
            </div>
            <div className="mt-6">
              {isLoading ? (
                <div className="space-y-4">
                  <div className="flex overflow-x-auto border-b mb-4">
                    {Array(4)
                      .fill(0)
                      .map((_, index) => (
                        <Skeleton key={index} className="w-24 h-8 mx-2" />
                      ))}
                  </div>
                  <Skeleton className="h-6 w-1/3 mb-3" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Array(6)
                      .fill(0)
                      .map((_, index) => (
                        <Skeleton key={index} className="h-6 w-full" />
                      ))}
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Finance Calculator Modal */}
      {isCalculatorOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md mx-4 sm:mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{isEnglish ? "Finance Calculator" : "حاسبة التمويل"}</h2>
              <button onClick={() => setIsCalculatorOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <FinanceCalculator carPrice={car_Details?.pricing?.base_price || car_Details?.price} />
          </div>
        </div>
      )}
      <MultiStepPopup car_Details={car_Details} isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div>
  )
}

export default CompactCarListing
