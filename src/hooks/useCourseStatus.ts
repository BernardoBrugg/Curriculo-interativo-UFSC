"use client";

import { useCallback, useEffect, useState } from "react";
import { FieldPath, deleteField, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/components/AuthProvider";
import { firestore } from "@/lib/firebase";
import { normalizeProgress } from "@/lib/firestore-progress";
import {
  clearLocalProgress,
  getLocalProgress,
  saveLocalProgress,
  setLocalCourseStatus,
  setLocalRequirementHours,
} from "@/lib/local-progress";
import { CourseStatus } from "@/types/curriculum";

const statuses: CourseStatus[] = ["pending", "in-progress", "completed"];

export function useCourseStatus(courseId: string) {
  const { user } = useAuth();
  const [courseStatuses, setCourseStatuses] = useState<Record<string, CourseStatus>>(() => getLocalProgress(courseId).statuses);
  const [requirementHours, setRequirementHoursState] = useState<Record<string, number>>(() => getLocalProgress(courseId).requirementHours);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const local = getLocalProgress(courseId);
    const hasLocal = Object.keys(local.statuses).length > 0 || Object.keys(local.requirementHours).length > 0;

    if (hasLocal) {
      void setDoc(
        doc(firestore, "users", user.uid, "curricula", courseId),
        {
          statuses: local.statuses,
          requirementHours: local.requirementHours,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      ).catch(() => undefined);
    }

    return onSnapshot(
      doc(firestore, "users", user.uid, "curricula", courseId),
      (snapshot) => {
        const progress = normalizeProgress(snapshot.data());
        setCourseStatuses(progress.statuses);
        setRequirementHoursState(progress.requirementHours);
        saveLocalProgress(courseId, progress);
        setError("");
      },
      () => setError("Não foi possível carregar o progresso salvo.")
    );
  }, [courseId, user]);

  const saveStatus = useCallback(
    async (id: string, status: CourseStatus) => {
      if (!user) {
        setLocalCourseStatus(courseId, id, status);
        return;
      }
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
    },
    [courseId, user]
  );

  const getStatus = useCallback((id: string): CourseStatus => courseStatuses[id] ?? "pending", [courseStatuses]);

  const setStatus = useCallback(
    (id: string, status: CourseStatus) => {
      const nextStatuses = { ...courseStatuses };
      if (status === "pending") delete nextStatuses[id];
      else nextStatuses[id] = status;
      setCourseStatuses(nextStatuses);
      void saveStatus(id, status);
    },
    [courseStatuses, saveStatus]
  );

  const setBatchStatuses = useCallback(
    (updates: Record<string, CourseStatus>) => {
      const nextStatuses = { ...courseStatuses };
      Object.entries(updates).forEach(([id, status]) => {
        if (status === "pending") delete nextStatuses[id];
        else nextStatuses[id] = status;
        if (!user) {
          setLocalCourseStatus(courseId, id, status);
        }
      });
      setCourseStatuses(nextStatuses);
      if (user) {
        void setDoc(
          doc(firestore, "users", user.uid, "curricula", courseId),
          { statuses: nextStatuses, updatedAt: serverTimestamp() },
          { merge: true }
        ).catch(() => setError("Não foi possível salvar o progresso. Tente novamente."));
      }
    },
    [courseId, courseStatuses, user]
  );

  const toggleStatus = useCallback(
    (id: string) => {
      const current = courseStatuses[id] ?? "pending";
      const nextStatus = statuses[(statuses.indexOf(current) + 1) % statuses.length];
      setStatus(id, nextStatus);
    },
    [courseStatuses, setStatus]
  );

  const setRequirementHours = useCallback(
    (id: string, hours: number) => {
      if (!Number.isFinite(hours) || hours < 0) return;
      setRequirementHoursState((current) => ({ ...current, [id]: hours }));
      if (!user) {
        setLocalRequirementHours(courseId, id, hours);
        return;
      }
      void setDoc(
        doc(firestore, "users", user.uid, "curricula", courseId),
        { requirementHours: { [id]: hours }, updatedAt: serverTimestamp() },
        { merge: true }
      ).catch(() => setError("Não foi possível salvar as horas validadas. Tente novamente."));
    },
    [courseId, user]
  );

  const resetAll = useCallback(() => {
    if (Object.keys(courseStatuses).length === 0 && Object.keys(requirementHours).length === 0) return;
    setCourseStatuses({});
    setRequirementHoursState({});
    if (!user) {
      clearLocalProgress(courseId);
      return;
    }
    const nextStatuses = Object.fromEntries(Object.keys(courseStatuses).map((id) => [id, deleteField()]));
    void setDoc(
      doc(firestore, "users", user.uid, "curricula", courseId),
      { statuses: nextStatuses, requirementHours: deleteField(), updatedAt: serverTimestamp() },
      { merge: true }
    ).catch(() => setError("Não foi possível salvar o progresso. Tente novamente."));
  }, [courseId, courseStatuses, requirementHours, user]);

  return { statuses: courseStatuses, requirementHours, getStatus, setStatus, setBatchStatuses, setRequirementHours, toggleStatus, resetAll, error };
}
