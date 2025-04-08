"use client"

import React, { useEffect } from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

export function RangeSlider({ min, max, value, onValueChange, onValueCommit, step = 1, className = "" }) {
  const [lines, setLines] = React.useState(() => generateLines())

  // Ensure value is always within min and max
  const safeValue = React.useMemo(() => {
    if (!value || !Array.isArray(value) || value.length !== 2) {
      return [min, max]
    }
    return [
      Math.max(min, Math.min(max, Number(value[0]) || min)),
      Math.max(min, Math.min(max, Number(value[1]) || max)),
    ]
  }, [value, min, max])

  // Log value changes for debugging
  useEffect(() => {
    console.log("RangeSlider value:", safeValue, "min:", min, "max:", max)
  }, [safeValue, min, max])

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLines(generateLines())
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  function generateLines() {
    return Array.from({ length: 60 }, () => {
      const baseHeight = Math.random()
      const cluster = Math.random() > 0.7 ? 0.7 : 0.3
      return baseHeight * cluster * 100
    })
  }

  // Handle value changes with validation
  const handleValueChange = (newValue) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      // Ensure values are numbers and within range
      const validatedValue = [
        Math.max(min, Math.min(max, Number(newValue[0]) || min)),
        Math.max(min, Math.min(max, Number(newValue[1]) || max)),
      ]
      console.log("RangeSlider onChange:", validatedValue)
      onValueChange(validatedValue)
    }
  }

  // Handle value commit with validation
  const handleValueCommit = (newValue) => {
    if (Array.isArray(newValue) && newValue.length === 2 && onValueCommit) {
      // Ensure values are numbers and within range
      const validatedValue = [
        Math.max(min, Math.min(max, Number(newValue[0]) || min)),
        Math.max(min, Math.min(max, Number(newValue[1]) || max)),
      ]
      console.log("RangeSlider onCommit:", validatedValue)
      onValueCommit(validatedValue)
    }
  }

  return (
    <div className={className}>
      {/* Graph visualization */}
      <div className="relative h-24 mb-6">
        {/* Background lines (gray) */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-[1px] h-full">
          {lines.map((height, i) => (
            <div
              key={`bg-${i}`}
              style={{ height: `${height}%` }}
              className="w-full bg-gray-200 transition-all duration-1000 ease-in-out"
            />
          ))}
        </div>

        {/* Foreground lines (purple) */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-[1px] h-full">
          {lines.map((height, i) => {
            const percent = (i / (lines.length - 1)) * 100
            const isInRange =
              percent >= ((safeValue[0] - min) / (max - min)) * 100 &&
              percent <= ((safeValue[1] - min) / (max - min)) * 100

            return (
              <div
                key={`fg-${i}`}
                style={{
                  height: `${height}%`,
                  opacity: isInRange ? 1 : 0,
                  transition: "opacity 0.5s ease-in-out, height 1s ease-in-out",
                }}
                className="w-full bg-brand-primary transition-all duration-500 ease-in-out"
              />
            )
          })}
        </div>
      </div>

      {/* Slider */}
      <SliderPrimitive.Root
        min={min}
        max={max}
        value={safeValue}
        onValueChange={handleValueChange}
        onValueCommit={handleValueCommit}
        step={step}
        className="relative flex items-center w-full h-5 select-none touch-none"
      >
        <SliderPrimitive.Track className="relative h-[2px] grow rounded-full bg-[#E5E7EB]">
          <SliderPrimitive.Range className="absolute h-full rounded-full bg-brand-primary transition-all duration-300" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block w-4 h-4 bg-white border-2 border-brand-primary rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-all duration-300 hover:scale-125" />
        <SliderPrimitive.Thumb className="block w-4 h-4 bg-white border-2 border-brand-primary rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-all duration-300 hover:scale-125" />
      </SliderPrimitive.Root>
    </div>
  )
}
