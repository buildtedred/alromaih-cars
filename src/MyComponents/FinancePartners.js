import React from 'react';

const partners = [
  { name: 'البنك الأهلي السعودي', logo: 'images/SNB.png' },
  { name: 'مصرف الراجحي', logo: 'images/alrajhi.png' },
  { name: 'بنك الرياض', logo: 'images/RiyadBank.png' },
  { name: 'البنك السعودي الفرنسي', logo: 'images/banque-saud.png' },
  { name: 'بنك البلاد', logo: 'images/Bank_Albilad.png' },
  { name: 'شركة اليسر للتمويل', logo: 'images/alyusr.png' },
];

// Named export
export const FinancePartners = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">شركاء التمويل</h2>
          <p className="text-gray-600">
            نتعاون مع أفضل البنوك وشركات التمويل في المملكة
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-full h-12 object-contain"
              />
              <div className="text-center mt-4 text-sm text-gray-600">
                {partner.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
