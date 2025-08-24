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
import { loginSeller } from '../../../services/api/auth/login/loginAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleLoginPress = async () => {
    // Basic validation
    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { accessToken, refreshToken, user } = await loginSeller(email, password);
      // Store tokens and user data
      await AsyncStorage.multiSet([
        ['accessToken', accessToken],
        ['refreshToken', refreshToken],
        ['user', JSON.stringify(user)]
      ]);
      // Navigate to owner dashboard
      navigation.navigate('OwnerNav');
    } catch (err) {
      let errorMessage = "An unexpected error occurred. Please try again.";

      // Check for common API error structures
      if (err.data && err.data.message) {
        // Handle specific API error messages
        const apiMessage = Array.isArray(err.data.message) ? err.data.message.join('\n') : err.data.message;
        if (apiMessage.includes("Invalid credentials") || apiMessage.includes("Invalid email or password")) {
          errorMessage = "Invalid email or password. Please try again.";
        } else if (apiMessage.includes("User not found") || apiMessage.includes("User not registered")) {
          errorMessage = "User not found. Please check your email or register a new account.";
        } else {
          errorMessage = apiMessage;
        }
      } else if (err.message.includes('network') || err.message.includes('Network')) {
        errorMessage = "Internet connection required. Please check your network.";
      } else {
        errorMessage = err.message;
      }

      setError(errorMessage);
      Alert.alert('Login Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80' }}
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
          <KeyboardAvoidingView // Wrap content that contains inputs
            style={styles.contentContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // 'padding' for iOS, 'height' for Android
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 10} // Adjust offset as needed
          >
            <View style={styles.textContainer}>
              <Text style={styles.title}>Welcome Owner</Text>
              <Text style={styles.subtitle}>
                Login to the app to continue from where you left off and to continue with you business tasks
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
              <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => navigation.navigate('EnterOwnerResetEmail')}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress} disabled={loading}>
                <Text style={styles.loginButtonText}>
                  {loading ? <ActivityIndicator color="#fff" /> : 'Login'}
                </Text>
              </TouchableOpacity>
              {/* Register link */}
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Don't have an Account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('RegisterOwner')}>
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
    top: 70,
    left: 20,
    zIndex: 10,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  contentContainer: {
    flex: 1, // Ensure it takes full height to allow KeyboardAvoidingView to work
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
    backgroundColor: '#8A2BE2', // Royal blue
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // New styles for register link
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  registerLink: {
    color: '#8A2BE2',
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF6347', // A distinct error color
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default LoginScreen;
