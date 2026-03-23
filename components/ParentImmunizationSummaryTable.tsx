import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { ImmunizationRecord, vaccine } from "../firebase/types";

type Item = ImmunizationRecord & { vaccineDetails?: vaccine };

type Props = {
  ageGroups: string[];
  immunizationsByAgeGroup: { [key: string]: Item[] };
};

export default function ParentImmunizationSummaryTable({
  ageGroups,
  immunizationsByAgeGroup,
}: Props) {
  const hasRows = ageGroups.some((ageGroup) => (immunizationsByAgeGroup[ageGroup]?.length || 0) > 0);
  if (!hasRows) return null;

  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>📊 Vaccination Summary</Text>

      {ageGroups.map((ageGroup) => {
        const count = immunizationsByAgeGroup[ageGroup]?.length || 0;
        if (count === 0) return null;

        const completedInGroup =
          immunizationsByAgeGroup[ageGroup]?.filter((imm) => imm.status === "Completed").length || 0;

        return (
          <View key={ageGroup} style={styles.summaryRow}>
            <Text style={styles.summaryAgeGroup}>{ageGroup}</Text>

            <View style={styles.summaryStats}>
              <Text style={styles.summaryCompleted}>
                {completedInGroup}/{count}
              </Text>

              <View style={styles.summaryProgressBar}>
                <View
                  style={[
                    styles.summaryProgressFill,
                    { width: `${(completedInGroup / count) * 100}%` },
                  ]}
                />
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    padding: 15,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  summaryAgeGroup: {
    flex: 1,
    fontSize: 13,
    color: "#34495e",
  },
  summaryStats: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  summaryCompleted: {
    fontSize: 13,
    fontWeight: "600",
    color: "#27ae60",
    width: 40,
  },
  summaryProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#ecf0f1",
    borderRadius: 3,
    overflow: "hidden",
  },
  summaryProgressFill: {
    height: "100%",
    backgroundColor: "#27ae60",
  },
});