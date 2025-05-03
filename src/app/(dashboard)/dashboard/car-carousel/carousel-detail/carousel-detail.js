"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Film,
  AlertTriangle,
  ChevronRight,
  Pencil,
  Trash2,
  Loader2,
  Calendar,
  Clock,
  ImageIcon,
  ExternalLink,
  Share2,
  Copy,
  CheckCircle,
  Download,
  Play,
  Pause,
  SkipBack,
  SkipForward,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function CarouselDetail({ id }) {
  const router = useRouter()
  const [carousel, setCarousel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("details")
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoplayInterval, setAutoplayInterval] = useState(null)

  useEffect(() => {
    if (id) {
      fetchCarouselDetails(id)
    }
  }, [id])

  // Cleanup autoplay on unmount
  useEffect(() => {
    return () => {
      if (autoplayInterval) {
        clearInterval(autoplayInterval)
      }
    }
  }, [autoplayInterval])

  // Handle autoplay
  useEffect(() => {
    if (isPlaying && carousel?.images?.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carousel.images.length)
      }, 3000)
      setAutoplayInterval(interval)
      return () => clearInterval(interval)
    } else if (!isPlaying && autoplayInterval) {
      clearInterval(autoplayInterval)
      setAutoplayInterval(null)
    }
  }, [isPlaying, carousel?.images?.length, autoplayInterval])

  async function fetchCarouselDetails(carouselId) {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/supabasPrisma/car-carousel/${carouselId}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch carousel details. Status: ${response.status}`)
      }

      const text = await response.text()
      let data

      try {
        // Try to parse the response as JSON
        data = JSON.parse(text)
      } catch (parseError) {
        // If parsing fails, it's likely HTML or another format
        if (text.includes("<!DOCTYPE") || text.includes("<html")) {
          throw new Error(
            "The API returned an HTML page instead of JSON. The endpoint might not exist or there's a server error.",
          )
        } else {
          throw new Error(`Failed to parse response as JSON: ${parseError.message}`)
        }
      }

      // If the API returns an array with one item, extract that item
      if (Array.isArray(data) && data.length === 1) {
        data = data[0]
      }

      // Ensure images is an array
      if (data.imageUrl && !data.images) {
        data.images = [data.imageUrl]
      } else if (!data.images) {
        data.images = []
      }

      setCarousel(data)
    } catch (error) {
      console.error("Error fetching carousel details:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = () => {
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    // Close the dialog first
    setDeleteDialogOpen(false)
    // Then disable the page by setting isDeleting to true
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/supabasPrisma/car-carousel/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete carousel")
      }

      // Navigate back to carousels page after successful deletion
      router.push("/dashboard/car-carousel")
    } catch (error) {
      console.error("Error deleting carousel:", error)
      setIsDeleting(false)
    }
  }

  const copyImageUrl = () => {
    if (carousel?.images?.[currentSlide] && !isDeleting) {
      navigator.clipboard
        .writeText(carousel.images[currentSlide])
        .then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
        .catch((err) => {
          console.error("Failed to copy URL:", err)
        })
    }
  }

  const downloadImage = () => {
    if (carousel?.images?.[currentSlide] && !isDeleting) {
      const link = document.createElement("a")
      link.href = carousel.images[currentSlide]
      link.download = `${carousel.title || "carousel"}-image-${currentSlide + 1}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const toggleAutoplay = () => {
    setIsPlaying(!isPlaying)
  }

  const goToNextSlide = () => {
    if (carousel?.images?.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % carousel.images.length)
    }
  }

  const goToPrevSlide = () => {
    if (carousel?.images?.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + carousel.images.length) % carousel.images.length)
    }
  }

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto px-3 py-3 max-w-6xl space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-8 w-24" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-2">
            <Skeleton className="h-[300px] w-full rounded-[5px]" />
            <div className="flex justify-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-[160px] w-full rounded-[5px]" />
            <div className="space-y-1.5">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto px-3 py-3 max-w-6xl">
        <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-3">
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back
        </Button>

        <div className="bg-destructive/15 p-4 rounded-[5px] text-destructive">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4" />
            <h2 className="text-base font-semibold">Error Loading Carousel Details</h2>
          </div>
          <p className="text-sm mb-3">{error}</p>
          <Button size="sm" onClick={() => fetchCarouselDetails(id)}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  // Render no data state
  if (!carousel) {
    return (
      <div className="container mx-auto px-3 py-3 max-w-6xl">
        <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-3">
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back
        </Button>

        <div className="bg-muted p-4 rounded-[5px] text-center">
          <Film className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <h2 className="text-base font-semibold mb-1.5">Carousel Not Found</h2>
          <p className="text-sm text-muted-foreground mb-3">
            The carousel you're looking for doesn't exist or has been removed.
          </p>
          <Button size="sm" asChild>
            <Link href="/dashboard/car-carousel">View All Carousels</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-3 py-3 max-w-6xl space-y-4 relative">
      {/* Full-page overlay during deletion */}
      {isDeleting && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card p-8 rounded-[5px] shadow-lg text-center max-w-md w-full border border-brand-primary/20">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-brand-primary" />
            <h3 className="font-medium text-xl mb-2">Deleting Carousel</h3>
            <p className="text-muted-foreground">Please wait while we process your request...</p>
          </div>
        </div>
      )}

      {/* The rest of the page content */}
      <div className={isDeleting ? "opacity-50 pointer-events-none" : ""} aria-disabled={isDeleting}>
        {/* Header with navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="h-7 px-2 text-xs hover:bg-brand-light hover:text-brand-primary rounded-[5px]"
            >
              <ArrowLeft className="mr-1 h-3 w-3" /> Back
            </Button>
            <div className="flex items-center text-muted-foreground text-xs">
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <ChevronRight className="h-3 w-3 mx-1" />
              <Link href="/dashboard/car-carousel" className="hover:underline">
                Carousels
              </Link>
              <ChevronRight className="h-3 w-3 mx-1" />
              <span className="text-foreground font-medium truncate max-w-[150px]">{carousel.title}</span>
            </div>
          </div>

          <div className="flex gap-1.5">
            <Button
              asChild
              size="sm"
              className="h-7 px-2 text-xs bg-brand-primary hover:bg-brand-primary/90 rounded-[5px]"
            >
              <Link href={`/dashboard/car-carousel/${carousel.id}/edit`}>
                <Pencil className="mr-1 h-3 w-3" /> Edit Carousel
              </Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={confirmDelete} className="h-7 px-2 text-xs rounded-[5px]">
              <Trash2 className="mr-1 h-3 w-3" /> Delete
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          {/* Left column - Carousel display */}
          <div className="lg:col-span-2 space-y-3">
            <div className="bg-gradient-to-b from-brand-light/30 to-white rounded-[5px] border border-gray-200 p-4 shadow-sm">
              {carousel.images && carousel.images.length > 0 ? (
                <div className="space-y-4">
                  <div className="relative aspect-video bg-muted rounded-[5px] overflow-hidden border border-gray-200">
                    <img
                      src={carousel.images[currentSlide] || "/placeholder.svg?height=400&width=800&query=carousel"}
                      alt={`${carousel.title} - Slide ${currentSlide + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.svg?key=islnr"
                      }}
                    />
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-[5px]">
                      {currentSlide + 1} / {carousel.images.length}
                    </div>
                  </div>

                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white hover:bg-brand-light hover:text-brand-primary"
                      onClick={goToPrevSlide}
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className={`h-10 w-10 rounded-full ${
                        isPlaying
                          ? "bg-brand-primary text-white hover:bg-brand-primary/90"
                          : "bg-white hover:bg-brand-light hover:text-brand-primary"
                      }`}
                      onClick={toggleAutoplay}
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white hover:bg-brand-light hover:text-brand-primary"
                      onClick={goToNextSlide}
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex justify-center gap-1 overflow-x-auto py-1 pb-1.5">
                    {carousel.images.map((image, index) => (
                      <div
                        key={index}
                        className={`h-12 w-16 flex-shrink-0 rounded-[5px] overflow-hidden border cursor-pointer transition-all duration-200 ${
                          currentSlide === index
                            ? "border-brand-primary ring-2 ring-brand-primary/30 scale-105"
                            : "border-gray-200 opacity-70 hover:opacity-100"
                        }`}
                        onClick={() => setCurrentSlide(index)}
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Thumbnail ${index + 1}`}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "/placeholder.svg?height=48&width=64"
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center">
                  <Film className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Images Available</h3>
                  <p className="text-sm text-muted-foreground mt-2">This carousel doesn't have any images.</p>
                </div>
              )}
            </div>

            {/* Carousel details tabs */}
            <div className="space-y-3 mt-3">
              <Card className="rounded-[5px] shadow-sm border border-gray-200">
                <CardHeader className="pb-1.5 pt-3 px-3">
                  <CardTitle className="text-xs font-medium">Carousel Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5 pt-0 px-3 pb-3">
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground">Title</span>
                      <p className="text-xs font-medium">{carousel.title || "N/A"}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground">Status</span>
                      <div className="flex items-center gap-1">
                        {carousel.isActive !== false ? (
                          <>
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <p className="text-xs font-medium text-green-600">Active</p>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-3 w-3 text-amber-500" />
                            <p className="text-xs font-medium text-amber-600">Inactive</p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground">Created At</span>
                      <p className="text-xs font-medium">
                        {carousel.createdAt ? new Date(carousel.createdAt).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground">Updated At</span>
                      <p className="text-xs font-medium">
                        {carousel.updatedAt ? new Date(carousel.updatedAt).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground">Number of Images</span>
                      <p className="text-xs font-medium">{carousel.images?.length || 0}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground">Type</span>
                      <p className="text-xs font-medium">{carousel.type || "Standard"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {carousel.description && (
                <div className="space-y-1.5">
                  <h3 className="text-xs font-medium">Description</h3>
                  <div className="p-3 bg-muted/50 rounded-[5px]">
                    <p className="text-xs">{carousel.description}</p>
                  </div>
                </div>
              )}

              {carousel.notes && (
                <div className="space-y-1.5">
                  <h3 className="text-xs font-medium">Notes</h3>
                  <div className="p-3 bg-muted/50 rounded-[5px]">
                    <p className="text-xs">{carousel.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right column - Summary and actions */}
          <div className="space-y-3">
            <Card className="rounded-[5px] shadow-sm border border-gray-200 bg-white">
              <CardContent className="p-3 space-y-2">
                <h3 className="text-xs font-medium">Carousel Summary</h3>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Title:</span>
                    <span className="font-medium">{carousel.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Images:</span>
                    <span className="font-medium">{carousel.images?.length || 0}</span>
                  </div>
                  {carousel.createdAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="font-medium">{new Date(carousel.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span
                      className={`font-medium ${carousel.isActive !== false ? "text-green-600" : "text-amber-600"}`}
                    >
                      {carousel.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <Separator className="my-1" />

                <div className="space-y-1.5">
                  <Button
                    className="w-full h-7 text-[10px] bg-brand-primary hover:bg-brand-primary/90 rounded-[5px]"
                    asChild
                  >
                    <Link href={`/dashboard/car-carousel/${carousel.id}/edit`}>
                      <Pencil className="mr-1 h-3 w-3" /> Edit Carousel
                    </Link>
                  </Button>

                  <div className="grid grid-cols-2 gap-1.5">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full h-7 text-[10px] rounded-[5px] hover:bg-brand-light hover:text-brand-primary"
                            onClick={downloadImage}
                            disabled={!carousel.images?.[currentSlide]}
                          >
                            <Download className="mr-1 h-3 w-3" /> Download
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Download current image</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full h-7 text-[10px] rounded-[5px] hover:bg-brand-light hover:text-brand-primary"
                            onClick={copyImageUrl}
                            disabled={!carousel.images?.[currentSlide]}
                          >
                            {copied ? (
                              <>
                                <CheckCircle className="mr-1 h-3 w-3 text-green-500" /> Copied
                              </>
                            ) : (
                              <>
                                <Copy className="mr-1 h-3 w-3" /> Copy URL
                              </>
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Copy current image URL to clipboard</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[5px] shadow-sm border border-gray-200">
              <CardHeader className="pb-1.5 pt-3 px-3">
                <CardTitle className="text-xs font-medium">Current Image Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 pt-0 px-3 pb-3">
                {carousel.images && carousel.images.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">
                        Image {currentSlide + 1} of {carousel.images.length}
                      </span>
                      <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                        {currentSlide + 1}/{carousel.images.length}
                      </Badge>
                    </div>
                    <div className="h-20 w-full rounded-[5px] overflow-hidden border border-gray-200">
                      <img
                        src={carousel.images[currentSlide] || "/placeholder.svg"}
                        alt={`Current slide (${currentSlide + 1})`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/placeholder.svg?height=80&width=320"
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>
                          {carousel.createdAt ? new Date(carousel.createdAt).toLocaleDateString() : "Unknown date"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>
                          {carousel.createdAt ? new Date(carousel.createdAt).toLocaleTimeString() : "Unknown time"}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4 text-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-[10px] text-muted-foreground">No images available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {carousel.links && carousel.links.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-medium">Related Links</h3>
                <div className="space-y-1">
                  {carousel.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 bg-brand-light/30 rounded-[5px] hover:bg-brand-light/50 transition-colors text-xs"
                    >
                      <span>{link.title || link.url}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <Card className="rounded-[5px] shadow-sm border border-gray-200">
              <CardHeader className="pb-1.5 pt-3 px-3">
                <CardTitle className="text-xs font-medium">Share Carousel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 pt-0 px-3 pb-3">
                <Button
                  variant="outline"
                  className="w-full h-7 text-[10px] rounded-[5px] hover:bg-brand-light hover:text-brand-primary"
                  onClick={() => {
                    if (!isDeleting) {
                      const shareData = {
                        title: carousel.title,
                        text: `Check out this carousel: ${carousel.title}`,
                        url: window.location.href,
                      }

                      if (navigator.share && navigator.canShare(shareData)) {
                        navigator.share(shareData).catch((err) => console.error("Error sharing:", err))
                      } else {
                        navigator.clipboard
                          .writeText(window.location.href)
                          .then(() => {
                            setCopied(true)
                            setTimeout(() => setCopied(false), 2000)
                          })
                          .catch((err) => {
                            console.error("Failed to copy URL:", err)
                          })
                      }
                    }
                  }}
                >
                  <Share2 className="mr-1 h-3 w-3" /> Share Carousel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-[5px] border-red-200">
          <DialogHeader>
            <DialogTitle className="text-sm">Delete Carousel</DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to delete the carousel "{carousel.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-3">
            <Button variant="outline" size="sm" onClick={() => setDeleteDialogOpen(false)} className="h-7 text-xs">
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="h-7 text-xs rounded-[5px] bg-red-500 hover:bg-red-600"
            >
              <Trash2 className="h-3 w-3 mr-1" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
