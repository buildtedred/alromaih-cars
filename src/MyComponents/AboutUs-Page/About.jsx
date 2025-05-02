"use client"
import Image from "next/image"
import { useParams, usePathname } from "next/navigation"
import { Breadcrumb } from "../breadcrumb"

export default function Home() {
  // Get locale from URL params
  const params = useParams()
  const locale = params?.locale || "ar" // Default to Arabic if locale not found
  const pathname = usePathname()
  const isEnglish = !pathname.startsWith("/ar")

  // Generate breadcrumb items
  const getBreadcrumbItems = () => {
    return [
      {
        label: isEnglish ? "Home" : "الرئيسية",
        href: `/${locale}`,
      },
      {
        label: isEnglish ? "About Us" : "من نحن",
      },
    ]
  }

  return (
    <main className="container mx-auto min-h-screen">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumb items={getBreadcrumbItems()} />
        </div>
      {/* Hero Image */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px]">
        <Image src="/images/main-car.jpg" alt="Car image" fill className="object-cover object-center rounded-[10px]" priority />
      </div>

      {/* Content Section - Now positioned below the image */}
      <div className="container mx-auto p-4 sm:p-6 bg-white mt-8 rounded-xl shadow-md">

        <h1
          className={`mt-6 text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-brand-primary ${locale === "ar" ? "rtl font-noto" : ""}`}
        >
          {locale === "ar" ? "تعرف على الرميح للسيارات" : "About Al Rumaih Cars"}
        </h1>

        <div className="hidden md:flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* 1996 Location */}
          <div className="flex flex-col items-center">
            <Image
              src="/images/LocationPin.svg"
              alt="Location pin"
              width={144}
              height={144}
              className="w-24 sm:w-28 md:w-32 lg:w-36 h-24 sm:h-28 md:h-32 lg:h-36"
            />
            <div className="bg-brand-light/30 px-4 sm:px-6 py-2 rounded-[5px] text-center mt-2">
              <div className="font-bold text-lg sm:text-xl font-noto">1996</div>
              <div className="text-xs sm:text-sm font-noto">{locale === "ar" ? "عرعر" : "Arar"}</div>
            </div>
          </div>

          {/* Center Content */}
          <div className={`flex-1 max-w-xl px-2 sm:px-4 ${locale === "ar" ? "rtl" : ""}`}>
            <p
              className={`text-sm sm:text-base text-gray-700 leading-relaxed mb-4 sm:mb-6 text-center ${locale === "ar" ? "font-noto" : ""}`}
            >
              {locale === "ar"
                ? "منذ عام 1996م انطلقنا في رحلة في مدينة عرعر شمال المملكة العربية السعودية. انطلاقاً من مبدأ خدمة العملاء وتقديم أفضل المنتجات، أصبحنا اليوم من أكبر معارض السيارات في المملكة العربية السعودية. ونسعى دائماً في تقديم أفضل الخدمات للعملاء لتلبية رغباتهم وتطلعاتهم."
                : "Since 1996, we embarked on a journey in the city of Arar in northern Saudi Arabia. Based on the principle of customer service and providing the best products, we have become one of the largest car showrooms in the Kingdom of Saudi Arabia. We always strive to provide the best services to customers to meet their desires and aspirations."}
            </p>

            {/* Car SVG */}
            <div className="flex justify-center my-2 sm:my-4">
              <Image
                src="/images/Car.svg"
                alt="Car illustration"
                width={271}
                height={69}
                className="w-[180px] sm:w-[220px] md:w-[271px] h-auto"
              />
            </div>
          </div>

          {/* 2023 Location */}
          <div className="flex flex-col items-center">
            <Image
              src="/images/LocationPin.svg"
              alt="Location pin"
              width={144}
              height={144}
              className="w-24 sm:w-28 md:w-32 lg:w-36 h-24 sm:h-28 md:h-32 lg:h-36"
            />
            <div className="bg-brand-light/30 px-4 sm:px-6 py-2 rounded-[5px] text-center mt-2">
              <div className="font-bold text-lg sm:text-xl font-noto">2023</div>
              <div className="text-xs sm:text-sm font-noto">{locale === "ar" ? "الرياض" : "Riyadh"}</div>
            </div>
          </div>
        </div>

        {/* for mobile  */}
        <div className="md:hidden">
          {/* Center Content */}
          <div className={`  flex-1  max-w-xl px-2 sm:px-4 ${locale === "ar" ? "rtl" : ""}`}>
            <p
              className={` text-[12px] sm:text-base text-gray-700 leading-relaxed mb-4 sm:mb-6 text-center ${locale === "ar" ? "font-noto" : ""}`}
            >
              {locale === "ar"
                ? "منذ عام 1996م انطلقنا في رحلة في مدينة عرعر شمال المملكة العربية السعودية. انطلاقاً من مبدأ خدمة العملاء وتقديم أفضل المنتجات، أصبحنا اليوم من أكبر معارض السيارات في المملكة العربية السعودية. ونسعى دائماً في تقديم أفضل الخدمات للعملاء لتلبية رغباتهم وتطلعاتهم."
                : "Since 1996, we embarked on a journey in the city of Arar in northern Saudi Arabia. Based on the principle of customer service and providing the best products, we have become one of the largest car showrooms in the Kingdom of Saudi Arabia. We always strive to provide the best services to customers to meet their desires and aspirations."}
            </p>
          </div>

          <div className="flex  justify-between gap-4 mb-8">
            {/* 1996 Location */}
            <div className="flex flex-col items-center">
              <Image
                src="/images/LocationPin.svg"
                alt="Location pin"
                width={30}
                height={30}
                // className="w-24 sm:w-28 md:w-32 lg:w-36 h-24 sm:h-28 md:h-32 lg:h-36"
              />
              <div className="bg-brand-light/30 px-4 sm:px-6 py-2 rounded-[5px] text-center mt-2">
                <div className="font-bold text-lg sm:text-xl font-noto">1996</div>
                <div className="text-xs sm:text-sm font-noto">{locale === "ar" ? "عرعر" : "Arar"}</div>
              </div>
            </div>

            {/* Car SVG */}
            <div className="flex justify-center my-2 sm:my-4">
              <Image
                src="/images/Car.svg"
                alt="Car illustration"
                width={130}
                height={30}
                // className="w-[180px] sm:w-[220px] md:w-[271px] h-auto"
              />
            </div>

            {/* 2023 Location */}
            <div className="flex flex-col items-center">
              <Image
                src="/images/LocationPin.svg"
                alt="Location pin"
                width={30}
                height={30}
                // className="w-24 sm:w-28 md:w-32 lg:w-36 h-24 sm:h-28 md:h-32 lg:h-36"
              />
              <div className="bg-brand-light/30 px-4 sm:px-6 py-2 rounded-[5px] text-center mt-2">
                <div className="font-bold text-lg sm:text-xl font-noto">2023</div>
                <div className="text-xs sm:text-sm font-noto">{locale === "ar" ? "الرياض" : "Riyadh"}</div>
              </div>
            </div>
          </div>
        </div>
        {/* for mobile  */}
      </div>

      {/* Features Section */}
      <div className="container mx-auto p-3 sm:p-4 mt-6 sm:mt-8 rounded-xl mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 max-w-[90%] mx-auto">
          {/* Map Location Card */}
          <div className="bg-brand-light rounded-xl h-[180px] sm:h-[200px] md:h-[220px] overflow-hidden p-3 sm:p-4">
            <div
              className={`flex ${locale === "ar" ? "justify-between" : "flex-row-reverse justify-between"} items-center h-full`}
            >
              <div>
                <Image
                  src="/images/MobileMap.svg"
                  alt="Mobile Map"
                  width={80}
                  height={120}
                  className="w-[60px] sm:w-[70px] md:w-[80px] h-auto"
                />
              </div>
              <div className={locale === "ar" ? "text-right" : "text-left"}>
                <h3
                  className={`text-sm sm:text-base font-bold text-brand-primary mb-1 ${locale === "ar" ? "font-noto" : ""}`}
                >
                  {locale === "ar" ? "إنشاء كيان عملاق" : "Creating a Giant Entity"}
                </h3>
                <p className={`text-xs sm:text-sm text-brand-primary ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar" ? "متعدد الفروع" : "With Multiple Branches"}
                </p>
              </div>
            </div>
          </div>

          {/* Handshake Card */}
          <div className="bg-brand-light rounded-xl h-[180px] sm:h-[200px] md:h-[220px] overflow-hidden">
            <div className="flex flex-col h-full justify-between pb-2 sm:pb-4">
              <div className="pt-8 sm:pt-10 md:pt-12 text-center px-3 sm:px-4">
                <h3
                  className={`text-sm sm:text-base font-bold text-brand-primary mb-1 ${locale === "ar" ? "font-noto" : ""}`}
                >
                  {locale === "ar"
                    ? "توطيد علاقتنا مع العملاء وتقديم خدمة"
                    : "Strengthening our relationship with customers"}
                </h3>
                <p className={`text-xs text-gray-600 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar" ? "احترافية بأسعار تنافسية" : "Professional service at competitive prices"}
                </p>
              </div>
              <div className="px-0">
                <Image
                  src="/images/Handshake.svg"
                  alt="Handshake icon"
                  width={240}
                  height={120}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Title Card */}
          <div className="bg-transparent rounded-xl h-[180px] sm:h-[200px] md:h-[220px] flex items-center justify-center p-2 sm:p-3">
            <div className="text-center w-full h-full flex flex-col justify-center">
              {locale === "ar" ? (
                <>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold text-brand-primary font-noto mb-1 sm:mb-2 leading-none">
                    ما نسعى
                  </h2>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold text-brand-primary font-noto leading-none">
                    لتحقيقه
                  </h2>
                </>
              ) : (
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold text-brand-primary leading-none">
                  Our Goals
                </h2>
              )}
            </div>
          </div>

          {/* Steering Wheel Card */}
          <div className="bg-brand-light rounded-xl h-[180px] sm:h-[200px] md:h-[220px] overflow-hidden">
            <div className="flex flex-col h-full">
              <div className="pt-8 sm:pt-10 md:pt-12 text-center px-3 sm:px-4 mb-2 sm:mb-4">
                <h3
                  className={`text-sm sm:text-base font-bold text-brand-primary mb-1 ${locale === "ar" ? "font-noto" : ""}`}
                >
                  {locale === "ar" ? "إتاحة سيارات متنوعة في مكان واحد" : "Providing diverse cars in one place"}
                </h3>
              </div>
              <div className="mt-auto">
                <Image
                  src="/images/SteeringWheel.svg"
                  alt="Steering wheel icon"
                  width={240}
                  height={160}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Scale and Coins Card */}
          <div className="bg-brand-light rounded-xl h-[180px] sm:h-[200px] md:h-[220px] overflow-hidden p-3 sm:p-4">
            <div
              className={`flex ${locale === "ar" ? "justify-between" : "flex-row-reverse justify-between"} items-center h-full`}
            >
              <div>
                <Image
                  src="/images/Coin.svg"
                  alt="Coin icon"
                  width={80}
                  height={80}
                  className="w-[60px] sm:w-[70px] md:w-[80px] h-auto"
                />
              </div>
              <div className={locale === "ar" ? "text-right" : "text-left"}>
                <h3
                  className={`text-sm sm:text-base font-bold text-brand-primary mb-1 ${locale === "ar" ? "font-noto" : ""}`}
                >
                  {locale === "ar" ? "تسهيل عملية البيع من خلال مجموعة" : "Facilitating the sales process through"}
                </h3>
                <p className={`text-xs text-gray-600 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar" ? "متنوعة من مصادر التمويل" : "various financing sources"}
                </p>
                <p className={`text-xs text-gray-600 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar" ? "(النقد - البنوك - شركات التمويل)" : "(Cash - Banks - Finance Companies)"}
                </p>
              </div>
            </div>
          </div>

          {/* Wrench Card */}
          <div className="bg-brand-light rounded-xl h-[180px] sm:h-[200px] md:h-[220px] overflow-hidden p-3 sm:p-4">
            <div
              className={`flex ${locale === "ar" ? "justify-between" : "flex-row-reverse justify-between"} items-center h-full`}
            >
              <div>
                <Image
                  src="/images/Wrench.svg"
                  alt="Wrench icon"
                  width={80}
                  height={80}
                  className="w-[60px] sm:w-[70px] md:w-[80px] h-auto"
                />
              </div>
              <div className={locale === "ar" ? "text-right" : "text-left"}>
                <h3
                  className={`text-sm sm:text-base font-bold text-brand-primary mb-1 ${locale === "ar" ? "font-noto" : ""}`}
                >
                  {locale === "ar" ? "توفير خدمة ما بعد البيع" : "Providing after-sales service"}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <div className="container mx-auto pt-6 sm:pt-8 pb-8 sm:pb-12 pr-0 sm:pr-6 bg-white mt-8 rounded-xl shadow-md mb-8 overflow-hidden relative min-h-[300px] sm:min-h-[350px] md:min-h-[400px]">
        <div className="flex flex-col lg:flex-row items-start justify-between h-full">
          {/* Text Content - Always on the right side */}
          <div className="w-full lg:w-2/3 p-4 sm:p-6 flex flex-col justify-center h-full lg:ml-auto">
            {locale === "ar" ? (
              <div className="rtl text-right">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-brand-primary mb-4 sm:mb-6 font-noto">
                  رؤيتنا
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-noto">
                  بنظرة مستقبلية ثاقبة، تعتمد إدارتنا على رؤية تطويرية منذ عام 2023 تهدف إلى توسيع نطاق العمل ليشمل
                  إنشاء فروع جديدة للمعرض خارج مدينة عرعر وانطلاقاً من خطواتنا المميزة، بدأنا في تنفيذ هذه الرؤية وأنشأنا
                  مركزاً جديداً في صالات عرض في القادسية في مدينة الرياض. وفي عام 2024 عزمنا على تجديد الفرع الرئيسي
                  وإضافة لمسة متطورة إليه وصل بعمارته جهدنا طالباً لافتتاح مدينة سكاكا هذا العام وها نحن نستمر في سعينا
                  الدؤوب لتوفير افضل خدمة تليق بهذا الصعيد.
                </p>
              </div>
            ) : (
              <div className="text-left">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-brand-primary mb-4 sm:mb-6">
                  Our Vision
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  With a forward-looking vision, our management has been working on an expansionary plan since 2023
                  aimed at extending our operations to include new showroom branches outside the city of Arar. Building
                  on our distinguished steps, we have begun implementing this vision by establishing a new center in Al
                  Qadisiyah showrooms in Riyadh. In 2024, we are determined to renovate our main branch and add a modern
                  touch to it. Our efforts have reached the stage of planning for the opening in Sakaka this year, and
                  we continue our diligent pursuit to provide the best service worthy of this level.
                </p>
              </div>
            )}
          </div>

          {/* Arrow Image - Mobile and Tablet */}
          <div className="lg:hidden w-full flex justify-start mt-6">
            <Image
              src="/images/VisionArrow.svg"
              alt="Vision arrow"
              width={400}
              height={400}
              className="w-[250px] sm:w-[300px] md:w-[350px] h-auto object-contain"
            />
          </div>

          {/* Arrow Image - Desktop */}
          <div className="hidden lg:block absolute bottom-0 left-0">
            <Image
              src="/images/VisionArrow.svg"
              alt="Vision arrow"
              width={400}
              height={400}
              className="w-[300px] lg:w-[350px] xl:w-[400px] h-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="container mx-auto mt-8 mb-8">
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-[90%] mx-auto">
          {/* Arar Location */}
          <div className="relative w-full md:w-1/2 h-[314px] rounded-xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108307.91028644626!2d41.0183413!3d30.9753425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x156b5a951e777917%3A0x44feb4d2d0b8e7d3!2sArar%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1710196238161!5m2!1sen!2sus&disableDefaultUI=true"
              width="547"
              height="314"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Arar Location"
              className="w-full h-full"
            ></iframe>

            {/* Location Card Overlay */}
            <div className="absolute bottom-[3.5em] left-4 md:left-8 lg:left-12 xl:left-16 w-[calc(100%-3rem)] max-w-[320px] h-[86px]">
              <div
                className={`bg-brand-primary text-white text-sm px-3 py-1 rounded-full w-fit mb-2 ${locale === "ar" ? "font-noto ml-auto" : "mr-auto"}`}
              >
                {locale === "ar" ? "عرعر" : "Arar"}
              </div>
              <div className="bg-brand-light/90 backdrop-blur-sm rounded-lg overflow-hidden h-[86px]">
                <div className={`flex ${locale === "ar" ? "flex-row-reverse" : "flex-row"} items-center gap-3 h-full`}>
                  <div className={`w-24 h-16 relative ${locale === "ar" ? "mr-3" : "ml-3"}`}>
                    <Image
                      src="/images/location-Area.JPG"
                      alt="Arar store front"
                      fill
                      className="object-cover rounded-[5px]"
                    />
                  </div>
                  <div className={`flex-1 p-3 ${locale === "ar" ? "text-right" : "text-left"}`}>
                    <h3 className={`text-brand-primary text-sm ${locale === "ar" ? "font-noto" : ""}`}>
                      {locale === "ar" ? "معرض الرميح للسيارات" : "Al Rumaih Cars Showroom"}
                    </h3>
                    <p className={`text-xs text-gray-600 ${locale === "ar" ? "font-noto" : ""} mt-1`}>
                      2W2R+2PQ, Car Gallery, Arar 73313, Saudi Arabia
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Riyadh Location */}
          <div className="relative w-full md:w-1/2 h-[314px] rounded-xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.6752757528395!2d46.71373!3d24.7468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0x5b5b0344b2b7ea58!2sAl%20Qadisiyah%2C%20Riyadh%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1710196238161!5m2!1sen!2sus&disableDefaultUI=true"
              width="547"
              height="314"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Riyadh Location"
              className="w-full h-full"
            ></iframe>

            {/* Location Card Overlay */}
            <div className="absolute bottom-[3.5em] left-4 md:left-8 lg:left-12 xl:left-16 w-[calc(100%-3rem)] max-w-[320px] h-[86px]">
              <div
                className={`bg-brand-primary text-white text-sm px-3 py-1 rounded-full w-fit mb-2 ${locale === "ar" ? "font-noto ml-auto" : "mr-auto"}`}
              >
                {locale === "ar" ? "الرياض" : "Riyadh"}
              </div>
              <div className="bg-brand-light/90 backdrop-blur-sm rounded-lg overflow-hidden h-[86px]">
                <div className={`flex ${locale === "ar" ? "flex-row-reverse" : "flex-row"} items-center gap-3 h-full`}>
                  <div className={`w-24 h-16 relative ${locale === "ar" ? "mr-3" : "ml-3"}`}>
                    <Image
                      src="/images/location-Area.JPG"
                      alt="Riyadh store front"
                      fill
                      className="object-cover rounded-[5px]"
                    />
                  </div>
                  <div className={`flex-1 p-3 ${locale === "ar" ? "text-right" : "text-left"}`}>
                    <h3 className={`text-brand-primary text-sm ${locale === "ar" ? "font-noto" : ""}`}>
                      {locale === "ar" ? "معرض الرميح للسيارات" : "Al Rumaih Cars Showroom"}
                    </h3>
                    <p className={`text-xs text-gray-600 ${locale === "ar" ? "font-noto" : ""} mt-1`}>
                      {locale === "ar"
                        ? "وادي الغيل, Al Qadisiyyah, Riyadh 13261, Saudi Arabia"
                        : "Wadi Al-Ghail, Al Qadisiyyah, Riyadh 13261, Saudi Arabia"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
