"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Palette,
  AlertCircle,
  ImageIcon,
  X,
  Save,
  Loader2,
  ArrowLeft,
  DollarSign,
  Check,
  Home,
  Upload,
} from "lucide-react"
import { HexColorPicker, HexColorInput } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ImageGallery from "../../../images-gallery/image-gallery"

export default function EditVariationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const variationId = searchParams.get("id")
  const [activeLang, setActiveLang] = useState("english")

  const [variation, setVariation] = useState({
    // English fields
    name: "",
    colorName: "",
    colorHex: "#000000",
    price: "",
    images: [],

    // Arabic fields
    name_ar: "",
    colorName_ar: "",
  })

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  useEffect(() => {
    if (variationId) fetchVariation()
  }, [variationId])

  const fetchVariation = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(`/api/supabasPrisma/othervariations/${variationId}`)

      // Format the data for the form
      const { en, ar } = response.data

      // Format images to match our component's expected structure
      const formattedImages =
        en.images?.map((url) => ({
          url,
          name: url.split("/").pop(), // Extract filename from URL
        })) || []

      setVariation({
        // English fields
        name: en.name || "",
        colorName: en.colorName || "",
        colorHex: en.colorHex || "#000000",
        price: en.price?.toString() || "",
        images: formattedImages,

        // Arabic fields
        name_ar: ar.name || "",
        colorName_ar: ar.colorName || "",
      })
    } catch (error) {
      console.error("Error fetching variation:", error)
      setError("Failed to fetch variation data. Please try again.")
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

  // Clear all selected images
  const clearAllImages = () => {
    setVariation((prev) => ({
      ...prev,
      images: [],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (
      !variationId ||
      !variation.name ||
      !variation.colorName ||
      !variation.colorHex ||
      variation.images.length === 0 ||
      !variation.price
    ) {
      setError("All fields are required, including at least one image.")
      return
    }

    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      // Format the data for the API
      const formattedVariation = {
        name: variation.name,
        name_ar: variation.name_ar,
        colorName: variation.colorName,
        colorName_ar: variation.colorName_ar,
        colorHex: variation.colorHex,
        price: Number.parseFloat(variation.price),
        images: variation.images.map((img) => img.url),
      }

      await axios.put(`/api/supabasPrisma/othervariations/${variationId}`, formattedVariation)

      setSuccess("Variation updated successfully!")

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" })

      // Navigate back after a short delay
      setTimeout(() => {
        router.back()
      }, 2000)
    } catch (error) {
      console.error("Error updating variation:", error)
      setError("Failed to update variation. Please try again.")
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: "smooth" })
    } finally {
      setSubmitting(false)
    }
  }

  // Render skeleton loading state
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-4 space-y-8">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Card skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-40" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-40" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-10" />
                </div>
                <Skeleton className="h-3 w-40" />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-32" />
              </div>
              <Skeleton className="h-40 w-full rounded-[5px]" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2 pt-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Full-page overlay during submitting
  if (submitting) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-card p-6 rounded-[5px] shadow-lg text-center max-w-md w-full border border-brand-primary/20">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-brand-primary" />
          <h3 className="font-medium text-lg mb-2">Updating Variation</h3>
          <p className="text-muted-foreground">Please wait while we update your variation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Breadcrumb navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Button
          variant="link"
          className="p-0 h-auto font-normal text-muted-foreground"
          onClick={() => router.push("/dashboard")}
        >
          <Home className="h-3.5 w-3.5 mr-1" />
          Dashboard
        </Button>
        <span>/</span>
        <Button
          variant="link"
          className="p-0 h-auto font-normal text-muted-foreground"
          onClick={() => router.push("/dashboard/cars")}
        >
          Cars
        </Button>
        <span>/</span>
        <span className="text-foreground">Edit Variation</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Variation</h1>
          <p className="text-muted-foreground">Update the details for this car variation</p>
        </div>
        <Button variant="outline" onClick={() => router.back()} className="rounded-[5px]">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6 rounded-[5px] border-red-500/50 animate-in fade-in-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 rounded-[5px] border-green-500/50 bg-green-50 text-green-800 animate-in fade-in-50">
          <Check className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="rounded-[5px] shadow-sm border mb-8">
          <CardHeader>
            <CardTitle>Variation Details</CardTitle>
            <CardDescription>Update the information for this car variation</CardDescription>
          </CardHeader>

          <Tabs value={activeLang} onValueChange={setActiveLang} className="flex-1">
            <div className="px-6 pt-2">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="english">English</TabsTrigger>
                <TabsTrigger value="arabic">العربية</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="english" className="m-0">
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Variation Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g. Sport Edition"
                      value={variation.name}
                      onChange={(e) => handleVariationChange("name", e.target.value)}
                      required
                      disabled={submitting}
                      className="rounded-[5px]"
                    />
                    <p className="text-xs text-muted-foreground">Enter a descriptive name for this variation</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Price <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={variation.price}
                        onChange={(e) => handleVariationChange("price", e.target.value)}
                        className="pl-8 rounded-[5px]"
                        required
                        disabled={submitting}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Enter the price for this variation</p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="colorName">
                      Color Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="colorName"
                      placeholder="e.g. Ruby Red"
                      value={variation.colorName}
                      onChange={(e) => handleVariationChange("colorName", e.target.value)}
                      required
                      disabled={submitting}
                      className="rounded-[5px]"
                    />
                    <p className="text-xs text-muted-foreground">Enter a descriptive name for the color</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="colorHex" className="flex items-center gap-1">
                      <Palette className="h-4 w-4" /> Color <span className="text-destructive">*</span>
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
                          className="pl-10 rounded-[5px]"
                          required
                          disabled={submitting}
                        />
                      </div>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-10 p-0 border-2 rounded-[5px]"
                            style={{
                              backgroundColor: variation.colorHex || "#ffffff",
                              borderColor: variation.colorHex ? "transparent" : undefined,
                            }}
                            disabled={submitting}
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
                    <p className="text-xs text-muted-foreground">Select or enter the hex color code</p>
                  </div>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="arabic" className="m-0">
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name_ar">
                      Variation Name (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                    </Label>
                    <Input
                      id="name_ar"
                      placeholder="أدخل اسم النسخة"
                      value={variation.name_ar}
                      onChange={(e) => handleVariationChange("name_ar", e.target.value)}
                      className="rounded-[5px] text-right"
                      disabled={submitting}
                      dir="rtl"
                    />
                    <p className="text-xs text-muted-foreground">Enter the Arabic name for this variation</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="colorName_ar">
                      Color Name (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                    </Label>
                    <Input
                      id="colorName_ar"
                      placeholder="أدخل اسم اللون"
                      value={variation.colorName_ar}
                      onChange={(e) => handleVariationChange("colorName_ar", e.target.value)}
                      className="rounded-[5px] text-right"
                      disabled={submitting}
                      dir="rtl"
                    />
                    <p className="text-xs text-muted-foreground">Enter the Arabic name for the color</p>
                  </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-[5px] border">
                  <p className="text-sm text-center">
                    Note: Color code and price are shared between English and Arabic versions
                  </p>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>

          <Separator className="my-2" />

          <CardContent className="space-y-6 pt-4">
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

          <CardFooter className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={submitting}
              className="rounded-[5px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="gap-2 bg-brand-primary hover:bg-brand-primary/90 rounded-[5px]"
            >
              <Save className="h-4 w-4" />
              Update Variation
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* Gallery Modal */}
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
