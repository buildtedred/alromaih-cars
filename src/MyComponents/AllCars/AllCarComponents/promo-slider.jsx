"use client"

import { useRef } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"

export function PromoSlider() {
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true }))

  // Static promotional slides data
  const slides = [
    {
      src: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=1600&h=600&fit=crop",
      title: "Financing made possible",
      subtitle: "for every car buyer",
    },
    {
      src: "https://images.unsplash.com/photo-1619551734325-81aaf323686c?w=1600&h=600&fit=crop",
      title: "Home Test Drive",
      subtitle: "Buy comfortably from your home",
    },
    {
      src: "https://images.unsplash.com/photo-1605559424849-330b1f3d9d82?w=1600&h=600&fit=crop",
      title: "Exclusive Discounts",
      subtitle: "Save big on your next car",
    },
  ]

  return (
    <Carousel
      className="w-full mb-8"
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[plugin.current]}
    >
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index} className="md:basis-1/2 sm:basis-full">
            <div className="relative h-[200px] w-full rounded-[10px] overflow-hidden">
              <Image src={slide.src || "/placeholder.svg"} alt={slide.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <h2 className="text-xl md:text-3xl font-bold mb-2">{slide.title}</h2>
                <p className="text-sm md:text-lg">{slide.subtitle}</p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4 bg-brand-light/10 border-white  border-2 text-white" />
      <CarouselNext className="right-4 bg-brand-light/10 border-white  border-2 text-white" />
    </Carousel>
  )
}
