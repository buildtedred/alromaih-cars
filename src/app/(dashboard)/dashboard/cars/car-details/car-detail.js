"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Car,
  Calendar,
  Tag,
  Palette,
  DollarSign,
  ImageIcon,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Info,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  Fuel,
  Gauge,
  GaugeIcon as Speedometer,
  Armchair,
  Droplets,
  Cog,
  Truck,
  Milestone,
  Zap,
  Compass,
  Dumbbell,
  Timer,
  Leaf,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"

export function CarDetail({ slug, language = "en" }) {
  const router = useRouter()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("details")
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false)
  const [selectedImages, setSelectedImages] = useState([])
  const [selectedImageTitle, setSelectedImageTitle] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [variationToDelete, setVariationToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchCarDetails(slug)
    }
  }, [slug, language])

  async function fetchCarDetails(carSlug) {
    try {
      setLoading(true)
      setError(null)

      // Use the slug-based API endpoint instead of ID-based
      const response = await fetch(`/api/supabasPrisma/cars/slug/${carSlug}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch car details. Status: ${response.status}`)
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

      // The response now contains both 'en' and 'ar' data
      // Set the car data based on the selected language
      if (data && (data.en || data.ar)) {
        setCar(data[language] || data.en) // Fallback to English if selected language data is missing
      } else {
        throw new Error("Invalid data format received from API")
      }
    } catch (error) {
      console.error("Error fetching car details:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const openImagePreview = (images, title) => {
    setSelectedImages(images)
    setSelectedImageTitle(title)
    setImagePreviewOpen(true)
  }

  const confirmDeleteVariation = (variation) => {
    setVariationToDelete(variation)
    setDeleteDialogOpen(true)
  }

  const deleteVariation = async () => {
    if (!variationToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/supabasPrisma/othervariations/${variationToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete variation")
      }

      // Refresh car data after deletion
      fetchCarDetails(slug)
    } catch (error) {
      console.error("Error deleting variation:", error)
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setVariationToDelete(null)
    }
  }

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
            <Skeleton className="h-[300px] w-full rounded-[5px]" />
            <div className="flex gap-1.5 overflow-x-auto py-1">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-14 w-14 flex-shrink-0 rounded-[5px]" />
              ))}
            </div>
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
            <h2 className="text-base font-semibold">Error Loading Car Details</h2>
          </div>
          <p className="text-sm mb-3">{error}</p>
          <Button size="sm" onClick={() => fetchCarDetails(slug)}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  // Render no data state
  if (!car) {
    return (
      <div className="container mx-auto px-3 py-3 max-w-6xl">
        <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-3">
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back
        </Button>

        <div className="bg-muted p-4 rounded-[5px] text-center">
          <Car className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <h2 className="text-base font-semibold mb-1.5">Car Not Found</h2>
          <p className="text-sm text-muted-foreground mb-3">
            The car you're looking for doesn't exist or has been removed.
          </p>
          <Button size="sm" asChild>
            <Link href="/dashboard/cars">View All Cars</Link>
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
            <h3 className="font-medium text-base mb-2">Deleting Variation</h3>
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
            <Link href="/dashboard/cars" className="hover:underline">
              Cars
            </Link>
            <ChevronRight className="h-3 w-3 mx-1" />
            <span className="text-foreground font-medium truncate max-w-[150px]">{car.model}</span>
          </div>
        </div>

        <div className="flex gap-1.5">
          <Button
            asChild
            size="sm"
            className="h-7 px-2 text-xs bg-brand-primary hover:bg-brand-primary/90 rounded-[5px]"
            disabled={isDeleting}
          >
            <Link href={`/dashboard/cars/${car.id}/edit`}>
              <Pencil className="mr-1 h-3 w-3" /> Edit Car
            </Link>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column - Car images */}
        <div className="lg:col-span-2 space-y-3">
          <div className="relative aspect-video bg-muted rounded-[5px] overflow-hidden border border-gray-200">
            {car.images && car.images.length > 0 ? (
              <img
                src={car.images[0] || "/placeholder.svg"}
                alt={car.model}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = "/placeholder.svg?height=400&width=600"
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Car className="h-10 w-10 text-muted-foreground" />
              </div>
            )}

            {car.images && car.images.length > 0 && (
              <Button
                className="absolute bottom-2 right-2"
                size="sm"
                variant="secondary"
                onClick={() => openImagePreview(car.images, car.model)}
                className="h-7 px-2 text-xs"
                disabled={isDeleting}
              >
                <ImageIcon className="mr-1 h-3 w-3" /> View All Images
              </Button>
            )}
          </div>

          {car.images && car.images.length > 1 && (
            <div className="flex gap-1.5 overflow-x-auto py-1 pb-1.5">
              {car.images.map((image, index) => (
                <div
                  key={index}
                  className={`h-10 w-10 flex-shrink-0 rounded-[5px] overflow-hidden border border-gray-200 ${isDeleting ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-80 transition-opacity"}`}
                  onClick={isDeleting ? undefined : () => openImagePreview(car.images, car.model)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${car.model} image ${index + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "/placeholder.svg?height=56&width=56"
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Car details tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-3">
            <TabsList className="grid grid-cols-4 mb-3 h-8 bg-brand-light/50">
              <TabsTrigger value="details" className="text-xs py-1" disabled={isDeleting}>
                Basic Details
              </TabsTrigger>
              <TabsTrigger value="technical" className="text-xs py-1" disabled={isDeleting}>
                Technical
              </TabsTrigger>
              <TabsTrigger value="specifications" className="text-xs py-1" disabled={isDeleting}>
                Specifications
              </TabsTrigger>
              <TabsTrigger value="variations" className="text-xs py-1" disabled={isDeleting}>
                Variations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-3 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card className="rounded-[5px] shadow-sm border border-gray-200">
                  <CardHeader className="pb-1.5 pt-3 px-3">
                    <CardTitle className="text-xs font-medium">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1.5 pt-0 px-3 pb-3">
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground">Model</span>
                        <p className="text-xs font-medium">{car.model || "N/A"}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground">Year</span>
                        <p className="text-xs font-medium">{car.year || "N/A"}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground">Brand</span>
                        <div className="flex items-center gap-1">
                          {car.brand?.logo && (
                            <div className="h-3 w-3 rounded overflow-hidden bg-muted">
                              <img
                                src={car.brand.logo || "/placeholder.svg"}
                                alt={car.brand.name}
                                className="h-full w-full object-contain"
                              />
                            </div>
                          )}
                          <p className="text-xs font-medium">{car.brand?.name || "Unknown"}</p>
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground">Price</span>
                        <p className="text-xs font-medium">{car.price ? `$${car.price.toLocaleString()}` : "N/A"}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground">Color</span>
                        <p className="text-xs font-medium">{car.color || "N/A"}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground">Condition</span>
                        <p className="text-xs font-medium">{car.condition || "N/A"}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground">Body Type</span>
                        <p className="text-xs font-medium">{car.bodyType || "N/A"}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground">Manufactured In</span>
                        <p className="text-xs font-medium">{car.manufactured || "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-[5px] shadow-sm border border-gray-200">
                  <CardHeader className="pb-1.5 pt-3 px-3">
                    <CardTitle className="text-xs font-medium">Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1.5 pt-0 px-3 pb-3">
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground">Registration</span>
                        <p className="text-xs font-medium">{car.registration || "N/A"}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground">Previous Owners</span>
                        <p className="text-xs font-medium">{car.ownerCount || "N/A"}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground">Insurance Status</span>
                        <p className="text-xs font-medium">{car.insuranceStatus || "N/A"}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground">Tax Validity</span>
                        <p className="text-xs font-medium">
                          {car.taxValidity ? format(new Date(car.taxValidity), "dd MMM yyyy") : "N/A"}
                        </p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground">Safety Rating</span>
                        <p className="text-xs font-medium">{car.safetyRating || "N/A"}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground">Warranty</span>
                        <p className="text-xs font-medium">{car.warranty || "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {car.description && (
                <div className="space-y-1.5">
                  <h3 className="text-xs font-medium">Description</h3>
                  <div className="p-3 bg-muted/50 rounded-[5px]">
                    <p className="text-xs">{car.description}</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="technical" className="space-y-3 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card className="rounded-[5px] shadow-sm border border-gray-200">
                  <CardHeader className="pb-1.5 pt-3 px-3">
                    <CardTitle className="text-xs font-medium">Engine & Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1.5 pt-0 px-3 pb-3">
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-0.5">
                          <Gauge className="h-2.5 w-2.5 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">Engine Size</span>
                        </div>
                        <p className="text-xs font-medium">{car.engineSize ? `${car.engineSize}L` : "N/A"}</p>
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-0.5">
                          <Zap className="h-2.5 w-2.5 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">Horsepower</span>
                        </div>
                        <p className="text-xs font-medium">{car.horsepower ? `${car.horsepower} HP` : "N/A"}</p>
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-0.5">
                          <Dumbbell className="h-2.5 w-2.5 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">Torque</span>
                        </div>
                        <p className="text-xs font-medium">{car.torque ? `${car.torque} Nm` : "N/A"}</p>
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-0.5">
                          <Speedometer className="h-2.5 w-2.5 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">Top Speed</span>
                        </div>
                        <p className="text-xs font-medium">{car.topSpeed ? `${car.topSpeed} km/h` : "N/A"}</p>
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-0.5">
                          <Timer className="h-2.5 w-2.5 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">0-100 km/h</span>
                        </div>
                        <p className="text-xs font-medium">{car.acceleration ? `${car.acceleration}s` : "N/A"}</p>
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-0.5">
                          <Compass className="h-2.5 w-2.5 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">Wheel Drive</span>
                        </div>
                        <p className="text-xs font-medium">{car.wheelDrive || "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-[5px] shadow-sm border border-gray-200">
                  <CardHeader className="pb-1.5 pt-3 px-3">
                    <CardTitle className="text-xs font-medium">Fuel & Transmission</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1.5 pt-0 px-3 pb-3">
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-0.5">
                          <Fuel className="h-2.5 w-2.5 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">Fuel Type</span>
                        </div>
                        <p className="text-xs font-medium">{car.fuelType || "N/A"}</p>
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-0.5">
                          <Droplets className="h-2.5 w-2.5 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">Fuel Tank</span>
                        </div>
                        <p className="text-xs font-medium">
                          {car.fuelTankCapacity ? `${car.fuelTankCapacity}L` : "N/A"}
                        </p>
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-0.5">
                          <Leaf className="h-2.5 w-2.5 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">Fuel Economy</span>
                        </div>
                        <p className="text-xs font-medium">{car.fuelEconomy ? `${car.fuelEconomy} km/L` : "N/A"}</p>
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-0.5">
                          <Cog className="h-2.5 w-2.5 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">Transmission</span>
                        </div>
                        <p className="text-xs font-medium">{car.transmission || "N/A"}</p>
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-0.5">
                          <Milestone className="h-2.5 w-2.5 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">Mileage</span>
                        </div>
                        <p className="text-xs font-medium">
                          {car.mileage ? `${car.mileage.toLocaleString()} km` : "N/A"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-[5px] shadow-sm border border-gray-200">
                  <CardHeader className="pb-1.5 pt-3 px-3">
                    <CardTitle className="text-xs font-medium">Interior & Capacity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1.5 pt-0 px-3 pb-3">
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-0.5">
                          <Armchair className="h-2.5 w-2.5 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">Seats</span>
                        </div>
                        <p className="text-xs font-medium">{car.seats || "N/A"}</p>
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-0.5">
                          <Truck className="h-2.5 w-2.5 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">Doors</span>
                        </div>
                        <p className="text-xs font-medium">{car.doors || "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-[5px] shadow-sm border border-gray-200">
                  <CardHeader className="pb-1.5 pt-3 px-3">
                    <CardTitle className="text-xs font-medium">Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1.5 pt-0 px-3 pb-3">
                    <div className="grid grid-cols-2 gap-1">
                      <div className="flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full ${car.gps ? "bg-green-500" : "bg-muted"}`}></div>
                        <span className="text-[10px]">GPS Navigation</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full ${car.sunroof ? "bg-green-500" : "bg-muted"}`}></div>
                        <span className="text-[10px]">Sunroof</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`h-2 w-2 rounded-full ${car.parkingSensors ? "bg-green-500" : "bg-muted"}`}
                        ></div>
                        <span className="text-[10px]">Parking Sensors</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`h-2 w-2 rounded-full ${car.cruiseControl ? "bg-green-500" : "bg-muted"}`}
                        ></div>
                        <span className="text-[10px]">Cruise Control</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full ${car.leatherSeats ? "bg-green-500" : "bg-muted"}`}></div>
                        <span className="text-[10px]">Leather Seats</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full ${car.heatedSeats ? "bg-green-500" : "bg-muted"}`}></div>
                        <span className="text-[10px]">Heated Seats</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full ${car.bluetooth ? "bg-green-500" : "bg-muted"}`}></div>
                        <span className="text-[10px]">Bluetooth</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`h-2 w-2 rounded-full ${car.climateControl ? "bg-green-500" : "bg-muted"}`}
                        ></div>
                        <span className="text-[10px]">Climate Control</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full ${car.keylessEntry ? "bg-green-500" : "bg-muted"}`}></div>
                        <span className="text-[10px]">Keyless Entry</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full ${car.rearCamera ? "bg-green-500" : "bg-muted"}`}></div>
                        <span className="text-[10px]">Rear Camera</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {car.infotainment && (
                <div className="space-y-1.5">
                  <h3 className="text-xs font-medium">Infotainment System</h3>
                  <div className="p-3 bg-muted/50 rounded-[5px]">
                    <p className="text-xs">{car.infotainment || "N/A"}</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="specifications" className="space-y-3 mt-0">
              {car.specifications && car.specifications.length > 0 ? (
                <div className="space-y-3">
                  {car.specifications.map((spec, index) => (
                    <div key={index} className="space-y-2">
                      <h3 className="text-xs font-medium">{spec.title || `Specification Group ${index + 1}`}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {spec.details?.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex justify-between p-1.5 bg-muted/50 rounded-[5px]">
                            <span className="text-[10px] text-muted-foreground">{detail.label}</span>
                            <span className="text-[10px] font-medium">{detail.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Info className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="text-sm font-medium">No Specifications Available</h3>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    This car doesn't have any specifications listed.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="variations" className="space-y-3 mt-0">
              {car.otherVariations && car.otherVariations.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-medium">Available Variations</h3>
                  </div>

                  <div className="border border-gray-200 rounded-[5px] overflow-hidden">
                    <Table>
                      <TableHeader className="bg-brand-light/30">
                        <TableRow>
                          <TableHead className="w-[60px]">Image</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Color</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {car.otherVariations.map((variation) => (
                          <TableRow key={variation.id} className="hover:bg-brand-light/30">
                            <TableCell className="py-1.5">
                              <div className="h-8 w-8 rounded-[5px] overflow-hidden bg-muted">
                                {variation.images && variation.images.length > 0 ? (
                                  <img
                                    src={variation.images[0] || "/placeholder.svg"}
                                    alt={variation.name}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null
                                      e.target.src = "/placeholder.svg?height=32&width=32"
                                    }}
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center">
                                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium text-xs py-1.5">{variation.name}</TableCell>
                            <TableCell className="py-1.5">
                              <div className="flex items-center gap-1">
                                <div
                                  className="h-2.5 w-2.5 rounded-full border"
                                  style={{ backgroundColor: variation.colorHex || "#cccccc" }}
                                />
                                <span className="text-[10px]">{variation.colorName}</span>
                              </div>
                            </TableCell>
                            <TableCell className="py-1.5">
                              <Badge variant="outline" className="text-[10px] py-0 h-4">
                                <DollarSign className="h-2.5 w-2.5 mr-0.5" />
                                {variation.price?.toLocaleString() || "N/A"}
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
                                  <Link href={`/dashboard/variations/${variation.id}`}>
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
                                  <Link href={`/dashboard/cars/new/EditVariationForm?id=${variation.id}`}>
                                    <Pencil className="h-3 w-3" />
                                  </Link>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 rounded-[5px] hover:bg-destructive/10"
                                  onClick={() => confirmDeleteVariation(variation)}
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

                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="h-7 text-[10px] rounded-[5px] hover:bg-brand-light hover:text-brand-primary"
                      disabled={isDeleting}
                    >
                      <Link href={`/dashboard/cars/new/${car.id}/AddOtherVariationForm`}>
                        <Plus className="mr-1 h-3 w-3" /> Add New Variation
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Palette className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="text-sm font-medium">No Variations Available</h3>
                  <p className="text-[10px] text-muted-foreground mt-1 mb-2">
                    This car doesn't have any variations listed.
                  </p>
                  <Button size="sm" asChild className="h-7 text-[10px]">
                    <Link href={`/dashboard/cars/new/${car.id}/AddOtherVariationForm`}>
                      <Plus className="mr-1 h-3 w-3" /> Add Variation
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right column - Summary and actions */}
        <div className="space-y-3">
          <div className="space-y-1">
            <h1 className="text-xl font-bold">{car.model}</h1>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="flex items-center gap-0.5 text-[10px] h-4 px-1.5">
                <Calendar className="h-2.5 w-2.5" /> {car.year}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-0.5 text-[10px] h-4 px-1.5">
                <Tag className="h-2.5 w-2.5" /> {car.brand?.name || "Unknown"}
              </Badge>
              {car.price && (
                <Badge variant="outline" className="flex items-center gap-0.5 text-[10px] h-4 px-1.5">
                  <DollarSign className="h-2.5 w-2.5" /> {car.price.toLocaleString()}
                </Badge>
              )}
              {car.bodyType && (
                <Badge variant="outline" className="flex items-center gap-0.5 text-[10px] h-4 px-1.5">
                  <Car className="h-2.5 w-2.5" /> {car.bodyType}
                </Badge>
              )}
            </div>
          </div>

          <Card className="rounded-[5px] shadow-sm border border-gray-200 bg-white">
            <CardContent className="p-3 space-y-2">
              <h3 className="text-xs font-medium">Car Summary</h3>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Model:</span>
                  <span className="font-medium">{car.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Year:</span>
                  <span className="font-medium">{car.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Brand:</span>
                  <span className="font-medium">{car.brand?.name || "Unknown"}</span>
                </div>
                {car.price && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium">${car.price.toLocaleString()}</span>
                  </div>
                )}
                {car.mileage && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mileage:</span>
                    <span className="font-medium">{car.mileage.toLocaleString()} km</span>
                  </div>
                )}
                {car.fuelType && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fuel Type:</span>
                    <span className="font-medium">{car.fuelType}</span>
                  </div>
                )}
                {car.transmission && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transmission:</span>
                    <span className="font-medium">{car.transmission}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Variations:</span>
                  <span className="font-medium">{car.otherVariations?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Images:</span>
                  <span className="font-medium">{car.images?.length || 0}</span>
                </div>
              </div>

              <Separator className="my-1" />

              <div className="space-y-1.5">
                <Button
                  className="w-full h-7 text-[10px] bg-brand-primary hover:bg-brand-primary/90 rounded-[5px]"
                  asChild
                  disabled={isDeleting}
                >
                  <Link href={`/dashboard/cars/${car.id}/edit`}>
                    <Pencil className="mr-1 h-3 w-3" /> Edit Car Details
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-7 text-[10px] rounded-[5px] hover:bg-brand-light hover:text-brand-primary"
                  asChild
                  disabled={isDeleting}
                >
                  <Link href={`/dashboard/cars/new/${car.id}/AddOtherVariationForm`}>
                    <Plus className="mr-1 h-3 w-3" /> Add Variation
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {car.otherVariations && car.otherVariations.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-medium">Available Variations</h3>

              <div className="space-y-1">
                {car.otherVariations.slice(0, 5).map((variation) => (
                  <div
                    key={variation.id}
                    className="flex items-center justify-between p-1.5 bg-brand-light/30 rounded-[5px] hover:bg-brand-light/50 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <div
                        className="h-2.5 w-2.5 rounded-full border"
                        style={{ backgroundColor: variation.colorHex || "#cccccc" }}
                      />
                      <span className="text-[10px]">{variation.name}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] py-0 h-4 px-1">
                      <DollarSign className="h-2 w-2 mr-0.5" />
                      {variation.price?.toLocaleString() || "N/A"}
                    </Badge>
                  </div>
                ))}

                {car.otherVariations.length > 5 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-[10px] h-6 mt-0.5"
                    onClick={() => setActiveTab("variations")}
                    disabled={isDeleting}
                  >
                    View all {car.otherVariations.length} variations
                  </Button>
                )}
              </div>
            </div>
          )}

          {car.brand && (
            <div className="space-y-2">
              <h3 className="text-xs font-medium">Brand Information</h3>

              <div className="flex items-center gap-2 p-2 bg-brand-light/30 rounded-[5px] border border-brand-primary/10">
                {car.brand.logo && (
                  <div className="h-8 w-8 rounded-[5px] overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={car.brand.logo || "/placeholder.svg"}
                      alt={car.brand.name}
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.svg?height=32&width=32"
                      }}
                    />
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-medium">{car.brand.name}</h4>
                  <Link
                    href={`/dashboard/brands/${car.brand.id}`}
                    className={`text-[10px] text-primary flex items-center hover:underline ${isDeleting ? "pointer-events-none opacity-50" : ""}`}
                  >
                    View brand details <ExternalLink className="ml-0.5 h-2 w-2" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image preview dialog */}
      <Dialog open={imagePreviewOpen} onOpenChange={setImagePreviewOpen}>
        <DialogContent className="sm:max-w-2xl rounded-[5px] border-brand-primary/20">
          <DialogHeader>
            <DialogTitle className="text-sm">Images for {selectedImageTitle}</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            {selectedImages.length > 0 ? (
              <div className="space-y-3">
                <Carousel className="w-full">
                  <CarouselContent>
                    {selectedImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="flex aspect-video items-center justify-center p-1">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`${selectedImageTitle} image ${index + 1}`}
                            className="max-h-[40vh] w-auto max-w-full object-contain rounded-[5px]"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = "/placeholder.svg"
                            }}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="h-7 w-7" />
                  <CarouselNext className="h-7 w-7" />
                </Carousel>

                <div className="grid grid-cols-6 gap-1.5">
                  {selectedImages.map((image, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="aspect-square rounded-[5px] overflow-hidden border cursor-pointer">
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`Thumbnail ${index + 1}`}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = "/placeholder.svg"
                              }}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="text-[10px]">
                          <p>Image {index + 1}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="text-sm font-medium">No images available</h3>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-[5px] border-red-200">
          <DialogHeader>
            <DialogTitle className="text-sm">Delete Variation</DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to delete the variation "{variationToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-3">
            <Button variant="outline" size="sm" onClick={() => setDeleteDialogOpen(false)} className="h-7 text-xs">
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={deleteVariation}
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
