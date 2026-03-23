import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CustomInput from "../components/CustomInput";
import { Colors } from "../constants/colors";

type Props = {
  birthWeight: string;
  setBirthWeight: (value: string) => void;
  headCircumference: string;
  setHeadCircumference: (value: string) => void;
};

export default function BirthMeasurementsRow({
  birthWeight,
  setBirthWeight,
  headCircumference,
  setHeadCircumference,
}: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.halfWidth}>
        <Text style={styles.label}>Birth Weight (kg) *</Text>
        <CustomInput
          placeholder="e.g., 3.5"
          value={birthWeight}
          onChangeText={setBirthWeight}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.halfWidth}>
        <Text style={styles.label}>Head Circ. (cm)</Text>
        <CustomInput
          placeholder="e.g., 34"
          value={headCircumference}
          onChangeText={setHeadCircumference}
          keyboardType="numeric"
        />
      </View>


    </View>
  );

}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 15,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 5,
  },
});