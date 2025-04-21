"use client"

import * as React from "react"
import * as motion from "motion/react-client"
import Slider from "react-slick"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { BrandCard } from "./Brands/Brands"
import { useLanguageContext } from "@/contexts/LanguageSwitcherContext"
import { useEffect, useState } from "react"
import carsData from "@/app/api/mock-data"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

// Custom arrow components
const PrevArrow = (props) => {
  const { className, style, onClick } = props
  return (
    <div
      className={`${className} custom-arrow prev-arrow`}
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
        left: "-15px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
      onClick={onClick}
    >
      <ChevronLeft className="h-4 w-4 text-white" />
    </div>
  )
}

const NextArrow = (props) => {
  const { className, style, onClick } = props
  return (
    <div
      className={`${className} custom-arrow next-arrow`}
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
        right: "-15px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
      onClick={onClick}
    >
      <ChevronRight className="h-4 w-4 text-white" />
    </div>
  )
}

function BrandShowcase() {
  const { isEnglish } = useLanguageContext()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "0px",
    slidesToShow: 6,
    slidesToScroll: 1,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: !isMobile,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 5,
          centerPadding: "20px",
          arrows: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          centerPadding: "15px",
          arrows: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          centerPadding: "10px",
          arrows: false,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          centerPadding: "5px",
          arrows: false,
        },
      },
    ],
  }

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      const style = document.createElement("style")
      style.innerHTML = `
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
      `
      document.head.appendChild(style)

      return () => {
        document.head.removeChild(style)
      }
    }
  }, [])

  return (
    <div className="bg-gray-100 w-full py-10">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-8 text-right">موزع معتمد</h2>
        <Slider {...settings} className="slider-container">
          {carsData.map((brand, index) => (
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              key={index}
              className="px-2"
            >
              <BrandCard brand={brand} />
            </motion.div>
          ))}
        </Slider>
      </div>
    </div>
  )
}

export default BrandShowcase
