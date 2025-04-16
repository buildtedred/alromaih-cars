// This file serves as a dummy API for the car listing
// In a real application, this would be replaced with an actual API call

// Car images - Updated with numbered image names
const carImages = {
  car1: "/images/car1.png",
  car2: "/images/car2.png",
  car3: "/images/car3.png",
  car4: "/images/car4.png",
  car5: "/images/car5.png",
  car6: "/images/car6.png",
  car7: "/images/car7.png",
  car8: "/images/car8.png",
  car9: "/images/car9.png",
  car10: "/images/car10.png",
  car11: "/images/car11.png",
}

// Brand logos - Updated with all brand SVGs
const brandLogos = {
  jetour: "/brands/jetour.svg",
  bestune: "/brands/bestune.svg",
  changan: "/brands/changan.svg",
  chery: "/brands/chery.svg",
  chevrolet: "/brands/chevrolet.svg",
  ford: "/brands/ford.svg",
  haval: "/brands/haval.svg",
  honda: "/brands/honda.svg",
  hongqi: "/brands/hongqi.svg",
  hyundai: "/brands/hyundai.svg",
  mg: "/brands/mg.svg",
  nissan: "/brands/nissan.svg",
  suzuki: "/brands/suzuki.svg",
  toyota: "/brands/toyota.svg",
}

// Icons - updated with the SVG icons from the image
const icons = {
  fuel: "/icons/Fuel.svg",
  seats: "/icons/Horse.svg",
  transmission: "/icons/Transmission.svg",
  year: "/icons/Calendar.svg",
  currency: "/icons/Currency.svg", // Changed to use capital "C"
}

// Mock car data with bilingual content - Updated specifications
const carsData = [
  {
    id: 1,
    name: {
      en: "Jetour T2",
      ar: "جيتور T2",
    },
    brand: "Jetour",
    brandLogo: brandLogos.jetour,
    image: carImages.car1,
    status: "new",
    modelYear: {
      en: "Full Model 2023",
      ar: "الطراز الكامل 2023",
    },
    cashPrice: 146000,
    installmentPrice: 1940,
    specs: {
      fuelType: {
        en: "Gasoline",
        ar: "بنزين",
      },
      seats: {
        en: "5 Seats",
        ar: "5 مقاعد",
      },
      transmission: {
        en: "Automatic",
        ar: "أوتوماتيك",
      },
      driveType: {
        en: "All-wheel Drive",
        ar: "دفع رباعي",
      },
      drivingMode: {
        en: "Normal, Sport, Sand, Mud",
        ar: "عادي رياضي الرمال الطين",
      },
      year: 2023,
      engine: {
        en: "1.6L Turbo",
        ar: "1.6 لتر توربو",
      },
      power: {
        en: "197 HP",
        ar: "197 حصان",
      },
      torque: {
        en: "290 Nm",
        ar: "290 نيوتن متر",
      },
      acceleration: {
        en: "8.5 seconds",
        ar: "8.5 ثانية",
      },
      length: {
        en: "4,555 mm",
        ar: "4,555 ملم",
      },
      width: {
        en: "1,855 mm",
        ar: "1,855 ملم",
      },
      height: {
        en: "1,719 mm",
        ar: "1,719 ملم",
      },
      wheelbase: {
        en: "2,720 mm",
        ar: "2,720 ملم",
      },
      fuelTank: {
        en: "60 Liters",
        ar: "60 لتر",
      },
      cargoCapacity: {
        en: "600 Liters",
        ar: "600 لتر",
      },
      airbags: {
        en: "6 Airbags",
        ar: "6 وسائد هوائية",
      },
      brakes: {
        en: "Disc Brakes (F/R)",
        ar: "فرامل قرصية (أمامية/خلفية)",
      },
      parkingSensors: {
        en: "Front & Rear",
        ar: "أمامية وخلفية",
      },
      camera: {
        en: "360° Camera",
        ar: "كاميرا 360 درجة",
      },
    },
    features: {
      exterior: true,
      interior: true,
      engine: true,
      exteriorFeatures: true,
      safety: true,
      technology: true,
      entertainment: true,
      comfort: true,
    },
    icons: {
      fuel: icons.fuel,
      seats: icons.seats,
      transmission: icons.transmission,
      year: icons.year,
      currency: icons.currency,
    },
  },
  {
    id: 2,
    name: {
      en: "Jetour T2 Plus",
      ar: "جيتور T2 بلس",
    },
    brand: "Jetour",
    brandLogo: brandLogos.jetour,
    image: carImages.car2,
    status: "unavailable",
    modelYear: {
      en: "Full Model 2023",
      ar: "الطراز الكامل 2023",
    },
    cashPrice: 4000,
    installmentPrice: 2070,
    specs: {
      fuelType: {
        en: "Gasoline",
        ar: "بنزين",
      },
      seats: {
        en: "5 Seats",
        ar: "5 مقاعد",
      },
      transmission: {
        en: "Manual",
        ar: "يدوي",
      },
      driveType: {
        en: "All-wheel Drive",
        ar: "دفع رباعي",
      },
      drivingMode: {
        en: "Normal, Sport, Sand, Mud",
        ar: "عادي رياضي الرمال الطين",
      },
      year: 2023,
      engine: {
        en: "1.6L Turbo",
        ar: "1.6 لتر توربو",
      },
      power: {
        en: "197 HP",
        ar: "197 حصان",
      },
      torque: {
        en: "290 Nm",
        ar: "290 نيوتن متر",
      },
      acceleration: {
        en: "8.2 seconds",
        ar: "8.2 ثانية",
      },
      length: {
        en: "4,555 mm",
        ar: "4,555 ملم",
      },
      width: {
        en: "1,855 mm",
        ar: "1,855 ملم",
      },
      height: {
        en: "1,719 mm",
        ar: "1,719 ملم",
      },
      wheelbase: {
        en: "2,720 mm",
        ar: "2,720 ملم",
      },
      fuelTank: {
        en: "60 Liters",
        ar: "60 لتر",
      },
      cargoCapacity: {
        en: "600 Liters",
        ar: "600 لتر",
      },
      airbags: {
        en: "6 Airbags",
        ar: "6 وسائد هوائية",
      },
      brakes: {
        en: "Ventilated Disc Brakes (F/R)",
        ar: "فرامل قرصية مهواة (أمامية/خلفية)",
      },
      parkingSensors: {
        en: "Front & Rear",
        ar: "أمامية وخلفية",
      },
      camera: {
        en: "360° Camera",
        ar: "كاميرا 360 درجة",
      },
    },
    features: {
      exterior: true,
      interior: true,
      engine: true,
      exteriorFeatures: true,
      safety: true,
      technology: true,
      entertainment: true,
      comfort: true,
    },
    icons: {
      fuel: icons.fuel,
      seats: icons.seats,
      transmission: icons.transmission,
      year: icons.year,
      currency: icons.currency,
    },
  },
  {
    id: 3,
    name: {
      en: "Jetour T2 Sport",
      ar: "جيتور T2 سبورت",
    },
    brand: "Jetour",
    brandLogo: brandLogos.jetour,
    image: carImages.car3,
    status: "discount",
    modelYear: {
      en: "Full Model 2023",
      ar: "الطراز الكامل 2023",
    },
    cashPrice: 165000,
    installmentPrice: 2200,
    specs: {
      fuelType: {
        en: "Gasoline",
        ar: "بنزين",
      },
      seats: {
        en: "5 Seats",
        ar: "5 مقاعد",
      },
      transmission: {
        en: "Automatic",
        ar: "أوتوماتيك",
      },
      driveType: {
        en: "All-wheel Drive",
        ar: "دفع رباعي",
      },
      drivingMode: {
        en: "Normal, Sport, Sand, Mud",
        ar: "عادي رياضي الرمال الطين",
      },
      year: 2023,
      engine: {
        en: "2.0L Turbo",
        ar: "2.0 لتر توربو",
      },
      power: {
        en: "254 HP",
        ar: "254 حصان",
      },
      torque: {
        en: "390 Nm",
        ar: "390 نيوتن متر",
      },
      acceleration: {
        en: "6.9 seconds",
        ar: "6.9 ثانية",
      },
      length: {
        en: "4,560 mm",
        ar: "4,560 ملم",
      },
      width: {
        en: "1,860 mm",
        ar: "1,860 ملم",
      },
      height: {
        en: "1,710 mm",
        ar: "1,710 ملم",
      },
      wheelbase: {
        en: "2,720 mm",
        ar: "2,720 mلم",
      },
      fuelTank: {
        en: "65 Liters",
        ar: "65 لتر",
      },
      cargoCapacity: {
        en: "580 Liters",
        ar: "580 لتر",
      },
      airbags: {
        en: "8 Airbags",
        ar: "8 وسائد هوائية",
      },
      brakes: {
        en: "Ventilated Disc Brakes (F/R)",
        ar: "فرامل قرصية مهواة (أمامية/خلفية)",
      },
      parkingSensors: {
        en: "Front & Rear",
        ar: "أمامية وخلفية",
      },
      camera: {
        en: "360° Camera",
        ar: "كاميرا 360 درجة",
      },
    },
    features: {
      exterior: true,
      interior: true,
      engine: true,
      exteriorFeatures: true,
      safety: true,
      technology: true,
      entertainment: true,
      comfort: true,
    },
    icons: {
      fuel: icons.fuel,
      seats: icons.seats,
      transmission: icons.transmission,
      year: icons.year,
      currency: icons.currency,
    },
  },
  {
    id: 4,
    name: {
      en: "Jetour X70",
      ar: "جيتور X70",
    },
    brand: "Jetour",
    brandLogo: brandLogos.jetour,
    image: carImages.car4,
    status: "new",
    modelYear: {
      en: "Full Model 2024",
      ar: "الطراز الكامل 2024",
    },
    cashPrice: 168000,
    installmentPrice: 2240,
    specs: {
      fuelType: {
        en: "Gasoline",
        ar: "بنزين",
      },
      seats: {
        en: "7 Seats",
        ar: "7 مقاعد",
      },
      transmission: {
        en: "Automatic",
        ar: "أوتوماتيك",
      },
      driveType: {
        en: "All-wheel Drive",
        ar: "دفع رباعي",
      },
      drivingMode: {
        en: "Normal, Sport, Sand, Mud",
        ar: "عادي رياضي الرمال الطين",
      },
      year: 2024,
      engine: {
        en: "1.5L Turbo",
        ar: "1.5 لتر توربو",
      },
      power: {
        en: "156 HP",
        ar: "156 حصان",
      },
      torque: {
        en: "230 Nm",
        ar: "230 نيوتن متر",
      },
      acceleration: {
        en: "9.5 seconds",
        ar: "9.5 ثانية",
      },
      length: {
        en: "4,720 mm",
        ar: "4,720 ملم",
      },
      width: {
        en: "1,900 mm",
        ar: "1,900 ملم",
      },
      height: {
        en: "1,780 mm",
        ar: "1,780 ملم",
      },
      wheelbase: {
        en: "2,750 mm",
        ar: "2,750 ملم",
      },
      fuelTank: {
        en: "55 Liters",
        ar: "55 لتر",
      },
      cargoCapacity: {
        en: "950 Liters (3rd row folded)",
        ar: "950 لتر (الصف الثالث مطوي)",
      },
      airbags: {
        en: "6 Airbags",
        ar: "6 وسائد هوائية",
      },
      brakes: {
        en: "Disc Brakes (F/R)",
        ar: "فرامل قرصية (أمامية/خلفية)",
      },
      parkingSensors: {
        en: "Front & Rear",
        ar: "أمامية وخلفية",
      },
      camera: {
        en: "Rear Camera",
        ar: "كاميرا خلفية",
      },
    },
    features: {
      exterior: true,
      interior: true,
      engine: true,
      exteriorFeatures: true,
      safety: true,
      technology: true,
      entertainment: true,
      comfort: true,
    },
    icons: {
      fuel: icons.fuel,
      seats: icons.seats,
      transmission: icons.transmission,
      year: icons.year,
      currency: icons.currency,
    },
  },
  {
    id: 5,
    name: {
      en: "Jetour X90",
      ar: "جيتور X90",
    },
    brand: "Jetour",
    brandLogo: brandLogos.jetour,
    image: carImages.car5,
    status: "discount",
    modelYear: {
      en: "Full Model 2024",
      ar: "الطراز الكامل 2024",
    },
    cashPrice: 195000,
    installmentPrice: 2590,
    specs: {
      fuelType: {
        en: "Gasoline",
        ar: "بنزين",
      },
      seats: {
        en: "7 Seats",
        ar: "7 مقاعد",
      },
      transmission: {
        en: "Automatic",
        ar: "أوتوماتيك",
      },
      driveType: {
        en: "All-wheel Drive",
        ar: "دفع رباعي",
      },
      drivingMode: {
        en: "Normal, Sport, Sand, Mud",
        ar: "عادي رياضي الرمال الطين",
      },
      year: 2024,
      engine: {
        en: "1.8L Turbo",
        ar: "1.8 لتر توربو",
      },
      power: {
        en: "177 HP",
        ar: "177 حصان",
      },
      torque: {
        en: "300 Nm",
        ar: "300 نيوتن متر",
      },
      acceleration: {
        en: "9.0 seconds",
        ar: "9.0 ثانية",
      },
      length: {
        en: "4,840 mm",
        ar: "4,840 ملم",
      },
      width: {
        en: "1,925 mm",
        ar: "1,925 ملم",
      },
      height: {
        en: "1,780 mm",
        ar: "1,780 ملم",
      },
      wheelbase: {
        en: "2,850 mm",
        ar: "2,850 ملم",
      },
      fuelTank: {
        en: "65 Liters",
        ar: "65 لتر",
      },
      cargoCapacity: {
        en: "1,100 Liters (3rd row folded)",
        ar: "1,100 لتر (الصف الثالث مطوي)",
      },
      airbags: {
        en: "8 Airbags",
        ar: "8 وسائد هوائية",
      },
      brakes: {
        en: "Ventilated Disc Brakes (F/R)",
        ar: "فرامل قرصية مهواة (أمامية/خلفية)",
      },
      parkingSensors: {
        en: "Front & Rear",
        ar: "أمامية وخلفية",
      },
      camera: {
        en: "360° Camera",
        ar: "كاميرا 360 درجة",
      },
    },
    features: {
      exterior: true,
      interior: true,
      engine: true,
      exteriorFeatures: true,
      safety: true,
      technology: true,
      entertainment: true,
      comfort: true,
    },
    icons: {
      fuel: icons.fuel,
      seats: icons.seats,
      transmission: icons.transmission,
      year: icons.year,
      currency: icons.currency,
    },
  },
  {
    id: 6,
    name: {
      en: "Jetour Dashing",
      ar: "جيتور داشينج",
    },
    brand: "Jetour",
    brandLogo: brandLogos.jetour,
    image: carImages.car6,
    status: "new",
    modelYear: {
      en: "Full Model 2024",
      ar: "الطراز الكامل 2024",
    },
    cashPrice: 178000,
    installmentPrice: 2370,
    specs: {
      fuelType: {
        en: "Gasoline",
        ar: "بنزين",
      },
      seats: {
        en: "5 Seats",
        ar: "5 مقاعد",
      },
      transmission: {
        en: "Automatic",
        ar: "أوتوماتيك",
      },
      driveType: {
        en: "All-wheel Drive",
        ar: "دفع رباعي",
      },
      drivingMode: {
        en: "Normal, Sport, Sand, Mud",
        ar: "عادي رياضي الرمال الطين",
      },
      year: 2024,
      engine: {
        en: "1.5L Turbo",
        ar: "1.5 لتر توربو",
      },
      power: {
        en: "156 HP",
        ar: "156 حصان",
      },
      torque: {
        en: "230 Nm",
        ar: "230 نيوتن متر",
      },
      acceleration: {
        en: "9.8 seconds",
        ar: "9.8 ثانية",
      },
      length: {
        en: "4,615 mm",
        ar: "4,615 ملم",
      },
      width: {
        en: "1,865 mm",
        ar: "1,865 ملم",
      },
      height: {
        en: "1,700 mm",
        ar: "1,700 ملم",
      },
      wheelbase: {
        en: "2,720 mm",
        ar: "2,720 ملم",
      },
      fuelTank: {
        en: "55 Liters",
        ar: "55 لتر",
      },
      cargoCapacity: {
        en: "540 Liters",
        ar: "540 لتر",
      },
      airbags: {
        en: "6 Airbags",
        ar: "6 وسائد هوائية",
      },
      brakes: {
        en: "Disc Brakes (F/R)",
        ar: "فرامل قرصية (أمامية/خلفية)",
      },
      parkingSensors: {
        en: "Front & Rear",
        ar: "أمامية وخلفية",
      },
      camera: {
        en: "Rear Camera",
        ar: "كاميرا خلفية",
      },
    },
    features: {
      exterior: true,
      interior: true,
      engine: true,
      exteriorFeatures: true,
      safety: true,
      technology: true,
      entertainment: true,
      comfort: true,
    },
    icons: {
      fuel: icons.fuel,
      seats: icons.seats,
      transmission: icons.transmission,
      year: icons.year,
      currency: icons.currency,
    },
  },
  {
    id: 7,
    name: {
      en: "Jetour X95",
      ar: "جيتور X95",
    },
    brand: "Jetour",
    brandLogo: brandLogos.jetour,
    image: carImages.car7,
    status: "unavailable",
    modelYear: {
      en: "Full Model 2023",
      ar: "الطراز الكامل 2023",
    },
    cashPrice: 210000,
    installmentPrice: 2790,
    specs: {
      fuelType: {
        en: "Gasoline",
        ar: "بنزين",
      },
      seats: {
        en: "7 Seats",
        ar: "7 مقاعد",
      },
      transmission: {
        en: "Automatic",
        ar: "أوتوماتيك",
      },
      driveType: {
        en: "All-wheel Drive",
        ar: "دفع رباعي",
      },
      drivingMode: {
        en: "Normal, Sport, Sand, Mud",
        ar: "عادي رياضي الرمال الطين",
      },
      year: 2023,
      engine: {
        en: "2.0L Turbo",
        ar: "2.0 لتر توربو",
      },
      power: {
        en: "197 HP",
        ar: "197 حصان",
      },
      torque: {
        en: "340 Nm",
        ar: "340 نيوتن متر",
      },
      acceleration: {
        en: "8.0 seconds",
        ar: "8.0 ثانية",
      },
      length: {
        en: "4,860 mm",
        ar: "4,860 ملم",
      },
      width: {
        en: "1,925 mm",
        ar: "1,925 ملم",
      },
      height: {
        en: "1,785 mm",
        ar: "1,785 ملم",
      },
      wheelbase: {
        en: "2,850 mm",
        ar: "2,850 ملم",
      },
      fuelTank: {
        en: "65 Liters",
        ar: "65 لتر",
      },
      cargoCapacity: {
        en: "1,200 Liters (3rd row folded)",
        ar: "1,200 لتر (الصف الثالث مطوي)",
      },
      airbags: {
        en: "8 Airbags",
        ar: "8 وسائد هوائية",
      },
      brakes: {
        en: "Ventilated Disc Brakes (F/R)",
        ar: "فرامل قرصية مهواة (أمامية/خلفية)",
      },
      parkingSensors: {
        en: "Front & Rear",
        ar: "أمامية وخلفية",
      },
      camera: {
        en: "360° Camera",
        ar: "كاميرا 360 درجة",
      },
    },
    features: {
      exterior: true,
      interior: true,
      engine: true,
      exteriorFeatures: true,
      safety: true,
      technology: true,
      entertainment: true,
      comfort: true,
    },
    icons: {
      fuel: icons.fuel,
      seats: icons.seats,
      transmission: icons.transmission,
      year: icons.year,
      currency: icons.currency,
    },
  },
  {
    id: 8,
    name: {
      en: "Jetour T1",
      ar: "جيتور T1",
    },
    brand: "Jetour",
    brandLogo: brandLogos.jetour,
    image: carImages.car8,
    status: "discount",
    modelYear: {
      en: "Full Model 2023",
      ar: "الطراز الكامل 2023",
    },
    cashPrice: 135000,
    installmentPrice: 1790,
    specs: {
      fuelType: {
        en: "Gasoline",
        ar: "بنزين",
      },
      seats: {
        en: "5 Seats",
        ar: "5 مقاعد",
      },
      transmission: {
        en: "Automatic",
        ar: "أوتوماتيك",
      },
      driveType: {
        en: "All-wheel Drive",
        ar: "دفع رباعي",
      },
      drivingMode: {
        en: "Normal, Sport, Sand, Mud",
        ar: "عادي رياضي الرمال الطين",
      },
      year: 2023,
      engine: {
        en: "1.5L Turbo",
        ar: "1.5 لتر توربو",
      },
      power: {
        en: "156 HP",
        ar: "156 حصان",
      },
      torque: {
        en: "230 Nm",
        ar: "230 نيوتن متر",
      },
      acceleration: {
        en: "9.9 seconds",
        ar: "9.9 ثانية",
      },
      length: {
        en: "4,495 mm",
        ar: "4,495 ملم",
      },
      width: {
        en: "1,841 mm",
        ar: "1,841 ملم",
      },
      height: {
        en: "1,670 mm",
        ar: "1,670 ملم",
      },
      wheelbase: {
        en: "2,700 mm",
        ar: "2,700 ملم",
      },
      fuelTank: {
        en: "50 Liters",
        ar: "50 لتر",
      },
      cargoCapacity: {
        en: "450 Liters",
        ar: "450 لتر",
      },
      airbags: {
        en: "6 Airbags",
        ar: "6 وسائد هوائية",
      },
      brakes: {
        en: "Disc Brakes (F/R)",
        ar: "فرامل قرصية (أمامية/خلفية)",
      },
      parkingSensors: {
        en: "Rear Only",
        ar: "خلفية فقط",
      },
      camera: {
        en: "Rear Camera",
        ar: "كاميرا خلفية",
      },
    },
    features: {
      exterior: true,
      interior: true,
      engine: true,
      exteriorFeatures: true,
      safety: true,
      technology: true,
      entertainment: true,
      comfort: true,
    },
    icons: {
      fuel: icons.fuel,
      seats: icons.seats,
      transmission: icons.transmission,
      year: icons.year,
      currency: icons.currency,
    },
  },
  // Adding sample cars for other brands
  {
    id: 9,
    name: {
      en: "Toyota Camry",
      ar: "تويوتا كامري",
    },
    brand: "Toyota",
    brandLogo: brandLogos.toyota,
    image: carImages.car9, // You'll need to add this image
    status: "new",
    modelYear: {
      en: "Full Model 2024",
      ar: "الطراز الكامل 2024",
    },
    cashPrice: 120000,
    installmentPrice: 1600,
    specs: {
      fuelType: {
        en: "Gasoline",
        ar: "بنزين",
      },
      seats: {
        en: "5 Seats",
        ar: "5 مقاعد",
      },
      transmission: {
        en: "Automatic",
        ar: "أوتوماتيك",
      },
      driveType: {
        en: "Front-wheel Drive",
        ar: "دفع أمامي",
      },
      year: 2024,
      engine: {
        en: "2.5L",
        ar: "2.5 لتر",
      },
      power: {
        en: "203 HP",
        ar: "203 حصان",
      },
      torque: {
        en: "250 Nm",
        ar: "250 نيوتن متر",
      },
      acceleration: {
        en: "8.3 seconds",
        ar: "8.3 ثانية",
      },
      length: {
        en: "4,880 mm",
        ar: "4,880 ملم",
      },
      width: {
        en: "1,840 mm",
        ar: "1,840 ملم",
      },
      height: {
        en: "1,445 mm",
        ar: "1,445 ملم",
      },
      wheelbase: {
        en: "2,825 mm",
        ar: "2,825 ملم",
      },
      fuelTank: {
        en: "60 Liters",
        ar: "60 لتر",
      },
      cargoCapacity: {
        en: "428 Liters",
        ar: "428 لتر",
      },
      airbags: {
        en: "7 Airbags",
        ar: "7 وسائد هوائية",
      },
      brakes: {
        en: "Disc Brakes (F/R)",
        ar: "فرامل قرصية (أمامية/خلفية)",
      },
      parkingSensors: {
        en: "Front & Rear",
        ar: "أمامية وخلفية",
      },
      camera: {
        en: "360° Camera",
        ar: "كاميرا 360 درجة",
      },
    },
    features: {
      exterior: true,
      interior: true,
      engine: true,
      exteriorFeatures: true,
      safety: true,
      technology: true,
      entertainment: true,
      comfort: true,
    },
    icons: {
      fuel: icons.fuel,
      seats: icons.seats,
      transmission: icons.transmission,
      year: icons.year,
      currency: icons.currency,
    },
  },
  {
    id: 10,
    name: {
      en: "Honda Accord",
      ar: "هوندا أكورد",
    },
    brand: "Honda",
    brandLogo: brandLogos.honda,
    image: carImages.car10, // You'll need to add this image
    status: "new",
    modelYear: {
      en: "Full Model 2024",
      ar: "الطراز الكامل 2024",
    },
    cashPrice: 125000,
    installmentPrice: 1650,
    specs: {
      fuelType: {
        en: "Gasoline",
        ar: "بنزين",
      },
      seats: {
        en: "5 Seats",
        ar: "5 مقاعد",
      },
      transmission: {
        en: "Automatic",
        ar: "أوتوماتيك",
      },
      driveType: {
        en: "Front-wheel Drive",
        ar: "دفع أمامي",
      },
      year: 2024,
      engine: {
        en: "1.5L Turbo",
        ar: "1.5 لتر توربو",
      },
      power: {
        en: "192 HP",
        ar: "192 حصان",
      },
      torque: {
        en: "260 Nm",
        ar: "260 نيوتن متر",
      },
      acceleration: {
        en: "7.2 seconds",
        ar: "7.2 ثانية",
      },
      length: {
        en: "4,890 mm",
        ar: "4,890 ملم",
      },
      width: {
        en: "1,860 mm",
        ar: "1,860 ملم",
      },
      height: {
        en: "1,450 mm",
        ar: "1,450 ملم",
      },
      wheelbase: {
        en: "2,830 mm",
        ar: "2,830 ملم",
      },
      fuelTank: {
        en: "56 Liters",
        ar: "56 لتر",
      },
      cargoCapacity: {
        en: "473 Liters",
        ar: "473 لتر",
      },
      airbags: {
        en: "8 Airbags",
        ar: "8 وسائد هوائية",
      },
      brakes: {
        en: "Disc Brakes (F/R)",
        ar: "فرامل قرصية (أمامية/خلفية)",
      },
      parkingSensors: {
        en: "Front & Rear",
        ar: "أمامية وخلفية",
      },
      camera: {
        en: "Rear Camera",
        ar: "كاميرا خلفية",
      },
    },
    features: {
      exterior: true,
      interior: true,
      engine: true,
      exteriorFeatures: true,
      safety: true,
      technology: true,
      entertainment: true,
      comfort: true,
    },
    icons: {
      fuel: icons.fuel,
      seats: icons.seats,
      transmission: icons.transmission,
      year: icons.year,
      currency: icons.currency,
    },
  },
  {
    id: 11,
    name: {
      en: "Toyota Camry",
      ar: "تويوتا كامري",
    },
    brand: "Toyota",
    brandLogo: brandLogos.toyota,
    image: carImages.car11, // Make sure to add this image
    status: "new",
    modelYear: {
      en: "Full Model 2022",
      ar: "الطراز الكامل 2022",
    },
    cashPrice: 120000,
    installmentPrice: 1550,
    specs: {
      fuelType: {
        en: "Gasoline",
        ar: "بنزين",
      },
      seats: {
        en: "5 Seats",
        ar: "5 مقاعد",
      },
      transmission: {
        en: "Automatic",
        ar: "أوتوماتيك",
      },
      driveType: {
        en: "Front-wheel Drive",
        ar: "دفع أمامي",
      },
      year: 2022,
      engine: {
        en: "2.5L",
        ar: "2.5 لتر",
      },
      power: {
        en: "203 HP",
        ar: "203 حصان",
      },
      torque: {
        en: "250 Nm",
        ar: "250 نيوتن متر",
      },
      acceleration: {
        en: "7.6 seconds",
        ar: "7.6 ثانية",
      },
      length: {
        en: "4,885 mm",
        ar: "4,885 ملم",
      },
      width: {
        en: "1,840 mm",
        ar: "1,840 ملم",
      },
      height: {
        en: "1,445 mm",
        ar: "1,445 ملم",
      },
      wheelbase: {
        en: "2,825 mm",
        ar: "2,825 ملم",
      },
      fuelTank: {
        en: "60 Liters",
        ar: "60 لتر",
      },
      cargoCapacity: {
        en: "427 Liters",
        ar: "427 لتر",
      },
      airbags: {
        en: "7 Airbags",
        ar: "7 وسائد هوائية",
      },
      brakes: {
        en: "Disc Brakes (F/R)",
        ar: "فرامل قرصية (أمامية/خلفية)",
      },
      parkingSensors: {
        en: "Rear Only",
        ar: "خلفية فقط",
      },
      camera: {
        en: "Rear Camera",
        ar: "كاميرا خلفية",
      },
    },
    features: {
      exterior: true,
      interior: true,
      engine: true,
      exteriorFeatures: true,
      safety: true,
      technology: true,
      entertainment: true,
      comfort: true,
    },
    icons: {
      fuel: icons.fuel,
      seats: icons.seats,
      transmission: icons.transmission,
      year: icons.year,
      currency: icons.currency,
    },
  }
  
]

// Function to simulate API call with a delay
export const fetchCars = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(carsData)
    }, 500) // 500ms delay to simulate network request
  })
}

export default carsData

