"use client"

import { useState, useEffect } from "react"
import { DateRange } from "react-date-range"
import { format, addDays } from "date-fns"
import { ar } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

// Add required CSS in your project
// import 'react-date-range/dist/styles.css'; // main style file
// import 'react-date-range/dist/theme/default.css'; // theme css file

export function DateRangePicker({ value, onChange, placeholder = "Select date range", className, locale = "en" }) {
  const [isOpen, setIsOpen] = useState(false)
  const [dateState, setDateState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ])

  useEffect(() => {
    if (value?.from && value?.to) {
      setDateState([
        {
          startDate: value.from,
          endDate: value.to,
          key: "selection",
        },
      ])
    }
  }, [value])

  // Presets for quick selection
  const presets = [
    {
      id: "today",
      label: locale === "en" ? "Today" : "اليوم",
      dateRange: {
        from: new Date(),
        to: new Date(),
      },
    },
    {
      id: "yesterday",
      label: locale === "en" ? "Yesterday" : "الأمس",
      dateRange: {
        from: addDays(new Date(), -1),
        to: addDays(new Date(), -1),
      },
    },
    {
      id: "last7",
      label: locale === "en" ? "Last 7 days" : "آخر 7 أيام",
      dateRange: {
        from: addDays(new Date(), -6),
        to: new Date(),
      },
    },
    {
      id: "last30",
      label: locale === "en" ? "Last 30 days" : "آخر 30 يوم",
      dateRange: {
        from: addDays(new Date(), -29),
        to: new Date(),
      },
    },
    {
      id: "thisMonth",
      label: locale === "en" ? "This month" : "هذا الشهر",
      dateRange: {
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(),
      },
    },
    {
      id: "lastMonth",
      label: locale === "en" ? "Last month" : "الشهر الماضي",
      dateRange: {
        from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        to: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
      },
    },
  ]

  // Handle preset selection
  const handlePresetChange = (presetId) => {
    const preset = presets.find((p) => p.id === presetId)
    if (preset) {
      setDateState([
        {
          startDate: preset.dateRange.from,
          endDate: preset.dateRange.to,
          key: "selection",
        },
      ])
      onChange(preset.dateRange)
    }
  }

  // Handle date range change
  const handleDateChange = (item) => {
    setDateState([item.selection])
    onChange({
      from: item.selection.startDate,
      to: item.selection.endDate,
    })
  }

  // Apply the selected date range
  const handleApply = () => {
    onChange({
      from: dateState[0].startDate,
      to: dateState[0].endDate,
    })
    setIsOpen(false)
  }

  // Format the selected date range for display
  const formatDateRange = (range) => {
    if (!range) return ""

    const { from, to } = range
    if (!from) return ""

    if (!to || from.toDateString() === to.toDateString()) {
      return format(from, "PPP", { locale: locale === "ar" ? ar : undefined })
    }

    return `${format(from, "PPP", { locale: locale === "ar" ? ar : undefined })} - ${format(to, "PPP", {
      locale: locale === "ar" ? ar : undefined,
    })}`
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? formatDateRange(value) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col sm:flex-row">
            <div className="border-b border-r p-3 sm:border-b-0">
              <Select onValueChange={handlePresetChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder={locale === "en" ? "Select preset" : "اختر فترة محددة مسبقًا"} />
                </SelectTrigger>
                <SelectContent>
                  {presets.map((preset) => (
                    <SelectItem key={preset.id} value={preset.id}>
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="p-3">
              <DateRange
                editableDateInputs={true}
                onChange={handleDateChange}
                moveRangeOnFirstSelection={false}
                ranges={dateState}
                months={2}
                direction="horizontal"
                locale={locale === "ar" ? ar : undefined}
                className={locale === "ar" ? "rtl" : ""}
              />
              <div className="mt-3 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onChange(undefined)
                    setIsOpen(false)
                  }}
                >
                  {locale === "en" ? "Clear" : "مسح"}
                </Button>
                <Button size="sm" onClick={handleApply}>
                  {locale === "en" ? "Apply" : "تطبيق"}
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
