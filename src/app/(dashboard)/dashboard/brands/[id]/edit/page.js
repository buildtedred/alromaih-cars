"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2, ImageIcon, Check } from "lucide-react"
import Link from "next/link"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import ImageGallery from "../../../images-gallery/image-gallery"

export default function EditBrandPage() {
  const params = useParams()
  const router = useRouter()
  const brandId = params?.id

  const [brand, setBrand] = useState(null)
  const [name, setName] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [selectedImageUrl, setSelectedImageUrl] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    if (!brandId) return

    async function fetchBrand() {
      try {
        setFetchLoading(true)
        const response = await fetch(`/api/supabasPrisma/carbrands/${brandId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch brand")
        }

        const data = await response.json()
        setBrand(data)
        setName(data.name)
        setSelectedImageUrl(data.image) // Set the selected image URL to the current brand image
      } catch (error) {
        console.error("Error fetching brand:", error)
        setError("Failed to load brand data. Please try again.")
      } finally {
        setFetchLoading(false)
      }
    }

    fetchBrand()
  }, [brandId])

  // Handle image selection
  const handleImageSelect = (url) => {
    setSelectedImageUrl(url)
    setIsDialogOpen(false) // Close the dialog when image is selected
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setUploadStatus(null)

    if (!name.trim()) {
      setError("Brand name is required")
      return
    }

    if (!selectedImageUrl) {
      setError("Please select an image from the gallery")
      return
    }

    try {
      setLoading(true)

      const payload = {
        name,
        image: selectedImageUrl,
      }

      // Use Axios to send the PUT request
      const response = await axios.put(`/api/supabasPrisma/carbrands/${brandId}`, payload)

      // Handle success response
      setUploadStatus("Brand updated successfully! Redirecting...")
      setTimeout(() => {
        router.push("/dashboard/brands")
        router.refresh()
      }, 1000)
    } catch (error) {
      // Handle errors
      console.error("Error updating brand:", error)

      // Check if error is an Axios error and handle it
      if (error.response) {
        setError(error.response.data.error || "Failed to update brand")
      } else {
        setError("Failed to update brand")
      }
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/dashboard/brands">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Brands
            </Link>
          </Button>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        <Card className="shadow-md">
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
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/dashboard/brands">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Brands
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Edit Car Brand</h1>
        <p className="text-muted-foreground">Update the details for {brand?.name}</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {uploadStatus && !error && (
        <Alert className="mb-6">
          <AlertTitle>Status</AlertTitle>
          <AlertDescription>{uploadStatus}</AlertDescription>
        </Alert>
      )}

      <Card className="shadow-md">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Brand Details</CardTitle>
            <CardDescription>Edit the details for this car brand</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">
                Brand Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter brand name"
                className="h-10"
                required
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Brand Logo</Label>

              <div className="border rounded-lg p-6 bg-muted/30">
                {selectedImageUrl ? (
                  <div className="flex flex-col items-center">
                    <div className="relative w-full h-48 mb-4 bg-white rounded-md p-2 shadow-sm">
                      <img
                        src={selectedImageUrl || "/placeholder.svg"}
                        alt="Selected"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          console.error("Image failed to load:", selectedImageUrl)
                          e.target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE2MCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzZiNzI4MCIgZHk9Ii4xZW0iPkJyYW5kIEltYWdlPC90ZXh0Pjwvc3ZnPg=="
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">Image selected</span>
                    </div>
                    <Button type="button" variant="outline" className="mt-4" onClick={() => setIsDialogOpen(true)}>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4 text-center">
                      No image selected. Please select an image from the gallery.
                    </p>
                    <Button type="button" variant="default" onClick={() => setIsDialogOpen(true)}>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Select from Gallery
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-6 border-t">
            <Button variant="outline" type="button" asChild>
              <Link href="/dashboard/brands">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading || !selectedImageUrl}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Brand
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Full-width Image Gallery Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Select Brand Logo</DialogTitle>
            <DialogDescription>Choose an image from your gallery to use as the brand logo.</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <ImageGallery onSelect={handleImageSelect} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
