"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Car, Search, MoreHorizontal, Loader2, AlertTriangle, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export default function AllCarsPage() {
  const router = useRouter();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  async function fetchCars() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/supabasPrisma/cars");

      if (!response.ok) {
        throw new Error(`Failed to fetch cars. Status: ${response.status}`);
      }

      const data = await response.json();
      setCars(data);
    } catch (error) {
      console.error("Error fetching cars:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteCar(id) {
    if (!window.confirm("Are you sure you want to delete this car? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/supabasPrisma/cars/${id}`, { method: "DELETE" });

      if (!response.ok) throw new Error("Failed to delete car");

      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error("Error deleting car:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  const filteredCars = cars.filter((car) => car.model?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">All Cars</h1>
          <p className="text-muted-foreground">Manage your cars and their brands</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/cars/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Car
          </Link>
        </Button>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search cars..."
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
            <p className="font-medium">Error loading cars</p>
          </div>
          <p className="text-sm mb-2">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchCars}>
            Try Again
          </Button>
        </div>
      )}

      {loading ? (
           <div className="max-w-2xl mx-auto space-y-6">
           <div className="mb-6">
             <Button variant="ghost" asChild className="mb-6">
               <Link href="/dashboard/Cars">
                 <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cars
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
      ) : filteredCars.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Car className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No cars found</h3>
          <p className="text-muted-foreground mt-2">
            {searchTerm ? "Try a different search term" : "Add your first car to get started"}
          </p>
          {!searchTerm && (
            <Button asChild className="mt-4">
              <Link href="/dashboard/cars/new">
                <Plus className="mr-2 h-4 w-4" /> Add New Car
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => {
            const imageUrl = car.image ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Alromaih/${car.image}` : "/placeholder.svg";

            return (
              <Card key={car.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative h-40 bg-muted">
                    <img
                      src={car?.image}
                      alt={car.model}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">
                      {car.model} ({car.year})
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="-mt-2 -mr-2">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/cars/${car.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => deleteCar(car.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-muted-foreground mt-2">Brand: {car.brand?.name || "Unknown"}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}