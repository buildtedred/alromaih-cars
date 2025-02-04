import { useState } from "react"
import { Heart, Calendar, Droplet, ChevronLeft } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/routing"
import { usePathname } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import LoadingUi from "@/MyComponents/LoadingUi/LoadingUi"


export function CarCard({ car,loading }) {
  const [isLiked, setIsLiked] = useState(false)

  const handleLikeClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setIsLiked(!isLiked)
  }

  // console.log("from all car api",car?.name?.en?.slug)
    const pathname = usePathname()
    const isEnglish = pathname.startsWith("/en")
    console.log("isEnglish", isEnglish)

    if (loading) {
      return (
        <LoadingUi/>
      );
    }
  return (
    <Link href={`/car-details/${car?.name?.en?.slug}`} className="block w-full">
      <div className="relative bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group h-full w-full">
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={`https://xn--mgbml9eg4a.com${car.image_url}`}
            alt={`${car.year_of_manufacture} ${car.brand_name.en} ${car.name.en.name}`}
            fill
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

          {/* New Badge in Upper Corner */}
         
            <span className="absolute top-2 right-2 bg-[#71308A] text-white px-2 py-1 rounded-full text-xs font-semibold">
            {isEnglish ? car.name.en.condition : car.name.ar.condition}
            </span>
          

          {/* Like Button */}
          <button
            onClick={handleLikeClick}
            className="absolute top-2 left-2 bg-white rounded-full p-1.5 shadow-md z-10 hover:bg-gray-100 transition-colors"
          >
            <Heart className={cn("w-4 h-4", isLiked ? "fill-purple-500 text-purple-500" : "text-gray-600")} />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Title and Price */}
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-semibold truncate">
              {/* {car.brand_name.en}  */}
              {isEnglish?car.name.en.name:car.name.ar.name}
            </h2>
            <div className="text-lg font-bold text-[#71308A]">₹{car.price.toLocaleString()}</div>
          </div>

          {/* Car Details */}
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{car.year_of_manufacture}</span>
            </div>
            <div className="flex items-center gap-1">
              <Droplet className="w-4 h-4" />
              <span>{isEnglish?car.vehicle_fuel_types[0]?.fuel_type.en || "N/A":car.vehicle_fuel_types[0]?.fuel_type.ar || "N/A"}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v2" />
                <path d="M12 14v2" />
                <path d="M12 18v2" />
                <path d="M8 6h8v3a4 4 0 0 1-8 0V6z" />
                <path d="M12 22c-4 0-7-3-7-7V5h14v10c0 4-3 7-7 7z" />
              </svg>
              <span>{car.name.en.transmission || "N/A"}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20s-8-2.2-8-10V5l8-3 8 3v5c0 7.8-8 10-8 10z" />
                <path d="M12 20V10" />
              </svg>
              <span>{car.seating_capacity || "N/A"} seats</span>
            </div>
          </div>
          

          {/* Footer */}
          <div className="flex justify-between items-center pt-2 border-t">
            <button className="text-[#71308A] hover:text-[#5a2670] text-sm flex items-center gap-1 transition-colors duration-300">
              <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              View details
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

