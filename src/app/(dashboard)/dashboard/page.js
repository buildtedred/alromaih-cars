"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Car, Plus, BarChart3, Users, ShoppingCart, Loader2, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset } from "@/components/ui/sidebar";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    brands: 0,
    cars: 0,
    users: 0,
    orders: 0,
  });
  const [recentBrands, setRecentBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const brandsResponse = await fetch("/api/supabasPrisma/carbrands");
        if (!brandsResponse.ok) throw new Error("Failed to fetch brands");
        const brandsData = await brandsResponse.json();

        const carsResponse = await fetch("/api/supabasPrisma/cars");
        if (!carsResponse.ok) throw new Error("Failed to fetch cars");
        const carsData = await carsResponse.json();

        setStats({
          brands: brandsData.length,
          cars: carsData.length,
          users: 0, // Placeholder
          orders: 0, // Placeholder
        });

        setRecentBrands(brandsData.slice(0, 3));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <SidebarInset>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your car management system</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-lg flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
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

            {/* Recent Brands */}
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
                              src={brand.image || "/placeholder.svg"}
                              alt={brand.name}
                              className="h-full w-full object-cover"
                              onError={(e) => (e.target.src = "/placeholder.svg")}
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
  );
}
