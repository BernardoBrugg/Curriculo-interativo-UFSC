import { describe, expect, it } from "vitest";
import { calculateCurriculumProgress } from "../../src/lib/curriculum-progress";
import { CurriculumData } from "../../src/types/curriculum";

const curriculum: CurriculumData = {
  program: "Engenharia de Teste",
  institution: "UFSC",
  version: "2026.1",
  totalHours: 180,
  phases: [{ number: 1, name: "1ª Fase" }],
  courses: [
    { id: "OB1", code: "OB1", name: "Obrigatória", credits: 4, hours: 72, phase: 1, type: "Ob", prerequisites: [], equivalents: [], syllabus: "Ementa" },
    { id: "OP1", code: "OP1", name: "Optativa 1", credits: 3, hours: 54, phase: 1, type: "Op", prerequisites: [], equivalents: [], syllabus: "Ementa" },
    { id: "OP2", code: "OP2", name: "Optativa 2", credits: 3, hours: 54, phase: 1, type: "Op", prerequisites: [], equivalents: [], syllabus: "Ementa" },
  ],
  completion: {
    requiredCourseIds: ["OB1"],
    requirements: [
      {
        id: "optatives",
        name: "Optativas",
        requiredHours: 108,
        sources: [{ id: "catalogue", courseIds: ["OP1", "OP2"], allowsManualHours: false }],
      },
    ],
  },
};

describe("curriculum progress", () => {
  it("does not let excess electives replace a required course", () => {
    const progress = calculateCurriculumProgress({
      curriculum,
      statuses: { OP1: "completed", OP2: "completed" },
      requirementHours: {},
    });

    expect(progress.percent).toBe(60);
    expect(progress.completedHours).toBe(108);
  });

  it("reaches one hundred with every fixed component and exact elective minima", () => {
    const progress = calculateCurriculumProgress({
      curriculum,
      statuses: { OB1: "completed", OP1: "completed", OP2: "completed" },
      requirementHours: {},
    });

    expect(progress.percent).toBe(100);
    expect(progress.completedHours).toBe(180);
  });

  it("caps manual and catalogue contributions at source and requirement limits", () => {
    const progress = calculateCurriculumProgress({
      curriculum: {
        ...curriculum,
        completion: {
          requiredCourseIds: ["OB1"],
          requirements: [
            {
              id: "optatives",
              name: "Optativas",
              requiredHours: 108,
              sources: [
                { id: "catalogue", courseIds: ["OP1", "OP2"], allowsManualHours: false, maxHours: 72 },
                { id: "external", courseIds: [], allowsManualHours: true, maxHours: 36 },
              ],
            },
          ],
        },
      },
      statuses: { OB1: "completed", OP1: "completed", OP2: "completed" },
      requirementHours: { external: 200 },
    });

    expect(progress.percent).toBe(100);
    expect(progress.requirements[0].completedHours).toBe(108);
  });

  it("rejects a course assigned to more than one completion requirement", () => {
    expect(() => calculateCurriculumProgress({
      curriculum: {
        ...curriculum,
        completion: {
          requiredCourseIds: ["OB1"],
          requirements: [
            { id: "first", name: "Primeiro", requiredHours: 54, sources: [{ id: "first-source", courseIds: ["OP1"], allowsManualHours: false }] },
            { id: "second", name: "Segundo", requiredHours: 54, sources: [{ id: "second-source", courseIds: ["OP1"], allowsManualHours: false }] },
          ],
        },
      },
      statuses: {},
      requirementHours: {},
    })).toThrow("OP1");
  });

  it("splits extension and non-extension hours without counting either twice", () => {
    const splitCurriculum: CurriculumData = {
      ...curriculum,
      totalHours: 126,
      courses: [{ ...curriculum.courses[0] }, { ...curriculum.courses[1], extensionHours: 18 }],
      completion: {
        requiredCourseIds: ["OB1"],
        requirements: [
          { id: "elective", name: "Optativa", requiredHours: 36, sources: [{ id: "elective-source", courseIds: ["OP1"], allowsManualHours: false, hoursField: "nonExtension" }] },
          { id: "extension", name: "Extensão", requiredHours: 18, sources: [{ id: "extension-source", courseIds: ["OP1"], allowsManualHours: false, hoursField: "extension" }] },
        ],
      },
    };
    const progress = calculateCurriculumProgress({ curriculum: splitCurriculum, statuses: { OB1: "completed", OP1: "completed" }, requirementHours: {} });
    expect(progress.completedHours).toBe(126);
    expect(progress.percent).toBe(100);
  });
});
