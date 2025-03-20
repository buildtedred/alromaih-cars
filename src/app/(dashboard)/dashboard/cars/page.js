"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Plus,
  Pencil,
  Trash2,
  Car,
  Search,
  MoreHorizontal,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AllCarsPage() {
  const router = useRouter()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState(null)
  const [selectedCars, setSelectedCars] = useState([])
  const [viewMode, setViewMode] = useState("table")
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
      setCars(data)
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
      const response = await fetch(`/api/supabasPrisma/cars/${id}`, { method: "DELETE" })

      if (!response.ok) throw new Error("Failed to delete car")

      // Update the local state instead of reloading
      setCars(cars.filter((car) => car.id !== id))
      setSelectedCars(selectedCars.filter((carId) => carId !== id))
    } catch (error) {
      console.error("Error deleting car:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  async function deleteMultipleCars(ids) {
    setDeleteDialogOpen(false)
    setIsDeleting(true)
    try {
      // In a real app, you might want to use a batch delete endpoint
      // For now, we'll delete them one by one
      for (const id of ids) {
        const response = await fetch(`/api/supabasPrisma/cars/${id}`, { method: "DELETE" })
        if (!response.ok) throw new Error(`Failed to delete car ${id}`)
      }

      // Update the local state
      setCars(cars.filter((car) => !ids.includes(car.id)))
      setSelectedCars([])
    } catch (error) {
      console.error("Error deleting cars:", error)
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

    if (filteredCars.length === 0 && !error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Car className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No cars found</h3>
          <p className="text-muted-foreground mt-2">
            {searchTerm || filterBrand !== "all"
              ? "Try different search terms or filters"
              : "Add your first car to get started"}
          </p>
          {!searchTerm && filterBrand === "all" && (
            <Button asChild className="mt-4">
              <Link href="/dashboard/cars/new">
                <Plus className="mr-2 h-4 w-4" /> Add New Car
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
                      checked={selectedCars.length === filteredCars.length && filteredCars.length > 0}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all cars"
                    />
                  </TableHead>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("model")}>
                    <div className="flex items-center gap-1">
                      Model
                      {sortField === "model" &&
                        (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("year")}>
                    <div className="flex items-center gap-1">
                      Year
                      {sortField === "year" &&
                        (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("brand")}>
                    <div className="flex items-center gap-1">
                      Brand
                      {sortField === "brand" &&
                        (sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCars.map((car) => (
                  <TableRow key={car.id} className={selectedCars.includes(car.id) ? "bg-muted/50" : ""}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCars.includes(car.id)}
                        onCheckedChange={() => handleSelectCar(car.id)}
                        aria-label={`Select ${car.model}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="h-10 w-10 rounded-md overflow-hidden bg-muted">
                        <img
                          src={car?.images?.[0] || "/placeholder.svg"}
                          alt={car?.model}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "/placeholder.svg"
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{car.model}</TableCell>
                    <TableCell>{car.year}</TableCell>
                    <TableCell>
                      {car?.brand?.name ? (
                        <Badge variant="outline">{car.brand.name}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">Unknown</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/cars/car-details/${car.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/cars/${car.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => confirmDelete(car.id)}
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
            {filteredCars.map((car) => (
              <Card
                key={car.id}
                className={`overflow-hidden ${selectedCars.includes(car.id) ? "ring-2 ring-primary" : ""}`}
              >
                <div className="relative">
                  <div className="absolute top-2 left-2 z-10">
                    <Checkbox
                      checked={selectedCars.includes(car.id)}
                      onCheckedChange={() => handleSelectCar(car.id)}
                      aria-label={`Select ${car.model}`}
                      className="bg-background/80 backdrop-blur-sm"
                    />
                  </div>
                  <div className="relative h-48 bg-muted">
                    <img
                      src={car?.images?.[0] || "/placeholder.svg"}
                      alt={car?.model}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.svg"
                      }}
                    />
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{car.model}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{car.year}</Badge>
                        {car?.brand?.name && <Badge variant="secondary">{car.brand.name}</Badge>}
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
                          <Link href={`/dashboard/cars/${car.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/cars/${car.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => confirmDelete(car.id)}
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
          <h1 className="text-2xl font-bold tracking-tight">All Cars</h1>
          <p className="text-muted-foreground">Manage your cars and their brands</p>
        </div>
        <div className="flex gap-2">
          {selectedCars.length > 0 && (
            <Button variant="destructive" onClick={confirmDeleteMultiple} disabled={isDeleting} className="gap-1">
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete Selected ({selectedCars.length})
            </Button>
          )}
          <Button asChild>
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
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={filterBrand} onValueChange={setFilterBrand}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Filter by brand" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" size="sm" onClick={fetchCars} disabled={loading} className="gap-1 w-full sm:w-auto">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/15 p-4 rounded-md text-destructive">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5" />
            <p className="font-medium">Error loading cars</p>
          </div>
          <p className="text-sm mb-2">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchCars}>
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
              {carsToDelete.length > 1
                ? `Are you sure you want to delete ${carsToDelete.length} cars? This action cannot be undone.`
                : "Are you sure you want to delete this car? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => (carsToDelete.length > 1 ? deleteMultipleCars(carsToDelete) : deleteCar(carsToDelete[0]))}
              disabled={isDeleting}
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

