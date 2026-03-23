import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  inputText: string;
  setInputText: (value: string) => void;
  loading: boolean;
  onSend: () => void;
  inputRef: React.RefObject<TextInput | null>;
};

export default function ChatInputBar({
  inputText,
  setInputText,
  loading,
  onSend,
  inputRef,
}: Props) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      style={styles.keyboardAvoidingView}
    >
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.micButton}>
          <Ionicons name="mic-outline" size={24} color="#4CAF50" />
        </TouchableOpacity>

        <TextInput
          ref={inputRef}
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask about child health..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
          editable={!loading}
          returnKeyType="send"
          blurOnSubmit={false}
          onSubmitEditing={onSend}
        />

        {inputText.trim() ? (
          <TouchableOpacity style={styles.sendButton} onPress={onSend} disabled={loading}>
            <LinearGradient colors={["#4CAF50", "#2E7D32"]} style={styles.sendGradient}>
              <Ionicons name="send" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.emojiButton}>
            <Ionicons name="happy-outline" size={24} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  micButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    color: "#333",
  },
  sendButton: {
    marginLeft: 8,
  },
  sendGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  emojiButton: {
    padding: 10,
    marginLeft: 8,
  },
});