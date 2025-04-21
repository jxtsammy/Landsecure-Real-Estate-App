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
import { ArrowLeft } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const VerificationScreen = ({ navigation, route }) => {
  // You can pass the email through route params
  const { email = 'flowr****@gmail.com' } = route?.params || {};
  
  // State for verification code (4 digits)
  const [code, setCode] = useState(['', '', '', '']);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds = 1 minute
  const [timerActive, setTimerActive] = useState(true);
  
  // Refs for input fields
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

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

  // Timer effect
  useEffect(() => {
    let interval = null;
    
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle input change
  const handleInputChange = (text, index) => {
    // Only allow numbers
    if (/^[0-9]?$/.test(text)) {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);
      
      // Auto focus to next input if a digit was entered
      if (text !== '' && index < 3) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  // Handle backspace key
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && code[index] === '') {
      inputRefs[index - 1].current.focus();
    }
  };

  // Resend code function
  const handleResend = () => {
    // Reset timer
    setTimeLeft(60);
    setTimerActive(true);
    
    // Clear inputs
    setCode(['', '', '', '']);
    
    // Focus first input
    inputRefs[0].current.focus();
    
    // Here you would call your API to resend the code
    console.log('Resending verification code...');
  };

  // Verify account function
  const handleVerify = () => {
    const verificationCode = code.join('');
    if (verificationCode.length === 4) {
      // Here you would call your API to verify the code
      console.log('Verifying code:', verificationCode);
      // Navigate to next screen on success and prevent coming back
      navigation.navigate("OwnerPasswordReset", { verificationComplete: true });
    }
  };

  // Check if button should be disabled
  const isButtonDisabled = code.some(digit => digit === '');

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
        <Text style={styles.headerTitle}>Verification</Text>
      </View>
      
      <View style={styles.contentWrapper}>
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>Email verification</Text>
          
          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Enter the verification code we send you on:
          </Text>
          <Text style={styles.email}>{email}</Text>
          
          {/* Verification Code Inputs */}
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputRefs[index]}
                style={[
                  styles.codeInput,
                  digit ? styles.codeInputFilled : {},
                  index === 2 ? styles.codeInputActive : {}
                ]}
                value={digit}
                onChangeText={(text) => handleInputChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="numeric"
                maxLength={1}
                selectTextOnFocus
                autoFocus={index === 0}
              />
            ))}
          </View>
          
          {/* Resend Code */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive code? </Text>
            <TouchableOpacity 
              onPress={handleResend}
              disabled={timerActive}
            >
              <Text style={[
                styles.resendButton,
                timerActive ? styles.resendButtonDisabled : {}
              ]}>
                Resend
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Timer */}
          <View style={styles.timerContainer}>
            <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
          </View>
        </View>
        
        {/* Verify Button */}
        <TouchableOpacity 
          style={[
            styles.verifyButton,
            isButtonDisabled ? styles.disabledButton : {}
          ]}
          onPress={handleVerify}
          disabled={isButtonDisabled}
        >
          <Text style={[
            styles.verifyButtonText,
            isButtonDisabled ? styles.disabledButtonText : {}
          ]}>
            Verify Account
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
  // New circles
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
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 25,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  codeInput: {
    width: width * 0.15,
    height: width * 0.15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  codeInputFilled: {
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  codeInputActive: {
    borderColor: '#ddd',
    borderWidth: 1,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  resendButton: {
    fontSize: 14,
    color: '#8A2BE2',
    fontWeight: '500',
  },
  resendButtonDisabled: {
    color: '#aaa',
  },
  timerContainer: {
    alignItems: 'center',
  },
  timer: {
    fontSize: 14,
    color: '#666',
  },
  verifyButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    marginHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  verifyButtonText: {
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

export default VerificationScreen;