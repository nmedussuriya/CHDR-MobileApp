import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
  StatusBar
} from "react-native";
import { router } from "expo-router";
import { auth } from "../firebase/firebaseConfig";
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from "../constants/colors";

const { width, height } = Dimensions.get('window');

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/images/image.png")}
      style={styles.backgroundImage}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.7)']}
        style={styles.overlay}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            
            {/* Top Badge */}
            <View style={styles.topBadge}>
              <Text style={styles.badgeText}>Child Health System</Text>
            </View>

            {/* Main Content - Centered */}
            <View style={styles.contentContainer}>
              {/* Logo with Icon */}
              <View style={styles.logoWrapper}>
                <LinearGradient
                  colors={[Colors.primary, Colors.label]}
                  style={styles.logoGradient}
                >
                  <Ionicons name="medical" size={50} color="#fff" />
                </LinearGradient>
                <View style={styles.logoBadge}>
                  <Text style={styles.logoBadgeText}>EST 2024</Text>
                </View>
              </View>

              {/* Title Section */}
              <View style={styles.titleSection}>
                <Text style={styles.title}>Child Health</Text>
                <Text style={styles.subtitle}>Development Record System</Text>
                <View style={styles.divider} />
                <Text style={styles.description}>
                  Track, monitor, and manage child health records securely
                </Text>
              </View>

              {/* Stats Row - Small but impactful */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>10K+</Text>
                  <Text style={styles.statLabel}>Children</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>500+</Text>
                  <Text style={styles.statLabel}>Midwives</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>50K+</Text>
                  <Text style={styles.statLabel}>Records</Text>
                </View>
              </View>

              {/* Login Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.buttonWrapper}
                  onPress={() => router.push("/midwife_details/midwife-login")}
                >
                  <LinearGradient
                    colors={[Colors.primary, Colors.label]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                  >
                    <View style={styles.buttonContent}>
                      <Ionicons name="medical" size={22} color="#fff" />
                      <Text style={styles.buttonText}>Midwife Login</Text>
                      <Ionicons name="arrow-forward" size={18} color="#fff" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.buttonWrapper}
                  onPress={() => router.push("/parent/parent-login")}
                >
                  <LinearGradient
                    colors={[Colors.primary, Colors.label]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                  >
                    <View style={styles.buttonContent}>
                      <Ionicons name="people" size={22} color="#fff" />
                      <Text style={styles.buttonText}>Parent Login</Text>
                      <Ionicons name="arrow-forward" size={18} color="#fff" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Trust Indicators */}
              <View style={styles.trustContainer}>
                <View style={styles.trustItem}>
                  <Ionicons name="shield-checkmark" size={14} color={Colors.primary} />
                  <Text style={styles.trustText}>HIPAA</Text>
                </View>
                <View style={styles.trustItem}>
                  <Ionicons name="lock-closed" size={14} color={Colors.primary} />
                  <Text style={styles.trustText}>Encrypted</Text>
                </View>
                <View style={styles.trustItem}>
                  <Ionicons name="checkmark-circle" size={14} color={Colors.primary} />
                  <Text style={styles.trustText}>Verified</Text>
                </View>
              </View>
            </View>

            {/* Simple Footer */}
            <Text style={styles.footerText}>Version 2.0.0</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width,
    height,
  },
  overlay: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: Colors.primary,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  topBadge: {
    marginTop:10,
    alignItems: 'center',
  },
  badgeText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 25,
    position: 'relative',
  },
  logoGradient: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  logoBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: Colors.submit,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  logoBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
    letterSpacing: 1,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: Colors.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  statNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },
  buttonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonGradient: {
    padding: 1,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'rgba(66, 255, 95, 0)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginLeft: 12,
  },
  trustContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
  },
  footerText: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
  },
});