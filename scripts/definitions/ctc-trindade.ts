import { catalogueSource, courseIdsBetween, CurriculumDefinition, idsByType, known, manualSource, requirement, without } from "./types";

export const ctcDefinitions: Record<string, CurriculumDefinition> = {
  automacao: {
    program: "Engenharia de Controle e Automação",
    version: "Matriz 2024.1",
    totalHours: 4464,
    completion: (text, courses) => {
      const free = [
        ...known(courseIdsBetween(text, "Rol de Disciplinas Optativas Livres", "Rol de Atividades Complementares"), courses),
        ...known(courseIdsBetween(text, "Rol de Atividades Complementares", "Rol de Ações de Extensão"), courses),
      ];
      const professional = without(known(courseIdsBetween(text, "Rol de Disciplinas Optativas Profissionalizantes", "Rol de Disciplinas Optativas Livres"), courses), free);
      return {
        requiredCourseIds: idsByType(courses, "Ob"),
        requirements: [
          requirement("professional-electives", "Optativas profissionalizantes", 432, [catalogueSource("professional-electives-catalogue", professional)]),
          requirement("free-electives", "Optativas livres ou atividades complementares", 36, [catalogueSource("free-electives-catalogue", free), manualSource("free-electives-external", 36)]),
        ],
      };
    },
  },
  civil: {
    program: "Engenharia Civil",
    version: "Matriz 2020.1",
    totalHours: 4518,
    completion: (text, courses) => {
      const complementary = known(courseIdsBetween(text, "Atividades Complementares", "Disciplinas Optativas"), courses);
      const electives = without(idsByType(courses, "Op"), complementary);
      return {
        requiredCourseIds: idsByType(courses, "Ob"),
        requirements: [requirement("electives", "Disciplinas optativas e atividades complementares", 432, [catalogueSource("electives-catalogue", electives), catalogueSource("complementary-activities", complementary, 54)])],
      };
    },
  },
  eletrica: {
    program: "Engenharia Elétrica",
    version: "Matriz 2005.1",
    totalHours: 4446,
    completion: (text, courses) => {
      const project = courses.filter((course) => course.type === "Ob" && course.phase === 0 && course.name.startsWith("Projeto")).map((course) => course.id);
      const internship = ["EEL7830", "EEL7871", "EEL7872"];
      const area = known(courseIdsBetween(text, "Optativas da Área de Especialização em Sistemas de Energia", "Atividades Complementares"), courses).filter((id) => courses.find((course) => course.id === id)?.type === "Op");
      const complementary = known(courseIdsBetween(text, "Atividades Complementares"), courses).filter((id) => courses.find((course) => course.id === id)?.type === "Op");
      const remaining = without(idsByType(courses, "Op"), [...area, ...complementary]);
      return {
        requiredCourseIds: without(idsByType(courses, "Ob"), [...project, ...internship]),
        requirements: [
          requirement("graduation-project", "Projeto de conclusão de curso", 216, [catalogueSource("graduation-project-options", project, 216)]),
          requirement("internship", "Estágio curricular", 360, [catalogueSource("internship-options", internship, 360)]),
          requirement("electives", "Disciplinas optativas", 432, [catalogueSource("professional-area-electives", area), catalogueSource("other-electives", remaining, 144), catalogueSource("complementary-activities", complementary, 144), manualSource("external-free-electives", 144)]),
        ],
      };
    },
  },
  eletronica: {
    program: "Engenharia Eletrônica",
    version: "Matriz 2009.2",
    totalHours: 4644,
    completion: (text, courses) => {
      const internship = ["EEL7901", "EEL7902", "EEL7903"];
      const professional = known(courseIdsBetween(text, "Optativas Profissionalizantes - Sistemas Eletrônicos", "Optativas Gerais"), courses);
      const general = without(known(courseIdsBetween(text, "Optativas Gerais", "Estágio Curricular"), courses), internship);
      const complementary = known(courseIdsBetween(text, "ATIVIDADES COMPLEMENTARES", "5ª Fase"), courses);
      return {
        requiredCourseIds: idsByType(courses, "Ob"),
        requirements: [
          requirement("internship", "Estágio curricular", 360, [catalogueSource("internship-options", internship, 360)]),
          requirement("electives", "Disciplinas optativas", 720, [
            catalogueSource("professional-electives", professional),
            catalogueSource("general-electives", [...general, ...complementary], 144),
            manualSource("external-free-electives", 144),
          ]),
          requirement("mandatory-hours-adjustment", "Carga obrigatória adicional da Portaria nº 148/2025/PROGRAD", 144, [manualSource("mandatory-hours-adjustment", 144, "Horas obrigatórias adicionais concluídas")]),
        ],
      };
    },
  },
  materiais: {
    program: "Engenharia de Materiais",
    version: "Matriz 2001.1",
    totalHours: 4344,
    completion: (_text, courses) => ({
      requiredCourseIds: without(idsByType(courses, "Ob"), ["EMC5728"]),
      requirements: [requirement("electives", "Disciplinas optativas", 198, [catalogueSource("electives-catalogue", idsByType(courses, "Op")), manualSource("external-electives", 54)])],
    }),
  },
  mecanica: {
    program: "Engenharia Mecânica",
    version: "Matriz 2025.1",
    totalHours: 4608,
    completion: (text, courses) => {
      const special = known([
        ...courseIdsBetween(text, "Rol de Disciplinas Optativas do Bloco Especial", "Rol de Disciplinas Optativas de Pós-Graduação"),
        ...courseIdsBetween(text, "Rol de Atividades Complementares", "Rol de Ações de Extensão"),
      ], courses);
      const electives = without(idsByType(courses, "Op"), ["EMC7000", ...special]);
      return {
        requiredCourseIds: [...idsByType(courses, "Ob"), "EMC7000"],
        requirements: [requirement("electives", "Disciplinas optativas", 288, [catalogueSource("electives-catalogue", electives), catalogueSource("special-topics-and-activities", special, 72)])],
      };
    },
  },
  producao: {
    program: "Engenharia de Produção",
    version: "Matriz 2023.1",
    totalHours: 4320,
    completion: (text, courses) => {
      const area = known(courseIdsBetween(text, "Disciplinas Optativas da Área de Engenharia de Produção", "Disciplinas Optativas Gerais"), courses);
      const free = without(idsByType(courses, "Op"), area);
      const extension = courses.filter((course) => course.type === "Op" && (course.extensionHours ?? 0) > 0).map((course) => course.id);
      return {
        requiredCourseIds: idsByType(courses, "Ob"),
        requirements: [
          requirement("electives", "Disciplinas optativas", 378, [catalogueSource("production-area-electives", area, undefined, "nonExtension"), catalogueSource("free-electives", free, 54, "nonExtension"), manualSource("external-free-electives", 54)]),
          requirement("extension", "Extensão optativa ou ações de extensão", 54, [catalogueSource("optional-extension-hours", extension, 54, "extension")]),
        ],
      };
    },
  },
  quimica: {
    program: "Engenharia Química",
    version: "Matriz 1991.1",
    totalHours: 4374,
    completion: (_text, courses) => ({
      requiredCourseIds: idsByType(courses, "Ob"),
      requirements: [requirement("electives", "Disciplinas optativas", 216, [catalogueSource("electives-catalogue", idsByType(courses, "Op")), manualSource("free-electives", 54)])],
    }),
  },
  sanitaria: {
    program: "Engenharia Sanitária e Ambiental",
    version: "Matriz 2015.1",
    totalHours: 4518,
    completion: (_text, courses) => ({
      requiredCourseIds: idsByType(courses, "Ob"),
      requirements: [requirement("electives", "Disciplinas optativas", 162, [catalogueSource("recommended-electives", idsByType(courses, "Op")), manualSource("free-electives", 54)])],
    }),
  },
  "ciencias-da-computacao": {
    program: "Ciências da Computação",
    version: "Matriz 2007.1",
    totalHours: 3840,
    completion: (_text, courses) => ({
      requiredCourseIds: idsByType(courses, "Ob"),
      requirements: [
        requirement("electives", "Disciplinas optativas e complementares", 636, [
          catalogueSource("electives-catalogue", idsByType(courses, "Op"), 636),
          manualSource("extracurricular-and-complementary", 348, "Atividades complementares ou extracurriculares"),
        ]),
      ],
    }),
  },
  "sistemas-de-informacao": {
    program: "Sistemas de Informação",
    version: "Matriz 2011.1",
    totalHours: 3600,
    completion: (_text, courses) => {
      const nonMandatory = ["INE5639", "INE5673", "INE5674", "INE5675", "INE5676", "INE5677"];
      return {
        requiredCourseIds: without(idsByType(courses, "Ob"), nonMandatory),
        requirements: [
          requirement("electives", "Disciplinas optativas", 288, [
            catalogueSource("electives-catalogue", [...idsByType(courses, "Op"), "INE5639"]),
            manualSource("free-electives", 72),
          ]),
          requirement("complementary-activities", "Atividades complementares", 360, [
            manualSource("complementary-activities-hours", 360, "Horas de atividades complementares concluídas"),
          ]),
        ],
      };
    },
  },
  "engenharia-de-alimentos": {
    program: "Engenharia de Alimentos",
    version: "Matriz 1991.1",
    totalHours: 4368,
    completion: (_text, courses) => ({
      requiredCourseIds: without(idsByType(courses, "Ob"), ["GMT5617", "QMC5406"]),
      requirements: [
        requirement("electives", "Disciplinas optativas", 108, [
          catalogueSource("electives-catalogue", idsByType(courses, "Op")),
          manualSource("free-electives", 54),
        ]),
      ],
    }),
  },
  "ciencia-de-dados": {
    program: "Ciência de Dados",
    version: "Matriz 2026.1",
    totalHours: 2520,
    completion: (_text, courses) => ({
      requiredCourseIds: idsByType(courses, "Ob"),
      requirements: [
        requirement("electives", "Disciplinas optativas e complementares", 540, [
          catalogueSource("electives-catalogue", idsByType(courses, "Op")),
          manualSource("external-electives", 180),
        ]),
      ],
    }),
  },
  "engenharia-de-aquicultura": {
    program: "Engenharia de Aquicultura",
    version: "Matriz 2024.1",
    totalHours: 4410,
    completion: (_text, courses) => ({
      requiredCourseIds: idsByType(courses, "Ob"),
      requirements: [
        requirement("electives", "Disciplinas optativas e complementares", 342, [
          catalogueSource("electives-catalogue", idsByType(courses, "Op")),
          manualSource("external-electives", 180),
        ]),
      ],
    }),
  },
};
