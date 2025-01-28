"use client"

import { useState, useEffect } from "react"
import { Search, Heart, Phone, Languages, Menu, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import Nav from "./Nav"
import SearchModal from "./search/SearchModal"
import { useLogoContext } from "@/contexts/LogoContext"
import { Skeleton } from "@/components/ui/skeleton"

const Header = () => {
  const { t, i18n } = useTranslation()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState({})
  const [mounted, setMounted] = useState(false)

  const { logos, loading, error } = useLogoContext()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleSearch = () => setIsSearchOpen(!isSearchOpen)
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  const changeLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar"
    i18n.changeLanguage(newLang)
    document.documentElement.lang = newLang
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr"
  }

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
                <Skeleton className="w-[100px] h-[40px] rounded-full" />
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

            {/* Mobile Menu Button and Language Switcher */}
            <div className="flex items-center md:hidden">
              <button
                onClick={changeLanguage}
                className="mr-4 flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-colors"
              >
                <Languages className="h-4 w-4" />
                <span className="text-sm font-medium">{t("menu.language")}</span>
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
              <button
                onClick={toggleSearch}
                className="flex items-center space-x-2 rtl:space-x-reverse text-gray-700 hover:text-brand-primary"
              >
                <Search className="h-5 w-5" />
                <span>{t("search.label")}</span>
              </button>

              <button className="flex items-center space-x-2 rtl:space-x-reverse text-gray-700 hover:text-brand-primary">
                <Heart className="h-5 w-5" />
                <span>{t("menu.favorites")}</span>
              </button>

              <button
                onClick={changeLanguage}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-colors"
              >
                <Languages className="h-4 w-4" />
                <span className="text-sm font-medium">{t("menu.language")}</span>
              </button>

              <button className="flex items-center space-x-2 rtl:space-x-reverse bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors">
                <span className="font-semibold flex items-center gap-2" dir="ltr">
                  <Phone className="h-5 w-5" />
                  <span>9200 31202</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"} bg-white border-t`}>
        <Nav isMobile={true} />
        <div className="px-4 py-2 space-y-4">
          {/* Search and Favorites */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <button className="flex-1 flex items-center justify-center space-x-3 rtl:space-x-reverse px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Heart className="h-5 w-5" />
              <span>{t("menu.favorites")}</span>
            </button>
            <button
              onClick={toggleSearch}
              className="flex-1 flex items-center justify-center space-x-3 rtl:space-x-reverse px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Search className="h-5 w-5" />
              <span>{t("search.label")}</span>
            </button>
          </div>

          {/* Call Button */}
          <button className="flex items-center justify-center w-full space-x-3 rtl:space-x-reverse px-4 py-2 bg-brand-primary text-white rounded-lg">
            <Phone className="h-5 w-5" />
            <span dir="ltr">9200 31202</span>
          </button>
        </div>
      </div>

      {/* Desktop Navigation */}
      <Nav isMobile={false} />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={toggleSearch}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFilters={selectedFilters}
        onClearFilters={() => setSelectedFilters({})}
        onFilterChange={(section, filter, value) => {
          setSelectedFilters((prev) => ({
            ...prev,
            [section]: {
              ...prev[section],
              [filter]: value,
            },
          }))
        }}
      />
    </header>
  )
}

export default Header

