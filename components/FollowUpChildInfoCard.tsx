import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/colors";

type Props = {
  childName?: string;
  existingCount: number;
  onViewRecords: () => void;
};

export default function FollowUpChildInfoCard({
  childName,
  existingCount,
  onViewRecords,
}: Props) {
  return (
    <View style={styles.childInfoCard}>
      <View style={styles.childInfoRow}>
        <Text style={styles.childInfoLabel}>Child:</Text>
        <Text style={styles.childInfoValue}>{childName}</Text>
      </View>

      <View style={styles.childInfoRow}>
        <Text style={styles.childInfoLabel}>Existing records:</Text>
        <Text style={styles.childInfoValue}>{existingCount}</Text>
      </View>

      {existingCount > 0 && (
        <TouchableOpacity onPress={onViewRecords} style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View all records →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  childInfoCard: {
    backgroundColor: "#e8f5e9",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.submit,
  },
  childInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  childInfoLabel: {
    fontSize: 14,
    color: "#2c3e50",
    fontWeight: "600",
  },
  childInfoValue: {
    fontSize: 14,
    color: Colors.submit,
    fontWeight: "bold",
  },
  viewButton: {
    marginTop: 8,
    alignItems: "center",
  },
  viewButtonText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: "600",
  },
});