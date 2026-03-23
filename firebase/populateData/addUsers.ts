import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { logger } from "../../utils/logger";

interface user {
  user_id: string;
  username: string;
  email: string;
  password: string;
  contact_number: string;
  role_id: string;
}

const usersCollection = collection(db, "users");

// Generate random password
function generatePassword(length = 8) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

async function addUsers() {
  logger.log("=".repeat(50));
  logger.log("🚀 STARTING TO ADD 50 USERS (10 for each role 1-5)");
  logger.log("=".repeat(50));
  
  try {
    const usersData = [
      // Parents (role 1) - 10 users
      { username: "Kasun Fernando", email: "kasun.fernando1@gmail.com", role_id: "1", contact_number: "0756789011" },
      { username: "Dinesh Silva", email: "dinesh.silva1@gmail.com", role_id: "1", contact_number: "0756789012" },
      { username: "Ravindu Peris", email: "ravindu.peris1@gmail.com", role_id: "1", contact_number: "0756789013" },
      { username: "Chathura Wickramasinghe", email: "chathura.wickrama1@gmail.com", role_id: "1", contact_number: "0756789014" },
      { username: "Ishara Madushan", email: "ishara.madushan1@gmail.com", role_id: "1", contact_number: "0756789015" },
      { username: "Tharindu Lakmal", email: "tharindu.lakmal1@gmail.com", role_id: "1", contact_number: "0756789016" },
      { username: "Gayan Hettiarachchi", email: "gayan.hetti1@gmail.com", role_id: "1", contact_number: "0756789017" },
      { username: "Nadeesha Dilshan", email: "nadeesha.dilshan1@gmail.com", role_id: "1", contact_number: "0756789018" },
      { username: "Supun Bandara", email: "supun.bandara1@gmail.com", role_id: "1", contact_number: "0756789019" },
      { username: "Pasindu Jayasinghe", email: "pasindu.jaya1@gmail.com", role_id: "1", contact_number: "0756789020" }
    ];

    let successCount = 0;

    logger.log("\n📊 Adding users by role:");
    logger.log("   👪 Parents (role 1): 10 users");
    logger.log("   👩‍⚕️ Midwives (role 2): 10 users");
    logger.log("   👩‍⚕️ PHNS (role 3): 10 users");
    logger.log("   👨‍⚕️ SPHM (role 4): 10 users");
    logger.log("   👨‍⚕️ Doctors (role 5): 10 users");
    logger.log("   TOTAL: 50 users\n");

    for (const u of usersData) {
      const plainPassword = generatePassword();
      
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        u.email, 
        plainPassword
      );
      
      // Save to Firestore
      const user: user = {
        user_id: userCredential.user.uid,
        username: u.username,
        email: u.email,
        password: "HASHED_IN_AUTH",
        contact_number: u.contact_number,
        role_id: u.role_id,
      };

      await setDoc(doc(usersCollection, user.user_id), user);

      // Show role name
      let roleName = "";
      if (u.role_id === "1") roleName = "Parent";
      else if (u.role_id === "2") roleName = "Midwife";
      else if (u.role_id === "3") roleName = "PHNS";
      else if (u.role_id === "4") roleName = "SPHM";
      else if (u.role_id === "5") roleName = "Doctor";

      // Show log in terminal
      logger.log("\n" + "-".repeat(40));
      logger.log(`✅ USER CREATED #${successCount + 1}`);
      logger.log("-".repeat(40));
      logger.log(`👤 Username: ${u.username}`);
      logger.log(`📧 Email:    ${u.email}`);
      logger.log(`🔑 Password: ${plainPassword}`);
      logger.log(`📞 Contact:  ${u.contact_number}`);
      logger.log(`🆔 Role:     ${roleName} (${u.role_id})`);
      logger.log(`📋 User ID:  ${userCredential.user.uid}`);
      
      successCount++;
    }

    logger.log("\n" + "=".repeat(50));
    logger.log(`🎉 SUCCESS! Added ${successCount} users`);
    logger.log("=".repeat(50));
    logger.log("\n📋 FINAL SUMMARY:");
    logger.log("   👪 Parents (role 1): 10 users");
    logger.log("   👩‍⚕️ Midwives (role 2): 10 users");
    logger.log("   👩‍⚕️ PHNS (role 3): 10 users");
    logger.log("   👨‍⚕️ SPHM (role 4): 10 users");
    logger.log("   👨‍⚕️ Doctors (role 5): 10 users");
    logger.log("   TOTAL: 50 users");
    logger.log("\n⚠️  IMPORTANT: Save these passwords! They won't be shown again!");

  } catch (error) {
    logger.error("\n❌ Error adding users:", error);
  }
}

// Run the function
addUsers();