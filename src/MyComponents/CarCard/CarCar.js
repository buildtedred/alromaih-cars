"use client";

import { useState } from "react";
import { useBrands } from "@/contexts/AllDataProvider";
import "react-loading-skeleton/dist/skeleton.css";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname } from "next/navigation";
import CarCardItem from "./CarCardItem"; // Import the reusable CarCardItem component

const CarCar = () => {
  const pathname = usePathname();
  const { brands, loading, error } = useBrands();
  const [favorites, setFavorites] = useState([]);

  const handleFavorite = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((carId) => carId !== id) : [...prev, id]
    );
  };

  const isEnglish = pathname.startsWith("/en");

  if (loading) {
    return (
      <div className="max-w-[calc(100%-18rem)] mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {isEnglish ? "Our Car Collection" : "مجموعة سياراتنا"}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill()
            .map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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