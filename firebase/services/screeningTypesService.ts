import { db } from "../firebaseConfig";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { screening_type } from "../types";

const screeningTypesCollection = collection(db, "screening_types");

export const addScreeningType = async (type: screening_type) => {
  await setDoc(doc(db, "screening_types", type.type_id), type);
};

export const getScreeningTypes = async (): Promise<screening_type[]> => {
  const snapshot = await getDocs(screeningTypesCollection);
  return snapshot.docs.map(doc => ({ type_id: doc.id, ...doc.data() } as screening_type));
};