import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { user } from "../types";

// Reference to the 'users' collection in Firestore
const usersCollection = collection(db, "users");

// Add a user
export const addUser = async (user: user) => {
  await setDoc(doc(db, "users", user.user_id), user);
  // doc(db, "users", user.user_id) -> creates a document with ID = user_id
  // setDoc writes the user object to Firestore

  if(user.role_id=="1"){
    const parent = {
      parent_id:"p_" + user.user_id,
      parent_name:user.username,
      contact_number: user.contact_number || "",
      user_id: user.user_id
    };

await setDoc(doc(db, "parents", parent.parent_id), parent);  }
};

// Get all usersy
export const getUsers = async (): Promise<user[]> => {
  const snapshot = await getDocs(usersCollection);
  return snapshot.docs.map(doc => ({ user_id: doc.id, ...doc.data() } as user));
};

// Get a single user by ID
export const getUserById = async (user_id: string): Promise<user | null> => {
  const docRef = doc(db, "users", user_id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return docSnap.data() as user;
};

// Update a user (partial update)
export const updateUser = async (user_id: string, data: Partial<user>) => {
  const docRef = doc(db, "users", user_id);
  await updateDoc(docRef, data);
};