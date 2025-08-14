"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Dimensions,
  Image,
} from "react-native"
import { ArrowLeft, Check } from "lucide-react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { verifyEmail, resendVerificationEmail } from "../../../services/api/auth/verifications/userVerification"

const { width, height } = Dimensions.get("window")

const OTPVerificationScreen = ({ navigation, route }) => {
  const [currentScreen, setCurrentScreen] = useState("verification") // 'verification' or 'success'
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]) // Changed to 6 digits
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [canResend, setCanResend] = useState(true)

  // Get email from route params or AsyncStorage
  const [email, setEmail] = useState(route?.params?.email || "")

  // Refs for OTP inputs
  const otpInputRefs = useRef([])

  // Initialize refs for the 6 OTP inputs (changed from 4 to 6)
  useEffect(() => {
    otpInputRefs.current = Array(6)
      .fill()
      .map((_, i) => otpInputRefs.current[i] || React.createRef())
  }, [])

  // Get email from AsyncStorage if not provided in route params
  useEffect(() => {
    const getStoredEmail = async () => {
      if (!email) {
        try {
          const storedEmail = await AsyncStorage.getItem("pendingVerificationEmail")
          if (storedEmail) {
            setEmail(storedEmail)
          } else {
            // Set default email if no email is found
            setEmail("user@example.com")
          }
        } catch (error) {
          console.error("Error getting stored email:", error)
          // Set default email on error
          setEmail("user@example.com")
        }
      }
    }
    getStoredEmail()
  }, [email])

  // Countdown timer effect
  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    } else if (countdown === 0 && !canResend) {
      setCanResend(true)
    }
    return () => clearTimeout(timer)
  }, [countdown, canResend])

  // Handle OTP input change
  const handleOtpChange = (text, index) => {
    // Only allow digits
    if (!/^\d*$/.test(text)) return

    const newOtp = [...otpCode]
    newOtp[index] = text
    setOtpCode(newOtp)

    // Auto-focus next input if current input is filled
    if (text.length === 1 && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
      setActiveIndex(index + 1)
    }
  }

  // Handle backspace and focus management
  const handleKeyPress = (nativeEvent, index) => {
    if (nativeEvent.key === "Backspace" && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
      setActiveIndex(index - 1)
    }
  }

  // Handle input focus
  const handleInputFocus = (index) => {
    setActiveIndex(index)
  }

  // Handle resend code with real API integration
  const handleResendCode = async () => {
    if (!canResend || !email) return

    try {
      setResendLoading(true)

      // Call the real API function with the email from route params
      await resendVerificationEmail(email)

      // Start countdown
      setCountdown(60)
      setCanResend(false)

      // Show success alert
      Alert.alert("Code Sent", `A new verification code has been sent to ${email}. Please check your inbox.`, [
        { text: "OK" },
      ])
    } catch (error) {
      console.error("Resend error:", error)

      // Handle specific error cases
      let errorMessage = error.message || "Failed to resend code. Please try again."

      if (error.message.includes("not registered") || error.message.includes("not found")) {
        errorMessage = "Email not found. Please sign up again."

        // Offer to navigate back to registration
        Alert.alert("Registration Required", errorMessage, [
          { text: "Cancel", style: "cancel" },
          {
            text: "Sign Up",
            onPress: () => {
              // Navigate back to sign up screen
              navigation.reset({
                index: 0,
                routes: [{ name: "SignUp" }], // Replace with your sign up route
              })
            },
          },
        ])
        return
      }

      Alert.alert("Error", errorMessage)
    } finally {
      setResendLoading(false)
    }
  }

  // Handle continue/verify with real API integration
  const handleContinue = async () => {
    const code = otpCode.join("")

    if (!email) {
      Alert.alert("Error", "Email address is required for verification")
      return
    }

    try {
      setLoading(true)

      console.log("Verifying code:", code, "for email:", email)

      // Call the real API function to verify the 6-digit code with email
      const { accessToken, refreshToken, accessExpiresIn, refreshExpiresIn } = await verifyEmail(code, email)

      console.log("Email verification successful for:", email)

      // Store tokens securely
      await AsyncStorage.multiSet([
        ["accessToken", accessToken],
        ["refreshToken", refreshToken],
        ["accessExpiresIn", accessExpiresIn.toString()],
        ["refreshExpiresIn", refreshExpiresIn.toString()],
        ["verifiedEmail", email], // Store the verified email
      ])

      // Clear the pending verification email
      await AsyncStorage.removeItem("pendingVerificationEmail")

      // Move to success screen
      setCurrentScreen("success")
    } catch (error) {
      console.error("Verification error:", error)

      // Handle specific error cases
      let errorMessage = error.message || "Invalid verification code. Please try again."

      if (error.message.includes("Registration not found") || error.message.includes("not registered")) {
        errorMessage = "Registration not found. Please sign up again."

        // Offer to navigate back to registration
        Alert.alert("Registration Required", errorMessage, [
          { text: "Cancel", style: "cancel" },
          {
            text: "Sign Up",
            onPress: () => {
              // Navigate back to sign up screen
              navigation.reset({
                index: 0,
                routes: [{ name: "RegisterOwner" }], // Replace with your sign up route
              })
            },
          },
        ])
        return
      }

      Alert.alert("Verification Error", errorMessage)

      // Clear the OTP inputs on error
      setOtpCode(["", "", "", "", "", ""])
      setActiveIndex(0)
      otpInputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  // Handle success continue
  const handleSuccessContinue = () => {
    // Navigate to next screen (replace with your actual navigation)
    console.log("Navigating to main app...")

    // Example navigation - replace with your actual route
    if (navigation) {
      navigation.reset({
        index: 0,
        routes: [{ name: "BuyerLogin" }], // Replace with your main app route
      })
    } else {
      Alert.alert("Success", "Verification completed!")
    }
  }

  // Render OTP Verification Screen
  const renderVerificationScreen = () => (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Content */}
        <View style={styles.content}>
          {/* Custom Illustration from Assets */}
          <View style={styles.illustrationContainer}>
            <Image
              source={require("./assets/verify.png")} // Replace with your actual image path
              style={styles.illustrationImage}
              resizeMode="contain"
            />
          </View>

          {/* Title and Subtitle */}
          <Text style={styles.title}>OTP Verification</Text>
          <Text style={styles.subtitle}>We have sent the verification code to your email address</Text>
          {email && <Text style={styles.emailText}>{email}</Text>}

          {/* Registration Issue Warning */}
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>If you're having trouble, you may need to sign up again.</Text>
            <TouchableOpacity
              style={styles.signUpAgainButton}
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "SignUp" }], // Replace with your sign up route
                })
              }}
            >
              <Text style={styles.signUpAgainText}>Sign Up Again</Text>
            </TouchableOpacity>
          </View>

          {/* OTP Input - Updated for 6 digits */}
          <View style={styles.otpContainer}>
            {otpCode.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => (otpInputRefs.current[index] = el)}
                style={[
                  styles.otpInput,
                  activeIndex === index && styles.otpInputActive,
                  digit && styles.otpInputFilled,
                ]}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent, index)}
                onFocus={() => handleInputFocus(index)}
                keyboardType="default" // Changed from "number-pad" to "default"
                maxLength={1}
                autoFocus={index === 0}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Resend Code - Now inside KeyboardAvoidingView */}
          <View style={styles.resendContainer}>
            {canResend ? (
              <TouchableOpacity
                onPress={handleResendCode}
                disabled={resendLoading || !email}
                style={styles.resendButton}
              >
                {resendLoading ? (
                  <ActivityIndicator size="small" color="#8A3FFC" />
                ) : (
                  <Text style={[styles.resendText, !email && styles.disabledText]}>Resend Code</Text>
                )}
              </TouchableOpacity>
            ) : (
              <Text style={styles.countdownText}>Resend code in {countdown}s</Text>
            )}
          </View>

          {/* Continue Button - Now inside KeyboardAvoidingView */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.continueButton, loading && styles.continueButtonDisabled]}
              onPress={handleContinue}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.continueButtonText}>Continue</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )

  // Render Success Screen
  const renderSuccessScreen = () => (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.successContainer}>
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <View style={styles.successIcon}>
            <Check size={40} color="#8A3FFC" />
          </View>
        </View>

        {/* Success Text */}
        <Text style={styles.successTitle}>Success!</Text>
        <Text style={styles.successSubtitle}>Congratulations! You have been successfully authenticated</Text>

        {/* Continue Button */}
        <View style={styles.successButtonContainer}>
          <TouchableOpacity style={styles.continueButton} onPress={handleSuccessContinue}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )

  return (
    <View style={styles.wrapper}>
      {currentScreen === "verification" && renderVerificationScreen()}
      {currentScreen === "success" && renderSuccessScreen()}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  // Custom illustration styles
  illustrationContainer: {
    alignItems: "center",
    marginBottom: 40,
    width: "100%",
    height: 200, // Adjust based on your image size
  },
  illustrationImage: {
    width: "80%",
    height: "100%",
    maxWidth: 300, // Adjust based on your image
    maxHeight: 200, // Adjust based on your image
  },

  // Text styles
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 5,
    paddingHorizontal: 20,
  },
  emailText: {
    fontSize: 16,
    color: "#8A3FFC",
    fontWeight: "500",
    marginBottom: 20,
    textAlign: "center",
  },

  // Warning container styles
  warningContainer: {
    backgroundColor: "#FFF3CD",
    borderColor: "#FFEAA7",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  warningText: {
    fontSize: 14,
    color: "#856404",
    textAlign: "center",
    marginBottom: 8,
  },
  signUpAgainButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  signUpAgainText: {
    fontSize: 14,
    color: "#8A3FFC",
    fontWeight: "500",
    textDecorationLine: "underline",
  },

  // OTP Input styles - Updated for 6 digits
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "95%", // Increased width to accommodate 6 inputs
    marginBottom: 30,
    paddingHorizontal: 5,
  },
  otpInput: {
    width: 50, // Reduced width to fit 6 inputs
    height: 60,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    backgroundColor: "#fff",
    marginHorizontal: 2, // Added margin between inputs
  },
  otpInputActive: {
    borderColor: "#8A3FFC",
    shadowColor: "#8A3FFC",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  otpInputFilled: {
    backgroundColor: "#F8F6FF",
  },

  // Resend styles
  resendContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  resendButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  resendText: {
    fontSize: 16,
    color: "#8A3FFC",
    fontWeight: "500",
  },
  disabledText: {
    color: "#ccc",
  },
  countdownText: {
    fontSize: 16,
    color: "#999",
  },

  // Button styles
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 0,
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: "#8A3FFC",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  continueButtonDisabled: {
    backgroundColor: "#D0C5E8",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  // Success screen styles
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  successIconContainer: {
    marginBottom: 40,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#8A3FFC",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F6FF",
  },
  successTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  successSubtitle: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 60,
  },
  successButtonContainer: {
    width: "100%",
    position: "absolute",
    bottom: 30,
    paddingHorizontal: 20,
  },
})

export default OTPVerificationScreen
