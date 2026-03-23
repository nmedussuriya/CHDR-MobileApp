import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  total: number;
  completed: number;
  pending: number;
};

export default function ParentImmunizationStats({
  total,
  completed,
  pending,
}: Props) {
  return (
    <View style={styles.statsContainer}>
      <View style={[styles.statCard, styles.totalCard]}>
        <Text style={styles.statNumber}>{total}</Text>
        <Text style={styles.statLabel}>Total Records</Text>
      </View>

      <View style={[styles.statCard, styles.completedCard]}>
        <Text style={styles.statNumber}>{completed}</Text>
        <Text style={styles.statLabel}>Completed</Text>
      </View>

      <View style={[styles.statCard, styles.pendingCard]}>
        <Text style={styles.statNumber}>{pending}</Text>
        <Text style={styles.statLabel}>Pending</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 15,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalCard: {
    backgroundColor: "#3498db",
  },
  completedCard: {
    backgroundColor: "#27ae60",
  },
  pendingCard: {
    backgroundColor: "#e67e22",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: 12,
    color: "#fff",
    marginTop: 5,
  },
});