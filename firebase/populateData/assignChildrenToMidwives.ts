import { db } from "../firebaseConfig";
import { collection, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import { logger } from "../../utils/logger";

async function assignChildrenToMidwives() {
  try {
    logger.log("🚀 Starting to assign children to midwives...");
    
    // 1. Get ALL staff
    const staffSnapshot = await getDocs(collection(db, "staffs"));
    
    if (staffSnapshot.empty) {
      logger.log("❌ No staff found!");
      return;
    }
    
    logger.log(`📊 Total staff: ${staffSnapshot.docs.length}`);

    // 2. For each staff, get their user record to check role
    const midwives = [];
    
    for (const staffDoc of staffSnapshot.docs) {
      const staffData = staffDoc.data();
      const userId = staffData.user_id;
      
      // Get the user record
      const userDoc = await getDoc(doc(db, "users", userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const roleId = userData.role_id;
        
        logger.log(`- Staff ${staffDoc.id}: User role_id = ${roleId}`);
        
        // If this user is a midwife (role_id = "2")
        if (roleId === "2") {
          midwives.push({
            staffId: staffDoc.id,
            staffData: staffData,
            userName: userData.username
          });
        }
      } else {
        logger.log(`- Staff ${staffDoc.id}: No user found`);
      }
    }
    
    logger.log(`\n✅ Midwives found: ${midwives.length}`);
    
    if (midwives.length === 0) {
      logger.log("❌ No midwives found!");
      return;
    }

    // 3. Get all children
    const childrenSnapshot = await getDocs(collection(db, "children"));
    const children = childrenSnapshot.docs;
    
    logger.log(`✅ Children found: ${children.length}`);

    // 4. Assign 4-5 children to each midwife
    let childIndex = 0;
    let assignedCount = 0;

    for (let m = 0; m < midwives.length; m++) {
      const midwife = midwives[m];
      const childrenForThisMidwife = [];
      
      for (let i = 0; i < 5; i++) {
        if (childIndex >= children.length) break;
        
        const child = children[childIndex];
        const childData = child.data();
        
        await updateDoc(doc(db, "children", child.id), {
          midwife_id: midwife.staffId
        });
        
        childrenForThisMidwife.push(child.id);
        logger.log(`   ✅ Assigned child ${childData.child_name || child.id} to midwife ${midwife.userName}`);
        
        childIndex++;
        assignedCount++;
      }
      
      logger.log(`✅ Midwife ${midwife.userName} got ${childrenForThisMidwife.length} children`);
    }

    logger.log(`\n🎉 DONE! Assigned ${assignedCount} children to ${midwives.length} midwives`);

  } catch (error) {
    logger.error("❌ Error assigning children to midwives:", error);
  }
}

assignChildrenToMidwives();