"use client";

import * as React from "react";
import * as motion from "motion/react-client";
import Slider from "react-slick";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useLanguageContext } from "@/contexts/LanguageSwitcherContext";

function BrandShowcase() {
  const { isEnglish } = useLanguageContext();
  const staticBrands = {
    en_US: [
      {
        name: {
          en: {
            name: "Toyota",
            slug: "toyota",
          },
        },
        logo: "",
      },
      {
        name: {
          en: {
            name: "Honda",
            slug: "honda",
          },
        },
        logo: "",
      },
      {
        name: {
          en: {
            name: "BMW",
            slug: "bmw",
          },
        },
        logo: "",
      },
      {
        name: {
          en: {
            name: "Mercedes",
            slug: "mercedes",
          },
        },
        logo: "",
      },
      {
        name: {
          en: {
            name: "Audi",
            slug: "audi",
          },
        },
        logo: "",
      },
      {
        name: {
          en: {
            name: "Nissan",
            slug: "nissan",
          },
        },
        logo: "",
      },
    ],
    ar_001: [
      {
        name: {
          en: {
            name: "تويوتا",
            slug: "toyota",
          },
        },
        logo: "",
      },
      {
        name: {
          en: {
            name: "هوندا",
            slug: "honda",
          },
        },
        logo: "",
      },
      {
        name: {
          en: {
            name: "بي إم دبليو",
            slug: "bmw",
          },
        },
        logo: "",
      },
      {
        name: {
          en: {
            name: "مرسيدس",
            slug: "mercedes",
          },
        },
        logo: "",
      },
      {
        name: {
          en: {
            name: "أودي",
            slug: "audi",
          },
        },
        logo: "",
      },
      {
        name: {
          en: {
            name: "نيسان",
            slug: "nissan",
          },
        },
        logo: "",
      },
    ],
  };

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "0px",
    slidesToShow: 6, // Default slides
    slidesToScroll: 1,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1280, // Large screens
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          centerPadding: "20px",
        },
      },
      {
        breakpoint: 1024, // Medium screens
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          centerPadding: "15px",
        },
      },
      {
        breakpoint: 768, // Tablets
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          centerPadding: "10px",
        },
      },
      {
        breakpoint: 640, // Phones
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerPadding: "5px",
        },
      },
    ],
  };

  return (
    <div className="bg-gray-100 w-full py-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-8 text-right">
          موزع معتمد
        </h2>
        <Slider {...settings} className="slider-container">
          {(isEnglish ? staticBrands?.en_US : staticBrands?.ar_001)?.map(
            (brand, index) => (
              <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                key={index}
                className="p-1 md:p-2 lg:p-3"
              >
                {/* <Link href={`/brands/${brand?.name?.en?.slug}`}> */}

                <Card className="h-auto pt-1">
                  <CardContent className="flex flex-col items-center justify-center">
                    <Image
                      src={"/images/car-skeleton.png"}
                      width={20}
                      height={20}
                      alt={brand.name}
                      className="h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all"
                    />
                    <p className="text-center font-bold text-gray-500 text-sm md:text-base lg:text-lg whitespace-nowrap">
                      {brand?.name?.en?.name}
                    </p>
                  </CardContent>
                </Card>
                {/* </Link> */}
              </motion.div>
            )
          )}
        </Slider>
      </div>
    </div>
  );
}

export default BrandShowcase;
