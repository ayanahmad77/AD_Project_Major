import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/theme";

export default function EmptyState({ title, message }) {
  return (
    <View style={styles.box}>
      <Text style={styles.icon}>◷</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  box: { alignItems: "center", padding: 30, backgroundColor: "#FFFFFF", borderRadius: 16, marginTop: 12 },
  icon: { fontSize: 34, color: COLORS.primary, marginBottom: 10 },
  title: { fontSize: 17, fontWeight: "700", color: COLORS.text },
  message: { color: COLORS.muted, textAlign: "center", marginTop: 6, lineHeight: 21 }
});
