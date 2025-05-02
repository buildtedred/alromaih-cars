"use client"
import Image from "next/image"
import { useParams } from "next/navigation"

export default function PrivacyPolicyPage() {
  // Get locale from URL params
  const params = useParams()
  const locale = params?.locale || "ar" // Default to Arabic if locale not found

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section with White Background */}
      <div className="bg-white pt-20 pb-16">
        <div className="max-w-[calc(100%-1.5rem)] sm:max-w-[calc(100%-3rem)] md:max-w-[calc(100%-6rem)] lg:max-w-[calc(100%-10rem)] xl:max-w-[1300px] mx-auto">
          <div className={`${locale === "ar" ? "rtl" : ""}`}>
            {/* Hero Section - Now styled like other sections */}
            <section className="bg-white rounded-xl p-4 mb-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                {/* Illustration - Using the same SVG for both languages */}
                <div className={`w-full md:w-1/3 ${locale === "ar" ? "md:order-2" : "md:order-2"}`}>
                  <Image
                    src="/images/Privacy.svg"
                    alt="Privacy Policy illustration"
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
                    {locale === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
                  </h1>
                  <p className={`text-sm sm:text-base text-gray-600 max-w-2xl ${locale === "ar" ? "font-noto" : ""}`}>
                    {locale === "ar"
                      ? "نحن في الرميح للسيارات نقدر خصوصيتكم ونسعى لحماية بياناتكم الشخصية. توضح سياسة الخصوصية هذه كيفية جمع معلوماتكم واستخدامها وحمايتها عند استخدام موقعنا. وبالتالي نرجو قراءة هذه السياسة بعناية لفهم كيفية تعاملنا مع بياناتكم."
                      : "At Al Rumaih Cars, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website. We encourage you to read this policy carefully to understand how we handle your data."}
                  </p>
                </div>
              </div>
            </section>

            {/* Privacy Policy Sections with reduced spacing */}
            <div className="space-y-2">
              {/* Section 1: Information We Collect */}
              <section className="bg-white rounded-xl p-4">
                <h2 className={`text-2xl font-bold text-brand-primary mb-4 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar" ? "١. المعلومات التي نجمعها" : "1. Information We Collect"}
                </h2>
                <p className={`text-gray-600 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar"
                    ? "قد تجمع شركة السيارات الرميح معلومات شخصية منك عند زيارتك لموقعنا الإلكتروني أو تفاعلك معنا بأي طريقة. قد تتضمن هذه المعلومات اسمك، عنوان بريدك الإلكتروني، رقم هاتفك، وأي معلومات أخرى تقدمها لنا."
                    : "Al Rumaih Cars may collect personal information from you when you visit our website or interact with us in any way. This information may include your name, email address, phone number, and any other information you provide to us."}
                </p>
              </section>

              {/* Section 2: How We Use Your Information */}
              <section className="bg-white rounded-xl p-4">
                <h2 className={`text-2xl font-bold text-brand-primary mb-4 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar" ? "٢. كيفية استخدام معلوماتك" : "2. How We Use Your Information"}
                </h2>
                <p className={`text-gray-600 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar"
                    ? "قد نستخدم المعلومات التي نجمعها منك للتواصل معك، لتخصيص تجربتك، ولتقديم عروض وترقيات لك."
                    : "We may use the information we collect from you to communicate with you, personalize your experience, and provide offers and promotions to you."}
                </p>
              </section>

              {/* Section 3: Information Sharing */}
              <section className="bg-white rounded-xl p-4">
                <h2 className={`text-2xl font-bold text-brand-primary mb-4 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar" ? "٣. مشاركة المعلومات" : "3. Information Sharing"}
                </h2>
                <p className={`text-gray-600 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar"
                    ? "قد نشارك معلوماتك مع مزودي الخدمات الخارجيين الذين يساعدوننا في تشغيل موقعنا الإلكتروني، أو في إدارة أعمالنا، أو في خدمتك. كما قد نشارك معلوماتك عندما يتطلب منا ذلك بموجب القانون أو لحماية حقوقنا."
                    : "We may share your information with third-party service providers who help us operate our website, conduct our business, or serve you. We may also share your information when required by law or to protect our rights."}
                </p>
              </section>

              {/* Section 4: Security */}
              <section className="bg-white rounded-xl p-4">
                <h2 className={`text-2xl font-bold text-brand-primary mb-4 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar" ? "٤. الأمان" : "4. Security"}
                </h2>
                <p className={`text-gray-600 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar"
                    ? "نتخذ تدابير معقولة لحماية المعلومات التي نجمعها منك ضد الوصول غير المصرح به أو التعديل، أو الإفصاح، أو التدمير."
                    : "We take reasonable measures to protect the information we collect from you against unauthorized access, alteration, disclosure, or destruction."}
                </p>
              </section>

              {/* Section 5: Your Choices */}
              <section className="bg-white rounded-xl p-4">
                <h2 className={`text-2xl font-bold text-brand-primary mb-4 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar" ? "٥. خياراتك" : "5. Your Choices"}
                </h2>
                <p className={`text-gray-600 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar"
                    ? "يمكنك اختيار عدم تقديم بعض المعلومات لنا، ولكن ذلك قد يحد من قدرتك على استخدام بعض ميزات خدماتنا. كما يمكنك اختيار عدم تلقي رسائل البريد الإلكتروني الترويجية منا."
                    : "You can choose not to provide certain information to us, but this may limit your ability to use some features of our services. You can also opt out of receiving promotional emails from us."}
                </p>
              </section>

              {/* Section 6: Changes to Privacy Policy */}
              <section className="bg-white rounded-xl p-4">
                <h2 className={`text-2xl font-bold text-brand-primary mb-4 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar" ? "٦. التغييرات في إشعار الخصوصية هذا" : "6. Changes to This Privacy Policy"}
                </h2>
                <p className={`text-gray-600 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar"
                    ? "تحتفظ شركة السيارات الرميح بالحق في تحديث أو تغيير إشعار الخصوصية هذا في أي وقت. سيتم نشر أي تغييرات على هذه الصفحة."
                    : "Al Rumaih Cars reserves the right to update or change this Privacy Policy at any time. Any changes will be posted on this page."}
                </p>
              </section>

              {/* Consent Section - Now with centered text */}
              <section className="bg-white rounded-xl p-4">
                <p className={`text-gray-600 text-center ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar"
                    ? "باستخدامك لموقعنا الإلكتروني أو خدماتنا، فإنك توافق على جمع واستخدام معلوماتك كما هو موضح في إشعار الخصوصية هذا."
                    : "By using our website or services, you consent to the collection and use of your information as described in this Privacy Policy."}
                </p>
                <p className={`text-gray-600 mt-4 text-center ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar"
                    ? "إذا كان لديك أي أسئلة حول شروط الخدمة أو إشعار الخصوصية، يرجى الاتصال بنا عبر صفحة 'اتصل بنا'."
                    : "If you have any questions about our Terms of Service or Privacy Policy, please contact us through our 'Contact Us' page."}
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

