import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/colors";

export default function ScreeningPageHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Screening Responses</Text>
      <Text style={styles.subtitle}>Midwife - Review parent submissions</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.submit,
    marginTop: 40,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    fontStyle: "italic",
  },
});