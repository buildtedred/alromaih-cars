"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"

export function Breadcrumb({ items = [], className = "" }) {
  const pathname = usePathname()
  const isRTL = pathname.startsWith("/ar")
  const isEnglish = !isRTL
  const currentLocale = isEnglish ? "en" : "ar"

  // Always include Home as the first item if not already present
  const breadcrumbItems = [...items]
  if (breadcrumbItems.length === 0 || breadcrumbItems[0]?.label !== (isEnglish ? "Home" : "الرئيسية")) {
    breadcrumbItems.unshift({
      label: isEnglish ? "Home" : "الرئيسية",
      href: `/${currentLocale}`,
    })
  }

  // Filter out any items with empty or N/A labels
  const validItems = breadcrumbItems.filter((item) => {
    const label = item.label || ""
    return label && label !== "N/A" && label !== "undefined"
  })

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className={`inline-flex items-center ${isRTL ? "space-x-reverse space-x-1" : "space-x-1"} md:space-x-2`}>
        {validItems.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && <ChevronRight className={`mx-1 h-4 w-4 text-gray-400 ${isRTL ? "rotate-180" : ""}`} />}
            {item.href ? (
              <Link
                href={item.href}
                className="inline-flex items-center text-sm font-medium text-brand-primary hover:text-brand-primary/80"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-sm font-medium text-gray-500">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
