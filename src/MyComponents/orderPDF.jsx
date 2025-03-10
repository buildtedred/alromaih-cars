"use client"
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer"

// Register custom fonts
Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf", fontWeight: 300 },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 500,
    },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf", fontWeight: 700 },
  ],
})

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 30,
    fontFamily: "Roboto",
  },
  header: {
    marginBottom: 20,
    borderBottom: "1 solid #71308A",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    color: "#71308A",
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginTop: 5,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  carInfo: {
    flexDirection: "row",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 150,
    objectFit: "contain",
  },
  carDetails: {
    marginLeft: 20,
    flex: 1,
  },
  carName: {
    fontSize: 18,
    fontWeight: 500,
    color: "#71308A",
    marginBottom: 5,
  },
  infoGroup: {
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: "#333",
    marginBottom: 5,
  },
  infoContent: {
    fontSize: 12,
    color: "#555",
  },
  boldText: {
    fontWeight: 500,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    color: "#888",
    borderTop: "1 solid #ddd",
    paddingTop: 10,
  },
})

export const OrderPDF = ({ formData, car_Details }) => {
  // Get model name
  const getModelName = () => {
    if (car_Details?.model?.name) {
      return car_Details.model.name
    }
    return car_Details?.model || "N/A"
  }

  // Get brand name
  const getBrandName = () => {
    if (car_Details?.brand?.name) {
      return car_Details.brand.name
    }
    return car_Details?.brand || ""
  }

  // Format price
  const formatPrice = (price) => {
    if (!price) return "N/A"
    const currency = car_Details?.pricing?.currency || "USD"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Order Summary</Text>
          <Text style={styles.subtitle}>Thank you for your interest in our vehicles</Text>
        </View>

        <View style={styles.carInfo}>
          <Image src={car_Details?.image || "/placeholder.svg?height=150&width=200"} style={styles.image} />
          <View style={styles.carDetails}>
            <Text style={styles.carName}>
              {getBrandName()} {getModelName()}
            </Text>
            <Text style={styles.infoContent}>Year: {car_Details?.year || car_Details?.manufacture || "N/A"}</Text>
            <Text style={styles.infoContent}>
              Fuel Type: {car_Details?.fuelType || car_Details?.specifications?.fuel_type || "N/A"}
            </Text>
            <Text style={styles.infoContent}>Seating Capacity: {car_Details?.seat || "N/A"}</Text>
            <Text style={styles.infoContent}>
              Price:{" "}
              {car_Details?.pricing?.base_price
                ? formatPrice(car_Details.pricing.base_price)
                : formatPrice(car_Details?.price)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.infoGroup}>
            <Text style={styles.infoTitle}>Buyer Information</Text>
            <Text style={styles.infoContent}>
              <Text style={styles.boldText}>Name:</Text> {`${formData.firstName} ${formData.lastName}`.trim()}
            </Text>
            <Text style={styles.infoContent}>
              <Text style={styles.boldText}>Type:</Text> {formData.type}
            </Text>
            <Text style={styles.infoContent}>
              <Text style={styles.boldText}>Email:</Text> {formData.email}
            </Text>
            <Text style={styles.infoContent}>
              <Text style={styles.boldText}>Phone:</Text> {formData.phone}{" "}
              {formData.hasWhatsapp && "(WhatsApp available)"}
            </Text>
            <Text style={styles.infoContent}>
              <Text style={styles.boldText}>City:</Text> {formData.city}
            </Text>
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.infoTitle}>Visit Details</Text>
            <Text style={styles.infoContent}>
              <Text style={styles.boldText}>Date:</Text> {formData.visitDate}
            </Text>
            <Text style={styles.infoContent}>
              <Text style={styles.boldText}>Time:</Text> {formData.visitTime}
            </Text>
          </View>

          {formData.note && (
            <View style={styles.infoGroup}>
              <Text style={styles.infoTitle}>Additional Notes</Text>
              <Text style={styles.infoContent}>{formData.note}</Text>
            </View>
          )}
        </View>

        <Text style={styles.footer}>
          This document is automatically generated and serves as a confirmation of your interest in the vehicle.
        </Text>
      </Page>
    </Document>
  )
}

