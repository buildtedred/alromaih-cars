"use client";
import React from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Heart, Calendar, Droplet, ChevronLeft, Gift } from "lucide-react"; // Ensure these icons are imported

const BrandDynomicData = ({ carDetails }) => {
  const pathname = usePathname();
  const isEnglish = pathname.startsWith("/en");

  // Handle favorite functionality
  const handleFavorite = (e, carId) => {
    e.preventDefault();
    console.log("Favorite clicked for car ID:", carId);
    // Add your logic to handle favorites here
  };

  // Check if carDetails or carDetails.data is undefined
  if (!carDetails || !carDetails.data) {
    return <div>No car details available.</div>;
  }

  return (
    <div className="max-w-[calc(100%-0rem)] md:max-w-[calc(100%-10rem)] mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        {isEnglish ? "Our Car Collection" : "مجموعة سياراتنا"}
      </h1>
      {carDetails.data.map((brand) => (
        <React.Fragment key={brand.id}>


          {/* Brand Name and Description */}
          <div className="col-span-full">
            <h2 className="text-lg font-semibold text-gray-800 truncate">
              {isEnglish ? brand.name.en.name : brand.name.ar.name}
            </h2>

            <p className="text-sm text-gray-600 mt-2 line-clamp-3">
              {isEnglish ? brand.name.en.description : brand.name.ar.description}
            </p>

          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">


            {/* Car Models */}
            {brand.car_models.map((car) => (
              <Link
                key={car.id}
                href={`/car-details/${isEnglish ? car.name.en.slug : car.name.ar.slug}`}
                className="block group mt-8"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full">
                  {/* Car Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={
                        car.image_url
                          ? `https://xn--mgbml9eg4a.com${car.image_url}`
                          : "/default-car.jpg"
                      }
                      alt={isEnglish ? car.name.en.name : car.name.ar.name || "car name"}
                      fill
                      style={{ objectFit: "cover" }}
                      className="transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="absolute top-2 right-2 bg-brand-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {isEnglish ? car.name.en.condition : car.name.ar.condition}
                    </span>
                    <button
                      className="absolute top-2 left-2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100 transition-colors"
                      onClick={(e) => handleFavorite(e, car.id)}
                    >
                      <Heart
                        className={`w-5 h-5 ${false ? "fill-purple-500 text-purple-500" : "text-gray-600"
                          }`} // Replace `false` with your favorite logic
                      />
                    </button>
                    {car.discount && (
                      <div className="absolute bottom-2 left-2 bg-red-500 text-white rounded-full px-3 py-1 shadow-md z-10 flex items-center justify-center">
                        <Gift className="w-4 h-4 mr-1" />
                        <span className="text-xs font-bold">{car.name.en.discount}</span>
                      </div>
                    )}
                  </div>

                  {/* Car Details */}
                  <div className="p-4 rtl">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-lg font-semibold text-gray-800 truncate">
                        {isEnglish ? car.name.en.name : car.name.ar.name}
                      </h2>
                      <div className="text-lg font-bold text-brand-primary">{car.price}</div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">{car.monthlyInstallment}</div>
                    <div className="flex justify-between items-center mb-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{car.year_of_manufacture}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-brand-primary">
                          {isEnglish ? car.name.en.condition : car.name.ar.condition}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Droplet className="w-4 h-4" />
                        {car?.vehicle_fuel_types?.map((fuelType, index) => (
                          <span key={index}>
                            {isEnglish ? fuelType.fuel_type.en : fuelType.fuel_type.ar}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                      <button
                        className="text-brand-primary hover:text-brand-dark text-sm flex items-center gap-1 transition-colors duration-300"
                        onClick={(e) => e.preventDefault()}
                      >
                        <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                        {isEnglish ? "View details" : "عرض التفاصيل"}
                      </button>
                      <div className="text-xs text-brand-primary">
                        {isEnglish
                          ? `${car.interestedPeople} interested`
                          : `${car.interestedPeople} مهتم`}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default BrandDynomicData;