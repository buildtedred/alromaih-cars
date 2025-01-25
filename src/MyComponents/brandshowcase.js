"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

const brands = [
  { name: "تويوتا", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg" },
  { name: "هيونداي", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Hyundai_Motor_Company_logo.svg" },
  { name: "كيا", logo: "/images/kia.svg" },
  { name: "نيسان", logo: "https://upload.wikimedia.org/wikipedia/commons/2/23/Nissan_2020_logo.svg" },
  { name: "فورد", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg" },
  { name: "شيفروليه", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Chevrolet_logo.svg" },
  { name: "مرسيدس بنز", logo: "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg" },
  { name: "بي إم دبليو", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" },
  { name: "أودي", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Audi_Logo.svg" },
  { name: "بورش", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Porsche_Logo.svg" },
  { name: "مازدا", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Mazda_logo_with_emblem.svg" },
  { name: "جي إم سي", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f3/GMC_logo.svg" },
]

function BrandShowcase() {
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
                {brands.map((brand, index) => (
                  <Card key={index} className="h-auto">
                    <CardContent className="flex items-center justify-center p-4">
                      <img
                        src={brand.logo || "/placeholder.svg"}
                        alt={brand.name}
                        className="h-10 w-auto object-contain filter grayscale hover:grayscale-0 transition-all"
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

