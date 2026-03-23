import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
  number: number;
  label: string;
  subLeft?: string;
  subRight?: string;
};

export default function ReportSummaryCard({
  icon,
  color,
  number,
  label,
  subLeft,
  subRight,
}: Props) {
  return (
    <View style={[styles.summaryCard, { backgroundColor: color }]}>
      <Ionicons name={icon} size={30} color="#fff" />
      <Text style={styles.summaryNumber}>{number}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>

      {(subLeft || subRight) && (
        <View style={styles.summarySubRow}>
          <Text style={styles.summarySubText}>{subLeft || ""}</Text>
          <Text style={styles.summarySubText}>{subRight || ""}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    width: "48%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#fff",
    marginTop: 2,
  },
  summarySubRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 5,
  },
  summarySubText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "500",
  },
});