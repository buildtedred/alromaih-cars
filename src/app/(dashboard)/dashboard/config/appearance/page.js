"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Save,
  Loader2,
  Home,
  ChevronRight,
  Palette,
  Layout,
  Type,
  ImageIcon,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  Upload,
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
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { HexColorPicker, HexColorInput } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createClient } from "@supabase/supabase-js"
import { Toaster, toast } from "sonner"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-supabase-url.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-supabase-key"
const supabase = createClient(supabaseUrl, supabaseKey)

export default function AppearanceSettingsPage() {
  const router = useRouter()

  // State for appearance settings
  const [settings, setSettings] = useState({
    theme: "light",
    primaryColor: "#0066cc",
    secondaryColor: "#f59e0b",
    accentColor: "#10b981",
    fontFamily: "Inter",
    fontSize: "medium",
    borderRadius: 5,
    enableDarkMode: true,
    sidebarCollapsed: false,
    sidebarPosition: "left",
    enableAnimations: true,
    logoUrl: "/abstract-logo.png",
    faviconUrl: "/favicon.ico",
    customCss: "",
    headerLayout: "default",
    footerVisible: true,
    cardStyle: "default",
    tableStyle: "default",
    buttonStyle: "default",
  })

  // UI states
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("theme")
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewSettings, setPreviewSettings] = useState({})
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingFavicon, setUploadingFavicon] = useState(false)
  const [realTimeEnabled, setRealTimeEnabled] = useState(true)
  const [lastSaved, setLastSaved] = useState(null)
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [autoSave, setAutoSave] = useState(false)
  const [autoSaveInterval, setAutoSaveInterval] = useState(null)

  // Fetch settings from Supabase
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)

      // Fetch from Supabase
      const { data, error } = await supabase
        .from("appearance_settings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error) {
        console.error("Error fetching appearance settings:", error)
        // If no settings exist yet, we'll use the defaults
        if (error.code === "PGRST116") {
          setLoading(false)
          return
        }

        toast.error("Failed to load settings")
        setError("Failed to load appearance settings. Please try again.")
      } else if (data) {
        // Update state with fetched settings
        setSettings(data.settings || settings)
        setPreviewSettings(data.settings || settings)
      }
    } catch (err) {
      console.error("Error in fetchSettings:", err)
      toast.error("Failed to load settings")
      setError("Failed to load appearance settings. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  // Setup real-time subscription
  useEffect(() => {
    if (!realTimeEnabled) return

    // Subscribe to changes in the appearance_settings table
    const subscription = supabase
      .channel("appearance_settings_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "appearance_settings",
        },
        (payload) => {
          if (payload.new && payload.new.settings) {
            // Only update if we're not currently editing
            if (!unsavedChanges) {
              setSettings(payload.new.settings)
              setPreviewSettings(payload.new.settings)
              toast.info("Settings updated by another user")
            } else {
              toast.warning("New settings available. Save or discard your changes to see them.")
            }
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "appearance_settings",
        },
        (payload) => {
          if (payload.new && payload.new.settings) {
            // Only update if we're not currently editing
            if (!unsavedChanges) {
              setSettings(payload.new.settings)
              setPreviewSettings(payload.new.settings)
              toast.info("Settings updated by another user")
            } else {
              toast.warning("New settings available. Save or discard your changes to see them.")
            }
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [realTimeEnabled, unsavedChanges])

  // Initial data fetch
  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

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

    // Update preview in real-time if preview is open
    if (previewOpen) {
      setPreviewSettings((prev) => ({
        ...prev,
        [field]: value,
      }))
    }

    // Apply changes in real-time to the UI if enabled
    if (realTimeEnabled) {
      applySettingsToUI({ ...settings, [field]: value })
    }
  }

  // Apply settings to the UI in real-time
  const applySettingsToUI = (settingsToApply) => {
    // Apply CSS variables for colors
    document.documentElement.style.setProperty("--primary-color", settingsToApply.primaryColor)
    document.documentElement.style.setProperty("--secondary-color", settingsToApply.secondaryColor)
    document.documentElement.style.setProperty("--accent-color", settingsToApply.accentColor)

    // Apply border radius
    document.documentElement.style.setProperty("--border-radius", `${settingsToApply.borderRadius}px`)

    // Apply font family
    document.documentElement.style.setProperty("--font-family", settingsToApply.fontFamily)

    // Apply custom CSS if any
    const existingCustomStyle = document.getElementById("custom-theme-css")
    if (existingCustomStyle) {
      existingCustomStyle.remove()
    }

    if (settingsToApply.customCss) {
      const styleElement = document.createElement("style")
      styleElement.id = "custom-theme-css"
      styleElement.textContent = settingsToApply.customCss
      document.head.appendChild(styleElement)
    }

    // Apply theme mode
    if (settingsToApply.theme === "dark") {
      document.documentElement.classList.add("dark")
    } else if (settingsToApply.theme === "light") {
      document.documentElement.classList.remove("dark")
    }
  }

  // Handle file uploads for logo and favicon
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      if (type === "logo") {
        setUploadingLogo(true)
      } else {
        setUploadingFavicon(true)
      }

      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop()
      const fileName = `${type}_${Date.now()}.${fileExt}`
      const filePath = `${type}s/${fileName}`

      const { data, error } = await supabase.storage.from("brand_assets").upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      })

      if (error) {
        throw error
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from("brand_assets").getPublicUrl(filePath)

      // Update settings
      if (type === "logo") {
        handleChange("logoUrl", urlData.publicUrl)
      } else {
        handleChange("faviconUrl", urlData.publicUrl)
      }

      toast.success(`${type === "logo" ? "Logo" : "Favicon"} uploaded successfully`)
    } catch (err) {
      console.error(`Error uploading ${type}:`, err)
      toast.error(`Failed to upload ${type}`)
    } finally {
      if (type === "logo") {
        setUploadingLogo(false)
      } else {
        setUploadingFavicon(false)
      }
    }
  }

  // Handle form submission
  const handleSubmit = async (e, isAutoSave = false) => {
    if (e) e.preventDefault()
    setSaving(true)
  
    try {
      // Save to your API (which writes to Prisma)
      await fetch("/api/appearance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
  
      // Save to Supabase for real-time sync
      const { error } = await supabase.from("appearance_settings").insert([
        { settings }
      ])
  
      if (error) throw error
  
      toast.success(isAutoSave ? "Auto-saved" : "Settings saved")
      setSuccess(true)
      setUnsavedChanges(false)
      setLastSaved(new Date())
    } catch (err) {
      console.error(err)
      toast.error("Failed to save settings")
      setError("Could not save settings")
    } finally {
      setSaving(false)
    }
  }
  
  // Reset to defaults
  const resetToDefaults = () => {
    const defaultSettings = {
      theme: "light",
      primaryColor: "#0066cc",
      secondaryColor: "#f59e0b",
      accentColor: "#10b981",
      fontFamily: "Inter",
      fontSize: "medium",
      borderRadius: 5,
      enableDarkMode: true,
      sidebarCollapsed: false,
      sidebarPosition: "left",
      enableAnimations: true,
      logoUrl: "/abstract-logo.png",
      faviconUrl: "/favicon.ico",
      customCss: "",
      headerLayout: "default",
      footerVisible: true,
      cardStyle: "default",
      tableStyle: "default",
      buttonStyle: "default",
    }

    setSettings(defaultSettings)
    setUnsavedChanges(true)

    if (previewOpen) {
      setPreviewSettings(defaultSettings)
    }

    if (realTimeEnabled) {
      applySettingsToUI(defaultSettings)
    }

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
          <span>Configuration</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Appearance Settings</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>

        <Tabs defaultValue="theme">
          <TabsList className="mb-4">
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
        <span>Configuration</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">Appearance Settings</span>
      </div>

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Appearance Settings</h1>
          <p className="text-muted-foreground">
            Customize the look and feel of your application
            {lastSaved && (
              <span className="ml-2 text-xs text-muted-foreground">Last saved: {lastSaved.toLocaleTimeString()}</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setPreviewSettings({ ...settings })
              setPreviewOpen(true)
            }}
            className="rounded-[5px]"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
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
          <Label htmlFor="realTimeEnabled">Real-time Preview</Label>
          <span className="text-xs text-muted-foreground ml-1">(See changes as you make them)</span>
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
          <AlertDescription>Your appearance settings have been saved successfully.</AlertDescription>
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
          <TabsTrigger value="theme" className="rounded-[5px]">
            <Palette className="h-4 w-4 mr-2" />
            Theme
          </TabsTrigger>
          <TabsTrigger value="layout" className="rounded-[5px]">
            <Layout className="h-4 w-4 mr-2" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="typography" className="rounded-[5px]">
            <Type className="h-4 w-4 mr-2" />
            Typography
          </TabsTrigger>
          <TabsTrigger value="branding" className="rounded-[5px]">
            <ImageIcon className="h-4 w-4 mr-2" />
            Branding
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="theme" className="space-y-6">
            <Card className="rounded-[5px]">
              <CardHeader>
                <CardTitle className="text-xl">Theme Settings</CardTitle>
                <CardDescription>Configure the color scheme and visual style</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme Mode</Label>
                  <RadioGroup
                    id="theme"
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
                  <p className="text-xs text-muted-foreground">Default theme mode for your application</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2 items-center">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <div
                            className="h-4 w-4 rounded-[50%] border"
                            style={{ backgroundColor: settings.primaryColor }}
                          />
                        </div>
                        <Input
                          id="primaryColor"
                          value={settings.primaryColor}
                          onChange={(e) => handleChange("primaryColor", e.target.value)}
                          className="pl-10 rounded-[5px]"
                        />
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-10 p-0 border-2 rounded-[5px]"
                            style={{
                              backgroundColor: settings.primaryColor,
                              borderColor: settings.primaryColor ? "transparent" : undefined,
                            }}
                          >
                            <span className="sr-only">Pick a color</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-3" align="end">
                          <div className="space-y-3">
                            <HexColorPicker
                              color={settings.primaryColor}
                              onChange={(color) => handleChange("primaryColor", color)}
                            />
                            <div className="flex items-center">
                              <span className="mr-2 text-sm font-medium">HEX:</span>
                              <HexColorInput
                                color={settings.primaryColor}
                                onChange={(color) => handleChange("primaryColor", color)}
                                prefixed
                                className="w-full h-8 px-2 border rounded-md text-sm"
                              />
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <p className="text-xs text-muted-foreground">Main brand color for buttons and accents</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex gap-2 items-center">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <div
                            className="h-4 w-4 rounded-[50%] border"
                            style={{ backgroundColor: settings.secondaryColor }}
                          />
                        </div>
                        <Input
                          id="secondaryColor"
                          value={settings.secondaryColor}
                          onChange={(e) => handleChange("secondaryColor", e.target.value)}
                          className="pl-10 rounded-[5px]"
                        />
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-10 p-0 border-2 rounded-[5px]"
                            style={{
                              backgroundColor: settings.secondaryColor,
                              borderColor: settings.secondaryColor ? "transparent" : undefined,
                            }}
                          >
                            <span className="sr-only">Pick a color</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-3" align="end">
                          <div className="space-y-3">
                            <HexColorPicker
                              color={settings.secondaryColor}
                              onChange={(color) => handleChange("secondaryColor", color)}
                            />
                            <div className="flex items-center">
                              <span className="mr-2 text-sm font-medium">HEX:</span>
                              <HexColorInput
                                color={settings.secondaryColor}
                                onChange={(color) => handleChange("secondaryColor", color)}
                                prefixed
                                className="w-full h-8 px-2 border rounded-md text-sm"
                              />
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <p className="text-xs text-muted-foreground">Used for secondary elements and highlights</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <div className="flex gap-2 items-center">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <div
                            className="h-4 w-4 rounded-[50%] border"
                            style={{ backgroundColor: settings.accentColor }}
                          />
                        </div>
                        <Input
                          id="accentColor"
                          value={settings.accentColor}
                          onChange={(e) => handleChange("accentColor", e.target.value)}
                          className="pl-10 rounded-[5px]"
                        />
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-10 p-0 border-2 rounded-[5px]"
                            style={{
                              backgroundColor: settings.accentColor,
                              borderColor: settings.accentColor ? "transparent" : undefined,
                            }}
                          >
                            <span className="sr-only">Pick a color</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-3" align="end">
                          <div className="space-y-3">
                            <HexColorPicker
                              color={settings.accentColor}
                              onChange={(color) => handleChange("accentColor", color)}
                            />
                            <div className="flex items-center">
                              <span className="mr-2 text-sm font-medium">HEX:</span>
                              <HexColorInput
                                color={settings.accentColor}
                                onChange={(color) => handleChange("accentColor", color)}
                                prefixed
                                className="w-full h-8 px-2 border rounded-md text-sm"
                              />
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <p className="text-xs text-muted-foreground">Used for success states and call-to-actions</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="borderRadius">Border Radius ({settings.borderRadius}px)</Label>
                  <Slider
                    id="borderRadius"
                    min={0}
                    max={20}
                    step={1}
                    value={[settings.borderRadius]}
                    onValueChange={(value) => handleChange("borderRadius", value[0])}
                    className="py-4"
                  />
                  <p className="text-xs text-muted-foreground">Roundness of corners for UI elements</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardStyle">Card Style</Label>
                    <Select value={settings.cardStyle} onValueChange={(value) => handleChange("cardStyle", value)}>
                      <SelectTrigger className="rounded-[5px]">
                        <SelectValue placeholder="Select card style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="flat">Flat</SelectItem>
                        <SelectItem value="elevated">Elevated</SelectItem>
                        <SelectItem value="bordered">Bordered</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Visual style for card components</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tableStyle">Table Style</Label>
                    <Select value={settings.tableStyle} onValueChange={(value) => handleChange("tableStyle", value)}>
                      <SelectTrigger className="rounded-[5px]">
                        <SelectValue placeholder="Select table style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="striped">Striped</SelectItem>
                        <SelectItem value="bordered">Bordered</SelectItem>
                        <SelectItem value="compact">Compact</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Visual style for table components</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buttonStyle">Button Style</Label>
                    <Select value={settings.buttonStyle} onValueChange={(value) => handleChange("buttonStyle", value)}>
                      <SelectTrigger className="rounded-[5px]">
                        <SelectValue placeholder="Select button style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="soft">Soft</SelectItem>
                        <SelectItem value="outline">Outline</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Visual style for button components</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableDarkMode">Enable Dark Mode Toggle</Label>
                    <p className="text-xs text-muted-foreground">Allow users to switch between light and dark mode</p>
                  </div>
                  <Switch
                    id="enableDarkMode"
                    checked={settings.enableDarkMode}
                    onCheckedChange={(checked) => handleChange("enableDarkMode", checked)}
                    className="data-[state=checked]:bg-brand-primary"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableAnimations">Enable UI Animations</Label>
                    <p className="text-xs text-muted-foreground">
                      Enable smooth transitions and animations throughout the interface
                    </p>
                  </div>
                  <Switch
                    id="enableAnimations"
                    checked={settings.enableAnimations}
                    onCheckedChange={(checked) => handleChange("enableAnimations", checked)}
                    className="data-[state=checked]:bg-brand-primary"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="space-y-6">
            <Card className="rounded-[5px]">
              <CardHeader>
                <CardTitle className="text-xl">Layout Settings</CardTitle>
                <CardDescription>Configure the layout and structure of your application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="headerLayout">Header Layout</Label>
                    <Select
                      value={settings.headerLayout}
                      onValueChange={(value) => handleChange("headerLayout", value)}
                    >
                      <SelectTrigger className="rounded-[5px]">
                        <SelectValue placeholder="Select header layout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="centered">Centered</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="compact">Compact</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Layout style for the application header</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sidebarPosition">Sidebar Position</Label>
                    <RadioGroup
                      id="sidebarPosition"
                      value={settings.sidebarPosition}
                      onValueChange={(value) => handleChange("sidebarPosition", value)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="left" id="sidebar-left" />
                        <Label htmlFor="sidebar-left">Left</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="right" id="sidebar-right" />
                        <Label htmlFor="sidebar-right">Right</Label>
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-muted-foreground">Position of the sidebar navigation</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sidebarCollapsed">Default Sidebar Collapsed</Label>
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
                    <Label htmlFor="footerVisible">Show Footer</Label>
                    <p className="text-xs text-muted-foreground">Display the footer section at the bottom of pages</p>
                  </div>
                  <Switch
                    id="footerVisible"
                    checked={settings.footerVisible}
                    onCheckedChange={(checked) => handleChange("footerVisible", checked)}
                    className="data-[state=checked]:bg-brand-primary"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="typography" className="space-y-6">
            <Card className="rounded-[5px]">
              <CardHeader>
                <CardTitle className="text-xl">Typography Settings</CardTitle>
                <CardDescription>Configure fonts and text styling</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fontFamily">Font Family</Label>
                    <Select value={settings.fontFamily} onValueChange={(value) => handleChange("fontFamily", value)}>
                      <SelectTrigger className="rounded-[5px]">
                        <SelectValue placeholder="Select font family" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Lato">Lato</SelectItem>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                        <SelectItem value="Poppins">Poppins</SelectItem>
                        <SelectItem value="System UI">System UI</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Primary font family for the application</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fontSize">Base Font Size</Label>
                    <Select value={settings.fontSize} onValueChange={(value) => handleChange("fontSize", value)}>
                      <SelectTrigger className="rounded-[5px]">
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Base font size for the application</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customCss">Custom CSS</Label>
                  <textarea
                    id="customCss"
                    value={settings.customCss}
                    onChange={(e) => handleChange("customCss", e.target.value)}
                    className="min-h-[150px] w-full rounded-[5px] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="/* Add your custom CSS here */"
                  />
                  <p className="text-xs text-muted-foreground">Add custom CSS to override default styles</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding" className="space-y-6">
            <Card className="rounded-[5px]">
              <CardHeader>
                <CardTitle className="text-xl">Branding Settings</CardTitle>
                <CardDescription>Configure logos and brand assets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="logoUrl">Logo</Label>
                    <div className="flex gap-2">
                      <Input
                        id="logoUrl"
                        value={settings.logoUrl}
                        onChange={(e) => handleChange("logoUrl", e.target.value)}
                        className="rounded-[5px]"
                      />
                      <div className="relative">
                        <input
                          type="file"
                          id="logoUpload"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "logo")}
                        />
                        <Button type="button" variant="outline" className="rounded-[5px]" disabled={uploadingLogo}>
                          {uploadingLogo ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">URL to your company logo or upload a new one</p>

                    <div className="mt-4 p-4 border rounded-[5px] bg-muted/30 flex items-center justify-center">
                      {settings.logoUrl ? (
                        <img
                          src={settings.logoUrl || "/placeholder.svg"}
                          alt="Logo Preview"
                          className="max-h-16 max-w-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "/abstract-logo.png"
                          }}
                        />
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-xs">No logo set</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="faviconUrl">Favicon</Label>
                    <div className="flex gap-2">
                      <Input
                        id="faviconUrl"
                        value={settings.faviconUrl}
                        onChange={(e) => handleChange("faviconUrl", e.target.value)}
                        className="rounded-[5px]"
                      />
                      <div className="relative">
                        <input
                          type="file"
                          id="faviconUpload"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "favicon")}
                        />
                        <Button type="button" variant="outline" className="rounded-[5px]" disabled={uploadingFavicon}>
                          {uploadingFavicon ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">URL to your site favicon or upload a new one</p>

                    <div className="mt-4 p-4 border rounded-[5px] bg-muted/30 flex items-center justify-center">
                      {settings.faviconUrl ? (
                        <img
                          src={settings.faviconUrl || "/placeholder.svg"}
                          alt="Favicon Preview"
                          className="h-8 w-8 object-contain"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "/generic-icon.png"
                          }}
                        />
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <ImageIcon className="h-6 w-6 mx-auto mb-1" />
                          <p className="text-xs">No favicon set</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-[5px]"
                    onClick={() => router.push("/dashboard/logos")}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Manage Logos in Gallery
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              className="gap-2 bg-brand-primary hover:bg-brand-primary/90 rounded-[5px]"
              disabled={saving || (!unsavedChanges && !autoSave)}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Settings
            </Button>
          </div>
        </form>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-[80vw] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Theme Preview</DialogTitle>
            <DialogDescription>Preview how your theme settings will look in the application</DialogDescription>
          </DialogHeader>
          <div className="p-4 border rounded-[5px] mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Preview</h3>
                <div
                  className="p-6 border rounded-[5px] shadow-sm"
                  style={{
                    backgroundColor: previewSettings.theme === "dark" ? "#1f2937" : "#ffffff",
                    color: previewSettings.theme === "dark" ? "#f9fafb" : "#111827",
                    borderRadius: `${previewSettings.borderRadius}px`,
                    fontFamily: previewSettings.fontFamily || "Inter",
                  }}
                >
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold mb-2">Sample Card</h4>
                    <p className="text-sm mb-4">This is how your content will look with the selected settings.</p>

                    <div className="flex gap-2 mb-4">
                      <Button
                        type="button"
                        className="rounded-[5px]"
                        style={{
                          backgroundColor: previewSettings.primaryColor,
                          color: "#ffffff",
                          borderRadius: `${previewSettings.borderRadius}px`,
                        }}
                      >
                        Primary Button
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-[5px]"
                        style={{
                          borderColor: previewSettings.secondaryColor,
                          color: previewSettings.secondaryColor,
                          borderRadius: `${previewSettings.borderRadius}px`,
                        }}
                      >
                        Secondary Button
                      </Button>
                    </div>

                    <div
                      className="p-3 rounded-[5px] mb-4"
                      style={{
                        backgroundColor: previewSettings.accentColor,
                        color: "#ffffff",
                        borderRadius: `${previewSettings.borderRadius}px`,
                      }}
                    >
                      <p className="text-sm">This is an accent-colored alert box</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: previewSettings.primaryColor }}
                      ></div>
                      <span>Primary Color</span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: previewSettings.secondaryColor }}
                      ></div>
                      <span>Secondary Color</span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: previewSettings.accentColor }}
                      ></div>
                      <span>Accent Color</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Current Settings</h3>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2 p-2 border-b">
                    <span className="font-medium">Theme:</span>
                    <span className="capitalize">{previewSettings.theme}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-2 border-b">
                    <span className="font-medium">Primary Color:</span>
                    <span>{previewSettings.primaryColor}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-2 border-b">
                    <span className="font-medium">Secondary Color:</span>
                    <span>{previewSettings.secondaryColor}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-2 border-b">
                    <span className="font-medium">Accent Color:</span>
                    <span>{previewSettings.accentColor}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-2 border-b">
                    <span className="font-medium">Font Family:</span>
                    <span>{previewSettings.fontFamily}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-2 border-b">
                    <span className="font-medium">Font Size:</span>
                    <span className="capitalize">{previewSettings.fontSize}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-2 border-b">
                    <span className="font-medium">Border Radius:</span>
                    <span>{previewSettings.borderRadius}px</span>
                  </div>
                </div>

                <div className="mt-4">
                  <Button
                    type="button"
                    onClick={() => {
                      setSettings({ ...previewSettings })
                      setUnsavedChanges(true)
                      setPreviewOpen(false)
                      toast.info("Preview settings applied")
                    }}
                    className="w-full rounded-[5px]"
                    style={{
                      backgroundColor: previewSettings.primaryColor,
                    }}
                  >
                    Apply These Settings
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
