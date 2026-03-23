import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/colors";

type Props = {
  midwifeName: string;
};

export default function MidwifeCard({ midwifeName }: Props) {
  if (!midwifeName) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Registering as:</Text>
      <Text style={styles.name}>{midwifeName}</Text>
      <Text style={styles.note}>
        This child will be automatically assigned to you
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#e8f5e9",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.submit,
  },
  label: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.submit,
    marginBottom: 4,
  },
  note: {
    fontSize: 11,
    color: "#666",
    fontStyle: "italic",
  },
});