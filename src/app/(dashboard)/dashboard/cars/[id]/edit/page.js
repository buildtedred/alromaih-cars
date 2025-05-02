"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Loader2, Car, ImageIcon, Settings, Info, Check, AlertCircle, FileText } from "lucide-react"
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

// Predefined options for dropdowns
const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric", "LPG", "CNG", "Other"]
const TRANSMISSION_TYPES = ["Manual", "Automatic", "CVT", "Semi-Automatic", "Dual-Clutch"]
const CONDITION_TYPES = ["New", "Used - Like New", "Used - Good", "Used - Fair", "Used - Poor"]
const WHEEL_DRIVE_TYPES = ["FWD", "RWD", "AWD", "4WD", "4x4"]
const BODY_TYPES = [
  "Sedan",
  "SUV",
  "Hatchback",
  "Coupe",
  "Convertible",
  "Wagon",
  "Van",
  "Truck",
  "Crossover",
  "Minivan",
]
const SAFETY_RATINGS = ["5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star", "Not Rated"]
const INSURANCE_STATUS = ["Fully Insured", "Third Party", "Expired", "None"]
const YEARS = Array.from({ length: 55 }, (_, i) => new Date().getFullYear() - i)

export default function UpdateCarForm() {
  const router = useRouter()
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState("basic")

  // Basic Information
  const [model, setModel] = useState("")
  const [year, setYear] = useState("")
  const [brandId, setBrandId] = useState("")
  const [brands, setBrands] = useState([])
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [color, setColor] = useState("")
  const [condition, setCondition] = useState("")
  const [bodyType, setBodyType] = useState("")

  // Technical Specifications
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

  // Features & Comfort
  const [seats, setSeats] = useState("")
  const [doors, setDoors] = useState("")
  const [infotainment, setInfotainment] = useState("")
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

  // Additional Information
  const [manufactured, setManufactured] = useState("")
  const [safetyRating, setSafetyRating] = useState("")
  const [warranty, setWarranty] = useState("")
  const [registration, setRegistration] = useState("")
  const [ownerCount, setOwnerCount] = useState("")
  const [insuranceStatus, setInsuranceStatus] = useState("")
  const [taxValidity, setTaxValidity] = useState("")

  // Images & Specifications
  const [images, setImages] = useState([])
  const [specifications, setSpecifications] = useState([])

  // Form State
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [formProgress, setFormProgress] = useState(0)

  useEffect(() => {
    async function fetchCar() {
      try {
        setLoading(true)
        const response = await axios.get(`/api/supabasPrisma/cars/${id}`)
        const data = response.data

        // Basic Information
        setModel(data.model || "")
        setYear(data.year?.toString() || "")
        setBrandId(data.brandId || "")
        setDescription(data.description || "")
        setPrice(data.price?.toString() || "")
        setColor(data.color || "")
        setCondition(data.condition || "")
        setBodyType(data.bodyType || "")

        // Technical Specifications
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

        // Features & Comfort
        setSeats(data.seats?.toString() || "")
        setDoors(data.doors?.toString() || "")
        setInfotainment(data.infotainment || "")
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

        // Additional Information
        setManufactured(data.manufactured || "")
        setSafetyRating(data.safetyRating || "")
        setWarranty(data.warranty || "")
        setRegistration(data.registration || "")
        setOwnerCount(data.ownerCount?.toString() || "")
        setInsuranceStatus(data.insuranceStatus || "")
        setTaxValidity(data.taxValidity || "")

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
        setSpecifications(data.spacification || [])
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
        setBrands(response.data)
      } catch (error) {
        console.error("Error fetching brands:", error)
      }
    }

    fetchCar()
    fetchBrands()
  }, [id])

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

  const handleSpecTitleChange = (index, value) => {
    const updatedSpecs = [...specifications]
    updatedSpecs[index].title = value
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
    if (activeTab === "basic") setActiveTab("technical")
    else if (activeTab === "technical") setActiveTab("features")
    else if (activeTab === "features") setActiveTab("additional")
    else if (activeTab === "additional") setActiveTab("images")
    else if (activeTab === "images") setActiveTab("specifications")
  }

  // Navigate to previous tab
  const goToPrevTab = () => {
    if (activeTab === "specifications") setActiveTab("images")
    else if (activeTab === "images") setActiveTab("additional")
    else if (activeTab === "additional") setActiveTab("features")
    else if (activeTab === "features") setActiveTab("technical")
    else if (activeTab === "technical") setActiveTab("basic")
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

      // Submit the form with all image URLs
      const response = await axios.put(`/api/supabasPrisma/cars/${id}`, {
        model,
        year,
        brandId,
        description,
        price: price ? Number.parseFloat(price) : null,
        images: imageUrls,
        specifications,
        mileage: mileage ? Number.parseInt(mileage) : null,
        fuelType,
        fuelTankCapacity,
        transmission,
        color,
        manufactured,
        condition,
        seats: seats ? Number.parseInt(seats) : null,
        doors: doors ? Number.parseInt(doors) : null,
        engineSize: engineSize ? Number.parseFloat(engineSize) : null,
        horsepower: horsepower ? Number.parseInt(horsepower) : null,
        torque: torque ? Number.parseInt(torque) : null,
        wheelDrive,
        bodyType,
        safetyRating,
        topSpeed: topSpeed ? Number.parseInt(topSpeed) : null,
        acceleration: acceleration ? Number.parseFloat(acceleration) : null,
        fuelEconomy: fuelEconomy ? Number.parseFloat(fuelEconomy) : null,
        infotainment,
        warranty,
        registration,
        ownerCount: ownerCount ? Number.parseInt(ownerCount) : null,
        insuranceStatus,
        taxValidity,
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
          <div className="grid grid-cols-6 gap-2 mb-4">
            {Array(6)
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
            <TabsList className="w-full grid grid-cols-6 h-auto p-1" disabled={submitting}>
              <TabsTrigger value="basic" className="py-1.5 flex gap-1 items-center text-xs" disabled={submitting}>
                <Car className="h-3 w-3" />
                <span>Basic Info</span>
              </TabsTrigger>
              <TabsTrigger value="technical" className="py-1.5 flex gap-1 items-center text-xs" disabled={submitting}>
                <Settings className="h-3 w-3" />
                <span>Technical</span>
              </TabsTrigger>
              <TabsTrigger value="features" className="py-1.5 flex gap-1 items-center text-xs" disabled={submitting}>
                <Check className="h-3 w-3" />
                <span>Features</span>
              </TabsTrigger>
              <TabsTrigger value="additional" className="py-1.5 flex gap-1 items-center text-xs" disabled={submitting}>
                <Info className="h-3 w-3" />
                <span>Additional</span>
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="py-1.5 flex gap-1 items-center text-xs"
                disabled={submitting}
              >
                <FileText className="h-3 w-3" />
                <span>Specs</span>
              </TabsTrigger>
              <TabsTrigger value="images" className="py-1.5 flex gap-1 items-center text-xs" disabled={submitting}>
                <ImageIcon className="h-3 w-3" />
                <span>Images</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-auto">
            {/* Basic Information Tab */}
            <TabsContent value="basic" className="mt-2 h-full">
              <Card className="h-full">
                <CardHeader className="py-3">
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                  <CardDescription className="text-xs">Update the essential details about the car</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 py-2">
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
                        className="h-8 text-sm"
                        disabled={submitting}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="brand" className="text-xs">
                        Brand <span className="text-destructive">*</span>
                      </Label>
                      <Select onValueChange={setBrandId} value={brandId} required disabled={submitting}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Select a brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {brands.map((brand) => (
                            <SelectItem key={brand.id} value={brand.id}>
                              {brand.name}
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
                        <SelectTrigger className="h-8 text-sm">
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
                        className="h-8 text-sm"
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
                        className="h-8 text-sm"
                        disabled={submitting}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="condition" className="text-xs">
                        Condition
                      </Label>
                      <Select onValueChange={setCondition} value={condition} disabled={submitting}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          {CONDITION_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="bodyType" className="text-xs">
                        Body Type
                      </Label>
                      <Select onValueChange={setBodyType} value={bodyType} disabled={submitting}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Select body type" />
                        </SelectTrigger>
                        <SelectContent>
                          {BODY_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                <CardFooter className="flex justify-end py-3">
                  <Button type="button" onClick={goToNextTab} size="sm" disabled={submitting}>
                    Next: Technical Specifications
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Technical Specifications Tab */}
            <TabsContent value="technical" className="mt-2 h-full">
              <Card className="h-full">
                <CardHeader className="py-3">
                  <CardTitle className="text-lg">Technical Specifications</CardTitle>
                  <CardDescription className="text-xs">Update the technical details of the car</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 py-2">
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
                        className="h-8 text-sm"
                        disabled={submitting}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="fuelType" className="text-xs">
                        Fuel Type
                      </Label>
                      <Select onValueChange={setFuelType} value={fuelType} disabled={submitting}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                        <SelectContent>
                          {FUEL_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
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
                        className="h-8 text-sm"
                        disabled={submitting}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="transmission" className="text-xs">
                        Transmission
                      </Label>
                      <Select onValueChange={setTransmission} value={transmission} disabled={submitting}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Select transmission" />
                        </SelectTrigger>
                        <SelectContent>
                          {TRANSMISSION_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
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
                        className="h-8 text-sm"
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
                        className="h-8 text-sm"
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
                        className="h-8 text-sm"
                        disabled={submitting}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="wheelDrive" className="text-xs">
                        Wheel Drive
                      </Label>
                      <Select onValueChange={setWheelDrive} value={wheelDrive} disabled={submitting}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Select wheel drive" />
                        </SelectTrigger>
                        <SelectContent>
                          {WHEEL_DRIVE_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
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
                        className="h-8 text-sm"
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
                        className="h-8 text-sm"
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
                        className="h-8 text-sm"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between py-3">
                  <Button type="button" variant="outline" onClick={goToPrevTab} size="sm" disabled={submitting}>
                    Back
                  </Button>
                  <Button type="button" onClick={goToNextTab} size="sm" disabled={submitting}>
                    Next: Features & Comfort
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Features & Comfort Tab */}
            <TabsContent value="features" className="mt-2 h-full">
              <Card className="h-full">
                <CardHeader className="py-3">
                  <CardTitle className="text-lg">Features & Comfort</CardTitle>
                  <CardDescription className="text-xs">
                    Update the features and comfort options of the car
                  </CardDescription>
                </CardHeader>
                <CardContent className="py-2">
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
                            className="h-8 text-sm"
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
                            className="h-8 text-sm"
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
                          className="h-8 text-sm"
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
                            className="h-3.5 w-3.5"
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
                            className="h-3.5 w-3.5"
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
                            className="h-3.5 w-3.5"
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
                            className="h-3.5 w-3.5"
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
                            className="h-3.5 w-3.5"
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
                            className="h-3.5 w-3.5"
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
                            className="h-3.5 w-3.5"
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
                            className="h-3.5 w-3.5"
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
                            className="h-3.5 w-3.5"
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
                            className="h-3.5 w-3.5"
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
                <CardFooter className="flex justify-between py-3">
                  <Button type="button" variant="outline" onClick={goToPrevTab} size="sm" disabled={submitting}>
                    Back
                  </Button>
                  <Button type="button" onClick={goToNextTab} size="sm" disabled={submitting}>
                    Next: Additional Information
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Additional Information Tab */}
            <TabsContent value="additional" className="mt-2 h-full">
              <Card className="h-full">
                <CardHeader className="py-3">
                  <CardTitle className="text-lg">Additional Information</CardTitle>
                  <CardDescription className="text-xs">Update additional details about the car</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 py-2">
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
                        className="h-8 text-sm"
                        disabled={submitting}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="safetyRating" className="text-xs">
                        Safety Rating
                      </Label>
                      <Select onValueChange={setSafetyRating} value={safetyRating} disabled={submitting}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Select safety rating" />
                        </SelectTrigger>
                        <SelectContent>
                          {SAFETY_RATINGS.map((rating) => (
                            <SelectItem key={rating} value={rating}>
                              {rating}
                            </SelectItem>
                          ))}
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
                        className="h-8 text-sm"
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
                        className="h-8 text-sm"
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
                        className="h-8 text-sm"
                        disabled={submitting}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="insuranceStatus" className="text-xs">
                        Insurance Status
                      </Label>
                      <Select onValueChange={setInsuranceStatus} value={insuranceStatus} disabled={submitting}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Select insurance status" />
                        </SelectTrigger>
                        <SelectContent>
                          {INSURANCE_STATUS.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
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
                        className="h-8 text-sm"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between py-3">
                  <Button type="button" variant="outline" onClick={goToPrevTab} size="sm" disabled={submitting}>
                    Back
                  </Button>
                  <Button type="button" onClick={goToNextTab} size="sm" disabled={submitting}>
                    Next: Specifications
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

{/* Specifications Tab */}
<TabsContent value="specifications" className="mt-2 h-full">
              <Card className="h-full">
                <CardHeader className="py-3">
                  <CardTitle className="text-lg">Detailed Specifications</CardTitle>
                  <CardDescription className="text-xs">Update detailed specifications for the car</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 py-2 overflow-auto" style={{ maxHeight: "calc(100vh - 280px)" }}>
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
                <CardFooter className="flex justify-between py-3">
                  <Button type="button" variant="outline" onClick={goToPrevTab} size="sm" disabled={submitting}>
                    Back
                  </Button>
                  <Button type="button" onClick={goToNextTab} size="sm" disabled={submitting}>
                    Next: images
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            {/* Images Tab */}
            <TabsContent value="images" className="mt-2 h-full">
              <Card className="h-full">
                <CardHeader className="py-3">
                  <CardTitle className="text-lg">Car Images</CardTitle>
                  <CardDescription className="text-xs">Update images for the car</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 py-2 overflow-auto" style={{ maxHeight: "calc(100vh - 280px)" }}>
                  <div className="space-y-3">
                    <UpdateMultipleImages images={images} setImages={setImages} disabled={submitting} />
                  </div>
                </CardContent>
              


                <CardFooter className="flex justify-between py-3">
                  <Button type="button" variant="outline" onClick={goToPrevTab} size="sm" disabled={submitting}>
                    Back
                  </Button>
                  <Button type="submit" disabled={submitting} className="gap-2" size="sm">
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
