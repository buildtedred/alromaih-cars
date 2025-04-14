"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

// Reusable skeleton component for filter items
const FilterItemSkeleton = () => (
  <div className="flex items-center space-x-2 py-2">
    <Skeleton className="h-4 w-4 rounded-sm" />
    <Skeleton className="h-4 w-24" />
  </div>
)

// Sidebar filter skeleton
const SidebarSkeleton = () => {
  const [expandedSections, setExpandedSections] = useState({
    priceRange: true,
    brandsAndModels: true,
    year: false,
    fuelType: false,
    transmission: false,
    seats: false,
  })

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="bg-white rounded-[4px] shadow-md overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b sticky top-0 bg-white z-10">
        <Skeleton className="h-6 w-24" />
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar-container">
        <div className="divide-y">
          {/* Price Range Section */}
          <div className="p-4 group hover:bg-gray-50 rounded-[4px] transition-all duration-200">
            <button
              type="button"
              onClick={() => toggleSection("priceRange")}
              className="flex justify-between items-center mb-2 w-full text-left"
            >
              <Skeleton className="h-6 w-28" />
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                  expandedSections.priceRange ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedSections.priceRange && (
              <div className="transition-all duration-300 ease-in-out">
                <Skeleton className="h-4 w-full mb-6" />
                <div className="flex justify-between text-sm mt-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            )}
          </div>

          {/* Brands + Models Section */}
          <div className="p-4 group hover:bg-gray-50 rounded-[4px] transition-all duration-200">
            <button
              type="button"
              onClick={() => toggleSection("brandsAndModels")}
              className="flex justify-between items-center mb-4 w-full text-left"
            >
              <Skeleton className="h-6 w-36" />
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                  expandedSections.brandsAndModels ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedSections.brandsAndModels && (
              <>
                <Skeleton className="h-10 w-full mb-4" />
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="border-b pb-2">
                      <div className="flex items-center justify-between p-2">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4 rounded-sm" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <Skeleton className="h-6 w-6 rounded-full" />
                      </div>
                      <div className="ml-8 mt-1 space-y-2">
                        {Array.from({ length: 2 }).map((_, j) => (
                          <FilterItemSkeleton key={j} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Other filter sections */}
          {["year", "fuelType", "transmission", "seats"].map((section) => (
            <div key={section} className="p-4 group hover:bg-gray-50 rounded-[4px] transition-all duration-200">
              <button
                type="button"
                onClick={() => toggleSection(section)}
                className="flex justify-between items-center mb-4 w-full text-left"
              >
                <Skeleton className="h-6 w-24" />
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                    expandedSections[section] ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedSections[section] && (
                <div className="space-y-3 transition-all duration-300 ease-in-out">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <FilterItemSkeleton key={i} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t sticky bottom-0 bg-white z-10">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

// Car card skeleton
const CarCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
    <Skeleton className="w-full h-48" />
    <div className="p-4">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />

      <div className="grid grid-cols-2 gap-2 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-28" />
      </div>
    </div>
  </div>
)

// Main component
export default function CarSkeletonUI() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container m-auto px-2 sm:px-3 md:px-4 lg:px-[5rem] xl:px-[7rem] py-4">
        <div className="relative flex flex-col md:flex-row gap-8">
          <Button
            className="md:hidden mb-4 bg-gray-200 text-gray-700 rounded-[4px]"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? "Close Filters" : "Open Filters"}
          </Button>

          <div className={`md:w-80 ${isSidebarOpen ? "block" : "hidden md:block"}`}>
            <div className="sticky top-20 h-[calc(100vh-5rem)]">
              <SidebarSkeleton />
            </div>
          </div>

          <div className="flex-1">
            {/* Promo slider skeleton */}
            <Skeleton className="w-full h-40 mb-8 rounded-lg" />

            {/* Car listing header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-10 rounded-full" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>

            {/* Car grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <CarCardSkeleton key={i} />
              ))}
            </div>

            {/* Pagination skeleton */}
            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-8 rounded-[4px]" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
