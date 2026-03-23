import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Colors } from "../constants/colors";

type Props = {
  period: string;
  periods: string[];
  isPeriodTaken: (value: string) => boolean;
  onChange: (value: string) => void;
};

export default function FollowUpPeriodPicker({
  period,
  periods,
  isPeriodTaken,
  onChange,
}: Props) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Follow-up Period *</Text>

      <View style={styles.pickerContainer}>
        <Picker selectedValue={period} onValueChange={onChange} style={styles.picker}>
          <Picker.Item label="-- Select period --" value="" />
          {periods.map((p) => {
            const taken = isPeriodTaken(p);
            return (
              <Picker.Item
                key={p}
                label={taken ? `${p} (Already Recorded)` : p}
                value={p}
                color={taken ? "#27ae60" : "#333"}
                enabled={!taken}
              />
            );
          })}
        </Picker>
      </View>

      {period && isPeriodTaken(period) && (
        <Text style={styles.warningText}>
          ⚠️ This period already has a follow-up record
        </Text>
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  warningText: {
    fontSize: 12,
    color: "#e74c3c",
    marginTop: 4,
    fontStyle: "italic",
  },
});