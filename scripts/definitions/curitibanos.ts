import { catalogueSource, idsByType, manualSource, requirement, without, CurriculumDefinition } from "./types";

export const curitibanosDefinitions: Record<string, CurriculumDefinition> = {
  agronomia: {
    program: "Agronomia",
    version: "Matriz 2021.2",
    totalHours: 4464,
    excludeCourses: [
      "ABF7139",
      "ABF7126",
      "ABF7128",
      "BSU7818",
      "CBA7124",
      "ABF7418",
      "CBA7131",
      "CNS8014",
      "CNS8015",
      "CNS8016",
    ],
    completion: (_text, courses) => ({
      requiredCourseIds: idsByType(courses, "Ob"),
      requirements: [],
    }),
  },
  "medicina-curitibanos": {
    program: "Medicina",
    version: "Matriz 2025.1",
    totalHours: 8676,
    completion: (_text, courses) => {
      const nonElectives = ["BSU7908", "BSU7909"];
      const opCourses = without(idsByType(courses, "Op"), nonElectives);
      return {
        requiredCourseIds: idsByType(courses, "Ob"),
        requirements: [
          requirement("electives", "Disciplinas optativas", 72, [
            catalogueSource("electives-catalogue", opCourses),
            manualSource("free-electives", 72),
          ]),
          requirement("complementary", "Atividades complementares", 108, [
            catalogueSource("complementary-course", ["BSU7908"]),
            manualSource("complementary-manual", 108),
          ]),
          requirement("extension", "Atividades de extensão", 72, [
            catalogueSource("extension-course", ["BSU7909"]),
            manualSource("extension-manual", 72),
          ]),
        ],
      };
    },
  },
};
