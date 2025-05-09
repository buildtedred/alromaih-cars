"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

// Create the context
const TypesContext = createContext()

// Main provider component that fetches and provides all car type data
export function TypesProvider({ children }) {
  // State for all car types
  const [fuelTypes, setFuelTypes] = useState([])
  const [transmissionTypes, setTransmissionTypes] = useState([])
  const [conditionTypes, setConditionTypes] = useState([])
  const [wheelDriveTypes, setWheelDriveTypes] = useState([])
  const [bodyTypes, setBodyTypes] = useState([])
  const [safetyRatings, setSafetyRatings] = useState([])
  const [insuranceStatuses, setInsuranceStatuses] = useState([])

  // Loading states
  const [fuelTypesLoading, setFuelTypesLoading] = useState(true)
  const [transmissionTypesLoading, setTransmissionTypesLoading] = useState(true)
  const [conditionTypesLoading, setConditionTypesLoading] = useState(true)
  const [wheelDriveTypesLoading, setWheelDriveTypesLoading] = useState(true)
  const [bodyTypesLoading, setBodyTypesLoading] = useState(true)
  const [safetyRatingsLoading, setSafetyRatingsLoading] = useState(true)
  const [insuranceStatusesLoading, setInsuranceStatusesLoading] = useState(true)

  // Error states
  const [fuelTypesError, setFuelTypesError] = useState(null)
  const [transmissionTypesError, setTransmissionTypesError] = useState(null)
  const [conditionTypesError, setConditionTypesError] = useState(null)
  const [wheelDriveTypesError, setWheelDriveTypesError] = useState(null)
  const [bodyTypesError, setBodyTypesError] = useState(null)
  const [safetyRatingsError, setSafetyRatingsError] = useState(null)
  const [insuranceStatusesError, setInsuranceStatusesError] = useState(null)

  // Fetch fuel types
  useEffect(() => {
    async function fetchFuelTypes() {
      try {
        setFuelTypesLoading(true)
        const response = await axios.get("/api/fueltype")
        setFuelTypes(response.data || [])
        setFuelTypesError(null)
      } catch (error) {
        console.error("Error fetching fuel types:", error)
        setFuelTypesError(error.message)
      } finally {
        setFuelTypesLoading(false)
      }
    }
    fetchFuelTypes()
  }, [])

  // Fetch transmission types
  useEffect(() => {
    async function fetchTransmissionTypes() {
      try {
        setTransmissionTypesLoading(true)
        const response = await axios.get("/api/transmissiontype")
        setTransmissionTypes(response.data || [])
        setTransmissionTypesError(null)
      } catch (error) {
        console.error("Error fetching transmission types:", error)
        setTransmissionTypesError(error.message)
      } finally {
        setTransmissionTypesLoading(false)
      }
    }
    fetchTransmissionTypes()
  }, [])

  // Fetch condition types
  useEffect(() => {
    async function fetchConditionTypes() {
      try {
        setConditionTypesLoading(true)
        const response = await axios.get("/api/conditiontype")
        setConditionTypes(response.data || [])
        setConditionTypesError(null)
      } catch (error) {
        console.error("Error fetching condition types:", error)
        setConditionTypesError(error.message)
      } finally {
        setConditionTypesLoading(false)
      }
    }
    fetchConditionTypes()
  }, [])

  // Fetch wheel drive types
  useEffect(() => {
    async function fetchWheelDriveTypes() {
      try {
        setWheelDriveTypesLoading(true)
        const response = await axios.get("/api/wheeldrivetype")
        setWheelDriveTypes(response.data || [])
        setWheelDriveTypesError(null)
      } catch (error) {
        console.error("Error fetching wheel drive types:", error)
        setWheelDriveTypesError(error.message)
      } finally {
        setWheelDriveTypesLoading(false)
      }
    }
    fetchWheelDriveTypes()
  }, [])

  // Fetch body types
  useEffect(() => {
    async function fetchBodyTypes() {
      try {
        setBodyTypesLoading(true)
        const response = await axios.get("/api/bodytype")
        setBodyTypes(response.data || [])
        setBodyTypesError(null)
      } catch (error) {
        console.error("Error fetching body types:", error)
        setBodyTypesError(error.message)
      } finally {
        setBodyTypesLoading(false)
      }
    }
    fetchBodyTypes()
  }, [])

  // Fetch safety ratings
  useEffect(() => {
    async function fetchSafetyRatings() {
      try {
        setSafetyRatingsLoading(true)
        const response = await axios.get("/api/safetyrating")
        setSafetyRatings(response.data || [])
        setSafetyRatingsError(null)
      } catch (error) {
        console.error("Error fetching safety ratings:", error)
        setSafetyRatingsError(error.message)
      } finally {
        setSafetyRatingsLoading(false)
      }
    }
    fetchSafetyRatings()
  }, [])

  // Fetch insurance statuses
  useEffect(() => {
    async function fetchInsuranceStatuses() {
      try {
        setInsuranceStatusesLoading(true)
        const response = await axios.get("/api/insurancestatus")
        setInsuranceStatuses(response.data || [])
        setInsuranceStatusesError(null)
      } catch (error) {
        console.error("Error fetching insurance statuses:", error)
        setInsuranceStatusesError(error.message)
      } finally {
        setInsuranceStatusesLoading(false)
      }
    }
    fetchInsuranceStatuses()
  }, [])

  // Helper functions to find corresponding values between English and Arabic
  const findArabicValue = (items, englishValue) => {
    const item = items.find((item) => item.title === englishValue)
    return item ? item.title_ar : ""
  }

  const findEnglishValue = (items, arabicValue) => {
    const item = items.find((item) => item.title_ar === arabicValue)
    return item ? item.title : ""
  }

  // Context value
  const value = {
    // Fuel types
    fuelTypes,
    fuelTypesLoading,
    fuelTypesError,

    // Transmission types
    transmissionTypes,
    transmissionTypesLoading,
    transmissionTypesError,

    // Condition types
    conditionTypes,
    conditionTypesLoading,
    conditionTypesError,

    // Wheel drive types
    wheelDriveTypes,
    wheelDriveTypesLoading,
    wheelDriveTypesError,

    // Body types
    bodyTypes,
    bodyTypesLoading,
    bodyTypesError,

    // Safety ratings
    safetyRatings,
    safetyRatingsLoading,
    safetyRatingsError,

    // Insurance statuses
    insuranceStatuses,
    insuranceStatusesLoading,
    insuranceStatusesError,

    // Helper functions
    findArabicValue,
    findEnglishValue,
  }

  return <TypesContext.Provider value={value}>{children}</TypesContext.Provider>
}

// Custom hooks to use the context
export function useTypesContext() {
  const context = useContext(TypesContext)
  if (context === undefined) {
    throw new Error("useTypesContext must be used within a TypesProvider")
  }
  return context
}

// Specialized hooks for each type
export function useFuelTypes() {
  const context = useTypesContext()
  return {
    fuelTypes: context.fuelTypes,
    loading: context.fuelTypesLoading,
    error: context.fuelTypesError,
    findArabicValue: (englishValue) => context.findArabicValue(context.fuelTypes, englishValue),
    findEnglishValue: (arabicValue) => context.findEnglishValue(context.fuelTypes, arabicValue),
  }
}

export function useTransmissionTypes() {
  const context = useTypesContext()
  return {
    transmissionTypes: context.transmissionTypes,
    loading: context.transmissionTypesLoading,
    error: context.transmissionTypesError,
    findArabicValue: (englishValue) => context.findArabicValue(context.transmissionTypes, englishValue),
    findEnglishValue: (arabicValue) => context.findEnglishValue(context.transmissionTypes, arabicValue),
  }
}

export function useConditionTypes() {
  const context = useTypesContext()
  return {
    conditionTypes: context.conditionTypes,
    loading: context.conditionTypesLoading,
    error: context.conditionTypesError,
    findArabicValue: (englishValue) => context.findArabicValue(context.conditionTypes, englishValue),
    findEnglishValue: (arabicValue) => context.findEnglishValue(context.conditionTypes, arabicValue),
  }
}

export function useWheelDriveTypes() {
  const context = useTypesContext()
  return {
    wheelDriveTypes: context.wheelDriveTypes,
    loading: context.wheelDriveTypesLoading,
    error: context.wheelDriveTypesError,
    findArabicValue: (englishValue) => context.findArabicValue(context.wheelDriveTypes, englishValue),
    findEnglishValue: (arabicValue) => context.findEnglishValue(context.wheelDriveTypes, arabicValue),
  }
}

export function useBodyTypes() {
  const context = useTypesContext()
  return {
    bodyTypes: context.bodyTypes,
    loading: context.bodyTypesLoading,
    error: context.bodyTypesError,
    findArabicValue: (englishValue) => context.findArabicValue(context.bodyTypes, englishValue),
    findEnglishValue: (arabicValue) => context.findEnglishValue(context.bodyTypes, arabicValue),
  }
}

export function useSafetyRatings() {
  const context = useTypesContext()
  return {
    safetyRatings: context.safetyRatings,
    loading: context.safetyRatingsLoading,
    error: context.safetyRatingsError,
    findArabicValue: (englishValue) => context.findArabicValue(context.safetyRatings, englishValue),
    findEnglishValue: (arabicValue) => context.findEnglishValue(context.safetyRatings, arabicValue),
  }
}

export function useInsuranceStatuses() {
  const context = useTypesContext()
  return {
    insuranceStatuses: context.insuranceStatuses,
    loading: context.insuranceStatusesLoading,
    error: context.insuranceStatusesError,
    findArabicValue: (englishValue) => context.findArabicValue(context.insuranceStatuses, englishValue),
    findEnglishValue: (arabicValue) => context.findEnglishValue(context.insuranceStatuses, arabicValue),
  }
}
