export type SectionType = {
  title: string;
  questions: string[];
};

export const milestoneHearingSections: SectionType[] = [
  {
    title: "From the first month after birth",
    questions: [
      "When you hear a sudden loud noise (like clapping, a door slamming shut), does your child startle and blink? Or does he/she widen his/her eyes?",
    ],
  },
  {
    title: "By one month",
    questions: [
      "Start to recognize sudden or persistent sounds (such as the sound of a vehicle) and respond to them quietly and attentively.",
    ],
  },
  {
    title: "By 4 months",
    questions: [
      "Even if their mother is not in sight to care for them, do they remain silent when they hear their voices?",
      "Does your child turn their head or eyes in that direction when they hear their mother, either from behind or in front of them?",
    ],
  },
  {
    title: "At 7 months",
    questions: [
      "Does the child turn to the mother/caregiver immediately after speaking?",
    ],
  },
  {
    title: "By 9 months",
    questions: [
      "Do you listen attentively to familiar sounds you hear every day?",
      "Do you look for sounds that are made from places you can't see?",
      "Do you like it when you speak loudly and in a rhythm?",
    ],
  },
  {
    title: "By 12 months",
    questions: [
      "Does he respond to his name and other familiar sounds?",
      'Do you respond to words like "no" or "tata" without taking the corresponding action?',
      "If you have any doubts about your child's hearing or cannot answer yes to any of the above questions, contact your local Family Health Service Officer/Health Medical Officer/other doctor.",
    ],
  },
];