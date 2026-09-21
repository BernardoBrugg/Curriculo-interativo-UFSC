import { describe, expect, it } from "vitest";
import automacao from "../../src/data/curricula/automacao/curriculum.json";
import civil from "../../src/data/curricula/civil/curriculum.json";
import eletrica from "../../src/data/curricula/eletrica/curriculum.json";
import eletronica from "../../src/data/curricula/eletronica/curriculum.json";
import materiais from "../../src/data/curricula/materiais/curriculum.json";
import mecanica from "../../src/data/curricula/mecanica/curriculum.json";
import producao from "../../src/data/curricula/producao/curriculum.json";
import quimica from "../../src/data/curricula/quimica/curriculum.json";
import sanitaria from "../../src/data/curricula/sanitaria/curriculum.json";
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
