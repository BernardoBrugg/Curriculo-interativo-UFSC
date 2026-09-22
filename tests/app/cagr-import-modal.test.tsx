import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CagrImportModal } from "../../src/app/[course]/components/CagrImportModal";
import { Course } from "../../src/types/curriculum";

const sampleCourses: Course[] = [
  {
    id: "MTM3101",
    code: "MTM3101",
    name: "Cálculo 1",
    credits: 4,
    hours: 72,
    phase: 1,
    type: "Ob",
    prerequisites: [],
    equivalents: [],
    syllabus: "Limites e derivadas.",
  },
  {
    id: "FSC5101",
    code: "FSC5101",
    name: "Física 1",
    credits: 4,
    hours: 72,
    phase: 1,
    type: "Ob",
    prerequisites: [],
    equivalents: [],
    syllabus: "Mecânica clássica.",
  },
];

describe("CagrImportModal", () => {
  it("renders null when isOpen is false", () => {
    const markup = renderToStaticMarkup(
      <CagrImportModal
        isOpen={false}
        onClose={() => undefined}
        allCourses={sampleCourses}
        onApply={() => undefined}
      />
    );
    expect(markup).toBe("");
  });

  it("renders import modal dialog with PDF dropzone when isOpen is true", () => {
    const markup = renderToStaticMarkup(
      <CagrImportModal
        isOpen={true}
        onClose={() => undefined}
        allCourses={sampleCourses}
        onApply={() => undefined}
      />
    );

    expect(markup).toContain("Importar Histórico do CAGR");
    expect(markup).toContain("Arraste e solte o Histórico em PDF aqui");
    expect(markup).toContain("Aceita exclusivamente arquivo PDF");
    expect(markup).toContain("Como emitir seu histórico no CAGR");
    expect(markup).toContain("Privacidade total");
    expect(markup).toContain("Cancelar");
    expect(markup).toContain("Aplicar à grade (0)");
  });
});
