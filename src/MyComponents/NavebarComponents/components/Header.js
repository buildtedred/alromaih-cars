"use client"
import { useState, useEffect, useCallback } from "react"
import { Phone, Menu, X, Search } from "lucide-react"
import { useTranslation } from "react-i18next"
import Nav from "./Nav"
import { useLogoContext } from "@/contexts/LogoContext"
import { Skeleton } from "@/components/ui/skeleton"
import LanguageToggle from "@/MyComponents/LanguageToggle"
import SearchComponent from './search/SearchComponent';
import { useOdoo } from "@/contexts/OdooContext"

const Header = () => {
  const { t } = useTranslation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { logo, loading } = useOdoo();

  //////////////////////////////////////////// mode data for testing /////////////////////////////

  const [mocData, setMocData] = useState([]);
  const [loadingMocData, setLoadingMocData] = useState(true);

  // console.log("logo api moc api:", mocData);

  const fetchSliderData = useCallback(async () => {
    setLoadingMocData(true);
    try {
      const response = await fetch("https://67c7bf7cc19eb8753e7a9248.mockapi.io/api/logo");
      const data = await response.json();
      setMocData(data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoadingMocData(false);
    }
  }, []);

  useEffect(() => {
    fetchSliderData();
  }, [fetchSliderData]);

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const toggleSearch = () => setIsSearchVisible(!isSearchVisible)

  if (!mounted) {
    return null
  }

  //////////////////////////////////////////// mode data for testing end /////////////////////////////

  return (
    <header className="font-noto w-full shadow-sm relative">
      <div className="bg-white lg:px-[7rem]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {loading ?
                <span>
                  <Skeleton className="w-[100px] h-[40px] rounded-full" />
                </span>
                :
                <img
                  src={`${mocData[0]?.avatar}`}
                  alt={"Logo"}
                  className="h-8 md:h-12 w-auto"
                />
              }
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
              <button className="flex items-center space-x-2 rtl:space-x-reverse bg-brand-primary text-white px-4 py-2 rounded-[30px] hover:bg-brand-dark hover:text-brand-primary transition-colors">
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
              <button className="p-2 rounded-lg hover:bg-gray-100" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Component */}
      {isSearchVisible && <SearchComponent isVisible={isSearchVisible} onClose={toggleSearch} />}

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
