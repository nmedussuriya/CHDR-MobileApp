import {db} from "../firebaseConfig.tsx";
import{collection ,doc, setDoc, getDocs} from "firebase/firestore";
import { staff } from "../types.tsx";

const staffsCollection = collection(db, "staffs");

export const addStaff = async (staff:staff) =>{
    await setDoc(doc(db,"staffs", staff.staff_id),staff);
};
export const getStaff = async (): Promise<staff[]> => {
  const staffsCollection = collection(db,"staff");
  const snapshot = await getDocs(staffsCollection);
  return snapshot.docs.map(doc => ({ staff_id: doc.id, ...doc.data() } as staff));
};