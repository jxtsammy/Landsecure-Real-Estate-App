"use client"

import { useState } from "react"
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, FlatList } from "react-native"
import {
  ChevronLeft,
  Share,
  Heart,
  Square,
  Navigation,
  Eye,
  Ruler,
  Mountain,
  Landmark,
  Wheat,
  Palmtree,
} from "lucide-react-native"
import MapView, { Marker, Polyline } from "react-native-maps"

const { width } = Dimensions.get("window")

// Using the property data from the shared file
const property = {
  id: "1",
  images: [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  ],
  type: "Residential Plot",
  size: "0.5",
  sizeUnit: "acre",
  dimensions: "100 x 200 ft",
  location: "Edgewood, NM 87015",
  price: "$95,000",
  favorite: false,
  coordinates: { lat: 35.0614, lng: -106.1911 },
  description:
    "Beautiful residential plot with stunning mountain views, perfect for building your dream home. This 0.5-acre property offers privacy and tranquility while still being just a short drive from amenities. The land has been surveyed and has utilities available at the lot line. Zoning allows for single-family homes with the possibility of a guest house. The gentle slope provides excellent drainage and potential for a walkout basement.",
  features: ["Mountain views", "Utilities available", "Paved road access", "No HOA restrictions", "Buildable lot"],
  zoning: "Residential R-1",
  utilities: "Water, electricity, and gas available at lot line",
  access: "Paved road access via Mountain View Drive",
}

// Create a property boundary polygon around the property location
const createPropertyBoundary = (center, size = 0.001) => {
  return [
    { latitude: center.lat - size, longitude: center.lng - size },
    { latitude: center.lat - size, longitude: center.lng + size },
    { latitude: center.lat + size, longitude: center.lng + size },
    { latitude: center.lat + size, longitude: center.lng - size },
    { latitude: center.lat - size, longitude: center.lng - size },
  ]
}

const PropertyDetails = ({navigation}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(property.favorite)

  // Property location coordinates
  const propertyLocation = {
    latitude: property.coordinates.lat,
    longitude: property.coordinates.lng,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }

  // Property boundary coordinates
  const boundarySize = 0.001 // Adjust based on property size
  const polylineCoordinates = createPropertyBoundary(property.coordinates, boundarySize)

  const renderImageItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.thumbnailContainer, activeImageIndex === index && styles.activeThumbnail]}
      onPress={() => setActiveImageIndex(index)}
    >
      <Image source={{ uri: item }} style={styles.thumbnailImage} />
    </TouchableOpacity>
  )

  // Get the appropriate icon based on property type
  const getPropertyTypeIcon = () => {
    const type = property.type.toLowerCase()
    if (type.includes("residential")) return <Landmark size={20} color="#666" />
    if (type.includes("agricultural")) return <Wheat size={20} color="#666" />
    if (type.includes("commercial")) return <Landmark size={20} color="#666" />
    if (type.includes("beachfront")) return <Palmtree size={20} color="#666" />
    if (type.includes("mountain")) return <Mountain size={20} color="#666" />
    return <Landmark size={20} color="#666" />
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Header with back button and share/favorite */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerActions}>
          </View>
        </View>

        {/* Main property image */}
        <FlatList
          data={property.images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => <Image source={{ uri: item }} style={styles.mainImage} resizeMode="cover" />}
          keyExtractor={(_, index) => index.toString()}
          onMomentumScrollEnd={(e) => {
            const contentOffset = e.nativeEvent.contentOffset.x
            const imageIndex = Math.round(contentOffset / width)
            setActiveImageIndex(imageIndex)
          }}
        />

        {/* Image pagination dots */}
        <View style={styles.paginationDots}>
          {property.images.map((_, index) => (
            <View
              key={index}
              style={[styles.paginationDot, index === activeImageIndex && styles.paginationDotActive]}
            />
          ))}
        </View>

        {/* Image thumbnails */}
        <FlatList
          data={property.images}
          renderItem={renderImageItem}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnailList}
        />

        {/* Price and tag */}
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{property.price}</Text>
          <View style={styles.tagContainer}>
            <Text style={styles.tagText}>Verified</Text>
          </View>
        </View>

        {/* Property basic info */}
        <View style={styles.basicInfoContainer}>
          <View style={styles.infoItem}>
            {getPropertyTypeIcon()}
            <Text style={styles.infoText}>{property.type}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ruler size={20} color="#666" />
            <Text style={styles.infoText}>
              {property.size} {property.sizeUnit}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Square size={20} color="#666" />
            <Text style={styles.infoText}>{property.dimensions}</Text>
          </View>
        </View>

        {/* Address */}
        <View style={styles.addressContainer}>
          <Text style={styles.addressTitle}>{property.location}</Text>
          <Text style={styles.addressSubtitle}>
            Coordinates: {property.coordinates.lat.toFixed(4)}, {property.coordinates.lng.toFixed(4)}
          </Text>
        </View>

        {/* Schedule Tour Button */}
        <TouchableOpacity style={styles.scheduleTourButton} onPress={() =>
              navigation.navigate("TourOptions", {
                property: property, // Pass the entire property object
              })
            }>
          <Text style={styles.scheduleTourText}>Schedule Tour</Text>
        </TouchableOpacity>

        {/* Map section with React Native Maps */}
        <View style={styles.mapContainer}>
          <MapView style={styles.mapView} initialRegion={propertyLocation} scrollEnabled={false} zoomEnabled={false}>
            <Marker
              coordinate={{
                latitude: propertyLocation.latitude,
                longitude: propertyLocation.longitude,
              }}
              title={property.type}
              description={property.location}
            />
            <Polyline
              coordinates={polylineCoordinates.map((coord) => ({
                latitude: coord.latitude,
                longitude: coord.longitude,
              }))}
              strokeColor="#4a80f5"
              strokeWidth={3}
              lineDashPattern={[1]}
            />
          </MapView>
          <View style={styles.mapButtonsContainer}>
            <TouchableOpacity style={styles.mapButton}>
              <Navigation size={16} color="#666" style={styles.buttonIcon} />
              <Text style={styles.mapButtonText}>Directions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mapButton}>
              <Eye size={16} color="#666" style={styles.buttonIcon} />
              <Text style={styles.mapButtonText}>Street View</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{property.description}</Text>
        </View>

        {/* Features */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresList}>
            {property.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureBullet} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Property Details */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Property Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Zoning</Text>
            <Text style={styles.detailValue}>{property.zoning}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Utilities</Text>
            <Text style={styles.detailValue}>{property.utilities}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Access</Text>
            <Text style={styles.detailValue}>{property.access}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom price section - Fixed at bottom */}
      <View style={styles.bottomPriceContainer}>
        <View>
          <Text style={styles.bottomPrice}>{property.price}</Text>
          <Text style={styles.priceNote}>
            {property.size} {property.sizeUnit} • {property.dimensions}
          </Text>
        </View>
        <TouchableOpacity style={styles.requestInfoButton} onPress={() => navigation.navigate('Chats')}>
          <Text style={styles.requestInfoText}>Chat Owner</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingBottom: 80, // Add padding to account for the floating price container
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    position: "absolute",
    top: 40, // Moved down from the top
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row",
  },
  mainImage: {
    width: width,
    height: 300,
  },
  paginationDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
    marginHorizontal: 3,
  },
  paginationDotActive: {
    backgroundColor: "#088a6a",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  thumbnailList: {
    padding: 8,
  },
  thumbnailContainer: {
    marginRight: 8,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  activeThumbnail: {
    borderColor: "#4a80f5",
  },
  thumbnailImage: {
    width: 60,
    height: 60,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
  },
  tagContainer: {
    backgroundColor: "#088a6a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  tagText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
  },
  basicInfoContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  infoText: {
    marginLeft: 4,
    color: "#666",
    fontSize: 14,
  },
  addressContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  addressSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  scheduleTourButton: {
    backgroundColor: "#000",
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  scheduleTourText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  mapContainer: {
    marginTop: 24,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  mapView: {
    width: "100%",
    height: 180,
  },
  mapButtonsContainer: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#f5f5f5",
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
    backgroundColor: "white",
  },
  buttonIcon: {
    marginRight: 6,
  },
  mapButtonText: {
    fontSize: 14,
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#444",
  },
  featuresList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4a80f5",
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: "#444",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  detailLabel: {
    width: 100,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: "#444",
  },
  bottomPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    paddingBottom: 30
  },
  bottomPrice: {
    fontSize: 20,
    fontWeight: "bold",
  },
  priceNote: {
    fontSize: 12,
    color: "#666",
  },
  requestInfoButton: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  requestInfoText: {
    fontWeight: "600",
    color: "#fff"
  },
})

export default PropertyDetails