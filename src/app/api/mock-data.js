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

// Specification names for display
const specNames = {
  transmission: { en: "Transmission", ar: "ناقل الحركة" },
  driveType: { en: "Drive Type", ar: "نوع الجر" },
  drivingMode: { en: "Driving Mode", ar: "وضع القيادة" },
  engine: { en: "Engine", ar: "المحرك" },
  power: { en: "Power", ar: "القوة" },
  torque: { en: "Torque", ar: "عزم الدوران" },
  acceleration: { en: "0-100 km/h", ar: "التسارع 0-100 كم/س" },
  length: { en: "Length", ar: "الطول" },
  width: { en: "Width", ar: "العرض" },
  height: { en: "Height", ar: "الارتفاع" },
  wheelbase: { en: "Wheelbase", ar: "قاعدة العجلات" },
  seats: { en: "Seating Capacity", ar: "عدد المقاعد" },
  fuelTank: { en: "Fuel Tank Capacity", ar: "سعة خزان الوقود" },
  cargoCapacity: { en: "Cargo Capacity", ar: "سعة الحمولة" },
  airbags: { en: "Airbags", ar: "الوسائد الهوائية" },
  brakes: { en: "Brakes", ar: "المكابح" },
  parkingSensors: { en: "Parking Sensors", ar: "حساسات الركن" },
  camera: { en: "Rear Camera", ar: "كاميرا خلفية" },
}

// Specification categories with their icons
const specCategories = [
  {
    id: "transmission",
    name: { en: "Transmission", ar: "ناقل الحركة" },
    icon: "/icons/transmission.svg",
    specs: ["transmission", "driveType", "drivingMode"],
  },
  {
    id: "engine",
    name: { en: "Engine & Performance", ar: "المحرك والأداء" },
    icon: "/icons/Horse.svg",
    specs: ["engine", "power", "torque", "acceleration"],
  },
  {
    id: "dimensions",
    name: { en: "Dimensions", ar: "الأبعاد" },
    icon: "/icons/dimensions.svg",
    specs: ["length", "width", "height", "wheelbase"],
  },
  {
    id: "capacity",
    name: { en: "Capacity", ar: "السعة" },
    icon: "/icons/seats.svg",
    specs: ["seats", "fuelTank", "cargoCapacity"],
  },
  {
    id: "safety",
    name: { en: "Safety", ar: "السلامة" },
    icon: "/icons/safety.svg",
    specs: ["airbags", "brakes", "parkingSensors", "camera"],
  },
]

// Mock car data with bilingual content - Updated with mixed brands
const carsData = [
  {
    id: 1,
    name: {
      en: "Toyota Camry",
      ar: "تويوتا كامري",
    },
    brand: "Toyota",
    brandLogo: brandLogos.toyota,
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
        en: "Front-wheel Drive",
        ar: "دفع أمامي",
      },
      drivingMode: {
        en: "Normal, Sport, Eco",
        ar: "عادي رياضي اقتصادي",
      },
      year: 2023,
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
        en: "8.5 seconds",
        ar: "8.5 ثانية",
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
    id: 2,
    name: {
      en: "Honda Accord",
      ar: "هوندا أكورد",
    },
    brand: "Honda",
    brandLogo: brandLogos.honda,
    image: carImages.car2,
    status: "unavailable",
    modelYear: {
      en: "Full Model 2023",
      ar: "الطراز الكامل 2023",
    },
    cashPrice: 155000,
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
        en: "Automatic",
        ar: "أوتوماتيك",
      },
      driveType: {
        en: "Front-wheel Drive",
        ar: "دفع أمامي",
      },
      drivingMode: {
        en: "Normal, Sport, Eco",
        ar: "عادي رياضي اقتصادي",
      },
      year: 2023,
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
        en: "Ventilated Disc Brakes (F/R)",
        ar: "فرامل قرصية مهواة (أمامية/خلفية)",
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
    id: 3,
    name: {
      en: "Hyundai Sonata",
      ar: "هيونداي سوناتا",
    },
    brand: "Hyundai",
    brandLogo: brandLogos.hyundai,
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
        en: "Front-wheel Drive",
        ar: "دفع أمامي",
      },
      drivingMode: {
        en: "Normal, Sport, Smart",
        ar: "عادي رياضي ذكي",
      },
      year: 2023,
      engine: {
        en: "2.5L",
        ar: "2.5 لتر",
      },
      power: {
        en: "191 HP",
        ar: "191 حصان",
      },
      torque: {
        en: "245 Nm",
        ar: "245 نيوتن متر",
      },
      acceleration: {
        en: "8.2 seconds",
        ar: "8.2 ثانية",
      },
      length: {
        en: "4,900 mm",
        ar: "4,900 ملم",
      },
      width: {
        en: "1,860 mm",
        ar: "1,860 ملم",
      },
      height: {
        en: "1,445 mm",
        ar: "1,445 ملم",
      },
      wheelbase: {
        en: "2,840 mm",
        ar: "2,840 ملم",
      },
      fuelTank: {
        en: "60 Liters",
        ar: "60 لتر",
      },
      cargoCapacity: {
        en: "510 Liters",
        ar: "510 لتر",
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
    id: 4,
    name: {
      en: "Nissan Altima",
      ar: "نيسان التيما",
    },
    brand: "Nissan",
    brandLogo: brandLogos.nissan,
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
        en: "5 Seats",
        ar: "5 مقاعد",
      },
      transmission: {
        en: "CVT",
        ar: "سي في تي",
      },
      driveType: {
        en: "Front-wheel Drive",
        ar: "دفع أمامي",
      },
      drivingMode: {
        en: "Normal, Sport, Eco",
        ar: "عادي رياضي اقتصادي",
      },
      year: 2024,
      engine: {
        en: "2.5L",
        ar: "2.5 لتر",
      },
      power: {
        en: "188 HP",
        ar: "188 حصان",
      },
      torque: {
        en: "244 Nm",
        ar: "244 نيوتن متر",
      },
      acceleration: {
        en: "8.4 seconds",
        ar: "8.4 ثانية",
      },
      length: {
        en: "4,900 mm",
        ar: "4,900 ملم",
      },
      width: {
        en: "1,850 mm",
        ar: "1,850 ملم",
      },
      height: {
        en: "1,450 mm",
        ar: "1,450 ملم",
      },
      wheelbase: {
        en: "2,825 mm",
        ar: "2,825 ملم",
      },
      fuelTank: {
        en: "58 Liters",
        ar: "58 لتر",
      },
      cargoCapacity: {
        en: "436 Liters",
        ar: "436 لتر",
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
      en: "Chevrolet Malibu",
      ar: "شيفروليه ماليبو",
    },
    brand: "Chevrolet",
    brandLogo: brandLogos.chevrolet,
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
      drivingMode: {
        en: "Normal, Sport, Eco",
        ar: "عادي رياضي اقتصادي",
      },
      year: 2024,
      engine: {
        en: "1.5L Turbo",
        ar: "1.5 لتر توربو",
      },
      power: {
        en: "160 HP",
        ar: "160 حصان",
      },
      torque: {
        en: "250 Nm",
        ar: "250 نيوتن متر",
      },
      acceleration: {
        en: "8.6 seconds",
        ar: "8.6 ثانية",
      },
      length: {
        en: "4,920 mm",
        ar: "4,920 ملم",
      },
      width: {
        en: "1,854 mm",
        ar: "1,854 ملم",
      },
      height: {
        en: "1,455 mm",
        ar: "1,455 ملم",
      },
      wheelbase: {
        en: "2,830 mm",
        ar: "2,830 ملم",
      },
      fuelTank: {
        en: "62 Liters",
        ar: "62 لتر",
      },
      cargoCapacity: {
        en: "445 Liters",
        ar: "445 لتر",
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
      en: "Ford Fusion",
      ar: "فورد فيوجن",
    },
    brand: "Ford",
    brandLogo: brandLogos.ford,
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
        en: "Front-wheel Drive",
        ar: "دفع أمامي",
      },
      drivingMode: {
        en: "Normal, Sport, Eco",
        ar: "عادي رياضي اقتصادي",
      },
      year: 2024,
      engine: {
        en: "2.0L",
        ar: "2.0 لتر",
      },
      power: {
        en: "175 HP",
        ar: "175 حصان",
      },
      torque: {
        en: "240 Nm",
        ar: "240 نيوتن متر",
      },
      acceleration: {
        en: "8.7 seconds",
        ar: "8.7 ثانية",
      },
      length: {
        en: "4,870 mm",
        ar: "4,870 ملم",
      },
      width: {
        en: "1,852 mm",
        ar: "1,852 ملم",
      },
      height: {
        en: "1,476 mm",
        ar: "1,476 ملم",
      },
      wheelbase: {
        en: "2,850 mm",
        ar: "2,850 ملم",
      },
      fuelTank: {
        en: "62 Liters",
        ar: "62 لتر",
      },
      cargoCapacity: {
        en: "453 Liters",
        ar: "453 لتر",
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
      en: "MG 6",
      ar: "إم جي 6",
    },
    brand: "MG",
    brandLogo: brandLogos.mg,
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
      drivingMode: {
        en: "Normal, Sport, Eco",
        ar: "عادي رياضي اقتصادي",
      },
      year: 2023,
      engine: {
        en: "1.5L Turbo",
        ar: "1.5 لتر توربو",
      },
      power: {
        en: "169 HP",
        ar: "169 حصان",
      },
      torque: {
        en: "250 Nm",
        ar: "250 نيوتن متر",
      },
      acceleration: {
        en: "7.8 seconds",
        ar: "7.8 ثانية",
      },
      length: {
        en: "4,695 mm",
        ar: "4,695 ملم",
      },
      width: {
        en: "1,848 mm",
        ar: "1,848 ملم",
      },
      height: {
        en: "1,462 mm",
        ar: "1,462 ملم",
      },
      wheelbase: {
        en: "2,715 mm",
        ar: "2,715 ملم",
      },
      fuelTank: {
        en: "50 Liters",
        ar: "50 لتر",
      },
      cargoCapacity: {
        en: "424 Liters",
        ar: "424 لتر",
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
    id: 8,
    name: {
      en: "Changan Eado",
      ar: "شانجان إيدو",
    },
    brand: "Changan",
    brandLogo: brandLogos.changan,
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
        en: "Front-wheel Drive",
        ar: "دفع أمامي",
      },
      drivingMode: {
        en: "Normal, Sport, Eco",
        ar: "عادي رياضي اقتصادي",
      },
      year: 2023,
      engine: {
        en: "1.6L",
        ar: "1.6 لتر",
      },
      power: {
        en: "128 HP",
        ar: "128 حصان",
      },
      torque: {
        en: "161 Nm",
        ar: "161 نيوتن متر",
      },
      acceleration: {
        en: "10.5 seconds",
        ar: "10.5 ثانية",
      },
      length: {
        en: "4,730 mm",
        ar: "4,730 ملم",
      },
      width: {
        en: "1,820 mm",
        ar: "1,820 ملم",
      },
      height: {
        en: "1,505 mm",
        ar: "1,505 ملم",
      },
      wheelbase: {
        en: "2,700 mm",
        ar: "2,700 ملم",
      },
      fuelTank: {
        en: "53 Liters",
        ar: "53 لتر",
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
  {
    id: 9,
    name: {
      en: "Chery Arrizo 6",
      ar: "شيري أريزو 6",
    },
    brand: "Chery",
    brandLogo: brandLogos.chery,
    image: carImages.car9,
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
        en: "CVT",
        ar: "سي في تي",
      },
      driveType: {
        en: "Front-wheel Drive",
        ar: "دفع أمامي",
      },
      drivingMode: {
        en: "Normal, Sport, Eco",
        ar: "عادي رياضي اقتصادي",
      },
      year: 2024,
      engine: {
        en: "1.5L Turbo",
        ar: "1.5 لتر توربو",
      },
      power: {
        en: "147 HP",
        ar: "147 حصان",
      },
      torque: {
        en: "210 Nm",
        ar: "210 نيوتن متر",
      },
      acceleration: {
        en: "9.9 seconds",
        ar: "9.9 ثانية",
      },
      length: {
        en: "4,675 mm",
        ar: "4,675 ملم",
      },
      width: {
        en: "1,825 mm",
        ar: "1,825 ملم",
      },
      height: {
        en: "1,483 mm",
        ar: "1,483 ملم",
      },
      wheelbase: {
        en: "2,670 mm",
        ar: "2,670 ملم",
      },
      fuelTank: {
        en: "48 Liters",
        ar: "48 لتر",
      },
      cargoCapacity: {
        en: "430 Liters",
        ar: "430 لتر",
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
    id: 10,
    name: {
      en: "Haval H6",
      ar: "هافال H6",
    },
    brand: "Haval",
    brandLogo: brandLogos.haval,
    image: carImages.car10,
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
      drivingMode: {
        en: "Normal, Sport, Eco",
        ar: "عادي رياضي اقتصادي",
      },
      year: 2024,
      engine: {
        en: "1.5L Turbo",
        ar: "1.5 لتر توربو",
      },
      power: {
        en: "169 HP",
        ar: "169 حصان",
      },
      torque: {
        en: "285 Nm",
        ar: "285 نيوتن متر",
      },
      acceleration: {
        en: "9.5 seconds",
        ar: "9.5 ثانية",
      },
      length: {
        en: "4,653 mm",
        ar: "4,653 ملم",
      },
      width: {
        en: "1,886 mm",
        ar: "1,886 ملم",
      },
      height: {
        en: "1,730 mm",
        ar: "1,730 ملم",
      },
      wheelbase: {
        en: "2,738 mm",
        ar: "2,738 ملم",
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
      en: "Jetour X70",
      ar: "جيتور X70",
    },
    brand: "Jetour",
    brandLogo: brandLogos.jetour,
    image: carImages.car11,
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
      year: 2022,
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
]

// Function to simulate API call with a delay
export const fetchCars = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(carsData)
    }, 500) // 500ms delay to simulate network request
  })
}

// Export all the data for use in components
export default carsData
export { specNames, specCategories }
