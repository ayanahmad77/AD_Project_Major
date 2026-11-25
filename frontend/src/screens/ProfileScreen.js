import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";
import AppButton from "../components/AppButton";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../constants/theme";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const confirmLogout = () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Stay", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: logout }
    ]);
  };

  return (
    <Screen>
      <Text style={styles.title}>Your profile</Text>
      <View style={styles.card}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() || "U"}</Text></View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.line} />
        <Text style={styles.label}>PHONE</Text>
        <Text style={styles.value}>{user?.phone || "Not provided"}</Text>
        <Text style={styles.label}>ACCOUNT TYPE</Text>
        <Text style={styles.value}>{user?.role || "user"}</Text>
      </View>
      <AppButton title="Sign out" variant="danger" onPress={confirmLogout} />
    </Screen>
  );
}
const styles = StyleSheet.create({
  title: { color: COLORS.text, fontSize: 25, fontWeight: "800", marginBottom: 20 },
  card: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: COLORS.border, borderRadius: 18, padding: 22, alignItems: "center", marginBottom: 20 },
  avatar: { width: 70, height: 70, borderRadius: 23, backgroundColor: COLORS.paleBlue, alignItems: "center", justifyContent: "center" },
  avatarText: { color: COLORS.primary, fontSize: 28, fontWeight: "800" },
  name: { color: COLORS.text, fontSize: 21, fontWeight: "800", marginTop: 13 },
  email: { color: COLORS.muted, marginTop: 4 },
  line: { height: 1, backgroundColor: COLORS.border, width: "100%", marginVertical: 20 },
  label: { alignSelf: "flex-start", color: COLORS.muted, fontSize: 10, fontWeight: "800", marginTop: 13 },
  value: { alignSelf: "flex-start", color: COLORS.text, fontWeight: "600", marginTop: 5 }
});
