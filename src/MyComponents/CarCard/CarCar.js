"use client";

import { useState } from "react";
import { useBrands } from "@/contexts/AllDataProvider";
import "react-loading-skeleton/dist/skeleton.css";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname } from "next/navigation";
import CarCardItem from "./CarCardItem"; // Import the reusable CarCardItem component
import LoadingUi from "../LoadingUi/LoadingUi";
import { useLanguageContext } from "@/contexts/LanguageSwitcherContext";

const CarCar = () => {
  const {isEnglish} = useLanguageContext()
  const { brands, loading, error } = useBrands();
  const [favorites, setFavorites] = useState([]);

  const handleFavorite = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((carId) => carId !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
     <LoadingUi/>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 text-xl mt-8">Error: {error}</p>;
  }

  return (
    <div className="max-w-[calc(100%-0rem)] md:max-w-[calc(100%-10rem)] mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        {isEnglish ? "Our Car Collection" : "مجموعة سياراتنا"}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {brands?.data?.map((brand) =>
          brand.car_models?.map((car) => (
            <CarCardItem
              key={car.id}
              car={car}
              isEnglish={isEnglish}
              favorites={favorites}
              handleFavorite={handleFavorite}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CarCar;