import React from 'react';
import { 
  View, 
  Text, 
  ImageBackground, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar, 
  SafeAreaView,
  Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground 
        // Using a different real estate property image
        source={{ uri: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' }} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.contentContainer}>
          <View style={styles.overlay} />
          
          <View style={styles.content}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>
                Stay Ahead of the Curve: Lands & Home Assured!
              </Text>
              <Text style={styles.subtitle}>
                Our app turns you into a savvy property enthusiast, providing you with the knowledge to make informed decisions.
              </Text>
            </View>
            
            <View style={styles.footer}>
              <TouchableOpacity onPress={() => navigation.navigate("UserType")}>
                <Text style={styles.skipButton}>Skip</Text>
              </TouchableOpacity>
              
              <View style={styles.dotsContainer}>
                <View style={[styles.dot, styles.activeDot]} />
                <View style={styles.dot} />
              </View>
              
              <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate("Onboarding2")}>
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
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
  contentContainer: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Slightly darker overlay for better text readability
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  textContainer: {
    marginBottom: 60,
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
    lineHeight: 22,
  },
  footer: {
     width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    color: '#6366F1',
    fontSize: 16,
    fontWeight: '500',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    left:15
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'white',
  },
  nextButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  nextButtonText: {
    color: '#6366F1',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SplashScreen;