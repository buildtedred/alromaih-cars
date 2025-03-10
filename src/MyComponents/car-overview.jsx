"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import {
  Calendar,
  GaugeCircle,
  Car,
  Fuel,
  Users,
  Shield,
  ChevronRight,
  Settings,
  Wrench,
  Gauge,
  Headphones,
} from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

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
`

const CarOverview = ({ carDetails }) => {
  const pathname = usePathname()
  const isEnglish = pathname.startsWith("/en")
  const [view, setView] = useState("overview")
  const [showSpecDialog, setShowSpecDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  const overviewData = [
    [
      {
        icon: <Calendar className="w-5 h-5 text-[#71308A]" />,
        label: "Manufacturing Year",
        value: "2025",
      },
      {
        icon: <GaugeCircle className="w-5 h-5 text-[#71308A]" />,
        label: "Torque",
        value: "390 newton",
      },
      {
        icon: <Gauge className="w-5 h-5 text-[#71308A]" />,
        label: "Power",
        value: "251 hp",
      },
    ],
    [
      {
        icon: <Fuel className="w-5 h-5 text-[#71308A]" />,
        label: "Fuel Tank Capacity",
        value: "60 liters",
      },
      {
        icon: <Car className="w-5 h-5 text-[#71308A]" />,
        label: "Manufactured",
        value: "Jetour",
      },
      {
        icon: <Gauge className="w-5 h-5 text-[#71308A]" />,
        label: "Power",
        value: "251 hp",
      },
    ],
    [
      {
        icon: <Settings className="w-5 h-5 text-[#71308A]" />,
        label: "Engine Type",
        value: "Benzene",
      },
      {
        icon: <Wrench className="w-5 h-5 text-[#71308A]" />,
        label: "Transmission",
        value: "Automatic",
      },
      {
        icon: <Users className="w-5 h-5 text-[#71308A]" />,
        label: "Seating Capacity",
        value: "5",
      },
    ],
    [
      {
        icon: <Shield className="w-5 h-5 text-[#71308A]" />,
        label: "Condition",
        value: "New",
      },
      {
        icon: <Fuel className="w-5 h-5 text-[#71308A]" />,
        label: "Fuel Consumption",
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
          labelAr: "اوتوماتيك",
          value: "Automatic",
        },
        {
          label: "Drive Type",
          labelAr: "دفع رباعي",
          value: "4-wheel drive",
        },
        {
          label: "Driving Mode",
          labelAr: "وضع القيادة",
          value: "Sport/Normal/Eco",
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
        },
        {
          label: "Power",
          labelAr: "القوة",
          value: "251 hp",
        },
        {
          label: "Torque",
          labelAr: "العزم",
          value: "390 newton",
        },
      ],
    },
    {
      id: "dimensions",
      icon: <Car className="w-5 h-5" />,
      title: "Dimensions",
      titleAr: "الهيكل / القياسات",
      details: [
        {
          label: "Length",
          labelAr: "الطول",
          value: "4680 mm",
        },
        {
          label: "Width",
          labelAr: "العرض",
          value: "1860 mm",
        },
        {
          label: "Height",
          labelAr: "الارتفاع",
          value: "1665 mm",
        },
      ],
    },
    {
      id: "exterior",
      icon: <Car className="w-5 h-5" />,
      title: "External Features",
      titleAr: "التجهيزات الخارجية",
      details: [
        {
          label: "Headlights",
          labelAr: "المصابيح الأمامية",
          value: "LED with DRL",
        },
        {
          label: "Wheels",
          labelAr: "العجلات",
          value: "19-inch Alloy",
        },
        {
          label: "Sunroof",
          labelAr: "فتحة السقف",
          value: "Panoramic",
        },
      ],
    },
    {
      id: "comfort",
      icon: <Users className="w-5 h-5" />,
      title: "Comfort & Convenience",
      titleAr: "السهولة والراحة",
      details: [
        {
          label: "Climate Control",
          labelAr: "التحكم بالمناخ",
          value: "Dual-zone automatic",
        },
        {
          label: "Keyless Entry",
          labelAr: "دخول بدون مفتاح",
          value: "Yes",
        },
        {
          label: "Push Button Start",
          labelAr: "تشغيل بزر الضغط",
          value: "Yes",
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
        },
        {
          label: "Front Seats",
          labelAr: "المقاعد الأمامية",
          value: "Power-adjustable",
        },
        {
          label: "Seat Material",
          labelAr: "مادة المقاعد",
          value: "Premium leather",
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
        },
        {
          label: "Speakers",
          labelAr: "السماعات",
          value: "8 premium speakers",
        },
        {
          label: "Connectivity",
          labelAr: "الاتصال",
          value: "Bluetooth/USB/Apple CarPlay/Android Auto",
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
        },
        {
          label: "ABS",
          labelAr: "نظام الفرامل المانعة للانغلاق",
          value: "With EBD and BA",
        },
        {
          label: "Stability Control",
          labelAr: "التحكم بالثبات",
          value: "Electronic Stability Program",
        },
      ],
    },
  ]

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    setShowSpecDialog(true)
  }

  const renderOverview = () => (
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
                    <div className="text-sm text-gray-500">{item.label}</div>
                    <div className="font-semibold text-[#71308A]">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderCategories = () => (
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
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <style jsx>{scrollbarStyles}</style>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setView("overview")}
          className={`p-2 rounded-md ${
            view === "overview" ? "bg-[#71308A] text-white" : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <Users className="w-5 h-5" />
        </button>
        <button
          onClick={() => setView("categories")}
          className={`p-2 rounded-md ${
            view === "categories" ? "bg-[#71308A] text-white" : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <Car className="w-5 h-5" />
        </button>
      </div>
      {view === "overview" ? renderOverview() : renderCategories()}

      <Dialog open={showSpecDialog} onOpenChange={setShowSpecDialog}>
        <DialogContent className="max-w-2xl rounded-[20px] p-0 overflow-hidden">
          <div className="flex">
            {/* Left side - Categories Menu */}
            <div className="w-1/3 border-r flex flex-col h-[70vh]">
              <div className="p-4 bg-white border-b">
                <h3 className="text-lg font-semibold text-[#71308A]">
                  {isEnglish ? "Car Specifications" : "صفات السيارة"}
                </h3>
              </div>
              <div className="overflow-y-auto flex-1 custom-scrollbar">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full flex items-center gap-2 p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedCategory?.id === category.id ? "bg-purple-100" : ""
                    }`}
                  >
                    <span className="text-[#71308A]">{category.icon}</span>
                    <span className="flex-1 text-sm font-medium">{isEnglish ? category.title : category.titleAr}</span>
                    <ChevronRight
                      className={`w-4 h-4 text-gray-400 ${selectedCategory?.id === category.id ? "text-[#71308A]" : ""}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right side - Details */}
            <div className="flex-1 p-6 h-[70vh] overflow-y-auto custom-scrollbar">
              <h3 className="text-lg font-semibold text-[#71308A] mb-6 flex items-center gap-2">
                {selectedCategory?.icon}
                <span>{isEnglish ? selectedCategory?.title : selectedCategory?.titleAr}</span>
              </h3>
              <div className="space-y-4">
                {selectedCategory?.details.map((detail, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{isEnglish ? detail.label : detail.labelAr}</span>
                      <span className="font-medium text-[#71308A]">{detail.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CarOverview

