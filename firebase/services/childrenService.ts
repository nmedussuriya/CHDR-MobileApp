import { db } from "../firebaseConfig";
import { collection, doc, setDoc, getDocs, getDoc, updateDoc, query, where} from "firebase/firestore";
import { child, ChildDevelopmentRecord } from "../types";

const childrenCollection = collection(db, "children");

export const addChild = async (child: child) => {
  await setDoc(doc(db, "children", child.child_id), child);
};

export const getChildren = async (): Promise<child[]> => {
  const snapshot = await getDocs(childrenCollection);
  return snapshot.docs.map(doc => ({ child_id: doc.id, ...doc.data() } as child));
};

export const getChildById = async (child_id: string): Promise<child | null> => {
  const docRef = doc(db, "children", child_id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return docSnap.data() as child;
};

export const updateChild = async (child_id: string, data: Partial<child>) => {
  const docRef = doc(db, "children", child_id);
  await updateDoc(docRef, data);
};

// ✅ FIXED: Return objects with child_id instead of id
export const getChildrenByParent = async (parent_id: string): Promise<child[]> => {
  const childrenCol = collection(db, "children");
  const q = query(childrenCol, where("parent_id", "==", parent_id));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ 
    child_id: doc.id,  // Changed from 'id' to 'child_id'
    ...doc.data() 
  } as child));
};

// In firebase/services/childMilestonesService.ts - ADD THIS FUNCTION
export const getAllChildMilestones = async (): Promise<ChildDevelopmentRecord[]> => {
  const querySnapshot = await getDocs(collection(db, "child_milestones"));
  return querySnapshot.docs.map(doc => ({
    record_id: doc.id,
    ...doc.data()
  })) as ChildDevelopmentRecord[];
};

export const getChildrenByMidwife = async (midwifeId: string) => {
  const q = query(
    collection(db, "children"),
    where("midwife_id", "==", midwifeId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ 
    child_id: doc.id, 
    ...doc.data() 
  }));
};