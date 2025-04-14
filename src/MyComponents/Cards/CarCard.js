"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Heart } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useDetailContext } from "@/contexts/detailProvider"

const CarCard = ({ car, onFavoriteToggle, isFavorite: initialIsFavorite, locale }) => {
  const {setcar_Details, loading } = useDetailContext();
  const pathname = usePathname()
  const router = useRouter();
  // Detect language from URL path
  const pathLocale = pathname.startsWith("/ar") ? "ar" : "en"
  // Use either the detected path locale or the provided locale prop
  const currentLocale = pathLocale || locale
  const isRTL = currentLocale === "ar"
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite || false)
  const [isHovered, setIsHovered] = useState(false)

  // This useEffect is important to keep the favorite state in sync with props
  useEffect(() => {
    setIsFavorite(initialIsFavorite || false)
  }, [initialIsFavorite])

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
    if (onFavoriteToggle) {
      onFavoriteToggle(car.id)
    }
  }

  // Badge text mapping with language support
  const getBadgeText = (status) => {
    switch (status) {
      case "new":
        return isRTL ? "جديد" : "New"
      case "unavailable":
        return isRTL ? "غير متوفر" : "Unavailable"
      case "discount":
        return isRTL ? "خصم" : "Discount"
      default:
        return ""
    }
  }

  // Badge color mapping
  const getBadgeColor = (status) => {
    switch (status) {
      case "new":
        return "bg-brand-light text-brand-primary"
      case "unavailable":
        return "bg-brand-light text-brand-primary"
      case "discount":
        return "bg-brand-primary text-white"
      default:
        return "bg-gray-200"
    }
  }

  // Get text based on current locale - fixed to always return a string
  const getText = (textObj) => {
    if (!textObj) return ""
    return typeof textObj === "object" ? textObj[currentLocale] || textObj.en || "" : String(textObj)
  }
  const handleViewDetails = () => {
    router.push(
      `/${currentLocale}/car-details/${car.id}`
    );
    setcar_Details(car) // ✅ sets details from context
  };
  return (
    <div
     
      className="rounded-[20px] border-2 border-brand-primary bg-white overflow-hidden flex flex-col w-full h-full relative transition-all duration-500 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status Badge - Fixed positioning */}
      {car.status && (
        <div
          className={`absolute ${getBadgeColor(car.status)} px-2 py-1 border-2 border-brand-primary border-l-0 text-sm font-medium z-20`}
          style={{
            top: "24px",
            left: "-2px",
            borderTopRightRadius: "13px",
            borderBottomRightRadius: "13px",
            paddingLeft: "8px",
          }}
        >
          {getBadgeText(car.status)}
        </div>
      )}

      {/* Car Image Section */}
      <div className="relative pt-4 px-2 border-b border-brand-primary mx-2 overflow-hidden">
        <div
          className="w-full h-[160px] relative transition-transform duration-500"
          style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
        >
          <Image
            src={car.image || "/placeholder.svg?height=200&width=300"}
            alt={getText(car.name)}
            fill
            style={{ objectFit: "contain" }}
            className="w-full h-full transition-all duration-500"
          />
        </div>

        {/* Favorite Button - Repositioned to align with status badge */}
        <button
          onClick={handleFavoriteClick}
          className="absolute z-10 transition-all duration-300 hover:scale-110"
          style={{
            top: "24px",
            right: "8px",
          }}
        >
          <Heart
            className={`w-6 h-6 transition-all duration-300 ${isFavorite ? "fill-brand-primary text-brand-primary scale-110" : "text-brand-primary hover:scale-110"}`}
          />
        </button>
      </div>

      {/* Car Details Section with all divider lines */}
      <div className="flex flex-col flex-grow">
        {/* Brand Logo and Name with bottom border */}
        <div className="flex flex-row-reverse justify-between items-center pb-2 px-2 border-b border-brand-primary mx-3">
          <div className="flex items-center justify-center ml-2 py-2">
            <div className="h-10 w-20 relative flex items-center justify-center">
              <Image
                src={car.brandLogo || "/placeholder.svg?height=40&width=80"}
                alt="Brand Logo"
                width={80}
                height={40}
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
          <div className={`${isRTL ? "text-right" : "text-left"} flex-1 min-w-0 flex flex-col justify-center`}>
            <h3
              className="text-lg font-bold text-brand-primary overflow-hidden whitespace-nowrap transition-all duration-300"
              style={{ textOverflow: "ellipsis", color: isHovered ? "#5a1f70" : "" }}
            >
              {getText(car.name)}
            </h3>
            <p
              className="text-xs text-gray-600 overflow-hidden whitespace-nowrap transition-all duration-300"
              style={{ textOverflow: "ellipsis" }}
            >
              {getText(car.modelYear)}
            </p>
          </div>
        </div>

        {/* Price Section with top and bottom borders - FIXED LAYOUT */}
        <div className="relative border-t-0 border-b border-brand-primary py-2 mx-2">
          {/* Vertical line in the center */}
          <div className="absolute top-2 bottom-2 left-1/2 transform -translate-x-1/2 w-px bg-brand-primary"></div>

          <div className="grid grid-cols-2 gap-0">
            <div className="px-3">
              <p className="text-xs text-brand-primary mb-1">{isRTL ? "سعر الكاش" : "Cash Price"}</p>
              <div className="font-bold text-brand-primary flex items-center">
                <span className="mr-1 flex-shrink-0">
                  <Image src={car.icons.currency || "/icons/Currency.svg"} alt="Currency" width={12} height={12} />
                </span>
                <span className="text-base">{car.cashPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="px-3">
              <p className="text-xs text-brand-primary mb-1">{isRTL ? "أقساط من" : "Installments from"}</p>
              <div className="font-bold text-brand-primary flex items-center">
                <span className="mr-1 flex-shrink-0">
                  <Image src={car.icons.currency || "/icons/Currency.svg"} alt="Currency" width={12} height={12} />
                </span>
                <span className="text-base">{car.installmentPrice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Icons with bottom border - IMPROVED LAYOUT */}
        <div className="grid grid-cols-4 gap-0 py-1 px-1 border-b border-brand-primary mx-2">
          <div className="flex flex-col items-center transition-all duration-300 hover:transform hover:scale-110">
            <div className="w-4 h-4 relative">
              <Image
                src={car.icons.year || "/icons/Calendar.svg"}
                alt="Year"
                width={16}
                height={16}
                className="text-brand-primary"
              />
            </div>
            <span className="text-[8px] mt-1 text-brand-primary text-center">{car.specs.year}</span>
          </div>

          <div className="flex flex-col items-center transition-all duration-300 hover:transform hover:scale-110">
            <div className="w-4 h-4 relative">
              <Image
                src={car.icons.transmission || "/icons/Transmission.svg"}
                alt="Transmission"
                width={16}
                height={16}
                className="text-brand-primary"
              />
            </div>
            <span className="text-[8px] mt-1 text-brand-primary text-center">{getText(car.specs.transmission)}</span>
          </div>

          <div className="flex flex-col items-center transition-all duration-300 hover:transform hover:scale-110">
            <div className="w-4 h-4 relative">
              <Image
                src={car.icons.seats || "/icons/Horse.svg"}
                alt="Seats"
                width={16}
                height={16}
                className="text-brand-primary"
              />
            </div>
            <span className="text-[8px] mt-1 text-brand-primary text-center">{getText(car.specs.seats)}</span>
          </div>

          <div className="flex flex-col items-center transition-all duration-300 hover:transform hover:scale-110">
            <div className="w-4 h-4 relative">
              <Image
                src={car.icons.fuel || "/icons/Fuel.svg"}
                alt="Fuel"
                width={16}
                height={16}
                className="text-brand-primary"
              />
            </div>
            <span className="text-[8px] mt-1 text-brand-primary text-center">{getText(car.specs.fuelType)}</span>
          </div>
        </div>

        {/* View Details Link */}
        <div className={`flex ${isRTL ? "justify-start" : "justify-end"} px-3 py-2 mx-2`}>
          <div
            // href={`/${currentLocale}/cars/${car.id}`}
            onClick={handleViewDetails}
            className="cursor-pointer text-brand-primary text-sm flex items-center transition-all duration-300 hover:translate-x-1 hover:font-medium"
          >
            {isRTL ? (
              <>
                <span
                  className="ml-1 transition-transform duration-300"
                  style={{ transform: isHovered ? "translateX(-3px)" : "" }}
                >
                  {"<"}
                </span>
                <span>عرض التفاصيل</span>
              </>
            ) : (
              <>
                <span>View Details</span>
                <span
                  className="ml-2 transition-transform duration-300"
                  style={{ transform: isHovered ? "translateX(3px)" : "" }}
                >
                  {">"}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarCard
