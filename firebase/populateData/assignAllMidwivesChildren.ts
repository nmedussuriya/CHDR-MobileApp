import { db } from "../firebaseConfig";
import { collection, getDocs, updateDoc, doc, query, where } from "firebase/firestore";
import { logger } from "../../utils/logger";

async function assignAllMidwivesChildren() {
  try {
    logger.log("🚀 Assigning children to ALL midwives...");
    
    // 1. Get ALL midwives from staffs table
    const staffSnapshot = await getDocs(collection(db, "staffs"));
    
    // Filter for midwives (role_id = "2")
    const midwives = staffSnapshot.docs.filter(doc => {
      const data = doc.data();
      return data.role_id === "2";
    });
    
    logger.log(`📊 Found ${midwives.length} midwives total`);
    
    if (midwives.length === 0) {
      logger.log("❌ No midwives found!");
      return;
    }

    // 2. Get ALL children
    const childrenSnapshot = await getDocs(collection(db, "children"));
    const children = childrenSnapshot.docs;
    
    logger.log(`📊 Found ${children.length} children total`);

    // 3. Reset all children's midwife_id to empty first (optional)
    // Uncomment if you want to start fresh
    // for (const child of children) {
    //   await updateDoc(doc(db, "children", child.id), {
    //     midwife_id: ""
    //   });
    // }
    // logger.log("✅ Reset all children assignments");

    // 4. Distribute children evenly among ALL midwives
    let childIndex = 0;
    let assignedCount = 0;

    for (let m = 0; m < midwives.length; m++) {
      const midwife = midwives[m];
      const midwifeData = midwife.data();
      const childrenForThisMidwife = [];
      
      // Assign 4-5 children to each midwife
      for (let i = 0; i < 5; i++) {
        if (childIndex >= children.length) break;
        
        const child = children[childIndex];
        const childData = child.data();
        
        await updateDoc(doc(db, "children", child.id), {
          midwife_id: midwife.id
        });
        
        childrenForThisMidwife.push(child.id);
        logger.log(`   ✅ Assigned ${childData.child_name || child.id} to ${midwifeData.name || midwife.id}`);
        
        childIndex++;
        assignedCount++;
      }
      
      logger.log(`✅ Midwife ${midwifeData.name || midwife.id} (${midwife.id}) got ${childrenForThisMidwife.length} children`);
    }

    // 5. Check which midwives got children
    logger.log("\n📊 FINAL ASSIGNMENT SUMMARY:");
    logger.log("=".repeat(50));
    
    // Check each midwife's assigned children
    for (const midwife of midwives) {
      const midwifeData = midwife.data();
      const midwifeId = midwife.id;
      
      // Query children assigned to this midwife
      const childrenQuery = query(
        collection(db, "children"),
        where("midwife_id", "==", midwifeId)
      );
      const assignedSnapshot = await getDocs(childrenQuery);
      
      logger.log(`👩‍⚕️ ${midwifeData.name || "Unknown"} (${midwifeId}): ${assignedSnapshot.size} children`);
    }

    logger.log(`\n🎉 DONE! Assigned ${assignedCount} children to ${midwives.length} midwives`);
    logger.log(`📊 Children left unassigned: ${children.length - assignedCount}`);

  } catch (error) {
    logger.error("❌ Error assigning children to midwives:", error);
  }
}

// Run it
assignAllMidwivesChildren();