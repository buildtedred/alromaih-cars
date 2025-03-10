"use client"

import { useCallback, useEffect, useState } from "react"
import { useBrands } from "@/contexts/AllDataProvider"
import "react-loading-skeleton/dist/skeleton.css"
import CarCardItem from "./CarCardItem"
import LoadingUi from "../LoadingUi/LoadingUi"
import { useLanguageContext } from "@/contexts/LanguageSwitcherContext"
import { Button } from "@/components/ui/button"
import { Link } from '@/i18n/routing';
import { useOdoo } from "@/contexts/OdooContext"
import axios from "axios"

const CarCar = () => {
  const { testData, loadingtestData, } = useOdoo();
  const { isEnglish } = useLanguageContext()
  const { brands, error } = useBrands()
  const [favorites, setFavorites] = useState([])

  // console.log('object', testData)


  const handleFavorite = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites((prev) => (prev.includes(id) ? prev.filter((carId) => carId !== id) : [...prev, id]))
  }
//////////////////////////////////////////// mode data for testing /////////////////////////////

const [mocData, setmocData] = useState([]);
const [loadingmocData, setloadingmocData] = useState(true);

console.log("mocData data:", mocData);

const fetchsliderData = useCallback(async () => {
  setloadingmocData(true); // Fix: Correct state setter
  try {
    const response = await axios.get("https://67c7bf7cc19eb8753e7a9248.mockapi.io/api/alromaih");

    setmocData(response.data); // Fix: Access response.data
  } catch (error) {
    console.error("Error fetching brands:", error);
  } finally {
    setloadingmocData(false);
  }
}, []);

useEffect(() => {
  fetchsliderData();
}, [fetchsliderData]);

//////////////////////////////////////////// mode data for testing end /////////////////////////////

  if (loadingmocData) {
    return (


      <LoadingUi />



    )
  }

  // if (error) {
  //   return <p className="text-center text-red-500 text-xl mt-8">Error: {error}</p>
  // }

  // Limit the number of cars shown initially
  // const carsToShow = 8
  // const allCars = brands?.data?.flatMap((brand) => brand.car_models || [])
  // const displayedCars = allCars?.slice(0, carsToShow)

  return (
    <div className="max-w-[calc(100%-0rem)] md:max-w-[calc(100%-10rem)] mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        {isEnglish ? "Our Car Collection" : "مجموعة سياراتنا"}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mocData?.map(car =>
          
            <CarCardItem
              key={car.id}
              car={car}
              isEnglish={isEnglish}
              favorites={favorites}
              handleFavorite={handleFavorite}
            />
          
        )}

      </div>
      {/* {allCars?.length > carsToShow && (
        <div className="mt-8 text-center">
          <Link href="/all-cars">
            <Button variant="outline" size="lg">
              {isEnglish ? "See More Cars" : "شاهد المزيد من السيارات"}
            </Button>
          </Link>
        </div>
      )} */}
    </div>
  )
}

export default CarCar
