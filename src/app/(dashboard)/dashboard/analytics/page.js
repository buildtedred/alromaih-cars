"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import {
  RefreshCw,
  Search,
  Calendar,
  Download,
  MapPin,
  Monitor,
  Globe,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Package,
  Filter,
  ArrowUpDown,
  Clock,
  History,
  AlertCircle,
} from "lucide-react"
import { format, formatDistance } from "date-fns"

export default function TrackingDashboard() {
  const [trackingData, setTrackingData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedView, setSelectedView] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [brandNames, setBrandNames] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [sortField, setSortField] = useState("viewedAt")
  const [sortDirection, setSortDirection] = useState("desc")
  const [loadingBrands, setLoadingBrands] = useState({})
  const [dialogOpen, setDialogOpen] = useState(false)
  const [viewingTime, setViewingTime] = useState(0)
  const [viewingStartTime, setViewingStartTime] = useState(null)
  const [viewingHistory, setViewingHistory] = useState({})
  const viewingTimerRef = useRef(null)
  const currentTimeRef = useRef(null)

  // Add a function to update the time display in real-time
  const [timeDisplays, setTimeDisplays] = useState({})
  const timeDisplayRef = useRef(null)

  // themeColors.js

  // Alromaih Cars theme colors
  const colors = {
    primary: "#46194F", // Deep Purple
    secondary: "#6A1B9A", // Royal Purple
    accent: "#9C27B0", // Bright Purple
    neutral: "#4E4E50", // Charcoal Gray
    light: "#F3E5F5", // Lavender Tint
    dark: "#2C0E30", // Grape Dark
    success: "#7B1FA2", // Amethyst
    warning: "#FFB300", // Golden Yellow
    error: "#C62828", // Crimson Red
    info: "#7C4DFF", // Electric Violet
  }

  // Card background colors
  const cardBgColors = [
    "bg-[rgb(243,229,245)]", // Lavender Tint
    "bg-[rgb(225,190,231)]", // Light Purple
    "bg-[rgb(209,196,233)]", // Pale Purple
    "bg-[rgb(237,231,246)]", // Soft Violet
    "bg-[rgb(248,187,208)]", // Blush Pink
    "bg-[rgb(255,243,224)]", // Light Orange
    "bg-[rgb(252,228,236)]", // Light Rose
    "bg-[rgb(251,233,231)]", // Coral Tint
  ]

  // Colors for the line chart
  const colorsArray = [
    "#46194F", // Deep Purple
    "#6A1B9A", // Royal Purple
    "#7B1FA2", // Amethyst
    "#BA68C8", // Orchid
    "#9575CD", // Soft Purple
    "#512DA8", // Indigo
    "#FFB300", // Golden Yellow
    "#C62828", // Crimson
    "#7C4DFF", // Electric Violet
    "#4A148C", // Dark Violet
  ]

  // Update current time every second
  useEffect(() => {
    currentTimeRef.current = setInterval(() => {
      const now = new Date()
      const currentTimeElement = document.getElementById("current-time")
      if (currentTimeElement) {
        currentTimeElement.textContent = format(now, "PPP 'at' h:mm:ss a")
      }
    }, 1000)

    return () => {
      if (currentTimeRef.current) {
        clearInterval(currentTimeRef.current)
      }
    }
  }, [])

  // Fetch brand names from API
  const fetchBrandNames = async (productIds) => {
    if (!productIds || productIds.length === 0) return {}

    const uniqueIds = [...new Set(productIds)]
    const newBrandNames = { ...brandNames }
    const newLoadingBrands = { ...loadingBrands }

    // Mark all as loading
    uniqueIds.forEach((id) => {
      if (!newBrandNames[id] && !newLoadingBrands[id]) {
        newLoadingBrands[id] = true
      }
    })
    setLoadingBrands(newLoadingBrands)

    try {
      // Fetch brand names for each product ID
      // In a real app, you would batch these requests or have an API endpoint that accepts multiple IDs
      const fetchPromises = uniqueIds.map(async (id) => {
        if (newBrandNames[id]) return { id, name: newBrandNames[id] }

        try {
          // Attempt to fetch the brand name from your API
          // Replace with your actual API endpoint for fetching brand details
          const response = await fetch(`/api/supabasPrisma/carbrands/${id}`)

          if (!response.ok) {
            // If we can't get the brand name, use a fallback
            return { id, name: `Brand ${id.substring(0, 8)}` }
          }

          const data = await response.json()
          return { id, name: data?.en?.name || `Brand ${id.substring(0, 8)}` }
        } catch (err) {
          console.error(`Error fetching brand name for ${id}:`, err)
          return { id, name: `Brand ${id.substring(0, 8)}` }
        }
      })

      const results = await Promise.all(fetchPromises)

      // Update brand names
      const newNames = {}
      results.forEach((result) => {
        newNames[result.id] = result.name
      })

      setBrandNames((prev) => ({ ...prev, ...newNames }))

      // Clear loading state
      const updatedLoadingBrands = { ...newLoadingBrands }
      uniqueIds.forEach((id) => {
        updatedLoadingBrands[id] = false
      })
      setLoadingBrands(updatedLoadingBrands)

      return newNames
    } catch (err) {
      console.error("Error fetching brand names:", err)

      // Clear loading state on error
      const updatedLoadingBrands = { ...newLoadingBrands }
      uniqueIds.forEach((id) => {
        updatedLoadingBrands[id] = false
      })
      setLoadingBrands(updatedLoadingBrands)

      return {}
    }
  }

  // Handle opening the details dialog
  const handleOpenDetails = (view) => {
    const startTime = new Date()
    setSelectedView(view)
    setDialogOpen(true)
    setViewingStartTime(startTime)
    setViewingTime(0)

    // Add to viewing history
    setViewingHistory((prev) => {
      const viewId = view.id
      const newHistory = { ...prev }

      if (!newHistory[viewId]) {
        newHistory[viewId] = []
      }

      newHistory[viewId].push({
        startTime,
        endTime: null,
        duration: 0,
        productId: view.productId,
        productName: brandNames[view.productId] || "Unknown Brand",
      })

      return newHistory
    })

    // Start the timer to track viewing time
    viewingTimerRef.current = setInterval(() => {
      setViewingTime((prev) => prev + 1)
    }, 1000)
  }

  // Handle closing the details dialog
  const handleCloseDetails = () => {
    // Stop the timer
    if (viewingTimerRef.current) {
      clearInterval(viewingTimerRef.current)
      viewingTimerRef.current = null
    }

    // Log the viewing time and update history
    if (selectedView && viewingStartTime) {
      const endTime = new Date()
      const totalViewingTime = Math.round((endTime - viewingStartTime) / 1000)

      console.log(
        `User viewed details for ${selectedView.id} (${brandNames[selectedView.productId] || "Unknown"}) for ${totalViewingTime} seconds`,
        `Started: ${format(viewingStartTime, "PPP 'at' h:mm:ss a")}`,
        `Ended: ${format(endTime, "PPP 'at' h:mm:ss a")}`,
      )

      // Update viewing history with end time and duration
      setViewingHistory((prev) => {
        const viewId = selectedView.id
        const newHistory = { ...prev }

        if (newHistory[viewId] && newHistory[viewId].length > 0) {
          const lastIndex = newHistory[viewId].length - 1
          newHistory[viewId][lastIndex].endTime = endTime
          newHistory[viewId][lastIndex].duration = totalViewingTime
        }

        return newHistory
      })

      // Here you could also send this data to your analytics service
      // trackViewingTime(selectedView.id, totalViewingTime, viewingStartTime, endTime)
    }

    setDialogOpen(false)
    setSelectedView(null)
    setViewingStartTime(null)
  }

  // Format seconds to mm:ss
  const formatSeconds = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Format seconds to human readable duration
  const formatDuration = (seconds) => {
    if (seconds < 60) {
      return `${seconds} seconds`
    } else if (seconds < 3600) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins} minute${mins !== 1 ? "s" : ""} ${secs} second${secs !== 1 ? "s" : ""}`
    } else {
      const hours = Math.floor(seconds / 3600)
      const mins = Math.floor((seconds % 3600) / 60)
      return `${hours} hour${hours !== 1 ? "s" : ""} ${mins} minute${mins !== 1 ? "s" : ""}`
    }
  }

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (viewingTimerRef.current) {
        clearInterval(viewingTimerRef.current)
      }
      if (currentTimeRef.current) {
        clearInterval(currentTimeRef.current)
      }
      if (timeDisplayRef.current) {
        clearInterval(timeDisplayRef.current)
      }
    }
  }, [])

  // Prepare data for the bar chart
  const prepareChartData = (data, brandNames) => {
    const groupedData = {}

    data.forEach((item) => {
      const date = format(new Date(item.viewedAt), "yyyy-MM-dd")
      const productId = item.productId

      if (!groupedData[date]) {
        groupedData[date] = {}
      }

      if (!groupedData[date][productId]) {
        groupedData[date][productId] = 0
      }

      groupedData[date][productId]++
    })

    const chartData = Object.keys(groupedData).map((date) => {
      const dataPoint = { date }
      Object.keys(groupedData[date]).forEach((productId) => {
        dataPoint[productId] = groupedData[date][productId]
      })
      return dataPoint
    })

    // Sort by date
    return chartData.sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  // Fetch tracking data from API
  const fetchTrackingData = async () => {
    try {
      setRefreshing(true)
      setError(null)

      const response = await fetch("/api/track-view")

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const result = await response.json()

      if (!result.success || !result.data) {
        throw new Error("Invalid API response format")
      }

      const data = result.data

      // Extract product IDs to fetch brand names
      const productIds = data.map((item) => item.productId)

      // Fetch brand names for these products
      await fetchBrandNames(productIds)

      setTrackingData(data)
      setLoading(false)
      setRefreshing(false)
    } catch (err) {
      console.error("Error fetching tracking data:", err)
      setError(`Failed to load tracking data: ${err.message}`)
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Load data on initial render
  useEffect(() => {
    fetchTrackingData()
  }, [])

  // Handle sort change
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Filter and sort data
  const processData = () => {
    // First filter the data
    const filtered = trackingData.filter((view) => {
      const matchesSearch =
        searchTerm === "" ||
        (brandNames[view.productId] || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        view.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (view.data?.location?.country || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (view.data?.location?.city || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (view.data?.device?.browser || "").toLowerCase().includes(searchTerm.toLowerCase())

      if (activeTab === "all") return matchesSearch
      if (activeTab === "pakistan")
        return (
          matchesSearch && (view.data?.location?.country === "PK" || view.data?.location?.country_name === "Pakistan")
        )
      if (activeTab === "desktop") return matchesSearch && view.data?.device?.type === "Desktop"
      if (activeTab === "mobile") return matchesSearch && view.data?.device?.type === "Mobile"

      return matchesSearch
    })

    // Then sort the filtered data
    return filtered.sort((a, b) => {
      let valueA, valueB

      // Handle different sort fields
      switch (sortField) {
        case "brand":
          valueA = brandNames[a.productId] || ""
          valueB = brandNames[b.productId] || ""
          break
        case "location":
          valueA = `${a.data?.location?.city || ""}, ${a.data?.location?.country || ""}`
          valueB = `${b.data?.location?.city || ""}, ${b.data?.location?.country || ""}`
          break
        case "device":
          valueA = `${a.data?.device?.type || ""}`
          valueB = `${b.data?.device?.type || ""}`
          break
        case "viewedAt":
        default:
          valueA = new Date(a.viewedAt).getTime()
          valueB = new Date(b.viewedAt).getTime()
          break
      }

      // Sort based on direction
      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
    })
  }

  const filteredData = processData()

  // Get stats
  const stats = {
    total: trackingData.length,
    pakistan: trackingData.filter(
      (view) => view.data?.location?.country === "PK" || view.data?.location?.country_name === "Pakistan",
    ).length,
    desktop: trackingData.filter((view) => view.data?.device?.type === "Desktop").length,
    mobile: trackingData.filter((view) => view.data?.device?.type === "Mobile").length,
    uniqueProducts: new Set(trackingData.map((view) => view.productId)).size,
    uniqueCountries: new Set(
      trackingData.filter((view) => view.data?.location?.country).map((view) => view.data.location.country),
    ).size,
  }

  // Get browser distribution
  const browserDistribution = trackingData.reduce((acc, view) => {
    const browser = view.data?.device?.browser || "Unknown"
    acc[browser] = (acc[browser] || 0) + 1
    return acc
  }, {})

  // Get country distribution
  const countryDistribution = trackingData.reduce((acc, view) => {
    const country = view.data?.location?.country_name || view.data?.location?.country || "Unknown"
    acc[country] = (acc[country] || 0) + 1
    return acc
  }, {})

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  // Get color for browser badge
  const getBrowserColor = (browser) => {
    if (!browser) return colors.neutral

    const browserMap = {
      chrome: colors.success,
      firefox: colors.warning,
      safari: colors.info,
      edge: colors.info,
      opera: colors.error,
      ie: colors.info,
    }

    return browserMap[browser.toLowerCase()] || colors.secondary
  }

  // Get color for country badge
  const getCountryColor = (country) => {
    if (!country) return colors.neutral

    const countryMap = {
      PK: colors.success,
      Pakistan: colors.success,
      "United States": colors.info,
      US: colors.info,
      "United Kingdom": colors.error,
      UK: colors.error,
      India: colors.warning,
      IN: colors.warning,
      China: colors.error,
      CN: colors.error,
      Germany: "#FFD700", // Yellow
      DE: "#FFD700",
      France: colors.info,
      FR: colors.info,
      Japan: colors.error,
      JP: colors.error,
      Australia: "#20B2AA", // Teal
      AU: "#20B2AA",
    }

    return countryMap[country] || colors.secondary
  }

  // Prepare data for the chart
  const chartData = prepareChartData(filteredData, brandNames)

  // Update time displays every second
  useEffect(() => {
    timeDisplayRef.current = setInterval(() => {
      const now = new Date()

      // Update all time displays
      setTimeDisplays((prev) => {
        const newDisplays = { ...prev }

        // Update for each view in the table
        paginatedData.forEach((view) => {
          const viewTime = new Date(view.viewedAt)
          newDisplays[view.id] = formatDistance(viewTime, now, {
            addSuffix: true,
            includeSeconds: true,
          })
        })

        return newDisplays
      })
    }, 1000)

    return () => {
      if (timeDisplayRef.current) {
        clearInterval(timeDisplayRef.current)
      }
    }
  }, [paginatedData])

  // Export data as CSV
  const exportData = () => {
    if (trackingData.length === 0) return

    // Create CSV header
    const headers = [
      "ID",
      "Product ID",
      "Brand",
      "City",
      "Country",
      "Device Type",
      "Browser",
      "Viewed At",
      "IP Address",
    ]

    // Create CSV rows
    const rows = trackingData.map((view) => [
      view.id,
      view.productId,
      brandNames[view.productId] || "Unknown Brand",
      view.data?.location?.city || "Unknown",
      view.data?.location?.country_name || view.data?.location?.country || "Unknown",
      view.data?.device?.type || "Unknown",
      view.data?.device?.browser || "Unknown",
      format(new Date(view.viewedAt), "yyyy-MM-dd HH:mm:ss"),
      view.data?.ipAddress || view.data?.location?.ip || "Unknown",
    ])

    // Combine header and rows
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `tracking-data-${format(new Date(), "yyyy-MM-dd")}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Skeleton loader for stats cards
  const StatCardSkeleton = () => (
    <div className="transform perspective-1000 transition-all duration-300 hover:rotate-y-0">
      <Card className="rounded-[5px] overflow-hidden shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)] border-2 border-gray-300">
        <div className="h-1 bg-gray-200"></div>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="w-full">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-2 w-full" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Skeleton loader for chart
  const ChartSkeleton = () => (
    <Card className="rounded-[5px] mb-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] transform transition-all duration-300 border-2 border-gray-300">
      <CardHeader>
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px] bg-gray-100 rounded-md flex items-center justify-center">
          <Skeleton className="h-[250px] w-[90%]" />
        </div>
      </CardContent>
    </Card>
  )

  // Skeleton loader for distribution cards
  const DistributionCardSkeleton = () => (
    <div className="transform perspective-1000 transition-all duration-300 hover:rotate-y-0">
      <Card className="rounded-[5px] overflow-hidden shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)] border-2 border-gray-300">
        <div className="h-1 bg-gray-200"></div>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-6 w-40" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-2 w-32" />
                  <Skeleton className="h-4 w-10" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Skeleton loader for table
  const TableSkeleton = () => (
    <Card className="rounded-[5px] mb-6 overflow-hidden border-2 border-gray-300 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] transform transition-all duration-300">
      <CardHeader className="bg-gray-50 pb-2">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-200">
                {[...Array(5)].map((_, i) => (
                  <th key={i} className="px-6 py-3">
                    <Skeleton className="h-4 w-full" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-8 w-24" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-3">
        <Skeleton className="h-4 w-24" />
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-8" />
          ))}
        </div>
      </CardFooter>
    </Card>
  )

  if (loading && trackingData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-6 perspective-1000">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-28" />
          </div>

          {/* Skeleton Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>

          {/* Skeleton Tabs */}
          <div className="mb-6">
            <div className="flex gap-2 mb-4 bg-white p-1 rounded-[5px] border border-gray-200 shadow-lg">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-24" />
              ))}
            </div>

            {/* Skeleton Chart */}
            <ChartSkeleton />

            {/* Skeleton Distribution Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <DistributionCardSkeleton />
              <DistributionCardSkeleton />
            </div>

            {/* Skeleton Table */}
            <TableSkeleton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen  perspective-1000">
      <div className="max-w-6xl mx-auto px-2 md:px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="transform transition-transform duration-500 hover:translate-y-[-5px]">
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#00A651] to-[#0072BC] bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)]">
              User Tracking Dashboard
            </h1>
            <p className="text-sm md:text-base text-[#58595B]">Monitor and analyze user activity on your site</p>
            <div className="text-xs md:text-sm text-gray-500 mt-1 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span id="current-time">{format(new Date(), "PPP 'at' h:mm:ss a")}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0 transform transition-all duration-300 hover:scale-105">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by brand, country, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#00A651] w-full md:w-64 shadow-[0_5px_15px_-3px_rgba(0,0,0,0.1)] backdrop-blur-sm bg-white/90"
              />
            </div>

            <Button
              onClick={fetchTrackingData}
              disabled={refreshing}
              className="bg-[rgb(0,166,81)] hover:bg-[rgb(0,140,68)] rounded-[5px] shadow-[0_10px_20px_-5px_rgba(0,166,81,0.5)] hover:shadow-[0_15px_30px_-5px_rgba(0,166,81,0.6)] transform transition-all duration-300 hover:translate-y-[-3px] active:translate-y-[1px]"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>

            <Button
              variant="outline"
              className="rounded-[5px] border-[rgb(0,114,188)] text-[rgb(0,114,188)] hover:bg-[rgb(230,240,247)] shadow-[0_10px_20px_-5px_rgba(0,114,188,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(0,114,188,0.4)] transform transition-all duration-300 hover:translate-y-[-3px] active:translate-y-[1px]"
              onClick={exportData}
              disabled={trackingData.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Views"
            value={stats.total}
            icon={<Eye className="h-5 w-5 text-[rgb(0,114,188)]" />}
            color={colors.info}
            bgColor="bg-[rgb(225,190,231)]"
            h="h-[140px]"
          />

          <StatCard
            title="Pakistan Views"
            value={stats.pakistan}
            icon={<MapPin className="h-5 w-5 text-[rgb(0,166,81)]" />}
            color={colors.success}
            bgColor="bg-[rgb(243,229,245)]"
            percentage={stats.total > 0 ? Math.round((stats.pakistan / stats.total) * 100) : 0}
            h="h-[140px]"
          />

          <StatCard
            title="Unique Products"
            value={stats.uniqueProducts}
            icon={<Package className="h-5 w-5 text-[rgb(247,148,29)]" />}
            color={colors.warning}
            bgColor="bg-[rgb(209,196,233)]"
            h="h-[140px]"
          />

          <StatCard
            title="Unique Countries"
            value={stats.uniqueCountries}
            icon={<Globe className="h-5 w-5 text-[rgb(237,28,36)]" />}
            color={colors.error}
            bgColor="bg-[rgb(248,187,208)]"
            percentage={stats.total > 0 ? Math.round((stats.pakistan / stats.total) * 100) : 0}
            h="h-[140px]"
          />
        </div>

        {/* Tabs and Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="mb-4 bg-white p-1 rounded-[5px] border border-gray-200  flex-nowrap shadow-[0_10px_30px_-5px_rgba(0,0,0,0.2)] backdrop-blur-sm bg-white/90">
            <TabsTrigger
              value="all"
              className={`rounded-[5px] whitespace-nowrap transform transition-transform duration-200 hover:scale-105 ${
                activeTab === "all" ? "bg-[rgb(230,245,237)] text-[rgb(0,166,81)] shadow-md" : ""
              }`}
            >
              All Views ({stats.total})
            </TabsTrigger>
            <TabsTrigger
              value="pakistan"
              className={`rounded-[5px] whitespace-nowrap transform transition-transform duration-200 hover:scale-105 ${
                activeTab === "pakistan" ? "bg-[rgb(230,245,237)] text-[rgb(0,166,81)] shadow-md" : ""
              }`}
            >
              Pakistan ({stats.pakistan})
            </TabsTrigger>
            <TabsTrigger
              value="desktop"
              className={`rounded-[5px] whitespace-nowrap transform transition-transform duration-200 hover:scale-105 ${
                activeTab === "desktop" ? "bg-[rgb(230,245,237)] text-[rgb(0,166,81)] shadow-md" : ""
              }`}
            >
              Desktop ({stats.desktop})
            </TabsTrigger>
            <TabsTrigger
              value="mobile"
              className={`rounded-[5px] whitespace-nowrap transform transition-transform duration-200 hover:scale-105 ${
                activeTab === "mobile" ? "bg-[rgb(230,245,237)] text-[rgb(0,166,81)] shadow-md" : ""
              }`}
            >
              Mobile ({stats.mobile})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {error ? (
              <Card className="rounded-[5px] mb-6 bg-[rgb(249,230,231)] shadow-[0_15px_30px_-5px_rgba(198,40,40,0.3)] transform transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-4 text-[rgb(237,28,36)]">
                    <AlertCircle className="h-5 w-5" />
                    <p>{error}</p>
                  </div>
                  <Button
                    onClick={fetchTrackingData}
                    className="rounded-[5px] bg-[rgb(0,166,81)] shadow-md hover:shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[1px]"
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : filteredData.length === 0 ? (
              <Card className="rounded-[5px] mb-6 bg-[rgb(254,242,230)] shadow-[0_15px_30px_-5px_rgba(247,148,29,0.3)] transform transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <p className="text-[rgb(247,148,29)] mb-4">No tracking data found matching your criteria.</p>
                  <Button
                    onClick={() => setSearchTerm("")}
                    className="rounded-[5px] bg-[rgb(0,166,81)] shadow-md hover:shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[1px]"
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Vertical Bar Chart */}
                <Card className="rounded-[5px] mb-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] transform transition-all duration-500 hover:translate-y-[-5px] hover:shadow-[0_35px_70px_-15px_rgba(0,0,0,0.6)] border-[1px] border-[rgb(0,114,188)]">
                  <CardHeader className="bg-gradient-to-r from-[#f8f9fa] to-[#f1f3f5]">
                    <CardTitle className="text-[rgb(0,114,188)] drop-shadow-sm">Product Views Over Time</CardTitle>
                    <CardDescription>Shows views per product and location over time</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="w-full overflow-x-auto">
                      <div className="min-w-[600px]">
                        <ResponsiveContainer width="100%" height={350}>
                          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" />
                            <XAxis dataKey="date" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
                            <YAxis />
                            <Tooltip
                              contentStyle={{
                                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
                                borderRadius: "0.5rem",
                                border: "none",
                              }}
                              cursor={{ fill: "rgba(0,0,0,0.05)" }}
                            />
                            <Legend wrapperStyle={{ paddingTop: 20 }} />
                            {Object.keys(brandNames).map((productId, index) => (
                              <Bar
                                key={productId}
                                dataKey={productId}
                                name={brandNames[productId] || productId.substring(0, 8)}
                                fill={colorsArray[index % colorsArray.length]}
                                radius={[4, 4, 0, 0]}
                                animationDuration={1500}
                                animationEasing="ease-in-out"
                              />
                            ))}
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Distribution Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <DistributionCard
                    title="Browser Distribution"
                    data={browserDistribution}
                    icon={<Monitor className="h-5 w-5 text-[rgb(0,114,188)]" />}
                    color={colors.info}
                    bgColor="bg-[rgb(225,190,231)]"
                    h="h-[250px]"
                  />

                  <DistributionCard
                    title="Country Distribution"
                    data={countryDistribution}
                    icon={<Globe className="h-5 w-5 text-[rgb(0,166,81)]" />}
                    color={colors.success}
                    bgColor="bg-[rgb(243,229,245)]"
                    h="h-[250px]"
                  />
                </div>

                {/* Tracking Table */}
                <Card className="rounded-[5px] mb-6 overflow-hidden border-[1px] border-[rgb(0,166,81)] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] transform transition-all duration-500 hover:translate-y-[-5px] hover:shadow-[0_35px_70px_-15px_rgba(0,0,0,0.6)]">
                  <CardHeader className="bg-gradient-to-r from-[rgb(230,240,247)] to-[rgb(230,245,237)] pb-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <CardTitle className="text-[rgb(0,166,81)] drop-shadow-sm">Recent Views</CardTitle>
                        <CardDescription>
                          Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
                          {filteredData.length} views
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value))
                            setCurrentPage(1)
                          }}
                          className="border border-gray-300 rounded-[5px] px-2 py-1 text-sm shadow-md"
                        >
                          <option value={5}>5 per page</option>
                          <option value={10}>10 per page</option>
                          <option value={20}>20 per page</option>
                          <option value={50}>50 per page</option>
                        </select>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-[5px] shadow-md hover:shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[1px]"
                        >
                          <Filter className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-y border-gray-200">
                            <th
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSort("brand")}
                            >
                              <div className="flex items-center gap-1">
                                Brand
                                {sortField === "brand" && (
                                  <ArrowUpDown className={`h-3 w-3 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                                )}
                              </div>
                            </th>
                            <th
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSort("location")}
                            >
                              <div className="flex items-center gap-1">
                                Location
                                {sortField === "location" && (
                                  <ArrowUpDown className={`h-3 w-3 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                                )}
                              </div>
                            </th>
                            <th
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSort("device")}
                            >
                              <div className="flex items-center gap-1">
                                Device
                                {sortField === "device" && (
                                  <ArrowUpDown className={`h-3 w-3 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                                )}
                              </div>
                            </th>
                            <th
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSort("viewedAt")}
                            >
                              <div className="flex items-center gap-1">
                                Time
                                {sortField === "viewedAt" && (
                                  <ArrowUpDown className={`h-3 w-3 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                                )}
                              </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {paginatedData.map((view, index) => {
                            const country =
                              view.data?.location?.country_name || view.data?.location?.country || "Unknown"
                            const browser = view.data?.device?.browser || "Unknown"
                            const countryColor = getCountryColor(country)
                            const browserColor = getBrowserColor(browser)
                            // Alternate row background colors for better readability
                            const rowBgColor = index % 2 === 0 ? "bg-white" : "bg-[rgb(249,249,249)]"

                            // Get viewing history for this view
                            const viewHistory = viewingHistory[view.id] || []
                            const totalViewTime = viewHistory.reduce((total, record) => total + record.duration, 0)
                            const hasBeenViewed = viewHistory.length > 0

                            return (
                              <tr
                                key={view.id}
                                className={`hover:bg-[rgb(230,245,237)] ${rowBgColor} transform transition-transform duration-300 hover:translate-y-[-2px] hover:shadow-md`}
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex flex-col">
                                    <div className="font-medium text-gray-900">
                                      <span className="text-[rgb(0,114,188)]">
                                        {brandNames[view.productId] || view.productId.substring(0, 8)}
                                      </span>
                                    </div>
                                    <div className="text-xs text-gray-500 truncate max-w-[150px]">{view.productId}</div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3 text-gray-400" />
                                      <span className="font-medium">{view.data?.location?.city || "Unknown"}</span>
                                    </div>
                                    <div className="mt-1">
                                      <Badge
                                        variant="outline"
                                        className="text-xs shadow-[0_2px_5px_-1px_rgba(0,0,0,0.2)] transform transition-all duration-300 hover:scale-105"
                                        style={{
                                          backgroundColor: `${countryColor}20`, // 20% opacity
                                          color: countryColor,
                                          borderColor: `${countryColor}40`, // 40% opacity
                                        }}
                                      >
                                        {country}
                                      </Badge>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-1">
                                      <Monitor className="h-3 w-3 text-gray-400" />
                                      <span className="font-medium">{view.data?.device?.type || "Unknown"}</span>
                                    </div>
                                    <div className="mt-1">
                                      <Badge
                                        variant="outline"
                                        className="text-xs shadow-[0_2px_5px_-1px_rgba(0,0,0,0.2)] transform transition-all duration-300 hover:scale-105"
                                        style={{
                                          backgroundColor: `${browserColor}20`, // 20% opacity
                                          color: browserColor,
                                          borderColor: `${browserColor}40`, // 40% opacity
                                        }}
                                      >
                                        {browser}
                                      </Badge>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-1 font-medium">
                                      <Calendar className="h-3 w-3 text-gray-400" />
                                      <span>{format(new Date(view.viewedAt), "MMM d, yyyy")}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      {format(new Date(view.viewedAt), "h:mm:ss a")}
                                    </div>
                                    <div className="text-xs text-[rgb(0,166,81)] mt-1 flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      <span>
                                        {timeDisplays[view.id] ||
                                          formatDistance(new Date(view.viewedAt), new Date(), {
                                            addSuffix: true,
                                            includeSeconds: true,
                                          })}
                                      </span>
                                    </div>
                                    {hasBeenViewed && (
                                      <div className="text-xs text-[#00A651] mt-1 flex items-center">
                                        <History className="h-3 w-3 mr-1" />
                                        <span>
                                          Viewed {viewHistory.length} times ({formatDuration(totalViewTime)})
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-[5px] border-[rgb(0,166,81)] text-[rgb(0,166,81)] hover:bg-[rgb(230,245,237)] shadow-md hover:shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[1px]"
                                    onClick={() => handleOpenDetails(view)}
                                  >
                                    View Details
                                  </Button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 gap-2">
                    <div className="text-sm text-gray-500">
                      Page {currentPage} of {totalPages || 1}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-[5px] h-8 w-8 p-0 shadow-md hover:shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[1px]"
                        disabled={currentPage === 1 || totalPages === 0}
                        onClick={() => setCurrentPage(1)}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-[5px] h-8 w-8 p-0 shadow-md hover:shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[1px]"
                        disabled={currentPage === 1 || totalPages === 0}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      <div className="flex items-center gap-1">
                        {[...Array(Math.min(5, Math.max(1, totalPages)))].map((_, i) => {
                          // Show pages around current page
                          let pageNum
                          if (totalPages <= 5) {
                            pageNum = i + 1
                          } else if (currentPage <= 3) {
                            pageNum = i + 1
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i
                          } else {
                            pageNum = currentPage - 2 + i
                          }

                          if (pageNum > 0 && pageNum <= totalPages) {
                            return (
                              <Button
                                key={i}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                className={`rounded-[5px] h-8 w-8 p-0 shadow-md hover:shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[1px] ${
                                  currentPage === pageNum ? "bg-[rgb(0,166,81)] hover:bg-[rgb(0,140,68)]" : ""
                                }`}
                                onClick={() => setCurrentPage(pageNum)}
                              >
                                {pageNum}
                              </Button>
                            )
                          }
                          return null
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-[5px] h-8 w-8 p-0 shadow-md hover:shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[1px]"
                        disabled={currentPage === totalPages || totalPages === 0}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-[5px] h-8 w-8 p-0 shadow-md hover:shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[1px]"
                        disabled={currentPage === totalPages || totalPages === 0}
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* View Details Dialog */}
        <Dialog open={dialogOpen} onOpenChange={handleCloseDetails}>
          <DialogContent className="sm:max-w-[95%] max-h-[80vh] overflow-y-auto shadow-[0_30px_60px_-12px_rgba(0,0,0,0.6)] backdrop-blur-sm bg-white/95 border-[1px] border-[rgb(0,166,81)]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-[rgb(0,166,81)] to-[rgb(0,114,188)] bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
                View Details:{" "}
                {selectedView ? brandNames[selectedView.productId] || selectedView.productId.substring(0, 8) : ""}
              </DialogTitle>
              <DialogDescription>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>
                    {selectedView
                      ? formatDistance(new Date(selectedView.viewedAt), new Date(), {
                          addSuffix: true,
                          includeSeconds: true,
                        })
                      : ""}
                  </span>
                </div>
              </DialogDescription>
            </DialogHeader>

            {selectedView && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 transform transition-all duration-300 hover:translate-y-[-3px] hover:shadow-lg p-3 rounded-[5px]">
                    <div className="bg-[rgb(230,240,247)] p-2 rounded-full shadow-[0_5px_15px_-3px_rgba(0,114,188,0.3)]">
                      <Package className="h-5 w-5 text-[rgb(0,114,188)]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Product</p>
                      <p className="font-medium">
                        {brandNames[selectedView.productId] || selectedView.productId.substring(0, 8)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 transform transition-all duration-300 hover:translate-y-[-3px] hover:shadow-lg p-3 rounded-[5px]">
                    <div className="bg-[rgb(230,245,237)] p-2 rounded-full shadow-[0_5px_15px_-3px_rgba(0,166,81,0.3)]">
                      <MapPin className="h-5 w-5 text-[rgb(0,166,81)]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">
                        {selectedView.data?.location?.city || "Unknown"},{" "}
                        {selectedView.data?.location?.country_name || selectedView.data?.location?.country || "Unknown"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 transform transition-all duration-300 hover:translate-y-[-3px] hover:shadow-lg p-3 rounded-[5px]">
                    <div className="bg-[rgb(254,242,230)] p-2 rounded-full shadow-[0_5px_15px_-3px_rgba(247,148,29,0.3)]">
                      <Monitor className="h-5 w-5 text-[rgb(247,148,29)]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Device</p>
                      <p className="font-medium">
                        {selectedView.data?.device?.type || "Unknown"} /{" "}
                        {selectedView.data?.device?.browser || "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[rgb(230,245,237)] p-4 rounded-[5px] shadow-[0_15px_35px_-5px_rgba(0,166,81,0.3)] transform transition-all duration-300 hover:translate-y-[-3px] hover:shadow-[0_20px_40px_-5px_rgba(0,166,81,0.4)] border-[1px] border-[rgb(0,166,81)]/50">
                  <h3 className="font-medium mb-2">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-500">View ID</p>
                      <p className="font-medium">{selectedView.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Product ID</p>
                      <p className="font-medium">{selectedView.productId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">IP Address</p>
                      <p className="font-medium">
                        {selectedView.data?.ipAddress || selectedView.data?.location?.ip || "Unknown"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Browser</p>
                      <p className="font-medium">
                        {selectedView.data?.device?.browser || "Unknown"} {selectedView.data?.device?.version || ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Operating System</p>
                      <p className="font-medium">{selectedView.data?.device?.os || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Referrer</p>
                      <p className="font-medium truncate">{selectedView.data?.referrer || "Direct"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 bg-[rgb(230,240,247)] p-3 rounded-[5px] shadow-[0_15px_35px_-5px_rgba(0,114,188,0.3)] transform transition-all duration-300 hover:translate-y-[-3px] hover:shadow-[0_20px_40px_-5px_rgba(0,114,188,0.4)] border-[1px] border-[rgb(0,114,188)]/50">
                  <Clock className="h-4 w-4" />
                  <span>
                    Tracked on {format(new Date(selectedView.viewedAt), "PPP")} at{" "}
                    {format(new Date(selectedView.viewedAt), "h:mm:ss a")}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">
                    {formatDistance(new Date(selectedView.viewedAt), new Date(), {
                      addSuffix: true,
                      includeSeconds: true,
                    })}
                  </span>
                </div>

                {/* Viewing History */}
                {viewingHistory[selectedView.id] && viewingHistory[selectedView.id].length > 0 && (
                  <div className="bg-[rgb(240,230,247)] p-3 rounded-[5px] shadow-[0_15px_35px_-5px_rgba(123,31,162,0.3)] transform transition-all duration-300 hover:translate-y-[-3px] hover:shadow-[0_20px_40px_-5px_rgba(123,31,162,0.4)] border-[1px] border-[rgb(123,31,162)]/50">
                    <h3 className="font-medium mb-1 flex items-center">
                      <History className="h-4 w-4 mr-2" />
                      Viewing History
                    </h3>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {viewingHistory[selectedView.id].map((record, index) => (
                        <div
                          key={index}
                          className="text-sm border-b border-purple-100 pb-1 last:border-0 transform transition-all duration-300 hover:bg-purple-50 hover:shadow-sm p-1 rounded"
                        >
                          <div className="flex justify-between">
                            <span className="font-medium">Session #{index + 1}</span>
                            <span className="text-[rgb(138,43,226)]">
                              {record.duration > 0 ? formatDuration(record.duration) : "In progress"}
                            </span>
                          </div>
                          <div className="flex flex-col text-xs text-gray-600 mt-1">
                            <span>Started: {format(record.startTime, "PPP 'at' h:mm:ss a")}</span>
                            {record.endTime && (
                              <span>
                                Ended: {format(record.endTime, "PPP 'at' h:mm:ss a")}(
                                {formatDistance(record.startTime, record.endTime, { includeSeconds: true })})
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleCloseDetails}
                className="rounded-[5px] border-[rgb(0,166,81)] text-[rgb(0,166,81)] hover:bg-[rgb(230,245,237)] shadow-md hover:shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[1px]"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ title, value, icon, color, bgColor, percentage, h }) {
  return (
    <div className="transform perspective-1000 transition-all duration-500 hover:translate-y-[-10px] hover:rotate-y-5">
      <Card
        className={`rounded-[5px] border-[1px] overflow-hidden ${bgColor} shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)] ${h ? h : "h-[180px]"}`}
        style={{ borderColor: color }}
      >
        <CardContent className="p-4 md:p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">{title}</p>
              <p className="text-2xl md:text-3xl font-bold mb-1 drop-shadow-sm">{value}</p>
              {percentage !== undefined && (
                <div className="flex items-center">
                  <div className="w-full bg-white rounded-full h-1.5 mr-2 shadow-inner">
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${percentage}%`, backgroundColor: color }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 font-medium">{percentage}%</p>
                </div>
              )}
            </div>
            <div className="p-2 rounded-full bg-white shadow-[0_8px_20px_-5px_rgba(0,0,0,0.3)]">{icon}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Distribution Card Component
function DistributionCard({ title, data, icon, color, bgColor, h }) {
  // Convert data object to array and sort by count
  const sortedData = Object.entries(data)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5) // Top 5

  const total = Object.values(data).reduce((sum, count) => sum + count, 0)

  // Alromaih Cars theme colors for bars
  const barColors = [
    "#00A651", // Green
    "#0072BC", // Blue
    "#F7941D", // Orange
    "#ED1C24", // Red
    "#8A2BE2", // Purple
  ]

  return (
    <div className="transform perspective-1000 transition-all duration-500 hover:translate-y-[-10px] hover:rotate-y-5">
      <Card
        className={`rounded-[5px] border-[1px] overflow-hidden ${bgColor} shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)] ${h ? h : "h-[320px]"}`}
        style={{ borderColor: color }}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white rounded-full shadow-[0_8px_20px_-5px_rgba(0,0,0,0.3)]">{icon}</div>
            <CardTitle className="drop-shadow-sm">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedData.map((item, index) => {
              const barColor = barColors[index % barColors.length]
              const percentage = Math.round((item.count / total) * 100)

              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between transform transition-all duration-300 hover:translate-x-1"
                >
                  <div className="font-medium">{item.name}</div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-white rounded-full h-2 shadow-inner">
                      <div
                        className="h-2 rounded-full transform transition-all duration-1000"
                        style={{ width: `${percentage}%`, backgroundColor: barColor }}
                      ></div>
                    </div>
                    <div className="text-gray-700 font-medium w-10 text-right">{item.count}</div>
                    <div className="text-xs w-12 text-right font-medium" style={{ color: barColor }}>
                      {percentage}%
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
