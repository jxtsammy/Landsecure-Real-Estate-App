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
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Easing, // Import Easing for animations
} from "react-native"
import { ArrowLeft, Heart, Share2, MapPin, Ruler, MoreVertical, Upload, X } from "lucide-react-native"
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation, useRoute } from "@react-navigation/native"; // Import useNavigation and useRoute
import { transferProperty } from '../../../services/api/propertyManagment/transferProperty'

const { width, height } = Dimensions.get("window") // Get height for modal positioning

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

// PropertyCard component
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

// PropertyModal component
const PropertyModal = ({ visible, property, onClose, onOpenTransferScreen, isTransferringProperty }) => {
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

  // Animation values for the three bubbles
  const bubble1Animation = useRef(new Animated.Value(0)).current;
  const bubble2Animation = useRef(new Animated.Value(0)).current;
  const bubble3Animation = useRef(new Animated.Value(0)).current;

  // Animation function for loading bubbles
  const animateBubbles = () => {
    bubble1Animation.setValue(0);
    bubble2Animation.setValue(0);
    bubble3Animation.setValue(0);

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
      if (isTransferringProperty) { // Use the prop here
        animateBubbles();
      }
    });
  };

  useEffect(() => {
    if (isTransferringProperty) {
      animateBubbles();
    } else {
      bubble1Animation.stopAnimation();
      bubble2Animation.stopAnimation();
      bubble3Animation.stopAnimation();
    }
  }, [isTransferringProperty]);

  const bubble1TranslateY = bubble1Animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });
  const bubble2TranslateY = bubble2Animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });
  const bubble3TranslateY = bubble3Animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const renderLoadingBubbles = (loadingState) => {
    if (!loadingState) return null;
    return (
      <View style={styles.loadingBubblesContainer}>
        <Animated.View
          style={[
            styles.loadingBubble,
            { backgroundColor: "white" },
            { transform: [{ translateY: bubble1TranslateY }] },
          ]}
        />
        <Animated.View
          style={[
            styles.loadingBubble,
            { backgroundColor: "white" },
            { transform: [{ translateY: bubble2TranslateY }] },
          ]}
        />
        <Animated.View
          style={[
            styles.loadingBubble,
            { backgroundColor: "white" },
            { transform: [{ translateY: bubble3TranslateY }] },
          ]}
        />
      </View>
    );
  };

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
            {/* Share and Heart buttons */}
            <View style={styles.headerRightButtons}>
              <TouchableOpacity style={styles.circleButton}>
                <Share2 width={20} height={20} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.circleButton}>
                <Heart width={20} height={20} color="#000" />
              </TouchableOpacity>
            </View>
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
            <TouchableOpacity
              style={styles.transferPropertyButton}
              onPress={() => onOpenTransferScreen()}
              disabled={isTransferringProperty}
            >
              {isTransferringProperty ? (
                renderLoadingBubbles(isTransferringProperty)
              ) : (
                <Text style={styles.transferPropertyButtonText}>Transfer Property</Text>
              )}
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

// Define the TransferPropertyScreen component here, within the same file
export const TransferPropertyScreen = ({ navigation }) => {
  const route = useRoute();
  const { propertyId, onTransfer, propertyTitle } = route.params; // Get params from navigation

  const [newOwner, setNewOwner] = useState("");
  const [notes, setNotes] = useState("");
  const [documentUri, setDocumentUri] = useState(null);
  const [isTransferring, setIsTransferring] = useState(false); // Local loading state for this screen

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Allow all document types
        copyToCacheDirectory: false,
      });

      if (!result.canceled) {
        setDocumentUri(result.assets[0].uri);
      }
    } catch (err) {
      console.error('Document picking failed:', err);
      Alert.alert("Error", "Failed to pick document.");
    }
  };

  const handleTransferPress = async () => {
    if (!newOwner.trim()) {
      Alert.alert("Error", "Please enter the new owner's name.");
      return;
    }
    setIsTransferring(true); // Start local loading
    try {
      await onTransfer(propertyId, newOwner, notes, documentUri); // Call the passed function
      navigation.goBack(); // Navigate back to the previous screen (MyProperties)
    } catch (error) {
      Alert.alert("Transfer Failed", error.message || "An unexpected error occurred.");
    } finally {
      setIsTransferring(false); // End local loading
    }
  };

  // Animation values for the three bubbles
  const bubble1Animation = useRef(new Animated.Value(0)).current;
  const bubble2Animation = useRef(new Animated.Value(0)).current;
  const bubble3Animation = useRef(new Animated.Value(0)).current;

  // Animation function for loading bubbles
  const animateBubbles = () => {
    bubble1Animation.setValue(0);
    bubble2Animation.setValue(0);
    bubble3Animation.setValue(0);

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
      if (isTransferring) {
        animateBubbles();
      }
    });
  };

  useEffect(() => {
    if (isTransferring) {
      animateBubbles();
    } else {
      bubble1Animation.stopAnimation();
      bubble2Animation.stopAnimation();
      bubble3Animation.stopAnimation();
    }
  }, [isTransferring]);

  const bubble1TranslateY = bubble1Animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });
  const bubble2TranslateY = bubble2Animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });
  const bubble3TranslateY = bubble3Animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const renderLoadingBubbles = (loadingState) => {
    if (!loadingState) return null;
    return (
      <View style={styles.loadingBubblesContainer}>
        <Animated.View
          style={[
            styles.loadingBubble,
            { backgroundColor: "white" },
            { transform: [{ translateY: bubble1TranslateY }] },
          ]}
        />
        <Animated.View
          style={[
            styles.loadingBubble,
            { backgroundColor: "white" },
            { transform: [{ translateY: bubble2TranslateY }] },
          ]}
        />
        <Animated.View
          style={[
            styles.loadingBubble,
            { backgroundColor: "white" },
            { transform: [{ translateY: bubble3TranslateY }] },
          ]}
        />
      </View>
    );
  };

  // Animations for floating squares
  const square1Anim = useRef(new Animated.Value(0)).current;
  const square2Anim = useRef(new Animated.Value(0)).current;
  const square3Anim = useRef(new Animated.Value(0)).current;
  const square4Anim = useRef(new Animated.Value(0)).current;

  const animateSquares = () => {
    const createAnimation = (animation) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 8000 + Math.random() * 4000, // Random duration
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 8000 + Math.random() * 4000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      );

    createAnimation(square1Anim).start();
    createAnimation(square2Anim).start();
    createAnimation(square3Anim).start();
    createAnimation(square4Anim).start();
  };

  useEffect(() => {
    animateSquares();
  }, []);

  const getSquareStyle = (animation) => ({
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [-50, 50], // Float up and down
        }),
      },
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [-30, 30], // Float left and right
        }),
      },
    ],
    opacity: animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.2, 0.5, 0.2], // Fade in and out
    }),
  });


  return (
    <SafeAreaView style={styles.transferScreenContainer}>
      {/* Floating decorative squares */}
      <Animated.View style={[styles.floatingSquare, styles.square1, getSquareStyle(square1Anim)]} />
      <Animated.View style={[styles.floatingSquare, styles.square2, getSquareStyle(square2Anim)]} />
      <Animated.View style={[styles.floatingSquare, styles.square3, getSquareStyle(square3Anim)]} />
      <Animated.View style={[styles.floatingSquare, styles.square4, getSquareStyle(square4Anim)]} />

      <KeyboardAvoidingView
        style={styles.transferScreenContent}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.transferScreenHeader}>
          {/* Back button and title grouped on the left */}
          <View style={styles.headerLeftGroup}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackButton}>
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.transferScreenTitle}>Transfer Property</Text>
          </View>
          {/* Cancel button on the right */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.transferScreenScrollContent}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>New Owner Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter new owner's full name"
              value={newOwner}
              onChangeText={setNewOwner}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Notes (Optional)</Text>
            <TextInput
              style={[styles.modalInput, styles.notesInput]}
              placeholder="Add any relevant notes"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Upload Document</Text>
            <TouchableOpacity style={styles.documentUploadButton} onPress={pickDocument}>
              <Upload size={20} color="#000" />
              <Text style={styles.documentUploadText}>
                {documentUri ? documentUri.split('/').pop() : "Choose Document"}
              </Text>
            </TouchableOpacity>
            {documentUri && (
              <Text style={styles.documentSelectedText}>Document selected: {documentUri.split('/').pop()}</Text>
            )}
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.transferButton}
          onPress={handleTransferPress}
          disabled={isTransferring || !newOwner.trim()}
        >
          {isTransferring ? (
            renderLoadingBubbles(isTransferring)
          ) : (
            <Text style={styles.transferButtonText}>Transfer</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


export default function MyProperties() {
  const navigation = useNavigation(); // Initialize useNavigation hook
  const [activeTab, setActiveTab] = useState("On Sale")
  const [properties, setProperties] = useState(initialProperties)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [isTransferringProperty, setIsTransferringProperty] = useState(false); // For the button in PropertyModal
  const [isLoadingProperties, setIsLoadingProperties] = useState(true); // New state for main screen loading

  // Animation values for the three bubbles for main screen loading
  const mainBubble1Animation = useRef(new Animated.Value(0)).current;
  const mainBubble2Animation = useRef(new Animated.Value(0)).current;
  const mainBubble3Animation = useRef(new Animated.Value(0)).current;

  // Animation function for main screen loading bubbles
  const animateMainBubbles = () => {
    mainBubble1Animation.setValue(0);
    mainBubble2Animation.setValue(0);
    mainBubble3Animation.setValue(0);

    Animated.stagger(150, [
      Animated.sequence([
        Animated.timing(mainBubble1Animation, {
          toValue: 1,
          duration: 600,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          useNativeDriver: true,
        }),
        Animated.timing(mainBubble1Animation, {
          toValue: 0,
          duration: 600,
          easing: Easing.bezier(0.55, 0.085, 0.68, 0.53),
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(mainBubble2Animation, {
          toValue: 1,
          duration: 600,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          useNativeDriver: true,
        }),
        Animated.timing(mainBubble2Animation, {
          toValue: 0,
          duration: 600,
          easing: Easing.bezier(0.55, 0.085, 0.68, 0.53),
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(mainBubble3Animation, {
          toValue: 1,
          duration: 600,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          useNativeDriver: true,
        }),
        Animated.timing(mainBubble3Animation, {
          toValue: 0,
          duration: 600,
          easing: Easing.bezier(0.55, 0.085, 0.68, 0.53),
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      if (isLoadingProperties) {
        animateMainBubbles();
      }
    });
  };

  useEffect(() => {
    if (isLoadingProperties) {
      animateMainBubbles();
    } else {
      mainBubble1Animation.stopAnimation();
      mainBubble2Animation.stopAnimation();
      mainBubble3Animation.stopAnimation();
    }
  }, [isLoadingProperties]);

  const mainBubble1TranslateY = mainBubble1Animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });
  const mainBubble2TranslateY = mainBubble2Animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });
  const mainBubble3TranslateY = mainBubble3Animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const renderMainLoadingBubbles = (loadingState) => {
    if (!loadingState) return null;
    return (
      <View style={styles.loadingBubblesContainer}>
        <Animated.View
          style={[
            styles.loadingBubble,
            { backgroundColor: "#088a6a" }, // Use a distinct color for main loading
            { transform: [{ translateY: mainBubble1TranslateY }] },
          ]}
        />
        <Animated.View
          style={[
            styles.loadingBubble,
            { backgroundColor: "#088a6a" },
            { transform: [{ translateY: mainBubble2TranslateY }] },
          ]}
        />
        <Animated.View
          style={[
            styles.loadingBubble,
            { backgroundColor: "#088a6a" },
            { transform: [{ translateY: mainBubble3TranslateY }] },
          ]}
        />
      </View>
    );
  };

  // Simulate initial loading of properties
  useEffect(() => {
    setIsLoadingProperties(true);
    setTimeout(() => {
      setProperties(initialProperties); // Or fetch from API
      setIsLoadingProperties(false);
    }, 1000); // Simulate 1 second loading
  }, []);

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

  const handleTransferProperty = async (propertyId, newOwner, notes, documentUri) => {
    setIsTransferringProperty(true);

    try {
      // Prepare transfer data
      const transferData = {
        recipientEmail: newOwner, // Assuming newOwner is an email
        notes, // Additional transfer notes
      };

      // If documentUri is provided, convert to File object
      if (documentUri) {
        // In React Native, you'll need to use react-native-fs or similar to get file data
        const file = {
          uri: documentUri,
          type: 'application/pdf', // Adjust based on your document type
          name: `transfer-document-${propertyId}.pdf`, // Or extract from URI
        };
        transferData.documents = [file];
      }

      // Make API call
      const response = await transferProperty(propertyId, transferData);

      // Update local state if API call succeeds
      setProperties(prevProperties =>
        prevProperties.map(property =>
          property.id === propertyId
            ? {
                ...property,
                status: "Sold",
                soldDate: new Date().toISOString(),
                transferDetails: {
                  newOwner,
                  notes,
                  documentUri,
                  transactionId: response.transactionId // From API response
                },
              }
            : property
        )
      );

      Alert.alert(
        "Transfer Successful",
        `Property ${propertyId} has been transferred to ${newOwner}`
      );

      return response; // Return response for further processing if needed

    } catch (error) {
      console.error('Transfer error:', error.response?.data || error.message);
      Alert.alert(
        "Transfer Failed",
        error.response?.data?.message ||
        error.message ||
        "Failed to complete transfer"
      );
      throw error; // Re-throw if you need to handle this elsewhere
    } finally {
      setIsTransferringProperty(false);
    }
  };

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
      {isLoadingProperties ? (
        <View style={styles.mainLoadingContainer}>
          {renderMainLoadingBubbles(isLoadingProperties)}
        </View>
      ) : (
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
      )}
      {selectedProperty && (
        <PropertyModal
          visible={modalVisible}
          property={selectedProperty}
          onClose={() => setModalVisible(false)}
          onOpenTransferScreen={() => {
            setModalVisible(false); // Close the PropertyModal immediately
            navigation.navigate("TransferPropertyScreen", {
              propertyId: selectedProperty.id,
              onTransfer: handleTransferProperty,
              propertyTitle: selectedProperty.title, // Pass title for display
            });
          }}
          isTransferringProperty={isTransferringProperty}
        />
      )}
    </SafeAreaView>
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
  headerRightButtons: {
    flexDirection: "row",
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
  transferPropertyButton: { // Renamed from soldButton
    backgroundColor: "#000",
    paddingVertical: 16,
    alignItems: "center",
    marginVertical: 30,
    borderRadius: 30,
  },
  transferPropertyButtonText: { // Renamed from soldButtonText
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
  mainLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200, // Ensure it takes up space
  },
  // Styles for the inline loading bubbles
  loadingBubblesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 0, // Adjust padding as needed for button integration
    height: 20, // Ensure enough height for bubbles
  },
  loadingBubble: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  // New styles for TransferPropertyScreen
  transferScreenContainer: {
    flex: 1,
    backgroundColor: "#f0f4f8", // Light background for contrast with squares
    position: 'relative', // Needed for absolute positioning of squares
  },
  transferScreenContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 1, // Ensure content is above floating squares
  },
  transferScreenHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Distribute items
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 20,
    paddingHorizontal: 5, // Add padding for the header
  },
  headerLeftGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerBackButton: {
    marginRight: 10, // Space between icon and title
  },
  transferScreenTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000", // Black title
  },
  transferScreenScrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  inputContainer: {
    marginBottom: 25, // Increased gap between input fields
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10, // Increased gap between label and input
    color: "#333",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff", // White background for inputs
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  documentUploadButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff", // White background for upload button
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  documentUploadText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#666",
  },
  documentSelectedText: {
    fontSize: 12,
    color: "#088a6a",
    marginTop: 8,
    textAlign: "center",
  },
  transferButton: {
    backgroundColor: "#000", // Purple color
    paddingVertical: 16,
    borderRadius: 30, // 30px border-radius
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30, // Increased gap before button
    shadowColor: "#8A2BE2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  transferButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  // New styles for the Cancel button
  cancelButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "#000", // Black color for cancel button
    fontSize: 16,
    fontWeight: "600",
  },
  // Floating Squares Styles (remain the same as previous iteration)
  floatingSquare: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 15, // Rounded square
    zIndex: 0, // Behind content
  },
  square1: {
    top: '10%',
    left: '5%',
    backgroundColor: 'rgba(138, 43, 226, 0.1)', // Light purple
  },
  square2: {
    top: '30%',
    right: '10%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Light dark
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  square3: {
    bottom: '20%',
    left: '15%',
    backgroundColor: 'rgba(138, 43, 226, 0.3)', // Lighter purple
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  square4: {
    bottom: '5%',
    right: '5%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Very light dark
    width: 70,
    height: 70,
    borderRadius: 12,
  },
});
