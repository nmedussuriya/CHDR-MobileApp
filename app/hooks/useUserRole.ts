// app/hooks/useUserRole.ts
import { useState, useEffect } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function useUserRole() {
  const [roleId, setRoleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      
      if (!user) {
        setRoleId(null);
        setLoading(false);
        return;
      }

      try {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          // Get the role_id (should be "1", "2", "3", "4", or "5")
          const userRoleId = userData.role_id;
          setRoleId(userRoleId);
          
        } else {
          setRoleId(null);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setRoleId(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { 
    roleId, 
    loading,
    // Specific role checks
    isMidwife: roleId === "2",     // ONLY role_id "2" can access midwife
    isParent: roleId === "1",       // ONLY role_id "1" can access parent
    isPhns: roleId === "3",
    isSphm: roleId === "4", 
    isDoctor: roleId === "5"
  };
}