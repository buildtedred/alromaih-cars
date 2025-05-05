"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Save,
  Loader2,
  Home,
  ChevronRight,
  Settings,
  Globe,
  Database,
  Shield,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
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
import { createClient } from "@supabase/supabase-js"
import { Toaster, toast } from "sonner"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-supabase-url.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-supabase-key"
const supabase = createClient(supabaseUrl, supabaseKey)

export default function GeneralSettingsPage() {
  const router = useRouter()

  // State for general settings
  const [settings, setSettings] = useState({
    siteName: "Car Brands Dashboard",
    siteDescription: "Manage all your car brands, logos, and variations in one place",
    contactEmail: "admin@example.com",
    supportEmail: "support@example.com",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    language: "en",
    maxUploadSize: 5,
    enableBackups: true,
    backupFrequency: "daily",
    enableApi: true,
    apiRateLimit: 100,
    maintenanceMode: false,
    maintenanceMessage: "We're currently performing maintenance. Please check back soon.",
    enableAnalytics: true,
    analyticsProvider: "google",
    analyticsId: "",
    enableCookieConsent: true,
    privacyPolicyUrl: "/privacy-policy",
    termsOfServiceUrl: "/terms-of-service",
  })

  // UI states
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("site")
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [realTimeEnabled, setRealTimeEnabled] = useState(true)
  const [autoSave, setAutoSave] = useState(false)

  // Fetch settings from Supabase
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)

        // Fetch from Supabase
        const { data, error } = await supabase
          .from("general_settings")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (error) {
          console.error("Error fetching general settings:", error)
          // If no settings exist yet, we'll use the defaults
          if (error.code === "PGRST116") {
            setLoading(false)
            return
          }

          toast.error("Failed to load settings")
          setError("Failed to load general settings. Please try again.")
        } else if (data) {
          // Update state with fetched settings
          setSettings(data.settings || settings)
        }
      } catch (err) {
        console.error("Error in fetchSettings:", err)
        toast.error("Failed to load settings")
        setError("Failed to load general settings. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  // Setup real-time subscription
  useEffect(() => {
    if (!realTimeEnabled) return

    // Subscribe to changes in the general_settings table
    const subscription = supabase
      .channel("general_settings_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "general_settings",
        },
        (payload) => {
          if (payload.new && payload.new.settings) {
            // Only update if we're not currently editing
            if (!unsavedChanges) {
              setSettings(payload.new.settings)
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
          table: "general_settings",
        },
        (payload) => {
          if (payload.new && payload.new.settings) {
            // Only update if we're not currently editing
            if (!unsavedChanges) {
              setSettings(payload.new.settings)
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

  // Handle form submission
  const handleSubmit = async (e, isAutoSave = false) => {
    if (e) e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      // Save to Supabase
      const { data, error } = await supabase.from("general_settings").insert([
        {
          settings: settings,
          created_by: "current_user", // In a real app, use the actual user ID
          is_active: true,
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
    } catch (err) {
      console.error("Error saving general settings:", err)
      setError("Failed to save general settings. Please try again.")
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  // Reset to defaults
  const resetToDefaults = () => {
    const defaultSettings = {
      siteName: "Car Brands Dashboard",
      siteDescription: "Manage all your car brands, logos, and variations in one place",
      contactEmail: "admin@example.com",
      supportEmail: "support@example.com",
      timezone: "UTC",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
      language: "en",
      maxUploadSize: 5,
      enableBackups: true,
      backupFrequency: "daily",
      enableApi: true,
      apiRateLimit: 100,
      maintenanceMode: false,
      maintenanceMessage: "We're currently performing maintenance. Please check back soon.",
      enableAnalytics: true,
      analyticsProvider: "google",
      analyticsId: "",
      enableCookieConsent: true,
      privacyPolicyUrl: "/privacy-policy",
      termsOfServiceUrl: "/terms-of-service",
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
          <span>Configuration</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">General Settings</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>

        <Tabs defaultValue="site">
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
        <span className="text-foreground font-medium">General Settings</span>
      </div>

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">General Settings</h1>
          <p className="text-muted-foreground">
            Configure basic system settings and preferences
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
          <span className="text-xs text-muted-foreground ml-1">(Receive updates from other users)</span>
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
          <AlertDescription>Your general settings have been saved successfully.</AlertDescription>
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
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Unsaved Changes</AlertTitle>
          <AlertDescription>You have unsaved changes. Don't forget to save before leaving this page.</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="site" className="rounded-[5px]">
            <Settings className="h-4 w-4 mr-2" />
            Site Information
          </TabsTrigger>
          <TabsTrigger value="regional" className="rounded-[5px]">
            <Globe className="h-4 w-4 mr-2" />
            Regional Settings
          </TabsTrigger>
          <TabsTrigger value="system" className="rounded-[5px]">
            <Database className="h-4 w-4 mr-2" />
            System Configuration
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="rounded-[5px]">
            <Shield className="h-4 w-4 mr-2" />
            Maintenance & Security
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="site" className="space-y-6">
            <Card className="rounded-[5px]">
              <CardHeader>
                <CardTitle className="text-xl">Site Information</CardTitle>
                <CardDescription>Configure basic information about your site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) => handleChange("siteName", e.target.value)}
                      className="rounded-[5px]"
                    />
                    <p className="text-xs text-muted-foreground">The name of your application or website</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteDescription">Site Description</Label>
                    <Input
                      id="siteDescription"
                      value={settings.siteDescription}
                      onChange={(e) => handleChange("siteDescription", e.target.value)}
                      className="rounded-[5px]"
                    />
                    <p className="text-xs text-muted-foreground">A brief description of your application</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => handleChange("contactEmail", e.target.value)}
                      className="rounded-[5px]"
                    />
                    <p className="text-xs text-muted-foreground">Primary contact email for your organization</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => handleChange("supportEmail", e.target.value)}
                      className="rounded-[5px]"
                    />
                    <p className="text-xs text-muted-foreground">Email address for user support inquiries</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="privacyPolicyUrl">Privacy Policy URL</Label>
                    <Input
                      id="privacyPolicyUrl"
                      value={settings.privacyPolicyUrl}
                      onChange={(e) => handleChange("privacyPolicyUrl", e.target.value)}
                      className="rounded-[5px]"
                    />
                    <p className="text-xs text-muted-foreground">Link to your privacy policy page</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="termsOfServiceUrl">Terms of Service URL</Label>
                    <Input
                      id="termsOfServiceUrl"
                      value={settings.termsOfServiceUrl}
                      onChange={(e) => handleChange("termsOfServiceUrl", e.target.value)}
                      className="rounded-[5px]"
                    />
                    <p className="text-xs text-muted-foreground">Link to your terms of service page</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regional" className="space-y-6">
            <Card className="rounded-[5px]">
              <CardHeader>
                <CardTitle className="text-xl">Regional Settings</CardTitle>
                <CardDescription>Configure timezone, date formats, and language preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={settings.timezone} onValueChange={(value) => handleChange("timezone", value)}>
                      <SelectTrigger className="rounded-[5px]">
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
                    <p className="text-xs text-muted-foreground">Default timezone for the application</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={settings.language} onValueChange={(value) => handleChange("language", value)}>
                      <SelectTrigger className="rounded-[5px]">
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
                    <p className="text-xs text-muted-foreground">Default language for the application</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select value={settings.dateFormat} onValueChange={(value) => handleChange("dateFormat", value)}>
                      <SelectTrigger className="rounded-[5px]">
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
                    <p className="text-xs text-muted-foreground">Format for displaying dates</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeFormat">Time Format</Label>
                    <Select value={settings.timeFormat} onValueChange={(value) => handleChange("timeFormat", value)}>
                      <SelectTrigger className="rounded-[5px]">
                        <SelectValue placeholder="Select time format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12-hour (1:30 PM)</SelectItem>
                        <SelectItem value="24h">24-hour (13:30)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Format for displaying times</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card className="rounded-[5px]">
              <CardHeader>
                <CardTitle className="text-xl">System Configuration</CardTitle>
                <CardDescription>Configure system-level settings and capabilities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxUploadSize">Maximum Upload Size (MB)</Label>
                    <Input
                      id="maxUploadSize"
                      type="number"
                      min="1"
                      max="100"
                      value={settings.maxUploadSize}
                      onChange={(e) => handleChange("maxUploadSize", Number.parseInt(e.target.value))}
                      className="rounded-[5px]"
                    />
                    <p className="text-xs text-muted-foreground">Maximum file size for uploads in megabytes</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <Select
                      value={settings.backupFrequency}
                      onValueChange={(value) => handleChange("backupFrequency", value)}
                      disabled={!settings.enableBackups}
                    >
                      <SelectTrigger className="rounded-[5px]">
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
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableBackups">Enable Automatic Backups</Label>
                    <p className="text-xs text-muted-foreground">Automatically backup your database and files</p>
                  </div>
                  <Switch
                    id="enableBackups"
                    checked={settings.enableBackups}
                    onCheckedChange={(checked) => handleChange("enableBackups", checked)}
                    className="data-[state=checked]:bg-brand-primary"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableApi">Enable API Access</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow external applications to access your data via API
                    </p>
                  </div>
                  <Switch
                    id="enableApi"
                    checked={settings.enableApi}
                    onCheckedChange={(checked) => handleChange("enableApi", checked)}
                    className="data-[state=checked]:bg-brand-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiRateLimit">API Rate Limit (requests per minute)</Label>
                  <Input
                    id="apiRateLimit"
                    type="number"
                    min="10"
                    max="1000"
                    value={settings.apiRateLimit}
                    onChange={(e) => handleChange("apiRateLimit", Number.parseInt(e.target.value))}
                    disabled={!settings.enableApi}
                    className="rounded-[5px]"
                  />
                  <p className="text-xs text-muted-foreground">Maximum number of API requests allowed per minute</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-6">
            <Card className="rounded-[5px]">
              <CardHeader>
                <CardTitle className="text-xl">Maintenance & Security</CardTitle>
                <CardDescription>Configure maintenance mode and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <p className="text-xs text-muted-foreground">
                      Put the site in maintenance mode to prevent user access during updates
                    </p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleChange("maintenanceMode", checked)}
                    className="data-[state=checked]:bg-brand-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                  <Textarea
                    id="maintenanceMessage"
                    value={settings.maintenanceMessage}
                    onChange={(e) => handleChange("maintenanceMessage", e.target.value)}
                    disabled={!settings.maintenanceMode}
                    className="min-h-[100px] rounded-[5px]"
                  />
                  <p className="text-xs text-muted-foreground">Message to display to users during maintenance</p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableAnalytics">Enable Analytics</Label>
                    <p className="text-xs text-muted-foreground">
                      Track user behavior and site performance with analytics
                    </p>
                  </div>
                  <Switch
                    id="enableAnalytics"
                    checked={settings.enableAnalytics}
                    onCheckedChange={(checked) => handleChange("enableAnalytics", checked)}
                    className="data-[state=checked]:bg-brand-primary"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="analyticsProvider">Analytics Provider</Label>
                    <Select
                      value={settings.analyticsProvider}
                      onValueChange={(value) => handleChange("analyticsProvider", value)}
                      disabled={!settings.enableAnalytics}
                    >
                      <SelectTrigger className="rounded-[5px]">
                        <SelectValue placeholder="Select analytics provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="google">Google Analytics</SelectItem>
                        <SelectItem value="matomo">Matomo</SelectItem>
                        <SelectItem value="plausible">Plausible</SelectItem>
                        <SelectItem value="fathom">Fathom</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Service used for analytics tracking</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="analyticsId">Analytics ID/Tracking Code</Label>
                    <Input
                      id="analyticsId"
                      value={settings.analyticsId}
                      onChange={(e) => handleChange("analyticsId", e.target.value)}
                      disabled={!settings.enableAnalytics}
                      className="rounded-[5px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your unique tracking ID from your analytics provider
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableCookieConsent">Enable Cookie Consent</Label>
                    <p className="text-xs text-muted-foreground">
                      Show a cookie consent banner to comply with privacy regulations
                    </p>
                  </div>
                  <Switch
                    id="enableCookieConsent"
                    checked={settings.enableCookieConsent}
                    onCheckedChange={(checked) => handleChange("enableCookieConsent", checked)}
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
              disabled={saving || (!unsavedChanges && !autoSave)}
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
