import { Course } from "@/types/curriculum";

export const phase5: Course[] = [
  {
    id: "EMC5551",
    code: "EMC5551",
    name: "Estágio Supervisionado 1",
    credits: 20,
    hours: 360,
    phase: 5,
    type: "Ob" as const,
    prerequisites: [],
    equivalents: [],
    syllabus: "",
  },
];
