import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../../utils/logger";

const usersCollection = collection(db, "users");
const staffsCollection = collection(db, "staffs");

async function addStaffs() {
  try {
    logger.log("=".repeat(50));
    logger.log("👥 ADDING STAFF RECORDS");
    logger.log("=".repeat(50));

    // Get all users
    const usersSnapshot = await getDocs(usersCollection);
    
    // Filter users with staff roles (2,3,4,5)
    const staffUsers = usersSnapshot.docs.filter(
      (doc) => ["2", "3", "4", "5"].includes(doc.data().role_id)
    );

    logger.log(`📊 Found ${staffUsers.length} users with staff roles`);

    let index = 0;
    let created = 0;
    let skipped = 0;

    for (const userDoc of staffUsers) {
      const userData = userDoc.data();
      
      // Check if staff record already exists for this user
      const existingStaffQuery = query(
        staffsCollection, 
        where("user_id", "==", userDoc.id)
      );
      const existingStaff = await getDocs(existingStaffQuery);
      
      if (!existingStaff.empty) {
        logger.log(`⏭️ Staff already exists for: ${userData.username} (role: ${userData.role_id})`);
        skipped++;
        continue;
      }

      // Generate registration number
      const regNumber = `REG${String(index + 1).padStart(3, '0')}`;
      
      // Assign area based on role
      let assignedArea = "area_default";
      if (userData.role_id === "2") assignedArea = "area_midwife";
      else if (userData.role_id === "3") assignedArea = "area_phns";
      else if (userData.role_id === "4") assignedArea = "area_sphm";
      else if (userData.role_id === "5") assignedArea = "area_doctor";

      const staff = {
        staff_id: uuidv4(),
        name: userData.username,
        role_id: userData.role_id,
        registration_number: regNumber,
        assigned_area_id: assignedArea,
        user_id: userDoc.id,
        created_at: new Date().toISOString()
      };

      await setDoc(doc(staffsCollection, staff.staff_id), staff);

      logger.log("\n" + "-".repeat(40));
      logger.log(`✅ Created staff #${created + 1}`);
      logger.log(`   Name: ${userData.username}`);
      logger.log(`   Role ID: ${userData.role_id}`);
      logger.log(`   Reg Number: ${regNumber}`);
      logger.log(`   Area: ${assignedArea}`);
      logger.log(`   Staff ID: ${staff.staff_id}`);

      created++;
      index++;
    }

    logger.log("\n" + "=".repeat(50));
    logger.log("📊 STAFF CREATION SUMMARY");
    logger.log("=".repeat(50));
    logger.log(`✅ Created: ${created} staff records`);
    logger.log(`⏭️ Skipped: ${skipped} (already existed)`);
    logger.log("=".repeat(50));

  } catch (error) {
    logger.error("❌ Error:", error);
  }
}

// Run the function
addStaffs();