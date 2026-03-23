import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/colors";

type Props = {
  index: number;
  questionText: string;
  screeningTypeName: string;
  answer: string;
  dateChecked: string;
};

export default function ScreeningResponseItem({
  index,
  questionText,
  screeningTypeName,
  answer,
  dateChecked,
}: Props) {
  const answerStyle = answer === "Yes" ? styles.yesAnswer : styles.noAnswer;

  return (
    <View style={styles.responseCard}>
      <View style={styles.responseHeader}>
        <Text style={styles.questionNumber}>Q{index + 1}</Text>
        <Text style={styles.screeningType}>{screeningTypeName}</Text>
      </View>

      <Text style={styles.questionText}>{questionText}</Text>

      <View style={styles.responseFooter}>
        <View style={[styles.answerBadge, answerStyle]}>
          <Text style={styles.answerText}>{answer}</Text>
        </View>

        <Text style={styles.dateText}>
          📅 {new Date(dateChecked).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  responseCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    marginLeft: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  responseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  questionNumber: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textDark,
  },
  screeningType: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  questionText: {
    fontSize: 15,
    color: "#34495e",
    marginBottom: 12,
    lineHeight: 22,
  },
  responseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  answerBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  yesAnswer: {
    backgroundColor: "#d4edda",
  },
  noAnswer: {
    backgroundColor: "#f8d7da",
  },
  answerText: {
    fontSize: 14,
    fontWeight: "600",
  },
  dateText: {
    fontSize: 12,
    color: "#95a5a6",
  },
});