import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/colors";

type Props = {
  onBack: () => void;
};

export default function ReportHeader({ onBack }: Props) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backIcon}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <View>
        <Text style={styles.headerTitle}>Child Health Report</Text>
        <Text style={styles.headerDate}>
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    padding: 20,
    paddingTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    marginRight: 15,
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  headerDate: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
});