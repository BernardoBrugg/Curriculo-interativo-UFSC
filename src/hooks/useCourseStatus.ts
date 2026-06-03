"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { CourseStatus } from "@/types/curriculum";

const STATUSES: CourseStatus[] = ["pending", "in-progress", "completed"];

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("curriculo-storage-update", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("curriculo-storage-update", callback);
    window.removeEventListener("storage", callback);
  };
}

export function useCourseStatus(courseId: string) {
  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return "{}";
    return localStorage.getItem(`curriculo-${courseId}-status`) || "{}";
  }, [courseId]);

  const rawStatuses = useSyncExternalStore(subscribe, getSnapshot, () => "{}");

  const statuses = useMemo(() => {
    try {
      return JSON.parse(rawStatuses) as Record<string, CourseStatus>;
    } catch {
      return {};
    }
  }, [rawStatuses]);

  const saveToStorage = useCallback(
    (data: Record<string, CourseStatus>) => {
      localStorage.setItem(`curriculo-${courseId}-status`, JSON.stringify(data));
      window.dispatchEvent(new Event("curriculo-storage-update"));
    },
    [courseId]
  );

  const getStatus = useCallback(
    (id: string): CourseStatus => statuses[id] ?? "pending",
    [statuses]
  );

  const setStatus = useCallback(
    (id: string, status: CourseStatus) => {
      const next = { ...statuses };
      if (status === "pending") delete next[id];
      else next[id] = status;
      saveToStorage(next);
    },
    [statuses, saveToStorage]
  );

  const toggleStatus = useCallback(
    (id: string) => {
      const current = statuses[id] ?? "pending";
      const nextIdx = (STATUSES.indexOf(current) + 1) % STATUSES.length;
      const newStatus = STATUSES[nextIdx];
      const next = { ...statuses };

      if (newStatus === "pending") {
        delete next[id];
      } else {
        next[id] = newStatus;
      }

      saveToStorage(next);
    },
    [statuses, saveToStorage]
  );

  const resetAll = useCallback(() => {
    saveToStorage({});
  }, [saveToStorage]);

  return { statuses, getStatus, setStatus, toggleStatus, resetAll, isMounted: true };
}
