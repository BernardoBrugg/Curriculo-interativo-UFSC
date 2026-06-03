"use client";

import { useState, useCallback } from "react";
import { CourseStatus } from "@/types/curriculum";

const STATUSES: CourseStatus[] = ["pending", "in-progress", "completed"];

function loadFromStorage(courseId: string): Record<string, CourseStatus> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(`curriculo-${courseId}-status`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveToStorage(courseId: string, data: Record<string, CourseStatus>) {
  localStorage.setItem(`curriculo-${courseId}-status`, JSON.stringify(data));
}

export function useCourseStatus(courseId: string) {
  const [statuses, setStatuses] = useState<Record<string, CourseStatus>>(() => loadFromStorage(courseId));

  const getStatus = useCallback(
    (id: string): CourseStatus => statuses[id] ?? "pending",
    [statuses]
  );

  const setStatus = useCallback((id: string, status: CourseStatus) => {
    setStatuses((prev) => {
      const next = { ...prev };
      if (status === "pending") delete next[id];
      else next[id] = status;
      saveToStorage(courseId, next);
      return next;
    });
  }, [courseId]);

  const toggleStatus = useCallback((id: string) => {
    setStatuses((prev) => {
      const current = prev[id] ?? "pending";
      const nextIdx = (STATUSES.indexOf(current) + 1) % STATUSES.length;
      const newStatus = STATUSES[nextIdx];
      const next = { ...prev };
      
      if (newStatus === "pending") {
        delete next[id];
      } else {
        next[id] = newStatus;
      }
      
      saveToStorage(courseId, next);
      return next;
    });
  }, [courseId]);

  const resetAll = useCallback(() => {
    setStatuses({});
    saveToStorage(courseId, {});
  }, [courseId]);

  return { statuses, getStatus, setStatus, toggleStatus, resetAll };
}
