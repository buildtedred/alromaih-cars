"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Heart } from "lucide-react"
import { useLocale } from "next-intl"
import { Link } from "@/i18n/routing"
import { usePathname } from "next/navigation"

const CarCard = ({ car, onFavoriteToggle, isFavorite: initialIsFavorite }) => {
  const pathname = usePathname()
  // Detect language from URL path
  const pathLocale = pathname.startsWith("/ar") ? "ar" : "en"
  const locale = useLocale()
  // Use either the detected path locale or the locale from useLocale
  const currentLocale = pathLocale || locale
  const isRTL = currentLocale === "ar"
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite || false)

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

  // Get text based on current locale
  const getText = (textObj) => {
    if (!textObj) return ""
    return typeof textObj === "object" ? textObj[currentLocale] || textObj.en : textObj
  }

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="rounded-[20px] border-2 border-brand-primary bg-white overflow-hidden flex flex-col w-full max-w-[340px] mx-auto relative"
    >
      {/* Status Badge - adjusted to ensure text is visible */}
      {car.status && (
        <div
          className={`absolute ${getBadgeColor(car.status)} px-2 py-1 border-2 border-brand-primary border-l-0 text-sm font-medium z-20`}
          style={{
            top: "24px",
            left: "-2px", // Adjusted to ensure text is visible
            borderTopRightRadius: "13px",
            borderBottomRightRadius: "13px",
            paddingLeft: "8px", // Added extra padding on the left
          }}
        >
          {getBadgeText(car.status)}
        </div>
      )}

      {/* Car Image Section */}
      <div className="relative pt-4 px-4 border-b border-brand-primary mx-3">
        <div className="w-full h-[180px] relative">
          <Image
            src={car.image || "/placeholder.svg?height=200&width=300"}
            alt={getText(car.name)}
            fill
            style={{ objectFit: "contain" }}
            className="w-full h-full"
          />
        </div>

        {/* Favorite Button - positioned flush against the right edge */}
        <button onClick={handleFavoriteClick} className="absolute z-10" style={{ top: "24px", right: "0" }}>
          <Heart
            className={isFavorite ? "w-6 h-6 fill-brand-primary text-brand-primary" : "w-6 h-6 text-brand-primary"}
          />
        </button>
      </div>

      {/* Car Details Section with all divider lines */}
      <div className="flex flex-col flex-grow">
        {/* Brand Logo and Name with bottom border */}
        <div className="flex flex-row-reverse justify-between items-center mb-0 pb-2 px-4 border-b border-brand-primary mx-3">
          <div className="flex items-center">
            <div className="h-8 w-24 relative">
              <Image
                src={car.brandLogo || "/placeholder.svg?height=30&width=80"}
                alt="Brand Logo"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
          <div className={isRTL ? "text-right" : "text-left"}>
            <h3 className="text-xl font-bold text-brand-primary">{getText(car.name)}</h3>
            <p className="text-xs text-gray-600">{getText(car.modelYear)}</p>
          </div>
        </div>

        {/* Price Section with top and bottom borders */}
        <div className="relative border-t-0 border-b border-brand-primary py-2 mx-3">
          {/* Vertical line in the center - MODIFIED to be shorter */}
          <div className="absolute top-2 bottom-2 left-1/2 transform -translate-x-1/2 w-px bg-brand-primary"></div>

          {isRTL ? (
            <div className="flex">
              <div className="w-1/2 px-4">
                <p className="text-xs text-brand-primary mb-1">سعر الكاش</p>
                <div className="font-bold text-lg text-brand-primary flex items-center">
                  <span>{car.cashPrice.toLocaleString()}</span>
                  <span className="mr-1">
                    <Image src={car.icons.currency || "/icons/currency.svg"} alt="Currency" width={14} height={14} />
                  </span>
                </div>
              </div>
              <div className="w-1/2 px-4">
                <p className="text-xs text-brand-primary mb-1">يبدأ القسط من</p>
                <div className="font-bold text-lg text-brand-primary flex items-center">
                  <span>{car.installmentPrice}</span>
                  <span className="mr-1">
                    <Image src={car.icons.currency || "/icons/currency.svg"} alt="Currency" width={14} height={14} />
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex">
              <div className="w-1/2 px-4">
                <p className="text-xs text-brand-primary mb-1">Cash Price</p>
                <div className="font-bold text-lg text-brand-primary flex items-center">
                  <span className="mr-1">
                    <Image src={car.icons.currency || "/icons/currency.svg"} alt="Currency" width={14} height={14} />
                  </span>
                  <span>{car.cashPrice.toLocaleString()}</span>
                </div>
              </div>
              <div className="w-1/2 px-4">
                <p className="text-xs text-brand-primary mb-1">Installments from</p>
                <div className="font-bold text-lg text-brand-primary flex items-center">
                  <span className="mr-1">
                    <Image src={car.icons.currency || "/icons/currency.svg"} alt="Currency" width={14} height={14} />
                  </span>
                  <span>{car.installmentPrice}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Specifications Icons with bottom border */}
        <div className="flex flex-row-reverse justify-between py-2 px-4 border-b border-brand-primary mx-3">
          <div className="flex flex-col items-center">
            <div className="w-5 h-5 relative">
              <Image
                src={car.icons.fuel || "/icons/Fuel.svg"}
                alt="Fuel"
                width={20}
                height={20}
                className="text-brand-primary"
              />
            </div>
            <span className="text-[10px] mt-1 text-brand-primary">{getText(car.specs.fuelType)}</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-5 h-5 relative">
              <Image
                src={car.icons.seats || "/icons/Horse.svg"}
                alt="Seats"
                width={20}
                height={20}
                className="text-brand-primary"
              />
            </div>
            <span className="text-[10px] mt-1 text-brand-primary">
              {car.specs.seats} {isRTL ? "حصان" : "HP"}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-5 h-5 relative">
              <Image
                src={car.icons.transmission || "/icons/Transmission.svg"}
                alt="Transmission"
                width={20}
                height={20}
                className="text-brand-primary"
              />
            </div>
            <span className="text-[10px] mt-1 text-brand-primary">{getText(car.specs.transmission)}</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-5 h-5 relative">
              <Image
                src={car.icons.year || "/icons/Calendar.svg"}
                alt="Year"
                width={20}
                height={20}
                className="text-brand-primary"
              />
            </div>
            <span className="text-[10px] mt-1 text-brand-primary">{car.specs.year}</span>
          </div>
        </div>

        {/* View Details Link */}
        <div className={`flex ${isRTL ? "justify-start" : "justify-end"} px-4 py-2`}>
          <Link
            href={`/${currentLocale}/car-details/${car.id}`}
            className="text-brand-primary text-xs flex items-center"
          >
            {isRTL ? (
              <>
                <span className="ml-1">{"<"}</span>
                <span>عرض التفاصيل</span>
              </>
            ) : (
              <>
                <span>View Details</span>
                <span className="ml-3">{">"}</span>
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CarCard

