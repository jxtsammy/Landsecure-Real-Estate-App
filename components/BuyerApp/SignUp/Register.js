"use client"
import { useState, useRef, useEffect } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native"
import { Eye, EyeOff, Check, ArrowLeft } from "lucide-react-native"
import { registerUser } from '../../../services/api/auth/register/buyerRegister'
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUpScreen = ({ navigation }) => {
  // Form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  // UI state
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Validation state
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Refs for focus management
  const lastNameRef = useRef(null)
  const phoneNumberRef = useRef(null)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const confirmPasswordRef = useRef(null)

  // Password validation function
  const validatePassword = (pass) => {
    if (pass.length < 8 || pass.length > 128) {
      return "Password must be 8-128 characters long"
    }
    if (!/[a-z]/.test(pass)) {
      return "Password must contain at least one lowercase letter"
    }
    if (!/[A-Z]/.test(pass)) {
      return "Password must contain at least one uppercase letter"
    }
    if (!/\d/.test(pass)) {
      return "Password must contain at least one number"
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(pass)) {
      return "Password must contain at least one special character"
    }
    return ""
  }

  // Confirm password validation
  const validateConfirmPassword = (pass, confirmPass) => {
    if (pass !== confirmPass) {
      return "Passwords do not match"
    }
    return ""
  }

  // Function to validate if a string is a valid email token
  const isValidEmailToken = (token) => {
    if (!token || typeof token !== "string") return false

    // Check if it's a valid email format (which is what we expect)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValidEmail = emailRegex.test(token.trim())

    if (isValidEmail) {
      console.log("Valid email token received:", token)
      return true
    } else {
      console.log("Invalid email token format:", token)
      return false
    }
  }

  // Update password validation when password changes
  useEffect(() => {
    if (passwordTouched) {
      setPasswordError(validatePassword(password))
    }
    if (confirmPasswordTouched && confirmPassword) {
      setConfirmPasswordError(validateConfirmPassword(password, confirmPassword))
    }
  }, [password, confirmPassword, passwordTouched, confirmPasswordTouched])

  // Check if form is valid
  const isFormValid = () => {
    const passError = validatePassword(password)
    const confirmPassError = validateConfirmPassword(password, confirmPassword)
    return (
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      email.trim() !== "" &&
      phoneNumber.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      passError === "" &&
      confirmPassError === "" &&
      agreeToTerms
    )
  }

  // Handle sign up with integrated API
  const handleSignUp = async () => {
    // Front-end validation
    setFormSubmitted(true)
    setPasswordTouched(true)
    setConfirmPasswordTouched(true)
    const passwordErr = validatePassword(password)
    const confirmPasswordErr = validateConfirmPassword(password, confirmPassword)
    setPasswordError(passwordErr)
    setConfirmPasswordError(confirmPasswordErr)

    if (!isFormValid()) {
      Alert.alert("Error", "Please fill in all required fields correctly")
      return
    }

    setLoading(true)
    try {
      // Prepare user data for API
      const userData = {
        email: email.trim().toLowerCase(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phoneNumber.trim(),
        role: "buyer",
      }

      console.log("Registering user with data:", {
        ...userData,
        password: "[HIDDEN]", // Don't log passwords
      })

      // Call the API
      const response = await registerUser(userData)

      console.log("Registration API response:", response)

      // Handle successful registration - look for email token
      let emailToken = null
      let user = null

      // Try different possible response structures for email tokens
      if (response) {
        // Look for common token field names that might contain the email
        const possibleTokenFields = [
          "token",
          "email_token",
          "verification_token",
          "emailToken",
          "verificationToken",
          "email",
          "userEmail",
          "user_email",
        ]

        // Check direct response
        for (const field of possibleTokenFields) {
          if (response[field] && isValidEmailToken(response[field])) {
            emailToken = response[field]
            break
          }
        }

        // Check nested data structure
        if (!emailToken && response.data) {
          for (const field of possibleTokenFields) {
            if (response.data[field] && isValidEmailToken(response.data[field])) {
              emailToken = response.data[field]
              break
            }
          }
        }

        // Check auth object
        if (!emailToken && response.auth) {
          for (const field of possibleTokenFields) {
            if (response.auth[field] && isValidEmailToken(response.auth[field])) {
              emailToken = response.auth[field]
              break
            }
          }
        }

        // Check result object
        if (!emailToken && response.result) {
          for (const field of possibleTokenFields) {
            if (response.result[field] && isValidEmailToken(response.result[field])) {
              emailToken = response.result[field]
              break
            }
          }
        }

        // Get user data
        user = response.user || response.data?.user || response.auth?.user || response.result?.user || response
      }

      console.log(
        "Extracted email token:",
        emailToken ? `Valid email token: ${emailToken}` : "No valid email token found",
      )
      console.log("Extracted user:", user ? "User data found" : "No user data found")

      // Log all potential token fields for debugging
      console.log("All response fields:", Object.keys(response || {}))
      if (response?.data) console.log("Response.data fields:", Object.keys(response.data))
      if (response?.auth) console.log("Response.auth fields:", Object.keys(response.auth))

      if (emailToken && isValidEmailToken(emailToken)) {
        // Store the email token and user data
        await AsyncStorage.multiSet([
          ["@email_token", emailToken.trim()], // Store as email token instead of auth token
          ["@user_email", email.trim().toLowerCase()],
          ["@verification_email", emailToken.trim()], // Email to verify
          ["@user_role", "buyer"],
          ["@user_profile", JSON.stringify(user || {})],
          ["pendingVerificationEmail", emailToken.trim()], // For OTP verification
        ])

        console.log("Email token stored successfully, navigating to login...")

        // Navigate to verification screen with the email token
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "BuyerVerification", // Replace with your actual verification screen name
              params: {
                email: emailToken.trim(), // Use the email token for verification
              },
            },
          ],
        })
      } else {
        // Log detailed debugging information
        console.error("No valid email token found!")
        console.error("Response structure:", JSON.stringify(response, null, 2))

        // Check if registration was successful but no email token provided
        if (response && (response.success || response.message?.includes("success"))) {
          Alert.alert(
            "Registration Successful",
            "Your account has been created successfully. Please proceed to verify your email.",
            [
              {
                text: "Continue",
                onPress: () => {
                  // Navigate to verification with the original email
                  AsyncStorage.setItem("pendingVerificationEmail", email.trim().toLowerCase())
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: "BuyerLogin",
                      },
                    ],
                  })
                },
              },
            ],
          )
        } else {
          throw new Error("Registration completed but no email verification token was provided by the server.")
        }
      }
    } catch (error) {
      console.error("Registration error:", error)

      // Handle different types of errors
      let errorMessage = error.message || "Registration failed. Please try again."

      // Handle specific error cases
      if (error.message === "Network connection failed") {
        errorMessage = "Please check your internet connection and try again."
      } else if (error.message.includes("Email already exists")) {
        errorMessage = "This email is already registered. Please use a different email or try logging in."
      } else if (error.message.includes("Invalid email")) {
        errorMessage = "Please enter a valid email address."
      } else if (error.message.includes("Password")) {
        errorMessage = "Password does not meet requirements. Please check and try again."
      }

      Alert.alert("Registration Error", errorMessage)

      // Clear sensitive fields on error
      setPassword("")
      setConfirmPassword("")
      setPasswordTouched(false)
      setConfirmPasswordTouched(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <ArrowLeft size={24} color="#005045" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Create new account</Text>

        {/* First Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your first name"
            value={firstName}
            onChangeText={setFirstName}
            returnKeyType="next"
            onSubmitEditing={() => lastNameRef.current.focus()}
            blurOnSubmit={false}
            editable={!loading}
          />
          {formSubmitted && firstName.trim() === "" && <Text style={styles.errorText}>First name is required</Text>}
        </View>

        {/* Last Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Last Name</Text>
          <TextInput
            ref={lastNameRef}
            style={styles.input}
            placeholder="Enter your last name"
            value={lastName}
            onChangeText={setLastName}
            returnKeyType="next"
            onSubmitEditing={() => phoneNumberRef.current.focus()}
            blurOnSubmit={false}
            editable={!loading}
          />
          {formSubmitted && lastName.trim() === "" && <Text style={styles.errorText}>Last name is required</Text>}
        </View>

        {/* Phone Number Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            ref={phoneNumberRef}
            style={styles.input}
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current.focus()}
            blurOnSubmit={false}
            editable={!loading}
          />
          {formSubmitted && phoneNumber.trim() === "" && <Text style={styles.errorText}>Phone number is required</Text>}
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            ref={emailRef}
            style={styles.input}
            placeholder="Enter your email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current.focus()}
            blurOnSubmit={false}
            editable={!loading}
          />
          {formSubmitted && email.trim() === "" && <Text style={styles.errorText}>Email is required</Text>}
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              ref={passwordRef}
              style={styles.passwordInput}
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text)
                setPasswordTouched(true)
              }}
              secureTextEntry={!showPassword}
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordRef.current.focus()}
              blurOnSubmit={false}
              editable={!loading}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)} disabled={loading}>
              {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
            </TouchableOpacity>
          </View>
          {passwordTouched && passwordError !== "" && <Text style={styles.errorText}>{passwordError}</Text>}
          {formSubmitted && password.trim() === "" && <Text style={styles.errorText}>Password is required</Text>}
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              ref={confirmPasswordRef}
              style={styles.passwordInput}
              placeholder="Enter your confirm password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text)
                setConfirmPasswordTouched(true)
              }}
              secureTextEntry={!showConfirmPassword}
              returnKeyType="done"
              editable={!loading}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
            >
              {showConfirmPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
            </TouchableOpacity>
          </View>
          {confirmPasswordTouched && confirmPasswordError !== "" && (
            <Text style={styles.errorText}>{confirmPasswordError}</Text>
          )}
          {formSubmitted && confirmPassword.trim() === "" && (
            <Text style={styles.errorText}>Confirm password is required</Text>
          )}
        </View>

        {/* Terms and Conditions */}
        <TouchableOpacity
          style={styles.termsContainer}
          onPress={() => setAgreeToTerms(!agreeToTerms)}
          disabled={loading}
        >
          <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
            {agreeToTerms && <Check size={14} color="white" />}
          </View>
          <Text style={styles.termsText}>
            I've read and agreed to <Text style={styles.termsLink}>User Agreement</Text> and{" "}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>
        {formSubmitted && !agreeToTerms && (
          <Text style={[styles.errorText, { marginTop: -10, marginBottom: 10 }]}>You must agree to the terms</Text>
        )}

        {/* Sign Up Button */}
        <TouchableOpacity
          style={[styles.signUpButton, loading && styles.signUpButtonDisabled]}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="white" />
              <Text style={styles.signUpButtonText}>Creating account...</Text>
            </View>
          ) : (
            <Text style={styles.signUpButtonText}>Sign up</Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text style={styles.loginLink} onPress={() => !loading && navigation.navigate("Login")}>
              Back to Sign In
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginVertical: 20,
    paddingTop: 40,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 12,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 10,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#005045",
    borderColor: "#005045",
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  termsLink: {
    color: "#005045",
    fontWeight: "bold",
  },
  signUpButton: {
    backgroundColor: "#005045",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 10,
  },
  signUpButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  signUpButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loginContainer: {
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: "#666",
  },
  loginLink: {
    color: "#005045",
    fontWeight: "bold",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 12,
    marginTop: 4,
  },
})

export default SignUpScreen
