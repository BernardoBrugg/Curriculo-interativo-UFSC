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
  prerequisiteExpression?: RequirementExpression;
  equivalentExpression?: RequirementExpression;
  prerequisiteHours?: number;
  syllabus: string;
  extensionHours?: number;
}

export type RequirementExpression =
  | { kind: "course"; code: string }
  | { kind: "all"; requirements: RequirementExpression[] }
  | { kind: "any"; requirements: RequirementExpression[] }
  | { kind: "hours"; hours: number; courseType?: "Ob" };

export interface CurriculumRequirementSource {
  id: string;
  courseIds: string[];
  allowsManualHours: boolean;
  manualLabel?: string;
  hoursField?: "course" | "extension" | "nonExtension";
  maxHours?: number;
}

export interface CurriculumRequirement {
  id: string;
  name: string;
  requiredHours: number;
  sources: CurriculumRequirementSource[];
}

export interface CurriculumCompletion {
  requiredCourseIds: string[];
  requirements: CurriculumRequirement[];
}

export interface CurriculumSource {
  kind: "official-cagr-report";
  courseCode: string;
  curriculumCode: string;
  url: string;
  sha256: string;
  capturedAt: string;
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
  completion?: CurriculumCompletion;
  source?: CurriculumSource;
}
