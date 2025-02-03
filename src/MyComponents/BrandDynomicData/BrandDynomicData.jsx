"use client"
import { useState, useEffect } from "react"
import { Link } from "@/i18n/routing"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Heart, Calendar, Droplet, ChevronLeft, Gift, Filter, ChevronDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const BrandDynomicData = ({ carDetails }) => {
  const pathname = usePathname()
  const isEnglish = pathname.startsWith("/en")
  const [selectedModels, setSelectedModels] = useState([])
  const [selectedYears, setSelectedYears] = useState([])
  const [filteredCars, setFilteredCars] = useState([])

  useEffect(() => {
    if (carDetails && carDetails.data) {
      const allCars = carDetails.data.flatMap((brand) => brand.car_models)
      setFilteredCars(allCars)
    }
  }, [carDetails])

  const handleModelFilter = (modelId) => {
    const updatedModels = selectedModels.includes(modelId)
      ? selectedModels.filter((id) => id !== modelId)
      : [...selectedModels, modelId]
    setSelectedModels(updatedModels)
    applyFilters(updatedModels, selectedYears)
  }

  const handleYearFilter = (year) => {
    const updatedYears = selectedYears.includes(year)
      ? selectedYears.filter((y) => y !== year)
      : [...selectedYears, year]
    setSelectedYears(updatedYears)
    applyFilters(selectedModels, updatedYears)
  }

  const applyFilters = (models, years) => {
    const allCars = carDetails.data.flatMap((brand) => brand.car_models)
    const filtered = allCars.filter(
      (car) =>
        (models.length === 0 || models.includes(car.id)) &&
        (years.length === 0 || years.includes(car.year_of_manufacture)),
    )
    setFilteredCars(filtered)
  }

  const handleFavorite = (e, carId) => {
    e.preventDefault()
    console.log("Favorite clicked for car ID:", carId)
    // Add your logic to handle favorites here
  }

  if (!carDetails || !carDetails.data) {
    return <div className="text-center py-8">No car details available.</div>
  }

  const years = [
    ...new Set(carDetails.data.flatMap((brand) => brand.car_models.map((car) => car.year_of_manufacture))),
  ].sort((a, b) => b - a)

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 md:px-12 lg:px-[9rem]">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#71308A]">
        {isEnglish ? "Our Car Collection" : "مجموعة سياراتنا"}
      </h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <MobileSidebar>
          <Sidebar
            brands={carDetails.data}
            selectedModels={selectedModels}
            selectedYears={selectedYears}
            handleModelFilter={handleModelFilter}
            handleYearFilter={handleYearFilter}
            years={years}
            isEnglish={isEnglish}
          />
        </MobileSidebar>
        <div className="hidden lg:block w-full lg:w-64 mb-6 lg:mb-0 flex-shrink-0">
          <Sidebar
            brands={carDetails.data}
            selectedModels={selectedModels}
            selectedYears={selectedYears}
            handleModelFilter={handleModelFilter}
            handleYearFilter={handleYearFilter}
            years={years}
            isEnglish={isEnglish}
          />
        </div>
        <div className="flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} isEnglish={isEnglish} handleFavorite={handleFavorite} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const Sidebar = ({ brands, selectedModels, selectedYears, handleModelFilter, handleYearFilter, years, isEnglish }) => (
  <div className="w-full">
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4 text-[#71308A]">{isEnglish ? "Filters" : "التصفية"}</h2>
        <Collapsible>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left font-medium text-[#71308A] mb-2">
            {isEnglish ? "Filter by Model" : "تصفية حسب الموديل"}
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            {brands.map((brand) => (
              <div key={brand.id} className="mb-4">
                <h3 className="font-medium mb-2 text-[#71308A]">
                  {isEnglish ? brand.name.en.name : brand.name.ar.name}
                </h3>
                {brand.car_models.map((model) => (
                  <div key={model.id} className="flex items-center mb-2">
                    <Checkbox
                      id={`model-${model.id}`}
                      checked={selectedModels.includes(model.id)}
                      onCheckedChange={() => handleModelFilter(model.id)}
                    />
                    <Label htmlFor={`model-${model.id}`} className="ml-2">
                      {isEnglish ? model.name.en.name : model.name.ar.name}
                    </Label>
                  </div>
                ))}
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
        <Collapsible className="mt-4">
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left font-medium text-[#71308A] mb-2">
            {isEnglish ? "Filter by Year" : "تصفية حسب السنة"}
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            {years.map((year) => (
              <div key={year} className="flex items-center mb-2">
                <Checkbox
                  id={`year-${year}`}
                  checked={selectedYears.includes(year)}
                  onCheckedChange={() => handleYearFilter(year)}
                />
                <Label htmlFor={`year-${year}`} className="ml-2">
                  {year}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  </div>
)

const CarCard = ({ car, isEnglish, handleFavorite }) => (
  <div className="relative group">
    <Link href={`/car-details/${isEnglish ? car.name.en.slug : car.name.ar.slug}`} className="absolute inset-0 z-10">
      <span className="sr-only">View</span>
    </Link>
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full">
      <div className="relative overflow-hidden">
        <div className="relative w-full pt-[56.25%]">
          <Image
            src={car.image_url ? `https://xn--mgbml9eg4a.com${car.image_url}` : "/default-car.jpg"}
            alt={isEnglish ? car.name.en.name : car.name.ar.name || "car name"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            className="transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>
        <span className="absolute top-2 right-2 bg-[#71308A] text-white px-3 py-1 rounded-full text-xs font-semibold">
          {isEnglish ? car.name.en.condition : car.name.ar.condition}
        </span>
        <button
          className="absolute top-2 left-2 bg-white rounded-full p-2 shadow-md z-20 hover:bg-gray-100 transition-colors"
          onClick={(e) => handleFavorite(e, car.id)}
        >
          <Heart className={`w-5 h-5 ${false ? "fill-[#71308A] text-[#71308A]" : "text-gray-600"}`} />
        </button>
        {car.discount && (
          <div className="absolute bottom-2 left-2 bg-red-500 text-white rounded-full px-3 py-1 shadow-md z-10 flex items-center justify-center">
            <Gift className="w-4 h-4 mr-1" />
            <span className="text-xs font-bold">{car.name.en.discount}</span>
          </div>
        )}
      </div>
      <div className="p-4 rtl">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 truncate">
            {isEnglish ? car.name.en.name : car.name.ar.name}
          </h2>
          <div className="text-lg font-bold text-[#71308A]">{car.price}</div>
        </div>
        <div className="text-sm text-gray-600 mb-3">{car.monthlyInstallment}</div>
        <div className="flex justify-between items-center mb-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{car.year_of_manufacture}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[#71308A]">{isEnglish ? car.name.en.condition : car.name.ar.condition}</span>
          </div>
          <div className="flex items-center gap-1">
            <Droplet className="w-4 h-4" />
            {car?.vehicle_fuel_types?.map((fuelType, index) => (
              <span key={index}>{isEnglish ? fuelType.fuel_type.en : fuelType.fuel_type.ar}</span>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <button
            className="text-[#71308A] hover:text-[#5a2670] text-xs flex items-center gap-1 transition-colors duration-300 whitespace-nowrap"
            onClick={(e) => e.preventDefault()}
          >
            <ChevronLeft className="w-3 h-3 flex-shrink-0 rtl:rotate-180" />
            <span className="truncate">{isEnglish ? "View details" : "عرض التفاصيل"}</span>
          </button>
          <div className="text-xs text-[#71308A] whitespace-nowrap flex-shrink-0 ml-2">
            {isEnglish ? `${car.interestedPeople} interested` : `${car.interestedPeople} مهتم`}
          </div>
        </div>
      </div>
    </div>
  </div>
)

const MobileSidebar = ({ children }) => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="outline" className="lg:hidden mb-4">
        <Filter className="mr-2 h-4 w-4" /> Filters
      </Button>
    </SheetTrigger>
    <SheetContent side="left">
      <SheetHeader>
        <SheetTitle>Filters</SheetTitle>
        <SheetDescription>Apply filters to refine your car search</SheetDescription>
      </SheetHeader>
      {children}
    </SheetContent>
  </Sheet>
)

export default BrandDynomicData

