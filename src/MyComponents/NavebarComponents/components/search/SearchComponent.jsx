"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { X } from "lucide-react"
import { Dialog } from "@/components/ui/dialog"
import Image from "next/image"
import { useLanguageContext } from "@/contexts/LanguageSwitcherContext"
import { useDetailContext } from "@/contexts/detailProvider"
import { usePathname, useRouter } from "next/navigation"
import carsData from "@/app/api/mock-data"

// Custom debounce hook to replace use-debounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

// Skeleton components for loading states
const BrandCardSkeleton = () => (
  <div className="h-[100px] rounded-[10px] border border-gray-200 p-2 animate-pulse">
    <div className="flex items-center gap-2 h-full">
      <div className="h-[72px] w-[72px] rounded-full bg-gray-200"></div>
      <div className="flex-1">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  </div>
)

const CarCardSkeleton = () => (
  <div className="h-[88px] rounded-[10px] border border-gray-200 p-2 animate-pulse">
    <div className="flex items-center gap-2">
      <div className="h-[72px] w-[72px] rounded-full bg-gray-200"></div>
      <div className="flex-1">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  </div>
)

// Tag component for better reusability
const Tag = ({ text, onRemove }) => (
  <div className="flex items-center gap-1 bg-brand-primary text-white px-2 py-1 rounded-[10px] text-sm">
    <span>{text}</span>
    <button
      onClick={onRemove}
      className="hover:bg-brand-primary/80 rounded-full p-0.5 transition-colors"
      aria-label="Remove tag"
    >
      <X className="w-3 h-3" />
    </button>
  </div>
)

// Car card component with fixed dimensions to prevent shaking
const CarCard = ({ car, onClick, isEnglish }) => (
  <div
    onClick={onClick}
    className="shadow-lg hover:bg-gray-50 hover:border-brand-primary border border-transparent rounded-[10px] flex items-center gap-2 p-2 cursor-pointer transition-all duration-200 text-sm h-[88px] overflow-hidden transform-gpu hover:scale-[1.02]"
    style={{ transformOrigin: "center center" }}
  >
    <div className="h-[72px] w-[72px] flex-shrink-0">
      <Image
        src={car.image || "/placeholder.svg"}
        alt={isEnglish ? car.name.en : car.name.ar}
        width={72}
        height={72}
        className="h-full w-full border-2 border-brand-primary rounded-full object-cover transition-transform duration-200"
      />
    </div>
    <div className="min-w-0 flex-1">
      <h4 className="font-medium truncate text-brand-primary">{isEnglish ? car.name.en : car.name.ar}</h4>
      <p className="text-xs text-brand-primary truncate">{car.cashPrice}</p>
    </div>
  </div>
)

// Brand card component with fixed dimensions to prevent shaking
const BrandCard = ({ brand, count, logo, isSelected, onClick, arrow, isEnglish }) => (
  <div
    className={` h-[100px] rounded-[10px] flex items-center gap-2 p-2 cursor-pointer transition-all duration-200 text-sm overflow-hidden transform-gpu hover:scale-[1.02] ${
      isSelected
        ? "bg-brand-primary/10 border-2 border-brand-primary"
        : "hover:bg-gray-50 border border-transparent hover:border-brand-primary"
    }`}
    onClick={onClick}
    style={{ transformOrigin: "center center" }}
  >
    <div className="h-[72px] w-[72px] flex-shrink-0">
      <img
        src={logo || "/placeholder.svg"}
        alt={brand}
        className="h-full w-full border-2 border-brand-primary rounded-full p-2 transition-transform duration-200"
      />
    </div>
    <div className="min-w-0 flex-1">
      <h4 className="font-medium truncate text-brand-primary">{brand}</h4>
      <p className="text-xs text-brand-primary truncate">{count} cars</p>
    </div>
    {arrow && (
      <img src={arrow || "/placeholder.svg"} alt="arrow" className={`w-4 h-4 mt-1 ${isEnglish ? "rotate-180" : ""}`} />
    )}
  </div>
)

export default function SearchComponent({ isVisible, onClose }) {
  const { isEnglish } = useLanguageContext()
  const { setcar_Details } = useDetailContext()
  const [tags, setTags] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [cars, setCars] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCar, setSelectedCar] = useState(null)

  // Debounce the input value to prevent excessive filtering
  const debouncedInputValue = useDebounce(inputValue, 300)

  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = pathname.startsWith("/ar") ? "ar" : "en"

  // Load cars data when component becomes visible
  useEffect(() => {
    if (isVisible) {
      setIsLoading(true)
      // Simulate API call with timeout
      const timer = setTimeout(() => {
        setCars(carsData)
        setIsLoading(false)
      }, 1000) // Longer timeout to show skeleton
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  // Handle tag addition
  const addTag = useCallback(
    (text) => {
      if (!text.trim()) return

      // Check for duplicates
      if (tags.some((tag) => tag.text.toLowerCase() === text.toLowerCase())) return

      const newTag = {
        id: Date.now().toString(),
        text: text.trim(),
      }
      setTags((prev) => [...prev, newTag])
    },
    [tags],
  )

  // Handle tag removal
  const removeTag = useCallback((id) => {
    setTags((prev) => prev.filter((tag) => tag.id !== id))
  }, [])

  // Handle keyboard events for tag management
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && inputValue.trim()) {
        addTag(inputValue)
        setInputValue("")
        e.preventDefault()
      } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
        // Remove the last tag when backspace is pressed on empty input
        removeTag(tags[tags.length - 1].id)
      }
    },
    [inputValue, tags, addTag, removeTag],
  )

  // Process car data to get unique brands with counts
  const uniqueBrands = useMemo(() => {
    return Object.values(
      cars.reduce((acc, car) => {
        if (!acc[car.brand]) {
          acc[car.brand] = { ...car, count: 1 }
        } else {
          acc[car.brand].count += 1
        }
        return acc
      }, {}),
    )
  }, [cars])

  // Combined search function that uses both tags and current input
  const getSearchTerms = useCallback(() => {
    const terms = [...tags.map((tag) => tag.text.toLowerCase())]

    // Add the current input value if it's not empty
    if (debouncedInputValue.trim()) {
      terms.push(debouncedInputValue.toLowerCase())
    }

    return terms
  }, [tags, debouncedInputValue])

  // Filter brands based on search terms (tags + current input)
  const filteredBrands = useMemo(() => {
    const searchTerms = getSearchTerms()

    if (searchTerms.length === 0) {
      return uniqueBrands
    }

    return uniqueBrands.filter((brand) => {
      return searchTerms.some((term) => {
        return (
          brand.brand.toLowerCase().includes(term) ||
          brand.name.en.toLowerCase().includes(term) ||
          (brand.name.ar && brand.name.ar.toLowerCase().includes(term))
        )
      })
    })
  }, [uniqueBrands, getSearchTerms])

  // Filter individual cars based on search terms
  const filteredCars = useMemo(() => {
    const searchTerms = getSearchTerms()

    if (searchTerms.length === 0) {
      return []
    }

    return cars.filter((car) => {
      return searchTerms.some((term) => {
        return (
          car.brand.toLowerCase().includes(term) ||
          car.name.en.toLowerCase().includes(term) ||
          (car.name.ar && car.name.ar.toLowerCase().includes(term)) ||
          (car.model && car.model.toLowerCase().includes(term))
        )
      })
    })
  }, [cars, getSearchTerms])

  // Group cars by brand for display
  const brandGroups = useMemo(() => {
    return filteredBrands
      .map((brandItem) => {
        // Filter cars that belong to this brand and match the search terms
        const brandCars =
          filteredCars.length > 0
            ? filteredCars.filter((car) => car.brand?.toLowerCase() === brandItem.brand?.toLowerCase())
            : cars.filter((car) => car.brand?.toLowerCase() === brandItem.brand?.toLowerCase())

        return {
          ...brandItem,
          cars: brandCars,
        }
      })
      .filter((group) => group.cars.length > 0) // Only show brands that have matching cars
  }, [filteredBrands, filteredCars, cars])

  // Handle car selection
  const handleCarSelect = useCallback(
    (car) => {
      setSelectedCar(car)
      if (car.brand) {
        addTag(car.brand)
      }
    },
    [addTag],
  )

  // Handle view details action
  const handleViewDetails = useCallback(
    (car) => {
      router.push(`/${currentLocale}/car-details/${car.id}`)
      setcar_Details(car)
      onClose()
    },
    [router, currentLocale, setcar_Details, onClose],
  )

  // Generate skeleton arrays for loading state
  const skeletonBrands = Array(8).fill(0)
  const skeletonCars = Array(4).fill(0)

  // Determine if we should show results based on search input
  const hasSearchInput = debouncedInputValue.trim().length > 0 || tags.length > 0

  // Determine if we have any results to show
  const hasResults = brandGroups.length > 0

  return (
    <Dialog open={isVisible} onOpenChange={(open) => !open && onClose()}>
      <div className="fixed inset-0 md:h-[80vh] overflow-y-auto container mx-auto z-[1000] bg-white rounded-lg shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className={`${
            isEnglish ? "right-3" : "left-3"
          } absolute top-3  z-50 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 border border-brand-primary hover:bg-brand-primary hover:text-white`}
          aria-label="Close search"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col">
          {/* Search header */}
          <div className="p-4 border-b border-gray-200 mt-10">
            <div className="relative flex justify-center">
              <div className="relative w-full md:w-[600px] lg:w-[871px] mx-auto bg-white rounded-[10px] border-2 border-brand-primary flex items-center px-3 py-2 focus-within:ring-2 focus-within:ring-brand-primary/50 transition-all duration-200">
                <Image src="/icons/search.svg" alt="search icon" width={32} height={32} className="p-2" />

                <div className="flex flex-wrap gap-2 items-center flex-1">
                  {tags.map((tag) => (
                    <Tag key={tag.id} text={tag.text} onRemove={() => removeTag(tag.id)} />
                  ))}

                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 outline-none border-none bg-transparent min-w-[120px] text-brand-primary placeholder-brand-primary/60"
                    placeholder={isEnglish ? "Search for cars or brands..." : "اختر الموديل..."}
                    autoFocus
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Search results */}
          <div className="p-4">
            {isLoading ? (
              // Skeleton loading state
              hasSearchInput ? (
                <div className="space-y-6">
                  {[1, 2].map((group) => (
                    <div key={group} className="bg-white shadow-sm rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-4">
                        {/* Brand skeleton */}
                        <BrandCardSkeleton />

                        {/* Cars grid skeleton */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                          {skeletonCars.map((_, i) => (
                            <CarCardSkeleton key={i} />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Default brands skeleton
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {skeletonBrands.map((_, i) => (
                    <BrandCardSkeleton key={i} />
                  ))}
                </div>
              )
            ) : hasSearchInput ? (
              hasResults ? (
                <div className="space-y-6">
                  {brandGroups.map((group) => (
                    <div key={group.brand} className="bg-white rounded-lg p-4 border-brand-primary/10">
                      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-4">
                        {/* Brand card */}
                        <div className="shadow-lg rounded-[10px]">
                          <BrandCard
                            brand={group.brand}
                            count={group.cars.length}
                            logo={group.brandLogo}
                            isSelected={selectedCar?.brand === group.brand}
                            onClick={() => handleCarSelect(group)}
                            isEnglish={isEnglish}
                            arrow="/icons/arrow.svg"
                          />
                        </div>

                        {/* Cars grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                          {group.cars.map((car) => (
                            <CarCard
                              key={car.id}
                              car={car}
                              isEnglish={isEnglish}
                              onClick={() => handleViewDetails(car)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // No results found
                <div className="flex flex-col items-center justify-center h-40 text-brand-primary">
                  <p className="text-lg font-medium">No results found</p>
                  <p className="text-sm text-brand-primary/70">
                    Try a different search term or browse all brands below
                  </p>
                </div>
              )
            ) : (
              // Default brands view (no search)
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uniqueBrands.map((car) => (
                  <BrandCard
                    key={car.brand}
                    brand={car.brand}
                    count={car.count}
                    logo={car.brandLogo}
                    isSelected={selectedCar?.brand === car.brand}
                    onClick={() => handleCarSelect(car)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  )
}
