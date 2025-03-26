"use client";

import { SlidesProvider } from "@/contexts/SliderContext"
import BrandShowcase from "@/MyComponents/brandshowcase"
import { FinancePartners } from "@/MyComponents/FinancePartners"
import { HeroSection } from "@/MyComponents/HeroSection/HeroSection"
import CarBuyingInterface from "../../MyComponents/car-buying/car-buying-interface.jsx"
import CarListing from "@/MyComponents/Cards/car-listing.jsx" // Add this import

export default async function Home() {
  return (
    <main className="min-h-screen m-auto p-8">
        {/* HeroSection inside SlidesProvider */}
        <HeroSection />


      {/* Car Buying Interface below HeroSection */}
      <div className="my-12">
        <h2 className="text-3xl font-bold text-center mb-8">Find Your Perfect Car</h2>
        <CarBuyingInterface />
      </div>

      {/* Replace your existing CarCard with the new CarListing */}
      <div className="my-12">
        <h2 className="text-3xl font-bold text-center mb-8">Our Car Collection</h2>
        <CarListing />
      </div>

      {/* Other Components */}
      <BrandShowcase />
      <FinancePartners />
    </main>
  )
}