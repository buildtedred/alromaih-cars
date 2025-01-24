import { SlidesProvider } from "@/contexts/SliderContext";
import CarCard from "@/MyComponents/CarCard/CarCar";
import { HeroSection } from "@/MyComponents/HeroSection/HeroSection";
import BrandShowcase from './../MyComponents/brandshowcase';
import { FinancePartners } from './../MyComponents/FinancePartners';

import { BrandsProvider } from "@/contexts/AllDataProvider";


export default function Home() {
  return (
    <>
      <main>
      <SlidesProvider>

        <HeroSection />
      </SlidesProvider>
        <main className="min-h-screen p-8 bg-gray-100">
 
        <BrandsProvider>
        <CarCard />
        </BrandsProvider>
            <BrandShowcase />
            <FinancePartners />
      
          
        </main>
      </main>
    </>
  );
}
