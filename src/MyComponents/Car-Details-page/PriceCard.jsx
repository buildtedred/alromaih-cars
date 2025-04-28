"use client"

import { useState } from "react"
import { Heart, Share2, FileText } from "lucide-react"
import Image from "next/image"
import { PDFDownloadLink } from "@react-pdf/renderer"
import CarDetailsPDF from "./car-details-pdf"

const RiyalIcon = () => (
  <svg
    width="16"
    height="18"
    viewBox="0 0 23 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.02881 14.04L8.01881 12.77V2.07C8.53881 1.31 9.67881 0.47 10.4288 0V12.24L13.3188 11.65V3.32C13.8088 2.63 15.0088 1.74 15.7388 1.3V11.13L22.5588 9.7C22.5888 10.78 22.3888 11.75 21.8388 12.55L15.7388 13.81V16.53L22.6088 15.12C22.6388 16.2 22.4388 17.17 21.8888 17.97L13.3288 19.73V14.33L10.4288 14.9V18.46C9.99881 19.48 9.13881 20.5 8.55881 21.27C8.39881 21.48 8.41881 21.56 8.15881 21.62L0.00881353 23.34C-0.0411865 22.6 0.108814 21.62 0.788814 20.51L8.00881 19.01V15.46L1.23881 16.88C1.18881 16.14 1.33881 15.16 2.01881 14.05L2.02881 14.04ZM14.1488 22.23L22.6188 20.52C22.6488 21.6 22.3188 22.56 21.8988 23.37L13.3288 25.13C13.3688 24.25 13.6288 23.29 14.1588 22.22L14.1488 22.23Z"
      fill="currentColor"
      className="text-brand-primary"
    />
  </svg>
)

const PriceCardSimple = ({ car_Details, isEnglish, onColorChange, pdfCarDetails, isPdfLoading, brandDetails }) => {
  const [selectedColor, setSelectedColor] = useState(car_Details?.available_colors?.[0]?.name || "")

  // Get model name
  const getModelName = () => {
    if (car_Details?.model?.name) {
      return car_Details.model.name
    }
    return car_Details?.model || ""
  }

  // Get brand name
  const getBrandName = () => {
    if (car_Details?.brand?.name) {
      return car_Details.brand.name
    }
    return car_Details?.brand || ""
  }

  // Format price in English numerals
  const formatPrice = (price) => {
    if (!price) return "0"
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Get available colors
  const getColors = () => {
    return car_Details?.available_colors || []
  }

  // Get monthly payment
  const getMonthlyPayment = () => {
    return car_Details?.pricing?.monthly_installment || Math.round((car_Details?.price || 0) / 60)
  }

  // Get cash price
  const getCashPrice = () => {
    return car_Details?.pricing?.base_price || car_Details?.price || 0
  }

  // Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color.name)
    if (onColorChange && color.image) {
      onColorChange(color.image)
    }
  }

  // Render PDF button
  const renderPdfButton = () => {
    if (isPdfLoading) {
      return (
        <button className="text-brand-primary/70 hover:text-brand-primary" disabled>
          <span className="animate-spin">⌛</span>
        </button>
      )
    }

    if (pdfCarDetails) {
      return (
        <PDFDownloadLink
          document={
            <CarDetailsPDF carDetails={pdfCarDetails} brandDetails={brandDetails} locale={isEnglish ? "en" : "ar"} />
          }
          fileName={`${car_Details?.model?.name || car_Details?.model || "car-details"}.pdf`}
        >
          {({ loading }) => (
            <button
              className="text-brand-primary/70 hover:text-brand-primary"
              title={isEnglish ? "Download PDF" : "تحميل PDF"}
              disabled={loading}
            >
              {loading ? <span className="animate-spin">⌛</span> : <FileText className="w-4 h-4" />}
            </button>
          )}
        </PDFDownloadLink>
      )
    }

    return (
      <button className="text-brand-primary/70 hover:text-brand-primary" disabled>
        <FileText className="w-4 h-4" />
      </button>
    )
  }

  return (
    <div className="bg-white rounded-[20px] border-2 border-brand-primary p-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex flex-col">
            {car_Details?.brand?.image ? (
              <Image
                src={car_Details?.brand.image || "/placeholder.svg"}
                alt={getBrandName()}
                width={60}
                height={20}
                className="h-5 w-auto object-contain mb-1"
              />
            ) : (
              <div className="text-brand-primary font-bold text-lg">{getBrandName()}</div>
            )}
            <span className="text-brand-primary/70 text-[10px]">Drive Your Future</span>
          </div>
          <div className="flex gap-3 mt-2">
            <button className="text-brand-primary/70 hover:text-brand-primary">
              <Heart className="w-4 h-4" />
            </button>
            <button className="text-brand-primary/70 hover:text-brand-primary">
              <Share2 className="w-4 h-4" />
            </button>
            {renderPdfButton()}
          </div>
        </div>
        <div className="text-start">
          <h2 className="text-xl font-bold text-brand-primary">{`${getBrandName()} ${getModelName()}`}</h2>
          <p className="text-xs text-brand-primary/80">Full Option {car_Details?.year || ""}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-brand-primary/10 my-3" />

      {/* Prices */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-brand-primary mb-1">Monthly Payment</p>
          <p className="text-xl font-bold text-brand-primary flex items-center gap-1">
            <RiyalIcon />
            <span>{formatPrice(getMonthlyPayment())}</span>
          </p>
        </div>
        <div className="w-px h-10 bg-brand-primary/10" />
        <div className="text-start">
          <p className="text-sm text-brand-primary mb-1">Cash Price</p>
          <p className="text-xl font-bold text-brand-primary flex items-center gap-1 justify-start">
            <RiyalIcon />
            <span>{formatPrice(getCashPrice())}</span>
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-brand-primary/10 my-3" />

      {/* Colors */}
      <div>
        <p className="text-sm text-brand-primary mb-2">Car Color</p>
        <div className="flex gap-2 justify-center">
          {getColors().length > 0 ? (
            getColors().map((color, index) => (
              <button
                key={index}
                onClick={() => handleColorSelect(color)}
                className={`w-7 h-7 rounded-full ${
                  selectedColor === color.name
                    ? "ring-2 ring-brand-primary ring-offset-2"
                    : "hover:ring-2 hover:ring-brand-primary/30 hover:ring-offset-1"
                }`}
                style={{ backgroundColor: color.hex }}
                aria-label={`${color.name} color option`}
              />
            ))
          ) : (
            <div className="text-sm text-gray-500">No colors available</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PriceCardSimple
