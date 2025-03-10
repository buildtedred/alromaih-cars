"use client"

import { SlidesProvider } from "@/contexts/SliderContext"
import BrandShowcase from "@/MyComponents/brandshowcase"
import CarCard from "@/MyComponents/CarCard/CarCar"
import { FinancePartners } from "@/MyComponents/FinancePartners"
import { HeroSection } from "@/MyComponents/HeroSection/HeroSection"
import CarBuyingInterface from "../../MyComponents/car-buying/car-buying-interface.jsx"

export default function Home() {
  return (
    <main className="min-h-screen m-auto p-8">
      <SlidesProvider>
        {/* HeroSection inside SlidesProvider */}
        <HeroSection />
      </SlidesProvider>

      {/* Car Buying Interface below HeroSection */}
      <div className="my-12">
        <h2 className="text-3xl font-bold text-center mb-8">Find Your Perfect Car</h2>
        <CarBuyingInterface />
      </div>

      {/* Other Components */}
      <CarCard />
      <BrandShowcase />
      <FinancePartners />
    </main>
  )
}

