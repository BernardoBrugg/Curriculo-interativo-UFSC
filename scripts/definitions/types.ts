import { CurriculumCompletion, CurriculumData, CurriculumRequirement, CurriculumRequirementSource } from "../../src/types/curriculum";

export interface CurriculumDefinition {
  program: string;
  version: string;
  totalHours: number;
  completion: (text: string, courses: CurriculumData["courses"]) => CurriculumCompletion;
}

export function courseIdsBetween(text: string, startMarker: string, endMarker?: string): string[] {
  const lines = text.split("\n");
  const start = lines.findIndex((line) => line.includes(startMarker));
  if (start < 0) return [];
  const relativeEnd = endMarker ? lines.slice(start + 1).findIndex((line) => line.includes(endMarker)) : -1;
  const end = relativeEnd >= 0 ? start + relativeEnd + 1 : lines.length;
  return [...new Set(lines.slice(start + 1, end).flatMap((line) => line.match(/^\s{3,10}([A-Z]{3}\d{4})\s+/)?.[1] ?? []))];
}

export function catalogueSource(
  id: string,
  courseIds: string[],
  maxHours?: number,
  hoursField?: CurriculumRequirementSource["hoursField"],
): CurriculumRequirementSource {
  return {
    id,
    courseIds,
    allowsManualHours: false,
    ...(maxHours === undefined ? {} : { maxHours }),
    ...(hoursField === undefined ? {} : { hoursField }),
  };
}

export function manualSource(id: string, maxHours?: number, manualLabel?: string): CurriculumRequirementSource {
  return {
    id,
    courseIds: [],
    allowsManualHours: true,
    ...(maxHours === undefined ? {} : { maxHours }),
    ...(manualLabel === undefined ? {} : { manualLabel }),
  };
}

export function requirement(id: string, name: string, requiredHours: number, sources: CurriculumRequirementSource[]): CurriculumRequirement {
  return { id, name, requiredHours, sources };
}

export function idsByType(courses: CurriculumData["courses"], type: "Ob" | "Op"): string[] {
  return courses.filter((course) => course.type === type).map((course) => course.id);
}

export function without(ids: string[], excluded: string[]): string[] {
  const excludedSet = new Set(excluded);
  return ids.filter((id) => !excludedSet.has(id));
}

export function known(ids: string[], courses: CurriculumData["courses"]): string[] {
  const available = new Set(courses.map((course) => course.id));
  return ids.filter((id) => available.has(id));
}
