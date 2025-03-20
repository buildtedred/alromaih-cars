"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, Shield, Users, CheckCircle, Building2, Star, Trophy } from "lucide-react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useParams } from "next/navigation"

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
}

export default function AboutUs() {
  const params = useParams()
  const locale = params?.locale || "ar" // Default to Arabic if locale not found

  // Translations based on locale
  const translations = {
    ar: {
      badgeText: "منذ عام 1996",
      title: "الرميح للسيارات: تاريخ من التميز",
      description: "نقدم أفضل السيارات الفاخرة بأسعار تنافسية مع خدمة عملاء استثنائية",
      buttonText: "استعرض سياراتنا",
      ourPresence: "تواجدنا في المملكة العربية السعودية",
      viewShowrooms: "عرض المعارض",
      whatsImportant: "ما هو مهم بالنسبة لنا",
      quality: "الجودة",
      qualityDesc: "نحافظ على أعلى المعايير في اختيار السيارات وتقديم الخدمة، مما يضمن حصول كل عميل على التميز.",
      transparency: "الشفافية والمسؤولية",
      transparencyDesc: "التزامنا بالتعاملات الصادقة والتواصل الواضح يبني الثقة الدائمة مع عملائنا الكرام.",
      experience: "تجربة مخصصة",
      experienceDesc: "نقوم بتخصيص خدماتنا لتلبية التفضيلات الفردية، مما يضمن رحلة فريدة ومرضية لكل عميل.",
      ourBackers: "شركاؤنا",
      mediaCoverage: "التغطية الإعلامية",
      premiumVehicles: "سيارة فاخرة",
      customerRating: "تقييم العملاء",
      industryAwards: "جائزة صناعية",
      showrooms: "معارض",
      readyToExperience: "هل أنت مستعد لتجربة الفخامة؟",
      visitShowroom: "قم بزيارة أقرب معرض لدينا أو اتصل بنا للحصول على استشارة مخصصة",
      contactUs: "اتصل بنا",
      findShowroom: "ابحث عن معرض",
      riyadh: "الرياض",
      arar: "عرعر",
      riyadhDesc:
        "يعرض معرضنا الرئيسي في قلب الرياض أفخم السيارات الفاخرة. يقع في حي العليا المرموق، وتبلغ مساحة هذا المرفق المتطور أكثر من 5000 متر مربع.",
      ararDesc:
        "استمتع بتسوق السيارات الفاخرة في أفضل حالاته في معرضنا في عرعر. يوفر مرفقنا الحديث مجموعة واسعة من السيارات المتميزة وخدمة عملاء استثنائية.",
      riyadhLocations: "3 معارض",
      ararLocations: "2 معارض",
    },
    en: {
      badgeText: "Since 1996",
      title: "Al Rumaih Cars: A Legacy of Excellence",
      description: "We offer the finest luxury vehicles at competitive prices with exceptional customer service",
      buttonText: "Browse Our Inventory",
      ourPresence: "Our Presence in Saudi Arabia",
      viewShowrooms: "View Showrooms",
      whatsImportant: "What's Important to Us",
      quality: "Quality",
      qualityDesc:
        "We maintain the highest standards in our vehicle selection and service delivery, ensuring every customer receives excellence.",
      transparency: "Transparency & Accountability",
      transparencyDesc:
        "Our commitment to honest dealings and clear communication builds lasting trust with our valued customers.",
      experience: "Personalized Experience",
      experienceDesc:
        "We tailor our services to meet individual preferences, ensuring a unique and satisfying journey for each client.",
      ourBackers: "Our Partners",
      mediaCoverage: "Media Coverage",
      premiumVehicles: "Premium Vehicles",
      customerRating: "Customer Rating",
      industryAwards: "Industry Awards",
      showrooms: "Showrooms",
      readyToExperience: "Ready to Experience Luxury?",
      visitShowroom: "Visit our nearest showroom or contact us for a personalized consultation",
      contactUs: "Contact Us",
      findShowroom: "Find Showroom",
      riyadh: "Riyadh",
      arar: "Arar",
      riyadhDesc:
        "Our flagship showroom in the heart of Riyadh showcases the finest luxury vehicles. Located in the prestigious Olaya District, this state-of-the-art facility spans over 5000 square meters.",
      ararDesc:
        "Experience luxury car shopping at its finest in our Arar showroom. Our modern facility offers a wide selection of premium vehicles and exceptional customer service.",
      riyadhLocations: "3 Showrooms",
      ararLocations: "2 Showrooms",
    },
  }

  const t = translations[locale]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <Image
          src="/images/main-car.jpg"
          alt="Luxury Car Showcase"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto px-4 md:px-36 h-full flex items-center">
          <div className={`max-w-2xl text-white ${locale === "ar" ? "text-right" : "text-left"}`}>
            <Badge className="bg-brand-primary mb-4 text-white">{t.badgeText}</Badge>
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${locale === "ar" ? "font-noto" : ""}`}>
              {t.title}
            </h1>
            <p className={`text-xl mb-8 ${locale === "ar" ? "font-noto" : ""}`}>{t.description}</p>
            <Link
              href={`/${locale}/cars`}
              className={`inline-block bg-brand-primary text-white px-8 py-3 rounded-md hover:bg-brand-primary/90 transition-colors ${locale === "ar" ? "font-noto" : ""}`}
            >
              {t.buttonText}
            </Link>
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-36">
          <h2
            className={`text-3xl font-bold text-center mb-12 text-brand-primary ${locale === "ar" ? "font-noto" : ""}`}
          >
            {t.ourPresence}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                city: locale === "ar" ? t.riyadh : t.riyadh,
                image: "/images/location-Area.JPG",
                description: locale === "ar" ? t.riyadhDesc : t.riyadhDesc,
                locations: locale === "ar" ? t.riyadhLocations : t.riyadhLocations,
              },
              {
                city: locale === "ar" ? t.arar : t.arar,
                image: "/images/location-Area.JPG",
                description: locale === "ar" ? t.ararDesc : t.ararDesc,
                locations: locale === "ar" ? t.ararLocations : t.ararLocations,
              },
            ].map((location, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative h-64">
                  <Image
                    src={location.image || "/placeholder.svg"}
                    alt={`${location.city} Showroom`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                    <div className={`absolute bottom-0 p-4 ${locale === "ar" ? "right-0" : "left-0"}`}>
                      <h3 className={`text-2xl font-bold text-white mb-1 ${locale === "ar" ? "font-noto" : ""}`}>
                        {location.city}
                      </h3>
                      <Badge className="bg-brand-primary">{location.locations}</Badge>
                    </div>
                  </div>
                </div>
                <CardContent className={`p-6 ${locale === "ar" ? "text-right" : "text-left"}`}>
                  <p className={`text-gray-600 leading-relaxed ${locale === "ar" ? "font-noto" : ""}`}>
                    {location.description}
                  </p>
                  <div className="mt-4">
                    <Link
                      href={`/${locale}/locations/${location.city.toLowerCase()}`}
                      className={`inline-flex items-center text-brand-primary hover:underline ${locale === "ar" ? "font-noto flex-row-reverse" : ""}`}
                    >
                      <span>{t.viewShowrooms}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ${locale === "ar" ? "ml-0 mr-1 rotate-180" : "ml-1 mr-0"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What's Important to Us */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-36">
          <h2
            className={`text-3xl font-bold text-center mb-12 text-brand-primary ${locale === "ar" ? "font-noto" : ""}`}
          >
            {t.whatsImportant}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8 text-brand-primary" />,
                title: locale === "ar" ? t.quality : t.quality,
                description: locale === "ar" ? t.qualityDesc : t.qualityDesc,
              },
              {
                icon: <CheckCircle className="w-8 h-8 text-brand-primary" />,
                title: locale === "ar" ? t.transparency : t.transparency,
                description: locale === "ar" ? t.transparencyDesc : t.transparencyDesc,
              },
              {
                icon: <Users className="w-8 h-8 text-brand-primary" />,
                title: locale === "ar" ? t.experience : t.experience,
                description: locale === "ar" ? t.experienceDesc : t.experienceDesc,
              },
            ].map((value, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className={`p-6 text-center ${locale === "ar" ? "rtl" : ""}`}>
                  <div className="mb-4 flex justify-center">{value.icon}</div>
                  <h3 className={`text-xl font-semibold text-brand-primary mb-4 ${locale === "ar" ? "font-noto" : ""}`}>
                    {value.title}
                  </h3>
                  <p className={`text-gray-600 ${locale === "ar" ? "font-noto" : ""}`}>{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Partners */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-36">
          <h2
            className={`text-3xl font-bold text-center mb-12 text-brand-primary ${locale === "ar" ? "font-noto" : ""}`}
          >
            {t.ourBackers}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {[
              { name: "Partner 1", logo: "/images/logo.PNG" },
              { name: "Partner 2", logo: "/images/logo.PNG" },
              { name: "Partner 3", logo: "/images/logo.PNG" },
              { name: "Partner 4", logo: "/images/logo.PNG" },
            ].map((partner, index) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <Image
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.name}
                  width={200}
                  height={80}
                  className="object-contain w-full h-20"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-36">
          <h2
            className={`text-3xl font-bold text-center mb-12 text-brand-primary ${locale === "ar" ? "font-noto" : ""}`}
          >
            {t.mediaCoverage}
          </h2>
          <Slider {...sliderSettings} className="media-coverage-slider">
            {[
              {
                source: "Economic Times",
                title: "Young Saudi drives demand for luxury cars",
                image: "/images/about-main-image.JPG",
                link: "#",
              },
              {
                source: "Arab News",
                title: "Alromaih's largest automobile experiential hub in Riyadh",
                image: "/images/about-main-image.JPG",
                link: "#",
              },
              {
                source: "Saudi Gazette",
                title: "Full-stack concept explained with benefits",
                image: "/images/about-main-image.JPG",
                link: "#",
              },
              {
                source: "Gulf Business",
                title: "Women continue to drive the demand for luxury cars",
                image: "/images/about-main-image.JPG",
                link: "#",
              },
            ].map((article, index) => (
              <div key={index} className="px-2">
                <Link href={article.link} className="block group">
                  <div className="relative h-[200px] rounded-lg overflow-hidden">
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                      <div
                        className={`absolute bottom-0 p-4 text-white ${locale === "ar" ? "right-0 text-right" : "left-0 text-left"}`}
                      >
                        <Badge className="mb-2 bg-brand-primary">{article.source}</Badge>
                        <h3 className={`text-lg font-semibold line-clamp-2 ${locale === "ar" ? "font-noto" : ""}`}>
                          {article.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-brand-primary text-white">
        <div className="container mx-auto px-4 md:px-36">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Car className="w-8 h-8" />,
                number: "1000+",
                text: locale === "ar" ? t.premiumVehicles : t.premiumVehicles,
              },
              {
                icon: <Star className="w-8 h-8" />,
                number: "4.8/5",
                text: locale === "ar" ? t.customerRating : t.customerRating,
              },
              {
                icon: <Trophy className="w-8 h-8" />,
                number: "15+",
                text: locale === "ar" ? t.industryAwards : t.industryAwards,
              },
              {
                icon: <Building2 className="w-8 h-8" />,
                number: "10+",
                text: locale === "ar" ? t.showrooms : t.showrooms,
              },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">{stat.icon}</div>
                <h3 className="text-3xl font-bold mb-2">{stat.number}</h3>
                <p className={`text-gray-200 ${locale === "ar" ? "font-noto" : ""}`}>{stat.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-36 text-center">
          <h2 className={`text-3xl font-bold mb-6 text-brand-primary ${locale === "ar" ? "font-noto" : ""}`}>
            {t.readyToExperience}
          </h2>
          <p className={`text-lg mb-8 max-w-2xl mx-auto text-gray-600 ${locale === "ar" ? "font-noto" : ""}`}>
            {t.visitShowroom}
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href={`/${locale}/contact`}
              className={`inline-block bg-brand-primary text-white px-8 py-3 rounded-md hover:bg-brand-primary/90 transition-colors ${locale === "ar" ? "font-noto" : ""}`}
            >
              {t.contactUs}
            </Link>
            <Link
              href={`/${locale}/locations`}
              className={`inline-block border-2 border-brand-primary text-brand-primary px-8 py-3 rounded-md hover:bg-brand-primary/10 transition-colors ${locale === "ar" ? "font-noto" : ""}`}
            >
              {t.findShowroom}
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .media-coverage-slider :global(.slick-prev),
        .media-coverage-slider :global(.slick-next) {
          width: 40px;
          height: 40px;
          background: rgba(113, 48, 138, 0.8);
          border-radius: 50%;
          z-index: 1;
        }

        .media-coverage-slider :global(.slick-prev) {
          left: -20px;
        }

        .media-coverage-slider :global(.slick-next) {
          right: -20px;
        }

        .media-coverage-slider :global(.slick-prev:hover),
        .media-coverage-slider :global(.slick-next:hover) {
          background: rgb(113, 48, 138);
        }

        .media-coverage-slider :global(.slick-prev:before),
        .media-coverage-slider :global(.slick-next:before) {
          font-size: 24px;
        }
      `}</style>
    </main>
  )
}

