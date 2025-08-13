"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
} from "react-native"
import { Eye, EyeOff, ArrowLeft, CheckSquare, Square } from "lucide-react-native"
const { width, height } = Dimensions.get("window")
import AsyncStorage from "@react-native-async-storage/async-storage"
import { verifyEmail, resendVerificationEmail } from "../../../services/api/auth/verifications/userVerification"
import { registerSeller } from "../../../services/api/auth/register/adminRegister"

// Decorative circles data
const decorativeCircles = [
  { size: 120, top: 80, right: -40, color: "rgba(138, 63, 252, 0.08)" },
  { size: 180, top: 250, left: -80, color: "rgba(138, 63, 252, 0.05)" },
  { size: 100, bottom: 150, right: 30, color: "rgba(138, 63, 252, 0.07)" },
  { size: 70, top: 400, left: 20, color: "rgba(138, 63, 252, 0.06)" },
  { size: 50, bottom: 250, right: 60, color: "rgba(138, 63, 252, 0.09)" },
  { size: 140, bottom: -60, left: -50, color: "rgba(138, 63, 252, 0.04)" },
  { size: 85, top: 180, right: width / 2, color: "rgba(138, 63, 252, 0.03)" },
  {
    size: 110,
    top: height / 2,
    left: width / 3,
    color: "rgba(138, 63, 252, 0.05)",
  },
]

const AuthScreens = ({ navigation }) => {
  // State for form inputs and screen navigation
  const [currentScreen, setCurrentScreen] = useState("createAccount") // 'createAccount', 'verifyCode'
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [surname, setSurname] = useState("")
  const [otherNames, setOtherNames] = useState("")
  const [nationality, setNationality] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [ghanaCardNumber, setGhanaCardNumber] = useState("")
  const [role] = useState("seller") // Fixed role that can't be edited
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [verificationCode, setVerificationCode] = useState(["", "", "", ""])
  const [loading, setLoading] = useState(false)

  // Refs for verification code inputs
  const codeInputRefs = useRef([])

  // Initialize refs for the 4 verification code inputs
  useEffect(() => {
    codeInputRefs.current = Array(4)
      .fill()
      .map((_, i) => codeInputRefs.current[i] || React.createRef())
  }, [])

  // Password validation function
  const validatePassword = (password) => {
    const hasLowerCase = /[a-z]/.test(password)
    const hasUpperCase = /[A-Z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const minLength = password.length >= 8

    return {
      isValid: hasLowerCase && hasUpperCase && hasNumbers && minLength,
      hasLowerCase,
      hasUpperCase,
      hasNumbers,
      minLength,
    }
  }

  // Form validation function
  const validateForm = () => {
    const errors = []

    // Required fields validation
    if (!email.trim()) errors.push("Email is required")
    if (!password.trim()) errors.push("Password is required")
    if (!confirmPassword.trim()) errors.push("Confirm password is required")
    if (!firstName.trim()) errors.push("First name is required")
    if (!lastName.trim()) errors.push("Last name is required")
    if (!phone.trim()) errors.push("Phone number is required")
    if (!surname.trim()) errors.push("Surname is required")
    if (!nationality.trim()) errors.push("Nationality is required")
    if (!dateOfBirth.trim()) errors.push("Date of birth is required")
    if (!ghanaCardNumber.trim()) errors.push("Ghana card number is required")

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (email && !emailRegex.test(email)) {
      errors.push("Please enter a valid email address")
    }

    // Password validation
    const passwordValidation = validatePassword(password)
    if (password && !passwordValidation.isValid) {
      if (!passwordValidation.minLength) errors.push("Password must be at least 8 characters long")
      if (!passwordValidation.hasLowerCase) errors.push("Password must contain at least one lowercase letter")
      if (!passwordValidation.hasUpperCase) errors.push("Password must contain at least one uppercase letter")
      if (!passwordValidation.hasNumbers) errors.push("Password must contain at least one number")
    }

    // Password match validation
    if (password && confirmPassword && password !== confirmPassword) {
      errors.push("Passwords do not match")
    }

    // Terms agreement validation
    if (!agreeToTerms) {
      errors.push("You must agree to the terms and conditions")
    }

    return errors
  }

  // Function to handle verification code input with auto-focus
  const handleCodeChange = (text, index) => {
    // Only allow digits
    if (!/^\d*$/.test(text)) return

    const newCode = [...verificationCode]
    newCode[index] = text
    setVerificationCode(newCode)

    // Auto-focus next input if current input is filled
    if (text.length === 1 && index < 3) {
      codeInputRefs.current[index + 1].focus()
    }
  }

  // Function to handle sign up button press
  const handleSignUp = async () => {
    const validationErrors = validateForm()

    if (validationErrors.length > 0) {
      Alert.alert("Validation Error", validationErrors.join("\n"))
      return
    }

    try {
      setLoading(true)

      // Prepare the registration data
      const userData = {
        email: email.trim().toLowerCase(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        surname: surname.trim(),
        otherNames: otherNames.trim(),
        nationality: nationality.trim(),
        dateOfBirth: dateOfBirth.trim(),
        ghanaCardNumber: ghanaCardNumber.trim(),
        role,
      }

      // Call the registration API
      const response = await registerSeller(userData)

      console.log("Registration successful:", {
        email,
        firstName,
        lastName,
        phone,
        surname,
        otherNames,
        nationality,
        dateOfBirth,
        ghanaCardNumber,
        role,
      })

      // On successful registration, move to verification screen
      setCurrentScreen("verifyCode")

      // Optionally store email for verification reference
      await AsyncStorage.setItem("pendingVerificationEmail", email)
    } catch (error) {
      console.error("Registration error:", error)

      // Handle specific error cases
      let errorMessage = "Registration failed. Please try again."
      if (error.message === "Email already registered") {
        errorMessage = "This email is already registered. Please login instead."
      } else if (error.message === "Network connection failed") {
        errorMessage = "Unable to connect. Please check your internet connection."
      } else if (error.message.includes("Invalid registration data")) {
        errorMessage = "Please check your registration details and try again."
      }

      Alert.alert("Registration Error", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Function to handle verify button press
  const handleVerify = async () => {
    const code = verificationCode.join("") // Combine the 4 digits

    // Validate code length
    if (code.length !== 4) {
      Alert.alert("Error", "Please enter the complete 4-digit verification code")
      return
    }

    try {
      setLoading(true)

      // Call verification API with the 4-digit code
      const { accessToken, refreshToken } = await verifyEmail(code)

      console.log("Email verification successful")

      // Store tokens securely
      await AsyncStorage.multiSet([
        ["accessToken", accessToken],
        ["refreshToken", refreshToken],
      ])

      // Navigate to the main app
      Alert.alert("Registration Complete", "Your account has been created successfully!", [
        {
          text: "Continue",
          onPress: () => navigation.navigate("OwnerNav"),
        },
      ])
    } catch (error) {
      console.error("Verification failed:", error)

      let errorMessage = "Verification failed. Please try again."

      if (error.message.includes("Invalid or expired token")) {
        errorMessage = "Invalid or expired verification code"
      } else if (error.message.includes("Verification token not found")) {
        errorMessage = "This verification code is not recognized"
      } else if (error.message === "Network connection failed") {
        errorMessage = "Unable to connect. Please check your internet"
      }

      Alert.alert("Verification Error", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleTokenResend = async () => {
    try {
      setLoading(true)

      // Get the email from storage or state
      const email = (await AsyncStorage.getItem("pendingVerificationEmail")) || ""

      // Call the resend API
      const success = await resendVerificationEmail(email)

      if (success) {
        Alert.alert("Email Sent", `Verification email resent to ${email}. Please check your inbox.`)
      }
    } catch (error) {
      console.error("Resend error:", error)

      let errorMessage = error.message

      // Handle specific error cases
      if (error.message.includes("Please enter a valid email")) {
        errorMessage = "Please enter a valid email address"
      } else if (error.message.includes("Email not found")) {
        errorMessage = "This email is not registered in our system"
      } else if (error.message.includes("Please wait")) {
        errorMessage = "Please wait a few minutes before requesting another email"
      } else if (error.message.includes("Network connection failed")) {
        errorMessage = "Unable to connect. Please check your internet connection"
      }

      Alert.alert("Error", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Render the step indicator
  const renderStepIndicator = () => {
    const totalSteps = 2
    let currentStep

    switch (currentScreen) {
      case "createAccount":
        currentStep = 1
        break
      case "verifyCode":
        currentStep = 2
        break
      default:
        currentStep = 1
    }

    return (
      <View style={styles.stepIndicatorContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isPast = stepNumber < currentStep

          return (
            <View key={index} style={styles.stepItem}>
              <View style={[styles.stepCircle, isActive && styles.activeStepCircle, isPast && styles.pastStepCircle]}>
                <Text style={[styles.stepNumber, (isActive || isPast) && styles.activeStepNumber]}>{stepNumber}</Text>
              </View>
              {index < totalSteps - 1 && <View style={[styles.stepLine, isPast && styles.activeStepLine]} />}
            </View>
          )
        })}
      </View>
    )
  }

  // Render the Create Account screen
  const renderCreateAccountScreen = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Fill your information below to create your account.</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email *</Text>
          <TextInput
            style={styles.input}
            placeholder="example@gmail.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>First Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your first name"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Last Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your last name"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Surname *</Text>
          <TextInput style={styles.input} placeholder="Enter your surname" value={surname} onChangeText={setSurname} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Other Names</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter other names (optional)"
            value={otherNames}
            onChangeText={setOtherNames}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Nationality *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your nationality"
            value={nationality}
            onChangeText={setNationality}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Date of Birth *</Text>
          <TextInput style={styles.input} placeholder="DD/MM/YYYY" value={dateOfBirth} onChangeText={setDateOfBirth} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Ghana Card Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your Ghana card number"
            value={ghanaCardNumber}
            onChangeText={setGhanaCardNumber}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Role</Text>
          <TextInput style={[styles.input, styles.disabledInput]} value={role} editable={false} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password *</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••••••••"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.passwordVisibilityButton} onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} color="#000" /> : <Eye size={20} color="#000" />}
            </TouchableOpacity>
          </View>
          {password && (
            <View style={styles.passwordRequirements}>
              <Text style={styles.passwordRequirementsTitle}>Password must contain:</Text>
              <Text
                style={[
                  styles.passwordRequirement,
                  validatePassword(password).minLength && styles.passwordRequirementMet,
                ]}
              >
                • At least 8 characters
              </Text>
              <Text
                style={[
                  styles.passwordRequirement,
                  validatePassword(password).hasLowerCase && styles.passwordRequirementMet,
                ]}
              >
                • One lowercase letter
              </Text>
              <Text
                style={[
                  styles.passwordRequirement,
                  validatePassword(password).hasUpperCase && styles.passwordRequirementMet,
                ]}
              >
                • One uppercase letter
              </Text>
              <Text
                style={[
                  styles.passwordRequirement,
                  validatePassword(password).hasNumbers && styles.passwordRequirementMet,
                ]}
              >
                • One number
              </Text>
            </View>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Confirm Password *</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••••••••"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              style={styles.passwordVisibilityButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} color="#000" /> : <Eye size={20} color="#000" />}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.termsContainer} onPress={() => setAgreeToTerms(!agreeToTerms)}>
          {agreeToTerms ? <CheckSquare size={20} color="#8A2BE2" /> : <Square size={20} color="#8A2BE2" />}
          <Text style={styles.termsText}>
            Agree with <Text style={styles.termsLink}>Terms & Condition</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Creating Account..." : "Sign Up"}</Text>
        </TouchableOpacity>

        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("OwnerLogin")}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )

  // Render the Verify Code screen
  const renderVerifyCodeScreen = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen("createAccount")}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Verify Code</Text>
        <Text style={styles.subtitle}>
          Please enter the code we just sent to email{"\n"}
          <Text style={styles.emailHighlight}>{email || "example@gmail.com"}</Text>
        </Text>

        <View style={styles.codeInputContainer}>
          {verificationCode.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => (codeInputRefs.current[index] = el)}
              style={styles.codeInput}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              keyboardType="number-pad"
              maxLength={1}
              autoFocus={index === 0}
              onKeyPress={({ nativeEvent }) => {
                // Handle backspace to move to previous input
                if (nativeEvent.key === "Backspace" && !digit && index > 0) {
                  codeInputRefs.current[index - 1].focus()
                }
              }}
            />
          ))}
        </View>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive OTP?</Text>
          <TouchableOpacity onPress={handleTokenResend}>
            <Text style={styles.resendLink}>Resend code</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleVerify}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Verifying..." : "Verify"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Decorative circles */}
      {decorativeCircles.map((circle, index) => (
        <View
          key={`circle-${index}`}
          style={[
            styles.decorativeCircle,
            {
              width: circle.size,
              height: circle.size,
              borderRadius: circle.size / 2,
              backgroundColor: circle.color,
              top: circle.top,
              left: circle.left,
              right: circle.right,
              bottom: circle.bottom,
            },
          ]}
        />
      ))}

      {renderStepIndicator()}

      {currentScreen === "createAccount" && renderCreateAccountScreen()}
      {currentScreen === "verifyCode" && renderVerifyCodeScreen()}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  // Decorative circle style
  decorativeCircle: {
    position: "absolute",
    zIndex: -1,
  },
  // Step indicator styles
  stepIndicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 5,
    zIndex: 1,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  activeStepCircle: {
    backgroundColor: "#8A2BE2",
  },
  pastStepCircle: {
    backgroundColor: "#8A2BE2",
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#888",
  },
  activeStepNumber: {
    color: "#fff",
  },
  stepLine: {
    width: 100,
    height: 2,
    backgroundColor: "#f0f0f0",
  },
  activeStepLine: {
    backgroundColor: "#8A2BE2",
  },
  // Common styles
  backButton: {
    alignSelf: "flex-start",
    padding: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "#f7f7f9",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: "#e9ecef",
    color: "#6c757d",
  },
  button: {
    backgroundColor: "#8A2BE2",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: "#d0c5e8",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // Create Account screen styles
  passwordInputContainer: {
    flexDirection: "row",
    backgroundColor: "#f7f7f9",
    borderRadius: 8,
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
  },
  passwordVisibilityButton: {
    paddingHorizontal: 16,
  },
  passwordRequirements: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  passwordRequirementsTitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  passwordRequirement: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  passwordRequirementMet: {
    color: "#28a745",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  termsText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  termsLink: {
    color: "#8A2BE2",
    fontWeight: "500",
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signInText: {
    color: "#666",
  },
  signInLink: {
    color: "#8A2BE2",
    fontWeight: "500",
  },
  // Verify Code screen styles
  emailHighlight: {
    color: "#8A2BE2",
    fontWeight: "500",
  },
  codeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 30,
  },
  codeInput: {
    width: 70,
    height: 60,
    backgroundColor: "#f7f7f9",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  resendText: {
    color: "#666",
  },
  resendLink: {
    color: "#8A2BE2",
    fontWeight: "500",
    marginLeft: 5,
  },
})

export default AuthScreens
