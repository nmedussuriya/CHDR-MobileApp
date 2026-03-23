import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Colors } from "../constants/colors";

type Props = {
  dob: Date;
  showDatePicker: boolean;
  setShowDatePicker: (value: boolean) => void;
  onDateChange: (_: any, selectedDate?: Date) => void;
};

export default function DateOfBirthPicker({
  dob,
  showDatePicker,
  setShowDatePicker,
  onDateChange,
}: Props) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Date of Birth *</Text>

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateButtonText}>{dob.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dob}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 5,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
  },
});