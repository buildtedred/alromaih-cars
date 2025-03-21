"use client"

import { useState, useEffect } from "react"
import {
  X,
  ChevronRight,
  ChevronLeft,
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
import { usePathname } from "next/navigation"

export function MultiStepPopup({ isOpen, onClose, car_Details }) {
  const pathname = usePathname()
  const isEnglish = pathname.startsWith("/en")

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
        if (!formData.type) stepErrors.type = isEnglish ? "Please select a buyer type" : "الرجاء اختيار نوع المشتري"
        break
      case 2:
        if (!formData.firstName.trim())
          stepErrors.firstName = isEnglish ? "First name is required" : "الاسم الأول مطلوب"
        if (!formData.lastName.trim()) stepErrors.lastName = isEnglish ? "Last name is required" : "اسم العائلة مطلوب"
        if (!formData.email.trim()) stepErrors.email = isEnglish ? "Email is required" : "البريد الإلكتروني مطلوب"
        else if (!/\S+@\S+\.\S+/.test(formData.email))
          stepErrors.email = isEnglish ? "Email is invalid" : "البريد الإلكتروني غير صالح"
        if (!formData.phone.trim()) stepErrors.phone = isEnglish ? "Phone number is required" : "رقم الهاتف مطلوب"
        if (!formData.city.trim()) stepErrors.city = isEnglish ? "City is required" : "المدينة مطلوبة"
        break
      case 3:
        if (!formData.visitDate) stepErrors.visitDate = isEnglish ? "Visit date is required" : "تاريخ الزيارة مطلوب"
        if (!formData.visitTime) stepErrors.visitTime = isEnglish ? "Visit time is required" : "وقت الزيارة مطلوب"
        break
      case 4:
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
      <h3 className={`text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 ${!isEnglish ? "text-right" : ""}`}>
        {isEnglish ? "Summary" : "الملخص"}
      </h3>
      <div className="space-y-3">
        {car_Details?.name?.en?.name && (
          <div className={`flex items-center text-sm ${!isEnglish ? "flex-row-reverse justify-end" : ""}`}>
            <span className="text-gray-600 dark:text-gray-400">{isEnglish ? "Car:" : "السيارة:"}</span>
            <span className={`${isEnglish ? "ml-2" : "mr-2"} font-medium text-gray-800 dark:text-gray-200`}>
              {isEnglish ? car_Details.name.en.name : car_Details.name?.ar?.name || car_Details.name.en.name}
            </span>
          </div>
        )}
        {imageError ? (
          <div
            className={`flex items-center text-sm text-yellow-600 dark:text-yellow-400 ${!isEnglish ? "flex-row-reverse" : ""}`}
          >
            <AlertCircle className={`w-4 h-4 ${isEnglish ? "mr-2" : "ml-2"}`} />
            <span>{isEnglish ? "Unable to load car image" : "تعذر تحميل صورة السيارة"}</span>
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
          <div className={`flex items-center text-sm ${!isEnglish ? "flex-row-reverse justify-end" : ""}`}>
            <User className={`w-4 h-4 text-brand-primary ${isEnglish ? "mr-2" : "ml-2"}`} />
            <span className="text-gray-600 dark:text-gray-400">{isEnglish ? "Buyer Type:" : "نوع المشتري:"}</span>
            <span className={`${isEnglish ? "ml-2" : "mr-2"} font-medium text-gray-800 dark:text-gray-200 capitalize`}>
              {isEnglish ? formData.type : formData.type === "individual" ? "فرد" : "شركة"}
            </span>
          </div>
        )}
        {(formData.firstName || formData.lastName) && (
          <div className={`flex items-center text-sm ${!isEnglish ? "flex-row-reverse justify-end" : ""}`}>
            <User className={`w-4 h-4 text-brand-primary ${isEnglish ? "mr-2" : "ml-2"}`} />
            <span className="text-gray-600 dark:text-gray-400">{isEnglish ? "Name:" : "الاسم:"}</span>
            <span className={`${isEnglish ? "ml-2" : "mr-2"} font-medium text-gray-800 dark:text-gray-200`}>
              {`${formData.firstName} ${formData.lastName}`.trim()}
            </span>
          </div>
        )}
        {formData.email && (
          <div className={`flex items-center text-sm ${!isEnglish ? "flex-row-reverse justify-end" : ""}`}>
            <Mail className={`w-4 h-4 text-brand-primary ${isEnglish ? "mr-2" : "ml-2"}`} />
            <span className="text-gray-600 dark:text-gray-400">{isEnglish ? "Email:" : "البريد الإلكتروني:"}</span>
            <span className={`${isEnglish ? "ml-2" : "mr-2"} font-medium text-gray-800 dark:text-gray-200`}>
              {formData.email}
            </span>
          </div>
        )}
        {formData.phone && (
          <div className={`flex items-center text-sm ${!isEnglish ? "flex-row-reverse justify-end" : ""}`}>
            <Phone className={`w-4 h-4 text-brand-primary ${isEnglish ? "mr-2" : "ml-2"}`} />
            <span className="text-gray-600 dark:text-gray-400">{isEnglish ? "Phone:" : "الهاتف:"}</span>
            <span className={`${isEnglish ? "ml-2" : "mr-2"} font-medium text-gray-800 dark:text-gray-200`}>
              {formData.phone}
            </span>
            {formData.hasWhatsapp && <MessageCircle className="w-4 h-4 ml-2 text-green-500" />}
          </div>
        )}
        {formData.city && (
          <div className={`flex items-center text-sm ${!isEnglish ? "flex-row-reverse justify-end" : ""}`}>
            <MapPin className={`w-4 h-4 text-brand-primary ${isEnglish ? "mr-2" : "ml-2"}`} />
            <span className="text-gray-600 dark:text-gray-400">{isEnglish ? "City:" : "المدينة:"}</span>
            <span className={`${isEnglish ? "ml-2" : "mr-2"} font-medium text-gray-800 dark:text-gray-200`}>
              {formData.city}
            </span>
          </div>
        )}
        {formData.visitDate && (
          <div className={`flex items-center text-sm ${!isEnglish ? "flex-row-reverse justify-end" : ""}`}>
            <Calendar className={`w-4 h-4 text-brand-primary ${isEnglish ? "mr-2" : "ml-2"}`} />
            <span className="text-gray-600 dark:text-gray-400">{isEnglish ? "Visit Date:" : "تاريخ الزيارة:"}</span>
            <span className={`${isEnglish ? "ml-2" : "mr-2"} font-medium text-gray-800 dark:text-gray-200`}>
              {formData.visitDate}
            </span>
          </div>
        )}
        {formData.visitTime && (
          <div className={`flex items-center text-sm ${!isEnglish ? "flex-row-reverse justify-end" : ""}`}>
            <Clock className={`w-4 h-4 text-brand-primary ${isEnglish ? "mr-2" : "ml-2"}`} />
            <span className="text-gray-600 dark:text-gray-400">{isEnglish ? "Visit Time:" : "وقت الزيارة:"}</span>
            <span className={`${isEnglish ? "ml-2" : "mr-2"} font-medium text-gray-800 dark:text-gray-200`}>
              {formData.visitTime}
            </span>
          </div>
        )}
        {formData.note && (
          <div className={`flex items-start text-sm ${!isEnglish ? "flex-row-reverse justify-end" : ""}`}>
            <FileText className={`w-4 h-4 mt-1 text-brand-primary ${isEnglish ? "mr-2" : "ml-2"}`} />
            <span className="text-gray-600 dark:text-gray-400">{isEnglish ? "Note:" : "ملاحظة:"}</span>
            <span
              className={`${isEnglish ? "ml-2" : "mr-2"} font-medium text-gray-800 dark:text-gray-200 ${!isEnglish ? "text-right" : ""}`}
            >
              {formData.note}
            </span>
          </div>
        )}
        {formData.acceptTerms && (
          <div className={`flex items-center text-sm ${!isEnglish ? "flex-row-reverse justify-end" : ""}`}>
            <Check className={`w-4 h-4 text-green-500 ${isEnglish ? "mr-2" : "ml-2"}`} />
            <span className="text-gray-600 dark:text-gray-400">{isEnglish ? "Terms accepted" : "تم قبول الشروط"}</span>
          </div>
        )}
      </div>
      {isAllDataFilled() && (
        <div className={`mt-6 ${!isEnglish ? "text-right" : ""}`}>
          <PDFDownloadLink
            document={<OrderPDF formData={formData} car_Details={{ ...car_Details, image_url: carImage }} />}
            fileName="order_summary.pdf"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-brand-primary hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
          >
            {({ blob, url, loading, error }) =>
              loading ? (
                isEnglish ? (
                  "Generating PDF..."
                ) : (
                  "جاري إنشاء PDF..."
                )
              ) : (
                <>
                  <Download className={`w-4 h-4 ${isEnglish ? "mr-2" : "ml-2"}`} />
                  {isEnglish ? "Download PDF" : "تحميل PDF"}
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
        className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-5xl overflow-hidden shadow-lg shadow-brand-primary/10 dark:shadow-none flex"
      >
        <div className="flex-1 p-8 overflow-y-auto max-h-[80vh]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className={`text-3xl font-bold text-gray-900 dark:text-white ${!isEnglish ? "text-right" : ""}`}>
                {step === 1 && (isEnglish ? "Select Type" : "اختر النوع")}
                {step === 2 && (isEnglish ? "Personal Info" : "المعلومات الشخصية")}
                {step === 3 && (isEnglish ? "Visit Details" : "تفاصيل الزيارة")}
                {step === 4 && (isEnglish ? "Confirmation" : "التأكيد")}
              </h2>
              <p className={`text-sm text-gray-500 dark:text-gray-400 mt-1 ${!isEnglish ? "text-right" : ""}`}>
                {isEnglish ? `Step ${step} of 4` : `الخطوة ${step} من 4`}
              </p>
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
              className="h-full bg-gradient-to-r from-brand-primary to-brand-primary/70 rounded-full"
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
                    <p className={`text-sm text-gray-700 dark:text-gray-300 mb-3 ${!isEnglish ? "text-right" : ""}`}>
                      {isEnglish ? "What type of buyer are you?" : "ما نوع المشتري الذي أنت عليه؟"}
                    </p>
                    {["individual", "company"].map((type) => (
                      <label
                        key={type}
                        className={`flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-full transition-all hover:border-brand-primary dark:hover:border-brand-primary/70 cursor-pointer ${!isEnglish ? "flex-row-reverse" : ""}`}
                      >
                        <input
                          type="radio"
                          name="type"
                          value={type}
                          checked={formData.type === type}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-brand-primary border-gray-300 focus:ring-brand-primary dark:focus:ring-brand-primary/70"
                        />
                        <span className={`${isEnglish ? "ml-3" : "mr-3"} text-gray-700 dark:text-gray-300 capitalize`}>
                          {isEnglish ? type : type === "individual" ? "فرد" : "شركة"}
                        </span>
                      </label>
                    ))}
                    {errors.type && (
                      <p className={`text-red-500 text-sm ${!isEnglish ? "text-right" : ""}`}>{errors.type}</p>
                    )}
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { name: "firstName", label: "First Name", labelAr: "الاسم الأول", icon: User },
                        { name: "lastName", label: "Last Name", labelAr: "اسم العائلة", icon: User },
                      ].map((field) => (
                        <div key={field.name} className="relative mb-6">
                          <field.icon
                            className={`absolute ${isEnglish ? "left-3" : "right-3"} top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5`}
                          />
                          <input
                            type="text"
                            name={field.name}
                            placeholder={isEnglish ? field.label : field.labelAr}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            className={`w-full ${isEnglish ? "pl-10 pr-3" : "pr-10 pl-3 text-right"} py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-brand-primary dark:focus:ring-brand-primary/70 focus:border-brand-primary dark:focus:border-brand-primary/70 focus:outline-none transition-all duration-200`}
                          />
                          {errors[field.name] && (
                            <p
                              className={`text-red-500 text-xs absolute ${isEnglish ? "left-0" : "right-0"} -bottom-5 ${!isEnglish ? "text-right" : ""}`}
                            >
                              {errors[field.name]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    {[
                      {
                        name: "email",
                        label: "Email Address",
                        labelAr: "البريد الإلكتروني",
                        icon: Mail,
                        type: "email",
                      },
                      { name: "phone", label: "Phone Number", labelAr: "رقم الهاتف", icon: Phone, type: "tel" },
                      { name: "city", label: "City", labelAr: "المدينة", icon: MapPin, type: "text" },
                    ].map((field) => (
                      <div key={field.name} className="relative mb-6">
                        <field.icon
                          className={`absolute ${isEnglish ? "left-3" : "right-3"} top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5`}
                        />
                        <input
                          type={field.type}
                          name={field.name}
                          placeholder={isEnglish ? field.label : field.labelAr}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          className={`w-full ${isEnglish ? "pl-10 pr-3" : "pr-10 pl-3 text-right"} py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-brand-primary dark:focus:ring-brand-primary/70 focus:border-brand-primary dark:focus:border-brand-primary/70 focus:outline-none transition-all duration-200`}
                        />
                        {errors[field.name] && (
                          <p
                            className={`text-red-500 text-xs absolute ${isEnglish ? "left-0" : "right-0"} -bottom-5 ${!isEnglish ? "text-right" : ""}`}
                          >
                            {errors[field.name]}
                          </p>
                        )}
                      </div>
                    ))}
                    <label className={`flex items-center ${!isEnglish ? "flex-row-reverse" : ""}`}>
                      <input
                        type="checkbox"
                        name="hasWhatsapp"
                        checked={formData.hasWhatsapp}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-0 focus:ring-offset-0 focus:outline-none checked:bg-brand-primary checked:border-brand-primary transition-colors duration-200"
                      />
                      <span className={`${isEnglish ? "ml-2" : "mr-2"} text-sm text-gray-700 dark:text-gray-300`}>
                        {isEnglish ? "This number has WhatsApp" : "هذا الرقم لديه واتساب"}
                      </span>
                      {formData.hasWhatsapp && <MessageCircle className="w-4 h-4 ml-2 text-green-500" />}
                    </label>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div className="relative">
                      <Calendar
                        className={`absolute ${isEnglish ? "left-3" : "right-3"} top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5`}
                      />
                      <input
                        type="date"
                        name="visitDate"
                        value={formData.visitDate}
                        onChange={handleInputChange}
                        className={`w-full ${isEnglish ? "pl-10 pr-3" : "pr-10 pl-3 text-right"} py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-brand-primary dark:focus:ring-brand-primary/70 focus:border-brand-primary dark:focus:border-brand-primary/70 focus:outline-none transition-all duration-200`}
                      />
                      {errors.visitDate && (
                        <p className={`text-red-500 text-xs mt-1 ${!isEnglish ? "text-right" : ""}`}>
                          {errors.visitDate}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <Clock
                        className={`absolute ${isEnglish ? "left-3" : "right-3"} top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5`}
                      />
                      <select
                        name="visitTime"
                        value={formData.visitTime}
                        onChange={handleInputChange}
                        className={`w-full ${isEnglish ? "pl-10 pr-3" : "pr-10 pl-3 text-right"} py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-brand-primary dark:focus:ring-brand-primary/70 focus:border-brand-primary dark:focus:border-brand-primary/70 focus:outline-none transition-all duration-200 appearance-none`}
                      >
                        <option value="">{isEnglish ? "Select a time slot" : "اختر وقت الزيارة"}</option>
                        <option value="9:00-12:00">9:00 - 12:00</option>
                        <option value="16:00-21:00">16:00 - 21:00</option>
                      </select>
                      {isEnglish ? (
                        <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 pointer-events-none" />
                      ) : (
                        <ChevronLeft className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 pointer-events-none" />
                      )}
                      {errors.visitTime && (
                        <p className={`text-red-500 text-xs mt-1 ${!isEnglish ? "text-right" : ""}`}>
                          {errors.visitTime}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <div className="relative">
                      <FileText
                        className={`absolute ${isEnglish ? "left-3" : "right-3"} top-3 text-gray-400 dark:text-gray-500 h-5 w-5`}
                      />
                      <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleInputChange}
                        placeholder={isEnglish ? "Additional notes or questions" : "ملاحظات أو أسئلة إضافية"}
                        rows={4}
                        className={`w-full ${isEnglish ? "pl-10 pr-3" : "pr-10 pl-3 text-right"} py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-brand-primary dark:focus:ring-brand-primary/70 focus:border-brand-primary dark:focus:border-brand-primary/70 focus:outline-none transition-all duration-200 scrollbar-thin scrollbar-thumb-brand-primary scrollbar-track-gray-200 dark:scrollbar-thumb-brand-primary/70 dark:scrollbar-track-gray-700`}
                      />
                    </div>
                    <label className={`flex items-start ${!isEnglish ? "flex-row-reverse" : ""}`}>
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleInputChange}
                        className="mt-1 w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-0 focus:ring-offset-0 focus:outline-none checked:bg-brand-primary checked:border-brand-primary transition-colors duration-200"
                      />
                      <span className={`${isEnglish ? "ml-2" : "mr-2"} text-sm text-gray-700 dark:text-gray-300`}>
                        {isEnglish ? "I accept the terms and conditions" : "أوافق على الشروط والأحكام"}
                      </span>
                    </label>
                    {errors.acceptTerms && (
                      <p className={`text-red-500 text-xs ${!isEnglish ? "text-right" : ""}`}>{errors.acceptTerms}</p>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-4 pt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary dark:focus:ring-brand-primary/70 transition-colors shadow-md hover:shadow-lg"
                >
                  {isEnglish ? "Back" : "رجوع"}
                </button>
              )}
              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-brand-primary to-brand-primary/70 text-white rounded-full text-sm font-medium hover:from-brand-primary/90 hover:to-brand-primary/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors shadow-md hover:shadow-lg"
                >
                  {isEnglish ? "Next" : "التالي"}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-brand-primary to-brand-primary/70 text-white rounded-full text-sm font-medium hover:from-brand-primary/90 hover:to-brand-primary/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className={`animate-spin ${isEnglish ? "-ml-1 mr-3" : "-mr-1 ml-3"} h-5 w-5 text-white`}
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
                      {isEnglish ? "Submitting..." : "جاري الإرسال..."}
                    </span>
                  ) : isEnglish ? (
                    "Submit"
                  ) : (
                    "إرسال"
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

