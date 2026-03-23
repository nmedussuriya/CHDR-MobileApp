import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
  question: string;
  onAnswer: (answer: "Yes" | "No") => void;
  initialAnswer?: "Yes" | "No";
}

export default function YesNoQuestionCard({ question, onAnswer, initialAnswer }: Props) {
  const [selected, setSelected] = useState<"Yes" | "No" | null>(initialAnswer || null);

  const handleAnswer = (answer: "Yes" | "No") => {
    setSelected(answer);
    onAnswer(answer);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.question}>{question}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, selected === "Yes" && styles.selectedYes]}
          onPress={() => handleAnswer("Yes")}
        >
          <Text style={styles.buttonText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selected === "No" && styles.selectedNo]}
          onPress={() => handleAnswer("No")}
        >
          <Text style={styles.buttonText}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#fff", padding: 15, margin: 10, borderRadius: 10 },
  question: { fontSize: 16, marginBottom: 10 },
  buttons: { flexDirection: "row", justifyContent: "space-around" },
  button: { padding: 10, borderRadius: 5, borderWidth: 1, width: 80, alignItems: "center" },
  selectedYes: { backgroundColor: "#4CAF50", borderColor: "#4CAF50" },
  selectedNo: { backgroundColor: "#f44336", borderColor: "#f44336" },
  buttonText: { fontSize: 14 }
});