"use client"

import navigationRoutes from "@/All-routes/All-routes"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

const Nav = ({ isMobile }) => {
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)
  const { t } = useTranslation()
  // Get locale from URL params
  const params = useParams()
  // Get current locale from the pathname (assuming the locale is the first part of the path)
  const locale = pathname.startsWith("/ar") ? "ar" : "en";
  // Create a translation function that works with your structure
  const getTranslation = (key) => {
    // Define hardcoded fallbacks for when translations fail
    const fallbacks = {
      home: "Home",
      allCars: "All Cars",
      brands: "Brands",
      compare: "Compare Cars",
      about: "About Us",
      contact: "Contact Us",
    }

    // Try to get the translation from the i18n system
    try {
      // First check if we can get the translation directly
      const translation = t(`nav.${key}`)

      // If we got a valid translation (not the key itself), return it
      if (translation && !translation.includes("nav.")) {
        return translation
      }

      // Otherwise use our fallbacks based on the current locale
      const currentLocale = pathname.startsWith("/ar") ? "ar" : "en"
      if (currentLocale === "ar") {
        const arFallbacks = {
          home: "الرئيسية",
          allCars: "السيارات",
          brands: "العلامات التجارية",
          compare: "مقارنة السيارات",
          about: "من نحن",
          contact: "اتصل بنا",
        }
        return arFallbacks[key] || fallbacks[key] || key
      }

      return fallbacks[key] || key
    } catch (error) {
      console.warn(`Translation error for key ${key}:`, error)
      return fallbacks[key] || key
    }
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleLinkClick = () => {
 
      isMobile(false)
 
  }

  // Create navItems only when client-side
  const navItems = isClient ? navigationRoutes(getTranslation) : []

  if (!isClient) {
    return null // Don't render anything on the server
  }

  return (
    <nav className={`bg-white border-t ${isMobile ? "block md:hidden" : "hidden md:block"}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-center md:h-12">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-8 rtl:space-x-reverse">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <div key={item.key}  onClick={handleLinkClick}>
                <Link
                 
                  href={`/${locale}/${item.href}`}
                  
                  className={`flex items-center text-gray-700 hover:text-brand-primary font-medium transition-colors py-3 md:py-0 border-b md:border-b-0 border-gray-100 last:border-b-0 ${
                    isActive ? "text-brand-primary" : ""
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {/* Make sure item.label is a string */}
                  {typeof item.label === "string" ? item.label : ""}
                </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Nav

