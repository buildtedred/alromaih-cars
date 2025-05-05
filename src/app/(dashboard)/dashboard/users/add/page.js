"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, ImageIcon, Check, X, AlertCircle, ChevronRight, UserPlus } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import ImageGallery from "../../images-gallery/image-gallery"

export default function AddUserPage() {
  const router = useRouter()
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    email_confirm: true, // Default to true to send confirmation email
    phone: "",
    user_metadata: {
      full_name: "",
      avatar_url: "",
    },
    role: "user",
    auto_confirm: true, // New field to auto-confirm email
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false)

  // Handle image selection from gallery
  const handleImageSelect = (imageUrl) => {
    setNewUser({
      ...newUser,
      user_metadata: {
        ...newUser.user_metadata,
        avatar_url: imageUrl,
      },
    })
    setIsImageGalleryOpen(false)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    // Validate form
    if (!newUser.email.trim()) {
      setError("Email is required")
      return
    }

    if (!newUser.password.trim()) {
      setError("Password is required")
      return
    }

    try {
      setLoading(true)

      // Create new user via API
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: newUser.email,
          password: newUser.password,
          email_confirm: newUser.email_confirm,
          phone: newUser.phone,
          user_metadata: {
            ...newUser.user_metadata,
            email_verified: true, // Add email_verified flag
          },
          app_metadata: {
            role: newUser.role || "user",
          },
          auto_confirm: newUser.auto_confirm, // Pass auto_confirm flag
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create user")
      }

      setSuccessMessage("User created successfully!")

      // Redirect after a short delay to show the success message
      setTimeout(() => {
        router.push("/dashboard/users")
        router.refresh()
      }, 1500)
    } catch (err) {
      console.error("Error creating user:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 relative">
      {/* Full-page overlay during loading */}
      {loading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card p-8 rounded-[5px] shadow-lg text-center w-1/2 h-1/2 flex flex-col items-center justify-center border border-brand-primary/20">
            <Loader2 className="h-16 w-16 animate-spin mx-auto mb-8 text-brand-primary" />
            <h3 className="font-medium text-2xl mb-4">Creating User</h3>
            <p className="text-muted-foreground text-lg">Please wait while we process your request...</p>
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-center text-xs text-muted-foreground mb-2">
          <Link href="/dashboard" className="hover:text-brand-primary transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="h-3 w-3 mx-1" />
          <Link href="/dashboard/users" className="hover:text-brand-primary transition-colors">
            Users
          </Link>
          <ChevronRight className="h-3 w-3 mx-1" />
          <span className="text-foreground">Add New User</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-brand-primary">Add New User</h1>
            <p className="text-xs text-muted-foreground">Create a new user account</p>
          </div>
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

      {error && (
        <Alert
          variant="destructive"
          className="mb-3 py-2 text-sm animate-in fade-in-50 slide-in-from-top-5 duration-300 rounded-[5px]"
        >
          <AlertCircle className="h-3.5 w-3.5" />
          <AlertTitle className="text-sm font-medium">Error</AlertTitle>
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && !error && (
        <Alert className="mb-3 py-2 text-sm bg-green-50 text-green-800 border-green-200 animate-in fade-in-50 slide-in-from-top-5 duration-300 rounded-[5px]">
          <Check className="h-3.5 w-3.5 text-green-600" />
          <AlertTitle className="text-sm font-medium">Success</AlertTitle>
          <AlertDescription className="text-xs">{successMessage}</AlertDescription>
        </Alert>
      )}

      <Card className="shadow-md border-brand-primary/10 overflow-hidden rounded-[5px]">
        <form onSubmit={handleSubmit} aria-busy={loading}>
          <CardHeader className="bg-brand-light/30 border-b border-brand-primary/10 py-3 px-4">
            <CardTitle className="text-base text-brand-primary flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              User Details
            </CardTitle>
            <CardDescription className="text-xs">Enter the details for the new user</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-4 px-4">
            {/* Avatar Selection */}
            <div className="flex flex-col items-center mb-2">
              <div className="mb-2 text-sm font-medium">User Avatar</div>
              <div className="relative">
                <div className="h-24 w-24 rounded-[5px] overflow-hidden border-2 border-muted flex items-center justify-center bg-muted">
                  {newUser.user_metadata.avatar_url ? (
                    <img
                      src={newUser.user_metadata.avatar_url || "/placeholder.svg"}
                      alt="User avatar"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/abstract-geometric-shapes.png"
                      }}
                    />
                  ) : (
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                {newUser.user_metadata.avatar_url && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={() =>
                            setNewUser({
                              ...newUser,
                              user_metadata: {
                                ...newUser.user_metadata,
                                avatar_url: "",
                              },
                            })
                          }
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Remove selected image</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4 rounded-[5px]"
                onClick={() => setIsImageGalleryOpen(true)}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Select from Gallery
              </Button>
            </div>

            {/* Basic Information */}
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={newUser.user_metadata.full_name}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    user_metadata: {
                      ...newUser.user_metadata,
                      full_name: e.target.value,
                    },
                  })
                }
                className="rounded-[5px]"
                placeholder="John Doe"
              />
              <p className="text-xs text-muted-foreground">Enter the user's full name</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
                className="rounded-[5px]"
                placeholder="john.doe@example.com"
              />
              <p className="text-xs text-muted-foreground">This will be used for login and notifications</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
                className="rounded-[5px]"
                placeholder="••••••••"
              />
              <p className="text-xs text-muted-foreground">Create a secure password for the user</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (optional)</Label>
              <Input
                id="phone"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                className="rounded-[5px]"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">User Role</Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                <SelectTrigger id="role" className="rounded-[5px]">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Determines the user's permissions in the system</p>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="email_confirm"
                checked={newUser.email_confirm}
                onCheckedChange={(checked) => setNewUser({ ...newUser, email_confirm: !!checked })}
              />
              <Label htmlFor="email_confirm" className="text-sm">
                Send confirmation email to user
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="auto_confirm"
                checked={newUser.auto_confirm}
                onCheckedChange={(checked) => setNewUser({ ...newUser, auto_confirm: !!checked })}
              />
              <Label htmlFor="auto_confirm" className="text-sm">
                Auto-confirm user (allow immediate login)
              </Label>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2 py-3 px-4 border-t bg-muted/20">
            <Button
              variant="outline"
              type="button"
              className="h-8 text-xs rounded-[5px]"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !newUser.email.trim() || !newUser.password.trim()}
              className="h-8 text-xs bg-brand-primary hover:bg-brand-primary/90 rounded-[5px]"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
              Create User
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Image Gallery Dialog */}
      <Dialog open={isImageGalleryOpen} onOpenChange={setIsImageGalleryOpen}>
        <DialogContent className="sm:max-w-[85vw] max-h-[85vh] overflow-hidden p-0 rounded-[5px]">
          <DialogHeader className="px-4 pt-4 pb-3 border-b">
            <DialogTitle className="text-base text-brand-primary">Select User Avatar</DialogTitle>
            <DialogDescription className="text-xs">
              Choose an image from your gallery to use as the user's avatar
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
            <ImageGallery onSelect={handleImageSelect} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
