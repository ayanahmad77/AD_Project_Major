import React, { useCallback, useState } from "react";
import { Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Screen from "../components/Screen";
import AppointmentCard from "../components/AppointmentCard";
import EmptyState from "../components/EmptyState";
import AppButton from "../components/AppButton";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../constants/theme";

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const response = await api.get("/appointments");
      setAppointments(response.data.appointments.filter(item => item.status === "confirmed").slice(0, 3));
    } catch (error) {
      console.log("Dashboard load:", error.message);
    }
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const refresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>SYNAPSE • YOUR SCHEDULE</Text>
          <Text style={styles.greeting}>Hello, {user?.name?.split(" ")[0] || "there"} 👋</Text>
          <Text style={styles.sub}>Let's keep your day organized.</Text>
        </View>
        <View style={styles.avatar}><Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() || "U"}</Text></View>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroSmall}>YOUR TIME, WELL MANAGED</Text>
        <Text style={styles.heroTitle}>Make time for what matters.</Text>
        <Text style={styles.heroText}>Find a provider and book your next appointment in a few simple steps.</Text>
        <AppButton title="Book an appointment  →" onPress={() => navigation.navigate("Providers")} style={{ marginTop: 18, backgroundColor: "black" }} />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Upcoming appointments</Text>
        <Pressable onPress={() => navigation.navigate("Appointments")}><Text style={styles.seeAll}>See all</Text></Pressable>
      </View>

      {appointments.length === 0 ? (
        <EmptyState title="Nothing scheduled yet" message="Your confirmed appointments will appear here." />
      ) : appointments.map(item => (
        <AppointmentCard key={item._id} appointment={item} onPress={() => navigation.navigate("AppointmentDetails", { appointmentId: item._id })} />
      ))}
      <View style={{ height: 12 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 25 },
  eyebrow: { color: COLORS.primary, fontSize: 10, fontWeight: "800", letterSpacing: 1.3 },
  greeting: { color: COLORS.text, fontSize: 26, fontWeight: "800", marginTop: 7 },
  sub: { color: COLORS.muted, marginTop: 4 },
  avatar: { height: 48, width: 48, borderRadius: 16, backgroundColor: COLORS.paleBlue, alignItems: "center", justifyContent: "center" },
  avatarText: { color: COLORS.primary, fontSize: 20, fontWeight: "800" },
  hero: { backgroundColor: COLORS.primary, padding: 22, borderRadius: 22, marginBottom: 28 },
  heroSmall: { color: "#D9E2FF", fontSize: 10, fontWeight: "800", letterSpacing: 1.2 },
  heroTitle: { color: "#FFFFFF", fontSize: 25, fontWeight: "800", marginTop: 10, lineHeight: 31 },
  heroText: { color: "#E5EAFF", marginTop: 9, lineHeight: 21 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 13 },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: "800" },
  seeAll: { color: COLORS.primary, fontWeight: "700" }
});
