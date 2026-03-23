import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  total: number;
  completed: number;
};

export default function ParentImmunizationProgress({
  total,
  completed,
}: Props) {
  if (total === 0) return null;

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${(completed / total) * 100}%` },
          ]}
        />
      </View>
      <Text style={styles.progressText}>
        {completed} of {total} vaccines completed
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#ecf0f1",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 5,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#27ae60",
  },
  progressText: {
    fontSize: 12,
    color: "#7f8c8d",
    textAlign: "right",
  },
});