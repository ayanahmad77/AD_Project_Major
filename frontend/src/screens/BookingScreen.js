import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import EmptyState from "../components/EmptyState";
import api from "../services/api";
import { COLORS } from "../constants/theme";
import errorMessage from "../utils/errorMessage";

const todayString = () => {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export default function BookingScreen({ route, navigation }) {
  const { provider } = route.params;
  const [date, setDate] = useState(todayString());
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState("");
  const [reason, setReason] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);

  const loadSlots = async () => {
    try {
      setLoadingSlots(true);
      setSelected("");
      const response = await api.get(`/providers/${provider._id}/slots`, { params: { date } });
      setSlots(response.data.slots);
    } catch (error) {
      setSlots([]);
      Alert.alert("Could not load slots", errorMessage(error));
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => { loadSlots(); }, []);

  const book = async () => {
    if (!selected) return Alert.alert("Select a time", "Choose an available time slot.");
    try {
      setBooking(true);
      const response = await api.post("/appointments", {
        providerId: provider._id,
        date,
        startTime: selected,
        reason
      });
      Alert.alert("Appointment confirmed", "Your appointment has been booked.", [
        { text: "View appointment", onPress: () => {
          navigation.replace("AppointmentDetails", { appointmentId: response.data.appointment._id });
        }}
      ]);
    } catch (error) {
      Alert.alert("Booking failed", errorMessage(error));
      loadSlots();
    } finally {
      setBooking(false);
    }
  };

  return (
    <Screen>
      <View style={styles.provider}>
        <Text style={styles.providerName}>{provider.name}</Text>
        <Text style={styles.special}>{provider.specialization}</Text>
        <Text style={styles.duration}>{provider.slotDuration} minute slots</Text>
      </View>
      <Text style={styles.label}>Choose date</Text>
      <AppInput value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />
      <AppButton title="Check availability" variant="secondary" onPress={loadSlots} loading={loadingSlots} />
      <Text style={[styles.label, { marginTop: 25 }]}>Available time slots</Text>
      {loadingSlots ? <Text style={styles.muted}>Loading slots...</Text> :
        slots.length === 0 ? <EmptyState title="No slots available" message="Try another date or check back later." /> :
        <View style={styles.slots}>
          {slots.map(slot => (
            <Pressable key={slot.startTime} onPress={() => setSelected(slot.startTime)}
              style={[styles.slot, selected === slot.startTime && styles.slotSelected]}>
              <Text style={[styles.slotText, selected === slot.startTime && styles.slotTextSelected]}>{slot.startTime}</Text>
            </Pressable>
          ))}
        </View>}
      <Text style={[styles.label, { marginTop: 22 }]}>Reason (optional)</Text>
      <AppInput value={reason} onChangeText={setReason} placeholder="What is this appointment for?" multiline />
      <AppButton title="Confirm booking" onPress={book} loading={booking} style={{ marginTop: 10 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  provider: { backgroundColor: COLORS.paleBlue, padding: 18, borderRadius: 16, marginBottom: 22 },
  providerName: { fontSize: 20, fontWeight: "800", color: COLORS.text },
  special: { color: COLORS.primary, fontWeight: "700", marginTop: 4 },
  duration: { color: COLORS.muted, marginTop: 6, fontSize: 12 },
  label: { color: COLORS.text, fontWeight: "800", marginBottom: 9 },
  muted: { color: COLORS.muted, marginTop: 12 },
  slots: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  slot: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 17 },
  slotSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  slotText: { color: COLORS.text, fontWeight: "700" },
  slotTextSelected: { color: "#FFFFFF" }
});
