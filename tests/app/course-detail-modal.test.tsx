import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CourseDetailModal } from "../../src/app/[course]/components/CourseDetailModal";
import { Course, PhaseInfo } from "../../src/types/curriculum";

const sampleCourse: Course = {
  id: "EPS2301",
  code: "EPS2301",
  name: "Programação para Engenharia de Produção I",
  credits: 4,
  hours: 72,
  phase: 1,
  type: "Ob",
  prerequisites: [],
  equivalents: ["EPS7001"],
  syllabus: "Fundamentos de lógica de programação.",
};

const dependentCourse: Course = {
  id: "EPS2302",
  code: "EPS2302",
  name: "Estruturas de Dados Avançadas",
  credits: 4,
  hours: 72,
  phase: 2,
  type: "Ob",
  prerequisites: ["EPS2301"],
  equivalents: [],
  syllabus: "Árvores e grafos.",
};

const phases: PhaseInfo[] = [
  { number: 0, name: "Optativas e outros componentes" },
  { number: 1, name: "1ª Fase" },
  { number: 2, name: "2ª Fase" },
];

describe("CourseDetailModal", () => {
  it("renders null when course is null", () => {
    const markup = renderToStaticMarkup(
      <CourseDetailModal
        course={null}
        allCourses={[sampleCourse]}
        statuses={{}}
        customPhases={{}}
        isBlocked={false}
        onClose={() => undefined}
        onToggleStatus={() => undefined}
        onMovePhase={() => undefined}
        phases={phases}
      />
    );
    expect(markup).toBe("");
  });

  it("renders course details and controls when course is provided", () => {
    const markup = renderToStaticMarkup(
      <CourseDetailModal
        course={sampleCourse}
        allCourses={[sampleCourse, dependentCourse]}
        statuses={{ EPS2301: "in-progress" }}
        customPhases={{}}
        isBlocked={false}
        onClose={() => undefined}
        onToggleStatus={() => undefined}
        onMovePhase={() => undefined}
        phases={phases}
      />
    );
    expect(markup).toContain("EPS2301");
    expect(markup).toContain("Programação para Engenharia de Produção I");
    expect(markup).toContain("4 cr");
    expect(markup).toContain("72h");
    expect(markup).toContain("Fundamentos de lógica de programação.");
    expect(markup).toContain("Estruturas de Dados Avançadas");
    expect(markup).toContain("Mover para o semestre");
    expect(markup).toContain("Optativas");
  });

  it("displays warning banner when course is blocked by prerequisites", () => {
    const markup = renderToStaticMarkup(
      <CourseDetailModal
        course={dependentCourse}
        allCourses={[sampleCourse, dependentCourse]}
        statuses={{ EPS2301: "pending" }}
        customPhases={{}}
        isBlocked={true}
        onClose={() => undefined}
        onToggleStatus={() => undefined}
        onMovePhase={() => undefined}
        phases={phases}
      />
    );
    expect(markup).toContain("Pré-requisitos pendentes");
    expect(markup).toContain("EPS2301");
  });
});
