"use client";

import { SlidesProvider } from "@/contexts/SliderContext";
import BrandShowcase from "@/MyComponents/brandshowcase";
import CarCard from "@/MyComponents/CarCard/CarCar";
import { FinancePartners } from "@/MyComponents/FinancePartners";
import { HeroSection } from "@/MyComponents/HeroSection/HeroSection";


export default function Home() {


  return (
    <main className="min-h-screen m-auto p-8">
  
      <SlidesProvider>
        {/* HeroSection inside SlidesProvider */}
        <HeroSection />
      </SlidesProvider>

      {/* Components */}
      <CarCard />
      <BrandShowcase />
      <FinancePartners />

   
    </main>
  );
}
