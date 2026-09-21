import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseCagrCurriculum } from "../../scripts/lib/cagr-curriculum-parser";

const source = (name: string) => fs.readFileSync(path.join(process.cwd(), "data", "curricula", "sources", name), "utf8");

describe("CAGR curriculum parser", () => {
  it("parses wrapped names, extension hours, equivalences, and full syllabi", () => {
    const parsed = parseCagrCurriculum(source("automacao-20241.txt"));
    const introduction = parsed.courses.find((course) => course.code === "DAS5412");
    const calculus = parsed.courses.find((course) => course.code === "MTM3110");

    expect(introduction?.name).toBe("Introdução à Engenharia de Controle e Automação");
    expect(introduction?.extensionHours).toBe(36);
    expect(introduction?.syllabus).toContain("Desenvolvimento de projeto autoral de engenharia");
    expect(calculus?.equivalents).toEqual(["MTM3101", "MTM5801"]);
    expect(calculus?.equivalentExpression).toEqual({ kind: "any", requirements: [{ kind: "course", code: "MTM3101" }, { kind: "course", code: "MTM5801" }] });
    expect(parsed.courses).toHaveLength(104);
  });

  it("preserves trimester hours from the Materials report", () => {
    const parsed = parseCagrCurriculum(source("materiais-20011.txt"));
    const spatialDrawing = parsed.courses.find((course) => course.code === "EGR5603");

    expect(spatialDrawing).toMatchObject({ hours: 56, credits: 4, phase: 1 });
  });

  it("parses wrapped prerequisite conjunctions", () => {
    const parsed = parseCagrCurriculum(source("producao-20231.txt"));
    const internship = parsed.courses.find((course) => course.code === "EPS2310");

    expect(internship?.prerequisites).toEqual(["EPS2382", "EPS5235"]);
    expect(internship?.prerequisiteExpression).toEqual({ kind: "all", requirements: [{ kind: "course", code: "EPS2382" }, { kind: "course", code: "EPS5235" }, { kind: "hours", hours: 3000, courseType: "Ob" }] });
    expect(internship?.prerequisiteHours).toBe(3000);
    expect(internship?.equivalents).toEqual(["EPS7080"]);
  });

  it("normalizes lowercase official course types", () => {
    const parsed = parseCagrCurriculum(source("automacao-20241.txt"));
    const extension = parsed.courses.find((course) => course.code === "DAS5300");

    expect(extension?.type).toBe("Ob");
    expect(extension?.hours).toBe(216);
  });

  it("recovers syllabi split by continuation pages", () => {
    const automation = parseCagrCurriculum(source("automacao-20241.txt"));
    const electronics = parseCagrCurriculum(source("eletronica-20092.txt"));

    expect(automation.courses.find((course) => course.code === "INE5681")?.syllabus).toContain("Gestão de negócios pela visão de processos");
    expect(electronics.courses.find((course) => course.code === "EEL7878")?.syllabus).toContain("Participação em atividade de extensão");
  });

  it("keeps wrapped names after punctuation", () => {
    const automation = parseCagrCurriculum(source("automacao-20241.txt"));
    const mechanics = parseCagrCurriculum(source("mecanica-20251.txt"));
    expect(automation.courses.find((course) => course.code === "DAS5944")?.name).toBe("Tópicos Especiais em Controle: Instrumentação Aplicada à Industria de Petróleo e Gás");
    expect(mechanics.courses.find((course) => course.code === "EMC5809")?.name).toBe("Manufatura auxiliada por computador, programação e simulação da usinagem");
  });
});
