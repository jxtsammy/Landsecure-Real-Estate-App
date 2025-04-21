"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Alert,
  Modal,
} from "react-native"
import {
  ArrowLeft,
  Settings,
  Heart,
  Bath,
  Bed,
  Square,
  ChevronLeft,
  ChevronRight,
  Trees,
  Video,
  Users,
  Trash2,
  X,
} from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"

const { width, height } = Dimensions.get("window")

const TourListScreen = () => {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState("pending")
  const [favorites, setFavorites] = useState({})
  const [currentImageIndex, setCurrentImageIndex] = useState({})
  const [cancelModalVisible, setCancelModalVisible] = useState(false)
  const [selectedCancelReason, setSelectedCancelReason] = useState("scheduling")
  const [propertyToCancel, setPropertyToCancel] = useState(null)

  const [properties, setProperties] = useState([
    {
      id: "1",
      type: "home",
      status: "Pending",
      tourStatus: "pending",
      tourScheduled: true,
      tourDate: "Thursday, April 20, 2023",
      tourTime: "10:30 AM",
      tourType: "in-person",
      images: [
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      ],
      baths: 2,
      beds: 2,
      sqft: 1000,
      price: "$3,200,000",
      address: "22 Wattle Street, Sydney, NSW 2000",
    },
    {
      id: "2",
      type: "home",
      status: "Pending",
      tourStatus: "pending",
      tourScheduled: true,
      tourDate: "Thursday, April 20, 2023",
      tourTime: "2:15 PM",
      tourType: "on-call",
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      ],
      baths: 2,
      beds: 2,
      sqft: 1000,
      price: "$2,800,000",
      address: "22 Wattle Street, Sydney",
    },
    {
      id: "4",
      type: "home",
      status: "Confirmed",
      tourStatus: "pending",
      tourScheduled: true,
      tourDate: "Monday, April 24, 2023",
      tourTime: "11:00 AM",
      tourType: "in-person",
      images: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      ],
      baths: 3,
      beds: 4,
      sqft: 2200,
      price: "$4,500,000",
      address: "8 Harbour View, Melbourne, VIC 3000",
    },
    {
      id: "6",
      type: "home",
      status: "Completed",
      tourStatus: "completed",
      tourScheduled: true,
      tourDate: "Monday, April 10, 2023",
      tourTime: "3:00 PM",
      tourType: "in-person",
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      ],
      baths: 4,
      beds: 5,
      sqft: 3200,
      price: "$5,100,000",
      address: "15 Beachfront Avenue, Gold Coast, QLD 4218",
    },
    {
      id: "7",
      type: "home",
      status: "Completed",
      tourStatus: "completed",
      tourScheduled: true,
      tourDate: "Friday, April 7, 2023",
      tourTime: "10:00 AM",
      tourType: "on-call",
      images: [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      ],
      baths: 2,
      beds: 3,
      sqft: 1800,
      price: "$1,950,000",
      address: "42 Park Lane, Brisbane, QLD 4000",
    },
  ])

  const cancelReasons = [
    { id: "scheduling", label: "I have a scheduling conflict" },
    { id: "agent", label: "I have my own agent" },
    { id: "notInterested", label: "I'm no longer interested" },
    { id: "openHouse", label: "I saw this home at an open house" },
    { id: "other", label: "Other" },
  ]

  const filteredProperties = properties.filter((property) => property.tourStatus === activeTab)

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const nextImage = (propertyId, imagesLength) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) + 1) % imagesLength,
    }))
  }

  const prevImage = (propertyId, imagesLength) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) - 1 + imagesLength) % imagesLength,
    }))
  }

  const openCancelModal = (property) => {
    setPropertyToCancel(property)
    setSelectedCancelReason("scheduling")
    setCancelModalVisible(true)
  }

  const closeCancelModal = () => {
    setCancelModalVisible(false)
    setPropertyToCancel(null)
  }

  const confirmCancelTour = () => {
    if (propertyToCancel) {
      // Remove the property from the list
      setProperties((prev) => prev.filter((property) => property.id !== propertyToCancel.id))

      // Close the modal
      closeCancelModal()
    }
  }

  const clearCompletedTours = () => {
    Alert.alert("Clear Completed Tours", "Are you sure you want to delete all completed tours?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete All",
        onPress: () => {
          setProperties((prev) => prev.filter((property) => property.tourStatus !== "completed"))
        },
        style: "destructive",
      },
    ])
  }

  const renderPropertyDetails = (property) => {
    if (property.type === "home") {
      return (
        <View style={styles.amenities}>
          <View style={styles.amenityItem}>
            <Bath size={16} color="#666" />
            <Text style={styles.amenityText}>{property.baths} baths</Text>
          </View>
          <View style={styles.amenityItem}>
            <Bed size={16} color="#666" />
            <Text style={styles.amenityText}>{property.beds} beds</Text>
          </View>
          <View style={styles.amenityItem}>
            <Square size={16} color="#666" />
            <Text style={styles.amenityText}>{property.sqft} sqft</Text>
          </View>
        </View>
      )
    } else {
      return (
        <View style={styles.amenities}>
          <View style={styles.amenityItem}>
            <Trees size={16} color="#666" />
            <Text style={styles.amenityText}>Land</Text>
          </View>
          <View style={styles.amenityItem}>
            <Square size={16} color="#666" />
            <Text style={styles.amenityText}>{property.sqft} sqft</Text>
          </View>
        </View>
      )
    }
  }

  const renderTourStatus = (property) => {
    const isCompleted = property.tourStatus === "completed"

    return (
      <View style={styles.tourInfoContainer}>
        <View style={styles.tourActionRow}>
          <View style={property.tourType === "in-person" ? styles.tourTypeTag : [styles.tourTypeTag, styles.onCallTag]}>
            {property.tourType === "in-person" ? <Users size={14} color="#fff" /> : <Video size={14} color="#fff" />}
            <Text style={styles.tourTypeText}>{property.tourType === "in-person" ? "In Person" : "On Call"}</Text>
          </View>

          {!isCompleted && (
            <TouchableOpacity style={styles.cancelButton} onPress={() => openCancelModal(property)}>
              <Text style={styles.cancelButtonText}>Cancel tour</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    )
  }

  const renderStatusBadge = (property) => {
    if (property.status === "Completed") {
      return (
        <View style={[styles.statusBadge, styles.completedStatusBadge]}>
          <Text style={styles.completedStatusText}>Completed</Text>
        </View>
      )
    }

    if (property.tourScheduled && property.tourStatus === "pending") {
      return (
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{property.status}</Text>
        </View>
      )
    }

    return (
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>{property.status}</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Schedules</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={activeTab === "completed" ? clearCompletedTours : undefined}
        >
          {activeTab === "pending" ? (
            <Settings size={24} color="#000" onPress={() => navigation.navigate('Account')} />
          ) : (
            <Trash2 size={24} color="#ff4757" />
          )}
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsWrapper}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "pending" ? styles.activeTab : styles.inactiveTab]}
            onPress={() => setActiveTab("pending")}
          >
            <Text style={[styles.tabText, activeTab === "pending" ? styles.activeTabText : styles.inactiveTabText]}>
              Pending Tours
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "completed" ? styles.activeTab : styles.inactiveTab]}
            onPress={() => setActiveTab("completed")}
          >
            <Text style={[styles.tabText, activeTab === "completed" ? styles.activeTabText : styles.inactiveTabText]}>
              Completed Tours
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tour List Title */}
      <Text style={styles.tourListTitle}>Tour List</Text>

      {/* Property List */}
      {filteredProperties.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>
            {activeTab === "pending" ? "No Pending Tours" : "No Completed Tours"}
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          {filteredProperties.map((property) => {
            const currentIndex = currentImageIndex[property.id] || 0

            return (
              <View key={property.id} style={styles.propertyCard}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: property.images[currentIndex] }}
                    style={styles.propertyImage}
                    resizeMode="cover"
                  />

                  {/* Image Navigation */}
                  {property.images.length > 1 && (
                    <>
                      <TouchableOpacity
                        style={[styles.imageNavButton, styles.imageNavLeft]}
                        onPress={() => prevImage(property.id, property.images.length)}
                      >
                        <ChevronLeft size={24} color="#fff" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.imageNavButton, styles.imageNavRight]}
                        onPress={() => nextImage(property.id, property.images.length)}
                      >
                        <ChevronRight size={24} color="#fff" />
                      </TouchableOpacity>

                      <View style={styles.imageDots}>
                        {property.images.map((_, index) => (
                          <View
                            key={index}
                            style={[styles.imageDot, index === currentIndex && styles.imageDotActive]}
                          />
                        ))}
                      </View>
                    </>
                  )}

                  {renderStatusBadge(property)}
                </View>

                <View style={styles.propertyDetails}>
                  {renderPropertyDetails(property)}

                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>{property.price}</Text>
                    <Text style={styles.address}>{property.address}</Text>
                    {/* Add the full date under the address */}
                    <Text style={styles.scheduleDate}>
                      {property.tourDate} • {property.tourTime}
                    </Text>
                  </View>

                  {renderTourStatus(property)}
                </View>
              </View>
            )
          })}
        </ScrollView>
      )}

      {/* Cancel Tour Modal */}
      <Modal animationType="slide" transparent={false} visible={cancelModalVisible} onRequestClose={closeCancelModal}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeCancelModal} style={styles.modalBackButton}>
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Cancel Tour</Text>
            <View style={styles.modalHeaderSpacer} />
          </View>

          <View style={styles.modalContent}>
            <View style={styles.houseImageContainer}>
              <Image
                source={require("../../../assets/istockphoto-1392838068-612x612-removebg-preview.png")}
                style={styles.houseIllustration}
              />
              <View style={styles.cancelIconCircle}>
                <X size={24} color="#E53935" />
              </View>
              <View style={styles.personIconLeft}>
                <Text style={styles.personEmoji}>😕</Text>
              </View>
              <View style={styles.personIconRight}>
                <Text style={styles.personEmoji}>🏠</Text>
              </View>
            </View>

            <Text style={styles.cancelReasonTitle}>Please let us know why you're canceling</Text>

            <View style={styles.reasonsContainer}>
              {cancelReasons.map((reason) => (
                <TouchableOpacity
                  key={reason.id}
                  style={[styles.reasonOption, selectedCancelReason === reason.id && styles.selectedReasonOption]}
                  onPress={() => setSelectedCancelReason(reason.id)}
                >
                  <View style={styles.radioButton}>
                    {selectedCancelReason === reason.id && <View style={styles.radioButtonSelected} />}
                  </View>
                  <Text style={styles.reasonText}>{reason.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.cancelTourButton} onPress={confirmCancelTour}>
              <Text style={styles.cancelTourButtonText}>Cancel Tour</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

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
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
  },
  settingsButton: {
    padding: 4,
  },
  tabsWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 30,
    padding: 4,
    height: 48,
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    height: 40,
  },
  activeTab: {
    backgroundColor: "#000",
  },
  inactiveTab: {
    backgroundColor: "transparent",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#fff",
  },
  inactiveTabText: {
    color: "#000",
  },
  tourListTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  propertyCard: {
    marginBottom: 30,
    borderRadius: 12,
    backgroundColor: "#e1decc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    height: 180,
  },
  propertyImage: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  imageNavButton: {
    position: "absolute",
    top: "50%",
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  imageNavLeft: {
    left: 10,
  },
  imageNavRight: {
    right: 10,
  },
  imageDots: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  imageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  imageDotActive: {
    backgroundColor: "#fff",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  completedStatusBadge: {
    backgroundColor: "rgba(76, 175, 80, 0.9)",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
  },
  completedStatusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#fff",
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  propertyDetails: {
    padding: 16,
  },
  amenities: {
    flexDirection: "row",
    marginBottom: 12,
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  amenityText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#333",
  },
  priceContainer: {
    marginBottom: 12,
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  // Add style for the schedule date
  scheduleDate: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  tourInfoContainer: {
    marginTop: 8,
    paddingTop: 3,
  },
  tourActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tourTypeTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 6,
  },
  onCallTag: {
    backgroundColor: "#2196F3",
  },
  tourTypeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 100, // Offset for the header and tabs
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#e1decc",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalBackButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  modalHeaderSpacer: {
    width: 32, // Same width as back button for centering
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  houseImageContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    height: 150,
  },
  houseIllustration: {
    width: 400,
    resizeMode: "contain",
  },
  cancelIconCircle: {
    position: "absolute",
    top: 0,
    backgroundColor: "#ffebee",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ffcdd2",
    zIndex: 1,
  },
  personIconLeft: {
    position: "absolute",
    left: 60,
    bottom: 40,
    backgroundColor: "#ffebee",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ffcdd2",
  },
  personIconRight: {
    position: "absolute",
    right: 60,
    bottom: 40,
    backgroundColor: "#ffebee",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ffcdd2",
  },
  personEmoji: {
    fontSize: 18,
  },
  cancelReasonTitle: {
    fontSize: 18,
    fontWeight: "light",
    marginBottom: 20,
    textAlign: "center",
  },
  reasonsContainer: {
    marginBottom: 30,
  },
  reasonOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: "#444",
    padding: 10,
    width: "100%",
    borderRadius: 10,
    marginBottom: 20,
  },
  selectedReasonOption: {
    backgroundColor: "#f9f9f9",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#666",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#000",
  },
  reasonText: {
    fontSize: 16,
    color: "#333",
  },
  cancelTourButton: {
    backgroundColor: "#000",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
  },
  cancelTourButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default TourListScreen
