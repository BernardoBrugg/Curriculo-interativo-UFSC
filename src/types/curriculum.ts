export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  hours: number;
  phase: number;
  type: "Ob" | "Op" | "FreeOp";
  prerequisites: string[];
  equivalents: string[];
  syllabus: string;
  extensionHours?: number;
}

export interface PhaseInfo {
  number: number;
  name: string;
}

export type CourseStatus = "pending" | "in-progress" | "completed";

export interface CurriculumData {
  program: string;
  institution: string;
  version: string;
  totalHours: number;
  phases: PhaseInfo[];
  courses: Course[];
}
