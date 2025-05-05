"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  User,
  ArrowLeft,
  Loader2,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  Clock,
  Shield,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Toaster, toast } from "sonner"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export default function UserProfilePage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id

  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/users/${userId}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch user")
        }

        const data = await response.json()
        setUser(data.user)
      } catch (err) {
        console.error("Error fetching user:", err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId])

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)

    try {
      setError(null)
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete user")
      }

      toast.success("User deleted successfully")

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard/users")
      }, 1500)
    } catch (err) {
      console.error("Error deleting user:", err)
      setError(err.message)
      toast.error("Failed to delete user: " + err.message)
    } finally {
      setIsDeleting(false)
    }
  }

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Active
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
      case "banned":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Banned
          </Badge>
        )
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
    if (!user?.full_name) return user?.email?.[0]?.toUpperCase() || "U"

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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Never"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Render loading skeleton
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="mb-6">
          <Skeleton className="h-6 w-48 mb-1" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="rounded-[5px]">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-32 mb-1" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <Skeleton className="h-32 w-32 rounded-full" />
                </div>
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
                <div className="pt-4 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="rounded-[5px]">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="mb-6">
          <div className="flex items-center text-xs text-muted-foreground mb-2">
            <Link href="/dashboard" className="hover:text-brand-primary transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="h-3 w-3 mx-1" />
            <Link href="/dashboard/users" className="hover:text-brand-primary transition-colors">
              Users
            </Link>
            <ChevronRight className="h-3 w-3 mx-1" />
            <span className="text-foreground">User Profile</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h1 className="text-xl font-bold tracking-tight text-brand-primary">User Profile</h1>
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto h-8 text-xs rounded-[5px]"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Users
            </Button>
          </div>
        </div>

        <Alert variant="destructive" className="rounded-[5px]">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  // Render user profile
  return (
    <div className="max-w-5xl mx-auto px-6 py-6 relative">
      <Toaster position="top-right" />

      {/* Full-page overlay during deletion */}
      {isDeleting && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card p-8 rounded-[5px] shadow-lg text-center w-1/2 h-1/2 flex flex-col items-center justify-center border border-brand-primary/20">
            <Loader2 className="h-16 w-16 animate-spin mx-auto mb-8 text-brand-primary" />
            <h3 className="font-medium text-2xl mb-4">Deleting User</h3>
            <p className="text-muted-foreground text-lg">Please wait while we process your request...</p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center text-xs text-muted-foreground mb-2">
          <Link href="/dashboard" className="hover:text-brand-primary transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="h-3 w-3 mx-1" />
          <Link href="/dashboard/users" className="hover:text-brand-primary transition-colors">
            Users
          </Link>
          <ChevronRight className="h-3 w-3 mx-1" />
          <span className="text-foreground">User Profile</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-xl font-bold tracking-tight text-brand-primary">User Profile</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto h-8 text-xs rounded-[5px]"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Users
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto h-8 text-xs rounded-[5px] text-brand-primary hover:bg-brand-light"
              onClick={() => router.push(`/dashboard/users/edit/${userId}`)}
            >
              <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit User
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="md:col-span-1">
          <Card className="rounded-[5px] overflow-hidden">
            <CardHeader className="bg-brand-light/30 border-b border-brand-primary/10 py-3 px-4">
              <CardTitle className="text-base text-brand-primary flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 px-4 pb-4">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <Avatar className="h-24 w-24 border-2 border-muted">
                    {user.avatar_url ? (
                      <AvatarImage
                        src={user.avatar_url || "/placeholder.svg"}
                        alt={user.full_name || user.email}
                        className="object-cover"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/abstract-geometric-shapes.png"
                        }}
                      />
                    ) : (
                      <AvatarFallback className={getAvatarColor(user.role)}>{getUserInitials(user)}</AvatarFallback>
                    )}
                  </Avatar>
                </div>
                <h2 className="text-lg font-semibold">{user.full_name || "No Name"}</h2>
                <div className="mt-1 mb-4">{getRoleBadge(user.role)}</div>
                <div className="w-full pt-4 border-t space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Email:</span>
                    <span className="ml-auto font-medium truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="ml-auto font-medium">{user.phone || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Status:</span>
                    <span className="ml-auto">{getStatusBadge(user.status)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 border-t px-4 py-3 flex justify-center">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="h-8 text-xs rounded-[5px]"
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Delete User
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* User Details */}
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4 rounded-[5px]">
              <TabsTrigger value="overview" className="rounded-[5px]">
                Overview
              </TabsTrigger>
              <TabsTrigger value="activity" className="rounded-[5px]">
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0">
              <Card className="rounded-[5px]">
                <CardHeader className="bg-brand-light/30 border-b border-brand-primary/10 py-3 px-4">
                  <CardTitle className="text-base text-brand-primary">User Information</CardTitle>
                  <CardDescription className="text-xs">Detailed information about this user</CardDescription>
                </CardHeader>
                <CardContent className="px-4 py-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">User ID</p>
                      <p className="text-sm font-medium">{user.id}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Full Name</p>
                      <p className="text-sm font-medium">{user.full_name || "Not provided"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">{user.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{user.phone || "Not provided"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Role</p>
                      <p className="text-sm font-medium">{getRoleBadge(user.role)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="text-sm font-medium">{getStatusBadge(user.status)}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <h3 className="text-sm font-medium mb-3">Account Timeline</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Created:</span>
                        <span className="text-xs ml-auto">{formatDate(user.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Last Sign In:</span>
                        <span className="text-xs ml-auto">{formatDate(user.last_sign_in_at)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Email Confirmed:</span>
                        <span className="text-xs ml-auto">
                          {user.confirmed_at ? formatDate(user.confirmed_at) : "Not confirmed"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-0">
              <Card className="rounded-[5px]">
                <CardHeader className="bg-brand-light/30 border-b border-brand-primary/10 py-3 px-4">
                  <CardTitle className="text-base text-brand-primary">User Activity</CardTitle>
                  <CardDescription className="text-xs">Recent activity and login history</CardDescription>
                </CardHeader>
                <CardContent className="px-4 py-4">
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium">No Activity Data Available</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-md">
                      User activity tracking is not enabled or no activity has been recorded for this user yet.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
