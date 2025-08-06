'use client';

import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

export default function ForgotPasswordEmailEntry({navigation}) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendVerification = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Client-side validation
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      // Call the API function
      const success = await requestPasswordReset(email);

      if (success) {
        Alert.alert(
          'Success',
          `If an account exists with ${email}, you will receive a password reset link.`
        );
        navigation.navigate('ForgotVerification', { email });
      }

    } catch (error) {
      // Handle network errors
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Abstract background circles */}
      <View style={[styles.circle, styles.circle1]} />
      <View style={[styles.circle, styles.circle2]} />
      <View style={[styles.circle, styles.circle3]} />
      <View style={[styles.circle, styles.circle4]} />
      <View style={[styles.circle, styles.circle5]} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => console.log('Back button pressed')}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.mainTitle}>Email verification</Text>
        <Text style={styles.description}>
          Enter your email below to receive a verification code.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSendVerification}
          disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Sending...' : 'Send Verification'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50, // Adjust for status bar and notch
    position: 'relative',
  },
  // Abstract circles
  circle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.1,
  },
  circle1: {
    width: 100,
    height: 100,
    backgroundColor: '#E0BBE4', // Light purple
    top: 20,
    right: -30,
  },
  circle2: {
    width: 60,
    height: 60,
    backgroundColor: '#957DAD', // Medium purple
    top: 150,
    left: -20,
  },
  circle3: {
    width: 80,
    height: 80,
    backgroundColor: '#D291BC', // Pinkish purple
    bottom: 100,
    right: -40,
  },
  circle4: {
    width: 40,
    height: 40,
    backgroundColor: '#FFC72C', // Yellow/Orange
    top: 300,
    left: 50,
  },
  circle5: {
    width: 70,
    height: 70,
    backgroundColor: '#A7D9B2', // Light green
    top: 200,
    right: 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  backArrow: {
    fontSize: 24,
    marginRight: 15,
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'left',
    marginBottom: 40,
    lineHeight: 22,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 30,
    backgroundColor: '#f9f9f9',
  },
  button: {
    width: '90%',
    height: 55,
    backgroundColor: '#000',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#957DAD', // Medium purple border
    position: 'absolute', // Position at the bottom
    bottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'center', // This will center the button horizontally
  },
  buttonText: {
    color: '#fff', // White text for the button
    fontSize: 18,
    fontWeight: '600',
  },
});
