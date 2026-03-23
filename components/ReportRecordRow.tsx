import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  iconColor: string;
  title: string;
  line1?: string;
  line2?: string;
  badgeText?: string;
  badgeColor?: string;
};

export default function ReportRecordRow({
  icon,
  iconColor,
  title,
  line1,
  line2,
  badgeText,
  badgeColor,
}: Props) {
  return (
    <View style={styles.recordRow}>
      <View style={styles.recordIcon}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>

      <View style={styles.recordInfo}>
        <Text style={styles.recordTitle}>{title}</Text>
        {line1 ? <Text style={styles.recordDate}>{line1}</Text> : null}
        {line2 ? <Text style={styles.recordDate}>{line2}</Text> : null}
      </View>

      {badgeText ? (
        <View style={[styles.statusBadge, { backgroundColor: badgeColor || "#999" }]}>
          <Text style={styles.statusText}>{badgeText}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  recordRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  recordIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  recordInfo: {
    flex: 1,
  },
  recordTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  recordDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});