"use client"
import { usePathname } from "next/navigation"

const LoadingUi = () => {
  const pathname = usePathname()
  const currentLocale = pathname?.startsWith("/ar") ? "ar" : "en"

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-primary mb-4"></div>
      <p className="text-brand-primary font-medium">{currentLocale === "ar" ? "جاري التحميل..." : "Loading..."}</p>
    </div>
  )
}

export default LoadingUi

