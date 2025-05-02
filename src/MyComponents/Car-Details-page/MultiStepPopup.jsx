"use client"

import { useState, useEffect, useRef } from "react"
import { X, ChevronRight, ChevronLeft, User, Mail, Phone, FileText, Check, Download } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { OrderPDF } from "./orderPDF.jsx"
import { fetchImageAsBase64 } from "./fetch-image.jsx"
import { usePathname } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons"

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

  // Order PDF component rendering optimization
  

  // Function to render the correct button based on step
  const renderActionButton = () => {
    const currentStep = getFormStepContent()

    // If we're on the confirmation step, show submit button
    if (currentStep === "confirmation") {
      return (
        <button
          type="submit"
          disabled={isLoading}
          className="py-2 sm:py-3 px-6 sm:px-8 bg-brand-primary text-white rounded-xl text-sm font-medium hover:bg-[#3b1442] focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
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
        </button>
      )
    }

    // For all other steps, show next button
    return (
      <button
        type="button"
        onClick={handleNext}
        className="py-2 sm:py-3 px-6 sm:px-8 bg-brand-primary text-white rounded-xl text-sm font-medium hover:bg-[#3b1442] focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50 transition-colors"
      >
        {isEnglish ? "Next" : "التالي"}
      </button>
    )
  }

  const renderSummary = () => (
    <div className="bg-purple-50 p-4 sm:p-6 rounded-xl h-full shadow-sm">
      <div className="inline-flex items-center justify-center bg-brand-primary text-white w-6 h-6 sm:w-8 sm:h-8 rounded-full mb-3 sm:mb-4">
        <span className="text-sm sm:text-base">a</span>
      </div>
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-brand-primary">
        {isEnglish ? "Summary" : "ملخص"}
      </h3>
      <div className="space-y-2 sm:space-y-3 text-sm">
        {formData.type && (
          <div className="flex items-center">
            <User className="w-3 h-3 sm:w-4 sm:h-4 text-brand-primary mr-2 flex-shrink-0" />
            <span className="text-gray-600">
              {isEnglish
                ? `Buyer Type: ${formData.type === "individual" ? "Individual" : "Company"}`
                : `نوع المشتري: ${formData.type === "individual" ? "للأفراد" : "للشركات"}`}
            </span>
          </div>
        )}
        {formData.paymentMethod && (
          <div className="flex items-center">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-brand-primary mr-2 flex-shrink-0" />
            <span className="text-gray-600">
              {isEnglish
                ? `Payment: ${formData.paymentMethod === "cash" ? "Cash" : "Finance"}`
                : `طريقة الدفع: ${formData.paymentMethod === "cash" ? "نقدي" : "تمويل"}`}
            </span>
          </div>
        )}
        {formData.firstName && (
          <div className="flex items-center">
            <User className="w-3 h-3 sm:w-4 sm:h-4 text-brand-primary mr-2 flex-shrink-0" />
            <span className="text-gray-600">
              {isEnglish ? `Name: ${formData.firstName}` : `الاسم: ${formData.firstName}`}
            </span>
          </div>
        )}
        {formData.nationalId && (
          <div className="flex items-center">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-brand-primary mr-2 flex-shrink-0" />
            <span className="text-gray-600">
              {isEnglish ? `National ID: ${formData.nationalId}` : `رقم الهوية الوطنية: ${formData.nationalId}`}
            </span>
          </div>
        )}
        {formData.email && (
          <div className="flex items-center">
            <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-brand-primary mr-2 flex-shrink-0" />
            <span className="text-gray-600">
              {isEnglish ? `Email: ${formData.email}` : `البريد الإلكتروني: ${formData.email}`}
            </span>
          </div>
        )}
        {formData.phone && (
          <div className="flex items-center">
            <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-brand-primary mr-2 flex-shrink-0" />
            <span className="text-gray-600">
              {isEnglish ? `Phone: ${formData.phone}` : `رقم الهاتف: ${formData.phone}`}
              {formData.hasWhatsapp && <FontAwesomeIcon icon={faWhatsapp} className="text-green-500 w-3 h-3 ml-2" />}
            </span>
          </div>
        )}
        {formData.paymentMethod === "finance" && formData.jobSector && (
          <div className="flex items-center">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-brand-primary mr-2 flex-shrink-0" />
            <span className="text-gray-600">
              {isEnglish ? `Job Sector: ${translateValue(formData.jobSector)}` : `الوظيفة: ${formData.jobSector}`}
            </span>
          </div>
        )}
        {formData.paymentMethod === "finance" && formData.salary && (
          <div className="flex items-center">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-brand-primary mr-2 flex-shrink-0" />
            <span className="text-gray-600">
              {isEnglish ? `Salary: ${formData.salary}` : `الراتب: ${formData.salary}`}
            </span>
          </div>
        )}
        {formData.paymentMethod === "finance" && formData.bankName && (
          <div className="flex items-center">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-brand-primary mr-2 flex-shrink-0" />
            <span className="text-gray-600">
              {isEnglish ? `Bank: ${translateValue(formData.bankName)}` : `البنك: ${formData.bankName}`}
            </span>
          </div>
        )}
        {formData.paymentMethod === "finance" && formData.existingLoans && (
          <div className="flex items-center">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-brand-primary mr-2 flex-shrink-0" />
            <span className="text-gray-600">
              {isEnglish
                ? `Existing Obligations: ${formData.existingLoans === "yes" ? "Yes" : "No"}`
                : `التزامات حالية: ${formData.existingLoans === "yes" ? "نعم" : "لا"}`}
            </span>
          </div>
        )}
        {formData.paymentMethod === "finance" && formData.existingLoans === "yes" && formData.personalLoanAmount && (
          <div className="flex items-center">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-brand-primary mr-2 flex-shrink-0" />
            <span className="text-gray-600">
              {isEnglish
                ? `Personal Obligation: ${formData.personalLoanAmount}`
                : `التزام شخصي: ${formData.personalLoanAmount}`}
            </span>
          </div>
        )}
        {formData.paymentMethod === "finance" && formData.existingLoans === "yes" && formData.propertyLoanAmount && (
          <div className="flex items-center">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-brand-primary mr-2 flex-shrink-0" />
            <span className="text-gray-600">
              {isEnglish
                ? `Property Obligation: ${formData.propertyLoanAmount}`
                : `التزام عقاري: ${formData.propertyLoanAmount}`}
            </span>
          </div>
        )}
        {formData.paymentMethod === "finance" && formData.jobSector === "قطاع خاص" && formData.bankVerified && (
          <div className="flex items-center">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-brand-primary mr-2 flex-shrink-0" />
            <span className="text-gray-600">
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
            document={<OrderPDF formData={formData} carDetails={car_Details} carImage={carImage} isEnglish={isEnglish} />}
            fileName={`car-order-${formData.firstName}-${new Date().toISOString().split("T")[0]}.pdf`}
            className="inline-flex items-center px-4 py-2 rounded-xl bg-brand-primary text-white text-xs hover:bg-[#3b1442] transition-colors"
          >
            {({ blob, url, loading, error }) =>
              loading ? (
                <span>{isEnglish ? "Generating..." : "جاري..."}</span>
              ) : (
                <>
                  <Download className="mr-1 w-3 h-3" />
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
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto"
      dir={isEnglish ? "ltr" : "rtl"}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onClose()
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-2xl w-full max-w-6xl overflow-hidden shadow-xl border border-gray-200 my-2 sm:my-8 max-h-[95vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-3 sm:px-8 pt-4 sm:pt-6 pb-2 flex items-center justify-between border-b sticky top-0 bg-white z-10">
          <h2 id="modal-title" className="text-lg sm:text-2xl font-bold text-brand-primary flex items-center">
            {!isEnglish && <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 ml-2" />}
            {isEnglish && <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />}

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

            {!isEnglish && <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />}
            {isEnglish && <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 ml-2" />}
          </h2>
          <button
            ref={firstFocusableElementRef}
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
            aria-label={isEnglish ? "Close dialog" : "اغلاق النافذة"}
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto flex-1">
          <div className="px-3 sm:px-8 py-4 sm:py-6">
            {/* Progress Steps */}
            <div className="flex justify-between items-center w-full mb-4 sm:mb-6 overflow-x-auto px-1 sm:px-2 pb-2">
              <div className="w-full flex items-center justify-between max-w-3xl mx-auto min-w-max">
                {/* Dynamic Step Indicators */}
                <div className="flex flex-col items-center mx-2">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 1 ? "bg-brand-primary text-white" : "border-2 border-gray-300 text-gray-400"}`}
                  >
                    1
                  </div>
                  <span className="text-xs mt-1 text-gray-500 whitespace-nowrap">
                    {isEnglish ? "Buyer Type" : "نوع المشتري"}
                  </span>
                </div>

                {activePaymentMethod ? (
                  // If payment method is pre-selected
                  <>
                    <div className={`flex-1 h-0.5 mx-1 ${step >= 2 ? "bg-brand-primary" : "bg-gray-300"}`}></div>

                    <div className="flex flex-col items-center mx-2">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 2 ? "bg-brand-primary text-white" : "border-2 border-gray-300 text-gray-400"}`}
                      >
                        2
                      </div>
                      <span className="text-xs mt-1 text-gray-500 whitespace-nowrap">
                        {isEnglish ? "Personal Info" : "المعلومات الشخصية"}
                      </span>
                    </div>

                    <div className={`flex-1 h-0.5 mx-1 ${step >= 3 ? "bg-brand-primary" : "bg-gray-300"}`}></div>

                    <div className="flex flex-col items-center mx-2">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 3 ? "bg-brand-primary text-white" : "border-2 border-gray-300 text-gray-400"}`}
                      >
                        3
                      </div>
                      <span className="text-xs mt-1 text-gray-500 whitespace-nowrap">
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
                        <div className={`flex-1 h-0.5 mx-1 ${step >= 4 ? "bg-brand-primary" : "bg-gray-300"}`}></div>

                        <div className="flex flex-col items-center mx-2">
                          <div
                            className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 4 ? "bg-brand-primary text-white" : "border-2 border-gray-300 text-gray-400"}`}
                          >
                            4
                          </div>
                          <span className="text-xs mt-1 text-gray-500 whitespace-nowrap">
                            {isEnglish ? "Confirm" : "التأكيد"}
                          </span>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  // No pre-selected payment method, show complete step flow
                  <>
                    <div className={`flex-1 h-0.5 mx-1 ${step >= 2 ? "bg-brand-primary" : "bg-gray-300"}`}></div>

                    <div className="flex flex-col items-center mx-2">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 2 ? "bg-brand-primary text-white" : "border-2 border-gray-300 text-gray-400"}`}
                      >
                        2
                      </div>
                      <span className="text-xs mt-1 text-gray-500 whitespace-nowrap">
                        {isEnglish ? "Payment" : "طريقة الدفع"}
                      </span>
                    </div>

                    <div className={`flex-1 h-0.5 mx-1 ${step >= 3 ? "bg-brand-primary" : "bg-gray-300"}`}></div>

                    <div className="flex flex-col items-center mx-2">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 3 ? "bg-brand-primary text-white" : "border-2 border-gray-300 text-gray-400"}`}
                      >
                        3
                      </div>
                      <span className="text-xs mt-1 text-gray-500 whitespace-nowrap">
                        {isEnglish ? "Personal Info" : "المعلومات الشخصية"}
                      </span>
                    </div>

                    <div className={`flex-1 h-0.5 mx-1 ${step >= 4 ? "bg-brand-primary" : "bg-gray-300"}`}></div>

                    <div className="flex flex-col items-center mx-2">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 4 ? "bg-brand-primary text-white" : "border-2 border-gray-300 text-gray-400"}`}
                      >
                        4
                      </div>
                      <span className="text-xs mt-1 text-gray-500 whitespace-nowrap">
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
                        <div className={`flex-1 h-0.5 mx-1 ${step >= 5 ? "bg-brand-primary" : "bg-gray-300"}`}></div>

                        <div className="flex flex-col items-center mx-2">
                          <div
                            className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 5 ? "bg-brand-primary text-white" : "border-2 border-gray-300 text-gray-400"}`}
                          >
                            5
                          </div>
                          <span className="text-xs mt-1 text-gray-500 whitespace-nowrap">
                            {isEnglish ? "Confirm" : "التأكيد"}
                          </span>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="hidden lg:block w-full lg:w-1/3 p-4">{renderSummary()}</div>
              <div className="w-full lg:w-2/3 px-1 sm:px-4">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                      className="p-2 sm:p-4 rounded-xl border border-gray-100 shadow-sm bg-white"
                    >
                      {getFormStepContent() === "buyerType" && (
                        <div className="space-y-3 sm:space-y-4">
                          <h3 className="text-lg sm:text-xl font-semibold text-brand-primary mb-4 sm:mb-6 flex items-center">
                            <User className={`w-4 h-4 sm:w-5 sm:h-5 ${isEnglish ? "mr-1 sm:mr-2" : "ml-1 sm:ml-2"}`} />
                            {isEnglish ? "Buyer Type" : "نوع المشتري"}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-5">
                            {isEnglish ? "What type of buyer are you?" : "ما نوع المشتري الذي أنت عليه؟"}
                          </p>
                          <div className="space-y-4">
                            {["individual", "company"].map((type) => (
                              <label
                                key={type}
                                className={`flex items-center ${isEnglish ? "justify-between" : "justify-between"} py-3 px-4 sm:px-6 border ${formData.type === type ? "border-brand-primary bg-purple-50 shadow-md" : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/30"} rounded-xl transition-all duration-200 cursor-pointer`}
                              >
                                <span className="text-gray-700 capitalize">
                                  {isEnglish ? type : type === "individual" ? "للأفراد" : "للشركات"}
                                </span>
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
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.type === type ? "border-brand-primary bg-brand-primary shadow-sm" : "border-gray-300"} transition-colors duration-200`}
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
                          {errors.type && <p className="text-red-500 text-sm mt-2">{errors.type}</p>}
                        </div>
                      )}

                      {getFormStepContent() === "paymentMethod" && (
                        <div className="space-y-3 sm:space-y-4">
                          <h3 className="text-lg sm:text-xl font-semibold text-brand-primary mb-4 sm:mb-6 flex items-center">
                            <FileText
                              className={`w-4 h-4 sm:w-5 sm:h-5 ${isEnglish ? "mr-1 sm:mr-2" : "ml-1 sm:ml-2"}`}
                            />
                            {isEnglish ? "Payment Method" : "طريقة الدفع"}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-5">
                            {isEnglish ? "How would you like to pay?" : "كيف تريد أن تدفع؟"}
                          </p>
                          <div className="space-y-4">
                            {["cash", "finance"].map((method) => (
                              <label
                                key={method}
                                className={`flex items-center justify-between py-3 px-6 border ${formData.paymentMethod === method ? "border-brand-primary bg-purple-50 shadow-md" : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/30"} rounded-xl transition-all duration-200 cursor-pointer`}
                              >
                                <span className="text-gray-700 capitalize">
                                  {isEnglish
                                    ? method === "cash"
                                      ? "Cash"
                                      : "Finance"
                                    : method === "cash"
                                      ? "نقدي"
                                      : "تمويل"}
                                </span>
                                <div className="flex items-center justify-center">
                                  <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={method}
                                    checked={formData.paymentMethod === method}
                                    onChange={handleInputChange}
                                    className="sr-only"
                                  />
                                  <div
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === method ? "border-brand-primary bg-brand-primary shadow-sm" : "border-gray-300"} transition-colors duration-200`}
                                  >
                                    {formData.paymentMethod === method && (
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
                          {errors.paymentMethod && <p className="text-red-500 text-sm">{errors.paymentMethod}</p>}
                        </div>
                      )}

                      {getFormStepContent() === "financialInfo" && (
                        <div className="space-y-3 sm:space-y-4">
                          <h3 className="text-lg sm:text-xl font-semibold text-brand-primary mb-4 sm:mb-6 flex items-center">
                            <FileText
                              className={`w-4 h-4 sm:w-5 sm:h-5 ${isEnglish ? "mr-1 sm:mr-2" : "ml-1 sm:ml-2"}`}
                            />
                            {isEnglish ? "Financial Information" : "القسم المالي"}
                          </h3>
                          <div className="space-y-6">
                            <div className={`mb-6 relative ${isEnglish ? "text-left" : "text-right"}`}>
                              <div className="relative">
                                <label
                                  className={`absolute -top-6 ${isEnglish ? "left-0" : "right-0"} flex items-center text-gray-700 font-medium text-sm sm:text-base`}
                                >
                                  {isEnglish ? "Job Sector" : "الوظيفة"}
                                  <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div
                                  className={`absolute inset-y-0 ${isEnglish ? "left-3" : "right-3"} flex items-center pointer-events-none`}
                                >
                                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                                </div>
                                <select
                                  name="jobSector"
                                  value={formData.jobSector}
                                  onChange={handleInputChange}
                                  className={`w-full p-2 sm:p-3 ${isEnglish ? "pl-10 sm:pl-12 text-left" : "pr-10 sm:pr-12 text-right"} border border-gray-300 rounded-xl shadow-sm appearance-none bg-white focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:outline-none transition-all duration-200`}
                                >
                                  <option value="">{isEnglish ? "Select job sector" : "اختر قطاع العمل"}</option>
                                  <option value="قطاع حكومي">{isEnglish ? "Government Sector" : "قطاع حكومي"}</option>
                                  <option value="قطاع خاص">{isEnglish ? "Private Sector" : "قطاع خاص"}</option>
                                  <option value="عسكري">{isEnglish ? "Military" : "عسكري"}</option>
                                  <option value="متقاعد">{isEnglish ? "Retired" : "متقاعد"}</option>
                                </select>
                                <div
                                  className={`absolute inset-y-0 ${isEnglish ? "right-3" : "left-3"} pointer-events-none flex items-center justify-center`}
                                >
                                  {isEnglish ? (
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                  ) : (
                                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                                  )}
                                </div>
                              </div>
                              {errors.jobSector && (
                                <p className={`text-red-500 text-xs mt-1 ${isEnglish ? "text-left" : "text-right"}`}>
                                  {errors.jobSector}
                                </p>
                              )}
                            </div>

                            {/* Bank Verification - Only show if jobSector is "قطاع خاص" */}
                            {formData.jobSector === "قطاع خاص" && (
                              <div className={`mb-8 relative ${isEnglish ? "text-left" : "text-right"}`}>
                                <label
                                  className={`block mb-4 sm:mb-6 ${isEnglish ? "text-left" : "text-right"} flex items-center text-gray-700 font-medium text-sm sm:text-base`}
                                >
                                  <FileText
                                    className={`w-4 h-4 sm:w-5 sm:h-5 ${isEnglish ? "mr-1 sm:mr-2" : "ml-1 sm:ml-2"} text-brand-primary`}
                                  />
                                  {isEnglish ? "Is your bank verified?" : "هل البنك معتمد؟"}
                                  <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className={`flex ${isEnglish ? "flex-row" : "flex-row-reverse"} gap-4`}>
                                  <label
                                    className={`flex items-center ${isEnglish ? "" : "flex-row-reverse"} py-3 px-6 border ${formData.bankVerified === "معتمد" ? "border-brand-primary bg-purple-50 shadow-md" : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/30"} rounded-xl transition-all duration-200 cursor-pointer`}
                                  >
                                    {isEnglish ? (
                                      <>
                                        <div
                                          className={`relative w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${formData.bankVerified === "معتمد" ? "border-brand-primary bg-brand-primary shadow-sm" : "border-gray-300"} mr-4 transition-colors duration-200`}
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
                                        <span className="text-gray-700">Verified</span>
                                      </>
                                    ) : (
                                      <>
                                        <span className="text-gray-700">معتمد</span>
                                        <div
                                          className={`relative w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${formData.bankVerified === "معتمد" ? "border-brand-primary bg-brand-primary shadow-sm" : "border-gray-300"} mr-0 ml-4 transition-colors duration-200`}
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
                                    className={`flex items-center ${isEnglish ? "" : "flex-row-reverse"} py-3 px-6 border ${formData.bankVerified === "غير معتمد" ? "border-brand-primary bg-purple-50 shadow-md" : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/30"} rounded-xl transition-all duration-200 cursor-pointer`}
                                  >
                                    {isEnglish ? (
                                      <>
                                        <div
                                          className={`relative w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${formData.bankVerified === "غير معتمد" ? "border-brand-primary bg-brand-primary shadow-sm" : "border-gray-300"} mr-4 transition-colors duration-200`}
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
                                        <span className="text-gray-700">Not Verified</span>
                                      </>
                                    ) : (
                                      <>
                                        <span className="text-gray-700">غير معتمد</span>
                                        <div
                                          className={`relative w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${formData.bankVerified === "غير معتمد" ? "border-brand-primary bg-brand-primary shadow-sm" : "border-gray-300"} mr-0 ml-4 transition-colors duration-200`}
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
                                {errors.bankVerified && (
                                  <p className={`text-red-500 text-xs mt-1 ${isEnglish ? "text-left" : "text-right"}`}>
                                    {errors.bankVerified}
                                  </p>
                                )}
                              </div>
                            )}

                            <div className={`mb-6 relative ${isEnglish ? "text-left" : "text-right"}`}>
                              <div className="relative">
                                <label
                                  className={`absolute -top-6 ${isEnglish ? "left-0" : "right-0"} flex items-center text-gray-700 font-medium text-sm sm:text-base`}
                                >
                                  {isEnglish ? "Monthly Salary" : "مبلغ الراتب"}
                                  <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div
                                  className={`absolute inset-y-0 ${isEnglish ? "left-3" : "right-3"} flex items-center pointer-events-none`}
                                >
                                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                                </div>
                                <input
                                  type="number"
                                  name="salary"
                                  placeholder={isEnglish ? "Enter your monthly salary" : "مبلغ الراتب"}
                                  value={formData.salary}
                                  onChange={handleInputChange}
                                  className={`w-full p-2 sm:p-3 ${isEnglish ? "pl-10 sm:pl-12 text-left" : "pr-10 sm:pr-12 text-right"} border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:outline-none transition-all duration-200`}
                                />
                                {errors.salary && (
                                  <p className={`text-red-500 text-xs mt-1 ${isEnglish ? "text-left" : "text-right"}`}>
                                    {errors.salary}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className={`mb-6 relative ${isEnglish ? "text-left" : "text-right"}`}>
                              <div className="relative">
                                <label
                                  className={`absolute -top-6 ${isEnglish ? "left-0" : "right-0"} flex items-center text-gray-700 font-medium text-sm sm:text-base`}
                                >
                                  {isEnglish ? "Bank/Finance Company" : "اسم البنك والشركة التمويل"}
                                  <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div
                                  className={`absolute inset-y-0 ${isEnglish ? "left-3" : "right-3"} flex items-center pointer-events-none`}
                                >
                                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                                </div>
                                <select
                                  name="bankName"
                                  value={formData.bankName}
                                  onChange={handleInputChange}
                                  className={`w-full p-2 sm:p-3 ${isEnglish ? "pl-10 sm:pl-12 text-left" : "pr-10 sm:pr-12 text-right"} border border-gray-300 rounded-xl shadow-sm appearance-none bg-white focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:outline-none transition-all duration-200`}
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
                                  className={`absolute inset-y-0 ${isEnglish ? "right-3" : "left-3"} pointer-events-none flex items-center justify-center`}
                                >
                                  {isEnglish ? (
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                  ) : (
                                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                                  )}
                                </div>
                              </div>
                              {errors.bankName && (
                                <p className={`text-red-500 text-xs mt-1 ${isEnglish ? "text-left" : "text-right"}`}>
                                  {errors.bankName}
                                </p>
                              )}
                            </div>

                            <div className={`mb-8 relative ${isEnglish ? "text-left" : "text-right"}`}>
                              <label
                                className={`block mb-4 sm:mb-6 ${isEnglish ? "text-left" : "text-right"} flex items-center text-gray-700 font-medium text-sm sm:text-base`}
                              >
                                <FileText
                                  className={`w-4 h-4 sm:w-5 sm:h-5 ${isEnglish ? "mr-1 sm:mr-2" : "ml-1 sm:ml-2"} text-brand-primary`}
                                />
                                {isEnglish ? "Do you have existing obligations?" : "هل لديك التزامات حالية؟"}
                                <span className="text-red-500 ml-1">*</span>
                              </label>
                              <div className={`flex ${isEnglish ? "flex-row" : "flex-row-reverse"} gap-4`}>
                                <label
                                  className={`flex items-center ${isEnglish ? "" : "flex-row-reverse"} py-3 px-6 border ${formData.existingLoans === "yes" ? "border-brand-primary bg-purple-50 shadow-md" : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/30"} rounded-xl transition-all duration-200 cursor-pointer`}
                                >
                                  {isEnglish ? (
                                    <>
                                      <div
                                        className={`relative w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${formData.existingLoans === "yes" ? "border-brand-primary bg-brand-primary shadow-sm" : "border-gray-300"} mr-4 transition-colors duration-200`}
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
                                      <span className="text-gray-700">Yes</span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="text-gray-700">نعم</span>
                                      <div
                                        className={`relative w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${formData.existingLoans === "yes" ? "border-brand-primary bg-brand-primary shadow-sm" : "border-gray-300"} mr-0 ml-4 transition-colors duration-200`}
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
                                  className={`flex items-center ${isEnglish ? "" : "flex-row-reverse"} py-3 px-6 border ${formData.existingLoans === "no" ? "border-brand-primary bg-purple-50 shadow-md" : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/30"} rounded-xl transition-all duration-200 cursor-pointer`}
                                >
                                  {isEnglish ? (
                                    <>
                                      <div
                                        className={`relative w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${formData.existingLoans === "no" ? "border-brand-primary bg-brand-primary shadow-sm" : "border-gray-300"} mr-4 transition-colors duration-200`}
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
                                      <span className="text-gray-700">No</span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="text-gray-700">لا</span>
                                      <div
                                        className={`relative w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${formData.existingLoans === "no" ? "border-brand-primary bg-brand-primary shadow-sm" : "border-gray-300"} mr-0 ml-4 transition-colors duration-200`}
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
                              {errors.existingLoans && (
                                <p className={`text-red-500 text-xs mt-1 ${isEnglish ? "text-left" : "text-right"}`}>
                                  {errors.existingLoans}
                                </p>
                              )}
                            </div>

                            {formData.existingLoans === "yes" && (
                              <div className="space-y-6 bg-purple-50 p-3 sm:p-4 rounded-xl mb-6">
                                <h4
                                  className={`font-medium text-brand-primary ${isEnglish ? "text-left" : "text-right"} text-sm sm:text-base mb-4`}
                                >
                                  {isEnglish ? "Obligation Details" : "تفاصيل الالتزامات"}
                                </h4>

                                <div className="mb-6 relative">
                                  <div className="relative">
                                    <label
                                      className={`absolute -top-6 ${isEnglish ? "left-0" : "right-0"} flex items-center text-gray-700 font-medium text-sm sm:text-base`}
                                    >
                                      {isEnglish ? "Personal Obligation Amount" : "مبلغ الالتزام الشخصي"}
                                    </label>
                                    <div
                                      className={`absolute inset-y-0 ${isEnglish ? "left-3" : "right-3"} flex items-center pointer-events-none`}
                                    >
                                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                                    </div>
                                    <input
                                      type="number"
                                      name="personalLoanAmount"
                                      placeholder={
                                        isEnglish ? "Enter amount if applicable" : "أدخل المبلغ إذا كان متاحًا"
                                      }
                                      value={formData.personalLoanAmount}
                                      onChange={handleInputChange}
                                      className={`w-full p-2 sm:p-3 ${isEnglish ? "pl-10 sm:pl-12 text-left" : "pr-10 sm:pr-12 text-right"} border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:outline-none transition-all duration-200`}
                                    />
                                  </div>
                                </div>

                                <div className="mb-3 sm:mb-6 relative">
                                  <div className="relative">
                                    <label
                                      className={`absolute -top-6 ${isEnglish ? "left-0" : "right-0"} flex items-center text-gray-700 font-medium text-sm sm:text-base`}
                                    >
                                      {isEnglish ? "Property Obligation Amount" : "مبلغ الالتزام العقاري"}
                                    </label>
                                    <div
                                      className={`absolute inset-y-0 ${isEnglish ? "left-3" : "right-3"} flex items-center pointer-events-none`}
                                    >
                                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                                    </div>
                                    <input
                                      type="number"
                                      name="propertyLoanAmount"
                                      placeholder={
                                        isEnglish ? "Enter amount if applicable" : "أدخل المبلغ إذا كان متاحًا"
                                      }
                                      value={formData.propertyLoanAmount}
                                      onChange={handleInputChange}
                                      className={`w-full p-2 sm:p-3 ${isEnglish ? "pl-10 sm:pl-12 text-left" : "pr-10 sm:pr-12 text-right"} border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:outline-none transition-all duration-200`}
                                    />
                                  </div>
                                </div>

                                {errors.loanDetails && (
                                  <p className={`text-red-500 text-xs ${isEnglish ? "text-left" : "text-right"}`}>
                                    {errors.loanDetails}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {getFormStepContent() === "personalInfo" && (
                        <div className="space-y-3 sm:space-y-4">
                          <h3 className="text-lg sm:text-xl font-semibold text-brand-primary mb-4 sm:mb-6 flex items-center">
                            <User className={`w-4 h-4 sm:w-5 sm:h-5 ${isEnglish ? "mr-1 sm:mr-2" : "ml-1 sm:ml-2"}`} />
                            {isEnglish ? "Personal Information" : "المعلومات الشخصية"}
                          </h3>
                          <div className="space-y-6">
                            <div className={`mb-6 relative ${isEnglish ? "text-left" : "text-right"}`}>
                              <div className="relative">
                                <label
                                  className={`absolute -top-6 ${isEnglish ? "left-0" : "right-0"} flex items-center text-gray-700 font-medium text-sm sm:text-base`}
                                >
                                  {isEnglish ? "Name" : "الاسم"}
                                  <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div
                                  className={`absolute inset-y-0 ${isEnglish ? "left-3" : "right-3"} flex items-center pointer-events-none`}
                                >
                                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                                </div>
                                <input
                                  type="text"
                                  name="firstName"
                                  placeholder={isEnglish ? "Name" : "الاسم"}
                                  value={formData.firstName}
                                  onChange={handleInputChange}
                                  className={`w-full p-2 sm:p-3 ${isEnglish ? "pl-10 sm:pl-12 text-left" : "pr-10 sm:pr-12 text-right"} border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:outline-none transition-all duration-200`}
                                />
                                {errors.firstName && (
                                  <p className={`text-red-500 text-xs mt-1 ${isEnglish ? "text-left" : "text-right"}`}>
                                    {errors.firstName}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className={`mb-6 relative ${isEnglish ? "text-left" : "text-right"}`}>
                              <div className="relative">
                                <label
                                  className={`absolute -top-6 ${isEnglish ? "left-0" : "right-0"} flex items-center text-gray-700 font-medium text-sm sm:text-base`}
                                >
                                  {isEnglish ? "National ID" : "رقم الهوية الوطنية"}
                                  <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div
                                  className={`absolute inset-y-0 ${isEnglish ? "left-3" : "right-3"} flex items-center pointer-events-none`}
                                >
                                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                                </div>
                                <input
                                  type="text"
                                  name="nationalId"
                                  placeholder={isEnglish ? "National ID" : "رقم الهوية الوطنية"}
                                  value={formData.nationalId}
                                  onChange={handleInputChange}
                                  className={`w-full p-2 sm:p-3 ${isEnglish ? "pl-10 sm:pl-12 text-left" : "pr-10 sm:pr-12 text-right"} border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:outline-none transition-all duration-200`}
                                />
                                {errors.nationalId && (
                                  <p className={`text-red-500 text-xs mt-1 ${isEnglish ? "text-left" : "text-right"}`}>
                                    {errors.nationalId}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className={`mb-6 relative ${isEnglish ? "text-left" : "text-right"}`}>
                              <div className="relative">
                                <label
                                  className={`absolute -top-6 ${isEnglish ? "left-0" : "right-0"} flex items-center text-gray-700 font-medium text-sm sm:text-base`}
                                >
                                  {isEnglish ? "Email" : "البريد الإلكتروني"}
                                </label>
                                <div
                                  className={`absolute inset-y-0 ${isEnglish ? "left-3" : "right-3"} flex items-center pointer-events-none`}
                                >
                                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                                </div>
                                <input
                                  type="email"
                                  name="email"
                                  placeholder={isEnglish ? "Email Address" : "البريد الإلكتروني"}
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  className={`w-full p-2 sm:p-3 ${isEnglish ? "pl-10 sm:pl-12 text-left" : "pr-10 sm:pr-12 text-right"} border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:outline-none transition-all duration-200`}
                                  dir="ltr"
                                />
                                {errors.email && (
                                  <p className={`text-red-500 text-xs mt-1 ${isEnglish ? "text-left" : "text-right"}`}>
                                    {errors.email}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className={`mb-6 relative ${isEnglish ? "text-left" : "text-right"}`}>
                              <div className="relative">
                                <label
                                  className={`absolute -top-6 ${isEnglish ? "left-0" : "right-0"} flex items-center text-gray-700 font-medium text-sm sm:text-base`}
                                >
                                  {isEnglish ? "Phone Number" : "رقم الهاتف"}
                                  <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div
                                  className={`absolute inset-y-0 ${isEnglish ? "left-3" : "right-3"} flex items-center pointer-events-none`}
                                >
                                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                                </div>
                                <div className="relative">
                                  <input
                                    type="tel"
                                    name="phone"
                                    placeholder={isEnglish ? "Phone Number" : "رقم الهاتف"}
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={`w-full p-2 sm:p-3 ${isEnglish ? "pl-10 sm:pl-12 text-left" : "pr-10 sm:pr-12 text-right"} border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:outline-none transition-all duration-200`}
                                    dir="ltr"
                                  />
                                  {formData.hasWhatsapp && (
                                    <div
                                      className={`absolute ${isEnglish ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 flex items-center justify-center`}
                                    >
                                      <span className="text-green-500" title={isEnglish ? "WhatsApp available" : "واتساب متاح"}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                        </svg>
                                      </span>
                                    </div>
                                  )}
                                </div>
                                {errors.phone && (
                                  <p className={`text-red-500 text-xs mt-1 ${isEnglish ? "text-left" : "text-right"}`}>
                                    {errors.phone}
                                  </p>
                                )}
                              </div>

                              <div
                                className={`flex items-center ${isEnglish ? "justify-start" : "justify-end"} mt-4 mb-8`}
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
                                    className={`w-5 h-5 cursor-pointer flex items-center justify-center border-2 ${formData.hasWhatsapp ? "border-brand-primary bg-brand-primary" : "border-gray-300"} rounded transition-colors duration-200`}
                                    onClick={() =>
                                      handleInputChange({
                                        target: {
                                          name: "hasWhatsapp",
                                          type: "checkbox",
                                          checked: !formData.hasWhatsapp,
                                        },
                                      })
                                    }
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
                                <label
                                  htmlFor="hasWhatsapp"
                                  className="mx-3 text-sm text-gray-700 flex items-center group hover:text-brand-primary transition-colors duration-200 cursor-pointer"
                                >
                                  {isEnglish ? "This number has WhatsApp" : "هذا الرقم لديه واتساب"}
                                  <span className="ml-1 group-hover:text-green-600 transition-colors duration-200">
                                    <FontAwesomeIcon icon={faWhatsapp} className="text-green-500 w-4 h-4" />
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {getFormStepContent() === "confirmation" && (
                        <div className="space-y-3 sm:space-y-4">
                          <h3 className="text-lg sm:text-xl font-semibold text-brand-primary mb-4 sm:mb-6 flex items-center">
                            <FileText
                              className={`w-4 h-4 sm:w-5 sm:h-5 ${isEnglish ? "mr-1 sm:mr-2" : "ml-1 sm:ml-2"}`}
                            />
                            {isEnglish ? "Confirmation" : "التأكيد"}
                          </h3>

                          <div
                            className={`mt-4 mb-6 flex items-center ${isEnglish ? "justify-start" : "flex-row-reverse"}`}
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
                                className={`w-5 h-5 cursor-pointer flex items-center justify-center border-2 ${formData.acceptTerms ? "border-brand-primary bg-brand-primary" : "border-gray-300"} rounded transition-colors duration-200`}
                                onClick={() =>
                                  handleInputChange({
                                    target: { name: "acceptTerms", type: "checkbox", checked: !formData.acceptTerms },
                                  })
                                }
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
                            <label
                              htmlFor="acceptTerms"
                              className="mx-3 text-sm text-gray-700 hover:text-brand-primary transition-colors duration-200 cursor-pointer"
                            >
                              {isEnglish ? "I accept the terms and conditions" : "أوافق على الشروط والأحكام"}
                            </label>
                          </div>
                          {errors.acceptTerms && (
                            <p className={`text-red-500 text-xs mt-2 ${isEnglish ? "text-left" : "text-right"}`}>
                              {errors.acceptTerms}
                            </p>
                          )}

                          <div className="mt-4">
                            <label
                              className={`block text-sm font-medium text-gray-700 mb-2 ${isEnglish ? "text-left" : "text-right"}`}
                            >
                              {isEnglish ? "Additional Notes" : "ملاحظات إضافية"}
                            </label>
                            <textarea
                              name="note"
                              value={formData.note}
                              onChange={handleInputChange}
                              placeholder={isEnglish ? "Additional notes or questions" : "ملاحظات أو أسئلة إضافية"}
                              rows={4}
                              className={`w-full p-2 sm:p-3 text-gray-700 ${isEnglish ? "text-left" : "text-right"} bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:outline-none transition-all duration-200`}
                            />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex justify-between gap-2 sm:gap-4 pt-4 sm:pt-6">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="py-2 sm:py-3 px-4 sm:px-12 bg-transparent border border-brand-primary text-brand-primary rounded-xl text-sm font-medium hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50 transition-colors"
                      >
                        {isEnglish ? "Back" : "رجوع"}
                      </button>
                    )}

                    <div ref={lastFocusableElementRef}>{renderActionButton()}</div>
                  </div>
                </form>
              </div>

              {/* Mobile Summary - Only shown on the last step */}
              {getFormStepContent() === "confirmation" && (
                <div className="mt-6 lg:hidden w-full p-2 sm:p-4 bg-purple-50 rounded-xl shadow-sm">
                  <h3 className="text-base font-semibold mb-3 text-brand-primary flex items-center">
                    <FileText className="w-4 h-4 mr-1 text-brand-primary" />
                    {isEnglish ? "Summary" : "ملخص"}
                  </h3>
                  <div className="space-y-2 text-sm">
                    {/* Show only essential information in mobile summary */}
                    {formData.firstName && (
                      <div className="flex items-center">
                        <User className="w-3 h-3 text-brand-primary mr-2 flex-shrink-0" />
                        <span className="text-gray-600">
                          {isEnglish ? `Name: ${formData.firstName}` : `الاسم: ${formData.firstName}`}
                        </span>
                      </div>
                    )}
                    {formData.nationalId && (
                      <div className="flex items-center">
                        <FileText className="w-3 h-3 text-brand-primary mr-2 flex-shrink-0" />
                        <span className="text-gray-600">
                          {isEnglish
                            ? `National ID: ${formData.nationalId}`
                            : `رقم الهوية الوطنية: ${formData.nationalId}`}
                        </span>
                      </div>
                    )}
                    {formData.phone && (
                      <div className="flex items-center">
                        <Phone className="w-3 h-3 text-brand-primary mr-2 flex-shrink-0" />
                        <span className="text-gray-600">
                          {isEnglish ? `Phone: ${formData.phone}` : `رقم الهاتف: ${formData.phone}`}
                          {formData.hasWhatsapp && (
                            <FontAwesomeIcon icon={faWhatsapp} className="text-green-500 w-3 h-3 ml-2" />
                          )}
                        </span>
                      </div>
                    )}
                    {isAllDataFilled() && (
                      <div className="mt-4">
                        <PDFDownloadLink
                          document={<OrderPDF formData={formData} carDetails={car_Details} carImage={carImage} isEnglish={isEnglish} />}
                          fileName={`car-order-${formData.firstName}-${new Date().toISOString().split("T")[0]}.pdf`}
                          className="inline-flex items-center px-4 py-2 rounded-xl bg-brand-primary text-white text-xs hover:bg-[#3b1442] transition-colors"
                        >
                          {({ blob, url, loading, error }) =>
                            loading ? (
                              <span>{isEnglish ? "Generating..." : "جاري..."}</span>
                            ) : (
                              <>
                                <Download className="mr-1 w-3 h-3" />
                                {isEnglish ? "Download PDF" : "طباعة الورق"}
                              </>
                            )
                          }
                        </PDFDownloadLink>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
