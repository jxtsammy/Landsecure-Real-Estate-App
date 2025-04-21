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
  Platform,
} from "react-native"
import { ChevronLeft, FileText, AlertTriangle, UserX, Globe, Scale, Mail } from "lucide-react-native"
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

const TermsOfUseScreen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Terms of Use</Text>
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
          {/* Introduction Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FileText size={22} color="#10B981" />
              <Text style={styles.sectionTitle}>Introduction</Text>
            </View>

            <Text style={styles.lastUpdated}>Last Updated: April 3, 2023</Text>

            <Text style={styles.paragraph}>
              Welcome to our application. These Terms of Use govern your use of our application and services. By
              accessing or using our application, you agree to be bound by these Terms.
            </Text>

            <Text style={styles.paragraph}>
              Please read these Terms carefully before using our application. If you do not agree with any part of these
              Terms, you may not use our application.
            </Text>
          </View>

          {/* User Accounts Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <UserX size={22} color="#10B981" />
              <Text style={styles.sectionTitle}>User Accounts</Text>
            </View>

            <View style={styles.termsItem}>
              <Text style={styles.termsItemTitle}>Account Creation</Text>
              <Text style={styles.termsItemContent}>
                To use certain features of our application, you may need to create an account. You are responsible for
                maintaining the confidentiality of your account credentials and for all activities that occur under your
                account.
              </Text>
            </View>

            <View style={styles.termsItem}>
              <Text style={styles.termsItemTitle}>Account Information</Text>
              <Text style={styles.termsItemContent}>
                You agree to provide accurate, current, and complete information during the registration process and to
                update such information to keep it accurate, current, and complete.
              </Text>
            </View>

            <View style={styles.termsItem}>
              <Text style={styles.termsItemTitle}>Account Termination</Text>
              <Text style={styles.termsItemContent}>
                We reserve the right to suspend or terminate your account and access to our services at our sole
                discretion, without notice, for conduct that we believe violates these Terms or is harmful to other
                users, us, or third parties, or for any other reason.
              </Text>
            </View>
          </View>

          {/* Acceptable Use Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AlertTriangle size={22} color="#10B981" />
              <Text style={styles.sectionTitle}>Acceptable Use</Text>
            </View>

            <Text style={styles.paragraph}>When using our application, you agree not to:</Text>

            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>
                Use the application for any illegal purpose or in violation of any laws
              </Text>
            </View>

            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>Violate the intellectual property rights of others</Text>
            </View>

            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>Upload or transmit viruses or any other type of malicious code</Text>
            </View>

            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>Attempt to gain unauthorized access to our systems or networks</Text>
            </View>

            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>Impersonate another person or entity</Text>
            </View>

            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>Interfere with or disrupt the operation of the application</Text>
            </View>
          </View>

          {/* Intellectual Property Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Globe size={22} color="#10B981" />
              <Text style={styles.sectionTitle}>Intellectual Property</Text>
            </View>

            <Text style={styles.paragraph}>
              The application and its original content, features, and functionality are owned by us and are protected by
              international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </Text>

            <Text style={styles.paragraph}>
              You may not modify, reproduce, distribute, create derivative works or adaptations of, publicly display or
              in any way exploit any of the content in whole or in part except as expressly authorized by us.
            </Text>
          </View>

          {/* Limitation of Liability Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Scale size={22} color="#10B981" />
              <Text style={styles.sectionTitle}>Limitation of Liability</Text>
            </View>

            <Text style={styles.paragraph}>
              In no event shall we, our directors, employees, partners, agents, suppliers, or affiliates be liable for
              any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss
              of profits, data, use, goodwill, or other intangible losses, resulting from:
            </Text>

            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>
                Your access to or use of or inability to access or use the application
              </Text>
            </View>

            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>Any conduct or content of any third party on the application</Text>
            </View>

            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>Any content obtained from the application</Text>
            </View>

            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>
                Unauthorized access, use, or alteration of your transmissions or content
              </Text>
            </View>
          </View>

          {/* Changes to Terms Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FileText size={22} color="#10B981" />
              <Text style={styles.sectionTitle}>Changes to Terms</Text>
            </View>

            <Text style={styles.paragraph}>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will
              provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change
              will be determined at our sole discretion.
            </Text>

            <Text style={styles.paragraph}>
              By continuing to access or use our application after any revisions become effective, you agree to be bound
              by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the
              application.
            </Text>
          </View>

          {/* Contact Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Mail size={22} color="#10B981" />
              <Text style={styles.sectionTitle}>Contact Us</Text>
            </View>

            <Text style={styles.paragraph}>If you have any questions about these Terms, please contact us at:</Text>

            <Text style={styles.contactInfo}>terms@yourapp.com</Text>
            <Text style={styles.contactInfo}>+1 (555) 123-4567</Text>
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
  lastUpdated: {
    fontSize: 12,
    color: "#666",
    marginBottom: 16,
    fontStyle: "italic",
  },
  paragraph: {
    fontSize: 14,
    color: "#333",
    marginBottom: 16,
    lineHeight: 20,
  },
  termsItem: {
    marginBottom: 16,
  },
  termsItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  termsItemContent: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 8,
    paddingLeft: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
    marginTop: 6,
    marginRight: 10,
  },
  bulletText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  contactInfo: {
    fontSize: 14,
    color: "#10B981",
    marginBottom: 8,
    fontWeight: "500",
  },
})

export default TermsOfUseScreen