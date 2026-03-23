import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { v4 as uuidv4 } from "uuid";
import ChildHealthHeader from "../../components/ChildHealthHeader";
import CustomInput from "../../components/CustomInput";
import FollowUpChildInfoCard from "../../components/FollowUpChildInfoCard";
import FollowUpPeriodPicker from "../../components/FollowUpPeriodPicker";
import FormActionButtons from "../../components/FormActionButtons";
import RecentFollowUpsCard from "../../components/RecentFollowUpsCard";
import { Colors } from "../../constants/colors";

import { getChildById } from "../../firebase/services/childrenService";
import {
  addFollowUp,
  getFollowUpsByChild,
} from "../../firebase/services/followupsService";
import type { child, FollowUpRecord } from "../../firebase/types";

export default function AddFollowUpForm() {
  const params = useLocalSearchParams();
  const childId = Array.isArray(params.childId) ? params.childId[0] : params.childId || "";

  const [child, setChild] = useState<child | null>(null);
  const [existingFollowUps, setExistingFollowUps] = useState<FollowUpRecord[]>([]);
  const [existingPeriods, setExistingPeriods] = useState<Set<string>>(new Set());

  const [period, setPeriod] = useState("");
  const [weight, setWeight] = useState("");
  const [eyeCondition, setEyeCondition] = useState("");
  const [skinColor, setSkinColor] = useState("");
  const [feeding, setFeeding] = useState("");
  const [headCircumference, setHeadCircumference] = useState("");
  const [reflexes, setReflexes] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const periods = [
    "1 Month",
    "2 Months",
    "4 Months",
    "6 Months",
    "9 Months",
    "12 Months",
    "18 Months",
    "2 Years",
    "3 Years",
    "4 Years",
    "5 Years",
  ];

  useEffect(() => {
    if (childId) {
      fetchChildData();
    }
  }, [childId]);

  const fetchChildData = async () => {
    try {
      setInitialLoading(true);

      const childData = await getChildById(childId);
      setChild(childData);

      await fetchChildFollowUps();
    } catch (error) {
      console.error("Error fetching child data:", error);
      Alert.alert("Error", "Failed to load child data");
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchChildFollowUps = async () => {
    try {
      const followUps = await getFollowUpsByChild(childId);
      setExistingFollowUps(followUps);
      setExistingPeriods(new Set(followUps.map((f) => f.period)));
    } catch (error) {
      console.error("Error fetching follow-ups:", error);
    }
  };

  const isPeriodTaken = (periodValue: string) => existingPeriods.has(periodValue);

  const clearForm = () => {
    setPeriod("");
    setWeight("");
    setEyeCondition("");
    setSkinColor("");
    setFeeding("");
    setHeadCircumference("");
    setReflexes("");
  };

  const handleSubmit = async () => {
    if (!period) {
      Alert.alert("Error", "Please select follow-up period");
      return;
    }

    if (isPeriodTaken(period)) {
      Alert.alert(
        "Already Exists",
        `A follow-up for ${period} has already been recorded for this child.`
      );
      return;
    }

    if (!weight.trim()) {
      Alert.alert("Error", "Please enter weight");
      return;
    }

    if (!headCircumference.trim()) {
      Alert.alert("Error", "Please enter head circumference");
      return;
    }

    setLoading(true);

    try {
      const followUpData: FollowUpRecord = {
        followup_id: uuidv4(),
        period,
        weight: parseFloat(weight),
        eye_condition: eyeCondition.trim(),
        skin_color: skinColor.trim(),
        feeding: feeding.trim(),
        head_circumference: parseFloat(headCircumference),
        reflexes: reflexes.trim(),
        child_id: childId,
      };

      await addFollowUp(followUpData);
      await fetchChildFollowUps();

      Alert.alert(
        "✅ Success!",
        `Follow-up record for ${child?.child_name} (${period}) has been added successfully.`,
        [
          { text: "Add Another", onPress: clearForm },
          { text: "Done", onPress: () => router.back() },
        ]
      );
    } catch (error) {
      console.error("Error adding follow-up:", error);
      Alert.alert("❌ Error", "Failed to add follow-up record");
    } finally {
      setLoading(false);
    }
  };

  const viewExistingFollowUps = () => {
    if (existingFollowUps.length === 0) {
      Alert.alert("No Records", "No existing follow-up records for this child.");
      return;
    }

    let message = "";
    existingFollowUps.forEach((f, index) => {
      message += `${index + 1}. ${f.period}: ${f.weight}kg, HC: ${f.head_circumference}cm\n`;
    });

    Alert.alert(`Follow-ups for ${child?.child_name}`, message, [{ text: "OK" }]);
  };

  if (initialLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading child data...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ChildHealthHeader
        childName={child?.child_name}
        dob={child?.dob}
        onBack={() => router.back()}
      />

      <FollowUpChildInfoCard
        childName={child?.child_name}
        existingCount={existingFollowUps.length}
        onViewRecords={viewExistingFollowUps}
      />

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Follow-up Details</Text>

        <FollowUpPeriodPicker
          period={period}
          periods={periods}
          isPeriodTaken={isPeriodTaken}
          onChange={setPeriod}
        />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Weight (kg) *</Text>
          <CustomInput
            placeholder="e.g., 7.5"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Head Circumference (cm) *</Text>
          <CustomInput
            placeholder="e.g., 44.5"
            value={headCircumference}
            onChangeText={setHeadCircumference}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Eye Condition</Text>
          <CustomInput
            placeholder="e.g., Follows light, tracks objects"
            value={eyeCondition}
            onChangeText={setEyeCondition}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Skin Color</Text>
          <CustomInput
            placeholder="e.g., Normal, Jaundice, Pale"
            value={skinColor}
            onChangeText={setSkinColor}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Feeding</Text>
          <CustomInput
            placeholder="e.g., Exclusive breastfeeding, formula, solids"
            value={feeding}
            onChangeText={setFeeding}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Reflexes / Development</Text>
          <CustomInput
            placeholder="e.g., Moro reflex, social smile, sitting, walking"
            value={reflexes}
            onChangeText={setReflexes}
            multiline
          />
        </View>
      </View>

      <RecentFollowUpsCard followUps={existingFollowUps} />

      <FormActionButtons
        loading={loading}
        submitDisabled={!!(period && isPeriodTaken(period))}
        submitText="Save Follow-up"
        onClear={clearForm}
        onSubmit={handleSubmit}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.label,
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 5,
  },
});
