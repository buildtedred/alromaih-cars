"use client"

import Image from "next/image"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Phone, Mail } from "lucide-react"

export default function Footer() {
  // Get locale from URL params
  const params = useParams()
  const locale = params?.locale || "ar" // Default to Arabic if locale not found

  return (
    <footer>
      {/* Main Footer Content with brand-primary background */}
      <div className="bg-brand-primary text-white">
        <div className={`max-w-[1400px] mx-auto ${locale === "ar" ? "rtl" : ""}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 py-12">
            {/* Company Info */}
            <div className="space-y-6">
              <Image
                src="/images/logo-white.png"
                alt="Alromaih Cars"
                width={160}
                height={50}
                className="h-auto object-contain"
              />

              <p className={`text-white/80 text-sm leading-relaxed ${locale === "ar" ? "font-noto" : ""}`}>
                {locale === "ar"
                  ? "الرميح للسيارات منذ 1996 نقدم أفضل خدمات بيع السيارات الجديدة والخادمة بأسعار تنافسية."
                  : "Alromaih Cars, since 1996, offers the best new and used car sales services at competitive prices."}
              </p>

              <div className="flex items-center gap-4">
                {/* Twitter */}
                <Link href="#" className="text-white/80 hover:text-white transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                </Link>
                {/* Facebook */}
                <Link href="#" className="text-white/80 hover:text-white transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                  </svg>
                </Link>
                {/* Instagram */}
                <Link href="#" className="text-white/80 hover:text-white transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                  </svg>
                </Link>
                {/* YouTube */}
                <Link href="#" className="text-white/80 hover:text-white transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" />
                  </svg>
                </Link>
                {/* TikTok */}
                <Link href="#" className="text-white/80 hover:text-white transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0Z" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className={`text-white font-semibold mb-4 ${locale === "ar" ? "font-noto" : ""}`}>
                {locale === "ar" ? "روابط سريعة" : "Quick Links"}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className={`text-white/80 hover:text-white transition-colors text-sm ${locale === "ar" ? "font-noto" : ""}`}
                  >
                    {locale === "ar" ? "كاش" : "Cash"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className={`text-white/80 hover:text-white transition-colors text-sm ${locale === "ar" ? "font-noto" : ""}`}
                  >
                    {locale === "ar" ? "تمويل" : "Financing"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className={`text-white/80 hover:text-white transition-colors text-sm ${locale === "ar" ? "font-noto" : ""}`}
                  >
                    {locale === "ar" ? "شركات" : "Companies"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className={`text-white/80 hover:text-white transition-colors text-sm ${locale === "ar" ? "font-noto" : ""}`}
                  >
                    {locale === "ar" ? "افراد" : "Individuals"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className={`text-white/80 hover:text-white transition-colors text-sm ${locale === "ar" ? "font-noto" : ""}`}
                  >
                    {locale === "ar" ? "المدونة" : "Blog"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className={`text-white/80 hover:text-white transition-colors text-sm ${locale === "ar" ? "font-noto" : ""}`}
                  >
                    {locale === "ar" ? "الأسئلة الشائعة" : "FAQ"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="">
              <h3 className={`text-white font-semibold mb-4 ${locale === "ar" ? "font-noto" : ""}`}>
                {locale === "ar" ? "الشركة" : "Company"}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href={`/${locale}/careers`}
                    className={`text-white/80 hover:text-white transition-colors text-sm ${locale === "ar" ? "font-noto" : ""}`}
                  >
                    {locale === "ar" ? "الوظائف" : "Careers"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className={`text-white/80 hover:text-white transition-colors text-sm ${locale === "ar" ? "font-noto" : ""}`}
                  >
                    {locale === "ar" ? "عن الرميح" : "About Alromaih"}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/contact-us`}
                    className={`text-white/80 hover:text-white transition-colors text-sm ${locale === "ar" ? "font-noto" : ""}`}
                  >
                    {locale === "ar" ? "تواصل معنا" : "Contact Us"}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/terms-and-conditions`}
                    className={`text-white/80 hover:text-white transition-colors text-sm ${locale === "ar" ? "font-noto" : ""}`}
                  >
                    {locale === "ar" ? "الشروط والأحكام" : "Terms & Conditions"}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/privacy-policy`}
                    className={`text-white/80 hover:text-white transition-colors text-sm ${locale === "ar" ? "font-noto" : ""}`}
                  >
                    {locale === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact & App */}
            <div>
              <h3 className={`text-white font-semibold mb-4 ${locale === "ar" ? "font-noto" : ""}`}>
                {locale === "ar" ? "تواصل معنا" : "Contact Us"}
              </h3>

              <ul className="space-y-3 mb-6">
                <li>
                  <Link
                    href="tel:+966920031202"
                    className="text-white/80 hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <Phone size={16} className="text-white" />
                    <span>9200 31 202</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="mailto:info@alromaihcars.com"
                    className="text-white/80 hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <Mail size={16} className="text-white" />
                    <span>info@alromaihcars.com</span>
                  </Link>
                </li>
              </ul>

              <p className={`text-white/80 text-sm mb-3 ${locale === "ar" ? "font-noto" : ""}`}>
                {locale === "ar"
                  ? "استمتع بتجربة فريدة مع تطبيق الرميح"
                  : "Enjoy a unique experience with the Alromaih app"}
              </p>

              <div className="flex gap-2">
                <Link href="#" className="transition-all duration-300 hover:opacity-80">
                  <Image src="/images/GooglePlay.png" alt="Google Play" width={100} height={30} className="h-auto" />
                </Link>
                <Link href="#" className="transition-all duration-300 hover:opacity-80">
                  <Image src="/images/AppStore.png" alt="App Store" width={100} height={30} className="h-auto" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-brand-light">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div
            className={`flex flex-col md:flex-row justify-between items-center gap-4 ${locale === "ar" ? "rtl" : ""}`}
          >
            <div className="flex items-center gap-4">
              <Image src="/images/Visa.png" alt="Visa" width={40} height={25} className="object-contain" />
              <Image src="/images/MasterCard.png" alt="MasterCard" width={40} height={25} className="object-contain" />
              <Image src="/images/Mada.png" alt="Mada" width={40} height={25} className="object-contain" />
              <span className="mx-2 text-gray-300">|</span>
              <Image src="/images/Maroof.png" alt="Maroof" width={30} height={30} className="object-contain" />
              <Image src="/images/Vat.png" alt="VAT" width={30} height={30} className="object-contain" />
            </div>

            <p className={`text-xs text-brand-dark ${locale === "ar" ? "font-noto" : ""}`}>
              {locale === "ar" ? "© 2025 الرميح. جميع الحقوق محفوظة" : "© 2025 Alromaih. All rights reserved"}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
