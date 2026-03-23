import { Picker } from "@react-native-picker/picker";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { DevelopmentMilestone } from "../firebase/types";

type MonthOption = {
  label: string;
  value: string;
};

type Props = {
  milestone: DevelopmentMilestone;
  index: number;
  isSubmitted: boolean;
  value: string;
  onChange: (value: string) => void;
  monthOptions: MonthOption[];
  childName: string;
};

export default function MilestoneItem({
  milestone,
  index,
  isSubmitted,
  value,
  onChange,
  monthOptions,
  childName,
}: Props) {
  return (
    <View
      style={[
        styles.milestoneItem,
        isSubmitted && styles.milestoneItemSubmitted,
      ]}
    >
      <Text style={styles.milestoneNumber}>{index + 1}.</Text>

      <View style={styles.milestoneContent}>
        <Text
          style={[
            styles.milestoneText,
            isSubmitted && styles.milestoneTextSubmitted,
          ]}
        >
          {milestone.milestone_name}
        </Text>

        {isSubmitted ? (
          <View style={styles.submittedBadge}>
            <Text style={styles.submittedBadgeText}>
              ✓ Already Reported for {childName}
            </Text>
          </View>
        ) : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={value}
              onValueChange={(selectedValue) => onChange(selectedValue)}
              style={styles.picker}
            >
              <Picker.Item label="-- Not achieved yet --" value="" />
              {monthOptions.map((month, monthIndex) => (
                <Picker.Item
                  key={monthIndex}
                  label={month.label}
                  value={month.value}
                />
              ))}
            </Picker>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  milestoneItem: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
  },
  milestoneItemSubmitted: {
    backgroundColor: "#e8f5e9",
    opacity: 0.8,
  },
  milestoneNumber: {
    width: 30,
    fontSize: 16,
    fontWeight: "bold",
    color: "#3498db",
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneText: {
    fontSize: 15,
    color: "#34495e",
    marginBottom: 8,
    lineHeight: 20,
  },
  milestoneTextSubmitted: {
    color: "#27ae60",
    textDecorationLine: "line-through",
  },
  submittedBadge: {
    backgroundColor: "#27ae60",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  submittedBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: "100%",
  },
});