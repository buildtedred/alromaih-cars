"use client"

import * as React from "react"
import Slider from "react-slick"
import { Card, CardContent } from "@/components/ui/card"
import { useBrands } from "@/contexts/AllDataProvider"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function BrandShowcase() {
  const { brands, loading, error } = useBrands();

  console.log("objectcccccccccccc brandddd", brands?.data)

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
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 6,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  return (
    <div className="bg-gray-100 w-full py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-right">موزع معتمد</h2>
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
      </div>
    </div>
  )
}

export default BrandShowcase

