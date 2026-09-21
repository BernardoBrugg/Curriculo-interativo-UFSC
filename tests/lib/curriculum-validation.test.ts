import { describe, expect, it } from "vitest";
import automacao from "../../src/data/curricula/automacao/curriculum.json";
import { validateCurriculum } from "../../src/lib/curriculum-validation";
import { CurriculumData } from "../../src/types/curriculum";

describe("curriculum validation", () => {
  it("accepts a complete official curriculum", () => {
    expect(validateCurriculum("automacao", automacao as CurriculumData)).toEqual([]);
  });

  it("rejects a denominator different from the official total", () => {
    const curriculum = { ...automacao, totalHours: automacao.totalHours + 18 } as CurriculumData;
    expect(validateCurriculum("automacao", curriculum)).toContain("automacao: a soma dos requisitos de conclusão é 4464h, mas o total oficial é 4482h.");
  });

  it("rejects the same component in fixed and elective requirements", () => {
    const curriculum = structuredClone(automacao) as CurriculumData;
    curriculum.completion?.requirements[0].sources[0].courseIds.push("DAS5412");
    expect(validateCurriculum("automacao", curriculum)).toContain("automacao: DAS5412 contribui para mais de um requisito de conclusão.");
  });
});
