import "@/app/globals.css"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/DashboardCompo/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Bell, RefreshCw, Search, Settings, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TypesProvider } from "./dashboard/context/types-provider/Types-provider"



export default function DashboardLayout({ children }) {
  return (
    <html >
      <body className="w-full h-screen flex">
      
      <TypesProvider>
        <SidebarProvider>
          {/* Sidebar */}
          <AppSidebar />

          {/* Main Content */}
          <SidebarInset>
            <header className=" flex  justify-between sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 w-full">

              <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Car Management</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              </div>

              <div className="flex items-center gap-4">

                <div className="relative hidden md:block w-72">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                     placeholder="Search cars..."
                    className="pl-10 pr-4 py-2 w-full rounded-[5px] border border-gray-300"
                  />
                </div>
                {/* <div className="flex items-center gap-2">
                          <Button
                            className={`${isAutoRefresh ? "bg-green-600 hover:bg-green-700" : "bg-brand-primary hover:bg-brand-primary/90"} text-white border-none flex items-center gap-2 rounded-[5px]`}
                            onClick={toggleAutoRefresh}
                          >
                            <RefreshCw className={`h-4 w-4 ${isAutoRefresh ? "animate-spin" : ""}`} />
                            {isAutoRefresh ? "Auto Refresh On" : "Auto Refresh"}
                          </Button>
                          <Button
                            className="bg-brand-primary hover:bg-brand-primary/90 text-white border-none flex items-center gap-2 rounded-[5px]"
                            onClick={loadData}
                            disabled={loading}
                          >
                            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                            Refresh
                          </Button>
                        </div> */}
                <Button variant="ghost" size="icon" className="rounded-[5px]">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Sign In</span>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-[5px]">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-[5px]">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Button>
              </div>
            </header>

            <main className="w-full flex-1 overflow-auto p-6">{children}</main>
          </SidebarInset>
        </SidebarProvider>

      </TypesProvider>
       
  
      </body>
    </html>
  )
}

