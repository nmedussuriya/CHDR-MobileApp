import { router } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Colors } from "../../constants/colors";
import { auth, db } from "../../firebase/firebaseConfig";
import { getAllChildMilestones } from "../../firebase/services/childrenService";
import { getMilestones } from "../../firebase/services/milestonesDevelopmentService";
import type {
  ChildDevelopmentRecord,
  DevelopmentMilestone,
} from "../../firebase/types";

import ConfirmMilestoneHeader from "../../components/ConfirmMilestoneHeader";
import CustomInput from "../../components/CustomInput";
import MilestoneDetailCard from "../../components/MilestoneDetailCard";
import PendingMilestonePicker from "../../components/PendingMilestonePicker";
import PendingMilestoneSummary from "../../components/PendingMilestoneSummary";

export default function MidwifeConfirmMilestone() {
  const [pendingRecords, setPendingRecords] = useState<ChildDevelopmentRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState("");
  const [confirmedMonth, setConfirmedMonth] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [milestones, setMilestones] = useState<{ [key: string]: DevelopmentMilestone }>({});

  const currentMonth = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    fetchPendingRecords();
  }, []);

  const fetchPendingRecords = async () => {
    try {
      setLoading(true);

      const records = await getAllChildMilestones();
      const pending = records.filter((r) => !r.confirmed_month);
      setPendingRecords(pending);

      const allMilestones = await getMilestones();
      const milestoneMap: { [key: string]: DevelopmentMilestone } = {};

      allMilestones.forEach((m) => {
        milestoneMap[m.development_id] = m;
      });

      setMilestones(milestoneMap);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to load pending records");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedRecord) {
      Alert.alert("Error", "Please select a record to confirm");
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) return;

      const recordRef = doc(db, "child_milestones", selectedRecord);

      await updateDoc(recordRef, {
        confirmed_month: confirmedMonth || currentMonth,
        confirmed_by: user.uid,
        notes: notes,
      });

      Alert.alert("✅ Success", "Milestone confirmed!", [
        {
          text: "OK",
          onPress: () => {
            setSelectedRecord("");
            setConfirmedMonth("");
            setNotes("");
            fetchPendingRecords();
          },
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to confirm milestone");
    } finally {
      setLoading(false);
    }
  };

  const selectedRecordData = pendingRecords.find(
    (r) => r.record_id === selectedRecord
  );

  const selectedMilestone = selectedRecordData
    ? milestones[selectedRecordData.development_id]
    : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ConfirmMilestoneHeader />

      <View style={styles.card}>
        <PendingMilestonePicker
          selectedRecord={selectedRecord}
          pendingRecords={pendingRecords}
          milestones={milestones}
          onChange={setSelectedRecord}
        />

        {selectedRecordData && selectedMilestone && (
          <MilestoneDetailCard
            reportedMonth={selectedRecordData.reported_month}
            milestoneName={selectedMilestone.milestone_name}
            childId={selectedRecordData.child_id}
          />
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirmation Month</Text>
          <CustomInput
            placeholder={currentMonth}
            value={confirmedMonth}
            onChangeText={setConfirmedMonth}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes / Observations</Text>
          <CustomInput
            placeholder="Add any observations..."
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </View>

        <TouchableOpacity
          style={[styles.confirmButton, loading && styles.disabledButton]}
          onPress={handleConfirm}
          disabled={loading || !selectedRecord}
        >
          <Text style={styles.confirmButtonText}>
            {loading ? "Confirming..." : "✓ Confirm Milestone"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomBackButton}
          onPress={() => router.back()}
        >
          <Text style={styles.bottomBackButtonText}>← Go Back</Text>
        </TouchableOpacity>
      </View>

      <PendingMilestoneSummary count={pendingRecords.length} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  confirmButton: {
    backgroundColor: Colors.submit,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#95a5a6",
  },
  bottomBackButton: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  bottomBackButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});