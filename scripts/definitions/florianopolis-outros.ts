import { catalogueSource, CurriculumDefinition, idsByType, manualSource, requirement, without } from "./types";

export const florianopolisOutrosDefinitions: Record<string, CurriculumDefinition> = {
  enfermagem: {
    program: "Enfermagem",
    version: "Matriz 2022.1",
    totalHours: 4980,
    completion: (_text, courses) => ({
      requiredCourseIds: idsByType(courses, "Ob"),
      requirements: [
        requirement("electives", "Disciplinas optativas", 72, [
          catalogueSource("electives-catalogue", idsByType(courses, "Op")),
          manualSource("free-electives", 72),
        ]),
        requirement("complementary-activities", "Atividades complementares", 120, [
          manualSource("complementary-activities-hours", 120, "Horas de atividades complementares concluídas"),
        ]),
      ],
    }),
  },
  "medicina-florianopolis": {
    program: "Medicina",
    version: "Matriz 2024.1",
    totalHours: 9204,
    completion: (_text, courses) => ({
      requiredCourseIds: idsByType(courses, "Ob"),
      requirements: [],
    }),
  },
  "ciencias-biologicas": {
    program: "Ciências Biológicas",
    version: "Matriz 2006.1",
    totalHours: 4806,
    completion: (_text, courses) => {
      const nonMandatory = ["MTM3100", "BIO7031", "BIO7033", "BIO7034", "BIO7035"];
      return {
        requiredCourseIds: without(idsByType(courses, "Ob"), nonMandatory),
        requirements: [
          requirement("electives", "Disciplinas optativas", 360, [
            catalogueSource("electives-catalogue", idsByType(courses, "Op")),
            manualSource("free-electives", 72),
          ]),
        ],
      };
    },
  },
  "ciencias-contabeis": {
    program: "Ciências Contábeis",
    version: "Matriz 2019.1",
    totalHours: 3624,
    completion: (_text, courses) => ({
      requiredCourseIds: idsByType(courses, "Ob"),
      requirements: [
        requirement("electives", "Disciplinas optativas", 360, [
          catalogueSource("electives-catalogue", idsByType(courses, "Op")),
          manualSource("free-electives", 144),
        ]),
      ],
    }),
  },
  "ciencias-economicas": {
    program: "Ciências Econômicas",
    version: "Matriz 2019.1",
    totalHours: 3600,
    completion: (_text, courses) => ({
      requiredCourseIds: idsByType(courses, "Ob"),
      requirements: [
        requirement("electives", "Disciplinas optativas", 576, [
          catalogueSource("electives-catalogue", idsByType(courses, "Op")),
          manualSource("free-electives", 96),
        ]),
        requirement("complementary-activities", "Atividades acadêmico-científico-culturais", 576, [
          manualSource("complementary-activities-hours", 576, "Horas de atividades complementares concluídas"),
        ]),
      ],
    }),
  },
  "relacoes-internacionais": {
    program: "Relações Internacionais",
    version: "Matriz 2009.1",
    totalHours: 3000,
    completion: (_text, courses) => ({
      requiredCourseIds: idsByType(courses, "Ob"),
      requirements: [
        requirement("electives", "Disciplinas optativas", 480, [
          catalogueSource("electives-catalogue", idsByType(courses, "Op")),
          manualSource("free-electives", 72),
        ]),
        requirement("complementary-activities", "Atividades técnico-científicas e culturais", 594, [
          manualSource("complementary-activities-hours", 594, "Horas de atividades complementares concluídas"),
        ]),
      ],
    }),
  },
};
