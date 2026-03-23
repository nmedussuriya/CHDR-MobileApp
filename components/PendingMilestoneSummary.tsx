import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  count: number;
};

export default function PendingMilestoneSummary({ count }: Props) {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryText}>Pending Reports: {count}</Text>
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
});