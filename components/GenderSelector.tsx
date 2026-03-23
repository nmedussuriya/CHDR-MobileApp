import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/colors";

type Props = {
  gender: "Male" | "Female";
  onChange: (value: "Male" | "Female") => void;
};

export default function GenderSelector({ gender, onChange }: Props) {
  return (
    <View style={styles.container}>
      {(["Male", "Female"] as const).map((item) => (
        <TouchableOpacity
          key={item}
          style={[styles.button, gender === item && styles.activeButton]}
          onPress={() => onChange(item)}
        >
          <Text style={[styles.text, gender === item && styles.activeText]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    alignItems: "center",
    marginBottom:20,
  },
  activeButton: {
    backgroundColor: Colors.submit,
    borderColor: Colors.submit,
  },
  text: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  activeText: {
    color: "#fff",
  },
});