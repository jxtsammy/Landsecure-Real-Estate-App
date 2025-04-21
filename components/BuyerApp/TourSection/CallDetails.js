import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, StatusBar, Platform, Image } from "react-native"
import { ChevronLeft, Calendar, Clock, User, Mail, Phone, MapPin } from "lucide-react-native"
import { BlurView } from "expo-blur"

const ConfirmationScreen = ({ route, navigation }) => {
  // Add default empty object if route.params is undefined
  const params = route.params || {}

  // Destructure with default values to prevent "cannot read property" errors
  const {
    firstName = "First Name",
    lastName = "Last Name",
    email = "Emails",
    phoneNumber = "Phone No",
    location = "Location",
    date = "Schedule date",
    time = "Time",
    endTime = "End Time",
    formattedDateTime = "",
  } = params

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/dylan-fout-a5vs_rWxyu0-unsplash.jpg')}
        style={styles.backgroundImage}
      >
        <BlurView intensity={80} style={styles.blurContainer}>
          <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

          {/* Header */}
          <View style={[styles.header, { marginTop: Platform.OS === "ios" ? 50 : 40 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeft color="#fff" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Schedule a Call</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* House Illustration */}
          <View style={styles.illustrationContainer}>
            <Image source={require('../../../assets/istockphoto-1392838068-612x612-removebg-preview.png')} style={styles.houseImage} resizeMode="contain" />
          </View>

          {/* Confirmation Text */}
          <View style={styles.confirmationTextContainer}>
            <Text style={styles.confirmedText}>Confirmed</Text>
            <Text style={styles.scheduledWithText}>Your tour has been scheduled</Text>
          </View>

          {/* White Container with Details */}
          <View style={styles.detailsContainer}>
            {/* User Information */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Your Information</Text>
              
              {/* Name */}
              <View style={styles.detailRow}>
                <User size={20} color="#000" style={styles.icon} />
                <Text style={styles.detailText}>{`${firstName} ${lastName}`}</Text>
              </View>
              
              {/* Email */}
              <View style={styles.detailRow}>
                <Mail size={20} color="#000" style={styles.icon} />
                <Text style={styles.detailText}>{email}</Text>
              </View>
              
              {/* Phone */}
              <View style={styles.detailRow}>
                <Phone size={20} color="#000" style={styles.icon} />
                <Text style={styles.detailText}>{phoneNumber}</Text>
              </View>
              

            {/* Appointment Details */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Appointment Details</Text>
              
              {/* Date and Time */}
              <View style={styles.detailRow}>
                <Calendar size={20} color="#000" style={styles.icon} />
                <Text style={styles.detailText}>{`${time} - ${endTime}, ${date}`}</Text>
              </View>

              {/* Location */}
              <View style={styles.detailRow}>
                <MapPin size={20} color="#000" style={styles.icon} />
                <Text style={styles.detailText}>{location}</Text>
              </View>
            </View>
              ) : null}
            </View>

            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Home")}>
              <Text style={styles.backButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  blurContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  illustrationContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  houseImage: {
    width: 300,
    height: 200,
  },
  confirmationTextContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  confirmedText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  scheduledWithText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  sectionContainer: {
    marginBottom: 50,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    marginRight: 12,
  },
  detailText: {
    fontSize: 16,
    color: "#000",
    flex: 1,
  },
  backButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: "auto",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default ConfirmationScreen