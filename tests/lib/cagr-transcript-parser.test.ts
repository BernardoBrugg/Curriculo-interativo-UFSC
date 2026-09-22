import { describe, expect, it } from "vitest";
import { parseCagrTranscript } from "../../src/lib/cagr-transcript-parser";

describe("cagr-transcript-parser", () => {
  it("returns empty result for empty or invalid input", () => {
    expect(parseCagrTranscript("")).toEqual({
      completedCourses: [],
      inProgressCourses: [],
      recognizedCount: 0,
    });
  });

  it("parses CAGR lines with approval situations", () => {
    const transcript = `
      MTM3101 - CÁLCULO 1 04221 4 72 100 8.5 AP 2021.1
      FSC5101 - FÍSICA 1 04221 4 72 100 7.0 APRN 2021.1
      QMC5107 - QUÍMICA 04221 4 72 100 9.0 DISP 2021.1
      EEL5105 - CIRCUITOS 04221 5 90 100 6.0 EQUIV 2021.2
      DAS5102 - INTRODUÇÃO 04221 4 72 60 4.0 REP 2021.1
      EPS7014 - ERGONOMIA 04221 4 72 0 0.0 CANCEL 2021.1
      INE5101 - PROGRAMAÇÃO 04221 4 72 100 - MATR 2022.1
    `;

    const result = parseCagrTranscript(transcript);

    expect(result.completedCourses).toContain("MTM3101");
    expect(result.completedCourses).toContain("FSC5101");
    expect(result.completedCourses).toContain("QMC5107");
    expect(result.completedCourses).toContain("EEL5105");
    expect(result.completedCourses).not.toContain("DAS5102");
    expect(result.completedCourses).not.toContain("EPS7014");
    expect(result.inProgressCourses).toEqual(["INE5101"]);
    expect(result.recognizedCount).toBe(5);
  });

  it("parses raw code list when no status keywords are present", () => {
    const rawCodes = `
      DAS5102
      MTM3101
      FSC5101
    `;

    const result = parseCagrTranscript(rawCodes);

    expect(result.completedCourses).toEqual(["DAS5102", "MTM3101", "FSC5101"]);
    expect(result.inProgressCourses).toEqual([]);
    expect(result.recognizedCount).toBe(3);
  });

  it("prioritizes approval over in-progress if course was previously approved", () => {
    const transcript = `
      MTM3101 - CÁLCULO 1 AP 2021.1
      MTM3101 - CÁLCULO 1 MATR 2022.1
    `;

    const result = parseCagrTranscript(transcript);

    expect(result.completedCourses).toEqual(["MTM3101"]);
    expect(result.inProgressCourses).toEqual([]);
  });

  it("parses official UFSC Histórico Síntese with student metadata and grades", () => {
    const transcript = `
      HISTÓRICO SÍNTESE DE GRADUAÇÃO
      ENGENHARIA DE PRODUÇÃO - Bacharelado
      Currículo: 2023/1
      Curso: 237 ENGENHARIA DE PRODUÇÃO - Bacharelado
      Aluno: Bernardo Broering Bruggemann
      Matrícula: 25250319

      Semestre 2025/1
      Disciplina Nota H/A Fr Tipo
      EEL5113 Eletrotécnica Geral 8.0 36 FS Ob Rv
      EEL7011 Laboratório de Eletricidade Básica 10.0 36 FS Op Rv
      MTM3110 Cálculo 1 6.5 72 FS Ob Rv
      MTM3120 Cálculo 2 6.5 72 FS Ob Rv
      MTM3103 Cálculo 3 6.0 72 FS Ob Rv
      IA - 7,36 IAA - 7,36 IAP - 7,36 H/A (total = 828 aprov = 828)

      Semestre 2025/2
      Disciplina Nota H/A Fr Tipo
      EMC5425 Fenômenos de Transportes 7.0 72 FS Ob
      EPS2301 Programação para Engenharia de Produção I 10.0 72 FS Ob

      Observação: O aluno de graduação é considerado aprovado numa disciplina se obtém frequência suficiente (FS) e nota final igual ou superior a 6.0.
      Legenda: Ob = Obrigatória, Op=Optativa
    `;

    const result = parseCagrTranscript(transcript);

    expect(result.studentName).toBe("Bernardo Broering Bruggemann");
    expect(result.matricula).toBe("25250319");
    expect(result.curriculumCode).toBe("2023/1");
    expect(result.completedCourses).toEqual([
      "EEL5113",
      "EEL7011",
      "MTM3110",
      "MTM3120",
      "MTM3103",
      "EMC5425",
      "EPS2301",
    ]);
    expect(result.inProgressCourses).toEqual([]);
    expect(result.recognizedCount).toBe(7);
  });
});
