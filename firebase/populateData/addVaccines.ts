// firebase/populateData/addVaccines.ts
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig.ts";
import { v4 as uuidv4 } from "uuid";

interface vaccine{
    vaccine_id: string;
    vaccine_name: string;
    Age_group: string;
}
const vaccinesCollection = collection(db, "vaccines");

async function addVaccines() {
  try {
    const vaccinesData = [
      // At Birth
      { vaccine_name: "BCG", Age_group: "At Birth" },
      { vaccine_name: "BCG 2nd dose (if no scar at 6 months)", Age_group: "At Birth" },
      
      // 2 Months
      { vaccine_name: "Pentavalent 1", Age_group: "2 Months Completed" },
      { vaccine_name: "OPV 1", Age_group: "2 Months Completed" },
      
      // 4 Months
      { vaccine_name: "Pentavalent 2", Age_group: "4 Months Completed" },
      { vaccine_name: "OPV 2", Age_group: "4 Months Completed" },
      
      // 6 Months
      { vaccine_name: "Pentavalent 3", Age_group: "6 Months Completed" },
      { vaccine_name: "OPV 3", Age_group: "6 Months Completed" },
      
      // 9 Months
      { vaccine_name: "Live JE", Age_group: "9 Months Completed" },
      
      // 12 Months
      { vaccine_name: "MMR 1", Age_group: "12 Months Completed" },
      
      // 18 Months
      { vaccine_name: "DPT", Age_group: "18 Months Completed" },
      { vaccine_name: "OPV 4", Age_group: "18 Months Completed" },
      
      // 3 Years
      { vaccine_name: "MR / MMR 2", Age_group: "3 Years Completed" },
      
      // 5 Years
      { vaccine_name: "D.T", Age_group: "5 Years Completed" },
      { vaccine_name: "OPV 5", Age_group: "5 Years Completed" },
      
      // 12 Years
      { vaccine_name: "Adult Tetanus & Diphtheria (aTd)", Age_group: "12 Years Completed" },
    ];


    for (const v of vaccinesData) {
      const vaccine_id = uuidv4(); // Generate unique ID
      
      const vaccine: vaccine = {
        vaccine_id: vaccine_id,
        vaccine_name: v.vaccine_name,
        Age_group: v.Age_group
      };

      await setDoc(doc(vaccinesCollection, vaccine_id), vaccine);
      
    }


  } catch (error) {
    console.error("❌ Error adding vaccines:", error);
  }
}

addVaccines();