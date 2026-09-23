import { catalogueSource, idsByType, manualSource, requirement, without, CurriculumDefinition } from "./types";

export const blumenauDefinitions: Record<string, CurriculumDefinition> = {
  "engenharia-de-materiais": {
    program: "Engenharia de Materiais",
    version: "Matriz 2023.1",
    totalHours: 4320,
    completion: (_text, courses) => {
      const nonElectives = ["EMT3003", "EMT3004"];
      const opCourses = without(idsByType(courses, "Op"), nonElectives);
      return {
        requiredCourseIds: idsByType(courses, "Ob"),
        requirements: [
          requirement("electives", "Disciplinas optativas", 144, [
            catalogueSource("electives-catalogue", opCourses),
            manualSource("free-electives", 144),
          ]),
          requirement("complementary", "Atividades complementares", 90, [
            catalogueSource("complementary-course", ["EMT3003"]),
            manualSource("complementary-manual", 90),
          ]),
          requirement("extension", "Atividades de extensão", 126, [
            catalogueSource("extension-courses", ["EMT3004"], 126),
            manualSource("extension-manual", 126),
          ]),
        ],
      };
    },
  },
};
