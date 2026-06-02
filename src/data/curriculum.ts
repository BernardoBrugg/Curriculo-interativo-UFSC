import { CurriculumData, PhaseInfo } from "@/types/curriculum";
import {
  phase1, phase2, phase3, phase4, phase5,
  phase6, phase7, phase8, phase9, phase10,
  optativesGOP,
} from "./phases";

const phases: PhaseInfo[] = [
  { number: 1, name: "Fundamentos" },
  { number: 2, name: "Base Científica" },
  { number: 3, name: "Ciências Aplicadas" },
  { number: 4, name: "Engenharia Básica" },
  { number: 5, name: "Engenharia de Produção I" },
  { number: 6, name: "Engenharia de Produção II" },
  { number: 7, name: "Engenharia de Produção III" },
  { number: 8, name: "Integração" },
  { number: 9, name: "Especialização" },
  { number: 10, name: "Conclusão" },
];

export const curriculum: CurriculumData = {
  program: "Engenharia de Produção",
  institution: "Universidade Federal de Santa Catarina",
  version: "2023.1",
  totalHours: 4320,
  phases,
  courses: [
    ...phase1, ...phase2, ...phase3, ...phase4, ...phase5,
    ...phase6, ...phase7, ...phase8, ...phase9, ...phase10,
    ...optativesGOP,
  ],
};
