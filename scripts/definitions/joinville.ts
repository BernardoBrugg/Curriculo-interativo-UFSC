import { catalogueSource, idsByType, manualSource, requirement, without, CurriculumDefinition } from "./types";

export const joinvilleDefinitions: Record<string, CurriculumDefinition> = {
  "ciencia-e-tecnologia": {
    program: "Ciência e Tecnologia",
    version: "Matriz 2025.1",
    totalHours: 2880,
    completion: (_text, courses) => {
      const nonElectives = ["EMB5000", "EMB5122"];
      const opCourses = without(idsByType(courses, "Op"), nonElectives);
      return {
        requiredCourseIds: idsByType(courses, "Ob"),
        requirements: [
          requirement("electives", "Disciplinas optativas", 576, [
            catalogueSource("electives-catalogue", opCourses),
            manualSource("free-electives", 576),
          ]),
          requirement("complementary", "Atividades complementares", 288, [
            catalogueSource("complementary-course", ["EMB5000"]),
            manualSource("complementary-manual", 288),
          ]),
          requirement("extension", "Atividades de extensão", 72, [
            catalogueSource("extension-course", ["EMB5122"]),
            manualSource("extension-manual", 72),
          ]),
        ],
      };
    },
  },
  "engenharia-aeroespacial": {
    program: "Engenharia Aeroespacial",
    version: "Matriz 2025.1",
    totalHours: 4770,
    completion: (_text, courses) => {
      const nonElectives = ["EMB5046", "EMB5443", "EMB5444", "EMB5441", "EMB5445", "EMB5446", "EMB5447", "EMB9000"];
      const opCourses = without(idsByType(courses, "Op"), nonElectives);
      return {
        requiredCourseIds: idsByType(courses, "Ob"),
        requirements: [
          requirement("internship", "Estágio curricular obrigatório", 396, [
            catalogueSource("internship-courses", ["EMB5046", "EMB5443", "EMB5444"], 396),
          ]),
          requirement("electives", "Disciplinas optativas", 180, [
            catalogueSource("electives-catalogue", opCourses),
            manualSource("free-electives", 180),
          ]),
          requirement("complementary", "Atividades complementares", 108, [
            catalogueSource("complementary-course", ["EMB5441"]),
            manualSource("complementary-manual", 108),
          ]),
          requirement("extension", "Atividades de extensão", 252, [
            catalogueSource("extension-courses", ["EMB5445", "EMB5446", "EMB5447", "EMB9000"], 252),
            manualSource("extension-manual", 252),
          ]),
        ],
      };
    },
  },
  "engenharia-automotiva": {
    program: "Engenharia Automotiva",
    version: "Matriz 2025.1",
    totalHours: 4410,
    completion: (_text, courses) => ({
      requiredCourseIds: idsByType(courses, "Ob"),
      requirements: [
        requirement("electives", "Disciplinas optativas", 90, [
          catalogueSource("electives-catalogue", idsByType(courses, "Op")),
          manualSource("free-electives", 90),
        ]),
      ],
    }),
  },
};
