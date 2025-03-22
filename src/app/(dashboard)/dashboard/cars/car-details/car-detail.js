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

export default function CarDetail({ id }) {
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
  const [viewMode, setViewMode] = useState("table") // "grid" or "table"

  useEffect(() => {
    if (id) {
      fetchCarDetails(id)
    }
  }, [id])

  async function fetchCarDetails(carId) {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/supabasPrisma/cars/${carId}`)

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

      setCar(data)
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
      fetchCarDetails(id)
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
      <div className="container mx-auto px-4 py-4 max-w-7xl space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-9 w-28" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <Skeleton className="h-[350px] w-full rounded-lg" />
            <div className="flex gap-2 overflow-x-auto py-1">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-16 flex-shrink-0 rounded-md" />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
            </div>
            <Skeleton className="h-[180px] w-full rounded-lg" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
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
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="bg-destructive/15 p-5 rounded-lg text-destructive">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Error Loading Car Details</h2>
          </div>
          <p className="mb-3">{error}</p>
          <Button onClick={() => fetchCarDetails(id)}>Try Again</Button>
        </div>
      </div>
    )
  }

  // Render no data state
  if (!car) {
    return (
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="bg-muted p-5 rounded-lg text-center">
          <Car className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <h2 className="text-lg font-semibold mb-2">Car Not Found</h2>
          <p className="text-muted-foreground mb-3">The car you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/dashboard/cars">View All Cars</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-7xl space-y-6">
      {/* Header with navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back
          </Button>
          <div className="flex items-center text-muted-foreground text-sm">
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <ChevronRight className="h-3.5 w-3.5 mx-1" />
            <Link href="/dashboard/cars" className="hover:underline">
              Cars
            </Link>
            <ChevronRight className="h-3.5 w-3.5 mx-1" />
            <span className="text-foreground font-medium truncate">{car.model}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button asChild size="sm">
            <Link href={`/dashboard/cars/${car.id}/edit`}>Edit Car</Link>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Car images */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
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
                <Car className="h-12 w-12 text-muted-foreground" />
              </div>
            )}

            {car.images && car.images.length > 0 && (
              <Button
                className="absolute bottom-3 right-3"
                size="sm"
                onClick={() => openImagePreview(car.images, car.model)}
              >
                <ImageIcon className="mr-1.5 h-3.5 w-3.5" /> View All Images
              </Button>
            )}
          </div>

          {car.images && car.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto py-1 pb-2">
              {car.images.map((image, index) => (
                <div
                  key={index}
                  className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden border cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => openImagePreview(car.images, car.model)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${car.model} image ${index + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "/placeholder.svg?height=64&width=64"
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Car details tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="details" className="text-xs py-1.5">
                Basic Details
              </TabsTrigger>
              <TabsTrigger value="technical" className="text-xs py-1.5">
                Technical
              </TabsTrigger>
              <TabsTrigger value="specifications" className="text-xs py-1.5">
                Specifications
              </TabsTrigger>
              <TabsTrigger value="variations" className="text-xs py-1.5">
                Variations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Model</span>
                        <p className="text-sm font-medium">{car.model || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Year</span>
                        <p className="text-sm font-medium">{car.year || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Brand</span>
                        <div className="flex items-center gap-1">
                          {car.brand?.image && (
                            <div className="h-4 w-4 rounded overflow-hidden bg-muted">
                              <img
                                src={car.brand.image || "/placeholder.svg"}
                                alt={car.brand.name}
                                className="h-full w-full object-contain"
                              />
                            </div>
                          )}
                          <p className="text-sm font-medium">{car.brand?.name || "Unknown"}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Price</span>
                        <p className="text-sm font-medium">{car.price ? `$${car.price.toLocaleString()}` : "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Color</span>
                        <p className="text-sm font-medium">{car.color || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Condition</span>
                        <p className="text-sm font-medium">{car.condition || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Body Type</span>
                        <p className="text-sm font-medium">{car.bodyType || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Manufactured In</span>
                        <p className="text-sm font-medium">{car.manufactured || "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Registration</span>
                        <p className="text-sm font-medium">{car.registration || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Previous Owners</span>
                        <p className="text-sm font-medium">{car.ownerCount || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Insurance Status</span>
                        <p className="text-sm font-medium">{car.insuranceStatus || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Tax Validity</span>
                        <p className="text-sm font-medium">
                          {car.taxValidity ? format(new Date(car.taxValidity), "dd MMM yyyy") : "N/A"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Safety Rating</span>
                        <p className="text-sm font-medium">{car.safetyRating || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Warranty</span>
                        <p className="text-sm font-medium">{car.warranty || "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {car.description && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Description</h3>
                  <div className="p-4 bg-muted/50 rounded-md">
                    <p className="text-sm">{car.description}</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="technical" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Engine & Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Gauge className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Engine Size</span>
                        </div>
                        <p className="text-sm font-medium">{car.engineSize ? `${car.engineSize}L` : "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Horsepower</span>
                        </div>
                        <p className="text-sm font-medium">{car.horsepower ? `${car.horsepower} HP` : "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Dumbbell className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Torque</span>
                        </div>
                        <p className="text-sm font-medium">{car.torque ? `${car.torque} Nm` : "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Speedometer className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Top Speed</span>
                        </div>
                        <p className="text-sm font-medium">{car.topSpeed ? `${car.topSpeed} km/h` : "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Timer className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">0-100 km/h</span>
                        </div>
                        <p className="text-sm font-medium">{car.acceleration ? `${car.acceleration}s` : "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Compass className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Wheel Drive</span>
                        </div>
                        <p className="text-sm font-medium">{car.wheelDrive || "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Fuel & Transmission</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Fuel className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Fuel Type</span>
                        </div>
                        <p className="text-sm font-medium">{car.fuelType || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Droplets className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Fuel Tank</span>
                        </div>
                        <p className="text-sm font-medium">
                          {car.fuelTankCapacity ? `${car.fuelTankCapacity}L` : "N/A"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Leaf className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Fuel Economy</span>
                        </div>
                        <p className="text-sm font-medium">{car.fuelEconomy ? `${car.fuelEconomy} km/L` : "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Cog className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Transmission</span>
                        </div>
                        <p className="text-sm font-medium">{car.transmission || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Milestone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Mileage</span>
                        </div>
                        <p className="text-sm font-medium">
                          {car.mileage ? `${car.mileage.toLocaleString()} km` : "N/A"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Interior & Capacity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Armchair className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Seats</span>
                        </div>
                        <p className="text-sm font-medium">{car.seats || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Truck className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Doors</span>
                        </div>
                        <p className="text-sm font-medium">{car.doors || "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${car.gps ? "bg-green-500" : "bg-muted"}`}></div>
                        <span className="text-xs">GPS Navigation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${car.sunroof ? "bg-green-500" : "bg-muted"}`}></div>
                        <span className="text-xs">Sunroof</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-3 w-3 rounded-full ${car.parkingSensors ? "bg-green-500" : "bg-muted"}`}
                        ></div>
                        <span className="text-xs">Parking Sensors</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-3 w-3 rounded-full ${car.cruiseControl ? "bg-green-500" : "bg-muted"}`}
                        ></div>
                        <span className="text-xs">Cruise Control</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${car.leatherSeats ? "bg-green-500" : "bg-muted"}`}></div>
                        <span className="text-xs">Leather Seats</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${car.heatedSeats ? "bg-green-500" : "bg-muted"}`}></div>
                        <span className="text-xs">Heated Seats</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${car.bluetooth ? "bg-green-500" : "bg-muted"}`}></div>
                        <span className="text-xs">Bluetooth</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-3 w-3 rounded-full ${car.climateControl ? "bg-green-500" : "bg-muted"}`}
                        ></div>
                        <span className="text-xs">Climate Control</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${car.keylessEntry ? "bg-green-500" : "bg-muted"}`}></div>
                        <span className="text-xs">Keyless Entry</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${car.rearCamera ? "bg-green-500" : "bg-muted"}`}></div>
                        <span className="text-xs">Rear Camera</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {car.infotainment && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Infotainment System</h3>
                  <div className="p-4 bg-muted/50 rounded-md">
                    <p className="text-sm">{car.infotainment || "N/A"}</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="specifications" className="space-y-4">
              {car.spacification && car.spacification.length > 0 ? (
                <div className="space-y-4">
                  {car.spacification.map((spec, index) => (
                    <div key={index} className="space-y-3">
                      <h3 className="text-base font-medium">{spec.title || `Specification Group ${index + 1}`}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {spec.details?.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex justify-between p-2 bg-muted/50 rounded-md">
                            <span className="text-xs text-muted-foreground">{detail.label}</span>
                            <span className="text-xs font-medium">{detail.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Info className="h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="text-base font-medium">No Specifications Available</h3>
                  <p className="text-xs text-muted-foreground mt-1">This car doesn't have any specifications listed.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="variations" className="space-y-4">
              {car.otherVariations && car.otherVariations.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-medium">Available Variations</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className={`h-7 px-2 ${viewMode === "grid" ? "bg-muted" : ""}`}
                      >
                        <span className="text-xs">Grid</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewMode("table")}
                        className={`h-7 px-2 ${viewMode === "table" ? "bg-muted" : ""}`}
                      >
                        <span className="text-xs">Table</span>
                      </Button>
                    </div>
                  </div>

                  {viewMode === "table" ? (
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Color</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {car.otherVariations.map((variation) => (
                            <TableRow key={variation.id}>
                              <TableCell>
                                <div className="h-10 w-10 rounded-md overflow-hidden bg-muted">
                                  {variation.images && variation.images.length > 0 ? (
                                    <img
                                      src={variation.images[0] || "/placeholder.svg"}
                                      alt={variation.name}
                                      className="h-full w-full object-cover"
                                      onError={(e) => {
                                        e.target.onerror = null
                                        e.target.src = "/placeholder.svg?height=40&width=40"
                                      }}
                                    />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center">
                                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="font-medium text-sm">{variation.name}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1.5">
                                  <div
                                    className="h-3 w-3 rounded-full border"
                                    style={{ backgroundColor: variation.colorHex || "#cccccc" }}
                                  />
                                  <span className="text-xs">{variation.colorName}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  <DollarSign className="h-3 w-3 mr-0.5" />
                                  {variation.price?.toLocaleString() || "N/A"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                                    <Link href={`/dashboard/variations/${variation.id}`}>
                                      <Eye className="h-3.5 w-3.5" />
                                    </Link>
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                                    <Link href={`/dashboard/cars/new/EditVariationForm?id=${variation.id}`}>
                                      <Pencil className="h-3.5 w-3.5" />
                                    </Link>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-destructive hover:text-destructive"
                                    onClick={() => confirmDeleteVariation(variation)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {car.otherVariations.map((variation) => (
                        <Card key={variation.id} className="overflow-hidden">
                          <div className="relative aspect-video bg-muted">
                            {variation.images && variation.images.length > 0 ? (
                              <img
                                src={variation.images[0] || "/placeholder.svg"}
                                alt={variation.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null
                                  e.target.src = "/placeholder.svg?height=160&width=240"
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="h-10 w-10 text-muted-foreground" />
                              </div>
                            )}

                            {variation.images && variation.images.length > 0 && (
                              <Button
                                size="sm"
                                variant="secondary"
                                className="absolute bottom-2 right-2 h-7 px-2 text-xs"
                                onClick={() => openImagePreview(variation.images, variation.name)}
                              >
                                <ImageIcon className="mr-1 h-3 w-3" /> View Images
                              </Button>
                            )}
                          </div>

                          <CardContent className="p-3 space-y-3">
                            <div>
                              <h3 className="text-sm font-medium">{variation.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                  <div
                                    className="h-3 w-3 rounded-full border"
                                    style={{ backgroundColor: variation.colorHex || "#cccccc" }}
                                  />
                                  <span className="text-xs text-muted-foreground">{variation.colorName}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-between items-center">
                              <Badge variant="outline" className="px-2 py-0.5 text-xs">
                                <DollarSign className="h-3 w-3 mr-0.5" />
                                {variation.price?.toLocaleString() || "N/A"}
                              </Badge>

                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                                  <Link href={`/dashboard/variations/${variation.id}`}>
                                    <Eye className="h-3.5 w-3.5" />
                                  </Link>
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                                  <Link href={`/dashboard/variations/edit?id=${variation.id}`}>
                                    <Pencil className="h-3.5 w-3.5" />
                                  </Link>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-destructive hover:text-destructive"
                                  onClick={() => confirmDeleteVariation(variation)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" asChild className="h-8 text-xs">
                      <Link href={`/dashboard/cars/new/${car.id}/AddOtherVariationForm`}>
                        <Plus className="mr-1 h-3.5 w-3.5" /> Add New Variation
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Palette className="h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="text-base font-medium">No Variations Available</h3>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">
                    This car doesn't have any variations listed.
                  </p>
                  <Button size="sm" asChild>
                    <Link href={`/dashboard/cars/new/${car.id}/AddOtherVariationForm`}>
                      <Plus className="mr-1 h-3.5 w-3.5" /> Add Variation
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right column - Summary and actions */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{car.model}</h1>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className="flex items-center gap-1 text-xs">
                <Calendar className="h-3 w-3" /> {car.year}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                <Tag className="h-3 w-3" /> {car.brand?.name || "Unknown"}
              </Badge>
              {car.price && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                  <DollarSign className="h-3 w-3" /> {car.price.toLocaleString()}
                </Badge>
              )}
              {car.bodyType && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                  <Car className="h-3 w-3" /> {car.bodyType}
                </Badge>
              )}
            </div>
          </div>

          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-medium">Car Summary</h3>

              <div className="space-y-2 text-sm">
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

              <div className="space-y-2">
                <Button className="w-full h-8 text-xs" asChild>
                  <Link href={`/dashboard/cars/${car.id}/edit`}>Edit Car Details</Link>
                </Button>

                <Button variant="outline" className="w-full h-8 text-xs" asChild>
                  <Link href={`/dashboard/cars/new/${car.id}/AddOtherVariationForm`}>
                    <Plus className="mr-1 h-3.5 w-3.5" /> Add Variation
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {car.otherVariations && car.otherVariations.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Available Variations</h3>

              <div className="space-y-1.5">
                {car.otherVariations.slice(0, 5).map((variation) => (
                  <div
                    key={variation.id}
                    className="flex items-center justify-between p-2 bg-muted/50 rounded-md hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <div
                        className="h-3 w-3 rounded-full border"
                        style={{ backgroundColor: variation.colorHex || "#cccccc" }}
                      />
                      <span className="text-xs">{variation.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <DollarSign className="h-2.5 w-2.5 mr-0.5" />
                      {variation.price?.toLocaleString() || "N/A"}
                    </Badge>
                  </div>
                ))}

                {car.otherVariations.length > 5 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs h-7 mt-1"
                    onClick={() => setActiveTab("variations")}
                  >
                    View all {car.otherVariations.length} variations
                  </Button>
                )}
              </div>
            </div>
          )}

          {car.brand && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Brand Information</h3>

              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                {car.brand.image && (
                  <div className="h-10 w-10 rounded overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={car.brand.image || "/placeholder.svg"}
                      alt={car.brand.name}
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.svg?height=40&width=40"
                      }}
                    />
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-medium">{car.brand.name}</h4>
                  <Link
                    href={`/dashboard/brands/${car.brand.id}`}
                    className="text-xs text-primary flex items-center hover:underline"
                  >
                    View brand details <ExternalLink className="ml-0.5 h-2.5 w-2.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image preview dialog */}
      <Dialog open={imagePreviewOpen} onOpenChange={setImagePreviewOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Images for {selectedImageTitle}</DialogTitle>
          </DialogHeader>
          <div className="mt-3">
            {selectedImages.length > 0 ? (
              <div className="space-y-4">
                <Carousel className="w-full">
                  <CarouselContent>
                    {selectedImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="flex aspect-video items-center justify-center p-1">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`${selectedImageTitle} image ${index + 1}`}
                            className="max-h-[50vh] w-auto max-w-full object-contain rounded-md"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = "/placeholder.svg"
                            }}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>

                <div className="grid grid-cols-6 gap-2">
                  {selectedImages.map((image, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="aspect-square rounded-md overflow-hidden border cursor-pointer">
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
                        <TooltipContent>
                          <p className="text-xs">Image {index + 1}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <ImageIcon className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="text-base font-medium">No images available</h3>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Variation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the variation "{variationToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" size="sm" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={deleteVariation} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

