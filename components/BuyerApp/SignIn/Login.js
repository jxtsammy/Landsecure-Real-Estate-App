import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator, // Added for loading state
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import { loginBuyer } from '../../../services/api/auth/login/loginAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set greeting based on time of day
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      setGreeting('Good Morning');
    } else if (currentHour >= 12 && currentHour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  const handleLogin = async () => {
    // Basic validation
    if (!email.trim() || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const { token, user } = await loginBuyer(email, password);
      // Store authentication data
      await AsyncStorage.multiSet([
        ['@auth_token', token],
        ['@user_role', 'buyer'],
        ['@user_email', email]
      ]);

      // Navigate to the main app screen
      navigation.reset({
        index: 0,
        routes: [{ name: "BottomNav" }],
      });
    } catch (error) {
      let alertMessage = "An unexpected error occurred. Please try again.";

      // Check for common API error structures
      if (error.data && error.data.message) {
        // Handle specific API error messages
        const apiMessage = Array.isArray(error.data.message) ? error.data.message.join('\n') : error.data.message;
        if (apiMessage.includes("Invalid credentials") || apiMessage.includes("Invalid email or password")) {
          alertMessage = "Invalid email or password. Please try again.";
        } else if (apiMessage.includes("User not found") || apiMessage.includes("User not registered")) {
          alertMessage = "User not found. Please check your email or register a new account.";
        } else {
          alertMessage = apiMessage;
        }
      } else if (error.message.includes('network') || error.message.includes('Network')) {
        alertMessage = "Internet connection required. Please check your network.";
      } else {
        alertMessage = error.message;
      }

      Alert.alert("Login Error", alertMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1464082354059-27db6ce50048?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          {/* Back Button with circular background */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('UserType')}
          >
            <View style={styles.backButtonCircle}>
              <ArrowLeft size={20} color="#000" />
            </View>
          </TouchableOpacity>

          <KeyboardAvoidingView // Wrapped the main content for keyboard avoidance
            style={styles.contentContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 10}
          >
            <View style={styles.textContainer}>
              <Text style={styles.title}>{greeting}</Text>
              <Text style={styles.subtitle}>
                Login to discover tons of verified lands and properties ready for sale, all in one app
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
              <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
                <Text style={styles.loginButtonText}>
                  {loading ? <ActivityIndicator color="#fff" /> : "Login"}
                </Text>
              </TouchableOpacity>
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("BuyerRegister")}>
                  <Text style={styles.registerLink}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    top: 15
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
    paddingTop: StatusBar.currentHeight || 0,
  },
  textContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
  },
  formContainer: {
    width: '100%',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    padding: 16,
    color: 'white',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#088a6a',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  registerLink: {
    color: '#088a6a',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
