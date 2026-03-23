import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  count: number;
  submitting: boolean;
  onSubmit: () => void;
};

export default function MilestoneActions({
  count,
  submitting,
  onSubmit,
}: Props) {
  return (
    <>
      {count > 0 && (
        <View style={styles.newCountCard}>
          <Text style={styles.newCountText}>
            New to submit: {count} milestone(s)
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.submitButton,
          (submitting || count === 0) && styles.disabledButton,
        ]}
        onPress={onSubmit}
        disabled={submitting || count === 0}
      >
        <Text style={styles.submitButtonText}>
          {submitting
            ? "Submitting..."
            : `Submit ${count} New Milestone(s)`}
        </Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  newCountCard: {
    backgroundColor: "#e3f2fd",
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    marginBottom: 10,
  },
  newCountText: {
    color: "#1976d2",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: "#27ae60",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#95a5a6",
  },
});