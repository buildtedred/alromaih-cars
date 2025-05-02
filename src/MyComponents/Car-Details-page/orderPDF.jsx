import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer"

// Register font
Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://fonts.gstatic.com/s/roboto/v29/KFOmCnqEu92Fr1Mu4mxP.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/roboto/v29/KFOlCnqEu92Fr1MmWUlfBBc9.ttf", fontWeight: 700 },
  ],
})

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 30,
    fontFamily: "Roboto",
  },
  header: {
    marginBottom: 20,
    borderBottom: "1px solid #46194F",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    color: "#46194F",
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 12,
    textAlign: "center",
    color: "#888",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#46194F",
    marginBottom: 10,
    borderBottom: "1px solid #eee",
    paddingBottom: 5,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    borderBottomStyle: "solid",
    paddingVertical: 5,
    marginBottom: 5,
  },
  label: {
    width: "40%",
    fontSize: 12,
    color: "#555",
  },
  value: {
    width: "60%",
    fontSize: 12,
    color: "#333",
  },
  carImage: {
    width: 250,
    height: 150,
    objectFit: "contain",
    alignSelf: "center",
    marginVertical: 15,
  },
  footer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    borderTopStyle: "solid",
    paddingTop: 10,
    fontSize: 10,
    textAlign: "center",
    color: "#999",
  },
  rtlText: {
    direction: "rtl",
    textAlign: "right",
  },
  ltrText: {
    direction: "ltr",
    textAlign: "left",
  },
})

export const OrderPDF = ({ formData, carDetails, carImage, isEnglish }) => {
  if (!formData) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>Error: Missing form data</Text>
        </Page>
      </Document>
    )
  }

  // Format date for display
  const formatDate = () => {
    const date = new Date()
    return date.toLocaleDateString(isEnglish ? "en-US" : "ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Get car model and brand
  const getModelName = () => {
    if (carDetails && carDetails.model && carDetails.model.name) {
      return carDetails.model.name
    }
    return carDetails && carDetails.model ? carDetails.model : "N/A"
  }

  const getBrandName = () => {
    if (carDetails && carDetails.brand && carDetails.brand.name) {
      return carDetails.brand.name
    }
    return carDetails && carDetails.brand ? carDetails.brand : "N/A"
  }

  // Format price
  const formatPrice = (price) => {
    if (!price) return "N/A"
    return new Intl.NumberFormat(isEnglish ? "en-US" : "ar-SA", {
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Text style based on language
  const textStyle = isEnglish ? styles.ltrText : styles.rtlText

  // Get price from car details
  const getPrice = () => {
    if (!carDetails) return "N/A"

    if (carDetails.price) {
      return formatPrice(carDetails.price)
    }

    if (carDetails.pricing && carDetails.pricing.base_price) {
      return formatPrice(carDetails.pricing.base_price)
    }

    return "N/A"
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{isEnglish ? "Car Purchase Order" : "طلب شراء سيارة"}</Text>
          <Text style={styles.subtitle}>
            {isEnglish ? `${getBrandName()} ${getModelName()}` : `${getModelName()} ${getBrandName()}`}
          </Text>
          <Text style={styles.orderDate}>
            {isEnglish ? "Order Date: " : "تاريخ الطلب: "}
            {formatDate()}
          </Text>
        </View>

        {/* Car Image */}
        {carImage && <Image src={carImage || "/placeholder.svg"} style={styles.carImage} />}

        {/* Car Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{isEnglish ? "Car Details" : "تفاصيل السيارة"}</Text>

          <View style={styles.row}>
            <Text style={[styles.label, textStyle]}>{isEnglish ? "Brand" : "الماركة"}</Text>
            <Text style={[styles.value, textStyle]}>{getBrandName()}</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, textStyle]}>{isEnglish ? "Model" : "الموديل"}</Text>
            <Text style={[styles.value, textStyle]}>{getModelName()}</Text>
          </View>

          {carDetails && carDetails.year && (
            <View style={styles.row}>
              <Text style={[styles.label, textStyle]}>{isEnglish ? "Year" : "السنة"}</Text>
              <Text style={[styles.value, textStyle]}>{carDetails.year}</Text>
            </View>
          )}

          <View style={styles.row}>
            <Text style={[styles.label, textStyle]}>{isEnglish ? "Price" : "السعر"}</Text>
            <Text style={[styles.value, textStyle]}>{getPrice()} SAR</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, textStyle]}>{isEnglish ? "Payment Method" : "طريقة الدفع"}</Text>
            <Text style={[styles.value, textStyle]}>
              {isEnglish
                ? formData.paymentMethod === "cash"
                  ? "Cash"
                  : "Finance"
                : formData.paymentMethod === "cash"
                  ? "كاش"
                  : "تمويل"}
            </Text>
          </View>
        </View>

        {/* Customer Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{isEnglish ? "Customer Details" : "بيانات العميل"}</Text>

          <View style={styles.row}>
            <Text style={[styles.label, textStyle]}>{isEnglish ? "Name" : "الاسم"}</Text>
            <Text style={[styles.value, textStyle]}>{formData.firstName}</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, textStyle]}>{isEnglish ? "National ID" : "رقم الهوية"}</Text>
            <Text style={[styles.value, textStyle]}>{formData.nationalId}</Text>
          </View>

          {formData.email && (
            <View style={styles.row}>
              <Text style={[styles.label, textStyle]}>{isEnglish ? "Email" : "البريد الإلكتروني"}</Text>
              <Text style={[styles.value, textStyle]}>{formData.email}</Text>
            </View>
          )}

          <View style={styles.row}>
            <Text style={[styles.label, textStyle]}>{isEnglish ? "Phone" : "رقم الهاتف"}</Text>
            <Text style={[styles.value, textStyle]}>{formData.phone}</Text>
          </View>

          {formData.paymentMethod === "finance" && formData.bankName && (
            <View style={styles.row}>
              <Text style={[styles.label, textStyle]}>{isEnglish ? "Bank" : "البنك"}</Text>
              <Text style={[styles.value, textStyle]}>{formData.bankName}</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            {isEnglish
              ? "This document is a confirmation of your car purchase order. Please keep it for your records."
              : "هذا المستند هو تأكيد لطلب شراء سيارتك. يرجى الاحتفاظ به لسجلاتك."}
          </Text>
        </View>
      </Page>
    </Document>
  )
}
