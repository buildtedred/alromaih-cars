"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, X, Search, Phone } from "lucide-react"
import { useTranslation } from "react-i18next"
import Nav from "./Nav"
import LanguageToggle from "./LanguageToggle"
import SearchComponent from "./search/SearchComponent"
import { motion, useMotionValueEvent, AnimatePresence } from "framer-motion"
import { useScroll } from "motion/react"
import WishlistCounter from "@/app/[locale]/wishlist/wishlist-counter"
import logo9 from "../../../../public/images/logo 2.png"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const Header = () => {
  const { t } = useTranslation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isTabletMenuOpen, setIsTabletMenuOpen] = useState(false)
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scroll, setScroll] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isScrollingUp, setIsScrollingUp] = useState(true)
  const [isAtTop, setIsAtTop] = useState(true)
  const headerRef = useRef(null)
  const [windowWidth, setWindowWidth] = useState(0)
  const tabletMenuRef = useRef(null)
  const { scrollY } = useScroll()
  const pathname = usePathname() || ""
  const isRTL = pathname && pathname.startsWith("/ar")
  const prevScrollY = useRef(0)
  const [isHeaderFixed, setIsHeaderFixed] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(0)

  // Track window width for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      // Close tablet menu if screen size changes to desktop
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }

    // Set initial width
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Close tablet menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tabletMenuRef.current && !tabletMenuRef.current.contains(event.target) && isTabletMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMobileMenuOpen])

  // Track scroll position for progress bar only
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScroll(latest)

    // Calculate scroll progress for the progress bar
    if (typeof window !== "undefined") {
      const totalHeight = document.body.scrollHeight - window.innerHeight
      const progress = (latest / totalHeight) * 100
      setScrollProgress(progress)
    }
  })

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const toggleTabletMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const toggleSearch = () => setIsSearchVisible(!isSearchVisible)

  if (!mounted) return null

  // Determine if we're in tablet mode (768px - 1023px)
  const isTablet = windowWidth >= 768 && windowWidth < 1024
  const isMobile = windowWidth < 768

  return (
    <>
      <style jsx global>{`
        /* Basic styles without transitions */
        .header-content-container {
          width: calc(100% - 2rem);
          margin-left: auto;
          margin-right: auto;
        }
        
        @media (min-width: 640px) {
          .header-content-container {
            width: calc(100% - 4rem);
          }
        }
        
        @media (min-width: 768px) and (max-width: 1023px) {
          /* Reduced spacing specifically for iPad/tablet view */
          .header-content-container {
            width: calc(100% - 3rem); /* 1.5rem on each side */
          }
        }
        
        @media (min-width: 1024px) {
          .header-content-container {
            width: calc(100% - 10rem);
          }
        }
        
        @media (min-width: 1280px) {
          .header-content-container {
            width: calc(100% - 14rem); /* Consistent 7rem on each side */
            max-width: 1600px; /* Prevent excessive width on ultra-wide screens */
          }
        }

        /* Call button styles */
        .call-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 16px;
          height: 40px;
          border-radius: 5px;
          font-family: "IBM Plex Sans Arabic", sans-serif;
          font-weight: 500;
          font-size: 15px;
          letter-spacing: 0.5px;
          background-color: #46194f;
          color: white;
          border: 1px solid #46194f;
          transition: all 0.3s ease;
          box-shadow: 0 2px 6px rgba(70, 25, 79, 0.15);
        }

        .call-button:hover {
          background-color: transparent;
          color: #46194f;
        }

        .call-button:hover .call-icon {
          color: #46194f;
        }

        .call-icon {
          color: white;
          transition: color 0.3s ease;
        }

        /* Mobile call button */
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

        /* Fixed header styles */
        .header-always-fixed {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background-color: rgba(255, 255, 255, 0.98);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        /* Centered navigation */
        .nav-centered {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        /* Add padding to body to account for fixed header */
        body {
          padding-top: 80px; /* Adjust this value to match your header height */
        }
        
        /* Mobile header icons */
        .mobile-header-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Consistent icon sizes for mobile */
        .mobile-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        
        .mobile-icon-wrapper:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }

        /* Language toggle larger size */
        .language-toggle-wrapper {
          transform: scale(1.4);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Sidebar header with proper alignment */
        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f3f4f6;
        }
        
        /* Logo container with left padding to align with nav links */
        .sidebar-logo-container {
          padding-left: 1.25rem; /* 20px, matches the nav links padding */
        }
        
        /* Close button container */
        .sidebar-close-button {
          padding-right: 0.5rem;
        }
      `}</style>

      {/* Header container - always fixed */}
      <header ref={headerRef} className="font-noto w-full header-always-fixed h-20">
        <div
          className="relative w-full bg-white/95 backdrop-blur-md border-b border-gray-100"
          style={{
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            backgroundColor: "rgba(255, 255, 255, 0.98)",
          }}
        >
          {/* Content container with consistent 7rem padding on larger screens */}
          <div className="header-content-container">
            <div className="flex items-center justify-between h-20">
              {/* Logo - smaller on mobile */}
              <div className="flex items-center">
                <Link href={isRTL ? "/ar" : "/en"} className="block">
                  <Image
                    src={logo9 || "/placeholder.svg"}
                    height={isMobile ? 40 : 50}
                    width={isMobile ? 100 : isTablet ? 120 : 150}
                    alt={"Logo"}
                    className="object-contain"
                    priority
                  />
                </Link>
              </div>

              {/* Desktop Navigation (Large screens only) */}
              {!isTablet && !isMobile && (
                <div className="hidden lg:flex items-center justify-between flex-1 ml-8">
                  {/* Navigation Links - Centered */}
                  <div className="flex-1 flex justify-center">
                    <Nav isMobile={false} isTablet={false} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-5 rtl:space-x-reverse">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleSearch}
                      className="p-2.5 rounded-full hover:bg-gray-50 transition-colors relative group"
                      aria-label={t("search")}
                    >
                      <Search className="h-5 w-5 text-gray-700 group-hover:text-brand-primary transition-colors" />
                      <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-brand-primary group-hover:w-full transition-all duration-300 transform -translate-x-1/2"></span>
                    </motion.button>

                    <motion.div whileHover={{ scale: 1.1 }} className="relative group">
                      <WishlistCounter />
                      <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#46194F] group-hover:w-full transition-all duration-300 transform -translate-x-1/2"></span>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.1 }} className="relative group">
                      <LanguageToggle />
                      <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#46194F] group-hover:w-full transition-all duration-300 transform -translate-x-1/2"></span>
                    </motion.div>

                    {/* Desktop Call Button with clean hover effect */}
                    <motion.a
                      href="tel:920031202"
                      className="call-button"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Phone className="call-icon h-5 w-5" />
                      <span>9200 31202</span>
                    </motion.a>
                  </div>
                </div>
              )}

              {/* Tablet Navigation (iPad/Tablet only) */}
              {isTablet && (
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="mobile-icon-wrapper">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleSearch}
                      className="mobile-header-icon"
                      aria-label={t("search")}
                    >
                      <Search className="h-6 w-6 text-gray-700" />
                    </motion.button>
                  </div>

                  <div className="mobile-icon-wrapper">
                    <motion.div whileTap={{ scale: 0.9 }} className="mobile-header-icon">
                      <WishlistCounter size="large" />
                    </motion.div>
                  </div>

                  <div className="mobile-icon-wrapper">
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <div className="language-toggle-wrapper">
                        <LanguageToggle />
                      </div>
                    </motion.div>
                  </div>

                  <div className="mobile-icon-wrapper">
                    <motion.button whileTap={{ scale: 0.9 }} className="mobile-header-icon" onClick={toggleMobileMenu}>
                      {isMobileMenuOpen ? <X className="h-6 w-6 text-brand-primary" /> : <Menu className="h-6 w-6" />}
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Mobile Navigation - improved spacing and consistent icon sizes */}
              {isMobile && (
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <div className="mobile-icon-wrapper">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleSearch}
                      className="mobile-header-icon"
                      aria-label={t("search")}
                    >
                      <Search className="h-6 w-6 text-gray-700" />
                    </motion.button>
                  </div>

                  <div className="mobile-icon-wrapper">
                    <motion.div whileTap={{ scale: 0.9 }} className="mobile-header-icon">
                      <WishlistCounter size="large" />
                    </motion.div>
                  </div>

                  <div className="mobile-icon-wrapper">
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <div className="language-toggle-wrapper">
                        <LanguageToggle />
                      </div>
                    </motion.div>
                  </div>

                  <div className="mobile-icon-wrapper">
                    <button onClick={toggleMobileMenu} className="mobile-header-icon">
                      {isMobileMenuOpen ? <X className="h-6 w-6 text-brand-primary" /> : <Menu className="h-6 w-6" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressBar />

        {/* Search Component with improved animation */}
        <AnimatePresence>
          {isSearchVisible && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full bg-white shadow-lg border-t border-gray-100"
            >
              <div className="header-content-container py-4">
                <SearchComponent isVisible={isSearchVisible} onClose={toggleSearch} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu Overlay with Backdrop */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop with blur effect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Mobile Menu - Side drawer style with RTL support and improved animation */}
              <motion.div
                initial={{ opacity: 0, x: isRTL ? 300 : -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRTL ? 300 : -300 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className={`lg:hidden fixed top-0 ${
                  isRTL ? "right-0" : "left-0"
                } h-full w-[85%] max-w-[320px] bg-white shadow-xl z-50 overflow-y-auto pb-20 pt-6`}
              >
                {/* Mobile menu header with aligned logo */}
                <div className="sidebar-header">
                  <div className="sidebar-logo-container">
                    <Link href={isRTL ? "/ar" : "/en"} className="block">
                      <Image
                        src={logo9 || "/placeholder.svg"}
                        width={120}
                        height={40}
                        alt={"Logo"}
                        className="object-contain"
                      />
                    </Link>
                  </div>
                  <div className="sidebar-close-button">
                    <button
                      onClick={toggleMobileMenu}
                      className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 text-[#46194F]"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Mobile navigation with increased top padding */}
                <div className="pb-2">
                  <Nav isMobile={true} setIsMobileMenuOpen={setIsMobileMenuOpen} showCallButton={true} />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}

// Progress Bar Component
const ProgressBar = () => {
  const { scrollYProgress } = useScroll()
  return (
    <motion.div
      id="scroll-indicator"
      style={{
        scaleX: scrollYProgress,
        position: "fixed",
        top: 80, // Position it at the bottom of the header
        left: 0,
        right: 0,
        height: 2,
        originX: 0,
        zIndex: 10,
        backgroundColor: "#71308A",
      }}
    />
  )
}

export default Header
