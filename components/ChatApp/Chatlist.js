"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native"
import { Search, MessageSquareOff } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"

const { width, height } = Dimensions.get("window")

// Chat data with online avatars from pravatar.com - reduced number for testing
const INITIAL_CHATS = [
  {
    id: "1",
    name: "Milano",
    avatar: "https://i.pravatar.cc/150?img=32",
    message: "tempor incididunt ut labore et dolore",
    time: "now",
    online: true,
    unread: 3,
  },
  {
    id: "2",
    name: "Samuel Ella",
    avatar: "https://i.pravatar.cc/150?img=43",
    message: "Lorem ipsum dolor sit amet",
    time: "now",
    online: false,
    unread: 0,
  },
  {
    id: "3",
    name: "Emmet Perry",
    avatar: "https://i.pravatar.cc/150?img=22",
    message: "Excepteur sint occaecat cupidatat non",
    time: "12m",
    online: false,
    unread: 2,
  },
  {
    id: "4",
    name: "Walter Lindsey",
    avatar: "https://i.pravatar.cc/150?img=67",
    message: "Quis nostrud exercitation ullamco",
    time: "1h",
    online: false,
    unread: 0,
  },
]

const ChatListScreen = () => {
  const navigation = useNavigation()
  const [chats, setChats] = useState(INITIAL_CHATS)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [chatToDelete, setChatToDelete] = useState(null)

  // Decorative circles data
  const decorativeCircles = [
    // Big circles
    { size: 250, top: height * 0.05, left: -120, color: "rgba(138, 43, 226, 0.04)" },
    { size: 200, top: height * 0.3, right: -100, color: "rgba(138, 43, 226, 0.06)" },
    { size: 220, bottom: -80, left: width * 0.2, color: "rgba(138, 43, 226, 0.05)" },

    // Small circles
    { size: 80, top: height * 0.15, right: 40, color: "rgba(138, 43, 226, 0.07)" },
    { size: 60, top: height * 0.45, left: 30, color: "rgba(138, 43, 226, 0.08)" },
    { size: 50, bottom: 180, right: 60, color: "rgba(138, 43, 226, 0.09)" },
    { size: 40, bottom: 100, left: 50, color: "rgba(138, 43, 226, 0.1)" },
    { size: 30, top: height * 0.6, right: 100, color: "rgba(138, 43, 226, 0.12)" },
  ]

  const handleChatPress = (chat) => {
    // Mark chat as read when opened
    if (chat.unread) {
      setChats((prevChats) => prevChats.map((c) => (c.id === chat.id ? { ...c, unread: 0 } : c)))
    }
    navigation.navigate("ChatMessage", { chat })
  }

  const confirmDelete = (id) => {
    setChatToDelete(id)
    setDeleteModalVisible(true)
  }

  const deleteChat = (id) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== id))
    setDeleteModalVisible(false)
  }

  const renderItem = ({ item }) => (
    <View style={styles.chatItemWrapper}>
      <TouchableOpacity
        style={[styles.chatItem, item.unread > 0 && styles.unreadChatItem]}
        onPress={() => handleChatPress(item)}
        onLongPress={() => confirmDelete(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: item.avatar }}
            style={styles.avatar}
            defaultSource={require("../../assets/placeholder.jpg")}
          />
          {item.online && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.chatInfo}>
          <Text style={[styles.chatName, item.unread > 0 && styles.unreadText]}>{item.name}</Text>
          <Text style={[styles.chatMessage, item.unread > 0 && styles.unreadText]} numberOfLines={1}>
            {item.message}
          </Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={[styles.chatTime, item.unread > 0 && styles.unreadText]}>{item.time}</Text>
          {item.unread > 0 && (
            <View style={styles.unreadIndicator}>
              <Text style={styles.unreadCount}>{item.unread}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  )

  const filteredChats = chats.filter((chat) => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Empty search results component
  const renderEmptyList = () => {
    if (searchQuery.length === 0) return null

    return (
      <View style={styles.emptyContainer}>
        <MessageSquareOff size={60} color="#CCCCCC" />
        <Text style={styles.emptyText}>No Chats Found</Text>
        <Text style={styles.emptySubtext}>We couldn't find any chats matching "{searchQuery}"</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
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
          <Text style={styles.headerTitle}>Chats</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search color="#8E8E93" size={20} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search chats..."
              placeholderTextColor={"#333"}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>All chats</Text>
        </View>

        <FlatList
          data={filteredChats}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.chatList, filteredChats.length === 0 && styles.emptyListContainer]}
          ListEmptyComponent={renderEmptyList}
        />

        {/* Delete Confirmation Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={deleteModalVisible}
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalIconContainer}>
                <View style={styles.modalIcon}>
                  <Text style={styles.modalIconText}>?</Text>
                </View>
              </View>

              <Text style={styles.modalTitle}>Are you sure you want to delete this chat?</Text>

              <Text style={styles.modalSubtitle}>This action can't be undone</Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setDeleteModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.deleteModalButton]}
                  onPress={() => deleteChat(chatToDelete)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    paddingTop: 10,
  },
  decorativeCircle: {
    position: "absolute",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    zIndex: 1,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  chatList: {
    paddingHorizontal: 20,
    zIndex: 1,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  chatItemWrapper: {
    marginBottom: 15,
    width: "100%",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    width: "100%",
    // Add subtle shadow to make chat items stand out from background circles
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  unreadChatItem: {
    backgroundColor: "#fff",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E1E1E1",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CD964",
    borderWidth: 2,
    borderColor: "#F5F5F5",
  },
  chatInfo: {
    flex: 1,
    marginLeft: 10,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: "700",
    color: "#000",
  },
  chatMessage: {
    fontSize: 14,
    color: "#8E8E93",
  },
  timeContainer: {
    alignItems: "flex-end",
    marginLeft: 10,
  },
  chatTime: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 4,
  },
  unreadIndicator: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#088a6a",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  unreadCount: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    width: "80%",
  },
  modalIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 149, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF9500",
    justifyContent: "center",
    alignItems: "center",
  },
  modalIconText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  modalTitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 24,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteModalButton: {
    backgroundColor: "#F5F5F5",
  },
  deleteButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    color: "#333",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 8,
  },
})

export default ChatListScreen