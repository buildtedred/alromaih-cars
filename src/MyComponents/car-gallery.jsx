"use client"
import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import { Heart, Share2, X, Calculator, Check, FileText } from "lucide-react"
import styles from "./CompactCarListing.module.css"
import { FinanceCalculator } from "./FinanceCalculator"
import { Skeleton } from "@/components/ui/skeleton"
import { usePathname } from "next/navigation"
import CarOverview from "./car-overview"
import { PDFDownloadLink } from "@react-pdf/renderer"
import CarDetailsPDF from "./car-details-pdf"
import { fetchImageAsBase64 } from "./fetch-image"
import { MultiStepPopup } from "./MultiStepPopup"

const CompactCarListing = ({ car_Details, brand_Details }) => {

  const pathname = usePathname();
  const isEnglish = pathname.startsWith("/en");

  const [singleData, setsingleData] = useState(null);
  // console.log(" sigle data", singleData)

  const getsingledata = Array.isArray(car_Details?.en_US) && Array.isArray(car_Details?.ar_001)
    ? isEnglish
      ? car_Details.en_US // English data
      : car_Details.ar_001 // Arabic data
    : [];

  useEffect(() => {
    if (getsingledata.length > 0) {
      setsingleData(getsingledata[0]); // Sirf pehla item set karein
    }
  }, [getsingledata]); // Jab `getsingledata` update ho tabhi chale

  const [activeImage, setActiveImage] = useState(0)
  const [activeTab, setActiveTab] = useState(car_Details?.specifications?.[0] || "الخارج")
  const [activePaymentTab, setActivePaymentTab] = useState("الدفع نقداً")
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)
  const [visibleThumbnails, setVisibleThumbnails] = useState(6)
  const [pdfCarDetails, setPdfCarDetails] = useState(null)
  const [imageUrls, setImageUrls] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isPdfLoading, setIsPdfLoading] = useState(true)
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  // console.log("active image",activeImage)

  const handleLoadMore = () => {
    setVisibleThumbnails(car_Details?.images?.length)
  }

  const remainingCount = car_Details?.images?.length - visibleThumbnails || 0

  const getFuelType = () => {
    if (car_Details?.vehicle_fuel_types && car_Details.vehicle_fuel_types.length > 0) {
      return car_Details.vehicle_fuel_types[0].fuel_type
    }
    return { en: "N/A", ar: "غير متوفر" }
  }

  const getImageUrl = useCallback(async (imageUrl) => {
    if (!imageUrl) return "/placeholder.svg"
    const cleanPath = imageUrl.replace(/^\//, "")
    const fullUrl = cleanPath.startsWith("http") ? cleanPath : `https://xn--mgbml9eg4a.com/${cleanPath}`

    try {
      const base64Image = await fetchImageAsBase64(fullUrl)
      return base64Image || "/placeholder.svg"
    } catch (error) {
      console.error("Error converting image:", error)
      return "/placeholder.svg"
    }
  }, [])

  // console.log("dddddddddddddddddddddd image from")

  const preparePdfCarDetails = useCallback(async () => {
    if (!car_Details) return null

    const mainImageUrl = car_Details?.additional_images?.[0]?.image_url || car_Details?.image_url
    const base64MainImage = await getImageUrl(mainImageUrl)

    return {
      ...car_Details,
      image_url: base64MainImage,
      additional_images: await Promise.all(
        (car_Details?.additional_images || []).map(async (img) => ({
          ...img,
          image_url: await getImageUrl(img.image_url),
        })),
      ),
    }
  }, [car_Details, getImageUrl])

  useEffect(() => {
    preparePdfCarDetails().then((details) => {
      setPdfCarDetails(details)
      setIsPdfLoading(false)
    })
  }, [preparePdfCarDetails])

  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true)
      const urls = {}
      for (const image of car_Details?.additional_images || []) {
        urls[image.image_url] = await getImageUrl(image.image_url)
      }
      setImageUrls(urls)
      setIsLoading(false)
    }
    loadImages()
  }, [car_Details, getImageUrl])

  const renderPdfIcon = () => (
    <div className="mb-4">
      {isPdfLoading ? (
        <Skeleton className="w-8 h-8 rounded-full" />
      ) : pdfCarDetails ? (
        <PDFDownloadLink
          document={
            <CarDetailsPDF carDetails={pdfCarDetails} brandDetails={brand_Details} locale={isEnglish ? "en" : "ar"} />
          }
          fileName={`${car_Details?.name?.en?.name || "car-details"}.pdf`}
        >
          {({ blob, url, loading, error }) => (
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300"
              title={isEnglish ? "Download PDF" : "تحميل PDF"}
              disabled={loading}
            >
              {loading ? <span className="animate-spin">⌛</span> : <FileText className="h-4 w-4 text-gray-600" />}
            </button>
          )}
        </PDFDownloadLink>
      ) : (
        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300" disabled>
          <span className="animate-spin">⌛</span>
        </button>
      )}
    </div>
  )

  const renderThumbnails = () => (
    <div className="w-full sm:w-1/5 h-auto sm:h-[400px] mb-4">
      <div className={`${styles.thumbnailContainer} ${styles.customScrollbar} p-1`}>
        {isLoading
          ? Array(6)
            .fill(0)
            .map((_, index) => <Skeleton key={index} className="w-full aspect-square rounded-lg mb-2" />)
          : singleData?.vehicle_image_ids?.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)} // ✅ Set Active Image
              className={`${styles.thumbnailButton} ${activeImage === index ? "ring-2 ring-[#71308A]" : ""}`}
            >
              <Image
                src={image?.vehicle_image ? `data:image/png;base64,${image.vehicle_image}` : "/placeholder.svg"}
                alt={`Car thumbnail ${index + 1}`}
                width={80} // ✅ Set width for better layout
                height={80} // ✅ Set height for better layout
                objectFit="cover"
                className="rounded-md"
              />
            </button>
          ))}
      </div>
    </div>
  );

  const renderMainCarGallery = () => (
    <div className="w-full sm:w-4/5">
      <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
        {isLoading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <Image
            src={
              singleData?.vehicle_image_ids?.[activeImage]?.vehicle_image
                ? `data:image/png;base64,${singleData.vehicle_image_ids[activeImage].vehicle_image}`
                : "/placeholder.svg"
            }
            alt={`Car image ${activeImage + 1}`}
            width={800} // ✅ Fixed width
            height={450} // ✅ Fixed height
            objectFit="cover"
            className={styles.mainImage}
          />
        )}
      </div>
    </div>
  );


  return (

    <div className="min-h-screen bg-white rtl">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-36 py-8">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-64 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </>
              ) : (
                <>
                  <h1 className="text-xl font-semibold mb-1">
                    {singleData?.name}
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
                </>
              )}
            </div>
            <div className="flex gap-2">
              {renderPdfIcon()}
              {isLoading ? (
                <>
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-8 h-8 rounded-full" />
                </>
              ) : (
                <>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300">
                    <Share2 className="h-4 w-4 text-gray-600" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column */}
          <div className="w-full lg:w-[250px]">
            <div className="space-y-3">
              {isLoading ? (
                <>
                  <Skeleton className="h-24 w-full rounded-lg" />
                  <Skeleton className="h-64 w-full rounded-lg" />
                </>
              ) : (
                <>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <h2 className="text-2xl font-bold mb-1">{singleData?.current_market_value?.toLocaleString()} ريال</h2>
                    <p className="text-xs text-gray-500">شامل الضريبة</p>
                  </div>

                  <div className="border border-[#71308A] rounded-lg overflow-hidden">
                    <div className="flex">
                      <button
                        onClick={() => setActivePaymentTab("التمويل")}
                        className={`flex-1 py-2 text-sm font-medium ${activePaymentTab === "التمويل" ? "bg-[#71308A] text-white" : "bg-white text-[#71308A]"
                          }`}
                      >
                        التمويل
                      </button>
                      <button
                        onClick={() => setActivePaymentTab("الدفع نقداً")}
                        className={`flex-1 py-2 text-sm font-medium ${activePaymentTab === "الدفع نقداً" ? "bg-[#71308A] text-white" : "bg-white text-[#71308A]"
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
                            <p className="text-3xl font-bold text-gray-900">
                              {car_Details?.price?.toLocaleString()} ريال
                            </p>
                            <p className="text-sm text-gray-500">شامل الضريبة</p>
                          </div>
                          <button
                            onClick={() => setIsPopupOpen(true)}
                            className="w-full py-3 text-sm text-white bg-[#71308A] rounded-lg font-medium hover:bg-[#5f2873] transition-colors"
                          >
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
                <CarOverview
                  carDetails={singleData}
                />
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
                <>
                  <div className="flex overflow-x-auto border-b mb-4">
                    {car_Details?.specifications?.map((tab, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === tab ? "text-[#71308A] border-b-2 border-[#71308A]" : "text-gray-500"
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
                </>
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
              <h2 className="text-xl font-bold">حاسبة التمويل</h2>
              <button onClick={() => setIsCalculatorOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <FinanceCalculator carPrice={car_Details.price} />
          </div>
        </div>
      )}
      <MultiStepPopup car_Details={car_Details} isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div>
  )
}

export default CompactCarListing

