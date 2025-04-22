"use client"
import Image from "next/image"
import { useParams } from "next/navigation"

const contactCards = [
  {
    icon: "/images/Clock.svg",
    title: { ar: "ساعات العمل", en: "Working Hours" },
    description: { ar: "9-12 ص / 4-9 م", en: "9AM-12PM / 4-9PM" },
  },
  {
    icon: "/images/Email.svg",
    title: { ar: "البريد الإلكتروني", en: "Email" },
    description: "info@alromaihcars.com",
    isEmail: true,
  },
  {
    icons: ["/images/WhatsApp.svg", "/images/Call.svg"],
    title: { ar: "اتصل أو ارسلنا", en: "Call or Text Us" },
    description: "9200 31 202",
    isPhone: true,
  },
]

const locationCards = [
  {
    image: "/images/location-Area.JPG",
    title: { ar: "معرض الرميح للسيارات", en: "Al Rumaih Cars" },
    address: "2W2R+2PQ, Car Gallery, Arar 73313",
  },
  {
    image: "/images/location-Area.JPG",
    title: { ar: "معرض الرميح للسيارات", en: "Al Rumaih Cars" },
    address: "وادي الغيل, Al Qadisiyyah, Riyadh 13261",
  },
]

export default function ContactPage() {
  const params = useParams()
  const locale = params?.locale || "ar"

  return (
    <main className="container mx-auto ">
      {/* Header Section */}
      <div className="relative">
        <div className="bg-brand-light h-[400px] rounded-[10px]">
          <div className="mx-auto px-4 pt-20 sm:pt-24 md:pt-28">
            <div className="text-center mb-12">
              <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold text-brand-primary mb-6 ${locale === "ar" ? "font-noto" : ""}`}>
                {locale === "ar" ? "تواصل معنا" : "Contact Us"}
              </h1>
              <p className={`text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4 ${locale === "ar" ? "font-noto" : ""}`}>
                {locale === "ar"
                  ? "يسعدنا تواصلكم معنا! فريقنا جاهز للرد على استفساراتكم وتلبية احتياجاتكم. ابق على اتصال للحصول على أفضل الحلول والخدمات."
                  : "We're delighted to hear from you! Our team is ready to respond to your inquiries and meet your needs. Stay connected for the best solutions and services."}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Cards */}
        <div className="md:absolute md:left-0 md:right-0 md:top-[320px]">
          <div className="max-w-[1300px] mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {contactCards.map((card, index) => (
                <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100 hover:bg-brand-light/50 transition-all duration-300">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center gap-3">
                    {card.icons ? (
                      card.icons.map((icon, i) => (
                        <Image key={i} src={icon} alt="icon" width={32} height={32} />
                      ))
                    ) : (
                      <Image src={card.icon} alt="icon" width={32} height={32} />
                    )}
                  </div>
                  <h3 className={`text-lg font-bold text-brand-primary mb-3 ${locale === "ar" ? "font-noto" : ""}`}>
                    {card.title[locale]}
                  </h3>
                  {card.isEmail ? (
                    <a href={`mailto:${card.description}`} className="text-gray-600 hover:text-brand-primary transition-colors">
                      {card.description}
                    </a>
                  ) : card.isPhone ? (
                    <a href={`tel:${card.description}`} className="text-brand-primary hover:text-brand-dark transition-colors text-lg">
                      {card.description}
                    </a>
                  ) : (
                    <p className={`text-gray-600 ${locale === "ar" ? "font-noto" : ""}`}>{card.description[locale]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* <div className="h-[160px]"></div> */}
      </div>

      {/* Map Section */}
      <div className="bg-white rounded-[10px] pt-16 pb-8 md:mt-[8rem]">
        <div className="max-w-[1300px] mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-3/4">
              <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=..."
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>

                {/* Location Cards */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-col md:flex-row gap-4">
                  {locationCards.map((location, idx) => (
                    <div key={idx} className="bg-[#C6AECC]/90 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4 w-full md:w-auto shadow-md">
                      <div className="w-24 h-16 relative overflow-hidden rounded-sm">
                        <Image src={location.image} alt="location" fill className="object-cover" />
                      </div>
                      <div>
                        <h3 className={`text-brand-primary font-bold mb-1 ${locale === "ar" ? "font-noto" : ""}`}>
                          {location.title[locale]}
                        </h3>
                        <p className="text-sm text-gray-600">{location.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Visit Us */}
            <div className="w-full lg:w-1/4 flex items-center">
              <div className="bg-[#F8F2F8] rounded-xl p-6 w-full shadow-lg border border-gray-100">
                <div className="flex flex-col items-center gap-4 mb-6">
                  <Image src="/images/Visit-Us.svg" alt="Visit Us Icon" width={48} height={48} />
                  <h3 className={`text-2xl font-bold text-brand-primary ${locale === "ar" ? "font-noto" : ""}`}>
                    {locale === "ar" ? "قم بزيارتنا" : "Visit Us"}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button className={`flex-1 bg-brand-primary text-white py-3 px-4 text-lg ${locale === "ar" ? "font-noto" : ""}`} style={{ borderRadius: "3px" }}>
                    {locale === "ar" ? "الرياض" : "Riyadh"}
                  </button>
                  <button className={`flex-1 bg-white text-gray-600 py-3 px-4 text-lg ${locale === "ar" ? "font-noto" : ""}`} style={{ borderRadius: "3px" }}>
                    {locale === "ar" ? "عرعر" : "Arar"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Car Image */}
      <div className="container mx-auto h-[547px] mt-8 md:h-[100vh] relative">
        <Image src="/images/main-car.jpg" alt="Car showcase" fill className="object-cover object-center rounded-[10px] " />
      </div>
    </main>
  )
}
