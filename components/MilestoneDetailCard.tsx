import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/colors";

type Props = {
  reportedMonth: string;
  milestoneName: string;
  childId: string;
};

export default function MilestoneDetailCard({
  reportedMonth,
  milestoneName,
  childId,
}: Props) {
  return (
    <View style={styles.detailBox}>
      <Text style={styles.detailTitle}>Report Details:</Text>
      <Text style={styles.detailText}>📅 Reported: {reportedMonth}</Text>
      <Text style={styles.detailText}>🎯 Milestone: {milestoneName}</Text>
      <Text style={styles.detailText}>👶 Child ID: {childId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  detailBox: {
    backgroundColor: "#f0f8ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.card,
    marginBottom: 5,
  },
  detailText: {
    fontSize: 14,
    color: "#34495e",
    marginBottom: 3,
  },
});