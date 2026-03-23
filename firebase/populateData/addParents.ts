import { collection, doc, getDocs, setDoc, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../../utils/logger";

const usersCollection = collection(db, "users");
const parentsCollection = collection(db, "parents");

async function addParents() {
  logger.log("=".repeat(50));
  logger.log("👪 ADDING PARENT RECORDS");
  logger.log("=".repeat(50));

  try {
    // Get all users with role_id = "1" (parents)
    const usersQuery = query(usersCollection, where("role_id", "==", "1"));
    const usersSnapshot = await getDocs(usersQuery);
    
    logger.log(`📊 Found ${usersSnapshot.docs.length} users with role_id="1"`);
    let created = 0;
    let skipped = 0;

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      
      // Check if parent record already exists for this user
      const existingParentQuery = query(
        parentsCollection, 
        where("user_id", "==", userDoc.id)
      );
      const existingParent = await getDocs(existingParentQuery);
      
      if (!existingParent.empty) {
        logger.log(`⏭️ Parent already exists for: ${userData.username}`);
        skipped++;
        continue;
      }

      // Create parent record
      const parentId = uuidv4();
      const parent = {
        parent_id: parentId,
        parent_name: userData.username,
        contact_number: userData.contact_number || "",
        user_id: userDoc.id,
        created_at: new Date().toISOString()
      };

      await setDoc(doc(parentsCollection, parentId), parent);

      logger.log("\n" + "-".repeat(40));
      logger.log(`✅ Created parent #${created + 1}`);
      logger.log(`   Name: ${userData.username}`);
      logger.log(`   Email: ${userData.email}`);
      logger.log(`   Contact: ${userData.contact_number || "N/A"}`);
      logger.log(`   Parent ID: ${parentId}`);
      logger.log(`   User ID: ${userDoc.id}`);

      created++;
    }

    logger.log("\n" + "=".repeat(50));
    logger.log("📊 PARENT CREATION SUMMARY");
    logger.log("=".repeat(50));
    logger.log(`✅ Created: ${created} parent records`);
    logger.log(`⏭️ Skipped: ${skipped} (already existed)`);
    logger.log("=".repeat(50));

  } catch (error) {
    logger.error("❌ Error adding parents:", error);
  }
}

// Run the function
addParents();