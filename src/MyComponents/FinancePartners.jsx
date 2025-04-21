"use client";
import { usePathname } from "next/navigation";

const partners = [
  {
    name: {
      ar: "البنك الأهلي السعودي",
      en: "Saudi National Bank",
    },
    logo: "images/SNB.png",
  },
  {
    name: {
      ar: "مصرف الراجحي",
      en: "Al Rajhi Bank",
    },
    logo: "images/alrajhi.png",
  },
  {
    name: {
      ar: "بنك الرياض",
      en: "Riyad Bank",
    },
    logo: "images/RiyadBank.png",
  },
  {
    name: {
      ar: "البنك السعودي الفرنسي",
      en: "Saudi French Bank",
    },
    logo: "images/banque-saud.png",
  },
  {
    name: {
      ar: "بنك البلاد",
      en: "Bank Albilad",
    },
    logo: "images/Bank_Albilad.png",
  },
  {
    name: {
      ar: "شركة اليسر للتمويل",
      en: "Al Yusr Finance Company",
    },
    logo: "images/alyusr.png",
  },
];

// Named export
export const FinancePartners = () => {
  const pathname = usePathname();
  const isArabic = pathname?.startsWith("/ar");

  const content = {
    title: isArabic ? "شركاء التمويل" : "Finance Partners",
    description: isArabic
      ? "نتعاون مع أفضل البنوك وشركات التمويل في المملكة"
      : "We collaborate with the best banks and finance companies in the Kingdom",
  };

  return (
   
      <div className="py-16">
        <div className=" mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{content.title}</h2>
            <p className="text-gray-600">{content.description}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {partners.map((partner) => (
              <div
                key={isArabic ? partner.name.ar : partner.name.en}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={partner.logo || "/placeholder.svg"}
                  alt={isArabic ? partner.name.ar : partner.name.en}
                  className="w-full h-12 object-contain"
                />
                <div className="text-center mt-4 text-sm text-gray-600">
                  {isArabic ? partner.name.ar : partner.name.en}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
   
  );
};

export default FinancePartners;
