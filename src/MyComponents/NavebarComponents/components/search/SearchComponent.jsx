"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog } from "@/components/ui/dialog"
import carsData from "@/app/api/mock-data"
import searchIcon from "../../../../../public/icons/search.svg"
import Image from "next/image"
import { useLanguageContext } from "@/contexts/LanguageSwitcherContext"
import { useDetailContext } from "@/contexts/detailProvider"
import { usePathname, useRouter } from "next/navigation"

export default function SearchComponent({ isVisible, onClose }) {
  const {isEnglish}=useLanguageContext()
    const { setcar_Details, loading } = useDetailContext();
  const [searchQuery, setSearchQuery] = useState("")
  const [cars, setCars] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedCar, setSelectedCar] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showCarDetails, setShowCarDetails] = useState(false)
  const [tags, setTags] = useState([])
  const [inputValue, setInputValue] = useState("")

    const router = useRouter();
    const pathname = usePathname();
    const pathLocale = pathname.startsWith("/ar") ? "ar" : "en";
    const currentLocale = pathLocale || locale;
    // Use either the detected path locale or th


  const KeyCodes = {
    comma: 188,
    enter: 13,
  }
  const delimiters = [KeyCodes.comma, KeyCodes.enter]

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      addTag(inputValue)
      setInputValue("")
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      // Remove the last tag
      removeTag(tags[tags.length - 1].id)
    }
  }

  const addTag = (text) => {
    const newTag = {
      id: Date.now().toString(),
      text: text.trim(),
    }
    setTags([...tags, newTag])
  }

  const removeTag = (id) => {
    setTags(tags.filter((tag) => tag.id !== id))
  }

  useEffect(() => {
    if (isVisible) {
      setIsLoading(true)
      setTimeout(() => {
        setCars(carsData)
        setIsLoading(false)
      }, 500)
    }
  }, [isVisible])

  // Update searchQuery whenever tags change
  useEffect(() => {
    if (tags.length > 0) {
      setSearchQuery(tags.map(tag => tag.text).join(" "))
    } else {
      setSearchQuery("")
    }
  }, [tags])

  const uniqueBrands = Object.values(
    cars.reduce((acc, car) => {
      if (!acc[car.brand]) {
        acc[car.brand] = { ...car, count: 1 };
      } else {
        acc[car.brand].count += 1;
      }
      return acc;
    }, {})
  )

  const filteredBrands = tags.length === 0
    ? uniqueBrands
    : uniqueBrands.filter((car) => {
      return tags.some((tag) => {
        const search = tag.text.toLowerCase()
        return (
          car.brand.toLowerCase().includes(search) ||
          car.name.en.toLowerCase().includes(search)
        )
      })
    })



  const brandGroups = filteredBrands.map((brandItem) => {
    const brandCars = cars.filter(
      (car) => car.brand?.toLowerCase() === brandItem.brand?.toLowerCase()
    )
    return {
      ...brandItem,
      cars: brandCars,
    }
  })
  const handleCarSelect = (car) => {
    setSelectedCar(car)
    const brandName = car.brand

    // Check if tag already exists
    const alreadyExists = tags.some(tag => tag.text.toLowerCase() === brandName.toLowerCase())
    if (!alreadyExists) {
      addTag(brandName)
    }

    if (isMobile) setShowCarDetails(true)
  }

  const handleViewDetails = (car) => {
    router.push(`/${currentLocale}/car-details/${car.id}`);
    setcar_Details(car);
  };
  return (
    <Dialog className="" open={isVisible} onOpenChange={(open) => !open && onClose()}>
      <div
        className="fixed inset-0 md:h-[70vh] overflow-y-scroll container mx-auto z-[1000] bg-white"


      >
        <div onClick={onClose} className="cursor-pointer absolute top-3 right-3 z-50 w-7 h-7 flex items-center justify-center rounded-full transition-all duration-300 border border-brand-primary/20 hover:bg-brand-light">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </div>
        <div className="flex flex-col ">
          <div className="p-4 border-b border-gray-200 mt-10 ">
            <div className="relative flex justify-center ">
              <div className="relative w-full md:w-[600px] lg:w-[871px] bg-white rounded-[10px] border border-brand-primary flex items-center px-3 py-2">
                {/* <Search className="text-gray-400 w-4 h-4 mr-2 shrink-0" /> */}
                <img
                    src="/icons/search.svg"
                    alt="search icon"
                    className="h-[32px] w-[32px]  p-2"
                  />

                <div className="flex flex-wrap gap-2 items-center flex-1 ">
                  {tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center gap-1 bg-brand-primary  text-white px-2 py-1 rounded-[10px] text-sm"
                    >
                      <span>{tag.text}</span>
                      <button onClick={() => removeTag(tag.id)} className="hover:bg-purple-800 rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 outline-none border-none bg-transparent min-w-[120px] border border-brand-primary "
                    placeholder={
                      tags.length === 0
                        ? isEnglish
                          ? "Choose a model"
                          : "اختر الموديل"
                        : ""
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {searchQuery && tags.length > 0 ? (
            <div className="space-y-4">
              {brandGroups.map((group) => (
                <div
                  key={group.brand}
                  className=" items-center grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 bg-white shadow-sm p-4"

                >
                  {/* Left: Brand */}
                  <div
                  key={group.brand}
                  className={`shadow-lg h-[80px] md:h-[100px] rounded-[10px] flex items-center gap-2 p-2 cursor-pointer transition-colors text-sm ${selectedCar?.brand === group.brand
                    ? "bg-brand-primary/10"
                    : "hover:bg-gray-50 hover:border-[1px] border-brand-primary"
                  }`}
                  onClick={() => handleCarSelect(group)}
                >
                  <img
                    src={group.brandLogo || "/placeholder.svg"}
                    alt={group.name.en}
                    className="h-[72px] w-[72px] border-2 border-brand-primary rounded-full p-2"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium truncate text-brand-primary">{group.brand}</h4>
                    <p className="text-xs text-brand-primary truncate">{group.count} cars</p>
                  </div>
                </div>

                  {/* Middle: Separator */}
                  {/* <div className="hidden md:block w-px bg-gray-300" /> */}

                  {/* Right: Cars */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {group.cars.map((car) => (
                      <div
                      onClick={() => {
                        handleViewDetails(car);
                        onClose();
                      }}
                        key={car.id}
                        className="shadow-lg hover:bg-gray-50 hover:border-[1px] border-brand-primary rounded-[10px] flex items-center gap-2 p-2 cursor-pointer transition-colors text-sm"
                      >
                        <Image
                          src={car.image || "/placeholder.svg"}
                          alt={car.name.en}
                          width={72}
                          height={72}
                          className="h-[72px] w-[72px] border-2 border-brand-primary rounded-full object-cover"

                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium truncate text-brand-primary">{isEnglish ? car.name.en:car.name.ar}</h4>
                          <p className="text-xs text-brand-primary truncate">{car.cashPrice}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

            </div>
          ) : (
            // Default (no search) brands
            <div className="p-4 grid sm:grid-cols-2 md:grid-cols-4 gap-3">
              {filteredBrands.map((car) => (
                <div
                  key={car.brand}
                  className={`rounded-[10px] flex items-center gap-2 p-2 cursor-pointer transition-colors text-sm ${selectedCar?.brand === car.brand
                    ? "bg-brand-primary/10"
                    : "hover:bg-gray-50 hover:border-[1px] border-brand-primary"
                    }`}
                  onClick={() => handleCarSelect(car)}
                >
                  <img
                    src={car.brandLogo || "/placeholder.svg"}
                    alt={car.name.en}
                    className="h-[72px] w-[72px] border-2 border-brand-primary rounded-full p-2"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium truncate text-brand-primary">{car.brand}</h4>
                    <p className="text-xs text-brand-primary truncate">{car.count} cars</p>
                  </div>
                </div>
              ))}
            </div>
          )}


        </div>
      </div>
    </Dialog>
  )
}
