import React from "react";
import { StyleSheet, Text, View } from "react-native";

type FollowUp = {
  followup_id: string;
  period: string;
  weight: number;
  head_circumference: number;
};

type Props = {
  followUps: FollowUp[];
};

export default function RecentFollowUpsCard({ followUps }: Props) {
  if (followUps.length === 0) return null;

  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>📋 Recent Follow-ups</Text>

      {followUps.slice(0, 3).map((f) => (
        <Text key={f.followup_id} style={styles.summaryItem}>
          • {f.period}: {f.weight}kg, {f.head_circumference}cm
        </Text>
      ))}

      {followUps.length > 3 && (
        <Text style={styles.summaryMore}>
          and {followUps.length - 3} more...
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
  summaryTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#27ae60",
    marginBottom: 8,
  },
  summaryItem: {
    fontSize: 13,
    color: "#2c3e50",
    marginBottom: 4,
  },
  summaryMore: {
    fontSize: 12,
    color: "#7f8c8d",
    fontStyle: "italic",
    marginTop: 2,
  },
});