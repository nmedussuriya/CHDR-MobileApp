import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/colors";

type Props = {
  childName?: string;
  totalGiven: number;
};

export default function ChildInfoCard({ childName, totalGiven }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Child:</Text>
        <Text style={styles.value}>{childName || "N/A"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Already given:</Text>
        <Text style={styles.value}>{totalGiven} vaccines</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#e8f5e9",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.submit,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    color: "#2c3e50",
    fontWeight: "600",
  },
  value: {
    fontSize: 14,
    color: Colors.submit,
    fontWeight: "bold",
  },
});