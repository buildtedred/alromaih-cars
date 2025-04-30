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
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

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

  const isActive = (path) => {
    return pathname === path
  }

  const isChildActive = (paths) => {
    return paths.some((path) => pathname === path)
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Car className="h-6 w-6" />
          <span className="font-bold text-lg">CarAdmin</span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/analytics")}>
                  <Link href="/dashboard/analytics">
                    <BarChart className="h-4 w-4" />
                    <span>Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Car Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isChildActive([
                        "/dashboard/brands",
                        "/dashboard/brands/new",
                        "/dashboard/brands/popular",
                      ])}
                    >
                      <Car className="h-4 w-4" />
                      <span>Car Brands</span>
                      <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/dashboard/brands")}>
                          <Link href="/dashboard/brands">All Brands</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        {/* <SidebarMenuSubButton asChild isActive={isActive("/dashboard/brands/new")}>
                          <Link href="/dashboard/brands/new">Add New Brand</Link>
                        </SidebarMenuSubButton> */}
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        {/* <SidebarMenuSubButton asChild isActive={isActive("/dashboard/brands/popular")}>
                          <Link href="/dashboard/brands/popular">Popular Brands</Link>
                        </SidebarMenuSubButton> */}
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isChildActive([
                        "/dashboard/cars",
                        "/dashboard/car-variations",
                        // "/dashboard/cars/featured",
                        // "/dashboard/cars/inventory",
                      ])}
                    >
                      <Truck className="h-4 w-4" />
                      <span>All Cars</span>
                      <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/dashboard/cars")}>
                          <Link href="/dashboard/cars">Car Listings</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/dashboard/car-variations")}>
                          <Link href="/dashboard/car-variations">All Cars Variations</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        {/* <SidebarMenuSubButton asChild isActive={isActive("/dashboard/cars/featured")}>
                          <Link href="/dashboard/cars/featured">Featured Cars</Link>
                        </SidebarMenuSubButton> */}
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        {/* <SidebarMenuSubButton asChild isActive={isActive("/dashboard/cars/inventory")}>
                          <Link href="/dashboard/cars/inventory">Inventory</Link>
                        </SidebarMenuSubButton> */}
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
              {/* /////////////////////////////// */}
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isChildActive([
                        "/dashboard/cars",
                        "/dashboard/car-variations",
                        // "/dashboard/cars/featured",
                        // "/dashboard/cars/inventory",
                      ])}
                    >
                      <Wrench className="h-4 w-4" />
                      <span>Maintenance</span>
                      <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/dashboard/cars")}>
                          <Link href="/dashboard/images-gallery">Images Gallery</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      {/* <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/dashboard/car-variations")}>
                          <Link href="/dashboard/car-variations">All Cars Variations</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem> */}
                      <SidebarMenuSubItem>
                        {/* <SidebarMenuSubButton asChild isActive={isActive("/dashboard/cars/featured")}>
                          <Link href="/dashboard/cars/featured">Featured Cars</Link>
                        </SidebarMenuSubButton> */}
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        {/* <SidebarMenuSubButton asChild isActive={isActive("/dashboard/cars/inventory")}>
                          <Link href="/dashboard/cars/inventory">Inventory</Link>
                        </SidebarMenuSubButton> */}
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
              {/* /////////////////////////////// */}

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/parts")}>
                  <Link href="/dashboard/parts">
                    <Gauge className="h-4 w-4" />
                    <span>Parts & Accessories</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isChildActive([
                        "/dashboard/config/general",
                        "/dashboard/config/appearance",
                        "/dashboard/config/notifications",
                      ])}
                    >
                      <Sliders className="h-4 w-4" />
                      <span>System Settings</span>
                      <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/dashboard/config/general")}>
                          <Link href="/dashboard/config/general">General</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/dashboard/config/appearance")}>
                          <Link href="/dashboard/config/appearance">Appearance</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/dashboard/config/notifications")}>
                          <Link href="/dashboard/config/notifications">Notifications</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <Collapsible className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isChildActive([
                        "/dashboard/config/database",
                        "/dashboard/config/backups",
                        "/dashboard/config/logs",
                      ])}
                    >
                      <Database className="h-4 w-4" />
                      <span>Data Management</span>
                      <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/dashboard/config/database")}>
                          <Link href="/dashboard/config/database">Database</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/dashboard/config/backups")}>
                          <Link href="/dashboard/config/backups">Backups</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/dashboard/config/logs")}>
                          <Link href="/dashboard/config/logs">System Logs</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/config/api")}>
                  <Link href="/dashboard/config/api">
                    <FileCode className="h-4 w-4" />
                    <span>API Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/users")}>
                  <Link href="/dashboard/users">
                    <Users className="h-4 w-4" />
                    <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/settings")}>
                  <Link href="/dashboard/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Help & Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/help")}>
                  <Link href="/dashboard/help">
                    <HelpCircle className="h-4 w-4" />
                    <span>Documentation</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <span>Admin User</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogoutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

