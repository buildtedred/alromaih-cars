"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Globe,
  Clock,
  Monitor,
  Smartphone,
  Laptop,
  Chrome,
  ChromeIcon as Firefox,
  AppleIcon as Safari,
  ExternalLink,
  Info,
  User,
  Cpu,
  Flag,
  ArrowUpRight,
} from "lucide-react"
import { format } from "date-fns"

export function UserTrackingCards({ trackingData }) {
  const [activeTab, setActiveTab] = useState("overview")

  // Card background colors
  const cardBgColors = [
    "bg-green-50",
    "bg-blue-50",
    "bg-purple-50",
    "bg-orange-50",
    "bg-pink-50",
    "bg-teal-50",
    "bg-amber-50",
    "bg-indigo-50",
  ]

  if (!trackingData) {
    return (
      <Card className="rounded-[5px] border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>User Tracking</CardTitle>
          <CardDescription>No tracking data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No user tracking data is available for this view.</p>
        </CardContent>
      </Card>
    )
  }

  const { id, productId, data, viewedAt } = trackingData
  const { geo, device, referrer, ipAddress, userAgent } = data
  const geoData = geo?.data?.data || {}

  // Format date for display
  const formattedDate = format(new Date(viewedAt), "PPpp")
  const relativeTime = getRelativeTime(new Date(viewedAt))

  // Get browser icon
  const getBrowserIcon = (browser) => {
    switch (browser?.toLowerCase()) {
      case "chrome":
        return <Chrome className="h-5 w-5 text-blue-500" />
      case "firefox":
        return <Firefox className="h-5 w-5 text-orange-500" />
      case "safari":
        return <Safari className="h-5 w-5 text-blue-400" />
      default:
        return <Globe className="h-5 w-5 text-gray-500" />
    }
  }

  // Get device icon
  const getDeviceIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "desktop":
        return <Monitor className="h-5 w-5 text-purple-500" />
      case "mobile":
        return <Smartphone className="h-5 w-5 text-green-500" />
      case "tablet":
        return <Laptop className="h-5 w-5 text-indigo-500" />
      default:
        return <Cpu className="h-5 w-5 text-gray-500" />
    }
  }

  // Get OS icon
  const getOSIcon = (os) => {
    switch (os?.toLowerCase()) {
      case "windows":
        return <Monitor className="h-5 w-5 text-blue-500" />
      case "macos":
        return <Laptop className="h-5 w-5 text-gray-700" />
      case "ios":
        return <Smartphone className="h-5 w-5 text-gray-700" />
      case "android":
        return <Smartphone className="h-5 w-5 text-green-500" />
      case "linux":
        return <Laptop className="h-5 w-5 text-orange-500" />
      default:
        return <Cpu className="h-5 w-5 text-gray-500" />
    }
  }

  // Extract domain from referrer
  const getReferrerDomain = (url) => {
    if (!url) return "Direct"
    try {
      const domain = new URL(url).hostname
      return domain
    } catch (e) {
      return url
    }
  }

  return (
    <div className="space-y-6">
      {/* Main tracking card */}
      <Card className="rounded-[5px] border-green-200 shadow-sm overflow-hidden bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader className="bg-green-100 pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-green-700">User View #{id}</CardTitle>
              <CardDescription>Tracking data for product view</CardDescription>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
              {relativeTime}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <User className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Product ID</p>
                <p className="font-medium truncate max-w-[200px]">{productId}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <MapPin className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">
                  {geoData.city || "Unknown"}, {geoData.country_name || "Unknown"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-full">{getDeviceIcon(device?.type)}</div>
              <div>
                <p className="text-sm text-gray-500">Device</p>
                <p className="font-medium">
                  {device?.type || "Unknown"} / {device?.os || "Unknown"}
                </p>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="device">Device</TabsTrigger>
              <TabsTrigger value="referrer">Referrer</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  title="Geographic Information"
                  icon={<Globe className="h-5 w-5 text-blue-500" />}
                  items={[
                    { label: "Country", value: geoData.country_name },
                    { label: "City", value: geoData.city },
                    { label: "Region", value: geoData.region },
                    { label: "IP Address", value: ipAddress },
                  ]}
                  bgColor={cardBgColors[0]}
                />
                <InfoCard
                  title="Device Information"
                  icon={getDeviceIcon(device?.type)}
                  items={[
                    { label: "Device Type", value: device?.type },
                    { label: "Operating System", value: device?.os },
                    { label: "Browser", value: device?.browser },
                  ]}
                  bgColor={cardBgColors[1]}
                />
              </div>
              <InfoCard
                title="Referrer Information"
                icon={<ExternalLink className="h-5 w-5 text-purple-500" />}
                items={[
                  { label: "Referrer", value: getReferrerDomain(referrer) },
                  { label: "Full URL", value: referrer },
                  { label: "Viewed At", value: formattedDate },
                ]}
                bgColor={cardBgColors[2]}
              />
            </TabsContent>

            <TabsContent value="location" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  title="Country Information"
                  icon={<Flag className="h-5 w-5 text-red-500" />}
                  items={[
                    { label: "Country", value: geoData.country_name },
                    { label: "Country Code", value: geoData.country_code },
                    { label: "ISO3 Code", value: geoData.country_code_iso3 },
                    { label: "Capital", value: geoData.country_capital },
                    { label: "Population", value: formatNumber(geoData.country_population) },
                    { label: "Area", value: `${formatNumber(geoData.country_area)} km²` },
                    { label: "TLD", value: geoData.country_tld },
                    { label: "Calling Code", value: geoData.country_calling_code },
                  ]}
                  bgColor={cardBgColors[3]}
                />
                <InfoCard
                  title="Regional Information"
                  icon={<MapPin className="h-5 w-5 text-green-500" />}
                  items={[
                    { label: "City", value: geoData.city },
                    { label: "Region", value: geoData.region },
                    { label: "Region Code", value: geoData.region_code },
                    { label: "Postal Code", value: geoData.postal },
                    { label: "Latitude", value: geoData.latitude },
                    { label: "Longitude", value: geoData.longitude },
                    { label: "Timezone", value: geoData.timezone },
                    { label: "UTC Offset", value: geoData.utc_offset },
                  ]}
                  bgColor={cardBgColors[4]}
                />
              </div>
              <InfoCard
                title="Additional Information"
                icon={<Info className="h-5 w-5 text-blue-500" />}
                items={[
                  { label: "Continent", value: geoData.continent_code },
                  { label: "Currency", value: `${geoData.currency} (${geoData.currency_name})` },
                  { label: "Languages", value: geoData.languages },
                  { label: "Network", value: geoData.network },
                  { label: "ASN", value: geoData.asn },
                  { label: "Organization", value: geoData.org },
                  { label: "IP Version", value: geoData.version },
                  { label: "In EU", value: geoData.in_eu ? "Yes" : "No" },
                ]}
                bgColor={cardBgColors[5]}
              />
            </TabsContent>

            <TabsContent value="device" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  title="Device Details"
                  icon={getDeviceIcon(device?.type)}
                  items={[
                    { label: "Device Type", value: device?.type },
                    { label: "Operating System", value: device?.os },
                    { label: "Browser", value: device?.browser },
                  ]}
                  bgColor={cardBgColors[6]}
                />
                <InfoCard
                  title="User Agent"
                  icon={<Info className="h-5 w-5 text-blue-500" />}
                  items={[{ label: "Full User Agent", value: userAgent }]}
                  bgColor={cardBgColors[7]}
                />
              </div>
            </TabsContent>

            <TabsContent value="referrer" className="space-y-4">
              <InfoCard
                title="Referrer Details"
                icon={<ExternalLink className="h-5 w-5 text-purple-500" />}
                items={[
                  { label: "Referrer Domain", value: getReferrerDomain(referrer) },
                  { label: "Full Referrer URL", value: referrer },
                  { label: "Viewed At", value: formattedDate },
                  { label: "Tracking ID", value: id },
                ]}
                bgColor={cardBgColors[0]}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="bg-blue-50 border-t border-blue-100 flex justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            Tracked on {format(new Date(viewedAt), "PPP")} at {format(new Date(viewedAt), "p")}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-[5px] border-green-200 text-green-700 hover:bg-green-50"
          >
            <ArrowUpRight className="h-4 w-4 mr-1" />
            View Details
          </Button>
        </CardFooter>
      </Card>

      {/* Quick stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickStatCard
          title="Location"
          value={`${geoData.city || "Unknown"}, ${geoData.country_name || "Unknown"}`}
          icon={<MapPin className="h-5 w-5 text-green-500" />}
          color="green"
          subtext={geoData.region || "Unknown region"}
          bgColor={cardBgColors[0]}
        />
        <QuickStatCard
          title="Device"
          value={`${device?.type || "Unknown"} / ${device?.browser || "Unknown"}`}
          icon={getBrowserIcon(device?.browser)}
          color="blue"
          subtext={device?.os || "Unknown OS"}
          bgColor={cardBgColors[1]}
        />
        <QuickStatCard
          title="Referrer"
          value={getReferrerDomain(referrer) || "Direct"}
          icon={<ExternalLink className="h-5 w-5 text-purple-500" />}
          color="purple"
          subtext={relativeTime}
          bgColor={cardBgColors[2]}
        />
      </div>
    </div>
  )
}

// Helper component for information cards
function InfoCard({ title, icon, items, bgColor }) {
  return (
    <div className={`${bgColor} rounded-[5px] border border-gray-200 shadow-sm overflow-hidden`}>
      <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center gap-2">
        {icon}
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="p-4">
        <dl className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-3 gap-2">
              <dt className="text-sm font-medium text-gray-600 col-span-1">{item.label}:</dt>
              <dd className="text-sm text-gray-700 col-span-2 break-words">{item.value || "N/A"}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

// Helper component for quick stat cards
function QuickStatCard({ title, value, icon, color, subtext, bgColor }) {
  return (
    <Card className={`rounded-[5px] border-${color}-200 ${bgColor}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">{title}</p>
            <p className="text-lg font-semibold mb-1 truncate max-w-[200px]">{value}</p>
            {subtext && <p className="text-xs text-gray-600">{subtext}</p>}
          </div>
          <div className={`p-2 rounded-full bg-white shadow-sm`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to format numbers with commas
function formatNumber(num) {
  if (!num) return "N/A"
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Helper function to get relative time
function getRelativeTime(date) {
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`
  }

  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`
}
