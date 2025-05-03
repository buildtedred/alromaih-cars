"use client"

import navigationRoutes from "@/All-routes/All-routes"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"

const Nav = ({ isMobile, setIsMobileMenuOpen }) => {
  const pathname = usePathname() || ""
  const [isClient, setIsClient] = useState(false)
  const { t } = useTranslation()
  // Get locale from URL params
  const params = useParams()
  // Get current locale from the pathname (assuming the locale is the first part of the path)
  const locale = pathname && pathname?.startsWith("/ar") ? "ar" : "en"
  const isRTL = locale === "ar"

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
      const currentLocale = pathname && pathname?.startsWith("/ar") ? "ar" : "en"
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
    // Close the mobile menu when a link is clicked
    if (isMobile && setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }
  }

  // Create navItems only when client-side
  const navItems = isClient ? navigationRoutes(getTranslation) : []

  if (!isClient) {
    return null // Don't render anything on the server
  }

  // Animation variants for the mobile drawer
  const drawerVariants = {
    hidden: {
      opacity: 0,
      height: 0,
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        delay: 0.1, // Add a slight delay before opening
        staggerChildren: 0.1, // Stagger the animation of children
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  }

  // Animation variants for the nav
  const navVariants = {
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        staggerChildren: 0.1,
      },
    },
  }

  // Animation variants for each nav item
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <>
      <style jsx global>{`
        /* Nav item hover effect */
        .nav-item-hover {
          transition: transform 0.3s ease, color 0.3s ease;
        }
        .nav-item-hover:hover {
          transform: translateY(-2px);
          color: #46194F;
        }
        
        /* Underline animation */
        .nav-underline {
          position: relative;
        }
        .nav-underline::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #46194F;
          transition: width 0.3s ease;
        }
        .nav-underline:hover::after {
          width: 100%;
        }
        
        /* Active nav item */
        .nav-active::after {
          width: 100%;
        }
      `}</style>

      <AnimatePresence>
        <motion.nav
          className={`bg-white ${isMobile ? "block md:hidden" : "hidden md:block"}`}
          variants={isMobile ? drawerVariants : navVariants}
          initial={isMobile ? "hidden" : "visible"}
          animate="visible"
          exit={isMobile ? "exit" : undefined}
          style={{ transition: "all 0.3s ease-in-out" }}
        >
          <div className="container mx-auto">
            <div
              className={`
              ${
                isMobile
                  ? "flex flex-col space-y-0.5 items-start"
                  : "flex items-center justify-center h-14 space-x-10 rtl:space-x-reverse"
              }
            `}
            >
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <motion.div
                    key={item.key}
                    variants={isMobile ? itemVariants : {}}
                    className={`relative ${isMobile ? "w-full" : ""}`}
                  >
                    <motion.div
                      whileHover={!isMobile ? { y: -2, scale: 1.05 } : {}}
                      className="relative"
                      initial={false} // Prevent initial animation
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Link
                        href={`/${locale}${item.href}`}
                        onClick={handleLinkClick}
                        className={`
                          block font-medium relative nav-underline ${isActive ? "nav-active" : ""}
                          ${
                            isMobile
                              ? "px-5 py-3.5 hover:bg-gray-50/80 text-gray-800 transition-colors w-full flex items-center justify-between"
                              : "px-3 py-1 hover:text-brand-primary group nav-item-hover"
                          }
                          ${isActive ? "text-brand-primary" : ""}
                          
                          2345678
                          1234567
                        `}
                        aria-current={isActive ? "page" : undefined}
                        style={{ transition: "all 0.3s ease" }}
                      >
                        <span className="flex items-center">
                          {Icon && <Icon className={`w-5 h-5 ${isMobile ? "mr-3" : "mr-2"}`} />}
                          {/* Make sure item.label is a string */}
                          <span className={`${isActive ? "font-semibold" : ""}`}>
                            {typeof item.label === "string" ? item.label : ""}
                          </span>
                        </span>

                        {/* Mobile arrow indicator */}
                        {isMobile && (
                          <span className={`text-gray-400 ${isActive ? "text-brand-primary" : ""}`}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={`${isRTL ? "rotate-180" : ""}`}
                            >
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          </span>
                        )}

                        {/* Active indicator for mobile */}
                        {isActive && isMobile && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary rounded-r-md"></div>
                        )}

                        {/* Underline effect for desktop - handled by CSS classes */}
                      </Link>
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.nav>
      </AnimatePresence>
    </>
  )
}

export default Nav
