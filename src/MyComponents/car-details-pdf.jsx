import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"

const createStyles = (isRTL) =>
  StyleSheet.create({
    page: {
      backgroundColor: "#f8f8f8",
      padding: 30,
      fontFamily: "Helvetica",
      direction: isRTL ? "rtl" : "ltr",
    },
    header: {
      flexDirection: "row",
      marginBottom: 30,
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "2 solid #71308A",
      paddingBottom: 10,
    },
    logoSection: {
      width: "40%",
    },
    logo: {
      width: 150,
      height: 50,
    },
    dateQR: {
      width: "40%",
      alignItems: isRTL ? "flex-start" : "flex-end",
    },
    carImageSection: {
      marginBottom: 30,
      alignItems: "center",
    },
    carImage: {
      width: "90%",
      height: 250,
      objectFit: "contain",
    },
    carInfo: {
      marginBottom: 30,
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
      boxShadow: "0 2 4 rgba(0, 0, 0, 0.1)",
    },
    carName: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
      color: "#71308A",
    },
    brandName: {
      fontSize: 18,
      marginBottom: 10,
      color: "#444",
    },
    priceInfo: {
      fontSize: 16,
      color: "#666",
      marginBottom: 5,
    },
    sectionTitle: {
      backgroundColor: "#71308A",
      color: "white",
      padding: 10,
      fontSize: 18,
      marginBottom: 15,
      textAlign: isRTL ? "right" : "left",
      borderRadius: 5,
    },
    specificationGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 30,
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
      boxShadow: "0 2 4 rgba(0, 0, 0, 0.1)",
    },
    specColumn: {
      width: "50%",
      marginBottom: 20,
      paddingRight: 15,
    },
    specGroup: {
      marginBottom: 15,
    },
    specGroupTitle: {
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 8,
      textAlign: isRTL ? "right" : "left",
      color: "#71308A",
    },
    specRow: {
      flexDirection: "row",
      marginBottom: 5,
      fontSize: 12,
      justifyContent: "space-between",
    },
    specLabel: {
      width: "60%",
      color: "#444",
      textAlign: isRTL ? "right" : "left",
    },
    specValue: {
      width: "40%",
      color: "#000",
      textAlign: isRTL ? "right" : "left",
      fontWeight: "bold",
    },
    footer: {
      position: "absolute",
      bottom: 30,
      left: 30,
      right: 30,
      fontSize: 10,
      textAlign: "center",
      color: "#666",
      borderTop: "1 solid #71308A",
      paddingTop: 10,
    },
  })

const translations = {
  en: {
    date: "Date",
    price: "Price",
    priceAfterVAT: "Price after VAT",
    specifications: "Specifications",
    features: "Features",
    disclaimer: "All prices are subject to change • Scan QR code for more details",
    sar: "SAR",
    available: "Available",
    notAvailable: "Not Available",
    yearOfManufacture: "Year of Manufacture",
    seatingCapacity: "Seating Capacity",
    fuelType: "Fuel Type",
    transmission: "Transmission",
    condition: "Condition",
  },
  ar: {
    date: "التاريخ",
    price: "السعر",
    priceAfterVAT: "السعر شامل الضريبة",
    specifications: "المواصفات",
    features: "المميزات",
    disclaimer: "جميع الأسعار قابلة للتغيير • امسح رمز QR لمزيد من التفاصيل",
    sar: "ريال",
    available: "متوفر",
    notAvailable: "غير متوفر",
    yearOfManufacture: "سنة الصنع",
    seatingCapacity: "عدد المقاعد",
    fuelType: "نوع الوقود",
    transmission: "ناقل الحركة",
    condition: "الحالة",
  },
}

const SpecificationRow = ({ label, value, styles }) => (
  <View style={styles.specRow}>
    <Text style={styles.specLabel}>• {label}</Text>
    <Text style={styles.specValue}>{value || "-"}</Text>
  </View>
)

const CarDetailsPDF = ({ carDetails, brandDetails, locale = "ar" }) => {
  const isRTL = locale === "ar"
  const styles = createStyles(isRTL)
  const t = translations[locale]

  const formatDate = (date) => {
    return new Date().toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")
  }

  const formatPrice = (price) => {
    return price ? `${price.toLocaleString(locale === "ar" ? "ar-SA" : "en-US")} ${t.sar}` : "-"
  }

  const getFeatureValue = (feature) => {
    if (feature === true) return t.available
    if (feature === false) return t.notAvailable
    return feature || "-"
  }

  console.log("PDF Component Image URL:", carDetails.image_url)
  console.log("Rendering PDF with image URL:", carDetails.image_url)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <Image src={{ uri: "/logo.png" || "/placeholder.svg" }} style={styles.logo} />
          </View>
          <View style={styles.dateQR}>
            <Text>
              {t.date}: {formatDate(new Date())}
            </Text>
          </View>
        </View>

        {/* Car Image */}
        <View style={styles.carImageSection}>
          {carDetails.image_url && <Image src={carDetails.image_url || "/placeholder.svg"} style={styles.carImage} />}
        </View>

        {/* Car Info */}
        <View style={styles.carInfo}>
          <Text style={styles.carName}>{carDetails?.name?.[locale]?.name || "-"}</Text>
          <Text style={styles.brandName}>{brandDetails?.name?.[locale]?.name || "-"}</Text>
          <Text style={styles.priceInfo}>
            {t.price}: {formatPrice(carDetails?.price)}
          </Text>
          <Text style={styles.priceInfo}>
            {t.priceAfterVAT}: {formatPrice(carDetails?.price * 1.15)}
          </Text>
        </View>

        {/* Specifications */}
        <View>
          <Text style={styles.sectionTitle}>{t.specifications}</Text>
          <View style={styles.specificationGrid}>
            <View style={styles.specColumn}>
              <SpecificationRow label={t.yearOfManufacture} value={carDetails?.year_of_manufacture} styles={styles} />
              <SpecificationRow label={t.seatingCapacity} value={carDetails?.seating_capacity} styles={styles} />
              <SpecificationRow
                label={t.fuelType}
                value={carDetails?.vehicle_fuel_types?.[0]?.fuel_type?.[locale]}
                styles={styles}
              />
            </View>
            <View style={styles.specColumn}>
              <SpecificationRow
                label={t.transmission}
                value={carDetails?.name?.[locale]?.transmission}
                styles={styles}
              />
              <SpecificationRow label={t.condition} value={carDetails?.name?.[locale]?.condition} styles={styles} />
            </View>
          </View>
        </View>

        {/* Additional Specifications */}
        {carDetails?.specifications?.map((spec, index) => (
          <View key={index}>
            <Text style={styles.sectionTitle}>{spec[locale]?.name}</Text>
            <View style={styles.specificationGrid}>
              {spec[locale]?.values?.map((value, valueIndex) => (
                <View key={valueIndex} style={styles.specColumn}>
                  <SpecificationRow label={value} value={t.available} styles={styles} />
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>{t.disclaimer}</Text>
        </View>
      </Page>
    </Document>
  )
}

export default CarDetailsPDF

