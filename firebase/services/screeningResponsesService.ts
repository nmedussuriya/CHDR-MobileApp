import { db } from "../firebaseConfig";
import { collection, doc, setDoc, getDocs, query, where } from "firebase/firestore";
import { screening_response } from "../types";

const screeningResponsesCollection = collection(db, "screening_responses");

export const addScreeningResponse = async (response: screening_response) => {
  await setDoc(doc(db, "screening_responses", response.response_id), response);
};

export const getScreeningResponses = async (): Promise<screening_response[]> => {
  const snapshot = await getDocs(screeningResponsesCollection);
  return snapshot.docs.map(doc => ({ response_id: doc.id, ...doc.data() } as screening_response));
};

export const getResponsesByChild = async (child_id: string): Promise<screening_response[]> => {
  const q = query(screeningResponsesCollection, where("child_id", "==", child_id));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ response_id: doc.id, ...doc.data() } as screening_response));
};