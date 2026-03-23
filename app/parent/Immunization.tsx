import { router } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
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
import { auth, db } from "../../firebase/firebaseConfig";
import { getImmunizationsByChild } from "../../firebase/services/immunizationService";
import { getVaccines } from "../../firebase/services/vaccinesService";
import type { child, ImmunizationRecord, vaccine } from "../../firebase/types";

import ParentImmunizationAgeGroupCard from "../../components/ParentImmunizationAgeGroupCard";
import ParentImmunizationEmptyState from "../../components/ParentImmunizationEmptyState";
import ParentImmunizationHeader from "../../components/ParentImmunizationHeader";
import ParentImmunizationProgress from "../../components/ParentImmunizationProgress";
import ParentImmunizationRecordItem from "../../components/ParentImmunizationRecordItem";
import ParentImmunizationStats from "../../components/ParentImmunizationStats";
import ParentImmunizationSummaryTable from "../../components/ParentImmunizationSummaryTable";

type EnrichedImmunization = ImmunizationRecord & { vaccineDetails?: vaccine };

export default function ChildImmunizations() {
  const [child, setChild] = useState<child | null>(null);
  const [immunizations, setImmunizations] = useState<EnrichedImmunization[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    byAgeGroup: {} as { [key: string]: number },
  });

  useEffect(() => {
    fetchChildAndImmunizations();
  }, []);

  const fetchChildAndImmunizations = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Error", "Please login first");
        router.back();
        return;
      }

      const parentsQuery = query(
        collection(db, "parents"),
        where("user_id", "==", user.uid)
      );
      const parentSnapshot = await getDocs(parentsQuery);

      if (parentSnapshot.empty) {
        Alert.alert("Error", "No parent record found");
        return;
      }

      const parentId = parentSnapshot.docs[0].id;

      const childrenQuery = query(
        collection(db, "children"),
        where("parent_id", "==", parentId)
      );
      const childrenSnapshot = await getDocs(childrenQuery);

      if (childrenSnapshot.empty) {
        Alert.alert("Error", "No child found");
        return;
      }

      const childDoc = childrenSnapshot.docs[0];
      const childData = { id: childDoc.id, ...childDoc.data() } as unknown as child;
      setChild(childData);

      const allVaccines = await getVaccines();
      const vaccineMap = new Map(allVaccines.map((v) => [v.vaccine_id, v]));

      const immunizationsData = await getImmunizationsByChild(childDoc.id);

      const enrichedImmunizations = immunizationsData.map((imm) => ({
        ...imm,
        vaccineDetails: vaccineMap.get(imm.vaccine_id),
      }));

      setImmunizations(enrichedImmunizations);

      const completed = immunizationsData.filter((imm) => imm.status === "Completed").length;
      const pending = immunizationsData.filter((imm) => imm.status === "Pending").length;

      const byAgeGroup: { [key: string]: number } = {};
      immunizationsData.forEach((imm) => {
        const vaccineData = vaccineMap.get(imm.vaccine_id);
        if (vaccineData?.Age_group) {
          byAgeGroup[vaccineData.Age_group] = (byAgeGroup[vaccineData.Age_group] || 0) + 1;
        }
      });

      setStats({
        total: immunizationsData.length,
        completed,
        pending,
        byAgeGroup,
      });
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to load immunization data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchChildAndImmunizations();
  };

  const getStatusColor = (status: string) =>
    status === "Completed" ? "#27ae60" : "#e67e22";

  const getStatusIcon = (status: string) =>
    status === "Completed" ? "✅" : "⏳";

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not yet administered";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const immunizationsByAgeGroup = immunizations.reduce(
    (acc: { [key: string]: EnrichedImmunization[] }, item) => {
      const ageGroup = item.vaccineDetails?.Age_group || "Other";
      if (!acc[ageGroup]) acc[ageGroup] = [];
      acc[ageGroup].push(item);
      return acc;
    },
    {}
  );

  const ageGroups = [
    "At Birth",
    "2 Months Completed",
    "4 Months Completed",
    "6 Months Completed",
    "9 Months Completed",
    "12 Months Completed",
    "18 Months Completed",
    "3 Years Completed",
    "5 Years Completed",
    "12 Years Completed",
    "Other",
  ];

  const sortedAgeGroups = ageGroups.filter((ag) => immunizationsByAgeGroup[ag]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6B3E26" />
        <Text style={styles.loadingText}>Loading immunization records...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ParentImmunizationHeader childName={child?.child_name} />

      <ParentImmunizationStats
        total={stats.total}
        completed={stats.completed}
        pending={stats.pending}
      />

      <ParentImmunizationProgress
        total={stats.total}
        completed={stats.completed}
      />

      {sortedAgeGroups.length === 0 ? (
        <ParentImmunizationEmptyState childName={child?.child_name} />
      ) : (
        <>
          <Text style={styles.sectionHeader}>📋 Vaccines Received</Text>

          {sortedAgeGroups.map((ageGroup) => (
            <ParentImmunizationAgeGroupCard
              key={ageGroup}
              ageGroup={ageGroup}
              items={immunizationsByAgeGroup[ageGroup]}
            >
              {immunizationsByAgeGroup[ageGroup].map((imm) => (
                <ParentImmunizationRecordItem
                  key={imm.immune_id}
                  item={imm}
                  formatDate={formatDate}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                />
              ))}
            </ParentImmunizationAgeGroupCard>
          ))}
        </>
      )}

      <ParentImmunizationSummaryTable
        ageGroups={ageGroups}
        immunizationsByAgeGroup={immunizationsByAgeGroup}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back to Dashboard</Text>
      </TouchableOpacity>
    </ScrollView>
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
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    color: "#6B3E26",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  backButton: {
    padding: 20,
    marginBottom: 30,
  },
  backButtonText: {
    color: "#3498db",
    fontSize: 16,
    textAlign: "center",
  },
});