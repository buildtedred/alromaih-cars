"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Car, Plus, BarChart3, Users, ShoppingCart, AlertTriangle, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    brands: 0,
    cars: 0,
    users: 0,
    orders: 0,
  })
  const [recentBrands, setRecentBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchData() {
    try {
      setLoading(true)
      setError(null)

      // Fetch brands and cars in parallel for better performance
      const [brandsResponse, carsResponse] = await Promise.all([
        fetch("/api/supabasPrisma/carbrands"),
        fetch("/api/supabasPrisma/cars"),
      ])

      if (!brandsResponse.ok) throw new Error("Failed to fetch brands")
      if (!carsResponse.ok) throw new Error("Failed to fetch cars")

      const brandsData = await brandsResponse.json()
      const carsData = await carsResponse.json()

      // Sort brands by creation date (newest first) if available
      const sortedBrands = [...brandsData].sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt)
        }
        return 0
      })

      setStats({
        brands: brandsData.length,
        cars: carsData.length,
        users: 0, // Placeholder
        orders: 0, // Placeholder
      })

      setRecentBrands(sortedBrands.slice(0, 3))
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Placeholder image for brands without images
  const placeholderImage =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE2MCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzZiNzI4MCIgZHk9Ii4xZW0iPkJyYW5kIEltYWdlPC90ZXh0Pjwvc3ZnPg=="

  return (
    <SidebarInset>
      <div className="flex flex-col gap-6 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your car management system</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading} className="gap-1">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/15 p-4 rounded-lg text-destructive flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Brands</CardTitle>
                  <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.brands}</div>
                  <p className="text-xs text-muted-foreground">Car brands in your catalog</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
                  <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.cars}</div>
                  <p className="text-xs text-muted-foreground">Car models in your catalog</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.users}</div>
                  <p className="text-xs text-muted-foreground">Registered users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.orders}</div>
                  <p className="text-xs text-muted-foreground">Total orders processed</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Brands and Chart */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Monthly Sales</CardTitle>
                  <CardDescription>Car sales performance over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <div className="flex flex-col items-center text-center text-muted-foreground">
                    <BarChart3 className="h-16 w-16 mb-4" />
                    <p>Sales analytics will be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Brands</CardTitle>
                  <CardDescription>Recently added car brands</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentBrands.length > 0 ? (
                    <div className="space-y-4">
                      {recentBrands.map((brand) => (
                        <div key={brand.id} className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-md bg-muted overflow-hidden">
                            <img
                              src={brand.image || placeholderImage}
                              alt={brand.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = placeholderImage
                              }}
                            />
                          </div>
                          <div>
                            <p className="font-medium">{brand.name}</p>
                            <p className="text-xs text-muted-foreground">{brand.cars?.length || 0} car models</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-center">
                      <Car className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No brands yet</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/dashboard/brands">
                      <Plus className="mr-2 h-4 w-4" /> Add New Brand
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </>
        )}
      </div>
    </SidebarInset>
  )
}
