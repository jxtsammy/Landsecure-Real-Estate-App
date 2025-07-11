"use client"

import { useState, useRef, useEffect } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Eye, EyeOff, Camera, User, Upload, Check, X, ArrowLeft } from "lucide-react-native"
import * as ImagePicker from "expo-image-picker"

const SignUpScreen = ({ navigation }) => {
  // Form state
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  // UI state
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [idImage, setIdImage] = useState(null)

  // Validation state
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Refs for focus management
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const confirmPasswordRef = useRef(null)

  // Password validation function
  const validatePassword = (pass) => {
    if (pass.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (!/[A-Z]/.test(pass)) {
      return "Password must contain at least one capital letter";
    }
    if (!/\d/.test(pass)) {
      return "Password must contain at least one number";
    }
    return "";
  };

  // Confirm password validation
  const validateConfirmPassword = (pass, confirmPass) => {
    if (pass !== confirmPass) {
      return "Passwords do not match";
    }
    return "";
  };

  // Update password validation when password changes
  useEffect(() => {
    if (passwordTouched) {
      setPasswordError(validatePassword(password));
    }
    
    if (confirmPasswordTouched && confirmPassword) {
      setConfirmPasswordError(validateConfirmPassword(password, confirmPassword));
    }
  }, [password, confirmPassword, passwordTouched, confirmPasswordTouched]);

  // Check if form is valid
  const isFormValid = () => {
    const passError = validatePassword(password)
    const confirmPassError = validateConfirmPassword(password, confirmPassword)

    return (
      fullName.trim() !== "" &&
      email.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      passError === "" &&
      confirmPassError === "" &&
      profileImage !== null &&
      idImage !== null &&
      agreeToTerms
    )
  }

  // Handle profile image picker
  const pickProfileImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()

    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant camera permissions to take a selfie")
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    })

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri)
    }
  }

  // Handle ID image picker
  const pickIdImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant media library permissions to upload ID")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    })

    if (!result.canceled) {
      setIdImage(result.assets[0].uri)
    }
  }

  // Handle sign up
  const handleSignUp = () => {
    setFormSubmitted(true)
    setPasswordTouched(true)
    setConfirmPasswordTouched(true)
    
    // Force validation before submission
    setPasswordError(validatePassword(password))
    setConfirmPasswordError(validateConfirmPassword(password, confirmPassword))

    if (isFormValid()) {
      navigation.navigate("BottomNav")
    } else {
      Alert.alert("Error", "Please fill in all required fields correctly")
    }
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <ArrowLeft size={24} color="#005045" />
      </TouchableOpacity>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Create new account</Text>

        {/* Profile Image Picker */}
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageWrapper}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <User size={60} color="#005045" />
            )}
          </View>
          <TouchableOpacity style={styles.cameraButton} onPress={pickProfileImage}>
            <Camera size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.profileImageText}>Take a selfie for verification</Text>
          {formSubmitted && !profileImage && <Text style={styles.errorText}>Selfie is required</Text>}
        </View>

        {/* Full Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current.focus()}
            blurOnSubmit={false}
          />
          {formSubmitted && fullName.trim() === "" && <Text style={styles.errorText}>Full name is required</Text>}
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
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
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
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
            </TouchableOpacity>
          </View>
          {confirmPasswordTouched && confirmPasswordError !== "" && (
            <Text style={styles.errorText}>{confirmPasswordError}</Text>
          )}
          {formSubmitted && confirmPassword.trim() === "" && <Text style={styles.errorText}>Confirm password is required</Text>}
        </View>


        {/* ID Upload */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Government ID</Text>
          <TouchableOpacity style={styles.idUploadButton} onPress={pickIdImage}>
            <Upload size={20} color="#005045" />
            <Text style={styles.idUploadText}>{idImage ? "ID Uploaded" : "Upload a photo of your government ID"}</Text>
          </TouchableOpacity>
          {idImage && (
            <View style={styles.idPreviewContainer}>
              <Image source={{ uri: idImage }} style={styles.idPreview} />
              <TouchableOpacity style={styles.removeIdButton} onPress={() => setIdImage(null)}>
                <X size={16} color="white" />
              </TouchableOpacity>
            </View>
          )}
          {formSubmitted && !idImage && <Text style={styles.errorText}>Government ID is required</Text>}
        </View>

        {/* Terms and Conditions */}
        <TouchableOpacity style={styles.termsContainer} onPress={() => setAgreeToTerms(!agreeToTerms)}>
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
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Sign up</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text style={styles.loginLink} onPress={() => navigation.navigate("Login")}>
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
    position: 'absolute',
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
    paddingTop: 40
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraButton: {
    position: "absolute",
    bottom: 25,
    right: "35%",
    backgroundColor: "#000",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  profileImageText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
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
  idUploadButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f9f9f9",
  },
  idUploadText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#666",
  },
  idPreviewContainer: {
    marginTop: 10,
    position: "relative",
  },
  idPreview: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    resizeMode: "cover",
  },
  removeIdButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
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
  signUpButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
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