"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Calendar, Droplet, ChevronLeft, Gift } from "lucide-react";

const CarCard = () => {
  const [favorites, setFavorites] = useState([]);

  const cars = [
    {
      id: 1,
      name: "تويوتا كامري 2024",
      price: "129,900 ريال",
      image: "",
      year: 2024,
      fuelType: "بنزين",
      condition: "جديد",
      monthlyInstallment: "2,799 ريال/شهر",
      interestedPeople: 32,
      slug: "toyota-camry-2024",
      discount: "50%",
    },
    {
      id: 2,
      name: "هوندا أكورد 2023",
      price: "114,500 ريال",
      image: "",
      year: 2023,
      fuelType: "بنزين",
      condition: "جديد",
      monthlyInstallment: "2,499 ريال/شهر",
      interestedPeople: 28,
      slug: "honda-accord-2023",
      discount: "20%",
    },
    {
      id: 3,
      name: "مرسيدس بنز C200 2022",
      price: "235,00 ريال",
      image: "",
      year: 2022,
      fuelType: "بنزين",
      condition: "مستعمل",
      monthlyInstallment: "4,999 ريال/شهر",
      interestedPeople: 50,
      slug: "mercedes-benz-c200-2022",
      discount: null,
    },
    {
      id: 4,
      name: "هيونداي سوناتا 2023",
      price: "97,300 ريال",
      image: "",
      year: 2023,
      fuelType: "بنزين",
      condition: "جديد",
      monthlyInstallment: "1,999 ريال/شهر",
      interestedPeople: 45,
      slug: "hyundai-sonata-2023",
      discount: "30%",
    },
  ];

  const handleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((carId) => carId !== id) : [...prev, id]
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 lg:px-[5rem]">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        مجموعة سياراتنا
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-y-4 gap-x-4 items-stretch justify-items-center">
        {cars.map((car) => (
          <Link key={car.id} href={`/car-details/${car.slug}`} className="block w-full max-w-sm">
            <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <div className="relative w-full pt-[56.25%] overflow-hidden">
                <Image
                  src={car.image || "/placeholder.svg"}
                  alt={car.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 ease-in-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <span className="absolute top-4 right-4 bg-brand-primary text-white px-3 py-1 rounded-full text-sm">
                  {car.condition}
                </span>
                <button
                  className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    handleFavorite(car.id);
                  }}
                >
                  <Heart
                    className={`w-5 h-5 ${favorites.includes(car.id) ? "fill-red-500" : "text-gray-600"}`}
                  />
                </button>

                {car.discount && (
                  <div className="absolute bottom-4 left-4 bg-red-500 text-white rounded-full p-2 shadow-md z-10 flex items-center justify-center">
                    <Gift className="w-4 h-4" />
                    <span className="text-xs font-bold ml-1">{car.discount}</span>
                  </div>
                )}
              </div>
              <div className="flex-grow p-4 rtl flex flex-col">
                <div className="flex flex-wrap justify-between items-start mb-1 w-full">
                  <h2
                    className="text-xl font-semibold truncate ml-2"
                    style={{
                      maxWidth: "calc(100% - 120px)",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {car.name}
                  </h2>
                  <div className="text-xl font-bold text-brand-primary whitespace-nowrap">
                    {car.price}
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-4 ml-2">{car.monthlyInstallment}</div>
                <div className="flex flex-wrap justify-between items-center mb-4 text-sm text-brand-primary">
                  <div className="flex items-center gap-1 mb-2 md:mb-0">
                    <Calendar className="w-4 h-4" />
                    <span>{car.year}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2 md:mb-0">
                    <span className="text-brand-primary">{car.condition}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplet className="w-4 h-4" />
                    <span>{car.fuelType}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-brand-primary/30 mt-auto">
                  <div className="text-sm text-brand-primary whitespace-nowrap">
                    {car.interestedPeople} شخص مهتم بهذه السيارة
                  </div>
                  <button
                    className="text-brand-primary hover:text-brand-dark text-sm flex items-center gap-1 transition-colors duration-300 whitespace-nowrap"
                    onClick={(e) => e.preventDefault()}
                  >
                    عرض التفاصيل
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CarCard;
