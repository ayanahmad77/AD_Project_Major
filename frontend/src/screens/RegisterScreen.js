import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text } from "react-native";
import Screen from "../components/Screen";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../constants/theme";
import errorMessage from "../utils/errorMessage";

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name.trim() || !email.trim() || !password) return Alert.alert("Missing details", "Name, email and password are required.");
    if (password.length < 8) return Alert.alert("Weak password", "Use at least 8 characters.");
    try {
      setLoading(true);
      await register({ name: name.trim(), email: email.trim(), phone: phone.trim(), password });
    } catch (error) {
      Alert.alert("Registration failed", errorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen contentStyle={styles.container}>
      <Text style={styles.title}>Create account</Text>
      <Text style={styles.subtitle}>Join SYNAPSE and manage your schedule.</Text>
      <AppInput label="Full name" value={name} onChangeText={setName} placeholder="Your name" autoCapitalize="words" />
      <AppInput label="Email address" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
      <AppInput label="Phone (optional)" value={phone} onChangeText={setPhone} placeholder="Phone number" keyboardType="phone-pad" />
      <AppInput label="Password" value={password} onChangeText={setPassword} placeholder="At least 8 characters" secureTextEntry />
      <AppButton title="Create account" onPress={submit} loading={loading} />
      <Pressable onPress={() => navigation.goBack()} style={styles.link}>
        <Text style={styles.linkText}>Already have an account? <Text style={styles.strong}>Sign in</Text></Text>
      </Pressable>
    </Screen>
  );
}
const styles = StyleSheet.create({
  container: { justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "800", color: COLORS.text, marginBottom: 8 },
  subtitle: { color: COLORS.muted, marginBottom: 28 },
  link: { alignItems: "center", marginTop: 20 },
  linkText: { color: COLORS.muted },
  strong: { color: COLORS.primary, fontWeight: "700" }
});
