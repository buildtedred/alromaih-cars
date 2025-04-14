"use client"

import { useState, useEffect } from "react"
import { Heart } from 'lucide-react'
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function WishlistCounter() {
  const [count, setCount] = useState(0)
  const pathname = usePathname()
  const currentLocale = pathname.startsWith("/ar") ? "ar" : "en"
  const isRTL = currentLocale === "ar"

  useEffect(() => {
    // Function to get wishlist count from localStorage
    const getWishlistCount = () => {
      try {
        const savedWishlist = localStorage.getItem("carWishlist")
        if (savedWishlist) {
          const wishlistItems = JSON.parse(savedWishlist)
          setCount(wishlistItems.length)
        } else {
          setCount(0)
        }
      } catch (error) {
        console.error("Error getting wishlist count:", error)
        setCount(0)
      }
    }

    // Initial count
    getWishlistCount()

    // Set up event listener for storage changes
    const handleStorageChange = () => {
      getWishlistCount()
    }

    window.addEventListener("storage", handleStorageChange)

    // Custom event for wishlist updates within the same page
    const handleWishlistUpdate = () => {
      getWishlistCount()
    }

    window.addEventListener("wishlistUpdated", handleWishlistUpdate)

    // Check for changes every second (as a fallback)
    const interval = setInterval(getWishlistCount, 1000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate)
      clearInterval(interval)
    }
  }, [])

  return (
    <Link href={`/${currentLocale}/wishlist`}>
      <button
        className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
        aria-label={isRTL ? "قائمة الرغبات" : "Wishlist"}
      >
        <Heart className="h-5 w-5 text-gray-700" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-primary opacity-75"></span>
            <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white">
              {count}
            </span>
          </span>
        )}
      </button>
    </Link>
  )
}