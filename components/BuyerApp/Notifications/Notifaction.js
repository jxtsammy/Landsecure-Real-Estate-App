import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity } from "react-native"
import { Calendar, Settings, Star, X } from "lucide-react-native"

const NotificationScreen = ({ navigation }) => {
  const notifications = {
    today: [
      {
        id: "1",
        type: "tour",
        title: "Tour Booked Successfully",
        message:
          "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard.",
        time: "1hr",
        icon: Calendar,
      },
      {
        id: "2",
        type: "offer",
        title: "Exclusive Offers Inside",
        message:
          "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard.",
        time: "1hr",
        icon: Settings,
      },
      {
        id: "3",
        type: "review",
        title: "Property Review Request",
        message:
          "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard.",
        time: "1hr",
        icon: Star,
      },
    ],
    yesterday: [
      {
        id: "4",
        type: "tour",
        title: "Tour Booked Successfully",
        message:
          "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard.",
        time: "1hr",
        icon: Calendar,
      },
      {
        id: "5",
        type: "offer",
        title: "Exclusive Offers Inside",
        message:
          "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard.",
        time: "1hr",
        icon: Settings,
      },
      {
        id: "6",
        type: "review",
        title: "Property Review Request",
        message:
          "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard.",
        time: "1hr",
        icon: Star,
      },
    ],
  }

  const handleGoBack = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack()
    }
  }

  const getIconColor = (type) => {
    switch (type) {
      case "tour":
      case "offer":
      case "review":
        return "#088a6a" // Blue color for all icons as shown in the design
      default:
        return "#088a6a"
    }
  }

  const renderNotification = (notification) => {
    const IconComponent = notification.icon
    const iconColor = getIconColor(notification.type)

    return (
      <View key={notification.id} style={styles.notificationItem}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
          <IconComponent size={20} color={iconColor} />
        </View>
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationTime}>{notification.time}</Text>
          </View>
          <Text style={styles.notificationMessage}>{notification.message}</Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.closeButton} onPress={handleGoBack}>
          <X size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Today Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today</Text>
          {notifications.today.map(renderNotification)}
        </View>

        {/* Yesterday Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yesterday</Text>
          {notifications.yesterday.map(renderNotification)}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Changed to space-between to push title to left and X to right
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  closeButton: {
    padding: 8, // Added padding for better touch target
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
  },
  notificationItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  notificationTime: {
    fontSize: 14,
    color: "#666",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
})

export default NotificationScreen