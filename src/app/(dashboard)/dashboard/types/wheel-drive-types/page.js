"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Globe,
  Search,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Trash,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import axios from "axios"

export default function WheelDriveTypesPage() {
  const [language, setLanguage] = useState("en")
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [formData, setFormData] = useState({ title: "", title_ar: "" })
  const [formError, setFormError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("english")
  const [isPageDisabled, setIsPageDisabled] = useState(false)
  const [deleteMessage, setDeleteMessage] = useState("")

  // Selected items for batch deletion
  const [selectedItems, setSelectedItems] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Fetch data
  const fetchItems = async () => {
    setLoading(true)
    try {
      const response = await axios.get("/api/wheeldrivetype")
      if (response.status !== 200) {
        throw new Error("Failed to fetch data")
      }
      const data = response.data
      setItems(data)
      setTotalPages(Math.ceil(data.length / itemsPerPage))
    } catch (err) {
      console.error("Error fetching wheel drive types:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  // Filter items based on search query
  useEffect(() => {
    if (!items || items.length === 0) {
      setFilteredItems([])
      return
    }

    let filtered = items

    // Apply search filter
    if (searchQuery.trim() !== "") {
      filtered = items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.title_ar && item.title_ar.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Update total pages based on filtered items
    setTotalPages(Math.ceil(filtered.length / itemsPerPage))

    // Reset to first page if current page is out of bounds
    if (currentPage > Math.ceil(filtered.length / itemsPerPage)) {
      setCurrentPage(1)
    }

    // Paginate the filtered items
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage)

    setFilteredItems(paginatedItems)
  }, [searchQuery, items, currentPage, itemsPerPage])

  // Reset selected items when filtered items change
  useEffect(() => {
    setSelectedItems([])
    setSelectAll(false)
  }, [filteredItems])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to first page on search
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
  }

  // Handle pagination
  const goToPage = (page) => {
    setCurrentPage(page)
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Handle add item
  const handleAdd = async () => {
    setFormError(null)

    // Validate form - only English title is required
    if (!formData.title.trim()) {
      setFormError("English wheel drive type name is required")
      setActiveTab("english")
      return
    }

    setIsSubmitting(true)
    try {
      await axios.post("/api/wheeldrivetype", formData)

      // Refresh the data
      fetchItems()

      // Reset form and close dialog
      setFormData({ title: "", title_ar: "" })
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Error adding item:", error)
      setFormError(error.response?.data?.error || "Failed to create wheel drive type. It may already exist.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle edit item
  const handleEdit = async () => {
    if (!currentItem) return
    setFormError(null)

    // Validate form - only English title is required
    if (!formData.title.trim()) {
      setFormError("English wheel drive type name is required")
      setActiveTab("english")
      return
    }

    setIsSubmitting(true)
    try {
      await axios.put("/api/wheeldrivetype", {
        id: currentItem.id,
        title: formData.title,
        title_ar: formData.title_ar,
      })

      // Refresh the data
      fetchItems()

      // Reset form and close dialog
      setCurrentItem(null)
      setFormData({ title: "", title_ar: "" })
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Error updating item:", error)
      setFormError(error.response?.data?.error || "Failed to update wheel drive type.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle delete item directly without confirmation
  const handleDeleteDirect = async (item) => {
    if (!item) return

    setIsPageDisabled(true) // Disable the entire page immediately
    setIsSubmitting(true)
    setDeleteMessage("Deleting wheel drive type")

    try {
      await axios.delete("/api/wheeldrivetype", {
        data: { id: item.id },
      })

      // Refresh the data
      fetchItems()
    } catch (error) {
      console.error("Error deleting item:", error)
    } finally {
      setIsSubmitting(false)
      setIsPageDisabled(false) // Re-enable the page
    }
  }

  // Handle delete all items
  const handleDeleteAll = async () => {
    if (!items || items.length === 0) return

    setIsPageDisabled(true) // Disable the entire page immediately
    setIsSubmitting(true)
    setDeleteMessage("Deleting all wheel drive types")

    try {
      // Create an array of promises for each delete operation
      const deletePromises = items.map((item) =>
        axios.delete("/api/wheeldrivetype", {
          data: { id: item.id },
        }),
      )

      // Execute all delete operations in parallel
      await Promise.all(deletePromises)

      // Refresh the data
      fetchItems()
    } catch (error) {
      console.error("Error deleting all items:", error)
    } finally {
      setIsSubmitting(false)
      setIsPageDisabled(false) // Re-enable the page
    }
  }

  // Handle checkbox selection
  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId)
      } else {
        return [...prev, itemId]
      }
    })
  }

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map((item) => item.id))
    }
    setSelectAll(!selectAll)
  }

  // Handle delete selected items
  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return

    setIsPageDisabled(true) // Disable the entire page immediately
    setIsSubmitting(true)
    setDeleteMessage(`Deleting ${selectedItems.length} selected wheel drive type${selectedItems.length > 1 ? "s" : ""}`)

    try {
      // Create an array of promises for each delete operation
      const deletePromises = selectedItems.map((itemId) =>
        axios.delete("/api/wheeldrivetype", {
          data: { id: itemId },
        }),
      )

      // Execute all delete operations in parallel
      await Promise.all(deletePromises)

      // Refresh the data
      fetchItems()

      // Clear selected items
      setSelectedItems([])
      setSelectAll(false)
    } catch (error) {
      console.error("Error deleting selected items:", error)
    } finally {
      setIsSubmitting(false)
      setIsPageDisabled(false) // Re-enable the page
    }
  }

  // Format date based on language
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(language === "en" ? "en-US" : "ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // Skeleton loader for table rows
  const TableRowSkeleton = ({ columns = 5 }) => (
    <TableRow className="hover:bg-brand-light/10">
      {Array(columns)
        .fill(0)
        .map((_, index) => (
          <TableCell key={index}>
            <Skeleton className={`h-6 ${index === columns - 1 ? "w-20 ml-auto" : "w-full max-w-[200px]"}`} />
          </TableCell>
        ))}
    </TableRow>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 relative">
      {/* Page overlay when deleting */}
      {isPageDisabled && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card p-8 rounded-[5px] shadow-lg text-center max-w-md w-full border border-brand-primary/20">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-brand-primary" />
            <h3 className="font-medium text-xl mb-2">{deleteMessage}</h3>
            <p className="text-muted-foreground">Please wait while we process your request...</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1 text-brand-primary">
            {language === "en" ? "Wheel Drive Types" : "أنواع الدفع"}
          </h1>
          <p className="text-gray-500 text-sm">
            {language === "en" ? "Manage wheel drive types" : "إدارة أنواع الدفع"}
          </p>
        </div>

        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <Tabs value={language} onValueChange={(value) => setLanguage(value)} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2 rounded-[5px]">
              <TabsTrigger value="en" className="flex items-center gap-1 rounded-[5px]">
                <Globe className="h-4 w-4" />
                English
              </TabsTrigger>
              <TabsTrigger value="ar" className="flex items-center gap-1 rounded-[5px]">
                <Globe className="h-4 w-4" />
                العربية
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setFormData({ title: "", title_ar: "" })
                  setFormError(null)
                  setActiveTab("english")
                }}
                className="h-9 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-[5px]"
                disabled={isPageDisabled}
              >
                <Plus className="mr-2 h-4 w-4" />
                {language === "en" ? "Add New" : "إضافة جديد"}
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[5px] max-w-md">
              <DialogHeader className="text-center">
                <DialogTitle className="text-xl font-bold text-brand-primary">
                  {language === "en" ? "Add New Wheel Drive Type" : "إضافة نوع دفع جديد"}
                </DialogTitle>
                <DialogDescription className="text-gray-500">
                  {language === "en"
                    ? "Fill in the details below to create a new wheel drive type."
                    : "املأ التفاصيل أدناه لإنشاء نوع دفع جديد."}
                </DialogDescription>
              </DialogHeader>

              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-[5px] text-sm flex items-start gap-2 mb-4">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Error</p>
                    <p className="text-xs">{formError}</p>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 p-6 rounded-[5px] border border-gray-100 shadow-sm">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 rounded-[5px] mb-4">
                    <TabsTrigger value="english" className="rounded-[5px]">
                      English
                    </TabsTrigger>
                    <TabsTrigger value="arabic" className="rounded-[5px]">
                      العربية
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="english" className="mt-2">
                    <div className="space-y-3">
                      <Label htmlFor="add-title" className="text-sm font-medium">
                        English Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="add-title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter title in English"
                        className="rounded-[5px] border-gray-300 focus:border-brand-primary focus:ring-brand-primary/20"
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="arabic" className="mt-2">
                    <div className="space-y-3">
                      <Label htmlFor="add-title_ar" className="text-sm font-medium">
                        Arabic Title <span className="text-muted-foreground text-xs">(optional)</span>
                      </Label>
                      <Input
                        id="add-title_ar"
                        name="title_ar"
                        value={formData.title_ar}
                        onChange={handleChange}
                        placeholder="أدخل العنوان بالعربية"
                        dir="rtl"
                        className="rounded-[5px] border-gray-300 focus:border-brand-primary focus:ring-brand-primary/20"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <DialogFooter className="mt-6 flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData({ title: "", title_ar: "" })
                    setFormError(null)
                    setIsAddDialogOpen(false)
                  }}
                  disabled={isSubmitting}
                  className="rounded-[5px] border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  {language === "en" ? "Cancel" : "إلغاء"}
                </Button>
                <Button
                  onClick={handleAdd}
                  disabled={isSubmitting}
                  className="bg-brand-primary hover:bg-brand-primary/90 text-white rounded-[5px] px-6"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {language === "en" ? "Creating..." : "جاري الإنشاء..."}
                    </>
                  ) : language === "en" ? (
                    "Create"
                  ) : (
                    "إنشاء"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border rounded-[5px] shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between bg-brand-light/30 rounded-t-[5px] py-3 px-4">
          <CardTitle className="text-base text-brand-primary">
            {language === "en" ? "Wheel Drive Types" : "أنواع الدفع"}
          </CardTitle>

          <div className="flex items-center gap-2">
            {selectedItems.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
                disabled={isPageDisabled || loading}
                className="h-8 rounded-[5px] bg-red-500 hover:bg-red-600 text-white"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {language === "en"
                  ? `Delete Selected (${selectedItems.length})`
                  : `حذف المحدد (${selectedItems.length})`}
              </Button>
            )}

            {items && items.length > 0 && selectedItems.length === 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteAll}
                disabled={isPageDisabled || loading}
                className="h-8 rounded-[5px] border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
              >
                <Trash className="mr-2 h-4 w-4" />
                {language === "en" ? "Delete All" : "حذف الكل"}
              </Button>
            )}
          </div>
        </CardHeader>

        <div className="px-4 py-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search wheel drive types..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-10 rounded-[5px] border-gray-300 focus:border-brand-primary focus:ring-brand-primary/20 h-9"
              disabled={isPageDisabled || loading}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isPageDisabled || loading}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <CardContent className="p-0">
          {loading ? (
            <div className="overflow-hidden rounded-b-[5px]">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Skeleton className="h-4 w-4 rounded" />
                    </TableHead>
                    <TableHead className="font-semibold">English Title</TableHead>
                    {language === "ar" && <TableHead className="font-semibold">Arabic Title</TableHead>}
                    <TableHead className="font-semibold">Created At</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <TableRowSkeleton key={index} columns={language === "ar" ? 5 : 4} />
                    ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <Skeleton className="h-5 w-48" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8 rounded-[5px]" />
                  <Skeleton className="h-8 w-8 rounded-[5px]" />
                  <Skeleton className="h-8 w-8 rounded-[5px]" />
                  <Skeleton className="h-8 w-8 rounded-[5px]" />
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-40 text-red-500">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p>{error}</p>
              </div>
            </div>
          ) : filteredItems?.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <div className="text-center text-gray-500">
                <p className="mb-2 text-lg font-medium">
                  {searchQuery ? "No matching wheel drive types found" : "No wheel drive types found"}
                </p>
                <p className="text-sm">
                  {searchQuery
                    ? "Try adjusting your search query"
                    : "Get started by adding your first wheel drive type"}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => {
                      setFormData({ title: "", title_ar: "" })
                      setFormError(null)
                      setActiveTab("english")
                      setIsAddDialogOpen(true)
                    }}
                    className="mt-3 h-8 text-xs bg-brand-primary hover:bg-brand-primary/90 text-white rounded-[5px]"
                    disabled={isPageDisabled}
                  >
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Add New Wheel Drive Type
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-b-[5px]">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={handleSelectAll}
                        disabled={isPageDisabled || loading}
                        className="rounded-[3px] data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary"
                      />
                    </TableHead>
                    <TableHead className="font-semibold">English Title</TableHead>
                    {language === "ar" && <TableHead className="font-semibold">Arabic Title</TableHead>}
                    <TableHead className="font-semibold">Created At</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems?.map((item) => (
                    <TableRow key={item.id} className="hover:bg-brand-light/10">
                      <TableCell className="w-[40px]">
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => handleSelectItem(item.id)}
                          disabled={isPageDisabled}
                          className="rounded-[3px] data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      {language === "ar" && <TableCell dir="rtl">{item.title_ar}</TableCell>}
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-[5px] hover:bg-brand-light/50 hover:text-brand-primary border-gray-200 h-8 w-8"
                            onClick={() => {
                              setCurrentItem(item)
                              setFormData({ title: item.title, title_ar: item.title_ar })
                              setFormError(null)
                              setActiveTab("english")
                              setIsEditDialogOpen(true)
                            }}
                            disabled={isPageDisabled}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-[5px] hover:bg-red-50 border-gray-200 h-8 w-8"
                            onClick={() => handleDeleteDirect(item)}
                            disabled={isPageDisabled}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, items?.length || 0)} of {items?.length || 0} items
                    {selectedItems.length > 0 && (
                      <span className="ml-2 text-brand-primary font-medium">({selectedItems.length} selected)</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1 || isPageDisabled}
                      className="h-8 w-8 p-0 rounded-[5px]"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      // Show first page, last page, current page, and pages around current
                      let pageToShow = i + 1
                      if (totalPages > 5) {
                        if (currentPage <= 3) {
                          // Near start: show first 5 pages
                          pageToShow = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          // Near end: show last 5 pages
                          pageToShow = totalPages - 4 + i
                        } else {
                          // Middle: show current page and 2 pages before/after
                          pageToShow = currentPage - 2 + i
                        }
                      }

                      return (
                        <Button
                          key={pageToShow}
                          variant={currentPage === pageToShow ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(pageToShow)}
                          disabled={isPageDisabled}
                          className={`h-8 w-8 p-0 rounded-[5px] ${
                            currentPage === pageToShow ? "bg-brand-primary hover:bg-brand-primary/90" : ""
                          }`}
                        >
                          {pageToShow}
                        </Button>
                      )
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages || isPageDisabled}
                      className="h-8 w-8 p-0 rounded-[5px]"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="rounded-[5px] max-w-md">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold text-brand-primary">
              {language === "en" ? "Edit Wheel Drive Type" : "تعديل نوع الدفع"}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              {language === "en" ? "Update the details below." : "قم بتحديث التفاصيل أدناه."}
            </DialogDescription>
          </DialogHeader>

          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-[5px] text-sm flex items-start gap-2 mb-4">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error</p>
                <p className="text-xs">{formError}</p>
              </div>
            </div>
          )}

          <div className="bg-gray-50 p-6 rounded-[5px] border border-gray-100 shadow-sm">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-[5px] mb-4">
                <TabsTrigger value="english" className="rounded-[5px]">
                  English
                </TabsTrigger>
                <TabsTrigger value="arabic" className="rounded-[5px]">
                  العربية
                </TabsTrigger>
              </TabsList>
              <TabsContent value="english" className="mt-2">
                <div className="space-y-3">
                  <Label htmlFor="edit-title" className="text-sm font-medium">
                    English Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter title in English"
                    className="rounded-[5px] border-gray-300 focus:border-brand-primary focus:ring-brand-primary/20"
                  />
                </div>
              </TabsContent>
              <TabsContent value="arabic" className="mt-2">
                <div className="space-y-3">
                  <Label htmlFor="edit-title_ar" className="text-sm font-medium">
                    Arabic Title <span className="text-muted-foreground text-xs">(optional)</span>
                  </Label>
                  <Input
                    id="edit-title_ar"
                    name="title_ar"
                    value={formData.title_ar}
                    onChange={handleChange}
                    placeholder="أدخل العنوان بالعربية"
                    dir="rtl"
                    className="rounded-[5px] border-gray-300 focus:border-brand-primary focus:ring-brand-primary/20"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter className="mt-6 flex space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentItem(null)
                setFormData({ title: "", title_ar: "" })
                setFormError(null)
                setIsEditDialogOpen(false)
              }}
              disabled={isSubmitting}
              className="rounded-[5px] border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {language === "en" ? "Cancel" : "إلغاء"}
            </Button>
            <Button
              onClick={handleEdit}
              disabled={isSubmitting}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white rounded-[5px] px-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {language === "en" ? "Updating..." : "جاري التحديث..."}
                </>
              ) : language === "en" ? (
                "Update"
              ) : (
                "تحديث"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
