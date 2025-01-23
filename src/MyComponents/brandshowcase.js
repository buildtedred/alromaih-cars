import React from 'react';

const BrandShowcase = () => {
  const brands = [
    { name: 'تويوتا', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg' },
    { name: 'هيونداي', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Hyundai_Motor_Company_logo.svg' },
    { name: 'كيا', logo: 'images/kia.svg' },
    { name: 'نيسان', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Nissan_2020_logo.svg' },
    { name: 'فورد', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg' },
    { name: 'شيفروليه', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Chevrolet_logo.svg' },
    { name: 'مرسيدس بنز', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg' },
    { name: 'بي إم دبليو', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg' },
    { name: 'أودي', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Audi_Logo.svg' },
    { name: 'بورش', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Porsche_Logo.svg' },
    { name: 'مازدا', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Mazda_logo_with_emblem.svg' },
    { name: 'جي إم سي', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/GMC_logo.svg' },
  ];

  return (
    <div className="bg-gray-100 w-full">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-right mb-12" dir="rtl">
        موزع معتمد
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-6 bg-white rounded-xl hover:shadow-md transition-shadow"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandShowcase;
