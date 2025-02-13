"use client"

import { useState, useEffect } from "react"
import {
  X,
  ChevronRight,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  FileText,
  Check,
  MessageCircle,
  Download,
  AlertCircle,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { OrderPDF } from "./orderPDF"
import Image from "next/image"
import { fetchImageAsBase64 } from "./fetch-image"

export function MultiStepPopup({ isOpen, onClose, car_Details }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    type: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    hasWhatsapp: false,
    city: "",
    visitDate: "",
    visitTime: "",
    note: "",
    acceptTerms: false,
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [carImage, setCarImage] = useState(null)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    const loadImage = async () => {
      if (car_Details?.image_url) {
        try {
          const fullImageUrl = `https://xn--mgbml9eg4a.com${car_Details.image_url}`
          const imageResult = await fetchImageAsBase64(fullImageUrl)
          if (typeof imageResult === "string" && imageResult.startsWith("Error:")) {
            console.error(imageResult)
            setImageError(true)
          } else {
            setCarImage(imageResult)
            setImageError(false)
          }
        } catch (error) {
          console.error("Error loading image:", error)
          setImageError(true)
        }
      }
    }

    if (isOpen) {
      loadImage()
    }
  }, [isOpen, car_Details])

  const resetForm = () => {
    setStep(1)
    setFormData({
      type: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      hasWhatsapp: false,
      city: "",
      visitDate: "",
      visitTime: "",
      note: "",
      acceptTerms: false,
    })
    setErrors({})
  }

  if (!isOpen) return null

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const validateStep = (currentStep) => {
    const stepErrors = {}
    switch (currentStep) {
      case 1:
        if (!formData.type) stepErrors.type = "Please select a buyer type"
        break
      case 2:
        if (!formData.firstName.trim()) stepErrors.firstName = "First name is required"
        if (!formData.lastName.trim()) stepErrors.lastName = "Last name is required"
        if (!formData.email.trim()) stepErrors.email = "Email is required"
        else if (!/\S+@\S+\.\S+/.test(formData.email)) stepErrors.email = "Email is invalid"
        if (!formData.phone.trim()) stepErrors.phone = "Phone number is required"
        if (!formData.city.trim()) stepErrors.city = "City is required"
        break
      case 3:
        if (!formData.visitDate) stepErrors.visitDate = "Visit date is required"
        if (!formData.visitTime) stepErrors.visitTime = "Visit time is required"
        break
      case 4:
        if (!formData.acceptTerms) stepErrors.acceptTerms = "You must accept the terms and conditions"
        break
    }
    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
  }

  const handleNext = (e) => {
    e.preventDefault()
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleBack = () => setStep(step - 1)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateStep(4)) {
      setIsLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Form submitted:", formData, car_Details)
      setIsLoading(false)
      resetForm()
      onClose()
    }
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  }

  const isAllDataFilled = () => {
    return (
      formData.type &&
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phone &&
      formData.city &&
      formData.visitDate &&
      formData.visitTime
    )
  }

  const renderSummary = () => (
    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-inner">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Summary</h3>
      <div className="space-y-3">
        {car_Details?.name?.en?.name && (
          <div className="flex items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Car:</span>
            <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">{car_Details.name.en.name}</span>
          </div>
        )}
        {imageError ? (
          <div className="flex items-center text-sm text-yellow-600 dark:text-yellow-400">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span>Unable to load car image</span>
          </div>
        ) : (
          carImage && (
            <div className="relative w-full h-40 mb-4">
              <Image
                src={carImage || "/placeholder.svg"}
                alt={car_Details?.name?.en?.name || "Car Image"}
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
            </div>
          )
        )}
        {formData.type && (
          <div className="flex items-center text-sm">
            <User className="w-4 h-4 mr-2 text-purple-600" />
            <span className="text-gray-600 dark:text-gray-400">Buyer Type:</span>
            <span className="ml-2 font-medium text-gray-800 dark:text-gray-200 capitalize">{formData.type}</span>
          </div>
        )}
        {(formData.firstName || formData.lastName) && (
          <div className="flex items-center text-sm">
            <User className="w-4 h-4 mr-2 text-purple-600" />
            <span className="text-gray-600 dark:text-gray-400">Name:</span>
            <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">
              {`${formData.firstName} ${formData.lastName}`.trim()}
            </span>
          </div>
        )}
        {formData.email && (
          <div className="flex items-center text-sm">
            <Mail className="w-4 h-4 mr-2 text-purple-600" />
            <span className="text-gray-600 dark:text-gray-400">Email:</span>
            <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">{formData.email}</span>
          </div>
        )}
        {formData.phone && (
          <div className="flex items-center text-sm">
            <Phone className="w-4 h-4 mr-2 text-purple-600" />
            <span className="text-gray-600 dark:text-gray-400">Phone:</span>
            <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">{formData.phone}</span>
            {formData.hasWhatsapp && <MessageCircle className="w-4 h-4 ml-2 text-green-500" />}
          </div>
        )}
        {formData.city && (
          <div className="flex items-center text-sm">
            <MapPin className="w-4 h-4 mr-2 text-purple-600" />
            <span className="text-gray-600 dark:text-gray-400">City:</span>
            <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">{formData.city}</span>
          </div>
        )}
        {formData.visitDate && (
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-2 text-purple-600" />
            <span className="text-gray-600 dark:text-gray-400">Visit Date:</span>
            <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">{formData.visitDate}</span>
          </div>
        )}
        {formData.visitTime && (
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 mr-2 text-purple-600" />
            <span className="text-gray-600 dark:text-gray-400">Visit Time:</span>
            <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">{formData.visitTime}</span>
          </div>
        )}
        {formData.note && (
          <div className="flex items-start text-sm">
            <FileText className="w-4 h-4 mr-2 mt-1 text-purple-600" />
            <span className="text-gray-600 dark:text-gray-400">Note:</span>
            <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">{formData.note}</span>
          </div>
        )}
        {formData.acceptTerms && (
          <div className="flex items-center text-sm">
            <Check className="w-4 h-4 mr-2 text-green-500" />
            <span className="text-gray-600 dark:text-gray-400">Terms accepted</span>
          </div>
        )}
      </div>
      {isAllDataFilled() && (
        <div className="mt-6">
          <PDFDownloadLink
            document={<OrderPDF formData={formData} car_Details={{ ...car_Details, image_url: carImage }} />}
            fileName="order_summary.pdf"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            {({ blob, url, loading, error }) =>
              loading ? (
                "Generating PDF..."
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </>
              )
            }
          </PDFDownloadLink>
        </div>
      )}
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-5xl overflow-hidden shadow-lg shadow-purple-100 dark:shadow-none flex"
      >
        <div className="flex-1 p-8 overflow-y-auto max-h-[80vh]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {step === 1 && "Select Type"}
                {step === 2 && "Personal Info"}
                {step === 3 && "Visit Details"}
                {step === 4 && "Confirmation"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Step {step} of 4</p>
            </div>
            <button
              onClick={() => {
                resetForm()
                onClose()
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full mb-8">
            <motion.div
              className="h-full bg-gradient-to-r from-[#71308A] to-[#8A4D9D] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="p-4 rounded-lg"
              >
                {step === 1 && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">What type of buyer are you?</p>
                    {["individual", "company"].map((type) => (
                      <label
                        key={type}
                        className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg transition-all hover:border-[#71308A] dark:hover:border-[#8A4D9D] cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="type"
                          value={type}
                          checked={formData.type === type}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-[#71308A] border-gray-300 focus:ring-[#71308A] dark:focus:ring-[#8A4D9D]"
                        />
                        <span className="ml-3 text-gray-700 dark:text-gray-300 capitalize">{type}</span>
                      </label>
                    ))}
                    {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { name: "firstName", label: "First Name", icon: User },
                        { name: "lastName", label: "Last Name", icon: User },
                      ].map((field) => (
                        <div key={field.name} className="relative">
                          <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                          <input
                            type="text"
                            name={field.name}
                            placeholder={field.label}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-[#71308A] dark:focus:ring-[#8A4D9D] focus:border-[#71308A] dark:focus:border-[#8A4D9D] focus:outline-none transition-all duration-200"
                          />
                          {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>}
                        </div>
                      ))}
                    </div>
                    {[
                      { name: "email", label: "Email Address", icon: Mail, type: "email" },
                      { name: "phone", label: "Phone Number", icon: Phone, type: "tel" },
                      { name: "city", label: "City", icon: MapPin, type: "text" },
                    ].map((field) => (
                      <div key={field.name} className="relative">
                        <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                        <input
                          type={field.type}
                          name={field.name}
                          placeholder={field.label}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-[#71308A] dark:focus:ring-[#8A4D9D] focus:border-[#71308A] dark:focus:border-[#8A4D9D] focus:outline-none transition-all duration-200"
                        />
                        {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>}
                      </div>
                    ))}
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="hasWhatsapp"
                        checked={formData.hasWhatsapp}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-[#71308A] border-gray-300 rounded focus:ring-0 focus:ring-offset-0 focus:outline-none checked:bg-[#71308A] checked:border-[#71308A] transition-colors duration-200"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">This number has WhatsApp</span>
                      {formData.hasWhatsapp && <MessageCircle className="w-4 h-4 ml-2 text-green-500" />}
                    </label>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                      <input
                        type="date"
                        name="visitDate"
                        value={formData.visitDate}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-[#71308A] dark:focus:ring-[#8A4D9D] focus:border-[#71308A] dark:focus:border-[#8A4D9D] focus:outline-none transition-all duration-200"
                      />
                      {errors.visitDate && <p className="text-red-500 text-xs mt-1">{errors.visitDate}</p>}
                    </div>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                      <select
                        name="visitTime"
                        value={formData.visitTime}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-[#71308A] dark:focus:ring-[#8A4D9D] focus:border-[#71308A] dark:focus:border-[#8A4D9D] focus:outline-none transition-all duration-200 appearance-none"
                      >
                        <option value="">Select a time slot</option>
                        <option value="9:00-12:00">9:00 - 12:00</option>
                        <option value="16:00-21:00">16:00 - 21:00</option>
                      </select>
                      <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 pointer-events-none" />
                      {errors.visitTime && <p className="text-red-500 text-xs mt-1">{errors.visitTime}</p>}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 text-gray-400 dark:text-gray-500 h-5 w-5" />
                      <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleInputChange}
                        placeholder="Additional notes or questions"
                        rows={4}
                        className="w-full pl-10 pr-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-[#71308A] dark:focus:ring-[#8A4D9D] focus:border-[#71308A] dark:focus:border-[#8A4D9D] focus:outline-none transition-all duration-200 scrollbar-thin scrollbar-thumb-[#71308A] scrollbar-track-gray-200 dark:scrollbar-thumb-[#8A4D9D] dark:scrollbar-track-gray-700"
                      />
                    </div>
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleInputChange}
                        className="mt-1 w-4 h-4 text-[#71308A] border-gray-300 rounded focus:ring-0 focus:ring-offset-0 focus:outline-none checked:bg-[#71308A] checked:border-[#71308A] transition-colors duration-200"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        I accept the terms and conditions
                      </span>
                    </label>
                    {errors.acceptTerms && <p className="text-red-500 text-xs">{errors.acceptTerms}</p>}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-4 pt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#71308A] dark:focus:ring-[#8A4D9D] transition-colors shadow-md hover:shadow-lg"
                >
                  Back
                </button>
              )}
              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-[#71308A] to-[#8A4D9D] text-white rounded-md text-sm font-medium hover:from-[#5f2873] hover:to-[#7A3D8D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#71308A] transition-colors shadow-md hover:shadow-lg"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-[#71308A] to-[#8A4D9D] text-white rounded-md text-sm font-medium hover:from-[#5f2873] hover:to-[#7A3D8D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#71308A] transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="w-1/3 bg-gray-50 dark:bg-gray-900 p-8 overflow-y-auto max-h-[80vh]">{renderSummary()}</div>
      </motion.div>
    </motion.div>
  )
}

