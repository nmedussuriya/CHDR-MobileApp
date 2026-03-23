import { 
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

// LOGIN with email and password
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// REGISTER new user
export const registerUser = async (
  email: string, 
  password: string, 
  username: string,
  role: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Save user details to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email,
      username,
      role,
      createdAt: new Date().toISOString()
    });
    
    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// LOGOUT
export const logoutUser = async () => {
  await signOut(auth);
};

// GET USER ROLE from Firestore
export const getUserRole = async (uid: string) => {
  const userDoc = await getDoc(doc(db, "users", uid));
  return userDoc.exists() ? userDoc.data().role : null;
};