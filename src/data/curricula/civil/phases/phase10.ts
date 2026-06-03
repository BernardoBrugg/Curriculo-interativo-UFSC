import { Course } from "@/types/curriculum";

export const phase10: Course[] = [
  {
    id: "ECV2000",
    code: "ECV2000",
    name: "Estágio Profissionalizante Supervisionado",
    credits: 30,
    hours: 540,
    phase: 10,
    type: "Ob" as const,
    prerequisites: [],
    equivalents: [],
    syllabus: "",
  },
  {
    id: "ECV2002",
    code: "ECV2002",
    name: "TCC: Projeto Integrado II",
    credits: 4,
    hours: 72,
    phase: 10,
    type: "Ob" as const,
    prerequisites: [],
    equivalents: [],
    syllabus: "",
  },
];
