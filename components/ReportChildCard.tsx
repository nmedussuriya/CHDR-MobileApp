import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/colors";

type Props = {
  childName: string;
  dob: string;
  age: string;
  gender: string;
  parentName: string;
  midwifeName: string;
  address: string;
};

export default function ReportChildCard({
  childName,
  dob,
  age,
  gender,
  parentName,
  midwifeName,
  address,
}: Props) {
  return (
    <View style={styles.childCard}>
      <View style={styles.childHeader}>
        <Text style={styles.childName}>{childName}</Text>
        <View
          style={[
            styles.genderBadge,
            { backgroundColor: gender === "Male" ? "#3498db" : "#e83e8c" },
          ]}
        >
          <Text style={styles.genderText}>{gender}</Text>
        </View>
      </View>

      <View style={styles.childDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={16} color={Colors.primary} />
          <Text style={styles.detailText}>DOB: {dob}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="hourglass" size={16} color={Colors.primary} />
          <Text style={styles.detailText}>Age: {age}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="people" size={16} color={Colors.primary} />
          <Text style={styles.detailText}>Parent: {parentName}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="medical" size={16} color={Colors.primary} />
          <Text style={styles.detailText}>Midwife: {midwifeName}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="location" size={16} color={Colors.primary} />
          <Text style={styles.detailText}>Address: {address}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  childCard: {
    backgroundColor: "white",
    margin: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  childHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  childName: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.primary,
  },
  genderBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  genderText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  childDetails: {
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
});