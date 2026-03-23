import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import ChildInfoCard from "../../components/ChildInfoCard";
import CustomInput from "../../components/CustomInput";
import DateBatchCard from "../../components/DateBatchCard";
import ImmunizationHeader from "../../components/ImmunizationHeader";
import ImmunizationSummaryCard from "../../components/ImmunizationSummaryCard";
import VaccineSelectionTable from "../../components/VaccineSelectionTable";
import { Colors } from "../../constants/colors";

import { getChildById } from "../../firebase/services/childrenService";
import {
  addImmunizationRecord,
  getImmunizationsByChild,
} from "../../firebase/services/immunizationService";
import { getVaccines } from "../../firebase/services/vaccinesService";
import type { child, ImmunizationRecord, vaccine } from "../../firebase/types";

export default function ImmunizationTable() {
  const params = useLocalSearchParams();
  const childId = Array.isArray(params.childId) ? params.childId[0] : params.childId || "";

  const [child, setChild] = useState<child | null>(null);
  const [vaccines, setVaccines] = useState<vaccine[]>([]);
  const [selectedVaccines, setSelectedVaccines] = useState<{ [key: string]: boolean }>({});
  const [takenVaccines, setTakenVaccines] = useState<Set<string>>(new Set());
  const [batchNo, setBatchNo] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const vaccinesByAge = vaccines.reduce((acc: { [key: string]: vaccine[] }, item) => {
    if (!acc[item.Age_group]) acc[item.Age_group] = [];
    acc[item.Age_group].push(item);
    return acc;
  }, {});

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
  ];

  useEffect(() => {
    if (childId) {
      fetchChildAndVaccines();
    }
  }, [childId]);

  const fetchChildAndVaccines = async () => {
    try {
      setLoading(true);

      const childData = await getChildById(childId);
      setChild(childData);

      const vaccinesData = await getVaccines();
      setVaccines(vaccinesData);

      await fetchChildImmunizations();
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to load data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchChildImmunizations = async () => {
    try {
      const immunizations = await getImmunizationsByChild(childId);
      const taken = new Set(immunizations.map((imm) => imm.vaccine_id));
      setTakenVaccines(taken);
    } catch (error) {
      console.error("Error fetching child immunizations:", error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchChildAndVaccines();
  };

  const toggleVaccine = (vaccineId: string) => {
    if (takenVaccines.has(vaccineId)) {
      Alert.alert("Already Administered", "This vaccine has already been given to this child.");
      return;
    }

    setSelectedVaccines((prev) => ({
      ...prev,
      [vaccineId]: !prev[vaccineId],
    }));
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    const selectedVaccineIds = Object.keys(selectedVaccines).filter((id) => selectedVaccines[id]);

    if (selectedVaccineIds.length === 0) {
      Alert.alert("Error", "Please select at least one vaccine");
      return;
    }

    const alreadyTaken = selectedVaccineIds.filter((id) => takenVaccines.has(id));
    if (alreadyTaken.length > 0) {
      Alert.alert("Error", "Some selected vaccines have already been administered.");
      return;
    }

    if (!batchNo.trim()) {
      Alert.alert("Error", "Please enter batch number");
      return;
    }

    setLoading(true);

    try {
      for (const vaccineId of selectedVaccineIds) {
        const immunizationRecord: ImmunizationRecord = {
          immune_id: uuidv4(),
          date_administered: date.toISOString().split("T")[0],
          batch_no: batchNo.trim(),
          status: "Completed",
          notes: notes.trim(),
          child_id: childId,
          vaccine_id: vaccineId,
        };

        await addImmunizationRecord(immunizationRecord);
      }

      Alert.alert(
        "✅ Success",
        `${selectedVaccineIds.length} immunization record(s) added successfully for ${child?.child_name}!`,
        [
          {
            text: "OK",
            onPress: () => {
              setSelectedVaccines({});
              setBatchNo("");
              setNotes("");
              setDate(new Date());
              fetchChildImmunizations();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error adding immunizations:", error);
      Alert.alert("Error", "Failed to add immunization records");
    } finally {
      setLoading(false);
    }
  };

  const selectedCount = Object.keys(selectedVaccines).filter((id) => selectedVaccines[id]).length;

  if (loading && !child) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading immunization data...</Text>
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
      <ImmunizationHeader
        childName={child?.child_name}
        dob={child?.dob}
        onBack={() => router.back()}
      />

      <ChildInfoCard childName={child?.child_name} totalGiven={takenVaccines.size} />

      <DateBatchCard
        date={date}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        onDateChange={handleDateChange}
        batchNo={batchNo}
        setBatchNo={setBatchNo}
      />

      <VaccineSelectionTable
        ageGroups={ageGroups}
        vaccinesByAge={vaccinesByAge}
        selectedVaccines={selectedVaccines}
        takenVaccines={takenVaccines}
        onToggle={toggleVaccine}
      />

      <View style={styles.card}>
        <Text style={styles.label}>Notes (Optional)</Text>
        <CustomInput
          placeholder="Any additional notes..."
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </View>

      <ImmunizationSummaryCard
        selectedCount={selectedCount}
        takenCount={takenVaccines.size}
      />

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? "Submitting..." : "Submit Immunization Records"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: Colors.primary,
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
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: "#27ae60",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  disabledButton: {
    backgroundColor: "#95a5a6",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});