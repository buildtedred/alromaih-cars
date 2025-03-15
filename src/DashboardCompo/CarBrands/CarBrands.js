"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Car, Search, MoreHorizontal, Loader2, AlertTriangle, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export default function CarBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  async function fetchBrands() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/supabasPrisma/carbrands");

      if (!response.ok) {
        const text = await response.text();
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.error || `Server error: ${response.status}`);
        } catch (parseError) {
          if (text.includes("<!DOCTYPE html>")) {
            throw new Error(`Server returned HTML instead of JSON. Status: ${response.status}`);
          } else {
            throw new Error(`Failed to fetch brands. Status: ${response.status}`);
          }
        }
      }

      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error("Error fetching brands:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteBrand(id) {
    if (!window.confirm("Are you sure you want to delete this brand? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/supabasPrisma/carbrands/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete brand");

      setBrands(brands.filter((brand) => brand.id !== id));
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  }

  const filteredBrands = brands.filter((brand) => brand.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  const placeholderImage =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE2MCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzZiNzI4MCIgZHk9Ii4xZW0iPkJyYW5kIEltYWdlPC90ZXh0Pjwvc3ZnPg==";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Car Brands</h1>
          <p className="text-muted-foreground">Manage your car brands and their models</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/brands/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Brand
          </Link>
        </Button>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search brands..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="bg-destructive/15 p-4 rounded-md text-destructive">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5" />
            <p className="font-medium">Error loading brands</p>
          </div>
          <p className="text-sm mb-2">{error}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchBrands}>
              Try Again
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-6">
              <Link href="/dashboard/brands">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Brands
              </Link>
            </Button>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-40 w-full" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </CardFooter>
          </Card>
        </div>
      ) : filteredBrands.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Car className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No car brands found</h3>
          <p className="text-muted-foreground mt-2">
            {searchTerm ? "Try a different search term" : "Add your first car brand to get started"}
          </p>
          {!searchTerm && (
            <Button asChild className="mt-4">
              <Link href="/dashboard/brands/new">
                <Plus className="mr-2 h-4 w-4" /> Add New Brand
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => (
            <Card key={brand.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative h-40 bg-muted">
                  <img
                    src={brand.image || placeholderImage}
                    alt={brand.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = placeholderImage;
                    }}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{brand.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="-mt-2 -mr-2">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/brands/${brand.id}/edit`}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => deleteBrand(brand.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-muted-foreground mt-2">{brand.cars?.length || 0} Cars</p>
              </CardContent>
              {/* <CardFooter className="p-6 pt-0 flex justify-between">
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/brands/${brand.id}`}>View Details</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/cars/new?brandId=${brand.id}`}>
                    <Plus className="mr-2 h-4 w-4" /> Add Car
                  </Link>
                </Button>
              </CardFooter> */}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}