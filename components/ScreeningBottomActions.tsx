import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors } from "../constants/colors";

type Props = {
  onRefresh: () => void;
  onBack: () => void;
};

export default function ScreeningBottomActions({ onRefresh, onBack }: Props) {
  return (
    <>
      <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
        <Text style={styles.refreshButtonText}>↻ Refresh Data</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← Back to Dashboard</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  refreshButton: {
    backgroundColor: Colors.label,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  refreshButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    padding: 10,
    marginBottom: 30,
    marginTop: 10,
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: 16,
    textAlign: "center",
  },
});