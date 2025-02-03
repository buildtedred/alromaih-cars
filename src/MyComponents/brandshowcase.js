"use client"

import * as React from "react"
import Slider from "react-slick"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useBrands } from "@/contexts/AllDataProvider"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "@/i18n/routing"

function BrandShowcase() {
  const { brands, loading, error } = useBrands();
  console.log("object brands",brands)

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "0px",
    slidesToShow: 6, // Default slides
    slidesToScroll: 1,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1280, // Large screens
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          centerPadding: "20px",
        },
      },
      {
        breakpoint: 1024, // Medium screens
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          centerPadding: "15px",
        },
      },
      {
        breakpoint: 768, // Tablets
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          centerPadding: "10px",
        },
      },
      {
        breakpoint: 640, // Phones
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerPadding: "5px",
        },
      },
    ],
  };

  return (
    <div className="bg-gray-100 w-full py-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-8 text-right">
          موزع معتمد
        </h2>
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
              <div key={index} className="p-1 md:p-2 lg:p-3">
                <Link href={`/brands/${brand?.name?.en?.slug}`}>
              
                <Card className="h-auto pt-1">
                  <CardContent className="flex flex-col items-center justify-center">
                    <img
                      src={`https://xn--mgbml9eg4a.com${brand?.image_url}`}
                      alt={brand.name}
                      className="h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all"
                    />
                    <p className="text-center font-bold text-gray-500 text-sm md:text-base lg:text-lg whitespace-nowrap">
                      {brand?.name?.en?.name}
                    </p>
                  </CardContent>
                </Card>
                </Link>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
}

export default BrandShowcase;
