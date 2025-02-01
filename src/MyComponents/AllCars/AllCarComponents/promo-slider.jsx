import { useRef } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

export function PromoSlider() {
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true }));

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
        {/* Slide 1 */}
        <CarouselItem className="md:basis-1/2">
          <div className="relative h-[300px] w-full rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=1600&h=600&fit=crop"
              alt="Financing made possible"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <h2 className="text-4xl font-bold mb-2">Financing made possible</h2>
              <p className="text-xl">for every car buyer</p>
            </div>
          </div>
        </CarouselItem>

        {/* Slide 2 */}
        <CarouselItem className="md:basis-1/2">
          <div className="relative h-[300px] w-full rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1619551734325-81aaf323686c?w=1600&h=600&fit=crop"
              alt="Home Test Drive"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <h2 className="text-4xl font-bold mb-2">Home Test Drive</h2>
              <p className="text-xl">Buy comfortably from your home</p>
            </div>
          </div>
        </CarouselItem>

        {/* Slide 3 (Optional) */}
        <CarouselItem className="md:basis-1/2">
          <div className="relative h-[300px] w-full rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1600&h=600&fit=crop"
              alt="Luxury Cars"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <h2 className="text-4xl font-bold mb-2">Luxury Cars</h2>
              <p className="text-xl">Explore our premium collection</p>
            </div>
          </div>
        </CarouselItem>

        {/* Slide 4 (Optional) */}
        <CarouselItem className="md:basis-1/2">
          <div className="relative h-[300px] w-full rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&h=600&fit=crop"
              alt="Electric Vehicles"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <h2 className="text-4xl font-bold mb-2">Electric Vehicles</h2>
              <p className="text-xl">Go green with our EV lineup</p>
            </div>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  );
}