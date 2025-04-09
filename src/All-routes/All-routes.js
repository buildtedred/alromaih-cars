import { Home, Car, Info, Phone, Users, SplitSquareHorizontal } from "lucide-react"

const navigationRoutes = (t) => [
  { key: "home", label: t("home"), href: "/", icon: Home },
  { key: "allCars", label: t("allCars"), href: "/all-cars", icon: Car },
  { key: "brands", label: t("brands"), href: "/brands", icon: Users },
  { key: "compare", label: t("compare"), href: "/compare-cars", icon: SplitSquareHorizontal },
  { key: "about", label: t("about"), href: "/about-us", icon: Info },
  { key: "contact", label: t("contact"), href: "/contact-us", icon: Phone },
] 

export default navigationRoutes



