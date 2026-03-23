import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function EmptyChildrenState() {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="people-outline" size={60} color="#ccc" />
      <Text style={styles.emptyTitle}>No Children Assigned</Text>
      <Text style={styles.emptyText}>
        You don't have any children assigned to you yet.{"\n"}
        Tap the "Register New Child" button above to add one.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginTop: 10,
    marginBottom: 5,
  },
  emptyText: {
    fontSize: 14,
    color: "#95a5a6",
    textAlign: "center",
    lineHeight: 20,
  },
});
