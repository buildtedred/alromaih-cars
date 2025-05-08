// This file serves as a dummy API for the car listing
// In a real application, this would be replaced with an actual API call

// Car images - Using the same image paths but they'll represent different cars
const carImages = {
  car1: "/images/car1.png",
  car1_1: "/images/car1.png",
  car1_2: "/images/car2.png",
  car1_3: "/images/car3.png",
  car1_4: "/images/car4.png",
  car2: "/images/car2.png",
  car2_1: "/images/car2.png",
  car2_2: "/images/car5.png",
  car2_3: "/images/car6.png",
  car2_4: "/images/car7.png",
  car3: "/images/car3.png",
  car3_1: "/images/car3.png",
  car3_2: "/images/car8.png",
  car3_3: "/images/car9.png",
  car3_4: "/images/car10.png",
  car4: "/images/car4.png",
  car4_1: "/images/car4.png",
  car4_2: "/images/car11.png",
  car4_3: "/images/car1.png",
  car4_4: "/images/car2.png",
  car5: "/images/car5.png",
  car5_1: "/images/car5.png",
  car5_2: "/images/car3.png",
  car5_3: "/images/car4.png",
  car5_4: "/images/car6.png",
  car6: "/images/car6.png",
  car6_1: "/images/car6.png",
  car6_2: "/images/car7.png",
  car6_3: "/images/car8.png",
  car6_4: "/images/car9.png",
  car7: "/images/car7.png",
  car7_1: "/images/car7.png",
  car7_2: "/images/car10.png",
  car7_3: "/images/car11.png",
  car7_4: "/images/car1.png",
  car8: "/images/car8.png",
  car8_1: "/images/car8.png",
  car8_2: "/images/car2.png",
  car8_3: "/images/car3.png",
  car8_4: "/images/car4.png",
  car9: "/images/car9.png",
  car9_1: "/images/car9.png",
  car9_2: "/images/car2.png",
  car9_3: "/images/car3.png",
  car9_4: "/images/car4.png",
  car10: "/images/car10.png",
  car10_1: "/images/car10.png",
  car10_2: "/images/car11.png",
  car10_3: "/images/car1.png",
  car10_4: "/images/car2.png",
  car11: "/images/car11.png",
  car11_1: "/images/car11.png",
  car11_2: "/images/car3.png",
  car11_3: "/images/car4.png",
  car11_4: "/images/car5.png",
}

// Brand logos
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

// Icons
const icons = {
  fuel: "/icons/Fuel.svg",
  seats: "/icons/Horse.svg",
  transmission: "/icons/Transmission.svg",
  year: "/icons/Calendar.svg",
  currency: "/icons/Currency.svg",
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
  fuelType: { en: "Fuel Type", ar: "نو�� الوقود" },
  year: { en: "Year", ar: "السنة" },
}

// Specification categories
export const specCategories = [
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

// Overview data structure for car information section
const overviewCategories = [
  [
    {
      key: "year",
      icon: "calendar",
      label: { en: "Manufacturing Year", ar: "سنة الصنع" },
    },
    {
      key: "torque",
      icon: "gaugeCircle",
      label: { en: "Torque", ar: "عزم الدوران" },
    },
    {
      key: "power",
      icon: "gauge",
      label: { en: "Power", ar: "القوة" },
    },
  ],
  [
    {
      key: "fuelTank",
      icon: "fuel",
      label: { en: "Fuel Tank Capacity", ar: "سعة خزان الوقود" },
    },
    {
      key: "brand",
      icon: "car",
      label: { en: "Manufactured", ar: "الشركة المصنعة" },
    },
    {
      key: "engine",
      icon: "settings",
      label: { en: "Engine", ar: "المحرك" },
    },
  ],
  [
    {
      key: "fuelType",
      icon: "fuel",
      label: { en: "Fuel Type", ar: "نوع الوقود" },
    },
    {
      key: "transmission",
      icon: "wrench",
      label: { en: "Transmission", ar: "ناقل الحركة" },
    },
    {
      key: "seats",
      icon: "users",
      label: { en: "Seating Capacity", ar: "سعة المقاعد" },
    },
  ],
]

// Brand names with Arabic translations
export const brandNames = {
  Toyota: { en: "Toyota", ar: "تويوتا" },
  Honda: { en: "Honda", ar: "هوندا" },
  Hyundai: { en: "Hyundai", ar: "هيونداي" },
  Nissan: { en: "Nissan", ar: "نيسان" },
  Chevrolet: { en: "Chevrolet", ar: "شيفروليه" },
  Ford: { en: "Ford", ar: "فورد" },
  MG: { en: "MG", ar: "إم جي" },
  Changan: { en: "Changan", ar: "شانجان" },
  Chery: { en: "Chery", ar: "شيري" },
  Haval: { en: "Haval", ar: "هافال" },
  Jetour: { en: "Jetour", ar: "جيتور" },
  Bestune: { en: "Bestune", ar: "بيستون" },
  Hongqi: { en: "Hongqi", ar: "هونغتشي" },
  Suzuki: { en: "Suzuki", ar: "سوزوكي" },
}

// Default features for all cars
const defaultFeatures = {
  airConditioning: true,
  powerSteering: true,
  powerWindows: true,
  antiLockBrakes: true,
  driverAirbag: true,
  passengerAirbag: true,
  automaticClimateControl: false,
  alloyWheels: false,
  multiFunctionSteeringWheel: false,
  powerSeats: false,
  rearACVents: false,
  rearParkingSensors: false,
  frontParkingSensors: false,
  rearCamera: false,
  keylessEntry: false,
  pushButtonStart: false,
  cruiseControl: false,
  leatherSeats: false,
  navigationSystem: false,
  bluetoothConnectivity: false,
  sunroof: false,
  headlightWasher: false,
  rainSensingWipers: false,
  ventilatedSeats: false,
  heatedSeats: false,
  laneAssist: false,
  blindSpotMonitoring: false,
  adaptiveCruiseControl: false,
  collisionWarningSystem: false,
  emergencyBraking: false,
}

// Mock car data with bilingual content - Each car has mixed images and unique specifications
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
    price: 146000,
    cashPrice: 146000,
    installmentPrice: 1940,
    available_colors: [
      { name: "White", hex: "#FFFFFF", image: carImages.car1 },
      { name: "Black", hex: "#000000", image: carImages.car1_1 },
      { name: "Silver", hex: "#C0C0C0", image: carImages.car1_2 },
    ],
    pricing: {
      monthly_installment: 1940,
      base_price: 146000,
    },
    icons: {
      fuel: "/icons/Fuel.svg",
      seats: "/icons/Horse.svg",
      transmission: "/icons/Transmission.svg",
      year: "/icons/Calendar.svg",
      currency: "/icons/Currency.svg",
    },
    features: {
      ...defaultFeatures,
      automaticClimateControl: true,
      alloyWheels: true,
      multiFunctionSteeringWheel: true,
      powerSeats: true,
      rearACVents: true,
      rearParkingSensors: true,
      rearCamera: true,
      keylessEntry: true,
      pushButtonStart: true,
      cruiseControl: true,
      leatherSeats: true,
      navigationSystem: true,
      bluetoothConnectivity: true,
    },
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
    additional_images: [carImages.car1_1, carImages.car1_2, carImages.car1_3, carImages.car1_4],
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
      en: "Full Model 2022",
      ar: "الطراز الكامل 2022",
    },
    price: 155000,
    cashPrice: 155000,
    installmentPrice: 2070,
    available_colors: [
      { name: "Blue", hex: "#0000FF", image: carImages.car2 },
      { name: "Red", hex: "#FF0000", image: carImages.car2_1 },
      { name: "Gray", hex: "#808080", image: carImages.car2_2 },
    ],
    pricing: {
      monthly_installment: 2070,
      base_price: 155000,
    },
    icons: {
      fuel: "/icons/Fuel.svg",
      seats: "/icons/Horse.svg",
      transmission: "/icons/Transmission.svg",
      year: "/icons/Calendar.svg",
      currency: "/icons/Currency.svg",
    },
    features: {
      ...defaultFeatures,
      automaticClimateControl: true,
      alloyWheels: true,
      multiFunctionSteeringWheel: true,
      powerSeats: true,
      rearACVents: true,
      rearParkingSensors: true,
      frontParkingSensors: true,
      rearCamera: true,
      keylessEntry: true,
      pushButtonStart: true,
      cruiseControl: true,
      leatherSeats: true,
      navigationSystem: true,
      bluetoothConnectivity: true,
      sunroof: true,
      headlightWasher: true,
      rainSensingWipers: true,
    },
    specs: {
      fuelType: {
        en: "Hybrid",
        ar: "هجين",
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
        en: "Normal, Sport, Eco, EV",
        ar: "عادي رياضي اقتصادي كهربائي",
      },
      year: 2022,
      engine: {
        en: "2.0L Hybrid",
        ar: "2.0 لتر هجين",
      },
      power: {
        en: "212 HP (Combined)",
        ar: "212 حصان (مجتمعة)",
      },
      torque: {
        en: "315 Nm",
        ar: "315 نيوتن متر",
      },
      acceleration: {
        en: "7.0 seconds",
        ar: "7.0 ثانية",
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
        en: "48.5 Liters",
        ar: "48.5 لتر",
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
        en: "Multi-view Camera System",
        ar: "نظام كاميرا متعدد الزوايا",
      },
    },
    additional_images: [carImages.car2_1, carImages.car2_2, carImages.car2_3, carImages.car2_4],
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
      en: "Full Model 2024",
      ar: "الطراز الكامل 2024",
    },
    price: 165000,
    cashPrice: 165000,
    installmentPrice: 2200,
    available_colors: [
      { name: "White", hex: "#FFFFFF", image: carImages.car3 },
      { name: "Black", hex: "#000000", image: carImages.car3_1 },
      { name: "Blue", hex: "#0000FF", image: carImages.car3_2 },
    ],
    pricing: {
      monthly_installment: 2200,
      base_price: 165000,
    },
    icons: {
      fuel: "/icons/Fuel.svg",
      seats: "/icons/Horse.svg",
      transmission: "/icons/Transmission.svg",
      year: "/icons/Calendar.svg",
      currency: "/icons/Currency.svg",
    },
    features: {
      ...defaultFeatures,
      automaticClimateControl: true,
      alloyWheels: true,
      multiFunctionSteeringWheel: true,
      powerSeats: true,
      rearACVents: true,
      rearParkingSensors: true,
      frontParkingSensors: true,
      rearCamera: true,
      keylessEntry: true,
      pushButtonStart: true,
      cruiseControl: true,
      leatherSeats: true,
      navigationSystem: true,
      bluetoothConnectivity: true,
      sunroof: true,
      headlightWasher: true,
      rainSensingWipers: true,
      ventilatedSeats: true,
      heatedSeats: true,
      laneAssist: true,
      blindSpotMonitoring: true,
      adaptiveCruiseControl: true,
      collisionWarningSystem: true,
      emergencyBraking: true,
    },
    specs: {
      fuelType: {
        en: "Gasoline Turbo",
        ar: "بنزين توربو",
      },
      seats: {
        en: "5 Seats",
        ar: "5 مقاعد",
      },
      transmission: {
        en: "8-Speed Automatic",
        ar: "أوتوماتيك 8 سرعات",
      },
      driveType: {
        en: "Front-wheel Drive",
        ar: "دفع أمامي",
      },
      drivingMode: {
        en: "Normal, Sport, Smart, Custom",
        ar: "عادي رياضي ذكي مخصص",
      },
      year: 2024,
      engine: {
        en: "1.6L Turbo",
        ar: "1.6 لتر توربو",
      },
      power: {
        en: "180 HP",
        ar: "180 حصان",
      },
      torque: {
        en: "265 Nm",
        ar: "265 نيوتن متر",
      },
      acceleration: {
        en: "7.8 seconds",
        ar: "7.8 ثانية",
      },
      length: {
        en: "4,900 mm",
        ar: "4,900 ملم",
      },
      width: {
        en: "1,860 mm",
        ar: "1,860 mلم",
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
        en: "9 Airbags",
        ar: "9 وسائد هوائية",
      },
      brakes: {
        en: "Ventilated Disc Brakes (F/R)",
        ar: "فرامل قرصية مهواة (أمامية/خلفية)",
      },
      parkingSensors: {
        en: "Front & Rear with Auto Parking",
        ar: "أمامية وخلفية مع ركن تلقائي",
      },
      camera: {
        en: "Surround View Monitor",
        ar: "شاشة عرض محيطية",
      },
    },
    additional_images: [carImages.car3_1, carImages.car3_2, carImages.car3_3, carImages.car3_4],
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
      en: "Full Model 2021",
      ar: "الطراز الكامل 2021",
    },
    price: 168000,
    cashPrice: 168000,
    installmentPrice: 2240,
    available_colors: [
      { name: "Silver", hex: "#C0C0C0", image: carImages.car4 },
      { name: "Black", hex: "#000000", image: carImages.car4_1 },
      { name: "Red", hex: "#FF0000", image: carImages.car4_2 },
    ],
    pricing: {
      monthly_installment: 2240,
      base_price: 168000,
    },
    icons: {
      fuel: "/icons/Fuel.svg",
      seats: "/icons/Horse.svg",
      transmission: "/icons/Transmission.svg",
      year: "/icons/Calendar.svg",
      currency: "/icons/Currency.svg",
    },
    features: {
      ...defaultFeatures,
      automaticClimateControl: true,
      alloyWheels: true,
      multiFunctionSteeringWheel: true,
      powerSeats: true,
      rearACVents: true,
      rearParkingSensors: true,
      frontParkingSensors: true,
      rearCamera: true,
      keylessEntry: true,
      pushButtonStart: true,
      cruiseControl: true,
      leatherSeats: false,
      navigationSystem: true,
      bluetoothConnectivity: true,
      sunroof: false,
      headlightWasher: false,
      rainSensingWipers: true,
      ventilatedSeats: false,
      heatedSeats: true,
      laneAssist: true,
      blindSpotMonitoring: true,
      adaptiveCruiseControl: false,
      collisionWarningSystem: true,
      emergencyBraking: true,
    },
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
        en: "Xtronic CVT",
        ar: "إكسترونيك سي في تي",
      },
      driveType: {
        en: "All-wheel Drive",
        ar: "دفع رباعي",
      },
      drivingMode: {
        en: "Normal, Sport, Eco, Snow",
        ar: "عادي رياضي اقتصادي ثلج",
      },
      year: 2021,
      engine: {
        en: "2.0L VC-Turbo",
        ar: "2.0 لتر في سي-توربو",
      },
      power: {
        en: "248 HP",
        ar: "248 حصان",
      },
      torque: {
        en: "370 Nm",
        ar: "370 نيوتن متر",
      },
      acceleration: {
        en: "6.7 seconds",
        ar: "6.7 ثانية",
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
        en: "10 Airbags",
        ar: "10 وسائد هوائية",
      },
      brakes: {
        en: "Performance Disc Brakes (F/R)",
        ar: "فرامل قرصية عالية الأداء (أمامية/خلفية)",
      },
      parkingSensors: {
        en: "Intelligent Around View Monitor",
        ar: "نظام مراقبة ذكي محيطي",
      },
      camera: {
        en: "360° Camera with Moving Object Detection",
        ar: "كاميرا 360 درجة مع كشف الأجسام المتحركة",
      },
    },
    additional_images: [carImages.car4_1, carImages.car4_2, carImages.car4_3, carImages.car4_4],
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
      en: "Full Model 2020",
      ar: "الطراز الكامل 2020",
    },
    price: 195000,
    cashPrice: 195000,
    installmentPrice: 2590,
    available_colors: [
      { name: "White", hex: "#FFFFFF", image: carImages.car5 },
      { name: "Blue", hex: "#0000FF", image: carImages.car5_1 },
      { name: "Gray", hex: "#808080", image: carImages.car5_2 },
    ],
    pricing: {
      monthly_installment: 2590,
      base_price: 195000,
    },
    icons: {
      fuel: "/icons/Fuel.svg",
      seats: "/icons/Horse.svg",
      transmission: "/icons/Transmission.svg",
      year: "/icons/Calendar.svg",
      currency: "/icons/Currency.svg",
    },
    features: {
      ...defaultFeatures,
      automaticClimateControl: true,
      alloyWheels: true,
      multiFunctionSteeringWheel: true,
      powerSeats: true,
      rearACVents: true,
      rearParkingSensors: true,
      frontParkingSensors: true,
      rearCamera: true,
      keylessEntry: true,
      pushButtonStart: true,
      cruiseControl: true,
      leatherSeats: true,
      navigationSystem: true,
      bluetoothConnectivity: true,
      sunroof: true,
      headlightWasher: false,
      rainSensingWipers: true,
      ventilatedSeats: true,
      heatedSeats: true,
    },
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
        en: "9-Speed Automatic",
        ar: "أوتوماتيك 9 سرعات",
      },
      driveType: {
        en: "Front-wheel Drive",
        ar: "دفع أمامي",
      },
      drivingMode: {
        en: "Tour, Sport, Snow/Ice",
        ar: "سياحي رياضي ثلج/جليد",
      },
      year: 2020,
      engine: {
        en: "2.0L Turbo",
        ar: "2.0 لتر توربو",
      },
      power: {
        en: "250 HP",
        ar: "250 حصان",
      },
      torque: {
        en: "350 Nm",
        ar: "350 نيوتن متر",
      },
      acceleration: {
        en: "6.5 seconds",
        ar: "6.5 ثانية",
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
        en: "Brembo Performance Brakes",
        ar: "فرامل بريمبو عالية الأداء",
      },
      parkingSensors: {
        en: "Front & Rear with Automatic Braking",
        ar: "أمامية وخلفية مع فرملة تلقائية",
      },
      camera: {
        en: "HD Surround Vision",
        ar: "رؤية محيطية عالية الدقة",
      },
    },
    additional_images: [carImages.car5_1, carImages.car5_2, carImages.car5_3, carImages.car5_4],
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
      en: "Full Model 2019",
      ar: "الطراز الكامل 2019",
    },
    price: 178000,
    cashPrice: 178000,
    installmentPrice: 2370,
    available_colors: [
      { name: "Black", hex: "#000000", image: carImages.car6 },
      { name: "White", hex: "#FFFFFF", image: carImages.car6_1 },
      { name: "Red", hex: "#FF0000", image: carImages.car6_2 },
    ],
    pricing: {
      monthly_installment: 2370,
      base_price: 178000,
    },
    icons: {
      fuel: "/icons/Fuel.svg",
      seats: "/icons/Horse.svg",
      transmission: "/icons/Transmission.svg",
      year: "/icons/Calendar.svg",
      currency: "/icons/Currency.svg",
    },
    features: {
      ...defaultFeatures,
      automaticClimateControl: true,
      alloyWheels: true,
      multiFunctionSteeringWheel: true,
      powerSeats: true,
      rearACVents: true,
      rearParkingSensors: true,
      frontParkingSensors: false,
      rearCamera: true,
      keylessEntry: true,
      pushButtonStart: true,
      cruiseControl: true,
      leatherSeats: false,
      navigationSystem: false,
      bluetoothConnectivity: true,
      sunroof: false,
    },
    specs: {
      fuelType: {
        en: "Plug-in Hybrid",
        ar: "هجين قابل للشحن",
      },
      seats: {
        en: "5 Seats",
        ar: "5 مقاعد",
      },
      transmission: {
        en: "eCVT",
        ar: "إي سي في تي",
      },
      driveType: {
        en: "Front-wheel Drive",
        ar: "دفع أمامي",
      },
      drivingMode: {
        en: "EV Now, Auto EV, EV Later",
        ar: "كهربائي الآن، كهربائي تلقائي، كهربائي لاحقاً",
      },
      year: 2019,
      engine: {
        en: "2.0L iVCT Atkinson + Electric Motor",
        ar: "2.0 لتر آي في سي تي أتكنسون + محرك كهربائي",
      },
      power: {
        en: "220 HP (Combined)",
        ar: "220 حصان (مجتمعة)",
      },
      torque: {
        en: "285 Nm",
        ar: "285 نيوتن متر",
      },
      acceleration: {
        en: "7.8 seconds",
        ar: "7.8 ثانية",
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
        en: "53 Liters + 14 kWh Battery",
        ar: "53 لتر + بطارية 14 كيلوواط ساعة",
      },
      cargoCapacity: {
        en: "453 Liters",
        ar: "453 لتر",
      },
      airbags: {
        en: "8 Airbags",
        ar: "8 وسائد هوائية",
      },
      brakes: {
        en: "Regenerative Braking System",
        ar: "نظام فرامل استرجاعية",
      },
      parkingSensors: {
        en: "Active Park Assist 2.0",
        ar: "مساعد الركن النشط 2.0",
      },
      camera: {
        en: "Split-View Camera",
        ar: "كاميرا بعرض مقسم",
      },
    },
    additional_images: [carImages.car6_1, carImages.car6_2, carImages.car6_3, carImages.car6_4],
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
      en: "Full Model 2018",
      ar: "الطراز الكامل 2018",
    },
    price: 210000,
    cashPrice: 210000,
    installmentPrice: 2790,
    available_colors: [
      { name: "Red", hex: "#FF0000", image: carImages.car7 },
      { name: "White", hex: "#FFFFFF", image: carImages.car7_1 },
      { name: "Black", hex: "#000000", image: carImages.car7_2 },
    ],
    pricing: {
      monthly_installment: 2790,
      base_price: 210000,
    },
    icons: {
      fuel: "/icons/Fuel.svg",
      seats: "/icons/Horse.svg",
      transmission: "/icons/Transmission.svg",
      year: "/icons/Calendar.svg",
      currency: "/icons/Currency.svg",
    },
    features: {
      ...defaultFeatures,
      automaticClimateControl: true,
      alloyWheels: true,
      multiFunctionSteeringWheel: true,
      powerSeats: false,
      rearACVents: true,
      rearParkingSensors: true,
      frontParkingSensors: false,
      rearCamera: true,
      keylessEntry: true,
      pushButtonStart: true,
      cruiseControl: true,
      leatherSeats: true,
      navigationSystem: false,
      bluetoothConnectivity: true,
      sunroof: true,
    },
    specs: {
      fuelType: {
        en: "Gasoline Turbo",
        ar: "بنزين توربو",
      },
      seats: {
        en: "5 Seats",
        ar: "5 مقاعد",
      },
      transmission: {
        en: "7-Speed DCT",
        ar: "دي سي تي 7 سرعات",
      },
      driveType: {
        en: "Front-wheel Drive",
        ar: "دفع أمامي",
      },
      drivingMode: {
        en: "Eco, Normal, Sport, Super Sport",
        ar: "اقتصادي، عادي، رياضي، رياضي فائق",
      },
      year: 2018,
      engine: {
        en: "1.5L Turbo",
        ar: "1.5 لتر توربو",
      },
      power: {
        en: "181 HP",
        ar: "181 حصان",
      },
      torque: {
        en: "285 Nm",
        ar: "285 نيوتن متر",
      },
      acceleration: {
        en: "6.9 seconds",
        ar: "6.9 ثانية",
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
        en: "Sport Disc Brakes with Red Calipers",
        ar: "فرامل قرصية رياضية مع ملاقط حمراء",
      },
      parkingSensors: {
        en: "360° Parking System",
        ar: "نظام ركن 360 درجة",
      },
      camera: {
        en: "360° Panoramic Camera",
        ar: "كاميرا بانورامية 360 درجة",
      },
    },
    additional_images: [carImages.car7_1, carImages.car7_2, carImages.car7_3, carImages.car7_4],
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
      en: "Full Model 2017",
      ar: "الطراز الكامل 2017",
    },
    price: 135000,
    cashPrice: 135000,
    installmentPrice: 1790,
    available_colors: [
      { name: "Blue", hex: "#0000FF", image: carImages.car8 },
      { name: "Silver", hex: "#C0C0C0", image: carImages.car8_1 },
      { name: "White", hex: "#FFFFFF", image: carImages.car8_2 },
    ],
    pricing: {
      monthly_installment: 1790,
      base_price: 135000,
    },
    icons: {
      fuel: "/icons/Fuel.svg",
      seats: "/icons/Horse.svg",
      transmission: "/icons/Transmission.svg",
      year: "/icons/Calendar.svg",
      currency: "/icons/Currency.svg",
    },
    features: {
      ...defaultFeatures,
      automaticClimateControl: false,
      alloyWheels: true,
      multiFunctionSteeringWheel: true,
      powerSeats: false,
      rearACVents: false,
      rearParkingSensors: true,
      frontParkingSensors: false,
      rearCamera: true,
      keylessEntry: true,
      pushButtonStart: false,
      cruiseControl: true,
      leatherSeats: false,
      navigationSystem: false,
      bluetoothConnectivity: true,
    },
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
        en: "6-Speed Automatic",
        ar: "أوتوماتيك 6 سرعات",
      },
      driveType: {
        en: "Front-wheel Drive",
        ar: "دفع أمامي",
      },
      drivingMode: {
        en: "Eco, Normal, Sport",
        ar: "اقتصادي، عادي، رياضي",
      },
      year: 2017,
      engine: {
        en: "1.4L Turbo",
        ar: "1.4 لتر توربو",
      },
      power: {
        en: "158 HP",
        ar: "158 حصان",
      },
      torque: {
        en: "230 Nm",
        ar: "230 نيوتن متر",
      },
      acceleration: {
        en: "9.2 seconds",
        ar: "9.2 ثانية",
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
        en: "Disc Brakes with ABS & EBD",
        ar: "فرامل قرصية مع نظام منع انغلاق وتوزيع إلكتروني",
      },
      parkingSensors: {
        en: "Rear Parking Sensors",
        ar: "حساسات ركن خلفية",
      },
      camera: {
        en: "HD Rear Camera",
        ar: "كاميرا خلفية عالية الدقة",
      },
    },
    additional_images: [carImages.car8_1, carImages.car8_2, carImages.car8_3, carImages.car8_4],
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
      en: "Full Model 2016",
      ar: "الطراز الكامل 2016",
    },
    price: 120000,
    cashPrice: 120000,
    installmentPrice: 1600,
    available_colors: [
      { name: "White", hex: "#FFFFFF", image: carImages.car9 },
      { name: "Black", hex: "#000000", image: carImages.car9_1 },
      { name: "Red", hex: "#FF0000", image: carImages.car9_2 },
    ],
    pricing: {
      monthly_installment: 1600,
      base_price: 120000,
    },
    icons: {
      fuel: "/icons/Fuel.svg",
      seats: "/icons/Horse.svg",
      transmission: "/icons/Transmission.svg",
      year: "/icons/Calendar.svg",
      currency: "/icons/Currency.svg",
    },
    features: {
      ...defaultFeatures,
      automaticClimateControl: false,
      alloyWheels: true,
      multiFunctionSteeringWheel: true,
      powerSeats: false,
      rearACVents: false,
      rearParkingSensors: true,
      frontParkingSensors: false,
      rearCamera: true,
      keylessEntry: true,
      pushButtonStart: false,
      cruiseControl: false,
      leatherSeats: false,
      navigationSystem: false,
      bluetoothConnectivity: true,
    },
    specs: {
      fuelType: {
        en: "Gasoline Turbo",
        ar: "بنزين توربو",
      },
      seats: {
        en: "5 Seats",
        ar: "5 مقاعد",
      },
      transmission: {
        en: "7-Speed DCT",
        ar: "دي سي تي 7 سرعات",
      },
      driveType: {
        en: "Front-wheel Drive",
        ar: "دفع أمامي",
      },
      drivingMode: {
        en: "Eco, Comfort, Sport",
        ar: "اقتصادي، مريح، رياضي",
      },
      year: 2016,
      engine: {
        en: "1.5L TGDI",
        ar: "1.5 لتر تي جي دي آي",
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
        en: "8.9 seconds",
        ar: "8.9 ثانية",
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
        en: "Ventilated Disc Brakes (F/R)",
        ar: "فرامل قرصية مهواة (أمامية/خلفية)",
      },
      parkingSensors: {
        en: "Front & Rear with Auto Brake",
        ar: "أمامية وخلفية مع فرملة تلقائية",
      },
      camera: {
        en: "360° Camera System",
        ar: "كاميرا 360 درجة",
      },
    },
    additional_images: [carImages.car9_1, carImages.car9_2, carImages.car9_3, carImages.car9_4],
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
      en: "Full Model 2015",
      ar: "الطراز الكامل 2015",
    },
    price: 125000,
    cashPrice: 125000,
    installmentPrice: 1650,
    available_colors: [
      { name: "Gray", hex: "#808080", image: carImages.car10 },
      { name: "White", hex: "#FFFFFF", image: carImages.car10_1 },
      { name: "Black", hex: "#000000", image: carImages.car10_2 },
    ],
    pricing: {
      monthly_installment: 1650,
      base_price: 125000,
    },
    icons: {
      fuel: "/icons/Fuel.svg",
      seats: "/icons/Horse.svg",
      transmission: "/icons/Transmission.svg",
      year: "/icons/Calendar.svg",
      currency: "/icons/Currency.svg",
    },
    features: {
      ...defaultFeatures,
      automaticClimateControl: true,
      alloyWheels: true,
      multiFunctionSteeringWheel: true,
      powerSeats: false,
      rearACVents: true,
      rearParkingSensors: true,
      frontParkingSensors: false,
      rearCamera: true,
      keylessEntry: true,
      pushButtonStart: true,
      cruiseControl: true,
      leatherSeats: false,
      navigationSystem: false,
      bluetoothConnectivity: true,
      sunroof: false,
    },
    specs: {
      fuelType: {
        en: "Hybrid",
        ar: "هجين",
      },
      seats: {
        en: "5 Seats",
        ar: "5 مقاعد",
      },
      transmission: {
        en: "7-Speed Wet DCT",
        ar: "دي سي تي رطب 7 سرعات",
      },
      driveType: {
        en: "All-wheel Drive",
        ar: "دفع رباعي",
      },
      drivingMode: {
        en: "Standard, Sport, Eco, Snow, Mud, Sand",
        ar: "قياسي، رياضي، اقتصادي، ثلج، طين، رمل",
      },
      year: 2015,
      engine: {
        en: "1.5L Turbo + Electric Motor",
        ar: "1.5 لتر توربو + محرك كهربائي",
      },
      power: {
        en: "243 HP (Combined)",
        ar: "243 حصان (مجتمعة)",
      },
      torque: {
        en: "530 Nm",
        ar: "530 نيوتن متر",
      },
      acceleration: {
        en: "7.5 seconds",
        ar: "7.5 ثانية",
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
        en: "55 Liters",
        ar: "55 لتر",
      },
      cargoCapacity: {
        en: "600 Liters",
        ar: "600 لتر",
      },
      airbags: {
        en: "7 Airbags",
        ar: "7 وسائد هوائية",
      },
      brakes: {
        en: "Ventilated Disc Brakes with Auto Hold",
        ar: "فرامل قرصية مهواة مع تثبيت تلقائي",
      },
      parkingSensors: {
        en: "Intelligent Parking Assist",
        ar: "مساعد ركن ذكي",
      },
      camera: {
        en: "HD 360° Camera with Dynamic Guidelines",
        ar: "كاميرا 360 درجة عالية الدقة مع خطوط إرشادية ديناميكية",
      },
    },
    additional_images: [carImages.car10_1, carImages.car10_2, carImages.car10_3, carImages.car10_4],
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
      en: "Full Model 2014",
      ar: "الطراز الكامل 2014",
    },
    price: 120000,
    cashPrice: 120000,
    installmentPrice: 1550,
    available_colors: [
      { name: "Blue", hex: "#0000FF", image: carImages.car11 },
      { name: "White", hex: "#FFFFFF", image: carImages.car11_1 },
      { name: "Black", hex: "#000000", image: carImages.car11_2 },
    ],
    pricing: {
      monthly_installment: 1550,
      base_price: 120000,
    },
    icons: {
      fuel: "/icons/Fuel.svg",
      seats: "/icons/Horse.svg",
      transmission: "/icons/Transmission.svg",
      year: "/icons/Calendar.svg",
      currency: "/icons/Currency.svg",
    },
    features: {
      ...defaultFeatures,
      automaticClimateControl: false,
      alloyWheels: true,
      multiFunctionSteeringWheel: true,
      powerSeats: false,
      rearACVents: true,
      rearParkingSensors: true,
      frontParkingSensors: false,
      rearCamera: true,
      keylessEntry: true,
      pushButtonStart: false,
      cruiseControl: false,
      leatherSeats: false,
      navigationSystem: false,
      bluetoothConnectivity: true,
    },
    specs: {
      fuelType: {
        en: "Gasoline Turbo",
        ar: "بنزين توربو",
      },
      seats: {
        en: "7 Seats",
        ar: "7 مقاعد",
      },
      transmission: {
        en: "6-Speed DCT",
        ar: "دي سي تي 6 سرعات",
      },
      driveType: {
        en: "All-wheel Drive",
        ar: "دفع رباعي",
      },
      drivingMode: {
        en: "Eco, Normal, Sport, Off-road",
        ar: "اقتصادي، عادي، رياضي، طرق وعرة",
      },
      year: 2014,
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
        en: "8.7 seconds",
        ar: "8.7 ثانية",
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
        en: "Disc Brakes with Hill Descent Control",
        ar: "فرامل قرصية مع نظام التحكم بالنزول",
      },
      parkingSensors: {
        en: "Front & Rear with Auto Parking",
        ar: "أمامية وخلفية مع ركن تلقائي",
      },
      camera: {
        en: "Panoramic View Monitor",
        ar: "شاشة عرض بانورامية",
      },
    },
    additional_images: [carImages.car11_1, carImages.car11_2, carImages.car11_3, carImages.car11_4],
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
export { specNames, overviewCategories }
