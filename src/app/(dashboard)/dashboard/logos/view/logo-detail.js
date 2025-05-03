"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ImageIcon,
  AlertTriangle,
  ChevronRight,
  Pencil,
  Trash2,
  Loader2,
  Info,
  Download,
  Share2,
  Copy,
  CheckCircle,
  XCircle,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function LogoDetail({ id }) {
  const router = useRouter()
  const [logo, setLogo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("details")
  const [isDeleting, setIsDeleting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    if (id) {
      fetchLogoDetails(id)
    }
  }, [id])

  async function fetchLogoDetails(logoId) {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/supabasPrisma/logo/${logoId}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch logo details. Status: ${response.status}`)
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

      setLogo(data)
    } catch (error) {
      console.error("Error fetching logo details:", error)
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
      const response = await fetch(`/api/supabasPrisma/logo/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete logo")
      }

      // Navigate back to logos page after successful deletion
      router.push("/dashboard/logos")
    } catch (error) {
      console.error("Error deleting logo:", error)
      setIsDeleting(false)
    }
  }

  const copyImageUrl = () => {
    if (logo?.imageUrl && !isDeleting) {
      navigator.clipboard
        .writeText(logo.imageUrl)
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
    if (logo?.imageUrl && !isDeleting) {
      const link = document.createElement("a")
      link.href = logo.imageUrl
      link.download = `${logo.title || "logo"}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
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
            <h2 className="text-base font-semibold">Error Loading Logo Details</h2>
          </div>
          <p className="text-sm mb-3">{error}</p>
          <Button size="sm" onClick={() => fetchLogoDetails(id)}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  // Render no data state
  if (!logo) {
    return (
      <div className="container mx-auto px-3 py-3 max-w-6xl">
        <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-3">
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back
        </Button>

        <div className="bg-muted p-4 rounded-[5px] text-center">
          <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <h2 className="text-base font-semibold mb-1.5">Logo Not Found</h2>
          <p className="text-sm text-muted-foreground mb-3">
            The logo you're looking for doesn't exist or has been removed.
          </p>
          <Button size="sm" asChild>
            <Link href="/dashboard/logos">View All Logos</Link>
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
            <h3 className="font-medium text-xl mb-2">Deleting Logo</h3>
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
              <Link href="/dashboard/logos" className="hover:underline">
                Logos
              </Link>
              <ChevronRight className="h-3 w-3 mx-1" />
              <span className="text-foreground font-medium truncate max-w-[150px]">{logo.title}</span>
            </div>
          </div>

          <div className="flex gap-1.5">
            <Button
              asChild
              size="sm"
              className="h-7 px-2 text-xs bg-brand-primary hover:bg-brand-primary/90 rounded-[5px]"
            >
              <Link href={`/dashboard/logos/edit/${logo.id}`}>
                <Pencil className="mr-1 h-3 w-3" /> Edit Logo
              </Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={confirmDelete} className="h-7 px-2 text-xs rounded-[5px]">
              <Trash2 className="mr-1 h-3 w-3" /> Delete
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          {/* Left column - Logo display */}
          <div className="lg:col-span-2 space-y-3">
            <div className="bg-white rounded-[5px] border border-gray-200 p-6 flex items-center justify-center min-h-[300px]">
              {logo.imageUrl ? (
                <img
                  src={logo.imageUrl || "/placeholder.svg"}
                  alt={logo.title}
                  className="max-h-[250px] max-w-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/generic-brand-logo.png"
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-16 w-16 mb-2" />
                  <p className="text-sm">No image available</p>
                </div>
              )}
            </div>

            {/* Logo details tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-3">
              <TabsList className="grid grid-cols-2 mb-3 h-8 bg-brand-light/50">
                <TabsTrigger value="details" className="text-xs py-1">
                  Logo Details
                </TabsTrigger>
                <TabsTrigger value="usage" className="text-xs py-1">
                  Usage Guidelines
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-3 mt-0">
                <Card className="rounded-[5px] shadow-sm border border-gray-200">
                  <CardHeader className="pb-1.5 pt-3 px-3">
                    <CardTitle className="text-xs font-medium">Logo Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1.5 pt-0 px-3 pb-3">
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground">Title</span>
                        <p className="text-xs font-medium">{logo.title || "N/A"}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground">Type</span>
                        <p className="text-xs font-medium">{logo.type || "N/A"}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground">Created At</span>
                        <p className="text-xs font-medium">
                          {logo.createdAt ? new Date(logo.createdAt).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground">Updated At</span>
                        <p className="text-xs font-medium">
                          {logo.updatedAt ? new Date(logo.updatedAt).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground">File Format</span>
                        <p className="text-xs font-medium">
                          {logo.imageUrl ? logo.imageUrl.split(".").pop().toUpperCase() : "N/A"}
                        </p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground">Status</span>
                        <div className="flex items-center gap-1">
                          {logo.isActive ? (
                            <>
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <p className="text-xs font-medium text-green-600">Active</p>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 text-red-500" />
                              <p className="text-xs font-medium text-red-600">Inactive</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {logo.description && (
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-medium">Description</h3>
                    <div className="p-3 bg-muted/50 rounded-[5px]">
                      <p className="text-xs">{logo.description}</p>
                    </div>
                  </div>
                )}

                {logo.notes && (
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-medium">Notes</h3>
                    <div className="p-3 bg-muted/50 rounded-[5px]">
                      <p className="text-xs">{logo.notes}</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="usage" className="space-y-3 mt-0">
                {logo.usageGuidelines ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-[5px]">
                      <p className="text-xs">{logo.usageGuidelines}</p>
                    </div>

                    <Card className="rounded-[5px] shadow-sm border border-gray-200">
                      <CardHeader className="pb-1.5 pt-3 px-3">
                        <CardTitle className="text-xs font-medium">Usage Rules</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1.5 pt-0 px-3 pb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <p className="text-xs">Use the logo in its original proportions</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <p className="text-xs">Maintain clear space around the logo</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <p className="text-xs">Use approved color variations</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <XCircle className="h-3 w-3 text-red-500" />
                            <p className="text-xs">Don't distort or stretch the logo</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <XCircle className="h-3 w-3 text-red-500" />
                            <p className="text-xs">Don't change the logo colors</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <XCircle className="h-3 w-3 text-red-500" />
                            <p className="text-xs">Don't add effects like shadows or outlines</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <Info className="h-8 w-8 text-muted-foreground mb-2" />
                    <h3 className="text-sm font-medium">No Usage Guidelines Available</h3>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      This logo doesn't have any usage guidelines specified.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right column - Summary and actions */}
          <div className="space-y-3">
            <Card className="rounded-[5px] shadow-sm border border-gray-200 bg-white">
              <CardContent className="p-3 space-y-2">
                <h3 className="text-xs font-medium">Logo Summary</h3>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Title:</span>
                    <span className="font-medium">{logo.title}</span>
                  </div>
                  {logo.type && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">{logo.type}</span>
                    </div>
                  )}
                  {logo.createdAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="font-medium">{new Date(logo.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={`font-medium ${logo.isActive ? "text-green-600" : "text-red-600"}`}>
                      {logo.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <Separator className="my-1" />

                <div className="space-y-1.5">
                  <Button
                    className="w-full h-7 text-[10px] bg-brand-primary hover:bg-brand-primary/90 rounded-[5px]"
                    asChild
                  >
                    <Link href={`/dashboard/logos/edit/${logo.id}`}>
                      <Pencil className="mr-1 h-3 w-3" /> Edit Logo Details
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
                            disabled={!logo.imageUrl}
                          >
                            <Download className="mr-1 h-3 w-3" /> Download
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Download logo image</p>
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
                            disabled={!logo.imageUrl}
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
                          <p className="text-xs">Copy logo URL to clipboard</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardContent>
            </Card>

            {logo.colors && logo.colors.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-medium">Brand Colors</h3>

                <div className="grid grid-cols-2 gap-1.5">
                  {logo.colors.map((color, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="h-8 w-full rounded-[5px] mb-1" style={{ backgroundColor: color.hex }}></div>
                      <span className="text-[10px] font-medium">{color.name || color.hex}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Card className="rounded-[5px] shadow-sm border border-gray-200">
              <CardHeader className="pb-1.5 pt-3 px-3">
                <CardTitle className="text-xs font-medium">Share Logo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 pt-0 px-3 pb-3">
                <Button
                  variant="outline"
                  className="w-full h-7 text-[10px] rounded-[5px] hover:bg-brand-light hover:text-brand-primary"
                  disabled={!logo.imageUrl}
                  onClick={() => {
                    if (logo.imageUrl && !isDeleting) {
                      const shareData = {
                        title: logo.title,
                        text: `Check out this logo: ${logo.title}`,
                        url: logo.imageUrl,
                      }

                      if (navigator.share && navigator.canShare(shareData)) {
                        navigator.share(shareData).catch((err) => console.error("Error sharing:", err))
                      } else {
                        copyImageUrl()
                      }
                    }
                  }}
                >
                  <Share2 className="mr-1 h-3 w-3" /> Share Logo
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
            <DialogTitle className="text-sm">Delete Logo</DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to delete the logo "{logo.title}"? This action cannot be undone.
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
