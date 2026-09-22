import { describe, expect, it } from "vitest";
import automacao from "../../src/data/curricula/automacao/curriculum.json";
import ciencia_de_dados from "../../src/data/curricula/ciencia-de-dados/curriculum.json";
import ciencias_da_computacao from "../../src/data/curricula/ciencias-da-computacao/curriculum.json";
import civil from "../../src/data/curricula/civil/curriculum.json";
import eletrica from "../../src/data/curricula/eletrica/curriculum.json";
import eletronica from "../../src/data/curricula/eletronica/curriculum.json";
import engenharia_de_alimentos from "../../src/data/curricula/engenharia-de-alimentos/curriculum.json";
import engenharia_de_aquicultura from "../../src/data/curricula/engenharia-de-aquicultura/curriculum.json";
import materiais from "../../src/data/curricula/materiais/curriculum.json";
import mecanica from "../../src/data/curricula/mecanica/curriculum.json";
import producao from "../../src/data/curricula/producao/curriculum.json";
import quimica from "../../src/data/curricula/quimica/curriculum.json";
import sanitaria from "../../src/data/curricula/sanitaria/curriculum.json";
import sistemas_de_informacao from "../../src/data/curricula/sistemas-de-informacao/curriculum.json";
import { validateCurriculum } from "../../src/lib/curriculum-validation";
import { calculateCurriculumProgress } from "../../src/lib/curriculum-progress";
import { CurriculumData } from "../../src/types/curriculum";

const curricula = {
  automacao: { curriculum: automacao, version: "Matriz 2024.1", hours: 4464, courses: 104 },
  civil: { curriculum: civil, version: "Matriz 2020.1", hours: 4518, courses: 96 },
  eletrica: { curriculum: eletrica, version: "Matriz 2005.1", hours: 4446, courses: 213 },
  eletronica: { curriculum: eletronica, version: "Matriz 2009.2", hours: 4644, courses: 103 },
  materiais: { curriculum: materiais, version: "Matriz 2001.1", hours: 4344, courses: 76 },
  mecanica: { curriculum: mecanica, version: "Matriz 2025.1", hours: 4608, courses: 182 },
  producao: { curriculum: producao, version: "Matriz 2023.1", hours: 4320, courses: 94 },
  quimica: { curriculum: quimica, version: "Matriz 1991.1", hours: 4374, courses: 93 },
  sanitaria: { curriculum: sanitaria, version: "Matriz 2015.1", hours: 4518, courses: 105 },
  "ciencias-da-computacao": { curriculum: ciencias_da_computacao, version: "Matriz 2007.1", hours: 3840, courses: 87 },
  "sistemas-de-informacao": { curriculum: sistemas_de_informacao, version: "Matriz 2011.1", hours: 3600, courses: 93 },
  "engenharia-de-alimentos": { curriculum: engenharia_de_alimentos, version: "Matriz 1991.1", hours: 4368, courses: 93 },
  "ciencia-de-dados": { curriculum: ciencia_de_dados, version: "Matriz 2026.1", hours: 2520, courses: 52 },
  "engenharia-de-aquicultura": { curriculum: engenharia_de_aquicultura, version: "Matriz 2024.1", hours: 4410, courses: 97 },
};

describe("official curricula contracts", () => {
  for (const [id, contract] of Object.entries(curricula)) {
    it(`${id} matches its official report`, () => {
      const curriculum = contract.curriculum as CurriculumData;
      expect(curriculum.version).toBe(contract.version);
      expect(curriculum.totalHours).toBe(contract.hours);
      expect(curriculum.courses).toHaveLength(contract.courses);
      expect(curriculum.source?.kind).toBe("official-cagr-report");
      expect(validateCurriculum(id, curriculum)).toEqual([]);
      const statuses = Object.fromEntries(curriculum.courses.map((course) => [course.id, "completed" as const]));
      const requirementHours = Object.fromEntries((curriculum.completion?.requirements ?? []).flatMap((requirement) => requirement.sources.filter((source) => source.allowsManualHours).map((source) => [source.id, source.maxHours ?? requirement.requiredHours])));
      const progress = calculateCurriculumProgress({ curriculum, statuses, requirementHours });
      expect(progress.totalHours).toBe(contract.hours);
      expect(progress.percent).toBe(100);
    });
  }
});
