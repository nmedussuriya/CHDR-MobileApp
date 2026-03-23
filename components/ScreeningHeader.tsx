import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/colors";

export default function ScreeningHeader({ type }: { type: "t1" | "t2" }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Child Development Screening</Text>
      <Text style={styles.subtitle}>
        {type === "t1" ? "👁️ Vision Milestones" : "👂 Hearing Milestones"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.submit,
  },
  subtitle: {
    fontSize: 18,
    color: "#7f8c8d",
  },
});