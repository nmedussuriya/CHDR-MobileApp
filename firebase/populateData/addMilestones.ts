import { db } from "../firebaseConfig.ts";  // Add .ts
import { collection, doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const milestonesCollection = collection(db, "milestones");

interface DevelopmentMilestone{
    development_id: string;
    milestone_name: string;
    age_group: string;
}

async function addMilestones() {

  try {
    const milestonesData = [
      // 6 Weeks to 3 Months
      {
        age_group: "6 Weeks to 3 Months",
        milestone_text: "Lifts head while lying on the stomach."
      },
      {
        age_group: "6 Weeks to 3 Months",
        milestone_text: "Eyes follow a moving object from one side to the other."
      },
      {
        age_group: "6 Weeks to 3 Months",
        milestone_text: "Reacts to sudden loud noises (e.g., stops current activity)."
      },
      {
        age_group: "6 Weeks to 3 Months",
        milestone_text: "Makes vowel-like sounds (e.g., 'Ah', 'Oo', 'Eh')."
      },
      {
        age_group: "6 Weeks to 3 Months",
        milestone_text: "Smiles upon recognizing the mother (Social smile)."
      },

      // 3 to 6 Months
      {
        age_group: "3 to 6 Months",
        milestone_text: "Lifts head and chest while lying on the stomach."
      },
      {
        age_group: "3 to 6 Months",
        milestone_text: "Plays with hands by interlocking fingers."
      },
      {
        age_group: "3 to 6 Months",
        milestone_text: "Reaches for and grasps objects with the whole palm."
      },
      {
        age_group: "3 to 6 Months",
        milestone_text: "Turns head toward the source of a sound."
      },
      {
        age_group: "3 to 6 Months",
        milestone_text: "Makes single-syllable sounds (e.g., 'Ga', 'Da', 'Ba')."
      },
      {
        age_group: "3 to 6 Months",
        milestone_text: "Laughs out loud."
      },

      // 6 to 9 Months
      {
        age_group: "6 to 9 Months",
        milestone_text: "Lifts head when placed on the back."
      },
      {
        age_group: "6 to 9 Months",
        milestone_text: "Rolls over from back to stomach and stomach to back."
      },
      {
        age_group: "6 to 9 Months",
        milestone_text: "Transfers an object from one hand to the other."
      },
      {
        age_group: "6 to 9 Months",
        milestone_text: "Makes repetitive double-syllable sounds (e.g., 'Da-da', 'Ba-ba')."
      },

      // 9 to 12 Months
      {
        age_group: "9 to 12 Months",
        milestone_text: "Sits without support."
      },
      {
        age_group: "9 to 12 Months",
        milestone_text: "Pulls self up to stand."
      },
      {
        age_group: "9 to 12 Months",
        milestone_text: "Picks up small objects using thumb and index finger (pincer grasp)."
      },
      {
        age_group: "9 to 12 Months",
        milestone_text: "Imitates sounds."
      },
      {
        age_group: "9 to 12 Months",
        milestone_text: "Pronounces single words with meaning."
      },
      {
        age_group: "9 to 12 Months",
        milestone_text: "Understands simple instructions (e.g., 'Clap hands')."
      },

      // 12 to 18 Months
      {
        age_group: "12 to 18 Months",
        milestone_text: "Walks without assistance."
      },
      {
        age_group: "12 to 18 Months",
        milestone_text: "Says at least 2–3 words (e.g., 'Give,' 'That')."
      },
      {
        age_group: "12 to 18 Months",
        milestone_text: "Points to familiar objects when asked."
      },
      {
        age_group: "12 to 18 Months",
        milestone_text: "Rolls a small ball."
      },
      {
        age_group: "12 to 18 Months",
        milestone_text: "Identifies at least one body part."
      },

      // 18 Months to 2 Years
      {
        age_group: "18 Months to 2 Years",
        milestone_text: "Walks well independently."
      },
      {
        age_group: "18 Months to 2 Years",
        milestone_text: "Climbs stairs with help."
      },
      {
        age_group: "18 Months to 2 Years",
        milestone_text: "Builds a tower of 2–3 blocks."
      },
      {
        age_group: "18 Months to 2 Years",
        milestone_text: "Can feed self."
      },
      {
        age_group: "18 Months to 2 Years",
        milestone_text: "Uses about 10 words; speaks 2-word sentences (e.g., 'Amma come')."
      },
      {
        age_group: "18 Months to 2 Years",
        milestone_text: "Pucks lips to give a kiss."
      },

      // 2 to 3 Years
      {
        age_group: "2 to 3 Years",
        milestone_text: "Runs without falling."
      },
      {
        age_group: "2 to 3 Years",
        milestone_text: "Goes up and down stairs without falling."
      },
      {
        age_group: "2 to 3 Years",
        milestone_text: "Copies a circle or a straight line."
      },
      {
        age_group: "2 to 3 Years",
        milestone_text: "Constructs sentences of 3 or more words."
      },

      // 3 to 4 Years
      {
        age_group: "3 to 4 Years",
        milestone_text: "Stands on one leg."
      },
      {
        age_group: "3 to 4 Years",
        milestone_text: "Jumps from a step."
      },
      {
        age_group: "3 to 4 Years",
        milestone_text: "Puts on clothes/shoes (excluding buttons)."
      },
      {
        age_group: "3 to 4 Years",
        milestone_text: "Copies circles and simple patterns."
      },
      {
        age_group: "3 to 4 Years",
        milestone_text: "Counts up to three."
      },
      {
        age_group: "3 to 4 Years",
        milestone_text: "Knows at least two opposing words (e.g., big-small, up-down)."
      },
      {
        age_group: "3 to 4 Years",
        milestone_text: "Uses complete and complex sentences."
      },

      // 4 to 5 Years
      {
        age_group: "4 to 5 Years",
        milestone_text: "Can hop on one leg."
      },
      {
        age_group: "4 to 5 Years",
        milestone_text: "Dresses independently."
      },
      {
        age_group: "4 to 5 Years",
        milestone_text: "Eats independently."
      },
      {
        age_group: "4 to 5 Years",
        milestone_text: "Draws a simple human figure."
      },
      {
        age_group: "4 to 5 Years",
        milestone_text: "Plays cooperatively with other children."
      },
      {
        age_group: "4 to 5 Years",
        milestone_text: "Describes a picture using correct tenses (past, present, future)."
      },
      {
        age_group: "4 to 5 Years",
        milestone_text: "States full name and age."
      }
    ];


    let added = 0;

    for (const milestone of milestonesData) {
      const development_id = uuidv4();
      
      const milestoneRecord: DevelopmentMilestone = {
        development_id: development_id,
        milestone_name: milestone.milestone_text,
        age_group: milestone.age_group
      };

      await setDoc(doc(milestonesCollection, development_id), milestoneRecord);
      
      
      added++;
    }


  } catch (error) {
    console.error("❌ Error adding milestones:", error);
  }
}

addMilestones();