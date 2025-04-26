import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer"

// Create styles with elegant design elements and normal text sizes
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
  },
  rtlPage: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    direction: "rtl",
  },
  header: {
    marginBottom: 20,
    backgroundColor: "#46194F",
    padding: 15,
    borderRadius: 6,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    textAlign: "center",
    color: "white",
    opacity: 0.9,
  },
  carComparison: {
    fontSize: 12,
    textAlign: "center",
    color: "white",
    marginTop: 5,
  },
  date: {
    fontSize: 9,
    textAlign: "right",
    color: "white",
    opacity: 0.8,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#46194F",
    marginBottom: 10,
    fontWeight: "bold",
    marginTop: 15,
    borderBottom: "1px solid #46194F",
    paddingBottom: 5,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#C6AECC",
    marginBottom: 15,
    borderRadius: 4,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableRowEven: {
    flexDirection: "row",
    backgroundColor: "#F9F6FA",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#46194F",
  },
  tableHeaderCell: {
    padding: 8,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    fontSize: 10,
  },
  tableCell: {
    padding: 8,
    textAlign: "center",
    borderRight: "1px solid #E8D9EE",
    borderBottom: "1px solid #E8D9EE",
    fontSize: 9,
  },
  tableCellFirst: {
    padding: 8,
    textAlign: "left",
    borderRight: "1px solid #E8D9EE",
    borderBottom: "1px solid #E8D9EE",
    fontWeight: "bold",
    color: "#46194F",
    fontSize: 9,
  },
  tableCellRtl: {
    padding: 8,
    textAlign: "center",
    borderLeft: "1px solid #E8D9EE",
    borderBottom: "1px solid #E8D9EE",
    fontSize: 9,
  },
  tableCellFirstRtl: {
    padding: 8,
    textAlign: "right",
    borderLeft: "1px solid #E8D9EE",
    borderBottom: "1px solid #E8D9EE",
    fontWeight: "bold",
    color: "#46194F",
    fontSize: 9,
  },
  carInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  carInfoBox: {
    flex: 1,
    marginHorizontal: 5,
    border: "1px solid #E8D9EE",
    borderRadius: 4,
  },
  carInfoHeader: {
    backgroundColor: "#46194F",
    padding: 8,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  carInfoContent: {
    padding: 10,
    backgroundColor: "#F9F6FA",
  },
  carName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  carBrand: {
    fontSize: 9,
    color: "white",
    opacity: 0.9,
    marginTop: 2,
  },
  carDetail: {
    fontSize: 9,
    marginBottom: 5,
    color: "#333",
  },
  priceBox: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 4,
    marginTop: 5,
    borderLeft: "3px solid #46194F",
  },
  priceTitle: {
    fontSize: 8,
    color: "#666",
  },
  priceValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#46194F",
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    fontSize: 8,
    color: "white",
    backgroundColor: "#8A2BE2",
    padding: 3,
    borderRadius: 8,
    textAlign: "center",
    width: 50,
  },
  summaryBox: {
    borderRadius: 4,
    padding: 12,
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: "#F9F6FA",
    border: "1px solid #E8D9EE",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    padding: 4,
    borderBottom: "1px solid #E8D9EE",
  },
  summaryLabel: {
    fontSize: 9,
    color: "#333",
    fontWeight: "medium",
  },
  summaryValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#46194F",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 8,
    color: "#666",
    padding: 10,
    borderTop: "1px solid #E8D9EE",
  },
  pageNumber: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    fontSize: 9,
    textAlign: "center",
    color: "#666",
  },
  filledCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#46194F",
    margin: "0 auto",
  },
  emptyCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#C6AECC",
    margin: "0 auto",
  },
  specValue: {
    backgroundColor: "#F0EBF1",
    padding: 3,
    borderRadius: 3,
    fontSize: 9,
  },
  // Add a wrapper to keep feature section together
  featureSection: {
    marginTop: 10,
    breakInside: "avoid",
    pageBreakInside: "avoid",
  },
})

// Helper function to get text based on locale
const getText = (textObj, currentLocale) => {
  if (!textObj) return ""
  return typeof textObj === "object" ? textObj[currentLocale] || textObj.en : textObj
}

// Helper function to get status text
const getStatusText = (status, isRTL) => {
  switch (status) {
    case "new":
      return isRTL ? "جديد" : "New"
    case "discount":
      return isRTL ? "خصم" : "Discount"
    case "unavailable":
      return isRTL ? "غير متوفر" : "Unavailable"
    default:
      return ""
  }
}

// Format feature name for display
const formatFeatureName = (feature, isRTL) => {
  if (isRTL) {
    return feature
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace("ExteriorFeatures", "ميزات خارجية")
      .replace("Interior", "داخلي")
      .replace("Exterior", "خارجي")
      .replace("Engine", "محرك")
      .replace("Safety", "سلامة")
      .replace("Technology", "تكنولوجيا")
      .replace("Entertainment", "ترفيه")
      .replace("Comfort", "راحة")
  } else {
    return feature
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace("ExteriorFeatures", "Exterior Features")
  }
}

// Create PDF Document
const CarComparisonPDF = ({ car1, car2, car3, currentLocale }) => {
  const isRTL = currentLocale === "ar"
  const hasThirdCar = !!car3

  // Calculate price-related values
  const highestPrice = Math.max(car1.cashPrice, car2.cashPrice, car3?.cashPrice || 0)
  const lowestPrice = Math.min(car1.cashPrice, car2.cashPrice, car3?.cashPrice || Number.POSITIVE_INFINITY)
  const priceDifference = highestPrice - lowestPrice

  // Get key specs for comparison
  const keySpecs = [
    { key: "engine", label: isRTL ? "المحرك" : "Engine" },
    { key: "transmission", label: isRTL ? "ناقل الحركة" : "Transmission" },
    { key: "fuelType", label: isRTL ? "الوقود" : "Fuel Type" },
    { key: "power", label: isRTL ? "القوة" : "Power" },
    { key: "seats", label: isRTL ? "المقاعد" : "Seats" },
    { key: "acceleration", label: isRTL ? "التسارع" : "Acceleration" },
  ]

  // Get a subset of features to ensure they fit on the first page
  const featureEntries = Object.entries(car1.features || {})
  const featuresFirstPage = featureEntries.slice(0, 8) // Limit features on first page

  return (
    <Document>
      <Page size="A4" style={isRTL ? styles.rtlPage : styles.page} wrap>
        {/* Clean Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{isRTL ? "مقارنة السيارات" : "Car Comparison"}</Text>
          <Text style={styles.subtitle}>
            {isRTL
              ? "تقرير مفصل لمساعدتك في اتخاذ القرار الأفضل"
              : "Detailed report to help you make the best decision"}
          </Text>
          <Text style={styles.carComparison}>
            {isRTL
              ? `${getText(car1.name, currentLocale)} • ${getText(car2.name, currentLocale)} ${hasThirdCar ? `• ${getText(car3.name, currentLocale)}` : ""}`
              : `${getText(car1.name, currentLocale)} • ${getText(car2.name, currentLocale)} ${hasThirdCar ? `• ${getText(car3.name, currentLocale)}` : ""}`}
          </Text>
          <Text style={styles.date}>{new Date().toLocaleDateString(currentLocale === "ar" ? "ar-SA" : "en-US")}</Text>
        </View>

        {/* Car Information Section */}
        <View style={styles.carInfoRow}>
          {/* Car 1 */}
          <View style={styles.carInfoBox}>
            <View style={styles.carInfoHeader}>
              <Text style={styles.carName}>{getText(car1.name, currentLocale)}</Text>
              <Text style={styles.carBrand}>{car1.brand}</Text>
              {car1.status && <Text style={styles.badge}>{getStatusText(car1.status, isRTL)}</Text>}
            </View>
            <View style={styles.carInfoContent}>
              <Text style={styles.carDetail}>
                {isRTL ? "الموديل: " : "Model: "} {getText(car1.modelYear, currentLocale)}
              </Text>
              <Text style={styles.carDetail}>
                {isRTL ? "المحرك: " : "Engine: "} {getText(car1.specs.engine, currentLocale)}
              </Text>
              <Text style={styles.carDetail}>
                {isRTL ? "ناقل الحركة: " : "Transmission: "} {getText(car1.specs.transmission, currentLocale)}
              </Text>
              <View style={styles.priceBox}>
                <Text style={styles.priceTitle}>{isRTL ? "سعر الكاش" : "Cash Price"}</Text>
                <Text style={styles.priceValue}>{car1.cashPrice.toLocaleString()}</Text>
              </View>
            </View>
          </View>

          {/* Car 2 */}
          <View style={styles.carInfoBox}>
            <View style={styles.carInfoHeader}>
              <Text style={styles.carName}>{getText(car2.name, currentLocale)}</Text>
              <Text style={styles.carBrand}>{car2.brand}</Text>
              {car2.status && <Text style={styles.badge}>{getStatusText(car2.status, isRTL)}</Text>}
            </View>
            <View style={styles.carInfoContent}>
              <Text style={styles.carDetail}>
                {isRTL ? "الموديل: " : "Model: "} {getText(car2.modelYear, currentLocale)}
              </Text>
              <Text style={styles.carDetail}>
                {isRTL ? "المحرك: " : "Engine: "} {getText(car2.specs.engine, currentLocale)}
              </Text>
              <Text style={styles.carDetail}>
                {isRTL ? "ناقل الحركة: " : "Transmission: "} {getText(car2.specs.transmission, currentLocale)}
              </Text>
              <View style={styles.priceBox}>
                <Text style={styles.priceTitle}>{isRTL ? "سعر الكاش" : "Cash Price"}</Text>
                <Text style={styles.priceValue}>{car2.cashPrice.toLocaleString()}</Text>
              </View>
            </View>
          </View>

          {/* Car 3 (if present) */}
          {hasThirdCar && (
            <View style={styles.carInfoBox}>
              <View style={styles.carInfoHeader}>
                <Text style={styles.carName}>{getText(car3.name, currentLocale)}</Text>
                <Text style={styles.carBrand}>{car3.brand}</Text>
                {car3.status && <Text style={styles.badge}>{getStatusText(car3.status, isRTL)}</Text>}
              </View>
              <View style={styles.carInfoContent}>
                <Text style={styles.carDetail}>
                  {isRTL ? "الموديل: " : "Model: "} {getText(car3.modelYear, currentLocale)}
                </Text>
                <Text style={styles.carDetail}>
                  {isRTL ? "المحرك: " : "Engine: "} {getText(car3.specs.engine, currentLocale)}
                </Text>
                <Text style={styles.carDetail}>
                  {isRTL ? "ناقل الحركة: " : "Transmission: "} {getText(car3.specs.transmission, currentLocale)}
                </Text>
                <View style={styles.priceBox}>
                  <Text style={styles.priceTitle}>{isRTL ? "سعر الكاش" : "Cash Price"}</Text>
                  <Text style={styles.priceValue}>{car3.cashPrice.toLocaleString()}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Price Summary */}
        <View style={styles.summaryBox}>
          <Text style={styles.sectionTitle}>{isRTL ? "ملخص المقارنة السعرية" : "Price Comparison Summary"}</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{isRTL ? "أعلى سعر" : "Highest Price"}</Text>
            <Text style={styles.summaryValue}>{highestPrice.toLocaleString()}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{isRTL ? "أقل سعر" : "Lowest Price"}</Text>
            <Text style={styles.summaryValue}>{lowestPrice.toLocaleString()}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{isRTL ? "الفرق السعري" : "Price Difference"}</Text>
            <Text style={styles.summaryValue}>{priceDifference.toLocaleString()}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{isRTL ? "نسبة الفرق" : "Difference Percentage"}</Text>
            <Text style={styles.summaryValue}>{Math.round((priceDifference / lowestPrice) * 100)}%</Text>
          </View>
        </View>

        {/* Specifications Section */}
        <Text style={styles.sectionTitle}>{isRTL ? "المواصفات الرئيسية" : "Key Specifications"}</Text>

        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <View style={{ width: "40%", ...styles.tableHeaderCell }}>
              <Text>{isRTL ? "المواصفات" : "Specification"}</Text>
            </View>
            <View style={{ width: hasThirdCar ? "20%" : "30%", ...styles.tableHeaderCell }}>
              <Text>{getText(car1.name, currentLocale)}</Text>
            </View>
            <View style={{ width: hasThirdCar ? "20%" : "30%", ...styles.tableHeaderCell }}>
              <Text>{getText(car2.name, currentLocale)}</Text>
            </View>
            {hasThirdCar && (
              <View style={{ width: "20%", ...styles.tableHeaderCell }}>
                <Text>{getText(car3.name, currentLocale)}</Text>
              </View>
            )}
          </View>

          {/* Table Rows */}
          {keySpecs.map((spec, index) => (
            <View key={spec.key} style={index % 2 === 0 ? styles.tableRow : styles.tableRowEven}>
              <View style={{ width: "40%", ...(isRTL ? styles.tableCellFirstRtl : styles.tableCellFirst) }}>
                <Text>{spec.label}</Text>
              </View>
              <View style={{ width: hasThirdCar ? "20%" : "30%", ...(isRTL ? styles.tableCellRtl : styles.tableCell) }}>
                <Text>{getText(car1.specs[spec.key], currentLocale) || "-"}</Text>
              </View>
              <View style={{ width: hasThirdCar ? "20%" : "30%", ...(isRTL ? styles.tableCellRtl : styles.tableCell) }}>
                <Text>{getText(car2.specs[spec.key], currentLocale) || "-"}</Text>
              </View>
              {hasThirdCar && (
                <View style={{ width: "20%", ...(isRTL ? styles.tableCellRtl : styles.tableCell) }}>
                  <Text>{getText(car3.specs[spec.key], currentLocale) || "-"}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Features Section - Wrapped in a View with pageBreakInside: avoid */}
        <View style={styles.featureSection}>
          <Text style={styles.sectionTitle}>{isRTL ? "الميزات" : "Features"}</Text>

          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <View style={{ width: "40%", ...styles.tableHeaderCell }}>
                <Text>{isRTL ? "الميزات" : "Feature"}</Text>
              </View>
              <View style={{ width: hasThirdCar ? "20%" : "30%", ...styles.tableHeaderCell }}>
                <Text>{getText(car1.name, currentLocale)}</Text>
              </View>
              <View style={{ width: hasThirdCar ? "20%" : "30%", ...styles.tableHeaderCell }}>
                <Text>{getText(car2.name, currentLocale)}</Text>
              </View>
              {hasThirdCar && (
                <View style={{ width: "20%", ...styles.tableHeaderCell }}>
                  <Text>{getText(car3.name, currentLocale)}</Text>
                </View>
              )}
            </View>

            {/* Table Rows for Features - Limited to first few features */}
            {featuresFirstPage.map(([feature, value], index) => (
              <View key={feature} style={index % 2 === 0 ? styles.tableRow : styles.tableRowEven}>
                <View style={{ width: "40%", ...(isRTL ? styles.tableCellFirstRtl : styles.tableCellFirst) }}>
                  <Text>{formatFeatureName(feature, isRTL)}</Text>
                </View>
                <View
                  style={{ width: hasThirdCar ? "20%" : "30%", ...(isRTL ? styles.tableCellRtl : styles.tableCell) }}
                >
                  <View style={car1.features[feature] ? styles.filledCircle : styles.emptyCircle} />
                </View>
                <View
                  style={{ width: hasThirdCar ? "20%" : "30%", ...(isRTL ? styles.tableCellRtl : styles.tableCell) }}
                >
                  <View style={car2.features[feature] ? styles.filledCircle : styles.emptyCircle} />
                </View>
                {hasThirdCar && (
                  <View style={{ width: "20%", ...(isRTL ? styles.tableCellRtl : styles.tableCell) }}>
                    <View style={car3.features[feature] ? styles.filledCircle : styles.emptyCircle} />
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          {isRTL
            ? "تم إنشاء هذا التقرير بواسطة تطبيق مقارنة السيارات"
            : "This report was generated by Car Comparison App"}
        </Text>

        {/* Page Number */}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
      </Page>

      {/* Second page for remaining features if needed */}
      {featureEntries.length > 8 && (
        <Page size="A4" style={isRTL ? styles.rtlPage : styles.page}>
          <Text style={styles.sectionTitle}>{isRTL ? "الميزات (تابع)" : "Features (Continued)"}</Text>

          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <View style={{ width: "40%", ...styles.tableHeaderCell }}>
                <Text>{isRTL ? "الميزات" : "Feature"}</Text>
              </View>
              <View style={{ width: hasThirdCar ? "20%" : "30%", ...styles.tableHeaderCell }}>
                <Text>{getText(car1.name, currentLocale)}</Text>
              </View>
              <View style={{ width: hasThirdCar ? "20%" : "30%", ...styles.tableHeaderCell }}>
                <Text>{getText(car2.name, currentLocale)}</Text>
              </View>
              {hasThirdCar && (
                <View style={{ width: "20%", ...styles.tableHeaderCell }}>
                  <Text>{getText(car3.name, currentLocale)}</Text>
                </View>
              )}
            </View>

            {/* Remaining features */}
            {featureEntries.slice(8).map(([feature, value], index) => (
              <View key={feature} style={index % 2 === 0 ? styles.tableRow : styles.tableRowEven}>
                <View style={{ width: "40%", ...(isRTL ? styles.tableCellFirstRtl : styles.tableCellFirst) }}>
                  <Text>{formatFeatureName(feature, isRTL)}</Text>
                </View>
                <View
                  style={{ width: hasThirdCar ? "20%" : "30%", ...(isRTL ? styles.tableCellRtl : styles.tableCell) }}
                >
                  <View style={car1.features[feature] ? styles.filledCircle : styles.emptyCircle} />
                </View>
                <View
                  style={{ width: hasThirdCar ? "20%" : "30%", ...(isRTL ? styles.tableCellRtl : styles.tableCell) }}
                >
                  <View style={car2.features[feature] ? styles.filledCircle : styles.emptyCircle} />
                </View>
                {hasThirdCar && (
                  <View style={{ width: "20%", ...(isRTL ? styles.tableCellRtl : styles.tableCell) }}>
                    <View style={car3.features[feature] ? styles.filledCircle : styles.emptyCircle} />
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            {isRTL
              ? "تم إنشاء هذا التقرير بواسطة تطبيق مقارنة السيارات"
              : "This report was generated by Car Comparison App"}
          </Text>

          {/* Page Number */}
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </Page>
      )}
    </Document>
  )
}

// Function to generate and download PDF
export const generatePDF = async (data, currentLocale) => {
  const { car1, car2, car3 } = data

  try {
    const blob = await pdf(
      <CarComparisonPDF car1={car1} car2={car2} car3={car3} currentLocale={currentLocale} />,
    ).toBlob()

    return blob
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw error
  }
}

export default CarComparisonPDF
