"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Settings,
  Home,
  ChevronRight,
  Save,
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  User,
  Bell,
  Lock,
  Shield,
  Palette,
  Mail,
  Smartphone,
  Upload,
  Info,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createClient } from "@supabase/supabase-js"
import { Toaster, toast } from "sonner"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-supabase-url.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-supabase-key"
const supabase = createClient(supabaseUrl, supabaseKey)

export default function SettingsPage() {
  const router = useRouter()

  // State for settings
  const [settings, setSettings] = useState({
    // Account settings
    username: "admin",
    email: "admin@example.com",
    name: "Admin User",
    profileImage: "/abstract-geometric-shapes.png",
    language: "en",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",

    // Notification settings
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    inAppNotifications: true,
    marketingEmails: false,

    // Security settings
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
    loginAttempts: "5",
    ipRestriction: false,
    allowedIPs: "",

    // Display settings
    theme: "light",
    sidebarCollapsed: false,
    highContrastMode: false,
    animationsEnabled: true,
    fontSize: "medium",

    // System settings
    maintenanceMode: false,
    debugMode: false,
    analyticsEnabled: true,
    backupFrequency: "daily",
    logLevel: "error",
    apiEnabled: true,
  })

  // UI states
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("account")
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [realTimeEnabled, setRealTimeEnabled] = useState(true)
  const [autoSave, setAutoSave] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Fetch settings from Supabase
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)

        // Fetch from Supabase
        const { data, error } = await supabase
          .from("user_settings")
          .select("*")
          .eq("user_id", "current_user") // In a real app, use the actual user ID
          .single()

        if (error) {
          console.error("Error fetching settings:", error)
          // If no settings exist yet, we'll use the defaults
          if (error.code === "PGRST116") {
            setLoading(false)
            return
          }

          toast.error("Failed to load settings")
          setError("Failed to load settings. Please try again.")
        } else if (data) {
          // Update state with fetched settings
          setSettings(data.settings || settings)
          setLastSaved(new Date(data.updated_at || data.created_at))
        }
      } catch (err) {
        console.error("Error in fetchSettings:", err)
        toast.error("Failed to load settings")
        setError("Failed to load settings. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()

    // Set up real-time subscription
    const subscription = supabase
      .channel("settings_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_settings",
          filter: `user_id=eq.current_user`, // In a real app, use the actual user ID
        },
        (payload) => {
          if (payload.new && payload.new.settings) {
            // Only update if we're not currently editing
            if (!unsavedChanges) {
              setSettings(payload.new.settings)
              setLastSaved(new Date(payload.new.updated_at || payload.new.created_at))
              toast.info("Settings updated")
            } else {
              toast.warning("New settings available. Save or discard your changes to see them.")
            }
          }
        },
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription)
    }
  }, [unsavedChanges])

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && unsavedChanges) {
      const timer = setTimeout(() => {
        handleSubmit(null, true)
      }, 5000) // Auto-save after 5 seconds of inactivity

      return () => clearTimeout(timer)
    }
  }, [settings, autoSave, unsavedChanges])

  // Handle input changes
  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))

    setUnsavedChanges(true)
  }

  // Handle profile image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setUploadingImage(true)

      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop()
      const fileName = `profile_${Date.now()}.${fileExt}`
      const filePath = `profiles/${fileName}`

      const { data, error } = await supabase.storage.from("user_assets").upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      })

      if (error) throw error

      // Get public URL
      const { data: urlData } = supabase.storage.from("user_assets").getPublicUrl(filePath)

      // Update settings
      handleChange("profileImage", urlData.publicUrl)

      toast.success("Profile image uploaded successfully")
    } catch (err) {
      console.error("Error uploading image:", err)
      toast.error("Failed to upload image")
    } finally {
      setUploadingImage(false)
    }
  }

  // Handle form submission
  const handleSubmit = async (e, isAutoSave = false) => {
    if (e) e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      // Save to Supabase
      const { data, error } = await supabase.from("user_settings").upsert([
        {
          user_id: "current_user", // In a real app, use the actual user ID
          settings: settings,
          updated_at: new Date().toISOString(),
        },
      ])

      if (error) throw error

      setUnsavedChanges(false)
      setLastSaved(new Date())

      if (!isAutoSave) {
        setSuccess(true)
        toast.success("Settings saved successfully")
        setTimeout(() => setSuccess(false), 3000)
      } else {
        toast.success("Auto-saved settings")
      }

      // Apply theme changes
      applyThemeSettings()
    } catch (err) {
      console.error("Error saving settings:", err)
      setError("Failed to save settings. Please try again.")
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  // Apply theme settings to the UI
  const applyThemeSettings = () => {
    // Apply theme
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Apply high contrast mode
    if (settings.highContrastMode) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }

    // Apply font size
    document.documentElement.style.fontSize =
      {
        small: "14px",
        medium: "16px",
        large: "18px",
      }[settings.fontSize] || "16px"
  }

  // Reset to defaults
  const resetToDefaults = () => {
    const defaultSettings = {
      // Account settings
      username: "admin",
      email: "admin@example.com",
      name: "Admin User",
      profileImage: "/abstract-geometric-shapes.png",
      language: "en",
      timezone: "UTC",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",

      // Notification settings
      emailNotifications: true,
      pushNotifications: false,
      smsNotifications: false,
      inAppNotifications: true,
      marketingEmails: false,

      // Security settings
      twoFactorAuth: false,
      sessionTimeout: "30",
      passwordExpiry: "90",
      loginAttempts: "5",
      ipRestriction: false,
      allowedIPs: "",

      // Display settings
      theme: "light",
      sidebarCollapsed: false,
      highContrastMode: false,
      animationsEnabled: true,
      fontSize: "medium",

      // System settings
      maintenanceMode: false,
      debugMode: false,
      analyticsEnabled: true,
      backupFrequency: "daily",
      logLevel: "error",
      apiEnabled: true,
    }

    setSettings(defaultSettings)
    setUnsavedChanges(true)
    toast.info("Reset to default settings")
  }

  // Render loading skeleton
  if (loading) {
    return (
      <div className="container mx-auto py-6 max-w-5xl">
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <Home className="h-4 w-4" />
          <ChevronRight className="h-3 w-3" />
          <span>Dashboard</span>
          <ChevronRight className="h-3 w-3" />
          <span>Administration</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Settings</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>

        <Tabs defaultValue="account">
          <TabsList className="mb-4">
            <Skeleton className="h-10 w-24 mr-1" />
            <Skeleton className="h-10 w-24 mr-1" />
            <Skeleton className="h-10 w-24 mr-1" />
            <Skeleton className="h-10 w-24" />
          </TabsList>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-72" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-24 ml-auto" />
              </CardFooter>
            </Card>
          </div>
        </Tabs>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <Toaster position="top-right" />

      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Home className="h-4 w-4" />
        <ChevronRight className="h-3 w-3" />
        <span>Dashboard</span>
        <ChevronRight className="h-3 w-3" />
        <span>Administration</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">Settings</span>
      </div>

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and application settings
            {lastSaved && (
              <span className="ml-2 text-xs text-muted-foreground">Last saved: {lastSaved.toLocaleTimeString()}</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefaults} className="rounded-[5px]">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </div>

      {/* Real-time and auto-save controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="realTimeEnabled"
            checked={realTimeEnabled}
            onCheckedChange={setRealTimeEnabled}
            className="data-[state=checked]:bg-brand-primary"
          />
          <Label htmlFor="realTimeEnabled">Real-time Updates</Label>
          <span className="text-xs text-muted-foreground ml-1">(Receive updates from other devices)</span>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="autoSave"
            checked={autoSave}
            onCheckedChange={setAutoSave}
            className="data-[state=checked]:bg-brand-primary"
          />
          <Label htmlFor="autoSave">Auto-save Changes</Label>
          <span className="text-xs text-muted-foreground ml-1">(Save automatically after 5 seconds)</span>
        </div>
      </div>

      {/* Success message */}
      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Your settings have been saved successfully.</AlertDescription>
        </Alert>
      )}

      {/* Error message */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Unsaved changes warning */}
      {unsavedChanges && !autoSave && (
        <Alert className="mb-6 bg-yellow-50 border-yellow-200 text-yellow-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unsaved Changes</AlertTitle>
          <AlertDescription>You have unsaved changes. Don't forget to save before leaving this page.</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="account" className="rounded-[5px]">
            <User className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-[5px]">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-[5px]">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="display" className="rounded-[5px]">
            <Palette className="h-4 w-4 mr-2" />
            Display
          </TabsTrigger>
          <TabsTrigger value="system" className="rounded-[5px]">
            <Settings className="h-4 w-4 mr-2" />
            System
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="account" className="space-y-6">
            <Card className="rounded-[5px]">
              <CardHeader>
                <CardTitle className="text-xl">Account Information</CardTitle>
                <CardDescription>Manage your personal information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3 flex flex-col items-center">
                    <div className="relative mb-4">
                      <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-muted">
                        <img
                          src={settings.profileImage || "/placeholder.svg?height=128&width=128&query=user"}
                          alt="Profile"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "/abstract-geometric-shapes.png"
                          }}
                        />
                      </div>
                      <div className="absolute bottom-0 right-0">
                        <div className="relative">
                          <input
                            type="file"
                            id="profileImage"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                          <Button
                            type="button"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-brand-primary hover:bg-brand-primary/90"
                            disabled={uploadingImage}
                          >
                            {uploadingImage ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Upload className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Upload a profile picture</p>
                  </div>

                  <div className="md:w-2/3 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={settings.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          className="rounded-[5px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={settings.username}
                          onChange={(e) => handleChange("username", e.target.value)}
                          className="rounded-[5px]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="rounded-[5px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select value={settings.language} onValueChange={(value) => handleChange("language", value)}>
                          <SelectTrigger id="language" className="rounded-[5px]">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="it">Italian</SelectItem>
                            <SelectItem value="pt">Portuguese</SelectItem>
                            <SelectItem value="ru">Russian</SelectItem>
                            <SelectItem value="zh">Chinese</SelectItem>
                            <SelectItem value="ja">Japanese</SelectItem>
                            <SelectItem value="ar">Arabic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select value={settings.timezone} onValueChange={(value) => handleChange("timezone", value)}>
                          <SelectTrigger id="timezone" className="rounded-[5px]">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                            <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
                            <SelectItem value="CST">CST (Central Standard Time)</SelectItem>
                            <SelectItem value="MST">MST (Mountain Standard Time)</SelectItem>
                            <SelectItem value="PST">PST (Pacific Standard Time)</SelectItem>
                            <SelectItem value="GMT">GMT (Greenwich Mean Time)</SelectItem>
                            <SelectItem value="CET">CET (Central European Time)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateFormat">Date Format</Label>
                        <Select
                          value={settings.dateFormat}
                          onValueChange={(value) => handleChange("dateFormat", value)}
                        >
                          <SelectTrigger id="dateFormat" className="rounded-[5px]">
                            <SelectValue placeholder="Select date format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (US)</SelectItem>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (Europe/Asia)</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (ISO)</SelectItem>
                            <SelectItem value="MMM DD, YYYY">MMM DD, YYYY (Jan 01, 2023)</SelectItem>
                            <SelectItem value="DD MMM YYYY">DD MMM YYYY (01 Jan 2023)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timeFormat">Time Format</Label>
                        <Select
                          value={settings.timeFormat}
                          onValueChange={(value) => handleChange("timeFormat", value)}
                        >
                          <SelectTrigger id="timeFormat" className="rounded-[5px]">
                            <SelectValue placeholder="Select time format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12h">12-hour (1:30 PM)</SelectItem>
                            <SelectItem value="24h">24-hour (13:30)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="rounded-[5px]">
              <CardHeader>
                <CardTitle className="text-xl">Notification Preferences</CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Notification Channels</AlertTitle>
                  <AlertDescription>
                    Choose which channels you want to receive notifications through. You can enable multiple channels.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications" className="text-base">
                        <Mail className="h-4 w-4 inline-block mr-2" />
                        Email Notifications
                      </Label>
                      <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleChange("emailNotifications", checked)}
                      className="data-[state=checked]:bg-brand-primary"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="pushNotifications" className="text-base">
                        <Smartphone className="h-4 w-4 inline-block mr-2" />
                        Push Notifications
                      </Label>
                      <p className="text-xs text-muted-foreground">Receive notifications on your devices</p>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => handleChange("pushNotifications", checked)}
                      className="data-[state=checked]:bg-brand-primary"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="smsNotifications" className="text-base">
                        <MessageSquare className="h-4 w-4 inline-block mr-2" />
                        SMS Notifications
                      </Label>
                      <p className="text-xs text-muted-foreground">Receive notifications via text message</p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) => handleChange("smsNotifications", checked)}
                      className="data-[state=checked]:bg-brand-primary"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="inAppNotifications" className="text-base">
                        <Bell className="h-4 w-4 inline-block mr-2" />
                        In-App Notifications
                      </Label>
                      <p className="text-xs text-muted-foreground">Receive notifications within the application</p>
                    </div>
                    <Switch
                      id="inAppNotifications"
                      checked={settings.inAppNotifications}
                      onCheckedChange={(checked) => handleChange("inAppNotifications", checked)}
                      className="data-[state=checked]:bg-brand-primary"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketingEmails" className="text-base">
                        <Mail className="h-4 w-4 inline-block mr-2" />
                        Marketing Emails
                      </Label>
                      <p className="text-xs text-muted-foreground">Receive promotional emails and updates</p>
                    </div>
                    <Switch
                      id="marketingEmails"
                      checked={settings.marketingEmails}
                      onCheckedChange={(checked) => handleChange("marketingEmails", checked)}
                      className="data-[state=checked]:bg-brand-primary"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="rounded-[5px]">
              <CardHeader>
                <CardTitle className="text-xl">Security Settings</CardTitle>
                <CardDescription>Configure security and privacy options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="twoFactorAuth" className="text-base">
                      <Lock className="h-4 w-4 inline-block mr-2" />
                      Two-Factor Authentication
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Require a verification code in addition to your password
                    </p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleChange("twoFactorAuth", checked)}
                    className="data-[state=checked]:bg-brand-primary"
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      min="5"
                      max="1440"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleChange("sessionTimeout", e.target.value)}
                      className="rounded-[5px]"
                    />
                    <p className="text-xs text-muted-foreground">Automatically log out after period of inactivity</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                    <Input
                      id="passwordExpiry"
                      type="number"
                      min="0"
                      max="365"
                      value={settings.passwordExpiry}
                      onChange={(e) => handleChange("passwordExpiry", e.target.value)}
                      className="rounded-[5px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Force password change after specified days (0 = never)
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loginAttempts">Maximum Login Attempts</Label>
                  <Input
                    id="loginAttempts"
                    type="number"
                    min="1"
                    max="10"
                    value={settings.loginAttempts}
                    onChange={(e) => handleChange("loginAttempts", e.target.value)}
                    className="rounded-[5px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Number of failed login attempts before account lockout
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="ipRestriction" className="text-base">
                      <Shield className="h-4 w-4 inline-block mr-2" />
                      IP Address Restriction
                    </Label>
                    <p className="text-xs text-muted-foreground">Restrict login to specific IP addresses</p>
                  </div>
                  <Switch
                    id="ipRestriction"
                    checked={settings.ipRestriction}
                    onCheckedChange={(checked) => handleChange("ipRestriction", checked)}
                    className="data-[state=checked]:bg-brand-primary"
                  />
                </div>

                {settings.ipRestriction && (
                  <div className="space-y-2">
                    <Label htmlFor="allowedIPs">Allowed IP Addresses</Label>
                    <Textarea
                      id="allowedIPs"
                      placeholder="Enter IP addresses, one per line"
                      value={settings.allowedIPs}
                      onChange={(e) => handleChange("allowedIPs", e.target.value)}
                      className="min-h-[100px] rounded-[5px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter one IP address or CIDR range per line (e.g., 192.168.1.1 or 192.168.1.0/24)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="display" className="space-y-6">
            <Card className="rounded-[5px]">
              <CardHeader>
                <CardTitle className="text-xl">Display Settings</CardTitle>
                <CardDescription>Customize the appearance of the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <RadioGroup
                      value={settings.theme}
                      onValueChange={(value) => handleChange("theme", value)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="theme-light" />
                        <Label htmlFor="theme-light">Light</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="theme-dark" />
                        <Label htmlFor="theme-dark">Dark</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="system" id="theme-system" />
                        <Label htmlFor="theme-system">System</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sidebarCollapsed" className="text-base">
                        Collapsed Sidebar
                      </Label>
                      <p className="text-xs text-muted-foreground">Start with the sidebar in a collapsed state</p>
                    </div>
                    <Switch
                      id="sidebarCollapsed"
                      checked={settings.sidebarCollapsed}
                      onCheckedChange={(checked) => handleChange("sidebarCollapsed", checked)}
                      className="data-[state=checked]:bg-brand-primary"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="highContrastMode" className="text-base">
                        High Contrast Mode
                      </Label>
                      <p className="text-xs text-muted-foreground">Increase contrast for better visibility</p>
                    </div>
                    <Switch
                      id="highContrastMode"
                      checked={settings.highContrastMode}
                      onCheckedChange={(checked) => handleChange("highContrastMode", checked)}
                      className="data-[state=checked]:bg-brand-primary"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="animationsEnabled" className="text-base">
                        Enable Animations
                      </Label>
                      <p className="text-xs text-muted-foreground">Show animations and transitions</p>
                    </div>
                    <Switch
                      id="animationsEnabled"
                      checked={settings.animationsEnabled}
                      onCheckedChange={(checked) => handleChange("animationsEnabled", checked)}
                      className="data-[state=checked]:bg-brand-primary"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="fontSize">Font Size</Label>
                    <Select value={settings.fontSize} onValueChange={(value) => handleChange("fontSize", value)}>
                      <SelectTrigger id="fontSize" className="rounded-[5px]">
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Adjust the size of text throughout the application</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card className="rounded-[5px]">
              <CardHeader>
                <CardTitle className="text-xl">System Settings</CardTitle>
                <CardDescription>Configure system-level settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Administrator Access</AlertTitle>
                  <AlertDescription>
                    These settings require administrator privileges and may affect all users of the system.
                  </AlertDescription>
                </Alert>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenanceMode" className="text-base">
                      Maintenance Mode
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Put the site in maintenance mode to prevent user access
                    </p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleChange("maintenanceMode", checked)}
                    className="data-[state=checked]:bg-brand-primary"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="debugMode" className="text-base">
                      Debug Mode
                    </Label>
                    <p className="text-xs text-muted-foreground">Enable detailed error messages and logging</p>
                  </div>
                  <Switch
                    id="debugMode"
                    checked={settings.debugMode}
                    onCheckedChange={(checked) => handleChange("debugMode", checked)}
                    className="data-[state=checked]:bg-brand-primary"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="analyticsEnabled" className="text-base">
                      Enable Analytics
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Collect anonymous usage data to improve the application
                    </p>
                  </div>
                  <Switch
                    id="analyticsEnabled"
                    checked={settings.analyticsEnabled}
                    onCheckedChange={(checked) => handleChange("analyticsEnabled", checked)}
                    className="data-[state=checked]:bg-brand-primary"
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <Select
                      value={settings.backupFrequency}
                      onValueChange={(value) => handleChange("backupFrequency", value)}
                    >
                      <SelectTrigger id="backupFrequency" className="rounded-[5px]">
                        <SelectValue placeholder="Select backup frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">How often to create automatic backups</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logLevel">Log Level</Label>
                    <Select value={settings.logLevel} onValueChange={(value) => handleChange("logLevel", value)}>
                      <SelectTrigger id="logLevel" className="rounded-[5px]">
                        <SelectValue placeholder="Select log level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="debug">Debug</SelectItem>
                        <SelectItem value="trace">Trace</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Minimum severity level for logging</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="apiEnabled" className="text-base">
                      Enable API Access
                    </Label>
                    <p className="text-xs text-muted-foreground">Allow external applications to access data via API</p>
                  </div>
                  <Switch
                    id="apiEnabled"
                    checked={settings.apiEnabled}
                    onCheckedChange={(checked) => handleChange("apiEnabled", checked)}
                    className="data-[state=checked]:bg-brand-primary"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              className="gap-2 bg-brand-primary hover:bg-brand-primary/90 rounded-[5px]"
              disabled={saving || !unsavedChanges}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Settings
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  )
}
