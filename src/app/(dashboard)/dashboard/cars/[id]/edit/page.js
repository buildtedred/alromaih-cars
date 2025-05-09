"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Loader2, Car, ImageIcon, Settings, Info, Check, AlertCircle, FileText, ListFilter } from 'lucide-react'
import Link from "next/link"
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

import UpdateMultipleImages from "./updateMultipleImage/Multipleimages"
import EditeSpecifications from "./editSpecifications/EditeSpecifications"

// Import all the hooks from the types provider
import {
  useFuelTypes,
  useTransmissionTypes,
  useConditionTypes,
  useWheelDriveTypes,
  useBodyTypes,
  useSafetyRatings,
  useInsuranceStatuses,
} from "../../../context/types-provider/Types-provider"

// Years array for dropdown
const YEARS = Array.from({ length: 55 }, (_, i) => new Date().getFullYear() - i)

export default function UpdateCarForm() {
  const router = useRouter()
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState("types") // Start with types tab
  const [activeLang, setActiveLang] = useState("english")

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
  const [slug, setSlug] = useState("")

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
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [formProgress, setFormProgress] = useState(0)

  // Define the tab order for navigation
  const TAB_ORDER = ["types", "basic", "technical", "features", "additional", "specifications", "images"]

  // ==================== FETCH DATA FROM CONTEXT ====================
  // Get all types data from context
  const {
    fuelTypes,
    loading: fuelTypesLoading,
    findArabicValue: findFuelTypeArabic,
    findEnglishValue: findFuelTypeEnglish,
  } = useFuelTypes()

  const {
    transmissionTypes,
    loading: transmissionTypesLoading,
    findArabicValue: findTransmissionArabic,
    findEnglishValue: findTransmissionEnglish,
  } = useTransmissionTypes()

  const {
    conditionTypes,
    loading: conditionTypesLoading,
    findArabicValue: findConditionArabic,
    findEnglishValue: findConditionEnglish,
  } = useConditionTypes()

  const {
    wheelDriveTypes,
    loading: wheelDriveTypesLoading,
    findArabicValue: findWheelDriveArabic,
    findEnglishValue: findWheelDriveEnglish,
  } = useWheelDriveTypes()

  const {
    bodyTypes,
    loading: bodyTypesLoading,
    findArabicValue: findBodyTypeArabic,
    findEnglishValue: findBodyTypeEnglish,
  } = useBodyTypes()

  const {
    safetyRatings,
    loading: safetyRatingsLoading,
    findArabicValue: findSafetyRatingArabic,
    findEnglishValue: findSafetyRatingEnglish,
  } = useSafetyRatings()

  const {
    insuranceStatuses,
    loading: insuranceStatusesLoading,
    findArabicValue: findInsuranceStatusArabic,
    findEnglishValue: findInsuranceStatusEnglish,
  } = useInsuranceStatuses()

  // ==================== BILINGUAL SYNC HANDLERS ====================
  // These functions sync values between English and Arabic

  // Sync fuel type between languages
  const handleFuelTypeChange = (value) => {
    setFuelType(value)
    // Find and set the corresponding Arabic value
    setFuelTypeAr(findFuelTypeArabic(value))
  }

  const handleFuelTypeArChange = (value) => {
    setFuelTypeAr(value)
    // Find and set the corresponding English value
    setFuelType(findFuelTypeEnglish(value))
  }

  // Sync transmission between languages
  const handleTransmissionChange = (value) => {
    setTransmission(value)
    setTransmissionAr(findTransmissionArabic(value))
  }

  const handleTransmissionArChange = (value) => {
    setTransmissionAr(value)
    setTransmission(findTransmissionEnglish(value))
  }

  // Sync condition between languages
  const handleConditionChange = (value) => {
    setCondition(value)
    setConditionAr(findConditionArabic(value))
  }

  const handleConditionArChange = (value) => {
    setConditionAr(value)
    setCondition(findConditionEnglish(value))
  }

  // Sync wheel drive between languages
  const handleWheelDriveChange = (value) => {
    setWheelDrive(value)
    setWheelDriveAr(findWheelDriveArabic(value))
  }

  const handleWheelDriveArChange = (value) => {
    setWheelDriveAr(value)
    setWheelDrive(findWheelDriveEnglish(value))
  }

  // Sync body type between languages
  const handleBodyTypeChange = (value) => {
    setBodyType(value)
    setBodyTypeAr(findBodyTypeArabic(value))
  }

  const handleBodyTypeArChange = (value) => {
    setBodyTypeAr(value)
    setBodyType(findBodyTypeEnglish(value))
  }

  // Sync safety rating between languages
  const handleSafetyRatingChange = (value) => {
    setSafetyRating(value)
    setSafetyRatingAr(findSafetyRatingArabic(value))
  }

  const handleSafetyRatingArChange = (value) => {
    setSafetyRatingAr(value)
    setSafetyRating(findSafetyRatingEnglish(value))
  }

  // Sync insurance status between languages
  const handleInsuranceStatusChange = (value) => {
    setInsuranceStatus(value)
    setInsuranceStatusAr(findInsuranceStatusArabic(value))
  }

  const handleInsuranceStatusArChange = (value) => {
    setInsuranceStatusAr(value)
    setInsuranceStatus(findInsuranceStatusEnglish(value))
  }

  useEffect(() => {
    async function fetchCar() {
      try {
        setLoading(true)
        const response = await axios.get(`/api/supabasPrisma/cars/${id}`)
        const data = response.data

        // Basic Information - English
        setModel(data.model || "")
        setYear(data.year?.toString() || "")
        setBrandId(data.brandId || "")
        setDescription(data.description || "")
        setPrice(data.price?.toString() || "")
        setColor(data.color || "")
        setCondition(data.condition || "")
        setBodyType(data.bodyType || "")
        setSlug(data.slug || "")

        // Basic Information - Arabic
        setModelAr(data.model_ar || "")
        setYearAr(data.year_ar || "")
        setDescriptionAr(data.description_ar || "")
        setPriceAr(data.price_ar || "")
        setColorAr(data.color_ar || "")
        setConditionAr(data.condition_ar || "")
        setBodyTypeAr(data.bodyType_ar || "")

        // Technical Specifications - English
        setMileage(data.mileage?.toString() || "")
        setFuelType(data.fuelType || "")
        setFuelTankCapacity(data.fuelTankCapacity?.toString() || "")
        setTransmission(data.transmission || "")
        setEngineSize(data.engineSize?.toString() || "")
        setHorsepower(data.horsepower?.toString() || "")
        setTorque(data.torque?.toString() || "")
        setWheelDrive(data.wheelDrive || "")
        setTopSpeed(data.topSpeed?.toString() || "")
        setAcceleration(data.acceleration?.toString() || "")
        setFuelEconomy(data.fuelEconomy?.toString() || "")

        // Technical Specifications - Arabic
        setMileageAr(data.mileage_ar || "")
        setFuelTypeAr(data.fuelType_ar || "")
        setFuelTankCapacityAr(data.fuelTankCapacity_ar || "")
        setTransmissionAr(data.transmission_ar || "")
        setEngineSizeAr(data.engineSize_ar || "")
        setHorsepowerAr(data.horsepower_ar || "")
        setTorqueAr(data.torque_ar || "")
        setWheelDriveAr(data.wheelDrive_ar || "")
        setTopSpeedAr(data.topSpeed_ar || "")
        setAccelerationAr(data.acceleration_ar || "")
        setFuelEconomyAr(data.fuelEconomy_ar || "")

        // Features & Comfort - English
        setSeats(data.seats?.toString() || "")
        setDoors(data.doors?.toString() || "")
        setInfotainment(data.infotainment || "")

        // Features & Comfort - Arabic
        setSeatsAr(data.seats_ar || "")
        setDoorsAr(data.doors_ar || "")
        setInfotainmentAr(data.infotainment_ar || "")

        // Boolean features
        setGps(data.gps || false)
        setSunroof(data.sunroof || false)
        setParkingSensors(data.parkingSensors || false)
        setCruiseControl(data.cruiseControl || false)
        setLeatherSeats(data.leatherSeats || false)
        setHeatedSeats(data.heatedSeats || false)
        setBluetooth(data.bluetooth || false)
        setClimateControl(data.climateControl || false)
        setKeylessEntry(data.keylessEntry || false)
        setRearCamera(data.rearCamera || false)

        // Additional Information - English
        setManufactured(data.manufactured || "")
        setSafetyRating(data.safetyRating || "")
        setWarranty(data.warranty || "")
        setRegistration(data.registration || "")
        setOwnerCount(data.ownerCount?.toString() || "")
        setInsuranceStatus(data.insuranceStatus || "")
        setTaxValidity(data.taxValidity || "")

        // Additional Information - Arabic
        setManufacturedAr(data.manufactured_ar || "")
        setSafetyRatingAr(data.safetyRating_ar || "")
        setWarrantyAr(data.warranty_ar || "")
        setRegistrationAr(data.registration_ar || "")
        setOwnerCountAr(data.ownerCount_ar || "")
        setInsuranceStatusAr(data.insuranceStatus_ar || "")

        // Format images for the component
        const formattedImages =
          data.images?.map((imgUrl) => {
            // Extract the filename from the URL
            const fileName = imgUrl.split("/").pop()
            return {
              url: imgUrl,
              name: fileName, // Store the filename for reference
            }
          }) || []

        setImages(formattedImages)
        setSpecifications(data.specifications || data.spacification || [])
      } catch (error) {
        console.error("Error fetching car:", error)
        setError("Failed to load car data")
      } finally {
        setLoading(false)
      }
    }

    async function fetchBrands() {
      try {
        const response = await axios.get("/api/supabasPrisma/carbrands")
        setBrands(response?.data?.en || response?.data || [])
      } catch (error) {
        console.error("Error fetching brands:", error)
      }
    }

    fetchCar()
    fetchBrands()
  }, [id])

  // Periodically fetch updated types data
  useEffect(() => {
    // Initial fetch happens through the context provider

    // Set up polling to check for updates every 30 seconds
    const intervalId = setInterval(() => {
      // We don't need to do anything here as the context provider
      // will handle the fetching and updating of the types data
      // This is just to trigger a re-render if needed
    }, 30000) // 30 seconds

    return () => clearInterval(intervalId)
  }, [])

  // Calculate form completion progress
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

  // Specifications management
  const addSpecification = () => {
    setSpecifications([...specifications, { title: "", details: [] }])
  }

  const removeSpecification = (index) => {
    setSpecifications(specifications.filter((_, i) => i !== index))
  }

  const handleSpecTitleChange = (index, value, field = "title") => {
    const updatedSpecs = [...specifications]
    updatedSpecs[index][field] = value
    setSpecifications(updatedSpecs)
  }

  const addSpecDetail = (index) => {
    const updatedSpecs = [...specifications]
    updatedSpecs[index].details.push({ label: "", value: "" })
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

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault()

    setError(null)
    setUploadStatus(null)
    setSubmitting(true)

    if (!model || !year || !brandId || images.length === 0) {
      setError("Model, year, brand and at least one image are required")
      setSubmitting(false)
      return
    }

    try {
      // Extract image URLs for submission
      const imageUrls = images.map((image) => image.url)

      // Submit the form with all image URLs and bilingual data
      const response = await axios.put(`/api/supabasPrisma/cars/${id}`, {
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
        slug,

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

      setUploadStatus("Car updated successfully! Redirecting...")
      setTimeout(() => {
        router.push("/dashboard/cars")
        router.refresh()
      }, 1500)
    } catch (error) {
      console.error("Error updating car:", error)
      setError(error.response?.data?.error || error.message || "Failed to update car")
    } finally {
      setSubmitting(false)
    }
  }

  // Render skeleton loading state for brands
  if (loading) {
    return (
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Skeleton className="h-10 w-32 mb-2" />
            <Skeleton className="h-8 w-48 mb-1" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-8 w-40" />
        </div>

        <div className="border rounded-md p-4 mb-4">
          <Skeleton className="h-8 w-full mb-4" />
          <div className="grid grid-cols-7 gap-2 mb-4">
            {Array(7)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Skeleton className="h-10 w-40" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Button variant="ghost" asChild className="mb-1 h-8" disabled={submitting}>
            <Link href="/dashboard/cars">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cars
            </Link>
          </Button>
          <h1 className="text-xl font-bold tracking-tight">Update Car</h1>
          <p className="text-sm text-muted-foreground">Update the details for {model}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-1">
            <div className="text-xs font-medium">Form completion: {formProgress}%</div>
            <div className="h-1.5 w-32 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${formProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {uploadStatus && (
        <Alert className="mb-4">
          <Check className="h-4 w-4 mr-2" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{uploadStatus}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="h-[calc(100vh-160px)] flex flex-col">
        {submitting && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-card p-6 rounded-lg shadow-lg text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <h3 className="font-medium text-lg mb-1">Updating Car Details</h3>
              <p className="text-sm text-muted-foreground">Please wait while we save your changes...</p>
            </div>
          </div>
        )}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="sticky top-0 z-10 bg-background pt-1 pb-2 border-b">
            <TabsList className="w-full grid grid-cols-7 h-auto p-1 rounded-[5px]" disabled={submitting}>
              <TabsTrigger
                value="types"
                className="py-1.5 flex gap-1 items-center text-xs rounded-[5px]"
                disabled={submitting}
              >
                <ListFilter className="h-3 w-3" />
                <span>Types</span>
              </TabsTrigger>
              <TabsTrigger
                value="basic"
                className="py-1.5 flex gap-1 items-center text-xs rounded-[5px]"
                disabled={submitting}
              >
                <Car className="h-3 w-3" />
                <span>Basic Info</span>
              </TabsTrigger>
              <TabsTrigger
                value="technical"
                className="py-1.5 flex gap-1 items-center text-xs rounded-[5px]"
                disabled={submitting}
              >
                <Settings className="h-3 w-3" />
                <span>Technical</span>
              </TabsTrigger>
              <TabsTrigger
                value="features"
                className="py-1.5 flex gap-1 items-center text-xs rounded-[5px]"
                disabled={submitting}
              >
                <Check className="h-3 w-3" />
                <span>Features</span>
              </TabsTrigger>
              <TabsTrigger
                value="additional"
                className="py-1.5 flex gap-1 items-center text-xs rounded-[5px]"
                disabled={submitting}
              >
                <Info className="h-3 w-3" />
                <span>Additional</span>
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="py-1.5 flex gap-1 items-center text-xs rounded-[5px]"
                disabled={submitting}
              >
                <FileText className="h-3 w-3" />
                <span>Specs</span>
              </TabsTrigger>
              <TabsTrigger
                value="images"
                className="py-1.5 flex gap-1 items-center text-xs rounded-[5px]"
                disabled={submitting}
              >
                <ImageIcon className="h-3 w-3" />
                <span>Images</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-auto">
            {/* Types Tab */}
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
                            disabled={submitting || conditionTypesLoading}
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
                                conditionTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.title || `condition-${type.id}`}>
                                    {type.title || `Condition ${type.id}`}
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
                            disabled={submitting || bodyTypesLoading}
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
                                bodyTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.title || `bodytype-${type.id}`}>
                                    {type.title || `Body Type ${type.id}`}
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
                            disabled={submitting || fuelTypesLoading}
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
                                fuelTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.title || `fueltype-${type.id}`}>
                                    {type.title || `Fuel Type ${type.id}`}
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
                            disabled={submitting || transmissionTypesLoading}
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
                                transmissionTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.title || `transmission-${type.id}`}>
                                    {type.title || `Transmission ${type.id}`}
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
                            disabled={submitting || wheelDriveTypesLoading}
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
                                wheelDriveTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.title || `wheeldrive-${type.id}`}>
                                    {type.title || `Wheel Drive ${type.id}`}
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
                            disabled={submitting || safetyRatingsLoading}
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
                                safetyRatings.map((rating) => (
                                  <SelectItem key={rating.id} value={rating.title || `safety-${rating.id}`}>
                                    {rating.title || `Safety Rating ${rating.id}`}
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
                            disabled={submitting || insuranceStatusesLoading}
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
                                insuranceStatuses.map((status) => (
                                  <SelectItem key={status.id} value={status.title || `insurance-${status.id}`}>
                                    {status.title || `Insurance Status ${status.id}`}
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
                            disabled={submitting || conditionTypesLoading}
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
                                conditionTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.title_ar || `condition-ar-${type.id}`}>
                                    {type.title_ar || `حالة ${type.id}`}
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
                            disabled={submitting || bodyTypesLoading}
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
                                bodyTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.title_ar || `bodytype-ar-${type.id}`}>
                                    {type.title_ar || `نوع الهيكل ${type.id}`}
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
                            disabled={submitting || fuelTypesLoading}
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
                                fuelTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.title_ar || `fueltype-ar-${type.id}`}>
                                    {type.title_ar || `نوع الوقود ${type.id}`}
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
                            disabled={submitting || transmissionTypesLoading}
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
                                transmissionTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.title_ar || `transmission-ar-${type.id}`}>
                                    {type.title_ar || `ناقل الحركة ${type.id}`}
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
                            disabled={submitting || wheelDriveTypesLoading}
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
                                wheelDriveTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.title_ar || `wheeldrive-ar-${type.id}`}>
                                    {type.title_ar || `نظام الدفع ${type.id}`}
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
                            disabled={submitting || safetyRatingsLoading}
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
                                safetyRatings.map((rating) => (
                                  <SelectItem key={rating.id} value={rating.title_ar || `safety-ar-${rating.id}`}>
                                    {rating.title_ar || `تصنيف السلامة ${rating.id}`}
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
                            disabled={submitting || insuranceStatusesLoading}
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
                                insuranceStatuses.map((status) => (
                                  <SelectItem key={status.id} value={status.title_ar || `insurance-ar-${status.id}`}>
                                    {status.title_ar || `حالة التأمين ${status.id}`}
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
                    className="h-8 text-xs rounded-[5px] bg-brand-primary hover:bg-brand-primary/90"
                    disabled={submitting}
                  >
                    Next: Basic Information
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="mt-2 h-full">
              <Card className="h-full rounded-[5px] shadow-sm border-brand-primary/10">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base text-brand-primary flex items-center">
                    <Car className="h-4 w-4 mr-2" />
                    Basic Information
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Update the essential details about the car in English (required) and Arabic (optional)
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
                            disabled={submitting}
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="brand" className="text-xs">
                            Brand <span className="text-destructive">*</span>
                          </Label>
                          <Select onValueChange={setBrandId} value={brandId} required disabled={submitting}>
                            <SelectTrigger className="h-8 text-sm rounded-[5px]">
                              <SelectValue placeholder="Select a brand" />
                            </SelectTrigger>
                            <SelectContent>
                              {brands.map((brand) => (
                                <SelectItem key={brand.id} value={brand.id || `brand-${brand.id}`}>
                                  {brand.name || `Brand ${brand.id}`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="year" className="text-xs">
                            Year <span className="text-destructive">*</span>
                          </Label>
                          <Select onValueChange={setYear} value={year} required disabled={submitting}>
                            <SelectTrigger className="h-8 text-sm rounded-[5px]">
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                              {YEARS.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

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
                            disabled={submitting}
                          />
                        </div>

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
                            disabled={submitting}
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="condition" className="text-xs">
                            Condition
                          </Label>
                          <Select
                            onValueChange={handleConditionChange}
                            value={condition}
                            disabled={submitting || conditionTypesLoading}
                          >
                            <SelectTrigger className="h-8 text-sm rounded-[5px]">
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                              {conditionTypesLoading ? (
                                <SelectItem value="loading" disabled>
                                  Loading...
                                </SelectItem>
                              ) : (
                                conditionTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.title || `condition-${type.id}`}>
                                    {type.title || `Condition ${type.id}`}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="bodyType" className="text-xs">
                            Body Type
                          </Label>
                          <Select
                            onValueChange={handleBodyTypeChange}
                            value={bodyType}
                            disabled={submitting || bodyTypesLoading}
                          >
                            <SelectTrigger className="h-8 text-sm rounded-[5px]">
                              <SelectValue placeholder="Select body type" />
                            </SelectTrigger>
                            <SelectContent>
                              {bodyTypesLoading ? (
                                <SelectItem value="loading" disabled>
                                  Loading...
                                </SelectItem>
                              ) : (
                                bodyTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.title || `bodytype-${type.id}`}>
                                    {type.title || `Body Type ${type.id}`}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="slug" className="text-xs">
                            Slug
                          </Label>
                          <Input
                            id="slug"
                            placeholder="Auto-generated from model and year"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="h-8 text-sm rounded-[5px]"
                            disabled={submitting}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            URL-friendly identifier. Leave empty for auto-generation.
                          </p>
                        </div>
                      </div>

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
                          className="text-sm resize-none"
                          disabled={submitting}
                        />
                      </div>
                    </CardContent>
                  </TabsContent>

                  <TabsContent value="arabic" className="m-0">
                    <CardContent className="space-y-3 py-2 px-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                            disabled={submitting}
                            dir="rtl"
                          />
                        </div>

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
                            disabled={submitting}
                            dir="rtl"
                          />
                        </div>

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
                            disabled={submitting}
                            dir="rtl"
                          />
                        </div>

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
                            disabled={submitting}
                            dir="rtl"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="condition_ar" className="text-xs">
                            Condition (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Select
                            onValueChange={handleConditionArChange}
                            value={condition_ar}
                            disabled={submitting || conditionTypesLoading}
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
                                conditionTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.title_ar || `condition-ar-${type.id}`}>
                                    {type.title_ar || `حالة ${type.id}`}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="bodyType_ar" className="text-xs">
                            Body Type (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Select
                            onValueChange={handleBodyTypeArChange}
                            value={bodyType_ar}
                            disabled={submitting || bodyTypesLoading}
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
                                bodyTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.title_ar || `bodytype-ar-${type.id}`}>
                                    {type.title_ar || `نوع الهيكل ${type.id}`}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

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
                          className="text-sm resize-none text-right"
                          disabled={submitting}
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
                    className="h-8 text-xs rounded-[5px]"
                    disabled={submitting}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={goToNextTab}
                    size="sm"
                    className="h-8 text-xs rounded-[5px] bg-brand-primary hover:bg-brand-primary/90"
                    disabled={submitting}
                  >
                    Next: Technical Specifications
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Technical Specifications Tab */}
            <TabsContent value="technical" className="mt-2 h-full">
              <Card className="h-full rounded-[5px] shadow-sm border-brand-primary/10">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base text-brand-primary flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Technical Specifications
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Update the technical details of the car in English (required) and Arabic (optional)
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
                            disabled={submitting}
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="fuelType" className="text-xs">
                            Fuel Type
                          </Label>
                          <Select
                            onValueChange={handleFuelTypeChange}
                            value={fuelType}
                            disabled={submitting || fuelTypesLoading}
                          >
                            <SelectTrigger className="h-8 text-sm rounded-[5px]">
                              <SelectValue placeholder="Select fuel type" />
                            </SelectTrigger>
                            <SelectContent>
                              {fuelTypesLoading ? (
                                <SelectItem value="loading" disabled>
                                  Loading...
                                </SelectItem>
                              ) : (
                                fuelTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.title || `fueltype-${type.id}`}>
                                    {type.title || `Fuel Type ${type.id}`}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

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
                            disabled={submitting}
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="transmission" className="text-xs">
                            Transmission
                          </Label>
                          <Select
                            onValueChange={handleTransmissionChange}
                            value={transmission}
                            disabled={submitting || transmissionTypesLoading}
                          >
                            <SelectTrigger className="h-8 text-sm rounded-[5px]">
                              <SelectValue placeholder="Select transmission" />
                            </SelectTrigger>
                            <SelectContent>
                              {transmissionTypesLoading ? (
                                <SelectItem value="loading" disabled>
                                  Loading...
                                </SelectItem>
                              ) : (
                                transmissionTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.title || `transmission-${type.id}`}>
                                    {type.title || `Transmission ${type.id}`}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

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
                            disabled={submitting}
                          />
                        </div>

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
                            disabled={submitting}
                          />
                        </div>

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
                            disabled={submitting}
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="wheelDrive" className="text-xs">
                            Wheel Drive
                          </Label>
                          <Select
                            onValueChange={handleWheelDriveChange}
                            value={wheelDrive}
                            disabled={submitting || wheelDriveTypesLoading}
                          >
                            <SelectTrigger className="h-8 text-sm rounded-[5px]">
                              <SelectValue placeholder="Select wheel drive" />
                            </SelectTrigger>
                            <SelectContent>
                              {wheelDriveTypesLoading ? (
                                <SelectItem value="loading" disabled>
                                  Loading...
                                </SelectItem>
                              ) : (
                                wheelDriveTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.title || `wheeldrive-${type.id}`}>
                                    {type.title || `Wheel Drive ${type.id}`}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

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
                            disabled={submitting}
                          />
                        </div>

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
                            disabled={submitting}
                          />
                        </div>

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
                            disabled={submitting}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </TabsContent>

                  <TabsContent value="arabic" className="m-0">
                    <CardContent className="space-y-3 py-2 px-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
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
                            disabled={submitting}
                            dir="rtl"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="fuelType_ar" className="text-xs">
                            Fuel Type (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Select
                            onValueChange={handleFuelTypeArChange}
                            value={fuelType_ar}
                            disabled={submitting || fuelTypesLoading}
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
                                fuelTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.title_ar || `fueltype-ar-${type.id}`}>
                                    {type.title_ar || `نوع الوقود ${type.id}`}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

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
                            disabled={submitting}
                            dir="rtl"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="transmission_ar" className="text-xs">
                            Transmission (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Select
                            onValueChange={handleTransmissionArChange}
                            value={transmission_ar}
                            disabled={submitting || transmissionTypesLoading}
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
                                transmissionTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.title_ar || `transmission-ar-${type.id}`}>
                                    {type.title_ar || `ناقل الحركة ${type.id}`}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

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
                            disabled={submitting}
                            dir="rtl"
                          />
                        </div>

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
                            disabled={submitting}
                            dir="rtl"
                          />
                        </div>

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
                            disabled={submitting}
                            dir="rtl"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="wheelDrive_ar" className="text-xs">
                            Wheel Drive (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Select
                            onValueChange={handleWheelDriveArChange}
                            value={wheelDrive_ar}
                            disabled={submitting || wheelDriveTypesLoading}
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
                                wheelDriveTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.title_ar || `wheeldrive-ar-${type.id}`}>
                                    {type.title_ar || `نظام الدفع ${type.id}`}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

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
                            disabled={submitting}
                            dir="rtl"
                          />
                        </div>

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
                            disabled={submitting}
                            dir="rtl"
                          />
                        </div>

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
                            disabled={submitting}
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
                    className="h-8 text-xs rounded-[5px]"
                    disabled={submitting}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={goToNextTab}
                    size="sm"
                    className="h-8 text-xs rounded-[5px] bg-brand-primary hover:bg-brand-primary/90"
                    disabled={submitting}
                  >
                    Next: Features & Comfort
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Features & Comfort Tab */}
            <TabsContent value="features" className="mt-2 h-full">
              <Card className="h-full rounded-[5px] shadow-sm border-brand-primary/10">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base text-brand-primary flex items-center">
                    <Check className="h-4 w-4 mr-2" />
                    Features & Comfort
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Update the features and comfort options of the car in English (required) and Arabic (optional)
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
                                disabled={submitting}
                              />
                            </div>

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
                                disabled={submitting}
                              />
                            </div>
                          </div>

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
                              disabled={submitting}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-xs font-medium">Features</h3>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="gps"
                                checked={gps}
                                onCheckedChange={setGps}
                                className="h-3.5 w-3.5 rounded-[2px]"
                                disabled={submitting}
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
                                disabled={submitting}
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
                                disabled={submitting}
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
                                disabled={submitting}
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
                                disabled={submitting}
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
                                disabled={submitting}
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
                                disabled={submitting}
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
                                disabled={submitting}
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
                                disabled={submitting}
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
                                disabled={submitting}
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
                                disabled={submitting}
                                dir="rtl"
                              />
                            </div>

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
                                disabled={submitting}
                                dir="rtl"
                              />
                            </div>
                          </div>

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
                              disabled={submitting}
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
                    className="h-8 text-xs rounded-[5px]"
                    disabled={submitting}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={goToNextTab}
                    size="sm"
                    className="h-8 text-xs rounded-[5px] bg-brand-primary hover:bg-brand-primary/90"
                    disabled={submitting}
                  >
                    Next: Additional Information
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Additional Information Tab */}
            <TabsContent value="additional" className="mt-2 h-full">
              <Card className="h-full rounded-[5px] shadow-sm border-brand-primary/10">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base text-brand-primary flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    Additional Information
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Update additional details about the car in English (required) and Arabic (optional)
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
                            disabled={submitting}
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="safetyRating" className="text-xs">
                            Safety Rating
                          </Label>
                          <Select
                            onValueChange={handleSafetyRatingChange}
                            value={safetyRating}
                            disabled={submitting || safetyRatingsLoading}
                          >
                            <SelectTrigger className="h-8 text-sm rounded-[5px]">
                              <SelectValue placeholder="Select safety rating" />
                            </SelectTrigger>
                            <SelectContent>
                              {safetyRatingsLoading ? (
                                <SelectItem value="loading" disabled>
                                  Loading...
                                </SelectItem>
                              ) : (
                                safetyRatings.map((rating) => (
                                  <SelectItem key={rating.id} value={rating.title || `safety-${rating.id}`}>
                                    {rating.title || `Safety Rating ${rating.id}`}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

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
                            disabled={submitting}
                          />
                        </div>

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
                            disabled={submitting}
                          />
                        </div>

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
                            disabled={submitting}
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="insuranceStatus" className="text-xs">
                            Insurance Status
                          </Label>
                          <Select
                            onValueChange={handleInsuranceStatusChange}
                            value={insuranceStatus}
                            disabled={submitting || insuranceStatusesLoading}
                          >
                            <SelectTrigger className="h-8 text-sm rounded-[5px]">
                              <SelectValue placeholder="Select insurance status" />
                            </SelectTrigger>
                            <SelectContent>
                              {insuranceStatusesLoading ? (
                                <SelectItem value="loading" disabled>
                                  Loading...
                                </SelectItem>
                              ) : (
                                insuranceStatuses.map((status) => (
                                  <SelectItem key={status.id} value={status.title || `insurance-${status.id}`}>
                                    {status.title || `Insurance Status ${status.id}`}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

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
                            disabled={submitting}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </TabsContent>

                  <TabsContent value="arabic" className="m-0">
                    <CardContent className="space-y-3 py-2 px-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                            disabled={submitting}
                            dir="rtl"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="safetyRating_ar" className="text-xs">
                            Safety Rating (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Select
                            onValueChange={handleSafetyRatingArChange}
                            value={safetyRating_ar}
                            disabled={submitting || safetyRatingsLoading}
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
                                safetyRatings.map((rating) => (
                                  <SelectItem key={rating.id} value={rating.title_ar || `safety-ar-${rating.id}`}>
                                    {rating.title_ar || `تصنيف السلامة ${rating.id}`}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

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
                            disabled={submitting}
                            dir="rtl"
                          />
                        </div>

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
                            disabled={submitting}
                            dir="rtl"
                          />
                        </div>

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
                            disabled={submitting}
                            dir="rtl"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="insuranceStatus_ar" className="text-xs">
                            Insurance Status (Arabic) <span className="text-muted-foreground text-xs">(optional)</span>
                          </Label>
                          <Select
                            onValueChange={handleInsuranceStatusArChange}
                            value={insuranceStatus_ar}
                            disabled={submitting || insuranceStatusesLoading}
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
                                insuranceStatuses.map((status) => (
                                  <SelectItem key={status.id} value={status.title_ar || `insurance-ar-${status.id}`}>
                                    {status.title_ar || `حالة التأمين ${status.id}`}
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

                <CardFooter className="flex justify-between py-3 px-4 border-t bg-muted/20">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPrevTab}
                    size="sm"
                    className="h-8 text-xs rounded-[5px]"
                    disabled={submitting}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={goToNextTab}
                    size="sm"
                    className="h-8 text-xs rounded-[5px] bg-brand-primary hover:bg-brand-primary/90"
                    disabled={submitting}
                  >
                    Next: Specifications
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Specifications Tab */}
            <TabsContent value="specifications" className="mt-2 h-full">
              <Card className="h-full rounded-[5px] shadow-sm border-brand-primary/10">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base text-brand-primary flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Detailed Specifications
                  </CardTitle>
                  <CardDescription className="text-xs">Update detailed specifications for the car</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 py-2 px-4 overflow-auto" style={{ maxHeight: "calc(100vh - 280px)" }}>
                  <div className="space-y-3">
                    <EditeSpecifications
                      removeSpecification={removeSpecification}
                      removeSpecDetail={removeSpecDetail}
                      addSpecDetail={addSpecDetail}
                      addSpecification={addSpecification}
                      handleSpecDetailChange={handleSpecDetailChange}
                      handleSpecTitleChange={handleSpecTitleChange}
                      specifications={specifications}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between py-3 px-4 border-t bg-muted/20">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPrevTab}
                    size="sm"
                    className="h-8 text-xs rounded-[5px]"
                    disabled={submitting}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={goToNextTab}
                    size="sm"
                    className="h-8 text-xs rounded-[5px] bg-brand-primary hover:bg-brand-primary/90"
                    disabled={submitting}
                  >
                    Next: Images
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="mt-2 h-full">
              <Card className="h-full rounded-[5px] shadow-sm border-brand-primary/10">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base text-brand-primary flex items-center">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Car Images
                  </CardTitle>
                  <CardDescription className="text-xs">Update images for the car</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 py-2 px-4 overflow-auto" style={{ maxHeight: "calc(100vh - 280px)" }}>
                  <div className="space-y-3">
                    <UpdateMultipleImages images={images} setImages={setImages} disabled={submitting} />
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between py-3 px-4 border-t bg-muted/20">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPrevTab}
                    size="sm"
                    className="h-8 text-xs rounded-[5px]"
                    disabled={submitting}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="h-8 text-xs gap-2 rounded-[5px] bg-brand-primary hover:bg-brand-primary/90"
                    size="sm"
                  >
                    {submitting && <Loader2 className="h-3 w-3 animate-spin" />}
                    Update Car
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
