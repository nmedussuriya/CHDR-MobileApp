import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/colors";

type InfoBoxProps = {
  label: string;
  value: string;
};

export default function InfoBox({ label, value }: InfoBoxProps) {
  return (
    <View style={styles.infoBox}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  infoBox: {
    backgroundColor: Colors.inputBg,
    padding: 14,
    borderRadius: 20,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: Colors.label,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
  },
});