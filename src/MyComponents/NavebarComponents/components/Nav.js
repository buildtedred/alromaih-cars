"use client"

import Link from "next/link"
import { useTranslation } from "react-i18next"
import { Home, Car, Tag, Building2, Users, Phone } from "lucide-react"

const Nav = ({ isMobile }) => {
  const { t } = useTranslation()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/all-cars", label: "All Cars", icon: Car },
    { href: "/brands", label: "Brands", icon: Tag },
    { href: "/offers", label: "Offers", icon: Tag },
    { href: "/companies", label: "Companies", icon: Building2 },
    { href: "/about-us", label: "About Us", icon: Users },
    { href: "/contact-us", label: "Contact", icon: Phone },
  ]

  return (
    <nav className={`bg-white border-t ${isMobile ? "block md:hidden" : "hidden md:block"}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-center md:h-12">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-8 rtl:space-x-reverse">
            {navItems.map((item) => (
              <Link
                href={item.href}
                key={item.href}
                className="flex items-center text-gray-700 hover:text-brand-primary font-medium transition-colors py-3 md:py-0 border-b md:border-b-0 border-gray-100 last:border-b-0"
              >
                <item.icon className="w-5 h-5 mr-2" />
                {t(item.label)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Nav

