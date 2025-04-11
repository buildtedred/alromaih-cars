"use client"
import { useState, useEffect, useCallback } from "react"
import { Phone, Menu, X, Search } from "lucide-react"
import { useTranslation } from "react-i18next"
import Nav from "./Nav"
import { Skeleton } from "@/components/ui/skeleton"
import LanguageToggle from "./LanguageToggle"
import SearchComponent from "./search/SearchComponent"
import { useOdoo } from "@/contexts/OdooContext"
import { motion, useMotionValueEvent, AnimatePresence } from "framer-motion"
import { useScroll } from "motion/react"

const Header = () => {
  const { t } = useTranslation()
  const { logo, loading } = useOdoo()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [mocData, setMocData] = useState([])
  const [loadingMocData, setLoadingMocData] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scroll, setScroll] = useState(0)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScroll(latest)
    console.log("Page scroll: ", latest)
  })

  const fetchSliderData = useCallback(() => {
    setLoadingMocData(true)
    fetch("https://67c7bf7cc19eb8753e7a9248.mockapi.io/api/logo")
      .then((response) => response.json())
      .then((data) => {
        setMocData(data)
        setLoadingMocData(false)
      })
      .catch((error) => {
        console.error("Error fetching brands:", error)
        setLoadingMocData(false)
      })
  }, [])

  useEffect(() => {
    fetchSliderData()
  }, [fetchSliderData])

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const toggleSearch = () => setIsSearchVisible(!isSearchVisible)

  if (!mounted) return null

  // Header content without mobile menu
  const headerContent = (
    <>
      <div className="bg-white lg:px-[7rem]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {loading ? (
                <span>
                  <Skeleton className="w-[100px] h-[40px] rounded-full" />
                </span>
              ) : (
                <img src={`${mocData[0]?.avatar}`} alt={"Logo"} className="h-8 md:h-8 w-auto" />
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
              <button
                onClick={toggleSearch}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label={t("search")}
              >
                <Search className="h-5 w-5 text-gray-700" />
              </button>
              <LanguageToggle />
              <button className="flex items-center space-x-2 rtl:space-x-reverse bg-brand-primary text-white px-4 py-2 rounded-[5px] hover:bg-brand-dark hover:text-brand-primary transition-colors">
                <span className="font-semibold flex items-center gap-2" dir="ltr">
                  <Phone className="h-5 w-5" />
                  <span>9200 31202</span>
                </span>
              </button>
            </div>

            {/* Mobile Navigation */}
            <div className="flex md:hidden items-center space-x-2 rtl:space-x-reverse">
              <button
                onClick={toggleSearch}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label={t("search")}
              >
                <Search className="h-5 w-5 text-gray-700" />
              </button>
              <LanguageToggle />
              <button className="p-2 rounded-[5px] hover:bg-gray-100" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Component */}
      {isSearchVisible && <SearchComponent isVisible={isSearchVisible} onClose={toggleSearch} />}

      {/* Navigation for desktop */}
      <Nav isMobile={false} setIsMobileMenuOpen={setIsMobileMenuOpen} />
    </>
  )

  return (
    <>
      {/* Static header (visible when not scrolled) */}
      {scroll <= 100 && (
        <div className="w-full font-noto shadow-sm bg-white z-40 relative">
          {headerContent}

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="md:hidden absolute top-full left-0 right-0 bg-white border-t shadow-lg z-50"
              >
                {/* Navigation for mobile */}
                <Nav isMobile={true} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                <div className="p-4">
                  <button className="w-full flex items-center justify-center space-x-3 rtl:space-x-reverse px-4 py-2 bg-brand-primary text-white rounded-[5px]">
                    <Phone className="h-5 w-5" />
                    <span className="text-center" dir="ltr">
                      9200 31202
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Animated fixed header (appears when scrolled) */}
      <AnimatePresence>
        {scroll > 100 && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 70,
              damping: 15,
              duration: 0.6,
            }}
            className="w-full font-noto shadow-md bg-white z-50 fixed top-0"
          >
            {headerContent}

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="md:hidden absolute top-full left-0 right-0 bg-white border-t shadow-lg z-50"
                >
                  {/* Navigation for mobile */}
                  <Nav isMobile={true} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                  <div className="p-4">
                    <button className="w-full flex items-center justify-center space-x-3 rtl:space-x-reverse px-4 py-2 bg-brand-primary text-white rounded-[5px]">
                      <Phone className="h-5 w-5" />
                      <span className="text-center" dir="ltr">
                        9200 31202
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header
