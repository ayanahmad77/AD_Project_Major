import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import ProvidersScreen from "../screens/ProvidersScreen";
import AppointmentsScreen from "../screens/AppointmentsScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { COLORS } from "../constants/theme";

const Tab = createBottomTabNavigator();

const icons = {
  Home: "⌂",
  Providers: "＋",
  Appointments: "▣",
  Notifications: "♧",
  Profile: "○"
};

export default function MainNavigator() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.muted,
      tabBarStyle: { height: 65, paddingTop: 7, paddingBottom: 7, borderTopColor: COLORS.border },
      tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
      tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 21 }}>{icons[route.name]}</Text>
    })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Providers" component={ProvidersScreen} />
      <Tab.Screen name="Appointments" component={AppointmentsScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
