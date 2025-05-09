"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2, ImageIcon, Check, Upload, X, AlertCircle, ChevronRight, Globe } from "lucide-react"
import Link from "next/link"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ImageGallery from "../../../images-gallery/image-gallery"
import { Skeleton } from "@/components/ui/skeleton"

export default function EditBrandPage() {
  const params = useParams()
  const router = useRouter()
  const brandId = params?.id

  const [brand, setBrand] = useState(null)
  const [brandData, setBrandData] = useState({
    name: "",
    name_ar: "",
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [selectedImageUrl, setSelectedImageUrl] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("english")

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
        console.log("API Response:", data)
        setBrand(data)

        // Set form data based on the nested structure returned by the API
        if (data && data.en) {
          setBrandData({
            name: data.en.name || "",
            name_ar: data.ar?.name_ar || "",
          })
          setSelectedImageUrl(data.en.image || null)
        }
      } catch (error) {
        console.error("Error fetching brand:", error)
        setError("Failed to load brand data. Please try again.")
      } finally {
        setFetchLoading(false)
      }
    }

    fetchBrand()
  }, [brandId])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setBrandData((prev) => ({ ...prev, [name]: value }))
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

    // Validate form - only English name is required
    if (!brandData.name.trim()) {
      setError("Brand name is required")
      setActiveTab("english")
      return
    }

    if (!selectedImageUrl) {
      setError("Please select an image from the gallery")
      return
    }

    try {
      setLoading(true)

      // Send payload in the format expected by the API (flat structure)
      const payload = {
        name: brandData.name,
        name_ar: brandData.name_ar || "",
        image: selectedImageUrl,
      }

      console.log("Submitting payload:", payload)

      // Use Axios to send the PUT request
      const response = await axios.put(`/api/supabasPrisma/carbrands/${brandId}`, payload)

      // Handle success response
      setUploadStatus("Brand updated successfully!")

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard/brands")
        router.refresh()
      }, 1500)
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
      <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>

        <Card className="shadow-md border-brand-primary/10 overflow-hidden rounded-[5px]">
          <CardHeader className="bg-brand-light/30 border-b border-brand-primary/10 py-3 px-4">
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-3 w-48" />
          </CardHeader>
          <CardContent className="space-y-4 pt-4 px-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-full rounded-[5px]" />
              <Skeleton className="h-3 w-48" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <div className="border rounded-[5px] p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-16 w-16 rounded-[5px]" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-7 w-28" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 py-3 px-4 border-t bg-muted/20">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-24" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 relative">
      {/* Full-page overlay during loading */}
      {loading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card p-6 rounded-[5px] shadow-lg text-center max-w-md w-full border border-brand-primary/20">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-brand-primary" />
            <h3 className="font-medium text-lg mb-2">Updating Brand</h3>
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
          <Link href="/dashboard/brands" className="hover:text-brand-primary transition-colors">
            Brands
          </Link>
          <ChevronRight className="h-3 w-3 mx-1" />
          <span className="text-foreground">Edit {brand?.en?.name || "Brand"}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-brand-primary">Edit Car Brand</h1>
            <p className="text-xs text-muted-foreground">Update the details for {brand?.en?.name || "this brand"}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="w-full sm:w-auto h-8 text-xs rounded-[5px]"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Brands
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
            <CardTitle className="text-base text-brand-primary flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              Bilingual Brand Details
            </CardTitle>
            <CardDescription className="text-xs">
              Update the brand details in English (required) and Arabic (optional)
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-4 px-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="english">English</TabsTrigger>
                <TabsTrigger value="arabic">العربية</TabsTrigger>
              </TabsList>

              <TabsContent value="english" className="mt-0">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Brand Name (English) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={brandData.name}
                    onChange={handleInputChange}
                    placeholder="Enter brand name in English"
                    className="h-9 text-sm focus-visible:ring-brand-primary rounded-[5px]"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Enter the official English name of the car brand</p>
                </div>
              </TabsContent>

              <TabsContent value="arabic" className="mt-0">
                <div className="space-y-1">
                  <Label htmlFor="name_ar" className="text-sm font-medium flex items-center">
                    Brand Name (Arabic) <span className="text-muted-foreground text-xs ml-2">(optional)</span>
                  </Label>
                  <Input
                    id="name_ar"
                    name="name_ar"
                    value={brandData.name_ar}
                    onChange={handleInputChange}
                    placeholder="أدخل اسم العلامة التجارية بالعربية"
                    className="h-9 text-sm focus-visible:ring-brand-primary rounded-[5px] text-right"
                    dir="rtl"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the official Arabic name of the car brand (optional)
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">
                  Brand Logo <span className="text-red-500">*</span>
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
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/generic-brand-logo.png"
                        }}
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
            <Button variant="outline" type="button" onClick={() => router.back()} className="h-8 text-xs rounded-[5px]">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !selectedImageUrl || !brandData.name.trim()}
              className="h-8 text-xs bg-brand-primary hover:bg-brand-primary/90 rounded-[5px]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Updating...
                </>
              ) : (
                "Update Brand"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Image Gallery Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[85vw] max-h-[85vh] overflow-hidden p-0 rounded-[5px]">
          <DialogHeader className="px-4 pt-4 pb-3 border-b">
            <DialogTitle className="text-base text-brand-primary">Select Brand Logo</DialogTitle>
            <DialogDescription className="text-xs">
              Choose an image from your gallery to use as the brand logo
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
