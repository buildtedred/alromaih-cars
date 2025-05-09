"use client"

import { useState, useEffect } from "react"
import { MapPin, Clock, Monitor, Globe, ArrowUpRight, RefreshCw, Search } from "lucide-react"
import { format } from "date-fns"

export default function AnalyticsPage2() {
  const [viewData, setViewData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Fetch view data
  const fetchViewData = async () => {
    try {
      setRefreshing(true)
      const response = await fetch("/api/track-view")

      if (!response.ok) {
        throw new Error("Failed to fetch view data")
      }

      const result = await response.json()

      if (result.success) {
        setViewData(result.data)
        setError(null)
      } else {
        setError(result.message || "Failed to load data")
      }
    } catch (err) {
      console.error("Error fetching view data:", err)
      setError("Failed to load view data. Please try again.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Load data on initial render
  useEffect(() => {
    fetchViewData()
  }, [])

  // Filter data based on search term and selected product
  const filteredData = viewData.filter((view) => {
    const matchesSearch =
      searchTerm === "" ||
      view.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (view.data?.geo?.data?.data?.country_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (view.data?.geo?.data?.data?.city || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (view.data?.device?.browser || "").toLowerCase().includes(searchTerm.toLowerCase())

    const matchesProduct = selectedProduct === null || view.productId === selectedProduct

    return matchesSearch && matchesProduct
  })

  // Get unique products
  const uniqueProducts = [...new Set(viewData.map((view) => view.productId))]

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchViewData} />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Product View Analytics</h1>
            <p className="text-gray-500 mt-1">Track where your products are being viewed</p>
          </div>

          <button
            onClick={fetchViewData}
            disabled={refreshing}
            className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>

        {viewData.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            <AnalyticsSummary viewData={viewData} />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by product ID, country, city, or browser..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <select
                    value={selectedProduct || ""}
                    onChange={(e) => setSelectedProduct(e.target.value || null)}
                    className="w-full md:w-64 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Products</option>
                    {uniqueProducts.map((product) => (
                      <option key={product} value={product}>
                        {product}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Device
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Referrer
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.length > 0 ? (
                      filteredData.map((view) => (
                        <tr key={view.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="font-medium truncate max-w-[150px]">{view.productId}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span>
                                {view.data?.geo?.data?.data?.city || "Unknown"},{" "}
                                {view.data?.geo?.data?.data?.country_name || "Unknown"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Monitor className="h-3 w-3 text-gray-400" />
                              <span>
                                {view.data?.device?.type || "Unknown"} / {view.data?.device?.browser || "Unknown"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span>{format(new Date(view.viewedAt), "MMM d, yyyy h:mm a")}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <ArrowUpRight className="h-3 w-3 text-gray-400" />
                              <span className="truncate max-w-[200px]">{view.data?.referrer || "Direct"}</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                          No results found for your search. Try different keywords or clear filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {filteredData.length > 0 && (
                <div className="mt-4 text-sm text-gray-500 text-right">
                  Showing {filteredData.length} of {viewData.length} views
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LocationBreakdown viewData={filteredData.length > 0 ? filteredData : viewData} />
              <DeviceBreakdown viewData={filteredData.length > 0 ? filteredData : viewData} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function AnalyticsSummary({ viewData }) {
  // Count unique products
  const uniqueProducts = new Set(viewData.map((view) => view.productId)).size

  // Count unique locations
  const uniqueLocations = new Set(
    viewData
      .filter((view) => view.data?.geo?.data?.data?.country_name)
      .map((view) => view.data.geo.data.data.country_name),
  ).size

  // Count views from India
  const indiaViews = viewData.filter(
    (view) => view.data?.geo?.data?.data?.country_name === "India" || view.data?.geo?.data?.data?.country === "IN",
  ).length

  // Calculate India percentage
  const indiaPercentage = viewData.length > 0 ? Math.round((indiaViews / viewData.length) * 100) : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Views" value={viewData.length} icon={<Eye className="h-5 w-5 text-blue-500" />} />

      <StatCard title="Unique Products" value={uniqueProducts} icon={<Package className="h-5 w-5 text-purple-500" />} />

      <StatCard
        title="Views from India"
        value={indiaViews}
        subtext={`${indiaPercentage}% of total`}
        icon={<MapPin className="h-5 w-5 text-orange-500" />}
        highlight={true}
      />

      <StatCard title="Unique Locations" value={uniqueLocations} icon={<Globe className="h-5 w-5 text-green-500" />} />
    </div>
  )
}

function LocationBreakdown({ viewData }) {
  // Count views by country
  const countryData = viewData.reduce((acc, view) => {
    const country = view.data?.geo?.data?.data?.country_name || "Unknown"
    acc[country] = (acc[country] || 0) + 1
    return acc
  }, {})

  // Sort countries by view count
  const sortedCountries = Object.entries(countryData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10) // Top 10 countries

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Location Breakdown</h2>

      {sortedCountries.length > 0 ? (
        <div className="space-y-4">
          {sortedCountries.map(([country, count]) => (
            <div key={country} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">{country}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${country === "India" ? "bg-orange-500" : "bg-blue-500"}`}
                    style={{ width: `${Math.round((count / viewData.length) * 100)}%` }}
                  ></div>
                </div>
                <div className="text-gray-700 font-medium w-10 text-right">{count}</div>
                <div className="text-xs text-gray-500 w-12 text-right">
                  {Math.round((count / viewData.length) * 100)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-center py-4">No location data available</div>
      )}
    </div>
  )
}

function DeviceBreakdown({ viewData }) {
  // Count views by device type
  const deviceData = viewData.reduce((acc, view) => {
    const deviceType = view.data?.device?.type || "Unknown"
    acc[deviceType] = (acc[deviceType] || 0) + 1
    return acc
  }, {})

  // Count views by browser
  const browserData = viewData.reduce((acc, view) => {
    const browser = view.data?.device?.browser || "Unknown"
    acc[browser] = (acc[browser] || 0) + 1
    return acc
  }, {})

  // Sort by count
  const sortedDevices = Object.entries(deviceData).sort((a, b) => b[1] - a[1])
  const sortedBrowsers = Object.entries(browserData).sort((a, b) => b[1] - a[1])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Device Breakdown</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">Device Type</h3>
          <div className="space-y-3">
            {sortedDevices.map(([device, count]) => (
              <div key={device} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{device}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-purple-500"
                      style={{ width: `${Math.round((count / viewData.length) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-gray-700 font-medium w-10 text-right">{count}</div>
                  <div className="text-xs text-gray-500 w-12 text-right">
                    {Math.round((count / viewData.length) * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">Browser</h3>
          <div className="space-y-3">
            {sortedBrowsers.map(([browser, count]) => (
              <div key={browser} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{browser}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${Math.round((count / viewData.length) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-gray-700 font-medium w-10 text-right">{count}</div>
                  <div className="text-xs text-gray-500 w-12 text-right">
                    {Math.round((count / viewData.length) * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, subtext, icon, highlight }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border ${highlight ? "border-orange-200" : "border-gray-100"} p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`text-3xl font-bold ${highlight ? "text-orange-600" : "text-gray-800"} mt-1`}>{value}</p>
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
        <div className={`${highlight ? "bg-orange-50" : "bg-gray-50"} p-3 rounded-full`}>{icon}</div>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Loading analytics data...</h2>
        <p className="text-gray-500 mt-2">Please wait while we fetch your view data.</p>
      </div>
    </div>
  )
}

function ErrorState({ error, onRetry }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mb-4">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Failed to load data</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-500 mb-4">
        <Eye className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">No view data yet</h2>
      <p className="text-gray-600 max-w-md mx-auto mb-6">
        When users view your products, the data will appear here. Check back later or refresh to see new data.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Refresh Data
      </button>
    </div>
  )
}

// Icon components
function Eye(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function Package(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}

function AlertTriangle(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}
