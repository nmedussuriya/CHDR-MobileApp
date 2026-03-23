import { StyleSheet, TextInput, TextInputProps } from "react-native";
import { Colors } from "../constants/colors";

type CustomInputProps = TextInputProps & {
  placeholder: string;
};

export default function CustomInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  multiline = false,
  style,
  ...rest
}: CustomInputProps) {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#777"
      style={[styles.input, multiline && styles.multilineInput, style]}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      multiline={multiline}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.inputBg,
    padding: 14,
    borderRadius: 30,
    marginBottom: 15,
    minHeight: 50,
    color: "#333",
  },
  multilineInput: {
    borderRadius: 12,
    textAlignVertical: "top",
    minHeight: 80,
  },
});