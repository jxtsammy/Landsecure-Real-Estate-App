"use client"

import { useEffect, useRef } from "react"
import { View, StyleSheet, Animated, Easing, ImageBackground, Dimensions, StatusBar, Image } from "react-native"
import { BlurView } from "expo-blur"

const { width, height } = Dimensions.get("window")

const LandSecureSplash = ({ navigation }) => {
  // Animation values for the three dots
  const dot1Animation = useRef(new Animated.Value(0)).current
  const dot2Animation = useRef(new Animated.Value(0)).current
  const dot3Animation = useRef(new Animated.Value(0)).current

  // Animation sequence counter
  const animationSequenceCount = useRef(0)

  useEffect(() => {
    // Start the animation and set a timer to navigate after 5 seconds
    startAnimationSequence()

    // Navigate to the next screen after 5 seconds
    const navigationTimer = setTimeout(() => {
      navigation.navigate("Onboarding1")
    }, 5000)

    // Clear the timer if component unmounts
    return () => clearTimeout(navigationTimer)
  }, [])

  const startAnimationSequence = () => {
    // Reset animations
    dot1Animation.setValue(0)
    dot2Animation.setValue(0)
    dot3Animation.setValue(0)

    // Start bounce animation
    const bounceDots = Animated.stagger(300, [
      Animated.sequence([
        Animated.timing(dot1Animation, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.bounce),
          useNativeDriver: true,
        }),
        Animated.timing(dot1Animation, {
          toValue: 0,
          duration: 400,
          easing: Easing.in(Easing.bounce),
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(dot2Animation, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.bounce),
          useNativeDriver: true,
        }),
        Animated.timing(dot2Animation, {
          toValue: 0,
          duration: 400,
          easing: Easing.in(Easing.bounce),
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(dot3Animation, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.bounce),
          useNativeDriver: true,
        }),
        Animated.timing(dot3Animation, {
          toValue: 0,
          duration: 400,
          easing: Easing.in(Easing.bounce),
          useNativeDriver: true,
        }),
      ]),
    ])

    // Run the bounce animation and repeat it
    Animated.loop(
      bounceDots,
      { iterations: 10 }, // Set a high number to ensure it runs for the full 5 seconds
    ).start()
  }

  // Interpolate bounce animations
  const dot1TranslateY = dot1Animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  })

  const dot2TranslateY = dot2Animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  })

  const dot3TranslateY = dot3Animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  })

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        }}
        style={styles.backgroundImage}
      >
        <BlurView intensity={15} style={styles.blurContainer}>
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              {/* Replace text logo with image */}
              <Image source={require("../../assets/Landsecure.png")} style={styles.logoImage} resizeMode="contain" />
            </View>

            {/* Moved dots to bottom of screen */}
            <View style={styles.dotsContainer}>
              <View style={styles.bouncingDotsContainer}>
                <Animated.View
                  style={[
                    styles.dot,
                    {
                      transform: [{ translateY: dot1TranslateY }],
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.dot,
                    {
                      transform: [{ translateY: dot2TranslateY }],
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.dot,
                    {
                      transform: [{ translateY: dot3TranslateY }],
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        </BlurView>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  blurContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 50, 
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 500, 
    height: 300, 
    top: 20
  },
  dotsContainer: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  bouncingDotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 20,
    width: 120,
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 30,
    backgroundColor: "white",
    margin: 5,
  },
})

export default LandSecureSplash