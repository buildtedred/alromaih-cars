import { useBrands } from "@/contexts/AllDataProvider"
import { Link } from "@/i18n/routing"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

const Brands = () => {
  const { brands, loading, error } = useBrands()
  const pathname = usePathname()
  const isEnglish = pathname.startsWith("/en")

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          fill="#71308A"
          fillOpacity="0.05"
          d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
      <div className="container mx-auto px-4 py-12 lg:px-36 relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-[#71308A]">
          {isEnglish ? "Our Exclusive Brands" : "علاماتنا التجارية الحصرية"}
        </h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-center py-10 text-red-500">Error: {error.message}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {brands?.data?.map((brand, index) => (
              <BrandCard key={index} brand={brand} isEnglish={isEnglish} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const BrandCard = ({ brand, isEnglish }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={`/brands/${brand?.name?.en?.slug}`}>
      <motion.div
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-purple-100"
        whileHover={{ y: -5 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-4 flex flex-col items-center h-full">
          <div className="w-full h-24 flex items-center justify-center mb-3">
            <img
              src={`https://xn--mgbml9eg4a.com${brand?.image_url}`}
              alt={brand.name?.en?.name}
              className="max-h-full max-w-full object-contain transition-all duration-300"
              style={{ filter: isHovered ? "grayscale(0)" : "grayscale(100%)" }}
            />
          </div>
          <h3 className="text-center font-semibold text-sm text-[#71308A] mb-2 truncate w-full">
            {isEnglish ? brand?.name?.en?.name : brand?.name?.ar?.name}
          </h3>
          <motion.p
            className="text-center text-xs text-gray-600 line-clamp-2 overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? "auto" : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isEnglish ? brand?.name?.en?.description : brand?.name?.ar?.description}
          </motion.p>
        </div>
      </motion.div>
    </Link>
  )
}

const Loader = () => (
  <div className="flex justify-center items-center h-64">
    <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" className="animate-spin">
      <circle
        cx="25"
        cy="25"
        r="20"
        stroke="#71308A"
        strokeWidth="5"
        fill="none"
        strokeDasharray="31.4 31.4"
        strokeLinecap="round"
        className="animate-dash"
      />
    </svg>
  </div>
)

export default Brands

