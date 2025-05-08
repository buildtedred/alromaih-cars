"use client"

import { useState, useEffect, useRef } from "react"
import {
  X,
  ChevronRight,
  ChevronLeft,
  User,
  Mail,
  Phone,
  FileText,
  Check,
  Download,
  CreditCard,
  Briefcase,
  Building,
  BadgeCheck,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { OrderPDF } from "./orderPDF.jsx"
import { fetchImageAsBase64 } from "./fetch-image.jsx"
import { usePathname } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import Image from "next/image"

// Add this after the imports
const inputStyles = {
  /* Hide number input spinner */
  WebkitAppearance: "none",
  MozAppearance: "textfield",
}

export function MultiStepPopup({ isOpen, onClose, car_Details, activePaymentMethod }) {
  const pathname = usePathname()
  const isEnglish = pathname.startsWith("/en")

  // Refs for accessibility and focus management
  const modalRef = useRef(null)
  const firstFocusableElementRef = useRef(null)
  const lastFocusableElementRef = useRef(null)

  // Form state
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    type: "",
    paymentMethod: activePaymentMethod || "",
    firstName: "",
    nationalId: "",
    email: "",
    phone: "",
    hasWhatsapp: false,
    // Financial info fields
    jobSector: "",
    salary: "",
    bankName: "",
    existingLoans: "",
    personalLoanAmount: "",
    propertyLoanAmount: "",
    bankVerified: "",
    // Additional fields
    note: "",
    acceptTerms: false,
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [carImage, setCarImage] = useState(null)
  const [imageError, setImageError] = useState(false)
  const [pdfReady, setPdfReady] = useState(false)

  // Add translation mappings for dropdown values
  const translations = {
    // Job Sector translations
    "قطاع حكومي": "Government Sector",
    "قطاع خاص": "Private Sector",
    عسكري: "Military",
    متقاعد: "Retired",

    // Bank verification translations
    معتمد: "Verified",
    "غير معتمد": "Not Verified",

    // Bank name translations
    الراجحي: "Al Rajhi Bank",
    الاهلي: "National Commercial Bank",
    الانماء: "Alinma Bank",
    الرياض: "Riyad Bank",
    البلاد: "Bank Albilad",
    ساب: "SABB",
    سامبا: "Samba Financial Group",
    "بنك البلاد": "Bank Albilad",
  }

  // Helper function to translate values
  const translateValue = (value) => {
    if (!isEnglish || !value) return value
    return translations[value] || value
  }

  // Handle form closure and trap focus
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"

      // Set focus to modal when opened
      if (modalRef.current) {
        setTimeout(() => {
          modalRef.current.focus()
        }, 100)
      }

      // Handle escape key to close modal
      const handleEscapeKey = (e) => {
        if (e.key === "Escape") {
          resetForm()
          onClose()
        }
      }

      window.addEventListener("keydown", handleEscapeKey)
      return () => {
        document.body.style.overflow = "unset"
        window.removeEventListener("keydown", handleEscapeKey)
      }
    } else {
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  // Focus trap inside modal
  useEffect(() => {
    const handleTabKey = (e) => {
      if (!isOpen || !modalRef.current) return

      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === firstFocusableElementRef.current) {
          e.preventDefault()
          lastFocusableElementRef.current?.focus()
        } else if (!e.shiftKey && document.activeElement === lastFocusableElementRef.current) {
          e.preventDefault()
          firstFocusableElementRef.current?.focus()
        }
      }
    }

    window.addEventListener("keydown", handleTabKey)
    return () => {
      window.removeEventListener("keydown", handleTabKey)
    }
  }, [isOpen])

  // Load car image if available
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

  // Set payment method from props
  useEffect(() => {
    if (activePaymentMethod) {
      setFormData((prev) => ({
        ...prev,
        paymentMethod: activePaymentMethod,
      }))
    }
  }, [activePaymentMethod])

  if (!isOpen) return null

  // Form handling functions
  const resetForm = () => {
    setStep(1)
    setFormData({
      type: "",
      paymentMethod: activePaymentMethod || "",
      firstName: "",
      nationalId: "",
      email: "",
      phone: "",
      hasWhatsapp: false,
      // Financial info fields
      jobSector: "",
      salary: "",
      bankName: "",
      existingLoans: "",
      personalLoanAmount: "",
      propertyLoanAmount: "",
      bankVerified: "",
      // Additional fields
      note: "",
      acceptTerms: false,
    })
    setErrors({})
    setPdfReady(false)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateStep = (currentStep) => {
    const stepErrors = {}

    // Get the actual form content we're validating, not just the step number
    const formContent = getFormStepContent()

    switch (formContent) {
      case "buyerType":
        if (!formData.type) stepErrors.type = isEnglish ? "Please select a buyer type" : "الرجاء اختيار نوع المشتري"
        break

      case "paymentMethod":
        if (!formData.paymentMethod)
          stepErrors.paymentMethod = isEnglish ? "Please select a payment method" : "الرجاء اختيار طريقة الدفع"
        break

      case "financialInfo":
        if (!formData.jobSector) stepErrors.jobSector = isEnglish ? "Job sector is required" : "قطاع العمل مطلوب"
        if (formData.jobSector === "قطاع خاص" && !formData.bankVerified)
          stepErrors.bankVerified = isEnglish
            ? "Please specify if your bank is verified"
            : "يرجى تحديد ما إذا كان البنك معتمد"
        if (!formData.salary.trim()) stepErrors.salary = isEnglish ? "Salary amount is required" : "مبلغ الراتب مطلوب"
        if (!formData.bankName.trim())
          stepErrors.bankName = isEnglish ? "Bank name is required" : "اسم البنك و الشركة التمويل مطلوب"
        if (!formData.existingLoans)
          stepErrors.existingLoans = isEnglish
            ? "Please specify if you have existing obligations"
            : "يرجى تحديد ما إذا كان لديك التزامات حالية"
        if (formData.existingLoans === "yes") {
          if (!formData.personalLoanAmount.trim() && !formData.propertyLoanAmount.trim())
            stepErrors.loanDetails = isEnglish
              ? "Please provide details for at least one obligation type"
              : "يرجى تقديم تفاصيل لنوع التزام واحد على الأقل"
        }
        break

      case "personalInfo":
        if (!formData.firstName.trim()) stepErrors.firstName = isEnglish ? "Name is required" : "الاسم مطلوب"
        if (!formData.nationalId.trim())
          stepErrors.nationalId = isEnglish ? "National ID is required" : "رقم الهوية الوطنية مطلوب"
        if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email))
          stepErrors.email = isEnglish ? "Email is invalid" : "البريد الإلكتروني غير صالح"
        if (!formData.phone.trim()) stepErrors.phone = isEnglish ? "Phone number is required" : "رقم الهاتف مطلوب"
        break

      case "confirmation":
        if (!formData.acceptTerms)
          stepErrors.acceptTerms = isEnglish
            ? "You must accept the terms and conditions"
            : "يجب عليك قبول الشروط والأحكام"
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

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateStep(5)) {
      setIsLoading(true)
      try {
        // Prepare data for submission
        const orderData = {
          ...formData,
          car_details: car_Details,
          order_date: new Date().toISOString(),
        }

        // Simulate API call - replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 2000))
        console.log("Order submitted:", orderData)

        // Set PDF ready for download
        setPdfReady(true)

        // Show success feedback
        alert(isEnglish ? "Your order has been successfully submitted!" : "تم إرسال طلبك بنجاح!")

        // Reset form and close popup
        setIsLoading(false)
        resetForm()
        onClose()
      } catch (error) {
        console.error("Error submitting form:", error)
        alert(
          isEnglish
            ? "There was an error submitting your order. Please try again."
            : "حدث خطأ أثناء إرسال طلبك. يرجى المحاولة مرة أخرى.",
        )
        setIsLoading(false)
      }
    }
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  }

  const isAllDataFilled = () => {
    // Base requirements for all forms
    const baseRequirements =
      formData.type && formData.paymentMethod && formData.firstName && formData.nationalId && formData.phone

    // Additional requirements for finance payment method
    if (formData.paymentMethod === "finance") {
      const financeRequirements =
        baseRequirements && formData.jobSector && formData.salary && formData.bankName && formData.existingLoans

      // Add bank verification requirement for private sector
      if (formData.jobSector === "قطاع خاص") {
        const privateRequirements = financeRequirements && formData.bankVerified

        // If they have existing loans, they must provide at least one loan amount
        if (formData.existingLoans === "yes") {
          return privateRequirements && (formData.personalLoanAmount.trim() || formData.propertyLoanAmount.trim())
        }

        return privateRequirements
      }

      // If they have existing loans, they must provide at least one loan amount
      if (formData.existingLoans === "yes") {
        return financeRequirements && (formData.personalLoanAmount.trim() || formData.propertyLoanAmount.trim())
      }

      return financeRequirements
    }

    return baseRequirements
  }

  // Calculate total number of steps based on payment method
  const getTotalSteps = () => {
    if (activePaymentMethod) {
      return activePaymentMethod === "finance" ? 4 : 3
    } else {
      return 4
    }
  }

  // Get the current visual step number (for display purposes)
  const getStepDisplayNumber = (currentStep) => {
    if (activePaymentMethod) {
      if (activePaymentMethod === "finance") {
        // With finance pre-selected: 1->2->3->4
        return currentStep
      } else {
        // With cash pre-selected: 1->2->3
        return currentStep === 1 ? 1 : currentStep - 1
      }
    } else {
      // No pre-selected payment: 1->2->3->4
      return currentStep
    }
  }

  // Determine which form step to show
  const getFormStepContent = () => {
    // If payment method is pre-selected
    if (activePaymentMethod) {
      if (activePaymentMethod === "finance") {
        // For finance pre-selected
        switch (step) {
          case 1:
            return "buyerType"
          case 2:
            return "personalInfo"
          case 3:
            return "financialInfo"
          case 4:
            return "confirmation"
          default:
            return "buyerType"
        }
      } else {
        // For cash pre-selected
        switch (step) {
          case 1:
            return "buyerType"
          case 2:
            return "personalInfo"
          case 3:
            return "confirmation"
          default:
            return "buyerType"
        }
      }
    } else {
      // No pre-selected payment method
      switch (step) {
        case 1:
          return "buyerType"
        case 2:
          return "paymentMethod"
        case 3:
          return "personalInfo"
        case 4:
          return formData.paymentMethod === "finance" ? "financialInfo" : "confirmation"
        case 5:
          return "confirmation"
        default:
          return "buyerType"
      }
    }
  }

  // Function to render the correct button based on step
  const renderActionButton = () => {
    const currentStep = getFormStepContent()

    // If we're on the confirmation step, show submit button
    if (currentStep === "confirmation") {
      return (
        <button
          type="submit"
          disabled={isLoading}
          className="relative overflow-hidden py-2 sm:py-3 px-6 sm:px-8 bg-gradient-to-r from-brand-primary to-brand-dark text-white rounded-xl text-sm font-medium hover:from-brand-dark hover:to-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-brand-dark to-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-x-0 group-hover:scale-x-100 origin-left"></span>
          <span className="relative flex items-center justify-center">
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isEnglish ? "Submitting..." : "جاري الإرسال..."}
              </span>
            ) : isEnglish ? (
              "Submit"
            ) : (
              "إرسال"
            )}
          </span>
        </button>
      )
    }

    // For all other steps, show next button
    return (
      <button
        type="button"
        onClick={handleNext}
        className="relative overflow-hidden py-2 sm:py-3 px-6 sm:px-8 bg-gradient-to-r from-brand-primary to-brand-dark text-white rounded-xl text-sm font-medium hover:from-brand-dark hover:to-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50 transition-all duration-300 shadow-lg group"
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-brand-dark to-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-x-0 group-hover:scale-x-100 origin-left"></span>
        <span className="relative flex items-center justify-center">
          {isEnglish ? "Next" : "التالي"}
          {isEnglish ? <ChevronRight className="ml-1 w-4 h-4" /> : <ChevronLeft className="mr-1 w-4 h-4" />}
        </span>
      </button>
    )
  }

  const renderSummary = () => (
    <div className="bg-gradient-to-br from-brand-light to-white p-5 sm:p-7 rounded-2xl h-full shadow-md border border-brand-light">
      <div className="inline-flex items-center justify-center bg-gradient-to-r from-brand-primary to-brand-dark text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full mb-4 sm:mb-5 shadow-md">
        <span className="text-sm sm:text-base font-semibold">A</span>
      </div>
      <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-5 text-brand-primary">
        {isEnglish ? "Order Summary" : "ملخص الطلب"}
      </h3>

      {/* Car details at the top */}
      {car_Details && (
        <div className="mb-5 p-3 bg-white rounded-xl shadow-sm border border-brand-light">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-brand-light/70 rounded-lg overflow-hidden flex items-center justify-center">
              {car_Details?.brandLogo ? (
                <Image
                  src={car_Details.brandLogo || "/placeholder.svg"}
                  alt={car_Details?.brand || "Brand"}
                  width={30}
                  height={30}
                  className="object-contain"
                />
              ) : car_Details?.brand?.image ? (
                <Image
                  src={car_Details.brand.image || "/placeholder.svg"}
                  alt={car_Details?.brand?.name || "Brand"}
                  width={30}
                  height={30}
                  className="object-contain"
                />
              ) : null}
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">
                {car_Details?.name?.en ||
                  `${car_Details?.brand} ${car_Details?.model?.name || car_Details?.model || ""}`}
              </h4>
              <p className="text-xs text-gray-500">{car_Details?.modelYear?.en || car_Details?.year || ""}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3 sm:space-y-4 text-sm">
        {formData.type && (
          <div className="flex items-center p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200">
            <div className="w-7 h-7 rounded-full bg-brand-light/70 flex items-center justify-center mr-3 flex-shrink-0">
              <User className="w-3.5 h-3.5 text-brand-primary" />
            </div>
            <span className="text-gray-700">
              {isEnglish
                ? `Buyer Type: ${formData.type === "individual" ? "Individual" : "Company"}`
                : `نوع المشتري: ${formData.type === "individual" ? "للأفراد" : "للشركات"}`}
            </span>
          </div>
        )}
        {formData.paymentMethod && (
          <div className="flex items-center p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200">
            <div className="w-7 h-7 rounded-full bg-brand-light/70 flex items-center justify-center mr-3 flex-shrink-0">
              <CreditCard className="w-3.5 h-3.5 text-brand-primary" />
            </div>
            <span className="text-gray-700">
              {isEnglish
                ? `Payment: ${formData.paymentMethod === "cash" ? "Cash" : "Finance"}`
                : `طريقة الدفع: ${formData.paymentMethod === "cash" ? "نقدي" : "تمويل"}`}
            </span>
          </div>
        )}
        {formData.firstName && (
          <div className="flex items-center p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200">
            <div className="w-7 h-7 rounded-full bg-brand-light/70 flex items-center justify-center mr-3 flex-shrink-0">
              <User className="w-3.5 h-3.5 text-brand-primary" />
            </div>
            <span className="text-gray-700">
              {isEnglish ? `Name: ${formData.firstName}` : `الاسم: ${formData.firstName}`}
            </span>
          </div>
        )}
        {formData.nationalId && (
          <div className="flex items-center p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200">
            <div className="w-7 h-7 rounded-full bg-brand-light/70 flex items-center justify-center mr-3 flex-shrink-0">
              <FileText className="w-3.5 h-3.5 text-brand-primary" />
            </div>
            <span className="text-gray-700">
              {isEnglish ? `National ID: ${formData.nationalId}` : `رقم الهوية الوطنية: ${formData.nationalId}`}
            </span>
          </div>
        )}
        {formData.email && (
          <div className="flex items-center p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200">
            <div className="w-7 h-7 rounded-full bg-brand-light/70 flex items-center justify-center mr-3 flex-shrink-0">
              <Mail className="w-3.5 h-3.5 text-brand-primary" />
            </div>
            <span className="text-gray-700">
              {isEnglish ? `Email: ${formData.email}` : `البريد الإلكتروني: ${formData.email}`}
            </span>
          </div>
        )}
        {formData.phone && (
          <div className="flex items-center p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200">
            <div className="w-7 h-7 rounded-full bg-brand-light/70 flex items-center justify-center mr-3 flex-shrink-0">
              <Phone className="w-3.5 h-3.5 text-brand-primary" />
            </div>
            <div className="text-gray-700 flex items-center">
              {isEnglish ? `Phone: ${formData.phone}` : `رقم الهاتف: ${formData.phone}`}
              {formData.hasWhatsapp && (
                <span className="ml-2 bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full flex items-center">
                  <FontAwesomeIcon icon={faWhatsapp} className="w-3 h-3 mr-1" />
                  WhatsApp
                </span>
              )}
            </div>
          </div>
        )}
        {formData.paymentMethod === "finance" && formData.jobSector && (
          <div className="flex items-center p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200">
            <div className="w-7 h-7 rounded-full bg-brand-light/70 flex items-center justify-center mr-3 flex-shrink-0">
              <Briefcase className="w-3.5 h-3.5 text-brand-primary" />
            </div>
            <span className="text-gray-700">
              {isEnglish ? `Job Sector: ${translateValue(formData.jobSector)}` : `الوظيفة: ${formData.jobSector}`}
            </span>
          </div>
        )}
        {formData.paymentMethod === "finance" && formData.salary && (
          <div className="flex items-center p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200">
            <div className="w-7 h-7 rounded-full bg-brand-light/70 flex items-center justify-center mr-3 flex-shrink-0">
              <CreditCard className="w-3.5 h-3.5 text-brand-primary" />
            </div>
            <span className="text-gray-700">
              {isEnglish ? `Salary: ${formData.salary} SAR` : `الراتب: ${formData.salary} ريال`}
            </span>
          </div>
        )}
        {formData.paymentMethod === "finance" && formData.bankName && (
          <div className="flex items-center p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200">
            <div className="w-7 h-7 rounded-full bg-brand-light/70 flex items-center justify-center mr-3 flex-shrink-0">
              <Building className="w-3.5 h-3.5 text-brand-primary" />
            </div>
            <span className="text-gray-700">
              {isEnglish ? `Bank: ${translateValue(formData.bankName)}` : `البنك: ${formData.bankName}`}
            </span>
          </div>
        )}
        {formData.paymentMethod === "finance" && formData.existingLoans && (
          <div className="flex items-center p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200">
            <div className="w-7 h-7 rounded-full bg-brand-light/70 flex items-center justify-center mr-3 flex-shrink-0">
              <FileText className="w-3.5 h-3.5 text-brand-primary" />
            </div>
            <span className="text-gray-700">
              {isEnglish
                ? `Existing Obligations: ${formData.existingLoans === "yes" ? "Yes" : "No"}`
                : `التزامات حالية: ${formData.existingLoans === "yes" ? "نعم" : "لا"}`}
            </span>
          </div>
        )}
        {formData.paymentMethod === "finance" && formData.existingLoans === "yes" && formData.personalLoanAmount && (
          <div className="flex items-center p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200">
            <div className="w-7 h-7 rounded-full bg-brand-light/70 flex items-center justify-center mr-3 flex-shrink-0">
              <FileText className="w-3.5 h-3.5 text-brand-primary" />
            </div>
            <span className="text-gray-700">
              {isEnglish
                ? `Personal Obligation: ${formData.personalLoanAmount} SAR`
                : `التزام شخصي: ${formData.personalLoanAmount} ريال`}
            </span>
          </div>
        )}
        {formData.paymentMethod === "finance" && formData.existingLoans === "yes" && formData.propertyLoanAmount && (
          <div className="flex items-center p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200">
            <div className="w-7 h-7 rounded-full bg-brand-light/70 flex items-center justify-center mr-3 flex-shrink-0">
              <FileText className="w-3.5 h-3.5 text-brand-primary" />
            </div>
            <span className="text-gray-700">
              {isEnglish
                ? `Property Obligation: ${formData.propertyLoanAmount} SAR`
                : `التزام عقاري: ${formData.propertyLoanAmount} ريال`}
            </span>
          </div>
        )}
        {formData.paymentMethod === "finance" && formData.jobSector === "قطاع خاص" && formData.bankVerified && (
          <div className="flex items-center p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200">
            <div className="w-7 h-7 rounded-full bg-brand-light/70 flex items-center justify-center mr-3 flex-shrink-0">
              <BadgeCheck className="w-3.5 h-3.5 text-brand-primary" />
            </div>
            <span className="text-gray-700">
              {isEnglish
                ? `Bank Verified: ${translateValue(formData.bankVerified)}`
                : `البنك: ${formData.bankVerified}`}
            </span>
          </div>
        )}
      </div>

      {getFormStepContent() === "confirmation" && isAllDataFilled() && (
        <div className="mt-6">
          <PDFDownloadLink
            document={
              <OrderPDF formData={formData} carDetails={car_Details} carImage={carImage} isEnglish={isEnglish} />
            }
            fileName={`car-order-${formData.firstName}-${new Date().toISOString().split("T")[0]}.pdf`}
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-dark text-white text-sm hover:from-brand-dark hover:to-brand-primary transition-all duration-300 shadow-md"
          >
            {({ blob, url, loading, error }) =>
              loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  {isEnglish ? "Generating..." : "جاري..."}
                </span>
              ) : (
                <>
                  <Download className="mr-2 w-4 h-4" />
                  {isEnglish ? "Download PDF" : "طباعة الورق"}
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
      ref={modalRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-brand-dark/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto"
      dir={isEnglish ? "ltr" : "rtl"}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          resetForm()
          onClose()
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-2xl w-full max-w-6xl overflow-hidden shadow-2xl border border-brand-light my-1 sm:my-8 max-h-[98vh] sm:max-h-[95vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-4 sm:px-8 pt-5 sm:pt-6 pb-3 flex items-center justify-between border-b border-brand-light sticky top-0 bg-white z-10">
          <h2
            id="modal-title"
            className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-brand-primary to-brand-dark bg-clip-text text-transparent flex items-center"
          >
            {!isEnglish && <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 ml-2 text-brand-primary" />}
            {isEnglish && <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-brand-primary" />}

            {isEnglish && getFormStepContent() === "buyerType" && "Buyer Type"}
            {!isEnglish && getFormStepContent() === "buyerType" && "نوع المشتري"}

            {isEnglish && getFormStepContent() === "paymentMethod" && "Payment Method"}
            {!isEnglish && getFormStepContent() === "paymentMethod" && "طريقة الدفع"}

            {isEnglish && getFormStepContent() === "financialInfo" && "Financial Information"}
            {!isEnglish && getFormStepContent() === "financialInfo" && "القسم المالي"}

            {isEnglish && getFormStepContent() === "personalInfo" && "Personal Information"}
            {!isEnglish && getFormStepContent() === "personalInfo" && "المعلومات الشخصية"}

            {isEnglish && getFormStepContent() === "confirmation" && "Confirmation"}
            {!isEnglish && getFormStepContent() === "confirmation" && "التأكيد"}

            {!isEnglish && <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-brand-primary" />}
            {isEnglish && <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 ml-2 text-brand-primary" />}
          </h2>
          <button
            ref={firstFocusableElementRef}
            onClick={() => {
              resetForm()
              onClose()
            }}
            className="text-gray-500 hover:text-brand-primary transition-colors p-2 rounded-full hover:bg-brand-light group"
            aria-label={isEnglish ? "Close dialog" : "اغلاق النافذة"}
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto flex-1 bg-gradient-to-b from-white to-brand-light/30">
          <div className="px-4 sm:px-8 py-5 sm:py-6">
            {/* Progress Steps */}
            <div className="flex justify-between items-center w-full mb-6 sm:mb-8 overflow-x-auto px-2 pb-2 -mx-2 sm:mx-0 px-2">
              <div className="w-full flex items-center justify-between max-w-3xl mx-auto min-w-max">
                {/* Dynamic Step Indicators */}
                <div className="flex flex-col items-center mx-2">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full ${
                      step >= 1
                        ? "bg-gradient-to-r from-brand-primary to-brand-dark text-white shadow-md"
                        : "border-2 border-gray-300 text-gray-400"
                    } transition-all duration-300`}
                  >
                    {step > 1 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : 1}
                  </div>
                  <span className="text-[10px] sm:text-xs mt-2 text-gray-700 font-medium whitespace-nowrap">
                    {isEnglish ? "Buyer Type" : "نوع المشتري"}
                  </span>
                </div>

                {activePaymentMethod ? (
                  // If payment method is pre-selected
                  <>
                    <div
                      className={`flex-1 h-1 mx-1 ${step >= 2 ? "bg-gradient-to-r from-brand-primary to-brand-dark" : "bg-gray-300"} transition-all duration-500`}
                    ></div>

                    <div className="flex flex-col items-center mx-2">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full ${
                          step >= 2
                            ? "bg-gradient-to-r from-brand-primary to-brand-dark text-white shadow-md"
                            : "border-2 border-gray-300 text-gray-400"
                        } transition-all duration-300`}
                      >
                        {step > 2 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : 2}
                      </div>
                      <span className="text-[10px] sm:text-xs mt-2 text-gray-700 font-medium whitespace-nowrap">
                        {isEnglish ? "Personal Info" : "المعلومات الشخصية"}
                      </span>
                    </div>

                    <div
                      className={`flex-1 h-1 mx-1 ${step >= 3 ? "bg-gradient-to-r from-brand-primary to-brand-dark" : "bg-gray-300"} transition-all duration-500`}
                    ></div>

                    <div className="flex flex-col items-center mx-2">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full ${
                          step >= 3
                            ? "bg-gradient-to-r from-brand-primary to-brand-dark text-white shadow-md"
                            : "border-2 border-gray-300 text-gray-400"
                        } transition-all duration-300`}
                      >
                        {step > 3 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : 3}
                      </div>
                      <span className="text-[10px] sm:text-xs mt-2 text-gray-700 font-medium whitespace-nowrap">
                        {activePaymentMethod === "finance"
                          ? isEnglish
                            ? "Financial Info"
                            : "القسم المالي"
                          : isEnglish
                            ? "Confirm"
                            : "التأكيد"}
                      </span>
                    </div>

                    {activePaymentMethod === "finance" && (
                      <>
                        <div
                          className={`flex-1 h-1 mx-1 ${step >= 4 ? "bg-gradient-to-r from-brand-primary to-brand-dark" : "bg-gray-300"} transition-all duration-500`}
                        ></div>

                        <div className="flex flex-col items-center mx-2">
                          <div
                            className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full ${
                              step >= 4
                                ? "bg-gradient-to-r from-brand-primary to-brand-dark text-white shadow-md"
                                : "border-2 border-gray-300 text-gray-400"
                            } transition-all duration-300`}
                          >
                            4
                          </div>
                          <span className="text-[10px] sm:text-xs mt-2 text-gray-700 font-medium whitespace-nowrap">
                            {isEnglish ? "Confirm" : "التأكيد"}
                          </span>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  // No pre-selected payment method, show complete step flow
                  <>
                    <div
                      className={`flex-1 h-1 mx-1 ${step >= 2 ? "bg-gradient-to-r from-brand-primary to-brand-dark" : "bg-gray-300"} transition-all duration-500`}
                    ></div>

                    <div className="flex flex-col items-center mx-2">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full ${
                          step >= 2
                            ? "bg-gradient-to-r from-brand-primary to-brand-dark text-white shadow-md"
                            : "border-2 border-gray-300 text-gray-400"
                        } transition-all duration-300`}
                      >
                        {step > 2 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : 2}
                      </div>
                      <span className="text-[10px] sm:text-xs mt-2 text-gray-700 font-medium whitespace-nowrap">
                        {isEnglish ? "Payment" : "طريقة الدفع"}
                      </span>
                    </div>

                    <div
                      className={`flex-1 h-1 mx-1 ${step >= 3 ? "bg-gradient-to-r from-brand-primary to-brand-dark" : "bg-gray-300"} transition-all duration-500`}
                    ></div>

                    <div className="flex flex-col items-center mx-2">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full ${
                          step >= 3
                            ? "bg-gradient-to-r from-brand-primary to-brand-dark text-white shadow-md"
                            : "border-2 border-gray-300 text-gray-400"
                        } transition-all duration-300`}
                      >
                        {step > 3 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : 3}
                      </div>
                      <span className="text-[10px] sm:text-xs mt-2 text-gray-700 font-medium whitespace-nowrap">
                        {isEnglish ? "Personal Info" : "المعلومات الشخصية"}
                      </span>
                    </div>

                    <div
                      className={`flex-1 h-1 mx-1 ${step >= 4 ? "bg-gradient-to-r from-brand-primary to-brand-dark" : "bg-gray-300"} transition-all duration-500`}
                    ></div>

                    <div className="flex flex-col items-center mx-2">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full ${
                          step >= 4
                            ? "bg-gradient-to-r from-brand-primary to-brand-dark text-white shadow-md"
                            : "border-2 border-gray-300 text-gray-400"
                        } transition-all duration-300`}
                      >
                        {step > 4 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : 4}
                      </div>
                      <span className="text-[10px] sm:text-xs mt-2 text-gray-700 font-medium whitespace-nowrap">
                        {formData.paymentMethod === "finance"
                          ? isEnglish
                            ? "Financial Info"
                            : "القسم المالي"
                          : isEnglish
                            ? "Confirm"
                            : "التأكيد"}
                      </span>
                    </div>

                    {formData.paymentMethod === "finance" && (
                      <>
                        <div
                          className={`flex-1 h-1 mx-1 ${step >= 5 ? "bg-gradient-to-r from-brand-primary to-brand-dark" : "bg-gray-300"} transition-all duration-500`}
                        ></div>

                        <div className="flex flex-col items-center mx-2">
                          <div
                            className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full ${
                              step >= 5
                                ? "bg-gradient-to-r from-brand-primary to-brand-dark text-white shadow-md"
                                : "border-2 border-gray-300 text-gray-400"
                            } transition-all duration-300`}
                          >
                            5
                          </div>
                          <span className="text-[10px] sm:text-xs mt-2 text-gray-700 font-medium whitespace-nowrap">
                            {isEnglish ? "Confirm" : "التأكيد"}
                          </span>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-5 sm:gap-8">
              <div className="hidden lg:block w-full lg:w-1/3">{renderSummary()}</div>
              <div className="w-full lg:w-2/3">
                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                      className="p-4 sm:p-6 rounded-2xl border border-brand-light shadow-md bg-white"
                    >
                      {getFormStepContent() === "buyerType" && (
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex items-center">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-light/70 flex items-center justify-center mr-3">
                              <User className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                            </div>
                            <div>
                              <h3 className="text-base sm:text-lg font-bold text-gray-800">
                                {isEnglish ? "Buyer Type" : "نوع المشتري"}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {isEnglish ? "What type of buyer are you?" : "ما نوع المشتري الذي أنت عليه؟"}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3 mt-3">
                            {["individual", "company"].map((type) => (
                              <label
                                key={type}
                                className={`flex items-center ${isEnglish ? "justify-between" : "justify-between"} p-3 sm:p-4 border-2 ${
                                  formData.type === type
                                    ? "border-brand-primary bg-brand-light shadow-lg"
                                    : "border-gray-200 hover:border-brand-light hover:bg-brand-light/30"
                                } rounded-xl transition-all duration-300 cursor-pointer group`}
                              >
                                <div className="flex items-center">
                                  <div
                                    className={`w-8 h-8 rounded-full ${
                                      formData.type === type
                                        ? "bg-brand-primary"
                                        : "bg-gray-100 group-hover:bg-brand-light/70"
                                    } flex items-center justify-center mr-3 transition-colors duration-300`}
                                  >
                                    {type === "individual" ? (
                                      <User
                                        className={`w-4 h-4 ${formData.type === type ? "text-white" : "text-gray-500 group-hover:text-brand-primary"} transition-colors duration-300`}
                                      />
                                    ) : (
                                      <Building
                                        className={`w-4 h-4 ${formData.type === type ? "text-white" : "text-gray-500 group-hover:text-brand-primary"} transition-colors duration-300`}
                                      />
                                    )}
                                  </div>
                                  <div>
                                    <span className="text-gray-800 font-medium text-sm sm:text-base capitalize">
                                      {isEnglish ? type : type === "individual" ? "للأفراد" : "للشركات"}
                                    </span>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      {type === "individual"
                                        ? isEnglish
                                          ? "For personal use"
                                          : "للاستخدام الشخصي"
                                        : isEnglish
                                          ? "For business use"
                                          : "للاستخدام التجاري"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-center">
                                  <input
                                    type="radio"
                                    name="type"
                                    value={type}
                                    checked={formData.type === type}
                                    onChange={handleInputChange}
                                    className="sr-only"
                                  />
                                  <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                      formData.type === type
                                        ? "border-brand-primary bg-brand-primary shadow-sm"
                                        : "border-gray-300 group-hover:border-brand-light"
                                    } transition-colors duration-300`}
                                  >
                                    {formData.type === type && (
                                      <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center justify-center"
                                      >
                                        <Check className="w-3 h-3 text-white" />
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                          <div className="h-4 mt-1">
                            {errors.type && (
                              <p className={`text-red-500 text-xs ${isEnglish ? "text-left" : "text-right"}`}>
                                {errors.type}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {getFormStepContent() === "paymentMethod" && (
                        <div className="space-y-5 sm:space-y-6">
                          <div className="flex items-center">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-light/70 flex items-center justify-center mr-4">
                              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-brand-primary" />
                            </div>
                            <div>
                              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                                {isEnglish ? "Payment Method" : "طريقة الدفع"}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {isEnglish ? "How would you like to pay?" : "كيف تريد أن تدفع؟"}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4 mt-6">
                            {[
                              {
                                id: "cash",
                                icon: <CreditCard className="w-5 h-5" />,
                                title: isEnglish ? "Cash" : "نقدي",
                                description: isEnglish ? "Pay the full amount upfront" : "دفع المبلغ كاملاً مقدماً",
                              },
                              {
                                id: "finance",
                                icon: <Building className="w-5 h-5" />,
                                title: isEnglish ? "Finance" : "تمويل",
                                description: isEnglish ? "Pay in monthly installments" : "دفع على أقساط شهرية",
                              },
                            ].map((method) => (
                              <label
                                key={method.id}
                                className={`flex items-center ${isEnglish ? "justify-between" : "justify-between"} p-4 sm:p-5 border-2 ${
                                  formData.paymentMethod === method.id
                                    ? "border-brand-primary bg-brand-light shadow-lg"
                                    : "border-gray-200 hover:border-brand-light hover:bg-brand-light/30"
                                } rounded-xl transition-all duration-300 cursor-pointer group`}
                              >
                                <div className="flex items-center">
                                  <div
                                    className={`w-10 h-10 rounded-full ${
                                      formData.paymentMethod === method.id
                                        ? "bg-brand-primary"
                                        : "bg-gray-100 group-hover:bg-brand-light/70"
                                    } flex items-center justify-center mr-4 transition-colors duration-300`}
                                  >
                                    <span
                                      className={`${formData.paymentMethod === method.id ? "text-white" : "text-gray-500 group-hover:text-brand-primary"} transition-colors duration-300`}
                                    >
                                      {method.icon}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-800 font-medium text-base sm:text-lg">
                                      {method.title}
                                    </span>
                                    <p className="text-xs text-gray-500 mt-1">{method.description}</p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-center">
                                  <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={method.id}
                                    checked={formData.paymentMethod === method.id}
                                    onChange={handleInputChange}
                                    className="sr-only"
                                  />
                                  <div
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                      formData.paymentMethod === method.id
                                        ? "border-brand-primary bg-brand-primary shadow-sm"
                                        : "border-gray-300 group-hover:border-brand-light"
                                    } transition-colors duration-300`}
                                  >
                                    {formData.paymentMethod === method.id && (
                                      <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center justify-center"
                                      >
                                        <Check className="w-3 h-3 text-white" />
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                          <div className="h-5 mt-1">
                            {errors.paymentMethod && (
                              <p className={`text-red-500 text-xs ${isEnglish ? "text-left" : "text-right"}`}>
                                {errors.paymentMethod}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {getFormStepContent() === "financialInfo" && (
                        <div className="space-y-5 sm:space-y-6">
                          <div className="flex items-center">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-light/70 flex items-center justify-center mr-4">
                              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-brand-primary" />
                            </div>
                            <div>
                              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                                {isEnglish ? "Financial Information" : "القسم المالي"}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {isEnglish
                                  ? "Please provide your financial details"
                                  : "يرجى تقديم التفاصيل المالية الخاصة بك"}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-6 mt-6">
                            <div className={`relative ${isEnglish ? "text-left" : "text-right"}`}>
                              <div className="relative">
                                <label
                                  className={`block mb-2 ${isEnglish ? "text-left" : "text-right"} text-gray-700 font-medium text-sm`}
                                >
                                  {isEnglish ? "Job Sector" : "الوظيفة"}
                                  <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="relative">
                                  <div
                                    className={`absolute top-0 bottom-0 ${isEnglish ? "left-3" : "right-3"} flex items-center pointer-events-none`}
                                  >
                                    <Briefcase className="w-5 h-5 text-brand-primary" />
                                  </div>
                                  <select
                                    name="jobSector"
                                    value={formData.jobSector}
                                    onChange={handleInputChange}
                                    className={`w-full p-3 sm:p-4 ${isEnglish ? "pl-10 sm:pl-12 text-left" : "pr-10 sm:pr-12 text-right"} border-2 border-gray-200 rounded-xl shadow-sm appearance-none bg-white focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:outline-none transition-all duration-300`}
                                  >
                                    <option value="">{isEnglish ? "Select job sector" : "اختر قطاع العمل"}</option>
                                    <option value="قطاع حكومي">{isEnglish ? "Government Sector" : "قطاع حكومي"}</option>
                                    <option value="قطاع خاص">{isEnglish ? "Private Sector" : "قطاع خاص"}</option>
                                    <option value="عسكري">{isEnglish ? "Military" : "عسكري"}</option>
                                    <option value="متقاعد">{isEnglish ? "Retired" : "متقاعد"}</option>
                                  </select>
                                  <div
                                    className={`absolute top-0 bottom-0 ${isEnglish ? "right-3" : "left-3"} pointer-events-none flex items-center justify-center`}
                                  >
                                    {isEnglish ? (
                                      <ChevronRight className="w-5 h-5 text-gray-400" />
                                    ) : (
                                      <ChevronLeft className="w-5 h-5 text-gray-400" />
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="h-5 mt-1">
                                {errors.jobSector && (
                                  <p className={`text-red-500 text-xs ${isEnglish ? "text-left" : "text-right"}`}>
                                    {errors.jobSector}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Bank Verification - Only show if jobSector is "قطاع خاص" */}
                            {formData.jobSector === "قطاع خاص" && (
                              <div className={`mb-6 relative ${isEnglish ? "text-left" : "text-right"}`}>
                                <label
                                  className={`block mb-2 ${isEnglish ? "text-left" : "text-right"} text-gray-700 font-medium text-sm`}
                                >
                                  {isEnglish ? "Is your bank verified?" : "هل البنك معتمد؟"}
                                  <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className={`flex ${isEnglish ? "flex-row" : "flex-row-reverse"} gap-4`}>
                                  <label
                                    className={`flex items-center ${isEnglish ? "" : "flex-row-reverse"} p-3 sm:p-4 border-2 ${formData.bankVerified === "معتمد" ? "border-brand-primary bg-brand-light shadow-md" : "border-gray-200 hover:border-brand-light hover:bg-brand-light/30"} rounded-xl transition-all duration-300 cursor-pointer flex-1`}
                                  >
                                    {isEnglish ? (
                                      <>
                                        <div
                                          className={`relative w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${formData.bankVerified === "معتمد" ? "border-brand-primary bg-brand-primary shadow-sm" : "border-gray-300"} mr-4 transition-colors duration-300`}
                                        >
                                          {formData.bankVerified === "معتمد" && (
                                            <motion.div
                                              initial={{ scale: 0, opacity: 0 }}
                                              animate={{ scale: 1, opacity: 1 }}
                                              transition={{ duration: 0.2 }}
                                              className="flex items-center justify-center"
                                            >
                                              <Check className="w-3 h-3 text-white" />
                                            </motion.div>
                                          )}
                                        </div>
                                        <span className="text-gray-700 font-medium">Verified</span>
                                      </>
                                    ) : (
                                      <>
                                        <span className="text-gray-700 font-medium">معتمد</span>
                                        <div
                                          className={`relative w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${formData.bankVerified === "معتمد" ? "border-brand-primary bg-brand-primary shadow-md" : "border-gray-300"} mr-0 ml-4 transition-colors duration-300`}
                                        >
                                          {formData.bankVerified === "معتمد" && (
                                            <motion.div
                                              initial={{ scale: 0, opacity: 0 }}
                                              animate={{ scale: 1, opacity: 1 }}
                                              transition={{ duration: 0.2 }}
                                              className="flex items-center justify-center"
                                            >
                                              <Check className="w-3 h-3 text-white" />
                                            </motion.div>
                                          )}
                                        </div>
                                      </>
                                    )}
                                    <input
                                      type="radio"
                                      name="bankVerified"
                                      value="معتمد"
                                      checked={formData.bankVerified === "معتمد"}
                                      onChange={handleInputChange}
                                      className="sr-only"
                                      aria-label={isEnglish ? "Verified" : "معتمد"}
                                    />
                                  </label>
                                  <label
                                    className={`flex items-center ${isEnglish ? "" : "flex-row-reverse"} p-3 sm:p-4 border-2 ${formData.bankVerified === "غير معتمد" ? "border-brand-primary bg-brand-light shadow-md" : "border-gray-200 hover:border-brand-light hover:bg-brand-light/30"} rounded-xl transition-all duration-300 cursor-pointer flex-1`}
                                  >
                                    {isEnglish ? (
                                      <>
                                        <div
                                          className={`relative w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${formData.bankVerified === "غير معتمد" ? "border-brand-primary bg-brand-primary shadow-md" : "border-gray-300"} mr-4 transition-colors duration-300`}
                                        >
                                          {formData.bankVerified === "غير معتمد" && (
                                            <motion.div
                                              initial={{ scale: 0, opacity: 0 }}
                                              animate={{ scale: 1, opacity: 1 }}
                                              transition={{ duration: 0.2 }}
                                              className="flex items-center justify-center"
                                            >
                                              <Check className="w-3 h-3 text-white" />
                                            </motion.div>
                                          )}
                                        </div>
                                        <span className="text-gray-700 font-medium">Not Verified</span>
                                      </>
                                    ) : (
                                      <>
                                        <span className="text-gray-700 font-medium">غير معتمد</span>
                                        <div
                                          className={`relative w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${formData.bankVerified === "غير معتمد" ? "border-brand-primary bg-brand-primary shadow-md" : "border-gray-300"} mr-0 ml-4 transition-colors duration-300`}
                                        >
                                          {formData.bankVerified === "غير معتمد" && (
                                            <motion.div
                                              initial={{ scale: 0, opacity: 0 }}
                                              animate={{ scale: 1, opacity: 1 }}
                                              transition={{ duration: 0.2 }}
                                              className="flex items-center justify-center"
                                            >
                                              <Check className="w-3 h-3 text-white" />
                                            </motion.div>
                                          )}
                                        </div>
                                      </>
                                    )}
                                    <input
                                      type="radio"
                                      name="bankVerified"
                                      value="غير معتمد"
                                      checked={formData.bankVerified === "غير معتمد"}
                                      onChange={handleInputChange}
                                      className="sr-only"
                                      aria-label={isEnglish ? "Not Verified" : "غير معتمد"}
                                    />
                                  </label>
                                </div>
                                <div className="h-5 mt-1">
                                  {errors.bankVerified && (
                                    <p className={`text-red-500 text-xs ${isEnglish ? "text-left" : "text-right"}`}>
                                      {errors.bankVerified}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className={`relative ${isEnglish ? "text-left" : "text-right"}`}>
                              <div className="relative">
                                <label
                                  className={`block mb-2 ${isEnglish ? "text-left" : "text-right"} text-gray-700 font-medium text-sm`}
                                >
                                  {isEnglish ? "Monthly Salary" : "مبلغ الراتب"}
                                  <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="relative">
                                  <div
                                    className={`absolute top-0 bottom-0 ${isEnglish ? "left-3" : "right-3"} flex items-center pointer-events-none`}
                                  >
                                    <CreditCard className="w-5 h-5 text-brand-primary" />
                                  </div>
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    name="salary"
                                    placeholder={isEnglish ? "Enter your monthly salary" : "مبلغ الراتب"}
                                    value={formData.salary}
                                    onChange={handleInputChange}
                                    className={`w-full p-3 sm:p-4 ${isEnglish ? "pl-10 sm:pl-12 text-left" : "pr-10 sm:pr-12 text-right"} border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:outline-none transition-all duration-300`}
                                  />
                                  <div
                                    className={`absolute top-0 bottom-0 ${isEnglish ? "right-3" : "left-3"} flex items-center pointer-events-none`}
                                  >
                                    <img src="/icons/Currency.svg" alt="Currency" className="w-5 h-5" />
                                  </div>
                                </div>
                                <div className="h-5 mt-1">
                                  {errors.salary && (
                                    <p className={`text-red-500 text-xs ${isEnglish ? "text-left" : "text-right"}`}>
                                      {errors.salary}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className={`relative ${isEnglish ? "text-left" : "text-right"}`}>
                              <div className="relative">
                                <label
                                  className={`block mb-2 ${isEnglish ? "text-left" : "text-right"} text-gray-700 font-medium text-sm`}
                                >
                                  {isEnglish ? "Bank/Finance Company" : "اسم البنك والشركة التمويل"}
                                  <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="relative">
                                  <div
                                    className={`absolute top-0 bottom-0 ${isEnglish ? "left-3" : "right-3"} flex items-center pointer-events-none`}
                                  >
                                    <Building className="w-5 h-5 text-brand-primary" />
                                  </div>
                                  <select
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleInputChange}
                                    className={`w-full p-3 sm:p-4 ${isEnglish ? "pl-10 sm:pl-12 text-left" : "pr-10 sm:pr-12 text-right"} border-2 border-gray-200 rounded-xl shadow-sm appearance-none bg-white focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:outline-none transition-all duration-300`}
                                  >
                                    <option value="">{isEnglish ? "Select bank" : "اختر البنك"}</option>
                                    <option value="الراجحي">{isEnglish ? "Al Rajhi Bank" : "الراجحي"}</option>
                                    <option value="الاهلي">{isEnglish ? "National Commercial Bank" : "الاهلي"}</option>
                                    <option value="الانماء">{isEnglish ? "Alinma Bank" : "الانماء"}</option>
                                    <option value="الرياض">{isEnglish ? "Riyad Bank" : "الرياض"}</option>
                                    <option value="البلاد">{isEnglish ? "Bank Albilad" : "البلاد"}</option>
                                    <option value="ساب">{isEnglish ? "SABB" : "ساب"}</option>
                                    <option value="سامبا">{isEnglish ? "Samba Financial Group" : "سامبا"}</option>
                                    <option value="بنك البلاد">{isEnglish ? "Bank Albilad" : "بنك البلاد"}</option>
                                  </select>
                                  <div
                                    className={`absolute top-0 bottom-0 ${isEnglish ? "right-3" : "left-3"} pointer-events-none flex items-center justify-center`}
                                  >
                                    {isEnglish ? (
                                      <ChevronRight className="w-5 h-5 text-gray-400" />
                                    ) : (
                                      <ChevronLeft className="w-5 h-5 text-gray-400" />
                                    )}
                                  </div>
                                </div>
                                <div className="h-5 mt-1">
                                  {errors.bankName && (
                                    <p className={`text-red-500 text-xs ${isEnglish ? "text-left" : "text-right"}`}>
                                      {errors.bankName}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className={`relative ${isEnglish ? "text-left" : "text-right"}`}>
                              <label
                                className={`block mb-2 ${isEnglish ? "text-left" : "text-right"} text-gray-700 font-medium text-sm`}
                              >
                                {isEnglish ? "Do you have existing obligations?" : "هل لديك التزامات حالية؟"}
                                <span className="text-red-500 ml-1">*</span>
                              </label>
                              <div className={`flex ${isEnglish ? "flex-row" : "flex-row-reverse"} gap-4`}>
                                <label
                                  className={`flex items-center ${isEnglish ? "" : "flex-row-reverse"} p-3 sm:p-4 border-2 ${formData.existingLoans === "yes" ? "border-brand-primary bg-brand-light shadow-md" : "border-gray-200 hover:border-brand-light hover:bg-brand-light/30"} rounded-xl transition-all duration-300 cursor-pointer flex-1`}
                                >
                                  {isEnglish ? (
                                    <>
                                      <div
                                        className={`relative w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${formData.existingLoans === "yes" ? "border-brand-primary bg-brand-primary shadow-sm" : "border-gray-300"} mr-4 transition-colors duration-300`}
                                      >
                                        {formData.existingLoans === "yes" && (
                                          <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex items-center justify-center"
                                          >
                                            <Check className="w-3 h-3 text-white" />
                                          </motion.div>
                                        )}
                                      </div>
                                      <span className="text-gray-700 font-medium">Yes</span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="text-gray-700 font-medium">نعم</span>
                                      <div
                                        className={`relative w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${formData.existingLoans === "yes" ? "border-brand-primary bg-brand-primary shadow-sm" : "border-gray-300"} mr-0 ml-4 transition-colors duration-300`}
                                      >
                                        {formData.existingLoans === "yes" && (
                                          <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex items-center justify-center"
                                          >
                                            <Check className="w-3 h-3 text-white" />
                                          </motion.div>
                                        )}
                                      </div>
                                    </>
                                  )}
                                  <input
                                    type="radio"
                                    name="existingLoans"
                                    value="yes"
                                    checked={formData.existingLoans === "yes"}
                                    onChange={handleInputChange}
                                    className="sr-only"
                                    aria-label={isEnglish ? "Yes" : "نعم"}
                                  />
                                </label>
                                <label
                                  className={`flex items-center ${isEnglish ? "" : "flex-row-reverse"} p-3 sm:p-4 border-2 ${formData.existingLoans === "no" ? "border-brand-primary bg-brand-light shadow-md" : "border-gray-200 hover:border-brand-light hover:bg-brand-light/30"} rounded-xl transition-all duration-300 cursor-pointer flex-1`}
                                >
                                  {isEnglish ? (
                                    <>
                                      <div
                                        className={`relative w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${formData.existingLoans === "no" ? "border-brand-primary bg-brand-primary shadow-sm" : "border-gray-300"} mr-4 transition-colors duration-300`}
                                      >
                                        {formData.existingLoans === "no" && (
                                          <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex items-center justify-center"
                                          >
                                            <Check className="w-3 h-3 text-white" />
                                          </motion.div>
                                        )}
                                      </div>
                                      <span className="text-gray-700 font-medium">No</span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="text-gray-700 font-medium">لا</span>
                                      <div
                                        className={`relative w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${formData.existingLoans === "no" ? "border-brand-primary bg-brand-primary shadow-sm" : "border-gray-300"} mr-0 ml-4 transition-colors duration-300`}
                                      >
                                        {formData.existingLoans === "no" && (
                                          <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex items-center justify-center"
                                          >
                                            <Check className="w-3 h-3 text-white" />
                                          </motion.div>
                                        )}
                                      </div>
                                    </>
                                  )}
                                  <input
                                    type="radio"
                                    name="existingLoans"
                                    value="no"
                                    checked={formData.existingLoans === "no"}
                                    onChange={handleInputChange}
                                    className="sr-only"
                                    aria-label={isEnglish ? "No" : "لا"}
                                  />
                                </label>
                              </div>
                              <div className="h-5 mt-1">
                                {errors.existingLoans && (
                                  <p className={`text-red-500 text-xs ${isEnglish ? "text-left" : "text-right"}`}>
                                    {errors.existingLoans}
                                  </p>
                                )}
                              </div>
                            </div>

                            {formData.existingLoans === "yes" && (
                              <div className="space-y-5 bg-gradient-to-br from-brand-light to-white p-4 sm:p-5 rounded-xl mb-4 border border-brand-light shadow-sm">
                                <h4
                                  className={`font-semibold text-brand-primary ${isEnglish ? "text-left" : "text-right"} text-base mb-4`}
                                >
                                  {isEnglish ? "Obligation Details" : "تفاصيل الالتزامات"}
                                </h4>

                                <div className="relative">
                                  <div className="relative">
                                    <label
                                      className={`block mb-2 ${isEnglish ? "text-left" : "text-right"} text-gray-700 font-medium text-sm`}
                                    >
                                      {isEnglish ? "Personal Obligation Amount" : "مبلغ الالتزام الشخصي"}
                                    </label>
                                    <div className="relative">
                                      <div
                                        className={`absolute top-0 bottom-0 ${isEnglish ? "left-3" : "right-3"} flex items-center pointer-events-none`}
                                      >
                                        <CreditCard className="w-5 h-5 text-brand-primary" />
                                      </div>
                                      <input
                                        type="text"
                                        inputMode="numeric"
                                        name="personalLoanAmount"
                                        placeholder={
                                          isEnglish ? "Enter amount if applicable" : "أدخل المبلغ إذا كان متاحًا"
                                        }
                                        value={formData.personalLoanAmount}
                                        onChange={handleInputChange}
                                        className={`w-full p-3 sm:p-4 ${isEnglish ? "pl-10 sm:pl-12 text-left" : "pr-10 sm:pr-12 text-right"} border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:outline-none transition-all duration-300`}
                                        style={inputStyles}
                                      />
                                      <div
                                        className={`absolute top-0 bottom-0 ${isEnglish ? "right-3" : "left-3"} flex items-center pointer-events-none`}
                                      >
                                        <img src="/icons/Currency.svg" alt="Currency" className="w-5 h-5" />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="relative">
                                  <div className="relative">
                                    <label
                                      className={`block mb-2 ${isEnglish ? "text-left" : "text-right"} text-gray-700 font-medium text-sm`}
                                    >
                                      {isEnglish ? "Property Obligation Amount" : "مبلغ الالتزام العقاري"}
                                    </label>
                                    <div className="relative">
                                      <div
                                        className={`absolute top-0 bottom-0 ${isEnglish ? "left-3" : "right-3"} flex items-center pointer-events-none`}
                                      >
                                        <Building className="w-5 h-5 text-brand-primary" />
                                      </div>
                                      <input
                                        type="text"
                                        inputMode="numeric"
                                        name="propertyLoanAmount"
                                        placeholder={
                                          isEnglish ? "Enter amount if applicable" : "أدخل المبلغ إذا كان متاحًا"
                                        }
                                        value={formData.propertyLoanAmount}
                                        onChange={handleInputChange}
                                        className={`w-full p-3 sm:p-4 ${isEnglish ? "pl-10 sm:pl-12 text-left" : "pr-10 sm:pr-12 text-right"} border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:outline-none transition-all duration-300`}
                                        style={inputStyles}
                                      />
                                      <div
                                        className={`absolute top-0 bottom-0 ${isEnglish ? "right-3" : "left-3"} flex items-center pointer-events-none`}
                                      >
                                        <img src="/icons/Currency.svg" alt="Currency" className="w-5 h-5" />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="h-5 mt-1">
                                  {errors.loanDetails && (
                                    <p className={`text-red-500 text-xs ${isEnglish ? "text-left" : "text-right"}`}>
                                      {errors.loanDetails}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {getFormStepContent() === "personalInfo" && (
                        <div className="space-y-5 sm:space-y-6">
                          <div className="flex items-center">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-light/70 flex items-center justify-center mr-4">
                              <User className="w-5 h-5 sm:w-6 sm:h-6 text-brand-primary" />
                            </div>
                            <div>
                              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                                {isEnglish ? "Personal Information" : "المعلومات الشخصية"}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {isEnglish
                                  ? "Please provide your contact details"
                                  : "يرجى تقديم تفاصيل الاتصال الخاصة بك"}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-6 mt-6">
                            <div className={`relative ${isEnglish ? "text-left" : "text-right"}`}>
                              <div className="relative">
                                <label
                                  className={`block mb-2 ${isEnglish ? "text-left" : "text-right"} text-gray-700 font-medium text-sm`}
                                >
                                  {isEnglish ? "Full Name" : "الاسم"}
                                  <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="relative">
                                  <div
                                    className={`absolute top-0 bottom-0 ${isEnglish ? "left-3" : "right-3"} flex items-center pointer-events-none`}
                                  >
                                    <User className="w-5 h-5 text-brand-primary" />
                                  </div>
                                  <input
                                    type="text"
                                    name="firstName"
                                    placeholder={isEnglish ? "Enter your full name" : "أدخل اسمك الكامل"}
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className={`w-full p-3 sm:p-4 ${isEnglish ? "pl-10 sm:pl-12 text-left" : "pr-10 sm:pr-12 text-right"} border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:outline-none transition-all duration-300`}
                                  />
                                </div>
                                <div className="h-5 mt-1">
                                  {errors.firstName && (
                                    <p className={`text-red-500 text-xs ${isEnglish ? "text-left" : "text-right"}`}>
                                      {errors.firstName}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className={`relative ${isEnglish ? "text-left" : "text-right"}`}>
                              <div className="relative">
                                <label
                                  className={`block mb-2 ${isEnglish ? "text-left" : "text-right"} text-gray-700 font-medium text-sm`}
                                >
                                  {isEnglish ? "National ID" : "رقم الهوية الوطنية"}
                                  <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="relative">
                                  <div
                                    className={`absolute top-0 bottom-0 ${isEnglish ? "left-3" : "right-3"} flex items-center pointer-events-none`}
                                  >
                                    <FileText className="w-5 h-5 text-brand-primary" />
                                  </div>
                                  <input
                                    type="text"
                                    name="nationalId"
                                    placeholder={isEnglish ? "Enter your National ID" : "أدخل رقم الهوية الوطنية"}
                                    value={formData.nationalId}
                                    onChange={handleInputChange}
                                    className={`w-full p-3 sm:p-4 ${isEnglish ? "pl-10 sm:pl-12 text-left" : "pr-10 sm:pr-12 text-right"} border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:outline-none transition-all duration-300`}
                                  />
                                </div>
                                <div className="h-5 mt-1">
                                  {errors.nationalId && (
                                    <p className={`text-red-500 text-xs ${isEnglish ? "text-left" : "text-right"}`}>
                                      {errors.nationalId}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className={`relative ${isEnglish ? "text-left" : "text-right"}`}>
                              <div className="relative">
                                <label
                                  className={`block mb-2 ${isEnglish ? "text-left" : "text-right"} text-gray-700 font-medium text-sm`}
                                >
                                  {isEnglish ? "Email Address" : "البريد الإلكتروني"}
                                </label>
                                <div className="relative">
                                  <div
                                    className={`absolute top-0 bottom-0 ${isEnglish ? "left-3" : "right-3"} flex items-center pointer-events-none`}
                                  >
                                    <Mail className="w-5 h-5 text-brand-primary" />
                                  </div>
                                  <input
                                    type="email"
                                    name="email"
                                    placeholder={isEnglish ? "Enter your email address" : "أدخل بريدك الإلكتروني"}
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full p-3 sm:p-4 ${isEnglish ? "pl-10 sm:pl-12 text-left" : "pr-10 sm:pr-12 text-right"} border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:outline-none transition-all duration-300`}
                                    dir="ltr"
                                  />
                                </div>
                                <div className="h-5 mt-1">
                                  {errors.email && (
                                    <p className={`text-red-500 text-xs ${isEnglish ? "text-left" : "text-right"}`}>
                                      {errors.email}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className={`relative ${isEnglish ? "text-left" : "text-right"}`}>
                              <div className="relative">
                                <label
                                  className={`block mb-2 ${isEnglish ? "text-left" : "text-right"} text-gray-700 font-medium text-sm`}
                                >
                                  {isEnglish ? "Phone Number" : "رقم الهاتف"}
                                  <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="relative">
                                  <div
                                    className={`absolute top-0 bottom-0 ${isEnglish ? "left-3" : "right-3"} flex items-center pointer-events-none`}
                                  >
                                    <Phone className="w-5 h-5 text-brand-primary" />
                                  </div>
                                  <input
                                    type="tel"
                                    name="phone"
                                    placeholder={isEnglish ? "Enter your phone number" : "أدخل رقم هاتفك"}
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={`w-full p-3 sm:p-4 ${isEnglish ? "pl-10 sm:pl-12 text-left" : "pr-10 sm:pr-12 text-right"} border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:outline-none transition-all duration-300`}
                                    dir="ltr"
                                  />
                                  {formData.hasWhatsapp && (
                                    <div
                                      className={`absolute top-0 bottom-0 ${isEnglish ? "right-3" : "left-3"} flex items-center justify-center`}
                                    >
                                      <span
                                        className="text-green-500 bg-green-50 px-2 py-1 rounded-full text-xs font-medium flex items-center"
                                        title={isEnglish ? "WhatsApp available" : "واتساب متاح"}
                                      >
                                        <FontAwesomeIcon icon={faWhatsapp} className="w-3 h-3 mr-1" />
                                        WhatsApp
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="h-5 mt-1">
                                  {errors.phone && (
                                    <p className={`text-red-500 text-xs ${isEnglish ? "text-left" : "text-right"}`}>
                                      {errors.phone}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className={`flex items-center ${isEnglish ? "justify-start" : "justify-end"} mt-4`}>
                                <label
                                  className={`flex items-center ${isEnglish ? "" : "flex-row-reverse"} p-3 border-2 ${formData.hasWhatsapp ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300 hover:bg-green-50/30"} rounded-xl transition-all duration-300 cursor-pointer`}
                                >
                                  <div className="relative">
                                    <input
                                      id="hasWhatsapp"
                                      type="checkbox"
                                      name="hasWhatsapp"
                                      checked={formData.hasWhatsapp}
                                      onChange={handleInputChange}
                                      className="sr-only"
                                    />
                                    <div
                                      className={`w-5 h-5 cursor-pointer flex items-center justify-center border-2 ${formData.hasWhatsapp ? "border-green-500 bg-green-500" : "border-gray-300"} rounded transition-colors duration-300`}
                                    >
                                      {formData.hasWhatsapp && (
                                        <motion.div
                                          initial={{ scale: 0, opacity: 0 }}
                                          animate={{ scale: 1, opacity: 1 }}
                                          transition={{ duration: 0.2 }}
                                          className="flex items-center justify-center"
                                        >
                                          <Check className="w-3 h-3 text-white" />
                                        </motion.div>
                                      )}
                                    </div>
                                  </div>
                                  <span className="mx-3 text-sm text-gray-700 font-medium flex items-center">
                                    {isEnglish ? "This number has WhatsApp" : "هذا الرقم لديه واتساب"}
                                    <FontAwesomeIcon icon={faWhatsapp} className="text-green-500 w-4 h-4 ml-2" />
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {getFormStepContent() === "confirmation" && (
                        <div className="space-y-5 sm:space-y-6">
                          <div className="flex items-center">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-light/70 flex items-center justify-center mr-4">
                              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-brand-primary" />
                            </div>
                            <div>
                              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                                {isEnglish ? "Confirmation" : "التأكيد"}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {isEnglish
                                  ? "Please review your information and confirm"
                                  : "يرجى مراجعة معلوماتك والتأكيد"}
                              </p>
                            </div>
                          </div>

                          <div
                            className={`mt-6 mb-6 flex items-center ${isEnglish ? "justify-start" : "flex-row-reverse"}`}
                          >
                            <label
                              className={`flex items-center ${isEnglish ? "" : "flex-row-reverse"} p-3 border-2 ${formData.acceptTerms ? "border-brand-primary bg-brand-light" : "border-gray-200 hover:border-brand-light hover:bg-brand-light/30"} rounded-xl transition-all duration-300 cursor-pointer`}
                            >
                              <div className="relative">
                                <input
                                  id="acceptTerms"
                                  type="checkbox"
                                  name="acceptTerms"
                                  checked={formData.acceptTerms}
                                  onChange={handleInputChange}
                                  className="sr-only"
                                />
                                <div
                                  className={`w-5 h-5 cursor-pointer flex items-center justify-center border-2 ${formData.acceptTerms ? "border-brand-primary bg-brand-primary" : "border-gray-300"} rounded transition-colors duration-300`}
                                >
                                  {formData.acceptTerms && (
                                    <motion.div
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      transition={{ duration: 0.2 }}
                                      className="flex items-center justify-center"
                                    >
                                      <Check className="w-3 h-3 text-white" />
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                              <span className="mx-3 text-sm text-gray-700 font-medium">
                                {isEnglish ? "I accept the terms and conditions" : "أوافق على الشروط والأحكام"}
                              </span>
                            </label>
                          </div>
                          <div className="h-5 mt-1">
                            {errors.acceptTerms && (
                              <p className={`text-red-500 text-xs ${isEnglish ? "text-left" : "text-right"}`}>
                                {errors.acceptTerms}
                              </p>
                            )}
                          </div>

                          <div className="mt-6">
                            <label
                              className={`block mb-2 ${isEnglish ? "text-left" : "text-right"} text-gray-700 font-medium text-sm`}
                            >
                              {isEnglish ? "Additional Notes" : "ملاحظات إضافية"}
                            </label>
                            <div className="relative">
                              <div
                                className={`absolute top-3 ${isEnglish ? "left-3" : "right-3"} flex items-start pointer-events-none`}
                              >
                                <FileText className="w-5 h-5 text-brand-primary" />
                              </div>
                              <textarea
                                name="note"
                                value={formData.note}
                                onChange={handleInputChange}
                                placeholder={isEnglish ? "Additional notes or questions" : "ملاحظات أو أسئلة إضافية"}
                                rows={4}
                                className={`w-full p-3 sm:p-4 ${isEnglish ? "pl-10 sm:pl-12 text-left" : "pr-10 sm:pr-12 text-right"} text-gray-700 bg-white border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:outline-none transition-all duration-300`}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex justify-between gap-4 sm:gap-6 pt-4 sm:pt-6">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="relative overflow-hidden py-2 sm:py-3 px-5 sm:px-6 bg-white border-2 border-brand-primary text-brand-primary rounded-xl text-sm font-medium hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50 transition-all duration-300 shadow-sm group"
                      >
                        <span className="relative flex items-center justify-center">
                          {isEnglish ? (
                            <ChevronLeft className="mr-1 w-4 h-4" />
                          ) : (
                            <ChevronRight className="ml-1 w-4 h-4" />
                          )}
                          {isEnglish ? "Back" : "رجوع"}
                        </span>
                      </button>
                    )}

                    <div ref={lastFocusableElementRef} className="ml-auto">
                      {renderActionButton()}
                    </div>
                  </div>
                </form>
              </div>

              {/* Mobile Summary - Only shown on the last step */}
              {getFormStepContent() === "confirmation" && (
                <div className="mt-6 lg:hidden w-full">{renderSummary()}</div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
