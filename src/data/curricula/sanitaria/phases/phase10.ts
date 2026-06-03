import { Course } from "@/types/curriculum";

export const phase10: Course[] = [
  {
    id: "ENS5502",
    code: "ENS5502",
    name: "Estágio Supervisionado em Engenharia",
    credits: 20,
    hours: 360,
    phase: 10,
    type: "Ob" as const,
    prerequisites: [],
    equivalents: [],
    syllabus: "",
  },
  {
    id: "ENS7053",
    code: "ENS7053",
    name: "Trabalho de Conclusão de Curso de",
    credits: 4,
    hours: 72,
    phase: 10,
    type: "Ob" as const,
    prerequisites: [],
    equivalents: [],
    syllabus: "",
  },
];
