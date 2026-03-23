import { db } from "../firebaseConfig";
import { collection, doc, setDoc, getDocs, query, where } from "firebase/firestore";
import { FollowUpRecord } from "../types";

const followupsCollection = collection(db, "followups");

export const addFollowUp = async (record: FollowUpRecord) => {
  await setDoc(doc(db, "followups", record.followup_id), record);
};

export const getFollowUps = async (): Promise<FollowUpRecord[]> => {
  const snapshot = await getDocs(followupsCollection);
  return snapshot.docs.map(doc => ({ followup_id: doc.id, ...doc.data() } as FollowUpRecord));
};

// ✅ ADD THIS FUNCTION
export const getFollowUpsByChild = async (child_id: string): Promise<FollowUpRecord[]> => {
  const q = query(followupsCollection, where("child_id", "==", child_id));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ followup_id: doc.id, ...doc.data() } as FollowUpRecord));
};