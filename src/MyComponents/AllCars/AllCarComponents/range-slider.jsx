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
  isRTL = true,
}) {
  const safeValue = useMemo(() => {
    if (!value || !Array.isArray(value) || value.length !== 2) {
      return [min, max]
    }
    return [
      Math.max(min, Math.min(max, Number(value[0]) || min)),
      Math.max(min, Math.min(max, Number(value[1]) || max)),
    ]
  }, [value, min, max])

  const handleValueChange = (newValue) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      const validatedValue = [
        Math.max(min, Math.min(max, Number(newValue[0]) || min)),
        Math.max(min, Math.min(max, Number(newValue[1]) || max)),
      ]
      onValueChange(validatedValue)
    }
  }

  const formatPrice = (price) => {
    return `${price.toLocaleString()}`
  }

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
    <div
      className={`relative pt-2 pb-4 overflow-y-auto max-h-[420px] pr-2 ${className}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <h3 className="text-xl font-bold text-[#46194F] mb-2 text-right">
        {isRTL ? "مدى السعر" : "Price Range"}
      </h3>

      <div className="relative h-16 mb-2">
        {(() => {
          const minPercent = ((safeValue[0] - min) / (max - min)) * 100
          const maxPercent = ((safeValue[1] - min) / (max - min)) * 100
          const distance = maxPercent - minPercent
          const isOverlapping = distance < 8

          return (
            <div className="relative w-full h-full">
              <div
                className="absolute transition-all duration-300"
                style={{
                  left: `${minPercent}%`,
                  bottom: "0px",
                  transform: isOverlapping
                    ? `translateX(-50%) rotate(-10deg) translateY(-5px)`
                    : `translateX(-50%)`,
                  transformOrigin: "bottom right",
                  zIndex: isOverlapping ? 1 : 1,
                }}
              >
                <img src="/icons/RangCar.svg" width={40} height={24} alt="Min Car" />
              </div>

              <div
                className="absolute transition-all duration-300"
                style={{
                  left: `${maxPercent}%`,
                  bottom: "0px",
                  transform: isOverlapping
                    ? `translateX(-50%) rotate(10deg) translateY(-5px)`
                    : `translateX(-50%)`,
                  transformOrigin: "bottom left",
                  zIndex: 2,
                }}
              >
                <img src="/icons/RangCar2.svg" width={40} height={24} alt="Max Car" />
              </div>
            </div>
          )
        })()}
      </div>

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

      <div className="flex justify-between mt-4">
        <div className="flex items-center">
          <button
            onClick={decrementMin}
            className="w-8 h-8 flex items-center justify-center border border-[#46194F] rounded-md"
            aria-label="Decrease minimum price"
          >
            <Minus size={16} className="text-[#46194F]" />
          </button>
          <div className="mx-2 flex items-center">
            <img src="/icons/Currency.svg" alt="Currency" className="w-4 h-4 mr-1" />
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

        <div className="flex items-center">
          <button
            onClick={decrementMax}
            className="w-8 h-8 flex items-center justify-center border border-[#46194F] rounded-md"
            aria-label="Decrease maximum price"
          >
            <Minus size={16} className="text-[#46194F]" />
          </button>
          <div className="mx-2 flex items-center">
            <img src="/icons/Currency.svg" alt="Currency" className="w-4 h-4 mr-1" />
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
