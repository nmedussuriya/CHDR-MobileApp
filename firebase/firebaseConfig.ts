import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyD0ZNSZzneSSwrC2yoSekL6vQ6wZzeFijM",
  authDomain: "childhealthcaredb.firebaseapp.com",
  projectId: "childhealthcaredb",
  storageBucket: "childhealthcaredb.firebasestorage.app",
  messagingSenderId: "919347967013",
  appId: "1:919347967013:web:c91a376e2bc8ab2c7e7bcc"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Get auth instance
export const auth = getAuth(app);

// Set up persistence manually (this is the fallback)
auth.setPersistence = async () => {
  // This is handled automatically in newer versions
};