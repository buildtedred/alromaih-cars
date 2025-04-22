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
import WishlistCounter from "@/app/[locale]/wishlist/wishlist-counter"
import logo9 from "../../../../public/images/logo 2.png"
import Image from "next/image"

const Header = () => {
  const { t } = useTranslation()
  const { logo, loading } = useOdoo()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [mocData, setMocData] = useState([])
  const [loadingMocData, setLoadingMocData] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [scroll, setScroll] = useState(0)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScroll(latest)
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

  return (
    <>
      {/* Unified Header - changes position based on scroll */}
      <div
        className={`font-noto shadow-sm bg-white z-40 `}
      >
        <div className="bg-white lg:px-[7rem]">
          <div className="container mx-auto">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {loading ? (
                  <span>
                    <Skeleton className="w-[100px] h-[40px] rounded-full" />
                  </span>
                ) : (
                  <Image src={logo9 || "/placeholder.svg"} height={170} width={170} alt={"Logo"} />
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
                <WishlistCounter />
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
                <WishlistCounter />
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
    </>
  )
}

export default Header
