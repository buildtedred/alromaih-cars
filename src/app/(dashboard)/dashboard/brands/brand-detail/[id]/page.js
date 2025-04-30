"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Pencil, Trash2, Car, Info, Loader2, AlertTriangle, ImageIcon, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function BrandDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const [brand, setBrand] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    fetchBrandDetails()
  }, [id])

  async function fetchBrandDetails() {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/supabasPrisma/carbrands/${id}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch brand details. Status: ${response.status}`)
      }

      const data = await response.json()
      setBrand(data)
    } catch (error) {
      console.error("Error fetching brand details:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function deleteBrand() {
    setDeleteDialogOpen(false)
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/supabasPrisma/carbrands/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete brand")

      // Redirect back to brands list
      router.push("/dashboard/brands")
    } catch (err) {
      console.error("Error deleting brand:", err.message)
      setError(`Failed to delete brand: ${err.message}`)
      setIsDeleting(false)
    }
  }

  const placeholderImage =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzZiNzI4MCIgZHk9Ii4xZW0iPkJyYW5kIExvZ288L3RleHQ+PC9zdmc+"

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Brands
          </Button>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Skeleton className="h-5 w-40" />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <Card>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-64 w-full rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:w-2/3 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-6 w-full" />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-32 mb-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-md" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link href="/dashboard/brands">
              <ArrowLeft className="h-4 w-4" /> Back to Brands
            </Link>
          </Button>
        </div>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Error Loading Brand
            </CardTitle>
            <CardDescription>We encountered a problem while loading the brand details.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchBrandDetails}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If brand is not found
  if (!brand) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link href="/dashboard/brands">
              <ArrowLeft className="h-4 w-4" /> Back to Brands
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Brand Not Found</CardTitle>
            <CardDescription>The brand you're looking for doesn't exist or has been removed.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Please check the URL or go back to the brands list to select a valid brand.
            </p>
            <Button asChild>
              <Link href="/dashboard/brands">View All Brands</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Full-page overlay during deletion
  if (isDeleting) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-card p-6 rounded-lg shadow-lg text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <h3 className="font-medium text-lg mb-1">Deleting Brand</h3>
          <p className="text-sm text-muted-foreground">Please wait while we process your request...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Breadcrumb and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link href="/dashboard/brands">
              <ArrowLeft className="h-4 w-4" /> Brands
            </Link>
          </Button>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{brand.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild className="gap-1">
            <Link href={`/dashboard/brands/${id}/edit`}>
              <Pencil className="h-4 w-4" /> Edit Brand
            </Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)} className="gap-1">
            <Trash2 className="h-4 w-4" /> Delete Brand
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview" className="gap-1">
            <Info className="h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="cars" className="gap-1">
            <Car className="h-4 w-4" /> Cars ({brand.cars?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Brand Info Card */}
            <div className="md:w-1/3">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Information</CardTitle>
                  <CardDescription>Details about the {brand.name} brand</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-square max-h-64 mx-auto rounded-md overflow-hidden border bg-muted">
                    {brand.image ? (
                      <img
                        src={brand.image || "/placeholder.svg"}
                        alt={`${brand.name} logo`}
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = placeholderImage
                        }}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">{brand.name}</h3>
                    {brand.description ? (
                      <p className="text-sm text-muted-foreground mt-1">{brand.description}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1 italic">No description available</p>
                    )}
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-sm text-muted-foreground">Car Models</span>
                      <span className="text-sm font-medium">{brand.cars?.length || 0}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-sm text-muted-foreground">Created</span>
                      <span className="text-sm font-medium">
                        {brand.createdAt ? new Date(brand.createdAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-sm text-muted-foreground">Last Updated</span>
                      <span className="text-sm font-medium">
                        {brand.updatedAt ? new Date(brand.updatedAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" asChild className="gap-1">
                    <Link href={`/dashboard/cars/new?brandId=${id}`}>
                      <Car className="h-4 w-4" /> Add Car
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="gap-1">
                    <Link href={`/dashboard/brands/${id}/edit`}>
                      <Pencil className="h-4 w-4" /> Edit
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Stats and Cars */}
            <div className="md:w-2/3 space-y-6">
              {/* Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Brand Statistics</CardTitle>
                  <CardDescription>Key metrics for this brand</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Cars</p>
                      <p className="text-2xl font-bold">{brand.cars?.length || 0}</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Latest Model</p>
                      <p className="text-2xl font-bold">
                        {brand.cars && brand.cars.length > 0
                          ? brand.cars.sort((a, b) => b.year - a.year)[0]?.year || "N/A"
                          : "N/A"}
                      </p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Oldest Model</p>
                      <p className="text-2xl font-bold">
                        {brand.cars && brand.cars.length > 0
                          ? brand.cars.sort((a, b) => a.year - b.year)[0]?.year || "N/A"
                          : "N/A"}
                      </p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Average Price</p>
                      <p className="text-2xl font-bold">
                        {brand.cars && brand.cars.length > 0
                          ? `$${Math.round(
                              brand.cars.reduce((sum, car) => sum + (car.price || 0), 0) / brand.cars.length,
                            ).toLocaleString()}`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Cars Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Cars</CardTitle>
                    <CardDescription>Recently added cars for this brand</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild className="gap-1">
                    <Link href={`/dashboard/cars/new?brandId=${id}`}>
                      <Car className="h-4 w-4" /> Add Car
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {brand.cars && brand.cars.length > 0 ? (
                    <div className="space-y-4">
                      {brand.cars
                        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                        .slice(0, 5)
                        .map((car) => (
                          <div key={car.id} className="flex items-center gap-4 group">
                            <div className="h-12 w-12 rounded-md overflow-hidden bg-muted">
                              <img
                                src={car.images?.[0] || "/placeholder.svg"}
                                alt={car.model}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null
                                  e.target.src = "/placeholder.svg"
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{car.model}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {car.year}
                                </Badge>
                                {car.price && (
                                  <span className="text-xs text-muted-foreground">${car.price.toLocaleString()}</span>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Link href={`/dashboard/cars/${car.id}`}>
                                <ChevronRight className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-center">
                      <Car className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No cars yet for this brand</p>
                      <Button variant="outline" size="sm" asChild className="mt-4 gap-1">
                        <Link href={`/dashboard/cars/new?brandId=${id}`}>
                          <Car className="h-4 w-4" /> Add First Car
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
                {brand.cars && brand.cars.length > 5 && (
                  <CardFooter>
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link href="#cars" onClick={() => setActiveTab("cars")}>
                        View All Cars
                      </Link>
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cars" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>All Cars</CardTitle>
                <CardDescription>All cars for the {brand.name} brand</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild className="gap-1">
                <Link href={`/dashboard/cars/new?brandId=${id}`}>
                  <Car className="h-4 w-4" /> Add Car
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {brand.cars && brand.cars.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">Image</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {brand.cars.map((car) => (
                        <TableRow key={car.id}>
                          <TableCell>
                            <div className="h-10 w-10 rounded-md overflow-hidden bg-muted">
                              <img
                                src={car.images?.[0] || "/placeholder.svg"}
                                alt={car.model}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null
                                  e.target.src = "/placeholder.svg"
                                }}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{car.model}</TableCell>
                          <TableCell>{car.year}</TableCell>
                          <TableCell>{car.price ? `$${car.price.toLocaleString()}` : "N/A"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/dashboard/cars/${car.id}`}>
                                  <Info className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Link>
                              </Button>
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/dashboard/cars/${car.id}/edit`}>
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <Car className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No cars yet for this brand</p>
                  <Button variant="outline" size="sm" asChild className="mt-4 gap-1">
                    <Link href={`/dashboard/cars/new?brandId=${id}`}>
                      <Car className="h-4 w-4" /> Add First Car
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the {brand.name} brand? This action cannot be undone.
              {brand.cars && brand.cars.length > 0 && (
                <div className="mt-2 p-2 bg-destructive/10 text-destructive rounded-md text-sm">
                  <strong>Warning:</strong> This brand has {brand.cars.length} car{brand.cars.length !== 1 && "s"}{" "}
                  associated with it. Deleting this brand will also delete all its cars.
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteBrand} className="gap-1">
              <Trash2 className="h-4 w-4" /> Delete Brand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
