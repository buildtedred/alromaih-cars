"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
} from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { UserTrackingCards } from "./Usertracker"

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

  // Color palette for the UI
  const colors = {
    primary: "green",
    secondary: "purple",
    accent1: "blue",
    accent2: "orange",
    accent3: "pink",
    accent4: "teal",
    accent5: "amber",
    accent6: "indigo",
  }

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
    "bg-rose-50",
    "bg-cyan-50",
    "bg-emerald-50",
    "bg-violet-50",
  ]

  // Fetch tracking data
  const fetchTrackingData = async () => {
    try {
      setRefreshing(true)
      const response = await fetch("/api/track-view")

      if (!response.ok) {
        throw new Error("Failed to fetch tracking data")
      }

      const result = await response.json()

      if (result.success) {
        setTrackingData(result.data || [])

        // Fetch brand names for all product IDs
        const productIds = [...new Set((result.data || []).map((item) => item.productId))]
        productIds.forEach((id) => {
          fetchBrandName(id)
        })

        setError(null)
      } else {
        setError(result.message || "Failed to load data")
      }
    } catch (err) {
      console.error("Error fetching tracking data:", err)
      setError("Failed to load tracking data. Please try again.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Fetch brand name for a product ID
  const fetchBrandName = async (productId) => {
    if (brandNames[productId]) return // Skip if we already have it

    try {
      setLoadingBrands((prev) => ({ ...prev, [productId]: true }))
      const response = await fetch(`/api/supabasPrisma/carbrands/${productId}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch brand for ${productId}`)
      }

      const brandData = await response.json()

      if (brandData) {
        setBrandNames((prev) => ({
          ...prev,
          [productId]: brandData.name || "Unknown Brand",
        }))
      }
    } catch (err) {
      console.error(`Error fetching brand for ${productId}:`, err)
      setBrandNames((prev) => ({
        ...prev,
        [productId]: "Unknown Brand",
      }))
    } finally {
      setLoadingBrands((prev) => ({ ...prev, [productId]: false }))
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
        (view.data?.geo?.data?.data?.country_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (view.data?.geo?.data?.data?.city || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (view.data?.device?.browser || "").toLowerCase().includes(searchTerm.toLowerCase())

      if (activeTab === "all") return matchesSearch
      if (activeTab === "pakistan")
        return (
          matchesSearch &&
          (view.data?.geo?.data?.data?.country === "PK" || view.data?.geo?.data?.data?.country_name === "Pakistan")
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
          valueA = `${a.data?.geo?.data?.data?.city || ""}, ${a.data?.geo?.data?.data?.country_name || ""}`
          valueB = `${b.data?.geo?.data?.data?.city || ""}, ${b.data?.geo?.data?.data?.country_name || ""}`
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
      (view) => view.data?.geo?.data?.data?.country === "PK" || view.data?.geo?.data?.data?.country_name === "Pakistan",
    ).length,
    desktop: trackingData.filter((view) => view.data?.device?.type === "Desktop").length,
    mobile: trackingData.filter((view) => view.data?.device?.type === "Mobile").length,
    uniqueProducts: new Set(trackingData.map((view) => view.productId)).size,
    uniqueCountries: new Set(
      trackingData
        .filter((view) => view.data?.geo?.data?.data?.country_name)
        .map((view) => view.data.geo.data.data.country_name),
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
    const country = view.data?.geo?.data?.data?.country_name || "Unknown"
    acc[country] = (acc[country] || 0) + 1
    return acc
  }, {})

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  // Get color for browser badge
  const getBrowserColor = (browser) => {
    if (!browser) return "gray"

    const browserMap = {
      chrome: "green",
      firefox: "orange",
      safari: "blue",
      edge: "blue",
      opera: "red",
      ie: "blue",
    }

    return browserMap[browser.toLowerCase()] || "purple"
  }

  // Get color for country badge
  const getCountryColor = (country) => {
    if (!country) return "gray"

    const countryMap = {
      Pakistan: "green",
      "United States": "blue",
      "United Kingdom": "red",
      India: "orange",
      China: "red",
      Germany: "yellow",
      France: "blue",
      Japan: "red",
      Australia: "teal",
    }

    return countryMap[country] || "indigo"
  }

  if (loading && trackingData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">User Tracking Dashboard</h1>
            <Button disabled className="rounded-[5px]">
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </Button>
          </div>
          <Card className="rounded-[5px]">
            <CardContent className="p-8">
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                <p className="ml-4 text-gray-500">Loading tracking data...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              User Tracking Dashboard
            </h1>
            <p className="text-gray-500">Monitor and analyze user activity on your site</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by brand, country, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-green-500 w-full md:w-64"
              />
            </div>

            <Button
              onClick={fetchTrackingData}
              disabled={refreshing}
              className="bg-green-600 hover:bg-green-700 rounded-[5px]"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>

            <Button variant="outline" className="rounded-[5px]">
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
            icon={<Eye className="h-5 w-5 text-blue-600" />}
            color={colors.accent1}
            bgColor={cardBgColors[0]}
          />

          <StatCard
            title="Pakistan Views"
            value={stats.pakistan}
            icon={<MapPin className="h-5 w-5 text-green-600" />}
            color={colors.primary}
            bgColor={cardBgColors[1]}
            percentage={stats.total > 0 ? Math.round((stats.pakistan / stats.total) * 100) : 0}
          />

          <StatCard
            title="Unique Products"
            value={stats.uniqueProducts}
            icon={<Package className="h-5 w-5 text-purple-600" />}
            color={colors.secondary}
            bgColor={cardBgColors[2]}
          />

          <StatCard
            title="Unique Countries"
            value={stats.uniqueCountries}
            icon={<Globe className="h-5 w-5 text-orange-600" />}
            color={colors.accent2}
            bgColor={cardBgColors[3]}
          />
        </div>

        {/* Tabs and Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="mb-4 bg-white p-1 rounded-[5px] border border-gray-200">
            <TabsTrigger
              value="all"
              className={`rounded-[5px] ${activeTab === "all" ? "bg-green-50 text-green-700" : ""}`}
            >
              All Views ({stats.total})
            </TabsTrigger>
            <TabsTrigger
              value="pakistan"
              className={`rounded-[5px] ${activeTab === "pakistan" ? "bg-green-50 text-green-700" : ""}`}
            >
              Pakistan ({stats.pakistan})
            </TabsTrigger>
            <TabsTrigger
              value="desktop"
              className={`rounded-[5px] ${activeTab === "desktop" ? "bg-green-50 text-green-700" : ""}`}
            >
              Desktop ({stats.desktop})
            </TabsTrigger>
            <TabsTrigger
              value="mobile"
              className={`rounded-[5px] ${activeTab === "mobile" ? "bg-green-50 text-green-700" : ""}`}
            >
              Mobile ({stats.mobile})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {error ? (
              <Card className="rounded-[5px] mb-6 bg-red-50">
                <CardContent className="p-6 text-center">
                  <p className="text-red-500 mb-4">{error}</p>
                  <Button onClick={fetchTrackingData} className="rounded-[5px]">
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : filteredData.length === 0 ? (
              <Card className="rounded-[5px] mb-6 bg-amber-50">
                <CardContent className="p-6 text-center">
                  <p className="text-amber-700 mb-4">No tracking data found matching your criteria.</p>
                  <Button onClick={() => setSearchTerm("")} className="rounded-[5px]">
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Distribution Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <DistributionCard
                    title="Browser Distribution"
                    data={browserDistribution}
                    icon={<Monitor className="h-5 w-5 text-blue-600" />}
                    color={colors.accent1}
                    bgColor={cardBgColors[4]}
                  />

                  <DistributionCard
                    title="Country Distribution"
                    data={countryDistribution}
                    icon={<Globe className="h-5 w-5 text-green-600" />}
                    color={colors.primary}
                    bgColor={cardBgColors[5]}
                  />
                </div>

                {/* Tracking Table */}
                <Card className="rounded-[5px] mb-6 overflow-hidden border border-gray-200">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Recent Views</CardTitle>
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
                          className="border border-gray-300 rounded-[5px] px-2 py-1 text-sm"
                        >
                          <option value={5}>5 per page</option>
                          <option value={10}>10 per page</option>
                          <option value={20}>20 per page</option>
                          <option value={50}>50 per page</option>
                        </select>
                        <Button variant="outline" size="sm" className="rounded-[5px]">
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
                            const country = view.data?.geo?.data?.data?.country_name || "Unknown"
                            const browser = view.data?.device?.browser || "Unknown"
                            const countryColor = getCountryColor(country)
                            const browserColor = getBrowserColor(browser)
                            // Alternate row background colors for better readability
                            const rowBgColor = index % 2 === 0 ? "bg-white" : "bg-gray-50"

                            return (
                              <tr key={view.id} className={`hover:bg-blue-50 ${rowBgColor}`}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex flex-col">
                                    <div className="font-medium text-gray-900">
                                      {loadingBrands[view.productId] ? (
                                        <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
                                      ) : (
                                        <span className="text-blue-600">
                                          {brandNames[view.productId] || "Loading..."}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-500 truncate max-w-[150px]">{view.productId}</div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3 text-gray-400" />
                                      <span className="font-medium">
                                        {view.data?.geo?.data?.data?.city || "Unknown"}
                                      </span>
                                    </div>
                                    <div className="mt-1">
                                      <Badge
                                        variant="outline"
                                        className={`bg-${countryColor}-50 text-${countryColor}-700 border-${countryColor}-200 text-xs`}
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
                                        className={`bg-${browserColor}-50 text-${browserColor}-700 border-${browserColor}-200 text-xs`}
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
                                      {format(new Date(view.viewedAt), "h:mm a")}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-[5px] border-green-200 text-green-700 hover:bg-green-50"
                                    onClick={() => setSelectedView(view)}
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
                  <CardFooter className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-3">
                    <div className="text-sm text-gray-500">
                      Page {currentPage} of {totalPages || 1}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-[5px]"
                        disabled={currentPage === 1 || totalPages === 0}
                        onClick={() => setCurrentPage(1)}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-[5px]"
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
                                className={`rounded-[5px] w-8 h-8 p-0 ${
                                  currentPage === pageNum ? "bg-green-600 hover:bg-green-700" : ""
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
                        className="rounded-[5px]"
                        disabled={currentPage === totalPages || totalPages === 0}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-[5px]"
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

        {/* Selected View Details */}
        {selectedView && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                View Details: {brandNames[selectedView.productId] || "Loading..."}
              </h2>
              <Button variant="outline" size="sm" className="rounded-[5px]" onClick={() => setSelectedView(null)}>
                Close
              </Button>
            </div>
            <UserTrackingCards trackingData={selectedView} />
          </div>
        )}
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ title, value, icon, color, bgColor, percentage }) {
  return (
    <Card className={`rounded-[5px] border-${color}-200 overflow-hidden ${bgColor}`}>
      <div className={`h-1 bg-${color}-500`}></div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">{title}</p>
            <p className="text-3xl font-bold mb-1">{value}</p>
            {percentage !== undefined && (
              <div className="flex items-center">
                <div className="w-full bg-white rounded-full h-1.5 mr-2">
                  <div className={`h-1.5 rounded-full bg-${color}-500`} style={{ width: `${percentage}%` }}></div>
                </div>
                <p className="text-xs text-gray-600 font-medium">{percentage}%</p>
              </div>
            )}
          </div>
          <div className={`p-2 rounded-full bg-white shadow-sm`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

// Distribution Card Component
function DistributionCard({ title, data, icon, color, bgColor }) {
  // Convert data object to array and sort by count
  const sortedData = Object.entries(data)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5) // Top 5

  const total = Object.values(data).reduce((sum, count) => sum + count, 0)

  return (
    <Card className={`rounded-[5px] overflow-hidden ${bgColor}`}>
      <div className={`h-1 bg-${color}-500`}></div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white rounded-full shadow-sm">{icon}</div>
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedData.map((item, index) => {
            // Use different colors for each bar
            const colors = ["green", "blue", "purple", "orange", "teal"]
            const barColor = colors[index % colors.length]
            const percentage = Math.round((item.count / total) * 100)

            return (
              <div key={item.name} className="flex items-center justify-between">
                <div className="font-medium">{item.name}</div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-white rounded-full h-2 shadow-inner">
                    <div className={`h-2 rounded-full bg-${barColor}-500`} style={{ width: `${percentage}%` }}></div>
                  </div>
                  <div className="text-gray-700 font-medium w-10 text-right">{item.count}</div>
                  <div className={`text-xs text-${barColor}-700 w-12 text-right font-medium`}>{percentage}%</div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
