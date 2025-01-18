import { SlidesProvider } from "@/contexts/SliderContext";
import CarCard from "@/MyComponents/CarCard/CarCar";
import { HeroSection } from "@/MyComponents/HeroSection/HeroSection";

export default function Home() {
  return (
    <>
      <main>
      <SlidesProvider>

        <HeroSection />
      </SlidesProvider>
        <main className="min-h-screen p-8 bg-gray-100">
 
            <CarCard />
          
        </main>
      </main>
    </>
  );
}
