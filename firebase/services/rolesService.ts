// BEFORE (runtime import — causes ERR_MODULE_NOT_FOUND)
// import { role } from "../types";

// AFTER (type-only import — safe for ts-node-esm)
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig.ts";
import type { role } from "../types";

const rolesCollection = collection(db, "roles");

export const addRole = async (role: role) => {
  await setDoc(doc(db, "roles", role.role_id), role);
};

export const getRoles = async (): Promise<role[]> => {
  const snapshot = await getDocs(rolesCollection);
  return snapshot.docs.map(doc => ({ role_id: doc.id, ...doc.data() } as role));
};