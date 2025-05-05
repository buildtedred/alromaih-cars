"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Users,
  Search,
  Trash2,
  Clock,
  Download,
  RefreshCw,
  UserPlus,
  Loader2,
  AlertCircle,
  Eye,
  Pencil,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@supabase/supabase-js"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"

// Initialize Supabase client for real-time updates only
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

// Add the renderSkeletons function to match the logos dashboard style
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
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default function UsersPage() {
  const router = useRouter()

  // State for users
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [sortField, setSortField] = useState("created_at")
  const [sortDirection, setSortDirection] = useState("desc")
  const [selectedUsers, setSelectedUsers] = useState([])
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  // Add a new state variable for tracking deletion in progress
  const [isDeleting, setIsDeleting] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  // Add state for delete confirmation dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteMode, setDeleteMode] = useState("single") // 'single' or 'bulk'

  // Fetch users from our API route
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      // Call our API route - get all users without pagination
      const response = await fetch(`/api/users?perPage=1000`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch users")
      }

      const data = await response.json()

      // If we're getting raw users array without pagination
      const userData = Array.isArray(data) ? data : data.users || []

      // Format users if needed
      const formattedUsers = Array.isArray(data)
        ? userData.map((user) => ({
            id: user.id,
            email: user.email,
            phone: user.phone || "",
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at,
            confirmed_at: user.email_confirmed_at,
            is_confirmed: !!user.email_confirmed_at,
            full_name: user.user_metadata?.full_name || "",
            avatar_url: user.user_metadata?.avatar_url || "",
            role: user.app_metadata?.role || "user",
            status: user.banned ? "banned" : user.email_confirmed_at ? "active" : "pending",
          }))
        : userData

      // Apply status filter if set
      let filteredAuthUsers = formattedUsers
      if (statusFilter !== "all") {
        filteredAuthUsers = formattedUsers.filter((user) => user.status === statusFilter)
      }

      // Sort users
      filteredAuthUsers.sort((a, b) => {
        const fieldA = a[sortField]
        const fieldB = b[sortField]

        if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1
        if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1
        return 0
      })

      // Update state with fetched users
      setUsers(formattedUsers)
      setFilteredUsers(filteredAuthUsers)
    } catch (err) {
      console.error("Error fetching users:", err)
      setError(err.message)
      console.error("Failed to load users:", err.message)

      // If there's an unauthorized error, you might want to redirect to login
      if (err.message === "Unauthorized") {
        // Show a more helpful error message
        setError("You need to be logged in with admin privileges to access this page.")
      }
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
      setLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchUsers()

    // Set up auth listener for changes
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (["SIGNED_IN", "SIGNED_OUT", "USER_UPDATED", "USER_DELETED"].includes(event)) {
        fetchUsers()

        // Show toast notification based on the event
        if (event === "SIGNED_IN") {
          console.log("New user signed in")
        } else if (event === "USER_UPDATED") {
          console.log("User information updated")
        } else if (event === "USER_DELETED") {
          console.log("User removed")
        }
      }
    })

    // Cleanup subscription on unmount
    return () => {
      authListener.data.subscription.unsubscribe()
    }
  }, [statusFilter, sortField, sortDirection])

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = users.filter(
        (user) =>
          user.full_name?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.phone?.toLowerCase().includes(query) ||
          user.role?.toLowerCase().includes(query),
      )
      setFilteredUsers(filtered)
    }
  }, [searchQuery, users])

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Handle user selection
  const handleUserSelect = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  // Handle select all
  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id))
    }
  }

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchUsers()
  }

  // Show delete confirmation dialog for a single user
  const confirmDeleteUser = (user) => {
    setUserToDelete(user)
    setDeleteMode("single")
    setShowDeleteDialog(true)
  }

  // Show delete confirmation dialog for bulk delete
  const confirmBulkDelete = () => {
    if (selectedUsers.length === 0) return
    setDeleteMode("bulk")
    setShowDeleteDialog(true)
  }

  // Handle user deletion after confirmation
  const handleDeleteUser = async () => {
    if (!userToDelete && deleteMode !== "bulk") return

    setIsDeleting(true)
    setShowDeleteDialog(false)

    try {
      setError(null)

      if (deleteMode === "single" && userToDelete) {
        const response = await fetch(`/api/users/${userToDelete.id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to delete user")
        }

        console.log("User deleted successfully")
      } else if (deleteMode === "bulk") {
        // Delete users one by one
        for (const userId of selectedUsers) {
          const response = await fetch(`/api/users/${userId}`, {
            method: "DELETE",
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Failed to delete users")
          }
        }

        console.log(`${selectedUsers.length} users deleted successfully`)
        setSelectedUsers([])
      }

      // Refresh user list
      fetchUsers()
    } catch (err) {
      console.error("Error deleting user:", err)
      setError(err.message)
      console.error(`Failed to delete user${deleteMode === "bulk" ? "s" : ""}:`, err.message)
    } finally {
      setIsDeleting(false)
      setUserToDelete(null)
    }
  }

  // Handle export users
  const handleExportUsers = async () => {
    setIsExporting(true)
    setError(null)

    try {
      // Get all users for export
      const response = await fetch(`/api/users?perPage=1000`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to export users")
      }

      const data = await response.json()
      const userData = Array.isArray(data) ? data : data.users || []

      // Convert to CSV
      const headers = ["ID", "Email", "Phone", "Full Name", "Role", "Status", "Created At", "Last Sign In"]
      const csvData = userData.map((user) => [
        user.id,
        user.email,
        user.phone,
        user.full_name,
        user.role,
        user.status,
        user.created_at,
        user.last_sign_in_at,
      ])

      const csv = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n")

      // Create download link
      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `users_export_${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      console.log("Users exported successfully")
    } catch (err) {
      console.error("Error exporting users:", err)
      setError(err.message)
      console.error("Failed to export users:", err.message)
    } finally {
      setIsExporting(false)
    }
  }

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "banned":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Banned</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Get role badge
  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Admin</Badge>
      case "manager":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Manager</Badge>
      case "editor":
        return <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">Editor</Badge>
      case "user":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">User</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  // Get user initials for avatar
  const getUserInitials = (user) => {
    if (!user.full_name) return user.email?.[0]?.toUpperCase() || "U"

    const nameParts = user.full_name.split(" ")
    if (nameParts.length === 1) return nameParts[0][0].toUpperCase()
    return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
  }

  // Get avatar color based on role
  const getAvatarColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "manager":
        return "bg-blue-100 text-blue-800"
      case "editor":
        return "bg-indigo-100 text-indigo-800"
      case "user":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4 relative px-6 py-6">
      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md rounded-[5px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {deleteMode === "single" ? "Delete User" : `Delete ${selectedUsers.length} Users`}
            </DialogTitle>
            <DialogDescription>
              {deleteMode === "single" && userToDelete ? (
                <>
                  Are you sure you want to delete the user{" "}
                  <span className="font-medium">{userToDelete.full_name || userToDelete.email}</span>? This action
                  cannot be undone.
                </>
              ) : (
                <>
                  Are you sure you want to delete {selectedUsers.length} selected users? This action cannot be undone.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="rounded-[5px]"
            >
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteUser} className="rounded-[5px]">
              {deleteMode === "single" ? "Delete User" : "Delete Users"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full-page overlay during deletion or submission */}
      {isDeleting && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card p-8 rounded-[5px] shadow-lg text-center w-1/2 h-1/2 flex flex-col items-center justify-center border border-brand-primary/20">
            <Loader2 className="h-16 w-16 animate-spin mx-auto mb-8 text-brand-primary" />
            <h3 className="font-medium text-2xl mb-4">
              {userToDelete && deleteMode === "single"
                ? `Deleting User: ${userToDelete.full_name || userToDelete.email}`
                : "Deleting Selected Users"}
            </h3>
            <p className="text-muted-foreground text-lg">Please wait while we process your request...</p>
          </div>
        </div>
      )}

      {/* Main content - disabled when deleting */}
      <div className={isDeleting ? "pointer-events-none opacity-50" : ""}>
        {/* Header section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-brand-light/30 p-4 rounded-[5px] border border-brand-primary/10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-brand-primary">User Management</h1>
            <p className="text-muted-foreground">Manage user accounts and permissions</p>
          </div>
          <Button
            onClick={() => router.push("/dashboard/users/add")}
            disabled={isDeleting}
            className="rounded-[5px] bg-brand-primary hover:bg-brand-primary/90 w-full sm:w-auto"
          >
            <UserPlus className="mr-2 h-4 w-4" /> Add New User
          </Button>
        </div>

        {/* Search and filters */}
        <div className="mt-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users by name or email..."
              className="pl-8 w-full rounded-[5px] border-gray-300 focus-visible:ring-brand-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isDeleting}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter} disabled={isDeleting}>
              <SelectTrigger className="rounded-[5px] border-gray-300 w-full sm:w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading || isDeleting}
              className="gap-1 rounded-[5px] border-gray-300 hover:bg-brand-light hover:text-brand-primary w-full sm:w-auto"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportUsers}
              disabled={isExporting || isDeleting}
              className="gap-1 rounded-[5px] border-gray-300 hover:bg-brand-light hover:text-brand-primary w-full sm:w-auto"
            >
              <Download className={`h-4 w-4 ${isExporting ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-destructive/15 p-4 rounded-[5px] text-destructive border border-destructive/30">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">Error loading users</p>
            </div>
            <p className="text-sm mb-2">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchUsers}
              disabled={isDeleting}
              className="rounded-[5px] border-destructive/30 hover:bg-destructive/20"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Bulk actions */}
        {selectedUsers.length > 0 && (
          <div className=" bg-muted/50 p-2 rounded-[5px] mb-4 flex items-center justify-between">
            <div className="text-sm">
              <span className="font-medium">{selectedUsers.length}</span> users selected
            </div>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={confirmBulkDelete}
                disabled={isDeleting}
                className="rounded-[5px]"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedUsers([])}
                className="rounded-[5px]"
                disabled={isDeleting}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        )}

        {/* Main content */}
        {loading ? (
          renderSkeletons()
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Users className="h-16 w-16 text-brand-primary/30 mb-4" />
            <h3 className="text-lg font-medium">No users found</h3>
            <p className="text-muted-foreground mt-2">
              {searchQuery ? "Try a different search term" : "Add your first user to get started"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => router.push("/dashboard/users/add")}
                className="mt-6 bg-brand-primary hover:bg-brand-primary/90 rounded-[5px]"
                disabled={isDeleting}
              >
                <UserPlus className="mr-2 h-4 w-4" /> Add Your First User
              </Button>
            )}
          </div>
        ) : (
          <div className="mt-5 rounded-[5px] border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={selectedUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all users"
                        disabled={isDeleting}
                        className="rounded-[5px]"
                      />
                    </TableHead>
                    <TableHead className="w-[250px]">User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => handleUserSelect(user.id)}
                          aria-label={`Select ${user.full_name || user.email}`}
                          disabled={isDeleting}
                          className="rounded-[5px]"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex justify-center items-center h-12 w-12 rounded-[5px] overflow-hidden bg-muted border">
                            {user.avatar_url ? (
                              <Image
                                src={user.avatar_url || "/placeholder.svg"}
                                alt={user.full_name || user.email}
                                width={150}
                                height={100}
                                className=" object-cover"
                                onError={(e) => {
                                  e.target.onerror = null
                                  e.target.src = "/abstract-geometric-shapes.png"
                                }}
                              />
                            ) : (
                              <div
                                className={`flex items-center justify-center h-full w-full ${getAvatarColor(user.role)}`}
                              >
                                {getUserInitials(user)}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{user.full_name || "No Name"}</div>
                            <div className="text-xs text-muted-foreground">ID: {user.id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/dashboard/users/profile/${user.id}`)}
                            disabled={isDeleting}
                            className="rounded-[5px] hover:bg-brand-light hover:text-brand-primary"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/dashboard/users/edit/${user.id}`)}
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
                            onClick={() => confirmDeleteUser(user)}
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
        )}
      </div>
    </div>
  )
}
