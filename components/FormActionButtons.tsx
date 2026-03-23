import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/colors";

type Props = {
  loading: boolean;
  submitDisabled?: boolean;
  submitText: string;
  onClear: () => void;
  onSubmit: () => void;
};

export default function FormActionButtons({
  loading,
  submitDisabled = false,
  submitText,
  onClear,
  onSubmit,
}: Props) {
  return (
    <View style={styles.buttonRow}>
      <TouchableOpacity
        style={[styles.button, styles.clearButton]}
        onPress={onClear}
        disabled={loading}
      >
        <Text style={styles.clearButtonText}>Clear</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          styles.submitButton,
          (loading || submitDisabled) && styles.submitButtonDisabled,
        ]}
        onPress={onSubmit}
        disabled={loading || submitDisabled}
      >
        <Text style={styles.submitButtonText}>
          {loading ? "Saving..." : submitText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 10,
    marginBottom: 30,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: Colors.submit,
  },
  submitButtonDisabled: {
    backgroundColor: "#a5d6a7",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  clearButton: {
    backgroundColor: Colors.label,
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});