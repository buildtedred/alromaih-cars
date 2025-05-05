"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { PlusCircle, Pencil, Trash2, Eye, Loader2, AlertTriangle, RefreshCw, ImageIcon, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function CarCarouselList() {
  const [carousels, setCarousels] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [carouselToDelete, setCarouselToDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCarousels()
  }, [])

  const fetchCarousels = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/supabasPrisma/car-carousel")

      if (!response.ok) {
        throw new Error(`Failed to fetch carousels. Status: ${response.status}`)
      }

      const data = await response.json()
      setCarousels(data)
    } catch (error) {
      console.error("Error fetching carousels:", error.message)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = (carousel) => {
    setCarouselToDelete(carousel)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!carouselToDelete) return

    setDeleteDialogOpen(false)
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/supabasPrisma/car-carousel/${carouselToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete carousel")

      // Update UI by removing the deleted carousel
      setCarousels(carousels.filter((carousel) => carousel.id !== carouselToDelete.id))
    } catch (error) {
      console.error("Error deleting carousel:", error.message)
      setError(`Failed to delete carousel: ${error.message}`)
    } finally {
      setIsDeleting(false)
      setCarouselToDelete(null)
    }
  }

  // Filter carousels based on search term
  const filteredCarousels = carousels.filter(
    (carousel) =>
      carousel.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carousel.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
                  <Skeleton className="h-12 w-16 rounded-[5px]" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-64" />
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
        <ImageIcon className="h-16 w-16 text-brand-primary/30 mb-4" />
        <h3 className="text-lg font-medium">No carousels found</h3>
        <p className="text-muted-foreground mt-2">
          {searchTerm ? "Try a different search term" : "Add your first carousel to get started"}
        </p>
        {!searchTerm && (
          <Button
            asChild
            className="mt-6 bg-brand-primary hover:bg-brand-primary/90 rounded-[5px]"
            disabled={isDeleting}
          >
            <Link href="/dashboard/car-carousel/add">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Carousel
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
          <p className="font-medium">Error loading carousels</p>
        </div>
        <p className="text-sm mb-2">{error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchCarousels}
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

    if (filteredCarousels.length === 0) {
      return renderEmptyState()
    }

    return (
      <div className="rounded-[5px] border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCarousels.map((carousel) => (
                <TableRow key={carousel.id}>
                  <TableCell>
                    <div className=" flex justify-center items-center relative h-12 w-16 rounded-[5px] overflow-hidden bg-muted border">
                      <Image
                        src={carousel.imageUrl || "/placeholder.svg?height=160&width=320&query=carousel image"}
                        alt={carousel.title}
                        className="object-cover"
                        width={48}
                        height={48}
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/placeholder.svg?key=w5u71"
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{carousel.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{carousel.description}</TableCell>
                  <TableCell>{new Date(carousel.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        disabled={isDeleting}
                        className="rounded-[5px] hover:bg-brand-light hover:text-brand-primary"
                      >
                        <Link href={`/dashboard/car-carousel/carousel-detail/${carousel.id}`}>
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
                        <Link href={`/dashboard/car-carousel/${carousel.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-[5px] hover:bg-destructive/10"
                        onClick={() => confirmDelete(carousel)}
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
            <h3 className="font-medium text-xl mb-2">Deleting Carousel</h3>
            <p className="text-muted-foreground">Please wait while we process your request...</p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-brand-light/30 p-4 rounded-[5px] border border-brand-primary/10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-primary">Car Carousels</h1>
          <p className="text-muted-foreground">Manage your car carousel images and content</p>
        </div>
        <Button
          asChild
          disabled={isDeleting}
          className="rounded-[5px] bg-brand-primary hover:bg-brand-primary/90 w-full sm:w-auto"
        >
          <Link href="/dashboard/car-carousel/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Carousel
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search carousels..."
            className="pl-8 w-full rounded-[5px] border-gray-300 focus-visible:ring-brand-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isDeleting}
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchCarousels}
          disabled={loading || isDeleting}
          className="gap-1 rounded-[5px] border-gray-300 hover:bg-brand-light hover:text-brand-primary w-full sm:w-auto"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {renderContent()}

      <Dialog open={deleteDialogOpen} onOpenChange={(open) => !isDeleting && setDeleteDialogOpen(open)}>
        <DialogContent className="rounded-[5px] border-red-200 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the carousel "{carouselToDelete?.title}"? This action cannot be undone.
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
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-[5px] bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Delete Carousel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
