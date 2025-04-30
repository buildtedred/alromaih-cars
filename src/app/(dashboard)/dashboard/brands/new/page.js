"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, ImageIcon, Check } from "lucide-react"
import Link from "next/link"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import ImageGallery from "../../images-gallery/image-gallery"

export default function NewBrandPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [selectedImageUrl, setSelectedImageUrl] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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

      // Use Axios to send the POST request
      const response = await axios.post("/api/supabasPrisma/carbrands", payload)

      // Handle success response
      setUploadStatus("Brand created successfully! Redirecting...")
      setTimeout(() => {
        router.push("/dashboard/brands")
        router.refresh()
      }, 1000)
    } catch (error) {
      // Handle errors
      console.error("Error creating brand:", error)

      // Check if error is an Axios error and handle it
      if (error.response) {
        setError(error.response.data.error || "Failed to create brand")
      } else {
        setError("Failed to create brand")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/dashboard/brands">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Brands
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Add New Car Brand</h1>
        <p className="text-muted-foreground">Create a new car brand to add to your catalog</p>
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
            <CardDescription>Enter the details for the new car brand</CardDescription>
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
              Create Brand
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
