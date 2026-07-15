import { Course, CurriculumData, PhaseInfo } from "@/types/curriculum";

export interface CurriculumDocument extends CurriculumData {
  id: string;
}

export interface CurriculumSummary {
  id: string;
  name: string;
  description: string;
}

export function normalizeCurriculumDocument(value: unknown): CurriculumDocument {
  const data = value && typeof value === "object" ? value as Partial<CurriculumDocument> : {};
  return {
    id: typeof data.id === "string" ? data.id : "",
    program: typeof data.program === "string" ? data.program : "",
    institution: typeof data.institution === "string" ? data.institution : "",
    version: typeof data.version === "string" ? data.version : "",
    totalHours: typeof data.totalHours === "number" ? data.totalHours : 0,
    phases: Array.isArray(data.phases) ? data.phases as PhaseInfo[] : [],
    courses: Array.isArray(data.courses) ? data.courses as Course[] : [],
  };
}

export function normalizeCurriculumSummary(value: unknown): CurriculumSummary {
  const data = normalizeCurriculumDocument(value);
  return {
    id: data.id,
    name: data.program,
    description: data.version,
  };
}
