"use client"
import { useState } from "react"
import Image from "next/image"
import { useParams, usePathname } from "next/navigation"
import { Breadcrumb } from "../breadcrumb"
const contactCards = [
  {
    icon: "/icons/clock.svg",
    title: { ar: "ساعات العمل", en: "Working Hours" },
    description: { ar: "9-12 ص / 4-9 م", en: "9AM-12PM / 4-9PM" },
  },
  {
    icon: "/icons/Email.svg",
    title: { ar: "البريد الإلكتروني", en: "Email" },
    description: "info@alromaihcars.com",
    isEmail: true,
  },
  {
    icons: ["/icons/whatsApp.svg", "/icons/call.svg"],
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
  const pathname = usePathname()
  const isEnglish = !pathname.startsWith("/ar")
  const [activeLocation, setActiveLocation] = useState("riyadh")

  // Generate breadcrumb items
  const getBreadcrumbItems = () => {
    return [
      {
        label: isEnglish ? "Home" : "الرئيسية",
        href: `/${locale}`,
      },
      {
        label: isEnglish ? "Contact Us" : "تواصل معنا",
      },
    ]
  }

  return (
    <main className="container min-h-screen mx-auto ">
      {/* Breadcrumb Navigation */}
      <div className="py-4">
        <Breadcrumb items={getBreadcrumbItems()} />
      </div>

      {/* Header Section */}
      <div className="relative">
        <div className="bg-brand-light h-[250px] sm:h-[320px] md:h-[400px] rounded-[10px] flex items-center justify-center">
          <div className="mx-auto px-4 w-full">
            <div className="text-center">
              <h1
                className={`text-3xl sm:text-5xl md:text-6xl font-bold text-brand-primary mb-2 sm:mb-6 ${locale === "ar" ? "font-noto" : ""}`}
              >
                {locale === "ar" ? "تواصل معنا" : "Contact Us"}
              </h1>
              <p
                className={`text-xs sm:text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-2 sm:px-4 line-clamp-3 sm:line-clamp-none ${locale === "ar" ? "font-noto" : ""}`}
              >
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-6 sm:mt-0">
              {contactCards.map((card, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 text-center shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center gap-3">
                    {card.icons ? (
                      card.icons.map((icon, i) => (
                        <Image key={i} src={icon || "/placeholder.svg"} alt="icon" width={32} height={32} />
                      ))
                    ) : (
                      <Image src={card.icon || "/placeholder.svg"} alt="icon" width={32} height={32} />
                    )}
                  </div>
                  <h3 className={`text-lg font-bold text-brand-primary mb-3 ${locale === "ar" ? "font-noto" : ""}`}>
                    {card.title[locale]}
                  </h3>
                  {card.isEmail ? (
                    <a
                      href={`mailto:${card.description}`}
                      className="text-gray-600 hover:text-brand-primary transition-colors"
                    >
                      {card.description}
                    </a>
                  ) : card.isPhone ? (
                    <a
                      href={`tel:${card.description}`}
                      className="text-brand-primary hover:text-brand-dark transition-colors text-lg"
                    >
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
      </div>

      {/* Map Section */}
      <div className="bg-white rounded-[10px] pt-16 pb-8 md:mt-[8rem]">
        <div className="max-w-[1300px] mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-3/4">
              {/* Maps Container */}
              <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
                {/* Riyadh Map */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.6752567391066!2d46.6885365!3d24.7136238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0x33b1a875e4e2a808!2sAl%20Rumaih%20Cars!5e0!3m2!1sen!2ssa!4v1651234567890!5m2!1sen!2ssa"
                  width="100%"
                  height="400"
                  style={{ border: 0, display: activeLocation === "riyadh" ? "block" : "none" }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>

                {/* Arar Map */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3386.0123456789!2d41.0382456!3d30.9753421!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x156a9f7b5e8d8d8d%3A0x1a1a1a1a1a1a1a1a!2sAl%20Rumaih%20Cars!5e0!3m2!1sen!2ssa!4v1651234567891!5m2!1sen!2ssa"
                  width="100%"
                  height="400"
                  style={{ border: 0, display: activeLocation === "arar" ? "block" : "none" }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>

                {/* Location Cards */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-col md:flex-row gap-4">
                  {activeLocation === "riyadh" ? (
                    <div className="bg-[#C6AECC]/90 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4 w-full md:w-auto shadow-md">
                      <div className="w-24 h-16 relative overflow-hidden rounded-sm">
                        <Image
                          src={locationCards[1].image || "/placeholder.svg"}
                          alt="location"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className={`text-brand-primary font-bold mb-1 ${locale === "ar" ? "font-noto" : ""}`}>
                          {locationCards[1].title[locale]}
                        </h3>
                        <p className="text-sm text-gray-600">{locationCards[1].address}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#C6AECC]/90 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4 w-full md:w-auto shadow-md">
                      <div className="w-24 h-16 relative overflow-hidden rounded-sm">
                        <Image
                          src={locationCards[0].image || "/placeholder.svg"}
                          alt="location"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className={`text-brand-primary font-bold mb-1 ${locale === "ar" ? "font-noto" : ""}`}>
                          {locationCards[0].title[locale]}
                        </h3>
                        <p className="text-sm text-gray-600">{locationCards[0].address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Visit Us */}
            <div className="w-full lg:w-1/4 flex items-center">
              <div className="bg-brand-light/90 rounded-xl p-6 w-full shadow-lg border border-gray-100">
                <div className="flex flex-col items-center gap-4 mb-6">
                  <Image src="/images/Visit-Us.svg" alt="Visit Us Icon" width={48} height={48} />
                  <h3 className={`text-2xl font-bold text-brand-primary ${locale === "ar" ? "font-noto" : ""}`}>
                    {locale === "ar" ? "قم بزيارتنا" : "Visit Us"}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveLocation("riyadh")}
                    className={`flex-1 ${activeLocation === "riyadh" ? "bg-brand-primary text-white" : "bg-white text-gray-600"} py-3 px-4 text-lg ${locale === "ar" ? "font-noto" : ""}`}
                    style={{ borderRadius: "3px" }}
                  >
                    {locale === "ar" ? "الرياض" : "Riyadh"}
                  </button>
                  <button
                    onClick={() => setActiveLocation("arar")}
                    className={`flex-1 ${activeLocation === "arar" ? "bg-brand-primary text-white" : "bg-white text-gray-600"} py-3 px-4 text-lg ${locale === "ar" ? "font-noto" : ""}`}
                    style={{ borderRadius: "3px" }}
                  >
                    {locale === "ar" ? "عرعر" : "Arar"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Car Image */}
      <div className="container mx-auto mt-8 rounded-[10px] overflow-hidden aspect-[16/9] sm:aspect-[16/7] md:aspect-[16/6] lg:aspect-[16/6] relative">
        <Image
          src="/images/main-car.jpg"
          alt="Car showcase"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
          priority
          className="object-cover object-center"
        />
      </div>
    </main>
  )
}
