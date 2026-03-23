export type SectionType = {
  title: string;
  questions: string[];
};

export const milestoneVisionSections: SectionType[] = [
  {
    title: "From the first month after birth",
    questions: [
      "Does the baby turn his eyes towards the light?",
      "Does the baby look at your face carefully?",
    ],
  },
  {
    title: "By two months",
    questions: [
      "Does your baby smile in response when you turn his face side to side?",
      "Do both of the baby's eyes move together?",
    ],
  },
  {
    title: "By 6 months",
    questions: [
      "Is the child looking around attentively?",
      "Does the child reach out and try to touch something?",
      "Do you suspect that your child has a disability?",
    ],
  },
  {
    title: "At 10 months",
    questions: [
      "Is the child able to pick up small objects using thumb and index finger?",
      "Does your child ask for various things?",
      "When they see people crying, do they cry?",
    ],
  },
];