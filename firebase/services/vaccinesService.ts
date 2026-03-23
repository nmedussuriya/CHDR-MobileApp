import { db } from "../firebaseConfig";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { vaccine } from "../types";

const vaccinesCollection = collection(db, "vaccines");

export const addVaccine = async (vaccine: vaccine) => {
  await setDoc(doc(db, "vaccines", vaccine.vaccine_id), vaccine);
};

export const getVaccines = async (): Promise<vaccine[]> => {
  const snapshot = await getDocs(vaccinesCollection);
  return snapshot.docs.map(doc => ({ vaccine_id: doc.id, ...doc.data() } as vaccine));
};