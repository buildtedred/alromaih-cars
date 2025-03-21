"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import {
  Calendar,
  GaugeCircle,
  Car,
  Fuel,
  Users,
  Shield,
  ChevronRight,
  ChevronLeft,
  Settings,
  Wrench,
  Gauge,
  Headphones,
  X,
} from "lucide-react"

// Add custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #71308a;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #5f2873;
  }

  /* Custom dialog styles */
  .custom-dialog {
    border-radius: 15px !important;
    overflow: hidden !important;
  }
  
  .custom-dialog-content {
    border-radius: 15px !important;
    overflow: hidden !important;
    padding: 0 !important;
    border: 1px solid #e5e7eb !important;
  }
`

const CarOverview = ({ carDetails }) => {
  const pathname = usePathname()
  const isEnglish = pathname.startsWith("/en")
  const [showSpecDialog, setShowSpecDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Set default selected category when dialog opens
  useEffect(() => {
    if (showSpecDialog && !selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0])
    }
  }, [showSpecDialog])

  const overviewData = [
    [
      {
        icon: <Calendar className="w-5 h-5 text-[#71308A]" />,
        label: "Manufacturing Year",
        labelAr: "سنة الصنع",
        value: "2025",
      },
      {
        icon: <GaugeCircle className="w-5 h-5 text-[#71308A]" />,
        label: "Torque",
        labelAr: "عزم الدوران",
        value: "390 newton",
      },
      {
        icon: <Gauge className="w-5 h-5 text-[#71308A]" />,
        label: "Power",
        labelAr: "القوة",
        value: "251 hp",
      },
    ],
    [
      {
        icon: <Fuel className="w-5 h-5 text-[#71308A]" />,
        label: "Fuel Tank Capacity",
        labelAr: "سعة خزان الوقود",
        value: "60 liters",
      },
      {
        icon: <Car className="w-5 h-5 text-[#71308A]" />,
        label: "Manufactured",
        labelAr: "الشركة المصنعة",
        value: "Jetour",
      },
      {
        icon: <Gauge className="w-5 h-5 text-[#71308A]" />,
        label: "Power",
        labelAr: "القوة",
        value: "251 hp",
      },
    ],
    [
      {
        icon: <Settings className="w-5 h-5 text-[#71308A]" />,
        label: "Engine Type",
        labelAr: "نوع المحرك",
        value: "Benzene",
      },
      {
        icon: <Wrench className="w-5 h-5 text-[#71308A]" />,
        label: "Transmission",
        labelAr: "ناقل الحركة",
        value: "Automatic",
      },
      {
        icon: <Users className="w-5 h-5 text-[#71308A]" />,
        label: "Seating Capacity",
        labelAr: "سعة المقاعد",
        value: "5",
      },
    ],
    [
      {
        icon: <Shield className="w-5 h-5 text-[#71308A]" />,
        label: "Condition",
        labelAr: "الحالة",
        value: "New",
      },
      {
        icon: <Fuel className="w-5 h-5 text-[#71308A]" />,
        label: "Fuel Consumption",
        labelAr: "استهلاك الوقود",
        value: "14.8 km/l",
      },
    ],
  ]

  const categories = [
    {
      id: "transmission",
      icon: <Wrench className="w-5 h-5" />,
      title: "Transmission",
      titleAr: "ناقل الحركة",
      details: [
        {
          label: "Transmission Type",
          labelAr: "نوع ناقل الحركة",
          value: "Automatic",
          valueAr: "اوتوماتيك",
        },
        {
          label: "Drive Type",
          labelAr: "نوع الدفع",
          value: "4-wheel drive",
          valueAr: "دفع رباعي",
        },
        {
          label: "Driving Mode",
          labelAr: "وضع القيادة",
          value: "Sport/Normal/Eco",
          valueAr: "رياضي/عادي/اقتصادي",
        },
      ],
    },
    {
      id: "engine",
      icon: <Settings className="w-5 h-5" />,
      title: "Engine Specifications",
      titleAr: "مواصفات المحرك",
      details: [
        {
          label: "Engine Type",
          labelAr: "نوع المحرك",
          value: "Benzene",
          valueAr: "بنزين",
        },
        {
          label: "Power",
          labelAr: "القوة",
          value: "251 hp",
          valueAr: "251 حصان",
        },
        {
          label: "Torque",
          labelAr: "عزم الدوران",
          value: "390 newton",
          valueAr: "390 نيوتن",
        },
      ],
    },
    {
      id: "dimensions",
      icon: <Car className="w-5 h-5" />,
      title: "Dimensions",
      titleAr: "الأبعاد",
      details: [
        {
          label: "Length",
          labelAr: "الطول",
          value: "4680 mm",
          valueAr: "4680 ملم",
        },
        {
          label: "Width",
          labelAr: "العرض",
          value: "1860 mm",
          valueAr: "1860 ملم",
        },
        {
          label: "Height",
          labelAr: "الارتفاع",
          value: "1665 mm",
          valueAr: "1665 ملم",
        },
      ],
    },
    {
      id: "exterior",
      icon: <Car className="w-5 h-5" />,
      title: "External Features",
      titleAr: "المميزات الخارجية",
      details: [
        {
          label: "Headlights",
          labelAr: "المصابيح الأمامية",
          value: "LED with DRL",
          valueAr: "LED مع إضاءة نهارية",
        },
        {
          label: "Wheels",
          labelAr: "العجلات",
          value: "19-inch Alloy",
          valueAr: "سبيكة 19 بوصة",
        },
        {
          label: "Sunroof",
          labelAr: "فتحة السقف",
          value: "Panoramic",
          valueAr: "بانورامية",
        },
      ],
    },
    {
      id: "comfort",
      icon: <Users className="w-5 h-5" />,
      title: "Comfort & Convenience",
      titleAr: "الراحة والملاءمة",
      details: [
        {
          label: "Climate Control",
          labelAr: "التحكم بالمناخ",
          value: "Dual-zone automatic",
          valueAr: "تحكم أوتوماتيكي ثنائي المنطقة",
        },
        {
          label: "Keyless Entry",
          labelAr: "دخول بدون مفتاح",
          value: "Yes",
          valueAr: "نعم",
        },
        {
          label: "Push Button Start",
          labelAr: "تشغيل بزر الضغط",
          value: "Yes",
          valueAr: "نعم",
        },
      ],
    },
    {
      id: "seats",
      icon: <Users className="w-5 h-5" />,
      title: "Seats",
      titleAr: "المقاعد",
      details: [
        {
          label: "Seating Capacity",
          labelAr: "سعة المقاعد",
          value: "5",
          valueAr: "5",
        },
        {
          label: "Front Seats",
          labelAr: "المقاعد الأمامية",
          value: "Power-adjustable",
          valueAr: "قابلة للتعديل كهربائياً",
        },
        {
          label: "Seat Material",
          labelAr: "مادة المق��عد",
          value: "Premium leather",
          valueAr: "جلد فاخر",
        },
      ],
    },
    {
      id: "audio",
      icon: <Headphones className="w-5 h-5" />,
      title: "Audio System",
      titleAr: "النظام الصوتي",
      details: [
        {
          label: "Display Size",
          labelAr: "حجم الشاشة",
          value: "10.25-inch touchscreen",
          valueAr: "شاشة لمس 10.25 بوصة",
        },
        {
          label: "Speakers",
          labelAr: "السماعات",
          value: "8 premium speakers",
          valueAr: "8 سماعات فاخرة",
        },
        {
          label: "Connectivity",
          labelAr: "الاتصال",
          value: "Bluetooth/USB/Apple CarPlay/Android Auto",
          valueAr: "بلوتوث/USB/آبل كاربلاي/أندرويد أوتو",
        },
      ],
    },
    {
      id: "safety",
      icon: <Shield className="w-5 h-5" />,
      title: "Safety",
      titleAr: "السلامة",
      details: [
        {
          label: "Airbags",
          labelAr: "الوسائد الهوائية",
          value: "6 airbags",
          valueAr: "6 وسائد هوائية",
        },
        {
          label: "ABS",
          labelAr: "نظام الفرامل المانعة للانغلاق",
          value: "With EBD and BA",
          valueAr: "مع EBD و BA",
        },
        {
          label: "Stability Control",
          labelAr: "التحكم بالثبات",
          value: "Electronic Stability Program",
          valueAr: "برنامج الثبات الإلكتروني",
        },
      ],
    },
  ]

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    setShowSpecDialog(true)
  }

  return (
    <div className="space-y-6">
      <style jsx global>
        {scrollbarStyles}
      </style>

      {/* Car Information Section */}
      <div className="bg-white rounded-[20px] border border-gray-200 overflow-hidden">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-[#71308A] mb-4">
            {isEnglish ? "Car Information" : "معلومات السيارة"}
          </h2>
          <div className="divide-y divide-gray-200">
            {overviewData.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-3 gap-4 px-4 py-3">
                {row.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 justify-start">
                    <div className="flex-shrink-0">{item.icon}</div>
                    <div className="text-left">
                      <div className="text-sm text-gray-500">{isEnglish ? item.label : item.labelAr}</div>
                      <div className="font-semibold text-[#71308A]">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Car Specifications Section */}
      <div className="bg-white rounded-[20px] border border-gray-200 overflow-hidden">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-[#71308A] mb-4">
            {isEnglish ? "Car Specifications" : "صفات السيارة"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className={`flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  selectedCategory?.id === category.id && showSpecDialog ? "bg-purple-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[#71308A]">{category.icon}</span>
                  <span className="font-medium">{isEnglish ? category.title : category.titleAr}</span>
                </div>
                {isEnglish ? (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronLeft className="w-5 h-5 text-gray-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showSpecDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-[15px] overflow-hidden max-w-2xl w-full border border-gray-200 shadow-xl">
            <div className="relative">
              {/* Close button */}
              <button
                onClick={() => setShowSpecDialog(false)}
                className="absolute top-3 right-3 z-10 p-1 rounded-full bg-white shadow-sm hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>

              <div className="flex">
                {/* Left side - Categories Menu */}
                <div className="w-1/3 border-r flex flex-col h-[70vh]">
                  <div className="p-4 bg-white border-b">
                    <h3 className="text-lg font-semibold text-[#71308A] pr-8">
                      {isEnglish ? "Car Specifications" : "صفات السيارة"}
                    </h3>
                  </div>
                  <div className="overflow-y-auto flex-1 custom-scrollbar">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onMouseEnter={() => setSelectedCategory(category)}
                        className={`w-full flex items-center gap-2 p-4 text-left hover:bg-gray-50 transition-colors ${
                          selectedCategory?.id === category.id ? "bg-purple-100" : ""
                        }`}
                      >
                        <span className="text-[#71308A]">{category.icon}</span>
                        <span className="flex-1 text-sm font-medium">
                          {isEnglish ? category.title : category.titleAr}
                        </span>
                        {isEnglish ? (
                          <ChevronRight
                            className={`w-4 h-4 text-gray-400 ${selectedCategory?.id === category.id ? "text-[#71308A]" : ""}`}
                          />
                        ) : (
                          <ChevronLeft
                            className={`w-4 h-4 text-gray-400 ${selectedCategory?.id === category.id ? "text-[#71308A]" : ""}`}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right side - Details */}
                <div className="flex-1 p-6 h-[70vh] overflow-y-auto custom-scrollbar">
                  {selectedCategory && (
                    <>
                      <h3 className="text-lg font-semibold text-[#71308A] mb-6 flex items-center gap-2">
                        {selectedCategory.icon}
                        <span>{isEnglish ? selectedCategory.title : selectedCategory.titleAr}</span>
                      </h3>
                      <div className="space-y-4">
                        {selectedCategory.details.map((detail, index) => (
                          <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                            <div className={`flex justify-between items-start ${!isEnglish ? "flex-row-reverse" : ""}`}>
                              <span className="text-gray-600 max-w-[45%]">
                                {isEnglish ? detail.label : detail.labelAr}
                              </span>
                              <span className="font-medium text-[#71308A] text-right max-w-[45%] break-words">
                                {isEnglish ? detail.value : detail.valueAr}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CarOverview

