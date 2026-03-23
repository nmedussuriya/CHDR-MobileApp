import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  total: number;
  yesCount: number;
  noCount: number;
  childrenCount: number;
};

export default function ScreeningSummaryCards({
  total,
  yesCount,
  noCount,
  childrenCount,
}: Props) {
  return (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryNumber}>{total}</Text>
        <Text style={styles.summaryLabel}>Total Responses</Text>
      </View>

      <View style={[styles.summaryCard, styles.yesCard]}>
        <Text style={styles.summaryNumber}>{yesCount}</Text>
        <Text style={styles.summaryLabel}>Yes</Text>
      </View>

      <View style={[styles.summaryCard, styles.noCard]}>
        <Text style={styles.summaryNumber}>{noCount}</Text>
        <Text style={styles.summaryLabel}>No</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryNumber}>{childrenCount}</Text>
        <Text style={styles.summaryLabel}>Children</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    width: "48%",
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  yesCard: {
    backgroundColor: "#d4edda",
  },
  noCard: {
    backgroundColor: "#f8d7da",
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 5,
  },
});