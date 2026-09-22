import { CurriculumData } from "@/types/curriculum";
import { curriculum as automacao } from "./automacao";
import { curriculum as ciencia_de_dados } from "./ciencia-de-dados";
import { curriculum as ciencias_da_computacao } from "./ciencias-da-computacao";
import { curriculum as civil } from "./civil";
import { curriculum as eletrica } from "./eletrica";
import { curriculum as eletronica } from "./eletronica";
import { curriculum as engenharia_de_alimentos } from "./engenharia-de-alimentos";
import { curriculum as engenharia_de_aquicultura } from "./engenharia-de-aquicultura";
import { curriculum as materiais } from "./materiais";
import { curriculum as mecanica } from "./mecanica";
import { curriculum as producao } from "./producao";
import { curriculum as quimica } from "./quimica";
import { curriculum as sanitaria } from "./sanitaria";
import { curriculum as sistemas_de_informacao } from "./sistemas-de-informacao";

export const curriculaRegistry: Record<string, CurriculumData> = {
  "automacao": automacao,
  "ciencia-de-dados": ciencia_de_dados,
  "ciencias-da-computacao": ciencias_da_computacao,
  "civil": civil,
  "eletrica": eletrica,
  "eletronica": eletronica,
  "engenharia-de-alimentos": engenharia_de_alimentos,
  "engenharia-de-aquicultura": engenharia_de_aquicultura,
  "materiais": materiais,
  "mecanica": mecanica,
  "producao": producao,
  "quimica": quimica,
  "sanitaria": sanitaria,
  "sistemas-de-informacao": sistemas_de_informacao,
};

export const getCurriculum = (courseId: string): CurriculumData | undefined => {
  return curriculaRegistry[courseId];
};

export interface AvailableCourseItem {
  id: string;
  name: string;
  description: string;
  campus: string;
}

export const availableCourses: AvailableCourseItem[] = [
  { id: "automacao", name: "Engenharia de Controle e Automação", description: "Matriz 2024.1", campus: "Florianópolis" },
  { id: "ciencia-de-dados", name: "Ciência de Dados", description: "Matriz 2026.1", campus: "Florianópolis" },
  { id: "ciencias-da-computacao", name: "Ciências da Computação", description: "Matriz 2007.1", campus: "Florianópolis" },
  { id: "civil", name: "Engenharia Civil", description: "Matriz 2020.1", campus: "Florianópolis" },
  { id: "eletrica", name: "Engenharia Elétrica", description: "Matriz 2005.1", campus: "Florianópolis" },
  { id: "eletronica", name: "Engenharia Eletrônica", description: "Matriz 2009.2", campus: "Florianópolis" },
  { id: "engenharia-de-alimentos", name: "Engenharia de Alimentos", description: "Matriz 1991.1", campus: "Florianópolis" },
  { id: "engenharia-de-aquicultura", name: "Engenharia de Aquicultura", description: "Matriz 2024.1", campus: "Florianópolis" },
  { id: "materiais", name: "Engenharia de Materiais", description: "Matriz 2001.1", campus: "Florianópolis" },
  { id: "mecanica", name: "Engenharia Mecânica", description: "Matriz 2025.1", campus: "Florianópolis" },
  { id: "producao", name: "Engenharia de Produção", description: "Matriz 2023.1", campus: "Florianópolis" },
  { id: "quimica", name: "Engenharia Quimica", description: "Matriz 1991.1", campus: "Florianópolis" },
  { id: "sanitaria", name: "Engenharia Sanitária e Ambiental", description: "Matriz 2015.1", campus: "Florianópolis" },
  { id: "sistemas-de-informacao", name: "Sistemas de Informação", description: "Matriz 2011.1", campus: "Florianópolis" },
];
