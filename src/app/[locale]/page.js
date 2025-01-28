import { BrandsProvider } from "@/contexts/AllDataProvider";
import { SlidesProvider } from "@/contexts/SliderContext";
import BrandShowcase from "@/MyComponents/brandshowcase";
import CarCard from "@/MyComponents/CarCard/CarCar";
import { FinancePartners } from "@/MyComponents/FinancePartners";
import { HeroSection } from "@/MyComponents/HeroSection/HeroSection";

export default function Home() {
  return (
    <>
      <main>
        <SlidesProvider>

          <HeroSection />
        </SlidesProvider >
        <main className="min-h-screen p-8 bg-gray-100">

          <BrandsProvider>

            <CarCard />

          <BrandShowcase />
          </BrandsProvider>
          <FinancePartners />



        </main>
      </main>
    </>
  );
}