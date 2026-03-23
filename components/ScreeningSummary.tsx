import { StyleSheet, Text, View } from "react-native";

export default function ScreeningSummary({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <View style={styles.box}>
      <Text style={styles.text}>
        ✓ {count} question(s) already submitted
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#e8f5e9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  text: {
    color: "#27ae60",
    textAlign: "center",
  },
});