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
    engine: "Engine",
    horsepower: "Horsepower",
    torque: "Torque",
    drivetrain: "Drivetrain",
    topSpeed: "Top Speed",
    acceleration: "Acceleration",
    fuelEfficiency: "Fuel Efficiency",
    fuelTankCapacity: "Fuel Tank Capacity",
    dimensions: "Dimensions",
    weight: "Weight",
    cargoCapacity: "Cargo Capacity",
    exterior: "Exterior Features",
    interior: "Interior Features",
    safety: "Safety Features",
    technology: "Technology Features",
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
    engine: "المحرك",
    horsepower: "القوة الحصانية",
    torque: "العزم",
    drivetrain: "نظام الدفع",
    topSpeed: "السرعة القصوى",
    acceleration: "التسارع",
    fuelEfficiency: "كفاءة الوقود",
    fuelTankCapacity: "سعة خزان الوقود",
    dimensions: "الأبعاد",
    weight: "الوزن",
    cargoCapacity: "سعة الحمولة",
    exterior: "المميزات الخارجية",
    interior: "المميزات الداخلية",
    safety: "ميزات الأمان",
    technology: "المميزات التكنولوجية",
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

  const formatDate = () => {
    return new Date().toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")
  }

  const formatPrice = (price) => {
    if (!price) return "-"
    const currency = carDetails?.pricing?.currency || "USD"
    return `${Number(price).toLocaleString(locale === "ar" ? "ar-SA" : "en-US")} ${currency === "USD" ? t.sar : currency}`
  }

  const getFeatureValue = (feature) => {
    if (feature === true) return t.available
    if (feature === false) return t.notAvailable
    return feature || "-"
  }

  // Get model name
  const getModelName = () => {
    if (carDetails?.model?.name) {
      return carDetails.model.name
    }
    return carDetails?.model || "N/A"
  }

  // Get brand name
  const getBrandName = () => {
    if (carDetails?.brand?.name) {
      return carDetails.brand.name
    }
    return carDetails?.brand || ""
  }

  // Get price
  const getPrice = () => {
    if (carDetails?.pricing?.base_price) {
      return carDetails.pricing.base_price
    }
    return carDetails?.price || 0
  }

  // Get price after VAT
  const getPriceAfterVAT = () => {
    const basePrice = getPrice()
    return basePrice * 1.15 // Assuming 15% VAT
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <Image src="/placeholder.svg?height=50&width=150" style={styles.logo} />
          </View>
          <View style={styles.dateQR}>
            <Text>
              {t.date}: {formatDate()}
            </Text>
          </View>
        </View>

        {/* Car Image */}
        <View style={styles.carImageSection}>
          <Image src={carDetails.image || "/placeholder.svg?height=250&width=400"} style={styles.carImage} />
        </View>

        {/* Car Info */}
        <View style={styles.carInfo}>
          <Text style={styles.carName}>{getModelName()}</Text>
          <Text style={styles.brandName}>{getBrandName()}</Text>
          <Text style={styles.priceInfo}>
            {t.price}: {formatPrice(getPrice())}
          </Text>
          <Text style={styles.priceInfo}>
            {t.priceAfterVAT}: {formatPrice(getPriceAfterVAT())}
          </Text>
        </View>

        {/* Basic Specifications */}
        <View>
          <Text style={styles.sectionTitle}>{t.specifications}</Text>
          <View style={styles.specificationGrid}>
            <View style={styles.specColumn}>
              <SpecificationRow
                label={t.yearOfManufacture}
                value={carDetails?.year || carDetails?.manufacture}
                styles={styles}
              />
              <SpecificationRow label={t.seatingCapacity} value={carDetails?.seat} styles={styles} />
              <SpecificationRow
                label={t.fuelType}
                value={carDetails?.fuelType || carDetails?.specifications?.fuel_type}
                styles={styles}
              />
              <SpecificationRow label={t.transmission} value={carDetails?.transmission} styles={styles} />
              <SpecificationRow label={t.condition} value={carDetails?.condition} styles={styles} />
            </View>
            <View style={styles.specColumn}>
              <SpecificationRow label={t.engine} value={carDetails?.specifications?.engine} styles={styles} />
              <SpecificationRow label={t.horsepower} value={carDetails?.specifications?.horsepower} styles={styles} />
              <SpecificationRow label={t.torque} value={carDetails?.specifications?.torque} styles={styles} />
              <SpecificationRow
                label={t.fuelTankCapacity}
                value={
                  carDetails?.specifications?.fuel_tank_capacity
                    ? `${carDetails.specifications.fuel_tank_capacity}L`
                    : "-"
                }
                styles={styles}
              />
              <SpecificationRow
                label={t.drivetrain}
                value={carDetails?.specifications?.drivetrain || carDetails?.drive_type}
                styles={styles}
              />
            </View>
          </View>
        </View>

        {/* Features */}
        {carDetails?.features && (
          <>
            {/* Exterior Features */}
            {carDetails.features.exterior && carDetails.features.exterior.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>{t.exterior}</Text>
                <View style={styles.specificationGrid}>
                  {carDetails.features.exterior.map((feature, index) => (
                    <View key={index} style={styles.specColumn}>
                      <SpecificationRow label={feature} value={t.available} styles={styles} />
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Interior Features */}
            {carDetails.features.interior && carDetails.features.interior.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>{t.interior}</Text>
                <View style={styles.specificationGrid}>
                  {carDetails.features.interior.map((feature, index) => (
                    <View key={index} style={styles.specColumn}>
                      <SpecificationRow label={feature} value={t.available} styles={styles} />
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Safety Features */}
            {carDetails.features.safety && carDetails.features.safety.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>{t.safety}</Text>
                <View style={styles.specificationGrid}>
                  {carDetails.features.safety.map((feature, index) => (
                    <View key={index} style={styles.specColumn}>
                      <SpecificationRow label={feature} value={t.available} styles={styles} />
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Technology Features */}
            {carDetails.features.technology && carDetails.features.technology.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>{t.technology}</Text>
                <View style={styles.specificationGrid}>
                  {carDetails.features.technology.map((feature, index) => (
                    <View key={index} style={styles.specColumn}>
                      <SpecificationRow label={feature} value={t.available} styles={styles} />
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>{t.disclaimer}</Text>
        </View>
      </Page>
    </Document>
  )
}

export default CarDetailsPDF

