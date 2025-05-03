"use client"

import {
  Car,
  Settings,
  LayoutDashboard,
  ChevronDown,
  Users,
  Wrench,
  Database,
  BarChart,
  Truck,
  Gauge,
  FileCode,
  Sliders,
  Tag,
  ImageIcon,
  List,
  Layers,
  FileText,
  Server,
  HardDrive,
  FileDigit,
  UserCog,
  ChevronRight,
  LogOut,
  FileImage,
  Film,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import LogoutButton from "./logoutbutton/Logout"

export function AppSidebar() {
  const pathname = usePathname()

  const [logo, setLogo] = useState(null)
  const [logoLoading, setLogoLoading] = useState(true)

  // console.log("object",logo[0])

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        setLogoLoading(true)
        const response = await fetch("/api/supabasPrisma/logo")

        if (!response.ok) {
          throw new Error("Failed to fetch logo")
        }

        const data = await response.json()
        setLogo(data)
      } catch (error) {
        console.error("Error fetching logo:", error)
      } finally {
        setLogoLoading(false)
      }
    }

    fetchLogo()
  }, [])

  // Create a single array for all menu items with nested structure
  const menuData = [
    {
      section: "Dashboard",
      items: [
        { title: "Overview", path: "/dashboard", icon: LayoutDashboard },
        { title: "Analytics", path: "/dashboard/analytics", icon: BarChart },
      ],
    },
    {
      section: "Car Management",
      items: [
        {
          title: "Car Brands",
          path: "/dashboard/brands",
          icon: Car,
          dropdownKey: "carBrands",
          subItems: [{ title: "All Brands", path: "/dashboard/brands", icon: Tag }],
        },
        {
          title: "All Cars",
          path: "/dashboard/cars",
          icon: Truck,
          dropdownKey: "allCars",
          subItems: [
            { title: "Car Listings", path: "/dashboard/cars", icon: List },
            { title: "All Cars Variations", path: "/dashboard/car-variations", icon: Layers },
          ],
        },
        {
          title: "Maintenance",
          path: "/dashboard/maintenance",
          icon: Wrench,
          dropdownKey: "maintenance",
          subItems: [
            { title: "Images Gallery", path: "/dashboard/images-gallery", icon: ImageIcon },
            { title: "Logo", path: "/dashboard/logos", icon: FileImage },
            { title: "Carousel", path: "/dashboard/car-carousel", icon: Film },
          ],
        },
        { title: "Parts & Accessories", path: "/dashboard/parts", icon: Gauge },
      ],
    },
    {
      section: "Configuration",
      items: [
        {
          title: "System Settings",
          path: "/dashboard/config",
          icon: Sliders,
          dropdownKey: "systemSettings",
          subItems: [
            { title: "General", path: "/dashboard/config/general", icon: Settings },
            { title: "Appearance", path: "/dashboard/config/appearance", icon: FileText },
            { title: "Notifications", path: "/dashboard/config/notifications", icon: FileDigit },
          ],
        },
        {
          title: "Data Management",
          path: "/dashboard/data",
          icon: Database,
          dropdownKey: "dataManagement",
          subItems: [
            { title: "Database", path: "/dashboard/config/database", icon: Server },
            { title: "Backups", path: "/dashboard/config/backups", icon: HardDrive },
            { title: "System Logs", path: "/dashboard/config/logs", icon: FileText },
          ],
        },
        { title: "API Settings", path: "/dashboard/config/api", icon: FileCode },
      ],
    },
    {
      section: "Administration",
      items: [
        { title: "Users", path: "/dashboard/users", icon: Users },
        { title: "Settings", path: "/dashboard/settings", icon: Settings },
      ],
    },
  ]

  // Initialize dropdown state based on menu data
  const initialDropdownState = {}
  menuData.forEach((section) => {
    section.items.forEach((item) => {
      if (item.dropdownKey) {
        // Check if any subitem path matches the current pathname
        const isActive = item.subItems?.some((subItem) => subItem.path === pathname)
        initialDropdownState[item.dropdownKey] = isActive // Only open if a subitem is active
      }
    })
  })

  const [openDropdowns, setOpenDropdowns] = useState(initialDropdownState)

  const isActive = (path) => {
    return pathname === path
  }

  const isChildActive = (paths) => {
    return paths.some((path) => pathname === path)
  }

  const toggleDropdown = (key) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Render menu items
  const renderMenuItems = (items) => {
    return items.map((item) => {
      // If item has subitems, render as dropdown
      if (item.subItems && item.dropdownKey) {
        const isDropdownOpen = openDropdowns[item.dropdownKey]
        const subPaths = item.subItems.map((subItem) => subItem.path)
        const isAnyChildActive = isChildActive(subPaths)

        return (
          <Collapsible key={item.path} open={isDropdownOpen} onOpenChange={() => toggleDropdown(item.dropdownKey)}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={isAnyChildActive}
                  className={`py-3 rounded-[5px] ${
                    isAnyChildActive
                      ? "bg-brand-light border-l-4 border-brand-primary"
                      : "bg-white hover:bg-brand-light/50"
                  } shadow-sm transition-all duration-200`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-5 w-5 ${isAnyChildActive ? "text-brand-primary" : "text-gray-600"}`} />
                    <span
                      className={`text-sm font-medium ${isAnyChildActive ? "text-brand-primary" : "text-gray-700"}`}
                    >
                      {item.title}
                    </span>
                  </div>
                  <ChevronDown
                    className={`ml-auto h-4 w-4 text-gray-500 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 pl-2">
                <SidebarMenuSub className="w-full">
                  {item.subItems.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.path} className="mt-1 w-full">
                      <SidebarMenuSubButton
                        asChild
                        isActive={isActive(subItem.path)}
                        className={`py-2.5 px-3 w-full rounded-[5px] ${
                          isActive(subItem.path) ? "bg-brand-primary/10 text-brand-primary" : "hover:bg-brand-light/70"
                        } transition-colors duration-200`}
                      >
                        <Link href={subItem.path} className="flex items-center gap-3 w-full">
                          <subItem.icon
                            className={`h-4 w-4 ${isActive(subItem.path) ? "text-brand-primary" : "text-gray-500"}`}
                          />
                          <span className={`text-sm ${isActive(subItem.path) ? "font-medium" : "font-normal"}`}>
                            {subItem.title}
                          </span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        )
      }
      // Otherwise render as regular menu item
      else {
        return (
          <SidebarMenuItem key={item.path}>
            <SidebarMenuButton
              asChild
              isActive={isActive(item.path)}
              className={`py-3 rounded-[5px] ${
                isActive(item.path)
                  ? "bg-brand-light border-l-4 border-brand-primary"
                  : "bg-white hover:bg-brand-light/50"
              } shadow-sm transition-all duration-200`}
            >
              <Link href={item.path} className="flex items-center gap-3">
                <item.icon className={`h-5 w-5 ${isActive(item.path) ? "text-brand-primary" : "text-gray-600"}`} />
                <span className={`text-sm font-medium ${isActive(item.path) ? "text-brand-primary" : "text-gray-700"}`}>
                  {item.title}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      }
    })
  }

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="flex items-center justify-between p-4 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2">
          {logoLoading ? (
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
          ) : logo[0]?.imageUrl ? (
            <div className="h-8 max-w-[140px]">
              <img
                src={logo[0]?.imageUrl || "/placeholder.svg"}
                alt={logo[0]?.title || "Company Logo"}
                className="h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.style.display = "none"
                  e.target.nextSibling.style.display = "block"
                }}
              />

            </div>
          ) : (
            <span className="font-bold text-lg text-brand-primary">{logo?.title || "CarAdmin"}</span>
          )}
        </Link>
      </SidebarHeader>
          {/* {logo[0]?.imageUrl || "/placeholder.svg"} */}

      <SidebarContent className="px-3 py-4">
        {menuData.map((section, index) => (
          <div key={section.section} className={index > 0 ? "mt-6" : ""}>
            {index > 0 && <SidebarSeparator className="mb-4 bg-gray-200" />}

            <SidebarGroup>
              <SidebarGroupLabel className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                {section.section}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1 mt-2">{renderMenuItems(section.items)}</SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between rounded-[5px] bg-brand-light/50 px-3 py-2.5 hover:bg-brand-light transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border-2 border-brand-primary/20">
                  <AvatarImage src="/abstract-geometric-shapes.png" alt="User" />
                  <AvatarFallback className="bg-brand-primary/10 text-brand-primary font-medium">AU</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-800">Admin User</span>
                  <span className="text-xs text-gray-500">admin@example.com</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 rounded-[5px] border border-gray-200 bg-white p-1.5 shadow-lg"
          >
            <DropdownMenuLabel className="px-2 py-1.5 text-sm font-medium text-gray-700">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1 bg-gray-200" />
            <DropdownMenuItem className="rounded-[5px] px-2 py-1.5 text-sm text-gray-700 cursor-pointer hover:bg-brand-light/50">
              <UserCog className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-[5px] px-2 py-1.5 text-sm text-gray-700 cursor-pointer hover:bg-brand-light/50">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 bg-gray-200" />
            <DropdownMenuItem className="rounded-[5px] px-2 py-1.5 text-sm text-red-600 cursor-pointer hover:bg-red-50">
              <LogOut className="mr-2 h-4 w-4" />
              <LogoutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
