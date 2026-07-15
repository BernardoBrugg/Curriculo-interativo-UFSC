import { CourseStatus } from "@/types/curriculum";

export interface FirestoreProgress {
  statuses: Record<string, CourseStatus>;
  customPhases: Record<string, number>;
}

export function normalizeProgress(value: unknown): FirestoreProgress {
  if (!value || typeof value !== "object") {
    return { statuses: {}, customPhases: {} };
  }

  const data = value as { statuses?: unknown; customPhases?: unknown };
  const validStatuses = new Set<CourseStatus>(["pending", "in-progress", "completed"]);
  const statuses = Object.fromEntries(
    Object.entries(data.statuses ?? {}).filter((entry): entry is [string, CourseStatus] =>
      validStatuses.has(entry[1] as CourseStatus)
    )
  );
  const customPhases = Object.fromEntries(
    Object.entries(data.customPhases ?? {}).filter((entry): entry is [string, number] =>
      typeof entry[1] === "number" && Number.isInteger(entry[1]) && entry[1] >= 1 && entry[1] <= 10
    )
  );

  return { statuses, customPhases };
}
