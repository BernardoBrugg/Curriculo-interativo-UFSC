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
});
