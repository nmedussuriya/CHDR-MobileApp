import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  childName?: string;
};

export default function ParentImmunizationEmptyState({ childName }: Props) {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>💉</Text>
      <Text style={styles.emptyTitle}>No Vaccination Records</Text>
      <Text style={styles.emptyText}>
        {childName || "Your child"} hasn't received any vaccines yet.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 20,
    padding: 40,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
  },
});