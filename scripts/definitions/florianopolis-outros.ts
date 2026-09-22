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
};
