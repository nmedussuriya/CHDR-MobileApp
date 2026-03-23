import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "../../constants/colors";
import { db } from "../../firebase/firebaseConfig";
import {
  ChildDevelopmentRecord,
  FollowUpRecord,
  ImmunizationRecord,
  screening_response,
} from "../../firebase/types";

import ReportChildCard from "../../components/ReportChildCard";
import ReportHeader from "../../components/ReportHeader";
import ReportRecordRow from "../../components/ReportRecordRow";
import ReportSection from "../../components/ReportSection";
import ReportSummaryGrid from "../../components/ReportSummaryGrid";

interface ChildReport {
  childInfo: {
    child_id: string;
    child_name: string;
    dob: string;
    gender: string;
    parent_name: string;
    midwife_name: string;
    address: string;
  };
  immunizations: {
    total: number;
    completed: number;
    pending: number;
    recent: ImmunizationRecord[];
  };
  milestones: {
    total: number;
    confirmed: number;
    pending: number;
    recent: ChildDevelopmentRecord[];
  };
  followups: {
    total: number;
    recent: FollowUpRecord[];
  };
  screenings: {
    vision: number;
    hearing: number;
    recent: screening_response[];
  };
}

export default function ChildReportScreen() {
  const params = useLocalSearchParams();
  const childId = Array.isArray(params.childId) ? params.childId[0] : params.childId || "";

  const [report, setReport] = useState<ChildReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadReport = async () => {
    try {
      if (!childId) return;

      const childDoc = await getDoc(doc(db, "children", childId));
      if (!childDoc.exists()) {
        setLoading(false);
        return;
      }

      const childData = childDoc.data();

      let parentName = "Unknown";
      if (childData.parent_id) {
        const parentDoc = await getDoc(doc(db, "parents", childData.parent_id));
        if (parentDoc.exists()) {
          parentName = parentDoc.data().parent_name;
        }
      }

      let midwifeName = "Unknown";
      if (childData.midwife_id) {
        const midwifeDoc = await getDoc(doc(db, "staffs", childData.midwife_id));
        if (midwifeDoc.exists()) {
          midwifeName = midwifeDoc.data().name || "Midwife";
        }
      }

      const immunizationsSnapshot = await getDocs(
        query(collection(db, "immunization_records"), where("child_id", "==", childId))
      );
      const immunizations = immunizationsSnapshot.docs.map((d) => ({
        immune_id: d.id,
        ...d.data(),
      })) as ImmunizationRecord[];

      const milestonesSnapshot = await getDocs(
        query(collection(db, "child_milestones"), where("child_id", "==", childId))
      );
      const milestones = milestonesSnapshot.docs.map((d) => ({
        record_id: d.id,
        ...d.data(),
      })) as ChildDevelopmentRecord[];

      const followupsSnapshot = await getDocs(
        query(collection(db, "followups"), where("child_id", "==", childId))
      );
      const followups = followupsSnapshot.docs.map((d) => ({
        followup_id: d.id,
        ...d.data(),
      })) as FollowUpRecord[];

      const screeningsSnapshot = await getDocs(
        query(collection(db, "screening_responses"), where("child_id", "==", childId))
      );
      const screenings = screeningsSnapshot.docs.map((d) => ({
        response_id: d.id,
        ...d.data(),
      })) as screening_response[];

      const completedImms = immunizations.filter((i) => i.status === "Completed").length;
      const pendingImms = immunizations.filter((i) => i.status === "Pending").length;
      const confirmedMilestones = milestones.filter((m) => m.confirmed_month).length;
      const pendingMilestones = milestones.filter((m) => !m.confirmed_month).length;

      const visionCount = Math.floor(screenings.length / 2);
      const hearingCount = screenings.length - visionCount;

      setReport({
        childInfo: {
          child_id: childId,
          child_name: childData.child_name,
          dob: childData.dob,
          gender: childData.gender,
          parent_name: parentName,
          midwife_name: midwifeName,
          address: childData.address || "Not specified",
        },
        immunizations: {
          total: immunizations.length,
          completed: completedImms,
          pending: pendingImms,
          recent: immunizations.slice(0, 5),
        },
        milestones: {
          total: milestones.length,
          confirmed: confirmedMilestones,
          pending: pendingMilestones,
          recent: milestones.slice(0, 5),
        },
        followups: {
          total: followups.length,
          recent: followups.slice(0, 5),
        },
        screenings: {
          vision: visionCount,
          hearing: hearingCount,
          recent: screenings.slice(0, 5),
        },
      });
    } catch (error) {
      console.error("Failed to load report:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [childId]);

  const onRefresh = () => {
    setRefreshing(true);
    loadReport();
  };

  const calculateAge = (dob: string) => {
    if (!dob) return "Unknown";
    const birthDate = new Date(dob);
    const today = new Date();
    const months =
      (today.getFullYear() - birthDate.getFullYear()) * 12 +
      (today.getMonth() - birthDate.getMonth());

    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return remainingMonths > 0 ? `${years} yrs ${remainingMonths} mo` : `${years} years`;
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading child report...</Text>
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={60} color="#ccc" />
        <Text style={styles.errorText}>No data found for this child</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
      >
        <ReportHeader onBack={() => router.back()} />

        <ReportChildCard
          childName={report.childInfo.child_name}
          dob={report.childInfo.dob}
          age={calculateAge(report.childInfo.dob)}
          gender={report.childInfo.gender}
          parentName={report.childInfo.parent_name}
          midwifeName={report.childInfo.midwife_name}
          address={report.childInfo.address}
        />

        <ReportSummaryGrid
          immunizations={report.immunizations}
          milestones={report.milestones}
          followups={report.followups}
          screenings={report.screenings}
        />

        {report.immunizations.recent.length > 0 && (
          <ReportSection title="Recent Immunizations">
            {report.immunizations.recent.map((imm, index) => (
              <ReportRecordRow
                key={index}
                icon="medical"
                iconColor="#4CAF50"
                title={`Vaccine: ${imm.vaccine_id}`}
                line1={`Date: ${imm.date_administered}`}
                line2={`Batch: ${imm.batch_no}`}
                badgeText={imm.status}
                badgeColor={imm.status === "Completed" ? "#4CAF50" : "#FF9800"}
              />
            ))}
          </ReportSection>
        )}

        {report.milestones.recent.length > 0 && (
          <ReportSection title="Recent Milestones">
            {report.milestones.recent.map((ms, index) => (
              <ReportRecordRow
                key={index}
                icon="trophy"
                iconColor="#FF9800"
                title={`Milestone ID: ${ms.development_id}`}
                line1={`Reported: ${ms.reported_month}`}
                line2={ms.confirmed_month ? `Confirmed: ${ms.confirmed_month}` : undefined}
                badgeText={ms.confirmed_month ? "Confirmed" : "Pending"}
                badgeColor={ms.confirmed_month ? "#4CAF50" : "#FF9800"}
              />
            ))}
          </ReportSection>
        )}

        {report.followups.recent.length > 0 && (
          <ReportSection title="Recent Follow-ups">
            {report.followups.recent.map((fu, index) => (
              <ReportRecordRow
                key={index}
                icon="calendar"
                iconColor="#2196F3"
                title={`Period: ${fu.period}`}
                line1={`Weight: ${fu.weight}kg | HC: ${fu.head_circumference}cm`}
                line2={`Feeding: ${fu.feeding || "Not recorded"}`}
              />
            ))}
          </ReportSection>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: Colors.primary,
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
    marginTop: 10,
    textAlign: "center",
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});