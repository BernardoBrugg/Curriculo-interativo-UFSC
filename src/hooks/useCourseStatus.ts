"use client";

import { useCallback, useEffect, useState } from "react";
import { FieldPath, deleteField, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/components/AuthProvider";
import { firestore } from "@/lib/firebase";
import { normalizeProgress } from "@/lib/firestore-progress";
import { CourseStatus } from "@/types/curriculum";

const statuses: CourseStatus[] = ["pending", "in-progress", "completed"];

export function useCourseStatus(courseId: string) {
  const { user } = useAuth();
  const [courseStatuses, setCourseStatuses] = useState<Record<string, CourseStatus>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    return onSnapshot(
      doc(firestore, "users", user.uid, "curricula", courseId),
      (snapshot) => {
        setCourseStatuses(normalizeProgress(snapshot.data()).statuses);
        setError("");
      },
      () => setError("Não foi possível carregar o progresso salvo.")
    );
  }, [courseId, user]);

  const saveStatus = useCallback(async (id: string, status: CourseStatus) => {
    if (!user) return;
    try {
      const progressRef = doc(firestore, "users", user.uid, "curricula", courseId);
      if (status === "pending") {
        await updateDoc(progressRef, new FieldPath("statuses", id), deleteField(), "updatedAt", serverTimestamp());
        return;
      }
      await setDoc(progressRef, { statuses: { [id]: status }, updatedAt: serverTimestamp() }, { merge: true });
    } catch {
      setError("Não foi possível salvar o progresso. Tente novamente.");
    }
  }, [courseId, user]);

  const getStatus = useCallback((id: string): CourseStatus => courseStatuses[id] ?? "pending", [courseStatuses]);

  const setStatus = useCallback((id: string, status: CourseStatus) => {
    const nextStatuses = { ...courseStatuses };
    if (status === "pending") delete nextStatuses[id];
    else nextStatuses[id] = status;
    setCourseStatuses(nextStatuses);
    void saveStatus(id, status);
  }, [courseStatuses, saveStatus]);

  const toggleStatus = useCallback((id: string) => {
    const current = courseStatuses[id] ?? "pending";
    const nextStatus = statuses[(statuses.indexOf(current) + 1) % statuses.length];
    setStatus(id, nextStatus);
  }, [courseStatuses, setStatus]);

  const resetAll = useCallback(() => {
    if (!user || Object.keys(courseStatuses).length === 0) return;
    const nextStatuses = Object.fromEntries(Object.keys(courseStatuses).map((id) => [id, deleteField()]));
    setCourseStatuses({});
    void setDoc(
      doc(firestore, "users", user.uid, "curricula", courseId),
      { statuses: nextStatuses, updatedAt: serverTimestamp() },
      { merge: true }
    ).catch(() => setError("Não foi possível salvar o progresso. Tente novamente."));
  }, [courseId, courseStatuses, user]);

  return { statuses: courseStatuses, getStatus, setStatus, toggleStatus, resetAll, error };
}
