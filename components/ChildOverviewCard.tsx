import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  childName: string;
  parentName?: string;
  dob?: string;
  gender?: string;
  onPress: () => void;
};

export default function ChildOverviewCard({
  childName,
  parentName,
  dob,
  gender,
  onPress,
}: Props) {
  return (
    <>
      <View style={styles.childHeader}>
        <Text style={styles.childHeaderTitle}>{childName}'s Dashboard</Text>
        {!!parentName && (
          <Text style={styles.parentNameText}>Parent: {parentName}</Text>
        )}
      </View>

      <TouchableOpacity style={styles.totalCard} onPress={onPress}>
        <Text style={styles.totalLabel}>Current Child</Text>
        <Text style={styles.childNameLarge}>{childName}</Text>
        <Text style={styles.cardSubtext}>
          DOB: {dob || "N/A"} • {gender || "N/A"}
        </Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  childHeader: {
    backgroundColor: "#fff",
    padding: 15,
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  childHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "center",
  },
  parentNameText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  totalCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
    marginHorizontal: 15,
  },
  totalLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  childNameLarge: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 5,
  },
  cardSubtext: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
});