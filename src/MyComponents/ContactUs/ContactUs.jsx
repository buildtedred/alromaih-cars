"use client"
import Image from "next/image"
import { useParams } from "next/navigation"

export default function ContactPage() {
  // Get locale from URL params
  const params = useParams()
  const locale = params?.locale || "ar" // Default to Arabic if locale not found

  return (
    <main className="min-h-screen bg-white">
      {/* Split Background Container */}
      <div className="relative">
        {/* Top Purple Background */}
        <div className="bg-brand-light h-[400px]">
          <div className="max-w-[calc(100%-1.5rem)] sm:max-w-[calc(100%-3rem)] md:max-w-[calc(100%-6rem)] lg:max-w-[calc(100%-10rem)] xl:max-w-[1300px] mx-auto pt-20 sm:pt-24 md:pt-28">
            <div className="text-center mb-12">
              <h1
                className={`text-4xl sm:text-5xl md:text-6xl font-bold text-brand-primary mb-6 ${locale === "ar" ? "font-noto" : ""}`}
              >
                {locale === "ar" ? "تواصل معنا" : "Contact Us"}
              </h1>
              <p
                className={`text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4 ${locale === "ar" ? "font-noto" : ""}`}
              >
                {locale === "ar"
                  ? "يسعدنا تواصلكم معنا! فريقنا جاهز للرد على استفساراتكم وتلبية احتياجاتكم. ابق على اتصال للحصول على أفضل الحلول والخدمات."
                  : "We're delighted to hear from you! Our team is ready to respond to your inquiries and meet your needs. Stay connected for the best solutions and services."}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Cards - Positioned at the split */}
        <div className="absolute left-0 right-0 top-[320px]">
          <div className="max-w-[calc(100%-1.5rem)] sm:max-w-[calc(100%-3rem)] md:max-w-[calc(100%-6rem)] lg:max-w-[calc(100%-10rem)] xl:max-w-[1300px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto px-4">
              {/* Working Hours Card */}
              <div className="bg-brand-light rounded-xl p-6 text-center shadow-lg border border-gray-100">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Image src="/images/Clock.svg" alt="Clock icon" width={32} height={32} />
                </div>
                <h3 className={`text-lg font-bold text-brand-primary mb-3 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar" ? "ساعات العمل" : "Working Hours"}
                </h3>
                <p className={`text-gray-600 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar" ? "9-12 ص / 4-9 م" : "9AM-12PM / 4-9PM"}
                </p>
              </div>

              {/* Email Card */}
              <div className="bg-brand-light rounded-xl p-6 text-center shadow-lg border border-gray-100">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Image src="/images/Email.svg" alt="Email icon" width={32} height={32} />
                </div>
                <h3 className={`text-lg font-bold text-brand-primary mb-3 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar" ? "البريد الإلكتروني" : "Email"}
                </h3>
                <a
                  href="mailto:info@alromaihcars.com"
                  className="text-gray-600 hover:text-brand-primary transition-colors"
                >
                  info@alromaihcars.com
                </a>
              </div>

              {/* Phone Card */}
              <div className="bg-brand-dark rounded-xl p-6 text-center shadow-lg border border-gray-100">
                <div className="w-24 h-16 mx-auto mb-4 flex items-center justify-center gap-3">
                  <Image src="/images/WhatsApp.svg" alt="WhatsApp icon" width={32} height={32} />
                  <Image src="/images/Call.svg" alt="Call icon" width={32} height={32} />
                </div>
                <h3 className={`text-lg font-bold text-brand-primary mb-3 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar" ? "اتصل أو ارسلنا" : "Call or Text Us"}
                </h3>
                <a href="tel:920031202" className="text-brand-primary hover:text-brand-dark transition-colors text-lg">
                  9200 31 202
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer for content below cards */}
        <div className="h-[160px]"></div>
      </div>

      {/* Map and Visit Us Section */}
      <div className="bg-white pt-16 pb-8">
        <div className="max-w-[calc(100%-1.5rem)] sm:max-w-[calc(100%-3rem)] md:max-w-[calc(100%-6rem)] lg:max-w-[calc(100%-10rem)] xl:max-w-[1300px] mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Map Section */}
            <div className="w-full lg:w-3/4">
              <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.6752757528395!2d46.71373!3d24.7468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0x5b5b0344b2b7ea58!2sAl%20Qadisiyah%2C%20Riyadh%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1710196238161!5m2!1sen!2sus&disableDefaultUI=true"
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
                  {/* Arar Location */}
                  <div className="bg-brand-dark/90 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4 w-full md:w-auto shadow-md">
                    <div className="w-24 h-16 relative overflow-hidden" style={{ borderRadius: "3px" }}>
                      <Image src="/images/location-Area.JPG" alt="Arar showroom" fill className="object-cover" />
                    </div>
                    <div>
                      <h3 className={`text-brand-primary font-bold mb-1 ${locale === "ar" ? "font-noto" : ""}`}>
                        {locale === "ar" ? "معرض الرميح للسيارات" : "Al Rumaih Cars"}
                      </h3>
                      <p className="text-sm text-gray-600">2W2R+2PQ, Car Gallery, Arar 73313</p>
                    </div>
                  </div>

                  {/* Riyadh Location */}
                  <div className="bg-brand-dark/90 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4 w-full md:w-auto shadow-md">
                    <div className="w-24 h-16 relative overflow-hidden" style={{ borderRadius: "3px" }}>
                      <Image src="/images/location-Area.JPG" alt="Riyadh showroom" fill className="object-cover" />
                    </div>
                    <div>
                      <h3 className={`text-brand-primary font-bold mb-1 ${locale === "ar" ? "font-noto" : ""}`}>
                        {locale === "ar" ? "معرض الرميح للسيارات" : "Al Rumaih Cars"}
                      </h3>
                      <p className="text-sm text-gray-600">وادي الغيل, Al Qadisiyyah, Riyadh 13261</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visit Us Section */}
            <div className="w-full lg:w-1/4 flex items-center">
              <div className="bg-brand-light rounded-xl p-6 w-full shadow-lg border border-gray-100">
                <div className="flex flex-col items-center gap-4 mb-6">
                  <Image src="/images/Visit-Us.svg" alt="Visit Us Icon" width={48} height={48} />
                  <h3 className={`text-2xl font-bold text-brand-primary ${locale === "ar" ? "font-noto" : ""}`}>
                    {locale === "ar" ? "قم بزيارتنا" : "Visit Us"}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button
                    className={`flex-1 bg-brand-primary text-white py-3 px-4 text-lg ${locale === "ar" ? "font-noto" : ""}`}
                    style={{ borderRadius: "3px" }}
                  >
                    {locale === "ar" ? "الرياض" : "Riyadh"}
                  </button>
                  <button
                    className={`flex-1 bg-white text-gray-600 py-3 px-4 text-lg ${locale === "ar" ? "font-noto" : ""}`}
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
      <div className="w-full h-[547px] relative">
        <Image src="/images/main-car.jpg" alt="Car showcase" fill className="object-cover object-center" />
      </div>
    </main>
  )
}

