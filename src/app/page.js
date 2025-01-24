import { SlidesProvider } from "@/contexts/SliderContext";
import CarCard from "@/MyComponents/CarCard/CarCar";
import { HeroSection } from "@/MyComponents/HeroSection/HeroSection";
import BrandShowcase from './../MyComponents/brandshowcase';
import { FinancePartners } from './../MyComponents/FinancePartners';

import { BrandsProvider } from "@/contexts/AllDataProvider";

<<<<<<< HEAD

=======
>>>>>>> 071443a1a1edf0e45e5c6d95bdeb4044c33c976c

export default function Home() {
  return (
    <>
      <main>
      <SlidesProvider>

        <HeroSection />
      </SlidesProvider>
        <main className="min-h-screen p-8 bg-gray-100">
 
            <CarCard />
            <BrandShowcase />
            <FinancePartners />
        <BrandsProvider>
            <CarCard />
        </BrandsProvider>
          
        </main>
      </main>
    </>
  );
}
