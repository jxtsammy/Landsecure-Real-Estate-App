"use client"

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
import { ChevronLeft, Lock, Shield, FileText, Clock, Database, UserCheck } from "lucide-react-native"
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

const PrivacyPolicyScreen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
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
              <Shield size={22} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Introduction</Text>
            </View>

            <Text style={styles.lastUpdated}>Last Updated: April 3, 2023</Text>

            <Text style={styles.paragraph}>
              Welcome to our Privacy Policy. This document explains how we collect, use, and protect your personal
              information when you use our application.
            </Text>

            <Text style={styles.paragraph}>
              We are committed to ensuring the privacy and security of your personal data. Please read this policy
              carefully to understand our practices regarding your information.
            </Text>
          </View>

          {/* Information Collection Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Database size={22} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Information We Collect</Text>
            </View>

            <View style={styles.policyItem}>
              <Text style={styles.policyItemTitle}>Personal Information</Text>
              <Text style={styles.policyItemContent}>
                We may collect personal information such as your name, email address, phone number, and profile picture
                when you create an account or update your profile.
              </Text>
            </View>

            <View style={styles.policyItem}>
              <Text style={styles.policyItemTitle}>Usage Data</Text>
              <Text style={styles.policyItemContent}>
                We collect information about how you interact with our application, including the features you use, the
                time spent on the app, and any errors encountered.
              </Text>
            </View>

            <View style={styles.policyItem}>
              <Text style={styles.policyItemTitle}>Device Information</Text>
              <Text style={styles.policyItemContent}>
                We may collect information about your device, including the device model, operating system, unique
                device identifiers, and mobile network information.
              </Text>
            </View>
          </View>

          {/* How We Use Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FileText size={22} color="#3B82F6" />
              <Text style={styles.sectionTitle}>How We Use Your Information</Text>
            </View>

            <Text style={styles.paragraph}>We use the information we collect for various purposes, including:</Text>

            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>To provide and maintain our services</Text>
            </View>

            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>To notify you about changes to our services</Text>
            </View>

            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>To provide customer support and respond to your requests</Text>
            </View>

            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>To improve our application and user experience</Text>
            </View>

            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>To monitor usage of our application</Text>
            </View>
          </View>

          {/* Data Security Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Lock size={22} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Data Security</Text>
            </View>

            <Text style={styles.paragraph}>
              The security of your data is important to us. We implement appropriate security measures to protect your
              personal information from unauthorized access, alteration, disclosure, or destruction.
            </Text>

            <Text style={styles.paragraph}>
              We use industry-standard encryption technologies when transferring and receiving user data. However, no
              method of transmission over the Internet or method of electronic storage is 100% secure, and we cannot
              guarantee absolute security.
            </Text>
          </View>

          {/* Data Retention Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={22} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Data Retention</Text>
            </View>

            <Text style={styles.paragraph}>
              We will retain your personal information only for as long as necessary to fulfill the purposes outlined in
              this Privacy Policy, unless a longer retention period is required or permitted by law.
            </Text>
          </View>

          {/* Your Rights Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <UserCheck size={22} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Your Rights</Text>
            </View>

            <Text style={styles.paragraph}>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </Text>

            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>The right to access your personal information</Text>
            </View>

            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>The right to correct inaccurate or incomplete information</Text>
            </View>

            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>The right to delete your personal information</Text>
            </View>

            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>The right to restrict or object to processing of your data</Text>
            </View>

            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>The right to data portability</Text>
            </View>

            <Text style={styles.paragraph}>
              To exercise any of these rights, please contact us using the information provided in the "Contact Us"
              section.
            </Text>
          </View>

          {/* Contact Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Lock size={22} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Contact Us</Text>
            </View>

            <Text style={styles.paragraph}>
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </Text>

            <Text style={styles.contactInfo}>privacy@yourapp.com</Text>
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
  policyItem: {
    marginBottom: 16,
  },
  policyItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  policyItemContent: {
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
    backgroundColor: "#3B82F6",
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
    color: "#3B82F6",
    marginBottom: 8,
    fontWeight: "500",
  },
})

export default PrivacyPolicyScreen