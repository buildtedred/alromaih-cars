'use client';

import { useTranslation } from 'react-i18next';
import { Car, Fuel, Settings, DollarSign } from 'lucide-react';
import Image from 'next/image';

const SearchResults = ({ query, filters }) => {
  const { t } = useTranslation();

  // Mock data - In a real app, this would come from an API
  const results = [
    {
      id: 1,
      title: 'Toyota Camry',
      year: '2024',
      trim: 'Limited',
      price: 129900,
      image: 'https://iili.io/JJVxQMl.jpg', // Toyota Camry image
      specs: {
        mileage: '0',
        transmission: 'Automatic',
        fuelType: 'Hybrid',
      }
    },
    {
      id: 2,
      title: 'Lexus ES',
      year: '2024',
      trim: 'F Sport',
      price: 189900,
      image: 'https://iili.io/JJVxZyB.jpg', // Lexus ES image
      specs: {
        mileage: '0',
        transmission: 'Automatic',
        fuelType: 'Petrol',
      }
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          {t('search.results', { count: results.length })}
        </h3>
        <div className="flex items-center gap-2">
          <select className="px-3 py-2 border rounded-lg text-sm">
            <option>{t('search.sortBy.recommended')}</option>
            <option>{t('search.sortBy.priceLowHigh')}</option>
            <option>{t('search.sortBy.priceHighLow')}</option>
            <option>{t('search.sortBy.newest')}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {results.map((car) => (
          <div 
            key={car.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-72 h-48 md:h-auto relative">
                <Image
                  src={car.image}
                  alt={`${car.year} ${car.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 288px"
                  priority={car.id === 1}
                  className="object-cover"
                />
              </div>
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">
                      {car.year} {car.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">{car.trim}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-brand-primary">
                      {car.price.toLocaleString()} SAR
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {t('search.priceBeforeTaxes')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Car className="h-5 w-5" />
                    <span className="text-sm">{car.specs.mileage} KM</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Settings className="h-5 w-5" />
                    <span className="text-sm">{car.specs.transmission}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Fuel className="h-5 w-5" />
                    <span className="text-sm">{car.specs.fuelType}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-6 border-t">
                  <button className="px-6 py-2 text-brand-primary border-2 border-brand-primary rounded-lg hover:bg-brand-primary hover:text-white transition-colors">
                    {t('search.actions.details')}
                  </button>
                  <button className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark transition-colors">
                    <span className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      {t('search.actions.inquire')}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;