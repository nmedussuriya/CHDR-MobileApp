import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  count: number;
  childName: string;
};

export default function SubmittedSummary({ count, childName }: Props) {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryText}>
        ✓ {count} milestones already reported for {childName}
      </Text>
      {count > 0 && (
        <Text style={styles.summarySubText}>
          These milestones are disabled (already submitted)
        </Text>
      )}
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
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  summarySubText: {
    color: "#7f8c8d",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
});