"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet, Dimensions } from "react-native"
import { ArrowLeft, CheckCheck } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"

const currencies = ["₵", "$", "€", "£", "¥"]

const AddListingScreen = () => {
  const [sellPrice, setSellPrice] = useState("")
  const [location, setLocation] = useState("")
  const [longitude, setLongitude] = useState("")
  const [latitude, setLatitude] = useState("")
  const [description, setDescription] = useState("")
  const [currency, setCurrency] = useState("₵")
  const [showCurrencyModal, setShowCurrencyModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)


  const handleAddProperty = () => {
    () => {
      setShowSuccessModal(false)
      navigation.navigate("AddProperty")
    }
  }

  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      {/* Random circles */}
      <View style={[styles.circle, { top: 40, left: 60, backgroundColor: "#FFE0E0" }]} />
      <View style={[styles.circle, { top: 150, right: 50, backgroundColor: "#D0F0FF" }]} />
      <View style={[styles.circle, { bottom: 100, left: 20, backgroundColor: "#E0FFD9" }]} />

      {/* Header */}
      <View style={styles.header}>
        <ArrowLeft color="#1d2951" />
        <Text style={styles.headerText}>Additional Info</Text>
      </View>

      <Text style={styles.title}>
        <Text style={styles.boldText}>Almost finish</Text>, complete the listing
      </Text>

      {/* Sell Price */}
      <Text style={styles.label}>Sell Price</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.currency}>{currency}</Text>
        <TextInput
          placeholder="e.g.180,000"
          placeholderTextColor="#333"
          keyboardType="numeric"
          value={sellPrice}
          onChangeText={setSellPrice}
          style={styles.textInput}
        />
        <TouchableOpacity onPress={() => setShowCurrencyModal(true)}>
          <Text style={styles.currencyIcon}>{currency}</Text>
        </TouchableOpacity>
      </View>

      {/* Location */}
      <Text style={styles.label}>Location</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="e.g. Accra, Ghana"
          placeholderTextColor="#333"
          value={location}
          onChangeText={setLocation}
          style={[styles.textInput, { paddingLeft: 10, flex: 1 }]}
        />
      </View>

      {/* Coordinates Section */}
      <Text style={styles.label}>Coordinates</Text>
      <View style={styles.coordinatesContainer}>
        <View style={styles.coordinateInputWrapper}>
          <Text style={styles.coordinateLabel}>Longitude</Text>
          <View style={styles.coordinateInputContainer}>
            <TextInput
              placeholder="e.g. -0.1870"
              placeholderTextColor="#333"
              keyboardType="numeric"
              value={longitude}
              onChangeText={setLongitude}
              style={styles.coordinateInput}
            />
          </View>
        </View>

        <View style={styles.coordinateInputWrapper}>
          <Text style={styles.coordinateLabel}>Latitude</Text>
          <View style={styles.coordinateInputContainer}>
            <TextInput
              placeholder="e.g. 5.6037"
              placeholderTextColor="#333"
              keyboardType="numeric"
              value={latitude}
              onChangeText={setLatitude}
              style={styles.coordinateInput}
            />
          </View>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        placeholder="Describe the property..."
        placeholderTextColor="#333"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        style={styles.descriptionInput}
      />

      {/* Finish Button */}
      <TouchableOpacity style={styles.finishButton} onPress={() => setShowSuccessModal(true)}>
        <Text style={styles.finishText}>Finish</Text>
      </TouchableOpacity>

      {/* Currency Modal */}
      <Modal visible={showCurrencyModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Currency</Text>
            <FlatList
              data={currencies}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setCurrency(item)
                    setShowCurrencyModal(false)
                  }}
                  style={styles.currencyItem}
                >
                  <Text style={styles.currencyText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContainer}>
            {/* Decorative Circles */}
            <View style={[styles.circle, { top: -30, right: 40, backgroundColor: "#D1F2EB" }]} />
            <View style={[styles.circle, { top: 80, left: 20, backgroundColor: "#FFDAB9" }]} />
            <View style={styles.handleBar} />

            <View style={styles.checkmarkContainer}>
              <CheckCheck size={48} color="white" />
            </View>

            <Text style={styles.successText}>Your property is now</Text>
            <Text style={styles.publishedText}>Listed</Text>
            <Text style={styles.desc}>You can now view it in the My Properties tab.</Text>

            <View style={{ flexDirection: "row", marginTop: 20 }}>
              <TouchableOpacity
                style={[styles.button, styles.addMoreBtn]}
                onPress={handleAddProperty}
              >
                <Text style={styles.addMoreText}>Add More</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.finishBtn]}
                onPress={() => {
                  setShowSuccessModal(false)
                  navigation.navigate("OwnerNav")
                }}
              >
                <Text style={styles.finishBtnText}>Finish</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const { width } = Dimensions.get("window")

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingTop: 20,
  },
  headerText: {
    fontSize: 22,
    marginLeft: 10,
    color: "#1d2951",
    fontWeight: "600",
  },
  title: {
    fontSize: 22,
    marginBottom: 30,
    color: "#1d2951",
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#8A2BE2",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#1d2951",
    fontWeight: "600",
  },
  inputContainer: {
    backgroundColor: "#f5f4f8",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  textInput: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  currency: {
    marginRight: 10,
    fontSize: 16,
    color: "#333",
  },
  currencyIcon: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1d2951",
    marginLeft: 8,
  },
  // Coordinates styles
  coordinatesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  coordinateInputWrapper: {
    flex: 1,
    marginRight: 8,
  },
  coordinateLabel: {
    fontSize: 14,
    color: "#1d2951",
    marginBottom: 6,
  },
  coordinateInputContainer: {
    backgroundColor: "#f5f4f8",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  coordinateInput: {
    fontSize: 16,
    color: "#333",
  },
  descriptionInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
    textAlignVertical: "top",
    fontSize: 16,
    color: "#333",
    marginBottom: 30,
  },
  finishButton: {
    flexDirection: "row",
    backgroundColor: "#8A2BE2",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  finishText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#1d2951",
  },
  currencyItem: {
    paddingVertical: 12,
  },
  currencyText: {
    fontSize: 16,
    color: "#1d2951",
  },
  circle: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.5,
  },
  successModalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  handleBar: {
    width: 120,
    height: 4,
    backgroundColor: "#5c5c7a",
    borderRadius: 2,
    marginBottom: 20,
  },
  checkmarkContainer: {
    backgroundColor: "#8A2BE2",
    borderRadius: 50,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#8BC34A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  successText: {
    fontSize: 20,
    color: "#2c2c5a",
  },
  publishedText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c5c70",
    marginVertical: 6,
  },
  desc: {
    color: "#5c5c7a",
    textAlign: "center",
    fontSize: 14,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginHorizontal: 5,
  },
  addMoreBtn: {
    backgroundColor: "#f4f4f9",
  },
  addMoreText: {
    color: "#1d2951",
    fontWeight: "600",
    fontSize: 16,
  },
  finishBtn: {
    backgroundColor: "#8A2BE2",
  },
  finishBtnText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
})

export default AddListingScreen