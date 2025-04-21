"use client"

import { useEffect, useRef } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
} from "react-native"
import { ArrowLeft, X, Landmark, Ruler, MapPin } from "lucide-react-native"
import { useNavigation } from '@react-navigation/native'

const { width } = Dimensions.get("window")

const TourConfirmationScreen = ({ navigation }) => {
  // Dummy data for the property and tour details
  const propertyDetails = {
    id: "123",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    price: 195000,
    size: 2.5,
    sizeUnit: "acres",
    dimensions: "220 x 450 ft",
  }

  const tourDetails = {
    fullName: "Kristin Watson",
    phoneNumber: "(684) 555-0102",
    date: {
      day: 15,
      month: "Sep",
      year: 2023,
    },
    time: "11:00 AM",
  }

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  // Format price with commas
  const formatPrice = (price) => {
    return "$" + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  // Format date
  const formatDate = (dateObj) => {
    if (!dateObj) return ""
    return `${dateObj.day} ${dateObj.month} ${dateObj.year}`
  }

  const handleScheduleTour = () => {
    // Navigate to confirmation or submit the tour request
    console.log("Land viewing scheduled!")
    alert("Land viewing successfully scheduled!")
    navigation.navigate("BottomNav")
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <X size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>Review land viewing details</Text>

      {/* Property Card */}
      <View style={styles.propertyCard}>
        <Image source={{ uri: propertyDetails.image }} style={styles.propertyImage} resizeMode="cover" />

        <View style={styles.propertyDetails}>
          <Text style={styles.propertyPrice}>{formatPrice(propertyDetails.price)}</Text>

          <View style={styles.propertyFeatures}>
            <View style={styles.featureItem}>
              <Landmark size={16} color="#005045" />
              <Text style={styles.featureText}>
                {propertyDetails.size} {propertyDetails.sizeUnit}
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Ruler size={16} color="#005045" />
              <Text style={styles.featureText}>{propertyDetails.dimensions}</Text>
            </View>

            <View style={styles.featureItem}>
              <MapPin size={16} color="#005045" />
              <Text style={styles.featureText}>Land Plot</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tour Details */}
      <Animated.View
        style={[
          styles.tourDetailsCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Date & time</Text>
          <Text style={styles.detailValue}>
            {formatDate(tourDetails.date)} - {tourDetails.time}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Full Name</Text>
          <Text style={styles.detailValue}>{tourDetails.fullName}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Phone Number</Text>
          <Text style={styles.detailValue}>{tourDetails.phoneNumber}</Text>
        </View>
      </Animated.View>

      {/* Schedule Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.scheduleButton} onPress={handleScheduleTour}>
          <Text style={styles.scheduleButtonText}>Schedule Land Viewing</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e1decc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginBottom: 24,
    color: "#000",
  },
  propertyCard: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  propertyImage: {
    width: "100%",
    height: 200,
  },
  propertyDetails: {
    padding: 16,
  },
  propertyPrice: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  propertyFeatures: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  featureText: {
    marginLeft: 4,
    color: "#005045",
    fontWeight: "500",
  },
  tourDetailsCard: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  detailItem: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginTop: "auto",
    paddingBottom: 32,
  },
  scheduleButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  scheduleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default TourConfirmationScreen