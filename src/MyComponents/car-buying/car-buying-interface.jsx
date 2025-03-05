"use client"

import { useState, useEffect } from "react"
import { Car, Truck, Search, Tag, ChevronLeft } from "lucide-react"

export default function CarBuyingInterface() {
  const [paymentMethod, setPaymentMethod] = useState("")
  const [activeStep, setActiveStep] = useState(0)
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [selectedModel, setSelectedModel] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState(null)
  const [selectedBank, setSelectedBank] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [vehicleData, setVehicleData] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState(false)

  // Fallback data
  const fallbackBrands = [
    { id: 1, name: "Jetour", logo: "/placeholder.svg?height=50&width=100" },
    { id: 2, name: "Toyota", logo: "/placeholder.svg?height=50&width=100" },
    { id: 3, name: "Ford", logo: "/placeholder.svg?height=50&width=100" },
    { id: 4, name: "Bestune", logo: "/placeholder.svg?height=50&width=100" },
    { id: 5, name: "MG", logo: "/placeholder.svg?height=50&width=100" },
    { id: 6, name: "Chevrolet", logo: "/placeholder.svg?height=50&width=100" },
    { id: 7, name: "Nissan", logo: "/placeholder.svg?height=50&width=100" },
    { id: 8, name: "Suzuki", logo: "/placeholder.svg?height=50&width=100" },
    { id: 9, name: "Honda", logo: "/placeholder.svg?height=50&width=100" },
    { id: 10, name: "VW", logo: "/placeholder.svg?height=50&width=100" },
    { id: 11, name: "Haval", logo: "/placeholder.svg?height=50&width=100" },
    { id: 12, name: "Hyundai", logo: "/placeholder.svg?height=50&width=100" },
  ]

  const fallbackModels = {
    Jetour: ["T2", "T1", "Dashing", "X70", "X90", "X50"],
    Toyota: ["Camry", "Corolla", "RAV4"],
    Ford: ["Mustang", "F-150", "Explorer"],
    Bestune: ["B70", "T77", "T99"],
    MG: ["ZS", "HS", "RX5"],
    Chevrolet: ["Malibu", "Captiva", "Tahoe"],
    Nissan: ["Altima", "Patrol", "X-Trail"],
    Suzuki: ["Swift", "Vitara", "Jimny"],
    Honda: ["Accord", "CR-V", "Civic"],
    VW: ["Golf", "Tiguan", "Passat"],
    Haval: ["H6", "Jolion", "Big Dog"],
    Hyundai: ["Tucson", "Santa Fe", "Elantra"],
  }

  const fallbackCategories = ["Comfort", "Premium", "Luxury"]
  const fallbackYears = ["2024", "2023", "2022", "2021"]

  // Generate fallback vehicle data
  const generateFallbackVehicleData = () => {
    const vehicles = []

    fallbackBrands.forEach((brand) => {
      const models = fallbackModels[brand.name] || ["Model X", "Model Y", "Model Z"]

      models.forEach((model) => {
        fallbackYears.forEach((year) => {
          vehicles.push({
            id: `${brand.name}-${model}-${year}`.toLowerCase().replace(/\s+/g, "-"),
            name: model,
            vehicle_brand_id: {
              id: brand.id,
              name: brand.name,
              avatar: brand.logo,
            },
            mfg_year: year,
            transmission: Math.random() > 0.5 ? "Automatic" : "Manual",
            seat_capacity: Math.floor(Math.random() * 3) + 4, // 4-6 seats
            fuel_tank_capacity: `${Math.floor(Math.random() * 30) + 40}L`, // 40-70L
            power: `${Math.floor(Math.random() * 150) + 100}hp`, // 100-250hp
            vehicle_specification_ids: fallbackCategories
              .map((category) => ({
                id: category.toLowerCase(),
                display_name: category,
                used: Math.random() > 0.7,
              }))
              .filter((spec) => !spec.used),
            vehicle_image_ids: [
              {
                id: 1,
                name: `${brand.name} ${model}`,
                vehicle_image: `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(brand.name + " " + model)}`,
              },
            ],
          })
        })
      })
    })

    return vehicles
  }

  // Fetch vehicle data from API
  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        // Set a timeout to prevent hanging if the API is slow
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("API request timed out")), 8000),
        )

        // Try to fetch from the correct API endpoint based on the route handler
        try {
          const response = await Promise.race([fetch("/api/route-cr2oTR0wzuDyYzQXwsIg7BflzzVEf6"), timeoutPromise])

          if (!response.ok) {
            throw new Error(`API returned status: ${response.status}`)
          }

          const data = await response.json()
          console.log("Vehicle data fetched successfully:", data)

          if (Array.isArray(data) && data.length > 0) {
            setVehicleData(data)
            setApiError(false)
            setLoading(false)
            return
          } else {
            throw new Error("API returned empty or invalid data")
          }
        } catch (error) {
          console.error("Error fetching from GraphQL API:", error)
          // Continue to fallback
        }

        // If we reach here, the GraphQL API failed, try fallback endpoints
        const fallbackEndpoints = ["/api/vehicles", "/api/testdata", "/api/carsBrand"]

        for (const endpoint of fallbackEndpoints) {
          try {
            console.log(`Trying fallback endpoint: ${endpoint}`)
            const response = await Promise.race([fetch(endpoint), timeoutPromise])

            if (!response.ok) {
              throw new Error(`API returned status: ${response.status}`)
            }

            // Get the response as text first
            const text = await response.text()

            // Check if the response starts with HTML
            if (text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html")) {
              throw new Error("Response is HTML, not JSON")
            }

            // Try to parse as JSON
            try {
              const data = JSON.parse(text)
              if (Array.isArray(data) && data.length > 0) {
                console.log(`Vehicle data fetched successfully from ${endpoint}:`, data)
                setVehicleData(data)
                setApiError(false)
                setLoading(false)
                return
              }
            } catch (parseError) {
              throw new Error(`Invalid JSON response: ${parseError.message}`)
            }
          } catch (endpointError) {
            console.error(`Error fetching from ${endpoint}:`, endpointError)
            // Continue to the next endpoint
          }
        }

        // If we reach here, all API attempts failed, use fallback data
        throw new Error("All API endpoints failed")
      } catch (error) {
        console.error("Error fetching vehicle data:", error)
        setApiError(true)
        // Use fallback data
        const fallbackData = generateFallbackVehicleData()
        setVehicleData(fallbackData)
        setLoading(false)
      }
    }

    fetchVehicleData()
  }, [generateFallbackVehicleData]) // Added generateFallbackVehicleData to dependencies

  // Extract unique brands from vehicle data
  const extractedBrands =
    vehicleData.length > 0
      ? [
          ...new Map(
            vehicleData.map((vehicle) => {
              // Check if vehicle has the expected structure
              const brandId = vehicle.vehicle_brand_id?.id || vehicle.id
              const brandName = vehicle.vehicle_brand_id?.name || vehicle.name
              const brandLogo =
                vehicle.vehicle_brand_id?.avatar ||
                vehicle.avatar ||
                `/placeholder.svg?height=50&width=100&text=${encodeURIComponent(brandName)}`

              return [
                brandId,
                {
                  id: brandId,
                  name: brandName,
                  logo: brandLogo,
                },
              ]
            }),
          ).values(),
        ]
      : fallbackBrands

  // Extract unique models from vehicle data based on selected brand
  const extractedModels =
    vehicleData.length > 0 && selectedBrand
      ? vehicleData
          .filter((vehicle) => {
            const brandName = vehicle.vehicle_brand_id?.name || vehicle.name
            return brandName === selectedBrand
          })
          .map((vehicle) => vehicle.name || vehicle.model || "Unknown Model")
          .filter((value, index, self) => self.indexOf(value) === index)
      : selectedBrand
        ? fallbackModels[selectedBrand] || []
        : []

  // Extract unique categories (using vehicle_specification_ids as categories)
  const extractedCategories =
    vehicleData.length > 0
      ? vehicleData
          .flatMap((vehicle) => vehicle.vehicle_specification_ids || vehicle.specifications || [])
          .filter((spec) => spec && (spec.display_name || spec.name))
          .map((spec) => spec.display_name || spec.name)
          .filter((value, index, self) => self.indexOf(value) === index)
      : fallbackCategories

  // Extract unique manufacturing years
  const extractedYears =
    vehicleData.length > 0
      ? vehicleData
          .map((vehicle) => vehicle.mfg_year || vehicle.year)
          .filter(Boolean)
          .filter((value, index, self) => self.indexOf(value) === index)
          .sort((a, b) => b - a) // Sort in descending order (newest first)
      : fallbackYears

  const steps = [
    { id: 0, title: "Choose the brand", completed: false },
    { id: 1, title: "Select model", completed: false },
    { id: 2, title: "Select category", completed: false },
    { id: 3, title: "Select year of manufacture", completed: false },
    { id: 4, title: "The bank", completed: false },
  ]

  const banks = [
    {
      id: 1,
      name: "ANB",
      logo: "/placeholder.svg?height=50&width=100&text=ANB",
      fullName: "Arab National Bank",
    },
    {
      id: 2,
      name: "Tamwil",
      logo: "/placeholder.svg?height=50&width=100&text=Tamwil",
      fullName: "Car Financing",
    },
    {
      id: 3,
      name: "Riyad Bank",
      logo: "/placeholder.svg?height=50&width=100&text=Riyad+Bank",
      fullName: "Riyad Bank",
    },
    {
      id: 4,
      name: "NCB",
      logo: "/placeholder.svg?height=50&width=100&text=NCB",
      fullName: "National Commercial Bank",
    },
    {
      id: 5,
      name: "Bank Aljazira",
      logo: "/placeholder.svg?height=50&width=100&text=Bank+Aljazira",
      fullName: "Bank Aljazira",
    },
    {
      id: 6,
      name: "Alinma Bank",
      logo: "/placeholder.svg?height=50&width=100&text=Alinma+Bank",
      fullName: "Alinma Bank",
    },
    {
      id: 7,
      name: "Banque Saudi Fransi",
      logo: "/placeholder.svg?height=50&width=100&text=Banque+Saudi+Fransi",
      fullName: "Banque Saudi Fransi",
    },
    {
      id: 8,
      name: "Saudi Investment Bank",
      logo: "/placeholder.svg?height=50&width=100&text=Saudi+Investment+Bank",
      fullName: "The Saudi Investment Bank",
    },
  ]

  // Find selected vehicle based on selections
  const selectedVehicle = vehicleData.find((vehicle) => {
    try {
      return (
        (vehicle.vehicle_brand_id?.name === selectedBrand || vehicle.name === selectedBrand) &&
        (vehicle.name === selectedModel || vehicle.model === selectedModel) &&
        (selectedYear ? vehicle.mfg_year === selectedYear || vehicle.year === selectedYear : true)
      )
    } catch (error) {
      return false
    }
  })

  const handleBack = () => {
    if (paymentMethod === "finance" && activeStep > 0) {
      // If we're showing the result and going back, reset showResult
      if (showResult) {
        setShowResult(false)
        return
      }

      setActiveStep(activeStep - 1)
      if (activeStep === 1) {
        setSelectedModel(null)
      } else if (activeStep === 2) {
        setSelectedCategory(null)
      } else if (activeStep === 3) {
        setSelectedYear(null)
      } else if (activeStep === 4) {
        setSelectedBank(null)
      }
    } else if (paymentMethod === "finance" && activeStep === 0) {
      setPaymentMethod("")
      setSelectedBrand(null)
      setSelectedModel(null)
      setSelectedCategory(null)
      setSelectedYear(null)
      setSelectedBank(null)
      setShowResult(false)
    }
  }

  const handleBankSelection = (bank) => {
    setSelectedBank(bank)
    setShowResult(true)
  }

  const renderResult = () => {
    return (
      <div className="p-8 pt-12 md:w-2/3 bg-[#f0e6f5]">
        <div className="space-y-8">
          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2">
            {selectedBrand && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-brand/20 text-sm text-brand">
                {selectedBrand}
              </div>
            )}
            {selectedModel && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-brand/20 text-sm text-brand">
                {selectedModel}
              </div>
            )}
            {selectedCategory && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-brand/20 text-sm text-brand">
                {selectedCategory}
              </div>
            )}
            {selectedYear && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-brand/20 text-sm text-brand">
                {selectedYear}
              </div>
            )}
            {selectedBank && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-brand/20 text-sm text-brand">
                {selectedBank.name}
              </div>
            )}
          </div>

          {/* Car Details */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-brand-dark">
              {selectedBrand} {selectedModel}
            </h2>
            <p className="text-brand">
              {selectedYear} {selectedCategory}
            </p>
            {selectedVehicle && (
              <div className="text-sm text-brand-dark/70 mt-2">
                {selectedVehicle.transmission && <p>Transmission: {selectedVehicle.transmission}</p>}
                {selectedVehicle.seat_capacity && <p>Seats: {selectedVehicle.seat_capacity}</p>}
                {selectedVehicle.fuel_tank_capacity && <p>Fuel Capacity: {selectedVehicle.fuel_tank_capacity}</p>}
                {selectedVehicle.power && <p>Power: {selectedVehicle.power}</p>}
              </div>
            )}
          </div>

          {/* Car Image */}
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-white p-4">
            <img
              src={
                selectedVehicle?.vehicle_image_ids?.[0]?.vehicle_image ||
                `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(selectedBrand + " " + selectedModel) || "/placeholder.svg"}`
              }
              alt={`${selectedBrand} ${selectedModel}`}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(selectedBrand + " " + selectedModel)}`
              }}
            />
          </div>

          {/* Car Details Button */}
          <div className="text-center">
            <button
              className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors"
              onClick={() => console.log("View car details")}
            >
              Car details
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-2 text-brand">Loading brands...</p>
              </div>
            ) : (
              <>
                {apiError && (
                  <div className="col-span-full mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
                    <p>Using offline data. Some features may be limited.</p>
                  </div>
                )}
                {extractedBrands.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => {
                      setSelectedBrand(brand.name)
                      setActiveStep(1)
                    }}
                    className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-center"
                  >
                    <img
                      src={brand.logo || `/placeholder.svg?height=50&width=100&text=${encodeURIComponent(brand.name)}`}
                      alt={brand.name}
                      className="h-8 object-contain"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = `/placeholder.svg?height=50&width=100&text=${encodeURIComponent(brand.name)}`
                      }}
                    />
                  </button>
                ))}
              </>
            )}
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search Model"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-brand/20 focus:outline-none focus:border-brand"
              />
            </div>

            {selectedBrand && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-brand/20 text-sm text-brand">
                {selectedBrand}
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {extractedModels
                .filter((model) => model.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((model) => (
                  <button
                    key={model}
                    onClick={() => {
                      setSelectedModel(model)
                      setActiveStep(2)
                    }}
                    className="p-4 bg-white rounded-lg border border-brand/10 hover:border-brand/30 transition-colors text-brand-dark"
                  >
                    {model}
                  </button>
                ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search category"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-brand/20 focus:outline-none focus:border-brand"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedBrand && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-brand/20 text-sm text-brand">
                  {selectedBrand}
                </div>
              )}
              {selectedModel && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-brand/20 text-sm text-brand">
                  {selectedModel}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {extractedCategories
                .filter((category) => category.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category)
                      setActiveStep(3)
                    }}
                    className="p-4 bg-white rounded-lg border border-brand/10 hover:border-brand/30 transition-colors text-brand-dark"
                  >
                    {category}
                  </button>
                ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search year"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-brand/20 focus:outline-none focus:border-brand"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedBrand && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-brand/20 text-sm text-brand">
                  {selectedBrand}
                </div>
              )}
              {selectedModel && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-brand/20 text-sm text-brand">
                  {selectedModel}
                </div>
              )}
              {selectedCategory && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-brand/20 text-sm text-brand">
                  {selectedCategory}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {extractedYears
                .filter((year) => year.toString().includes(searchQuery))
                .map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year)
                      setActiveStep(4)
                    }}
                    className="p-4 bg-white rounded-lg border border-brand/10 hover:border-brand/30 transition-colors text-brand-dark"
                  >
                    {year}
                  </button>
                ))}
            </div>
          </div>
        )

      case 4:
        if (showResult) {
          return renderResult()
        }
        return (
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search bank"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-brand/20 focus:outline-none focus:border-brand"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedBrand && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-brand/20 text-sm text-brand">
                  {selectedBrand}
                </div>
              )}
              {selectedModel && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-brand/20 text-sm text-brand">
                  {selectedModel}
                </div>
              )}
              {selectedCategory && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-brand/20 text-sm text-brand">
                  {selectedCategory}
                </div>
              )}
              {selectedYear && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-brand/20 text-sm text-brand">
                  {selectedYear}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {banks
                .filter(
                  (bank) =>
                    bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    bank.fullName.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .map((bank) => (
                  <button
                    key={bank.id}
                    onClick={() => handleBankSelection(bank)}
                    className="p-4 bg-white rounded-lg border border-brand/10 hover:border-brand/30 transition-shadow hover:shadow-md duration-200 flex items-center justify-center"
                  >
                    <img
                      src={bank.logo || "/placeholder.svg"}
                      alt={bank.fullName}
                      className="h-8 object-contain"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = `/placeholder.svg?height=50&width=100&text=${encodeURIComponent(bank.name)}`
                      }}
                    />
                  </button>
                ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (!paymentMethod) {
    return (
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto rounded-xl overflow-hidden">
        <div className="p-8 md:w-1/2 bg-brand/10">
          <h1 className="text-3xl font-bold text-brand-dark mb-1">Find Your Perfect Car</h1>
          <h2 className="text-3xl font-bold text-brand-dark mb-6">in Simple Steps</h2>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-brand-dark mb-2">Choose Payment Method</h3>
            <p className="text-sm text-brand mb-4">
              Choose the way that suits you to own your new car whether through convenient financing or direct cash
              payment.
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setPaymentMethod("cash")}
                className="px-6 py-2 rounded-lg border bg-transparent border-brand/30 hover:bg-white hover:border-brand transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-brand"></div>
                  <span className="text-brand-dark">Cash</span>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod("finance")}
                className="px-6 py-2 rounded-lg border bg-transparent border-brand/30 hover:bg-white hover:border-brand transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-brand"></div>
                  <span className="text-brand-dark">Finance</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 md:w-1/2 flex items-center justify-center bg-[#f0e6f5]">
          <div className="relative w-64 h-64">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-brand/10 flex items-center justify-center z-10">
              <Car className="w-10 h-10 text-brand" />
            </div>

            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 text-center">
              <div className="w-16 h-16 rounded-full bg-brand/10 mx-auto flex items-center justify-center mb-1">
                <Car className="w-8 h-8 text-brand" />
              </div>
              <p className="text-xs text-brand-dark font-medium">Compare & Explore</p>
            </div>

            <div className="absolute top-1/2 right-0 transform translate-x-1/4 -translate-y-1/2 text-center">
              <div className="w-16 h-16 rounded-full bg-brand/10 mx-auto flex items-center justify-center mb-1">
                <Search className="w-8 h-8 text-brand" />
              </div>
              <p className="text-xs text-brand-dark font-medium">
                Discover
                <br />
                Car
              </p>
            </div>

            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/4 text-center">
              <div className="w-16 h-16 rounded-full bg-brand/10 mx-auto flex items-center justify-center mb-1">
                <Tag className="w-8 h-8 text-brand" />
              </div>
              <p className="text-xs text-brand-dark font-medium">
                Get Suitable
                <br />
                Price
              </p>
            </div>

            <div className="absolute top-1/2 left-0 transform -translate-x-1/4 -translate-y-1/2 text-center">
              <div className="w-16 h-16 rounded-full bg-brand/10 mx-auto flex items-center justify-center mb-1">
                <Truck className="w-8 h-8 text-brand" />
              </div>
              <p className="text-xs text-brand-dark font-medium">Car Home Delivery</p>
            </div>

            <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-dashed border-brand/30"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto rounded-xl overflow-hidden">
      {paymentMethod === "cash" ? (
        <>
          <div className="p-8 md:w-1/2 bg-brand/10">
            <h1 className="text-3xl font-bold text-brand-dark mb-1">Find Your Perfect Car</h1>
            <h2 className="text-3xl font-bold text-brand-dark mb-6">in Simple Steps</h2>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-brand-dark mb-2">Choose Payment Method</h3>
              <p className="text-sm text-brand mb-4">
                Choose the way that suits you to own your new car whether through convenient financing or direct cash
                payment.
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setPaymentMethod("cash")}
                  className="px-6 py-2 rounded-lg border bg-white border-brand"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-brand bg-brand">
                      <div className="w-2 h-2 rounded-full bg-white mx-auto mt-1"></div>
                    </div>
                    <span className="text-brand-dark">Cash</span>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod("finance")}
                  className="px-6 py-2 rounded-lg border bg-transparent border-brand/30"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-brand"></div>
                    <span className="text-brand-dark">Finance</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="p-8 md:w-1/2 flex items-center justify-center bg-[#f0e6f5]">
            <div className="relative w-64 h-64">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-brand/10 flex items-center justify-center z-10">
                <Car className="w-10 h-10 text-brand" />
              </div>

              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 text-center">
                <div className="w-16 h-16 rounded-full bg-brand/10 mx-auto flex items-center justify-center mb-1">
                  <Car className="w-8 h-8 text-brand" />
                </div>
                <p className="text-xs text-brand-dark font-medium">Compare & Explore</p>
              </div>

              <div className="absolute top-1/2 right-0 transform translate-x-1/4 -translate-y-1/2 text-center">
                <div className="w-16 h-16 rounded-full bg-brand/10 mx-auto flex items-center justify-center mb-1">
                  <Search className="w-8 h-8 text-brand" />
                </div>
                <p className="text-xs text-brand-dark font-medium">
                  Discover
                  <br />
                  Car
                </p>
              </div>

              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/4 text-center">
                <div className="w-16 h-16 rounded-full bg-brand/10 mx-auto flex items-center justify-center mb-1">
                  <Tag className="w-8 h-8 text-brand" />
                </div>
                <p className="text-xs text-brand-dark font-medium">
                  Get Suitable
                  <br />
                  Price
                </p>
              </div>

              <div className="absolute top-1/2 left-0 transform -translate-x-1/4 -translate-y-1/2 text-center">
                <div className="w-16 h-16 rounded-full bg-brand/10 mx-auto flex items-center justify-center mb-1">
                  <Truck className="w-8 h-8 text-brand" />
                </div>
                <p className="text-xs text-brand-dark font-medium">Car Home Delivery</p>
              </div>

              <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-dashed border-brand/30"></div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col md:flex-row w-full relative">
          <button
            onClick={handleBack}
            className="absolute top-0 left-0 p-4 hover:bg-brand/5 rounded-br-xl transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6 text-brand" />
            <span className="sr-only">Go back</span>
          </button>

          <div className="p-8 md:w-1/3 border-r border-brand/10 bg-brand/10">
            <div className="relative mt-12">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-start mb-8 relative">
                  <div className="flex flex-col items-center mr-4">
                    <div
                      className={`w-10 h-10 flex items-center justify-center relative overflow-visible
                        ${
                          index < activeStep || (index === 4 && showResult && selectedBank)
                            ? ""
                            : index === activeStep
                              ? "bg-brand text-white rounded-lg"
                              : "bg-brand/10 text-brand/30 rounded-lg"
                        }`}
                    >
                      {index < activeStep || (index === 4 && showResult && selectedBank) ? (
                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="24" height="24" rx="5" fill="#D4CBD6" />
                          <path
                            d="M4.67195 0.0805694C7.03552 -0.150928 9.70639 0.20298 12.1013 0.0772385C13.5792 0.466122 13.4754 2.5546 11.9241 2.73613C9.78548 2.98678 7.20853 2.56542 5.02208 2.7403C3.97828 2.82357 3.08937 3.57136 2.75489 4.5623C2.51104 9.30301 2.72194 14.0979 2.64697 18.8577C2.73759 20.1693 3.68912 21.1336 4.96276 21.3168L18.6548 21.3193C19.8197 21.2227 20.852 20.2708 21.011 19.0884C21.2895 17.0099 20.8413 14.386 21.025 12.2459C21.17 10.5521 23.2823 10.4222 23.6736 12.0044C23.5501 14.331 23.8582 16.8642 23.6778 19.1658C23.4809 21.6798 21.3686 23.7691 18.8987 23.9965L4.83754 23.9998C2.28531 23.7708 0.257859 21.7381 0 19.1658L0.00576682 4.83877C0.257859 2.40221 2.23918 0.318729 4.67195 0.0805694Z"
                            fill="#46194F"
                          />
                          <path
                            d="M23.4779 1.3871C24.5819 1.24387 25.3167 2.35556 24.862 3.34651C20.9661 7.51763 16.8387 11.4872 12.8571 15.5843C12.1544 16.1697 11.5703 16.1971 10.8511 15.6151C9.29566 13.8347 7.23773 12.235 5.73177 10.4422C4.5232 9.00322 5.88006 7.40105 7.40003 8.31955L11.8611 12.773L22.8749 1.65024C23.0339 1.51035 23.2695 1.41458 23.4779 1.3871Z"
                            fill="#46194F"
                          />
                        </svg>
                      ) : (
                        <span className="text-inherit">{index + 1}</span>
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`h-8 w-0.5 ${index < activeStep ? "bg-brand" : "bg-brand/10"}`}></div>
                    )}
                  </div>
                  <div className="pt-2">
                    <h3
                      className={`text-sm font-medium ${
                        index === activeStep ? "text-brand-dark" : index < activeStep ? "text-brand" : "text-brand/30"
                      }`}
                    >
                      {step.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 md:w-2/3 bg-[#f0e6f5]">{renderStepContent()}</div>
        </div>
      )}
    </div>
  )
}

