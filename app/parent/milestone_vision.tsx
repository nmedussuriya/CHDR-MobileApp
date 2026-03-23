import { router } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { v4 as uuidv4 } from "uuid";

import { auth, db } from "../../firebase/firebaseConfig";
import { getQuestionsByType } from "../../firebase/services/screeningQuestionsService";
import {
  addScreeningResponse,
  getResponsesByChild,
} from "../../firebase/services/screeningResponsesService";
import type { screening_question, screening_response } from "../../firebase/types";

import ScreeningHeader from "../../components/ScreeningHeader";
import ScreeningQuestionCard from "../../components/ScreeningQuestionCard";
import ScreeningSummary from "../../components/ScreeningSummary";
import ScreeningTypeSelector from "../../components/ScreeningTypeSelector";

export default function ParentScreeningForm() {
  const [childId, setChildId] = useState<string>("");
  const [screeningType, setScreeningType] = useState<"t1" | "t2">("t1");
  const [questions, setQuestions] = useState<screening_question[]>([]);
  const [responses, setResponses] = useState<{ [key: string]: "Yes" | "No" | null }>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);

  const visionAgeGroups = [
    "From 1st Month",
    "By 2 Months",
    "By 6 Months",
    "At 10 Months",
    "By 12 Months",
  ];

  const hearingAgeGroups = [
    "Shortly after birth",
    "By 1 Month",
    "From 4 Months",
    "From 7 Months",
    "By 9 Months",
    "By 12 Months",
  ];

  const ageGroups = screeningType === "t1" ? visionAgeGroups : hearingAgeGroups;

  const questionsByAgeGroup = questions.reduce(
    (acc: { [key: string]: screening_question[] }, question) => {
      let ageGroup = "General";

      if (screeningType === "t1") {
        if (question.question_id <= "vq02") ageGroup = "From 1st Month";
        else if (question.question_id <= "vq04") ageGroup = "By 2 Months";
        else if (question.question_id <= "vq07") ageGroup = "By 6 Months";
        else if (question.question_id === "vq08") ageGroup = "At 10 Months";
        else if (question.question_id >= "vq09") ageGroup = "By 12 Months";
      } else {
        if (question.question_id === "hq01") ageGroup = "Shortly after birth";
        else if (question.question_id === "hq02") ageGroup = "By 1 Month";
        else if (question.question_id <= "hq04") ageGroup = "From 4 Months";
        else if (question.question_id === "hq05") ageGroup = "From 7 Months";
        else if (question.question_id <= "hq08") ageGroup = "By 9 Months";
        else if (question.question_id >= "hq09") ageGroup = "By 12 Months";
      }

      if (!acc[ageGroup]) acc[ageGroup] = [];
      acc[ageGroup].push(question);
      return acc;
    },
    {}
  );

  useEffect(() => {
    fetchChildAndQuestions();
  }, [screeningType]);

  const fetchChildAndQuestions = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Error", "Please login first");
        router.back();
        return;
      }

      const parentsQuery = query(
        collection(db, "parents"),
        where("user_id", "==", user.uid)
      );
      const parentSnapshot = await getDocs(parentsQuery);

      if (parentSnapshot.empty) {
        Alert.alert("Error", "No parent record found");
        return;
      }

      const parentId = parentSnapshot.docs[0].id;

      const childrenQuery = query(
        collection(db, "children"),
        where("parent_id", "==", parentId)
      );
      const childrenSnapshot = await getDocs(childrenQuery);

      if (childrenSnapshot.empty) {
        Alert.alert("Error", "No child found");
        return;
      }

      const currentChildId = childrenSnapshot.docs[0].id;
      setChildId(currentChildId);

      const questionsData = await getQuestionsByType(screeningType);
      setQuestions(questionsData);

      const existingResponses = await getResponsesByChild(currentChildId);
      const submittedSet = new Set(existingResponses.map((r) => r.question_id));
      setSubmittedQuestions(submittedSet);

      const initialResponses: { [key: string]: "Yes" | "No" | null } = {};
      questionsData.forEach((q) => {
        const existing = existingResponses.find((r) => r.question_id === q.question_id);
        initialResponses[q.question_id] = existing?.answer || null;
      });
      setResponses(initialResponses);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = (questionId: string, answer: "Yes" | "No") => {
    if (submittedQuestions.has(questionId)) {
      Alert.alert(
        "Already Submitted",
        "This question has already been answered and cannot be changed."
      );
      return;
    }

    setResponses((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmitMilestone = async (questionId: string) => {
    const answer = responses[questionId];

    if (!answer) {
      Alert.alert("Error", "Please select Yes or No first");
      return;
    }

    if (submittedQuestions.has(questionId)) {
      Alert.alert("Already Submitted", "This question has already been answered.");
      return;
    }

    setSubmitting((prev) => ({ ...prev, [questionId]: true }));

    try {
      const today = new Date().toISOString().split("T")[0];

      const response: screening_response = {
        response_id: uuidv4(),
        answer,
        date_checked: today,
        question_id: questionId,
        child_id: childId,
      };

      await addScreeningResponse(response);

      setSubmittedQuestions((prev) => new Set([...prev, questionId]));

      Alert.alert(
        "✅ Success!",
        `Your answer "${answer}" has been saved to the database.`,
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to save milestone");
    } finally {
      setSubmitting((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  const isQuestionSubmitted = (questionId: string) => {
    return submittedQuestions.has(questionId);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6B3E26" />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ScreeningHeader type={screeningType} />

      <ScreeningTypeSelector
        type={screeningType}
        setType={setScreeningType}
      />

      <ScreeningSummary count={submittedQuestions.size} />

      {ageGroups.map((ageGroup) => {
        const ageGroupQuestions = questionsByAgeGroup[ageGroup] || [];
        if (ageGroupQuestions.length === 0) return null;

        return (
          <View key={ageGroup} style={styles.ageGroupContainer}>
            <View style={styles.ageGroupHeader}>
              <Text style={styles.ageGroupTitle}>{ageGroup}</Text>
            </View>

            {ageGroupQuestions.map((question, index) => (
              <ScreeningQuestionCard
                key={question.question_id}
                question={question}
                index={index}
                response={responses[question.question_id]}
                isSubmitted={isQuestionSubmitted(question.question_id)}
                isSubmitting={submitting[question.question_id]}
                onAnswer={(value: "Yes" | "No") =>
                  handleResponse(question.question_id, value)
                }
                onSubmit={() => handleSubmitMilestone(question.question_id)}
              />
            ))}
          </View>
        );
      })}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>← Back to Dashboard</Text>
      </TouchableOpacity>
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
  ageGroupContainer: {
    marginBottom: 20,
  },
  ageGroupHeader: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  ageGroupTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  backButton: {
    padding: 10,
    marginBottom: 30,
    marginTop: 10,
  },
  backButtonText: {
    color: "#3498db",
    fontSize: 16,
    textAlign: "center",
  },
});