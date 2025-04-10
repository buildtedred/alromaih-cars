"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Plus,
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

export default function CarBrands() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)
  const [selectedBrands, setSelectedBrands] = useState([])
  const [viewMode, setViewMode] = useState("table")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [brandsToDelete, setBrandsToDelete] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)

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
      console.log(" response is", data)
      setBrands(data)
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
      const response = await fetch(`/api/supabasPrisma/carbrands/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete brand")

        

      setBrands(brands.filter((brand) => brand.id !== id))
      setSelectedBrands(selectedBrands.filter((brandId) => brandId !== id))
    } catch (error) {
      console.error("Error deleting brand:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  async function deleteMultipleBrands(ids) {
    setDeleteDialogOpen(false)
    setIsDeleting(true)
    try {
      // In a real app, you might want to use a batch delete endpoint
      // For now, we'll delete them one by one
      for (const id of ids) {
        const response = await fetch(`/api/supabasPrisma/carbrands/${id}`, { method: "DELETE" })
        if (!response.ok) throw new Error(`Failed to delete brand ${id}`)
      }

      // Update the local state
      setBrands(brands.filter((brand) => !ids.includes(brand.id)))
      setSelectedBrands([])
    } catch (error) {
      console.error("Error deleting brands:", error)
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

  // Filter brands based on search term
  let filteredBrands = brands.filter((brand) => brand.name?.toLowerCase().includes(searchTerm.toLowerCase()))

  // Sort brands
  filteredBrands = [...filteredBrands].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]

    // Handle special case for cars count
    if (sortField === "carsCount") {
      aValue = a.cars?.length || 0
      bValue = b.cars?.length || 0
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const confirmDelete = (id) => {
    
    setBrandsToDelete([id])
    setDeleteDialogOpen(true)
  }

  const confirmDeleteMultiple = () => {
    setBrandsToDelete(selectedBrands)
    setDeleteDialogOpen(true)
  }

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

    if (filteredBrands.length === 0 && !error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Car className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No car brands found</h3>
          <p className="text-muted-foreground mt-2">
            {searchTerm ? "Try a different search term" : "Add your first car brand to get started"}
          </p>
          {!searchTerm && (
            <Button asChild className="mt-4">
              <Link href="/dashboard/brands/new">
                <Plus className="mr-2 h-4 w-4" /> Add New Brand
              </Link>
            </Button>
          )}
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
                      checked={selectedBrands.length === filteredBrands.length && filteredBrands.length > 0}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all brands"
                    />
                  </TableHead>
                  <TableHead className="w-[80px]">Logo</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                    <div className="flex items-center gap-1">
                      Brand Name
                      {sortField === "name" &&
                        (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("carsCount")}>
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
                {filteredBrands.map((brand) => (
                  <TableRow key={brand.id} className={selectedBrands.includes(brand.id) ? "bg-muted/50" : ""}>
                    <TableCell>
                      <Checkbox
                        checked={selectedBrands.includes(brand.id)}
                        onCheckedChange={() => handleSelectBrand(brand.id)}
                        aria-label={`Select ${brand.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="h-10 w-10 rounded-md overflow-hidden bg-muted">
                        <img
                          src={brand.image || placeholderImage}
                          alt={brand.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = placeholderImage
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{brand.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{brand.cars?.length || 0} Cars</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/brands/${brand.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/brands/${brand.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => confirmDelete(brand.id)}
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
            {filteredBrands.map((brand) => (
              <Card
                key={brand.id}
                className={`overflow-hidden ${selectedBrands.includes(brand.id) ? "ring-2 ring-primary" : ""}`}
              >
                <div className="relative">
                  <div className="absolute top-2 left-2 z-10">
                    <Checkbox
                      checked={selectedBrands.includes(brand.id)}
                      onCheckedChange={() => handleSelectBrand(brand.id)}
                      aria-label={`Select ${brand.name}`}
                      className="bg-background/80 backdrop-blur-sm"
                    />
                  </div>
                  <div className="relative h-48 bg-muted">
                    <img
                      src={brand.image || placeholderImage}
                      alt={brand.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = placeholderImage
                      }}
                    />
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{brand.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{brand.cars?.length || 0} Cars</Badge>
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
                          <Link href={`/dashboard/brands/${brand.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/brands/${brand.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/cars/new?brandId=${brand.id}`}>
                            <Plus className="mr-2 h-4 w-4" /> Add Car
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => confirmDelete(brand.id)}
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
          <h1 className="text-2xl font-bold tracking-tight">Car Brands</h1>
          <p className="text-muted-foreground">Manage your car brands and their models</p>
        </div>
        <div className="flex gap-2">
          {selectedBrands.length > 0 && (
            <Button variant="destructive" onClick={confirmDeleteMultiple} disabled={isDeleting} className="gap-1">
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete Selected ({selectedBrands.length})
            </Button>
          )}
          <Button asChild>
            <Link href="/dashboard/brands/new">
              <Plus className="mr-2 h-4 w-4" /> Add New Brand
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search brands..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button variant="outline" size="sm" onClick={fetchBrands} disabled={loading} className="gap-1 w-full sm:w-auto">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/15 p-4 rounded-md text-destructive">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5" />
            <p className="font-medium">Error loading brands</p>
          </div>
          <p className="text-sm mb-2">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchBrands}>
            Try Again
          </Button>
        </div>
      )}

      {renderContent()}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              {brandsToDelete.length > 1
                ? `Are you sure you want to delete ${brandsToDelete.length} brands? This action cannot be undone.`
                : "Are you sure you want to delete this brand? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                brandsToDelete.length > 1 ? deleteMultipleBrands(brandsToDelete) : deleteBrand(brandsToDelete[0])
              }
              disabled={isDeleting}
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

