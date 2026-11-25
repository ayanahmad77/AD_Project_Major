import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { COLORS } from "../constants/theme";

export default function AppButton({ title, onPress, loading = false, variant = "primary", disabled = false, style }) {
  const secondary = variant === "secondary";
  const danger = variant === "danger";
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        secondary && styles.secondary,
        danger && styles.danger,
        (disabled || loading) && styles.disabled,
        style
      ]}
    >
      {loading ? <ActivityIndicator color={secondary ? COLORS.primary : "#FFFFFF"} /> :
        <Text style={[styles.text, secondary && styles.secondaryText]}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: COLORS.primary, paddingVertical: 15, paddingHorizontal: 18, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  secondary: { backgroundColor: COLORS.paleBlue },
  danger: { backgroundColor: COLORS.danger },
  disabled: { opacity: 0.55 },
  text: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  secondaryText: { color: COLORS.primary }
});
