"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, ImageIcon, Check, Upload, X, AlertCircle, ChevronRight } from 'lucide-react'
import Link from "next/link"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ImageGallery from "../../images-gallery/image-gallery"

export default function AddLogoPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [selectedImageUrl, setSelectedImageUrl] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleNameChange = (e) => {
    const newName = e.target.value
    setName(newName)
  }

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
      setError("Logo name is required")
      return
    }

    if (!selectedImageUrl) {
      setError("Please select an image from the gallery")
      return
    }

    try {
      setLoading(true)

      const payload = {
        title: name,
        imageUrl: selectedImageUrl,
      }

      // Use Axios to send the POST request
      const response = await axios.post("/api/supabasPrisma/logo", payload)

      // Handle success response
      setUploadStatus("Logo created successfully!")
      router.push("/dashboard/logos")
      router.refresh()
    } catch (error) {
      // Handle errors
      console.error("Error creating logo:", error)

      // Check if error is an Axios error and handle it
      if (error.response) {
        setError(error.response.data.error || "Failed to create logo. It may already exist.")
      } else {
        setError("Failed to create logo. It may already exist.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 relative">
      {/* Full-page overlay during loading */}
      {loading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card p-6 rounded-[5px] shadow-lg text-center max-w-md w-full border border-brand-primary/20">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-brand-primary" />
            <h3 className="font-medium text-lg mb-2">Creating Logo</h3>
            <p className="text-muted-foreground">Please wait while we process your request...</p>
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-center text-xs text-muted-foreground mb-2">
          <Link href="/dashboard" className="hover:text-brand-primary transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="h-3 w-3 mx-1" />
          <Link href="/dashboard/logos" className="hover:text-brand-primary transition-colors">
            Logos
          </Link>
          <ChevronRight className="h-3 w-3 mx-1" />
          <span className="text-foreground">Add New Logo</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-brand-primary">Add New Logo</h1>
            <p className="text-xs text-muted-foreground">Create a new logo to add to your collection</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto h-8 text-xs rounded-[5px]"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Logos
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

      <Card className="shadow-md border-brand-primary/10 overflow-hidden rounded-[5px]">
        <form onSubmit={handleSubmit} className="rounded-[5px]">
          <CardHeader className="bg-brand-light/30 border-b border-brand-primary/10 py-3 px-4">
            <CardTitle className="text-base text-brand-primary">Logo Details</CardTitle>
            <CardDescription className="text-xs">Enter the details for the new logo</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-4 px-4">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-sm font-medium">
                Logo Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={handleNameChange}
                placeholder="Enter logo name"
                className="h-9 text-sm focus-visible:ring-brand-primary rounded-[5px]"
                required
              />
              <p className="text-xs text-muted-foreground">Enter the official name of the logo</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">
                  Logo Image <span className="text-red-500">*</span>
                </Label>
                {selectedImageUrl && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded-[5px]"
                          onClick={() => setSelectedImageUrl(null)}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Clear
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Remove selected image</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>

              <div className="border rounded-[5px] bg-muted/30 overflow-hidden">
                {selectedImageUrl ? (
                  <div className="flex items-center gap-3 p-3">
                    <div className="relative w-16 h-16 bg-white rounded-[5px] p-1 shadow-sm flex-shrink-0 border">
                      <img
                        src={selectedImageUrl || "/placeholder.svg"}
                        alt="Selected"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="h-4 w-4 rounded-[50%] bg-green-100 flex items-center justify-center">
                          <Check className="h-2.5 w-2.5 text-green-600" />
                        </div>
                        <span className="text-xs text-green-700 font-medium">Image selected</span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs rounded-[5px]"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        <ImageIcon className="h-3 w-3 mr-1.5" />
                        Change Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3">
                    <div className="h-10 w-10 rounded-[5px] bg-brand-light/50 flex items-center justify-center flex-shrink-0">
                      <Upload className="h-5 w-5 text-brand-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium mb-1">No image selected</p>
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        className="h-7 text-xs bg-brand-primary hover:bg-brand-primary/90 rounded-[5px]"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        <ImageIcon className="h-3 w-3 mr-1.5" />
                        Select from Gallery
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2 py-3 px-4 border-t bg-muted/20">
            <Button variant="outline" type="button" className="h-8 text-xs rounded-[5px]" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !selectedImageUrl || !name.trim()}
              className="h-8 text-xs bg-brand-primary hover:bg-brand-primary/90 rounded-[5px]"
            >
              Create Logo
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Image Gallery Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[85vw] max-h-[85vh] overflow-hidden p-0 rounded-[5px]">
          <DialogHeader className="px-4 pt-4 pb-3 border-b">
            <DialogTitle className="text-base text-brand-primary">Select Logo Image</DialogTitle>
            <DialogDescription className="text-xs">
              Choose an image from your gallery to use as the logo
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(85vh-8rem)] p-4">
            <ImageGallery onSelect={handleImageSelect} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
