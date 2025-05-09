"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Pencil,
  Trash2,
  Car,
  Search,
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function CarVariations() {
  const [variations, setVariations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState(null)
  const [selectedVariations, setSelectedVariations] = useState([])
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [variationsToDelete, setVariationsToDelete] = useState([])

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

      // Check if the response has the new bilingual format
      if (data && data.en) {
        // Use English data by default
        setVariations(data.en)
      } else {
        // Fallback to the old format or empty array
        setVariations(data || [])
      }
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

  // Filter variations based on search term
  let filteredVariations = variations.filter((variation) => {
    return (
      variation.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variation.colorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variation.car?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variation.car?.brand?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Sort variations
  filteredVariations = [...filteredVariations].sort((a, b) => {
    let aValue, bValue

    if (sortField === "car") {
      aValue = a.car?.model || ""
      bValue = b.car?.model || ""
    } else {
      aValue = a[sortField]
      bValue = b[sortField]
    }

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

  // Render loading skeletons
  const renderSkeletons = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="border rounded-[5px]">
          <div className="p-4 space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-[5px]" />
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

  // Render empty state
  const renderEmptyState = () => {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Car className="h-16 w-16 text-brand-primary/30 mb-4" />
        <h3 className="text-lg font-medium">No variations found</h3>
        <p className="text-muted-foreground mt-2">
          {searchTerm ? "Try a different search term" : "No variations available"}
        </p>
      </div>
    )
  }

  // Render error state
  const renderError = () => {
    return (
      <div className="bg-destructive/15 p-4 rounded-[5px] text-destructive border border-destructive/30">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-5 w-5" />
          <p className="font-medium">Error loading variations</p>
        </div>
        <p className="text-sm mb-2">{error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchVariations}
          disabled={isDeleting}
          className="rounded-[5px] border-destructive/30 hover:bg-destructive/20"
        >
          Try Again
        </Button>
      </div>
    )
  }

  // Render the main content
  const renderContent = () => {
    if (loading) {
      return renderSkeletons()
    }

    if (error) {
      return renderError()
    }

    if (filteredVariations.length === 0) {
      return renderEmptyState()
    }

    return (
      <div className="rounded-[5px] border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedVariations.length === filteredVariations.length && filteredVariations.length > 0}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all variations"
                    disabled={isDeleting}
                    className="rounded-[5px]"
                  />
                </TableHead>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead
                  className={`${!isDeleting ? "cursor-pointer hover:text-brand-primary" : ""}`}
                  onClick={() => !isDeleting && handleSort("name")}
                >
                  <div className="flex items-center gap-1">
                    Name
                    {sortField === "name" &&
                      (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                  </div>
                </TableHead>
                <TableHead
                  className={`${!isDeleting ? "cursor-pointer hover:text-brand-primary" : ""}`}
                  onClick={() => !isDeleting && handleSort("car")}
                >
                  <div className="flex items-center gap-1">
                    Car
                    {sortField === "car" &&
                      (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                  </div>
                </TableHead>
                <TableHead
                  className={`${!isDeleting ? "cursor-pointer hover:text-brand-primary" : ""}`}
                  onClick={() => !isDeleting && handleSort("colorName")}
                >
                  <div className="flex items-center gap-1">
                    Color
                    {sortField === "colorName" &&
                      (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                  </div>
                </TableHead>
                <TableHead
                  className={`${!isDeleting ? "cursor-pointer hover:text-brand-primary" : ""}`}
                  onClick={() => !isDeleting && handleSort("price")}
                >
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
                  className={
                    selectedVariations.includes(variation.id) ? "bg-brand-light/50" : "hover:bg-brand-light/30"
                  }
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedVariations.includes(variation.id)}
                      onCheckedChange={() => !isDeleting && handleSelectVariation(variation.id)}
                      aria-label={`Select ${variation.name}`}
                      disabled={isDeleting}
                      className="rounded-[5px]"
                    />
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="h-12 w-12 flex justify-center items-center rounded-[5px] overflow-hidden bg-muted border">
                            {variation.images && variation.images.length > 0 ? (
                              <img
                                src={variation.images[0] || "/placeholder.svg?height=48&width=48&query=car"}
                                alt={`${variation.name} image`}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null
                                  e.target.src = "/classic-red-convertible.png"
                                }}
                              />
                            ) : (
                              <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="rounded-[5px]">
                          {variation.images && variation.images.length > 0
                            ? `${variation.images.length} image${variation.images.length > 1 ? "s" : ""} available`
                            : "No images available"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="font-medium">{variation.name}</TableCell>
                  <TableCell>
                    {variation.car ? (
                      <div className="flex flex-col">
                        <span className="font-medium">{variation.car.model}</span>
                        {variation.car.brand && (
                          <Badge
                            variant="outline"
                            className="mt-1 w-fit rounded-[5px] bg-brand-light/30 text-brand-primary border-brand-primary/20"
                          >
                            {variation.car.brand.name}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm italic">Not assigned</span>
                    )}
                  </TableCell>
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
                    <Badge
                      variant="outline"
                      className="rounded-[5px] bg-brand-light/50 text-brand-primary border-brand-primary/20"
                    >
                      <DollarSign className="h-3 w-3 mr-1" />
                      {variation.price?.toLocaleString() || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        disabled={isDeleting}
                        className="rounded-[5px] hover:bg-brand-light hover:text-brand-primary"
                      >
                        <Link href={`/dashboard/car-variations/variation-detail/${variation.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        disabled={isDeleting}
                        className="rounded-[5px] hover:bg-brand-light hover:text-brand-primary"
                      >
                        <Link href={`/dashboard/cars/new/EditVariationForm?id=${variation.id}`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-[5px] hover:bg-destructive/10"
                        onClick={() => !isDeleting && confirmDelete(variation.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 relative">
      {/* Full-page overlay during deletion */}
      {isDeleting && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card p-8 rounded-[5px] shadow-lg text-center max-w-md w-full border border-brand-primary/20">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-brand-primary" />
            <h3 className="font-medium text-xl mb-2">Deleting Variation{variationsToDelete.length > 1 ? "s" : ""}</h3>
            <p className="text-muted-foreground">Please wait while we process your request...</p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-brand-light/30 p-4 rounded-[5px] border border-brand-primary/10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-primary">Car Variations</h1>
          <p className="text-muted-foreground">Manage your car variations and their colors</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {selectedVariations.length > 0 && (
            <Button
              variant="destructive"
              onClick={confirmDeleteMultiple}
              disabled={isDeleting}
              className="gap-1 rounded-[5px] w-full sm:w-auto"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete Selected ({selectedVariations.length})
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 items-center w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search variations by name, color, or car model..."
              className="pl-8 w-full rounded-[5px] border-gray-300 focus-visible:ring-brand-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isDeleting}
            />
          </div>

          <select
            className="h-10 rounded-[5px] border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            onChange={(e) => {
              setLoading(true)
              fetch("/api/supabasPrisma/othervariations/")
                .then((res) => res.json())
                .then((data) => {
                  if (data && data[e.target.value]) {
                    setVariations(data[e.target.value])
                  } else {
                    setVariations([])
                  }
                  setLoading(false)
                })
                .catch((err) => {
                  console.error(err)
                  setError("Failed to fetch variations")
                  setLoading(false)
                })
            }}
            disabled={isDeleting || loading}
          >
            <option value="en">English</option>
            <option value="ar">Arabic</option>
          </select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchVariations}
          disabled={loading || isDeleting}
          className="gap-1 w-full sm:w-auto rounded-[5px] border-gray-300 hover:bg-brand-light hover:text-brand-primary"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {error && renderError()}

      {renderContent()}

      <Dialog open={deleteDialogOpen} onOpenChange={(open) => !isDeleting && setDeleteDialogOpen(open)}>
        <DialogContent className="rounded-[5px] border-red-200 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              {variationsToDelete.length > 1
                ? `Are you sure you want to delete ${variationsToDelete.length} variations? This action cannot be undone.`
                : "Are you sure you want to delete this variation? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
              className="rounded-[5px] mt-2 sm:mt-0"
            >
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
              className="rounded-[5px] bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
              {variationsToDelete.length > 1 ? `Delete ${variationsToDelete.length} variations` : "Delete variation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
