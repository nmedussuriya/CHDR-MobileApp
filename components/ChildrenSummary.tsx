import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/colors";

type Props = {
  total: number;
  male: number;
  female: number;
};

export default function ChildrenSummary({ total, male, female }: Props) {
  return (
    <View style={styles.summaryContainer}>
      <View style={[styles.summaryCard, { backgroundColor: Colors.primary }]}>
        <Text style={styles.summaryNumber}>{total}</Text>
        <Text style={styles.summaryLabel}>Total</Text>
      </View>

      <View style={[styles.summaryCard, { backgroundColor: "#3498db" }]}>
        <Text style={styles.summaryNumber}>{male}</Text>
        <Text style={styles.summaryLabel}>Male</Text>
      </View>

      <View style={[styles.summaryCard, { backgroundColor: "#e83e8c" }]}>
        <Text style={styles.summaryNumber}>{female}</Text>
        <Text style={styles.summaryLabel}>Female</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 15,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#fff",
    marginTop: 5,
  },
});