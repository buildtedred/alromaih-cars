"use client"

import { useState, useEffect } from "react"
import { Search, X, Car, ChevronDown, ChevronUp, Star, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Link } from "@/i18n/routing"

export default function SearchComponent({ isVisible, onClose }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [brands, setBrands] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedCar, setSelectedCar] = useState(null)
  const [expandedBrands, setExpandedBrands] = useState([])
  const [isMobile, setIsMobile] = useState(false)
  const [showCarDetails, setShowCarDetails] = useState(false)
  const [issVisible, setIssVisible] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (isVisible) fetchBrands()
  }, [isVisible])

  const fetchBrands = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("https://xn--mgbml9eg4a.com/api/brands")
      if (!response.ok) throw new Error("Failed to fetch brands")
      const data = await response.json()
      setBrands(data.data)
    } catch (err) {
      setError("An error occurred while fetching data")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredBrands = brands.filter(
    (brand) =>
      brand.name.en.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.car_models.some((model) => model.name.en.name.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const toggleBrandExpansion = (brandId) => {
    setExpandedBrands((prev) => (prev.includes(brandId) ? prev.filter((id) => id !== brandId) : [...prev, brandId]))
  }

  const handleCarSelect = (car) => {
    setSelectedCar(car)
    if (isMobile) {
      setShowCarDetails(true)
    }
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    if (isMobile && showCarDetails && e.target.value !== "") {
      setShowCarDetails(false)
      setSelectedCar(null)
    }
  }

  const handleSearchClear = () => {
    setSearchQuery("")
    // Do not change the view when clearing search on mobile
  }

  const renderCarDetails = (car) => (
    <div className="space-y-6">
      <div className="relative w-full h-48 rounded-lg overflow-hidden">
        <Image
          src={`https://xn--mgbml9eg4a.com${car.image_url}`}
          alt={car.name.en.name}
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h2 className="text-xl font-bold">{car.name.en.name}</h2>
          <p className="text-sm opacity-90">{car.brandName}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src={`https://xn--mgbml9eg4a.com${car.brandLogo}`}
            alt={car.brandName}
            width={32}
            height={32}
            className="rounded-full"
          />
          <div>
            <p className="font-semibold text-sm">{car.brandName}</p>
            <div className="flex items-center">
              {[...Array(4)].map((_, i) => (
                <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
              ))}
              <Star className="h-3 w-3 text-gray-300 fill-current" />
              <span className="text-xs text-gray-600 ml-1">(4.0)</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Price per day</p>
          <p className="text-lg font-bold text-brand-primary">${car.price}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="text-xs">
          {car.name.en.condition}
        </Badge>
        <Badge variant="secondary" className="text-xs">
          {car.name.en.transmission}
        </Badge>
        <Badge variant="secondary" className="text-xs">
          {car.seating_capacity} seats
        </Badge>
        <Badge variant="secondary" className="text-xs">
          {car.vehicle_fuel_types[0]?.fuel_type.en || "N/A"}
        </Badge>
      </div>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="text-xs">
            Overview
          </TabsTrigger>
          <TabsTrigger value="features" className="text-xs">
            Features
          </TabsTrigger>
          <TabsTrigger value="reviews" className="text-xs">
            Reviews
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-500">Year</p>
              <p className="font-medium">{car.year_of_manufacture}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Transmission</p>
              <p className="font-medium capitalize">{car.name.en.transmission}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Fuel Type</p>
              <p className="font-medium capitalize">{car.vehicle_fuel_types[0]?.fuel_type.en || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Seating</p>
              <p className="font-medium">{car.seating_capacity} seats</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="features">
          <ul className="text-xs space-y-1 list-disc list-inside">
            <li>Air Conditioning</li>
            <li>Bluetooth</li>
            <li>Backup Camera</li>
            <li>Navigation</li>
            <li>Keyless Entry</li>
          </ul>
        </TabsContent>
        <TabsContent value="reviews">
          <p className="text-xs text-gray-600">No reviews yet.</p>
        </TabsContent>
      </Tabs>
        <Link href={`/car-details/${car.name.en.slug}`}>
        <Button onClick={() => onClose()} className="border-4 w-full bg-brand-primary hover:bg-brand-dark text-white text-sm">
        Show Details
        </Button>
        </Link>
     
    </div>
  )

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 10 }}
            
            transition={ { type: "spring", damping: 25, stiffness: 400 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] md:max-h-[80vh] flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              {isMobile && showCarDetails ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowCarDetails(false)
                    // Do not reset selectedCar when going back
                  }}
                  className="mr-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              ) : null}
              <h2 className="text-lg font-semibold text-gray-900">Find Your Perfect Ride</h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search brands or models..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-9 pr-9 w-full bg-gray-100 border-transparent focus:ring-brand-primary focus:ring-0 text-sm"

                />
                {searchQuery && (
                  <button
                    onClick={handleSearchClear}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear search</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {(!isMobile || (isMobile && !showCarDetails)) && (
                <ScrollArea className="w-full md:w-1/2 border-r border-gray-200">
                  <div className="p-4 space-y-4">
                    {isLoading ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                      </div>
                    ) : error ? (
                      <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg text-sm">
                        <p>{error}</p>
                        <Button onClick={fetchBrands} className="mt-2 text-xs">
                          Retry
                        </Button>
                      </div>
                    ) : filteredBrands.length === 0 && searchQuery ? (
                      <p className="text-center text-gray-500 p-4 bg-gray-50 rounded-lg text-sm">No results found.</p>
                    ) : (
                      filteredBrands.map((brand) => (
                        <div key={brand.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                          <div
                            className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => toggleBrandExpansion(brand.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Image
                                  src={`https://xn--mgbml9eg4a.com${brand.image_url}`}
                                  alt={brand.name.en.name}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                                <div>
                                  <h3 className="font-semibold text-sm text-gray-900">{brand.name.en.name}</h3>
                                  <p className="text-xs text-gray-500">{brand.car_models.length} models</p>
                                </div>
                              </div>
                              {expandedBrands.includes(brand.id) ? (
                                <ChevronUp className="h-4 w-4 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                          </div>
                          {expandedBrands.includes(brand.id) && (
                            <div className="bg-gray-50 px-3 py-2">
                              {brand.car_models.map((model) => (
                                <div
                                  key={model.id}
                                  className={`flex items-center gap-2 p-2 cursor-pointer transition-colors rounded-md text-sm ${
                                    selectedCar?.id === model.id ? "bg-brand-primary/10" : "hover:bg-white"
                                  }`}
                                  onClick={() =>
                                    handleCarSelect({
                                      ...model,
                                      brandName: brand.name.en.name,
                                      brandLogo: brand.image_url,
                                    })
                                  }
                                >
                                  <Car className="h-4 w-4 text-brand-primary flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <h4 className="font-medium text-gray-900 truncate">{model.name.en.name}</h4>
                                    <p className="text-xs text-gray-500 truncate">${model.price}/day</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              )}

              {(!isMobile || (isMobile && showCarDetails)) && (
                <div className="w-full md:w-1/2 bg-gray-50">
                  <ScrollArea className="h-full">
                    <div className="p-4">
                      {selectedCar ? (
                        renderCarDetails(selectedCar)
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                          <p>Select a car to view details</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

