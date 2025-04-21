import React, { useState, useRef, useEffect } from 'react';
import { 
  SafeAreaView, 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StatusBar,
  Dimensions,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

// ForgotPassword Screen
const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const isEmailValid = email && email.includes('@') && email.includes('.');

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView style={styles.content} bounces={false}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' }} 
            style={styles.headerImage} 
            resizeMode="cover"
          />
          
          <View style={styles.formContainer}>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              Forgot Password, a digital key to regain access, navigating security hurdles in the ever-changing world of authentication.
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter your email"
              />
            </View>
            
            <TouchableOpacity 
              style={[
                styles.primaryButton,
                !isEmailValid && styles.disabledButton
              ]}
              onPress={() => navigation.navigate('OTPVerification')}
              disabled={!isEmailValid}
            >
              <Text style={[
                styles.buttonText,
                !isEmailValid && styles.disabledButtonText
              ]}>Send Code</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.linkButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.linkText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

// OTP Verification Screen
const OTPVerificationScreen = ({ navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = useRef([]);
  
  // Initialize refs for OTP inputs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 4);
    // Focus first input on mount
    setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 100);
  }, []);

  // Countdown timer for resend button
  useEffect(() => {
    let timer;
    if (countdown > 0 && isResendDisabled) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, isResendDisabled]);

  const handleOtpChange = (value, index) => {
    // Only allow numbers
    if (!/^[0-9]?$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus to next input if a digit was entered
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace to move to previous input
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResend = () => {
    if (!isResendDisabled) {
      // Reset OTP fields
      setOtp(['', '', '', '']);
      // Reset countdown
      setCountdown(60);
      setIsResendDisabled(true);
      // Focus first input
      inputRefs.current[0].focus();
      // Here you would typically call your API to resend the OTP
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView style={styles.content} bounces={false}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' }} 
            style={styles.headerImage} 
            resizeMode="cover"
          />
          
          <View style={styles.formContainer}>
            <Text style={styles.title}>Enter Your OTP</Text>
            <Text style={styles.subtitle}>
              Enter Your OTP prompts the crucial moment of authentication, where a single code bridges the gap between access and security.
            </Text>
            
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => inputRefs.current[index] = ref}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              ))}
            </View>
            
            <TouchableOpacity 
              onPress={handleResend}
              disabled={isResendDisabled}
            >
              <Text style={[
                styles.resendText,
                isResendDisabled ? styles.resendDisabled : styles.resendEnabled
              ]}>
                {isResendDisabled 
                  ? `Resend Code in ${countdown} Sec` 
                  : 'Resend Code'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.primaryButton,
                !isOtpComplete && styles.disabledButton
              ]}
              onPress={() => navigation.navigate('ResetPassword')}
              disabled={!isOtpComplete}
            >
              <Text style={[
                styles.buttonText,
                !isOtpComplete && styles.disabledButtonText
              ]}>Verify</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

// Reset Password Screen
const ResetPasswordScreen = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isFormValid = newPassword.length >= 6 && newPassword === confirmPassword;

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView style={styles.content} bounces={false}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' }} 
            style={styles.headerImage} 
            resizeMode="cover"
          />
          
          <View style={styles.formContainer}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Reset Password signifies the gateway to reclaiming control over digital identity, offering a fresh start amidst the chaos of forgotten credentials.
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                  placeholder="Enter new password"
                />
                <TouchableWithoutFeedback onPress={() => setShowNewPassword(!showNewPassword)}>
                  <Icon 
                    name={showNewPassword ? "eye" : "eye-off"} 
                    size={20} 
                    color="#888" 
                    style={styles.eyeIcon}
                  />
                </TouchableWithoutFeedback>
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  placeholder="Confirm new password"
                />
                <TouchableWithoutFeedback onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Icon 
                    name={showConfirmPassword ? "eye" : "eye-off"} 
                    size={20} 
                    color="#888" 
                    style={styles.eyeIcon}
                  />
                </TouchableWithoutFeedback>
              </View>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.primaryButton,
                !isFormValid && styles.disabledButton
              ]}
              onPress={() => navigation.navigate('Login')}
              disabled={!isFormValid}
            >
              <Text style={[
                styles.buttonText,
                !isFormValid && styles.disabledButtonText
              ]}>Reset Password</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const Stack = createNativeStackNavigator();

const App = () => {
  return (
      <Stack.Navigator 
        initialRouteName="ForgotPassword"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  headerImage: {
    width: '100%',
    height: 350,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  formContainer: {
    flex: 1,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24, // Extra padding at bottom for iOS
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 12,
  },
  primaryButton: {
    backgroundColor: '#088a6a',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#088a6a',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: '#fff',
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 16,
    padding: 8,
  },
  linkText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '500',
    textDecorationStyle:'underline'
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 24,
  },
  otpInput: {
    width: (width - 120) / 4,
    height: 56,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '500',
    color: '#333',
  },
  resendText: {
    textAlign: 'center',
    marginBottom: 24,
    padding: 8,
  },
  resendDisabled: {
    color: '#999',
  },
  resendEnabled: {
    color: '#000',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export default App;