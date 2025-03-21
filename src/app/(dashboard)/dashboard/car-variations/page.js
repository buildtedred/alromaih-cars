"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Pencil,
  Trash2,
  Car,
  Search,
  MoreHorizontal,
  Loader2,
  AlertTriangle,
  RefreshCw,
  SortAsc,
  SortDesc,
  Eye,
  ImageIcon,
  DollarSign,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function CarVariations() {
  const router = useRouter()
  const [variations, setVariations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState(null)
  const [selectedVariations, setSelectedVariations] = useState([])
  const [viewMode, setViewMode] = useState("table")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [variationsToDelete, setVariationsToDelete] = useState([])
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false)
  const [selectedImages, setSelectedImages] = useState([])
  const [selectedVariationName, setSelectedVariationName] = useState("")

  useEffect(() => {
    fetchVariations()
  }, [])

  async function fetchVariations() {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/supabasPrisma/othervariations/")

      if (!response.ok) {
        throw new Error(`Failed to fetch variations. Status: ${response.status}`)
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

      setVariations(data)
    } catch (error) {
      console.error("Error fetching variations:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function deleteVariation(id) {
    setDeleteDialogOpen(false)
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/supabasPrisma/othervariations/${id}`, { method: "DELETE" })

      if (!response.ok) throw new Error("Failed to delete variation")

      // Update the local state instead of reloading
      setVariations(variations.filter((variation) => variation.id !== id))
      setSelectedVariations(selectedVariations.filter((variationId) => variationId !== id))
    } catch (error) {
      console.error("Error deleting variation:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  async function deleteMultipleVariations(ids) {
    setDeleteDialogOpen(false)
    setIsDeleting(true)
    try {
      // In a real app, you might want to use a batch delete endpoint
      // For now, we'll delete them one by one
      for (const id of ids) {
        const response = await fetch(`/api/supabasPrisma/othervariations/${id}`, { method: "DELETE" })
        if (!response.ok) throw new Error(`Failed to delete variation ${id}`)
      }

      // Update the local state
      setVariations(variations.filter((variation) => !ids.includes(variation.id)))
      setSelectedVariations([])
    } catch (error) {
      console.error("Error deleting variations:", error)
    } finally {
      setIsDeleting(false)
      setVariationsToDelete([])
    }
  }

  const handleSelectAll = () => {
    if (selectedVariations.length === filteredVariations.length) {
      setSelectedVariations([])
    } else {
      setSelectedVariations(filteredVariations.map((variation) => variation.id))
    }
  }

  const handleSelectVariation = (id) => {
    if (selectedVariations.includes(id)) {
      setSelectedVariations(selectedVariations.filter((variationId) => variationId !== id))
    } else {
      setSelectedVariations([...selectedVariations, id])
    }
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const openImagePreview = (variation) => {
    setSelectedImages(variation.images || [])
    setSelectedVariationName(variation.name)
    setImagePreviewOpen(true)
  }

  // Filter variations based on search term
  let filteredVariations = variations.filter((variation) => {
    return (
      variation.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variation.colorName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Sort variations
  filteredVariations = [...filteredVariations].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const confirmDelete = (id) => {
    setVariationsToDelete([id])
    setDeleteDialogOpen(true)
  }

  const confirmDeleteMultiple = () => {
    setVariationsToDelete(selectedVariations)
    setDeleteDialogOpen(true)
  }

  // Render the content based on loading and data state
  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="border rounded-md">
            <div className="p-4 space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )
    }

    if (filteredVariations.length === 0 && !error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Car className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No variations found</h3>
          <p className="text-muted-foreground mt-2">
            {searchTerm ? "Try a different search term" : "No variations available"}
          </p>
        </div>
      )
    }

    return (
      <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
        <div className="flex justify-end mb-4">
          <TabsList className="grid w-[180px] grid-cols-2">
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="grid">Grid</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="table">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedVariations.length === filteredVariations.length && filteredVariations.length > 0}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all variations"
                    />
                  </TableHead>
                  <TableHead className="w-[100px]">Images</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                    <div className="flex items-center gap-1">
                      Name
                      {sortField === "name" &&
                        (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("colorName")}>
                    <div className="flex items-center gap-1">
                      Color
                      {sortField === "colorName" &&
                        (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("price")}>
                    <div className="flex items-center gap-1">
                      Price
                      {sortField === "price" &&
                        (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVariations.map((variation) => (
                  <TableRow
                    key={variation.id}
                    className={selectedVariations.includes(variation.id) ? "bg-muted/50" : ""}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedVariations.includes(variation.id)}
                        onCheckedChange={() => handleSelectVariation(variation.id)}
                        aria-label={`Select ${variation.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex overflow-hidden">
                        {variation.images && variation.images.length > 0 ? (
                          <div className="h-10 w-10 rounded-md overflow-hidden border bg-muted inline-block">
                            <img
                              src={variation.images[0] || "/placeholder.svg"}
                              alt={`${variation.name} image`}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = "/placeholder.svg"
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-4 h-6 px-2"
                          onClick={() => openImagePreview(variation)}
                          disabled={!variation.images || variation.images.length === 0}
                        >
                          View All
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{variation.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-4 w-4 rounded-full border"
                          style={{ backgroundColor: variation.colorHex || "#cccccc" }}
                        />
                        {variation.colorName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {variation.price?.toLocaleString() || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/variations/${variation.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                   
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/cars/new/EditVariationForm?id=${variation.id}`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => confirmDelete(variation.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="grid">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVariations.map((variation) => (
              <Card
                key={variation.id}
                className={`overflow-hidden ${selectedVariations.includes(variation.id) ? "ring-2 ring-primary" : ""}`}
              >
                <div className="relative">
                  <div className="absolute top-2 left-2 z-10">
                    <Checkbox
                      checked={selectedVariations.includes(variation.id)}
                      onCheckedChange={() => handleSelectVariation(variation.id)}
                      aria-label={`Select ${variation.name}`}
                      className="bg-background/80 backdrop-blur-sm"
                    />
                  </div>
                  <div className="relative h-48 bg-muted">
                    {variation.images && variation.images.length > 0 ? (
                      <img
                        src={variation.images[0] || "/placeholder.svg"}
                        alt={`${variation.name} image`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/placeholder.svg"
                        }}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{variation.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <div
                            className="h-3 w-3 rounded-full border"
                            style={{ backgroundColor: variation.colorHex || "#cccccc" }}
                          />
                          <span className="text-sm text-muted-foreground">{variation.colorName}</span>
                        </div>
                        <Badge variant="outline">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {variation.price?.toLocaleString() || "N/A"}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="-mt-1 -mr-2">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/variations/${variation.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/variations/${variation.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openImagePreview(variation)}>
                          <ImageIcon className="mr-2 h-4 w-4" /> View All Images
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => confirmDelete(variation.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Car Variations</h1>
          <p className="text-muted-foreground">Manage your car variations and their colors</p>
        </div>
        <div className="flex gap-2">
          {selectedVariations.length > 0 && (
            <Button variant="destructive" onClick={confirmDeleteMultiple} disabled={isDeleting} className="gap-1">
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete Selected ({selectedVariations.length})
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search variations..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchVariations}
          disabled={loading}
          className="gap-1 w-full sm:w-auto"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/15 p-4 rounded-md text-destructive">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5" />
            <p className="font-medium">Error loading variations</p>
          </div>
          <p className="text-sm mb-2">{error}</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" onClick={fetchVariations}>
              Try Again
            </Button>
          </div>
        </div>
      )}

      {renderContent()}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              {variationsToDelete.length > 1
                ? `Are you sure you want to delete ${variationsToDelete.length} variations? This action cannot be undone.`
                : "Are you sure you want to delete this variation? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                variationsToDelete.length > 1
                  ? deleteMultipleVariations(variationsToDelete)
                  : deleteVariation(variationsToDelete[0])
              }
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
              {variationsToDelete.length > 1 ? `Delete ${variationsToDelete.length} variations` : "Delete variation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={imagePreviewOpen} onOpenChange={setImagePreviewOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Images for {selectedVariationName}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedImages.length > 0 ? (
              <div className="space-y-6">
                <Carousel className="w-full">
                  <CarouselContent>
                    {selectedImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="flex aspect-video items-center justify-center p-1">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`${selectedVariationName} image ${index + 1}`}
                            className="max-h-[60vh] w-auto max-w-full object-contain rounded-md"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = "/placeholder.svg"
                            }}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>

                <div className="grid grid-cols-6 gap-2">
                  {selectedImages.map((image, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="aspect-square rounded-md overflow-hidden border cursor-pointer">
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`Thumbnail ${index + 1}`}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = "/placeholder.svg"
                              }}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Image {index + 1}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No images available</h3>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImagePreviewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

