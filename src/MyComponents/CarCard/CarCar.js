"use client"; // Add this at the top of your file

import React, { useState } from 'react'; // Import useState
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Calendar, Droplet, ChevronLeft, Gift } from 'lucide-react';

const CarCard = () => {
  const [favorites, setFavorites] = useState([]); // To store favorite car IDs

  const cars = [
    {
      id: 1,
      name: "تويوتا كامري 2024",
      price: "129,900 ريال",
      image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNhbXJ5fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
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
      image: "https://images.unsplash.com/photo-1699550915467-421188f24aff?q=80&w=1935&auto=format&fit=crop&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
      image: "https://images.unsplash.com/photo-1597687210367-a4915552d886?q=80&w=1964&auto=format&fit=crop&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
      image: "https://images.unsplash.com/photo-1606220838325-6e68d55e22fe?q=80&w=1964&auto=format&fit=crop&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      year: 2023,
      fuelType: "بنزين",
      condition: "جديد",
      monthlyInstallment: "1,999 ريال/شهر",
      interestedPeople: 45,
      slug: "hyundai-sonata-2023",
      discount: "30%",
    },
  ];

  const handleFavorite = (carId) => {
    // Toggle favorite status
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(carId)) {
        return prevFavorites.filter((id) => id !== carId); // Remove from favorites
      } else {
        return [...prevFavorites, carId]; // Add to favorites
      }
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
      {cars.map((car) => (
        <Link key={car.id} href={`/car-details/${car.slug}`} className="block">
          <div className="relative bg-white rounded-lg overflow-hidden shadow-lg max-w-sm hover:shadow-xl transition-shadow duration-300 group">
            <div className="relative h-48 overflow-hidden flex items-center justify-center">
              <Image
                src={car.image}
                alt={car.name}
                width={340}
                height={192}
                className="transition-transform duration-300 ease-in-out group-hover:scale-110 object-cover"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <span className="absolute top-4 right-4 bg-brand-primary text-white px-3 py-1 rounded-full text-sm">
                {car.condition}
              </span>
              <button
                className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  handleFavorite(car.id); // Toggle favorite status
                }}
              >
                <Heart
                  className={`w-5 h-5 ${favorites.includes(car.id) ? 'fill-red-500' : 'text-gray-600'}`}
                />
              </button>

              {car.discount && (
                <div className="absolute bottom-4 left-4 bg-red-500 text-white rounded-full p-2 shadow-md z-10 flex items-center justify-center">
                  <Gift className="w-4 h-4" />
                  <span className="text-xs font-bold ml-1">{car.discount}</span>
                </div>
              )}
            </div>
            <div className="p-4 rtl">
              <div className="flex justify-between items-start mb-1">
              <h2
  className="text-xl font-semibold truncate" // Add the truncate utility class
  style={{
    width: "160px",
    display: "block",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    maxWidth: "200px", // Ensure text container doesn't overflow
  }}
>
  {car.name}
</h2>

                <div className="text-xl font-bold text-brand-primary">{car.price}</div>
              </div>
              <div className="text-sm text-gray-600 mb-4">{car.monthlyInstallment}</div>
              <div className="flex justify-between items-center mb-4 text-sm text-brand-primary">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{car.year}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-brand-primary">{car.condition}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Droplet className="w-4 h-4" />
                  <span>{car.fuelType}</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t">
                <button
                  className="text-brand-primary hover:text-brand-dark text-sm flex items-center gap-1 transition-colors duration-300"
                  onClick={(e) => e.preventDefault()}
                >
                  عرض التفاصيل
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="text-sm text-brand-primary">
                  {car.interestedPeople} شخص مهتم بهذه السيارة
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CarCard;
