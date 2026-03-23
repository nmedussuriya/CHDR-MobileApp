import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Colors } from "../../constants/colors";

import MyChildrenHeader from "../../components/MyChildrenHeader";
import AddChildButton from "../../components/AddChildButton";
import ChildrenSummary from "../../components/ChildrenSummary";
import ChildListItem from "../../components/ChildListItem";
import EmptyChildrenState from "../../components/EmptyChildrenState";

interface Child {
  child_id: string;
  child_name: string;
  dob: string;
  gender: "Male" | "Female";
  birth_weight: number;
  head_circumference: number;
  length_at_birth: number;
  address: string;
  parent_id: string;
  midwife_id?: string;
}

export default function MyChildren() {
  const params = useLocalSearchParams();
  const staffId = Array.isArray(params.staffId) ? params.staffId[0] : params.staffId || "";

  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [midwifeName, setMidwifeName] = useState("");

  useEffect(() => {
    if (staffId) {
      loadChildren();
      loadMidwifeName();
    }
  }, [staffId]);

  const loadMidwifeName = async () => {
    try {
      const staffDoc = await getDoc(doc(db, "staffs", staffId));
      if (staffDoc.exists()) {
        setMidwifeName(staffDoc.data().name || "Midwife");
      }
    } catch (error) {
      console.error("Error loading midwife name:", error);
    }
  };

  const loadChildren = async () => {
    try {
      const q = query(
        collection(db, "children"),
        where("midwife_id", "==", staffId)
      );

      const snapshot = await getDocs(q);

      const childrenList: Child[] = snapshot.docs.map((docItem) => ({
        child_id: docItem.id,
        ...docItem.data(),
      } as Child));

      setChildren(childrenList);
    } catch (error) {
      console.error("Error loading children:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadChildren();
  };

  if (loading) {
    return (
      <ScrollView contentContainerStyle={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading your children...</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <MyChildrenHeader title="My Children" onBack={() => router.back()} />

      <Text style={styles.welcomeText}>Welcome, {midwifeName}</Text>
      <Text style={styles.countText}>You have {children.length} assigned children</Text>

      <AddChildButton
        onPress={() =>
          router.push({
            pathname: "/midwife_details/add_child_form",
            params: { staffId },
          })
        }
      />

      <ChildrenSummary
        total={children.length}
        male={children.filter((c) => c.gender === "Male").length}
        female={children.filter((c) => c.gender === "Female").length}
      />

      <Text style={styles.sectionTitle}>Select a child to view dashboard</Text>

      {children.length === 0 ? (
        <EmptyChildrenState />
      ) : (
        children.map((child) => (
          <ChildListItem
            key={child.child_id}
            child={child}
            onPress={() =>
              router.push({
                pathname: "/midwife_details/MidwifeDashboard",
                params: {
                  childId: child.child_id,
                  childName: child.child_name,
                  staffId,
                },
              })
            }
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: Colors.primary,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.primary,
    marginHorizontal: 15,
    marginTop: 10,
    fontStyle: "italic",
  },
  countText: {
    fontSize: 14,
    color: "#7f8c8d",
    marginHorizontal: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
  },
});