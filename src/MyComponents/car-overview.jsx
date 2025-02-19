"use client"

import { Card } from "@/components/ui/card"
import { usePathname } from "next/navigation"

const CarOverview = ({ carDetails }) => {
  console.log("first log",carDetails)
  const pathname = usePathname()
  const isEnglish = pathname.startsWith("/en")

  if (!carDetails) return null

  const overviewData = [
    {
      label: isEnglish ? "Make Year" : "سنة الصنع",
      value: carDetails?.year_of_manufacture || "-",
    },
    {
      label: isEnglish ? "Registration Year" : "سنة التسجيل",
      value: carDetails?.year_of_manufacture || "-",
    },
    {
      label: isEnglish ? "Fuel Type" : "نوع الوقود",
      value: isEnglish
        ? carDetails?.vehicle_fuel_type?.fuel_type?.en
        : carDetails?.vehicle_fuel_type?.fuel_type?.ar,
    },
    {
      label: isEnglish ? "Seating Capacity" : "عدد المقاعد",
      value: carDetails?.seating_capacity || "-",
    },
    {
      label: isEnglish ? "Transmission" : "ناقل الحركة",
      value: isEnglish ? carDetails?.name?.en?.transmission : carDetails?.name?.ar?.transmission,
    },
    {
      label: isEnglish ? "Condition" : "الحالة",
      value: isEnglish ? carDetails?.name?.en?.condition : carDetails?.name?.ar?.condition,
    },
  ]

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">{isEnglish ? "Car Overview" : "نظرة عامة على السيارة"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {overviewData.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="text-sm text-gray-500">{item.label}</div>
            <div className="font-semibold text-purple-800">{item.value}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default CarOverview

