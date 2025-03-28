"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FuelIcon as Engine, GaugeCircle, Car, Paintbrush, Sofa, Users, Radio, Shield } from "lucide-react"

export function SpecificationModal({ isOpen, onClose, category, data, isEnglish }) {
  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case "engine":
        return <Engine className="w-5 h-5" />
      case "transmission":
        return <GaugeCircle className="w-5 h-5" />
      case "dimensions":
        return <Car className="w-5 h-5" />
      case "exterior":
        return <Paintbrush className="w-5 h-5" />
      case "comfort":
        return <Sofa className="w-5 h-5" />
      case "seats":
        return <Users className="w-5 h-5" />
      case "audio":
        return <Radio className="w-5 h-5" />
      case "safety":
        return <Shield className="w-5 h-5" />
      default:
        return <Car className="w-5 h-5" />
    }
  }

  const getCategoryTitle = (category) => {
    if (isEnglish) {
      switch (category.toLowerCase()) {
        case "engine":
          return "Engine Specifications"
        case "transmission":
          return "Transmission"
        case "dimensions":
          return "Dimensions / Measurements"
        case "exterior":
          return "External Features"
        case "comfort":
          return "Comfort & Convenience"
        case "seats":
          return "Seats"
        case "audio":
          return "Audio & Communication"
        case "safety":
          return "Safety"
        default:
          return category
      }
    } else {
      switch (category.toLowerCase()) {
        case "engine":
          return "مواصفات المحرك"
        case "transmission":
          return "ناقل الحركة"
        case "dimensions":
          return "الهيكل / القياسات"
        case "exterior":
          return "التجهيزات الخارجية"
        case "comfort":
          return "السهولة والراحة"
        case "seats":
          return "المقاعد"
        case "audio":
          return "النظام الصوتي والاتصال"
        case "safety":
          return "السلامة"
        default:
          return category
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#71308A]">
            {getCategoryIcon(category)}
            <span>{getCategoryTitle(category)}</span>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 p-4">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0">
                <span className="text-gray-600">{key}</span>
                <span className="font-medium text-[#71308A]">{value}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

