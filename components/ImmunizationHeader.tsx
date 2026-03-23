import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/colors";

type Props = {
  childName?: string;
  dob?: string;
  onBack: () => void;
};

export default function ImmunizationHeader({
  childName,
  dob,
  onBack,
}: Props) {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={Colors.primary} />
      </TouchableOpacity>

      <Text style={styles.title}>Immunization Records</Text>
      <Text style={styles.subtitle}>
        {childName || "Child"} • DOB: {dob || "N/A"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 40,
    marginBottom: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.submit,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textDark,
    fontStyle: "italic",
  },
});