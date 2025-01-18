import CarCard from "@/MyComponents/CarCard/CarCar";
import { HeroSection } from "@/MyComponents/HeroSection/HeroSection";
import BrandShowcase from './../MyComponents/brandshowcase';
import { FinancePartners } from './../MyComponents/FinancePartners';


export default function Home() {
  return (
    <>
      <main>
        <HeroSection />
        <main className="min-h-screen p-8 bg-gray-100">
 
            <CarCard />
            <BrandShowcase />
            <FinancePartners />
        </main>
      </main>
    </>
  );
}
