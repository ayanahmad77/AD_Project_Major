import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../constants/theme";
import errorMessage from "../utils/errorMessage";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email.trim() || !password) return Alert.alert("Missing details", "Enter your email and password.");
    try {
      setLoading(true);
      await login(email.trim(), password);
    } catch (error) {
      Alert.alert("Login failed", errorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen contentStyle={styles.container}>
      <View style={styles.brand}>
        <View style={styles.logo}><Text style={styles.logoText}>S</Text></View>
        <Text style={styles.title}>SYNAPSE</Text>
        <Text style={styles.subtitle}>Appointments, made simpler.</Text>
      </View>
      <Text style={styles.heading}>Welcome back</Text>
      <Text style={styles.helper}>Sign in to manage your appointments.</Text>
      <AppInput label="Email address" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
      <AppInput label="Password" value={password} onChangeText={setPassword} placeholder="Enter your password" secureTextEntry />
      <AppButton title="Sign in" onPress={submit} loading={loading} style={{ marginTop: 8 }} />
      <Pressable onPress={() => navigation.navigate("Register")} style={styles.linkWrap}>
        <Text style={styles.linkText}>New to SYNAPSE? <Text style={styles.linkStrong}>Create an account</Text></Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: "center" },
  brand: { alignItems: "center", marginBottom: 48 },
  logo: { width: 62, height: 62, borderRadius: 20, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center" },
  logoText: { color: "#FFFFFF", fontSize: 34, fontWeight: "800" },
  title: { color: COLORS.text, fontSize: 23, fontWeight: "900", letterSpacing: 3, marginTop: 13 },
  subtitle: { color: COLORS.muted, marginTop: 5 },
  heading: { color: COLORS.text, fontSize: 27, fontWeight: "800" },
  helper: { color: COLORS.muted, marginTop: 7, marginBottom: 25 },
  linkWrap: { alignItems: "center", marginTop: 22 },
  linkText: { color: COLORS.muted },
  linkStrong: { color: COLORS.primary, fontWeight: "700" }
});
