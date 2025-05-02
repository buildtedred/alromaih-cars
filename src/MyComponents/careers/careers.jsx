"use client"
import Image from "next/image"
import { useParams, usePathname } from "next/navigation"
import { useState, useRef } from "react"
import { Breadcrumb } from "../breadcrumb"

export default function CareersPage() {
  const params = useParams()
  const locale = params?.locale || "ar"
  const pathname = usePathname()
  const isEnglish = !pathname.startsWith("/ar")

  // Generate breadcrumb items
  const getBreadcrumbItems = () => {
    return [
      {
        label: isEnglish ? "Home" : "الرئيسية",
        href: `/${locale}`,
      },
      {
        label: isEnglish ? "Careers" : "الوظائف",
      },
    ]
  }

  // Set to null to track which category is selected for the form
  const [activeCategory, setActiveCategory] = useState(null)
  // Track which button is clicked for visual styling
  const [clickedCategory, setClickedCategory] = useState(null)

  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")

  // Job titles for each category
  const jobTitles = {
    other: locale === "ar" ? "وظيفة أخرى" : "Other Job",
    sales: locale === "ar" ? "مندوب مبيعات" : "Sales Representative",
    accounting: locale === "ar" ? "محاسب" : "Accountant",
    marketing: locale === "ar" ? "مصمم جرافيك" : "Graphic Designer",
  }

  // Active styles for each category
  const categoryActiveStyles = {
    marketing: "bg-brand-primary text-white",
    sales: "bg-[#71308A] text-white",
    accounting: "bg-[#5A2670] text-white",
    other: "bg-[#8B44A5] text-white",
  }

  const handleCategoryClick = (category) => {
    setActiveCategory(category)
    setClickedCategory(category)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if (!validTypes.includes(file.type)) {
      alert(
        locale === "ar" ? "يرجى تحميل ملف بتنسيق DOC أو DOCX أو PDF فقط" : "Please upload only DOC, DOCX, or PDF files",
      )
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(locale === "ar" ? "حجم الملف يجب أن يكون أقل من 5 ميجابايت" : "File size must be less than 5MB")
      return
    }

    setSelectedFile(file)
  }

  const handleUploadClick = () => {
    fileInputRef.current.click()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.phone || !formData.email || !selectedFile) {
      setSubmitError(
        locale === "ar"
          ? "يرجى ملء جميع الحقول وتحميل السيرة الذاتية"
          : "Please fill all fields and upload your resume",
      )
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      console.log("Form Data:", {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        resume: selectedFile
          ? {
              name: selectedFile.name,
              type: selectedFile.type,
              size: `${(selectedFile.size / 1024).toFixed(2)} KB`,
            }
          : null,
        jobCategory: activeCategory,
        jobTitle: jobTitles[activeCategory],
      })

      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSubmitSuccess(true)

      setTimeout(() => {
        setFormData({ name: "", phone: "", email: "" })
        setSelectedFile(null)
        setSubmitSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Submission error:", error)
      setSubmitError(
        locale === "ar"
          ? "حدث خطأ أثناء تقديم الطلب. يرجى المحاولة مرة أخرى."
          : "An error occurred while submitting your application. Please try again.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Team members data with both Arabic and English support
  const teamMembers = [
    {
      id: 1,
      nameAr: "أحمد الرميح",
      nameEn: "Ahmed Al Rumaih",
      titleAr: "الرئيس مجلس الإدارة",
      titleEn: "Chairman of the Board",
      image: "/images/main-car.jpg",
    },
    {
      id: 2,
      nameAr: "سيد يحي",
      nameEn: "Sayed Yahya",
      titleAr: "الرئيس",
      titleEn: "President",
      image: "/images/team-member.jpg",
    },
    {
      id: 3,
      nameAr: "أحمد الرميح",
      nameEn: "Ahmed Al Rumaih",
      titleAr: "الرئيس مجلس الإدارة",
      titleEn: "Chairman of the Board",
      image: "/images/main-car.jpg",
    },
    {
      id: 4,
      nameAr: "أحمد الرميح",
      nameEn: "Ahmed Al Rumaih",
      titleAr: "الرئيس مجلس الإدارة",
      titleEn: "Chairman of the Board",
      image: "/images/main-car.jpg",
    },
    {
      id: 5,
      nameAr: "أحمد الرميح",
      nameEn: "Ahmed Al Rumaih",
      titleAr: "الرئيس مجلس الإدارة",
      titleEn: "Chairman of the Board",
      image: "/images/main-car.jpg",
    },
    {
      id: 6,
      nameAr: "أحمد الرميح",
      nameEn: "Ahmed Al Rumaih",
      titleAr: "الرئيس مجلس الإدارة",
      titleEn: "Chairman of the Board",
      image: "/images/main-car.jpg",
    },
    {
      id: 7,
      nameAr: "أحمد الرميح",
      nameEn: "Ahmed Al Rumaih",
      titleAr: "الرئيس مجلس الإدارة",
      titleEn: "Chairman of the Board",
      image: "/images/main-car.jpg",
    },
  ]

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <div className="max-w-[calc(100%-1.5rem)] sm:max-w-[calc(100%-3rem)] md:max-w-[calc(100%-6rem)] lg:max-w-[calc(100%-10rem)] xl:max-w-[1300px] mx-auto pt-4">
        <Breadcrumb items={getBreadcrumbItems()} />
      </div>

      {/* Hero Section with Light Purple Background */}
      <div className="pt-10 pb-10">
        <div className="max-w-[calc(100%-1.5rem)] sm:max-w-[calc(100%-3rem)] md:max-w-[calc(100%-6rem)] lg:max-w-[calc(100%-10rem)] xl:max-w-[1300px] mx-auto">
          <div className={`${locale === "ar" ? "rtl" : ""}`}>
            {/* Join Us Section */}
            <section className="bg-brand-light rounded-xl p-6 mb-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                {/* Magnifying Glass with Person Icon - Now on right for both Arabic and English */}
                <div className={`w-full md:w-1/4 ${locale === "ar" ? "md:order-2" : "md:order-2"}`}>
                  <Image
                    src="/images/Career-Icon.svg"
                    alt="Career icon"
                    width={220}
                    height={220}
                    className="w-full max-w-[220px] mx-auto"
                  />
                </div>

                {/* Text Content - Now on left for both Arabic and English */}
                <div
                  className={`text-${locale === "ar" ? "right" : "left"} flex-1 ${locale === "ar" ? "md:order-1" : "md:order-1"}`}
                >
                  <h1
                    className={`font-bold text-brand-primary mb-6 ${locale === "ar" ? "font-noto" : ""}`}
                    style={{ fontSize: "76px", lineHeight: "1.1" }}
                  >
                    {locale === "ar" ? "انضم إلينا واصنع مستقبلك!" : "Join us and build your future!"}
                  </h1>
                  <p
                    className={`text-gray-600 max-w-2xl ${locale === "ar" ? "font-noto" : ""}`}
                    style={{ fontSize: "30px", lineHeight: "3.5rem" }}
                  >
                    {locale === "ar"
                      ? "هذه الصفحة تعرض الفرص الوظيفية المتاحة لدينا، حيث يمكنك التقديم والانضمام إلى فريقنا"
                      : "This page displays the job opportunities available at our company, where you can apply to join our team"}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-16">
        <div className="max-w-[calc(100%-1.5rem)] sm:max-w-[calc(100%-3rem)] md:max-w-[calc(100%-6rem)] lg:max-w-[calc(100%-10rem)] xl:max-w-[1300px] mx-auto">
          <div className={`${locale === "ar" ? "rtl" : ""}`}>
            {/* Section Title */}
            <h2
              className={`text-3xl sm:text-4xl font-bold text-brand-primary text-center mb-6 ${locale === "ar" ? "font-noto" : ""}`}
            >
              {locale === "ar" ? "مزايا العمل معنا" : "Benefits of Working With Us"}
            </h2>

            {/* Subtitle */}
            <p className={`text-gray-600 text-center mb-12 ${locale === "ar" ? "font-noto" : ""}`}>
              {locale === "ar"
                ? "نقدم لك بيئة عمل محفزة، وفرص تطوير مهني، ومزايا تنافسية تدعم نجاحك."
                : "We offer you a stimulating work environment, professional development opportunities, and competitive benefits to support your success."}
            </p>

            {/* Benefits Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Career Development - Image touching left edge */}
              <div className="bg-brand-light rounded-xl h-[220px] overflow-hidden">
                <div className={`flex ${locale === "ar" ? "flex-row-reverse" : "flex-row"} items-center h-full`}>
                  <div className={`flex-shrink-0 ${locale === "ar" ? "pr-0" : "pl-0"}`}>
                    <Image
                      src="/images/VisionArrow.svg"
                      alt="Career growth"
                      width={120}
                      height={137}
                      style={{ width: "119.71px", height: "136.88px" }}
                    />
                  </div>
                  <div className={`${locale === "ar" ? "text-right pr-6" : "text-left pl-4 pr-6"}`}>
                    <h3 className={`text-lg font-bold text-brand-primary mb-2 ${locale === "ar" ? "font-noto" : ""}`}>
                      {locale === "ar" ? "فرص للتطوير" : "Development Opportunities"}
                    </h3>
                    <p className={`text-gray-600 text-sm ${locale === "ar" ? "font-noto" : ""}`}>
                      {locale === "ar"
                        ? "نساعدك على تطوير مهاراتك والتقدم في المسارات المهنية"
                        : "We help you develop your skills and advance in career paths"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Competitive Benefits */}
              <div className="bg-brand-light rounded-xl p-6 h-[220px]">
                <div className={`flex ${locale === "ar" ? "flex-row-reverse" : "flex-row"} items-center gap-4 h-full`}>
                  <div className="flex-shrink-0">
                    <Image
                      src="/images/Benefits.svg"
                      alt="Competitive benefits"
                      width={120}
                      height={137}
                      style={{ width: "119.71px", height: "136.88px" }}
                    />
                  </div>
                  <div className={`${locale === "ar" ? "text-right" : "text-left"}`}>
                    <h3 className={`text-lg font-bold text-brand-primary mb-2 ${locale === "ar" ? "font-noto" : ""}`}>
                      {locale === "ar" ? "مزايا تنافسية" : "Competitive Benefits"}
                    </h3>
                    <p className={`text-gray-600 text-sm ${locale === "ar" ? "font-noto" : ""}`}>
                      {locale === "ar"
                        ? "نظام رواتب ومزايا تجعل العمل معنا فرصة مميزة"
                        : "Salary system and benefits that make working with us a distinctive opportunity"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3: Stimulating Work Environment - SVG touching bottom with height 135px */}
              <div className="bg-brand-light rounded-xl p-6 pr-6 pl-0 h-[220px] overflow-hidden relative">
                <div className={`flex ${locale === "ar" ? "flex-row-reverse" : "flex-row"} items-center h-full`}>
                  <div
                    className={`flex-shrink-0 absolute ${locale === "ar" ? "right-0 bottom-[-15px]" : "left-0 bottom-[-15px]"}`}
                  >
                    <Image
                      src="/images/Work-Environment.svg"
                      alt="Work environment"
                      width={140}
                      height={150}
                      style={{ width: "140px", height: "150px", transform: "scaleY(1.15)" }}
                    />
                  </div>
                  <div className={`${locale === "ar" ? "text-right mr-[150px]" : "text-left ml-[150px]"}`}>
                    <h3 className={`text-lg font-bold text-brand-primary mb-2 ${locale === "ar" ? "font-noto" : ""}`}>
                      {locale === "ar" ? "بيئة عمل محفزة" : "Stimulating Work Environment"}
                    </h3>
                    <p className={`text-gray-600 text-sm ${locale === "ar" ? "font-noto" : ""}`}>
                      {locale === "ar"
                        ? "توفر بيئة عمل مريحة تدعم الإبداع والابتكار"
                        : "Provides a comfortable work environment that supports creativity and innovation"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 4: Professional Team - SVG touching left and right edges */}
              <div className="bg-brand-light rounded-xl p-6 pt-4 h-[220px] overflow-hidden">
                <div className="flex flex-col justify-between h-full">
                  <div className="text-center">
                    <h3 className={`text-lg font-bold text-brand-primary mb-2 ${locale === "ar" ? "font-noto" : ""}`}>
                      {locale === "ar" ? "ثقافة فريق متميزة" : "Distinguished Team Culture"}
                    </h3>
                    <p className={`text-gray-600 text-sm ${locale === "ar" ? "font-noto" : ""}`}>
                      {locale === "ar"
                        ? "نعمل بروح الفريق ونعزز ثقافة النجاح الجماعي"
                        : "We work with team spirit and promote a culture of collective success"}
                    </p>
                  </div>
                  <div className="mx-[-24px] mt-2">
                    <Image
                      src="/images/Handshake.svg"
                      alt="Team culture"
                      width={300}
                      height={120}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vacant Jobs Section */}
      <div className="bg-brand-light py-16 rounded-[10px]">
        <div className="max-w-[calc(100%-1.5rem)] sm:max-w-[calc(100%-3rem)] md:max-w-[calc(100%-6rem)] lg:max-w-[calc(100%-10rem)] xl:max-w-[1300px] mx-auto">
          <div className={`${locale === "ar" ? "rtl" : ""}`}>
            {/* Section Title */}
            <h2
              className={`text-4xl sm:text-5xl font-bold text-brand-primary text-center mb-4 ${locale === "ar" ? "font-noto" : ""}`}
            >
              {locale === "ar" ? "الوظائف الشاغرة" : "Vacant Jobs"}
            </h2>

            {/* Subtitle */}
            <p className={`text-gray-600 text-center mb-8 ${locale === "ar" ? "font-noto" : ""}`}>
              {locale === "ar"
                ? "استكشف فرص العمل المتاحة وانضم إلى فريقنا اليوم"
                : "Explore available job opportunities and join our team today"}
            </p>

            {/* Job Categories */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {Object.keys(jobTitles).map((category) => {
                // All buttons use their active styles by default
                // If a button is clicked, only that button stays active
                const buttonStyle =
                  clickedCategory === null || clickedCategory === category
                    ? categoryActiveStyles[category]
                    : "bg-white text-brand-primary border border-brand-primary"

                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`px-8 py-3 rounded-[5px] font-medium ${buttonStyle} ${locale === "ar" ? "font-noto" : ""} transition-all duration-200 hover:shadow-md`}
                  >
                    {locale === "ar"
                      ? {
                          other: "أخرى",
                          sales: "المبيعات",
                          accounting: "المحاسبة",
                          marketing: "التسويق",
                        }[category]
                      : category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                )
              })}
            </div>

            {/* Job Application Form - Enhanced Premium Design */}
            <div className="bg-white rounded-[15px] p-8 max-w-4xl mx-auto shadow-xl border border-brand-primary/10">
              {/* Update the job selection header section to ensure proper right alignment */}
              <div className={`w-full ${locale === "ar" ? "text-right" : "text-left"} mb-8`}>
                <h3 className={`text-2xl font-bold text-brand-primary mb-2 ${locale === "ar" ? "font-noto" : ""}`}>
                  {activeCategory ? jobTitles[activeCategory] : locale === "ar" ? "اختر وظيفة" : "Select a job"}
                </h3>
                <p className={`text-gray-600 ${locale === "ar" ? "font-noto" : ""}`}>
                  {activeCategory
                    ? locale === "ar"
                      ? {
                          other: "أخرى",
                          sales: "المبيعات",
                          accounting: "المحاسبة",
                          marketing: "التسويق",
                        }[activeCategory]
                      : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)
                    : locale === "ar"
                      ? "الرجاء اختيار فئة وظيفية من الأعلى"
                      : "Please select a job category above"}
                </p>
              </div>

              {/* Success Message */}
              {submitSuccess && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6 relative">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm ${locale === "ar" ? "font-noto text-right" : ""}`}>
                        {locale === "ar"
                          ? "تم تقديم طلبك بنجاح! سنتواصل معك قريبًا."
                          : "Your application has been submitted successfully! We will contact you soon."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {submitError && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 relative">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm ${locale === "ar" ? "font-noto text-right" : ""}`}>{submitError}</p>
                    </div>
                  </div>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Update the input fields to add more space between icons and text */}
                {/* Name Field */}
                <div className="relative">
                  <label
                    className={`block text-sm font-medium text-brand-primary mb-1 ${locale === "ar" ? "font-noto text-right" : ""}`}
                  >
                    {locale === "ar" ? "الاسم" : "Name"}
                  </label>
                  <div
                    className={`flex ${locale === "ar" ? "flex-row-reverse" : ""} items-center bg-brand-light/50 rounded-[5px] p-3 border border-brand-primary/20 focus-within:border-brand-primary focus-within:ring-1 focus-within:ring-brand-primary transition-all duration-200`}
                  >
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={locale === "ar" ? "أدخل اسمك الكامل" : "Enter your full name"}
                      className={`bg-transparent border-none outline-none w-full placeholder-gray-500 text-gray-700 ${
                        locale === "ar"
                          ? "text-right font-noto placeholder:text-right placeholder:font-noto pr-0 pl-4"
                          : "pr-4"
                      }`}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 text-brand-primary ${locale === "ar" ? "ml-2" : "mr-2"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Phone Field */}
                <div className="relative">
                  <label
                    className={`block text-sm font-medium text-brand-primary mb-1 ${locale === "ar" ? "font-noto text-right" : ""}`}
                  >
                    {locale === "ar" ? "رقم الهاتف" : "Phone Number"}
                  </label>
                  <div
                    className={`flex ${locale === "ar" ? "flex-row-reverse" : ""} items-center bg-brand-light/50 rounded-[5px] p-3 border border-brand-primary/20 focus-within:border-brand-primary focus-within:ring-1 focus-within:ring-brand-primary transition-all duration-200`}
                  >
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder={locale === "ar" ? "أدخل رقم هاتفك" : "Enter your phone number"}
                      className={`bg-transparent border-none outline-none w-full placeholder-gray-500 text-gray-700 ${
                        locale === "ar"
                          ? "text-right font-noto placeholder:text-right placeholder:font-noto pr-0 pl-4"
                          : "pr-4"
                      }`}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 text-brand-primary ${locale === "ar" ? "ml-2" : "mr-2"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Email Field */}
                <div className="relative">
                  <label
                    className={`block text-sm font-medium text-brand-primary mb-1 ${locale === "ar" ? "font-noto text-right" : ""}`}
                  >
                    {locale === "ar" ? "البريد الإلكتروني" : "Email"}
                  </label>
                  <div
                    className={`flex ${locale === "ar" ? "flex-row-reverse" : ""} items-center bg-brand-light/50 rounded-[5px] p-3 border border-brand-primary/20 focus-within:border-brand-primary focus-within:ring-1 focus-within:ring-brand-primary transition-all duration-200`}
                  >
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={locale === "ar" ? "أدخل بريدك الإلكتروني" : "Enter your email address"}
                      className={`bg-transparent border-none outline-none w-full placeholder-gray-500 text-gray-700 ${
                        locale === "ar"
                          ? "text-right font-noto placeholder:text-right placeholder:font-noto pr-0 pl-4"
                          : "pr-4"
                      }`}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 text-brand-primary ${locale === "ar" ? "ml-2" : "mr-2"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                      \
                    </svg>
                  </div>
                </div>

                {/* Resume Upload */}
                <div className="relative">
                  <label
                    className={`block text-sm font-medium text-brand-primary mb-1 ${locale === "ar" ? "font-noto text-right" : ""}`}
                  >
                    {locale === "ar" ? "السيرة الذاتية" : "Resume"}
                  </label>
                  <div
                    className={`flex ${locale === "ar" ? "flex-row-reverse" : ""} items-center justify-between bg-brand-light/50 rounded-[5px] p-3 border border-brand-primary/20 hover:border-brand-primary cursor-pointer transition-all duration-200`}
                    onClick={handleUploadClick}
                  >
                    <div className={`flex items-center gap-3 ${locale === "ar" ? "flex-row-reverse" : ""}`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-brand-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      <span className={`text-sm text-gray-700 ${locale === "ar" ? "font-noto text-right" : ""}`}>
                        {selectedFile ? selectedFile.name : locale === "ar" ? "تحميل السيرة الذاتية" : "Upload Resume"}
                      </span>
                      {!selectedFile && <span className="text-xs text-gray-500">DOC, DOCX, PDF (5MB)</span>}
                    </div>
                    <span className={`text-brand-primary font-medium ${locale === "ar" ? "font-noto" : ""}`}>
                      {selectedFile ? (
                        <span
                          className={`text-green-600 flex items-center ${locale === "ar" ? "flex-row-reverse" : ""}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 ${locale === "ar" ? "ml-2" : "mr-2"}`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {locale === "ar" ? "تم التحميل" : "Uploaded"}
                        </span>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </span>

                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".doc,.docx,.pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className={`flex ${locale === "ar" ? "justify-end" : "justify-start"} mt-8`}>
                  <button
                    type="submit"
                    disabled={isSubmitting || !activeCategory}
                    className={`bg-brand-primary text-white px-8 py-3 rounded-[5px] hover:bg-brand-dark transition-colors relative shadow-lg ${
                      locale === "ar" ? "font-noto" : ""
                    } ${isSubmitting || !activeCategory ? "opacity-70 cursor-not-allowed" : "hover:shadow-xl"}`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="opacity-0">{locale === "ar" ? "تقديم الطلب" : "Submit Application"}</span>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg
                            className="animate-spin h-5 w-5 text-white"
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
                        </div>
                      </>
                    ) : locale === "ar" ? (
                      "تقديم الطلب"
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section - Updated to match the exact design with centered content */}
      <div className="bg-white py-16">
        <div className="max-w-[calc(100%-1.5rem)] sm:max-w-[calc(100%-3rem)] md:max-w-[calc(100%-6rem)] lg:max-w-[calc(100%-10rem)] xl:max-w-[1300px] mx-auto">
          <div className={`${locale === "ar" ? "rtl" : ""}`}>
            {/* Section Title */}
            <div className={`text-${locale === "ar" ? "right" : "left"} mb-8`}>
              <h2
                className={`text-4xl sm:text-5xl font-bold text-brand-primary mb-4 ${locale === "ar" ? "font-noto" : ""}`}
              >
                {locale === "ar" ? "الوظائف الشاغرة" : "Vacant Jobs"}
              </h2>
              <p className={`text-gray-600 ${locale === "ar" ? "font-noto" : ""}`}>
                {locale === "ar"
                  ? "استكشف فرص العمل المتاحة وانضم إلى فريقنا اليوم"
                  : "Explore available job opportunities and join our team today"}
              </p>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {locale === "ar" ? (
                // Arabic layout - About Us card on the right (fourth position in RTL)
                <>
                  {/* Team Member Cards - First 3 */}
                  {teamMembers.slice(0, 3).map((member) => (
                    <div key={member.id} className="flex flex-col items-center">
                      <div className="bg-gray-100 rounded-xl w-full aspect-square relative mb-2 overflow-hidden">
                        <Image
                          src={member.image || "/placeholder.svg"}
                          alt={member.nameAr}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col items-center">
                        <button className="bg-white border border-gray-300 rounded-full px-8 py-2 text-brand-primary font-noto">
                          {member.nameAr}
                        </button>
                        <p className="text-sm text-gray-600 font-noto mt-1">{member.titleAr}</p>
                      </div>
                    </div>
                  ))}

                  {/* About Us Card - Purple with social icons */}
                  <div className="bg-brand-primary rounded-xl p-6 text-white flex flex-col justify-between">
                    <div className="flex justify-center gap-4 mb-6">
                      <a href="#" className="text-white hover:text-gray-200 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5"
                        >
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                        </svg>
                      </a>
                      <a href="#" className="text-white hover:text-gray-200 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5"
                        >
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                      </a>
                      <a href="#" className="text-white hover:text-gray-200 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5"
                        >
                          <path d="M15 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 0v3m-7 4h14m-7-7v7"></path>
                        </svg>
                      </a>
                      <a href="#" className="text-white hover:text-gray-200 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5"
                        >
                          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                          <path d="m10 15 5-3-5-3z"></path>
                        </svg>
                      </a>
                      <a href="#" className="text-white hover:text-gray-200 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5"
                        >
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      </a>
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-noto leading-relaxed mb-8">
                        نحن شركة متميزة نقدم خدمة متميزة لعملائنا. تأسسنا في الرياض وبدأنا العمل في عام 2024 ولدينا
                        الاستعداد للتطوير المستمر. نسعى دائماً لتقديم أفضل خدمة ترضي عملائنا.
                      </p>
                    </div>

                    {/* About Us Button */}
                    <div className="flex justify-center">
                      <button className="bg-white text-brand-primary px-8 py-2 rounded-full text-sm font-medium font-noto">
                        من نحن
                      </button>
                    </div>
                  </div>

                  {/* Remaining team members */}
                  {teamMembers.slice(3, 7).map((member) => (
                    <div key={member.id} className="flex flex-col items-center">
                      <div className="bg-gray-100 rounded-xl w-full aspect-square relative mb-2 overflow-hidden">
                        <Image
                          src={member.image || "/placeholder.svg"}
                          alt={member.nameAr}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col items-center">
                        <button className="bg-white border border-gray-300 rounded-full px-8 py-2 text-brand-primary font-noto">
                          {member.nameAr}
                        </button>
                        <p className="text-sm text-gray-600 font-noto mt-1">{member.titleAr}</p>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                // English layout - About Us card on the left (first in LTR)
                <>
                  {/* About Us Card - Purple with social icons */}
                  <div className="bg-brand-primary rounded-xl p-6 text-white flex flex-col justify-between">
                    <div className="flex justify-center gap-4 mb-6">
                      <a href="#" className="text-white hover:text-gray-200 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5"
                        >
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                        </svg>
                      </a>
                      <a href="#" className="text-white hover:text-gray-200 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5"
                        >
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                      </a>
                      <a href="#" className="text-white hover:text-gray-200 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5"
                        >
                          <path d="M15 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 0v3m-7 4h14m-7-7v7"></path>
                        </svg>
                      </a>
                      <a href="#" className="text-white hover:text-gray-200 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5"
                        >
                          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                          <path d="m10 15 5-3-5-3z"></path>
                        </svg>
                      </a>
                      <a href="#" className="text-white hover:text-gray-200 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5"
                        >
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      </a>
                    </div>

                    <div className="text-center">
                      <p className="text-sm leading-relaxed mb-8">
                        We are a distinguished company providing excellent service to our customers. Founded in Riyadh,
                        we started operations in 2024 and are committed to continuous development. We always strive to
                        provide the best service that satisfies our customers.
                      </p>
                    </div>

                    {/* About Us Button */}
                    <div className="flex justify-center">
                      <button className="bg-white text-brand-primary px-8 py-2 rounded-full text-sm font-medium">
                        About Us
                      </button>
                    </div>
                  </div>

                  {/* First 3 team members */}
                  {teamMembers.slice(0, 3).map((member) => (
                    <div key={member.id} className="flex flex-col items-center">
                      <div className="bg-gray-100 rounded-xl w-full aspect-square relative mb-2 overflow-hidden">
                        <Image
                          src={member.image || "/placeholder.svg"}
                          alt={member.nameEn}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col items-center">
                        <button className="bg-white border border-gray-300 rounded-full px-8 py-2 text-brand-primary">
                          {member.nameEn}
                        </button>
                        <p className="text-sm text-gray-600 mt-1">{member.titleEn}</p>
                      </div>
                    </div>
                  ))}

                  {/* Remaining team members */}
                  {teamMembers.slice(3, 7).map((member) => (
                    <div key={member.id} className="flex flex-col items-center">
                      <div className="bg-gray-100 rounded-xl w-full aspect-square relative mb-2 overflow-hidden">
                        <Image
                          src={member.image || "/placeholder.svg"}
                          alt={member.nameEn}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col items-center">
                        <button className="bg-white border border-gray-300 rounded-full px-8 py-2 text-brand-primary">
                          {member.nameEn}
                        </button>
                        <p className="text-sm text-gray-600 mt-1">{member.titleEn}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Remove the WebkitBoxShadow style to fix the input background issue */}
      <style jsx global>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          transition: background-color 5000s ease-in-out 0s;
          -webkit-text-fill-color: #333 !important;
        }
      `}</style>
    </main>
  )
}

