import React from "react";
import { StyleSheet, View } from "react-native";
import ReportSummaryCard from "./ReportSummaryCard";

type Props = {
  immunizations: { total: number; completed: number; pending: number };
  milestones: { total: number; confirmed: number; pending: number };
  followups: { total: number };
  screenings: { vision: number; hearing: number };
};

export default function ReportSummaryGrid({
  immunizations,
  milestones,
  followups,
  screenings,
}: Props) {
  return (
    <View style={styles.summaryGrid}>
      <ReportSummaryCard
        icon="medical"
        color="#4CAF50"
        number={immunizations.total}
        label="Immunizations"
        subLeft={`✅ ${immunizations.completed}`}
        subRight={`⏳ ${immunizations.pending}`}
      />

      <ReportSummaryCard
        icon="trophy"
        color="#FF9800"
        number={milestones.total}
        label="Milestones"
        subLeft={`✅ ${milestones.confirmed}`}
        subRight={`⏳ ${milestones.pending}`}
      />

      <ReportSummaryCard
        icon="calendar"
        color="#2196F3"
        number={followups.total}
        label="Follow-ups"
      />

      <ReportSummaryCard
        icon="eye"
        color="#9C27B0"
        number={screenings.vision + screenings.hearing}
        label="Screenings"
        subLeft={`👁️ ${screenings.vision}`}
        subRight={`👂 ${screenings.hearing}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
});