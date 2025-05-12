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
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect, createContext, useContext } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Card } from "@/components/ui/card"
import Image from "next/image"

// Create a context for the app state
export const AppStateContext = createContext({
  isDeleting: false,
  setIsDeleting: () => {},
  isSubmitting: false,
  setIsSubmitting: () => {},
  isLoggingOut: false,
  setIsLoggingOut: () => {},
})

// Custom hook to use the app state
export const useAppState = () => useContext(AppStateContext)

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [logo, setLogo] = useState(null)
  const [logoLoading, setLogoLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [userLoading, setUserLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // App state for deletion and submission processes
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Determine if any process is active that should disable the page
  const isProcessing = isDeleting || isSubmitting || isLoggingOut

  // Fetch current user using the /api/currentUser endpoint
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setUserLoading(true)
        const response = await fetch("/api/currentUser")

        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }

        const data = await response.json()
        setUser(data.user)
      } catch (error) {
        console.error("Error fetching user:", error)
        setUser(null)
      } finally {
        setUserLoading(false)
      }
    }

    fetchUser()
  }, [])

  // Handle logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)

      // Use Supabase's built-in signOut function
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      // Redirect to login page after successful logout
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
      setIsLoggingOut(false) // Only set to false on error, successful logout will navigate away
    }
  }

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        setLogoLoading(true)
        const response = await fetch("/api/supabasPrisma/logo")

        if (!response.ok) {
          throw new Error("Failed to fetch logo")
        }

        const data = await response.json()
        setLogo(data[0])
      } catch (error) {
        console.error("Error fetching logo:", error)
      } finally {
        setLogoLoading(false)
      }
    }

    fetchLogo()
  }, [])

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "AU"

    if (user.user_metadata?.name) {
      return user.user_metadata.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    }

    return user.email ? user.email[0].toUpperCase() : "AU"
  }

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
        {
          title: "Parts & Accessories",
          path: "/dashboard/parts",
          icon: Gauge,
          dropdownKey: "partsAccessories",
          subItems: [
            { title: "Fuel Types", path: "/dashboard/types/fueltypes", icon: Truck },
            { title: "Transmission Types", path: "/dashboard/types/transmission-types", icon: Sliders },
            { title: "Condition Types", path: "/dashboard/types/condition-types", icon: Tag },
            { title: "Wheel Drive Types", path: "/dashboard/types/wheel-drive-types", icon: Settings },
            { title: "Body Types", path: "/dashboard/types/body-types", icon: Car },
            { title: "Safety Ratings", path: "/dashboard/types/safety-ratings", icon: FileText },
          ],
        },
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
            <SidebarMenuItem className="perspective-1000">
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={isAnyChildActive}
                  className={`py-3 rounded-[5px] ${
                    isAnyChildActive
                      ? "bg-[#F3E5F5] border-l-4 border-[#46194F] shadow-[0_5px_15px_-3px_rgba(70,25,79,0.3)]"
                      : "bg-white  hover:bg-[#F3E5F5]/50 hover:shadow-[0_5px_15px_-5px_rgba(70,25,79,0.2)]"
                  } shadow-sm transition-all duration-300 transform hover:translate-y-[-2px]`}
                  disabled={isProcessing}
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-full ${isAnyChildActive ? "bg-[#46194F]/10" : ""}`}>
                      <item.icon className={`h-4 w-4 ${isAnyChildActive ? "text-[#46194F]" : "text-gray-600"}`} />
                    </div>
                    <span className={`flex text-sm font-medium ${isAnyChildActive ? "text-[#46194F]" : "text-gray-700"}`}>
                      {item.title}
                    </span>
                  </div>
                  <ChevronDown
                    className={`ml-auto h-4 w-4 text-gray-500 transition-transform duration-300 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 pl-2 overflow-hidden transition-all duration-300">
                <SidebarMenuSub className="w-full">
                  {item.subItems.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.path} className="mt-1 w-full perspective-800">
                      <SidebarMenuSubButton
                        asChild
                        isActive={isActive(subItem.path)}
                        className={`py-2.5 px-3 w-full rounded-[5px] ${
                          isActive(subItem.path)
                            ? "bg-[#46194F]/10 text-[#46194F] shadow-[0_4px_10px_-3px_rgba(70,25,79,0.25)]"
                            : "hover:bg-[#F3E5F5]/70 hover:shadow-[0_4px_10px_-5px_rgba(70,25,79,0.15)]"
                        } transition-all duration-300 transform hover:translate-x-1`}
                        disabled={isProcessing}
                      >
                        <Link href={subItem.path} className="flex items-center gap-3 w-full">
                          <div className={`p-1 rounded-full ${isActive(subItem.path) ? "bg-[#46194F]/5" : ""}`}>
                            <subItem.icon
                              className={`h-4 w-4 ${isActive(subItem.path) ? "text-[#46194F]" : "text-gray-500"}`}
                            />
                          </div>
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
          <SidebarMenuItem key={item.path} className="perspective-1000">
            <SidebarMenuButton
              asChild
              isActive={isActive(item.path)}
              className={`py-3 rounded-[5px] ${
                isActive(item.path)
                  ? "bg-[#F3E5F5] border-l-4 border-[#46194F] shadow-[0_5px_15px_-3px_rgba(70,25,79,0.3)]"
                  : "bg-white hover:bg-[#F3E5F5]/50 hover:shadow-[0_5px_15px_-5px_rgba(70,25,79,0.2)]"
              } shadow-sm transition-all duration-300 transform hover:translate-y-[-2px]`}
              disabled={isProcessing}
            >
              <Link href={item.path} className="flex items-center gap-3">
                <div className={`p-1.5 rounded-full ${isActive(item.path) ? "bg-[#46194F]/10" : ""}`}>
                  <item.icon className={`h-5 w-5 ${isActive(item.path) ? "text-[#46194F]" : "text-gray-600"}`} />
                </div>
                <span className={`text-sm font-medium ${isActive(item.path) ? "text-[#46194F]" : "text-gray-700"}`}>
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
    <>
      {/* Page overlay during any processing (deletion, submission, or logout) */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="w-[300px] p-6 flex flex-col items-center justify-center space-y-4 rounded-[10px] shadow-[0_20px_60px_-15px_rgba(70,25,79,0.6)] border border-[#46194F]/20 bg-white/95">
            <div className="p-3 bg-[#F3E5F5] rounded-full shadow-[0_10px_30px_-10px_rgba(70,25,79,0.5)]">
              <Loader2 className="h-8 w-8 text-[#46194F] animate-spin" />
            </div>
            <p className="text-center font-medium text-[#46194F]">
              {isLoggingOut
                ? "Logging out... Please wait"
                : isDeleting
                  ? "Deleting... Please wait"
                  : "Processing... Please wait"}
            </p>
          </Card>
        </div>
      )}

      <AppStateContext.Provider
        value={{ isDeleting, setIsDeleting, isSubmitting, setIsSubmitting, isLoggingOut, setIsLoggingOut }}
      >
        <Sidebar className="border-r  border-[#46194F]/10 bg-white shadow-[5px_0_30px_-15px_rgba(70,25,79,0.2)] perspective-1000">
          <SidebarHeader className="pl-8 border-b border-[#46194F]/10 bg-gradient-to-b from-white to-[#F3E5F5]/30">
            <Link
              href="/dashboard"
              className="flex items-center transform transition-transform duration-300 hover:scale-105"
            >
              {logoLoading ? (
                <div className="h-6 w-32 animate-pulse rounded bg-[#46194F]/10"></div>
              ) : logo?.imageUrl ? (
                <div className="h-8 max-w-[140px] relative">
                  <div className="absolute inset-0 bg-[#46194F]/5 filter blur-md rounded-full opacity-50"></div>
                  <img
                    src={logo?.imageUrl || "/placeholder.svg"}
                    alt={logo?.title || "Company Logo"}
                    className="h-full object-contain relative z-10"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.style.display = "none"
                      e.target.nextSibling.style.display = "block"
                    }}
                  />
                  <span
                    className="font-bold text-lg bg-gradient-to-r from-[#46194F] to-[#7B1FA2] bg-clip-text text-transparent hidden"
                    style={{ display: "none" }}
                  >
                    {logo?.title || "CarAdmin"}
                  </span>
                </div>
              ) : (
                <span className="font-bold text-lg bg-gradient-to-r from-[#46194F] to-[#7B1FA2] bg-clip-text text-transparent">
                  {logo?.title || "CarAdmin"}
                </span>
              )}
            </Link>
          </SidebarHeader>

          <SidebarContent className="bg-white px-3 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-[#46194F]/20 scrollbar-track-transparent">
            {menuData.map((section, index) => (
              <div key={section.section} className={index > 0 ? "mt-6" : ""}>
                {index > 0 && <SidebarSeparator className="mb-4 bg-[#46194F]/10" />}

                <SidebarGroup>
                  <SidebarGroupLabel className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#46194F]/70">
                    {section.section}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-1 mt-2">{renderMenuItems(section.items)}</SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </div>
            ))}
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-[#46194F]/10 bg-gradient-to-t from-white to-[#F3E5F5]/30">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-between rounded-[5px] bg-[#F3E5F5]/50 px-3 py-2.5 hover:bg-[#F3E5F5] transition-all duration-300 shadow-[0_5px_15px_-5px_rgba(70,25,79,0.2)] hover:shadow-[0_8px_20px_-5px_rgba(70,25,79,0.3)] transform hover:translate-y-[-2px]"
                  disabled={isProcessing}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border-2 border-[#46194F]/20 shadow-[0_5px_15px_-5px_rgba(70,25,79,0.3)]">
                      {userLoading ? (
                        <div className="h-full w-full animate-pulse bg-[#46194F]/10 rounded-full"></div>
                      ) : (
                        <>
                          <Image
                            src={user?.user_metadata?.avatar_url || "/placeholder.svg?height=40&width=40&query=user"}
                            width={40}
                            height={40}
                            objectFit="cover"
                            alt={user?.user_metadata?.name || user?.email || "User"}
                          />
                          <AvatarFallback className="bg-[#46194F]/10 text-[#46194F] font-medium">
                            {getUserInitials()}
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div className="flex flex-col items-start">
                      {userLoading ? (
                        <>
                          <div className="h-4 w-24 animate-pulse bg-[#46194F]/10 rounded mb-1"></div>
                          <div className="h-3 w-32 animate-pulse bg-[#46194F]/10 rounded"></div>
                        </>
                      ) : (
                        <>
                          <span className="text-sm font-medium text-gray-800">
                            {user?.user_metadata?.name || "User"}
                          </span>
                          <span className="text-xs text-gray-500 truncate max-w-[120px]">
                            {user?.email || "No email"}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#46194F]/70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 rounded-[10px] border border-[#46194F]/10 bg-white p-1.5 shadow-[0_20px_50px_-15px_rgba(70,25,79,0.4)] backdrop-blur-sm bg-white/95"
                onOpenChange={(open) => {
                  // Prevent closing the dropdown during any processing
                  if (isProcessing && !open) {
                    return false
                  }
                }}
              >
                <DropdownMenuLabel className="px-2 py-1.5 text-sm font-medium text-[#46194F]">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1 bg-[#46194F]/10" />
                <DropdownMenuItem
                  className="rounded-[5px] px-2 py-1.5 text-sm text-gray-700 cursor-pointer hover:bg-[#F3E5F5] transition-all duration-200 transform hover:translate-x-1"
                  disabled={isProcessing}
                >
                  <Link href="/dashboard/profile" className="flex items-center w-full">
                    <UserCog className="mr-2 h-4 w-4 text-[#46194F]" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-[5px] px-2 py-1.5 text-sm text-gray-700 cursor-pointer hover:bg-[#F3E5F5] transition-all duration-200 transform hover:translate-x-1"
                  disabled={isProcessing}
                >
                  <Link href="/dashboard/settings" className="flex items-center w-full">
                    <Settings className="mr-2 h-4 w-4 text-[#46194F]" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 bg-[#46194F]/10" />
                <DropdownMenuItem
                  className="rounded-[5px] px-2 py-1.5 text-sm text-red-600 cursor-pointer hover:bg-red-50 transition-all duration-200 transform hover:translate-x-1"
                  disabled={isProcessing}
                >
                  <button onClick={handleLogout} className="flex items-center w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
      </AppStateContext.Provider>
    </>
  )
}
