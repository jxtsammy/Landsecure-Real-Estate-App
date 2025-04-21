"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  Modal,
  Animated,
  Easing,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Search, MapPin, Trees, Mountain, Landmark, Wheat, Palmtree, Ruler, X } from "lucide-react-native"
import { StatusBar } from "react-native"
import { useNavigation } from "@react-navigation/native"

const { width } = Dimensions.get("window")

// Updated land data with coordinates
// Updated properties array with enhanced descriptions

const properties = [
  {
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
  },
  {
    id: "2",
    images: [
      "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1475&q=80",
    ],
    type: "Agricultural Land",
    size: "5",
    sizeUnit: "acres",
    dimensions: "450 x 480 ft",
    location: "Santa Fe, NM 87501",
    price: "$175,000",
    favorite: false,
    coordinates: { lat: 35.687, lng: -105.9378 },
    description:
      "Fertile agricultural land with valuable water rights, ideal for organic farming or vineyard development. This 5-acre parcel features rich, loamy soil with excellent drainage and has been previously used for hay production. The property includes irrigation rights from the Santa Fe River with an established irrigation system already in place. The land is relatively flat with a slight southern slope, providing optimal sun exposure for crops. A small storage shed is included on the property.",
    features: [
      "Water rights included",
      "Irrigation system in place",
      "Rich, fertile soil",
      "Southern exposure",
      "Storage shed included",
    ],
    zoning: "Agricultural A-1",
    utilities: "Well water and electricity on property",
    access: "Gravel road access with county maintenance",
  },
  {
    id: "3",
    images: [
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    ],
    type: "Commercial Plot",
    size: "1.2",
    sizeUnit: "hectares",
    dimensions: "120 x 400 m",
    location: "Albuquerque, NM 87102",
    price: "$385,000",
    favorite: false,
    coordinates: { lat: 35.0844, lng: -106.6504 },
    description:
      "Prime commercial plot in a high-traffic area, ideal for retail, office, or mixed-use development. This 1.2-hectare property is strategically located near the intersection of two major highways with excellent visibility and easy access. The site is fully entitled with C-2 zoning allowing for a wide range of commercial uses. All utilities are available at the property line, and the site has been graded and is ready for development. Traffic count exceeds 25,000 vehicles per day, making this an excellent location for businesses seeking high visibility.",
    features: [
      "High traffic location",
      "Corner lot with multiple access points",
      "All utilities available",
      "Graded and ready for development",
      "No flood zone",
    ],
    zoning: "Commercial C-2",
    utilities: "All utilities available at property line",
    access: "Multiple access points from main road and side street",
  },
  {
    id: "4",
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    ],
    type: "Beachfront Land",
    size: "0.75",
    sizeUnit: "acres",
    dimensions: "150 x 220 ft",
    location: "Rio Rancho, NM 87124",
    price: "$525,000",
    favorite: true,
    coordinates: { lat: 35.2328, lng: -106.6243 },
    description:
      "Stunning beachfront property with panoramic water views and private beach access. This rare 0.75-acre waterfront lot offers 150 feet of pristine shoreline on the Rio Grande with breathtaking sunset views. The property is elevated, providing protection from flooding while maintaining easy access to the water. This is one of the last available waterfront lots in this exclusive area. The property has been perc tested and is suitable for a septic system. Utilities are available at the road, and the lot is ready for your dream home construction.",
    features: [
      "150 feet of waterfront",
      "Private beach access",
      "Panoramic water views",
      "Elevated building site",
      "Perc tested for septic",
    ],
    zoning: "Residential R-1",
    utilities: "Water and electricity available at road",
    access: "Private road access with recorded easement",
  },
  {
    id: "5",
    images: [
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    ],
    type: "Mountain View Plot",
    size: "10",
    sizeUnit: "acres",
    dimensions: "650 x 670 ft",
    location: "Santa Fe, NM 87506",
    price: "$1,250,000",
    favorite: false,
    coordinates: { lat: 35.7772, lng: -105.9347 },
    description:
      "Exclusive mountain property with breathtaking 360-degree views and ultimate privacy, perfect for a luxury estate. This spectacular 10-acre parcel sits atop a ridge in the prestigious Sangre de Cristo Mountains, offering unobstructed views of the surrounding mountains, valleys, and the city lights of Santa Fe. The property features a mix of pinon and juniper trees with several ideal building sites already identified. A private well has been drilled and produces 15 gallons per minute of excellent quality water. The property includes architectural plans for a 6,000 sq ft custom home designed to maximize the views from every room.",
    features: [
      "360-degree mountain views",
      "Private well installed",
      "Multiple building sites",
      "Gated community",
      "Architectural plans included",
    ],
    zoning: "Residential Estate",
    utilities: "Private well, underground electricity available",
    access: "Paved private road with security gate",
  },
  {
    id: "6",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    ],
    type: "Residential Plot",
    size: "0.25",
    sizeUnit: "acres",
    dimensions: "80 x 135 ft",
    location: "Albuquerque, NM 87106",
    price: "$78,500",
    favorite: false,
    coordinates: { lat: 35.0853, lng: -106.6056 },
    description:
      "Affordable residential plot in a family-friendly neighborhood with all utilities in place. This 0.25-acre lot is located in an established neighborhood with mature trees and is ready for immediate construction. The property is flat and has been cleared, with utilities already connected at the property line. The lot is within walking distance to parks, schools, and shopping. This neighborhood has seen significant appreciation in recent years, making this an excellent investment opportunity. The seller has architectural plans for a 3-bedroom, 2-bathroom home that can be included with an acceptable offer.",
    features: [
      "Ready to build",
      "All utilities in place",
      "Flat, cleared lot",
      "Walking distance to amenities",
      "Architectural plans available",
    ],
    zoning: "Residential R-1",
    utilities: "All utilities connected at property line",
    access: "Paved road with sidewalks",
  },
]

// Land category data
const categories = [
  { id: "1", name: "Recent", icon: <Landmark size={20} color="#888" /> },
  { id: "2", name: "Plots", icon: <Ruler size={20} color="#888" /> },
  { id: "3", name: "Acres", icon: <Trees size={20} color="#888" /> },
  { id: "4", name: "Hectares", icon: <Mountain size={20} color="#888" /> },
  { id: "5", name: "Farmland", icon: <Wheat size={20} color="#888" /> },
  { id: "6", name: "Beachfront", icon: <Palmtree size={20} color="#888" /> },
]

const PropertyCard = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(property.favorite)
  const navigation = useNavigation()

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x
    const imageIndex = Math.round(contentOffset / width)
    setCurrentImageIndex(imageIndex)
  }

  return (
    <View style={styles.propertyCard}>
      <View style={styles.imageContainer}>
        <FlatList
          data={property.images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          renderItem={({ item }) => <Image source={{ uri: item }} style={styles.propertyImage} />}
          keyExtractor={(item, index) => index.toString()}
        />

        {/* Image pagination dots */}
        <View style={styles.paginationDots}>
          {property.images.map((_, index) => (
            <View
              key={index}
              style={[styles.paginationDot, index === currentImageIndex && styles.paginationDotActive]}
            />
          ))}
        </View>
      </View>

      <View style={styles.propertyDetails}>
        <View style={styles.propertyInfo}>
          <Text style={styles.propertyType}>{property.type}</Text>
          <View style={styles.propertySpecs}>
            <Text style={styles.propertySpec}>
              {property.size} {property.sizeUnit}
            </Text>
            <Text style={styles.propertySpec}>{property.dimensions}</Text>
          </View>
        </View>

        <Text style={styles.propertyLocation}>{property.location}</Text>

        {/* Coordinates display */}
        <Text style={styles.propertyCoordinates}>
          {property.coordinates.lat.toFixed(4)}, {property.coordinates.lng.toFixed(4)}
        </Text>

        {/* Price and Schedule Tour button in the same row */}
        <View style={styles.priceActionRow}>
          <Text style={styles.propertyPrice}>{property.price}</Text>
          <TouchableOpacity
            style={styles.scheduleButton}
            onPress={() =>
              navigation.navigate("PropertyDetails", {
                property: property,
              })
            }
          >
            <Text style={styles.tourText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const CoordinateSearchModal = ({ visible, onClose, onSearch }) => {
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [radius, setRadius] = useState("10") // Default radius in miles

  const handleSearch = () => {
    if (latitude && longitude) {
      onSearch({
        lat: Number.parseFloat(latitude),
        lng: Number.parseFloat(longitude),
        radius: Number.parseFloat(radius),
      })
      onClose()
    }
  }

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Search by Coordinates</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Latitude</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 35.0853"
              keyboardType="numeric"
              value={latitude}
              onChangeText={setLatitude}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Longitude</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. -106.6056"
              keyboardType="numeric"
              value={longitude}
              onChangeText={setLongitude}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Search Radius (miles)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="10"
              keyboardType="numeric"
              value={radius}
              onChangeText={setRadius}
            />
          </View>

          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const HomeScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("1")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProperties, setFilteredProperties] = useState(properties)
  const [isCoordinateModalVisible, setIsCoordinateModalVisible] = useState(false)
  const [activeCoordinateSearch, setActiveCoordinateSearch] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)

  // Animation values for the three bubbles
  const bubble1Animation = useRef(new Animated.Value(0)).current
  const bubble2Animation = useRef(new Animated.Value(0)).current
  const bubble3Animation = useRef(new Animated.Value(0)).current

  // Animation function for loading bubbles
  const animateBubbles = () => {
    // Reset animations
    bubble1Animation.setValue(0)
    bubble2Animation.setValue(0)
    bubble3Animation.setValue(0)

    // Create staggered animation sequence
    Animated.stagger(150, [
      Animated.sequence([
        Animated.timing(bubble1Animation, {
          toValue: 1,
          duration: 600,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          useNativeDriver: true,
        }),
        Animated.timing(bubble1Animation, {
          toValue: 0,
          duration: 600,
          easing: Easing.bezier(0.55, 0.085, 0.68, 0.53),
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(bubble2Animation, {
          toValue: 1,
          duration: 600,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          useNativeDriver: true,
        }),
        Animated.timing(bubble2Animation, {
          toValue: 0,
          duration: 600,
          easing: Easing.bezier(0.55, 0.085, 0.68, 0.53),
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(bubble3Animation, {
          toValue: 1,
          duration: 600,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          useNativeDriver: true,
        }),
        Animated.timing(bubble3Animation, {
          toValue: 0,
          duration: 600,
          easing: Easing.bezier(0.55, 0.085, 0.68, 0.53),
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Restart animation when complete if still loading
      if (isLoading) {
        animateBubbles()
      }
    })
  }

  // Start or stop bubble animation when loading state changes
  useEffect(() => {
    if (isLoading) {
      animateBubbles()
    } else {
      // Stop animations
      bubble1Animation.stopAnimation()
      bubble2Animation.stopAnimation()
      bubble3Animation.stopAnimation()
    }
  }, [isLoading])

  // Interpolate animation values for translateY
  const bubble1TranslateY = bubble1Animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  })

  const bubble2TranslateY = bubble2Animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  })

  const bubble3TranslateY = bubble3Animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  })

  // Calculate distance between two coordinates in miles
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3958.8 // Earth's radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Handle coordinate search
  const handleCoordinateSearch = (searchParams) => {
    setActiveCoordinateSearch(searchParams)
    // The filtering will be handled in the useEffect
  }

  // Filter properties based on category, search query, and coordinates
  useEffect(() => {
    let results = [...properties]

    // Filter by category
    if (selectedCategory === "2") {
      // Plots
      results = results.filter((property) => property.type.toLowerCase().includes("plot"))
    } else if (selectedCategory === "3") {
      // Acres
      results = results.filter(
        (property) => property.sizeUnit.toLowerCase().includes("acre") && Number.parseFloat(property.size) >= 1,
      )
    } else if (selectedCategory === "4") {
      // Hectares
      results = results.filter((property) => property.sizeUnit.toLowerCase().includes("hectare"))
    } else if (selectedCategory === "5") {
      // Farmland
      results = results.filter((property) => property.type.toLowerCase().includes("agricultural"))
    } else if (selectedCategory === "6") {
      // Beachfront
      results = results.filter((property) => property.type.toLowerCase().includes("beachfront"))
    }

    // Filter by search query if it exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      results = results.filter(
        (property) =>
          property.location.toLowerCase().includes(query) ||
          property.type.toLowerCase().includes(query) ||
          property.price.toLowerCase().includes(query) ||
          property.size.toLowerCase().includes(query) ||
          property.sizeUnit.toLowerCase().includes(query) ||
          // Also check if the query contains coordinates in format "lat,lng"
          (query.includes(",") &&
            (() => {
              const [latStr, lngStr] = query.split(",").map((s) => s.trim())
              const lat = Number.parseFloat(latStr)
              const lng = Number.parseFloat(lngStr)
              if (!isNaN(lat) && !isNaN(lng)) {
                // If valid coordinates, check if they're close to any property
                return calculateDistance(lat, lng, property.coordinates.lat, property.coordinates.lng) <= 50 // Within 50 miles
              }
              return false
            })()),
      )
    }

    // Filter by coordinate search if active
    if (activeCoordinateSearch) {
      results = results.filter((property) => {
        const distance = calculateDistance(
          activeCoordinateSearch.lat,
          activeCoordinateSearch.lng,
          property.coordinates.lat,
          property.coordinates.lng,
        )
        return distance <= activeCoordinateSearch.radius
      })
    }

    setFilteredProperties(results)
  }, [selectedCategory, searchQuery, activeCoordinateSearch])

  // Add a function to handle loading more properties
  const loadMoreProperties = () => {
    // Only trigger loading if we're not already loading
    if (!isLoading) {
      setIsLoading(true)

      // Simulate API call with timeout
      setTimeout(() => {
        // In a real app, you would fetch more data here
        // and append it to filteredProperties

        // For demo purposes, we'll just set loading to false after a delay
        setIsLoading(false)
        setPage(page + 1)
      }, 2000)
    }
  }

  // Add onEndReached handler to the ScrollView
  const handleEndReached = () => {
    loadMoreProperties()
  }

  // Render loading bubbles
  const renderLoadingBubbles = () => {
    if (!isLoading) return null

    return (
      <View style={styles.loadingBubblesContainer}>
        <Animated.View
          style={[
            styles.loadingBubble,
            { backgroundColor: "#088a6a" },
            { transform: [{ translateY: bubble1TranslateY }] },
          ]}
        />
        <Animated.View
          style={[
            styles.loadingBubble,
            { backgroundColor: "#088a6a" },
            { transform: [{ translateY: bubble2TranslateY }] },
          ]}
        />
        <Animated.View
          style={[
            styles.loadingBubble,
            { backgroundColor: "#088a6a" },
            { transform: [{ translateY: bubble3TranslateY }] },
          ]}
        />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent
          const paddingToBottom = 20
          if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
            handleEndReached()
          }
        }}
        scrollEventThrottle={400}
      >
        <StatusBar barStyle="dark-content" />
        <Text style={styles.headerText}>I am looking for land in</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Where to buy land?"
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={() => setIsCoordinateModalVisible(true)}>
            <MapPin size={20} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Active coordinate search indicator */}
        {activeCoordinateSearch && (
          <View style={styles.activeSearchContainer}>
            <Text style={styles.activeSearchText}>
              Searching within {activeCoordinateSearch.radius} miles of {activeCoordinateSearch.lat.toFixed(4)},{" "}
              {activeCoordinateSearch.lng.toFixed(4)}
            </Text>
            <TouchableOpacity onPress={() => setActiveCoordinateSearch(null)}>
              <X size={16} color="#088a6a" />
            </TouchableOpacity>
          </View>
        )}

        {/* Categories */}
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.categoryItem, selectedCategory === item.id && styles.selectedCategory]}
              onPress={() => setSelectedCategory(item.id)}
            >
              <View style={styles.categoryIcon}>{item.icon}</View>
              <Text style={[styles.categoryText, selectedCategory === item.id && styles.selectedCategoryText]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />

        {/* Property Listings or No Match Message */}
        <View style={styles.propertiesContainer}>
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} navigation={navigation} />
            ))
          ) : (
            <View style={styles.noMatchContainer}>
              <Text style={styles.noMatchText}>No land properties match</Text>
              <Text style={styles.noMatchSubtext}>Try adjusting your filters or search criteria</Text>
            </View>
          )}
        </View>

        {/* Loading bubbles */}
        {renderLoadingBubbles()}

        <View style={styles.bottomNavSpacer} />
      </ScrollView>

      {/* Coordinate Search Modal */}
      <CoordinateSearchModal
        visible={isCoordinateModalVisible}
        onClose={() => setIsCoordinateModalVisible(false)}
        onSearch={handleCoordinateSearch}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  filterButton: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  activeSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#e6f7f2",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 8,
    borderRadius: 8,
  },
  activeSearchText: {
    color: "#088a6a",
    fontSize: 12,
    flex: 1,
  },
  categoriesContainer: {
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  categoryItem: {
    alignItems: "center",
    marginHorizontal: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  selectedCategory: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  categoryIcon: {
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    color: "#888",
  },
  selectedCategoryText: {
    color: "#000",
    fontWeight: "500",
  },
  propertiesContainer: {
    paddingHorizontal: 16,
    minHeight: 200,
  },
  noMatchContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 30,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  tourText: {
    color: "#ffff",
  },
  noMatchText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  noMatchSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  propertyCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    height: 220,
  },
  propertyImage: {
    width: width - 32, // Full width minus padding
    height: 220,
  },
  paginationDots: {
    position: "absolute",
    bottom: 12,
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 3,
  },
  paginationDotActive: {
    backgroundColor: "white",
  },
  propertyDetails: {
    padding: 16,
  },
  propertyInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  propertyType: {
    fontSize: 16,
    fontWeight: "500",
  },
  propertySpecs: {
    flexDirection: "row",
  },
  propertySpec: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  propertyLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  propertyCoordinates: {
    fontSize: 12,
    color: "#888",
    marginBottom: 12,
  },
  priceActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  propertyPrice: {
    fontSize: 20,
    fontWeight: "bold",
  },
  scheduleButton: {
    backgroundColor: "#088a6a",
    borderRadius: 0,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    color: "#ffff",
  },
  bottomNavSpacer: {
    height: 70,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: "#088a6a",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 10,
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  // Loading bubbles styles
  loadingBubblesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  loadingBubble: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
})

export default HomeScreen