import { CurriculumData, PhaseInfo } from "@/types/curriculum";
import {
  phase1, phase2, phase3, phase4, phase5, phase6, phase7, phase8, phase9, phase10, phase11, phase12, phase13, phase14, phase15, optatives
} from "./phases";

const phases: PhaseInfo[] = [
  { number: 1, name: "1ª Fase" },
  { number: 2, name: "2ª Fase" },
  { number: 3, name: "3ª Fase" },
  { number: 4, name: "4ª Fase" },
  { number: 5, name: "5ª Fase" },
  { number: 6, name: "6ª Fase" },
  { number: 7, name: "7ª Fase" },
  { number: 8, name: "8ª Fase" },
  { number: 9, name: "9ª Fase" },
  { number: 10, name: "10ª Fase" },
  { number: 11, name: "11ª Fase" },
  { number: 12, name: "12ª Fase" },
  { number: 13, name: "13ª Fase" },
  { number: 14, name: "14ª Fase" },
  { number: 15, name: "15ª Fase" },
];

export const curriculumMateriais: CurriculumData = {
  program: "Engenharia de Materiais",
  institution: "Universidade Federal de Santa Catarina",
  version: "Matriz 2001.1",
  totalHours: 4344,
  phases,
  courses: [
    ...phase1, ...phase2, ...phase3, ...phase4, ...phase5, ...phase6, ...phase7, ...phase8, ...phase9, ...phase10, ...phase11, ...phase12, ...phase13, ...phase14, ...phase15,
    ...optatives
  ],
};
