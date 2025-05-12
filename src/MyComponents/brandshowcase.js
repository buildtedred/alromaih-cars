"use client"
import { useRouter } from "next/navigation"
import Slider from "react-slick"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguageContext } from "@/contexts/LanguageSwitcherContext"
import { useEffect, useState } from "react"
import carsData from "@/app/api/mock-data"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

// Custom arrow component that works for both prev and next
const CustomArrow = (props) => {
  const { className, style, onClick, direction, isArabic } = props

  // Determine which icon to show based on direction and language
  const Icon = () => {
    if (direction === "prev") {
      return isArabic ? <ChevronRight className="h-4 w-4 text-white" /> : <ChevronLeft className="h-4 w-4 text-white" />
    } else {
      return isArabic ? <ChevronLeft className="h-4 w-4 text-white" /> : <ChevronRight className="h-4 w-4 text-white" />
    }
  }

  return (
    <div
      className={`${className} custom-arrow ${direction}-arrow`}
      style={{
        ...style,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "var(--brand-primary, #46194F)",
        borderRadius: "50%",
        width: "30px",
        height: "30px",
        zIndex: 1,
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
      onClick={onClick}
    >
      <Icon />
    </div>
  )
}

// Helper function to safely get brand text
const getBrandText = (brand, locale) => {
  if (!brand) return ""
  if (typeof brand === "string") return brand
  return brand[locale] || brand.en || ""
}

// Helper function to get brand value for filtering
const getBrandValue = (brand) => {
  if (!brand) return ""
  if (typeof brand === "string") return brand
  return brand.en || Object.values(brand)[0] || ""
}

function BrandShowcase() {
  const router = useRouter()
  const { isEnglish } = useLanguageContext()
  const [isMobile, setIsMobile] = useState(false)
  const currentLocale = isEnglish ? "en" : "ar"
  const isArabic = currentLocale === "ar"
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const settings = {
    className: "brand-slider",
    infinite: true,
    centerPadding: "0px",
    slidesToShow: 6,
    slidesToScroll: 1,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: !isMobile,
    dots: false, // Disable dots globally
    prevArrow: <CustomArrow direction="prev" isArabic={isArabic} />,
    nextArrow: <CustomArrow direction="next" isArabic={isArabic} />,
    beforeChange: (current, next) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 5,
          centerPadding: "20px",
          arrows: true,
          dots: false, // Ensure dots are disabled
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          centerPadding: "15px",
          arrows: true,
          dots: false, // Ensure dots are disabled
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          centerPadding: "10px",
          arrows: false,
          dots: false, // Disable dots for iPad
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          centerPadding: "5px",
          arrows: false,
          dots: false, // Disable dots for mobile
        },
      },
    ],
  }

  // Handle brand click to apply filter and navigate
  const handleBrandClick = (brand) => {
    const brandValue = getBrandValue(brand)
    // Navigate to all cars page with brand filter
    router.push(`/all-cars?brand=${encodeURIComponent(brandValue)}`)
  }

  return (
    <div className="container mx-auto w-full py-5">
      <div>
        <h2 className={`text-xl md:text-2xl lg:text-3xl font-bold mb-8 ${isArabic ? "text-right" : "text-left"}`}>
          {isEnglish ? "Authorized Distributor" : "موزع معتمد"}
        </h2>

        {/* Add CSS styles inline instead of manipulating DOM */}
        <style jsx global>{`
          @media (max-width: 767px) {
            .slick-prev, .slick-next {
              display: none !important;
            }
          }

          .custom-arrow:before {
            display: none;
          }

          .slick-slider {
            padding: 0 20px;
          }
          
          /* Hide dots completely */
          .slick-dots {
            display: none !important;
          }
          
          /* Alternative: If you want to show limited dots, uncomment this and comment out the above */
          /*
          .slick-dots {
            max-width: 100px;
            margin: 0 auto;
            overflow: hidden;
          }
          */
        `}</style>

        <Slider {...settings} className="slider-container">
          {carsData.map((brand, index) => (
            <div key={index} className="px-2 py-4">
              <div
                className="brand-card p-4 rounded-lg shadow-sm border border-gray-100 bg-white h-24 flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleBrandClick(brand.brand)}
              >
                {brand.brandLogo ? (
                  <img
                    src={brand.brandLogo || "/placeholder.svg"}
                    alt={getBrandText(brand.brand, currentLocale)}
                    className="max-h-16 max-w-full object-contain"
                  />
                ) : (
                  <div className="text-center text-gray-500">{getBrandText(brand.brand, currentLocale)}</div>
                )}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}

export default BrandShowcase
