"use client"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useOdoo } from "@/contexts/OdooContext"
import Image from "next/image"
import LoadingUi from "../LoadingUi/LoadingUi"
import carsData from "@/app/api/mock-data"
import { useDetailContext } from "@/contexts/detailProvider"
import { Breadcrumb } from "../breadcrumb"

const Brands = () => {
  const { brand, loadingBrand } = useOdoo()
  const pathname = usePathname()
  const isEnglish = pathname.startsWith("/en")
  const currentLocale = isEnglish ? "en" : "ar"

  // Generate breadcrumb items
  const getBreadcrumbItems = () => {
    return [
      {
        label: isEnglish ? "Home" : "الرئيسية",
        href: `/${currentLocale}`,
      },
      {
        label: isEnglish ? "Brands" : "العلامات التجارية",
      },
    ]
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="container mx-auto py-12 relative z-10">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumb items={getBreadcrumbItems()} />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-[#71308A]">
          {isEnglish ? "Our Exclusive Brands" : "علاماتنا التجارية الحصرية"}
        </h1>
        {loadingBrand ? (
          <LoadingUi />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {carsData.map((brand, index) => (
              <BrandCard key={index} brand={brand} isEnglish={isEnglish} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const BrandCard = ({ brand, isEnglish }) => {
  const { setbrands } = useDetailContext()
  const [isHovered, setIsHovered] = useState(false)

  const pathname = usePathname()
  const pathLocale = pathname.startsWith("/ar") ? "ar" : "en"
  // Use either the detected path locale or the provided locale prop
  const currentLocale = pathLocale
  const router = useRouter()

  // Helper function to get text based on current language
  const getText = (textObj) => {
    if (!textObj) return ""
    return typeof textObj === "object" ? textObj[currentLocale] || textObj.en || "" : String(textObj)
  }

  const handleBrands = () => {
    router.push(`/${currentLocale}/all-cars`)
    setbrands(brand)
  }

  return (
    <div onClick={handleBrands}>
      <motion.div
        className="bg-brand-light rounded-[10px] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-purple-100"
        whileHover={{ y: -5 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-4 flex flex-col items-center h-full">
          <div className="w-full h-24 flex items-center justify-center mb-3">
            <Image
              src={brand?.brandLogo || "/placeholder.svg"}
              width={20}
              height={20}
              alt={getText(brand?.brand)}
              className="h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all"
            />
          </div>
          <h3 className="text-center font-semibold text-sm text-[#71308A] mb-2 truncate w-full">
            {getText(brand?.brand)}
          </h3>
          <motion.p
            className="text-center text-xs text-gray-600 line-clamp-2 overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? "auto" : 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* {isEnglish ? brand?.name?.en?.description : brand?.name?.ar?.description} */}
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}

const Loader = () => (
  <div className="flex justify-center items-center h-64">
    <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" className="animate-spin">
      <circle
        cx="25"
        cy="25"
        r="20"
        stroke="#71308A"
        strokeWidth="5"
        fill="none"
        strokeDasharray="31.4 31.4"
        strokeLinecap="round"
        className="animate-dash"
      />
    </svg>
  </div>
)

export default Brands
export { BrandCard }
