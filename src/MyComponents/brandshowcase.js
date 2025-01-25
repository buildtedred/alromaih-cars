"use client"
import { useBrands } from '@/contexts/AllDataProvider';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const BrandShowcase = () => {
  const { brands, loading, error } = useBrands();

  console.log("objectcccccccccccc brandddd", brands?.data)

  return (
    <div className="bg-gray-100 w-full">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12">
          موزع معتمد
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {loading ? (
            Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-6 bg-white rounded-xl"
              >
                <Skeleton circle={true} height={48} width={48} />
              </div>
            ))
          ) : (
            brands?.data?.map((brand, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-6 bg-white rounded-xl hover:shadow-md transition-shadow"
              >
                <img
                  src={`https://xn--mgbml9eg4a.com${brand.image_url}`}
                  alt={brand.name}
                  className="h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all"
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandShowcase;
