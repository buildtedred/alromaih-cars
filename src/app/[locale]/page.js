
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
          {/* HeroSection should be wrapped inside the SlidesProvider */}
          <HeroSection />
        </SlidesProvider>

        <main className="min-h-screen m-auto p-8">
          {/* BrandsProvider is properly wrapping the components */}
  
            <CarCard />
            <BrandShowcase />
    

          {/* FinancePartners is outside the BrandsProvider */}
          <FinancePartners />
        </main>
      </main>
    </>
  );
}
