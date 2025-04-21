"use client"

import { useState, useEffect, useRef } from "react"
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Modal,
  ScrollView,
  Animated,
  SafeAreaView,
} from "react-native"
import { ArrowLeft, Heart, Share2, MapPin, Ruler, MoreVertical } from "lucide-react-native"

const { width } = Dimensions.get("window")

// Sample land property data
const initialProperties = [
  {
    id: "1",
    title: "Mountain View Land",
    location: "Colorado",
    price: "$250,000",
    status: "On Sale",
    description:
      "Beautiful mountain view land parcel with stunning panoramic views. Perfect for building your dream home with 5 acres of pristine landscape. Access to hiking trails and natural springs.",
    details: {
      acres: 5,
      zoning: "Residential",
      utilities: "Available",
    },
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2070&auto=format&fit=crop",
    ],
    dateAdded: new Date(),
  },
  {
    id: "2",
    title: "Lakefront Property",
    location: "Minnesota",
    price: "$385,000",
    status: "On Sale",
    description:
      "Prime lakefront land with 200 feet of water frontage. Cleared and ready for construction with all utilities in place. Rare opportunity in a sought-after location.",
    details: {
      acres: 2.5,
      zoning: "Residential",
      utilities: "Available",
    },
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580133318324-f2f76d5a4f88?q=80&w=2074&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552083375-1447ce886485?q=80&w=2070&auto=format&fit=crop",
    ],
    dateAdded: new Date(),
  },
  {
    id: "3",
    title: "Desert Oasis Parcel",
    location: "Arizona",
    price: "$120,000",
    status: "On Sale",
    description:
      "Expansive desert land with incredible sunset views. Perfect for off-grid living or investment. Features natural desert vegetation and rock formations.",
    details: {
      acres: 10,
      zoning: "Mixed Use",
      utilities: "Partial",
    },
    images: [
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=2076&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1682686580391-615b1f28e5ee?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1682687982167-d7fb3ed8541d?q=80&w=2071&auto=format&fit=crop",
    ],
    dateAdded: new Date(),
  },
  {
    id: "4",
    title: "Woodland Acreage",
    location: "Oregon",
    price: "$195,000",
    status: "On Sale",
    description:
      "Secluded woodland property with mature trees and a small creek. Perfect for nature lovers seeking privacy and tranquility.",
    details: {
      acres: 7.8,
      zoning: "Residential",
      utilities: "Available",
    },
    images: [
      "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2073&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2074&auto=format&fit=crop",
    ],
    dateAdded: new Date(),
  },
  {
    id: "5",
    title: "Coastal Land Plot",
    location: "California",
    price: "$520,000",
    status: "Sold",
    description:
      "Premium coastal land with ocean views and beach access. Rare opportunity in a highly desirable area with approved building permits.",
    details: {
      acres: 1.2,
      zoning: "Residential",
      utilities: "Available",
    },
    images: [
      "https://images.unsplash.com/photo-1566024287286-457247b70310?q=80&w=2071&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?q=80&w=2033&auto=format&fit=crop",
    ],
    soldDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    id: "6",
    title: "Agricultural Land",
    location: "Iowa",
    price: "$320,000",
    status: "Sold",
    description:
      "Fertile agricultural land with rich soil and irrigation system in place. Perfect for farming or investment with excellent crop yield history.",
    details: {
      acres: 25,
      zoning: "Agricultural",
      utilities: "Partial",
    },
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop",
    ],
    soldDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
  },
]

export default function MyProperties() {
  const [activeTab, setActiveTab] = useState("On Sale")
  const [properties, setProperties] = useState(initialProperties)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)

  // Clean up sold properties older than 10 days
  useEffect(() => {
    const interval = setInterval(
      () => {
        const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)

        setProperties((prevProperties) =>
          prevProperties.filter(
            (property) => property.status !== "Sold" || !property.soldDate || property.soldDate > tenDaysAgo,
          ),
        )
      },
      1000 * 60 * 60,
    ) // Check every hour

    return () => clearInterval(interval)
  }, [])

  const markAsSold = (propertyId) => {
    setProperties((prevProperties) =>
      prevProperties.map((property) =>
        property.id === propertyId
          ? {
              ...property,
              status: "Sold",
              soldDate: new Date(),
            }
          : property,
      ),
    )
    setModalVisible(false)
  }

  const filteredProperties = properties.filter((property) => property.status === activeTab)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Properties</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <MoreVertical width={24} height={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainerWrapper}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "On Sale" && styles.activeTab]}
            onPress={() => setActiveTab("On Sale")}
          >
            <Text style={[styles.tabText, activeTab === "On Sale" && styles.activeTabText]}>On Sale</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "Sold" && styles.activeTab]}
            onPress={() => setActiveTab("Sold")}
          >
            <Text style={[styles.tabText, activeTab === "Sold" && styles.activeTabText]}>Sold</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredProperties}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            onPress={() => {
              setSelectedProperty(item)
              setModalVisible(true)
            }}
          />
        )}
      />

      {selectedProperty && (
        <PropertyModal
          visible={modalVisible}
          property={selectedProperty}
          onClose={() => setModalVisible(false)}
          onMarkAsSold={() => markAsSold(selectedProperty.id)}
        />
      )}
    </SafeAreaView>
  )
}

const PropertyCard = ({ property, onPress }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Image slideshow
  useEffect(() => {
    if (property.images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex === property.images.length - 1 ? 0 : prevIndex + 1))
    }, 3000)

    return () => clearInterval(interval)
  }, [property.images])

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: property.images[currentImageIndex] }} style={styles.image} resizeMode="cover" />
        <View style={styles.statusTag}>
          <Text style={styles.statusText}>{property.status}</Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.propertyTitle} numberOfLines={1}>
          {property.title}
        </Text>
        <Text style={styles.propertyLocation} numberOfLines={1}>
          {property.location}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

// Update the PropertyModal component to match the design in the reference image
const PropertyModal = ({ visible, property, onClose, onMarkAsSold }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const scrollX = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (property.images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const newIndex = prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
        return newIndex
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [property.images])

  return (
    <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        {/* Full-width image with overlay header */}
        <View style={styles.imageHeader}>
          <Image
            source={{ uri: property.images[currentImageIndex] }}
            style={styles.fullWidthImage}
            resizeMode="cover"
          />

          {/* Header overlay with buttons */}
          <View style={styles.headerOverlay}>
            <TouchableOpacity onPress={onClose} style={styles.circleButton}>
              <ArrowLeft width={20} height={20} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Image pagination dots */}
          <View style={styles.paginationDots}>
            {property.images.map((_, index) => (
              <View
                key={index}
                style={[styles.paginationDot, currentImageIndex === index && styles.paginationDotActive]}
              />
            ))}
          </View>
        </View>

        {/* Content container with rounded corners */}
        <View style={styles.roundedContentContainer}>
          {/* Added property title here */}
          <Text style={styles.propertyHeaderTitleInContainer}>{property.title}</Text>

          {/* Price and status row */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>{property.price}</Text>
            <View style={styles.forSaleTagContainer}>
              <Text style={styles.forSaleText}>For sale</Text>
              <Text style={styles.addedDaysText}>Added {Math.floor(Math.random() * 7) + 1} days ago</Text>
            </View>
          </View>

          {/* Address row */}
          <View style={styles.addressRow}>
            <MapPin width={16} height={16} color="#8A2BE2" />
            <Text style={styles.addressText}>
              {Math.floor(Math.random() * 100) + 1} {property.location} Street, {property.location}
            </Text>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.propertyType}>Land</Text>

            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Ruler width={20} height={20} color="#666" />
                <Text style={styles.detailText}>
                  {property.details.acres} {property.details.acres === 1 ? "Acre" : "Acres"}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <MapPin width={20} height={20} color="#666" />
                <Text style={styles.detailText}>{property.details.zoning}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailText}>Utilities: {property.details.utilities}</Text>
              </View>
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Land Description</Text>
              <Text style={styles.descriptionText}>{property.description}</Text>
            </View>
          </ScrollView>

          {property.status !== "Sold" ? (
            <TouchableOpacity style={styles.soldButton} onPress={onMarkAsSold}>
              <Text style={styles.soldButtonText}>Mark as Sold</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.soldButtonDisabled}>
              <Text style={styles.soldButtonTextDisabled}>Sold</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  )
}

// Update the styles to match the new design
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  headerIcon: {
    padding: 4,
  },
  tabContainerWrapper: {
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    padding: 4,
    width: 220,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#000",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  activeTabText: {
    color: "#fff",
  },
  listContainer: {
    padding: 8,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageContainer: {
    position: "relative",
    height: 150,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  statusTag: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  cardContent: {
    padding: 12,
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 12,
    color: "#666",
  },

  // Modal styles - updated to match reference design
  modalContainer: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  imageHeader: {
    position: "relative",
    height: 350,
  },
  fullWidthImage: {
    width: "100%",
    height: "100%",
  },
  headerOverlay: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  circleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  paginationDots: {
    position: "absolute",
    bottom: 16,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#fff",
  },
  roundedContentContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
  },
  forSaleTagContainer: {
    alignItems: "flex-end",
  },
  forSaleText: {
    color: "#ff6600",
    fontWeight: "500",
    fontSize: 14,
  },
  addedDaysText: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  addressText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
  },
  modalContent: {
    flex: 1,
  },
  propertyType: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
  },
  detailsContainer: {
    flexDirection: "row",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#666",
  },
  descriptionContainer: {
    paddingBottom: 24,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
  },
  soldButton: {
    backgroundColor: "#8A2BE2",
    paddingVertical: 16,
    alignItems: "center",
    marginVertical: 30,
    borderRadius: 30,
  },
  soldButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  soldButtonDisabled: {
    backgroundColor: "#ccc",
    paddingVertical: 16,
    alignItems: "center",
    marginVertical: 30,
    borderRadius: 30,
  },
  soldButtonTextDisabled: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  propertyHeaderTitleInContainer: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
  },
})