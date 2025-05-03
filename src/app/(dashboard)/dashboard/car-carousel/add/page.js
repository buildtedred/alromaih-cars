"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ImageIcon, Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ImageGallery from "../../images-gallery/image-gallery"


export default function CarCarouselForm({ carousel, isEditing = false }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
  })

  useEffect(() => {
    if (carousel) {
      setFormData({
        title: carousel.title || "",
        description: carousel.description || "",
        imageUrl: carousel.imageUrl || "",
      })
    }
  }, [carousel])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageSelect = (imageUrl) => {
    setFormData((prev) => ({ ...prev, imageUrl }))
    setIsDialogOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      if (!formData.title.trim()) {
        throw new Error("Title is required")
      }
      if (!formData.description.trim()) {
        throw new Error("Description is required")
      }
      if (!formData.imageUrl) {
        throw new Error("Image is required")
      }

      const url = isEditing ? `/api/supabasPrisma/car-carousel?id=${carousel.id}` : "/api/supabasPrisma/car-carousel"

      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Something went wrong")
      }

      alert(isEditing ? "Carousel updated successfully" : "Carousel created successfully")

      router.push("/dashboard/car-carousel")
      router.refresh()
    } catch (error) {
      console.error("Form submission error:", error.message)
      alert(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter carousel title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter carousel description"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Image</Label>
              <div className="flex flex-col gap-4">
                {formData.imageUrl ? (
                  <div className="relative h-48 w-full rounded-md overflow-hidden border">
                    <Image
                      src={formData.imageUrl || "/placeholder.svg"}
                      alt="Selected image"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 w-full border border-dashed rounded-md">
                    <div className="flex flex-col items-center text-muted-foreground">
                      <ImageIcon className="h-8 w-8 mb-2" />
                      <p>No image selected</p>
                    </div>
                  </div>
                )}

                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(true)}>
                  {formData.imageUrl ? "Change Image" : "Select Image"}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? "Updating..." : "Creating..."}
                </div>
              ) : (
                <div className="flex items-center">
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? "Update Carousel" : "Create Carousel"}
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Image Gallery Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Select Carousel Image</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <ImageGallery onSelect={handleImageSelect} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
