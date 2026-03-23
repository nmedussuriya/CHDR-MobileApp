import { db } from "../firebaseConfig";
import { collection, doc, setDoc, getDocs, query, where } from "firebase/firestore";
import { ChildDevelopmentRecord } from "../types";

const childMilestonesCollection = collection(db, "child_milestones");

export const addChildMilestone = async (record: ChildDevelopmentRecord) => {
  await setDoc(doc(db, "child_milestones", record.record_id), record);
};

// FIXED: Now filters by child_id!
export const getChildMilestones = async (childId: string): Promise<ChildDevelopmentRecord[]> => {
  // Create a query that filters by child_id
  const q = query(childMilestonesCollection, where("child_id", "==", childId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ record_id: doc.id, ...doc.data() } as ChildDevelopmentRecord));
};

// Optional: Get all milestones (if needed for admin)
export const getAllChildMilestones = async (): Promise<ChildDevelopmentRecord[]> => {
  const snapshot = await getDocs(childMilestonesCollection);
  return snapshot.docs.map(doc => ({ record_id: doc.id, ...doc.data() } as ChildDevelopmentRecord));
};