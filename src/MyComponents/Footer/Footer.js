"use client"

import Image from "next/image"
import { useParams } from "next/navigation"
import Link from "next/link"

export default function Footer() {
  // Get locale from URL params
  const params = useParams()
  const locale = params?.locale || "ar" // Default to Arabic if locale not found

  return (
    <div className="w-full">
      {/* White Section with Logo and Links */}
      <div className="bg-white pt-8 relative">
        {/* Top border line */}
        <div className="max-w-[1400px] mx-auto h-[1px] bg-brand-primary"></div>

        <div className={`max-w-[1300px] mx-auto px-4 sm:pl-4 sm:pr-[76px] py-8 ${locale === "ar" ? "rtl" : ""}`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-0">
            {/* Company Info - Right side for Arabic, Left for English */}
            <div className={`col-span-full lg:col-span-5 order-1 ${locale === "ar" ? "text-right" : ""}`}>
              <div className="flex justify-center lg:justify-start mb-6">
                <Image src="/images/logo.PNG" alt="Alromaih Cars" width={180} height={60} className="h-auto" />
              </div>
              <p
                className={`text-gray-600 text-sm ${
                  locale === "ar" ? "text-right font-noto rtl" : "text-left"
                } mb-4 leading-relaxed ${locale === "ar" ? "lg:text-right" : "lg:text-left"}`}
              >
                {locale === "ar"
                  ? "الرميح للسيارات منذ 1996 نقدم أفضل خدمات بيع السيارات الجديدة والخادمة بأسعار تنافسية. نحرص على توفير تجربة شراء مميزة تشمل تسهيلات تمويلية خيارات متنوعة خدمة ما بعد البيع لدينا فروع متعددة ونعمل باستمرار على التوسع والتطوير لضمان رضا عملائنا تواصل معنا اليوم!"
                  : "Alromaih Cars, since 1996, offers the best new and used car sales services at competitive prices. We are committed to providing a distinctive buying experience that includes financing facilities, various options, and after-sales service. We have multiple branches and continuously work on expansion and development to ensure customer satisfaction. Contact us today!"}
              </p>
              {/* Social Media Icons */}
              <div className="flex justify-center lg:justify-start gap-6 mb-6 lg:mb-0">
                <Link href="#" className="text-brand-primary hover:opacity-80 transition-opacity">
                  <Image src="/images/Twitter.svg" alt="Twitter/X" width={22} height={22} />
                </Link>
                <Link href="#" className="text-brand-primary hover:opacity-80 transition-opacity">
                  <Image src="/images/Facebook.svg" alt="Facebook" width={12} height={12} />
                </Link>
                <Link href="#" className="text-brand-primary hover:opacity-80 transition-opacity">
                  <Image src="/images/Youtube.svg" alt="YouTube" width={22} height={22} />
                </Link>
                <Link href="#" className="text-brand-primary hover:opacity-80 transition-opacity">
                  <Image src="/images/Instagram.svg" alt="Instagram" width={22} height={22} />
                </Link>
                <Link href="#" className="text-brand-primary hover:opacity-80 transition-opacity">
                  <Image src="/images/Tiktok.svg" alt="TikTok" width={22} height={22} />
                </Link>
              </div>
            </div>

            {/* Links - Left side for Arabic, Right for English */}
            <div className="col-span-full lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8 order-2">
              {/* Cars Column */}
              <div className={`text-center sm:${locale === "ar" ? "text-right" : "text-left"}`}>
                <h3 className={`text-brand-primary text-xl font-medium mb-4 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar" ? "السيارات" : "Cars"}
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="#"
                      className={`text-gray-600 hover:text-brand-primary transition-colors ${locale === "ar" ? "font-noto" : ""}`}
                    >
                      {locale === "ar" ? "كاش" : "Cash"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className={`text-gray-600 hover:text-brand-primary transition-colors ${locale === "ar" ? "font-noto" : ""}`}
                    >
                      {locale === "ar" ? "تمويل" : "Financing"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className={`text-gray-600 hover:text-brand-primary transition-colors ${locale === "ar" ? "font-noto" : ""}`}
                    >
                      {locale === "ar" ? "شركات" : "Companies"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className={`text-gray-600 hover:text-brand-primary transition-colors ${locale === "ar" ? "font-noto" : ""}`}
                    >
                      {locale === "ar" ? "افراد" : "Individuals"}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources Column */}
              <div className={`text-center sm:${locale === "ar" ? "text-right" : "text-left"}`}>
                <h3 className={`text-brand-primary text-xl font-medium mb-4 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar" ? "الموارد" : "Resources"}
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="#"
                      className={`text-gray-600 hover:text-brand-primary transition-colors ${locale === "ar" ? "font-noto" : ""}`}
                    >
                      {locale === "ar" ? "المدونة" : "Blog"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className={`text-gray-600 hover:text-brand-primary transition-colors ${locale === "ar" ? "font-noto" : ""}`}
                    >
                      {locale === "ar" ? "الأسئلة الشائعة" : "FAQ"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/terms-and-conditions`}
                      className={`text-gray-600 hover:text-brand-primary transition-colors ${locale === "ar" ? "font-noto" : ""}`}
                    >
                      {locale === "ar" ? "الشروط والأحكام" : "Terms & Conditions"}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company Column */}
              <div className={`text-center sm:${locale === "ar" ? "text-right" : "text-left"}`}>
                <h3 className={`text-brand-primary text-xl font-medium mb-4 ${locale === "ar" ? "font-noto" : ""}`}>
                  {locale === "ar" ? "الشركة" : "Company"}
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="#"
                      className={`text-gray-600 hover:text-brand-primary transition-colors ${locale === "ar" ? "font-noto" : ""}`}
                    >
                      {locale === "ar" ? "الوظائف" : "Careers"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className={`text-gray-600 hover:text-brand-primary transition-colors ${locale === "ar" ? "font-noto" : ""}`}
                    >
                      {locale === "ar" ? "عن الرميح" : "About Alromaih"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className={`text-gray-600 hover:text-brand-primary transition-colors ${locale === "ar" ? "font-noto" : ""}`}
                    >
                      {locale === "ar" ? "تواصل معنا" : "Contact Us"}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purple Section with Contact Info */}
      <div className="bg-brand-primary">
        <div className="max-w-[1300px] mx-auto px-4 py-6">
          <div className={`flex flex-col md:flex-row justify-between items-center ${locale === "ar" ? "rtl" : ""}`}>
            {/* Phone and Email in one parent div */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-[15px] mb-6 md:mb-0 w-full md:w-auto">
              {/* Phone */}
              <Link
                href="tel:+966920031202"
                className="bg-white rounded-[15px] px-4 py-2 flex items-center gap-3 hover:opacity-90 transition-opacity w-full md:w-auto justify-center"
              >
                <Image src="/images/CallFooter.svg" alt="Phone" width={24} height={24} />
                <span className="text-xl text-brand-primary">9200 31 202</span>
              </Link>

              {/* Email */}
              <Link
                href="mailto:info@alromaihcars.com"
                className="bg-white rounded-[15px] px-4 py-2 flex items-center gap-3 hover:opacity-90 transition-opacity w-full md:w-auto justify-center"
              >
                <Image src="/images/EmailFooter.svg" alt="Email" width={24} height={24} />
                <span className="text-brand-primary">info@alromaihcars.com</span>
              </Link>
            </div>

            {/* App Downloads in separate div */}
            <div
              className={`flex flex-col items-center md:${locale === "ar" ? "items-end" : "items-start"} w-full md:w-auto`}
            >
              <p className={`text-white mb-3 text-center md:${locale === "ar" ? "text-right font-noto" : "text-left"}`}>
                {locale === "ar"
                  ? "استمتع بتجربة فريدة مع تطبيق الرميح"
                  : "Enjoy a unique experience with the Alromaih app"}
              </p>
              <div className="flex gap-3">
                <Link href="#" className="transition-transform hover:scale-105">
                  <Image src="/images/GooglePlay.PNG" alt="Google Play" width={135} height={40} className="h-auto" />
                </Link>
                <Link href="#" className="transition-transform hover:scale-105">
                  <Image src="/images/AppStore.PNG" alt="App Store" width={135} height={40} className="h-auto" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* White Section with Payment Methods */}
      <div className="bg-white">
        <div className="max-w-[1300px] mx-auto px-4 py-4">
          <div
            className={`flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4 ${locale === "ar" ? "rtl" : ""}`}
          >
            {/* Payment Methods */}
            <div className="flex gap-6 items-center order-2 md:order-1">
              <Image src="/images/Visa.PNG" alt="Visa" width={45} height={30} className="object-contain" />
              <Image src="/images/MasterCard.PNG" alt="MasterCard" width={45} height={30} className="object-contain" />
              <Image src="/images/Mada.PNG" alt="Mada" width={45} height={30} className="object-contain" />
            </div>

            {/* Terms and Copyright */}
            <div className="flex items-center gap-2 text-gray-600 text-sm order-1 md:order-2 text-center">
              <Link
                href={`/${locale}/terms-and-conditions`}
                className={`hover:text-brand-primary transition-colors ${locale === "ar" ? "font-noto" : ""}`}
              >
                {locale === "ar" ? "الشروط والأحكام" : "Terms & Conditions"}
              </Link>
              <span>|</span>
              <p className={locale === "ar" ? "font-noto" : ""}>
                {locale === "ar" ? "© 2025 الرميح. جميع الحقوق محفوظة" : "© 2025 Alromaih. All rights reserved"}
              </p>
            </div>

            {/* Certificates */}
            <div className="flex gap-4 order-3">
              <Image src="/images/Maroof.PNG" alt="Maroof" width={35} height={35} className="object-contain" />
              <Image src="/images/Vat.PNG" alt="VAT" width={35} height={35} className="object-contain" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

