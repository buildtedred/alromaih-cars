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
  HelpCircle,
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
  BookOpen,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

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
          subItems: [{ title: "Images Gallery", path: "/dashboard/images-gallery", icon: ImageIcon }],
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
        initialDropdownState[item.dropdownKey] = true // Set all dropdowns open by default
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
                  className="py-[20px] rounded-[5px] bg-white   shadow-sm  hover:bg-white "
                >
                  <div
                    className={` flexitems-center justify-center rounded-[5px] ${
                      isAnyChildActive ? "bg-brand-primary" : "bg-white shadow-sm"
                    }`}
                  >
                    <item.icon className={`p-1 ${isAnyChildActive ? "text-white" : "text-gray-600"}`} />
                  </div>
                  <span className="text-sm  font-medium text-gray-700">{item.title}</span>
                  <ChevronDown
                    className={`ml-auto text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2  ">
                <SidebarMenuSub>
                  {item.subItems.map((subItem, index) => (
                    <SidebarMenuSubItem key={subItem.path} className={index > 0 ? "mt-2" : ""}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isActive(subItem.path)}
                        className="py-[20px] rounded-[5px] bg-white  shadow-sm flex items-center hover:bg-white/80 "
                      >
                        <Link href={subItem.path} className="flex items-center gap-4">
                          <div
                            className={`flex items-center justify-center rounded-[5px] ${
                              isActive(subItem.path) ? "bg-brand-primary" : "bg-white shadow-sm"
                            }`}
                          >
                            <subItem.icon
                              className={`p-1 ${isActive(subItem.path) ? "text-white" : "text-gray-600"}`}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{subItem.title}</span>
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
              className="py-[20px] rounded-[5px] bg-white shadow-sm hover:bg-white/80"
            >
              <Link href={item.path} className="flex items-center gap-4">
                <div
                  className={`flex  items-center justify-center rounded-[5px] ${
                    isActive(item.path) ? "bg-brand-primary" : "bg-white shadow-sm"
                  }`}
                >
                  <item.icon className={`p-1 ${isActive(item.path) ? "text-white" : "text-gray-600"}`} />
                </div>
                <span className="text-sm font-medium text-gray-700">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      }
    })
  }

  return (
    <Sidebar className="border-r-0 bg-brand-light">
      <SidebarHeader className="flex items-center justify-between p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Car className="h-6 w-6 text-brand-primary" />
          <span className="font-bold text-lg text-brand-primary">CarAdmin</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4">
        {menuData.map((section, index) => (
          <div key={section.section}>
            {index > 0 && <SidebarSeparator className="my-4 bg-brand-dark/30" />}

            <SidebarGroup>
              <SidebarGroupLabel className=" px-2 text-xs font-medium text-brand-primary/70">
                {section.section}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className=" space-y-2 mt-2">{renderMenuItems(section.items)}</SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between rounded-[10px] bg-white px-4 py-3 shadow-sm hover:bg-white/80"
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">Admin User</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl border-none bg-white p-2 shadow-lg">
            <DropdownMenuLabel className="px-2 py-1.5 text-sm font-medium text-gray-700">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1 bg-gray-200" />
            <DropdownMenuItem className="rounded-lg px-2 py-1.5 text-sm text-gray-700">
              <UserCog className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg px-2 py-1.5 text-sm text-gray-700">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 bg-gray-200" />
            <DropdownMenuItem className="rounded-lg px-2 py-1.5 text-sm text-gray-700">
              <LogoutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
