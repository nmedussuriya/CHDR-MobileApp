import { useLocalSearchParams, useRouter, useRootNavigationState } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { v4 as uuidv4 } from "uuid";

import { Colors } from "../../constants/colors";
import { auth, db } from "../../firebase/firebaseConfig";
import { addChild } from "../../firebase/services/childrenService";
import { getParents } from "../../firebase/services/parentsService";
import type { child, parent } from "../../firebase/types";

import AddChildHeader from "../../components/AddChildHeader";
import BackToMyChildrenLink from "../../components/BackToMyChildrenLink";
import BirthMeasurementsRow from "../../components/BirthMeasurementsRow";
import CustomInput from "../../components/CustomInput";
import DateOfBirthPicker from "../../components/DateOfBirthPicker";
import FormActionButtons from "../../components/FormActionButtons";
import GenderSelector from "../../components/GenderSelector";
import MidwifeInfoCard from "../../components/MidwifeInfoCard";
import ParentSelectorCard from "../../components/ParentSelectorCard";

export default function AddChildForm() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  const staffId =
    Array.isArray(params.staffId) ? params.staffId[0] : params.staffId || "";

  const [parents, setParents] = useState<parent[]>([]);
  const [selectedParent, setSelectedParent] = useState("");
  const [selectedParentName, setSelectedParentName] = useState("");
  const [midwifeName, setMidwifeName] = useState("");

  const [childName, setChildName] = useState("");
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [birthWeight, setBirthWeight] = useState("");
  const [headCircumference, setHeadCircumference] = useState("");
  const [lengthAtBirth, setLengthAtBirth] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!rootNavigationState?.key) return;

    checkAuth();
    fetchParents();
    if (staffId) fetchMidwifeName();
  }, [rootNavigationState?.key, staffId]);

  const clearForm = () => {
    setChildName("");
    setBirthWeight("");
    setHeadCircumference("");
    setLengthAtBirth("");
    setAddress("");
    setGender("Male");
    setDob(new Date());
  };

  const fetchMidwifeName = async () => {
    try {
      const staffDoc = await getDoc(doc(db, "staffs", staffId));
      if (staffDoc.exists()) {
        setMidwifeName(staffDoc.data().name || "Midwife");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkAuth = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Not Logged In", "Please login first");
        router.replace("/midwife_details/midwife-login");
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.data()?.role_id !== "2") {
        Alert.alert("Access Denied");
        router.replace("/");
      }
    } catch (error) {
      console.error(error);
      router.replace("/midwife_details/midwife-login");
    }
  };

  const fetchParents = async () => {
    try {
      const data = await getParents();
      setParents(data);
    } catch {
      Alert.alert("Error", "Failed to load parents");
    }
  };

  const handleDateChange = (_: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) setDob(date);
  };

  const handleParentChange = (id: string) => {
    setSelectedParent(id);
    const found = parents.find((p) => p.parent_id === id);
    setSelectedParentName(found?.parent_name || "");
  };

  const handleSubmit = async () => {
    if (!selectedParent || !childName || !birthWeight) {
      Alert.alert("Error", "Fill required fields");
      return;
    }

    setLoading(true);

    try {
      const data: child = {
        child_id: uuidv4(),
        child_name: childName,
        dob: dob.toISOString().split("T")[0],
        gender,
        birth_weight: parseFloat(birthWeight),
        head_circumference: parseFloat(headCircumference) || 0,
        length_at_birth: parseFloat(lengthAtBirth) || 0,
        address,
        parent_id: selectedParent,
        midwife_id: staffId,
      };

      await addChild(data);

      Alert.alert("Success", "Child added!", [
        { text: "Add Another", onPress: clearForm },
        {
          text: "View Children",
          onPress: () =>
            router.push({
              pathname: "/midwife_details/my-children",
              params: { staffId },
            }),
        },
      ]);
    } catch {
      Alert.alert("Error", "Failed to add child");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AddChildHeader />

      <MidwifeInfoCard midwifeName={midwifeName} />

      <ParentSelectorCard
        parents={parents}
        selectedParent={selectedParent}
        selectedParentName={selectedParentName}
        onChange={handleParentChange}
      />

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Child Details</Text>

        <CustomInput placeholder="Child Name" value={childName} onChangeText={setChildName} />

        <DateOfBirthPicker
          dob={dob}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
          onDateChange={handleDateChange}
        />

        <GenderSelector gender={gender} onChange={setGender} />

        <BirthMeasurementsRow
          birthWeight={birthWeight}
          setBirthWeight={setBirthWeight}
          headCircumference={headCircumference}
          setHeadCircumference={setHeadCircumference}
        />
        <Text style={styles.label}>Length_at_birth(cm)</Text>
        <CustomInput
          placeholder="50"
          value={lengthAtBirth}
          onChangeText={setLengthAtBirth}
        />

        <Text style={styles.label}>Address</Text>
        <CustomInput
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          multiline
        />
      </View>

      <FormActionButtons
        loading={loading}
        submitText="Add Child"
        onClear={clearForm}
        onSubmit={handleSubmit}
      />

      <BackToMyChildrenLink
        onPress={() =>
          router.push({
            pathname: "/midwife_details/my-children",
            params: { staffId },
          })
        }
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
    color: Colors.text,
    marginBottom: 15,
  },
    label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 5,
  },
});