"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ImageGallery from "@/app/(dashboard)/dashboard/images-gallery/image-gallery"


export default function EditLogoPage({ params }) {
  const router = useRouter()
  const { id } = params
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Fetch logo data
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/supabasPrisma/logo/${id}`)
        if (!response.ok) throw new Error("Failed to fetch logo")

        const data = await response.json()
        setFormData({
          title: data.title || "",
          imageUrl: data.imageUrl || "",
        })
      } catch (error) {
        console.error("Error fetching logo:", error)
        alert("Failed to load logo data. Please try again.")
        router.push("/dashboard/logos")
      } finally {
        setIsLoading(false)
      }
    }

    fetchLogo()
  }, [id, router])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle image selection from gallery
  const handleImageSelect = (imageUrl) => {
    setFormData((prev) => ({ ...prev, imageUrl }))
    setIsDialogOpen(false)
  }

  // Update logo
  const handleUpdateLogo = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/supabasPrisma/logo/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to update logo")

      // Navigate back to logos list
      router.push("/dashboard/logos")
    } catch (error) {
      console.error("Error updating logo:", error)
      alert("Failed to update logo. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <Button variant="outline" className="mb-4" onClick={() => router.push("/dashboard/logos")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Logos
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Logo</CardTitle>
        </CardHeader>
        <form onSubmit={handleUpdateLogo}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Name</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <div className="flex gap-2">
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  onClick={() => setIsDialogOpen(true)}
                  className="cursor-pointer"
                />
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(true)}>
                  Browse
                </Button>
              </div>
            </div>
            {formData.imageUrl && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                <div className="border rounded-md p-4 flex justify-center">
                  <img
                    src={formData.imageUrl || "/placeholder.svg"}
                    alt="Logo preview"
                    className="max-h-40 object-contain"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=100&width=100"
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/logos")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Logo"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Image Gallery Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Select Brand Logo</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <ImageGallery onSelect={handleImageSelect} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
