
"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, X, Search, Phone } from 'lucide-react'
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
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scroll, setScroll] = useState(0)
  const [isScrollingUp, setIsScrollingUp] = useState(true)
  const [isAtTop, setIsAtTop] = useState(true)
  const prevScrollY = useRef(0)
  const { scrollY } = useScroll()
  const pathname = usePathname() || ""
  const isRTL = pathname && pathname.startsWith("/ar")
  const headerRef = useRef(null)

  // Track scroll position and direction with smooth animation
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = prevScrollY.current
    prevScrollY.current = latest
    setScroll(latest)
    setIsScrollingUp(latest < previous)
    setIsAtTop(latest < 10)
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
  const toggleSearch = () => setIsSearchVisible(!isSearchVisible)

  if (!mounted) return null

  // Header animation variants - always visible
  const headerVariants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" },
    }
  }

  return (
    <>
      <style jsx global>{`
        /* Smooth header transitions */
        .header-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Smooth shadow transition */
        .shadow-transition {
          transition: box-shadow 0.5s ease-in-out;
        }

        /* Smooth background transition */
        .bg-transition {
          transition: background-color 0.5s ease-in-out;
        }

        /* Smooth scale transition for nav items */
        .nav-item-transition {
          transition: transform 0.2s ease-out;
        }
        .nav-item-transition:hover {
          transform: translateY(-2px) scale(1.02);
        }

        /* Smooth underline animation */
        .underline-animation {
          position: relative;
        }
        .underline-animation::after {
          content: "";
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -4px;
          left: 0;
          background-color: #46194f;
          transition: width 0.3s ease;
        }
        .underline-animation:hover::after {
          width: 100%;
        }
      `}</style>

      {/* Header container with sticky behavior - always visible */}
      <motion.header
        ref={headerRef}
        className="font-noto sticky top-0 z-40 w-full"
        initial="visible"
        animate="visible"
        variants={headerVariants}
      >
        <div
          className="relative bg-white/95 backdrop-blur-md border-b border-gray-100 header-transition shadow-transition bg-transition"
          style={{
            boxShadow: scroll > 50 ? "0 4px 20px rgba(0, 0, 0, 0.08)" : "none",
            backgroundColor: scroll > 50 ? "rgba(255, 255, 255, 0.98)" : "rgba(255, 255, 255, 1)",
            transition: "all 0.3s ease-in-out",
          }}
        >
          {/* Premium gradient accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#46194F] via-[#4a1d6e] to-[#46194F] opacity-90"></div>

          <div className="container mx-auto lg:px-[6rem]">
            <div className="flex items-center justify-between h-20">
              {/* Logo - removed hover effects */}
              <div className="flex items-center">
                <Link href={isRTL ? "/ar" : "/en"} className="block">
                  <Image
                    src={logo9 || "/placeholder.svg"}
                    height={50}
                    width={150}
                    alt={"Logo"}
                    className="object-contain"
                    priority
                  />
                </Link>
              </div>

              {/* Desktop Navigation - Hidden on mobile */}
              <div className="hidden md:flex items-center space-x-7 rtl:space-x-reverse header-transition">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleSearch}
                  className="p-2.5 rounded-full hover:bg-gray-50 transition-colors relative group"
                  aria-label={t("search")}
                >
                  <Search className="h-5 w-5 text-gray-700 group-hover:text-[#46194F] transition-colors" />
                  <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#46194F] group-hover:w-full transition-all duration-300 transform -translate-x-1/2"></span>
                </motion.button>

                <motion.div whileHover={{ scale: 1.1 }} className="relative group">
                  <WishlistCounter />
                  <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#46194F] group-hover:w-full transition-all duration-300 transform -translate-x-1/2"></span>
                </motion.div>

                <motion.div whileHover={{ scale: 1.1 }} className="relative group">
                  <LanguageToggle />
                  <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#46194F] group-hover:w-full transition-all duration-300 transform -translate-x-1/2"></span>
                </motion.div>

                {/* Premium Call Button - Desktop with CSS mask animation */}
                <div className="button-container-mask">
                  <span className="mask-text">9200 31202</span>
                  <a href="tel:920031202" className="mask-button">
                    <div className="flex items-center justify-center gap-2">
                      <Phone className="h-5 w-5" />
                      <span>9200 31202</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="flex md:hidden items-center space-x-3 rtl:space-x-reverse">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleSearch}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label={t("search")}
                >
                  <Search className="h-5 w-5 text-gray-700" />
                </motion.button>

                <motion.div whileTap={{ scale: 0.9 }}>
                  <WishlistCounter />
                </motion.div>

                <motion.div whileTap={{ scale: 0.9 }}>
                  <LanguageToggle />
                </motion.div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-[5px] hover:bg-gray-100 transition-all"
                  onClick={toggleMobileMenu}
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6 text-[#46194F]" /> : <Menu className="h-6 w-6" />}
                </motion.button>
              </div>
            </div>
          </div>
        </div>

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
              <div className="container mx-auto lg:px-[7rem] py-4">
                <SearchComponent isVisible={isSearchVisible} onClose={toggleSearch} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation for desktop with enhanced styling */}
        <div
          className="hidden md:block bg-white border-b border-gray-100 shadow-sm transition-all duration-500"
          style={{
            boxShadow: scroll > 50 ? "0 4px 10px rgba(0, 0, 0, 0.05)" : "none",
          }}
        >
          <div className="container mx-auto lg:px-[6rem]">
            <Nav isMobile={false} setIsMobileMenuOpen={setIsMobileMenuOpen} />
          </div>
        </div>

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
                className={`md:hidden fixed top-0 ${
                  isRTL ? "right-0" : "left-0"
                } h-full w-[85%] max-w-[320px] bg-white shadow-xl z-50 overflow-y-auto`}
              >
                {/* Mobile menu header with left-aligned logo */}
                <div className="flex justify-between items-center py-2 px-1 border-b border-gray-100">
                  <Link href={isRTL ? "/ar" : "/en"} className="block">
                    <Image
                      src={logo9 || "/placeholder.svg"}
                      width={120}
                      height={40}
                      alt={"Logo"}
                      className="object-contain"
                    />
                  </Link>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleMobileMenu}
                    className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors text-[#46194F]"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>

                {/* Mobile navigation */}
                <div className="py-2">
                  <Nav isMobile={true} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                </div>

                {/* Premium Call Button - Mobile with CSS mask animation */}
                <div className="px-5 py-4 border-t mt-2">
                  <div className="button-container-mask-mobile">
                    <span className="mask-text-mobile">9200 31202</span>
                    <a href="tel:920031202" className="mask-button-mobile">
                      <div className="flex items-center justify-center gap-2">
                        <Phone className="h-5 w-5" />
                        <span>9200 31202</span>
                      </div>
                    </a>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}

export default Header