"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, Shield, Users, CheckCircle, Building2, Star, Trophy } from "lucide-react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useTranslations } from "next-intl"

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

export default function HomePage() {
  const t  = useTranslations("aboutUsUheader");
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury Car Showcase"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto px-4 md:px-36 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <Badge className="bg-[#71308A] mb-4 text-white">{t('badgeText')}</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {t("title")}
            </h1>
            <p className="text-xl mb-8">{t("description")}</p>
            <Link
              href="/inventory"
              className="inline-block bg-[#71308A] text-white px-8 py-3 rounded-md hover:bg-[#71308A]/90 transition-colors"
            >
              {t("buttonText")}
            </Link>
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-36">
          <h2 className="text-3xl font-bold text-center mb-12">Our Presence in Saudi Arabia</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                city: "Riyadh",
                image: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?q=80&w=2070&auto=format&fit=crop",
                description:
                  "Our flagship showroom in the heart of Riyadh showcases the finest luxury vehicles. Located in the prestigious Olaya District, this state-of-the-art facility spans over 5000 square meters.",
                locations: "3 Showrooms",
              },
              {
                city: "AR AR",
                image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                description:
                  "Experience luxury car shopping at its finest in our AR AR showroom. Our modern facility offers a wide selection of premium vehicles and exceptional customer service.",
                locations: "2 Showrooms",
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
                    <div className="absolute bottom-0 p-4">
                      <h3 className="text-2xl font-bold text-white mb-1">{location.city}</h3>
                      <Badge className="bg-[#71308A]">{location.locations}</Badge>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 leading-relaxed">{location.description}</p>
                  <div className="mt-4">
                    <Link
                      href={`/locations/${location.city.toLowerCase()}`}
                      className="inline-flex items-center text-[#71308A] hover:underline"
                    >
                      View Showrooms
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
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
          <h2 className="text-3xl font-bold text-center mb-12">What's Important to Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8 text-[#71308A]" />,
                title: "Quality",
                description:
                  "We maintain the highest standards in our vehicle selection and service delivery, ensuring every customer receives excellence.",
              },
              {
                icon: <CheckCircle className="w-8 h-8 text-[#71308A]" />,
                title: "Transparency & Accountability",
                description:
                  "Our commitment to honest dealings and clear communication builds lasting trust with our valued customers.",
              },
              {
                icon: <Users className="w-8 h-8 text-[#71308A]" />,
                title: "Personalized Experience",
                description:
                  "We tailor our services to meet individual preferences, ensuring a unique and satisfying journey for each client.",
              },
            ].map((value, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-[#71308A] mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Backers */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-36">
          <h2 className="text-3xl font-bold text-center mb-12">Our Backers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {[
              {
                name: "Tiger Global",
                logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=2073&auto=format&fit=crop",
              },
              {
                name: "FJ Labs",
                logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=2073&auto=format&fit=crop",
              },
              {
                name: "ARENA",
                logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=2073&auto=format&fit=crop",
              },
              {
                name: "Think Investments",
                logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=2073&auto=format&fit=crop",
              },
            ].map((backer, index) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <Image
                  src={backer.logo || "/placeholder.svg"}
                  alt={backer.name}
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
          <h2 className="text-3xl font-bold text-center mb-12">Media Coverage</h2>
          <Slider {...sliderSettings} className="media-coverage-slider">
            {[
              {
                source: "Economic Times",
                title: "Young Saudi drives demand for luxury cars",
                image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop",
                link: "#",
              },
              {
                source: "Arab News",
                title: "Alromaih's largest automobile experiential hub in Riyadh",
                image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=2070&auto=format&fit=crop",
                link: "#",
              },
              {
                source: "Saudi Gazette",
                title: "Full-stack concept explained with benefits",
                image: "https://images.unsplash.com/photo-1536766820879-059fec98ec0a?q=80&w=2070&auto=format&fit=crop",
                link: "#",
              },
              {
                source: "Gulf Business",
                title: "Women continue to drive the demand for luxury cars",
                image: "https://images.unsplash.com/photo-1562911791-c7a97b729ec5?q=80&w=2070&auto=format&fit=crop",
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
                      <div className="absolute bottom-0 p-4 text-white">
                        <Badge className="mb-2 bg-[#71308A]">{article.source}</Badge>
                        <h3 className="text-lg font-semibold line-clamp-2">{article.title}</h3>
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
      <section className="py-16 bg-[#71308A] text-white">
        <div className="container mx-auto px-4 md:px-36">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Car className="w-8 h-8" />, number: "1000+", text: "Premium Vehicles" },
              { icon: <Star className="w-8 h-8" />, number: "4.8/5", text: "Customer Rating" },
              { icon: <Trophy className="w-8 h-8" />, number: "15+", text: "Industry Awards" },
              { icon: <Building2 className="w-8 h-8" />, number: "10+", text: "Showrooms" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">{stat.icon}</div>
                <h3 className="text-3xl font-bold mb-2">{stat.number}</h3>
                <p className="text-gray-200">{stat.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-36 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience Luxury?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-600">
            Visit our nearest showroom or contact us for a personalized consultation
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-[#71308A] text-white px-8 py-3 rounded-md hover:bg-[#71308A]/90 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/locations"
              className="inline-block border-2 border-[#71308A] text-[#71308A] px-8 py-3 rounded-md hover:bg-[#71308A]/10 transition-colors"
            >
              Find Showroom
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

