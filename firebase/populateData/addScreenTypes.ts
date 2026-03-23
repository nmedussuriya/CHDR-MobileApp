import { db } from "../firebaseConfig.ts";
import { collection, doc, setDoc } from "firebase/firestore";

interface screening_type{
    type_id:string;
    type_name:string;
}
const screeningTypesCollection = collection(db, "screening_types");

async function addScreeningTypes() {

  try {
    const screeningTypesData = [
      {
        type_id: "t1",
        type_name: "Vision Milestone"
      },
      {
        type_id: "t2", 
        type_name: "Hearing Milestone"
      }
    ];


    for (const type of screeningTypesData) {
      await setDoc(doc(screeningTypesCollection, type.type_id), type);
      
    }


  } catch (error) {
    console.error("n Error adding screening types:", error);
  }
}

addScreeningTypes();