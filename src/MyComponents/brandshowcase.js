"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useBrands } from "@/contexts/AllDataProvider"

function BrandShowcase() {
  const { brands, loading, error } = useBrands();

  console.log("objectcccccccccccc brandddd", brands?.data)
  return (
    <div className="bg-gray-100 w-full py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-right">موزع معتمد</h2>
        <Carousel
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            <CarouselItem>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {brands?.data?.map((brand, index) => (
                  <Card key={index} className="h-auto">
                    <CardContent className="flex items-center justify-center p-4">
                    <img
                  src={`https://xn--mgbml9eg4a.com${brand?.image_url}`}
                  alt={brand.name}
                  className="h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all"
                />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  )
}

export default BrandShowcase

