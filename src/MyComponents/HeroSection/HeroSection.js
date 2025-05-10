"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import gsap from "gsap"
import { usePathname } from "next/navigation"

// Custom hook to detect mobile view
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add event listener
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

// Bilingual luxury car data with Arabic translations
const LUXURY_CARS = [
  {
    id: "1",
    name: "Phantom",
    nameAr: "فانتوم",
    brand: "Rolls-Royce",
    brandAr: "رولز رويس",
    imagePath: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop",
    year: "2024",
    yearAr: "٢٠٢٤",
    price: "460,000",
    priceAr: "٤٦٠,٠٠٠",
    engine: "6.75L V12",
    engineAr: "٦.٧٥ لتر V١٢",
    power: "563 HP",
    powerAr: "٥٦٣ حصان",
    tagline: "The pinnacle of automotive luxury",
    taglineAr: "قمة الفخامة في عالم السيارات",
  },
  {
    id: "2",
    name: "Chiron",
    nameAr: "شيرون",
    brand: "Bugatti",
    brandAr: "بوغاتي",
    imagePath: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1974&auto=format&fit=crop",
    year: "2024",
    yearAr: "٢٠٢٤",
    price: "3,000,000",
    priceAr: "٣,٠٠٠,٠٠٠",
    engine: "8.0L W16",
    engineAr: "٨.٠ لتر W١٦",
    power: "1,500 HP",
    powerAr: "١,٥٠٠ حصان",
    tagline: "Breaking the boundaries of speed",
    taglineAr: "تحطيم حدود السرعة",
  },
  {
    id: "3",
    name: "Aventador",
    nameAr: "أفينتادور",
    brand: "Lamborghini",
    brandAr: "لامبورغيني",
    imagePath: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1974&auto=format&fit=crop",
    year: "2024",
    yearAr: "٢٠٢٤",
    price: "500,000",
    priceAr: "٥٠٠,٠٠٠",
    engine: "6.5L V12",
    engineAr: "٦.٥ لتر V١٢",
    power: "770 HP",
    powerAr: "٧٧٠ حصان",
    tagline: "Uncompromising performance and style",
    taglineAr: "أداء وأناقة لا تقبل المساومة",
  },
  {
    id: "4",
    name: "Continental GT",
    nameAr: "كونتيننتال جي تي",
    brand: "Bentley",
    brandAr: "بنتلي",
    imagePath: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1964&auto=format&fit=crop",
    year: "2024",
    yearAr: "٢٠٢٤",
    price: "220,000",
    priceAr: "٢٢٠,٠٠٠",
    engine: "6.0L W12",
    engineAr: "٦.٠ لتر W١٢",
    power: "650 HP",
    powerAr: "٦٥٠ حصان",
    tagline: "Handcrafted elegance meets modern power",
    taglineAr: "الأناقة اليدوية تلتقي بالقوة الحديثة",
  },
]

export default function HeroSection() {
  const pathname = usePathname()
  // Language state (ar for Arabic, en for English)
  const [language, setLanguage] = useState(pathname?.startsWith("/ar") ? "ar" : "en")
  const isRTL = language === "ar"

  const isMobile = useIsMobile()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [progress, setProgress] = useState(0)
  const [animating, setAnimating] = useState(false)

  // Refs for desktop animations
  const containerRef = useRef(null)
  const imageRef = useRef(null)
  const contentRef = useRef(null)
  const nameRef = useRef(null)
  const brandRef = useRef(null)
  const taglineRef = useRef(null)
  const detailsRef = useRef(null)
  const navRef = useRef(null)

  const SLIDE_DURATION = 7000 // 7 seconds per slide

  // Update language when pathname changes
  useEffect(() => {
    setLanguage(pathname?.startsWith("/ar") ? "ar" : "en")
  }, [pathname])

  // Handle navigation
  const goToSlide = (index) => {
    if (animating || index === currentSlide) return
    setAnimating(true)
    setCurrentSlide(index)
    setProgress(0)
    setTimeout(() => setAnimating(false), 1000)
  }

  const goToPrevSlide = () => {
    if (animating) return
    const newIndex = (currentSlide - 1 + LUXURY_CARS.length) % LUXURY_CARS.length
    goToSlide(newIndex)
  }

  const goToNextSlide = () => {
    if (animating) return
    const newIndex = (currentSlide + 1) % LUXURY_CARS.length
    goToSlide(newIndex)
  }

  // Animate elements when slide changes (desktop only)
  const animateElements = () => {
    if (isMobile) return

    if (!nameRef.current || !brandRef.current || !taglineRef.current || !detailsRef.current || !navRef.current) return

    const timeline = gsap.timeline()

    // Reset positions
    timeline.set([brandRef.current, nameRef.current, taglineRef.current], {
      y: 30,
      opacity: 0,
    })

    timeline.set(detailsRef.current.children, {
      x: isRTL ? 20 : -20, // Adjust animation direction based on language
      opacity: 0,
    })

    timeline.set(navRef.current, {
      y: 20,
      opacity: 0,
    })

    // Animate elements in sequence
    timeline
      .to(brandRef.current, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, 0.2)
      .to(nameRef.current, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, 0.3)
      .to(taglineRef.current, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, 0.4)
      .to(detailsRef.current.children, { x: 0, opacity: 1, stagger: 0.1, duration: 0.4, ease: "power3.out" }, 0.5)
      .to(navRef.current, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, 0.7)
  }

  // Auto-advance slides
  useEffect(() => {
    if (animating) return

    const interval = setInterval(() => {
      goToNextSlide()
    }, SLIDE_DURATION)

    const progressInterval = setInterval(() => {
      if (!animating) {
        setProgress((prev) => Math.min(prev + 100 / (SLIDE_DURATION / 100), 100))
      }
    }, 100)

    return () => {
      clearInterval(interval)
      clearInterval(progressInterval)
    }
  }, [animating, currentSlide])

  // Trigger animations when slide changes or language changes
  useEffect(() => {
    animateElements()
  }, [currentSlide, isMobile, language])

  // Initial animation on component mount
  useEffect(() => {
    if (!isMobile && containerRef.current) {
      gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: "power3.out" })
    }
    animateElements()
  }, [isMobile])

  const currentCar = LUXURY_CARS[currentSlide]
  const nextCar = LUXURY_CARS[(currentSlide + 1) % LUXURY_CARS.length]

  // Get the appropriate text based on current language
  const getLocalizedText = (enText, arText) => (isRTL ? arText : enText)

  
  // Desktop view
  // Mobile view
  if (isMobile) {
    return (
      <div className="mx-auto">
        {/* Fixed height container */}
        <div
          className="relative bg-white rounded-[5px] overflow-hidden shadow-md h-[400px]"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Image container with fixed position and size */}
          <div className="absolute inset-0 w-full h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={currentCar.imagePath || "/placeholder.svg"}
                  alt={getLocalizedText(currentCar.name, currentCar.nameAr)}
                  className="object-cover"
                  fill
                  priority
                  sizes="100vw"
                />
                {/* Stable gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Content overlay - Fixed position at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentSlide}-${language}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Brand badge */}
                <div className="inline-block px-2 py-1 bg-brand-primary backdrop-blur-sm rounded-md text-white text-xs mb-2">
                  {getLocalizedText(currentCar.brand, currentCar.brandAr)}
                </div>

                {/* Car name */}
                <h2 className="text-white text-2xl font-bold mb-2">
                  {getLocalizedText(currentCar.name, currentCar.nameAr)}
                </h2>

                {/* Price */}
                <div className="flex items-center gap-2 text-white/90 text-lg mb-4">
                  <Image src="/icons/Currency-white.svg" alt="Currency" width={16} height={16} />
                  <span>{getLocalizedText(currentCar.price, currentCar.priceAr)}</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation controls - Fixed position and size */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={isRTL ? goToNextSlide : goToPrevSlide}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  aria-label={isRTL ? "Next slide" : "Previous slide"}
                >
                  {isRTL ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  )}
                </button>

                <button
                  onClick={isRTL ? goToPrevSlide : goToNextSlide}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  aria-label={isRTL ? "Previous slide" : "Next slide"}
                >
                  {isRTL ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Slide indicators - Simple dots */}
              <div className="flex items-center gap-1.5">
                {LUXURY_CARS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentSlide === index ? "bg-white" : "bg-white/40"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Progress bar - Fixed position at bottom */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
            <motion.div
              className="h-full bg-brand-light"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="container mt-4 m-auto" ref={containerRef} dir={isRTL ? "rtl" : "ltr"}>
      <div className="relative  mb-[100px]">
        {/* Main content area */}
        <div className="relative bg-brand-dark rounded-3xl overflow-hidden">
          <div className="grid grid-cols-12 h-[500px]">
            {/* Content side - Swap sides based on language */}
            <div
              className={`col-span-5 p-12 flex flex-col justify-center relative z-10 overflow-hidden ${
                isRTL ? "order-first" : "order-first"
              }`}
            >
              {/* Brand name */}
              <div className="mb-2" ref={brandRef}>
                <span className="inline-block px-3 py-1 rounded-full text-xs uppercase tracking-wider bg-brand-primary text-white">
                  {getLocalizedText(currentCar.brand, currentCar.brandAr)}
                </span>
              </div>

              {/* Car name */}
              <div ref={nameRef}>
                <h2
                  className={`text-4xl lg:text-6xl py-2 font-bold mb-3 text-white line-clamp-2 overflow-hidden ${
                    isRTL ? "font-noto" : ""
                  }`}
                >
                  {getLocalizedText(currentCar.name, currentCar.nameAr)}
                </h2>
              </div>

              {/* Tagline */}
              <div ref={taglineRef} className="mb-8">
                <p className={`text-lg text-white/80 italic line-clamp-2 ${isRTL ? "font-noto" : ""}`}>
                  {getLocalizedText(currentCar.tagline, currentCar.taglineAr)}
                </p>
              </div>

              {/* Car details */}
              <div ref={detailsRef} className="grid grid-cols-2 gap-6 mb-8 overflow-hidden">
                <div className="opacity-0">
                  <p className="text-white/60 text-sm mb-1">{isRTL ? "السعر" : "Price"}</p>
                  <div className="flex items-center gap-2">
                    <Image src="/icons/Currency-white.svg" alt="Currency" width={18} height={18} />
                    <p className={`text-white text-xl font-medium truncate ${isRTL ? "font-noto" : ""}`}>
                      {getLocalizedText(currentCar.price, currentCar.priceAr)}
                    </p>
                  </div>
                </div>
                <div className="opacity-0">
                  <p className="text-white/60 text-sm mb-1">{isRTL ? "السنة" : "Year"}</p>
                  <p className={`text-white text-xl font-medium truncate ${isRTL ? "font-noto" : ""}`}>
                    {getLocalizedText(currentCar.year, currentCar.yearAr)}
                  </p>
                </div>
                <div className="opacity-0">
                  <p className="text-white/60 text-sm mb-1">{isRTL ? "المحرك" : "Engine"}</p>
                  <p className={`text-white text-xl font-medium truncate ${isRTL ? "font-noto" : ""}`}>
                    {getLocalizedText(currentCar.engine, currentCar.engineAr)}
                  </p>
                </div>
                <div className="opacity-0">
                  <p className="text-white/60 text-sm mb-1">{isRTL ? "القوة" : "Power"}</p>
                  <p className={`text-white text-xl font-medium truncate ${isRTL ? "font-noto" : ""}`}>
                    {getLocalizedText(currentCar.power, currentCar.powerAr)}
                  </p>
                </div>
              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-between" ref={navRef}>
                <div className="flex items-center gap-3">
                  <button
                    onClick={isRTL ? goToNextSlide : goToPrevSlide}
                    className="w-12 h-12 rounded-full flex items-center justify-center border border-white/20 text-white hover:bg-white/10 transition-colors"
                  >
                    {isRTL ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={isRTL ? goToPrevSlide : goToNextSlide}
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-white text-black hover:bg-white/90 transition-colors"
                  >
                    {isRTL ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="text-white text-sm">
                  {currentSlide + 1}/{LUXURY_CARS.length}
                </div>
              </div>
            </div>

            {/* Image side - Swap sides based on language */}
            <div className={`col-span-7 relative ${isRTL ? "order-last" : "order-last"}`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-0"
                  ref={imageRef}
                >
                  <Image
                    src={currentCar.imagePath || "/placeholder.svg"}
                    alt={getLocalizedText(currentCar.name, currentCar.nameAr)}
                    className="w-full h-full object-cover"
                    fill
                    priority
                    sizes="58vw"
                  />
                  <div
                    className={`absolute inset-0 ${
                      isRTL
                        ? "bg-gradient-to-r from-transparent via-brand-dark/10 to-brand-dark"
                        : "bg-gradient-to-r from-brand-dark via-brand-dark/5 to-transparent"
                    }`}
                  ></div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
            <motion.div
              className="h-full bg-brand-light"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>
        </div>

        {/* Next car preview - Adjust position based on language */}
        <div
          className={`absolute -bottom-6 ${isRTL ? "left-12" : "right-12"} bg-white rounded-xl overflow-hidden shadow-sm w-64 h-36 z-20`}
        >
          <div className="relative w-full h-full">
            <Image
              src={nextCar.imagePath || "/placeholder.svg"}
              alt={`Next: ${getLocalizedText(nextCar.name, nextCar.nameAr)}`}
              className="w-full h-full object-cover"
              fill
              sizes="256px"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
              <p className="text-white/70 text-xs uppercase tracking-wider mb-1">{isRTL ? "التالي" : "Next"}</p>
              <p className={`text-white text-lg font-medium ${isRTL ? "font-noto" : ""}`}>
                {getLocalizedText(nextCar.name, nextCar.nameAr)}
              </p>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          {LUXURY_CARS.map((_, index) => (
            <motion.div
              key={index}
              className="cursor-pointer"
              onClick={() => goToSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index ? "bg-brand-primary w-6" : "bg-brand-primary/40"
                }`}
                aria-hidden="true"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
