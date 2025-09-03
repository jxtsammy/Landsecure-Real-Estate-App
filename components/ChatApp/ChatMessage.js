"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
  Animated,
  ScrollView,
} from "react-native"
import { ArrowLeft, Phone, Send, X, Trash2, Image as ImageIcon } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import * as ImagePicker from "expo-image-picker"

const { width, height } = Dimensions.get("window")

// Simplified real estate background
const REAL_ESTATE_BACKGROUND =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHw%3D&w=1000&q=80"

// Simplified messages
const MESSAGES = [
  {
    id: "1",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod?",
    time: "10:45",
    sent: false,
  },
  {
    id: "2",
    text: "tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    time: "10:46",
    sent: true,
  },
]

const ChatDetailScreen = ({ route }) => {
  const navigation = useNavigation()
  const { chat } = route.params
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState(MESSAGES)
  const [lastMessage, setLastMessage] = useState("")
  const [selectedMedia, setSelectedMedia] = useState([])
  const [selectedMessageId, setSelectedMessageId] = useState(null)
  const flatListRef = useRef(null)
  const deleteAnimRef = useRef(new Animated.Value(0)).current

  // Decorative circles data
  const decorativeCircles = [
    // Big circles
    { size: 200, top: height * 0.1, left: -100, color: "rgba(138, 43, 226, 0.05)" },
    { size: 180, top: height * 0.4, right: -90, color: "rgba(138, 43, 226, 0.07)" },
    { size: 220, bottom: -100, left: width * 0.3, color: "rgba(138, 43, 226, 0.04)" },

    // Small circles
    { size: 60, top: height * 0.25, right: 30, color: "rgba(138, 43, 226, 0.08)" },
    { size: 40, top: height * 0.6, left: 20, color: "rgba(138, 43, 226, 0.1)" },
    { size: 50, bottom: 120, right: 50, color: "rgba(138, 43, 226, 0.06)" },
    { size: 30, bottom: 200, left: 40, color: "rgba(138, 43, 226, 0.09)" },
  ]

  useEffect(() => {
    // Find the last text message to display at the top
    if (messages.length > 0) {
      const last = messages[messages.length - 1]
      setLastMessage(last.text)
    }
  }, [messages])

  useEffect(() => {
    // Scroll to bottom when messages change
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true })
    }
  }, [messages])

  useEffect(() => {
    // Animation for message selection
    if (selectedMessageId) {
      Animated.timing(deleteAnimRef, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(deleteAnimRef, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }
  }, [selectedMessageId])

  const sendMessage = () => {
    if (message.trim() === "" && selectedMedia.length === 0) return

    const newMessage = {
      id: Date.now().toString(),
      text: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sent: true,
      media: selectedMedia.length > 0 ? [...selectedMedia] : null,
    }

    setMessages([...messages, newMessage])
    setMessage("")
    setSelectedMedia([])
  }

  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (status !== "granted") {
        Alert.alert("Permission needed", "Please grant camera roll permissions to attach media.")
        return
      }

      // Launch image picker with multiple selection
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 1,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newMedia = result.assets.map((asset) => ({
          uri: asset.uri,
          type: asset.type || "image",
        }))
        setSelectedMedia([...selectedMedia, ...newMedia])
      }
    } catch (error) {
      console.error("Error picking image:", error)
      Alert.alert("Error", "Failed to pick image. Please try again.")
    }
  }

  const removeSelectedMedia = (index) => {
    const updatedMedia = [...selectedMedia]
    updatedMedia.splice(index, 1)
    setSelectedMedia(updatedMedia)
  }

  const handleLongPressMessage = (messageId) => {
    setSelectedMessageId(messageId)
  }

  const deleteMessage = () => {
    if (selectedMessageId) {
      // Filter out the selected message
      const updatedMessages = messages.filter((msg) => msg.id !== selectedMessageId)
      setMessages(updatedMessages)
      setSelectedMessageId(null)

      // Show confirmation
      Alert.alert("Message deleted", "The message has been removed from the chat.")
    }
  }

  const cancelMessageSelection = () => {
    setSelectedMessageId(null)
  }

  const handleCall = () => {
    navigation.navigate("CallScreen", { chat })
  }

  const renderItem = ({ item }) => {
    const isSelected = selectedMessageId === item.id

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onLongPress={() => handleLongPressMessage(item.id)}
        style={[
          styles.messageContainer,
          item.sent ? styles.sentContainer : styles.receivedContainer,
          isSelected && styles.selectedMessage,
        ]}
      >
        <View style={[styles.messageBubble, item.sent ? styles.sentMessage : styles.receivedMessage]}>
          {item.media && item.media.length > 0 && (
            <View style={styles.messageMediaGrid}>
              {item.media.map((media, index) => (
                <Image
                  key={`msg-media-${index}`}
                  source={{ uri: media.uri }}
                  style={[
                    styles.messageMedia,
                    item.media.length === 1 && styles.singleMessageMedia,
                    item.media.length > 1 && styles.multipleMessageMedia,
                  ]}
                  resizeMode="cover"
                />
              ))}
            </View>
          )}
          {item.text.trim() !== "" && (
            <Text style={[styles.messageText, item.sent && styles.sentMessageText]}>{item.text}</Text>
          )}
        </View>
        <Text style={styles.messageTime}>{item.time}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color="#000" size={24} />
          </TouchableOpacity>

          <View style={styles.userInfo}>
            <Image
              source={{ uri: chat.avatar }}
              style={styles.avatar}
              defaultSource={require("../../assets/placeholder.jpg")}
            />
            <View style={styles.userTextInfo}>
              <Text style={styles.userName}>{chat.name}</Text>
              {chat.online ? (
                <Text style={styles.userStatus}>Online</Text>
              ) : (
                <Text style={styles.lastMessage} numberOfLines={1}>
                  Offline
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity style={styles.callButton} onPress={handleCall}>
            <Phone color="#000" size={24} />
          </TouchableOpacity>
        </View>

        {/* Message deletion toolbar */}
        <Animated.View
          style={[
            styles.deleteToolbar,
            {
              transform: [
                {
                  translateY: deleteAnimRef.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-60, 0],
                  }),
                },
              ],
              opacity: deleteAnimRef,
            },
          ]}
        >
          <TouchableOpacity style={styles.deleteToolbarButton} onPress={cancelMessageSelection}>
            <X color="#000" size={20} />
          </TouchableOpacity>
          <Text style={styles.deleteToolbarText}>Message selected</Text>
          <TouchableOpacity style={styles.deleteToolbarButton} onPress={deleteMessage}>
            <Trash2 color="#000" size={20} />
          </TouchableOpacity>
        </Animated.View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
        />

        {/* Selected media preview */}
        {selectedMedia.length > 0 && (
          <View style={styles.mediaPreviewContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {selectedMedia.map((media, index) => (
                <View key={`preview-${index}`} style={styles.mediaPreviewWrapper}>
                  <Image source={{ uri: media.uri }} style={styles.mediaPreview} />
                  <TouchableOpacity style={styles.removeMediaButton} onPress={() => removeSelectedMedia(index)}>
                    <View style={styles.removeMediaIconContainer}>
                      <X color="#fff" size={16} />
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.inputContainer}>
          {/* <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
            <ImageIcon color="#8E8E93" size={24} />
          </TouchableOpacity> */}

          <TextInput
            style={styles.input}
            placeholder="Message..."
            value={message}
            placeholderTextColor="#333"
            onChangeText={setMessage}
            multiline
          />

          <TouchableOpacity
            style={[styles.sendButton, (message.trim() !== "" || selectedMedia.length > 0) && styles.sendButtonActive]}
            onPress={sendMessage}
            disabled={message.trim() === "" && selectedMedia.length === 0}
          >
            <Send color={message.trim() !== "" || selectedMedia.length > 0 ? "#ffff" : "#ffff"} size={20} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    backgroundColor: "#fff",
    zIndex: 1,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#E1E1E1",
  },
  userTextInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  userStatus: {
    fontSize: 12,
    color: "#4CD964",
  },
  lastMessage: {
    fontSize: 12,
    color: "#8E8E93",
    fontStyle: "italic",
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  messagesList: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: "80%",
  },
  sentContainer: {
    alignSelf: "flex-end",
  },
  receivedContainer: {
    alignSelf: "flex-start",
  },
  selectedMessage: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  messageBubble: {
    borderRadius: 20,
    padding: 12,
    marginBottom: 4,
    overflow: "hidden",
  },
  sentMessage: {
    backgroundColor: "#088a6a",
    borderTopRightRadius: 4,
  },
  receivedMessage: {
    backgroundColor: "#8A2BE2",
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: "#fff",
  },
  sentMessageText: {
    color: "#fff",
  },
  messageTime: {
    fontSize: 12,
    color: "#8E8E93",
    alignSelf: "flex-end",
  },
  messageMediaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  messageMedia: {
    borderRadius: 8,
  },
  singleMessageMedia: {
    width: "100%",
    height: 200,
  },
  multipleMessageMedia: {
    width: "48%",
    height: 120,
    margin: "1%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
    backgroundColor: "#fff",
    zIndex: 1,
  },
  cameraButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 15,
    marginHorizontal: 10,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#8A2BE2",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonActive: {
    backgroundColor: "#5856D6",
  },
  mediaPreviewContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eaeaea",
  },
  mediaPreviewWrapper: {
    position: "relative",
    marginRight: 10,
  },
  mediaPreview: {
    height: 100,
    width: 100,
    borderRadius: 8,
  },
  removeMediaButton: {
    position: "absolute",
    top: 5,
    left: 5,
    zIndex: 2,
  },
  removeMediaIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#8A2BE2",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteToolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  deleteToolbarText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
  },
  deleteToolbarButton: {
    padding: 5,
  },
})

export default ChatDetailScreen
