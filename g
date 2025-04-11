className={`absolute top-3 ${isArabic ? "left-3" : "right-3"} z-50 w-7 h-7 flex items-center justify-center rounded-full transition-all duration-300 border border-brand-primary/20 hover:bg-brand-light`}



  const pathname = usePathname()
  const isArabic = pathname?.startsWith("/ar")

  import { usePathname } from "next/navigation"