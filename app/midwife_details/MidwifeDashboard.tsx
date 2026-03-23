import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { signOut } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../firebase/firebaseConfig";

import ChildOverviewCard from "../../components/ChildOverviewCard";
import DashboardHeader from "../../components/DashboardHeader";
import QuickActionCard from "../../components/QuickActionCard";
import QuickLinksRow from "../../components/QuickLinksRow";

interface Child {
  child_id: string;
  child_name: string;
  dob: string;
  gender: "Male" | "Female";
  parent_id: string;
}

interface ParentInfo {
  parent_id: string;
  parent_name: string;
}

export default function MidwifeDashboard() {
  const { childId, childName, staffId } = useLocalSearchParams();

  const [currentChild, setCurrentChild] = useState<Child | null>(null);
  const [siblings, setSiblings] = useState<Child[]>([]);
  const [parentInfo, setParentInfo] = useState<ParentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [midwifeName, setMidwifeName] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setMidwifeName(user.displayName || "Midwife");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (childId) {
        loadDashboardData();
      }
    }, [childId])
  );

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const childDoc = await getDoc(doc(db, "children", childId as string));
      if (!childDoc.exists()) {
        Alert.alert("Error", "Child not found");
        return;
      }

      const childData = {
        child_id: childDoc.id,
        ...childDoc.data(),
      } as Child;

      setCurrentChild(childData);

      const parentDoc = await getDoc(doc(db, "parents", childData.parent_id));
      if (parentDoc.exists()) {
        setParentInfo({
          parent_id: parentDoc.id,
          parent_name: parentDoc.data().parent_name,
        });
      } else {
        setParentInfo(null);
      }

      const siblingsQuery = query(
        collection(db, "children"),
        where("parent_id", "==", childData.parent_id)
      );

      const siblingsSnapshot = await getDocs(siblingsQuery);

      const siblingsList = siblingsSnapshot.docs
        .map((item) => ({
          child_id: item.id,
          ...item.data(),
        })) as Child[];

      setSiblings(
        siblingsList.filter((child) => child.child_id !== childId)
      );
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      Alert.alert("Error", "Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to logout");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader midwifeName={midwifeName} onLogout={handleLogout} />

      <ChildOverviewCard
        childName={currentChild?.child_name || String(childName || "Child")}
        parentName={parentInfo?.parent_name}
        dob={currentChild?.dob}
        gender={currentChild?.gender}
        onPress={() =>
          router.push({
            pathname: "/midwife_details/MidwifeDashboard",
            params: { childId: currentChild?.child_id, staffId },
          })
        }
      />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4CAF50"]} />
        }
      >
        {siblings.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Siblings (Same Parent)</Text>
            <View style={styles.siblingsContainer}>
              {siblings.map((sibling) => (
                <TouchableOpacity
                  key={sibling.child_id}
                  style={styles.siblingCard}
                  onPress={() =>
                    router.push({
                      pathname: "/midwife_details/MidwifeDashboard",
                      params: {
                        childId: sibling.child_id,
                        childName: sibling.child_name,
                        staffId,
                      },
                    })
                  }
                >
                  <Text style={styles.siblingName}>{sibling.child_name}</Text>
                  <Text style={styles.siblingDetails}>
                    DOB: {sibling.dob} • {sibling.gender}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>
          Quick Actions for {currentChild?.child_name}
        </Text>

        <View style={styles.quickActionsGrid}>
          <QuickActionCard
            title="Immunization"
            icon="medical"
            color="#4CAF50"
            onPress={() =>
              router.push({
                pathname: "/midwife_details/immunization",
                params: { childId: currentChild?.child_id, staffId },
              })
            }
          />

          <QuickActionCard
            title="Health Check"
            icon="fitness"
            color="#2196F3"
            onPress={() =>
              router.push({
                pathname: "/midwife_details/child-health-form",
                params: { childId: currentChild?.child_id, staffId },
              })
            }
          />

          <QuickActionCard
            title="Report"
            icon="calendar"
            color="#FF9800"
            onPress={() =>
              router.push({
                pathname: "/midwife_details/ChildReportScreen",
                params: { childId: currentChild?.child_id, staffId },
              })
            }
          />

          <QuickActionCard
            title="Screening"
            icon="chatbubbles"
            color="#9C27B0"
            onPress={() =>
              router.push({
                pathname: "/midwife_details/midwife-allinfo_page",
                params: { childId: currentChild?.child_id, staffId },
              })
            }
          />
        </View>

        <QuickLinksRow
          onAllChildren={() =>
            router.push({
              pathname: "/midwife_details/my-children",
              params: { staffId },
            })
          }
          onGoBack={() => router.back()}
        />
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          router.push({
            pathname: "/midwife_details/immunization",
            params: { childId: currentChild?.child_id, staffId },
          })
        }
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
    marginTop: -15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    marginTop: 10,
  },
  siblingsContainer: {
    marginBottom: 20,
  },
  siblingCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  siblingName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  siblingDetails: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#4CAF50",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});