import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ScreeningTypeSelector({
  type,
  setType,
}: any) {
  return (
    <View style={styles.container}>
      {["t1", "t2"].map((t) => (
        <TouchableOpacity
          key={t}
          style={[
            styles.button,
            type === t && styles.active
          ]}
          onPress={() => setType(t)}
        >
          <Text style={[
            styles.text,
            type === t && styles.activeText
          ]}>
            {t === "t1" ? "Vision" : "Hearing"}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  button: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  active: {
    backgroundColor: "#3498db",
  },
  text: {
    fontWeight: "600",
  },
  activeText: {
    color: "#fff",
  },
});