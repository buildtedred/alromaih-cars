import { SlidesProvider } from "@/contexts/SliderContext";
import { HeroSection } from "@/MyComponents/HeroSection/HeroSection";
import BrandShowcase from './../MyComponents/brandshowcase';
import { FinancePartners } from './../MyComponents/FinancePartners';

import { BrandsProvider } from "@/contexts/AllDataProvider";
import CarCard from './../MyComponents/CarCard/CarCar';

export default function Home() {
  return (
    <>
      {/* Main Page Wrapper */}
      <SlidesProvider>
        <HeroSection />
      </SlidesProvider>

      <main className="min-h-screen p-8 bg-gray-100">
        <BrandsProvider>
          <CarCard />
          <BrandShowcase />
        </BrandsProvider>
        <FinancePartners />
      </main>
    </>
  );
}
