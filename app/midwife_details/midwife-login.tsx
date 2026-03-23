import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert, // Add Image import
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Colors } from "../../constants/colors"; // ← Import your colors!
import { auth, db } from "../../firebase/firebaseConfig";



const { width, height } = Dimensions.get('window');

export default function MidwifeLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

 const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert("Error", "Please enter email and password");
    return;
  }

  setLoading(true);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (!userDoc.exists()) {
      Alert.alert("Error", "User not found");
      return;
    }

    const userData = userDoc.data();
    const roleId = userData.role_id;

    if (roleId === "2") {
      // ✅ ADD THE STAFF QUERY CODE HERE
      const staffQuery = query(
        collection(db, "staffs"),
        where("user_id", "==", user.uid)
      );
      const staffSnapshot = await getDocs(staffQuery);
      
      if (!staffSnapshot.empty) {
        const staffId = staffSnapshot.docs[0].id;
        
        // Go to My Children page with staffId
        router.push({
          pathname: "/midwife_details/my-children",
          params: { staffId: staffId }
        });
      } else {
        Alert.alert("Error", "Staff record not found");
        await auth.signOut();
      }
    } else {
      Alert.alert("Access Denied", "You are not authorized as a midwife");
      await auth.signOut();
    }

  } catch (error: any) {
    Alert.alert("Login Failed", error.message);
  } finally {
    setLoading(false);
  }
};
  return (
    <ImageBackground
      source={require("../../assets/images/login-bg.jpg")}
      style={styles.backgroundImage}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        {/* Login Card */}
        <View style={styles.card}>
          {/* Image Rectangle at the Top */}
          <View style={styles.imageContainer}>
            <Image 
              source={require("../../assets/images/home-bg.jpg")}
              style={styles.topImage}
              resizeMode="contain"
            />
          </View>

          {/* Header with Icon */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Midwife Login</Text>
            <Text style={styles.subtitle}>Healthcare Professional Portal</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.eyeButtonText}>
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotButton}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Login</Text>
                  <Text style={styles.loginButtonArrow}>→</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Secure login • Role-based access</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 35,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginTop:40,
  },
  // New image container style
  imageContainer: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
    
  },
  topImage: {
    width: 310,
    height: 180,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.label,
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: Colors.textDark,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
    color: "#333",
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  eyeButtonText: {
    fontSize: 20,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    color: Colors.primary,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#2e322e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: "#a5d6a7",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  loginButtonArrow: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "300",
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: "#999",
    fontSize: 12,
  },
});