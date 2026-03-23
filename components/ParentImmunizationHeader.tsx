import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/colors";

type Props = {
  childName?: string;
};

export default function ParentImmunizationHeader({ childName }: Props) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>💉 Immunization Records</Text>
      {childName ? (
        <Text style={styles.subtitle}>{childName}'s Vaccination History</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.submit,
    marginTop: 40,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
  },
});