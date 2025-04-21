import { useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Animated,
  TextInput,
  Platform,
} from "react-native"
import { ChevronLeft, HelpCircle, MessageSquare, Mail, Phone, ExternalLink, Send } from "lucide-react-native"
import { StatusBar } from 'react-native';

const { width, height } = Dimensions.get("window")

// Generate random circles for decoration
const decorativeCircles = Array(12)
  .fill(0)
  .map((_, i) => ({
    id: i,
    size: Math.random() * 120 + 40,
    top: Math.random() * height * 0.7,
    left: Math.random() * width,
    opacity: Math.random() * 0.15 + 0.05,
    color: [
      "#6B46C1", // Purple
      "#3B82F6", // Blue
      "#10B981", // Green
      "#F59E0B", // Yellow
      "#EF4444", // Red
      "#EC4899", // Pink
    ][Math.floor(Math.random() * 6)],
  }))

const HelpAndFeedbackScreen = ({ navigation }) => {
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

  const handleGoBack = () => {
    // Navigate back to previous screen
    if (navigation && navigation.goBack) {
      navigation.goBack()
    }
  }

  return (
    <SafeAreaView style={styles.container}>
    <StatusBar barStyle="light-content" />
      {/* Decorative Circles */}
      {decorativeCircles.map((circle) => (
        <View
          key={circle.id}
          style={[
            styles.decorativeCircle,
            {
              width: circle.size,
              height: circle.size,
              borderRadius: circle.size / 2,
              top: circle.top,
              left: circle.left,
              opacity: circle.opacity,
              backgroundColor: circle.color,
            },
          ]}
        />
      ))}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <ChevronLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Feedback</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Help Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <HelpCircle size={22} color="#6B46C1" />
              <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            </View>

            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>How do I reset my password?</Text>
              <Text style={styles.faqAnswer}>
                Go to the login screen and tap on "Forgot Password". Follow the instructions sent to your email to reset
                your password.
              </Text>
            </View>

            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>How can I update my profile information?</Text>
              <Text style={styles.faqAnswer}>
                Navigate to Settings > Personal Information to update your profile details including name, email, and
                profile picture.
              </Text>
            </View>

            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>Is my data secure?</Text>
              <Text style={styles.faqAnswer}>
                Yes, we use industry-standard encryption to protect your personal information. You can read more in our
                Privacy Policy.
              </Text>
            </View>

            <TouchableOpacity style={styles.linkButton}>
              <Text style={styles.linkButtonText}>View all FAQs</Text>
              <ExternalLink size={16} color="#6B46C1" />
            </TouchableOpacity>
          </View>

          {/* Feedback Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MessageSquare size={22} color="#6B46C1" />
              <Text style={styles.sectionTitle}>Send Feedback</Text>
            </View>

            <Text style={styles.sectionDescription}>
              We value your feedback! Let us know how we can improve your experience.
            </Text>

            <View style={styles.feedbackForm}>
              <Text style={styles.inputLabel}>Subject</Text>
              <TextInput style={styles.input} placeholder="What's this about?" placeholderTextColor="#999" />

              <Text style={styles.inputLabel}>Message</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell us what you think..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />

              <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Send Feedback</Text>
                <Send size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Contact Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Phone size={22} color="#6B46C1" />
              <Text style={styles.sectionTitle}>Contact Us</Text>
            </View>

            <Text style={styles.sectionDescription}>Need more help? Reach out to our support team.</Text>

            <View style={styles.contactItem}>
              <Mail size={18} color="#6B46C1" />
              <Text style={styles.contactText}>support@yourapp.com</Text>
            </View>

            <View style={styles.contactItem}>
              <Phone size={18} color="#6B46C1" />
              <Text style={styles.contactText}>+1 (555) 123-4567</Text>
            </View>

            <TouchableOpacity style={styles.linkButton}>
              <Text style={styles.linkButtonText}>Visit our support center</Text>
              <ExternalLink size={16} color="#6B46C1" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  decorativeCircle: {
    position: "absolute",
    zIndex: -1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  faqItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 8,
  },
  linkButtonText: {
    fontSize: 14,
    color: "#6B46C1",
    fontWeight: "600",
    marginRight: 6,
  },
  feedbackForm: {
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#333",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#6B46C1",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  submitButtonText: {
    color: "#FFF",
    fontWeight: "600",
    marginRight: 8,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 10,
  },
})

export default HelpAndFeedbackScreen