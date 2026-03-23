import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { getChildren } from "../../firebase/services/childrenService";
import { getParents } from "../../firebase/services/parentsService";
import { getQuestionsByType } from "../../firebase/services/screeningQuestionsService";
import { getScreeningResponses } from "../../firebase/services/screeningResponsesService";
import type {
  child,
  parent,
  screening_question,
  screening_response,
} from "../../firebase/types";

import ScreeningBottomActions from "../../components/ScreeningBottomActions";
import ScreeningChildSection from "../../components/ScreeningChildSection";
import ScreeningFiltersCard from "../../components/ScreeningFiltersCard";
import ScreeningPageHeader from "../../components/ScreeningPageHeader";
import ScreeningResponseItem from "../../components/ScreeningResponseItem";
import ScreeningSummaryCards from "../../components/ScreeningSummaryCards";

export default function ViewScreeningResponses() {
  const [responses, setResponses] = useState<screening_response[]>([]);
  const [questions, setQuestions] = useState<{ [key: string]: screening_question }>({});
  const [children, setChildren] = useState<{ [key: string]: child }>({});
  const [parents, setParents] = useState<{ [key: string]: parent }>({});
  const [selectedType, setSelectedType] = useState<"all" | "t1" | "t2">("all");
  const [selectedChild, setSelectedChild] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [childList, setChildList] = useState<child[]>([]);

  const filteredResponses = responses.filter((response) => {
    if (selectedType !== "all") {
      const question = questions[response.question_id];
      if (!question || question.type_id !== selectedType) return false;
    }

    if (selectedChild !== "all" && response.child_id !== selectedChild) return false;

    return true;
  });

  const responsesByChild = filteredResponses.reduce(
    (acc: { [key: string]: screening_response[] }, response) => {
      if (!acc[response.child_id]) {
        acc[response.child_id] = [];
      }
      acc[response.child_id].push(response);
      return acc;
    },
    {}
  );

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const responsesData = await getScreeningResponses();
      setResponses(responsesData);

      const visionQuestions = await getQuestionsByType("t1");
      const hearingQuestions = await getQuestionsByType("t2");
      const allQuestions = [...visionQuestions, ...hearingQuestions];

      const questionsMap: { [key: string]: screening_question } = {};
      allQuestions.forEach((q) => {
        questionsMap[q.question_id] = q;
      });
      setQuestions(questionsMap);

      const childrenData = await getChildren();
      const childrenMap: { [key: string]: child } = {};
      childrenData.forEach((c) => {
        childrenMap[c.child_id] = c;
      });
      setChildren(childrenMap);
      setChildList(childrenData);

      const parentsData = await getParents();
      const parentsMap: { [key: string]: parent } = {};
      parentsData.forEach((p) => {
        parentsMap[p.parent_id] = p;
      });
      setParents(parentsMap);
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to load screening responses");
    } finally {
      setLoading(false);
    }
  };

  const getChildName = (childId: string) =>
    children[childId]?.child_name || "Unknown Child";

  const getParentName = (childId: string) => {
    const currentChild = children[childId];
    if (!currentChild) return "Unknown Parent";
    return parents[currentChild.parent_id]?.parent_name || "Unknown Parent";
  };

  const getQuestionText = (questionId: string) =>
    questions[questionId]?.question_text || "Unknown Question";

  const getScreeningTypeName = (questionId: string) => {
    const typeId = questions[questionId]?.type_id;
    return typeId === "t1" ? "👁️ Vision" : "👂 Hearing";
  };

  const stats = {
    total: filteredResponses.length,
    yesCount: filteredResponses.filter((r) => r.answer === "Yes").length,
    noCount: filteredResponses.filter((r) => r.answer === "No").length,
    childrenCount: Object.keys(responsesByChild).length,
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6B3E26" />
        <Text style={styles.loadingText}>Loading screening responses...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ScreeningPageHeader />

      <ScreeningSummaryCards
        total={stats.total}
        yesCount={stats.yesCount}
        noCount={stats.noCount}
        childrenCount={stats.childrenCount}
      />

      <ScreeningFiltersCard
        selectedType={selectedType}
        selectedChild={selectedChild}
        setSelectedType={setSelectedType}
        setSelectedChild={setSelectedChild}
        childList={childList}
      />

      {Object.keys(responsesByChild).length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No responses found</Text>
        </View>
      ) : (
        Object.entries(responsesByChild).map(([childId, childResponses]) => (
          <ScreeningChildSection
            key={childId}
            childName={getChildName(childId)}
            parentName={getParentName(childId)}
          >
            {childResponses.map((response, index) => (
              <ScreeningResponseItem
                key={response.response_id}
                index={index}
                questionText={getQuestionText(response.question_id)}
                screeningTypeName={getScreeningTypeName(response.question_id)}
                answer={response.answer}
                dateChecked={response.date_checked}
              />
            ))}
          </ScreeningChildSection>
        ))
      )}

      <ScreeningBottomActions
        onRefresh={fetchAllData}
        onBack={() => router.back()}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    color: "#6B3E26",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#95a5a6",
    textAlign: "center",
  },
});