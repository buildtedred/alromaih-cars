"use client"

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
  Filter,
  RefreshCw,
  SortAsc,
  SortDesc,
  Eye,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

export default function AllCarsPage() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState(null)
  const [selectedCars, setSelectedCars] = useState([])
  const [sortField, setSortField] = useState("model")
  const [sortDirection, setSortDirection] = useState("asc")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [carsToDelete, setCarsToDelete] = useState([])
  const [filterBrand, setFilterBrand] = useState("all")

  // Get unique brands for filter
  const brands = [...new Set(cars.map((car) => car?.brand?.name).filter(Boolean))]

  useEffect(() => {
    fetchCars()
  }, [])

  async function fetchCars() {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/supabasPrisma/cars")

      if (!response.ok) {
        throw new Error(`Failed to fetch cars. Status: ${response.status}`)
      }

      const data = await response.json()
      // Use the English data from the API response
      setCars(data.en || [])
    } catch (error) {
      console.error("Error fetching cars:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function deleteCar(id) {
    setDeleteDialogOpen(false)
    setIsDeleting(true)

    try {
      // Delete the car from DB
      const deleteRes = await fetch(`/api/supabasPrisma/cars/${id}`, { method: "DELETE" })
      if (!deleteRes.ok) throw new Error("Failed to delete car")

      // Update UI state
      setCars((prev) => prev.filter((car) => car.id !== id))
      setSelectedCars((prev) => prev.filter((carId) => carId !== id))
    } catch (error) {
      console.error("Error deleting car:", error.message)
    } finally {
      setIsDeleting(false)
    }
  }

  async function deleteMultipleCars(ids) {
    setDeleteDialogOpen(false)
    setIsDeleting(true)

    try {
      // Delete all cars
      for (const id of ids) {
        const response = await fetch(`/api/supabasPrisma/cars/${id}`, {
          method: "DELETE",
        })
        if (!response.ok) throw new Error(`Failed to delete car ${id}`)
      }

      // Update UI
      setCars((prev) => prev.filter((car) => !ids.includes(car.id)))
      setSelectedCars([])
    } catch (error) {
      console.error("Error deleting multiple cars:", error.message)
    } finally {
      setIsDeleting(false)
      setCarsToDelete([])
    }
  }

  const handleSelectAll = () => {
    if (selectedCars.length === filteredCars.length) {
      setSelectedCars([])
    } else {
      setSelectedCars(filteredCars.map((car) => car.id))
    }
  }

  const handleSelectCar = (id) => {
    if (selectedCars.includes(id)) {
      setSelectedCars(selectedCars.filter((carId) => carId !== id))
    } else {
      setSelectedCars([...selectedCars, id])
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

  // Filter cars based on search term and brand filter
  let filteredCars = cars.filter((car) => {
    const matchesSearch = car.model?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBrand = filterBrand === "all" || car?.brand?.name === filterBrand
    return matchesSearch && matchesBrand
  })

  // Sort cars
  filteredCars = [...filteredCars].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]

    // Handle nested properties like brand.name
    if (sortField === "brand") {
      aValue = a.brand?.name || ""
      bValue = b.brand?.name || ""
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const confirmDelete = (id) => {
    setCarsToDelete([id])
    setDeleteDialogOpen(true)
  }

  const confirmDeleteMultiple = () => {
    setCarsToDelete(selectedCars)
    setDeleteDialogOpen(true)
  }

  // Placeholder image for cars without images
  const placeholderImage =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE2MCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzZiNzI4MCIgZHk9Ii4xZW0iPkNhciBJbWFnZTwvdGV4dD48L3N2Zz4="

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
        <h3 className="text-lg font-medium">No cars found</h3>
        <p className="text-muted-foreground mt-2">
          {searchTerm || filterBrand !== "all"
            ? "Try different search terms or filters"
            : "Add your first car to get started"}
        </p>
        {!searchTerm && filterBrand === "all" && (
          <Button
            asChild
            className="mt-6 bg-brand-primary hover:bg-brand-primary/90 rounded-[5px]"
            disabled={isDeleting}
          >
            <Link href="/dashboard/cars/new">
              <Plus className="mr-2 h-4 w-4" /> Add New Car
            </Link>
          </Button>
        )}
      </div>
    )
  }

  // Render error state
  const renderError = () => {
    return (
      <div className="bg-destructive/15 p-4 rounded-[5px] text-destructive border border-destructive/30">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-5 w-5" />
          <p className="font-medium">Error loading cars</p>
        </div>
        <p className="text-sm mb-2">{error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchCars}
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

    if (filteredCars.length === 0) {
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
                    checked={selectedCars.length === filteredCars.length && filteredCars.length > 0}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all cars"
                    disabled={isDeleting}
                    className="rounded-[5px]"
                  />
                </TableHead>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead
                  className={`${!isDeleting ? "cursor-pointer hover:text-brand-primary" : ""}`}
                  onClick={() => !isDeleting && handleSort("model")}
                >
                  <div className="flex items-center gap-1">
                    Model
                    {sortField === "model" &&
                      (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                  </div>
                </TableHead>
                <TableHead
                  className={`${!isDeleting ? "cursor-pointer hover:text-brand-primary" : ""}`}
                  onClick={() => !isDeleting && handleSort("year")}
                >
                  <div className="flex items-center gap-1">
                    Year
                    {sortField === "year" &&
                      (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                  </div>
                </TableHead>
                <TableHead
                  className={`${!isDeleting ? "cursor-pointer hover:text-brand-primary" : ""}`}
                  onClick={() => !isDeleting && handleSort("brand")}
                >
                  <div className="flex items-center gap-1">
                    Brand
                    {sortField === "brand" &&
                      (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                  </div>
                </TableHead>
                <TableHead
                  className={`${!isDeleting ? "cursor-pointer hover:text-brand-primary" : ""}`}
                  onClick={() => !isDeleting && handleSort("slug")}
                >
                  <div className="flex items-center gap-1">
                    Slug
                    {sortField === "slug" &&
                      (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCars.map((car) => (
                <TableRow
                  key={car.id}
                  className={selectedCars.includes(car.id) ? "bg-brand-light/50" : "hover:bg-brand-light/30"}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedCars.includes(car.id)}
                      onCheckedChange={() => handleSelectCar(car.id)}
                      aria-label={`Select ${car.model}`}
                      disabled={isDeleting}
                      className="rounded-[5px]"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center items-center h-12 w-12 rounded-[5px] overflow-hidden bg-muted border">
                      <img
                        src={car?.images?.[0] || placeholderImage}
                        alt={car?.model}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = placeholderImage
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{car.model}</TableCell>
                  <TableCell>{car.year}</TableCell>
                  <TableCell>
                    {car?.brand?.name ? (
                      <Badge
                        variant="outline"
                        className="rounded-[5px] bg-brand-light/50 text-brand-primary border-brand-primary/20"
                      >
                        {car.brand.name}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">Unknown</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground truncate max-w-[150px]">
                    {car.slug || "N/A"}
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
                        <Link href={`/dashboard/cars/car-details/${car.slug || car.id}`}>
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
                        <Link href={`/dashboard/cars/${car.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-[5px] hover:bg-destructive/10"
                        onClick={() => confirmDelete(car.id)}
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
            <h3 className="font-medium text-xl mb-2">Deleting Car{carsToDelete.length > 1 ? "s" : ""}</h3>
            <p className="text-muted-foreground">Please wait while we process your request...</p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-brand-light/30 p-4 rounded-[5px] border border-brand-primary/10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-primary">All Cars</h1>
          <p className="text-muted-foreground">Manage your cars and their brands</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {selectedCars.length > 0 && (
            <Button
              variant="destructive"
              onClick={confirmDeleteMultiple}
              disabled={isDeleting}
              className="gap-1 rounded-[5px] w-full sm:w-auto"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete Selected ({selectedCars.length})
            </Button>
          )}
          <Button
            asChild
            disabled={isDeleting}
            className="rounded-[5px] bg-brand-primary hover:bg-brand-primary/90 w-full sm:w-auto"
          >
            <Link href="/dashboard/cars/new">
              <Plus className="mr-2 h-4 w-4" /> Add New Car
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search cars..."
              className="pl-8 rounded-[5px] border-gray-300 focus-visible:ring-brand-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isDeleting}
            />
          </div>

          <Select value={filterBrand} onValueChange={setFilterBrand} disabled={isDeleting}>
            <SelectTrigger className="w-full sm:w-[180px] rounded-[5px] border-gray-300">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Filter by brand" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-[5px]">
              <SelectItem value="all" className="rounded-[5px]">
                All Brands
              </SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand} className="rounded-[5px]">
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchCars}
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
              {carsToDelete.length > 1
                ? `Are you sure you want to delete ${carsToDelete.length} cars? This action cannot be undone.`
                : "Are you sure you want to delete this car? This action cannot be undone."}
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
              onClick={() => (carsToDelete.length > 1 ? deleteMultipleCars(carsToDelete) : deleteCar(carsToDelete[0]))}
              disabled={isDeleting}
              className="rounded-[5px] bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
              {carsToDelete.length > 1 ? `Delete ${carsToDelete.length} cars` : "Delete car"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
