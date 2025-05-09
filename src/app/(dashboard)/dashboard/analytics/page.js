"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  Car,
  TrendingUp,
  Users,
  DollarSign,
  Globe,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChartIcon,
  LineChartIcon,
  Download,
} from "lucide-react"
import AnalyticsPage2 from "./Usertracker"

// API service for fetching analytics data
const fetchAnalyticsData = async (language = "en", dateRange = null, filters = {}) => {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams()

    if (dateRange?.from) {
      queryParams.append("startDate", dateRange.from.toISOString())
    }

    if (dateRange?.to) {
      queryParams.append("endDate", dateRange.to.toISOString())
    }

    // Add any additional filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value)
    })

    // In a real implementation, you would have an analytics endpoint
    // For now, we'll use the cars and brands endpoints and transform the data
    const [carsResponse, brandsResponse] = await Promise.all([
      fetch(`/api/supabasPrisma/cars?${queryParams}`),
      fetch(`/api/supabasPrisma/carbrands?${queryParams}`),
    ])

    if (!carsResponse.ok || !brandsResponse.ok) {
      throw new Error("Failed to fetch analytics data")
    }

    const carsData = await carsResponse.json()
    const brandsData = await brandsResponse.json()

    // Get data for the selected language
    const cars = carsData[language] || carsData.en || []
    const brands = brandsData[language] || brandsData.en || []

    // Process the data to create analytics metrics
    return processAnalyticsData(cars, brands, filters)
  } catch (error) {
    console.error("Error fetching analytics data:", error)
    throw error
  }
}

// Process raw data into analytics metrics and charts data
const processAnalyticsData = (cars, brands, filters) => {
  // Calculate key metrics
  const totalCars = cars.length
  const totalBrands = brands.length
  const newCars = cars.filter((car) => car.condition === "New").length
  const usedCars = totalCars - newCars
  const totalValue = cars.reduce((sum, car) => sum + (car.price || 0), 0)
  const averagePrice = totalCars > 0 ? Math.round(totalValue / totalCars) : 0

  // Get current date for comparison
  const now = new Date()
  const lastMonth = new Date(now)
  lastMonth.setMonth(now.getMonth() - 1)

  // Filter cars added in the last month for trend calculation
  const carsLastMonth = cars.filter((car) => {
    const carDate = new Date(car.createdAt)
    return carDate >= lastMonth && carDate <= now
  })

  // Calculate trends (percentage change)
  const lastMonthCount = carsLastMonth.length
  const monthlyGrowthRate = totalCars > 0 ? Math.round((lastMonthCount / totalCars) * 100) : 0

  // Group cars by brand for distribution chart
  const brandDistribution = brands
    .map((brand) => {
      const count = cars.filter((car) => car.brandId === brand.id).length
      return {
        name: brand.name,
        value: count,
        id: brand.id,
      }
    })
    .sort((a, b) => b.value - a.value) // Sort by count descending

  // Group cars by condition for pie chart
  const conditionDistribution = [
    { name: "New", value: newCars },
    { name: "Used", value: usedCars },
  ]

  // Group cars by month for trend chart
  const monthlyData = groupCarsByMonth(cars)

  // Group cars by price range
  const priceRanges = groupCarsByPriceRange(cars)

  // Group cars by year
  const yearDistribution = groupCarsByYear(cars)

  // Calculate popular features
  const popularFeatures = calculatePopularFeatures(cars)

  // Calculate transmission types
  const transmissionTypes = calculateTransmissionTypes(cars)

  return {
    metrics: {
      totalCars,
      totalBrands,
      newCars,
      usedCars,
      totalValue,
      averagePrice,
      monthlyGrowthRate,
    },
    charts: {
      brandDistribution,
      conditionDistribution,
      monthlyData,
      priceRanges,
      yearDistribution,
      popularFeatures,
      transmissionTypes,
    },
  }
}

// Helper function to group cars by month
const groupCarsByMonth = (cars) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const currentYear = new Date().getFullYear()

  // Initialize data with all months
  const monthlyData = months.map((month) => ({
    month,
    new: 0,
    used: 0,
    total: 0,
  }))

  // Group cars by month
  cars.forEach((car) => {
    const createdAt = new Date(car.createdAt)
    // Only include cars from current year
    if (createdAt.getFullYear() === currentYear) {
      const monthIndex = createdAt.getMonth()
      monthlyData[monthIndex].total += 1

      if (car.condition === "New") {
        monthlyData[monthIndex].new += 1
      } else {
        monthlyData[monthIndex].used += 1
      }
    }
  })

  return monthlyData
}

// Helper function to group cars by price range
const groupCarsByPriceRange = (cars) => {
  const ranges = [
    { range: "0-10K", min: 0, max: 10000 },
    { range: "10K-20K", min: 10000, max: 20000 },
    { range: "20K-30K", min: 20000, max: 30000 },
    { range: "30K-50K", min: 30000, max: 50000 },
    { range: "50K-100K", min: 50000, max: 100000 },
    { range: "100K+", min: 100000, max: Number.POSITIVE_INFINITY },
  ]

  const priceRanges = ranges.map(({ range, min, max }) => {
    const count = cars.filter((car) => car.price >= min && car.price < max).length
    return { name: range, value: count }
  })

  return priceRanges
}

// Helper function to group cars by year
const groupCarsByYear = (cars) => {
  const yearCounts = {}

  cars.forEach((car) => {
    if (car.year) {
      yearCounts[car.year] = (yearCounts[car.year] || 0) + 1
    }
  })

  // Convert to array and sort by year
  return Object.entries(yearCounts)
    .map(([year, count]) => ({ year: Number.parseInt(year), count }))
    .sort((a, b) => a.year - b.year)
}

// Helper function to calculate popular features
const calculatePopularFeatures = (cars) => {
  const features = [
    { name: "GPS", property: "gps" },
    { name: "Sunroof", property: "sunroof" },
    { name: "Parking Sensors", property: "parkingSensors" },
    { name: "Cruise Control", property: "cruiseControl" },
    { name: "Leather Seats", property: "leatherSeats" },
    { name: "Heated Seats", property: "heatedSeats" },
    { name: "Bluetooth", property: "bluetooth" },
    { name: "Climate Control", property: "climateControl" },
    { name: "Keyless Entry", property: "keylessEntry" },
    { name: "Rear Camera", property: "rearCamera" },
  ]

  return features
    .map((feature) => {
      const count = cars.filter((car) => car[feature.property] === true).length
      const percentage = cars.length > 0 ? Math.round((count / cars.length) * 100) : 0
      return {
        name: feature.name,
        count,
        percentage,
      }
    })
    .sort((a, b) => b.count - a.count)
}

// Helper function to calculate transmission types
const calculateTransmissionTypes = (cars) => {
  const transmissionCounts = {}

  cars.forEach((car) => {
    if (car.transmission) {
      transmissionCounts[car.transmission] = (transmissionCounts[car.transmission] || 0) + 1
    }
  })

  // Convert to array format for charts
  return Object.entries(transmissionCounts).map(([type, count]) => ({
    name: type,
    value: count,
  }))
}

// Colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"]
const CONDITION_COLORS = {
  New: "#4CAF50",
  Used: "#2196F3",
}

export default function AnalyticsPage() {
  const [language, setLanguage] = useState("en")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [analyticsData, setAnalyticsData] = useState(null)
  const [dateRange, setDateRange] = useState(null)
  const [filters, setFilters] = useState({
    brandId: "",
    condition: "",
    priceRange: "",
  })
  const [activeTab, setActiveTab] = useState("overview")
  const [chartType, setChartType] = useState("bar")
  const [lastUpdated, setLastUpdated] = useState(null)
  const [mounted, setMounted] = useState(false)

  // Set mounted state to true after component mounts
  useEffect(() => {
    setMounted(true)
    setLastUpdated(new Date())
  }, [])

  // Load analytics data
  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchAnalyticsData(language, dateRange, filters)
      setAnalyticsData(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err.message || "An error occurred while loading analytics data")
      console.error("Error loading analytics data:", err)
    } finally {
      setLoading(false)
    }
  }, [language, dateRange, filters])

  // Load data on initial render and when dependencies change
  useEffect(() => {
    if (mounted) {
      loadData()
    }
  }, [loadData, mounted])

  // Handle language change
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage)
  }

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      brandId: "",
      condition: "",
      priceRange: "",
    })
    setDateRange(null)
  }

  // Memoized metrics to avoid recalculation
  const metrics = useMemo(() => {
    if (!analyticsData) return null
    return analyticsData.metrics
  }, [analyticsData])

  // Memoized charts data to avoid recalculation
  const charts = useMemo(() => {
    if (!analyticsData) return null
    return analyticsData.charts
  }, [analyticsData])

  // Render loading skeletons
  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <Card key={i} className="rounded-[5px]">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <Skeleton className="h-4 w-24 mb-2 bg-gray-200" />
                  <Skeleton className="h-8 w-16 mb-1 bg-gray-200" />
                  <Skeleton className="h-4 w-32 bg-gray-200" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  )

  // Render metric cards
  const renderMetricCards = () => {
    if (!metrics) return null

    const { totalCars, totalBrands, newCars, usedCars, totalValue, averagePrice, monthlyGrowthRate } = metrics

    const metricCards = [
      {
        title: language === "en" ? "Total Cars" : "إجمالي السيارات",
        value: totalCars,
        trend: monthlyGrowthRate,
        icon: <Car className="h-6 w-6 text-blue-500" />,
        color: "blue",
      },
      {
        title: language === "en" ? "Total Brands" : "إجمالي العلامات التجارية",
        value: totalBrands,
        trend: null,
        icon: <Users className="h-6 w-6 text-purple-500" />,
        color: "purple",
      },
      {
        title: language === "en" ? "Average Price" : "متوسط السعر",
        value: `$${averagePrice.toLocaleString()}`,
        trend: null,
        icon: <DollarSign className="h-6 w-6 text-green-500" />,
        color: "green",
      },
      {
        title: language === "en" ? "Total Inventory Value" : "إجمالي قيمة المخزون",
        value: `$${totalValue.toLocaleString()}`,
        trend: null,
        icon: <TrendingUp className="h-6 w-6 text-orange-500" />,
        color: "orange",
      },
    ]

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metricCards.map((card, index) => (
          <Card key={index} className="rounded-[5px]">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                  <h3 className="text-2xl font-bold mb-1">{card.value}</h3>
                  {card.trend !== null && (
                    <div className="flex items-center">
                      {card.trend >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={card.trend >= 0 ? "text-green-500 text-sm" : "text-red-500 text-sm"}>
                        {Math.abs(card.trend)}% {language === "en" ? "from last month" : "من الشهر الماضي"}
                      </span>
                    </div>
                  )}
                </div>
                <div className={`p-2 rounded-full bg-${card.color}-100`}>{card.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Render brand distribution chart
  const renderBrandDistribution = () => {
    if (!charts || !charts.brandDistribution) return null

    const { brandDistribution } = charts
    const topBrands = brandDistribution.slice(0, 10) // Show top 10 brands

    return (
      <Card className="rounded-[5px]">
        <CardHeader>
          <CardTitle>{language === "en" ? "Brand Distribution" : "توزيع العلامات التجارية"}</CardTitle>
          <CardDescription>
            {language === "en" ? "Number of cars by brand" : "عدد السيارات حسب العلامة التجارية"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "bar" ? (
                <BarChart data={topBrands} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name={language === "en" ? "Cars" : "السيارات"} fill="#8884d8" />
                </BarChart>
              ) : chartType === "pie" ? (
                <PieChart>
                  <Pie
                    data={topBrands}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {topBrands.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              ) : (
                <AreaChart data={topBrands}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="value"
                    name={language === "en" ? "Cars" : "السيارات"}
                    fill="#8884d8"
                    stroke="#8884d8"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <Button
              variant={chartType === "bar" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("bar")}
              className="rounded-[5px]"
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              {language === "en" ? "Bar" : "شريط"}
            </Button>
            <Button
              variant={chartType === "pie" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("pie")}
              className="rounded-[5px]"
            >
              <PieChartIcon className="h-4 w-4 mr-1" />
              {language === "en" ? "Pie" : "دائري"}
            </Button>
            <Button
              variant={chartType === "area" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("area")}
              className="rounded-[5px]"
            >
              <LineChartIcon className="h-4 w-4 mr-1" />
              {language === "en" ? "Area" : "مساحة"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render monthly trend chart
  const renderMonthlyTrend = () => {
    if (!charts || !charts.monthlyData) return null

    const { monthlyData } = charts

    return (
      <Card className="rounded-[5px]">
        <CardHeader>
          <CardTitle>{language === "en" ? "Monthly Trends" : "الاتجاهات الشهرية"}</CardTitle>
          <CardDescription>
            {language === "en" ? "Car inventory changes over time" : "تغييرات مخزون السيارات بمرور الوقت"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="new"
                  name={language === "en" ? "New Cars" : "سيارات جديدة"}
                  stroke={CONDITION_COLORS.New}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="used"
                  name={language === "en" ? "Used Cars" : "سيارات مستعملة"}
                  stroke={CONDITION_COLORS.Used}
                />
                <Line type="monotone" dataKey="total" name={language === "en" ? "Total" : "المجموع"} stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render condition distribution chart
  const renderConditionDistribution = () => {
    if (!charts || !charts.conditionDistribution) return null

    const { conditionDistribution } = charts

    return (
      <Card className="rounded-[5px]">
        <CardHeader>
          <CardTitle>{language === "en" ? "Car Condition" : "حالة السيارة"}</CardTitle>
          <CardDescription>
            {language === "en" ? "Distribution of new vs used cars" : "توزيع السيارات الجديدة مقابل المستعملة"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={conditionDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {conditionDistribution.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={CONDITION_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render price range distribution chart
  const renderPriceDistribution = () => {
    if (!charts || !charts.priceRanges) return null

    const { priceRanges } = charts

    return (
      <Card className="rounded-[5px]">
        <CardHeader>
          <CardTitle>{language === "en" ? "Price Distribution" : "توزيع الأسعار"}</CardTitle>
          <CardDescription>
            {language === "en" ? "Number of cars by price range" : "عدد السيارات حسب نطاق السعر"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priceRanges}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name={language === "en" ? "Cars" : "السيارات"} fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render year distribution chart
  const renderYearDistribution = () => {
    if (!charts || !charts.yearDistribution) return null

    const { yearDistribution } = charts

    return (
      <Card className="rounded-[5px]">
        <CardHeader>
          <CardTitle>{language === "en" ? "Model Year Distribution" : "توزيع سنة الموديل"}</CardTitle>
          <CardDescription>
            {language === "en" ? "Number of cars by model year" : "عدد السيارات حسب سنة الموديل"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name={language === "en" ? "Cars" : "السيارات"}
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render popular features chart
  const renderPopularFeatures = () => {
    if (!charts || !charts.popularFeatures) return null

    const { popularFeatures } = charts

    return (
      <Card className="rounded-[5px]">
        <CardHeader>
          <CardTitle>{language === "en" ? "Popular Features" : "الميزات الشائعة"}</CardTitle>
          <CardDescription>
            {language === "en" ? "Most common car features" : "ميزات السيارة الأكثر شيوعًا"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularFeatures} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name={language === "en" ? "Cars" : "السيارات"} fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render transmission types chart
  const renderTransmissionTypes = () => {
    if (!charts || !charts.transmissionTypes) return null

    const { transmissionTypes } = charts

    return (
      <Card className="rounded-[5px]">
        <CardHeader>
          <CardTitle>{language === "en" ? "Transmission Types" : "أنواع ناقل الحركة"}</CardTitle>
          <CardDescription>
            {language === "en" ? "Distribution of transmission types" : "توزيع أنواع ناقل الحركة"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={transmissionTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {transmissionTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    )
  }

  // If not mounted yet, show a simple loading state
  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 p-4 md:p-6">Loading...</div>
  }

  // Render the main content
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <AnalyticsPage2/>
      {/* Header with controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">{language === "en" ? "Analytics Dashboard" : "لوحة التحليلات"}</h1>
          <p className="text-gray-500 text-sm">
            {language === "en"
              ? `Last updated: ${lastUpdated ? lastUpdated.toLocaleString() : "Loading..."}`
              : `آخر تحديث: ${lastUpdated ? lastUpdated.toLocaleString() : "جاري التحميل..."}`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          {/* Language selector */}
          <Tabs value={language} onValueChange={handleLanguageChange} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="en" className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                English
              </TabsTrigger>
              <TabsTrigger value="ar" className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                العربية
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Date range picker */}
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            placeholder={language === "en" ? "Select date range" : "حدد النطاق الزمني"}
            locale={language}
            className="w-[250px]"
          />

          {/* Refresh button */}
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="rounded-[5px]">
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            {language === "en" ? "Refresh" : "تحديث"}
          </Button>

          {/* Export button */}
          <Button variant="outline" size="sm" className="rounded-[5px]">
            <Download className="h-4 w-4 mr-1" />
            {language === "en" ? "Export" : "تصدير"}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6 rounded-[5px]">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === "en" ? "Brand" : "العلامة التجارية"}
              </label>
              <Select value={filters.brandId} onValueChange={(value) => handleFilterChange("brandId", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={language === "en" ? "All Brands" : "جميع العلامات التجارية"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === "en" ? "All Brands" : "جميع العلامات التجارية"}</SelectItem>
                  {charts?.brandDistribution?.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === "en" ? "Condition" : "الحالة"}
              </label>
              <Select value={filters.condition} onValueChange={(value) => handleFilterChange("condition", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={language === "en" ? "All Conditions" : "جميع الحالات"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === "en" ? "All Conditions" : "جميع الحالات"}</SelectItem>
                  <SelectItem value="New">{language === "en" ? "New" : "جديد"}</SelectItem>
                  <SelectItem value="Used">{language === "en" ? "Used" : "مستعمل"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === "en" ? "Price Range" : "نطاق السعر"}
              </label>
              <Select value={filters.priceRange} onValueChange={(value) => handleFilterChange("priceRange", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={language === "en" ? "All Prices" : "جميع الأسعار"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === "en" ? "All Prices" : "جميع الأسعار"}</SelectItem>
                  <SelectItem value="0-10000">{language === "en" ? "Under $10,000" : "أقل من 10,000 دولار"}</SelectItem>
                  <SelectItem value="10000-30000">
                    {language === "en" ? "$10,000 - $30,000" : "10,000 - 30,000 دولار"}
                  </SelectItem>
                  <SelectItem value="30000-50000">
                    {language === "en" ? "$30,000 - $50,000" : "30,000 - 50,000 دولار"}
                  </SelectItem>
                  <SelectItem value="50000-100000">
                    {language === "en" ? "$50,000 - $100,000" : "50,000 - 100,000 دولار"}
                  </SelectItem>
                  <SelectItem value="100000+">
                    {language === "en" ? "Over $100,000" : "أكثر من 100,000 دولار"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="sm" onClick={resetFilters} className="rounded-[5px]">
              <Filter className="h-4 w-4 mr-1" />
              {language === "en" ? "Reset Filters" : "إعادة تعيين المرشحات"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different analytics views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full">
          <TabsTrigger value="overview">{language === "en" ? "Overview" : "نظرة عامة"}</TabsTrigger>
          <TabsTrigger value="brands">{language === "en" ? "Brands" : "العلامات التجارية"}</TabsTrigger>
          <TabsTrigger value="inventory">{language === "en" ? "Inventory" : "المخزون"}</TabsTrigger>
          <TabsTrigger value="pricing">{language === "en" ? "Pricing" : "التسعير"}</TabsTrigger>
          <TabsTrigger value="features">{language === "en" ? "Features" : "الميزات"}</TabsTrigger>
        </TabsList>

        {/* Main content */}
        {loading ? (
          <>
            {renderSkeletons()}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-[400px] w-full bg-gray-200 rounded-[5px]" />
              <Skeleton className="h-[400px] w-full bg-gray-200 rounded-[5px]" />
              <Skeleton className="h-[400px] w-full bg-gray-200 rounded-[5px]" />
              <Skeleton className="h-[400px] w-full bg-gray-200 rounded-[5px]" />
            </div>
          </>
        ) : error ? (
          <Card className="rounded-[5px]">
            <CardContent className="p-6">
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={loadData}>{language === "en" ? "Try Again" : "حاول مرة أخرى"}</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Metric cards */}
            {renderMetricCards()}

            {/* Tab content */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderBrandDistribution()}
                {renderMonthlyTrend()}
                {renderConditionDistribution()}
                {renderPriceDistribution()}
              </div>
            </TabsContent>

            <TabsContent value="brands">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderBrandDistribution()}
                {renderMonthlyTrend()}
              </div>
            </TabsContent>

            <TabsContent value="inventory">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderConditionDistribution()}
                {renderYearDistribution()}
              </div>
            </TabsContent>

            <TabsContent value="pricing">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderPriceDistribution()}
                {renderYearDistribution()}
              </div>
            </TabsContent>

            <TabsContent value="features">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderPopularFeatures()}
                {renderTransmissionTypes()}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}
