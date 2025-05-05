"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  User,
  ArrowLeft,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  Clock,
  Shield,
  Edit,
  Camera,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MapPin,
  Briefcase,
  Globe,
  Award,
  Key,
  Lock,
  FileText,
  SettingsIcon,
  Loader2,
  X,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ImageGallery from "../../dashboard/images-gallery/image-gallery"

export default function ProfilePage() {
  const router = useRouter()

  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [profileCompletion, setProfileCompletion] = useState(0)
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false)
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false)
  const [updateMessage, setUpdateMessage] = useState(null)

  // Fetch current user data using the /api/currentUser endpoint
  useEffect(() => {
    fetchCurrentUser()
  }, [router])

  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/currentUser")

      if (!response.ok) {
        // If response is not ok, check if it's a 401 (unauthorized)
        if (response.status === 401) {
          console.log("User not authenticated, redirecting to login")
          router.push("/login")
          return
        }

        // Handle other error responses
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error: ${response.status}`)
      }

      const data = await response.json()

      if (!data.user) {
        console.log("No user data returned, redirecting to login")
        router.push("/login")
        return
      }

      // Set user data and calculate profile completion
      setUser(data.user)
      calculateProfileCompletion(data.user)
    } catch (err) {
      console.error("Error fetching user data:", err)
      setError(err.message || "Failed to load user profile")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle image selection from gallery
  const handleImageSelect = async (imageUrl) => {
    if (!user || !imageUrl) return

    try {
      setIsUpdatingAvatar(true)
      setUpdateMessage({ type: "info", text: "Updating profile image..." })

      // Call API to update user's avatar_url
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          avatar_url: imageUrl,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error: ${response.status}`)
      }

      // Close the gallery and refresh user data
      setIsImageGalleryOpen(false)
      setUpdateMessage({ type: "success", text: "Profile image updated successfully!" })

      // Update local user state with new avatar
      setUser((prev) => ({
        ...prev,
        avatar_url: imageUrl,
      }))

      // Refresh user data after a short delay
      setTimeout(() => {
        fetchCurrentUser()
        setUpdateMessage(null)
      }, 2000)
    } catch (err) {
      console.error("Error updating profile image:", err)
      setUpdateMessage({ type: "error", text: "Failed to update profile image. Please try again." })
      setTimeout(() => setUpdateMessage(null), 3000)
    } finally {
      setIsUpdatingAvatar(false)
    }
  }

  // Calculate profile completion percentage
  const calculateProfileCompletion = (userData) => {
    const fields = ["full_name", "email", "phone", "avatar_url", "bio", "location", "company", "website"]
    const completedFields = fields.filter((field) => userData[field] && userData[field].toString().trim() !== "")
    const percentage = Math.round((completedFields.length / fields.length) * 100)
    setProfileCompletion(percentage)
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
            <span className="text-foreground">My Profile</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h1 className="text-xl font-bold tracking-tight text-brand-primary">My Profile</h1>
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto h-8 text-xs rounded-[5px]"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Dashboard
            </Button>
          </div>
        </div>

        <Alert variant="destructive" className="rounded-[5px] mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Profile</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <Card className="rounded-[5px] border-brand-primary/10 shadow-sm">
          <CardHeader className="bg-brand-light/30 border-b border-brand-primary/10">
            <CardTitle>Session Expired</CardTitle>
            <CardDescription>Your session may have expired or you're not logged in</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-6">Please log in again to access your profile information.</p>
            <div className="flex gap-4">
              <Button
                onClick={() => router.push("/login")}
                className="rounded-[5px] bg-brand-primary hover:bg-brand-primary/90"
              >
                Log In
              </Button>
              <Button variant="outline" onClick={() => router.push("/dashboard")} className="rounded-[5px]">
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render user profile
  return (
    <div className="max-w-5xl mx-auto px-6 py-6 relative">
      {/* Background header with gradient */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-r from-brand-primary/20 to-brand-primary/5 rounded-b-lg -z-10"></div>

      {/* Update message notification */}
      {updateMessage && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-[5px] shadow-md flex items-center gap-2 ${
            updateMessage.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : updateMessage.type === "error"
                ? "bg-red-100 text-red-800 border border-red-200"
                : "bg-blue-100 text-blue-800 border border-blue-200"
          }`}
        >
          {updateMessage.type === "success" && <CheckCircle2 className="h-4 w-4" />}
          {updateMessage.type === "error" && <AlertCircle className="h-4 w-4" />}
          {updateMessage.type === "info" && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>{updateMessage.text}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 ml-2 hover:bg-transparent"
            onClick={() => setUpdateMessage(null)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center text-xs text-muted-foreground mb-2">
          <Link href="/dashboard" className="hover:text-brand-primary transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="h-3 w-3 mx-1" />
          <span className="text-foreground">My Profile</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-xl font-bold tracking-tight text-brand-primary">My Profile</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto h-8 text-xs rounded-[5px]"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Dashboard
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto h-8 text-xs rounded-[5px] text-brand-primary hover:bg-brand-light"
              onClick={() => router.push("/dashboard/settings")}
            >
              <SettingsIcon className="mr-1.5 h-3.5 w-3.5" /> Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="md:col-span-1">
          <Card className="rounded-[5px] overflow-hidden border-brand-primary/10 shadow-sm">
            <CardHeader className="bg-brand-light/30 border-b border-brand-primary/10 py-3 px-4">
              <CardTitle className="text-base text-brand-primary flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 px-4 pb-4">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 relative group">
                  <Avatar className="h-28 w-28 border-4 border-white shadow-md">
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
                  <button
                    className="absolute bottom-0 right-0 bg-brand-primary rounded-full p-1.5 shadow-md cursor-pointer hover:bg-brand-primary/90 transition-colors"
                    onClick={() => setIsImageGalleryOpen(true)}
                    disabled={isUpdatingAvatar}
                  >
                    {isUpdatingAvatar ? (
                      <Loader2 className="h-4 w-4 text-white animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4 text-white" />
                    )}
                  </button>
                </div>
                <h2 className="text-xl font-semibold">{user.full_name || "No Name"}</h2>
                <div className="mt-1 mb-2">{getRoleBadge(user.role)}</div>
                <p className="text-sm text-muted-foreground mb-4">
                  {user.bio || "No bio provided. Add a short description about yourself."}
                </p>

                {/* Profile completion */}
                <div className="w-full mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Profile completion</span>
                    <span className="text-xs font-medium">{profileCompletion}%</span>
                  </div>
                  <Progress value={profileCompletion} className="h-1.5" />
                </div>

                <div className="w-full pt-4 border-t space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-brand-primary/70" />
                    <span className="text-muted-foreground">Email:</span>
                    <span className="ml-auto font-medium truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-brand-primary/70" />
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="ml-auto font-medium">{user.phone || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-brand-primary/70" />
                    <span className="text-muted-foreground">Status:</span>
                    <span className="ml-auto">{getStatusBadge(user.status)}</span>
                  </div>
                  {user.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-brand-primary/70" />
                      <span className="text-muted-foreground">Location:</span>
                      <span className="ml-auto font-medium">{user.location}</span>
                    </div>
                  )}
                  {user.company && (
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-brand-primary/70" />
                      <span className="text-muted-foreground">Company:</span>
                      <span className="ml-auto font-medium">{user.company}</span>
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-brand-primary/70" />
                      <span className="text-muted-foreground">Website:</span>
                      <a
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto font-medium text-brand-primary hover:underline truncate max-w-[150px]"
                      >
                        {user.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 border-t px-4 py-3 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/settings")}
                className="h-8 text-xs rounded-[5px] border-brand-primary/20 text-brand-primary hover:bg-brand-light"
              >
                <Edit className="mr-1.5 h-3.5 w-3.5" />
                Edit Profile
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* User Details */}
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4 rounded-[5px]">
              <TabsTrigger value="overview" className="rounded-[5px]">
                Overview
              </TabsTrigger>
              <TabsTrigger value="activity" className="rounded-[5px]">
                Activity
              </TabsTrigger>
              <TabsTrigger value="security" className="rounded-[5px]">
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0 space-y-6">
              <Card className="rounded-[5px] border-brand-primary/10 shadow-sm">
                <CardHeader className="bg-brand-light/30 border-b border-brand-primary/10 py-3 px-4">
                  <CardTitle className="text-base text-brand-primary">User Information</CardTitle>
                  <CardDescription className="text-xs">Your account details and personal information</CardDescription>
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
                        <Calendar className="h-4 w-4 text-brand-primary/70" />
                        <span className="text-xs text-muted-foreground">Created:</span>
                        <span className="text-xs ml-auto">{formatDate(user.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-brand-primary/70" />
                        <span className="text-xs text-muted-foreground">Last Sign In:</span>
                        <span className="text-xs ml-auto">{formatDate(user.last_sign_in_at)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-brand-primary/70" />
                        <span className="text-xs text-muted-foreground">Email Confirmed:</span>
                        <span className="text-xs ml-auto">
                          {user.email_confirmed_at ? formatDate(user.email_confirmed_at) : "Not confirmed"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional information card */}
              <Card className="rounded-[5px] border-brand-primary/10 shadow-sm">
                <CardHeader className="bg-brand-light/30 border-b border-brand-primary/10 py-3 px-4">
                  <CardTitle className="text-base text-brand-primary">Professional Information</CardTitle>
                  <CardDescription className="text-xs">Your professional details and preferences</CardDescription>
                </CardHeader>
                <CardContent className="px-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Company</p>
                      <p className="text-sm font-medium">{user.company || "Not provided"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Job Title</p>
                      <p className="text-sm font-medium">{user.job_title || "Not provided"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Department</p>
                      <p className="text-sm font-medium">{user.department || "Not provided"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-medium">{user.location || "Not provided"}</p>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <p className="text-xs text-muted-foreground">Bio</p>
                      <p className="text-sm">{user.bio || "No bio provided."}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-0">
              <Card className="rounded-[5px] border-brand-primary/10 shadow-sm">
                <CardHeader className="bg-brand-light/30 border-b border-brand-primary/10 py-3 px-4">
                  <CardTitle className="text-base text-brand-primary">Recent Activity</CardTitle>
                  <CardDescription className="text-xs">Your recent actions and login history</CardDescription>
                </CardHeader>
                <CardContent className="px-4 py-4">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Login History</h3>

                      {user.last_sign_in_at ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-[5px] border border-muted">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-brand-primary/10 flex items-center justify-center">
                                <Key className="h-4 w-4 text-brand-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">Successful login</p>
                                <p className="text-xs text-muted-foreground">{formatDate(user.last_sign_in_at)}</p>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-800">Success</Badge>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" />
                          <h3 className="text-lg font-medium">No Login History Available</h3>
                          <p className="text-sm text-muted-foreground mt-1 max-w-md">
                            Your login history will appear here once you have logged in.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Recent Actions</h3>
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-medium">No Activity Data Available</h3>
                        <p className="text-sm text-muted-foreground mt-1 max-w-md">
                          Your recent actions will be tracked and displayed here.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-0">
              <Card className="rounded-[5px] border-brand-primary/10 shadow-sm">
                <CardHeader className="bg-brand-light/30 border-b border-brand-primary/10 py-3 px-4">
                  <CardTitle className="text-base text-brand-primary">Security Settings</CardTitle>
                  <CardDescription className="text-xs">Manage your account security and authentication</CardDescription>
                </CardHeader>
                <CardContent className="px-4 py-4">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Password & Authentication</h3>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-[5px] border border-muted">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-brand-primary/10 flex items-center justify-center">
                              <Lock className="h-4 w-4 text-brand-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Password</p>
                              <p className="text-xs text-muted-foreground">
                                Last changed:{" "}
                                {user.password_updated_at ? formatDate(user.password_updated_at) : "Unknown"}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs rounded-[5px]"
                            onClick={() => router.push("/dashboard/settings")}
                          >
                            Change
                          </Button>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-[5px]">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-brand-primary/10 flex items-center justify-center">
                              <Shield className="h-4 w-4 text-brand-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Two-Factor Authentication</p>
                              <p className="text-xs text-muted-foreground">Not enabled</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs rounded-[5px]"
                            onClick={() => router.push("/dashboard/settings")}
                          >
                            Enable
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Connected Devices</h3>
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Award className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-medium">No Connected Devices</h3>
                        <p className="text-sm text-muted-foreground mt-1 max-w-md">
                          Information about your connected devices will appear here.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Image Gallery Dialog */}
      <Dialog open={isImageGalleryOpen} onOpenChange={setIsImageGalleryOpen}>
        <DialogContent className="max-w-4xl w-[90vw]">
          <DialogHeader>
            <DialogTitle>Select Profile Image</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <ImageGallery onSelect={handleImageSelect} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
