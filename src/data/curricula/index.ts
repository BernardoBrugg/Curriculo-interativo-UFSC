import { CurriculumData } from "@/types/curriculum";
import { curriculum as producao } from "./producao";
import { curriculum as mecanica } from "./mecanica";
import { curriculum as civil } from "./civil";
import { curriculum as eletrica } from "./eletrica";
import { curriculum as automacao } from "./automacao";
import { curriculum as sanitaria } from "./sanitaria";
import { curriculum as quimica } from "./quimica";
import { curriculum as materiais } from "./materiais";
import { curriculum as eletronica } from "./eletronica";

export const curriculaRegistry: Record<string, CurriculumData> = {
  producao,
  mecanica,
  civil,
  eletrica,
  automacao,
  sanitaria,
  quimica,
  materiais,
  eletronica,
};

export const getCurriculum = (courseId: string): CurriculumData | undefined => {
  return curriculaRegistry[courseId];
};

export const availableCourses = [
  { id: "producao", name: "Engenharia de Produção", description: "Matriz 2023.1", campus: "Florianópolis" },
  { id: "mecanica", name: "Engenharia Mecânica", description: "Matriz 2025.1", campus: "Florianópolis" },
  { id: "civil", name: "Engenharia Civil", description: "Matriz 2020.1", campus: "Florianópolis" },
  { id: "eletrica", name: "Engenharia Elétrica", description: "Matriz 2005.1", campus: "Florianópolis" },
  { id: "eletronica", name: "Engenharia Eletrônica", description: "Matriz 2009.2", campus: "Florianópolis" },
  { id: "automacao", name: "Engenharia de Controle e Automação", description: "Matriz 2024.1", campus: "Florianópolis" },
  { id: "sanitaria", name: "Engenharia Sanitária e Ambiental", description: "Matriz 2015.1", campus: "Florianópolis" },
  { id: "quimica", name: "Engenharia Química", description: "Matriz 1991.1", campus: "Florianópolis" },
  { id: "materiais", name: "Engenharia de Materiais", description: "Matriz 2001.1", campus: "Florianópolis" },
];
