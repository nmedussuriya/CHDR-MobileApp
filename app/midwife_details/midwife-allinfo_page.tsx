import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import CustomButton from "../../components/CustomButton";
import { Colors } from "../../constants/colors";


export default function ChildDetailsForm() {
  // Form state, empty by defaul
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Child Details Form</Text>

  
        
        <CustomButton
            title="Development Milestone"
            onPress={()=> router.push("/midwife_details/confirm_development_milestone")}
            />

        <CustomButton
            title="Vision/Hearing Milestone Response"
            onPress={()=> router.push("/midwife_details/view-screening-response")}
            />
            <CustomButton
            title="Go Back"
            onPress={()=> router.push("/midwife_details/MidwifeDashboard")}
            />
            </View>

            
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#EEDDD4",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  card: {
    width: 340,
    backgroundColor: "white",
    borderRadius: 35,
    padding: 25,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: Colors.submit,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontWeight: "600",
    marginBottom: 5,
    color: Colors.textDark,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    backgroundColor: Colors.inputBg,
  },
});