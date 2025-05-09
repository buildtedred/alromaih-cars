"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Loader2,
  Car,
  ImageIcon,
  Settings,
  Info,
  Check,
  AlertCircle,
  ChevronRight,
  ListFilter,
} from "lucide-react"
import axios from "axios"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import MultipleImages from "./multipleImages/MultipleImages"
import AddSpecifications from "./AddSpecifications/AddSpecifications"

// Import all the hooks from the types provider
import {
  useFuelTypes,
  useTransmissionTypes,
  useConditionTypes,
  useWheelDriveTypes,
  useBodyTypes,
  useSafetyRatings,
  useInsuranceStatuses,
} from "../../context/types-provider/Types-provider"

// Define the tab order for navigation
const TAB_ORDER = ["types", "basic", "technical", "features", "additional", "specifications", "images"]
const YEARS = Array.from({ length: 55 }, (_, i) => new Date().getFullYear() - i)

export default function AddCarForm() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("types")
  const [activeLang, setActiveLang] = useState("english")

  // ==================== FETCH DATA FROM CONTEXT ====================
  // Get all types data from context
  const {
    fuelTypes,
    setFuelTypes,
    loading: fuelTypesLoading,
    findArabicValue: findFuelTypeArabic,
    findEnglishValue: findFuelTypeEnglish,
  } = useFuelTypes()
  const {
    transmissionTypes,
    setTransmissionTypes,
    loading: transmissionTypesLoading,
    findArabicValue: findTransmissionArabic,
    findEnglishValue: findTransmissionEnglish,
  } = useTransmissionTypes()
  const {
    conditionTypes,
    setConditionTypes,
    loading: conditionTypesLoading,
    findArabicValue: findConditionArabic,
    findEnglishValue: findConditionEnglish,
  } = useConditionTypes()
  const {
    wheelDriveTypes,
    setWheelDriveTypes,
    loading: wheelDriveTypesLoading,
    findArabicValue: findWheelDriveArabic,
    findEnglishValue: findWheelDriveEnglish,
  } = useWheelDriveTypes()
  const {
    bodyTypes,
    setBodyTypes,
    loading: bodyTypesLoading,
    findArabicValue: findBodyTypeArabic,
    findEnglishValue: findBodyTypeEnglish,
  } = useBodyTypes()
  const {
    safetyRatings,
    setSafetyRatings,
    loading: safetyRatingsLoading,
    findArabicValue: findSafetyRatingArabic,
    findEnglishValue: findSafetyRatingEnglish,
  } = useSafetyRatings()
  const {
    insuranceStatuses,
    setInsuranceStatuses,
    loading: insuranceStatusesLoading,
    findArabicValue: findInsuranceStatusArabic,
    findEnglishValue: findInsuranceStatusEnglish,
  } = useInsuranceStatuses()

  // ==================== FORM STATE VARIABLES ====================
  // Basic Information - English
  const [model, setModel] = useState("")
  const [year, setYear] = useState("")
  const [brandId, setBrandId] = useState("")
  const [brands, setBrands] = useState([])
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [color, setColor] = useState("")
  const [condition, setCondition] = useState("")
  const [bodyType, setBodyType] = useState("")

  // Basic Information - Arabic
  const [model_ar, setModelAr] = useState("")
  const [year_ar, setYearAr] = useState("")
  const [description_ar, setDescriptionAr] = useState("")
  const [price_ar, setPriceAr] = useState("")
  const [color_ar, setColorAr] = useState("")
  const [condition_ar, setConditionAr] = useState("")
  const [bodyType_ar, setBodyTypeAr] = useState("")

  // Technical Specifications - English
  const [mileage, setMileage] = useState("")
  const [fuelType, setFuelType] = useState("")
  const [fuelTankCapacity, setFuelTankCapacity] = useState("")
  const [transmission, setTransmission] = useState("")
  const [engineSize, setEngineSize] = useState("")
  const [horsepower, setHorsepower] = useState("")
  const [torque, setTorque] = useState("")
  const [wheelDrive, setWheelDrive] = useState("")
  const [topSpeed, setTopSpeed] = useState("")
  const [acceleration, setAcceleration] = useState("")
  const [fuelEconomy, setFuelEconomy] = useState("")

  // Technical Specifications - Arabic
  const [mileage_ar, setMileageAr] = useState("")
  const [fuelType_ar, setFuelTypeAr] = useState("")
  const [fuelTankCapacity_ar, setFuelTankCapacityAr] = useState("")
  const [transmission_ar, setTransmissionAr] = useState("")
  const [engineSize_ar, setEngineSizeAr] = useState("")
  const [horsepower_ar, setHorsepowerAr] = useState("")
  const [torque_ar, setTorqueAr] = useState("")
  const [wheelDrive_ar, setWheelDriveAr] = useState("")
  const [topSpeed_ar, setTopSpeedAr] = useState("")
  const [acceleration_ar, setAccelerationAr] = useState("")
  const [fuelEconomy_ar, setFuelEconomyAr] = useState("")

  // Features & Comfort - English
  const [seats, setSeats] = useState("")
  const [doors, setDoors] = useState("")
  const [infotainment, setInfotainment] = useState("")

  // Features & Comfort - Arabic
  const [seats_ar, setSeatsAr] = useState("")
  const [doors_ar, setDoorsAr] = useState("")
  const [infotainment_ar, setInfotainmentAr] = useState("")

  // Boolean features (no Arabic versions)
  const [gps, setGps] = useState(false)
  const [sunroof, setSunroof] = useState(false)
  const [parkingSensors, setParkingSensors] = useState(false)
  const [cruiseControl, setCruiseControl] = useState(false)
  const [leatherSeats, setLeatherSeats] = useState(false)
  const [heatedSeats, setHeatedSeats] = useState(false)
  const [bluetooth, setBluetooth] = useState(false)
  const [climateControl, setClimateControl] = useState(false)
  const [keylessEntry, setKeylessEntry] = useState(false)
  const [rearCamera, setRearCamera] = useState(false)

  // Additional Information - English
  const [manufactured, setManufactured] = useState("")
  const [safetyRating, setSafetyRating] = useState("")
  const [warranty, setWarranty] = useState("")
  const [registration, setRegistration] = useState("")
  const [ownerCount, setOwnerCount] = useState("")
  const [insuranceStatus, setInsuranceStatus] = useState("")
  const [taxValidity, setTaxValidity] = useState("")

  // Additional Information - Arabic
  const [manufactured_ar, setManufacturedAr] = useState("")
  const [safetyRating_ar, setSafetyRatingAr] = useState("")
  const [warranty_ar, setWarrantyAr] = useState("")
  const [registration_ar, setRegistrationAr] = useState("")
  const [ownerCount_ar, setOwnerCountAr] = useState("")
  const [insuranceStatus_ar, setInsuranceStatusAr] = useState("")

  // Images & Specifications
  const [images, setImages] = useState([])
  const [specifications, setSpecifications] = useState([])

  // Form State
  const [loading, setLoading] = useState(false)
  const [brandsLoading, setBrandsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [formProgress, setFormProgress] = useState(0)

  // Function to fetch all types data
  const fetchAllTypesData = useCallback(async () => {
    try {
      // Fetch fuel types
      const fuelTypesResponse = await axios.get("/api/fueltype")
      if (fuelTypesResponse.data && fuelTypesResponse.data.data) {
        setFuelTypes(fuelTypesResponse.data.data)
      }

      // Fetch transmission types
      const transmissionTypesResponse = await axios.get("/api/transmissiontype")
      if (transmissionTypesResponse.data && transmissionTypesResponse.data.data) {
        setTransmissionTypes(transmissionTypesResponse.data.data)
      }

      // Fetch condition types
      const conditionTypesResponse = await axios.get("/api/conditiontype")
      if (conditionTypesResponse.data && conditionTypesResponse.data.data) {
        setConditionTypes(conditionTypesResponse.data.data)
      }

      // Fetch wheel drive types
      const wheelDriveTypesResponse = await axios.get("/api/wheeldrivetype")
      if (wheelDriveTypesResponse.data && wheelDriveTypesResponse.data.data) {
        setWheelDriveTypes(wheelDriveTypesResponse.data.data)
      }

      // Fetch body types
      const bodyTypesResponse = await axios.get("/api/bodytype")
      if (bodyTypesResponse.data && bodyTypesResponse.data.data) {
        setBodyTypes(bodyTypesResponse.data.data)
      }

      // Fetch safety ratings
      const safetyRatingsResponse = await axios.get("/api/safetyrating")
      if (safetyRatingsResponse.data && safetyRatingsResponse.data.data) {
        setSafetyRatings(safetyRatingsResponse.data.data)
      }

      // Fetch insurance statuses
      const insuranceStatusesResponse = await axios.get("/api/insurancestatus")
      if (insuranceStatusesResponse.data && insuranceStatusesResponse.data.data) {
        setInsuranceStatuses(insuranceStatusesResponse.data.data)
      }
    } catch (error) {
      console.error("Error fetching types data:", error)
    }
  }, [
    setBodyTypes,
    setConditionTypes,
    setFuelTypes,
    setInsuranceStatuses,
    setSafetyRatings,
    setTransmissionTypes,
    setWheelDriveTypes,
  ])

  // Add a polling mechanism to periodically fetch updated data
  useEffect(() => {
    // Initial fetch
    fetchAllTypesData()

    // Set up polling interval (every 30 seconds)
    const intervalId = setInterval(() => {
      fetchAllTypesData()
    }, 30000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [fetchAllTypesData])

  // ==================== BILINGUAL SYNC HANDLERS ====================
  // These functions sync values between English and Arabic

  // Sync fuel type between languages
  const handleFuelTypeChange = useCallback(
    (value) => {
      setFuelType(value)
      // Find and set the corresponding Arabic value
      setFuelTypeAr(findFuelTypeArabic(value))
    },
    [findFuelTypeArabic],
  )

  const handleFuelTypeArChange = useCallback(
    (value) => {
      setFuelTypeAr(value)
      // Find and set the corresponding English value
      setFuelType(findFuelTypeEnglish(value))
    },
    [findFuelTypeEnglish],
  )

  // Sync transmission between languages
  const handleTransmissionChange = useCallback(
    (value) => {
      setTransmission(value)
      setTransmissionAr(findTransmissionArabic(value))
    },
    [findTransmissionArabic],
  )

  const handleTransmissionArChange = useCallback(
    (value) => {
      setTransmissionAr(value)
      setTransmission(findTransmissionEnglish(value))
    },
    [findTransmissionEnglish],
  )

  // Sync condition between languages
  const handleConditionChange = useCallback(
    (value) => {
      setCondition(value)
      setConditionAr(findConditionArabic(value))
    },
    [findConditionArabic],
  )

  const handleConditionArChange = useCallback(
    (value) => {
      setConditionAr(value)
      setCondition(findConditionEnglish(value))
    },
    [findConditionEnglish],
  )

  // Sync wheel drive between languages
  const handleWheelDriveChange = useCallback(
    (value) => {
      setWheelDrive(value)
      setWheelDriveAr(findWheelDriveArabic(value))
    },
    [findWheelDriveArabic],
  )

  const handleWheelDriveArChange = useCallback(
    (value) => {
      setWheelDriveAr(value)
      setWheelDrive(findWheelDriveEnglish(value))
    },
    [findWheelDriveEnglish],
  )

  // Sync body type between languages
  const handleBodyTypeChange = useCallback(
    (value) => {
      setBodyType(value)
      setBodyTypeAr(findBodyTypeArabic(value))
    },
    [findBodyTypeArabic],
  )

  const handleBodyTypeArChange = useCallback(
    (value) => {
      setBodyTypeAr(value)
      setBodyType(findBodyTypeEnglish(value))
    },
    [findBodyTypeEnglish],
  )

  // Sync safety rating between languages
  const handleSafetyRatingChange = useCallback(
    (value) => {
      setSafetyRating(value)
      setSafetyRatingAr(findSafetyRatingArabic(value))
    },
    [findSafetyRatingArabic],
  )

  const handleSafetyRatingArChange = useCallback(
    (value) => {
      setSafetyRatingAr(value)
      setSafetyRating(findSafetyRatingEnglish(value))
    },
    [findSafetyRatingEnglish],
  )

  // Sync insurance status between languages
  const handleInsuranceStatusChange = useCallback(
    (value) => {
      setInsuranceStatus(value)
      setInsuranceStatusAr(findInsuranceStatusArabic(value))
    },
    [findInsuranceStatusArabic],
  )

  const handleInsuranceStatusArChange = useCallback(
    (value) => {
      setInsuranceStatusAr(value)
      setInsuranceStatus(findInsuranceStatusEnglish(value))
    },
    [findInsuranceStatusEnglish],
  )

  // ==================== FETCH BRANDS DATA ====================
  useEffect(() => {
    async function fetchBrands() {
      try {
        setBrandsLoading(true)
        const response = await axios.get("/api/supabasPrisma/carbrands")
        setBrands(response?.data?.en || [])
      } catch (error) {
        console.error("Error fetching brands:", error)
      } finally {
        setBrandsLoading(false)
      }
    }
    fetchBrands()
  }, [])

  // ==================== CALCULATE FORM PROGRESS ====================
  useEffect(() => {
    const requiredFields = [model, year, brandId]
    const completedRequired = requiredFields.filter((field) => field).length
    const requiredProgress = (completedRequired / requiredFields.length) * 60

    const optionalFields = [mileage, fuelType, transmission, color, condition, seats, doors, engineSize, bodyType]
    const completedOptional = optionalFields.filter((field) => field).length
    const optionalProgress = (completedOptional / optionalFields.length) * 20

    const imagesProgress = images.length > 0 ? 20 : 0

    setFormProgress(Math.min(100, Math.round(requiredProgress + optionalProgress + imagesProgress)))
  }, [
    model,
    year,
    brandId,
    mileage,
    fuelType,
    transmission,
    color,
    condition,
    seats,
    doors,
    engineSize,
    bodyType,
    images,
  ])

  // ==================== SPECIFICATIONS MANAGEMENT ====================
  const addSpecification = () => {
    setSpecifications([...specifications, { title: "", titleAr: "", details: [] }])
  }

  const removeSpecification = (index) => {
    setSpecifications(specifications.filter((_, i) => i !== index))
  }

  const handleSpecTitleChange = (index, value, field) => {
    const updatedSpecs = [...specifications]
    updatedSpecs[index][field] = value
    setSpecifications(updatedSpecs)
  }

  const addSpecDetail = (index) => {
    const updatedSpecs = [...specifications]
    updatedSpecs[index].details.push({ label: "", value: "", labelAr: "", valueAr: "" })
    setSpecifications(updatedSpecs)
  }

  const handleSpecDetailChange = (specIndex, detailIndex, field, value) => {
    const updatedSpecs = [...specifications]
    updatedSpecs[specIndex].details[detailIndex][field] = value
    setSpecifications(updatedSpecs)
  }

  const removeSpecDetail = (specIndex, detailIndex) => {
    const updatedSpecs = [...specifications]
    updatedSpecs[specIndex].details = updatedSpecs[specIndex].details.filter((_, i) => i !== detailIndex)
    setSpecifications(updatedSpecs)
  }

  // ==================== FORM SUBMISSION ====================
  async function handleSubmit(e) {
    e.preventDefault()

    setError(null)
    setUploadStatus(null)
    setLoading(true)

    if (!model || !year || !brandId || images.length === 0) {
      setError("Model, year, brand and at least one image are required")
      setLoading(false)
      return
    }

    try {
      // Extract image URLs for submission
      const imageUrls = images.map((image) => image.url)

      // Submit the form with all image URLs and bilingual data
      const response = await axios.post("/api/supabasPrisma/cars", {
        // English fields
        model,
        year,
        brandId,
        description,
        price: price ? Number.parseFloat(price) : null,
        color,
        condition,
        bodyType,
        mileage: mileage ? Number.parseInt(mileage) : null,
        fuelType,
        fuelTankCapacity,
        transmission,
        engineSize: engineSize ? Number.parseFloat(engineSize) : null,
        horsepower: horsepower ? Number.parseInt(horsepower) : null,
        torque: torque ? Number.parseInt(torque) : null,
        wheelDrive,
        topSpeed: topSpeed ? Number.parseInt(topSpeed) : null,
        acceleration: acceleration ? Number.parseFloat(acceleration) : null,
        fuelEconomy: fuelEconomy ? Number.parseFloat(fuelEconomy) : null,
        seats: seats ? Number.parseInt(seats) : null,
        doors: doors ? Number.parseInt(doors) : null,
        infotainment,
        manufactured,
        safetyRating,
        warranty,
        registration,
        ownerCount: ownerCount ? Number.parseInt(ownerCount) : null,
        insuranceStatus,
        taxValidity,

        // Arabic fields
        model_ar,
        year_ar,
        description_ar,
        price_ar,
        color_ar,
        condition_ar,
        bodyType_ar,
        mileage_ar,
        fuelType_ar,
        fuelTankCapacity_ar,
        transmission_ar,
        engineSize_ar,
        horsepower_ar,
        torque_ar,
        wheelDrive_ar,
        topSpeed_ar,
        acceleration_ar,
        fuelEconomy_ar,
        seats_ar,
        doors_ar,
        infotainment_ar,
        manufactured_ar,
        safetyRating_ar,
        warranty_ar,
        registration_ar,
        ownerCount_ar,
        insuranceStatus_ar,

        // Boolean fields (no Arabic versions)
        gps,
        sunroof,
        parkingSensors,
        cruiseControl,
        leatherSeats,
        heatedSeats,
        bluetooth,
        climateControl,
        keylessEntry,
        rearCamera,

        // Images and specifications
        images: imageUrls,
        specifications,
      })

      setUploadStatus("Car added successfully! Redirecting...")

      router.push("/dashboard/cars")
      router.refresh()
    } catch (error) {
      console.error("Error adding car:", error)
      setError(error.response?.data?.error || error.message || "Failed to add car")
    } finally {
      setLoading(false)
    }
  }

  // ==================== TAB NAVIGATION ====================
  // Navigate to next tab
  const goToNextTab = () => {
    const currentIndex = TAB_ORDER.indexOf(activeTab)
    if (currentIndex < TAB_ORDER.length - 1) {
      setActiveTab(TAB_ORDER[currentIndex + 1])
    }
  }

  // Navigate to previous tab
  const goToPrevTab = () => {
    const currentIndex = TAB_ORDER.indexOf(activeTab)
    if (currentIndex > 0) {
      setActiveTab(TAB_ORDER[currentIndex - 1])
    }
  }

  // ==================== RENDER LOADING STATE ====================
  // Render skeleton loading state for brands
  if (brandsLoading) {
    return (
      <div className="w-full py-4 px-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Skeleton className="h-8 w-28 mb-2" />
            <Skeleton className="h-6 w-40 mb-1" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-8 w-32" />
        </div>

        <Card className="rounded-[5px] shadow-sm border-brand-primary/10">
          <CardHeader className="py-3 px-4 space-y-1">
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4 py-3 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end py-3 px-4 border-t">
            <Skeleton className="h-8 w-32" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  // ==================== MAIN RENDER ====================
  return (
    <div className="w-full py-4 px-4 relative">
      {/* Full-page overlay during loading */}
      {loading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card p-6 rounded-[5px] shadow-lg text-center max-w-md w-full border border-brand-primary/20">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-brand-primary" />
            <h3 className="font-medium text-lg mb-2">Adding Car</h3>
            <p className="text-muted-foreground">Please wait while we process your request...</p>
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-center text-xs text-muted-foreground mb-2">
          <Button
            type="button"
            variant="ghost"
            className="p-0 h-auto hover:text-brand-primary transition-colors"
            onClick={() => router.back()}
            disabled={loading}
          >
            Dashboard
          </Button>
          <ChevronRight className="h-3 w-3 mx-1" />
          <Button
            type="button"
            variant="ghost"
            className="p-0 h-auto hover:text-brand-primary transition-colors"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cars
          </Button>
          <ChevronRight className="h-3 w-3 mx-1" />
          <span className="text-foreground">Add New Car</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-brand-primary">Add New Car</h1>
            <p className="text-xs text-muted-foreground">Fill in the details to add a new car to your inventory</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full sm:w-auto h-8 text-xs rounded-[5px]"
            onClick={() => router.back()}
            disabled={loading}
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Cars
          </Button>
        </div>
      </div>

      {error && (
        <Alert
          variant="destructive"
          className="mb-3 py-2 text-sm animate-in fade-in-50 slide-in-from-top-5 duration-300 rounded-[5px]"
        >
          <AlertCircle className="h-3.5 w-3.5" />
          <AlertTitle className="text-sm font-medium">Error</AlertTitle>
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      {uploadStatus && (
        <Alert className="mb-3 py-2 text-sm bg-green-50 text-green-800 border-green-200 animate-in fade-in-50 slide-in-from-top-5 duration-300 rounded-[5px]">
          <Check className="h-3.5 w-3.5 text-green-600" />
          <AlertTitle className="text-sm font-medium">Success</AlertTitle>
          <AlertDescription className="text-xs">{uploadStatus}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col h-[calc(100vh-200px)]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="sticky top-0 z-10 bg-background pt-1 pb-2 border-b">
            <TabsList className="w-full grid grid-cols-7 h-auto p-1 rounded-[5px]" disabled={loading}>
              <TabsTrigger
                value="types"
                className="py-1.5 flex gap-1 items-center text-xs rounded-[5px]"
                disabled={loading}
              >
                <ListFilter className="h-3 w-3" />
                <span>Types</span>
              </TabsTrigger>
              <TabsTrigger
                value="basic"
                className="py-1.5 flex gap-1 items-center text-xs rounded-[5px]"
                disabled={loading}
              >
                <Car className="h-3 w-3" />
                <span>Basic Info</span>
              </TabsTrigger>
              <TabsTrigger
                value="technical"
                className="py-1.5 flex gap-1 items-center text-xs rounded-[5px]"
                disabled={loading}
              >
                <Settings className="h-3 w-3" />
                <span>Technical</span>
              </TabsTrigger>
              <TabsTrigger
                value="features"
                className="py-1.5 flex gap-1 items-center text-xs rounded-[5px]"
                disabled={loading}
              >
                <Check className="h-3 w-3" />
                <span>Features</span>
              </TabsTrigger>
              <TabsTrigger
                value="additional"
                className="py-1.5 flex gap-1 items-center text-xs rounded-[5px]"
                disabled={loading}
              >
                <Info className="h-3 w-3" />
                <span>Additional</span>
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="py-1.5 flex gap-1 items-center text-xs rounded-[5px]"
                disabled={loading}
              >
                <Settings className="h-3 w-3" />
                <span>Specs</span>
              </TabsTrigger>
              <TabsTrigger
                value="images"
                className="py-1.5 flex gap-1 items-center text-xs rounded-[5px]"
                disabled={loading}
              >
                <ImageIcon className="h-3 w-3" />
                <span>Images</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-auto">
            {/* ==================== TYPES TAB (NEW) ==================== */}
            <TabsContent value="types" className="mt-2 h-full">
              <Card className="h-full rounded-[5px] shadow-sm border-brand-primary/10">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base text-brand-primary flex items-center">
                    <ListFilter className="h-4 w-4 mr-2" />
                    Car Types Selection
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Select all the types for your car in English and Arabic
                  </CardDescription>
                </CardHeader>

                <Tabs value={activeLang} onValueChange={setActiveLang} className="flex-1">
                  <div className="px-4 pt-2">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="english">English</TabsTrigger>
                      <TabsTrigger value="arabic">العربية</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="english" className="m-0">
                    <CardContent className="space-y-4 py-2 px-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Condition Field - Using dynamic data from context */}
                        <div className="space-y-1">
                          <Label htmlFor="condition" className="text-xs">
                            Condition
                          </Label>
                          <Select
                            onValueChange={handleConditionChange}
                            value={condition}
                            disabled={loading || conditionTypesLoading}
                          >
                            <SelectTrigger className="h-8 text-sm rounded-[5px]">
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent className="rounded-[5px]">
                              {conditionTypesLoading ? (
                                <SelectItem value="loading" disabled>
                                  Loading...
                                </SelectItem>
                              ) : (
                                conditionTypes?.map((type) => (
                                  <SelectItem key={type?.id} value={type?.title || `condition-${type?.id}`}>
                                    {type?.title}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Body Type Field - Using dynamic data from context */}
                        <div className="space-y-1">
                          <Label htmlFor="bodyType" className="text-xs">
                            Body Type
                          </Label>
                          <Select
                            onValueChange={handleBodyTypeChange}
                            value={bodyType}
                            disabled={loading || bodyTypesLoading}
                          >
                            <SelectTrigger className="h-8 text-sm rounded-[5px]">
                              <SelectValue placeholder="Select body type" />
                            </SelectTrigger>
                            <SelectContent className="rounded-[5px]">
                              {bodyTypesLoading ? (
                                <SelectItem value="loading" disabled>
                                  Loading...
                                </SelectItem>
                              ) : (
                                bodyTypes?.map((type) => (
                                  <SelectItem key={type?.id} value={type?.title || `bodyType-${type?.id}`}>
                                    {type?.title}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Fuel Type Field - Using dynamic data from context */}
                        <div className="space-y-1">
                          <Label htmlFor="fuelType" className="text-xs">
                            Fuel Type
                          </Label>
                          <Select
                            onValueChange={handleFuelTypeChange}
                            value={fuelType}
                            disabled={loading || fuelTypesLoading}
                          >
                            <SelectTrigger className="h-8 text-sm rounded-[5px]">
                              <SelectValue placeholder="Select fuel type" />
                            </SelectTrigger>
                            <SelectContent className="rounded-[5px]">
                              {fuelTypesLoading ? (
                                <SelectItem value="loading" disabled>
                                  Loading...
                                </SelectItem>
                              ) : (
                                fuelTypes?.map((type) => (
                                  <SelectItem key={type?.id} value={type?.title || `fuelType-${type?.id}`}>
                                    {type?.title}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Transmission Field - Using dynamic data from context */}
                        <div className="space-y-1">
                          <Label htmlFor="transmission" className="text-xs">
                            Transmission
                          </Label>
                          <Select
                            onValueChange={handleTransmissionChange}
                            value={transmission}
                            disabled={loading || transmissionTypesLoading}
                          >
                            <SelectTrigger className="h-8 text-sm rounded-[5px]">
                              <SelectValue placeholder="Select transmission" />
                            </SelectTrigger>
                            <SelectContent className="rounded-[5px]">
                              {transmissionTypesLoading ? (
                                <SelectItem value="loading" disabled>
                                  Loading...
                                </SelectItem>
                              ) : (
                                transmissionTypes?.map((type) => (
                                  <SelectItem key={type?.id} value={type?.title || `transmission-${type?.id}`}>
                                    {type?.title}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Wheel Drive Field - Using dynamic data from context */}
                        <div className="space-y-1">
                          <Label htmlFor="wheelDrive" className="text-xs">
                            Wheel Drive
                          </Label>
                          <Select
                            onValueChange={handleWheelDriveChange}
                            value={wheelDrive}
                            disabled={loading || wheelDriveTypesLoading}
                          >
                            <SelectTrigger className="h-8 text-sm rounded-[5px]">
                              <SelectValue placeholder="Select wheel drive" />
                            </SelectTrigger>
                            <SelectContent className="rounded-[5px]">
                              {wheelDriveTypesLoading ? (
                                <SelectItem value="loading" disabled>
                                  Loading...
                                </SelectItem>
                              ) : (
                                wheelDriveTypes?.map((type) => (
                                  <SelectItem key={type?.id} value={type?.title || `wheelDrive-${type?.id}`}>
                                    {type?.title}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Safety Rating Field - Using dynamic data from context */}
                        <div className="space-y-1">
                          <Label htmlFor="safetyRating" className="text-xs">
                            Safety Rating
                          </Label>
                          <Select
                            onValueChange={handleSafetyRatingChange}
                            value={safetyRating}
                            disabled={loading || safetyRatingsLoading}
                          >
                            <SelectTrigger className="h-8 text-sm rounded-[5px]">
                              <SelectValue placeholder="Select safety rating" />
                            </SelectTrigger>
                            <SelectContent className="rounded-[5px]">
                              {safetyRatingsLoading ? (
                                <SelectItem value="loading" disabled>
                                  Loading...
                                </SelectItem>
                              ) : (
                                safetyRatings?.map((rating) => (
                                  <SelectItem key={rating?.id} value={rating?.title || `safety-${rating?.id}`}>
                                    {rating?.title}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Insurance Status Field - Using dynamic data from context */}
                        <div className="space-y-1">
                          <Label htmlFor="insuranceStatus" className="text-xs">
                            Insurance Status
                          </Label>
                          <Select
                            onValueChange={handleInsuranceStatusChange}
                            value={insuranceStatus}
                            disabled={loading || insuranceStatusesLoading}
                          >
                            <SelectTrigger className="h-8 text-sm rounded-[5px]">
                              <SelectValue placeholder="Select insurance status" />
                            </SelectTrigger>
                            <SelectContent className="rounded-[5px]">
                              {insuranceStatusesLoading ? (
                                <SelectItem value="loading" disabled>
                                  Loading...
                                </SelectItem>
                              ) : (
                                insuranceStatuses?.map((status) => (
                                  <SelectItem key={status.id} value={status?.title || `insurance-${status?.id}`}>
                                    {status?.title}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </TabsContent>

                  <TabsContent value="arabic" className="m-0">
                    <CardContent className="space-y-4 py-2 px-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Arabic Condition Field - Using dynamic data from context */}
                        <div className="space-y-1">
                          <Label htmlFor="condition_ar" className="text-xs">
                            Condition (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Select
                            onValueChange={handleConditionArChange}
                            value={condition_ar}
                            disabled={loading || conditionTypesLoading}
                          >
                            <SelectTrigger className="h-8 text-sm rounded-[5px] text-right" dir="rtl">
                              <SelectValue placeholder="اختر الحالة" />
                            </SelectTrigger>
                            <SelectContent className="rounded-[5px]" dir="rtl">
                              {conditionTypesLoading ? (
                                <SelectItem value="loading" disabled>
                                  جاري التحميل...
                                </SelectItem>
                              ) : (
                                conditionTypes?.map((type) => (
                                  <SelectItem key={type?.id} value={type?.title_ar || `condition-ar-${type?.id}`}>
                                    {type?.title_ar}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Arabic Body Type Field - Using dynamic data from context */}
                        <div className="space-y-1">
                          <Label htmlFor="bodyType_ar" className="text-xs">
                            Body Type (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Select
                            onValueChange={handleBodyTypeArChange}
                            value={bodyType_ar}
                            disabled={loading || bodyTypesLoading}
                          >
                            <SelectTrigger className="h-8 text-sm rounded-[5px] text-right" dir="rtl">
                              <SelectValue placeholder="اختر نوع الهيكل" />
                            </SelectTrigger>
                            <SelectContent className="rounded-[5px]" dir="rtl">
                              {bodyTypesLoading ? (
                                <SelectItem value="loading" disabled>
                                  جاري التحميل...
                                </SelectItem>
                              ) : (
                                bodyTypes?.map((type) => (
                                  <SelectItem key={type?.id} value={type?.title_ar || `bodyType-ar-${type?.id}`}>
                                    {type?.title_ar}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Arabic Fuel Type Field - Using dynamic data from context */}
                        <div className="space-y-1">
                          <Label htmlFor="fuelType_ar" className="text-xs">
                            Fuel Type (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Select
                            onValueChange={handleFuelTypeArChange}
                            value={fuelType_ar}
                            disabled={loading || fuelTypesLoading}
                          >
                            <SelectTrigger className="h-8 text-sm rounded-[5px] text-right" dir="rtl">
                              <SelectValue placeholder="اختر نوع الوقود" />
                            </SelectTrigger>
                            <SelectContent className="rounded-[5px]" dir="rtl">
                              {fuelTypesLoading ? (
                                <SelectItem value="loading" disabled>
                                  جاري التحميل...
                                </SelectItem>
                              ) : (
                                fuelTypes?.map((type) => (
                                  <SelectItem key={type?.id} value={type?.title_ar || `fuelType-ar-${type?.id}`}>
                                    {type?.title_ar}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Arabic Transmission Field - Using dynamic data from context */}
                        <div className="space-y-1">
                          <Label htmlFor="transmission_ar" className="text-xs">
                            Transmission (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Select
                            onValueChange={handleTransmissionArChange}
                            value={transmission_ar}
                            disabled={loading || transmissionTypesLoading}
                          >
                            <SelectTrigger className="h-8 text-sm rounded-[5px] text-right" dir="rtl">
                              <SelectValue placeholder="اختر ناقل الحركة" />
                            </SelectTrigger>
                            <SelectContent className="rounded-[5px]" dir="rtl">
                              {transmissionTypesLoading ? (
                                <SelectItem value="loading" disabled>
                                  جاري التحميل...
                                </SelectItem>
                              ) : (
                                transmissionTypes?.map((type) => (
                                  <SelectItem key={type?.id} value={type?.title_ar || `transmission-ar-${type?.id}`}>
                                    {type?.title_ar}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Arabic Wheel Drive Field - Using dynamic data from context */}
                        <div className="space-y-1">
                          <Label htmlFor="wheelDrive_ar" className="text-xs">
                            Wheel Drive (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Select
                            onValueChange={handleWheelDriveArChange}
                            value={wheelDrive_ar}
                            disabled={loading || wheelDriveTypesLoading}
                          >
                            <SelectTrigger className="h-8 text-sm rounded-[5px] text-right" dir="rtl">
                              <SelectValue placeholder="اختر نظام الدفع" />
                            </SelectTrigger>
                            <SelectContent className="rounded-[5px]" dir="rtl">
                              {wheelDriveTypesLoading ? (
                                <SelectItem value="loading" disabled>
                                  جاري التحميل...
                                </SelectItem>
                              ) : (
                                wheelDriveTypes?.map((type) => (
                                  <SelectItem key={type.id} value={type?.title_ar || `wheelDrive-ar-${type?.id}`}>
                                    {type?.title_ar}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Arabic Safety Rating Field - Using dynamic data from context */}
                        <div className="space-y-1">
                          <Label htmlFor="safetyRating_ar" className="text-xs">
                            Safety Rating (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Select
                            onValueChange={handleSafetyRatingArChange}
                            value={safetyRating_ar}
                            disabled={loading || safetyRatingsLoading}
                          >
                            <SelectTrigger className="h-8 text-sm rounded-[5px] text-right" dir="rtl">
                              <SelectValue placeholder="اختر تصنيف السلامة" />
                            </SelectTrigger>
                            <SelectContent className="rounded-[5px]" dir="rtl">
                              {safetyRatingsLoading ? (
                                <SelectItem value="loading" disabled>
                                  جاري التحميل...
                                </SelectItem>
                              ) : (
                                safetyRatings?.map((rating) => (
                                  <SelectItem key={rating?.id} value={rating?.title_ar || `safety-ar-${rating?.id}`}>
                                    {rating?.title_ar}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Arabic Insurance Status Field - Using dynamic data from context */}
                        <div className="space-y-1">
                          <Label htmlFor="insuranceStatus_ar" className="text-xs">
                            Insurance Status (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Select
                            onValueChange={handleInsuranceStatusArChange}
                            value={insuranceStatus_ar}
                            disabled={loading || insuranceStatusesLoading}
                          >
                            <SelectTrigger className="h-8 text-sm rounded-[5px] text-right" dir="rtl">
                              <SelectValue placeholder="اختر حالة التأمين" />
                            </SelectTrigger>
                            <SelectContent className="rounded-[5px]" dir="rtl">
                              {insuranceStatusesLoading ? (
                                <SelectItem value="loading" disabled>
                                  جاري التحميل...
                                </SelectItem>
                              ) : (
                                insuranceStatuses?.map((status) => (
                                  <SelectItem key={status?.id} value={status?.title_ar || `insurance-ar-${status?.id}`}>
                                    {status?.title_ar}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </TabsContent>
                </Tabs>

                <CardFooter className="flex justify-end py-3 px-4 border-t bg-muted/20">
                  <Button
                    type="button"
                    onClick={goToNextTab}
                    size="sm"
                    disabled={loading}
                    className="h-8 text-xs rounded-[5px] bg-brand-primary hover:bg-brand-primary/90"
                  >
                    Next: Basic Information
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* ==================== BASIC INFORMATION TAB ==================== */}
            <TabsContent value="basic" className="mt-2 h-full">
              <Card className="h-full rounded-[5px] shadow-sm border-brand-primary/10">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base text-brand-primary flex items-center">
                    <Car className="h-4 w-4 mr-2" />
                    Basic Information
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Enter the essential details about the car in English (required) and Arabic (optional)
                  </CardDescription>
                </CardHeader>

                <Tabs value={activeLang} onValueChange={setActiveLang} className="flex-1">
                  <div className="px-4 pt-2">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="english">English</TabsTrigger>
                      <TabsTrigger value="arabic">العربية</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="english" className="m-0">
                    <CardContent className="space-y-3 py-2 px-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Model Field */}
                        <div className="space-y-1">
                          <Label htmlFor="model" className="text-xs">
                            Model <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="model"
                            placeholder="e.g. Camry, Civic, Model 3"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            required
                            className="h-8 text-sm rounded-[5px]"
                            disabled={loading}
                          />
                        </div>

                        {/* Brand Field */}
                        <div className="space-y-1">
                          <Label htmlFor="brand" className="text-xs">
                            Brand <span className="text-destructive">*</span>
                          </Label>
                          <Select onValueChange={setBrandId} value={brandId} required disabled={loading}>
                            <SelectTrigger className="h-8 text-sm rounded-[5px]">
                              <SelectValue placeholder="Select a brand" />
                            </SelectTrigger>
                            <SelectContent className="rounded-[5px]">
                              {brands.map((brand) => (
                                <SelectItem key={brand.id} value={brand.id}>
                                  {brand.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Year Field */}
                        <div className="space-y-1">
                          <Label htmlFor="year" className="text-xs">
                            Year <span className="text-destructive">*</span>
                          </Label>
                          <Select onValueChange={setYear} value={year} required disabled={loading}>
                            <SelectTrigger className="h-8 text-sm rounded-[5px]">
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent className="rounded-[5px]">
                              {YEARS.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Price Field */}
                        <div className="space-y-1">
                          <Label htmlFor="price" className="text-xs">
                            Price
                          </Label>
                          <Input
                            id="price"
                            type="number"
                            placeholder="Enter price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="h-8 text-sm rounded-[5px]"
                            disabled={loading}
                          />
                        </div>

                        {/* Color Field */}
                        <div className="space-y-1">
                          <Label htmlFor="color" className="text-xs">
                            Color
                          </Label>
                          <Input
                            id="color"
                            placeholder="e.g. Red, Blue, Silver"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="h-8 text-sm rounded-[5px]"
                            disabled={loading}
                          />
                        </div>
                      </div>

                      {/* Description Field */}
                      <div className="space-y-1">
                        <Label htmlFor="description" className="text-xs">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Enter a detailed description of the car"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={3}
                          className="text-sm resize-none rounded-[5px]"
                          disabled={loading}
                        />
                      </div>
                    </CardContent>
                  </TabsContent>

                  <TabsContent value="arabic" className="m-0">
                    <CardContent className="space-y-3 py-2 px-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Arabic Model Field */}
                        <div className="space-y-1">
                          <Label htmlFor="model_ar" className="text-xs">
                            Model (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Input
                            id="model_ar"
                            placeholder="أدخل الطراز"
                            value={model_ar}
                            onChange={(e) => setModelAr(e.target.value)}
                            className="h-8 text-sm rounded-[5px] text-right"
                            disabled={loading}
                            dir="rtl"
                          />
                        </div>

                        {/* Arabic Year Field */}
                        <div className="space-y-1">
                          <Label htmlFor="year_ar" className="text-xs">
                            Year (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Input
                            id="year_ar"
                            placeholder="أدخل السنة"
                            value={year_ar}
                            onChange={(e) => setYearAr(e.target.value)}
                            className="h-8 text-sm rounded-[5px] text-right"
                            disabled={loading}
                            dir="rtl"
                          />
                        </div>

                        {/* Arabic Price Field */}
                        <div className="space-y-1">
                          <Label htmlFor="price_ar" className="text-xs">
                            Price (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Input
                            id="price_ar"
                            placeholder="أدخل السعر"
                            value={price_ar}
                            onChange={(e) => setPriceAr(e.target.value)}
                            className="h-8 text-sm rounded-[5px] text-right"
                            disabled={loading}
                            dir="rtl"
                          />
                        </div>

                        {/* Arabic Color Field */}
                        <div className="space-y-1">
                          <Label htmlFor="color_ar" className="text-xs">
                            Color (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Input
                            id="color_ar"
                            placeholder="أدخل اللون"
                            value={color_ar}
                            onChange={(e) => setColorAr(e.target.value)}
                            className="h-8 text-sm rounded-[5px] text-right"
                            disabled={loading}
                            dir="rtl"
                          />
                        </div>
                      </div>

                      {/* Arabic Description Field */}
                      <div className="space-y-1">
                        <Label htmlFor="description_ar" className="text-xs">
                          Description (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                        </Label>
                        <Textarea
                          id="description_ar"
                          placeholder="أدخل وصفًا مفصلاً للسيارة"
                          value={description_ar}
                          onChange={(e) => setDescriptionAr(e.target.value)}
                          rows={3}
                          className="text-sm resize-none rounded-[5px] text-right"
                          disabled={loading}
                          dir="rtl"
                        />
                      </div>
                    </CardContent>
                  </TabsContent>
                </Tabs>

                <CardFooter className="flex justify-between py-3 px-4 border-t bg-muted/20">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPrevTab}
                    size="sm"
                    disabled={loading}
                    className="h-8 text-xs rounded-[5px]"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={goToNextTab}
                    size="sm"
                    disabled={loading}
                    className="h-8 text-xs rounded-[5px] bg-brand-primary hover:bg-brand-primary/90"
                  >
                    Next: Technical Specifications
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* ==================== TECHNICAL SPECIFICATIONS TAB ==================== */}
            <TabsContent value="technical" className="mt-2 h-full">
              <Card className="h-full rounded-[5px] shadow-sm border-brand-primary/10">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base text-brand-primary flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Technical Specifications
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Enter the technical details of the car in English (required) and Arabic (optional)
                  </CardDescription>
                </CardHeader>

                <Tabs value={activeLang} onValueChange={setActiveLang} className="flex-1">
                  <div className="px-4 pt-2">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="english">English</TabsTrigger>
                      <TabsTrigger value="arabic">العربية</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="english" className="m-0">
                    <CardContent className="space-y-3 py-2 px-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {/* Mileage Field */}
                        <div className="space-y-1">
                          <Label htmlFor="mileage" className="text-xs">
                            Mileage (km)
                          </Label>
                          <Input
                            id="mileage"
                            type="number"
                            placeholder="e.g. 15000"
                            value={mileage}
                            onChange={(e) => setMileage(e.target.value)}
                            className="h-8 text-sm rounded-[5px]"
                            disabled={loading}
                          />
                        </div>

                        {/* Fuel Tank Capacity Field */}
                        <div className="space-y-1">
                          <Label htmlFor="fuelTankCapacity" className="text-xs">
                            Fuel Tank (L)
                          </Label>
                          <Input
                            id="fuelTankCapacity"
                            type="text"
                            placeholder="e.g. 60"
                            value={fuelTankCapacity}
                            onChange={(e) => setFuelTankCapacity(e.target.value)}
                            className="h-8 text-sm rounded-[5px]"
                            disabled={loading}
                          />
                        </div>

                        {/* Engine Size Field */}
                        <div className="space-y-1">
                          <Label htmlFor="engineSize" className="text-xs">
                            Engine Size (L)
                          </Label>
                          <Input
                            id="engineSize"
                            type="number"
                            step="0.1"
                            placeholder="e.g. 2.0"
                            value={engineSize}
                            onChange={(e) => setEngineSize(e.target.value)}
                            className="h-8 text-sm rounded-[5px]"
                            disabled={loading}
                          />
                        </div>

                        {/* Horsepower Field */}
                        <div className="space-y-1">
                          <Label htmlFor="horsepower" className="text-xs">
                            Horsepower (HP)
                          </Label>
                          <Input
                            id="horsepower"
                            type="number"
                            placeholder="e.g. 180"
                            value={horsepower}
                            onChange={(e) => setHorsepower(e.target.value)}
                            className="h-8 text-sm rounded-[5px]"
                            disabled={loading}
                          />
                        </div>

                        {/* Torque Field */}
                        <div className="space-y-1">
                          <Label htmlFor="torque" className="text-xs">
                            Torque (Nm)
                          </Label>
                          <Input
                            id="torque"
                            type="number"
                            placeholder="e.g. 240"
                            value={torque}
                            onChange={(e) => setTorque(e.target.value)}
                            className="h-8 text-sm rounded-[5px]"
                            disabled={loading}
                          />
                        </div>

                        {/* Top Speed Field */}
                        <div className="space-y-1">
                          <Label htmlFor="topSpeed" className="text-xs">
                            Top Speed (km/h)
                          </Label>
                          <Input
                            id="topSpeed"
                            type="number"
                            placeholder="e.g. 220"
                            value={topSpeed}
                            onChange={(e) => setTopSpeed(e.target.value)}
                            className="h-8 text-sm rounded-[5px]"
                            disabled={loading}
                          />
                        </div>

                        {/* Acceleration Field */}
                        <div className="space-y-1">
                          <Label htmlFor="acceleration" className="text-xs">
                            0-100 km/h (s)
                          </Label>
                          <Input
                            id="acceleration"
                            type="number"
                            step="0.1"
                            placeholder="e.g. 8.5"
                            value={acceleration}
                            onChange={(e) => setAcceleration(e.target.value)}
                            className="h-8 text-sm rounded-[5px]"
                            disabled={loading}
                          />
                        </div>

                        {/* Fuel Economy Field */}
                        <div className="space-y-1">
                          <Label htmlFor="fuelEconomy" className="text-xs">
                            Fuel Economy (km/L)
                          </Label>
                          <Input
                            id="fuelEconomy"
                            type="number"
                            step="0.1"
                            placeholder="e.g. 15.5"
                            value={fuelEconomy}
                            onChange={(e) => setFuelEconomy(e.target.value)}
                            className="h-8 text-sm rounded-[5px]"
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </TabsContent>

                  <TabsContent value="arabic" className="m-0">
                    <CardContent className="space-y-3 py-2 px-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {/* Arabic Mileage Field */}
                        <div className="space-y-1">
                          <Label htmlFor="mileage_ar" className="text-xs">
                            Mileage (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Input
                            id="mileage_ar"
                            placeholder="أدخل المسافة المقطوعة"
                            value={mileage_ar}
                            onChange={(e) => setMileageAr(e.target.value)}
                            className="h-8 text-sm rounded-[5px] text-right"
                            disabled={loading}
                            dir="rtl"
                          />
                        </div>

                        {/* Arabic Fuel Tank Capacity Field */}
                        <div className="space-y-1">
                          <Label htmlFor="fuelTankCapacity_ar" className="text-xs">
                            Fuel Tank (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Input
                            id="fuelTankCapacity_ar"
                            placeholder="أدخل سعة خزان الوقود"
                            value={fuelTankCapacity_ar}
                            onChange={(e) => setFuelTankCapacityAr(e.target.value)}
                            className="h-8 text-sm rounded-[5px] text-right"
                            disabled={loading}
                            dir="rtl"
                          />
                        </div>

                        {/* Arabic Engine Size Field */}
                        <div className="space-y-1">
                          <Label htmlFor="engineSize_ar" className="text-xs">
                            Engine Size (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Input
                            id="engineSize_ar"
                            placeholder="أدخل حجم المحرك"
                            value={engineSize_ar}
                            onChange={(e) => setEngineSizeAr(e.target.value)}
                            className="h-8 text-sm rounded-[5px] text-right"
                            disabled={loading}
                            dir="rtl"
                          />
                        </div>

                        {/* Arabic Horsepower Field */}
                        <div className="space-y-1">
                          <Label htmlFor="horsepower_ar" className="text-xs">
                            Horsepower (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Input
                            id="horsepower_ar"
                            placeholder="أدخل قوة المحرك"
                            value={horsepower_ar}
                            onChange={(e) => setHorsepowerAr(e.target.value)}
                            className="h-8 text-sm rounded-[5px] text-right"
                            disabled={loading}
                            dir="rtl"
                          />
                        </div>

                        {/* Arabic Torque Field */}
                        <div className="space-y-1">
                          <Label htmlFor="torque_ar" className="text-xs">
                            Torque (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Input
                            id="torque_ar"
                            placeholder="أدخل عزم الدوران"
                            value={torque_ar}
                            onChange={(e) => setTorqueAr(e.target.value)}
                            className="h-8 text-sm rounded-[5px] text-right"
                            disabled={loading}
                            dir="rtl"
                          />
                        </div>

                        {/* Arabic Top Speed Field */}
                        <div className="space-y-1">
                          <Label htmlFor="topSpeed_ar" className="text-xs">
                            Top Speed (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Input
                            id="topSpeed_ar"
                            placeholder="أدخل السرعة القصوى"
                            value={topSpeed_ar}
                            onChange={(e) => setTopSpeedAr(e.target.value)}
                            className="h-8 text-sm rounded-[5px] text-right"
                            disabled={loading}
                            dir="rtl"
                          />
                        </div>

                        {/* Arabic Acceleration Field */}
                        <div className="space-y-1">
                          <Label htmlFor="acceleration_ar" className="text-xs">
                            Acceleration (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Input
                            id="acceleration_ar"
                            placeholder="أدخل التسارع"
                            value={acceleration_ar}
                            onChange={(e) => setAccelerationAr(e.target.value)}
                            className="h-8 text-sm rounded-[5px] text-right"
                            disabled={loading}
                            dir="rtl"
                          />
                        </div>

                        {/* Arabic Fuel Economy Field */}
                        <div className="space-y-1">
                          <Label htmlFor="fuelEconomy_ar" className="text-xs">
                            Fuel Economy (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Input
                            id="fuelEconomy_ar"
                            placeholder="أدخل اقتصاد الوقود"
                            value={fuelEconomy_ar}
                            onChange={(e) => setFuelEconomyAr(e.target.value)}
                            className="h-8 text-sm rounded-[5px] text-right"
                            disabled={loading}
                            dir="rtl"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </TabsContent>
                </Tabs>

                <CardFooter className="flex justify-between py-3 px-4 border-t bg-muted/20">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPrevTab}
                    size="sm"
                    disabled={loading}
                    className="h-8 text-xs rounded-[5px]"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={goToNextTab}
                    size="sm"
                    disabled={loading}
                    className="h-8 text-xs rounded-[5px] bg-brand-primary hover:bg-brand-primary/90"
                  >
                    Next: Features & Comfort
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* ==================== FEATURES & COMFORT TAB ==================== */}
            <TabsContent value="features" className="mt-2 h-full">
              <Card className="h-full rounded-[5px] shadow-sm border-brand-primary/10">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base text-brand-primary flex items-center">
                    <Check className="h-4 w-4 mr-2" />
                    Features & Comfort
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Specify the features and comfort options of the car in English (required) and Arabic (optional)
                  </CardDescription>
                </CardHeader>

                <Tabs value={activeLang} onValueChange={setActiveLang} className="flex-1">
                  <div className="px-4 pt-2">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="english">English</TabsTrigger>
                      <TabsTrigger value="arabic">العربية</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="english" className="m-0">
                    <CardContent className="py-2 px-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            {/* Seats Field */}
                            <div className="space-y-1">
                              <Label htmlFor="seats" className="text-xs">
                                Number of Seats
                              </Label>
                              <Input
                                id="seats"
                                type="number"
                                placeholder="e.g. 5"
                                value={seats}
                                onChange={(e) => setSeats(e.target.value)}
                                className="h-8 text-sm rounded-[5px]"
                                disabled={loading}
                              />
                            </div>

                            {/* Doors Field */}
                            <div className="space-y-1">
                              <Label htmlFor="doors" className="text-xs">
                                Number of Doors
                              </Label>
                              <Input
                                id="doors"
                                type="number"
                                placeholder="e.g. 4"
                                value={doors}
                                onChange={(e) => setDoors(e.target.value)}
                                className="h-8 text-sm rounded-[5px]"
                                disabled={loading}
                              />
                            </div>
                          </div>

                          {/* Infotainment Field */}
                          <div className="space-y-1">
                            <Label htmlFor="infotainment" className="text-xs">
                              Infotainment System
                            </Label>
                            <Input
                              id="infotainment"
                              placeholder="e.g. 10-inch touchscreen with Apple CarPlay"
                              value={infotainment}
                              onChange={(e) => setInfotainment(e.target.value)}
                              className="h-8 text-sm rounded-[5px]"
                              disabled={loading}
                            />
                          </div>
                        </div>

                        {/* Features Checkboxes */}
                        <div className="space-y-2">
                          <h3 className="text-xs font-medium">Features</h3>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="gps"
                                checked={gps}
                                onCheckedChange={setGps}
                                className="h-3.5 w-3.5 rounded-[2px]"
                                disabled={loading}
                              />
                              <Label htmlFor="gps" className="cursor-pointer text-xs">
                                GPS Navigation
                              </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="sunroof"
                                checked={sunroof}
                                onCheckedChange={setSunroof}
                                className="h-3.5 w-3.5 rounded-[2px]"
                                disabled={loading}
                              />
                              <Label htmlFor="sunroof" className="cursor-pointer text-xs">
                                Sunroof
                              </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="parkingSensors"
                                checked={parkingSensors}
                                onCheckedChange={setParkingSensors}
                                className="h-3.5 w-3.5 rounded-[2px]"
                                disabled={loading}
                              />
                              <Label htmlFor="parkingSensors" className="cursor-pointer text-xs">
                                Parking Sensors
                              </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="cruiseControl"
                                checked={cruiseControl}
                                onCheckedChange={setCruiseControl}
                                className="h-3.5 w-3.5 rounded-[2px]"
                                disabled={loading}
                              />
                              <Label htmlFor="cruiseControl" className="cursor-pointer text-xs">
                                Cruise Control
                              </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="leatherSeats"
                                checked={leatherSeats}
                                onCheckedChange={setLeatherSeats}
                                className="h-3.5 w-3.5 rounded-[2px]"
                                disabled={loading}
                              />
                              <Label htmlFor="leatherSeats" className="cursor-pointer text-xs">
                                Leather Seats
                              </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="heatedSeats"
                                checked={heatedSeats}
                                onCheckedChange={setHeatedSeats}
                                className="h-3.5 w-3.5 rounded-[2px]"
                                disabled={loading}
                              />
                              <Label htmlFor="heatedSeats" className="cursor-pointer text-xs">
                                Heated Seats
                              </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="bluetooth"
                                checked={bluetooth}
                                onCheckedChange={setBluetooth}
                                className="h-3.5 w-3.5 rounded-[2px]"
                                disabled={loading}
                              />
                              <Label htmlFor="bluetooth" className="cursor-pointer text-xs">
                                Bluetooth
                              </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="climateControl"
                                checked={climateControl}
                                onCheckedChange={setClimateControl}
                                className="h-3.5 w-3.5 rounded-[2px]"
                                disabled={loading}
                              />
                              <Label htmlFor="climateControl" className="cursor-pointer text-xs">
                                Climate Control
                              </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="keylessEntry"
                                checked={keylessEntry}
                                onCheckedChange={setKeylessEntry}
                                className="h-3.5 w-3.5 rounded-[2px]"
                                disabled={loading}
                              />
                              <Label htmlFor="keylessEntry" className="cursor-pointer text-xs">
                                Keyless Entry
                              </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="rearCamera"
                                checked={rearCamera}
                                onCheckedChange={setRearCamera}
                                className="h-3.5 w-3.5 rounded-[2px]"
                                disabled={loading}
                              />
                              <Label htmlFor="rearCamera" className="cursor-pointer text-xs">
                                Rear Camera
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </TabsContent>

                  <TabsContent value="arabic" className="m-0">
                    <CardContent className="py-2 px-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            {/* Arabic Seats Field */}
                            <div className="space-y-1">
                              <Label htmlFor="seats_ar" className="text-xs">
                                Seats (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                              </Label>
                              <Input
                                id="seats_ar"
                                placeholder="أدخل عدد المقاعد"
                                value={seats_ar}
                                onChange={(e) => setSeatsAr(e.target.value)}
                                className="h-8 text-sm rounded-[5px] text-right"
                                disabled={loading}
                                dir="rtl"
                              />
                            </div>

                            {/* Arabic Doors Field */}
                            <div className="space-y-1">
                              <Label htmlFor="doors_ar" className="text-xs">
                                Doors (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                              </Label>
                              <Input
                                id="doors_ar"
                                placeholder="أدخل عدد الأبواب"
                                value={doors_ar}
                                onChange={(e) => setDoorsAr(e.target.value)}
                                className="h-8 text-sm rounded-[5px] text-right"
                                disabled={loading}
                                dir="rtl"
                              />
                            </div>
                          </div>

                          {/* Arabic Infotainment Field */}
                          <div className="space-y-1">
                            <Label htmlFor="infotainment_ar" className="text-xs">
                              Infotainment (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                            </Label>
                            <Input
                              id="infotainment_ar"
                              placeholder="أدخل نظام المعلومات والترفيه"
                              value={infotainment_ar}
                              onChange={(e) => setInfotainmentAr(e.target.value)}
                              className="h-8 text-sm rounded-[5px] text-right"
                              disabled={loading}
                              dir="rtl"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-xs font-medium text-right" dir="rtl">
                            الميزات
                          </h3>
                          <p className="text-xs text-muted-foreground text-right" dir="rtl">
                            ملاحظة: يتم استخدام نفس الميزات للغتين الإنجليزية والعربية
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </TabsContent>
                </Tabs>

                <CardFooter className="flex justify-between py-3 px-4 border-t bg-muted/20">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPrevTab}
                    size="sm"
                    disabled={loading}
                    className="h-8 text-xs rounded-[5px]"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={goToNextTab}
                    size="sm"
                    disabled={loading}
                    className="h-8 text-xs rounded-[5px] bg-brand-primary hover:bg-brand-primary/90"
                  >
                    Next: Additional Information
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* ==================== ADDITIONAL INFORMATION TAB ==================== */}
            <TabsContent value="additional" className="mt-2 h-full">
              <Card className="h-full rounded-[5px] shadow-sm border-brand-primary/10">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base text-brand-primary flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    Additional Information
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Provide additional details about the car in English (required) and Arabic (optional)
                  </CardDescription>
                </CardHeader>

                <Tabs value={activeLang} onValueChange={setActiveLang} className="flex-1">
                  <div className="px-4 pt-2">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="english">English</TabsTrigger>
                      <TabsTrigger value="arabic">العربية</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="english" className="m-0">
                    <CardContent className="space-y-3 py-2 px-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Manufactured Field */}
                        <div className="space-y-1">
                          <Label htmlFor="manufactured" className="text-xs">
                            Manufactured In
                          </Label>
                          <Input
                            id="manufactured"
                            placeholder="e.g. Japan, Germany"
                            value={manufactured}
                            onChange={(e) => setManufactured(e.target.value)}
                            className="h-8 text-sm rounded-[5px]"
                            disabled={loading}
                          />
                        </div>

                        {/* Warranty Field */}
                        <div className="space-y-1">
                          <Label htmlFor="warranty" className="text-xs">
                            Warranty
                          </Label>
                          <Input
                            id="warranty"
                            placeholder="e.g. 3 years/100,000 km"
                            value={warranty}
                            onChange={(e) => setWarranty(e.target.value)}
                            className="h-8 text-sm rounded-[5px]"
                            disabled={loading}
                          />
                        </div>

                        {/* Registration Field */}
                        <div className="space-y-1">
                          <Label htmlFor="registration" className="text-xs">
                            Registration
                          </Label>
                          <Input
                            id="registration"
                            placeholder="e.g. ABC-123"
                            value={registration}
                            onChange={(e) => setRegistration(e.target.value)}
                            className="h-8 text-sm rounded-[5px]"
                            disabled={loading}
                          />
                        </div>

                        {/* Owner Count Field */}
                        <div className="space-y-1">
                          <Label htmlFor="ownerCount" className="text-xs">
                            Previous Owners
                          </Label>
                          <Input
                            id="ownerCount"
                            type="number"
                            placeholder="e.g. 1"
                            value={ownerCount}
                            onChange={(e) => setOwnerCount(e.target.value)}
                            className="h-8 text-sm rounded-[5px]"
                            disabled={loading}
                          />
                        </div>

                        {/* Tax Validity Field */}
                        <div className="space-y-1">
                          <Label htmlFor="taxValidity" className="text-xs">
                            Tax Validity
                          </Label>
                          <Input
                            id="taxValidity"
                            type="date"
                            value={taxValidity}
                            onChange={(e) => setTaxValidity(e.target.value)}
                            className="h-8 text-sm rounded-[5px]"
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </TabsContent>

                  <TabsContent value="arabic" className="m-0">
                    <CardContent className="space-y-3 py-2 px-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Arabic Manufactured Field */}
                        <div className="space-y-1">
                          <Label htmlFor="manufactured_ar" className="text-xs">
                            Manufactured In (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Input
                            id="manufactured_ar"
                            placeholder="أدخل بلد التصنيع"
                            value={manufactured_ar}
                            onChange={(e) => setManufacturedAr(e.target.value)}
                            className="h-8 text-sm rounded-[5px] text-right"
                            disabled={loading}
                            dir="rtl"
                          />
                        </div>

                        {/* Arabic Warranty Field */}
                        <div className="space-y-1">
                          <Label htmlFor="warranty_ar" className="text-xs">
                            Warranty (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Input
                            id="warranty_ar"
                            placeholder="أدخل الضمان"
                            value={warranty_ar}
                            onChange={(e) => setWarrantyAr(e.target.value)}
                            className="h-8 text-sm rounded-[5px] text-right"
                            disabled={loading}
                            dir="rtl"
                          />
                        </div>

                        {/* Arabic Registration Field */}
                        <div className="space-y-1">
                          <Label htmlFor="registration_ar" className="text-xs">
                            Registration (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Input
                            id="registration_ar"
                            placeholder="أدخل التسجيل"
                            value={registration_ar}
                            onChange={(e) => setRegistrationAr(e.target.value)}
                            className="h-8 text-sm rounded-[5px] text-right"
                            disabled={loading}
                            dir="rtl"
                          />
                        </div>

                        {/* Arabic Owner Count Field */}
                        <div className="space-y-1">
                          <Label htmlFor="ownerCount_ar" className="text-xs">
                            Previous Owners (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Input
                            id="ownerCount_ar"
                            placeholder="أدخل عدد المالكين السابقين"
                            value={ownerCount_ar}
                            onChange={(e) => setOwnerCountAr(e.target.value)}
                            className="h-8 text-sm rounded-[5px] text-right"
                            disabled={loading}
                            dir="rtl"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </TabsContent>
                </Tabs>

                <CardFooter className="flex justify-between py-3 px-4 border-t bg-muted/20">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPrevTab}
                    size="sm"
                    disabled={loading}
                    className="h-8 text-xs rounded-[5px]"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={goToNextTab}
                    size="sm"
                    disabled={loading}
                    className="h-8 text-xs rounded-[5px] bg-brand-primary hover:bg-brand-primary/90"
                  >
                    Next: Specifications
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* ==================== SPECIFICATIONS TAB ==================== */}
            <TabsContent value="specifications" className="mt-2 h-full">
              <Card className="h-full rounded-[5px] shadow-sm border-brand-primary/10">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base text-brand-primary flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Detailed Specifications
                  </CardTitle>
                  <CardDescription className="text-xs">Add detailed specifications for the car</CardDescription>
                </CardHeader>
                <CardContent className="py-2 px-4 overflow-auto" style={{ maxHeight: "calc(100vh - 280px)" }}>
                  <AddSpecifications
                    specifications={specifications}
                    addSpecDetail={addSpecDetail}
                    handleSpecDetailChange={handleSpecDetailChange}
                    removeSpecDetail={removeSpecDetail}
                    handleSpecTitleChange={handleSpecTitleChange}
                    addSpecification={addSpecification}
                    removeSpecification={removeSpecification}
                    disabled={loading}
                  />
                </CardContent>
                <CardFooter className="flex justify-between py-3 px-4 border-t bg-muted/20">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPrevTab}
                    size="sm"
                    disabled={loading}
                    className="h-8 text-xs rounded-[5px]"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={goToNextTab}
                    size="sm"
                    disabled={loading}
                    className="h-8 text-xs rounded-[5px] bg-brand-primary hover:bg-brand-primary/90"
                  >
                    Next: Images
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* ==================== IMAGES TAB ==================== */}
            <TabsContent value="images" className="mt-2 h-full">
              <Card className="h-full rounded-[5px] shadow-sm border-brand-primary/10">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base text-brand-primary flex items-center">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Car Images
                  </CardTitle>
                  <CardDescription className="text-xs">Upload and manage car images</CardDescription>
                </CardHeader>
                <CardContent className="py-2 px-4 overflow-auto" style={{ maxHeight: "calc(100vh - 280px)" }}>
                  <div className="space-y-3">
                    <MultipleImages images={images} setImages={setImages} disabled={loading} />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between py-3 px-4 border-t bg-muted/20">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPrevTab}
                    size="sm"
                    disabled={loading}
                    className="h-8 text-xs rounded-[5px]"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-8 text-xs gap-2 rounded-[5px] bg-brand-primary hover:bg-brand-primary/90"
                    size="sm"
                  >
                    {loading && <Loader2 className="h-3 w-3 animate-spin" />}
                    Add Car
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </form>
    </div>
  )
}
