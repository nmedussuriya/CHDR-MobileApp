import { db } from "../firebaseConfig";
import { collection, doc, setDoc, getDocs, query, where } from "firebase/firestore";
import { ImmunizationRecord } from "../types";

const immunizationCollection = collection(db, "immunization_records");

export const addImmunizationRecord = async (record: ImmunizationRecord) => {
  await setDoc(doc(db, "immunization_records", record.immune_id), record);
};

export const getImmunizationRecords = async (): Promise<ImmunizationRecord[]> => {
  const snapshot = await getDocs(immunizationCollection);
  return snapshot.docs.map(doc => ({ immune_id: doc.id, ...doc.data() } as ImmunizationRecord));
};

// ✅ ADD THIS FUNCTION - Get immunizations by child ID
export const getImmunizationsByChild = async (child_id: string): Promise<ImmunizationRecord[]> => {
  const q = query(immunizationCollection, where("child_id", "==", child_id));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ immune_id: doc.id, ...doc.data() } as ImmunizationRecord));
};