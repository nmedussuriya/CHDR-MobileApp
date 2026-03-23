import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onAllChildren: () => void;
  onGoBack: () => void;
};

export default function QuickLinksRow({
  onAllChildren,
  onGoBack,
}: Props) {
  return (
    <View style={styles.quickLinksRow}>
      <TouchableOpacity style={styles.quickLink} onPress={onAllChildren}>
        <Ionicons name="people" size={22} color="#4CAF50" />
        <Text style={styles.quickLinkText}>All Children</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.quickLink} onPress={onGoBack}>
        <Ionicons name="arrow-back" size={22} color="#4CAF50" />
        <Text style={styles.quickLinkText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  quickLinksRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickLink: {
    alignItems: "center",
  },
  quickLinkText: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
});