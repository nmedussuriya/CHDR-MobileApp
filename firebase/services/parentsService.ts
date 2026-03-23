import { db } from "../firebaseConfig";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { parent } from "../types";

const parentsCollection = collection(db, "parents");

// Add a parent
export const addParent = async (parent: parent) => {
  await setDoc(doc(db, "parents", parent.parent_id), parent);
};

// Get all parents
export const getParents = async (): Promise<parent[]> => {
  const parentsCollection = collection(db,"parents");
  const snapshot = await getDocs(parentsCollection);
  return snapshot.docs.map(doc => ({ parent_id: doc.id, ...doc.data() } as parent));
};