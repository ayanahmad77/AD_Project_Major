import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { COLORS } from "../constants/theme";

export default function AppInput({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, autoCapitalize = "none", multiline = false }) {
  return (
    <View style={styles.wrapper}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.muted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        style={[styles.input, multiline && styles.multiline]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 15 },
  label: { color: COLORS.text, fontSize: 13, fontWeight: "700", marginBottom: 7 },
  input: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, color: COLORS.text, fontSize: 15 },
  multiline: { minHeight: 90, textAlignVertical: "top" }
});
