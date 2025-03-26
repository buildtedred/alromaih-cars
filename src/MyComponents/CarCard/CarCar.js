"use client";

import { useEffect, useState } from "react";
import { useLanguageContext } from "@/contexts/LanguageSwitcherContext";
import CarCardItem from "./CarCardItem";
import LoadingUi from "../LoadingUi/LoadingUi";

const CarCar = () => {
  const { isEnglish } = useLanguageContext();
  const [favorites, setFavorites] = useState([]);
  const [mocData, setMocData] = useState([]);
  const [loadingMocData, setLoadingMocData] = useState(true);

  // console.log("Mock Data:", mocData);

  useEffect(() => {
    const fetchSliderData = async () => {
      setLoadingMocData(true);
      try {
        const response = await fetch(
          "https://67c7bf7cc19eb8753e7a9248.mockapi.io/api/alromaih"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setMocData(data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoadingMocData(false);
      }
    };

    fetchSliderData();
  }, []);

  const handleFavorite = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((carId) => carId !== id) : [...prev, id]
    );
  };

  if (loadingMocData) {
    return <LoadingUi />;
  }

  return (
    <div className="max-w-[calc(100%-0rem)] md:max-w-[calc(100%-10rem)] mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        {isEnglish ? "Our Car Collection" : "مجموعة سياراتنا"}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mocData?.map((car) => (
          <CarCardItem
            key={car.id}
            car={car}
            isEnglish={isEnglish}
            favorites={favorites}
            handleFavorite={handleFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default CarCar;
