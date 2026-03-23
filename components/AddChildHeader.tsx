import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/colors";

export default function AddChildHeader() {
  return (
    <View>
      <Text style={styles.title}>Add New Child</Text>
      <Text style={styles.subtitle}>Midwife - Register child to parent</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.submit,
    marginTop: 20,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textDark,
    marginBottom: 20,
    fontStyle: "italic",
  },
});