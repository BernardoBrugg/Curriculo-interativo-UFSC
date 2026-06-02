"use client";

import { useState, useCallback } from "react";
import { CourseStatus } from "@/types/curriculum";

const STORAGE_KEY = "curriculo-eps-status";
const STATUSES: CourseStatus[] = ["pending", "in-progress", "completed"];

function loadFromStorage(): Record<string, CourseStatus> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveToStorage(data: Record<string, CourseStatus>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useCourseStatus() {
  const [statuses, setStatuses] = useState<Record<string, CourseStatus>>(loadFromStorage);

  const getStatus = useCallback(
    (id: string): CourseStatus => statuses[id] ?? "pending",
    [statuses]
  );

  const setStatus = useCallback((id: string, status: CourseStatus) => {
    setStatuses((prev) => {
      const next = { ...prev };
      if (status === "pending") delete next[id];
      else next[id] = status;
      saveToStorage(next);
      return next;
    });
  }, []);

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
      
      saveToStorage(next);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    setStatuses({});
    saveToStorage({});
  }, []);

  return { statuses, getStatus, setStatus, toggleStatus, resetAll };
}
