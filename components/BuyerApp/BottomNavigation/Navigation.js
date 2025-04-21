import { StyleSheet } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Landmark, MapPin, User, Bell, MessageSquare } from "lucide-react-native"

// Import your screens
import HomeScreen from "../Home/Home"
import Schedules from "../ScheduledTours/Schedules"
import Notification from "../Notifications/Notifaction"
import Settings from "../Settings/Overview"
import Chats from "../../ChatApp/Chatlist"

const Tab = createBottomTabNavigator()

const BottomNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#aaa",
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Landmark size={24} color={color} />,
        }}
      />

      <Tab.Screen
        name="Notifications"
        component={Notification}
        options={{
          tabBarIcon: ({ color }) => <Bell size={24} color={color} />,
        }}
      />

      <Tab.Screen
        name="Tours"
        component={Schedules}
        options={{
          tabBarIcon: ({ color }) => <MapPin size={24} color={color} />,
        }}
      />

      <Tab.Screen
        name="Chats"
        component={Chats}
        options={{
          tabBarIcon: ({ color }) => <MessageSquare size={24} color={color} />,
        }}
      />

      <Tab.Screen
        name="Account"
        component={Settings}
        options={{
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingBottom: 30,
    paddingTop: 10,
    height: 90,
  },
  tabBarLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "400",
  },
})

export default BottomNavigation