"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Save,
  Loader2,
  Home,
  ChevronRight,
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Info,
  Clock,
  Users,
  RefreshCw,
  Volume2,
  VolumeX,
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
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@supabase/supabase-js"
import { Toaster, toast } from "sonner"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-supabase-url.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-supabase-key"
const supabase = createClient(supabaseUrl, supabaseKey)

export default function NotificationsSettingsPage() {
  const router = useRouter()

  // State for notification settings
  const [settings, setSettings] = useState({
    // Email notifications
    emailNotificationsEnabled: true,
    emailDigestFrequency: "daily",
    emailNewUsers: true,
    emailNewOrders: true,
    emailSystemAlerts: true,
    emailMarketingUpdates: false,
    emailTemplate: "default",
    emailSignature: "Best regards,\nThe Car Admin Team",

    // In-app notifications
    inAppNotificationsEnabled: true,
    inAppNewUsers: true,
    inAppNewOrders: true,
    inAppSystemAlerts: true,
    inAppMessageNotifications: true,
    maxNotificationsToShow: "10",
    notificationSound: true,

    // Push notifications
    pushNotificationsEnabled: false,
    pushNewUsers: false,
    pushNewOrders: true,
    pushSystemAlerts: true,
    pushMessageNotifications: false,

    // SMS notifications
    smsNotificationsEnabled: false,
    smsPhoneNumber: "",
    smsNewOrders: false,
    smsSystemAlerts: true,
    smsVerificationRequired: true,

    // Notification preferences
    notificationPreferences: {
      orderStatus: "email,inapp",
      userRegistration: "email,inapp",
      systemUpdates: "email,inapp,push",
      securityAlerts: "email,inapp,push,sms",
    },
  })

  // UI states
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("email")
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [realTimeEnabled, setRealTimeEnabled] = useState(true)
  const [autoSave, setAutoSave] = useState(false)
  const [testEmailAddress, setTestEmailAddress] = useState("")
  const [sendingTestEmail, setSendingTestEmail] = useState(false)
  const [testSmsNumber, setTestSmsNumber] = useState("")
  const [sendingTestSms, setSendingTestSms] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  // Fetch settings from Supabase
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)

        // Fetch from Supabase
        const { data, error } = await supabase
          .from("notification_settings")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (error) {
          console.error("Error fetching notification settings:", error)
          // If no settings exist yet, we'll use the defaults
          if (error.code === "PGRST116") {
            setLoading(false)
            return
          }

          toast.error("Failed to load settings")
          setError("Failed to load notification settings. Please try again.")
        } else if (data) {
          // Update state with fetched settings
          setSettings(data.settings || settings)
          setLastSaved(new Date(data.updated_at || data.created_at))
        }
      } catch (err) {
        console.error("Error in fetchSettings:", err)
        toast.error("Failed to load settings")
        setError("Failed to load notification settings. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  // Setup real-time subscription
  useEffect(() => {
    if (!realTimeEnabled) return

    // Subscribe to changes in the notification_settings table
    const subscription = supabase
      .channel("notification_settings_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notification_settings",
        },
        (payload) => {
          if (payload.new && payload.new.settings) {
            // Only update if we're not currently editing
            if (!unsavedChanges) {
              setSettings(payload.new.settings)
              setLastSaved(new Date(payload.new.updated_at || payload.new.created_at))
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

  // Handle nested preferences changes
  const handlePreferenceChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [field]: value,
      },
    }))

    setUnsavedChanges(true)
  }

  // Send test email
  const sendTestEmail = async () => {
    if (!testEmailAddress) {
      toast.error("Please enter an email address")
      return
    }

    setSendingTestEmail(true)

    try {
      // In a real app, you would call your API to send a test email
      // await fetch('/api/notifications/test-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: testEmailAddress })
      // })

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast.success(`Test email sent to ${testEmailAddress}`)
    } catch (err) {
      console.error("Error sending test email:", err)
      toast.error("Failed to send test email")
    } finally {
      setSendingTestEmail(false)
    }
  }

  // Send test SMS
  const sendTestSms = async () => {
    if (!testSmsNumber) {
      toast.error("Please enter a phone number")
      return
    }

    setSendingTestSms(true)

    try {
      // In a real app, you would call your API to send a test SMS
      // await fetch('/api/notifications/test-sms', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phoneNumber: testSmsNumber })
      // })

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast.success(`Test SMS sent to ${testSmsNumber}`)
    } catch (err) {
      console.error("Error sending test SMS:", err)
      toast.error("Failed to send test SMS")
    } finally {
      setSendingTestSms(false)
    }
  }

  // Handle form submission
  const handleSubmit = async (e, isAutoSave = false) => {
    if (e) e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      // Save to Supabase
      const { data, error } = await supabase.from("notification_settings").upsert([
        {
          id: 1, // Use a consistent ID for the settings record
          settings: settings,
          updated_at: new Date().toISOString(),
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
      console.error("Error saving notification settings:", err)
      setError("Failed to save notification settings. Please try again.")
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  // Reset to defaults
  const resetToDefaults = () => {
    const defaultSettings = {
      // Email notifications
      emailNotificationsEnabled: true,
      emailDigestFrequency: "daily",
      emailNewUsers: true,
      emailNewOrders: true,
      emailSystemAlerts: true,
      emailMarketingUpdates: false,
      emailTemplate: "default",
      emailSignature: "Best regards,\nThe Car Admin Team",

      // In-app notifications
      inAppNotificationsEnabled: true,
      inAppNewUsers: true,
      inAppNewOrders: true,
      inAppSystemAlerts: true,
      inAppMessageNotifications: true,
      maxNotificationsToShow: "10",
      notificationSound: true,

      // Push notifications
      pushNotificationsEnabled: false,
      pushNewUsers: false,
      pushNewOrders: true,
      pushSystemAlerts: true,
      pushMessageNotifications: false,

      // SMS notifications
      smsNotificationsEnabled: false,
      smsPhoneNumber: "",
      smsNewOrders: false,
      smsSystemAlerts: true,
      smsVerificationRequired: true,

      // Notification preferences
      notificationPreferences: {
        orderStatus: "email,inapp",
        userRegistration: "email,inapp",
        systemUpdates: "email,inapp,push",
        securityAlerts: "email,inapp,push,sms",
      },
    }

    setSettings(defaultSettings)
    setUnsavedChanges(true)
    toast.info("Reset to default settings")
  }

  // Toggle preview mode
  const togglePreviewMode = () => {
    setPreviewMode(!previewMode)
    toast.info(previewMode ? "Exited preview mode" : "Entered preview mode")
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
          <span className="text-foreground font-medium">Notification Settings</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>

        <Tabs defaultValue="email">
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
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-6 w-10" />
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
        <span className="text-foreground font-medium">Notification Settings</span>
      </div>

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notification Settings</h1>
          <p className="text-muted-foreground">
            Configure how and when notifications are sent
            {lastSaved && (
              <span className="ml-2 text-xs text-muted-foreground">Last saved: {lastSaved.toLocaleTimeString()}</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={togglePreviewMode} className="rounded-[5px]">
            {previewMode ? "Exit Preview" : "Preview Mode"}
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
          <AlertDescription>Your notification settings have been saved successfully.</AlertDescription>
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

      {/* Preview mode banner */}
      {previewMode && (
        <Alert className="mb-6 bg-blue-50 border-blue-200 text-blue-800">
          <Info className="h-4 w-4" />
          <AlertTitle>Preview Mode</AlertTitle>
          <AlertDescription>
            You are in preview mode. Changes will not be saved until you exit preview mode.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="email" className="rounded-[5px]">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="inapp" className="rounded-[5px]">
            <Bell className="h-4 w-4 mr-2" />
            In-App
          </TabsTrigger>
          <TabsTrigger value="push" className="rounded-[5px]">
            <Smartphone className="h-4 w-4 mr-2" />
            Push
          </TabsTrigger>
          <TabsTrigger value="sms" className="rounded-[5px]">
            <MessageSquare className="h-4 w-4 mr-2" />
            SMS
          </TabsTrigger>
          <TabsTrigger value="preferences" className="rounded-[5px]">
            <Users className="h-4 w-4 mr-2" />
            User Preferences
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="email" className="space-y-6">
            <Card className="rounded-[5px]">
              <CardHeader>
                <CardTitle className="text-xl">Email Notifications</CardTitle>
                <CardDescription>Configure email notification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotificationsEnabled" className="text-base">
                      Enable Email Notifications
                    </Label>
                    <p className="text-xs text-muted-foreground">Master switch for all email notifications</p>
                  </div>
                  <Switch
                    id="emailNotificationsEnabled"
                    checked={settings.emailNotificationsEnabled}
                    onCheckedChange={(checked) => handleChange("emailNotificationsEnabled", checked)}
                    className="data-[state=checked]:bg-brand-primary"
                    disabled={previewMode}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="emailDigestFrequency">Email Digest Frequency</Label>
                  <Select
                    value={settings.emailDigestFrequency}
                    onValueChange={(value) => handleChange("emailDigestFrequency", value)}
                    disabled={!settings.emailNotificationsEnabled || previewMode}
                  >
                    <SelectTrigger className="rounded-[5px]">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">How often email digests are sent</p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Notification Types</h3>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="emailNewUsers"
                        checked={settings.emailNewUsers}
                        onCheckedChange={(checked) => handleChange("emailNewUsers", checked)}
                        disabled={!settings.emailNotificationsEnabled || previewMode}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="emailNewUsers" className="text-sm">
                          New User Registrations
                        </Label>
                        <p className="text-xs text-muted-foreground">Receive notifications when new users register</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="emailNewOrders"
                        checked={settings.emailNewOrders}
                        onCheckedChange={(checked) => handleChange("emailNewOrders", checked)}
                        disabled={!settings.emailNotificationsEnabled || previewMode}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="emailNewOrders" className="text-sm">
                          New Orders
                        </Label>
                        <p className="text-xs text-muted-foreground">Receive notifications for new orders</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="emailSystemAlerts"
                        checked={settings.emailSystemAlerts}
                        onCheckedChange={(checked) => handleChange("emailSystemAlerts", checked)}
                        disabled={!settings.emailNotificationsEnabled || previewMode}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="emailSystemAlerts" className="text-sm">
                          System Alerts
                        </Label>
                        <p className="text-xs text-muted-foreground">Receive important system alerts and updates</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="emailMarketingUpdates"
                        checked={settings.emailMarketingUpdates}
                        onCheckedChange={(checked) => handleChange("emailMarketingUpdates", checked)}
                        disabled={!settings.emailNotificationsEnabled || previewMode}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="emailMarketingUpdates" className="text-sm">
                          Marketing Updates
                        </Label>
                        <p className="text-xs text-muted-foreground">Receive marketing and promotional emails</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="emailTemplate">Email Template</Label>
                  <Select
                    value={settings.emailTemplate}
                    onValueChange={(value) => handleChange("emailTemplate", value)}
                    disabled={!settings.emailNotificationsEnabled || previewMode}
                  >
                    <SelectTrigger className="rounded-[5px]">
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="branded">Branded</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Template style for all email notifications</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailSignature">Email Signature</Label>
                  <Textarea
                    id="emailSignature"
                    value={settings.emailSignature}
                    onChange={(e) => handleChange("emailSignature", e.target.value)}
                    className="min-h-[80px] rounded-[5px]"
                    disabled={!settings.emailNotificationsEnabled || previewMode}
                  />
                  <p className="text-xs text-muted-foreground">Signature to include at the end of emails</p>
                </div>

                <div className="mt-4 p-4 border rounded-[5px] bg-muted/30">
                  <h3 className="text-sm font-medium mb-3">Send Test Email</h3>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={testEmailAddress}
                      onChange={(e) => setTestEmailAddress(e.target.value)}
                      disabled={!settings.emailNotificationsEnabled || sendingTestEmail || previewMode}
                      className="rounded-[5px]"
                    />
                    <Button
                      type="button"
                      onClick={sendTestEmail}
                      disabled={
                        !settings.emailNotificationsEnabled || !testEmailAddress || sendingTestEmail || previewMode
                      }
                      className="rounded-[5px]"
                    >
                      {sendingTestEmail ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Mail className="h-4 w-4 mr-2" />
                      )}
                      Send Test
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Send a test email to verify your email notification settings
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inapp" className="space-y-6">
            <Card className="rounded-[5px]">
              <CardHeader>
                <CardTitle className="text-xl">In-App Notifications</CardTitle>
                <CardDescription>Configure in-app notification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="inAppNotificationsEnabled" className="text-base">
                      Enable In-App Notifications
                    </Label>
                    <p className="text-xs text-muted-foreground">Master switch for all in-app notifications</p>
                  </div>
                  <Switch
                    id="inAppNotificationsEnabled"
                    checked={settings.inAppNotificationsEnabled}
                    onCheckedChange={(checked) => handleChange("inAppNotificationsEnabled", checked)}
                    className="data-[state=checked]:bg-brand-primary"
                    disabled={previewMode}
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Notification Types</h3>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="inAppNewUsers"
                        checked={settings.inAppNewUsers}
                        onCheckedChange={(checked) => handleChange("inAppNewUsers", checked)}
                        disabled={!settings.inAppNotificationsEnabled || previewMode}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="inAppNewUsers" className="text-sm">
                          New User Registrations
                        </Label>
                        <p className="text-xs text-muted-foreground">Show notifications when new users register</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="inAppNewOrders"
                        checked={settings.inAppNewOrders}
                        onCheckedChange={(checked) => handleChange("inAppNewOrders", checked)}
                        disabled={!settings.inAppNotificationsEnabled || previewMode}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="inAppNewOrders" className="text-sm">
                          New Orders
                        </Label>
                        <p className="text-xs text-muted-foreground">Show notifications for new orders</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="inAppSystemAlerts"
                        checked={settings.inAppSystemAlerts}
                        onCheckedChange={(checked) => handleChange("inAppSystemAlerts", checked)}
                        disabled={!settings.inAppNotificationsEnabled || previewMode}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="inAppSystemAlerts" className="text-sm">
                          System Alerts
                        </Label>
                        <p className="text-xs text-muted-foreground">Show important system alerts and updates</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="inAppMessageNotifications"
                        checked={settings.inAppMessageNotifications}
                        onCheckedChange={(checked) => handleChange("inAppMessageNotifications", checked)}
                        disabled={!settings.inAppNotificationsEnabled || previewMode}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="inAppMessageNotifications" className="text-sm">
                          Messages
                        </Label>
                        <p className="text-xs text-muted-foreground">Show notifications for new messages</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxNotificationsToShow">Max Notifications to Show</Label>
                    <Input
                      id="maxNotificationsToShow"
                      type="number"
                      min="1"
                      max="100"
                      value={settings.maxNotificationsToShow}
                      onChange={(e) => handleChange("maxNotificationsToShow", e.target.value)}
                      className="rounded-[5px]"
                      disabled={!settings.inAppNotificationsEnabled || previewMode}
                    />
                    <p className="text-xs text-muted-foreground">Maximum number of notifications to display</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notificationSound" className="text-sm">
                        Notification Sound
                      </Label>
                      <p className="text-xs text-muted-foreground">Play a sound when new notifications arrive</p>
                    </div>
                    <Switch
                      id="notificationSound"
                      checked={settings.notificationSound}
                      onCheckedChange={(checked) => handleChange("notificationSound", checked)}
                      className="data-[state=checked]:bg-brand-primary"
                      disabled={!settings.inAppNotificationsEnabled || previewMode}
                    />
                  </div>
                </div>

                <div className="mt-4 p-4 border rounded-[5px] bg-muted/30">
                  <h3 className="text-sm font-medium mb-3">Preview Notification</h3>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() =>
                        toast.info("This is a sample notification", {
                          position: "top-right",
                          duration: 5000,
                        })
                      }
                      disabled={!settings.inAppNotificationsEnabled || previewMode}
                      className="rounded-[5px]"
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Show Sample Notification
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (settings.notificationSound) {
                          // Play a notification sound
                          const audio = new Audio("/notification-sound.mp3")
                          audio.play().catch((e) => console.error("Error playing sound:", e))
                        }
                      }}
                      disabled={!settings.inAppNotificationsEnabled || !settings.notificationSound || previewMode}
                      className="rounded-[5px]"
                    >
                      {settings.notificationSound ? (
                        <Volume2 className="h-4 w-4 mr-2" />
                      ) : (
                        <VolumeX className="h-4 w-4 mr-2" />
                      )}
                      Test Sound
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Preview how notifications will appear to users</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="push" className="space-y-6">
            <Card className="rounded-[5px]">
              <CardHeader>
                <CardTitle className="text-xl">Push Notifications</CardTitle>
                <CardDescription>Configure push notification settings for mobile devices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="pushNotificationsEnabled" className="text-base">
                      Enable Push Notifications
                    </Label>
                    <p className="text-xs text-muted-foreground">Master switch for all push notifications</p>
                  </div>
                  <Switch
                    id="pushNotificationsEnabled"
                    checked={settings.pushNotificationsEnabled}
                    onCheckedChange={(checked) => handleChange("pushNotificationsEnabled", checked)}
                    className="data-[state=checked]:bg-brand-primary"
                    disabled={previewMode}
                  />
                </div>

                <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Information</AlertTitle>
                  <AlertDescription>
                    Push notifications require users to opt-in on their devices. Make sure to request permission in your
                    mobile app.
                  </AlertDescription>
                </Alert>

                <Separator />

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Notification Types</h3>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="pushNewUsers"
                        checked={settings.pushNewUsers}
                        onCheckedChange={(checked) => handleChange("pushNewUsers", checked)}
                        disabled={!settings.pushNotificationsEnabled || previewMode}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="pushNewUsers" className="text-sm">
                          New User Registrations
                        </Label>
                        <p className="text-xs text-muted-foreground">Send push notifications when new users register</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="pushNewOrders"
                        checked={settings.pushNewOrders}
                        onCheckedChange={(checked) => handleChange("pushNewOrders", checked)}
                        disabled={!settings.pushNotificationsEnabled || previewMode}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="pushNewOrders" className="text-sm">
                          New Orders
                        </Label>
                        <p className="text-xs text-muted-foreground">Send push notifications for new orders</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="pushSystemAlerts"
                        checked={settings.pushSystemAlerts}
                        onCheckedChange={(checked) => handleChange("pushSystemAlerts", checked)}
                        disabled={!settings.pushNotificationsEnabled || previewMode}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="pushSystemAlerts" className="text-sm">
                          System Alerts
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Send push notifications for important system alerts
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="pushMessageNotifications"
                        checked={settings.pushMessageNotifications}
                        onCheckedChange={(checked) => handleChange("pushMessageNotifications", checked)}
                        disabled={!settings.pushNotificationsEnabled || previewMode}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="pushMessageNotifications" className="text-sm">
                          Messages
                        </Label>
                        <p className="text-xs text-muted-foreground">Send push notifications for new messages</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sms" className="space-y-6">
            <Card className="rounded-[5px]">
              <CardHeader>
                <CardTitle className="text-xl">SMS Notifications</CardTitle>
                <CardDescription>Configure SMS notification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="smsNotificationsEnabled" className="text-base">
                      Enable SMS Notifications
                    </Label>
                    <p className="text-xs text-muted-foreground">Master switch for all SMS notifications</p>
                  </div>
                  <Switch
                    id="smsNotificationsEnabled"
                    checked={settings.smsNotificationsEnabled}
                    onCheckedChange={(checked) => handleChange("smsNotificationsEnabled", checked)}
                    className="data-[state=checked]:bg-brand-primary"
                    disabled={previewMode}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smsPhoneNumber">Phone Number</Label>
                  <Input
                    id="smsPhoneNumber"
                    value={settings.smsPhoneNumber}
                    onChange={(e) => handleChange("smsPhoneNumber", e.target.value)}
                    className="rounded-[5px]"
                    placeholder="+1 (555) 123-4567"
                    disabled={!settings.smsNotificationsEnabled || previewMode}
                  />
                  <p className="text-xs text-muted-foreground">Phone number to receive SMS notifications</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Notification Types</h3>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="smsNewOrders"
                        checked={settings.smsNewOrders}
                        onCheckedChange={(checked) => handleChange("smsNewOrders", checked)}
                        disabled={!settings.smsNotificationsEnabled || previewMode}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="smsNewOrders" className="text-sm">
                          New Orders
                        </Label>
                        <p className="text-xs text-muted-foreground">Send SMS notifications for new orders</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="smsSystemAlerts"
                        checked={settings.smsSystemAlerts}
                        onCheckedChange={(checked) => handleChange("smsSystemAlerts", checked)}
                        disabled={!settings.smsNotificationsEnabled || previewMode}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="smsSystemAlerts" className="text-sm">
                          System Alerts
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Send SMS notifications for critical system alerts
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="smsVerificationRequired" className="text-sm">
                      Require Phone Verification
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Require phone number verification before sending SMS
                    </p>
                  </div>
                  <Switch
                    id="smsVerificationRequired"
                    checked={settings.smsVerificationRequired}
                    onCheckedChange={(checked) => handleChange("smsVerificationRequired", checked)}
                    className="data-[state=checked]:bg-brand-primary"
                    disabled={!settings.smsNotificationsEnabled || previewMode}
                  />
                </div>

                <div className="mt-4 p-4 border rounded-[5px] bg-muted/30">
                  <h3 className="text-sm font-medium mb-3">Send Test SMS</h3>
                  <div className="flex gap-2">
                    <Input
                      type="tel"
                      placeholder="Enter phone number"
                      value={testSmsNumber}
                      onChange={(e) => setTestSmsNumber(e.target.value)}
                      disabled={!settings.smsNotificationsEnabled || sendingTestSms || previewMode}
                      className="rounded-[5px]"
                    />
                    <Button
                      type="button"
                      onClick={sendTestSms}
                      disabled={!settings.smsNotificationsEnabled || !testSmsNumber || sendingTestSms || previewMode}
                      className="rounded-[5px]"
                    >
                      {sendingTestSms ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <MessageSquare className="h-4 w-4 mr-2" />
                      )}
                      Send Test
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Send a test SMS to verify your SMS notification settings
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card className="rounded-[5px]">
              <CardHeader>
                <CardTitle className="text-xl">User Notification Preferences</CardTitle>
                <CardDescription>Configure default notification preferences for users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                  <Clock className="h-4 w-4" />
                  <AlertTitle>Default Settings</AlertTitle>
                  <AlertDescription>
                    These are the default notification settings for new users. Individual users can override these
                    preferences in their account settings.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="grid grid-cols-5 gap-4 pb-2 border-b">
                    <div className="col-span-2 font-medium">Notification Type</div>
                    <div className="text-center text-sm font-medium">Email</div>
                    <div className="text-center text-sm font-medium">In-App</div>
                    <div className="text-center text-sm font-medium">Push/SMS</div>
                  </div>

                  <div className="grid grid-cols-5 gap-4 items-center py-2 border-b">
                    <div className="col-span-2">
                      <p className="font-medium">Order Status Updates</p>
                      <p className="text-xs text-muted-foreground">Updates about order status changes</p>
                    </div>
                    <div className="flex justify-center">
                      <Checkbox
                        id="orderStatus-email"
                        checked={settings.notificationPreferences.orderStatus.includes("email")}
                        onCheckedChange={(checked) => {
                          const current = settings.notificationPreferences.orderStatus.split(",")
                          const updated = checked
                            ? [...current, "email"].filter((v, i, a) => a.indexOf(v) === i).join(",")
                            : current.filter((c) => c !== "email").join(",")
                          handlePreferenceChange("orderStatus", updated)
                        }}
                        disabled={previewMode}
                      />
                    </div>
                    <div className="flex justify-center">
                      <Checkbox
                        id="orderStatus-inapp"
                        checked={settings.notificationPreferences.orderStatus.includes("inapp")}
                        onCheckedChange={(checked) => {
                          const current = settings.notificationPreferences.orderStatus.split(",")
                          const updated = checked
                            ? [...current, "inapp"].filter((v, i, a) => a.indexOf(v) === i).join(",")
                            : current.filter((c) => c !== "inapp").join(",")
                          handlePreferenceChange("orderStatus", updated)
                        }}
                        disabled={previewMode}
                      />
                    </div>
                    <div className="flex justify-center">
                      <Checkbox
                        id="orderStatus-push"
                        checked={
                          settings.notificationPreferences.orderStatus.includes("push") ||
                          settings.notificationPreferences.orderStatus.includes("sms")
                        }
                        onCheckedChange={(checked) => {
                          const current = settings.notificationPreferences.orderStatus
                            .split(",")
                            .filter((c) => c !== "push" && c !== "sms")
                          const updated = checked
                            ? [...current, "push", "sms"].filter((v, i, a) => a.indexOf(v) === i).join(",")
                            : current.join(",")
                          handlePreferenceChange("orderStatus", updated)
                        }}
                        disabled={previewMode}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-4 items-center py-2 border-b">
                    <div className="col-span-2">
                      <p className="font-medium">User Registration</p>
                      <p className="text-xs text-muted-foreground">Notifications about new user registrations</p>
                    </div>
                    <div className="flex justify-center">
                      <Checkbox
                        id="userRegistration-email"
                        checked={settings.notificationPreferences.userRegistration.includes("email")}
                        onCheckedChange={(checked) => {
                          const current = settings.notificationPreferences.userRegistration.split(",")
                          const updated = checked
                            ? [...current, "email"].filter((v, i, a) => a.indexOf(v) === i).join(",")
                            : current.filter((c) => c !== "email").join(",")
                          handlePreferenceChange("userRegistration", updated)
                        }}
                        disabled={previewMode}
                      />
                    </div>
                    <div className="flex justify-center">
                      <Checkbox
                        id="userRegistration-inapp"
                        checked={settings.notificationPreferences.userRegistration.includes("inapp")}
                        onCheckedChange={(checked) => {
                          const current = settings.notificationPreferences.userRegistration.split(",")
                          const updated = checked
                            ? [...current, "inapp"].filter((v, i, a) => a.indexOf(v) === i).join(",")
                            : current.filter((c) => c !== "inapp").join(",")
                          handlePreferenceChange("userRegistration", updated)
                        }}
                        disabled={previewMode}
                      />
                    </div>
                    <div className="flex justify-center">
                      <Checkbox
                        id="userRegistration-push"
                        checked={
                          settings.notificationPreferences.userRegistration.includes("push") ||
                          settings.notificationPreferences.userRegistration.includes("sms")
                        }
                        onCheckedChange={(checked) => {
                          const current = settings.notificationPreferences.userRegistration
                            .split(",")
                            .filter((c) => c !== "push" && c !== "sms")
                          const updated = checked
                            ? [...current, "push", "sms"].filter((v, i, a) => a.indexOf(v) === i).join(",")
                            : current.join(",")
                          handlePreferenceChange("userRegistration", updated)
                        }}
                        disabled={previewMode}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-4 items-center py-2 border-b">
                    <div className="col-span-2">
                      <p className="font-medium">System Updates</p>
                      <p className="text-xs text-muted-foreground">
                        Notifications about system updates and maintenance
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <Checkbox
                        id="systemUpdates-email"
                        checked={settings.notificationPreferences.systemUpdates.includes("email")}
                        onCheckedChange={(checked) => {
                          const current = settings.notificationPreferences.systemUpdates.split(",")
                          const updated = checked
                            ? [...current, "email"].filter((v, i, a) => a.indexOf(v) === i).join(",")
                            : current.filter((c) => c !== "email").join(",")
                          handlePreferenceChange("systemUpdates", updated)
                        }}
                        disabled={previewMode}
                      />
                    </div>
                    <div className="flex justify-center">
                      <Checkbox
                        id="systemUpdates-inapp"
                        checked={settings.notificationPreferences.systemUpdates.includes("inapp")}
                        onCheckedChange={(checked) => {
                          const current = settings.notificationPreferences.systemUpdates.split(",")
                          const updated = checked
                            ? [...current, "inapp"].filter((v, i, a) => a.indexOf(v) === i).join(",")
                            : current.filter((c) => c !== "inapp").join(",")
                          handlePreferenceChange("systemUpdates", updated)
                        }}
                        disabled={previewMode}
                      />
                    </div>
                    <div className="flex justify-center">
                      <Checkbox
                        id="systemUpdates-push"
                        checked={
                          settings.notificationPreferences.systemUpdates.includes("push") ||
                          settings.notificationPreferences.systemUpdates.includes("sms")
                        }
                        onCheckedChange={(checked) => {
                          const current = settings.notificationPreferences.systemUpdates
                            .split(",")
                            .filter((c) => c !== "push" && c !== "sms")
                          const updated = checked
                            ? [...current, "push", "sms"].filter((v, i, a) => a.indexOf(v) === i).join(",")
                            : current.join(",")
                          handlePreferenceChange("systemUpdates", updated)
                        }}
                        disabled={previewMode}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-4 items-center py-2">
                    <div className="col-span-2">
                      <p className="font-medium">Security Alerts</p>
                      <p className="text-xs text-muted-foreground">Critical security notifications and alerts</p>
                    </div>
                    <div className="flex justify-center">
                      <Checkbox
                        id="securityAlerts-email"
                        checked={settings.notificationPreferences.securityAlerts.includes("email")}
                        onCheckedChange={(checked) => {
                          const current = settings.notificationPreferences.securityAlerts.split(",")
                          const updated = checked
                            ? [...current, "email"].filter((v, i, a) => a.indexOf(v) === i).join(",")
                            : current.filter((c) => c !== "email").join(",")
                          handlePreferenceChange("securityAlerts", updated)
                        }}
                        disabled={previewMode}
                      />
                    </div>
                    <div className="flex justify-center">
                      <Checkbox
                        id="securityAlerts-inapp"
                        checked={settings.notificationPreferences.securityAlerts.includes("inapp")}
                        onCheckedChange={(checked) => {
                          const current = settings.notificationPreferences.securityAlerts.split(",")
                          const updated = checked
                            ? [...current, "inapp"].filter((v, i, a) => a.indexOf(v) === i).join(",")
                            : current.filter((c) => c !== "inapp").join(",")
                          handlePreferenceChange("securityAlerts", updated)
                        }}
                        disabled={previewMode}
                      />
                    </div>
                    <div className="flex justify-center">
                      <Checkbox
                        id="securityAlerts-push"
                        checked={
                          settings.notificationPreferences.securityAlerts.includes("push") ||
                          settings.notificationPreferences.securityAlerts.includes("sms")
                        }
                        onCheckedChange={(checked) => {
                          const current = settings.notificationPreferences.securityAlerts
                            .split(",")
                            .filter((c) => c !== "push" && c !== "sms")
                          const updated = checked
                            ? [...current, "push", "sms"].filter((v, i, a) => a.indexOf(v) === i).join(",")
                            : current.join(",")
                          handlePreferenceChange("securityAlerts", updated)
                        }}
                        disabled={previewMode}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="mt-6 flex justify-end gap-2">
            {previewMode ? (
              <Button
                type="button"
                onClick={togglePreviewMode}
                className="gap-2 bg-brand-primary hover:bg-brand-primary/90 rounded-[5px]"
              >
                Exit Preview Mode
              </Button>
            ) : (
              <Button
                type="submit"
                className="gap-2 bg-brand-primary hover:bg-brand-primary/90 rounded-[5px]"
                disabled={saving || !unsavedChanges}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Settings
              </Button>
            )}
          </div>
        </form>
      </Tabs>
    </div>
  )
}
