"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Car,
  Tag,
  ImageIcon,
  AlertTriangle,
  ChevronRight,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  Info,
  RefreshCw,
  SortAsc,
  SortDesc,
  Calendar,
  DollarSign,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function BrandDetail({ id }) {
  const router = useRouter()
  const [brand, setBrand] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("details")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [carToDelete, setCarToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [sortField, setSortField] = useState("model")
  const [sortDirection, setSortDirection] = useState("asc")
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false)

  useEffect(() => {
    if (id) {
      fetchBrandDetails(id)
    }
  }, [id])

  async function fetchBrandDetails(brandId) {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/supabasPrisma/carbrands/${brandId}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch brand details. Status: ${response.status}`)
      }

      const text = await response.text()
      let data

      try {
        // Try to parse the response as JSON
        data = JSON.parse(text)
      } catch (parseError) {
        // If parsing fails, it's likely HTML or another format
        if (text.includes("<!DOCTYPE") || text.includes("<html")) {
          throw new Error(
            "The API returned an HTML page instead of JSON. The endpoint might not exist or there's a server error.",
          )
        } else {
          throw new Error(`Failed to parse response as JSON: ${parseError.message}`)
        }
      }

      setBrand(data)
    } catch (error) {
      console.error("Error fetching brand details:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const confirmDeleteCar = (car) => {
    setCarToDelete(car)
    setDeleteDialogOpen(true)
  }

  const deleteCar = async () => {
    if (!carToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/supabasPrisma/cars/${carToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete car")
      }

      // Refresh brand data after deletion
      fetchBrandDetails(id)
    } catch (error) {
      console.error("Error deleting car:", error)
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setCarToDelete(null)
    }
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Sort cars
  const sortedCars = brand?.cars
    ? [...brand.cars].sort((a, b) => {
        const aValue = a[sortField]
        const bValue = b[sortField]

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
        return 0
      })
    : []

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto px-3 py-3 max-w-6xl space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-8 w-24" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-2">
            <Skeleton className="h-[200px] w-full rounded-[5px]" />
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-[160px] w-full rounded-[5px]" />
            <div className="space-y-1.5">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto px-3 py-3 max-w-6xl">
        <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-3">
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back
        </Button>

        <div className="bg-destructive/15 p-4 rounded-[5px] text-destructive">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4" />
            <h2 className="text-base font-semibold">Error Loading Brand Details</h2>
          </div>
          <p className="text-sm mb-3">{error}</p>
          <Button size="sm" onClick={() => fetchBrandDetails(id)}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  // Render no data state
  if (!brand) {
    return (
      <div className="container mx-auto px-3 py-3 max-w-6xl">
        <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-3">
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back
        </Button>

        <div className="bg-muted p-4 rounded-[5px] text-center">
          <Tag className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <h2 className="text-base font-semibold mb-1.5">Brand Not Found</h2>
          <p className="text-sm text-muted-foreground mb-3">
            The brand you're looking for doesn't exist or has been removed.
          </p>
          <Button size="sm" asChild>
            <Link href="/dashboard/brands">View All Brands</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`container mx-auto px-3 py-3 max-w-6xl space-y-4 relative ${isDeleting ? "pointer-events-none" : ""}`}
    >
      {isDeleting && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card p-6 rounded-[5px] shadow-lg text-center max-w-md w-full border border-brand-primary/20">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-brand-primary" />
            <h3 className="font-medium text-base mb-2">Deleting Car</h3>
            <p className="text-muted-foreground text-sm">Please wait while we process your request...</p>
          </div>
        </div>
      )}
      {/* Header with navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="h-7 px-2 text-xs hover:bg-brand-light hover:text-brand-primary rounded-[5px]"
            disabled={isDeleting}
          >
            <ArrowLeft className="mr-1 h-3 w-3" /> Back
          </Button>
          <div className="flex items-center text-muted-foreground text-xs">
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <ChevronRight className="h-3 w-3 mx-1" />
            <Link href="/dashboard/brands" className="hover:underline">
              Brands
            </Link>
            <ChevronRight className="h-3 w-3 mx-1" />
            <span className="text-foreground font-medium truncate max-w-[150px]">{brand.name}</span>
          </div>
        </div>

        <div className="flex gap-1.5">
          <Button
            asChild
            size="sm"
            className="h-7 px-2 text-xs bg-brand-primary hover:bg-brand-primary/90 rounded-[5px]"
            disabled={isDeleting}
          >
            <Link href={`/dashboard/brands/${brand.id}/edit`}>
              <Pencil className="mr-1 h-3 w-3" /> Edit Brand
            </Link>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column - Brand details */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-4 p-4 bg-brand-light/30 rounded-[5px] border border-brand-primary/10">
            <div className="h-20 w-20 rounded-[5px] overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
              {brand.image ? (
                <img
                  src={brand.image || "/placeholder.svg"}
                  alt={brand.name}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/generic-brand-logo.png"
                  }}
                />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-brand-primary">{brand.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="flex items-center gap-0.5 text-[10px] h-4 px-1.5">
                  <Car className="h-2.5 w-2.5" /> {brand.cars?.length || 0} Cars
                </Badge>
                {brand.country && (
                  <Badge variant="secondary" className="flex items-center gap-0.5 text-[10px] h-4 px-1.5">
                    <Tag className="h-2.5 w-2.5" /> {brand.country}
                  </Badge>
                )}
                {brand.founded && (
                  <Badge variant="outline" className="flex items-center gap-0.5 text-[10px] h-4 px-1.5">
                    <Calendar className="h-2.5 w-2.5" /> Founded {brand.founded}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Brand details tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-3">
            <TabsList className="grid grid-cols-3 mb-3 h-8 bg-brand-light/50">
              <TabsTrigger value="details" className="text-xs py-1" disabled={isDeleting}>
                Brand Details
              </TabsTrigger>
              <TabsTrigger value="cars" className="text-xs py-1" disabled={isDeleting}>
                Cars
              </TabsTrigger>
              <TabsTrigger value="statistics" className="text-xs py-1" disabled={isDeleting}>
                Statistics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-3 mt-0">
              <Card className="rounded-[5px] shadow-sm border border-gray-200">
                <CardHeader className="pb-1.5 pt-3 px-3">
                  <CardTitle className="text-xs font-medium">Brand Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5 pt-0 px-3 pb-3">
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground">Name</span>
                      <p className="text-xs font-medium">{brand.name || "N/A"}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground">Country</span>
                      <p className="text-xs font-medium">{brand.country || "N/A"}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground">Founded</span>
                      <p className="text-xs font-medium">{brand.founded || "N/A"}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground">Headquarters</span>
                      <p className="text-xs font-medium">{brand.headquarters || "N/A"}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground">Website</span>
                      <p className="text-xs font-medium">
                        {brand.website ? (
                          <a
                            href={brand.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-primary hover:underline"
                          >
                            {brand.website}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground">Number of Cars</span>
                      <p className="text-xs font-medium">{brand.cars?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {brand.description && (
                <div className="space-y-1.5">
                  <h3 className="text-xs font-medium">Description</h3>
                  <div className="p-3 bg-muted/50 rounded-[5px]">
                    <p className="text-xs">{brand.description}</p>
                  </div>
                </div>
              )}

              {brand.history && (
                <div className="space-y-1.5">
                  <h3 className="text-xs font-medium">History</h3>
                  <div className="p-3 bg-muted/50 rounded-[5px]">
                    <p className="text-xs">{brand.history}</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="cars" className="space-y-3 mt-0">
              {brand.cars && brand.cars.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-medium">Cars from {brand.name}</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchBrandDetails(id)}
                      disabled={loading || isDeleting}
                      className="h-7 px-2 text-xs rounded-[5px] border-gray-300 hover:bg-brand-light hover:text-brand-primary"
                    >
                      <RefreshCw className={`h-3 w-3 mr-1 ${loading ? "animate-spin" : ""}`} />
                      Refresh
                    </Button>
                  </div>

                  <div
                    className="border border-gray-200 rounded-[5px] overflow-hidden"
                    style={{ maxHeight: "400px", overflowY: "auto" }}
                  >
                    <Table>
                      <TableHeader className="bg-brand-light/30">
                        <TableRow>
                          <TableHead className="w-[60px]">Image</TableHead>
                          <TableHead
                            className={`${!isDeleting ? "cursor-pointer hover:text-brand-primary" : ""}`}
                            onClick={() => !isDeleting && handleSort("model")}
                          >
                            <div className="flex items-center gap-1">
                              Model
                              {sortField === "model" &&
                                (sortDirection === "asc" ? (
                                  <SortAsc className="h-3 w-3" />
                                ) : (
                                  <SortDesc className="h-3 w-3" />
                                ))}
                            </div>
                          </TableHead>
                          <TableHead
                            className={`${!isDeleting ? "cursor-pointer hover:text-brand-primary" : ""}`}
                            onClick={() => !isDeleting && handleSort("year")}
                          >
                            <div className="flex items-center gap-1">
                              Year
                              {sortField === "year" &&
                                (sortDirection === "asc" ? (
                                  <SortAsc className="h-3 w-3" />
                                ) : (
                                  <SortDesc className="h-3 w-3" />
                                ))}
                            </div>
                          </TableHead>
                          <TableHead
                            className={`${!isDeleting ? "cursor-pointer hover:text-brand-primary" : ""}`}
                            onClick={() => !isDeleting && handleSort("price")}
                          >
                            <div className="flex items-center gap-1">
                              Price
                              {sortField === "price" &&
                                (sortDirection === "asc" ? (
                                  <SortAsc className="h-3 w-3" />
                                ) : (
                                  <SortDesc className="h-3 w-3" />
                                ))}
                            </div>
                          </TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedCars.map((car) => (
                          <TableRow key={car.id} className="hover:bg-brand-light/30">
                            <TableCell className="py-1.5">
                              <div className="h-8 w-8 rounded-[5px] overflow-hidden bg-muted">
                                {car.images && car.images.length > 0 ? (
                                  <img
                                    src={car.images[0] || "/placeholder.svg"}
                                    alt={car.model}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null
                                      e.target.src = "/classic-red-convertible.png"
                                    }}
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center">
                                    <Car className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium text-xs py-1.5">{car.model}</TableCell>
                            <TableCell className="text-xs py-1.5">{car.year}</TableCell>
                            <TableCell className="py-1.5">
                              <Badge variant="outline" className="text-[10px] py-0 h-4">
                                <DollarSign className="h-2.5 w-2.5 mr-0.5" />
                                {car.price?.toLocaleString() || "N/A"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right py-1.5">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 hover:bg-brand-light hover:text-brand-primary rounded-[5px]"
                                  asChild
                                  disabled={isDeleting}
                                >
                                  <Link href={`/dashboard/cars/car-details/${car.id}`}>
                                    <Eye className="h-3 w-3" />
                                  </Link>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 hover:bg-brand-light hover:text-brand-primary rounded-[5px]"
                                  asChild
                                  disabled={isDeleting}
                                >
                                  <Link href={`/dashboard/cars/${car.id}/edit`}>
                                    <Pencil className="h-3 w-3" />
                                  </Link>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 rounded-[5px] hover:bg-destructive/10"
                                  onClick={() => !isDeleting && confirmDeleteCar(car)}
                                  disabled={isDeleting}
                                >
                                  <Trash2 className="h-3 w-3 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Car className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="text-sm font-medium">No Cars Available</h3>
                  <p className="text-[10px] text-muted-foreground mt-1 mb-2">
                    This brand doesn't have any cars listed.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="statistics" className="space-y-3 mt-0">
              {brand.cars && brand.cars.length > 0 ? (
                <div className="space-y-3">
                  <Card className="rounded-[5px] shadow-sm border border-gray-200">
                    <CardHeader className="pb-1.5 pt-3 px-3">
                      <CardTitle className="text-xs font-medium">Brand Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1.5 pt-0 px-3 pb-3">
                      <div className="grid grid-cols-2 gap-1.5">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-muted-foreground">Total Cars</span>
                          <p className="text-xs font-medium">{brand.cars.length}</p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-muted-foreground">Average Price</span>
                          <p className="text-xs font-medium">
                            {brand.cars.some((car) => car.price)
                              ? `$${Math.round(
                                  brand.cars.reduce((sum, car) => sum + (car.price || 0), 0) /
                                    brand.cars.filter((car) => car.price).length,
                                ).toLocaleString()}`
                              : "N/A"}
                          </p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-muted-foreground">Newest Model</span>
                          <p className="text-xs font-medium">
                            {brand.cars.some((car) => car.year)
                              ? brand.cars.reduce(
                                  (newest, car) => (car.year > newest.year ? car : newest),
                                  brand.cars[0],
                                ).model
                              : "N/A"}
                          </p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-muted-foreground">Oldest Model</span>
                          <p className="text-xs font-medium">
                            {brand.cars.some((car) => car.year)
                              ? brand.cars.reduce(
                                  (oldest, car) => (car.year < oldest.year ? car : oldest),
                                  brand.cars[0],
                                ).model
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-[5px] shadow-sm border border-gray-200">
                    <CardHeader className="pb-1.5 pt-3 px-3">
                      <CardTitle className="text-xs font-medium">Car Models by Year</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1.5 pt-0 px-3 pb-3">
                      <div className="space-y-1">
                        {Array.from(new Set(brand.cars.map((car) => car.year).filter(Boolean)).values())
                          .sort((a, b) => b - a)
                          .map((year) => (
                            <div key={year} className="flex justify-between p-1.5 bg-muted/50 rounded-[5px]">
                              <span className="text-[10px] font-medium">{year}</span>
                              <span className="text-[10px]">
                                {brand.cars.filter((car) => car.year === year).length} models
                              </span>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-[5px] shadow-sm border border-gray-200">
                    <CardHeader className="pb-1.5 pt-3 px-3">
                      <CardTitle className="text-xs font-medium">Price Range</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1.5 pt-0 px-3 pb-3">
                      <div className="grid grid-cols-2 gap-1.5">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-muted-foreground">Lowest Price</span>
                          <p className="text-xs font-medium">
                            {brand.cars.some((car) => car.price)
                              ? `$${Math.min(
                                  ...brand.cars.filter((car) => car.price).map((car) => car.price),
                                ).toLocaleString()}`
                              : "N/A"}
                          </p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-muted-foreground">Highest Price</span>
                          <p className="text-xs font-medium">
                            {brand.cars.some((car) => car.price)
                              ? `$${Math.max(
                                  ...brand.cars.filter((car) => car.price).map((car) => car.price),
                                ).toLocaleString()}`
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Info className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="text-sm font-medium">No Statistics Available</h3>
                  <p className="text-[10px] text-muted-foreground mt-1">Add cars to this brand to view statistics.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right column - Summary and actions */}
        <div className="space-y-3">
          <Card className="rounded-[5px] shadow-sm border border-gray-200 bg-white">
            <CardContent className="p-3 space-y-2">
              <h3 className="text-xs font-medium">Brand Summary</h3>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{brand.name}</span>
                </div>
                {brand.country && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Country:</span>
                    <span className="font-medium">{brand.country}</span>
                  </div>
                )}
                {brand.founded && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Founded:</span>
                    <span className="font-medium">{brand.founded}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Cars:</span>
                  <span className="font-medium">{brand.cars?.length || 0}</span>
                </div>
                {brand.headquarters && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Headquarters:</span>
                    <span className="font-medium">{brand.headquarters}</span>
                  </div>
                )}
              </div>

              <Separator className="my-1" />

              <div className="space-y-1.5">
                <Button
                  className="w-full h-7 text-[10px] bg-brand-primary hover:bg-brand-primary/90 rounded-[5px]"
                  asChild
                  disabled={isDeleting}
                >
                  <Link href={`/dashboard/brands/${brand.id}/edit`}>
                    <Pencil className="mr-1 h-3 w-3" /> Edit Brand Details
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {brand.cars && brand.cars.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-medium">Popular Models</h3>

              <div className="space-y-1">
                {brand.cars.slice(0, 5).map((car) => (
                  <div
                    key={car.id}
                    className="flex items-center justify-between p-1.5 bg-brand-light/30 rounded-[5px] hover:bg-brand-light/50 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <Car className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[10px]">{car.model}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] py-0 h-4 px-1">
                      <Calendar className="h-2 w-2 mr-0.5" />
                      {car.year || "N/A"}
                    </Badge>
                  </div>
                ))}

                {brand.cars.length > 5 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-[10px] h-6 mt-0.5"
                    onClick={() => setActiveTab("cars")}
                    disabled={isDeleting}
                  >
                    View all {brand.cars.length} cars
                  </Button>
                )}
              </div>
            </div>
          )}

          {brand.logo && (
            <div className="space-y-2">
              <h3 className="text-xs font-medium">Brand Logo</h3>
              <div className="p-4 bg-white rounded-[5px] border border-gray-200 flex items-center justify-center">
                <img
                  src={brand.logo || "/placeholder.svg"}
                  alt={`${brand.name} Logo`}
                  className="max-h-24 max-w-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/generic-brand-logo.png"
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-[5px] border-red-200">
          <DialogHeader>
            <DialogTitle className="text-sm">Delete Car</DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to delete the car "{carToDelete?.model}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-3">
            <Button variant="outline" size="sm" onClick={() => setDeleteDialogOpen(false)} className="h-7 text-xs">
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={deleteCar}
              disabled={isDeleting}
              className="h-7 text-xs rounded-[5px] bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-3 w-3 mr-1" /> Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
