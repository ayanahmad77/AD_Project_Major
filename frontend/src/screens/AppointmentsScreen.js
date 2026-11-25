import React, { useCallback, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Screen from "../components/Screen";
import AppointmentCard from "../components/AppointmentCard";
import EmptyState from "../components/EmptyState";
import api from "../services/api";
import { COLORS } from "../constants/theme";

export default function AppointmentsScreen({ navigation }) {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const response = await api.get("/appointments");
      setAppointments(response.data.appointments);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { load(); }, []));
  const shown = filter === "all" ? appointments : appointments.filter(item => item.status === filter);

  return (
    <Screen>
      <Text style={styles.title}>My appointments</Text>
      <Text style={styles.subtitle}>View and manage your bookings.</Text>
      <View style={styles.filters}>
        {["all", "confirmed", "cancelled", "completed"].map(item => (
          <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.active]}>
            <Text style={[styles.filterText, filter === item && styles.activeText]}>{item[0].toUpperCase() + item.slice(1)}</Text>
          </Pressable>
        ))}
      </View>
      {loading ? <Text style={styles.subtitle}>Loading...</Text> :
        shown.length === 0 ? <EmptyState title="No appointments" message="Appointments matching this filter will appear here." /> :
        shown.map(item => (
          <AppointmentCard key={item._id} appointment={item}
            onPress={() => navigation.navigate("AppointmentDetails", { appointmentId: item._id })} />
        ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: COLORS.text, fontSize: 25, fontWeight: "800" },
  subtitle: { color: COLORS.muted, marginTop: 6, marginBottom: 18 },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginBottom: 18 },
  filter: { paddingVertical: 8, paddingHorizontal: 11, borderRadius: 20, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: COLORS.border },
  active: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { color: COLORS.muted, fontSize: 11, fontWeight: "700" },
  activeText: { color: "#FFFFFF" }
});
