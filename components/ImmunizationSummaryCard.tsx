import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  selectedCount: number;
  takenCount: number;
};

export default function ImmunizationSummaryCard({
  selectedCount,
  takenCount,
}: Props) {
  if (selectedCount === 0) return null;

  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryText}>
        Selected: {selectedCount} new vaccine(s)
      </Text>
      <Text style={styles.summarySubText}>
        Already given: {takenCount} vaccines
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: "#e8f5e9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  summaryText: {
    color: "#27ae60",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  summarySubText: {
    color: "#7f8c8d",
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
  },
});