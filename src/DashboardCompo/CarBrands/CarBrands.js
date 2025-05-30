"use client"

import React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Plus,
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
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CarBrands() {
  const [brandsData, setBrandsData] = useState({ en: [], ar: [] })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)
  const [selectedBrands, setSelectedBrands] = useState([])
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [brandsToDelete, setBrandsToDelete] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)

  // We'll implement Arabic support later

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    fetchBrands()
  }, [])

  async function fetchBrands() {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/supabasPrisma/carbrands")

      if (!response.ok) {
        const text = await response.text()
        try {
          const errorData = JSON.parse(text)
          throw new Error(errorData.error || `Server error: ${response.status}`)
        } catch (parseError) {
          if (text.includes("<!DOCTYPE html>")) {
            throw new Error(`Server returned HTML instead of JSON. Status: ${response.status}`)
          } else {
            throw new Error(`Failed to fetch brands. Status: ${response.status}`)
          }
        }
      }

      const data = await response.json()
      setBrandsData(data)
      setSelectedBrands([]) // Clear selections when refreshing
    } catch (error) {
      console.error("Error fetching brands:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function deleteBrand(id) {
    setDeleteDialogOpen(false)
    setIsDeleting(true)

    try {
      // Delete the brand record
      const deleteResponse = await fetch(`/api/supabasPrisma/carbrands/${id}`, {
        method: "DELETE",
      })

      if (!deleteResponse.ok) throw new Error("Failed to delete brand")

      // Update UI by removing the deleted brand
      setBrandsData((prev) => ({
        en: prev.en.filter((brand) => brand.id !== id),
        ar: prev.ar.filter((brand) => brand.id !== id),
      }))

      setSelectedBrands(selectedBrands.filter((brandId) => brandId !== id))
    } catch (err) {
      console.error("❌ Error deleting brand:", err.message)
    } finally {
      setIsDeleting(false)
    }
  }

  async function deleteMultipleBrands(ids) {
    setDeleteDialogOpen(false)
    setIsDeleting(true)

    try {
      // Delete all brand records
      for (const id of ids) {
        const response = await fetch(`/api/supabasPrisma/carbrands/${id}`, {
          method: "DELETE",
        })
        if (!response.ok) throw new Error(`Failed to delete brand ${id}`)
      }

      // Update UI by removing the deleted brands
      setBrandsData((prev) => ({
        en: prev.en.filter((brand) => !ids.includes(brand.id)),
        ar: prev.ar.filter((brand) => !ids.includes(brand.id)),
      }))

      setSelectedBrands([])
    } catch (err) {
      console.error("❌ Error deleting multiple brands:", err.message)
    } finally {
      setIsDeleting(false)
      setBrandsToDelete([])
    }
  }

  const handleSelectAll = () => {
    if (selectedBrands.length === filteredBrands.length) {
      setSelectedBrands([])
    } else {
      setSelectedBrands(filteredBrands.map((brand) => brand.id))
    }
  }

  const handleSelectBrand = (id) => {
    if (selectedBrands.includes(id)) {
      setSelectedBrands(selectedBrands.filter((brandId) => brandId !== id))
    } else {
      setSelectedBrands([...selectedBrands, id])
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

  // Get only English brands for now
  const currentBrands = brandsData.en || []

  // Filter brands based on search term
  let filteredBrands = currentBrands.filter((brand) => {
    return brand.name?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Sort brands
  filteredBrands = [...filteredBrands].sort((a, b) => {
    let aValue, bValue

    if (sortField === "name") {
      aValue = a.name
      bValue = b.name
    } else if (sortField === "carsCount") {
      aValue = a.cars?.length || 0
      bValue = b.cars?.length || 0
    } else {
      aValue = a[sortField]
      bValue = b[sortField]
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Pagination
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage)
  const paginatedBrands = filteredBrands.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const confirmDelete = (id) => {
    setBrandsToDelete([id])
    setDeleteDialogOpen(true)
  }

  const confirmDeleteMultiple = () => {
    setBrandsToDelete(selectedBrands)
    setDeleteDialogOpen(true)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Language toggle will be implemented later

  const placeholderImage =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE2MCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzZiNzI4MCIgZHk9Ii4xZW0iPkJyYW5kIEltYWdlPC90ZXh0Pjwvc3ZnPg=="

  // Render the content based on loading and data state
  const renderContent = () => {
    if (loading) {
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

    if (filteredBrands.length === 0 && !error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Car className="h-16 w-16 text-brand-primary/30 mb-4" />
          <h3 className="text-lg font-medium">No car brands found</h3>
          <p className="text-muted-foreground mt-2">{searchTerm ? "Try a different search term" : "No brands found"}</p>
          {!searchTerm && (
            <Button
              asChild
              className="mt-6 bg-brand-primary hover:bg-brand-primary/90 rounded-[5px]"
              disabled={isDeleting}
            >
              <Link href="/dashboard/brands/new">
                <Plus className="mr-2 h-4 w-4" /> Add New Brand
              </Link>
            </Button>
          )}
        </div>
      )
    }

    return (
      <>
        <div className="rounded-[5px] border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedBrands.length === paginatedBrands.length && paginatedBrands.length > 0}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all brands"
                      disabled={isDeleting}
                      className="rounded-[5px]"
                    />
                  </TableHead>
                  <TableHead className="w-[80px]">Logo</TableHead>
                  <TableHead
                    className={`${!isDeleting ? "cursor-pointer hover:text-brand-primary" : ""}`}
                    onClick={!isDeleting ? () => handleSort("name") : undefined}
                  >
                    <div className="flex items-center gap-1">
                      Brand Name
                      {sortField === "name" &&
                        (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                    </div>
                  </TableHead>
                  <TableHead
                    className={`${!isDeleting ? "cursor-pointer hover:text-brand-primary" : ""}`}
                    onClick={!isDeleting ? () => handleSort("carsCount") : undefined}
                  >
                    <div className="flex items-center gap-1">
                      Cars
                      {sortField === "carsCount" &&
                        (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBrands.map((brand) => (
                  <TableRow key={brand.id} className={selectedBrands.includes(brand.id) ? "bg-brand-light/50" : ""}>
                    <TableCell>
                      <Checkbox
                        checked={selectedBrands.includes(brand.id)}
                        onCheckedChange={() => handleSelectBrand(brand.id)}
                        aria-label={`Select ${brand.name}`}
                        disabled={isDeleting}
                        className="rounded-[5px]"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center items-center h-12 w-12 rounded-[5px] overflow-hidden bg-muted border">
                        <Image
                          src={brand.image || placeholderImage}
                          alt={brand.name}
                          className="object-cover"
                          width={48}
                          height={48}
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = placeholderImage
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{brand.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="rounded-[5px] bg-brand-light/50 text-brand-primary border-brand-primary/20"
                      >
                        {brand.cars?.length || 0} Cars
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
                          <Link href={`/dashboard/brands/brand-detail/${brand.id}`}>
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
                          <Link href={`/dashboard/brands/${brand.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-[5px] hover:bg-destructive/10"
                          onClick={() => confirmDelete(brand.id)}
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

        {/* Pagination */}
        {filteredBrands.length > 0 && (
          <div className="flex items-center justify-between py-4">
            <div className="flex-1 text-sm text-muted-foreground text-left">
              Showing{" "}
              <span className="font-medium">
                {Math.min((currentPage - 1) * itemsPerPage + 1, filteredBrands.length)}
              </span>{" "}
              to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredBrands.length)}</span> of{" "}
              <span className="font-medium">{filteredBrands.length}</span> brands
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isDeleting}
                className="h-8 w-8 p-0 rounded-[5px]"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous Page</span>
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    // Show first page, last page, current page, and pages around current page
                    return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)
                  })
                  .map((page, i, arr) => (
                    <React.Fragment key={page}>
                      {i > 0 && arr[i - 1] !== page - 1 && <span className="text-muted-foreground">...</span>}
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        disabled={isDeleting}
                        className={`h-8 w-8 p-0 rounded-[5px] ${
                          currentPage === page ? "bg-brand-primary hover:bg-brand-primary/90" : ""
                        }`}
                      >
                        {page}
                      </Button>
                    </React.Fragment>
                  ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isDeleting}
                className="h-8 w-8 p-0 rounded-[5px]"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next Page</span>
              </Button>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value))
                  setCurrentPage(1) // Reset to first page when changing items per page
                }}
                disabled={isDeleting}
              >
                <SelectTrigger className="h-8 w-[70px] rounded-[5px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="space-y-4 relative">
      {/* Full-page overlay during deletion */}
      {isDeleting && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card p-8 rounded-[5px] shadow-lg text-center max-w-md w-full border border-brand-primary/20">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-brand-primary" />
            <h3 className="font-medium text-xl mb-2">Deleting Brand{brandsToDelete.length > 1 ? "s" : ""}</h3>
            <p className="text-muted-foreground">Please wait while we process your request...</p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-brand-light/30 p-4 rounded-[5px] border border-brand-primary/10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-primary">Car Brands</h1>
          <p className="text-muted-foreground">Manage your car brands and their models</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {selectedBrands.length > 0 && (
            <Button
              variant="destructive"
              onClick={confirmDeleteMultiple}
              disabled={isDeleting}
              className="gap-1 rounded-[5px] w-full sm:w-auto"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete Selected ({selectedBrands.length})
            </Button>
          )}
          <Button
            asChild
            disabled={isDeleting}
            className="rounded-[5px] bg-brand-primary hover:bg-brand-primary/90 w-full sm:w-auto"
          >
            <Link href="/dashboard/brands/new">
              <Plus className="mr-2 h-4 w-4" />
              Add New Brand
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search brands..."
            className="pl-8 w-full rounded-[5px] border-gray-300 focus-visible:ring-brand-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isDeleting}
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={loading || isDeleting}
                className="gap-1 rounded-[5px] border-gray-300 hover:bg-brand-light hover:text-brand-primary w-full sm:w-auto"
              >
                <Filter className="h-4 w-4" />
                <span>Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-[5px]">
              <DropdownMenuItem
                onClick={() => {
                  setSortField("name")
                  setSortDirection("asc")
                }}
                className={
                  sortField === "name" && sortDirection === "asc" ? "bg-brand-light/50 text-brand-primary" : ""
                }
              >
                <SortAsc className="h-4 w-4 mr-2" />
                Name (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSortField("name")
                  setSortDirection("desc")
                }}
                className={
                  sortField === "name" && sortDirection === "desc" ? "bg-brand-light/50 text-brand-primary" : ""
                }
              >
                <SortDesc className="h-4 w-4 mr-2" />
                Name (Z-A)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSortField("carsCount")
                  setSortDirection("desc")
                }}
                className={
                  sortField === "carsCount" && sortDirection === "desc" ? "bg-brand-light/50 text-brand-primary" : ""
                }
              >
                Most Cars
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSortField("carsCount")
                  setSortDirection("asc")
                }}
                className={
                  sortField === "carsCount" && sortDirection === "asc" ? "bg-brand-light/50 text-brand-primary" : ""
                }
              >
                Fewest Cars
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchBrands}
            disabled={loading || isDeleting}
            className="gap-1 rounded-[5px] border-gray-300 hover:bg-brand-light hover:text-brand-primary w-full sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/15 p-4 rounded-[5px] text-destructive border border-destructive/30">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5" />
            <p className="font-medium">Error loading brands</p>
          </div>
          <p className="text-sm mb-2">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchBrands}
            disabled={isDeleting}
            className="rounded-[5px] border-destructive/30 hover:bg-destructive/20"
          >
            Try Again
          </Button>
        </div>
      )}

      {renderContent()}

      <Dialog open={deleteDialogOpen} onOpenChange={(open) => !isDeleting && setDeleteDialogOpen(open)}>
        <DialogContent className="rounded-[5px] border-red-200 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              {brandsToDelete.length > 1
                ? `Are you sure you want to delete ${brandsToDelete.length} brands? This action cannot be undone.`
                : "Are you sure you want to delete this brand? This action cannot be undone."}
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
                brandsToDelete.length > 1 ? deleteMultipleBrands(brandsToDelete) : deleteBrand(brandsToDelete[0])
              }
              disabled={isDeleting}
              className="rounded-[5px] bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
              {brandsToDelete.length > 1 ? `Delete ${brandsToDelete.length} brands` : "Delete brand"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
