
import React, { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import Screen from "../components/Screen";
import EmptyState from "../components/EmptyState";
import api from "../services/api";
import { COLORS } from "../constants/theme";

export default function ProvidersScreen({ navigation }) {
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadProviders = async (term = "") => {
    try {
      setLoading(true);

      const response = await api.get("/providers", {
        params: term.trim()
          ? { search: term.trim() }
          : {}
      });

      setProviders(response.data.providers || []);
    } catch (error) {
      Alert.alert(
        "Could not load providers",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadProviders(search);
  };

  const clearSearch = () => {
    setSearch("");
    loadProviders("");
  };

  useFocusEffect(
    useCallback(() => {
      loadProviders(search);
    }, [])
  );

  return (
    <Screen>
      <Text style={styles.title}>Find a provider</Text>

      <Text style={styles.subtitle}>
        Choose a professional to book an appointment with.
      </Text>

      <TextInput
        style={styles.search}
        value={search}
        onChangeText={setSearch}
        placeholder="Search name or specialization"
        placeholderTextColor={COLORS.muted}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
        autoCapitalize="none"
      />

      <View style={styles.buttonRow}>
        <Pressable
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={loading}
        >
          <Text style={styles.searchButtonText}>
            {loading ? "Searching..." : "Search"}
          </Text>
        </Pressable>

        <Pressable
          style={styles.clearButton}
          onPress={clearSearch}
        >
          <Text style={styles.clearButtonText}>Clear</Text>
        </Pressable>
      </View>

      {loading ? (
        <Text style={styles.info}>Loading providers...</Text>
      ) : providers.length === 0 ? (
        <EmptyState
          title="No providers found"
          message="Try another name or specialization, or ask an administrator to add providers."
        />
      ) : (
        <>
          <Text style={styles.resultCount}>
            {providers.length} provider(s) found
          </Text>

          {providers.map((provider) => (
            <View key={provider._id} style={styles.card}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {provider.name?.[0]?.toUpperCase() || "P"}
                </Text>
              </View>

              <View style={styles.details}>
                <Text style={styles.name}>
                  {provider.name}
                </Text>

                <Text style={styles.special}>
                  {provider.specialization}
                </Text>

                {!!provider.description && (
                  <Text
                    style={styles.description}
                    numberOfLines={2}
                  >
                    {provider.description}
                  </Text>
                )}

                <Text style={styles.duration}>
                  {provider.slotDuration || 30} minute appointments
                </Text>

                <Pressable
                  style={styles.book}
                  onPress={() =>
                    navigation.navigate("Booking", { provider })
                  }
                >
                  <Text style={styles.bookText}>
                    View slots & book →
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: COLORS.text,
    fontSize: 25,
    fontWeight: "800"
  },

  subtitle: {
    color: COLORS.muted,
    marginTop: 6,
    marginBottom: 18,
    lineHeight: 20
  },

  search: {
    backgroundColor: "#FFFFFF",
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    color: COLORS.text
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
    marginBottom: 20
  },

  searchButton: {
    flex: 1,
    backgroundColor: COLORS.paleBlue,
    borderRadius: 10,
    alignItems: "center",
    padding: 12
  },

  searchButtonText: {
    color: COLORS.primary,
    fontWeight: "800"
  },

  clearButton: {
    backgroundColor: "#EEEEEE",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20
  },

  clearButtonText: {
    color: COLORS.text,
    fontWeight: "700"
  },

  info: {
    color: COLORS.muted,
    marginTop: 15
  },

  resultCount: {
    color: COLORS.muted,
    fontSize: 13,
    marginBottom: 12
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
    marginBottom: 13
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: COLORS.paleBlue,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13
  },

  avatarText: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: "800"
  },

  details: {
    flex: 1
  },

  name: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800"
  },

  special: {
    color: COLORS.primary,
    fontWeight: "700",
    marginTop: 3
  },

  description: {
    color: COLORS.muted,
    marginTop: 6,
    lineHeight: 18
  },

  duration: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 8
  },

  book: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: 10,
    marginTop: 12
  },

  bookText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12
  }
});
