import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  QueryDocumentSnapshot,
  where
} from "firebase/firestore";
import { db } from "../firebaseConfig";

// Types for reports
export interface ChildSummaryReport {
  totalChildren: number;
  ageGroups: {
    infants: number;      // 0-12 months
    toddlers: number;      // 13-36 months
    preschoolers: number;  // 37-60 months
    schoolAge: number;     // 61+ months
  };
  recentRegistrations: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  registrationTrend: {
    date: string;
    count: number;
  }[];
}

// Define types for your Firestore documents
interface ChildData {
  child_id: string;
  child_name: string;
  dob: string;
  gender: string;
  parent_id: string;
  midwife_id: string;
  address?: string;
  created_at?: string;
  birth_weight?: number;
  head_circumference?: number;
  length_at_birth?: number;
}

interface ImmunizationData {
  immune_id: string;
  child_id: string;
  vaccine_id: string;
  date_administered: string;
  status: string;
  batch_no?: string;
  notes?: string;
}

interface MilestoneData {
  record_id: string;
  child_id: string;
  development_id: string;
  reported_month: string;
  confirmed_month?: string;
  confirmed_by?: string;
  notes?: string;
}

interface FollowUpData {
  followup_id: string;
  child_id: string;
  period: string;
  weight: number;
  head_circumference: number;
  eye_condition?: string;
  skin_color?: string;
  feeding?: string;
  reflexes?: string;
}

interface ScreeningData {
  response_id: string;
  child_id: string;
  question_id: string;
  response: string;
  date: string;
}

// Helper function to extract data with proper typing
const extractData = <T>(doc: QueryDocumentSnapshot<DocumentData>): T => {
  return { id: doc.id, ...doc.data() } as T;
};

/**
 * Generate a summary report for all children (Midwife Dashboard)
 */
export const generateMidwifeReport = async (): Promise<ChildSummaryReport> => {
  try {
    // Get all children
    const childrenSnapshot = await getDocs(collection(db, "children"));
    const children = childrenSnapshot.docs.map(doc => extractData<ChildData>(doc));

    // Calculate age groups
    const ageGroups = {
      infants: 0,      // 0-12 months
      toddlers: 0,      // 13-36 months
      preschoolers: 0,  // 37-60 months
      schoolAge: 0      // 61+ months
    };

    const today = new Date();
    const registrationsByDay: { [key: string]: number } = {};

    children.forEach((child) => {
      // Age calculation
      if (child.dob) {
        const birthDate = new Date(child.dob);
        const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                      (today.getMonth() - birthDate.getMonth());
        
        if (months <= 12) ageGroups.infants++;
        else if (months <= 36) ageGroups.toddlers++;
        else if (months <= 60) ageGroups.preschoolers++;
        else ageGroups.schoolAge++;
      }

      // Track registrations by date
      if (child.created_at) {
        const date = new Date(child.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        registrationsByDay[date] = (registrationsByDay[date] || 0) + 1;
      }
    });

    // Calculate recent registrations
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;

    const recent = {
      today: 0,
      thisWeek: 0,
      thisMonth: 0
    };

    children.forEach((child) => {
      if (child.created_at) {
        const createdDate = new Date(child.created_at).getTime();
        const now = Date.now();
        
        if (now - createdDate <= oneDay) recent.today++;
        if (now - createdDate <= oneWeek) recent.thisWeek++;
        if (now - createdDate <= oneMonth) recent.thisMonth++;
      }
    });

    // Format trend data
    const trend = Object.entries(registrationsByDay)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(-7); // Last 7 days

    return {
      totalChildren: children.length,
      ageGroups,
      recentRegistrations: recent,
      registrationTrend: trend
    };

  } catch (error) {
    console.error("Error generating midwife report:", error);
    throw error;
  }
};

/**
 * Generate a detailed report for a specific child
 */
export const generateChildReport = async (childId: string) => {
  try {
    // 1. Get child info
    const childDoc = await getDoc(doc(db, "children", childId));
    if (!childDoc.exists()) {
      throw new Error("Child not found");
    }
    const childData = childDoc.data() as ChildData;

    // Get parent name
    let parentName = "Unknown";
    if (childData.parent_id) {
      const parentDoc = await getDoc(doc(db, "parents", childData.parent_id));
      if (parentDoc.exists()) {
        parentName = parentDoc.data().parent_name;
      }
    }

    // Get midwife name
    let midwifeName = "Unknown";
    if (childData.midwife_id) {
      const midwifeDoc = await getDoc(doc(db, "staffs", childData.midwife_id));
      if (midwifeDoc.exists()) {
        midwifeName = midwifeDoc.data().name || "Midwife";
      }
    }

    // 2. Get immunizations
    const immunizationsQuery = query(
      collection(db, "immunization_records"),
      where("child_id", "==", childId)
    );
    const immunizationsSnapshot = await getDocs(immunizationsQuery);
    const immunizations = immunizationsSnapshot.docs.map(doc => extractData<ImmunizationData>(doc));

    const completedImms = immunizations.filter(imm => imm.status === "Completed").length;
    const pendingImms = immunizations.filter(imm => imm.status === "Pending").length;

    // Group by vaccine
    const byVaccine: { [key: string]: number } = {};
    immunizations.forEach(imm => {
      if (imm.vaccine_id) {
        byVaccine[imm.vaccine_id] = (byVaccine[imm.vaccine_id] || 0) + 1;
      }
    });

    // 3. Get milestones
    const milestonesQuery = query(
      collection(db, "child_milestones"),
      where("child_id", "==", childId)
    );
    const milestonesSnapshot = await getDocs(milestonesQuery);
    const milestones = milestonesSnapshot.docs.map(doc => extractData<MilestoneData>(doc));

    const confirmedMilestones = milestones.filter(m => m.confirmed_month && m.confirmed_month !== "").length;
    const pendingMilestones = milestones.filter(m => !m.confirmed_month || m.confirmed_month === "").length;

    // Group milestones by age group (placeholder - you might need to join with development_milestones)
    const milestonesByAge: { [key: string]: number } = {};

    // 4. Get follow-ups
    const followupsQuery = query(
      collection(db, "followups"),
      where("child_id", "==", childId)
    );
    const followupsSnapshot = await getDocs(followupsQuery);
    const followups = followupsSnapshot.docs.map(doc => extractData<FollowUpData>(doc));

    // Calculate averages
    let totalWeight = 0;
    let totalHeadCirc = 0;
    followups.forEach(f => {
      totalWeight += f.weight || 0;
      totalHeadCirc += f.head_circumference || 0;
    });
    const avgWeight = followups.length > 0 ? totalWeight / followups.length : 0;
    const avgHeadCirc = followups.length > 0 ? totalHeadCirc / followups.length : 0;

    // 5. Get screenings
    const screeningsQuery = query(
      collection(db, "screening_responses"),
      where("child_id", "==", childId)
    );
    const screeningsSnapshot = await getDocs(screeningsQuery);
    const screenings = screeningsSnapshot.docs.map(doc => extractData<ScreeningData>(doc));
    
    // For now, we'll just count total screenings
    const visionCount = Math.floor(screenings.length / 2); // Placeholder
    const hearingCount = screenings.length - visionCount; // Placeholder

    return {
      childInfo: {
        child_id: childId,
        child_name: childData.child_name,
        dob: childData.dob,
        gender: childData.gender,
        parent_name: parentName,
        midwife_name: midwifeName,
        address: childData.address || "Not specified",
      },
      immunizations: {
        total: immunizations.length,
        completed: completedImms,
        pending: pendingImms,
        byVaccine,
        recent: immunizations.slice(0, 5)
      },
      milestones: {
        total: milestones.length,
        confirmed: confirmedMilestones,
        pending: pendingMilestones,
        byAgeGroup: milestonesByAge,
        recent: milestones.slice(0, 5)
      },
      followups: {
        total: followups.length,
        averageWeight: avgWeight,
        averageHeadCircumference: avgHeadCirc,
        recent: followups.slice(0, 5)
      },
      screenings: {
        vision: visionCount,
        hearing: hearingCount,
        recent: screenings.slice(0, 5)
      }
    };

  } catch (error) {
    console.error("Error generating child report:", error);
    throw error;
  }
};

/**
 * Get immunization statistics for a child
 */
export const getImmunizationStats = async (childId: string) => {
  try {
    const q = query(
      collection(db, "immunization_records"),
      where("child_id", "==", childId)
    );
    const snapshot = await getDocs(q);
    const immunizations = snapshot.docs.map(doc => extractData<ImmunizationData>(doc));
    
    const total = immunizations.length;
    const completed = immunizations.filter(imm => imm.status === "Completed").length;
    const pending = total - completed;

    return { total, completed, pending };
  } catch (error) {
    console.error("Error getting immunization stats:", error);
    throw error;
  }
};

/**
 * Get milestone statistics for a child
 */
export const getMilestoneStats = async (childId: string) => {
  try {
    const q = query(
      collection(db, "child_milestones"),
      where("child_id", "==", childId)
    );
    const snapshot = await getDocs(q);
    const milestones = snapshot.docs.map(doc => extractData<MilestoneData>(doc));
    
    const total = milestones.length;
    const confirmed = milestones.filter(m => m.confirmed_month && m.confirmed_month !== "").length;
    const pending = total - confirmed;

    return { total, confirmed, pending };
  } catch (error) {
    console.error("Error getting milestone stats:", error);
    throw error;
  }
};

/**
 * Get follow-up statistics for a child
 */
export const getFollowupStats = async (childId: string) => {
  try {
    const q = query(
      collection(db, "followups"),
     where("child_id", "==", childId)  
    );
    const snapshot = await getDocs(q);
    
    return { total: snapshot.size };
  } catch (error) {
    console.error("Error getting followup stats:", error);
    throw error;
  }
};