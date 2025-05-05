"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Loader2,
  ImageIcon,
  Check,
  Upload,
  X,
  AlertCircle,
  Plus,
  DollarSign,
  Palette,
  ChevronRight,
  Trash2,
  Edit,
} from "lucide-react"
import Link from "next/link"
import axios from "axios"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { HexColorPicker, HexColorInput } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ImageGallery from "@/app/(dashboard)/dashboard/images-gallery/image-gallery"

export default function AddOtherVariationForm() {
  const { id: carId } = useParams()
  const router = useRouter()

  const [variation, setVariation] = useState({
    name: "",
    colorName: "",
    colorHex: "#000000",
    price: "",
    images: [],
  })

  const [carData, setCarData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [variationToDelete, setVariationToDelete] = useState(null)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  useEffect(() => {
    if (carId) fetchCarData()
  }, [carId])

  const fetchCarData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(`/api/supabasPrisma/cars/${carId}`)
      setCarData(response.data)
    } catch (error) {
      console.error("Error fetching car data:", error)
      setError("Failed to fetch car data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVariationChange = (field, value) => {
    setVariation((prev) => ({ ...prev, [field]: value }))
  }

  // Handle selecting images from the gallery
  const handleSelectMultipleImages = (selectedImages) => {
    // Add the selected images to the variation
    setVariation((prev) => {
      // Create a map of existing image URLs to prevent duplicates
      const existingUrls = new Set(prev.images.map((img) => img.url))

      // Filter out any images that are already selected
      const newImages = selectedImages.filter((img) => !existingUrls.has(img.url))

      return {
        ...prev,
        images: [...prev.images, ...newImages],
      }
    })

    setIsGalleryOpen(false)
  }

  // Remove an image from the selection
  const removeImage = (imageIndex) => {
    setVariation((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== imageIndex),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setUploadStatus(null)

    // Validate form
    if (
      !carId ||
      !variation.name ||
      !variation.colorName ||
      !variation.colorHex ||
      variation.images.length === 0 ||
      !variation.price
    ) {
      setError("All fields are required, including at least one image.")
      return
    }

    try {
      setSubmitting(true)

      // Format the data for the API
      const formattedVariation = {
        carId,
        ...variation,
        price: Number.parseFloat(variation.price),
        images: variation.images.map((img) => img.url),
      }

      await axios.post("/api/supabasPrisma/othervariations", formattedVariation)

      // Set success status
      setUploadStatus("Variation added successfully!")

      // Reset form
      setVariation({
        name: "",
        colorName: "",
        colorHex: "#000000",
        price: "",
        images: [],
      })

      // Refresh data
      setTimeout(() => {
        fetchCarData()
      }, 1000)
    } catch (error) {
      console.error("Error adding variation:", error)

      // Check if error is an Axios error and handle it
      if (error.response) {
        setError(error.response.data.error || "Failed to add variation. Please try again.")
      } else {
        setError("Failed to add variation. Please try again.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  const confirmDeleteVariation = (variation) => {
    setVariationToDelete(variation)
    setDeleteDialogOpen(true)
  }

  const deleteVariation = async () => {
    if (!variationToDelete) return

    setSubmitting(true)
    setDeleteDialogOpen(false)

    try {
      await axios.delete(`/api/supabasPrisma/othervariations/${variationToDelete.id}`)

      // Refresh data
      fetchCarData()
    } catch (error) {
      console.error("Error deleting variation:", error)
      setError("Failed to delete variation. Please try again.")
    } finally {
      setSubmitting(false)
      setVariationToDelete(null)
    }
  }

  const editVariation = (variation) => {
    router.push(`/dashboard/cars/new/EditVariationForm?id=${variation.id}`)
  }

  // Render skeleton loading state
  if (loading && !carData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-4 space-y-8">
        <div className="mb-4">
          <div className="flex items-center text-xs text-muted-foreground mb-2">
            <Skeleton className="h-4 w-20" />
            <ChevronRight className="h-3 w-3 mx-1 text-muted-foreground/30" />
            <Skeleton className="h-4 w-12" />
            <ChevronRight className="h-3 w-3 mx-1 text-muted-foreground/30" />
            <Skeleton className="h-4 w-16" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <Skeleton className="h-7 w-32 mb-1" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-8 w-32" />
          </div>
        </div>

        <Card className="shadow-md border-brand-primary/10 overflow-hidden rounded-[5px]">
          <CardHeader className="bg-brand-light/30 border-b border-brand-primary/10 py-3 px-4">
            <Skeleton className="h-5 w-24 mb-1" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>

          <CardContent className="space-y-4 pt-4 px-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-9 w-full rounded-[5px]" />
                <Skeleton className="h-4 w-56 mt-1" />
              </div>

              <div className="space-y-1">
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-9 w-full rounded-[5px]" />
                <Skeleton className="h-4 w-56 mt-1" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-9 w-full rounded-[5px]" />
                <Skeleton className="h-4 w-56 mt-1" />
              </div>

              <div className="space-y-1">
                <Skeleton className="h-4 w-20 mb-1" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1 rounded-[5px]" />
                  <Skeleton className="h-9 w-9 rounded-[5px]" />
                </div>
                <Skeleton className="h-4 w-56 mt-1" />
              </div>
            </div>

            <Skeleton className="h-px w-full my-2" />

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-7 w-32 rounded-[5px]" />
              </div>

              <Skeleton className="h-32 w-full rounded-[5px]" />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2 py-3 px-4 border-t bg-muted/20">
            <Skeleton className="h-8 w-20 rounded-[5px]" />
            <Skeleton className="h-8 w-28 rounded-[5px]" />
          </CardFooter>
        </Card>

        {/* Existing variations skeleton */}
        <div className="mt-8">
          <Skeleton className="h-7 w-48 mb-4" />
          <Card className="shadow-md border-brand-primary/10 overflow-hidden rounded-[5px]">
            <div className="p-4">
              <div className="flex items-center space-x-4 mb-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 py-4 border-t">
                  <Skeleton className="h-12 w-12 rounded-[5px]" />
                  <Skeleton className="h-4 w-32" />
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-[50%]" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                  <div className="flex ml-auto space-x-2">
                    <Skeleton className="h-8 w-8 rounded-[50%]" />
                    <Skeleton className="h-8 w-8 rounded-[50%]" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Full-page overlay during submitting or deleting
  if (submitting) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-card p-6 rounded-[5px] shadow-lg text-center max-w-md w-full border border-brand-primary/20">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-brand-primary" />
          <h3 className="font-medium text-lg mb-2">{variationToDelete ? "Deleting Variation" : "Adding Variation"}</h3>
          <p className="text-muted-foreground">Please wait while we process your request...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 relative">
      <div className="mb-4">
        <div className="flex items-center text-xs text-muted-foreground mb-2">
          <Link href="/dashboard" className="hover:text-brand-primary transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="h-3 w-3 mx-1" />
          <Link href="/dashboard/cars" className="hover:text-brand-primary transition-colors">
            Cars
          </Link>
          <ChevronRight className="h-3 w-3 mx-1" />
          {carData && (
            <>
              <Link href={`/dashboard/cars/${carId}`} className="hover:text-brand-primary transition-colors">
                {carData.model}
              </Link>
              <ChevronRight className="h-3 w-3 mx-1" />
            </>
          )}
          <span className="text-foreground">Add Variation</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-brand-primary">Add New Variation</h1>
            {carData && (
              <p className="text-xs text-muted-foreground">
                Create a new variation for {carData.model} ({carData.year})
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto h-8 text-xs rounded-[5px]"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Car
          </Button>
        </div>
      </div>

      {error && (
        <Alert
          variant="destructive"
          className="mb-3 py-2 text-sm animate-in fade-in-50 slide-in-from-top-5 duration-300 rounded-[5px]"
        >
          <AlertCircle className="h-3.5 w-3.5" />
          <AlertTitle className="text-sm font-medium">Error</AlertTitle>
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      {uploadStatus && !error && (
        <Alert className="mb-3 py-2 text-sm bg-green-50 text-green-800 border-green-200 animate-in fade-in-50 slide-in-from-top-5 duration-300 rounded-[5px]">
          <Check className="h-3.5 w-3.5 text-green-600" />
          <AlertTitle className="text-sm font-medium">Success</AlertTitle>
          <AlertDescription className="text-xs">{uploadStatus}</AlertDescription>
        </Alert>
      )}

      <Card className="shadow-md border-brand-primary/10 overflow-hidden rounded-[5px] mb-6">
        <form onSubmit={handleSubmit} className="rounded-[5px]">
          <CardHeader className="bg-brand-light/30 border-b border-brand-primary/10 py-3 px-4">
            <CardTitle className="text-base text-brand-primary">Variation Details</CardTitle>
            <CardDescription className="text-xs">Enter the details for the new variation</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-4 px-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-sm font-medium">
                  Variation Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Sport Edition"
                  value={variation.name}
                  onChange={(e) => handleVariationChange("name", e.target.value)}
                  className="h-9 text-sm focus-visible:ring-brand-primary rounded-[5px]"
                  required
                />
                <p className="text-xs text-muted-foreground">Enter the name of this variation</p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="price" className="text-sm font-medium">
                  Price <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    value={variation.price}
                    onChange={(e) => handleVariationChange("price", e.target.value)}
                    className="pl-8 h-9 text-sm focus-visible:ring-brand-primary rounded-[5px]"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">Enter the price for this variation</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="colorName" className="text-sm font-medium">
                  Color Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="colorName"
                  placeholder="e.g. Ruby Red"
                  value={variation.colorName}
                  onChange={(e) => handleVariationChange("colorName", e.target.value)}
                  className="h-9 text-sm focus-visible:ring-brand-primary rounded-[5px]"
                  required
                />
                <p className="text-xs text-muted-foreground">Enter the name of the color</p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="colorHex" className="text-sm font-medium flex items-center gap-1">
                  <Palette className="h-4 w-4" /> Color <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <div
                        className="h-4 w-4 rounded-[50%] border"
                        style={{ backgroundColor: variation.colorHex || "#000000" }}
                      />
                    </div>
                    <Input
                      id="colorHex"
                      value={variation.colorHex || ""}
                      onChange={(e) => handleVariationChange("colorHex", e.target.value)}
                      placeholder="#000000"
                      className="pl-10 h-9 text-sm focus-visible:ring-brand-primary rounded-[5px]"
                      required
                    />
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-9 h-9 p-0 border-2 rounded-[5px]"
                        style={{
                          backgroundColor: variation.colorHex || "#ffffff",
                          borderColor: variation.colorHex ? "transparent" : undefined,
                        }}
                      >
                        <span className="sr-only">Pick a color</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3" align="end">
                      <div className="space-y-3">
                        <HexColorPicker
                          color={variation.colorHex}
                          onChange={(color) => handleVariationChange("colorHex", color)}
                        />
                        <div className="flex items-center">
                          <span className="mr-2 text-sm font-medium">HEX:</span>
                          <HexColorInput
                            color={variation.colorHex}
                            onChange={(color) => handleVariationChange("colorHex", color)}
                            prefixed
                            className="w-full h-8 px-2 border rounded-[5px] text-sm"
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <p className="text-xs text-muted-foreground">Select or enter the color hex code</p>
              </div>
            </div>

            <Separator className="my-2" />

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">
                  Variation Images <span className="text-red-500">*</span>
                </Label>
                {variation.images.length > 0 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded-[5px]"
                          onClick={() => setVariation((prev) => ({ ...prev, images: [] }))}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Clear All
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Remove all selected images</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>

              <div className="border rounded-[5px] bg-muted/30 overflow-hidden">
                {variation.images.length === 0 ? (
                  <div className="flex items-center gap-3 p-3">
                    <div className="h-10 w-10 rounded-[5px] bg-brand-light/50 flex items-center justify-center flex-shrink-0">
                      <Upload className="h-5 w-5 text-brand-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium mb-1">No images selected</p>
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        className="h-7 text-xs bg-brand-primary hover:bg-brand-primary/90 rounded-[5px]"
                        onClick={() => setIsGalleryOpen(true)}
                      >
                        <ImageIcon className="h-3 w-3 mr-1.5" />
                        Select from Gallery
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="h-4 w-4 rounded-[50%] bg-green-100 flex items-center justify-center">
                        <Check className="h-2.5 w-2.5 text-green-600" />
                      </div>
                      <span className="text-xs text-green-700 font-medium">
                        {variation.images.length} {variation.images.length === 1 ? "image" : "images"} selected
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
                      {variation.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-[5px] overflow-hidden border bg-white p-1">
                            <img
                              src={image.url || "/placeholder.svg"}
                              alt={`Image ${index + 1}`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-black/70 text-white rounded-[50%] p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs rounded-[5px] w-full sm:w-auto"
                      onClick={() => setIsGalleryOpen(true)}
                    >
                      <ImageIcon className="h-3 w-3 mr-1.5" />
                      Add More Images
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Select one or more images for this variation</p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2 py-3 px-4 border-t bg-muted/20">
            <Button variant="outline" type="button" className="h-8 text-xs rounded-[5px]" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                submitting ||
                !variation.name.trim() ||
                !variation.colorName.trim() ||
                !variation.colorHex ||
                !variation.price ||
                variation.images.length === 0
              }
              className="h-8 text-xs bg-brand-primary hover:bg-brand-primary/90 rounded-[5px] flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Variation
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Existing Variations Section */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-3 text-brand-primary">Existing Variations</h2>

        {loading ? (
          <Card className="shadow-md border-brand-primary/10 overflow-hidden rounded-[5px]">
            <div className="p-4">
              <div className="flex items-center space-x-4 mb-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 py-4 border-t">
                  <Skeleton className="h-12 w-12 rounded-[5px]" />
                  <Skeleton className="h-4 w-32" />
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-[50%]" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                  <div className="flex ml-auto space-x-2">
                    <Skeleton className="h-8 w-8 rounded-[50%]" />
                    <Skeleton className="h-8 w-8 rounded-[50%]" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : carData?.otherVariations?.length > 0 ? (
          <Card className="shadow-md border-brand-primary/10 overflow-hidden rounded-[5px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carData.otherVariations.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="h-12 w-12 rounded-[5px] overflow-hidden bg-white p-1 border">
                        <img
                          src={item.images?.[0] || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "/placeholder.svg?height=48&width=48"
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-4 w-4 rounded-[50%] border"
                          style={{ backgroundColor: item.colorHex || "#cccccc" }}
                        />
                        {item.colorName}
                      </div>
                    </TableCell>
                    <TableCell>${Number.parseFloat(item.price).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => editVariation(item)}
                                disabled={submitting}
                                className="h-8 w-8 rounded-[5px]"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Edit variation</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 rounded-[5px]"
                                onClick={() => confirmDeleteVariation(item)}
                                disabled={submitting}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Delete variation</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        ) : (
          <Card className="shadow-md border-brand-primary/10 overflow-hidden rounded-[5px] bg-muted/10">
            <div className="text-center p-8">
              <p className="text-muted-foreground text-sm">No variations added yet</p>
            </div>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-[5px]">
          <DialogHeader>
            <DialogTitle className="text-base text-brand-primary">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to delete the variation "{variationToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={submitting}
              className="h-8 text-xs rounded-[5px]"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteVariation}
              disabled={submitting}
              className="h-8 text-xs rounded-[5px] flex items-center gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Gallery Dialog */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="sm:max-w-[85vw] max-h-[85vh] overflow-hidden p-0 rounded-[5px]">
          <DialogHeader className="px-4 pt-4 pb-3 border-b">
            <DialogTitle className="text-base text-brand-primary">Select Variation Images</DialogTitle>
            <DialogDescription className="text-xs">
              Choose one or more images from your gallery for this variation
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(85vh-8rem)] p-4">
            <ImageGallery onSelectMultiple={handleSelectMultipleImages} multiSelect={true} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
