import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/theme";

export default function AppointmentCard({ appointment, onPress }) {
  const provider = appointment.provider;
  const statusColor = appointment.status === "confirmed" ? COLORS.success :
    appointment.status === "cancelled" ? COLORS.danger : COLORS.muted;

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.provider}>{provider?.name || "Provider"}</Text>
        <Text style={[styles.status, { color: statusColor }]}>{appointment.status}</Text>
      </View>
      <Text style={styles.specialization}>{provider?.specialization || "Appointment"}</Text>
      <View style={styles.bottom}>
        <Text style={styles.date}>▣  {appointment.date}</Text>
        <Text style={styles.date}>◷  {appointment.startTime} – {appointment.endTime}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#FFFFFF", padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  provider: { fontSize: 16, fontWeight: "700", color: COLORS.text, flex: 1 },
  status: { fontSize: 12, fontWeight: "700", textTransform: "capitalize" },
  specialization: { color: COLORS.muted, marginTop: 5 },
  bottom: { flexDirection: "row", justifyContent: "space-between", marginTop: 16, flexWrap: "wrap", gap: 8 },
  date: { color: COLORS.text, fontSize: 12, fontWeight: "600" }
});
