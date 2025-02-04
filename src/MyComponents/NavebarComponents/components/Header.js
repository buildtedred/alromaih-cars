"use client"

import { useState, useEffect } from "react"
import { Phone, Menu, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import Nav from "./Nav"
import { useLogoContext } from "@/contexts/LogoContext"
import { Skeleton } from "@/components/ui/skeleton"
import LanguageToggle from "@/MyComponents/LanguageToggle"

const Header = () => {
  const { t } = useTranslation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { logos, loading, error } = useLogoContext()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  if (!mounted) {
    return null
  }

  return (
    <header className="font-noto w-full shadow-sm relative">
      <div className="bg-white lg:px-[8.5rem]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {loading ? (
                <span>
                  <Skeleton className="w-[100px] h-[40px] rounded-full"/>
                </span>
              ) : error ? (
                <span>Error: {error}</span>
              ) : logos.length > 0 ? (
                <img
                  src={`http://xn--mgbml9eg4a.com${logos[0].image_url}`}
                  alt={logos[0]?.name.en || "Default Logo"}
                  className="h-8 md:h-12 w-auto"
                />
              ) : (
                <span>No logo available</span>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
              <LanguageToggle />
              <button className="flex items-center space-x-2 rtl:space-x-reverse bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors">
                <span className="font-semibold flex items-center gap-2" dir="ltr">
                  <Phone className="h-5 w-5" />
                  <span>9200 31202</span>
                </span>
              </button>
            </div>

            {/* Mobile Navigation */}
            <div className="flex md:hidden items-center space-x-2 rtl:space-x-reverse">
              <LanguageToggle />
              <button className="p-2 rounded-lg hover:bg-gray-100" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation for desktop */}
      <Nav isMobile={false} />

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"} bg-white border-t`}>
        {/* Navigation for mobile */}
        <Nav isMobile={true} />
        <div className="p-4">
          <button className="w-full flex items-center justify-center space-x-3 rtl:space-x-reverse px-4 py-2 bg-brand-primary text-white rounded-lg">
            <Phone className="h-5 w-5" />
            <span className="text-center" dir="ltr">
              9200 31202
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
