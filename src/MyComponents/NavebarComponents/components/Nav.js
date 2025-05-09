"use client"

import navigationRoutes from "@/All-routes/All-routes"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import { Phone } from "lucide-react"

const Nav = ({ isMobile, isTablet, isDropdown, setIsMobileMenuOpen, showCallButton }) => {
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
    if ((isMobile || isTablet) && setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }
  }

  // Add this function to check if a link is active
  const isLinkActive = (itemHref) => {
    // Get the full path with locale
    const fullPath = `/${locale}${itemHref}`

    // Exact match (for home page and exact routes)
    if (pathname === fullPath) {
      return true
    }

    // For nested routes, check if the current path starts with the item's href
    // But only if the item href is not the home page
    if (itemHref !== "/" && pathname.startsWith(fullPath)) {
      // Make sure it's a proper section (e.g., /cars should match /cars/detail but not /carsomething)
      const remainingPath = pathname.slice(fullPath.length)
      if (remainingPath === "" || remainingPath.startsWith("/")) {
        return true
      }
    }

    return false
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
        ease: "easeOut",
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

  // Animation variants for the nav container
  const navContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // Stagger the children animations
        delayChildren: 0.1, // Delay before starting children animations
      },
    },
  }

  // Determine the appropriate class for the nav container based on the view mode
  const getNavContainerClass = () => {
    if (isMobile) return "block lg:hidden"
    return "flex-1"
  }

  // Find the contact page item
  const contactItem = navItems.find((item) => item.key === "contact")
  const hasContactItem = !!contactItem

  return (
    <>
      <style jsx global>{`
        /* Nav item hover effect */
        .nav-item-hover {
          transition: transform 0.3s ease, color 0.3s ease;
        }
        .nav-item-hover:hover {
          transform: translateY(-2px);
          color: var(--tw-color-brand-primary, #46194F);
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
          background-color: var(--tw-color-brand-primary, #46194F);
          transition: width 0.3s ease;
        }
        .nav-underline:hover::after {
          width: 100%;
        }
        
        /* Active nav item */
        .nav-active {
          position: relative;
          color: var(--tw-color-brand-primary, #46194F) !important;
          font-weight: 500;
        }

        .nav-active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: var(--tw-color-brand-primary, #46194F);
          transition: width 0.3s ease;
        }

        /* Mobile active state */
        .mobile-nav-active {
          background-color: rgba(70, 25, 79, 0.08);
          position: relative;
        }

        .mobile-nav-active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background-color: var(--tw-color-brand-primary, #46194F);
          border-radius: 0 2px 2px 0;
        }

        /* Dropdown menu item styles */
        .dropdown-item {
          transition: all 0.2s ease;
          border-left: 3px solid transparent;
        }
        
        .dropdown-item:hover {
          background-color: rgba(70, 25, 79, 0.05);
          border-left-color: var(--tw-color-brand-primary, #46194F);
        }
        
        .dropdown-item.active {
          background-color: rgba(70, 25, 79, 0.1);
          border-left-color: var(--tw-color-brand-primary, #46194F);
          font-weight: 500;
        }

        /* Call button styles */
        .call-button-mobile {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          height: 50px;
          border-radius: 5px;
          font-family: "IBM Plex Sans Arabic", sans-serif;
          font-weight: 500;
          font-size: 16px;
          letter-spacing: 0.5px;
          background-color: #46194f;
          color: white;
          border: 1px solid #46194f;
          transition: all 0.3s ease;
        }

        .call-button-mobile:hover {
          background-color: transparent;
          color: #46194f;
        }

        .call-button-mobile:hover .call-icon {
          color: #46194f;
        }

        .call-icon {
          color: white;
          transition: color 0.3s ease;
        }
      `}</style>

      <AnimatePresence>
        <motion.nav
          className={getNavContainerClass()}
          variants={isMobile || (isTablet && isDropdown) ? drawerVariants : navVariants}
          initial={isMobile || (isTablet && isDropdown) ? "hidden" : "visible"}
          animate="visible"
          exit={isMobile || (isTablet && isDropdown) ? "exit" : undefined}
          style={{ transition: "all 0.3s ease-in-out" }}
        >
          <motion.div
            className={isMobile || (isTablet && isDropdown) ? "w-full" : ""}
            variants={isMobile ? navContainerVariants : {}}
          >
            <div
              className={`
              ${
                isMobile
                  ? "flex flex-col space-y-0.5 items-start"
                  : isTablet && isDropdown
                    ? "flex flex-col w-full"
                    : "flex items-center justify-center space-x-6 rtl:space-x-reverse"
              }
            `}
            >
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = isLinkActive(item.href)
                const isContact = item.key === "contact"

                // Determine the appropriate class for the nav item based on the view mode
                const getLinkClass = () => {
                  if (isMobile) {
                    return "px-5 py-3.5 hover:bg-gray-50/80 text-gray-800 transition-colors w-full flex items-center justify-between"
                  }

                  return "px-3 py-1 hover:text-brand-primary group nav-item-hover text-sm"
                }

                return (
                  <motion.div
                    key={item.key}
                    variants={isMobile || (isTablet && isDropdown) ? itemVariants : {}}
                    className={`relative ${isMobile || (isTablet && isDropdown) ? "w-full" : ""}`}
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
                          block font-medium relative 
                          ${!isMobile ? `nav-underline ${isActive ? "nav-active" : ""}` : ""}
                          ${isMobile ? `${isActive ? "mobile-nav-active" : ""}` : ""}
                          ${getLinkClass()}
                          ${isActive ? "text-brand-primary" : ""}
                        `}
                        aria-current={isActive ? "page" : undefined}
                        style={{ transition: "all 0.3s ease" }}
                      >
                        <span className="flex items-center">
                          {Icon && (isMobile || (isTablet && isDropdown)) && (
                            <Icon className={`w-5 h-5 ${isMobile || isDropdown ? "mr-3" : "mr-2"}`} />
                          )}
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
                      </Link>
                    </motion.div>

                    {/* Add call button after contact item */}
                    {isContact && isMobile && showCallButton && (
                      <div className="w-full px-5 py-4">
                        <a href="tel:920031202" className="call-button-mobile">
                          <Phone className="call-icon h-5 w-5" />
                          <span>9200 31202</span>
                        </a>
                      </div>
                    )}
                  </motion.div>
                )
              })}

              {/* If there's no contact item, add the call button at the end */}
              {isMobile && showCallButton && !hasContactItem && (
                <div className="w-full px-5 py-4">
                  <a href="tel:920031202" className="call-button-mobile">
                    <Phone className="call-icon h-5 w-5" />
                    <span>9200 31202</span>
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </motion.nav>
      </AnimatePresence>
    </>
  )
}

export default Nav
