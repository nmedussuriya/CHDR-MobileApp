import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { Colors } from "../constants/colors";

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  marginBottom?: number;
  style?: ViewStyle;   // ✅ ADD THIS
};

export default function CustomButton({
  title,
  onPress,
  marginBottom = 0,
  style,
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, { marginBottom }, style]}   // ✅ APPLY STYLE
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});