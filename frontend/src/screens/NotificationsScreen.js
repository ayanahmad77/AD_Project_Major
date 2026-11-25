import React, { useCallback, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Screen from "../components/Screen";
import EmptyState from "../components/EmptyState";
import api from "../services/api";
import { COLORS } from "../constants/theme";

export default function NotificationsScreen() {
  const [items, setItems] = useState([]);

  const load = async () => {
    try {
      const response = await api.get("/notifications");
      setItems(response.data.notifications);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || error.message);
    }
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      load();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || error.message);
    }
  };

  const markAll = async () => {
    try {
      await api.patch("/notifications/read-all");
      load();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || error.message);
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <View><Text style={styles.title}>Notifications</Text><Text style={styles.subtitle}>Stay updated on your appointments.</Text></View>
        <Pressable onPress={markAll}><Text style={styles.markAll}>Read all</Text></Pressable>
      </View>
      {items.length === 0 ? <EmptyState title="All caught up" message="New appointment updates will appear here." /> :
        items.map(item => (
          <Pressable key={item._id} onPress={() => !item.isRead && markRead(item._id)} style={[styles.card, !item.isRead && styles.unread]}>
            <View style={styles.row}>
              <Text style={styles.name}>{item.title}</Text>
              {!item.isRead && <View style={styles.dot} />}
            </View>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
          </Pressable>
        ))}
    </Screen>
  );
}
const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  title: { color: COLORS.text, fontSize: 25, fontWeight: "800" },
  subtitle: { color: COLORS.muted, marginTop: 5 },
  markAll: { color: COLORS.primary, fontWeight: "800", fontSize: 12 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 15, padding: 16, borderWidth: 1, borderColor: COLORS.border, marginBottom: 11 },
  unread: { borderColor: "#B7C8FF", backgroundColor: "#F9FAFF" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  name: { color: COLORS.text, fontWeight: "800", fontSize: 15 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  message: { color: COLORS.muted, lineHeight: 20, marginTop: 7 },
  date: { color: COLORS.muted, fontSize: 10, marginTop: 10 }
});
