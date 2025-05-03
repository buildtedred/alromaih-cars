"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, Eye, Search, RefreshCw, Loader2, AlertTriangle, ImageIcon } from "lucide-react"

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

export default function LogosDashboard() {
  const router = useRouter()
  const [logos, setLogos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [logoToDelete, setLogoToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchLogos()
  }, [])

  const fetchLogos = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/supabasPrisma/logo")

      if (!response.ok) {
        throw new Error(`Failed to fetch logos. Status: ${response.status}`)
      }

      const data = await response.json()
      setLogos(data)
    } catch (error) {
      console.error("Error fetching logos:", error.message)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = (logo) => {
    setLogoToDelete(logo)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!logoToDelete) return

    setDeleteDialogOpen(false)
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/supabasPrisma/logo/${logoToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete logo")

      // Update UI by removing the deleted logo
      setLogos(logos.filter((logo) => logo.id !== logoToDelete.id))
    } catch (error) {
      console.error("Error deleting logo:", error.message)
      setError(`Failed to delete logo: ${error.message}`)
    } finally {
      setIsDeleting(false)
      setLogoToDelete(null)
    }
  }

  // Filter logos based on search term
  const filteredLogos = logos.filter((logo) => logo.title?.toLowerCase().includes(searchTerm.toLowerCase()))

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
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
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
        <h3 className="text-lg font-medium">No logos found</h3>
        <p className="text-muted-foreground mt-2">
          {searchTerm ? "Try a different search term" : "Add your first logo to get started"}
        </p>
        {!searchTerm && (
          <Button
            onClick={() => router.push("/dashboard/logos/add")}
            className="mt-6 bg-brand-primary hover:bg-brand-primary/90 rounded-[5px]"
            disabled={isDeleting}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Your First Logo
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
          <p className="font-medium">Error loading logos</p>
        </div>
        <p className="text-sm mb-2">{error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchLogos}
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

    if (filteredLogos.length === 0) {
      return renderEmptyState()
    }

    return (
      <div className="rounded-[5px] border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-[80px]">Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogos.map((logo) => (
                <TableRow key={logo.id}>
                  <TableCell>
                    <div className="flex justify-center items-center h-12 w-12 rounded-[5px] overflow-hidden bg-muted border">
                      <img
                        src={logo.imageUrl || "/placeholder.svg?height=48&width=48&query=logo"}
                        alt={logo.title}
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/abstract-logo.png"
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{logo.title}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/dashboard/logos/view/${logo.id}`)}
                        disabled={isDeleting}
                        className="rounded-[5px] hover:bg-brand-light hover:text-brand-primary"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/dashboard/logos/edit/${logo.id}`)}
                        disabled={isDeleting}
                        className="rounded-[5px] hover:bg-brand-light hover:text-brand-primary"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-[5px] hover:bg-destructive/10"
                        onClick={() => confirmDelete(logo)}
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
            <h3 className="font-medium text-xl mb-2">Deleting Logo</h3>
            <p className="text-muted-foreground">Please wait while we process your request...</p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-brand-light/30 p-4 rounded-[5px] border border-brand-primary/10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-primary">Logo Management</h1>
          <p className="text-muted-foreground">Manage your logos and branding assets</p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/logos/add")}
          disabled={isDeleting}
          className="rounded-[5px] bg-brand-primary hover:bg-brand-primary/90 w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Logo
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search logos by name..."
            className="pl-8 w-full rounded-[5px] border-gray-300 focus-visible:ring-brand-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isDeleting}
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchLogos}
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
              Are you sure you want to delete the logo "{logoToDelete?.title}"? This action cannot be undone.
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
              Delete Logo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
