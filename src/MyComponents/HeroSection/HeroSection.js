"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"
import { useSlides } from "@/contexts/SliderContext"
import Image from "next/image"
import Skeleton from "react-loading-skeleton"

const SLIDE_DURATION = 5000 // 5 seconds per slide

export const HeroSection = () => {
  const { t } = useTranslation()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [progress, setProgress] = useState(0)
  const { slides, loading, error } = useSlides()

  useEffect(() => {
    if (slides.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
      setProgress(0)
    }, SLIDE_DURATION)

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100))
    }, SLIDE_DURATION / 100)

    return () => {
      clearInterval(interval)
      clearInterval(progressInterval)
    }
  }, [slides.length])

  if (loading) {
    return (
      <div className="relative mb-24">
        <div className="relative h-[70vh] overflow-hidden">
          <Skeleton height="100%" />
        </div>
      </div>
    )
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const baseURL = "https://xn--mgbml9eg4a.com"

  return (
    <div className="relative">
      <div className="relative h-[70vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <div className="relative h-full">
              <Image
                src={`${baseURL}${slides[currentSlide].image_url}`}
                alt={slides[currentSlide].title}
                className="w-full h-full object-cover"
                width={1920}
                height={1080}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20">
          <div className="flex items-center gap-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index)
                  setProgress(0)
                }}
                className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? "bg-white w-8" : "bg-white/50"}`}
              />
            ))}
          </div>

          <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

