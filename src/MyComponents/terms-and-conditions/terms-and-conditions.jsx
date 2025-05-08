"use client"
import Image from "next/image"
import { useParams } from "next/navigation"

export default function TermsPage() {
  // Get locale from URL params
  const params = useParams()
  const locale = params?.locale || "ar" // Default to Arabic if locale not found

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section with White Background */}
      <div className="bg-white">
        <div className="max-w-[calc(100%-1.5rem)] sm:max-w-[calc(100%-3rem)] md:max-w-[calc(100%-6rem)] lg:max-w-[calc(100%-10rem)] xl:max-w-[1340px] mx-auto">
          <div className={`${locale === "ar" ? "rtl" : ""}`}>
            {/* Hero Section - Now styled like other sections */}
            <section className="bg-white rounded-xl p-4 mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                {/* Illustration - Now with conditional SVG based on locale */}
                <div className={`w-full md:w-1/3 ${locale === "ar" ? "md:order-2" : "md:order-2"}`}>
                  <Image
                    src={locale === "ar" ? "/images/Arabic-Terms.svg" : "/images/English-Terms.svg"}
                    alt="Terms and Conditions illustration"
                    width={400}
                    height={400}
                    className="w-full max-w-[300px] mx-auto"
                  />
                </div>

                {/* Text Content - Now on left for both English and Arabic */}
                <div
                  className={`text-${locale === "ar" ? "right" : "left"} flex-1 ${locale === "ar" ? "md:order-1" : "md:order-1"}`}
                >
                  <h1
                    className={`text-4xl sm:text-5xl md:text-6xl font-bold text-brand-primary mb-6 ${locale === "ar" ? "font-noto" : ""}`}
                  >
                    {locale === "ar" ? "الشروط والأحكام" : "Terms & Conditions"}
                  </h1>
                  <p className={`text-sm sm:text-base text-gray-600 max-w-2xl ${locale === "ar" ? "font-noto" : ""}`}>
                    {locale === "ar"
                      ? "مرحبا بكم في الرميح للسيارات! تحكم شروط الخدمة هذه وصولك إلى واستخدام موقع شركة الرميح للسيارات ومنتجاتها وخدماتها. باستخدام خدماتنا، فإنك توافق على الالتزام بهذه الشروط. يرجى قراءتها بعناية."
                      : "Welcome to Al Rumaih Cars! These Terms of Service govern your access to and use of Al Rumaih Cars website, products, and services. By using our services, you agree to be bound by these terms. Please read them carefully."}
                  </p>
                </div>
              </div>
            </section>

            {/* Terms Sections with reduced spacing */}
            <div className="space-y-2">
              {/* Section 1: Acceptance of Terms */}
              <section className="bg-white rounded-xl p-4">
                <h2 className={`text-2xl font-bold text-brand-primary mb-4 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar" ? "١. قبول الشروط" : "1. Acceptance of Terms"}
                </h2>
                <p className={`text-gray-600 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar"
                    ? "من خلال الوصول إلى أو استخدام موقع شركة الرميح للسيارات أو منتجاتها أو خدماتها، فإنك توافق على الالتزام بشروط الخدمة هذه. إذا كنت لا توافق على جميع شروط وأحكام هذه الاتفاقية، فلا يجوز لك الدخول إلى الموقع أو استخدام أي خدمات."
                    : "By accessing or using Al Rumaih Cars website, products, or services, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, you may not access the website or use any services."}
                </p>
              </section>

              {/* Section 2: Use of Services */}
              <section className="bg-white rounded-xl p-4">
                <h2 className={`text-2xl font-bold text-brand-primary mb-4 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar" ? "٢. استخدام الخدمات" : "2. Use of Services"}
                </h2>
                <p className={`text-gray-600 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar"
                    ? "أنت توافق على استخدام خدمات الرميح للسيارات فقط للأغراض القانونية وبطريقة تتفق مع جميع القوانين واللوائح المعمول بها. لا يجوز لك استخدام خدمات السيارات في أي أنشطة غير قانونية أو غير مصرح بها."
                    : "You agree to use Al Rumaih Cars services only for lawful purposes and in a manner consistent with all applicable laws and regulations. You may not use the car services in any unauthorized or unlawful activities."}
                </p>
              </section>

              {/* Section 3: Intellectual Property */}
              <section className="bg-white rounded-xl p-4">
                <h2 className={`text-2xl font-bold text-brand-primary mb-4 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar" ? "٣. الملكية الفكرية" : "3. Intellectual Property"}
                </h2>
                <p className={`text-gray-600 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar"
                    ? "جميع المحتويات المدرجة على موقع الرميح للسيارات، مثل النصوص والرسومات والشعارات وأيقونات الأزرار والصور والمقاطع الصوتية والتنزيلات الرقمية وتجميع البيانات والبرامج، هي ملك لشركة الرميح للسيارات أو موردي المحتوى التابعين لها ومحمية بموجب قوانين حقوق الطبع والنشر."
                    : "All content included on Al Rumaih Cars website, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of Al Rumaih Cars or its content suppliers and protected by copyright laws."}
                </p>
              </section>

              {/* Section 4: Limitation of Liability */}
              <section className="bg-white rounded-xl p-4">
                <h2 className={`text-2xl font-bold text-brand-primary mb-4 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar" ? "٤. حدود المسؤولية" : "4. Limitation of Liability"}
                </h2>
                <p className={`text-gray-600 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar"
                    ? "لن تتحمل شركة الرميح للسيارات أو مسؤوليها أو مديريها أو موظفيها أو وكلائها بأي حال من الأحوال المسؤولية تجاهك عن أي أضرار مباشرة أو غير مباشرة أو عرضية أو خاصة أو عقابية أو تبعية مهما كانت ناتجة عن أي أخطاء أو أخطاء أو عدم دقة في المحتوى أو المعلومات الشخصية، الإصابة أو تلف الممتلكات، من أي نوع كانت نتيجة وصولك إلى خدماتنا واستخدامها."
                    : "Al Rumaih Cars, its officers, directors, employees, or agents will not be liable to you under any circumstances for any direct, indirect, incidental, special, punitive, or consequential damages whatsoever resulting from any errors, mistakes, or inaccuracies in content or personal information, injury or property damage, of any nature whatsoever, resulting from your access to and use of our services."}
                </p>
              </section>

              {/* Section 5: Governing Law */}
              <section className="bg-white rounded-xl p-4">
                <h2 className={`text-2xl font-bold text-brand-primary mb-4 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar" ? "٥. القانون الحاكم" : "5. Governing Law"}
                </h2>
                <p className={`text-gray-600 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar"
                    ? "تخضع شروط الخدمة هذه وتفسر وفقاً لقوانين المملكة العربية السعودية."
                    : "These Terms of Service shall be governed by and construed in accordance with the laws of the Kingdom of Saudi Arabia."}
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

