import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProgressDashboard } from "../../src/app/[course]/components/ProgressDashboard";
import { CurriculumData } from "../../src/types/curriculum";

const curriculum: CurriculumData = {
  program: "Engenharia de Teste",
  institution: "UFSC",
  version: "Matriz 1",
  totalHours: 154,
  phases: [{ number: 1, name: "1ª Fase" }],
  courses: [
    { id: "OBR0001", code: "OBR0001", name: "Obrigatória", credits: 4, hours: 72, phase: 1, type: "Ob", prerequisites: [], equivalents: [], syllabus: "Ementa" },
    { id: "OPT0001", code: "OPT0001", name: "Optativa", credits: 3, hours: 54, phase: 0, type: "Op", prerequisites: [], equivalents: [], syllabus: "Ementa" },
  ],
  completion: {
    requiredCourseIds: ["OBR0001"],
    requirements: [{ id: "electives", name: "Optativas", requiredHours: 82, sources: [{ id: "catalogue", courseIds: ["OPT0001"], allowsManualHours: false }, { id: "external", courseIds: [], allowsManualHours: true, maxHours: 28 }] }],
  },
};

describe("ProgressDashboard", () => {
  it("uses course-specific requirements instead of every catalogue option", () => {
    const markup = renderToStaticMarkup(<ProgressDashboard curriculum={curriculum} statuses={{ OBR0001: "completed", OPT0001: "completed" }} requirementHours={{ external: 28 }} onRequirementHoursChange={() => undefined} onReset={() => undefined} searchSlot={null} />);
    expect(markup).toContain("100%");
    expect(markup).toContain("154h de 154h");
    expect(markup).toContain("Optativas");
    expect(markup).toContain("82h de 82h");
  });
});
