import { describe, expect, it } from "vitest";
import { Course } from "../../src/types/curriculum";
import { getCoursePopoverData } from "../../src/lib/course-popover";

const prerequisite: Course = {
  id: "calculo-1",
  code: "MTM3101",
  name: "Cálculo 1",
  credits: 4,
  hours: 72,
  phase: 1,
  type: "Ob",
  prerequisites: [],
  equivalents: [],
  syllabus: "Funções e limites",
};

const course: Course = {
  id: "calculo-2",
  code: "MTM3102",
  name: "Cálculo 2",
  credits: 4,
  hours: 72,
  phase: 2,
  type: "Op",
  prerequisites: ["calculo-1"],
  equivalents: [],
  syllabus: "Integração e séries",
};

describe("getCoursePopoverData", () => {
  it("describes type, credits, prerequisites, and dependent courses", () => {
    const data = getCoursePopoverData(course, [prerequisite, course]);

    expect(data.typeLabel).toBe("Optativa do curso");
    expect(data.creditsLabel).toBe("4 créditos");
    expect(data.prerequisites).toEqual(["MTM3101 · Cálculo 1"]);
    expect(data.dependents).toEqual([]);
    expect(data.dragInstruction).toBe("Segure e arraste pelo puxador para mover entre semestres.");
  });

  it("lists courses that depend on the hovered course", () => {
    const data = getCoursePopoverData(prerequisite, [prerequisite, course]);

    expect(data.dependents).toEqual(["MTM3102 · Cálculo 2"]);
  });
});
