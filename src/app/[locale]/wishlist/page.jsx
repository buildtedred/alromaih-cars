"use client"

import { useState, useEffect } from "react"
import { Trash2, ShoppingCart, ArrowLeft, Heart, ChevronRight, Search, X, Filter, Eye } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import { useDetailContext } from "@/contexts/detailProvider"

export default function WishlistPage() {
  const { setcar_Details, loading } = useDetailContext()
  const [wishlistItems, setWishlistItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [sortBy, setSortBy] = useState("default")
  const pathname = usePathname()
  const currentLocale = pathname.startsWith("/ar") ? "ar" : "en"
  const isRTL = currentLocale === "ar"
  const router = useRouter()

  // Helper function to extract text from multilingual objects
  const getText = (textObj) => {
    if (!textObj) return ""
    return typeof textObj === "object" ? textObj[currentLocale] || textObj.en || "" : String(textObj)
  }

  useEffect(() => {
    // Load wishlist from localStorage
    const loadWishlist = () => {
      try {
        const savedWishlist = localStorage.getItem("carWishlist")
        if (savedWishlist) {
          const items = JSON.parse(savedWishlist)
          setWishlistItems(items)
          setFilteredItems(items)
        }
      } catch (error) {
        console.error("Error loading wishlist:", error)
      } finally {
        // Simulate loading for better skeleton demonstration
        setTimeout(() => {
          setIsLoading(false)
        }, 300)
      }
    }

    loadWishlist()
  }, [])

  // Filter and sort items when search term or sort option changes
  useEffect(() => {
    let results = [...wishlistItems]

    // Apply search filter
    if (searchTerm) {
      results = results.filter(
        (car) =>
          getText(car.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
          getText(car.brandName).toLowerCase().includes(searchTerm.toLowerCase()) ||
          getText(car.modelYear).toString().includes(searchTerm),
      )
    }

    // Apply sorting
    switch (sortBy) {
      case "price-asc":
        results.sort((a, b) => (a.cashPrice || 0) - (b.cashPrice || 0))
        break
      case "price-desc":
        results.sort((a, b) => (b.cashPrice || 0) - (a.cashPrice || 0))
        break
      case "name-asc":
        results.sort((a, b) => getText(a.name).localeCompare(getText(b.name)))
        break
      case "name-desc":
        results.sort((a, b) => getText(b.name).localeCompare(getText(a.name)))
        break
      default:
        // Keep original order
        break
    }

    setFilteredItems(results)
  }, [searchTerm, sortBy, wishlistItems])

  const handleRemoveFromWishlist = (carId) => {
    const updatedWishlist = wishlistItems.filter((car) => car.id !== carId)
    setWishlistItems(updatedWishlist)
    localStorage.setItem("carWishlist", JSON.stringify(updatedWishlist))

    // Dispatch custom event to update other components
    window.dispatchEvent(new Event("wishlistUpdated"))
    window.dispatchEvent(new Event("storage"))
  }

  const clearWishlist = () => {
    setWishlistItems([])
    setFilteredItems([])
    localStorage.removeItem("carWishlist")

    // Dispatch custom event to update other components
    window.dispatchEvent(new Event("wishlistUpdated"))
    window.dispatchEvent(new Event("storage"))
  }

  const handleViewDetails = (car) => {
    router.push(`/${currentLocale}/car-details/${car.id}`)
    setcar_Details(car)
  }

  // Skeleton loader for mobile view
  const MobileSkeletonLoader = () => (
    <div className="md:hidden">
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-white rounded-[5px] shadow-sm mb-4 overflow-hidden animate-pulse">
          <div className="flex flex-col sm:flex-row">
            {/* Image skeleton */}
            <div className="relative sm:w-1/3">
              <div className="h-48 sm:h-full bg-gray-200"></div>
            </div>

            {/* Content skeleton */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                </div>

                {/* Specifications skeleton */}
                <div className="flex flex-wrap gap-2 my-3">
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>

                {/* Price section skeleton */}
                <div className="flex justify-between items-center mt-2">
                  <div>
                    <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                    <div className="h-6 bg-gray-200 rounded w-24"></div>
                  </div>

                  <div>
                    <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                    <div className="h-5 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>

              {/* Action buttons skeleton */}
              <div className="flex gap-2 mt-4">
                <div className="h-10 bg-gray-200 rounded flex-1"></div>
                <div className="h-10 bg-gray-200 rounded w-10"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  // Skeleton loader for desktop view
  const DesktopSkeletonLoader = () => (
    <div className="hidden md:block overflow-x-auto">
      <div className="bg-white rounded-[5px] shadow-sm animate-pulse">
        {/* Table header skeleton */}
        <div className="bg-gray-100 border-b border-gray-200 grid grid-cols-6 p-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded w-2/3"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>

        {/* Table rows skeleton */}
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="border-b border-gray-100 grid grid-cols-6 p-4">
            <div className="flex items-center gap-3">
              <div className="w-24 h-16 bg-gray-200 rounded-[5px]"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-5 bg-gray-200 rounded w-1/2 self-center"></div>
            <div className="h-5 bg-gray-200 rounded w-2/3 self-center"></div>
            <div className="h-5 bg-gray-200 rounded w-1/2 self-center"></div>
            <div className="flex flex-wrap gap-2 self-center">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="flex justify-center gap-2 self-center">
              <div className="h-8 bg-gray-200 rounded w-24"></div>
              <div className="h-8 bg-gray-200 rounded w-10"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // Header skeleton
  const HeaderSkeleton = () => (
    <div className="bg-gradient-to-r from-brand-primary to-[#6B2A77] rounded-[5px] p-6 mb-6 animate-pulse">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white/30 rounded-full mr-3"></div>
          <div>
            <div className="h-8 bg-white/30 rounded w-40 mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-24"></div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="h-10 bg-white/20 rounded w-36"></div>
          <div className="h-10 bg-white/20 rounded w-32"></div>
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="container mx-auto  min-h-screen">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center mb-6">
          <div className="h-4 bg-gray-200 rounded w-12"></div>
          <div className="mx-2 h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>

        {/* Header skeleton */}
        <HeaderSkeleton />

        {/* Search and filter skeleton */}
        <div className="bg-white rounded-[5px] shadow-sm p-4 mb-6 animate-pulse">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="h-10 bg-gray-200 rounded w-full sm:w-32"></div>
            <div className="h-10 bg-gray-200 rounded w-full sm:w-48"></div>
          </div>
        </div>

        {/* Results count skeleton */}
        <div className="mb-4 h-4 bg-gray-200 rounded w-40"></div>

        {/* Mobile skeleton */}
        <MobileSkeletonLoader />

        {/* Desktop skeleton */}
        <DesktopSkeletonLoader />
      </div>
    )
  }

  return (
    <div className="container mx-auto  min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-primary transition-colors">
          {isRTL ? "الرئيسية" : "Home"}
        </Link>
        <ChevronRight className={`h-4 w-4 mx-2 ${isRTL ? "rotate-180" : ""}`} />
        <span className="text-brand-primary font-medium">{isRTL ? "قائمة الرغبات" : "Wishlist"}</span>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-brand-primary to-[#6B2A77] rounded-[5px] p-6 mb-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <Heart className="h-8 w-8 mr-3 fill-white" />
            <div>
              <h1 className="text-3xl font-bold">{isRTL ? "قائمة الرغبات" : "My Wishlist"}</h1>
              <p className="text-white/80 mt-1">
                {isRTL
                  ? `${wishlistItems.length} سيارات محفوظة`
                  : `${wishlistItems.length} saved ${wishlistItems.length === 1 ? "car" : "cars"}`}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/">
              <Button
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-[5px]"
              >
                {isRTL ? (
                  <>
                    <span>العودة للتسوق</span>
                    <ArrowLeft size={16} className="ml-2" />
                  </>
                ) : (
                  <>
                    <ArrowLeft size={16} className="mr-2" />
                    <span>Continue Shopping</span>
                  </>
                )}
              </Button>
            </Link>
            {wishlistItems.length > 0 && (
              <Button
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-[5px]"
                onClick={clearWishlist}
              >
                <Trash2 size={16} className={isRTL ? "ml-2" : "mr-2"} />
                {isRTL ? "مسح القائمة" : "Clear Wishlist"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-[5px] shadow-md p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-6 text-brand-dark opacity-50">
            <Heart className="w-full h-full" />
          </div>
          <h2 className="text-2xl font-semibold mb-3 text-brand-primary">
            {isRTL ? "قائمة الرغبات فارغة" : "Your wishlist is empty"}
          </h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            {isRTL
              ? "أضف السيارات التي تعجبك إلى قائمة الرغبات بالضغط على أيقونة القلب أثناء تصفح السيارات"
              : "Add cars you like to your wishlist by clicking the heart icon while browsing cars"}
          </p>
          <Link href="/">
            <Button className="bg-brand-primary hover:bg-[#6B2A77] text-white px-6 py-2.5 rounded-[5px]">
              <ShoppingCart className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
              {isRTL ? "تصفح السيارات" : "Browse Cars"}
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Search and Filter */}
          <div className="bg-white rounded-[5px] shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Search */}
              <div className="relative w-full sm:w-auto">
                {showSearch ? (
                  <div className="flex items-center w-full sm:w-80">
                    <input
                      type="text"
                      placeholder={isRTL ? "ابحث في قائمة الرغبات..." : "Search wishlist..."}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full border border-gray-300 rounded-[5px] py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    />
                    <button
                      onClick={() => {
                        setSearchTerm("")
                        setShowSearch(false)
                      }}
                      className="absolute right-3 text-gray-400 hover:text-gray-600"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-600 rounded-[5px]"
                    onClick={() => setShowSearch(true)}
                  >
                    <Search size={16} className={isRTL ? "ml-2" : "mr-2"} />
                    {isRTL ? "بحث" : "Search"}
                  </Button>
                )}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter size={16} className="text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-[5px] py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary bg-white text-gray-700 w-full sm:w-auto"
                >
                  <option value="default">{isRTL ? "الترتيب الافتراضي" : "Default sorting"}</option>
                  <option value="price-asc">{isRTL ? "السعر: من الأقل إلى الأعلى" : "Price: Low to High"}</option>
                  <option value="price-desc">{isRTL ? "السعر: من الأعلى إلى الأقل" : "Price: High to Low"}</option>
                  <option value="name-asc">{isRTL ? "الاسم: أ-ي" : "Name: A-Z"}</option>
                  <option value="name-desc">{isRTL ? "الاسم: ي-أ" : "Name: Z-A"}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mb-4 text-sm text-gray-500">
            {isRTL
              ? `عرض ${filteredItems.length} من ${wishlistItems.length} سيارات`
              : `Showing ${filteredItems.length} of ${wishlistItems.length} cars`}
          </div>

          {/* Mobile view: Premium List */}
          <div className="md:hidden">
            {filteredItems.length === 0 ? (
              <div className="bg-white rounded-[5px] shadow-sm p-8 text-center">
                <Search className="w-12 h-12 mx-auto mb-4 text-brand-dark" />
                <h3 className="text-xl font-medium text-brand-primary mb-2">
                  {isRTL ? "لا توجد نتائج مطابقة" : "No matching results"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {isRTL
                    ? "حاول استخدام كلمات بحث مختلفة أو تصفية أخرى"
                    : "Try using different search terms or filters"}
                </p>
                <Button
                  variant="outline"
                  className="border-gray-300 rounded-[5px]"
                  onClick={() => {
                    setSearchTerm("")
                    setSortBy("default")
                  }}
                >
                  {isRTL ? "إعادة ضبط البحث" : "Reset search"}
                </Button>
              </div>
            ) : (
              filteredItems.map((car) => (
                <div key={car.id} className="bg-white rounded-[5px] shadow-sm mb-4 overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    {/* Image section */}
                    <div className="relative sm:w-1/3">
                      <div className="relative h-48 sm:h-full bg-gray-50 flex items-center justify-center">
                        <img
                          src={car.image || "/placeholder.svg?height=192&width=320"}
                          alt={getText(car.name)}
                          className="max-w-full max-h-full object-contain p-2"
                        />

                        {/* Brand badge */}
                        <div className="absolute bottom-0 left-0 bg-brand-primary text-white px-3 py-1 rounded-tr-[5px] text-xs font-medium">
                          {getText(car.brandName)}
                        </div>
                      </div>
                    </div>

                    {/* Content section */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-gray-800 text-lg">{getText(car.name)}</h3>
                          <div className="text-sm font-medium text-gray-500">{getText(car.modelYear)}</div>
                        </div>

                        {/* Specifications */}
                        <div className="flex flex-wrap gap-2 my-3">
                          {car.specs?.transmission && (
                            <div className="flex items-center text-xs bg-brand-light text-brand-primary px-2 py-1 rounded-full">
                              <span>{getText(car.specs?.transmission)}</span>
                            </div>
                          )}
                          {car.specs?.fuelType && (
                            <div className="flex items-center text-xs bg-brand-light text-brand-primary px-2 py-1 rounded-full">
                              <span>{getText(car.specs?.fuelType)}</span>
                            </div>
                          )}
                          {car.specs?.seats && (
                            <div className="flex items-center text-xs bg-brand-light text-brand-primary px-2 py-1 rounded-full">
                              <span>
                                {getText(car.specs?.seats)} {isRTL ? "مقاعد" : "seats"}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Price section */}
                        <div className="flex justify-between items-center mt-2">
                          <div>
                            <div className="text-xs text-gray-500">{isRTL ? "السعر النقدي" : "Cash Price"}</div>
                            <div className="text-lg font-bold text-brand-primary flex items-center">
                              {car.cashPrice?.toLocaleString()}
                              <img src="/icons/Currency.svg" alt="Currency" className="w-4 h-4 ml-1 inline-block" />
                            </div>
                          </div>

                          {car.installmentPrice && (
                            <div>
                              <div className="text-xs text-gray-500">{isRTL ? "القسط الشهري" : "Monthly"}</div>
                              <div className="text-sm font-medium flex items-center">
                                {car.installmentPrice?.toLocaleString()}
                                <img
                                  src="/icons/Currency.svg"
                                  alt="Currency"
                                  className="w-3.5 h-3.5 ml-1 inline-block"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 mt-4">
                        <Button
                          className="flex-1 bg-brand-primary hover:bg-[#6B2A77] text-white rounded-[5px]"
                          onClick={() => handleViewDetails(car)}
                        >
                          <Eye size={16} className={isRTL ? "ml-2" : "mr-2"} />
                          {isRTL ? "عرض التفاصيل" : "View Details"}
                        </Button>
                        <Button
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-50 px-3 rounded-[5px]"
                          onClick={() => handleRemoveFromWishlist(car.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop view: Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full bg-white rounded-[5px] shadow-sm">
              <thead>
                <tr className="bg-brand-light/50 border-b border-gray-200">
                  <th className="p-4 text-left font-medium text-brand-primary">{isRTL ? "السيارة" : "Car"}</th>
                  <th className="p-4 text-left font-medium text-brand-primary">{isRTL ? "الموديل" : "Model"}</th>
                  <th className="p-4 text-left font-medium text-brand-primary">
                    {isRTL ? "السعر النقدي" : "Cash Price"}
                  </th>
                  <th className="p-4 text-left font-medium text-brand-primary">{isRTL ? "القسط" : "Installment"}</th>
                  <th className="p-4 text-left font-medium text-brand-primary">
                    {isRTL ? "المواصفات" : "Specifications"}
                  </th>
                  <th className="p-4 text-center font-medium text-brand-primary">{isRTL ? "الإجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-gray-500">
                      {isRTL ? "لا توجد نتائج مطابقة لبحثك" : "No matching results found"}
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((car, index) => (
                    <tr key={car.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-16 bg-gray-50 rounded-[5px] overflow-hidden flex-shrink-0 flex items-center justify-center">
                            <img
                              src={car.image || "/placeholder.svg?height=64&width=96"}
                              alt={getText(car.name)}
                              className="max-w-full max-h-full object-contain p-1"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-brand-primary">{getText(car.name)}</div>
                            <div className="text-xs text-gray-500">{getText(car.brandName)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{getText(car.modelYear)}</td>
                      <td className="p-4">
                        <span className="font-semibold text-gray-800 flex items-center">
                          {car.cashPrice?.toLocaleString()}
                          <img src="/icons/Currency.svg" alt="Currency" className="w-4 h-4 ml-1 inline-block" />
                        </span>
                      </td>
                      <td className="p-4">
                        {car.installmentPrice ? (
                          <span className="text-gray-700 flex items-center">
                            {car.installmentPrice?.toLocaleString()}
                            <img src="/icons/Currency.svg" alt="Currency" className="w-3.5 h-3.5 ml-1 inline-block" />
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-2 text-xs">
                          {car.specs?.transmission && (
                            <span className="px-2 py-1 bg-brand-light rounded-full text-brand-primary">
                              {getText(car.specs?.transmission)}
                            </span>
                          )}
                          {car.specs?.fuelType && (
                            <span className="px-2 py-1 bg-brand-light rounded-full text-brand-primary">
                              {getText(car.specs?.fuelType)}
                            </span>
                          )}
                          {car.specs?.seats && (
                            <span className="px-2 py-1 bg-brand-light rounded-full text-brand-primary">
                              {getText(car.specs?.seats)} {isRTL ? "مقاعد" : "seats"}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-brand-primary text-brand-primary hover:bg-brand-light/50 rounded-[5px]"
                            onClick={() => handleViewDetails(car)}
                          >
                            {isRTL ? "عرض التفاصيل" : "View Details"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-500 text-red-500 hover:bg-red-50 rounded-[5px]"
                            onClick={() => handleRemoveFromWishlist(car.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
