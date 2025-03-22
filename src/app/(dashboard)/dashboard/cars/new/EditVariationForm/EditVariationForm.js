"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { createClient } from "@supabase/supabase-js"
import { Trash2, Upload, Palette, AlertCircle } from "lucide-react"
import { HexColorPicker, HexColorInput } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"

// Initialize Supabase
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export default function EditVariationForm() {
  const searchParams = useSearchParams()
  const variationId = searchParams.get("id")
  const router = useRouter()

  const [variation, setVariation] = useState({
    name: "",
    colorName: "",
    colorHex: "#000000",
    price: "",
    images: [],
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (variationId) fetchVariation()
  }, [variationId])

  // Fetch existing variation
  const fetchVariation = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/supabasPrisma/othervariations/${variationId}`)
      const fetchedVariation = response.data

      // Ensure images are formatted correctly
      const formattedImages = Array.isArray(fetchedVariation.images)
        ? fetchedVariation.images.map((img) =>
            typeof img === "string" ? { url: img, name: img.split("/").pop() } : img,
          )
        : []

      setVariation({
        ...fetchedVariation,
        images: formattedImages,
        colorHex: fetchedVariation.colorHex || "#000000", // Ensure colorHex has a default value
      })
    } catch (error) {
      console.error("Error fetching variation:", error)
      setError("Failed to load variation. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handle input changes
  const handleVariationChange = (field, value) => {
    setVariation((prev) => ({ ...prev, [field]: value }))
  }

  // Upload new images to Supabase
  const uploadImages = async (files) => {
    if (!files.length) return

    setIsUploading(true)
    setUploadProgress(0)

    const totalFiles = files.length
    let completedFiles = 0

    const uploadedImages = await Promise.all(
      [...files].map(async (file) => {
        const fileName = `cars/${Date.now()}_${file.name}`
        const { error } = await supabase.storage.from("Alromaih").upload(fileName, file)

        completedFiles++
        setUploadProgress(Math.round((completedFiles / totalFiles) * 100))

        if (error) {
          console.error("Upload error:", error)
          return null
        }

        return {
          url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Alromaih/${fileName}`,
          name: fileName,
        }
      }),
    )

    setVariation((prev) => ({
      ...prev,
      images: [...prev.images, ...uploadedImages.filter((img) => img !== null)],
    }))

    setIsUploading(false)
  }

  // Remove image from Supabase storage
  const removeImage = async (imageIndex, fileName) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    setLoading(true)
    try {
      // Extract the path from the full URL if needed
      const path =
        typeof fileName === "string" && fileName.includes("Alromaih/") ? fileName.split("Alromaih/")[1] : fileName

      await supabase.storage.from("Alromaih").remove([path])

      setVariation((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== imageIndex),
      }))
    } catch (error) {
      console.error("Error removing image:", error)
      setError("Failed to remove image. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Submit updated variation
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Format the data for the API
      const formattedVariation = {
        ...variation,
        price: Number.parseFloat(variation.price),
        images: variation.images.map((img) => (typeof img === "string" ? img : img.url)),
      }

      await axios.put(`/api/supabasPrisma/othervariations/${variationId}`, formattedVariation)

      alert("Variation updated successfully!")
      // router.push("/dashboard/cars")
    } catch (error) {
      console.error("Update error:", error)
      setError("Failed to update variation. Please check your inputs and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Variation</h1>
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

      <form onSubmit={handleSubmit} className="space-y-6 border p-6 rounded-lg shadow-sm bg-card">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Variation Name</Label>
            <Input
              id="name"
              placeholder="e.g. Sport Edition"
              value={variation.name}
              onChange={(e) => handleVariationChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              placeholder="0.00"
              value={variation.price}
              onChange={(e) => handleVariationChange("price", e.target.value)}
              required
            />
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
                />
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-10 p-0 border-2"
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

        <div className="space-y-4">
          <Label>Variation Images</Label>

          <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-6 relative">
            <input
              type="file"
              multiple
              onChange={(e) => uploadImages(e.target.files)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={isUploading}
            />
            <div className="text-center">
              <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm font-medium mb-1">Drag & drop images here or click to browse</p>
              <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, WebP</p>

              {isUploading && (
                <div className="mt-4 w-full">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs mt-1 text-center">{uploadProgress}% uploaded</p>
                </div>
              )}
            </div>
          </div>

          {/* Display existing images */}
          {variation.images && variation.images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {variation.images.map((img, imgIndex) => (
                <Card key={imgIndex} className="overflow-hidden">
                  <div className="relative aspect-square">
                    <img
                      src={typeof img === "string" ? img : img.url}
                      alt={`Variation image ${imgIndex + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.svg?height=100&width=100"
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={() => removeImage(imgIndex, typeof img === "string" ? img : img.name)}
                    >
                      <Trash2 size={16} />
                      <span className="sr-only">Remove image</span>
                    </Button>
                  </div>
                  <CardContent className="p-2">
                    <p className="text-xs truncate text-muted-foreground">Image {imgIndex + 1}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 border rounded-md bg-muted/10">
              <p className="text-muted-foreground">No images uploaded yet</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Variation"}
          </Button>
        </div>
      </form>
    </div>
  )
}

