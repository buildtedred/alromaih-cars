import { useBrands } from '@/contexts/AllDataProvider';
import { Link } from '@/i18n/routing';
import { Card, CardContent } from "@/components/ui/card";
import React from 'react';
import { usePathname } from 'next/navigation';

const Brands = () => {
    const { brands, loading, error } = useBrands();
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    const pathname = usePathname()
  const isEnglish = pathname.startsWith("/en")
  console.log("isEnglish", isEnglish)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {brands?.data?.map((brand, index) => (
          <div key={index} className="p-1 md:p-2 lg:p-3">
            <Link href={`/brands/${brand?.name?.en?.slug}`}>
              <Card className="h-full flex flex-col transition-all hover:shadow-lg">
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <img
                    src={`https://xn--mgbml9eg4a.com${brand?.image_url}`}
                    alt={brand.name?.en?.name}
                    className="h-20 w-auto object-contain filter grayscale hover:grayscale-0 transition-all mb-4"
                  />
                  <p className="text-center font-bold text-gray-700 text-sm md:text-base lg:text-lg whitespace-nowrap">
                    {isEnglish?brand?.name?.en?.name:brand?.name?.ar?.name}
                  </p>
         
                    <p className="text-center text-gray-500 text-xs md:text-sm mt-2 line-clamp-3">
                      {isEnglish?brand?.name?.en?.description : brand?.name?.ar?.description}
                    </p>
        
                </CardContent>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brands;