import React from "react";
import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator, // Add this import
} from "react-native";
import { Colors } from "../constants/colors";

type AuthCardProps = {
  title: string;
  imageSource: ImageSourcePropType;
  backgroundSource: ImageSourcePropType;
  username: string;
  password: string;
  setUsername: (text: string) => void;
  setPassword: (text: string) => void;
  onLogin: () => void;
  loading?: boolean;  // ← ADD THIS (optional)
  demoText?: string;
  showConfirmPassword?: boolean;
};

export default function AuthCard({
  title,
  imageSource,
  backgroundSource,
  username,
  password,
  setUsername,
  setPassword,
  onLogin,
  loading = false,  // ← ADD THIS with default value
  demoText,
  showConfirmPassword = false,
}: AuthCardProps) {
  return (
    <ImageBackground
      source={backgroundSource}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Image source={imageSource} style={styles.image} />

          <Text style={styles.title}>{title}</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {showConfirmPassword && (
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
            />
          )}

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={onLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          {demoText ? <Text style={styles.demo}>{demoText}</Text> : null}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: 340,
    backgroundColor: "white",
    borderRadius: 35,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 25,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: Colors.textDark,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#a5d6a7",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  demo: {
    marginTop: 15,
    fontSize: 12,
    textAlign: "center",
    color: "#555",
  },
});