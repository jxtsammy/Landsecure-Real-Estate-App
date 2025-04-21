import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { NavigationContainer } from "@react-navigation/native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Home, Bell, Plus, MapPin, Settings, MessageSquare } from "lucide-react-native"
import { View, StyleSheet, TouchableOpacity, Dimensions, StatusBar } from "react-native"

// Import your screens
import HomeScreen from "../Home/OwnerHome"
import MyProperties from "../Home/MyProperties"
import OwnerSettings from "../Home/Settings"
import OwnerNotifications from "../Home/OwnerNotifications"
import Chats from "../../ChatApp/Chatlist"
import AddListing from "../AddPoperties/AddListing"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()
const { width } = Dimensions.get("window")

// Main Tab Navigator with Floating Action Button
function MainTabs() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: "#8A2BE2",
          tabBarInactiveTintColor: "#A0A0A0",
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={OwnerNotifications}
          options={{
            tabBarIcon: ({ color, size }) => <Bell color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Messages"
          component={Chats}
          options={{
            tabBarIcon: ({ color, size }) => <MessageSquare color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="MyProperties"
          component={MyProperties}
          options={{
            tabBarIcon: ({ color, size }) => <MapPin color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={OwnerSettings}
          options={{
            tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
          }}
        />
      </Tab.Navigator>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </View>
  )
}

// Separate component for the Floating Action Button
function FloatingActionButton() {
  // Use React Navigation's useNavigation hook to get navigation object
  const { useNavigation } = require("@react-navigation/native")
  const navigation = useNavigation()

  return (
    <TouchableOpacity
      style={styles.floatingButton}
      onPress={() => navigation.navigate("AddProperty")}
      activeOpacity={0.8}
    >
      <Plus color="#fff" size={24} />
    </TouchableOpacity>
  )
}

// Root Stack Navigator
function OwnerNavigation() {
  return (
    <SafeAreaProvider>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="AddProperty" component={AddListing} />
        </Stack.Navigator>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    borderTopWidth: 0,
    elevation: 0,
    height: 75,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    paddingTop: 10,
  },
  floatingButton: {
    position: "absolute",
    bottom: 90, // Position it above the tab bar
    right: 20, // Position it on the right side
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#8A2BE2",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 999,
  },
})

export default OwnerNavigation