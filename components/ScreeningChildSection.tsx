import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/colors";

type Props = {
  childName: string;
  parentName: string;
  children: React.ReactNode;
};

export default function ScreeningChildSection({
  childName,
  parentName,
  children,
}: Props) {
  return (
    <View style={styles.childSection}>
      <View style={styles.childHeader}>
        <Text style={styles.childName}>{childName}</Text>
        <Text style={styles.parentName}>Parent: {parentName}</Text>
      </View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  childSection: {
    marginBottom: 25,
  },
  childHeader: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  childName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  parentName: {
    fontSize: 14,
    color: "#e0e0e0",
    marginTop: 3,
  },
});