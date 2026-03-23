import React from "react";
import { StyleSheet, Text } from "react-native";
import { Colors } from "../constants/colors";

type Props = {
  childName: string;
};

export default function ParentMilestoneHeader({ childName }: Props) {
  return (
    <>
      <Text style={styles.title}>Report Milestones</Text>
      <Text style={styles.subtitle}>{childName}'s Development</Text>
    </>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 20,
    fontStyle: "italic",
  },
});