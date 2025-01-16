import CarCard from "@/MyComponents/CarCard/CarCar";
import { HeroSection } from "@/MyComponents/HeroSection/HeroSection";
export default function Home() {
  return (
    <>
      <main>
        <HeroSection />
        <main className="min-h-screen p-8 bg-gray-100">
 
            <CarCard />
            
        </main>
      </main>
    </>
  );
}
