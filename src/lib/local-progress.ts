import { CourseStatus } from "@/types/curriculum";
import { FirestoreProgress, normalizeProgress } from "./firestore-progress";

const LOCAL_STORAGE_PREFIX = "curriculo_local_progress:";

function getStorageKey(courseId: string): string {
  return `${LOCAL_STORAGE_PREFIX}${courseId}`;
}

export function getLocalProgress(courseId: string): FirestoreProgress {
  if (typeof window === "undefined") {
    return { statuses: {}, customPhases: {}, requirementHours: {} };
  }
  try {
    const raw = window.localStorage.getItem(getStorageKey(courseId));
    if (!raw) return { statuses: {}, customPhases: {}, requirementHours: {} };
    return normalizeProgress(JSON.parse(raw));
  } catch {
    return { statuses: {}, customPhases: {}, requirementHours: {} };
  }
}

export function saveLocalProgress(courseId: string, progress: FirestoreProgress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(getStorageKey(courseId), JSON.stringify(progress));
  } catch {
    return;
  }
}

export function setLocalCourseStatus(courseId: string, subjectId: string, status: CourseStatus): FirestoreProgress {
  const current = getLocalProgress(courseId);
  const nextStatuses = { ...current.statuses };
  if (status === "pending") {
    delete nextStatuses[subjectId];
  } else {
    nextStatuses[subjectId] = status;
  }
  const updated: FirestoreProgress = { ...current, statuses: nextStatuses };
  saveLocalProgress(courseId, updated);
  return updated;
}

export function setLocalCustomPhase(courseId: string, subjectId: string, phase: number): FirestoreProgress {
  const current = getLocalProgress(courseId);
  const nextPhases = { ...current.customPhases, [subjectId]: phase };
  const updated: FirestoreProgress = { ...current, customPhases: nextPhases };
  saveLocalProgress(courseId, updated);
  return updated;
}

export function setLocalRequirementHours(courseId: string, sourceId: string, hours: number): FirestoreProgress {
  const current = getLocalProgress(courseId);
  const nextHours = { ...current.requirementHours, [sourceId]: hours };
  const updated: FirestoreProgress = { ...current, requirementHours: nextHours };
  saveLocalProgress(courseId, updated);
  return updated;
}

export function clearLocalProgress(courseId: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(getStorageKey(courseId));
  } catch {
    return;
  }
}

export function hasLocalProgress(courseId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const progress = getLocalProgress(courseId);
    return (
      Object.keys(progress.statuses).length > 0 ||
      Object.keys(progress.customPhases).length > 0 ||
      Object.keys(progress.requirementHours).length > 0
    );
  } catch {
    return false;
  }
}
