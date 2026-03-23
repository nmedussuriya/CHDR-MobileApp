import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/colors";

export default function ConfirmMilestoneHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Confirm Milestones</Text>
      <Text style={styles.subtitle}>Midwife - Review parent reports</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 40,
    marginBottom: 20,
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