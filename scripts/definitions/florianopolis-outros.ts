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
  "agronomia-florianopolis": {
    program: "Agronomia",
    version: "Matriz 2025.1",
    totalHours: 4788,
    completion: (_text, courses) => ({
      requiredCourseIds: idsByType(courses, "Ob"),
      requirements: [
        requirement("electives", "Disciplinas optativas", 450, [
          catalogueSource("electives-catalogue", idsByType(courses, "Op")),
          manualSource("free-electives", 180),
        ]),
        requirement("complementary-extension", "Atividades complementares e extensão", 180, [
          manualSource("complementary-hours", 180, "Horas de atividades complementares e extensão"),
        ]),
      ],
    }),
  },
  "arquitetura-e-urbanismo": {
    program: "Arquitetura e Urbanismo",
    version: "Matriz 2026.1",
    totalHours: 4572,
    completion: (_text, courses) => ({
      requiredCourseIds: idsByType(courses, "Ob"),
      requirements: [
        requirement("electives", "Disciplinas optativas", 162, [
          catalogueSource("electives-catalogue", idsByType(courses, "Op")),
          manualSource("free-electives", 90),
        ]),
        requirement("extension-complementary", "Atividades de extensão e complementares", 90, [
          manualSource("extension-hours", 90, "Horas de extensão e complementares"),
        ]),
      ],
    }),
  },
  "artes-cenicas": {
    program: "Artes Cênicas",
    version: "Matriz 2013.1",
    totalHours: 3348,
    completion: (_text, courses) => {
      const alternativeTracks = ["ART6712", "ART6713", "ART6714", "ART6812", "ART6813", "ART6814", "ART6816"];
      return {
        requiredCourseIds: without(idsByType(courses, "Ob"), alternativeTracks),
        requirements: [
          requirement("electives", "Disciplinas optativas", 288, [
            catalogueSource("electives-catalogue", [...idsByType(courses, "Op"), ...alternativeTracks]),
            manualSource("free-electives", 72),
          ]),
        ],
      };
    },
  },
  "ciencia-da-informacao": {
    program: "Ciência da Informação",
    version: "Matriz 2026.1",
    totalHours: 2880,
    completion: (_text, courses) => ({
      requiredCourseIds: idsByType(courses, "Ob"),
      requirements: [
        requirement("electives", "Disciplinas optativas", 414, [
          catalogueSource("electives-catalogue", idsByType(courses, "Op")),
          manualSource("free-electives", 108),
        ]),
        requirement("complementary-activities", "Atividades complementares e extensão", 268, [
          manualSource("complementary-hours", 268, "Horas de atividades complementares e extensão"),
        ]),
      ],
    }),
  },
  "ciencia-e-tecnologia-de-alimentos": {
    program: "Ciência e Tecnologia de Alimentos",
    version: "Matriz 2024.1",
    totalHours: 3852,
    completion: (_text, courses) => {
      const oldReplaced = ["CAL5401", "CAL5505", "CAL5507", "CAL5502", "CAL5124", "CAL5402", "QMC5451", "MOR5226"];
      return {
        requiredCourseIds: without(idsByType(courses, "Ob"), oldReplaced),
        requirements: [
          requirement("electives", "Disciplinas optativas", 252, [
            catalogueSource("electives-catalogue", [...idsByType(courses, "Op"), ...oldReplaced]),
            manualSource("free-electives", 90),
          ]),
          requirement("extension-actions", "Ações de extensão e complementares", 162, [
            manualSource("extension-hours", 162, "Horas de extensão e complementares"),
          ]),
        ],
      };
    },
  },
  "design-de-produto": {
    program: "Design de Produto",
    version: "Matriz 2008.1",
    totalHours: 3456,
    completion: (_text, courses) => {
      const optativesMarkedOb = ["EGR7808", "EGR7809", "EGR7810", "LSB7409", "EGR5801", "EGR5802", "EGR5803", "EGR7198"];
      return {
        requiredCourseIds: without(idsByType(courses, "Ob"), optativesMarkedOb),
        requirements: [
          requirement("electives", "Disciplinas optativas e estágio", 288, [
            catalogueSource("electives-catalogue", [...idsByType(courses, "Op"), ...optativesMarkedOb]),
            manualSource("free-electives", 180),
          ]),
        ],
      };
    },
  },
  "direito": {
    program: "Direito",
    version: "Matriz 2023.1",
    totalHours: 4464,
    completion: (_text, courses) => ({
      requiredCourseIds: idsByType(courses, "Ob"),
      requirements: [
        requirement("electives", "Disciplinas optativas", 180, [
          catalogueSource("electives-catalogue", idsByType(courses, "Op")),
          manualSource("free-electives", 90),
        ]),
        requirement("complementary-activities", "Atividades complementares e extensão", 114, [
          manualSource("complementary-hours", 114, "Horas de atividades complementares e extensão"),
        ]),
      ],
    }),
  },
  "ead-filosofia": {
    program: "Filosofia (EaD)",
    version: "Matriz 2017.1",
    totalHours: 3072,
    completion: (_text, courses) => ({
      requiredCourseIds: idsByType(courses, "Ob"),
      requirements: [],
    }),
  },
  "ead-fisica": {
    program: "Física (EaD)",
    version: "Matriz 2017.1",
    totalHours: 3600,
    completion: (_text, courses) => ({
      requiredCourseIds: idsByType(courses, "Ob"),
      requirements: [
        requirement("electives", "Disciplinas optativas", 288, [
          catalogueSource("electives-catalogue", idsByType(courses, "Op")),
          manualSource("free-electives", 288),
        ]),
        requirement("complementary-activities", "Atividades complementares", 130, [
          manualSource("complementary-hours", 130, "Horas de atividades complementares"),
        ]),
      ],
    }),
  },
  "ead-historia": {
    program: "História (EaD)",
    version: "Matriz 2025.1",
    totalHours: 3945,
    completion: (_text, courses) => ({
      requiredCourseIds: idsByType(courses, "Ob"),
      requirements: [
        requirement("electives", "Disciplinas optativas", 225, [
          catalogueSource("electives-catalogue", idsByType(courses, "Op")),
          manualSource("free-electives", 90),
        ]),
        requirement("complementary-activities", "Atividades complementares", 75, [
          manualSource("complementary-hours", 75, "Horas de atividades complementares"),
        ]),
      ],
    }),
  },
  "ead-letras-lingua-espanhola": {
    program: "Letras - Língua Espanhola (EaD)",
    version: "Matriz 2010.1",
    totalHours: 3104,
    completion: (_text, courses) => {
      const literaturaTrack = ["LLE9403", "LLE9405", "LLE9407", "LLE9050"];
      const remainingOb = without(idsByType(courses, "Ob"), literaturaTrack);
      const sumOb = remainingOb.reduce((s, id) => s + (courses.find((c) => c.id === id)?.hours ?? 0), 0);
      const reqDiff = 3104 - sumOb;
      return {
        requiredCourseIds: remainingOb,
        requirements: reqDiff > 0 ? [
          requirement("electives", "Disciplinas optativas", reqDiff, [
            catalogueSource("electives-catalogue", [...idsByType(courses, "Op"), ...literaturaTrack]),
            manualSource("free-electives", reqDiff),
          ]),
        ] : [],
      };
    },
  },
  "ead-letras-lingua-portuguesa": {
    program: "Letras - Língua Portuguesa (EaD)",
    version: "Matriz 2008.2",
    totalHours: 3354,
    completion: (_text, courses) => {
      const literaturaTrack = ["LLV9511", "LLV9522"];
      return {
        requiredCourseIds: without(idsByType(courses, "Ob"), literaturaTrack),
        requirements: [],
      };
    },
  },
  "educacao-fisica": {
    program: "Educação Física",
    version: "Matriz 2006.1",
    totalHours: 3840,
    completion: (_text, courses) => {
      const alternativeChoices = ["DEF5844", "DEF5846", "DEF5848", "DEF5850"];
      return {
        requiredCourseIds: without(idsByType(courses, "Ob"), alternativeChoices),
        requirements: [
          requirement("electives", "Disciplinas optativas", 216, [
            catalogueSource("electives-catalogue", [...idsByType(courses, "Op"), ...alternativeChoices]),
            manualSource("free-electives", 72),
          ]),
        ],
      };
    },
  },
  filosofia: {
    program: "Filosofia",
    version: "Matriz 2006.1",
    totalHours: 2940,
    completion: (_text, courses) => {
      const licenciaturaCourses = ["FIL5660", "MEN5602", "PSI5137", "EED5185", "FIL5680", "MEN5142", "MEN5315", "MEN5316", "LSB7244"];
      return {
        requiredCourseIds: without(idsByType(courses, "Ob"), licenciaturaCourses),
        requirements: [
          requirement("philosophical-electives", "Disciplinas optativas filosóficas", 792, [
            catalogueSource("electives-catalogue", idsByType(courses, "Op")),
            manualSource("free-philosophical-electives", 792),
          ]),
          requirement("free-electives", "Disciplinas optativas não-filosóficas", 216, [
            manualSource("free-electives-hours", 216, "Horas em disciplinas optativas livres"),
          ]),
        ],
      };
    },
  },
  geografia: {
    program: "Geografia",
    version: "Matriz 2007.1",
    totalHours: 4448,
    completion: (_text, courses) => {
      const bachOnly = ["GCN7400", "GCN7603", "GCN7604", "GCN7700", "GCN7702", "GCN7703", "GCN7802", "GCN7803"];
      return {
        requiredCourseIds: without(idsByType(courses, "Ob"), bachOnly),
        requirements: [
          requirement("electives", "Disciplinas optativas", 216, [
            catalogueSource("electives-catalogue", [...idsByType(courses, "Op"), ...bachOnly]),
            manualSource("free-electives", 72),
          ]),
          requirement("complementary-activities", "Atividades complementares", 252, [
            manualSource("complementary-hours", 252, "Horas de atividades complementares"),
          ]),
        ],
      };
    },
  },
  geologia: {
    program: "Geologia",
    version: "Matriz 2018.1",
    totalHours: 4752,
    completion: (_text, courses) => {
      const gcnDuplicate = courses.filter((c) => c.id.startsWith("GCN")).map((c) => c.id);
      return {
        requiredCourseIds: without(idsByType(courses, "Ob"), gcnDuplicate),
        requirements: [
          requirement("electives", "Disciplinas optativas", 360, [
            catalogueSource("electives-catalogue", idsByType(courses, "Op")),
            manualSource("free-electives", 180),
          ]),
          requirement("complementary-extension", "Atividades complementares e de extensão", 288, [
            manualSource("complementary-hours", 288, "Horas de atividades complementares e extensão"),
          ]),
        ],
      };
    },
  },
  historia: {
    program: "História",
    version: "Matriz 2007.1",
    totalHours: 3384,
    completion: (_text, courses) => ({
      requiredCourseIds: idsByType(courses, "Ob"),
      requirements: [
        requirement("electives", "Disciplinas optativas", 288, [
          catalogueSource("electives-catalogue", idsByType(courses, "Op")),
          manualSource("free-electives", 72),
        ]),
        requirement("free-electives", "Disciplinas optativas fora do curso", 120, [
          manualSource("free-electives-hours", 120, "Horas de disciplinas fora do curso"),
        ]),
        requirement("complementary-activities", "Atividades complementares", 240, [
          manualSource("complementary-hours", 240, "Horas de atividades complementares"),
        ]),
      ],
    }),
  },
  jornalismo: {
    program: "Jornalismo",
    version: "Matriz 2020.1",
    totalHours: 3600,
    completion: (_text, courses) => ({
      requiredCourseIds: idsByType(courses, "Ob"),
      requirements: [
        requirement("electives", "Disciplinas optativas", 432, [
          catalogueSource("electives-catalogue", idsByType(courses, "Op")),
          manualSource("free-electives", 144),
        ]),
      ],
    }),
  },
  "letras-lingua-portuguesa": {
    program: "Letras - Língua Portuguesa",
    version: "Matriz 2007.1",
    totalHours: 3852,
    completion: (_text, courses) => {
      const allOb = idsByType(courses, "Ob");
      const licOb: string[] = [];
      let sum = 0;
      for (const id of allOb) {
        const c = courses.find((course) => course.id === id);
        if (!c) continue;
        if (sum + c.hours <= 3654) {
          licOb.push(id);
          sum += c.hours;
        }
      }
      const otherCourses = without(allOb, licOb);
      const remainingHours = 3852 - sum;
      return {
        requiredCourseIds: licOb,
        requirements: [
          requirement("electives", "Disciplinas optativas", remainingHours, [
            catalogueSource("electives-catalogue", [...idsByType(courses, "Op"), ...otherCourses]),
            manualSource("free-electives", remainingHours),
          ]),
        ],
      };
    },
  },
  "letras-linguas-estrangeiras": {
    program: "Letras - Alemão",
    version: "Matriz 2007.1",
    totalHours: 3390,
    completion: (_text, courses) => {
      const allOb = idsByType(courses, "Ob");
      const licOb: string[] = [];
      let sum = 0;
      for (const id of allOb) {
        const c = courses.find((course) => course.id === id);
        if (!c) continue;
        if (sum + c.hours <= 2850) {
          licOb.push(id);
          sum += c.hours;
        }
      }
      const otherCourses = without(allOb, licOb);
      const remainingHours = 3390 - sum;
      const optHours = 360;
      const accHours = Math.max(0, remainingHours - optHours);
      return {
        requiredCourseIds: licOb,
        requirements: [
          requirement("electives", "Disciplinas optativas", optHours, [
            catalogueSource("electives-catalogue", [...idsByType(courses, "Op"), ...otherCourses]),
            manualSource("free-electives", 180),
          ]),
          requirement("complementary-activities", "Atividades complementares (ACCs)", accHours, [
            manualSource("complementary-hours", accHours, "Horas de atividades complementares"),
          ]),
        ],
      };
    },
  },
  pedagogia: {
    program: "Pedagogia",
    version: "Matriz 2009.1",
    totalHours: 4128,
    completion: (_text, courses) => {
      const phase0Ob = courses.filter((c) => c.phase === 0 && c.type === "Ob").map((c) => c.id);
      return {
        requiredCourseIds: without(idsByType(courses, "Ob"), phase0Ob),
        requirements: [
          requirement("nade-electives", "Disciplinas de aprofundamento (NADE)", 324, [
            catalogueSource("nade-catalogue", [...idsByType(courses, "Op"), ...phase0Ob]),
            manualSource("free-nade", 108),
          ]),
          requirement("atca", "Atividades Técnico-Científicas e Artísticas", 240, [
            manualSource("atca-hours", 240, "Horas de ATCA"),
          ]),
        ],
      };
    },
  },
  "povos-indigenas-do-sul-da-mata-atlantica": {
    program: "Licenciatura Intercultural Indígena",
    version: "Matriz 2022.1",
    totalHours: 3870,
    completion: (_text, courses) => {
      const otherTracks = [
        "HST8121", "HST8124", "HST8221", "HST8224", "HST8331", "MEN8512", "HST8421", "MEN8612", "MEN8712", "MEN8812",
        "HST8122", "HST8125", "HST8222", "HST8225", "HST8332", "MEN8513", "HST8422", "MEN8613", "MEN8713", "MEN8813",
        "ANT8511", "ECZ8511", "ANT8611", "ECZ8611",
      ];
      return {
        requiredCourseIds: without(idsByType(courses, "Ob"), otherTracks),
        requirements: [],
      };
    },
  },
  psicologia: {
    program: "Psicologia",
    version: "Matriz 2010.1",
    totalHours: 4896,
    completion: (_text, courses) => {
      const allOb = idsByType(courses, "Ob");
      const licOb: string[] = [];
      let sum = 0;
      for (const id of allOb) {
        const c = courses.find((course) => course.id === id);
        if (!c) continue;
        if (sum + c.hours <= 3834) {
          licOb.push(id);
          sum += c.hours;
        }
      }
      const otherCourses = without(allOb, licOb);
      const diff = 4896 - sum;
      return {
        requiredCourseIds: licOb,
        requirements: [
          requirement("electives", "Disciplinas optativas", 792, [
            catalogueSource("electives-catalogue", [...idsByType(courses, "Op"), ...otherCourses]),
            manualSource("free-electives", 270),
          ]),
          requirement("complementary-activities", "Disciplinas complementares", Math.max(0, diff - 792), [
            manualSource("complementary-hours", Math.max(0, diff - 792), "Horas complementares"),
          ]),
        ],
      };
    },
  },
  "quimica-florianopolis": {
    program: "Química",
    version: "Matriz 2021.1",
    totalHours: 3780,
    completion: (_text, courses) => ({
      requiredCourseIds: idsByType(courses, "Ob"),
      requirements: [
        requirement("electives", "Disciplinas optativas", 72, [
          catalogueSource("electives-catalogue", without(idsByType(courses, "Op"), ["QMC5827"])),
          manualSource("free-electives", 72),
        ]),
        requirement("extension-actions", "Ações de extensão (QMC5827)", 252, [
          catalogueSource("extension-catalogue", ["QMC5827"]),
          manualSource("extension-hours", 252, "Horas de ações de extensão"),
        ]),
        requirement("aacc", "Atividades de Aprofundamento (AACC)", 108, [
          manualSource("aacc-hours", 108, "Horas de AACC"),
        ]),
      ],
    }),
  },
};
