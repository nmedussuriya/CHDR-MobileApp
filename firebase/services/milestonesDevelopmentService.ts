import { db } from "../firebaseConfig";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { DevelopmentMilestone } from "../types";

const milestonesCollection = collection(db, "milestones");

export const addMilestone = async (milestone: DevelopmentMilestone) => {
  await setDoc(doc(db, "milestones", milestone.development_id), milestone);
};

export const getMilestones = async (): Promise<DevelopmentMilestone[]> => {
  const snapshot = await getDocs(milestonesCollection);
  return snapshot.docs.map(doc => ({ development_id: doc.id, ...doc.data() } as DevelopmentMilestone));
};