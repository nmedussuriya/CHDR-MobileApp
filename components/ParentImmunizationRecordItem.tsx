import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { ImmunizationRecord, vaccine } from "../firebase/types";

type Props = {
  item: ImmunizationRecord & { vaccineDetails?: vaccine };
  formatDate: (dateString: string) => string;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => string;
};

export default function ParentImmunizationRecordItem({
  item,
  formatDate,
  getStatusColor,
  getStatusIcon,
}: Props) {
  return (
    <View style={styles.vaccineCard}>
      <View style={styles.vaccineHeader}>
        <View style={styles.vaccineNameContainer}>
          <Text style={styles.vaccineName}>
            {item.vaccineDetails?.vaccine_name || "Unknown Vaccine"}
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>
            {getStatusIcon(item.status)} {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.vaccineDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date Administered:</Text>
          <Text style={styles.detailValue}>
            {item.date_administered ? formatDate(item.date_administered) : "Not yet"}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Batch Number:</Text>
          <Text style={styles.detailValue}>{item.batch_no || "N/A"}</Text>
        </View>

        {item.notes ? (
          <View style={styles.notesContainer}>
            <Text style={styles.detailLabel}>Notes:</Text>
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  vaccineCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  vaccineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  vaccineNameContainer: {
    flex: 1,
  },
  vaccineName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  statusText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  vaccineDetails: {
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  detailValue: {
    fontSize: 12,
    color: "#34495e",
    fontWeight: "500",
  },
  notesContainer: {
    marginTop: 5,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  notesText: {
    fontSize: 12,
    color: "#34495e",
    marginTop: 3,
    fontStyle: "italic",
  },
});