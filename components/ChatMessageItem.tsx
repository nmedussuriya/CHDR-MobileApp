import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import TypingDots from "./TypingDots";

type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  isTyping?: boolean;
};

type Props = {
  item: Message;
  formatTime: (date: Date) => string;
};

export default function ChatMessageItem({ item, formatTime }: Props) {
  const isUser = item.sender === "user";
  const isTyping = item.isTyping;

  return (
    <View style={[styles.messageRow, isUser ? styles.userRow : styles.aiRow]}>
      {!isUser && (
        <View style={styles.avatarContainer}>
          <LinearGradient colors={["#4CAF50", "#2E7D32"]} style={styles.avatar}>
            <Text style={styles.avatarText}>DR</Text>
          </LinearGradient>
        </View>
      )}

      <View
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.aiBubble,
          isTyping && styles.typingBubble,
        ]}
      >
        {isTyping ? (
          <TypingDots />
        ) : (
          <>
            <Text style={isUser ? styles.userText : styles.aiText}>{item.text}</Text>
            <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
          </>
        )}
      </View>

      {isUser && (
        <View style={styles.userAvatar}>
          <Ionicons name="person-circle" size={36} color="#4CAF50" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  messageRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-end",
  },
  userRow: {
    justifyContent: "flex-end",
  },
  aiRow: {
    justifyContent: "flex-start",
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  userAvatar: {
    marginLeft: 8,
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 20,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  userBubble: {
    backgroundColor: "#4CAF50",
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  typingBubble: {
    backgroundColor: "#fff",
    paddingVertical: 15,
  },
  userText: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 22,
  },
  aiText: {
    color: "#333",
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 10,
    color: "#999",
    marginTop: 4,
    alignSelf: "flex-end",
  },
});