// This file serves as a dummy API for the car listing
// In a real application, this would be replaced with an actual API call

// Car images
const carImages = {
    car1: "/images/car.png",
    car2: "/images/car.png",
    car3: "/images/car.png",
    car4: "/images/car.png",
    car5: "/images/car.png",
    car6: "/images/car.png",
    car7: "/images/car.png",
    car8: "/images/car.png",
  }
  
  // Brand logos
  const brandLogos = {
    jetour: "/icons/jetour-logo.svg",
  }
  
  // Icons - updated with the SVG icons from the image
  const icons = {
    fuel: "/icons/Fuel.svg",
    seats: "/icons/Horse.svg",
    transmission: "/icons/Transmission.svg",
    year: "/icons/Calendar.svg",
    currency: "/icons/currency.svg", // Added Currency.svg
  }
  
  // Mock car data with bilingual content
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
        seats: 5,
        transmission: {
          en: "Automatic",
          ar: "أوتوماتيك",
        },
        year: 2023,
      },
      icons: {
        fuel: icons.fuel,
        seats: icons.seats,
        transmission: icons.transmission,
        year: icons.year,
        currency: icons.currency, // Added Currency.svg
      },
    },
    {
      id: 2,
      name: {
        en: "Jetour T2",
        ar: "جيتور T2",
      },
      brand: "Jetour",
      brandLogo: brandLogos.jetour,
      image: carImages.car2,
      status: "unavailable",
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
        seats: 5,
        transmission: {
          en: "Automatic",
          ar: "أوتوماتيك",
        },
        year: 2023,
      },
      icons: {
        fuel: icons.fuel,
        seats: icons.seats,
        transmission: icons.transmission,
        year: icons.year,
        currency: icons.currency, // Added Currency.svg
      },
    },
    {
      id: 3,
      name: {
        en: "Jetour T2",
        ar: "جيتور T2",
      },
      brand: "Jetour",
      brandLogo: brandLogos.jetour,
      image: carImages.car3,
      status: "discount",
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
        seats: 5,
        transmission: {
          en: "Automatic",
          ar: "أوتوماتيك",
        },
        year: 2023,
      },
      icons: {
        fuel: icons.fuel,
        seats: icons.seats,
        transmission: icons.transmission,
        year: icons.year,
        currency: icons.currency, // Added Currency.svg
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
        seats: 7,
        transmission: {
          en: "Automatic",
          ar: "أوتوماتيك",
        },
        year: 2024,
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
        seats: 7,
        transmission: {
          en: "Automatic",
          ar: "أوتوماتيك",
        },
        year: 2024,
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
        seats: 5,
        transmission: {
          en: "Automatic",
          ar: "أوتوماتيك",
        },
        year: 2024,
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
        seats: 7,
        transmission: {
          en: "Automatic",
          ar: "أوتوماتيك",
        },
        year: 2023,
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
        seats: 5,
        transmission: {
          en: "Automatic",
          ar: "أوتوماتيك",
        },
        year: 2023,
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
  
  export default carsData
  
  