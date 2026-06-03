import { CurriculumData } from "@/types/curriculum";
import { curriculum as producao } from "./producao";
import { curriculumMecanica as mecanica } from "./mecanica";
import { curriculumCivil as civil } from "./civil";
import { curriculumEletrica as eletrica } from "./eletrica";
import { curriculumAutomacao as automacao } from "./automacao";
import { curriculumSanitaria as sanitaria } from "./sanitaria";
import { curriculumQuimica as quimica } from "./quimica";
import { curriculumMateriais as materiais } from "./materiais";

export const curriculaRegistry: Record<string, CurriculumData> = {
  producao,
  mecanica,
  civil,
  eletrica,
  automacao,
  sanitaria,
  quimica,
  materiais
};

export const getCurriculum = (courseId: string): CurriculumData | undefined => {
  return curriculaRegistry[courseId];
};

export const availableCourses = [
  { id: "producao", name: "Engenharia de Produção", description: "Matriz 2023.1" },
  { id: "mecanica", name: "Engenharia Mecânica", description: "Matriz 2025.1" },
  { id: "civil", name: "Engenharia Civil", description: "Matriz 2020.1" },
  { id: "eletrica", name: "Engenharia Elétrica", description: "Matriz 2005.1" },
  { id: "automacao", name: "Engenharia de Controle e Automação", description: "Matriz 2024.1" },
  { id: "sanitaria", name: "Engenharia Sanitária e Ambiental", description: "Matriz 2015.1" },
  { id: "quimica", name: "Engenharia Química", description: "Matriz 1991.1" },
  { id: "materiais", name: "Engenharia de Materiais", description: "Matriz 2001.1" },
];
