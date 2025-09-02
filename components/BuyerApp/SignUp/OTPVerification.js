"use client"

import React, { useState, useEffect } from "react"
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
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from "@react-native-async-storage/async-storage"
import { verifyEmail, resendVerificationEmail } from "../../../services/api/auth/verifications/userVerification"

const { width } = Dimensions.get("window")

const OTPVerificationScreen = ({ route }) => {
  const navigation = useNavigation()
  const [currentScreen, setCurrentScreen] = useState("verification")
  const [verificationToken, setVerificationToken] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [canResend, setCanResend] = useState(true)
  const [email, setEmail] = useState(route?.params?.email || "")
  const [emailLoaded, setEmailLoaded] = useState(!!route?.params?.email) // Track if email is loaded

  // Get email from AsyncStorage if not provided in route params
  useEffect(() => {
    const getStoredEmail = async () => {
      if (!email) {
        try {
          const storedEmail = await AsyncStorage.getItem("pendingVerificationEmail")
          if (storedEmail) {
            setEmail(storedEmail)
          } else {
            setEmail("user@example.com")
          }
        } catch (error) {
          console.error("Error getting stored email:", error)
          setEmail("user@example.com")
        }
      }
      setEmailLoaded(true)
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

  // Handle back navigation
  const handleBackPress = () => {
    navigation.goBack()
  }

  // Handle resend code with real API integration
  const handleResendCode = async () => {
    if (!canResend || !email) return

    try {
      setResendLoading(true)
      await resendVerificationEmail(email)
      setCountdown(60)
      setCanResend(false)
      Alert.alert("Code Sent", `A new verification email has been sent to ${email}. Please check your inbox.`, [
        { text: "OK" },
      ])
    } catch (error) {
      console.error("Resend error:", error)
      let errorMessage = error.message || "Failed to resend code. Please try again."
      if (error.message.includes("not registered") || error.message.includes("not found")) {
        errorMessage = "Email not found. Please sign up again."
        Alert.alert("Registration Required", errorMessage, [
          { text: "Cancel", style: "cancel" },
          {
            text: "Sign Up",
            onPress: () => {
              if (navigation && navigation.reset) {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "RegisterOwner" }],
                })
              } else if (navigation && navigation.navigate) {
                navigation.navigate("RegisterOwner")
              }
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
    if (loading) return
    if (!verificationToken) {
      Alert.alert("Error", "Verification token is missing.")
      return
    }
    if (!email) {
      Alert.alert("Error", "Email is not loaded yet. Please wait a moment and try again.")
      return
    }

    try {
      setLoading(true)
      const newData = {
        email: email.trim(),
        otp: verificationToken.trim(),
      }
      console.log("Verifying email with:", newData)
      const result = await verifyEmail(newData)
      console.log("[OTPVerification] Verification result:", result)

      if (!result.success) {
        let errorMessage = result.error || "Unable to verify email. Please try again."

        if (errorMessage.includes("invalid or expired") || errorMessage.includes("not found")) {
          errorMessage = "Invalid or expired token. Please request a new one."
        }

        if (errorMessage.includes("Registration not found")) {
          errorMessage = "Registration not found. Please sign up again."
          Alert.alert("Registration Required", errorMessage, [
            {
              text: "Cancel",
              style: "cancel"
            },
            {
              text: "Sign Up",
              onPress: () => {
                if (navigation?.reset) {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "RegisterOwner" }],
                  })
                } else if (navigation?.navigate) {
                  navigation.navigate("RegisterOwner")
                }
              },
            },
          ])
          return
        }

        Alert.alert("Verification Error", errorMessage)
        return
      }

      // Success block
      const {
        access_token,
        refresh_token,
        expires_in_access,
        expires_in_refresh
      } = result.tokens || {}

      const user = result.user ? JSON.stringify(result.user) : ""

      console.log("✅ Email verification successful")

      // Store all tokens and the verified email
      await AsyncStorage.multiSet([
        ["accessToken", access_token || ""],
        ["refreshToken", refresh_token || ""],
        ["accessExpiresIn", expires_in_access || ""],
        ["refreshExpiresIn", expires_in_refresh || ""],
        ["verifiedEmail", email.trim()],
        ["user", user]
      ])

      // Remove the temporary key and set the screen
      await AsyncStorage.removeItem("pendingVerificationEmail")
      setCurrentScreen("success")
      console.log("Set currentScreen to success")

    } catch (error) {
      console.error("An unexpected error occurred during verification:", error)
      Alert.alert("Verification Error", "An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }


  // Handle success continue
  const handleSuccessContinue = () => {
    console.log("Navigating to main app...")
    if (navigation && navigation.reset) {
      navigation.reset({
        index: 0,
        routes: [{ name: "BuyerLogin" }],
      })
    } else if (navigation && navigation.navigate) {
      navigation.navigate("BuyerLogin")
    } else {
      Alert.alert("Success", "Verification completed!")
    }
  }

  const renderVerificationScreen = () => (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={styles.content}>
          <View style={styles.illustrationContainer}>
            <Image
              source={require("../../../assets/verify.png")}
              style={styles.illustrationImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Token Verification</Text>
          <Text style={styles.subtitle}>Please enter the verification token we sent to your email address</Text>
          {email && <Text style={styles.emailText}>{email}</Text>}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter verification token"
              value={verificationToken}
              onChangeText={setVerificationToken}
              autoCapitalize="none"
              keyboardType="default"
              placeholderTextColor="#999"
            />
          </View>

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

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.continueButton, loading || !verificationToken.trim() ? styles.continueButtonDisabled : {}]}
              onPress={handleContinue}
              disabled={loading || !verificationToken.trim()}
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

  const renderSuccessScreen = () => (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.successContainer}>
        <View style={styles.successIconContainer}>
          <View style={styles.successIcon}>
            <Check size={40} color="#8A3FFC" />
          </View>
        </View>
        <Text style={styles.successTitle}>Success!</Text>
        <Text style={styles.successSubtitle}>Congratulations! You have been successfully authenticated.</Text>
        <View style={styles.successButtonContainer}>
          <TouchableOpacity style={styles.continueButton} onPress={handleSuccessContinue}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )

  // Only render when email is loaded
  if (!emailLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#8A3FFC" />
      </View>
    )
  }

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
  illustrationContainer: {
    alignItems: "center",
    marginBottom: 40,
    width: "100%",
    height: 200,
  },
  illustrationImage: {
    width: "80%",
    height: "100%",
    maxWidth: 300,
    maxHeight: 200,
  },
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
  inputContainer: {
    width: "100%",
    marginBottom: 30,
    paddingHorizontal: 5,
  },
  textInput: {
    height: 60,
    width: "100%",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
  },
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