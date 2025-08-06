import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  BackHandler,
} from 'react-native';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { resetPassword } from '../../../services/api/auth/forgotPassword/forgotPassword'

const { width, height } = Dimensions.get('window');

const ResetPasswordScreen = ({ navigation }) => {
  // Password state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation state
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Refs for focus management
  const confirmPasswordRef = useRef(null);

  // Prevent going back after navigating away
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // Save the navigation action
      const action = e.data.action;

      // Set a flag in navigation state to prevent coming back
      if (action.type === 'NAVIGATE') {
        navigation.setParams({ hasVisited: true });
      }
    });

    return unsubscribe;
  }, [navigation]);

  // Block hardware back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (navigation.getParam('hasVisited')) {
        // If we've already visited and left this screen, don't allow going back
        return true; // Prevents default back behavior
      }
      return false; // Allow default back behavior
    });

    return () => backHandler.remove();
  }, []);

  // Validate password
  const validatePassword = (pass) => {
    if (pass.length < 8) {
      return "Must be at least 8 characters";
    }
    return "";
  };

  // Validate confirm password
  const validateConfirmPassword = (pass, confirmPass) => {
    if (pass !== confirmPass) {
      return "Both password must match";
    }
    return "";
  };

  // Handle password change
  const handlePasswordChange = (text) => {
    setPassword(text);
    setPasswordError(validatePassword(text));

    if (confirmPassword) {
      setConfirmPasswordError(validateConfirmPassword(text, confirmPassword));
    }
  };

  // Handle confirm password change
  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    setConfirmPasswordError(validateConfirmPassword(password, text));
  };

  // Handle change password
  const handleChangePassword = async () => {
    const passError = validatePassword(password);
    const confirmPassError = validateConfirmPassword(password, confirmPassword);

    setPasswordError(passError);
    setConfirmPasswordError(confirmPassError);

    if (passError || confirmPassError) {
      return; // Don't proceed if there are validation errors
    }

    try {
      setLoading(true);

      // Call the resetPassword API with token and new password
      const success = await resetPassword(token, password);

      if (success) {
        Alert.alert(
          'Success',
          'Your password has been reset successfully!'
        );

        // Navigate to login with reset flag
        navigation.replace("OwnerLogin", { resetComplete: true });
      }

    } catch (error) {
      Alert.alert(
        'Error',
        error.message || 'Failed to reset password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Check if button should be disabled
  const isButtonDisabled = !password || !confirmPassword ||
                          password.length < 8 ||
                          password !== confirmPassword;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Decorative Circles */}
      <View style={[styles.circle, styles.circle1]} />
      <View style={[styles.circle, styles.circle2]} />
      <View style={[styles.circle, styles.circle3]} />
      <View style={[styles.circle, styles.circle4]} />
      <View style={[styles.circle, styles.circle5]} />
      <View style={[styles.circle, styles.circle6]} />
      <View style={[styles.circle, styles.circle7]} />
      <View style={[styles.circle, styles.circle8]} />
      <View style={[styles.circle, styles.circle9]} />
      <View style={[styles.circle, styles.circle10]} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.backButtonCircle}>
            <ArrowLeft size={20} color="#000" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reset Password</Text>
      </View>

      <View style={styles.contentWrapper}>
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>Reset password</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Your new password must be different from the previously used password
          </Text>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
                placeholder=""
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordRef.current.focus()}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ?
                  <EyeOff size={20} color="#666" /> :
                  <Eye size={20} color="#666" />
                }
              </TouchableOpacity>
            </View>
            <Text style={[
              styles.validationText,
              passwordError ? styles.errorText : {}
            ]}>
              {passwordError || "Must be at least 8 characters"}
            </Text>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                ref={confirmPasswordRef}
                style={styles.passwordInput}
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                secureTextEntry={!showConfirmPassword}
                placeholder=""
                returnKeyType="done"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ?
                  <EyeOff size={20} color="#666" /> :
                  <Eye size={20} color="#666" />
                }
              </TouchableOpacity>
            </View>
            <Text style={[
              styles.validationText,
              confirmPasswordError ? styles.errorText : {}
            ]}>
              {confirmPasswordError || "Both password must match"}
            </Text>
          </View>
        </View>

        {/* Change Password Button */}
        <TouchableOpacity
          style={[
            styles.changeButton,
            isButtonDisabled ? styles.disabledButton : {}
          ]}
          onPress={handleChangePassword}
          disabled={isButtonDisabled}
        >
          <Text style={[
            styles.changeButtonText,
            isButtonDisabled ? styles.disabledButtonText : {}
          ]}>
            Change Password
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Decorative circles
  circle: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: '#6366f1',
    opacity: 0.1,
  },
  circle1: {
    width: 150,
    height: 150,
    top: -30,
    right: -30,
  },
  circle2: {
    width: 80,
    height: 80,
    top: height * 0.3,
    left: -20,
  },
  circle3: {
    width: 60,
    height: 60,
    top: height * 0.5,
    right: 30,
  },
  circle4: {
    width: 120,
    height: 120,
    bottom: -40,
    left: -40,
    backgroundColor: '#8A2BE2',
  },
  circle5: {
    width: 40,
    height: 40,
    top: 100,
    right: 60,
    backgroundColor: '#8A2BE2',
  },
  circle6: {
    width: 25,
    height: 25,
    top: height * 0.4,
    left: 40,
    backgroundColor: '#f59e0b', // Amber
    opacity: 0.15,
  },
  circle7: {
    width: 70,
    height: 70,
    bottom: 80,
    right: -20,
    backgroundColor: '#6366f1', // Purple
    opacity: 0.08,
  },
  circle8: {
    width: 50,
    height: 50,
    top: height * 0.25,
    right: 100,
    backgroundColor: '#10b981', // Emerald
    opacity: 0.12,
  },
  circle9: {
    width: 35,
    height: 35,
    bottom: height * 0.3,
    left: 80,
    backgroundColor: '#3b82f6', // Blue
    opacity: 0.1,
  },
  circle10: {
    width: 90,
    height: 90,
    top: 200,
    left: width / 2 - 45,
    backgroundColor: '#8b5cf6', // Violet
    opacity: 0.05,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
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
  validationText: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
  },
  errorText: {
    color: '#e53e3e',
  },
  changeButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    marginHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  changeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#fff',
    borderColor: '#000',
  },
  disabledButtonText: {
    color: '#000',
  },
});

export default ResetPasswordScreen;