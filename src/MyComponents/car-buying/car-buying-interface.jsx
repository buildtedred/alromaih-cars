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
  const [selectedCar, setSelectedCar] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cars, setCars] = useState([])

  // Derived data from API response
  const [carBrands, setCarBrands] = useState([])
  const [carModels, setCarModels] = useState({})
  const [carCategories, setCarCategories] = useState([])
  const [carYears, setCarYears] = useState([])

  // Fetch car data from API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://67c7bf7cc19eb8753e7a9248.mockapi.io/api/profile")

        if (!response.ok) {
          throw new Error("Failed to fetch car data")
        }

        const data = await response.json()
        setCars(data)

        // Extract unique brands, models, categories, and years
        const brands = [...new Set(data.map((car) => car.brand))]
        setCarBrands(brands)

        const categories = [...new Set(data.map((car) => car.category))]
        setCarCategories(categories)

        const years = [...new Set(data.map((car) => car.year))]
        setCarYears(years.sort((a, b) => b - a)) // Sort years in descending order

        // Group models by brand
        const modelsByBrand = {}
        brands.forEach((brand) => {
          modelsByBrand[brand] = [...new Set(data.filter((car) => car.brand === brand).map((car) => car.model))]
        })
        setCarModels(modelsByBrand)

        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setLoading(false)
      }
    }

    fetchCars()
  }, [])

  const steps = [
    { id: 0, title: "Choose the brand", completed: false },
    { id: 1, title: "Select model", completed: false },
    { id: 2, title: "Select category", completed: false },
  ]

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
      }
    } else if (paymentMethod === "finance" && activeStep === 0) {
      setPaymentMethod("")
      setSelectedBrand(null)
      setSelectedModel(null)
      setSelectedCategory(null)
      setSelectedCar(null)
      setShowResult(false)
    }
  }

  const handleCarSelection = () => {
    // Find the car that matches the selected criteria
    const matchedCar = cars.find(
      (car) => car.brand === selectedBrand && car.model === selectedModel && car.category === selectedCategory,
    )

    if (matchedCar) {
      setSelectedCar(matchedCar)
      setShowResult(true)
    }
  }

  const renderResult = () => {
    if (!selectedCar) return null

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
          </div>

          {/* Car Details */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-brand-dark">
              {selectedCar.brand} {selectedCar.model}
            </h2>
            <p className="text-brand">
              {selectedCar.year} {selectedCar.category}
            </p>
            <p className="text-xl font-bold text-brand-dark">${selectedCar.price.toLocaleString()}</p>
          </div>

          {/* Car Image */}
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-white p-4">
            <img
              src={selectedCar.image || "/placeholder.svg"}
              alt={`${selectedCar.brand} ${selectedCar.model}`}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Car Specifications */}
          <div className="bg-white rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-bold text-brand-dark">Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Engine</p>
                <p className="font-medium">{selectedCar.specifications.engine}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Horsepower</p>
                <p className="font-medium">{selectedCar.specifications.horsepower} hp</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Transmission</p>
                <p className="font-medium">{selectedCar.specifications.transmission}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Drivetrain</p>
                <p className="font-medium">{selectedCar.specifications.drivetrain}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Top Speed</p>
                <p className="font-medium">{selectedCar.specifications.top_speed} km/h</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Fuel Type</p>
                <p className="font-medium">{selectedCar.specifications.fuel_type}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Mileage</p>
                <p className="font-medium">{selectedCar.mileage.toLocaleString()} km</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Color</p>
                <p className="font-medium">{selectedCar.color}</p>
              </div>
            </div>
          </div>

          {/* Additional Images */}
          {selectedCar.additional_images && selectedCar.additional_images.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-brand-dark">More Images</h3>
              <div className="grid grid-cols-2 gap-4">
                {selectedCar.additional_images.map((img, index) => (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden bg-white">
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`${selectedCar.brand} ${selectedCar.model} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Car Details Button */}
          <div className="text-center">
            <button
              className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors"
              onClick={() => console.log("View car details")}
            >
              Contact Dealer
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderStepContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-brand text-white rounded-lg">
              Retry
            </button>
          </div>
        </div>
      )
    }

    if (showResult && selectedCar) {
      return renderResult()
    }

    switch (activeStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search brand"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-brand/20 focus:outline-none focus:border-brand"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {carBrands
                .filter((brand) => brand.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((brand) => (
                  <button
                    key={brand}
                    onClick={() => {
                      setSelectedBrand(brand)
                      setActiveStep(1)
                    }}
                    className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-center"
                  >
                    <span className="font-medium">{brand}</span>
                  </button>
                ))}
            </div>
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

            <div className="flex flex-wrap gap-2">
              {selectedBrand && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-brand/20 text-sm text-brand">
                  {selectedBrand}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {selectedBrand &&
                carModels[selectedBrand]
                  ?.filter((model) => model.toLowerCase().includes(searchQuery.toLowerCase()))
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
              {carCategories
                .filter((category) => category.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category)
                      handleCarSelection()
                    }}
                    className="p-4 bg-white rounded-lg border border-brand/10 hover:border-brand/30 transition-colors text-brand-dark"
                  >
                    {category}
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
                          index < activeStep || (index === 2 && showResult && selectedCar)
                            ? ""
                            : index === activeStep
                              ? "bg-brand text-white rounded-lg"
                              : "bg-brand/10 text-brand/30 rounded-lg"
                        }`}
                    >
                      {index < activeStep || (index === 2 && showResult && selectedCar) ? (
                        <svg
                          width="25"
                          height="24"
                          viewBox="0 0 25 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-brand"
                        >
                          <path
                            d="M4.67195 0.0805694C7.03552 -0.150928 9.70639 0.20298 12.1013 0.0772385C13.5792 0.466122 13.4754 2.5546 11.9241 2.73613C9.78548 2.98678 7.20853 2.56542 5.02208 2.7403C3.97828 2.82357 3.08937 3.57136 2.75489 4.5623C2.51104 9.30301 2.72194 14.0979 2.64697 18.8577C2.73759 20.1693 3.68912 21.1336 4.96276 21.3168L18.6548 21.3193C19.8197 21.2227 20.852 20.2708 21.011 19.0884C21.2895 17.0099 20.8413 14.386 21.025 12.2459C21.17 10.5521 23.2823 10.4222 23.6736 12.0044C23.5501 14.331 23.8582 16.8642 23.6778 19.1658C23.4809 21.6798 21.3686 23.7691 18.8987 23.9965L4.83754 23.9998C2.28531 23.7708 0.257859 21.7381 0 19.1658L0.00576682 4.83877C0.257859 2.40221 2.23918 0.318729 4.67195 0.0805694Z"
                            fill="currentColor"
                          />
                          <path
                            d="M23.4779 1.38704C24.5819 1.24381 25.3167 2.3555 24.862 3.34645C20.9661 7.51757 16.8387 11.4872 12.8571 15.5842C12.1544 16.1696 11.5703 16.1971 10.8511 15.615C9.29566 13.8346 7.23773 12.235 5.73177 10.4421C4.5232 9.00315 5.88006 7.40099 7.40003 8.31949L11.8611 12.7729L22.8749 1.65018C23.0339 1.51028 23.2695 1.41452 23.4779 1.38704Z"
                            fill="currentColor"
                          />
                        </svg>
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-0.5 h-8 ${index < activeStep ? "bg-brand" : "bg-brand/20"}`} />
                    )}
                  </div>
                  <div className={`flex-1 pt-2 ${index === activeStep ? "" : "opacity-50"}`}>
                    <h4 className="text-sm font-medium text-brand-dark">{step.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 pt-12 md:w-2/3 bg-[#f0e6f5]">{renderStepContent()}</div>
        </div>
      )}
    </div>
  )
}

