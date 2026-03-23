import { Picker } from "@react-native-picker/picker";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/colors";

type Props = {
  selected: string;
  setSelected: (value: string) => void;
  ageGroups: string[];
};

export default function AgeGroupPicker({
  selected,
  setSelected,
  ageGroups,
}: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Select Age Group *</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selected}
          onValueChange={(value) => setSelected(value)}
          style={styles.picker}
        >
          <Picker.Item label="-- Choose age group --" value="" />
          {ageGroups.map((ageGroup, index) => (
            <Picker.Item
              key={index}
              label={ageGroup}
              value={ageGroup}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
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
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    width: "100%",
  },
});