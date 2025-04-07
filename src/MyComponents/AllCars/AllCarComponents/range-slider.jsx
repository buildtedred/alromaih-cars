"use client"

import React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

export function RangeSlider({ min, max, value, onValueChange, onValueCommit, step = 1, className = "" }) {
  const [lines, setLines] = React.useState(() => generateLines())

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
              percent >= ((value[0] - min) / (max - min)) * 100 && percent <= ((value[1] - min) / (max - min)) * 100

            return (
              <div
                key={`fg-${i}`}
                style={{
                  height: `${height}%`,
                  opacity: isInRange ? 1 : 0,
                }}
                className="w-full bg-brand-primary transition-all duration-300 ease-in-out"
              />
            )
          })}
        </div>
      </div>

      {/* Slider */}
      <SliderPrimitive.Root
        min={min}
        max={max}
        value={value}
        onValueChange={onValueChange}
        onValueCommit={onValueCommit}
        step={step}
        className="relative flex items-center w-full h-5 select-none touch-none"
      >
        <SliderPrimitive.Track className="relative h-[2px] grow rounded-full bg-[#E5E7EB]">
          <SliderPrimitive.Range className="absolute h-full rounded-full bg-brand-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block w-4 h-4 bg-white border-2 border-brand-primary rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-transform hover:scale-110" />
        <SliderPrimitive.Thumb className="block w-4 h-4 bg-white border-2 border-brand-primary rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-transform hover:scale-110" />
      </SliderPrimitive.Root>
    </div>
  )
}

