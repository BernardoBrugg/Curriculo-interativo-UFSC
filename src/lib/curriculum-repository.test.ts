import { describe, expect, it } from "vitest";
import { normalizeCurriculumDocument, normalizeCurriculumSummary } from "./curriculum-repository";

describe("curriculum repository normalization", () => {
  it("normalizes a curriculum document returned by Firestore", () => {
    expect(normalizeCurriculumDocument({ id: "civil", program: "Engenharia Civil", phases: [{ number: 1, name: "1ª Fase" }], courses: [] })).toEqual({
      id: "civil",
      program: "Engenharia Civil",
      institution: "",
      version: "",
      totalHours: 0,
      phases: [{ number: 1, name: "1ª Fase" }],
      courses: [],
    });
  });

  it("builds a course summary from a curriculum document", () => {
    expect(normalizeCurriculumSummary({ id: "civil", program: "Engenharia Civil", version: "Matriz 2020.1" })).toEqual({
      id: "civil",
      name: "Engenharia Civil",
      description: "Matriz 2020.1",
    });
  });
});
