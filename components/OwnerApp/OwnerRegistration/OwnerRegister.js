'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Image,
  Dimensions,
  Modal,
  Animated,
  Easing,
  Alert,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import {
  Eye,
  EyeOff,
  ArrowLeft,
  CheckSquare,
  Square,
  Upload,
  Pencil,
  User,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
const { width, height } = Dimensions.get('window');

// Decorative circles data
const decorativeCircles = [
  { size: 120, top: 80, right: -40, color: 'rgba(138, 63, 252, 0.08)' },
  { size: 180, top: 250, left: -80, color: 'rgba(138, 63, 252, 0.05)' },
  { size: 100, bottom: 150, right: 30, color: 'rgba(138, 63, 252, 0.07)' },
  { size: 70, top: 400, left: 20, color: 'rgba(138, 63, 252, 0.06)' },
  { size: 50, bottom: 250, right: 60, color: 'rgba(138, 63, 252, 0.09)' },
  { size: 140, bottom: -60, left: -50, color: 'rgba(138, 63, 252, 0.04)' },
  { size: 85, top: 180, right: width / 2, color: 'rgba(138, 63, 252, 0.03)' },
  {
    size: 110,
    top: height / 2,
    left: width / 3,
    color: 'rgba(138, 63, 252, 0.05)',
  },
];

const AuthScreens = ({ navigation }) => {
  // State for form inputs and screen navigation
  const [currentScreen, setCurrentScreen] = useState('createAccount'); // 'createAccount', 'verifyCode', 'completeProfileAndID'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nationalID, setNationalID] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [frontIDImage, setFrontIDImage] = useState(null);
  const [backIDImage, setBackIDImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [progress, setProgress] = useState(new Animated.Value(0));

  // Refs for verification code inputs
  const codeInputRefs = useRef([]);

  // Initialize refs for the 4 verification code inputs
  useEffect(() => {
    codeInputRefs.current = Array(4)
      .fill()
      .map((_, i) => codeInputRefs.current[i] || React.createRef());
  }, []);

  // Request camera and storage permissions for Android
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);

        if (
          granted['android.permission.CAMERA'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('All permissions granted');
          return true;
        } else {
          console.log('Some permissions denied');
          Alert.alert(
            'Permissions Required',
            'Please grant camera and storage permissions to upload images',
            [{ text: 'OK' }]
          );
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS handles permissions differently
  };

  // Function to open the system gallery
  const openSystemGallery = async (callback) => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      // Use Expo Image Picker to directly open the system gallery
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImageUri = result.assets[0].uri;
        console.log('Selected image URI:', selectedImageUri);
        callback(selectedImageUri);
      } else {
        console.log('Image selection cancelled');
      }
    } catch (error) {
      console.error('Error opening gallery:', error);
      Alert.alert('Error', 'Failed to open gallery. Please try again.');
    }
  };

  // Function to handle verification code input with auto-focus
  const handleCodeChange = (text, index) => {
    // Only allow digits
    if (!/^\d*$/.test(text)) return;

    const newCode = [...verificationCode];
    newCode[index] = text;
    setVerificationCode(newCode);

    // Auto-focus next input if current input is filled
    if (text.length === 1 && index < 3) {
      codeInputRefs.current[index + 1].focus();
    }
  };

  // Function to handle sign up button press
  const handleSignUp = () => {
    console.log('Sign Up pressed with:', {
      email,
      nationalID,
      gender,
      password,
      confirmPassword,
      agreeToTerms,
    });
    // In a real app, you would validate inputs and make an API call
    setCurrentScreen('verifyCode');
  };

  // Function to handle verify button press
  const handleVerify = () => {
    const code = verificationCode.join('');
    console.log('Verify pressed with code:', code);
    // In a real app, you would validate the code and proceed to the next step
    setCurrentScreen('completeProfileAndID');
  };

  // Function to handle complete registration button press
  const handleCompleteRegistration = () => {
    console.log('Complete Registration pressed with:', {
      name,
      phoneNumber,
      gender,
      profileImage,
      frontIDImage,
      backIDImage,
    });

    // Show loading modal with progress animation
    setShowLoadingModal(true);

    // Animate progress
    Animated.timing(progress, {
      toValue: 1,
      duration: 3000, // 3 seconds
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      // After animation completes
      setTimeout(() => {
        setShowLoadingModal(false);
        // Navigate to the next screen (home screen in a real app)
        Alert.alert(
          'Registration Complete',
          'Your account has been created successfully!',
          [
            {
              text: 'Continue',
              onPress: () => navigation.navigate('OwnerNav'),
            },
          ]
        );
      }, 500);
    });
  };

  // Function to open image picker for ID uploads
  const handleIDUpload = (side) => {
    openSystemGallery((imageUri) => {
      if (side === 'front') {
        setFrontIDImage(imageUri);
      } else {
        setBackIDImage(imageUri);
      }
    });
  };

  // Function to open image picker for profile image
  const handleProfileImageUpload = () => {
    openSystemGallery((imageUri) => {
      setProfileImage(imageUri);
    });
  };

  // Render the step indicator
  const renderStepIndicator = () => {
    const totalSteps = 3;
    let currentStep;

    switch (currentScreen) {
      case 'createAccount':
        currentStep = 1;
        break;
      case 'verifyCode':
        currentStep = 2;
        break;
      case 'completeProfileAndID':
        currentStep = 3;
        break;
      default:
        currentStep = 1;
    }

    return (
      <View style={styles.stepIndicatorContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isPast = stepNumber < currentStep;

          return (
            <View key={index} style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  isActive && styles.activeStepCircle,
                  isPast && styles.pastStepCircle,
                ]}>
                <Text
                  style={[
                    styles.stepNumber,
                    (isActive || isPast) && styles.activeStepNumber,
                  ]}>
                  {stepNumber}
                </Text>
              </View>
              {index < totalSteps - 1 && (
                <View
                  style={[styles.stepLine, isPast && styles.activeStepLine]}
                />
              )}
            </View>
          );
        })}
      </View>
    );
  };

  // Render the Create Account screen
  const renderCreateAccountScreen = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Fill your information below to create your account.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
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
          <Text style={styles.inputLabel}>Gender</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your gender"
            value={gender}
            onChangeText={setGender}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>National ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your national ID number"
            value={nationalID}
            onChangeText={setNationalID}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••••••••"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.passwordVisibilityButton}
              onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={20} color="#000" />
              ) : (
                <Eye size={20} color="#000" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Confirm Password</Text>
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
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? (
                <EyeOff size={20} color="#000" />
              ) : (
                <Eye size={20} color="#000" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.termsContainer}
          onPress={() => setAgreeToTerms(!agreeToTerms)}>
          {agreeToTerms ? (
            <CheckSquare size={20} color="#8A2BE2" />
          ) : (
            <Square size={20} color="#8A2BE2" />
          )}
          <Text style={styles.termsText}>
            Agree with <Text style={styles.termsLink}>Terms & Condition</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, !agreeToTerms && styles.disabledButton]}
          onPress={handleSignUp}
          disabled={!agreeToTerms}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('OwnerLogin')}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  // Render the Verify Code screen
  const renderVerifyCodeScreen = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentScreen('createAccount')}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Verify Code</Text>
        <Text style={styles.subtitle}>
          Please enter the code we just sent to email{'\n'}
          <Text style={styles.emailHighlight}>
            {email || 'example@gmail.com'}
          </Text>
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
                if (nativeEvent.key === 'Backspace' && !digit && index > 0) {
                  codeInputRefs.current[index - 1].focus();
                }
              }}
            />
          ))}
        </View>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive OTP?</Text>
          <TouchableOpacity>
            <Text style={styles.resendLink}>Resend code</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleVerify}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  // Render the Complete Profile and ID Upload screen
  const renderCompleteProfileAndIDScreen = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentScreen('verifyCode')}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>
          Don't worry, only you can see your personal data. No one else will be
          able to see it.
        </Text>

        <View style={styles.profileImageContainer}>
          <TouchableOpacity
            style={styles.profileImageWrapper}
            onPress={handleProfileImageUpload}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <User size={40} color="#888" />
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileImageEditButton}
            onPress={handleProfileImageUpload}>
            <Pencil size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <View style={styles.sectionDivider} />

        <Text style={styles.sectionTitle}>Upload ID Documents</Text>
        <Text style={styles.sectionSubtitle}>
          Please upload clear images of the front and back of your national ID
          card.
        </Text>

        <View style={styles.idUploadContainer}>
          <Text style={styles.inputLabel}>Front of ID</Text>
          <TouchableOpacity
            style={styles.idUploadBox}
            onPress={() => handleIDUpload('front')}>
            {frontIDImage ? (
              <Image source={{ uri: frontIDImage }} style={styles.idImage} />
            ) : (
              <>
                <Upload size={24} color="#8A2BE2" />
                <Text style={styles.idUploadText}>
                  Tap to upload from gallery
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.idUploadContainer}>
          <Text style={styles.inputLabel}>Back of ID</Text>
          <TouchableOpacity
            style={styles.idUploadBox}
            onPress={() => handleIDUpload('back')}>
            {backIDImage ? (
              <Image source={{ uri: backIDImage }} style={styles.idImage} />
            ) : (
              <>
                <Upload size={24} color="#8A2BE2" />
                <Text style={styles.idUploadText}>
                  Tap to upload from gallery
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.idUploadNote}>
          Your ID documents are securely stored and will only be used for
          verification purposes.
        </Text>

        <TouchableOpacity
          style={[
            styles.button,
            (!name || !profileImage || !frontIDImage || !backIDImage) &&
              styles.disabledButton,
          ]}
          onPress={handleCompleteRegistration}
          disabled={!name || !profileImage || !frontIDImage || !backIDImage}>
          <Text style={styles.buttonText}>Complete Registration</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  // Render the loading modal with progress animation
  const renderLoadingModal = () => {
    // Convert progress value to degrees for rotation
    const progressRotation = progress.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <Modal transparent={true} visible={showLoadingModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingTitle}>Creating Your Account</Text>

            <View style={styles.progressContainer}>
              <Animated.View
                style={[
                  styles.progressCircle,
                  { transform: [{ rotate: progressRotation }] },
                ]}
              />
              <View style={styles.progressCenter} />
            </View>

            <Text style={styles.loadingText}>
              Please wait while we set up your account...
            </Text>
          </View>
        </View>
      </Modal>
    );
  };

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

      {currentScreen === 'createAccount' && renderCreateAccountScreen()}
      {currentScreen === 'verifyCode' && renderVerifyCodeScreen()}
      {currentScreen === 'completeProfileAndID' &&
        renderCompleteProfileAndIDScreen()}

      {renderLoadingModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  // Decorative circle style
  decorativeCircle: {
    position: 'absolute',
    zIndex: -1,
  },
  // Step indicator styles
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 5,
    zIndex: 1,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activeStepCircle: {
    backgroundColor: '#8A2BE2',
  },
  pastStepCircle: {
    backgroundColor: '#8A2BE2',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
  activeStepNumber: {
    color: '#fff',
  },
  stepLine: {
    width: 100,
    height: 2,
    backgroundColor: '#f0f0f0',
  },
  activeStepLine: {
    backgroundColor: '#8A2BE2',
  },
  // Common styles
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 25,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#f7f7f9',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#8A2BE2',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#d0c5e8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Create Account screen styles
  passwordInputContainer: {
    flexDirection: 'row',
    backgroundColor: '#f7f7f9',
    borderRadius: 8,
    alignItems: 'center',
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  termsText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  termsLink: {
    color: '#8A2BE2',
    fontWeight: '500',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signInText: {
    color: '#666',
  },
  signInLink: {
    color: '#8A2BE2',
    fontWeight: '500',
  },
  // Verify Code screen styles
  emailHighlight: {
    color: '#8A2BE2',
    fontWeight: '500',
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 30,
  },
  codeInput: {
    width: 70,
    height: 60,
    backgroundColor: '#f7f7f9',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  resendText: {
    color: '#666',
  },
  resendLink: {
    color: '#8A2BE2',
    fontWeight: '500',
    marginLeft: 5,
  },
  // Complete Profile and ID Upload screen styles
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  profileImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f7f7f9',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageEditButton: {
    position: 'absolute',
    bottom: 0,
    right: width / 2 - 75,
    backgroundColor: '#8A2BE2',
    width: 40,
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  // ID Upload styles
  idUploadContainer: {
    marginBottom: 20,
  },
  idUploadBox: {
    height: 120,
    backgroundColor: '#f7f7f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  idUploadText: {
    marginTop: 8,
    color: '#666',
  },
  idImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  idUploadNote: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
  },
  // Loading modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    width: width * 0.8,
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  progressContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderTopColor: '#8A2BE2',
    borderRightColor: '#8A2BE2',
    borderBottomColor: '#d0c5e8',
    borderLeftColor: '#d0c5e8',
  },
  progressCenter: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default AuthScreens;
