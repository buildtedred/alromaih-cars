"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog } from "@/components/ui/dialog"
import carsData from "@/app/api/mock-data"

export default function SearchComponent({ isVisible, onClose }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [cars, setCars] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedCar, setSelectedCar] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showCarDetails, setShowCarDetails] = useState(false)
  const [tags, setTags] = useState([])
  const [inputValue, setInputValue] = useState("")

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

  const filteredCars = cars.filter((car) => {
    return tags.every(
      (tag) =>
        car.name.en.toLowerCase().includes(tag.text.toLowerCase()) ||
        car.brand.toLowerCase().includes(tag.text.toLowerCase()),
    )
  })

  const handleCarSelect = (car) => {
    setSelectedCar(car)
    if (isMobile) setShowCarDetails(true)
  }

  return (
    <Dialog className="" open={isVisible} onOpenChange={(open) => !open && onClose()}>
      <div
        className="fixed inset-0 md:h-[70vh] container mx-auto z-[1000] bg-white"
   
      >
        <div className="cursor-pointer absolute top-3 right-3 z-50 w-7 h-7 flex items-center justify-center rounded-full transition-all duration-300 border border-brand-primary/20 hover:bg-brand-light">
          <X className="h-4 w-4" onClick={onClose} />
          <span className="sr-only">Close</span>
        </div>
        <div className="flex flex-col">
          <div className="p-4 border-b border-gray-200 mt-10">
            <div className="relative flex justify-center">
              <div className="relative w-full md:w-[600px] lg:w-[871px] bg-white rounded-[10px] border border-gray-200 flex items-center px-3 py-2">
                <Search className="text-gray-400 w-4 h-4 mr-2 shrink-0" />

                <div className="flex flex-wrap gap-2 items-center flex-1">
                  {tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center gap-1 bg-purple-700 text-white px-2 py-1 rounded-md text-sm"
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
                    className="flex-1 outline-none border-none bg-transparent min-w-[120px]"
                    placeholder={tags.length === 0 ? "Search brands or models..." : ""}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="">
            {(!isMobile || (isMobile && !showCarDetails)) && (
              <ScrollArea>
                <div className="p-4 grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary" />
                    </div>
                  ) : error ? (
                    <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg text-sm">
                      <p>{error}</p>
                      <Button onClick={() => setCars(carsData)} className="mt-2 text-xs">
                        Retry
                      </Button>
                    </div>
                  ) : filteredCars.length === 0 && searchQuery ? (
                    <p className="text-center text-gray-500 p-4 bg-gray-50 rounded-lg text-sm">No results found.</p>
                  ) : (
                    filteredCars.map((car,index) => (
                      <div
                        key={car.id}
                        className={`rounded-[10px] flex items-center gap-2 p-2 cursor-pointer transition-colors text-sm ${
                          selectedCar?.id === car.id
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
                          <p className="text-xs text-brand-primary truncate">{index}</p>

                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  )
}
