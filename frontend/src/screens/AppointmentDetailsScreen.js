import React, { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Screen from "../components/Screen";
import AppButton from "../components/AppButton";
import api from "../services/api";
import { COLORS } from "../constants/theme";
import errorMessage from "../utils/errorMessage";

export default function AppointmentDetailsScreen({ route, navigation }) {
  const { appointmentId } = route.params;
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const response = await api.get(`/appointments/${appointmentId}`);
      setAppointment(response.data.appointment);
    } catch (error) {
      Alert.alert("Error", errorMessage(error));
    }
  };

  useFocusEffect(useCallback(() => { load(); }, [appointmentId]));

  const cancel = () => {
    Alert.alert("Cancel appointment?", "This action will release the selected time slot.", [
      { text: "Keep appointment", style: "cancel" },
      { text: "Cancel appointment", style: "destructive", onPress: async () => {
        try {
          setLoading(true);
          await api.patch(`/appointments/${appointmentId}/cancel`);
          await load();
          Alert.alert("Cancelled", "Your appointment has been cancelled.");
        } catch (error) {
          Alert.alert("Could not cancel", errorMessage(error));
        } finally {
          setLoading(false);
        }
      }}
    ]);
  };

  if (!appointment) return <Screen><Text style={{ color: COLORS.muted }}>Loading appointment...</Text></Screen>;

  return (
    <Screen>
      <View style={styles.card}>
        <Text style={styles.status}>{appointment.status.toUpperCase()}</Text>
        <Text style={styles.provider}>{appointment.provider?.name}</Text>
        <Text style={styles.special}>{appointment.provider?.specialization}</Text>
        <View style={styles.divider} />
        <Text style={styles.label}>DATE</Text>
        <Text style={styles.value}>{appointment.date}</Text>
        <Text style={styles.label}>TIME</Text>
        <Text style={styles.value}>{appointment.startTime} – {appointment.endTime}</Text>
        <Text style={styles.label}>REASON</Text>
        <Text style={styles.value}>{appointment.reason || "Not specified"}</Text>
      </View>
      {appointment.status === "confirmed" && <>
        <AppButton title="Reschedule appointment" variant="secondary" onPress={() => navigation.navigate("Booking", {
          provider: appointment.provider,
          rescheduleId: appointment._id
        })} />
        <AppButton title="Cancel appointment" variant="danger" onPress={cancel} loading={loading} style={{ marginTop: 12 }} />
      </>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 20, borderWidth: 1, borderColor: COLORS.border, marginBottom: 20 },
  status: { color: COLORS.success, fontWeight: "800", fontSize: 11, letterSpacing: 1 },
  provider: { color: COLORS.text, fontSize: 23, fontWeight: "800", marginTop: 12 },
  special: { color: COLORS.primary, marginTop: 4, fontWeight: "700" },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 20 },
  label: { color: COLORS.muted, fontSize: 10, fontWeight: "800", letterSpacing: 1, marginTop: 14 },
  value: { color: COLORS.text, fontSize: 16, fontWeight: "600", marginTop: 5 }
});
