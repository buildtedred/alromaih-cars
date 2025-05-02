import axios from "axios"

const API_BASE_URL = "/api/supabasPrisma"

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
})

export const fetchCars = async () => {
  try {
    const response = await apiClient.get("/cars")
    console.log("object", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching cars:", error.message)
    return []
  }
}

export const fetchCarBrands = async () => {
  try {
    const response = await apiClient.get("/carbrands")
    return response.data
  } catch (error) {
    console.error("Error fetching car brands:", error.message)
    return []
  }
}

export const fetchOtherVariations = async () => {
  try {
    const response = await apiClient.get("/othervariations")
    return response.data
  } catch (error) {
    console.error("Error fetching other variations:", error.message)
    return []
  }
}

// Function to check API availability
export const checkApiAvailability = async () => {
  try {
    // Try to make a simple request to check if API is available
    await apiClient.get("/", { timeout: 3000 })
    return true
  } catch (error) {
    console.warn("API seems to be unavailable:", error.message)
    return false
  }
}
