import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors } from "../constants/colors";

type Props = {
  onPress: () => void;
};

export default function BackToMyChildrenLink({ onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.backLink}>← Back to My Children</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backLink: {
    color: Colors.textDark,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 30,
    fontSize: 16,
  },
});