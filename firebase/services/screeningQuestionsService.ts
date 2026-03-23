import { db } from "../firebaseConfig";
import { collection, doc, setDoc, getDocs, query, where } from "firebase/firestore";
import { screening_question } from "../types";

const screeningQuestionsCollection = collection(db, "screening_questions");

export const addScreeningQuestion = async (question: screening_question) => {
  await setDoc(doc(db, "screening_questions", question.question_id), question);
};

export const getScreeningQuestions = async (): Promise<screening_question[]> => {
  const snapshot = await getDocs(screeningQuestionsCollection);
  return snapshot.docs.map(doc => ({ question_id: doc.id, ...doc.data() } as screening_question));
};

export const getQuestionsByType = async (type_id: string): Promise<screening_question[]> => {
  const q = query(screeningQuestionsCollection, where("type_id", "==", type_id));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ question_id: doc.id, ...doc.data() } as screening_question));
};