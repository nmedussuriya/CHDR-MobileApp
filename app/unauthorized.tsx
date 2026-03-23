import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function Unauthorized() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔒</Text>
      <Text style={styles.title}>Not Logged In</Text>
      <Text style={styles.message}>
        You need to login first to access this area.
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.midwifeButton]}
          onPress={() => router.push("/midwife_details/midwife-login")}
        >
          <Text style={styles.buttonText}>Midwife Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.parentButton]}
          onPress={() => router.push("/parent/parent-login")}
        >
          <Text style={styles.buttonText}>Parent Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  icon: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  buttonContainer: {
    width: "100%",
    gap: 15,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  midwifeButton: {
    backgroundColor: "#4CAF50",
  },
  parentButton: {
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});