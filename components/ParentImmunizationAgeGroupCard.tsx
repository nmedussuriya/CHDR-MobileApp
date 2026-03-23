import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { ImmunizationRecord, vaccine } from "../firebase/types";

type Item = ImmunizationRecord & { vaccineDetails?: vaccine };

type Props = {
  ageGroup: string;
  items: Item[];
  children: React.ReactNode;
};

export default function ParentImmunizationAgeGroupCard({
  ageGroup,
  items,
  children,
}: Props) {
  return (
    <View style={styles.ageGroupCard}>
      <View style={styles.ageGroupHeader}>
        <Text style={styles.ageGroupTitle}>{ageGroup}</Text>
        <View style={styles.ageGroupBadge}>
          <Text style={styles.ageGroupBadgeText}>{items.length}</Text>
        </View>
      </View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  ageGroupCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ageGroupHeader: {
    backgroundColor: "#3498db",
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ageGroupTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  ageGroupBadge: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  ageGroupBadgeText: {
    color: "#3498db",
    fontWeight: "bold",
    fontSize: 12,
  },
});