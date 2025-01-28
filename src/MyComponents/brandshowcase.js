"use client"

import * as React from "react"
import Slider from "react-slick"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useBrands } from "@/contexts/AllDataProvider"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function BrandShowcase() {
  const { brands, loading, error } = useBrands();
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 500,
    rows: 2,
    slidesPerRow: 2,
    responsive: [
      {
        breakpoint: 1280, // For larger screens, like tablets or small laptops
        settings: {
          slidesToShow: 5,  // Show 5 items
          slidesToScroll: 5,
          centerPadding: "40px",  // Adjusting padding
        },
      },
      {
        breakpoint: 1024, // For screens like tablets
        settings: {
          slidesToShow: 4,  // Show 4 items
          slidesToScroll: 4,
          centerPadding: "30px",
        },
      },
      {
        breakpoint: 768, // For mobile devices (smaller tablets)
        settings: {
          slidesToShow: 3,  // Show 3 items
          slidesToScroll: 3,
          centerPadding: "20px",  // Adjust padding for smaller screens
        },
      },
      {
        breakpoint: 640, // For very small screens like phones
        settings: {
          slidesToShow: 2,  // Show 2 items
          slidesToScroll: 2,
          centerPadding: "10px",
        },
      },
    ],
  };

  return (
    <div className="bg-gray-100 w-full py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-right">موزع معتمد</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <Card key={index} className="h-auto">
                <CardContent className="flex items-center justify-center p-4">
                  <Skeleton className="h-12 w-12" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Slider {...settings} className="slider-container">
            {brands?.data?.map((brand, index) => (
              <div key={index} className="p-2">
                <Card className="h-auto">
                  <CardContent className="flex items-center justify-center p-4">
                    <img
                      src={`https://xn--mgbml9eg4a.com${brand?.image_url}`}
                      alt={brand.name}
                      className="h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all"
                    />
                  </CardContent>
                </Card>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  )
}

export default BrandShowcase
