import { Course } from "@/types/curriculum";

export const phase9: Course[] = [
  {
    id: "EPS2390",
    code: "EPS2390",
    name: "Sistemas de Produção Enxutos",
    credits: 3,
    hours: 54,
    phase: 9,
    type: "Ob",
    prerequisites: ["EPS2370", "EPS2372"],
    equivalents: [],
    extensionHours: 18,
    syllabus: "Introdução e conceitos. Cultura e Estratégia enxuta. Manufatura enxuta. Logística enxuta. Outras abordagens enxutas.",
  },
  {
    id: "EPS2391",
    code: "EPS2391",
    name: "Projeto Final de Curso II",
    credits: 3,
    hours: 54,
    phase: 9,
    type: "Ob",
    prerequisites: ["EPS2384"],
    equivalents: [],
    syllabus: "Aplicação prática dos tópicos estudados na forma de projetos técnicos e/ou científicos ao nível dos atribuídos a um engenheiro.",
  },
];

export const phase10: Course[] = [
  {
    id: "EPS2310",
    code: "EPS2310",
    name: "Estágio Supervisionado em Engenharia de Produção",
    credits: 12,
    hours: 216,
    phase: 10,
    type: "Ob",
    prerequisites: [],
    equivalents: [],
    syllabus: "Estágio supervisionado obrigatório em Engenharia de Produção.",
  },
];
