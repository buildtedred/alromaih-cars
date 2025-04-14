"use client"

import { useState, useEffect } from "react"
import { Trash2, ShoppingCart, ArrowLeft, Heart } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import CarCard from "@/MyComponents/Cards/CarCard"


export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const currentLocale = pathname.startsWith("/ar") ? "ar" : "en"
  const isRTL = currentLocale === "ar"

  // Helper function to extract text from multilingual objects
  const getText = (textObj) => {
    if (!textObj) return "";
    return typeof textObj === 'object' 
      ? (textObj[currentLocale] || textObj.en || "") 
      : String(textObj);
  }

  useEffect(() => {
    // Load wishlist from localStorage
    const loadWishlist = () => {
      try {
        const savedWishlist = localStorage.getItem("carWishlist")
        if (savedWishlist) {
          setWishlistItems(JSON.parse(savedWishlist))
        }
      } catch (error) {
        console.error("Error loading wishlist:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadWishlist()
  }, [])

  const handleRemoveFromWishlist = (carId) => {
    const updatedWishlist = wishlistItems.filter((car) => car.id !== carId)
    setWishlistItems(updatedWishlist)
    localStorage.setItem("carWishlist", JSON.stringify(updatedWishlist))
  }

  const clearWishlist = () => {
    setWishlistItems([])
    localStorage.removeItem("carWishlist")
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary">{isRTL ? "قائمة الرغبات" : "My Wishlist"}</h1>
          <p className="text-gray-600 mt-1">
            {isRTL
              ? `${wishlistItems.length} سيارات محفوظة`
              : `${wishlistItems.length} saved ${wishlistItems.length === 1 ? "car" : "cars"}`}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/" className="flex items-center gap-2 text-brand-primary hover:underline">
            {isRTL ? (
              <>
                <span>العودة للتسوق</span>
                <ArrowLeft size={16} />
              </>
            ) : (
              <>
                <ArrowLeft size={16} />
                <span>Continue Shopping</span>
              </>
            )}
          </Link>
          {wishlistItems.length > 0 && (
            <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50" onClick={clearWishlist}>
              {isRTL ? "مسح القائمة" : "Clear Wishlist"}
            </Button>
          )}
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 text-gray-300">
            <Heart className="w-full h-full" />
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-700">
            {isRTL ? "قائمة الرغبات فارغة" : "Your wishlist is empty"}
          </h2>
          <p className="text-gray-500 mb-6">
            {isRTL
              ? "أضف السيارات التي تعجبك إلى قائمة الرغبات بالضغط على أيقونة القلب"
              : "Add cars you like to your wishlist by clicking the heart icon"}
          </p>
          <Link href="/">
            <Button className="bg-brand-primary hover:bg-brand-primary/90">
              <ShoppingCart className="mr-2 h-4 w-4" />
              {isRTL ? "تصفح السيارات" : "Browse Cars"}
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Mobile view: Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:hidden">
            {wishlistItems.map((car) => (
              <div key={car.id} className="relative">
                <CarCard
                  car={car}
                  isFavorite={true}
                  onFavoriteToggle={() => handleRemoveFromWishlist(car.id)}
                  locale={currentLocale}
                />
              </div>
            ))}
          </div>

          {/* Desktop view: Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-md">
              <thead className="bg-brand-primary text-white">
                <tr>
                  <th className="p-4 text-left">{isRTL ? "السيارة" : "Car"}</th>
                  <th className="p-4 text-left">{isRTL ? "الموديل" : "Model"}</th>
                  <th className="p-4 text-left">{isRTL ? "السعر النقدي" : "Cash Price"}</th>
                  <th className="p-4 text-left">{isRTL ? "القسط" : "Installment"}</th>
                  <th className="p-4 text-left">{isRTL ? "المواصفات" : "Specifications"}</th>
                  <th className="p-4 text-center">{isRTL ? "الإجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody>
                {wishlistItems.map((car, index) => (
                  <tr key={car.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-12 relative">
                          <img
                            src={car.image || "/placeholder.svg?height=48&width=64"}
                            alt={getText(car.name)}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-brand-primary">{getText(car.name)}</div>
                          <div className="text-xs text-gray-500">{getText(car.brandName)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{getText(car.modelYear)}</td>
                    <td className="p-4 font-semibold">{car.cashPrice?.toLocaleString()}</td>
                    <td className="p-4">{car.installmentPrice}</td>
                    <td className="p-4">
                      <div className="flex gap-3 text-xs">
                        <span>{getText(car.specs?.transmission)}</span>
                        <span>•</span>
                        <span>{getText(car.specs?.fuelType)}</span>
                        <span>•</span>
                        <span>{getText(car.specs?.seats)} {isRTL ? "مقاعد" : "seats"}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <Link href={`/${currentLocale}/car-details/${car.id}`}>
                          <Button variant="outline" size="sm" className="text-brand-primary border-brand-primary">
                            {isRTL ? "عرض التفاصيل" : "View Details"}
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 border-red-500 hover:bg-red-50"
                          onClick={() => handleRemoveFromWishlist(car.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
