"use client"
import { SlidesProvider } from "@/contexts/SliderContext"
import BrandShowcase from "@/MyComponents/brandshowcase"
import { FinancePartners } from "@/MyComponents/FinancePartners"
import { HeroSection } from "@/MyComponents/HeroSection/HeroSection"
import CarBuyingInterface from "../../MyComponents/Find-Car/Find-Perfect-car.jsx"
import CarListing from "@/MyComponents/Cards/car-listing.jsx"
import { usePathname } from "next/navigation"

export default function Home() {
  const pathname = usePathname()
  const isArabic = pathname?.startsWith("/ar")

  return (
    <main className="min-h-screen m-auto">
      <SlidesProvider>
        {/* HeroSection inside SlidesProvider */}
        <HeroSection />
      </SlidesProvider>

      {/* Car Buying Interface below HeroSection */}
      <div className="my-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          {isArabic ? "ابحث عن سيارتك المثالية" : "Find Your Perfect Car"}
        </h2>
        <CarBuyingInterface />
      </div>

      {/* Car Listing Component */}
      <div className="flex justify-center items-center">
        <div className="container my-12 text-center">
          <h2 className="text-3xl font-bold mb-8">
            {isArabic ? "مجموعة سياراتنا" : "Our Car Collection"}
          </h2>
          <CarListing />
        </div>
      </div>

      {/* Other Components */}
      <BrandShowcase />
      <FinancePartners />
    </main>
  )
}

