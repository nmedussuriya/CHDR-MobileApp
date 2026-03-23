import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/colors";

type Child = {
  child_id: string;
  child_name: string;
  dob: string;
  gender: "Male" | "Female";
  address: string;
};

type Props = {
  child: Child;
  onPress: () => void;
};

export default function ChildListItem({ child, onPress }: Props) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  const genderIcon = child.gender === "Male" ? "man" : "woman";
  const genderColor = child.gender === "Male" ? "#3498db" : "#e83e8c";

  return (
    <TouchableOpacity style={styles.childCard} onPress={onPress}>
      <View style={styles.childHeader}>
        <View style={[styles.iconContainer, { backgroundColor: genderColor }]}>
          <Ionicons name={genderIcon} size={24} color="#fff" />
        </View>

        <View style={styles.childInfo}>
          <Text style={styles.childName}>{child.child_name}</Text>
          <Text style={styles.childDetails}>
            DOB: {formatDate(child.dob)} • {child.gender}
          </Text>
          <Text style={styles.childAddress}>{child.address}</Text>
        </View>

        <Ionicons name="chevron-forward" size={24} color={Colors.primary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  childCard: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginBottom: 10,
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
    alignItems: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  childDetails: {
    fontSize: 13,
    color: "#7f8c8d",
    marginBottom: 2,
  },
  childAddress: {
    fontSize: 12,
    color: "#95a5a6",
  },
});