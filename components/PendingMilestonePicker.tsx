import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Colors } from "../constants/colors";
import type { ChildDevelopmentRecord, DevelopmentMilestone } from "../firebase/types";

type Props = {
  selectedRecord: string;
  pendingRecords: ChildDevelopmentRecord[];
  milestones: { [key: string]: DevelopmentMilestone };
  onChange: (value: string) => void;
};

export default function PendingMilestonePicker({
  selectedRecord,
  pendingRecords,
  milestones,
  onChange,
}: Props) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Select Pending Report *</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedRecord}
          onValueChange={onChange}
          style={styles.picker}
        >
          <Picker.Item label="-- Choose a report --" value="" />
          {pendingRecords.map((record) => {
            const milestone = milestones[record.development_id];
            return (
              <Picker.Item
                key={record.record_id}
                label={`${milestone?.age_group || "Unknown"} - Reported: ${record.reported_month}`}
                value={record.record_id}
              />
            );
          })}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: "100%",
  },
});