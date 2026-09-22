import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { CurriculumGrid } from "../../src/app/[course]/components/CurriculumGrid";
import { Course, PhaseInfo } from "../../src/types/curriculum";

vi.mock("../../src/hooks/useDragTutorial", () => ({
  useDragTutorial: () => ({ isVisible: false, dismiss: () => Promise.resolve() }),
}));

const sampleCourses: Course[] = [
  {
    id: "OPT0001",
    code: "OPT0001",
    name: "Optativa 1",
    credits: 4,
    hours: 72,
    phase: 0,
    type: "Op",
    prerequisites: [],
    equivalents: [],
    syllabus: "Ementa",
  },
  {
    id: "MAT1101",
    code: "MAT1101",
    name: "Disciplina Fase 11",
    credits: 3,
    hours: 54,
    phase: 11,
    type: "Ob",
    prerequisites: [],
    equivalents: [],
    syllabus: "Ementa",
  },
  {
    id: "MAT1301",
    code: "MAT1301",
    name: "Disciplina Fase 13",
    credits: 2,
    hours: 36,
    phase: 13,
    type: "Ob",
    prerequisites: [],
    equivalents: [],
    syllabus: "Ementa",
  },
];

const phases: PhaseInfo[] = [
  { number: 0, name: "Optativas e outros componentes" },
  { number: 11, name: "11ª Fase" },
  { number: 13, name: "13ª Fase" },
];

describe("CurriculumGrid", () => {
  it("renders Optativas label for phase 0 and retains phases beyond 10", () => {
    const markup = renderToStaticMarkup(
      <CurriculumGrid
        phases={phases}
        courses={sampleCourses}
        statuses={{}}
        selectedId={null}
        searchQuery=""
        prerequisites={new Set()}
        dependents={new Set()}
        customPhases={{}}
        onSelectCourse={() => undefined}
        onToggleStatus={() => undefined}
        onMoveCourse={() => undefined}
      />
    );

    expect(markup).toContain("Optativas");
    expect(markup).toContain("Disciplina Fase 11");
    expect(markup).toContain("Disciplina Fase 13");
    expect(markup).toContain("11ª Fase");
    expect(markup).toContain("13ª Fase");
  });

  it("renders desktop drag attributes and instructions", () => {
    const markup = renderToStaticMarkup(
      <CurriculumGrid
        phases={phases}
        courses={sampleCourses}
        statuses={{}}
        selectedId={null}
        searchQuery=""
        prerequisites={new Set()}
        dependents={new Set()}
        customPhases={{}}
        onSelectCourse={() => undefined}
        onToggleStatus={() => undefined}
        onMoveCourse={() => undefined}
      />
    );

    expect(markup).toContain("data-card-draggable=\"true\"");
    expect(markup).toContain("data-drag-handle=\"true\"");
    expect(markup).toContain("Clique no cartão para atualizar o status ou arraste para outro semestre.");
  });
});
