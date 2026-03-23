import { Picker } from "@react-native-picker/picker";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Child = {
  child_id: string;
  child_name: string;
};

type Props = {
  selectedType: "all" | "t1" | "t2";
  selectedChild: string;
  setSelectedType: (value: "all" | "t1" | "t2") => void;
  setSelectedChild: (value: string) => void;
  childList: Child[];
};

export default function ScreeningFiltersCard({
  selectedType,
  selectedChild,
  setSelectedType,
  setSelectedChild,
  childList,
}: Props) {
  return (
    <View style={styles.filtersContainer}>
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Screening Type:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedType}
            onValueChange={setSelectedType}
            style={styles.picker}
          >
            <Picker.Item label="All Types" value="all" />
            <Picker.Item label="👁️ Vision Only" value="t1" />
            <Picker.Item label="👂 Hearing Only" value="t2" />
          </Picker>
        </View>
      </View>

      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Child:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedChild}
            onValueChange={setSelectedChild}
            style={styles.picker}
          >
            <Picker.Item label="All Children" value="all" />
            {childList.map((child) => (
              <Picker.Item
                key={child.child_id}
                label={child.child_name}
                value={child.child_id}
              />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filtersContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterRow: {
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#34495e",
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
    height: 45,
    width: "100%",
  },
});