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
        setLogo(data)
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
                  disabled={isProcessing}
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
                        disabled={isProcessing}
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
              disabled={isProcessing}
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
    <>
      {/* Page overlay during any processing (deletion, submission, or logout) */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="w-[300px] p-6 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 text-brand-primary animate-spin" />
            <p className="text-center font-medium">
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
                  <span className="font-bold text-lg text-brand-primary hidden" style={{ display: "none" }}>
                    {logo.title || "CarAdmin"}
                  </span>
                </div>
              ) : (
                <span className="font-bold text-lg text-brand-primary">{logo?.title || "CarAdmin"}</span>
              )}
            </Link>
          </SidebarHeader>

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
                  disabled={isProcessing}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border-2 border-brand-primary/20">
                      {userLoading ? (
                        <div className="h-full w-full animate-pulse bg-gray-200 rounded-full"></div>
                      ) : (
                        <>
                          <Image
                            src={user?.user_metadata?.avatar_url || "/placeholder.svg?height=40&width=40&query=user"}
                            width={40}
                            height={40}
                            objectFit="cover"
                            alt={user?.user_metadata?.name || user?.email || "User"}
                          />
                          <AvatarFallback className="bg-brand-primary/10 text-brand-primary font-medium">
                            {getUserInitials()}
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div className="flex flex-col items-start">
                      {userLoading ? (
                        <>
                          <div className="h-4 w-24 animate-pulse bg-gray-200 rounded mb-1"></div>
                          <div className="h-3 w-32 animate-pulse bg-gray-200 rounded"></div>
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
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 rounded-[5px] border border-gray-200 bg-white p-1.5 shadow-lg"
                onOpenChange={(open) => {
                  // Prevent closing the dropdown during any processing
                  if (isProcessing && !open) {
                    return false
                  }
                }}
              >
                <DropdownMenuLabel className="px-2 py-1.5 text-sm font-medium text-gray-700">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1 bg-gray-200" />
                <DropdownMenuItem
                  className="rounded-[5px] px-2 py-1.5 text-sm text-gray-700 cursor-pointer hover:bg-brand-light/50"
                  disabled={isProcessing}
                >
                  <Link href="/dashboard/profile" className="flex items-center w-full">
                    <UserCog className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-[5px] px-2 py-1.5 text-sm text-gray-700 cursor-pointer hover:bg-brand-light/50"
                  disabled={isProcessing}
                >
                  <Link href="/dashboard/settings" className="flex items-center w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 bg-gray-200" />
                <DropdownMenuItem
                  className="rounded-[5px] px-2 py-1.5 text-sm text-red-600 cursor-pointer hover:bg-red-50"
                  disabled={isProcessing}
                >
                  <button onClick={handleLogout}  className="flex items-center w-full">
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
