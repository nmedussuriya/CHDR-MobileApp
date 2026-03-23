import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/colors";

type Props = {
  childName?: string;
  dob?: string;
  onBack: () => void;
};

export default function ChildHealthHeader({
  childName,
  dob,
  onBack,
}: Props) {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Child Follow-up</Text>
      <Text style={styles.subtitle}>
        {childName} • DOB: {dob}
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
  backButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
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