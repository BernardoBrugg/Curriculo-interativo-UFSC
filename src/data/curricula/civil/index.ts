import { CurriculumData, PhaseInfo } from "@/types/curriculum";
import {
  phase1, phase2, phase3, phase4, phase5, phase6, phase7, phase8, phase9, phase10, optatives
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
];

export const curriculumCivil: CurriculumData = {
  program: "Engenharia Civil",
  institution: "Universidade Federal de Santa Catarina",
  version: "Matriz 2020.1",
  totalHours: 4518,
  phases,
  courses: [
    ...phase1, ...phase2, ...phase3, ...phase4, ...phase5, ...phase6, ...phase7, ...phase8, ...phase9, ...phase10,
    ...optatives
  ],
};
