import { db } from "../firebaseConfig.ts";
import { collection, doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export interface screening_question{
    question_id:string;
    question_text:string;
    type_id:string;
}

const screeningQuestionsCollection = collection(db, "screening_questions");

async function addScreeningQuestions() {

  try {
    // Vision Milestone Questions (type_id: "t1")
    const visionQuestions = [
      {
        age_group: "From 1st Month",
        question_text: "Does the child direct their eyes toward a light source?"
      },
      {
        age_group: "From 1st Month",
        question_text: "Does the child look at your face well?"
      },
      {
        age_group: "By 2 Months",
        question_text: "Does the child respond with a smile when you look at them and smile while moving your face side to side?"
      },
      {
        age_group: "By 2 Months",
        question_text: "Do both eyes move together?"
      },
      {
        age_group: "By 6 Months",
        question_text: "Does the child look around curiously?"
      },
      {
        age_group: "By 6 Months",
        question_text: "Does the child reach out and try to grab small objects?"
      },
      {
        age_group: "By 6 Months",
        question_text: "Do you suspect the child has a squint (crossed eyes)?"
      },
      {
        age_group: "At 10 Months",
        question_text: "Can the child pick up small objects using the thumb and index finger?"
      },
      {
        age_group: "By 12 Months",
        question_text: "Does the child point at various things and ask for them?"
      },
      {
        age_group: "By 12 Months",
        question_text: "Does the child recognize familiar people before they even speak?"
      }
    ];

    // Hearing Milestone Questions (type_id: "t2")
    const hearingQuestions = [
      {
        age_group: "Shortly after birth",
        question_text: "Does your child startle, blink, or open eyes wide when hearing a sudden loud noise (e.g., clapping, door slamming)?"
      },
      {
        age_group: "By 1 Month",
        question_text: "Does the child start to listen/pay attention to sudden or continuous sounds (e.g., vehicle horn) and stop crying to listen?"
      },
      {
        age_group: "From 4 Months",
        question_text: "Does the child quiet down or smile when hearing the mother's or caregiver's voice even without seeing them?"
      },
      {
        age_group: "From 4 Months",
        question_text: "Does the child turn their eyes or head toward the mother/caregiver when they speak from the side or behind?"
      },
      {
        age_group: "From 7 Months",
        question_text: "Does the child immediately turn toward the mother/caregiver when spoken to?"
      },
      {
        age_group: "By 9 Months",
        question_text: "Does the child listen carefully to familiar daily sounds?"
      },
      {
        age_group: "By 9 Months",
        question_text: "Does the child look for the source of a sound from a place where the mother cannot be seen?"
      },
      {
        age_group: "By 9 Months",
        question_text: "Does the child enjoy it when you speak to them in a rhythmic or melodic tone?"
      },
      {
        age_group: "By 12 Months",
        question_text: "Does the child respond to their name and other familiar sounds?"
      },
      {
        age_group: "By 12 Months",
        question_text: "Does the child respond to words like 'No,' 'Tata' (Goodbye) even without hand gestures?"
      }
    ];


    // Add Vision Questions
    for (let i = 0; i < visionQuestions.length; i++) {
      const q = visionQuestions[i];
      const question_id = `vq${String(i + 1).padStart(2, '0')}`; // vq01, vq02, etc.
      
      const question: screening_question = {
        question_id: question_id,
        question_text: q.question_text,
        type_id: "t1" // Vision Milestone
      };

      await setDoc(doc(screeningQuestionsCollection, question_id), question);
      
    }

    // Add Hearing Questions
    for (let i = 0; i < hearingQuestions.length; i++) {
      const q = hearingQuestions[i];
      const question_id = `hq${String(i + 1).padStart(2, '0')}`; // hq01, hq02, etc.
      
      const question: screening_question = {
        question_id: question_id,
        question_text: q.question_text,
        type_id: "t2" // Hearing Milestone
      };

      await setDoc(doc(screeningQuestionsCollection, question_id), question);
      
    }


  } catch (error) {
    console.error(" Error adding screening questions:", error);
  }
}

addScreeningQuestions();