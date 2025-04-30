"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Edit, Palette, AlertCircle, Plus, DollarSign, Loader2, ImageIcon, X } from 'lucide-react'
import { HexColorPicker, HexColorInput } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
      const existingUrls = new Set(prev.images.map(img => img.url))
      
      // Filter out any images that are already selected
      const newImages = selectedImages.filter(img => !existingUrls.has(img.url))
      
      return {
        ...prev,
        images: [...prev.images, ...newImages]
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

    setSubmitting(true)
    setError(null)

    try {
      // Format the data for the API
      const formattedVariation = {
        carId,
        ...variation,
        price: Number.parseFloat(variation.price),
        images: variation.images.map((img) => img.url),
      }

      await axios.post("/api/supabasPrisma/othervariations", formattedVariation)

      // Reset form and refresh data
      setVariation({
        name: "",
        colorName: "",
        colorHex: "#000000",
        price: "",
        images: [],
      })

      alert("Variation added successfully!")
      fetchCarData()
    } catch (error) {
      console.error("Error adding variation:", error)
      setError("Failed to add variation. Please try again.")
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
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-20" />
        </div>

        {/* Form skeleton */}
        <div className="border p-6 rounded-lg shadow-sm space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
          </div>

          <Skeleton className="h-0.5 w-full" />

          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>

          <div className="flex justify-end">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Existing variations skeleton */}
        <div className="mt-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="border rounded-lg overflow-hidden">
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
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <Skeleton className="h-4 w-32" />
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                  <div className="flex ml-auto space-x-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Add Variation</h1>
          {carData && (
            <p className="text-muted-foreground">
              For: {carData.model} ({carData.year})
            </p>
          )}
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 border p-6 rounded-lg shadow-sm bg-card mb-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Variation Name</Label>
            <Input
              id="name"
              placeholder="e.g. Sport Edition"
              value={variation.name}
              onChange={(e) => handleVariationChange("name", e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={variation.price}
                onChange={(e) => handleVariationChange("price", e.target.value)}
                className="pl-8"
                required
                disabled={submitting}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="colorName">Color Name</Label>
            <Input
              id="colorName"
              placeholder="e.g. Ruby Red"
              value={variation.colorName}
              onChange={(e) => handleVariationChange("colorName", e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="colorHex" className="flex items-center gap-1">
              <Palette className="h-4 w-4" /> Color
            </Label>
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <div
                    className="h-4 w-4 rounded-full border"
                    style={{ backgroundColor: variation.colorHex || "#000000" }}
                  />
                </div>
                <Input
                  id="colorHex"
                  value={variation.colorHex || ""}
                  onChange={(e) => handleVariationChange("colorHex", e.target.value)}
                  placeholder="#000000"
                  className="pl-10"
                  required
                  disabled={submitting}
                />
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-10 p-0 border-2"
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
                        className="w-full h-8 px-2 border rounded-md text-sm"
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">
              Variation Images <span className="text-destructive">*</span>
            </h3>
            <Button
              type="button"
              variant="default"
              size="sm"
              className="text-xs h-7"
              onClick={() => setIsGalleryOpen(true)}
              disabled={submitting}
            >
              <ImageIcon className="h-3 w-3 mr-1" />
              Select from Gallery
            </Button>
          </div>

          {variation.images.length === 0 ? (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <div className="flex flex-col items-center justify-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground mb-2">No images selected</p>
                <p className="text-xs text-muted-foreground">Select images from gallery</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {variation.images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-md overflow-hidden border">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={`Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={submitting}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Gallery Modal */}
          <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
            <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">Select Images from Gallery</DialogTitle>
                <DialogDescription>Choose multiple images from your gallery for this variation.</DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <ImageGallery onSelectMultiple={handleSelectMultipleImages} multiSelect={true} />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={submitting} className="gap-2">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add Variation
          </Button>
        </div>
      </form>

      {/* Existing Variations Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Existing Variations</h2>

        {/* Loading state for variations table */}
        {loading && (
          <div className="border rounded-lg overflow-hidden">
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
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <Skeleton className="h-4 w-32" />
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                  <div className="flex ml-auto space-x-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && carData?.otherVariations?.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
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
                      <div className="h-12 w-12 rounded-md overflow-hidden bg-muted">
                        <img
                          src={item.images?.[0] || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-cover"
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
                          className="h-4 w-4 rounded-full border"
                          style={{ backgroundColor: item.colorHex || "#cccccc" }}
                        />
                        {item.colorName}
                      </div>
                    </TableCell>
                    <TableCell>${Number.parseFloat(item.price).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => editVariation(item)} disabled={submitting}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => confirmDeleteVariation(item)}
                          disabled={submitting}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          !loading && (
            <div className="text-center p-8 border rounded-lg bg-muted/10">
              <p className="text-muted-foreground">No variations added yet</p>
            </div>
          )
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the variation "{variationToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteVariation} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
