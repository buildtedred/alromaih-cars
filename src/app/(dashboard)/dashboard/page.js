"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ThumbsUp,
  ShoppingCart,
  MoreVertical,
  Users,
  MousePointer,
  Package,
  ShoppingBag,
  ArrowUp,
  Car,
  RefreshCw,
  Filter,
} from "lucide-react"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

// Fix the chart module initialization issue
// Replace these lines:
// With these lines that properly define the components without trying to import them:
// Define fallback chart components directly
const ChartContainer = ({ children, config, className, ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
)

const ChartTooltipContent = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-[5px] border bg-white px-3 py-2 text-sm shadow-md">
      {label && <div className="mb-2 font-medium">{label}</div>}
      <div className="flex flex-col gap-1">
        {payload.map((item, i) => (
          <div key={`item-${i}`} className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="font-medium">{item.name}:</span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Use the existing Tooltip from recharts
const ChartTooltip = Tooltip

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

// Colors for the charts
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

// Updated API service functions to handle bilingual data
const fetchCars = async (language = "en") => {
  try {
    const response = await fetch("/api/supabasPrisma/cars")
    if (!response.ok) throw new Error("Failed to fetch cars")

    const data = await response.json()
    // Return the data for the selected language, or fallback to English
    return data[language] || data.en || []
  } catch (error) {
    console.error("Error fetching cars:", error)
    throw error
  }
}

const fetchCarBrands = async (language = "en") => {
  try {
    const response = await fetch("/api/supabasPrisma/carbrands")
    if (!response.ok) throw new Error("Failed to fetch car brands")

    const data = await response.json()
    // Return the data for the selected language, or fallback to English
    return data[language] || data.en || []
  } catch (error) {
    console.error("Error fetching car brands:", error)
    throw error
  }
}

const checkApiAvailability = async () => {
  try {
    const response = await fetch("/api/health-check", { method: "HEAD" })
    return response.ok
  } catch (error) {
    return false
  }
}

// Format time in a consistent way to avoid hydration errors
const formatTime = (date) => {
  if (typeof window === "undefined") {
    // On the server, return a placeholder
    return "Loading time..."
  }
  // Only run on the client
  return date.toLocaleTimeString()
}

// Update the colors to match the tracking dashboard
// Replace the existing colors with the purple theme colors from tracking-dashboard.jsx
// Add the same shadow styles and border radius

// 1. Update the MetricCardSkeleton to match the height and shadow style
const MetricCardSkeleton = () => (
  <Card className="bg-gray-900 text-white border-none overflow-hidden rounded-[5px] h-[140px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)]">
    <CardContent className="p-3 relative">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-8 rounded-full bg-gray-800" />
        <div>
          <Skeleton className="h-8 w-16 bg-gray-800 mb-1" />
          <Skeleton className="h-4 w-20 bg-gray-800" />
        </div>
        <Skeleton className="h-4 w-24 bg-gray-800" />
      </div>
    </CardContent>
  </Card>
)

// Update the renderBarChart function to use the new colors
const renderBarChart = (data, dataKey, color = colorsArray[0], height = "100%") => {
  if (ChartContainer !== Tooltip) {
    // If we have the shadcn/ui chart components
    return (
      <ChartContainer
        config={{
          [dataKey]: {
            label: "Value",
            color: color,
          },
        }}
        className="h-full"
      >
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="name"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "rgba(255,255,255,0.1)" }} />
            <Bar dataKey={dataKey} fill={color} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    )
  } else {
    // Fallback to regular recharts
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="name"
            tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          />
          <YAxis
            tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "white", borderRadius: "5px", border: "1px solid #e2e8f0" }}
            cursor={{ fill: "rgba(255,255,255,0.1)" }}
          />
          <Bar dataKey={dataKey} fill={color} radius={[5, 5, 0, 0]} name="Value" />
        </BarChart>
      </ResponsiveContainer>
    )
  }
}

// Update the renderLineChart function to use the new colors
const renderLineChart = (data, config, height = "100%") => {
  if (ChartContainer !== Tooltip) {
    // If we have the shadcn/ui chart components
    return (
      <ChartContainer config={config} className="h-full">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            {Object.entries(config).map(([key, { color }]) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    )
  } else {
    // Fallback to regular recharts
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip contentStyle={{ backgroundColor: "white", borderRadius: "5px", border: "1px solid #e2e8f0" }} />
          <Legend />
          {Object.entries(config).map(([key, { color, label }]) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              name={label}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    )
  }
}

// Update the renderVerticalBarChart function to use the new colors
const renderVerticalBarChart = (data, dataKey, color = colorsArray[0], height = "100%") => {
  if (ChartContainer !== Tooltip) {
    // If we have the shadcn/ui chart components
    return (
      <ChartContainer
        config={{
          [dataKey]: {
            label: "Cars",
            color: color,
          },
        }}
        className="h-full"
      >
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={80} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey={dataKey} fill={color} radius={[0, 5, 5, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    )
  } else {
    // Fallback to regular recharts
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={80} />
          <Tooltip contentStyle={{ backgroundColor: "white", borderRadius: "5px", border: "1px solid #e2e8f0" }} />
          <Bar dataKey={dataKey} fill={color} radius={[0, 5, 5, 0]} name="Cars" />
        </BarChart>
      </ResponsiveContainer>
    )
  }
}

const StatisticsSkeleton = () => (
  <Card className="border-gray-200 h-full rounded-[5px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] transform transition-all duration-500 hover:translate-y-[-5px] hover:shadow-[0_35px_70px_-15px_rgba(0,0,0,0.6)] border-[1px] border-[rgb(0,114,188)]">
    <CardContent className="p-4">
      <Skeleton className="h-7 w-40 mb-6 bg-gray-200" />
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-24 bg-gray-200" />
            <Skeleton className="h-5 w-10 bg-gray-200" />
          </div>
          <Skeleton className="h-1.5 w-full bg-gray-200 rounded-[5px]" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-24 bg-gray-200" />
            <Skeleton className="h-5 w-10 bg-gray-200" />
          </div>
          <Skeleton className="h-1.5 w-full bg-gray-200 rounded-[5px]" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-24 bg-gray-200" />
            <Skeleton className="h-5 w-10 bg-gray-200" />
          </div>
          <Skeleton className="h-1.5 w-full bg-gray-200 rounded-[5px]" />
        </div>
        <div className="pt-3 border-t">
          <Skeleton className="h-5 w-full bg-gray-200 mb-4" />
          <Skeleton className="h-8 w-28 bg-gray-200 rounded-[5px]" />
        </div>
      </div>
    </CardContent>
  </Card>
)

const TableRowSkeleton = () => (
  <tr className="border-b">
    <td className="py-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-[5px] bg-gray-200" />
        <Skeleton className="h-5 w-24 bg-gray-200" />
      </div>
    </td>
    <td className="py-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-full bg-gray-200" />
        <Skeleton className="h-5 w-20 bg-gray-200" />
      </div>
    </td>
    <td className="py-3">
      <Skeleton className="h-5 w-12 bg-gray-200" />
    </td>
    <td className="py-3">
      <Skeleton className="h-5 w-16 bg-gray-200" />
    </td>
    <td className="py-3">
      <Skeleton className="h-6 w-16 rounded-[5px] bg-gray-200" />
    </td>
  </tr>
)

const InventoryTableSkeleton = () => (
  <Card className="rounded-[5px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] transform transition-all duration-500 hover:translate-y-[-5px] hover:shadow-[0_35px_70px_-15px_rgba(0,0,0,0.6)] border-[1px] border-[rgb(0,114,188)]">
    <CardContent className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Skeleton className="h-7 w-32 mb-2 bg-gray-200" />
          <Skeleton className="h-5 w-40 bg-gray-200" />
        </div>
        <Skeleton className="h-9 w-24 rounded-[5px] bg-gray-200" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b">
              <th className="pb-2 font-normal">CAR MODEL</th>
              <th className="pb-2 font-normal">BRAND</th>
              <th className="pb-2 font-normal">YEAR</th>
              <th className="pb-2 font-normal">PRICE</th>
              <th className="pb-2 font-normal">CONDITION</th>
            </tr>
          </thead>
          <tbody>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <TableRowSkeleton key={index} />
              ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
)

const BrandOverviewSkeleton = () => (
  <Card className="rounded-[5px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] transform transition-all duration-500 hover:translate-y-[-5px] hover:shadow-[0_35px_70px_-15px_rgba(0,0,0,0.6)] border-[1px] border-[rgb(0,114,188)]">
    <CardContent className="p-4">
      <div className="mb-4">
        <Skeleton className="h-7 w-32 mb-2 bg-gray-200" />
        <Skeleton className="h-5 w-40 bg-gray-200" />
      </div>

      <div className="relative pl-6 border-l border-gray-200">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="mb-6 relative">
              <Skeleton className="absolute -left-[25px] h-6 w-6 rounded-[5px] bg-gray-200" />
              <div>
                <Skeleton className="h-5 w-24 mb-1 bg-gray-200" />
                <Skeleton className="h-4 w-16 bg-gray-200" />
              </div>
            </div>
          ))}
      </div>
    </CardContent>
  </Card>
)

const ChartSkeleton = () => (
  <div className="bg-gray-900 text-white p-4 rounded-[5px] h-36 mb-4 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] transform transition-all duration-500 hover:translate-y-[-5px] hover:shadow-[0_35px_70px_-15px_rgba(0,0,0,0.6)]">
    <div className="h-full w-full flex items-center justify-center">
      <Skeleton className="h-4/5 w-11/12 bg-gray-800" />
    </div>
  </div>
)

const SalesChartSkeleton = () => (
  <Card className="rounded-[5px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] transform transition-all duration-500 hover:translate-y-[-5px] hover:shadow-[0_35px_70px_-15px_rgba(0,0,0,0.6)] border-[1px] border-[rgb(0,114,188)]">
    <CardContent className="p-4">
      <div className="mb-4">
        <Skeleton className="h-7 w-32 mb-2 bg-gray-200" />
        <Skeleton className="h-5 w-40 bg-gray-200" />
      </div>
      <div className="h-56 w-full">
        <Skeleton className="h-full w-full bg-gray-200" />
      </div>
    </CardContent>
  </Card>
)

export default function Dashboard() {
  // Set language to English only
  const [language, setLanguage] = useState("en") // English only
  const [cars, setCars] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [apiAvailable, setApiAvailable] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [formattedTime, setFormattedTime] = useState("Loading time...")
  const [isAutoRefresh, setIsAutoRefresh] = useState(false)

  // Update the formatted time on the client side only
  useEffect(() => {
    setFormattedTime(lastUpdated.toLocaleTimeString())
  }, [lastUpdated])

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Check API availability first
      const isApiAvailable = await checkApiAvailability()
      setApiAvailable(isApiAvailable)

      // Fetch data with the selected language
      const [carsData, brandsData] = await Promise.all([fetchCars(language), fetchCarBrands(language)])

      setCars(carsData || [])
      setBrands(brandsData || [])
      setLastUpdated(new Date())
    } catch (err) {
      setError(err.message || "An error occurred while loading data")
      console.error("Error loading data:", err)
    } finally {
      setLoading(false)
    }
  }, [language]) // Add language as a dependency

  // Toggle auto-refresh
  const toggleAutoRefresh = useCallback(() => {
    if (isAutoRefresh) {
      // Turn off auto-refresh
      if (refreshInterval) {
        clearInterval(refreshInterval)
        setRefreshInterval(null)
      }
      setIsAutoRefresh(false)
    } else {
      // Turn on auto-refresh - refresh every 30 seconds
      const interval = setInterval(() => {
        loadData()
      }, 30000)
      setRefreshInterval(interval)
      setIsAutoRefresh(true)
    }
  }, [isAutoRefresh, refreshInterval, loadData])

  useEffect(() => {
    loadData()

    // Cleanup function
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval)
      }
    }
  }, [loadData, refreshInterval])

  // Calculate statistics based on real data
  const totalCars = cars.length
  const newCars = cars.filter((car) => car.condition === "New").length
  const usedCars = totalCars - newCars
  const averagePrice = totalCars > 0 ? Math.round(cars.reduce((sum, car) => sum + (car.price || 0), 0) / totalCars) : 0
  const averageYear = totalCars > 0 ? Math.round(cars.reduce((sum, car) => sum + (car.year || 0), 0) / totalCars) : 0

  // Prepare chart data
  const monthlyData = [
    { month: "Apr", sales: 65, inventory: 120 },
    { month: "May", sales: 59, inventory: 110 },
    { month: "Jun", sales: 80, inventory: 100 },
    { month: "Jul", sales: 81, inventory: 90 },
    { month: "Aug", sales: 56, inventory: 85 },
    { month: "Sep", sales: 55, inventory: 95 },
    { month: "Oct", sales: 40, inventory: 100 },
    { month: "Nov", sales: 90, inventory: 120 },
    { month: "Dec", sales: 110, inventory: 130 },
  ]

  // Prepare bar chart data for active users
  const activeUsersData = [
    { name: "Jan", value: 32 },
    { name: "Feb", value: 16 },
    { name: "Mar", value: 10 },
    { name: "Apr", value: 20 },
    { name: "May", value: 32 },
    { name: "Jun", value: 12 },
    { name: "Jul", value: 28 },
    { name: "Aug", value: 20 },
    { name: "Sep", value: 32 },
  ]

  // Prepare brand distribution data
  const brandDistribution = brands.map((brand) => {
    const count = cars.filter((car) => car.brandId === brand.id).length
    return {
      name: brand.name,
      count,
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="p-2">
        {/* Remove language selector and replace with heading */}
        <div className="mb-4">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#46194F] to-[#7B1FA2] bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)]">
            Car Dashboard
          </h1>
          <p className="text-sm md:text-base text-[#58595B]">View and manage your car inventory</p>
        </div>

        {/* Last updated and refresh button */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">Last updated: {formattedTime}</div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1 rounded-[5px] shadow-md hover:shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[1px]"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column - Metric Cards in 2x2 Grid */}
          <div className="lg:col-span-1">
            <div className="grid grid-cols-2 gap-4">
              {/* Card 1 - Users Active */}
              {loading ? (
                <MetricCardSkeleton />
              ) : (
                <Card className="bg-[#46194F] text-white border-none overflow-hidden rounded-[5px] h-[140px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)] transform perspective-1000 transition-all duration-500 hover:translate-y-[-10px] hover:rotate-y-5">
                  <CardContent className="p-3 relative">
                    <div className="absolute top-2 right-2">
                      <Button variant="ghost" size="icon" className="text-white h-6 w-6 p-0 rounded-[5px]">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
                        <Car className="h-4 w-4 text-[#46194F]" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{totalCars}</h2>
                        <p className="text-white/80 text-xs">Total Cars</p>
                      </div>
                      <div className="text-white text-xs font-medium">
                        {totalCars > 0 ? `${Math.round((newCars / totalCars) * 100)}% New` : "0% New"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Card 2 - Click Events */}
              {loading ? (
                <MetricCardSkeleton />
              ) : (
                <Card className="bg-gray-900 text-white border-none overflow-hidden rounded-[5px] h-[140px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)] transform perspective-1000 transition-all duration-500 hover:translate-y-[-10px] hover:rotate-y-5">
                  <CardContent className="p-3 relative">
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white h-6 w-6 p-0 rounded-[5px] shadow-md hover:shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[1px]"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
                        <ThumbsUp className="h-4 w-4 text-gray-900" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{brands.length}</h2>
                        <p className="text-white/80 text-xs">Car Brands</p>
                      </div>
                      <div className="text-white text-xs font-medium">+{brands.length} Available</div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Card 3 - Purchases */}
              {loading ? (
                <MetricCardSkeleton />
              ) : (
                <Card className="bg-gray-900 text-white border-none overflow-hidden rounded-[5px] h-[140px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)] transform perspective-1000 transition-all duration-500 hover:translate-y-[-10px] hover:rotate-y-5">
                  <CardContent className="p-3 relative">
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white h-6 w-6 p-0 rounded-[5px] shadow-md hover:shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[1px]"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
                        <ShoppingCart className="h-4 w-4 text-gray-900" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">${averagePrice}</h2>
                        <p className="text-white/80 text-xs">Average Price</p>
                      </div>
                      <div className="text-white text-xs font-medium">Based on {totalCars} cars</div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Card 4 - Likes */}
              {loading ? (
                <MetricCardSkeleton />
              ) : (
                <Card className="bg-gray-900 text-white border-none overflow-hidden rounded-[5px] h-[140px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)] transform perspective-1000 transition-all duration-500 hover:translate-y-[-10px] hover:rotate-y-5">
                  <CardContent className="p-3 relative">
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white h-6 w-6 p-0 rounded-[5px] shadow-md hover:shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[1px]"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
                        <ThumbsUp className="h-4 w-4 text-gray-900" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{averageYear || "N/A"}</h2>
                        <p className="text-white/80 text-xs">Average Year</p>
                      </div>
                      <div className="text-white text-xs font-medium">Model year average</div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Right Column - Reviews Section */}
          <div className="">
            {loading ? (
              <StatisticsSkeleton />
            ) : (
              <Card className="border-gray-200 h-full rounded-[5px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)] transform perspective-1000 transition-all duration-300 hover:translate-y-[-5px]">
                <CardContent className="p-4">
                  <h2 className="text-lg font-bold mb-4">Car Statistics</h2>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-sm">New Cars</h3>
                        <span className="text-gray-500 text-sm">
                          {totalCars > 0 ? Math.round((newCars / totalCars) * 100) : 0}%
                        </span>
                      </div>
                      {/* Custom progress bar with 5px border radius */}
                      <div className="relative h-1.5 w-full overflow-hidden rounded-[5px] bg-gray-100">
                        <div
                          className="absolute h-full bg-[#46194F] rounded-[5px]"
                          style={{ width: `${totalCars > 0 ? (newCars / totalCars) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-sm">Used Cars</h3>
                        <span className="text-gray-500 text-sm">
                          {totalCars > 0 ? Math.round((usedCars / totalCars) * 100) : 0}%
                        </span>
                      </div>
                      {/* Custom progress bar with 5px border radius */}
                      <div className="relative h-1.5 w-full overflow-hidden rounded-[5px] bg-gray-100">
                        <div
                          className="absolute h-full bg-[#46194F] rounded-[5px]"
                          style={{ width: `${totalCars > 0 ? (usedCars / totalCars) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-sm">Automatic Transmission</h3>
                        <span className="text-gray-500 text-sm">
                          {totalCars > 0
                            ? Math.round(
                                (cars.filter(
                                  (car) => car.transmission === "Automatic" || car.transmission === "Dual-Clutch",
                                ).length /
                                  totalCars) *
                                  100,
                              )
                            : 0}
                          %
                        </span>
                      </div>
                      {/* Custom progress bar with 5px border radius */}
                      <div className="relative h-1.5 w-full overflow-hidden rounded-[5px] bg-gray-100">
                        <div
                          className="absolute h-full bg-[#46194F] rounded-[5px]"
                          style={{
                            width: `${
                              totalCars > 0
                                ? (
                                    cars.filter(
                                      (car) => car.transmission === "Automatic" || car.transmission === "Dual-Clutch",
                                    ).length / totalCars
                                  ) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-gray-600 text-sm mb-4">
                        More than <span className="font-medium">{totalCars}</span> cars in our inventory and over{" "}
                        <span className="font-medium">{brands.length}</span> brands available.
                      </p>

                      <Button
                        size="sm"
                        className="bg-[#46194F] hover:bg-[#46194F]/90 text-white text-xs rounded-[5px] shadow-md hover:shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[1px]"
                      >
                        View all cars
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Projects and Orders Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          {/* Projects Panel */}
          <div className="lg:col-span-2">
            {loading ? (
              <InventoryTableSkeleton />
            ) : (
              <Card className="rounded-[5px] mb-6 overflow-hidden border-[1px] border-[rgb(0,166,81)] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] transform transition-all duration-500 hover:translate-y-[-5px] hover:shadow-[0_35px_70px_-15px_rgba(0,0,0,0.6)]">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-lg font-bold">Car Inventory</h2>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <div className="text-[#46194F]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-check"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <span className="font-medium text-[#46194F]">{totalCars} cars</span> in inventory
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 rounded-[5px] shadow-md hover:shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[1px]"
                    >
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs text-gray-500 border-b">
                          <th className="pb-2 font-normal">CAR MODEL</th>
                          <th className="pb-2 font-normal">BRAND</th>
                          <th className="pb-2 font-normal">YEAR</th>
                          <th className="pb-2 font-normal">PRICE</th>
                          <th className="pb-2 font-normal">CONDITION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cars.length > 0 ? (
                          cars.slice(0, 6).map((car) => (
                            <tr key={car.id} className="border-b">
                              <td className="py-3">
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 bg-gray-100 rounded-[5px] overflow-hidden">
                                    {car.images && car.images.length > 0 ? (
                                      <img
                                        src={car.images[0] || "/placeholder.svg?height=100&width=100"}
                                        alt={car.model}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                          e.target.onerror = null
                                          e.target.src = "/placeholder.svg?height=100&width=100"
                                        }}
                                      />
                                    ) : (
                                      <div className="h-full w-full flex items-center justify-center bg-gray-200">
                                        <Car className="h-4 w-4 text-gray-400" />
                                      </div>
                                    )}
                                  </div>
                                  <span className="font-medium">{car.model}</span>
                                </div>
                              </td>
                              <td className="py-3">
                                <div className="flex items-center gap-2">
                                  {car.brand?.image ? (
                                    <img
                                      src={car.brand.image || "/placeholder.svg?height=100&width=100"}
                                      alt={car.brand?.name}
                                      className="h-6 w-6 object-contain"
                                      onError={(e) => {
                                        e.target.onerror = null
                                        e.target.src = "/placeholder.svg?height=100&width=100"
                                      }}
                                    />
                                  ) : null}
                                  <span>{car.brand?.name || "Unknown"}</span>
                                </div>
                              </td>
                              <td className="py-3 text-sm">{car.year}</td>
                              <td className="py-3 text-sm">${car.price}</td>
                              <td className="py-3">
                                <Badge
                                  className={`rounded-[5px] ${
                                    car.condition === "New"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {car.condition}
                                </Badge>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="py-4 text-center text-gray-500">
                              No cars found in inventory
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Orders Overview Panel */}
          <div className="lg:col-span-1">
            {loading ? (
              <BrandOverviewSkeleton />
            ) : (
              <Card className="rounded-[5px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)] transform perspective-1000 transition-all duration-300 hover:translate-y-[-5px]">
                <CardContent className="p-4">
                  <div className="mb-4">
                    <h2 className="text-lg font-bold">Brand overview</h2>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <div className="text-green-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-arrow-up"
                        >
                          <path d="m5 12 7-7 7 7" />
                          <path d="M12 19V5" />
                        </svg>
                      </div>
                      <span className="font-medium text-green-500">{brands.length}</span> brands available
                    </div>
                  </div>

                  <div className="relative pl-6 border-l border-gray-200">
                    {/* Brand items */}
                    {brands.slice(0, 6).map((brand, index) => (
                      <div key={brand.id} className="mb-6 relative">
                        <div
                          className={`absolute -left-[25px] p-1 rounded-[5px] ${
                            index % 5 === 0
                              ? "bg-green-100 text-green-500"
                              : index % 5 === 1
                                ? "bg-red-100 text-red-500"
                                : index % 5 === 2
                                  ? "bg-blue-100 text-blue-500"
                                  : index % 5 === 3
                                    ? "bg-orange-100 text-orange-500"
                                    : "bg-yellow-100 text-yellow-500"
                          }`}
                        >
                          {brand.image ? (
                            <img
                              src={brand.image || "/placeholder.svg?height=100&width=100"}
                              alt={brand.name}
                              className="h-4 w-4 rounded-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = "/placeholder.svg?height=100&width=100"
                              }}
                            />
                          ) : (
                            <Car className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{brand.name}</p>
                          <p className="text-xs text-gray-500">
                            {cars.filter((car) => car.brandId === brand.id).length} cars
                          </p>
                        </div>
                      </div>
                    ))}

                    {brands.length === 0 && <div className="text-center py-4 text-gray-500">No brands available</div>}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Active Users and Sales Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          {/* Active Users Panel */}
          <div className="lg:col-span-1">
            <Card className="rounded-[5px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)] transform perspective-1000 transition-all duration-300 hover:translate-y-[-5px]">
              <CardContent className="p-4">
                <div className="mb-4">
                  {/* Bar Chart using recharts directly if shadcn/ui chart is not available */}
                  {loading ? (
                    <ChartSkeleton />
                  ) : (
                    <div className="bg-gray-900 text-white p-4 rounded-[5px] h-36 mb-4 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] transform transition-all duration-500 hover:translate-y-[-5px]">
                      {renderBarChart(activeUsersData, "value", "white")}
                    </div>
                  )}

                  <h2 className="text-lg font-bold">Active Users</h2>
                  <p className="text-sm text-gray-500">
                    <span className="text-green-500 font-medium">(+23%)</span> than last week
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-[#46194F] rounded-[5px] flex items-center justify-center text-white">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Users</p>
                      </div>
                    </div>
                    {loading ? <Skeleton className="h-7 w-16 bg-gray-200" /> : <p className="text-xl font-bold">36K</p>}
                    {/* Custom progress bar with 5px border radius */}
                    <div className="relative h-1 w-full overflow-hidden rounded-[5px] bg-gray-200">
                      <div className="absolute h-full bg-[#46194F] rounded-[5px]" style={{ width: "60%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-blue-500 rounded-[5px] flex items-center justify-center text-white">
                        <MousePointer className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Clicks</p>
                      </div>
                    </div>
                    {loading ? <Skeleton className="h-7 w-16 bg-gray-200" /> : <p className="text-xl font-bold">2m</p>}
                    {/* Custom progress bar with 5px border radius */}
                    <div className="relative h-1 w-full overflow-hidden rounded-[5px] bg-gray-200">
                      <div className="absolute h-full bg-blue-500 rounded-[5px]" style={{ width: "80%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-[#46194F] rounded-[5px] flex items-center justify-center text-white">
                        <ShoppingBag className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Sales</p>
                      </div>
                    </div>
                    {loading ? (
                      <Skeleton className="h-7 w-16 bg-gray-200" />
                    ) : (
                      <p className="text-xl font-bold">435$</p>
                    )}
                    {/* Custom progress bar with 5px border radius */}
                    <div className="relative h-1 w-full overflow-hidden rounded-[5px] bg-gray-200">
                      <div className="absolute h-full bg-[#46194F] rounded-[5px]" style={{ width: "30%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-pink-500 rounded-[5px] flex items-center justify-center text-white">
                        <Package className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Items</p>
                      </div>
                    </div>
                    {loading ? <Skeleton className="h-7 w-16 bg-gray-200" /> : <p className="text-xl font-bold">43</p>}
                    {/* Custom progress bar with 5px border radius */}
                    <div className="relative h-1 w-full overflow-hidden rounded-[5px] bg-gray-200">
                      <div className="absolute h-full bg-pink-500 rounded-[5px]" style={{ width: "50%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales Overview Panel */}
          <div className="lg:col-span-2">
            {loading ? (
              <SalesChartSkeleton />
            ) : (
              <Card className="rounded-[5px] mb-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] transform transition-all duration-500 hover:translate-y-[-5px] hover:shadow-[0_35px_70px_-15px_rgba(0,0,0,0.6)] border-[1px] border-[rgb(0,114,188)]">
                <CardContent className="p-4">
                  <div className="mb-4">
                    <h2 className="text-lg font-bold">Sales overview</h2>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <div className="text-green-500">
                        <ArrowUp className="h-4 w-4 inline" />
                      </div>
                      <span className="font-medium text-green-500">4% more</span> in 2023
                    </div>
                  </div>

                  {/* Line Chart using recharts directly if shadcn/ui chart is not available */}
                  <div className="h-56">
                    {renderLineChart(monthlyData, {
                      sales: {
                        label: "Sales",
                        color: colorsArray[0],
                      },
                      inventory: {
                        label: "Inventory",
                        color: colorsArray[1],
                      },
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Brand Distribution Chart */}
        <div className="mt-4">
          {loading ? (
            <SalesChartSkeleton />
          ) : (
            <Card className="rounded-[5px] mb-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] transform transition-all duration-500 hover:translate-y-[-5px] hover:shadow-[0_35px_70px_-15px_rgba(0,0,0,0.6)] border-[1px] border-[rgb(0,114,188)]">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-lg font-bold">Brand Distribution</h2>
                    <p className="text-sm text-gray-500">Cars by brand</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-[5px] shadow-md hover:shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[1px]"
                  >
                    View All
                  </Button>
                </div>

                <div className="h-56">{renderVerticalBarChart(brandDistribution, "count", colorsArray[0])}</div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
