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
  Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Search, MapPin, Trees, Mountain, Landmark, Wheat, Palmtree, Ruler, X, Frown, Filter } from "lucide-react-native" // Added Frown and Filter icons
import { StatusBar } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { getPropertyDetails } from '../../../services/api/propertyManagment/getPropertyDetails';

const { width } = Dimensions.get("window")

// PropertyCard component (remains largely the same)
const PropertyCard = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const navigation = useNavigation()

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x
    const imageIndex = Math.round(contentOffset / width)
    setCurrentImageIndex(imageIndex)
  }

  return (
    <TouchableOpacity
      style={styles.propertyCard}
      onPress={() =>
        navigation.navigate("PropertyDetails", {
          property: property,
        })
      }
    >
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
    </TouchableOpacity>
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

// Land category data
const categories = [
  { id: "1", name: "Recent", icon: <Landmark size={20} color="#888" /> },
  { id: "2", name: "Plots", icon: <Ruler size={20} color="#888" /> },
  { id: "3", name: "Acres", icon: <Trees size={20} color="#888" /> },
  { id: "4", name: "Hectares", icon: <Mountain size={20} color="#888" /> },
  { id: "5", name: "Farmland", icon: <Wheat size={20} color="#888" /> },
  { id: "6", name: "Beachfront", icon: <Palmtree size={20} color="#888" /> },
]

const HomeScreen = ({ navigation }) => {
  const [allProperties, setAllProperties] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("1")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProperties, setFilteredProperties] = useState([])
  const [isCoordinateModalVisible, setIsCoordinateModalVisible] = useState(false)
  const [activeCoordinateSearch, setActiveCoordinateSearch] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)

  // Animation values for the three bubbles
  const bubble1Animation = useRef(new Animated.Value(0)).current
  const bubble2Animation = useRef(new Animated.Value(0)).current
  const bubble3Animation = useRef(new Animated.Value(0)).current

  // Animation function for loading bubbles
  const animateBubbles = () => {
    bubble1Animation.setValue(0)
    bubble2Animation.setValue(0)
    bubble3Animation.setValue(0)

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
      if (isLoading) {
        animateBubbles()
      }
    })
  }

  useEffect(() => {
    if (isLoading) {
      animateBubbles()
    } else {
      bubble1Animation.stopAnimation()
      bubble2Animation.stopAnimation()
      bubble3Animation.stopAnimation()
    }
  }, [isLoading])

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

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const data = await getPropertyDetails();
        setAllProperties(data);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch properties. Please try again later.");
        console.error("Failed to fetch properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3958.8
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const handleCoordinateSearch = (searchParams) => {
    setActiveCoordinateSearch(searchParams)
  }

  useEffect(() => {
    let results = [...allProperties]

    if (selectedCategory === "2") {
      results = results.filter((property) => property.type.toLowerCase().includes("plot"))
    } else if (selectedCategory === "3") {
      results = results.filter(
        (property) => property.sizeUnit.toLowerCase().includes("acre") && Number.parseFloat(property.size) >= 1,
      )
    } else if (selectedCategory === "4") {
      results = results.filter((property) => property.sizeUnit.toLowerCase().includes("hectare"))
    } else if (selectedCategory === "5") {
      results = results.filter((property) => property.type.toLowerCase().includes("agricultural"))
    } else if (selectedCategory === "6") {
      results = results.filter((property) => property.type.toLowerCase().includes("beachfront"))
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      results = results.filter(
        (property) =>
          property.location.toLowerCase().includes(query) ||
          property.type.toLowerCase().includes(query) ||
          property.price.toLowerCase().includes(query) ||
          property.size.toLowerCase().includes(query) ||
          property.sizeUnit.toLowerCase().includes(query) ||
          (query.includes(",") &&
            (() => {
              const [latStr, lngStr] = query.split(",").map((s) => s.trim())
              const lat = Number.parseFloat(latStr)
              const lng = Number.parseFloat(lngStr)
              if (!isNaN(lat) && !isNaN(lng)) {
                return calculateDistance(lat, lng, property.coordinates.lat, property.coordinates.lng) <= 50
              }
              return false
            })()),
      )
    }

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
  }, [selectedCategory, searchQuery, activeCoordinateSearch, allProperties])

  const loadMoreProperties = () => {
    if (!isLoading) {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        setPage(page + 1)
      }, 2000)
    }
  }

  const handleEndReached = () => {
    loadMoreProperties()
  }

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
          {isLoading ? (
            renderLoadingBubbles()
          ) : filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} navigation={navigation} />
            ))
          ) : (
            <View style={styles.noMatchContainer}>
              <Frown size={48} color="#888" style={styles.noMatchIcon} />
              <Text style={styles.noMatchText}>No properties found</Text>
              <Text style={styles.noMatchSubtext}>
                It looks like there are no listings matching your current criteria.
              </Text>
              <TouchableOpacity
                style={styles.resetFiltersButton}
                onPress={() => {
                  setSearchQuery("");
                  setSelectedCategory("1");
                  setActiveCoordinateSearch(null);
                }}
              >
                <Filter size={16} color="white" style={styles.resetFiltersIcon} />
                <Text style={styles.resetFiltersText}>Reset Filters</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
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
  noMatchIcon: {
    marginBottom: 16,
  },
  tourText: {
    color: "#ffff",
  },
  noMatchText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  noMatchSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  resetFiltersButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#088a6a",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  resetFiltersIcon: {
    marginRight: 8,
  },
  resetFiltersText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
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
