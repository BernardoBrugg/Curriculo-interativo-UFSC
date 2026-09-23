import { catalogueSource, idsByType, manualSource, requirement, without, CurriculumDefinition } from "./types";

export const araranguaDefinitions: Record<string, CurriculumDefinition> = {
  fisioterapia: {
    program: "Fisioterapia",
    version: "Matriz 2011.1",
    totalHours: 4824,
    completion: (_text, courses) => {
      const nonElectives = ["DFT2100"];
      const opCourses = without(idsByType(courses, "Op"), nonElectives);
      return {
        requiredCourseIds: idsByType(courses, "Ob"),
        requirements: [
          requirement("electives", "Disciplinas optativas", 234, [
            catalogueSource("electives-catalogue", opCourses),
            manualSource("free-electives", 180),
          ]),
          requirement("complementary", "Atividades complementares", 162, [
            catalogueSource("complementary-course", ["DFT2100"]),
            manualSource("complementary-manual", 162),
          ]),
        ],
      };
    },
  },
  medicina: {
    program: "Medicina",
    version: "Matriz 2025.1",
    includeTypes: ["Ob", "Op", "Es"],
    totalHours: 9144,
    completion: (_text, courses) => {
      const nonElectives = ["DCM1000"];
      const opCourses = without(idsByType(courses, "Op"), nonElectives);
      return {
        requiredCourseIds: idsByType(courses, "Ob"),
        requirements: [
          requirement("electives", "Disciplinas optativas", 72, [
            catalogueSource("electives-catalogue", opCourses),
            manualSource("free-electives", 72),
          ]),
          requirement("complementary", "Atividades complementares", 162, [
            catalogueSource("complementary-course", ["DCM1000"]),
            manualSource("complementary-manual", 162),
          ]),
        ],
      };
    },
  },
};
