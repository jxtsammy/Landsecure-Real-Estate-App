import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Animated,
  Easing,
  Alert
} from 'react-native';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { resetPassword } from '../../../services/api/auth/forgotPassword/forgotPassword'
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const SecuritySettingsScreen = () => {
  const navigation = useNavigation();

  // Password states
  const [currentPassword, setCurrentPassword] = useState('••••••••••••••');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation states
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordLengthValid, setPasswordLengthValid] = useState(true);

  // Notification state
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('success'); // 'success' or 'error'
  const [notificationMessage, setNotificationMessage] = useState('');

  // Animation values
  const notificationAnim = useRef(new Animated.Value(0)).current;
  const checkmarkScale = useRef(new Animated.Value(0)).current;

  // Decorative circles data
  const decorativeCircles = [
    { size: 100, top: 120, right: -30, color: "rgba(138, 63, 252, 0.1)" },
    { size: 150, top: 300, left: -70, color: "rgba(138, 63, 252, 0.07)" },
    { size: 80, bottom: 100, right: 20, color: "rgba(138, 63, 252, 0.05)" },
    { size: 60, top: 450, left: 30, color: "rgba(138, 63, 252, 0.05)" },
    { size: 40, bottom: 200, right: 50, color: "rgba(138, 63, 252, 0.08)" },
    { size: 120, bottom: -40, left: -40, color: "rgba(138, 63, 252, 0.06)" },
  ];

  // Validate passwords when they change
  useEffect(() => {
    if (newPassword || confirmPassword) {
      setPasswordsMatch(newPassword === confirmPassword);
      setPasswordLengthValid(newPassword.length >= 8);
    } else {
      setPasswordsMatch(true);
      setPasswordLengthValid(true);
    }
  }, [newPassword, confirmPassword]);

  // Handle notification animation
  useEffect(() => {
    if (showNotification) {
      // Slide in notification
      Animated.timing(notificationAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5))
      }).start();

      // Animate checkmark or X
      Animated.sequence([
        Animated.delay(300),
        Animated.spring(checkmarkScale, {
          toValue: 1,
          friction: 4,
          tension: 100,
          useNativeDriver: true
        })
      ]).start();

      // Auto hide notification after 3 seconds
      const timer = setTimeout(() => {
        hideNotification();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  // Function to show notification
  const showSuccessNotification = (message) => {
    setNotificationType('success');
    setNotificationMessage(message);
    setShowNotification(true);
    checkmarkScale.setValue(0);
  };

  const showErrorNotification = (message) => {
    setNotificationType('error');
    setNotificationMessage(message);
    setShowNotification(true);
    checkmarkScale.setValue(0);
  };

  // Function to hide notification
  const hideNotification = () => {
    Animated.timing(notificationAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.in(Easing.ease)
    }).start(() => {
      setShowNotification(false);
    });
  };

  // Handle password change
  const handleChangePassword = async () => {
    // Validate passwords
    if (!newPassword || !confirmPassword) {
      showErrorNotification('Please fill in all password fields');
      return;
    }

    if (newPassword.length < 8) {
      showErrorNotification('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      showErrorNotification('Passwords do not match');
      return;
    }

    try {
      // Get the password reset token (you'll need to store this when the user requests a password change)
      const resetToken = await AsyncStorage.getItem('passwordResetToken');

      if (!resetToken) {
        throw new Error('Password reset session expired');
      }

      // Call the API to reset password
      const success = await resetPassword(resetToken, newPassword);

      if (success) {
        showSuccessNotification('Password changed successfully');

        // Clear sensitive data
        setNewPassword('');
        setConfirmPassword('');
        await AsyncStorage.removeItem('passwordResetToken');

        // Optional: Force re-login after password change
        navigation.navigate('Login');
      }

    } catch (error) {
      console.error('Password change error:', error);

      let errorMessage = 'Failed to change password';

      if (error.message.includes('Invalid or expired')) {
        errorMessage = 'This password reset link has expired. Please request a new one.';
      } else if (error.message.includes('Network error')) {
        errorMessage = 'Unable to connect. Please check your internet connection.';
      } else if (error.message.includes('session expired')) {
        errorMessage = 'Your password reset session has expired. Please start the process again.';
      }

      showErrorNotification(errorMessage);

      // If token is invalid, clear it
      if (error.message.includes('Invalid or expired') || error.message.includes('session expired')) {
        await AsyncStorage.removeItem('passwordResetToken');
      }
    }
  };

  // Render notification
  const renderNotification = () => {
    const translateY = notificationAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-100, 0]
    });

    return (
      <Animated.View
        style={[
          styles.notification,
          notificationType === 'success' ? styles.successNotification : styles.errorNotification,
          { transform: [{ translateY }] }
        ]}
      >
        <View style={styles.notificationContent}>
          <Animated.View style={{ transform: [{ scale: checkmarkScale }] }}>
            {notificationType === 'success' ? (
              <CheckCircle size={24} color="#fff" />
            ) : (
              <XCircle size={24} color="#fff" />
            )}
          </Animated.View>
          <Text style={styles.notificationText}>{notificationMessage}</Text>
        </View>
      </Animated.View>
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

      {/* Notification */}
      {showNotification && renderNotification()}

      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <View style={styles.backButtonCircle}>
              <ArrowLeft size={20} color="#000" />
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Security Settings</Text>
        </View>

        <View style={styles.content}>
          {/* Current Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Current Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={[styles.passwordInput, styles.disabledInput]}
                value={currentPassword}
                secureTextEntry={!showCurrentPassword}
                editable={false}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff size={20} color="#888" />
                ) : (
                  <Eye size={20} color="#888" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.subHeaderTitle}>Change Account Password</Text>

          {/* New Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>New Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                placeholder="Enter new password"
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff size={20} color="#888" />
                ) : (
                  <Eye size={20} color="#888" />
                )}
              </TouchableOpacity>
            </View>
            {!passwordLengthValid && newPassword.length > 0 && (
              <Text style={styles.errorText}>Password must be at least 8 characters</Text>
            )}
          </View>

          {/* Confirm New Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm New Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color="#888" />
                ) : (
                  <Eye size={20} color="#888" />
                )}
              </TouchableOpacity>
            </View>
            {!passwordsMatch && confirmPassword.length > 0 && (
              <Text style={styles.errorText}>Passwords do not match</Text>
            )}
          </View>

          {/* Change Password Button */}
          <TouchableOpacity
            style={[
              styles.changeButton,
              (!passwordsMatch || !passwordLengthValid || !newPassword || !confirmPassword) && styles.disabledButton
            ]}
            onPress={handleChangePassword}
            disabled={!passwordsMatch || !passwordLengthValid || !newPassword || !confirmPassword}
          >
            <Text style={styles.changeButtonText}>Change Password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  decorativeCircle: {
    position: 'absolute',
    zIndex: -1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
  },
  subHeaderTitle:{
    fontSize: 20,
    color: '#000',
    marginTop: 10,
    marginBottom: 25
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  disabledInput: {
    color: '#888',
    backgroundColor: '#f0f0f0',
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  changeButton: {
    backgroundColor: '#8A2BE2',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  disabledButton: {
    backgroundColor: '#8A2BE2',
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  notification: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  successNotification: {
    backgroundColor: '#4CAF50',
  },
  errorNotification: {
    backgroundColor: '#F44336',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
});

export default SecuritySettingsScreen;