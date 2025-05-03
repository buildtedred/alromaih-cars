"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ImageIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ImageGallery from "../../images-gallery/image-gallery"

export default function AddLogoPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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

  // Add new logo
  const handleAddLogo = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/supabasPrisma/logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to add logo")
      }

      // Navigate back to logos list
      router.push("/dashboard/logos")
    } catch (error) {
      console.error("Error adding logo:", error)
      alert("Failed to add logo: " + (error.message || "Unknown error"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-600 mb-2">
        <span>Dashboard</span>
        <span className="mx-2">›</span>
        <span>Logos</span>
        <span className="mx-2">›</span>
        <span className="text-gray-900">Add New Logo</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#5D2E8C]">Add New Logo</h1>
          <p className="text-gray-600">Create a new logo to add to your collection</p>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 h-9 px-4 border-gray-300"
          onClick={() => router.push("/dashboard/logos")}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Logos</span>
        </Button>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-[#5D2E8C]">Logo Details</h2>
          <p className="text-sm text-gray-500">Enter the details for the new logo</p>
        </div>

        <form onSubmit={handleAddLogo}>
          {/* Card Content */}
          <div className="px-6 py-5 space-y-6">
            {/* Logo Name Field */}
            <div>
              <label className="block mb-1 font-medium">
                Logo Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="w-full h-10 px-3 border-gray-300"
                placeholder="Enter logo name"
              />
              <p className="mt-1 text-sm text-gray-500">Enter the official name of the logo</p>
            </div>

            {/* Logo Image Field */}
            <div>
              <label className="block mb-1 font-medium">
                Logo Image <span className="text-red-500">*</span>
              </label>
              <div className="border border-gray-300 rounded-md p-6">
                {formData.imageUrl ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={formData.imageUrl || "/placeholder.svg"}
                      alt="Logo preview"
                      className="max-h-40 object-contain mb-4"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=100&width=100"
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(true)}
                      className="h-9 border-gray-300"
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-4 rounded-md mr-4">
                      <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-500 mb-2">No image selected</div>
                      <Button
                        type="button"
                        className="bg-[#5D2E8C] hover:bg-[#4A2470] text-white"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Select from Gallery
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/logos")}
              className="h-9 border-gray-300"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.imageUrl}
              className="h-9 bg-[#9370B5] hover:bg-[#7A5C9A] text-white"
            >
              Create Logo
            </Button>
          </div>
        </form>
      </div>

      {/* Image Gallery Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#5D2E8C]">Select Logo Image</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <ImageGallery onSelect={handleImageSelect} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
