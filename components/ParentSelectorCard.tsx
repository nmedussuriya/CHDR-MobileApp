import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Colors } from "../constants/colors";
import type { parent } from "../firebase/types";

type Props = {
  parents: parent[];
  selectedParent: string;
  selectedParentName: string;
  onChange: (value: string) => void;
};

export default function ParentSelectorCard({
  parents,
  selectedParent,
  selectedParentName,
  onChange,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Select Parent *</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedParent}
          onValueChange={onChange}
          style={styles.picker}
        >
          <Picker.Item label="-- Choose a parent --" value="" />
          {parents.map((p) => (
            <Picker.Item
              key={p.parent_id}
              label={`${p.parent_name} (${p.contact_number})`}
              value={p.parent_id}
            />
          ))}
        </Picker>
      </View>

      {!!selectedParentName && (
        <Text style={styles.selectedText}>
          Adding child for: {selectedParentName}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  selectedText: {
    fontSize: 14,
    color: "#27ae60",
    fontWeight: "500",
    marginTop: 5,
  },
});