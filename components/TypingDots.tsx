import React from "react";
import { StyleSheet, View } from "react-native";

export default function TypingDots() {
  return (
    <View style={styles.typingContainer}>
      <View style={styles.typingDot} />
      <View style={[styles.typingDot, styles.typingDotDelay]} />
      <View style={[styles.typingDot, styles.typingDotDelayLong]} />
    </View>
  );
}

const styles = StyleSheet.create({
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
    marginHorizontal: 3,
    opacity: 0.6,
  },
  typingDotDelay: {
    opacity: 0.4,
  },
  typingDotDelayLong: {
    opacity: 0.2,
  },
});