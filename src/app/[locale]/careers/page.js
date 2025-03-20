"use client"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useState, useRef } from "react"

export default function CareersPage() {
  const params = useParams()
  const locale = params?.locale || "ar"

  // Set to null to track which category is selected for the form
  const [activeCategory, setActiveCategory] = useState(null)

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

  const handleCategoryClick = (category) => {
    setActiveCategory(category)
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

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section with Light Purple Background */}
      <div className="bg-brand-light pt-20 pb-16">
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
      <div className="bg-brand-light py-16">
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
              {Object.keys(jobTitles).map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`px-8 py-3 rounded-[5px] font-medium ${
                    activeCategory === category
                      ? "bg-brand-primary text-white"
                      : "bg-white text-brand-primary border border-brand-primary"
                  } ${locale === "ar" ? "font-noto" : ""}`}
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
              ))}
            </div>

            {/* Job Application Form */}
            <div className="bg-[#F0E6F3] rounded-[10px] p-8 max-w-4xl mx-auto">
              <div className={`flex flex-col ${locale === "ar" ? "items-end" : "items-start"} mb-6`}>
                <h3 className={`text-2xl font-bold text-brand-primary mb-1 ${locale === "ar" ? "font-noto" : ""}`}>
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
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-[5px] mb-4 relative">
                  <span className={`block sm:inline ${locale === "ar" ? "font-noto text-right" : ""}`}>
                    {locale === "ar"
                      ? "تم تقديم طلبك بنجاح! سنتواصل معك قريبًا."
                      : "Your application has been submitted successfully! We will contact you soon."}
                  </span>
                </div>
              )}

              {/* Error Message */}
              {submitError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-[5px] mb-4 relative">
                  <span className={`block sm:inline ${locale === "ar" ? "font-noto text-right" : ""}`}>
                    {submitError}
                  </span>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Name Field */}
                <div className="flex items-center bg-brand-dark rounded-[5px] p-3">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={locale === "ar" ? "الاسم" : "Name"}
                    className={`bg-transparent border-none outline-none w-full placeholder-brand-primary/70 text-brand-primary ${
                      locale === "ar" ? "text-right font-noto placeholder:font-noto" : ""
                    }`}
                    style={{
                      WebkitBoxShadow: "0 0 0 1000px var(--brand-dark) inset",
                      WebkitTextFillColor: "var(--brand-primary)",
                    }}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-brand-primary"
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

                {/* Phone Field */}
                <div className="flex items-center bg-brand-dark rounded-[5px] p-3">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={locale === "ar" ? "رقم الهاتف" : "Phone Number"}
                    className={`bg-transparent border-none outline-none w-full placeholder-brand-primary/70 text-brand-primary ${
                      locale === "ar" ? "text-right font-noto placeholder:font-noto" : ""
                    }`}
                    style={{
                      WebkitBoxShadow: "0 0 0 1000px var(--brand-dark) inset",
                      WebkitTextFillColor: "var(--brand-primary)",
                    }}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-brand-primary"
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

                {/* Email Field */}
                <div className="flex items-center bg-brand-dark rounded-[5px] p-3">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={locale === "ar" ? "بريد الكتروني" : "Email"}
                    className={`bg-transparent border-none outline-none w-full placeholder-brand-primary/70 text-brand-primary ${
                      locale === "ar" ? "text-right font-noto placeholder:font-noto" : ""
                    }`}
                    style={{
                      WebkitBoxShadow: "0 0 0 1000px var(--brand-dark) inset",
                      WebkitTextFillColor: "var(--brand-primary)",
                    }}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-brand-primary"
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
                  </svg>
                </div>

                {/* Resume Upload */}
                <div
                  className="flex items-center justify-between bg-brand-dark rounded-[5px] p-3 cursor-pointer"
                  onClick={handleUploadClick}
                >
                  <div className={`flex items-center gap-2 ${locale === "ar" ? "order-2" : "order-1"}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-brand-primary"
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
                    <span className={`text-sm text-brand-primary ${locale === "ar" ? "font-noto" : ""}`}>
                      {selectedFile ? selectedFile.name : locale === "ar" ? "تحميل السيرة الذاتية" : "Upload Resume"}
                    </span>
                    {!selectedFile && <span className="text-xs text-gray-500">DOC, DOCX, PDF (5MB)</span>}
                  </div>
                  <span
                    className={`text-brand-primary font-medium ${locale === "ar" ? "order-1 font-noto" : "order-2"}`}
                  >
                    {locale === "ar" ? "السيرة الذاتية" : "Resume"}
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

                {/* Submit Button */}
                <div className={`flex ${locale === "ar" ? "justify-end" : "justify-start"} mt-6`}>
                  <button
                    type="submit"
                    disabled={isSubmitting || !activeCategory}
                    className={`bg-brand-primary text-white px-8 py-3 rounded-[5px] hover:bg-brand-primary transition-colors relative ${
                      locale === "ar" ? "font-noto" : ""
                    } ${isSubmitting || !activeCategory ? "opacity-80 cursor-not-allowed" : ""}`}
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

      {/* Add this style to override autofill background */}
      <style jsx global>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px var(--brand-dark) inset !important;
          -webkit-text-fill-color: var(--brand-primary) !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </main>
  )
}

