import { router } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { v4 as uuidv4 } from "uuid";
import { auth, db } from "../../firebase/firebaseConfig";
import {
  addChildMilestone,
  getChildMilestones,
} from "../../firebase/services/childMilestonesService";
import { getMilestones } from "../../firebase/services/milestonesDevelopmentService";
import type {
  ChildDevelopmentRecord,
  DevelopmentMilestone,
} from "../../firebase/types";
import { Colors } from "../../constants/colors";

import AgeGroupPicker from "../../components/AgeGroupPicker";
import MilestoneActions from "../../components/MilestoneActions";
import MilestoneItem from "../../components/MilestoneItem";
import ParentMilestoneHeader from "../../components/ParentMilestoneHeader";
import SubmittedSummary from "../../components/SubmittedSummary";

export default function ParentAddMilestone() {
  const [childId, setChildId] = useState<string>("");
  const [childName, setChildName] = useState<string>("");
  const [milestones, setMilestones] = useState<DevelopmentMilestone[]>([]);
  const [filteredMilestones, setFilteredMilestones] = useState<DevelopmentMilestone[]>([]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>("");
  const [ageGroups, setAgeGroups] = useState<string[]>([]);
  const [milestoneReports, setMilestoneReports] = useState<{ [key: string]: string }>({});
  const [submittedMilestones, setSubmittedMilestones] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const getMonthOptions = () => {
    const months: { label: string; value: string }[] = [];
    const currentDate = new Date();

    for (let i = 0; i < 24; i++) {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() - i);

      const monthName = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      const value = `${monthName} ${year}`;

      months.push({
        label: value,
        value,
      });
    }

    return months;
  };

  const monthOptions = getMonthOptions();

  const ageGroupsOrder = [
    "6 Weeks to 3 Months",
    "3 to 6 Months",
    "6 to 9 Months",
    "9 to 12 Months",
    "12 to 18 Months",
    "18 Months to 2 Years",
    "2 to 3 Years",
    "3 to 4 Years",
    "4 to 5 Years",
  ];

  useEffect(() => {
    fetchChildAndMilestones();
  }, []);

  useEffect(() => {
    if (selectedAgeGroup && initialLoadDone) {
      const filtered = milestones.filter((m) => m.age_group === selectedAgeGroup);
      setFilteredMilestones(filtered);

      const initialReports: { [key: string]: string } = {};
      filtered.forEach((m) => {
        initialReports[m.development_id] = "";
      });
      setMilestoneReports(initialReports);
    } else if (!selectedAgeGroup) {
      setFilteredMilestones([]);
      setMilestoneReports({});
    }
  }, [selectedAgeGroup, milestones, initialLoadDone]);

  const fetchChildAndMilestones = async () => {
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
      const currentChildId = childDoc.id;
      const childData = childDoc.data();

      setChildId(currentChildId);
      setChildName(childData.child_name || "Your Child");

      const milestonesData = await getMilestones();
      const submittedRecords = await getChildMilestones(currentChildId);
      const submittedSet = new Set(submittedRecords.map((record) => record.development_id));

      setSubmittedMilestones(submittedSet);

      const uniqueAgeGroups = ageGroupsOrder.filter((ageGroup) =>
        milestonesData.some((m) => m.age_group === ageGroup)
      );

      setAgeGroups(uniqueAgeGroups);
      setMilestones(milestonesData);
      setInitialLoadDone(true);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const updateMilestoneReport = (developmentId: string, value: string) => {
    if (submittedMilestones.has(developmentId)) {
      Alert.alert(
        "Already Submitted",
        "This milestone has already been reported for your child."
      );
      return;
    }

    setMilestoneReports((prev) => ({
      ...prev,
      [developmentId]: value,
    }));
  };

  const handleSubmitAll = async () => {
    if (!selectedAgeGroup) {
      Alert.alert("Error", "Please select an age group");
      return;
    }

    const milestonesToSubmit = filteredMilestones.filter(
      (milestone) =>
        milestoneReports[milestone.development_id] &&
        milestoneReports[milestone.development_id] !== "" &&
        !submittedMilestones.has(milestone.development_id)
    );

    if (milestonesToSubmit.length === 0) {
      Alert.alert("Error", "Please select at least one new milestone to report");
      return;
    }

    setSubmitting(true);

    try {
      let successCount = 0;
      const newSubmitted = new Set(submittedMilestones);

      for (const milestone of milestonesToSubmit) {
        const reportMonth = milestoneReports[milestone.development_id];

        const record: ChildDevelopmentRecord = {
          record_id: uuidv4(),
          reported_month: reportMonth,
          confirmed_month: "",
          confirmed_by: "",
          notes: "",
          development_id: milestone.development_id,
          child_id: childId,
        };

        await addChildMilestone(record);
        newSubmitted.add(milestone.development_id);
        successCount++;
      }

      setSubmittedMilestones(newSubmitted);

      const updatedReports: { [key: string]: string } = {};
      filteredMilestones.forEach((m) => {
        updatedReports[m.development_id] = "";
      });
      setMilestoneReports(updatedReports);

      Alert.alert(
        "✅ Success",
        `${successCount} milestone(s) reported successfully for ${childName}! Midwife will review them.`,
        [
          { text: "Continue with this Age Group" },
          { text: "Change Age Group", onPress: () => setSelectedAgeGroup("") },
          { text: "Done", onPress: () => router.back() },
        ]
      );
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to submit milestones");
    } finally {
      setSubmitting(false);
    }
  };

  const getNewMilestonesCount = () => {
    return filteredMilestones.filter(
      (m) =>
        milestoneReports[m.development_id] &&
        !submittedMilestones.has(m.development_id)
    ).length;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6B3E26" />
        <Text style={styles.loadingText}>Loading your child's milestones...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ParentMilestoneHeader childName={childName} />

      <SubmittedSummary
        count={submittedMilestones.size}
        childName={childName}
      />

      <View style={styles.card}>
        <AgeGroupPicker
          selected={selectedAgeGroup}
          setSelected={setSelectedAgeGroup}
          ageGroups={ageGroups}
        />

        {selectedAgeGroup ? (
          <View style={styles.milestonesContainer}>
            <Text style={styles.sectionTitle}>Milestones for {selectedAgeGroup}</Text>
            <Text style={styles.hint}>
              Select the month when your child achieved each milestone
            </Text>

            {filteredMilestones.map((milestone, index) => (
              <MilestoneItem
                key={milestone.development_id}
                milestone={milestone}
                index={index}
                isSubmitted={submittedMilestones.has(milestone.development_id)}
                value={milestoneReports[milestone.development_id]}
                onChange={(value: string) =>
                  updateMilestoneReport(milestone.development_id, value)
                }
                monthOptions={monthOptions}
                childName={childName}
              />
            ))}

            <MilestoneActions
              count={getNewMilestonesCount()}
              submitting={submitting}
              onSubmit={handleSubmitAll}
            />
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              Select an age group to see milestones for {childName}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>← Back to Dashboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
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
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  milestonesContainer: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  hint: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 15,
    fontStyle: "italic",
  },
  placeholderContainer: {
    padding: 40,
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 16,
    color: "#95a5a6",
    textAlign: "center",
  },
  backButton: {
    padding: 10,
    marginBottom: 30,
    marginTop: 10,
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: 16,
    textAlign: "center",
  },
});