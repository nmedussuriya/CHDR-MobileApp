import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { addScreeningResponse } from "../services/screeningResponsesService";
import { screening_response } from "../types";

async function addSampleScreeningResponses() {

  try {
    // 1. Get a child to link responses to
    const childrenSnapshot = await getDocs(collection(db, "children"));
    const children = childrenSnapshot.docs.map(doc => doc.id);
    
    if (children.length === 0) {
      return;
    }

    const firstChildId = children[0];

    // 2. Get all questions
    const questionsSnapshot = await getDocs(collection(db, "screening_questions"));
    const questions = questionsSnapshot.docs.map(doc => doc.id);

    if (questions.length === 0) {
      return;
    }


    // 3. Generate sample responses
    const today = new Date().toISOString().split('T')[0];
    let responseCount = 0;

    // Sample answers pattern (alternating Yes/No)
    const answers: ("Yes" | "No")[] = ["Yes", "No", "Yes", "Yes", "No", "Yes", "No", "Yes", "Yes", "No"];

    for (let i = 0; i < Math.min(questions.length, 10); i++) {
      const questionId = questions[i];
      const response_id = uuidv4();
      
      const response: screening_response = {
        response_id: response_id,
        answer: answers[i % answers.length],
        date_checked: today,
        question_id: questionId,
        child_id: firstChildId
      };

      await addScreeningResponse(response);
      responseCount++;
      
    }


  } catch (error) {
    console.error("❌ Error adding sample responses:", error);
  }
}

addSampleScreeningResponses();