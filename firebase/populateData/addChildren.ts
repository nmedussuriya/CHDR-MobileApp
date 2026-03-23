import { db } from "../firebaseConfig";
import { collection, getDocs, addDoc, setDoc, doc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../../utils/logger";

async function addMoreChildren() {
  try {
    logger.log("👶 Adding more children to database...");
    
    // 1. Get all parents to link children to
    const parentsSnapshot = await getDocs(collection(db, "parents"));
    const parents = parentsSnapshot.docs.map(doc => ({
      parent_id: doc.id,
      parent_name: doc.data().parent_name
    }));
    
    if (parents.length === 0) {
      logger.log("❌ No parents found! Add parents first.");
      return;
    }
    
    logger.log(`📊 Found ${parents.length} parents`);

    // 2. List of new children to add
    const newChildren = [
      // Children for midwife assignments
      { name: "Saman Kumara", dob: "2023-05-12", gender: "Male", weight: 3.2, head: 34, length: 51, address: "Colombo 05" },
      { name: "Nimali Perera", dob: "2023-08-23", gender: "Female", weight: 3.5, head: 35, length: 52, address: "Kandy" },
      { name: "Kamal Fernando", dob: "2024-01-15", gender: "Male", weight: 3.8, head: 36, length: 53, address: "Galle" },
      { name: "Sunil Weerasinghe", dob: "2023-11-30", gender: "Male", weight: 3.1, head: 33, length: 50, address: "Negombo" },
      { name: "Mala Jayawardena", dob: "2024-02-18", gender: "Female", weight: 3.4, head: 34, length: 51, address: "Kurunegala" },
      { name: "Nuwan Silva", dob: "2023-09-05", gender: "Male", weight: 3.6, head: 35, length: 52, address: "Matara" },
      { name: "Dilani Rathnayake", dob: "2023-12-12", gender: "Female", weight: 3.3, head: 34, length: 50, address: "Anuradhapura" },
      { name: "Ruwan Ekanayake", dob: "2024-03-01", gender: "Male", weight: 3.7, head: 36, length: 53, address: "Badulla" },
      { name: "Chamari Bandara", dob: "2023-10-08", gender: "Female", weight: 3.2, head: 33, length: 51, address: "Ratnapura" },
      { name: "Asela Gunawardena", dob: "2023-07-19", gender: "Male", weight: 3.9, head: 36, length: 54, address: "Jaffna" },
      { name: "Tharushi Liyanage", dob: "2024-01-22", gender: "Female", weight: 3.4, head: 34, length: 52, address: "Batticaloa" },
      { name: "Ishara Madushan", dob: "2023-06-14", gender: "Male", weight: 3.5, head: 35, length: 52, address: "Trincomalee" },
      { name: "Sachini Nisansala", dob: "2023-08-29", gender: "Female", weight: 3.1, head: 33, length: 50, address: "Polonnaruwa" },
      { name: "Dinesh Kumara", dob: "2024-02-05", gender: "Male", weight: 3.6, head: 35, length: 53, address: "Ampara" },
      { name: "Paboda Dilshani", dob: "2023-09-17", gender: "Female", weight: 3.3, head: 34, length: 51, address: "Hambantota" }
    ];

    let added = 0;

    // 3. Add each child with a random parent
    for (const childInfo of newChildren) {
      // Pick a random parent
      const randomParent = parents[Math.floor(Math.random() * parents.length)];
      
      const childId = uuidv4();
      const childData = {
        child_id: childId,
        child_name: childInfo.name,
        dob: childInfo.dob,
        gender: childInfo.gender,
        birth_weight: childInfo.weight,
        head_circumference: childInfo.head,
        length_at_birth: childInfo.length,
        address: childInfo.address,
        parent_id: randomParent.parent_id,
        midwife_id: "" // Will be assigned by the midwife assignment script
      };

      await setDoc(doc(db, "children", childId), childData);
      
      logger.log(`✅ Added: ${childInfo.name}`);
      logger.log(`   Parent: ${randomParent.parent_name}`);
      logger.log(`   DOB: ${childInfo.dob}`);
      logger.log("---");
      
      added++;
    }

    logger.log(`\n🎉 Added ${added} new children to database!`);
    logger.log(`\n👉 Now run the assignment script again:`);
    logger.log(`npx ts-node-esm firebase/populateData/assignChildrenToMidwives.ts`);

  } catch (error) {
    logger.error("❌ Error adding children:", error);
  }
}

// Run the function
addMoreChildren();