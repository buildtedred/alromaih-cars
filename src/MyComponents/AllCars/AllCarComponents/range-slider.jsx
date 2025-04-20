"use client"

import { useMemo } from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { Plus, Minus } from "lucide-react"

export function CarPriceSlider({
  min = 40000,
  max = 250000,
  value = [min, max],
  onValueChange,
  cars = [],
  step = 1000,
  className = "",
  isRTL = true, // Default to RTL for Arabic
}) {
  // Ensure value is always within min and max
  const safeValue = useMemo(() => {
    if (!value || !Array.isArray(value) || value.length !== 2) {
      return [min, max]
    }
    return [
      Math.max(min, Math.min(max, Number(value[0]) || min)),
      Math.max(min, Math.min(max, Number(value[1]) || max)),
    ]
  }, [value, min, max])

  // Handle value changes with validation
  const handleValueChange = (newValue) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      // Ensure values are numbers and within range
      const validatedValue = [
        Math.max(min, Math.min(max, Number(newValue[0]) || min)),
        Math.max(min, Math.min(max, Number(newValue[1]) || max)),
      ]
      onValueChange(validatedValue)
    }
  }

  // Format price for display
  const formatPrice = (price) => {
    return `${price.toLocaleString()}`
  }

  // Handle increment/decrement buttons
  const incrementMin = () => {
    const newMin = Math.min(safeValue[0] + step, safeValue[1] - step)
    handleValueChange([newMin, safeValue[1]])
  }

  const decrementMin = () => {
    const newMin = Math.max(safeValue[0] - step, min)
    handleValueChange([newMin, safeValue[1]])
  }

  const incrementMax = () => {
    const newMax = Math.min(safeValue[1] + step, max)
    handleValueChange([safeValue[0], newMax])
  }

  const decrementMax = () => {
    const newMax = Math.max(safeValue[1] - step, safeValue[0] + step)
    handleValueChange([safeValue[0], newMax])
  }

  return (
    <div className={`relative pt-2 pb-4 ${className}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Title */}
      <h3 className="text-xl font-bold text-[#46194F] mb-2 text-right">{isRTL ? "مدى السعر" : "Price Range"}</h3>

      {/* Car icons with overlap effect */}
      <div className="relative h-16 mb-2">
        {(() => {
          const minPercent = ((safeValue[0] - min) / (max - min)) * 100
          const maxPercent = ((safeValue[1] - min) / (max - min)) * 100
          const distance = maxPercent - minPercent

          // Calculate if cars are close enough to overlap
          const isOverlapping = distance < 8

          return (
            <div className="relative w-full h-full">
              {/* First car (left/min) */}
              <div
                className="absolute transition-all duration-300"
                style={{
                  left: `${minPercent}%`,
                  bottom: "0px", // Keep the car on the ground
                  transform: isOverlapping ? `translateX(-50%) rotate(-10deg) translateY(-5px)` : `translateX(-50%)`, // Lift and rotate when overlapping
                  transformOrigin: "bottom right", // Rotate from the back tire
                  zIndex: isOverlapping ? 1 : 1,
                }}
              >
                <svg width="40" height="24" viewBox="0 0 100 60" fill="#8A4EAD" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M89.5,25.5h-8.13c-0.27-1.25-0.66-2.47-1.14-3.65l-3.76-9.24C74.33,7.46,69.2,4,63.5,4h-27
                    c-5.7,0-10.83,3.46-12.97,8.61l-3.76,9.24c-0.48,1.18-0.87,2.4-1.14,3.65H10.5c-1.93,0-3.5,1.57-3.5,3.5v11c0,1.93,1.57,3.5,3.5,3.5
                    h2.69c1.07,4.72,5.28,8.25,10.31,8.25c5.03,0,9.24-3.53,10.31-8.25h33.38c1.07,4.72,5.28,8.25,10.31,8.25s9.24-3.53,10.31-8.25
                    H89.5c1.93,0,3.5-1.57,3.5-3.5V29C93,27.07,91.43,25.5,89.5,25.5z M23.5,47.75c-3.45,0-6.25-2.8-6.25-6.25s2.8-6.25,6.25-6.25
                    s6.25,2.8,6.25,6.25S26.95,47.75,23.5,47.75z M36.5,25.5c-0.55,0-1-0.45-1-1s0.45-1,1-1h27c0.55,0,1,0.45,1,1s-0.45,1-1,1H36.5z
                    M77.5,47.75c-3.45,0-6.25-2.8-6.25-6.25s2.8-6.25,6.25-6.25s6.25,2.8,6.25,6.25S80.95,47.75,77.5,47.75z M83,25.5
                    c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S83.55,25.5,83,25.5z"
                  />
                </svg>
              </div>

              {/* Second car (right/max) with overlap effect */}
              <div
                className="absolute transition-all duration-300"
                style={{
                  left: `${maxPercent}%`,
                  bottom: "0px", // Keep the car on the ground
                  transform: isOverlapping ? `translateX(-50%) rotate(10deg) translateY(-5px)` : `translateX(-50%)`, // Lift and rotate when overlapping
                  transformOrigin: "bottom left", // Rotate from the back tire
                  zIndex: 2,
                }}
              >
                {/* <svg width="40" height="24" viewBox="0 0 100 60" fill="#8A4EAD" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M89.5,25.5h-8.13c-0.27-1.25-0.66-2.47-1.14-3.65l-3.76-9.24C74.33,7.46,69.2,4,63.5,4h-27
                    c-5.7,0-10.83,3.46-12.97,8.61l-3.76,9.24c-0.48,1.18-0.87,2.4-1.14,3.65H10.5c-1.93,0-3.5,1.57-3.5,3.5v11c0,1.93,1.57,3.5,3.5,3.5
                    h2.69c1.07,4.72,5.28,8.25,10.31,8.25c5.03,0,9.24-3.53,10.31-8.25h33.38c1.07,4.72,5.28,8.25,10.31,8.25s9.24-3.53,10.31-8.25
                    H89.5c1.93,0,3.5-1.57,3.5-3.5V29C93,27.07,91.43,25.5,89.5,25.5z M23.5,47.75c-3.45,0-6.25-2.8-6.25-6.25s2.8-6.25,6.25-6.25
                    s6.25,2.8,6.25,6.25S26.95,47.75,23.5,47.75z M36.5,25.5c-0.55,0-1-0.45-1-1s0.45-1,1-1h27c0.55,0,1,0.45,1,1s-0.45,1-1,1H36.5z
                    M77.5,47.75c-3.45,0-6.25-2.8-6.25-6.25s2.8-6.25,6.25-6.25s6.25,2.8,6.25,6.25S80.95,47.75,77.5,47.75z M83,25.5
                    c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S83.55,25.5,83,25.5z"
                  />
                </svg> */}
              </div>
            </div>
          )
        })()}
      </div>

      {/* Slider */}
      <div className="px-2">
        <SliderPrimitive.Root
          min={min}
          max={max}
          value={safeValue}
          onValueChange={handleValueChange}
          step={step}
          className="relative flex items-center w-full h-5 select-none touch-none"
          aria-label="Price Range"
        >
          <SliderPrimitive.Track className="relative h-[2px] grow rounded-full bg-gray-300">
            <SliderPrimitive.Range className="absolute h-full rounded-full bg-[#46194F] transition-all duration-300" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb
            className="block w-4 h-4 bg-[#46194F] rounded-full focus:outline-none focus:ring-2 focus:ring-[#46194F] focus:ring-offset-2 transition-all duration-300"
            aria-label="Minimum price"
          />
          <SliderPrimitive.Thumb
            className="block w-4 h-4 bg-[#46194F] rounded-full focus:outline-none focus:ring-2 focus:ring-[#46194F] focus:ring-offset-2 transition-all duration-300"
            aria-label="Maximum price"
          />
        </SliderPrimitive.Root>
      </div>

      {/* Price controls with plus/minus buttons */}
      <div className="flex justify-between mt-4">
        {/* Min price control */}
        <div className="flex items-center">
          <button
            onClick={decrementMin}
            className="w-8 h-8 flex items-center justify-center border border-[#46194F] rounded-md"
            aria-label="Decrease minimum price"
          >
            <Minus size={16} className="text-[#46194F]" />
          </button>
          <div className="mx-2 flex items-center">
            <span className="text-[#46194F] font-bold mx-1">₹</span>
            <span className="text-[#46194F] font-bold">{formatPrice(safeValue[0])}</span>
          </div>
          <button
            onClick={incrementMin}
            className="w-8 h-8 flex items-center justify-center border border-[#46194F] rounded-md"
            aria-label="Increase minimum price"
          >
            <Plus size={16} className="text-[#46194F]" />
          </button>
        </div>

        {/* Max price control */}
        <div className="flex items-center">
          <button
            onClick={decrementMax}
            className="w-8 h-8 flex items-center justify-center border border-[#46194F] rounded-md"
            aria-label="Decrease maximum price"
          >
            <Minus size={16} className="text-[#46194F]" />
          </button>
          <div className="mx-2 flex items-center">
            <span className="text-[#46194F] font-bold mx-1">₹</span>
            <span className="text-[#46194F] font-bold">{formatPrice(safeValue[1])}</span>
          </div>
          <button
            onClick={incrementMax}
            className="w-8 h-8 flex items-center justify-center border border-[#46194F] rounded-md"
            aria-label="Increase maximum price"
          >
            <Plus size={16} className="text-[#46194F]" />
          </button>
        </div>
      </div>
    </div>
  )
}
