"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Car, ImageIcon, Settings, Info, Check, AlertCircle, ChevronRight } from "lucide-react"
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

// Define the tab order for navigation
const TAB_ORDER = ["basic", "technical", "features", "additional", "specifications", "images"]

export default function AddCarForm() {
  const router = useRouter()
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
  const [loading, setLoading] = useState(false)
  const [brandsLoading, setBrandsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [formProgress, setFormProgress] = useState(0)

  useEffect(() => {
    async function fetchBrands() {
      try {
        setBrandsLoading(true)
        const response = await axios.get("/api/supabasPrisma/carbrands")
        setBrands(response.data)
      } catch (error) {
        console.error("Error fetching brands:", error)
      } finally {
        setBrandsLoading(false)
      }
    }
    fetchBrands()
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

  // Handle form submission
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

      // Submit the form with all image URLs
      const response = await axios.post("/api/supabasPrisma/cars", {
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

  // Navigate to next tab - fixed to use the TAB_ORDER array
  const goToNextTab = () => {
    const currentIndex = TAB_ORDER.indexOf(activeTab)
    if (currentIndex < TAB_ORDER.length - 1) {
      setActiveTab(TAB_ORDER[currentIndex + 1])
    }
  }

  // Navigate to previous tab - fixed to use the TAB_ORDER array
  const goToPrevTab = () => {
    const currentIndex = TAB_ORDER.indexOf(activeTab)
    if (currentIndex > 0) {
      setActiveTab(TAB_ORDER[currentIndex - 1])
    }
  }

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
            <TabsList className="w-full grid grid-cols-6 h-auto p-1 rounded-[5px]" disabled={loading}>
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
            {/* Basic Information Tab */}
            <TabsContent value="basic" className="mt-2 h-full">
              <Card className="h-full rounded-[5px] shadow-sm border-brand-primary/10">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base text-brand-primary">Basic Information</CardTitle>
                  <CardDescription className="text-xs">Enter the essential details about the car</CardDescription>
                </CardHeader>
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
                        disabled={loading}
                      />
                    </div>

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

                    <div className="space-y-1">
                      <Label htmlFor="condition" className="text-xs">
                        Condition
                      </Label>
                      <Select onValueChange={setCondition} value={condition} disabled={loading}>
                        <SelectTrigger className="h-8 text-sm rounded-[5px]">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent className="rounded-[5px]">
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
                      <Select onValueChange={setBodyType} value={bodyType} disabled={loading}>
                        <SelectTrigger className="h-8 text-sm rounded-[5px]">
                          <SelectValue placeholder="Select body type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-[5px]">
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
                      className="text-sm resize-none rounded-[5px]"
                      disabled={loading}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end py-3 px-4 border-t bg-muted/20">
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

            {/* Technical Specifications Tab */}
            <TabsContent value="technical" className="mt-2 h-full">
              <Card className="h-full rounded-[5px] shadow-sm border-brand-primary/10">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base text-brand-primary">Technical Specifications</CardTitle>
                  <CardDescription className="text-xs">Enter the technical details of the car</CardDescription>
                </CardHeader>
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
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="fuelType" className="text-xs">
                        Fuel Type
                      </Label>
                      <Select onValueChange={setFuelType} value={fuelType} disabled={loading}>
                        <SelectTrigger className="h-8 text-sm rounded-[5px]">
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-[5px]">
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
                        className="h-8 text-sm rounded-[5px]"
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="transmission" className="text-xs">
                        Transmission
                      </Label>
                      <Select onValueChange={setTransmission} value={transmission} disabled={loading}>
                        <SelectTrigger className="h-8 text-sm rounded-[5px]">
                          <SelectValue placeholder="Select transmission" />
                        </SelectTrigger>
                        <SelectContent className="rounded-[5px]">
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
                        className="h-8 text-sm rounded-[5px]"
                        disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="wheelDrive" className="text-xs">
                        Wheel Drive
                      </Label>
                      <Select onValueChange={setWheelDrive} value={wheelDrive} disabled={loading}>
                        <SelectTrigger className="h-8 text-sm rounded-[5px]">
                          <SelectValue placeholder="Select wheel drive" />
                        </SelectTrigger>
                        <SelectContent className="rounded-[5px]">
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
                        className="h-8 text-sm rounded-[5px]"
                        disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
                      />
                    </div>
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

            {/* Features & Comfort Tab */}
            <TabsContent value="features" className="mt-2 h-full">
              <Card className="h-full rounded-[5px] shadow-sm border-brand-primary/10">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base text-brand-primary">Features & Comfort</CardTitle>
                  <CardDescription className="text-xs">
                    Specify the features and comfort options of the car
                  </CardDescription>
                </CardHeader>
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
                            disabled={loading}
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
                            disabled={loading}
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
                          disabled={loading}
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

            {/* Additional Information Tab */}
            <TabsContent value="additional" className="mt-2 h-full">
              <Card className="h-full rounded-[5px] shadow-sm border-brand-primary/10">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base text-brand-primary">Additional Information</CardTitle>
                  <CardDescription className="text-xs">Provide additional details about the car</CardDescription>
                </CardHeader>
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
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="safetyRating" className="text-xs">
                        Safety Rating
                      </Label>
                      <Select onValueChange={setSafetyRating} value={safetyRating} disabled={loading}>
                        <SelectTrigger className="h-8 text-sm rounded-[5px]">
                          <SelectValue placeholder="Select safety rating" />
                        </SelectTrigger>
                        <SelectContent className="rounded-[5px]">
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
                        className="h-8 text-sm rounded-[5px]"
                        disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="insuranceStatus" className="text-xs">
                        Insurance Status
                      </Label>
                      <Select onValueChange={setInsuranceStatus} value={insuranceStatus} disabled={loading}>
                        <SelectTrigger className="h-8 text-sm rounded-[5px]">
                          <SelectValue placeholder="Select insurance status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-[5px]">
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
                        className="h-8 text-sm rounded-[5px]"
                        disabled={loading}
                      />
                    </div>
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

            {/* Images Tab */}
            <TabsContent value="images" className="mt-2 h-full">
              <Card className="h-full rounded-[5px] shadow-sm border-brand-primary/10">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base text-brand-primary">Car Images</CardTitle>
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

            {/* Specifications Tab */}
            <TabsContent value="specifications" className="mt-2 h-full">
              <Card className="h-full rounded-[5px] shadow-sm border-brand-primary/10">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base text-brand-primary">Detailed Specifications</CardTitle>
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
          </div>
        </Tabs>
      </form>
    </div>
  )
}
