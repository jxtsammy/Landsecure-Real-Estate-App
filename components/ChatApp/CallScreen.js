"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
} from "react-native"
import { ArrowLeft, Mic, MicOff, Video, Volume2, VolumeX, PhoneOff } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"

const { width, height } = Dimensions.get("window")

const CallScreen = ({ route }) => {
  const navigation = useNavigation()
  const { chat } = route.params
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(false)

  // Decorative circles data
  const decorativeCircles = [
    // Big circles
    { size: 220, top: height * 0.05, left: -100, color: "rgba(138, 43, 226, 0.1)" },
    { size: 180, top: height * 0.35, right: -90, color: "rgba(138, 43, 226, 0.2)" },
    { size: 200, bottom: -80, left: width * 0.06, color: "rgba(138, 43, 226, 0.4)" },
    
    // Small circles
    { size: 70, top: height * 0.2, right: 30, color: "rgba(138, 43, 226, 0.07)" },
    { size: 50, top: height * 0.5, left: 20, color: "rgba(138, 43, 226, 0.09)" },
    { size: 60, bottom: 150, right: 40, color: "rgba(138, 43, 226, 0.08)" },
    { size: 40, bottom: 220, left: 50, color: "rgba(138, 43, 226, 0.1)" },
  ]

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn)
  }

  const endCall = () => {
    navigation.goBack()
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
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

        <View style={styles.header}>
          <TouchableOpacity onPress={endCall} style={styles.backButton}>
            <ArrowLeft color="#000" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.callInfoContainer}>
          <Text style={styles.callerName}>{chat.name}</Text>
          <Text style={styles.callStatus}>Waiting for {chat.name.split(" ")[0]} to join the call</Text>
        </View>

        <View style={styles.callerImageContainer}>
          <Image source={{ uri: chat.avatar }} style={styles.callerImage} />
        </View>

        <View style={styles.callControlsContainer}>
          <TouchableOpacity style={styles.callControlButton}>
            <Video color="#fff" size={24} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.callControlButton, isMuted && styles.activeControlButton]} 
            onPress={toggleMute}
          >
            {isMuted ? <MicOff color="#fff" size={24} /> : <Mic color="#fff" size={24} />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.callControlButton, isSpeakerOn && styles.activeControlButton]} 
            onPress={toggleSpeaker}
          >
            {isSpeakerOn ? <Volume2 color="#fff" size={24} /> : <VolumeX color="#fff" size={24} />}
          </TouchableOpacity>

          <TouchableOpacity style={styles.endCallButton} onPress={endCall}>
            <PhoneOff color="#fff" size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  decorativeCircle: {
    position: "absolute",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  callInfoContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  callerName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  callStatus: {
    fontSize: 16,
    color: "#666",
  },
  callerImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  callerImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: "#8A2BE2",
  },
  callControlsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  callControlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#8A2BE2",
    justifyContent: "center",
    alignItems: "center",
  },
  activeControlButton: {
    backgroundColor: "#8A2BE2",
  },
  endCallButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
  },
})

export default CallScreen