import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Vaccine = {
  vaccine_id: string;
  vaccine_name: string;
  Age_group: string;
};

type Props = {
  ageGroups: string[];
  vaccinesByAge: { [key: string]: Vaccine[] };
  selectedVaccines: { [key: string]: boolean };
  takenVaccines: Set<string>;
  onToggle: (id: string) => void;
};

export default function VaccineSelectionTable({
  ageGroups,
  vaccinesByAge,
  selectedVaccines,
  takenVaccines,
  onToggle,
}: Props) {
  return (
    <View style={styles.tableCard}>
      <Text style={styles.tableTitle}>Select Vaccines Administered</Text>

      {ageGroups.map((ageGroup) => {
        const ageVaccines = vaccinesByAge[ageGroup] || [];
        if (ageVaccines.length === 0) return null;

        return (
          <View key={ageGroup} style={styles.ageGroupSection}>
            <Text style={styles.ageGroupTitle}>{ageGroup}</Text>

            {ageVaccines.map((vaccine) => {
              const taken = takenVaccines.has(vaccine.vaccine_id);
              const selected = selectedVaccines[vaccine.vaccine_id];

              return (
                <TouchableOpacity
                  key={vaccine.vaccine_id}
                  style={[styles.vaccineRow, taken && styles.vaccineRowTaken]}
                  onPress={() => onToggle(vaccine.vaccine_id)}
                  disabled={taken}
                >
                  <View style={[styles.checkbox, taken && styles.checkboxTaken]}>
                    {selected && !taken ? (
                      <Text style={styles.checkmark}>✓</Text>
                    ) : null}
                    {taken ? <Text style={styles.checkmarkTaken}>✓</Text> : null}
                  </View>

                  <View style={styles.vaccineInfo}>
                    <Text style={[styles.vaccineName, taken && styles.vaccineNameTaken]}>
                      {vaccine.vaccine_name}
                      {taken ? " (Already Given)" : ""}
                    </Text>

                    {taken ? <Text style={styles.takenBadge}>Already Given</Text> : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tableCard: {
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
  tableTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
  },
  ageGroupSection: {
    marginBottom: 20,
  },
  ageGroupTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3498db",
    marginBottom: 10,
    backgroundColor: "#f0f8ff",
    padding: 8,
    borderRadius: 5,
  },
  vaccineRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  vaccineRowTaken: {
    backgroundColor: "#f8f9fa",
    opacity: 0.7,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#3498db",
    borderRadius: 5,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxTaken: {
    borderColor: "#95a5a6",
    backgroundColor: "#ecf0f1",
  },
  checkmark: {
    color: "#3498db",
    fontSize: 16,
    fontWeight: "bold",
  },
  checkmarkTaken: {
    color: "#27ae60",
    fontSize: 16,
    fontWeight: "bold",
  },
  vaccineInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  vaccineName: {
    fontSize: 15,
    color: "#34495e",
    flex: 1,
  },
  vaccineNameTaken: {
    color: "#7f8c8d",
    textDecorationLine: "line-through",
  },
  takenBadge: {
    backgroundColor: "#27ae60",
    color: "#fff",
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
    marginLeft: 8,
  },
});