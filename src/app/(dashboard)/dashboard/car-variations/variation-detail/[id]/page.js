"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function VariationDetailPage() {
  const { id } = useParams()
  const [variation, setVariation] = useState(null)
  const [car, setCar] = useState(null)
  const [brand, setBrand] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    fetchVariationDetails()
  }, [id, language])

  async function fetchVariationDetails() {
    try {
      setLoading(true)
      setError(null)

      // Fetch variation data
      const variationResponse = await fetch(`/api/supabasPrisma/othervariations/${id}`)
      if (!variationResponse.ok) {
        throw new Error(`Failed to fetch variation details`)
      }
      const variationData = await variationResponse.json()

      // Check if the response has the new bilingual format
      if (variationData && (variationData.en || variationData.ar)) {
        // Use the selected language or fallback to English
        setVariation(variationData[language] || variationData.en)
      } else {
        // Fallback to the old format
        setVariation(variationData)
      }

      // Fetch car data if we have a car ID
      if (variation?.carId) {
        const carsResponse = await fetch(`/api/supabasPrisma/cars`)
        if (carsResponse.ok) {
          const carsData = await carsResponse.json()

          // Check if cars data has bilingual format
          let carsArray = carsData
          if (carsData && (carsData.en || carsData.ar)) {
            carsArray = carsData[language] || carsData.en
          }

          const carData = carsArray.find((c) => c.id === variation.carId)
          if (carData) {
            setCar(carData)

            // Fetch brand data if we have a brand ID
            if (carData.brandId) {
              const brandsResponse = await fetch(`/api/supabasPrisma/carbrands`)
              if (brandsResponse.ok) {
                const brandsData = await brandsResponse.json()

                // Check if brands data has bilingual format
                let brandsArray = brandsData
                if (brandsData && (brandsData.en || brandsData.ar)) {
                  brandsArray = brandsData[language] || brandsData.en
                }

                const brandData = brandsArray.find((b) => b.id === carData.brandId)
                if (brandData) {
                  setBrand(brandData)
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching variation details:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const nextImage = () => {
    if (variation?.images?.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex === variation.images.length - 1 ? 0 : prevIndex + 1))
    }
  }

  const prevImage = () => {
    if (variation?.images?.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? variation.images.length - 1 : prevIndex - 1))
    }
  }

  if (loading) {
    return <VariationDetailSkeleton />
  }

  if (error || !variation) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/car-variations">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Link>
          </Button>
        </div>
        <div className="bg-red-50 p-4 rounded-md text-red-800">{error || "Variation not found"}</div>
      </div>
    )
  }

  const hasImages = variation.images && variation.images.length > 0
  const currentImage = hasImages ? variation.images[currentImageIndex] : null

  return (
    <div className="container mx-auto p-6">
      {/* Header with breadcrumb and language selector */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/car-variations">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Link>
          </Button>
          <span className="text-muted-foreground mx-2">/</span>
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
          <span className="text-muted-foreground mx-2">/</span>
          <Link href="/dashboard/cars" className="text-muted-foreground hover:text-foreground">
            Cars
          </Link>
          <span className="text-muted-foreground mx-2">/</span>
          <span className="font-medium truncate max-w-[200px]">{variation.name}</span>
        </div>

        <Tabs value={language} onValueChange={setLanguage} className="w-auto">
          <TabsList className="grid w-[200px] grid-cols-2">
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="ar">العربية</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main content area */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-6">{variation.name}</h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-4 mb-6">
            {car && car.year && (
              <div className="bg-gray-100 px-3 py-1 rounded-md flex items-center">
                <CalendarIcon className="h-4 w-4 text-gray-600 mr-2" />
                {car.year}
              </div>
            )}
            {brand && (
              <div className="bg-gray-100 px-3 py-1 rounded-md flex items-center">
                <TagIcon className="h-4 w-4 text-gray-600 mr-2" />
                {brand.name}
              </div>
            )}
            {variation.price && (
              <div className="bg-gray-100 px-3 py-1 rounded-md flex items-center">
                <DollarIcon className="h-4 w-4 text-gray-600 mr-2" />${variation.price}
              </div>
            )}
            {variation.colorName && (
              <div className="bg-gray-100 px-3 py-1 rounded-md flex items-center">
                <div className="flex items-center gap-2">
                  {variation.colorHex && (
                    <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: variation.colorHex }} />
                  )}
                  {variation.colorName}
                </div>
              </div>
            )}
          </div>

          {/* Image Carousel */}
          <div className="relative mb-6 bg-white border rounded-md p-4 flex items-center justify-center">
            {hasImages ? (
              <>
                <img
                  src={currentImage || "/placeholder.svg"}
                  alt={`${variation.name} - Image ${currentImageIndex + 1}`}
                  className="max-h-[300px] object-contain"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/placeholder.svg"
                  }}
                />
                {variation.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 bg-white/80 hover:bg-white rounded-full p-1 shadow-md"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 bg-white/80 hover:bg-white rounded-full p-1 shadow-md"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </>
            ) : car && car.image ? (
              <img
                src={car.image || "/placeholder.svg"}
                alt={car.name}
                className="max-h-[300px] object-contain"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = "/placeholder.svg"
                }}
              />
            ) : (
              <div className="text-gray-400 text-center py-10">
                <CarIcon className="h-24 w-24 mx-auto mb-4" />
                <p>No image available</p>
              </div>
            )}
          </div>

          {/* Image Thumbnails */}
          {hasImages && variation.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
              {variation.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-16 h-16 border rounded-md overflow-hidden flex-shrink-0 transition-all ${
                    currentImageIndex === index ? "ring-2 ring-black" : ""
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${variation.name} - Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "/placeholder.svg"
                    }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Image Counter */}
          {hasImages && variation.images.length > 1 && (
            <div className="text-center text-sm text-gray-500 mb-6">
              Image {currentImageIndex + 1} of {variation.images.length}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Variation Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Model:</span>
                <span className="font-medium">{variation.name}</span>
              </div>
              {car && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Car:</span>
                  <span className="font-medium">{car.name}</span>
                </div>
              )}
              {car && car.year && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Year:</span>
                  <span className="font-medium">{car.year}</span>
                </div>
              )}
              {brand && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Brand:</span>
                  <span className="font-medium">{brand.name}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-medium">${variation.price || "0"}</span>
              </div>
              {variation.colorName && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Color:</span>
                  <span className="font-medium flex items-center gap-2">
                    {variation.colorHex && (
                      <div className="h-3 w-3 rounded-full border" style={{ backgroundColor: variation.colorHex }} />
                    )}
                    {variation.colorName}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Images:</span>
                <span className="font-medium">{variation.images ? variation.images.length : 0}</span>
              </div>
            </CardContent>
          </Card>

          {car && (
            <Card>
              <CardHeader>
                <CardTitle>Car Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  {car.image ? (
                    <img
                      src={car.image || "/placeholder.svg"}
                      alt={car.name}
                      className="w-10 h-10 object-contain"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.svg"
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <CarIcon className="h-5 w-5 text-gray-500" />
                    </div>
                  )}
                  <span className="font-medium">{car.name}</span>
                </div>
                <Link
                  href={`/dashboard/cars/car-details/${car.id}`}
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  View car details
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function VariationDetailSkeleton() {
  return (
    <div className="container mx-auto p-6">
      {/* Header with breadcrumb */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Skeleton className="h-9 w-20" />
          <span className="text-muted-foreground mx-2">/</span>
          <Skeleton className="h-4 w-20" />
          <span className="text-muted-foreground mx-2">/</span>
          <Skeleton className="h-4 w-24" />
          <span className="text-muted-foreground mx-2">/</span>
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-[200px]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main content area */}
        <div className="md:col-span-2">
          <Skeleton className="h-10 w-3/4 mb-6" />

          <div className="flex flex-wrap gap-4 mb-6">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-20" />
          </div>

          {/* Image Skeleton */}
          <Skeleton className="h-[300px] w-full mb-6" />

          {/* Thumbnails Skeleton */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
            {[1, 2, 3, 4].map((index) => (
              <Skeleton key={index} className="w-16 h-16 flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Variation Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Model", "Car", "Year", "Brand", "Price", "Color", "Images"].map((item) => (
                <div key={item} className="flex justify-between">
                  <span className="text-muted-foreground">{item}:</span>
                  <Skeleton className="h-5 w-24" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Car Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="h-4 w-36" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function CalendarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}

function TagIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
      <path d="M7 7h.01" />
    </svg>
  )
}

function DollarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

function CarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.6-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  )
}
