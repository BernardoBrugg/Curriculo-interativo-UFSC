"use client";

import { useCallback, useEffect, useState } from "react";
import { deleteField, doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { useAuth } from "@/components/AuthProvider";
import { firestore } from "@/lib/firebase";
import { normalizeProgress } from "@/lib/firestore-progress";
import {
  getLocalProgress,
  saveLocalProgress,
  setLocalCustomPhase,
} from "@/lib/local-progress";

export function useCustomPhases(courseId: string) {
  const { user } = useAuth();
  const [customPhases, setCustomPhases] = useState<Record<string, number>>(() => getLocalProgress(courseId).customPhases);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const local = getLocalProgress(courseId);
    if (Object.keys(local.customPhases).length > 0) {
      void setDoc(
        doc(firestore, "users", user.uid, "curricula", courseId),
        { customPhases: local.customPhases, updatedAt: serverTimestamp() },
        { merge: true }
      ).catch(() => undefined);
    }

    return onSnapshot(
      doc(firestore, "users", user.uid, "curricula", courseId),
      (snapshot) => {
        const progress = normalizeProgress(snapshot.data());
        setCustomPhases(progress.customPhases);
        saveLocalProgress(courseId, progress);
        setError("");
      },
      () => setError("Não foi possível carregar seu planejamento salvo.")
    );
  }, [courseId, user]);

  const saveCustomPhase = useCallback(
    async (subjectId: string, phaseNumber: number) => {
      if (!user) {
        setLocalCustomPhase(courseId, subjectId, phaseNumber);
        return;
      }
      try {
        await setDoc(
          doc(firestore, "users", user.uid, "curricula", courseId),
          { customPhases: { [subjectId]: phaseNumber }, updatedAt: serverTimestamp() },
          { merge: true }
        );
      } catch {
        setError("Não foi possível salvar seu planejamento. Tente novamente.");
      }
    },
    [courseId, user]
  );

  const setCustomPhase = useCallback(
    (subjectId: string, phaseNumber: number) => {
      const nextPhases = { ...customPhases, [subjectId]: phaseNumber };
      setCustomPhases(nextPhases);
      void saveCustomPhase(subjectId, phaseNumber);
    },
    [customPhases, saveCustomPhase]
  );

  const resetPhases = useCallback(() => {
    if (Object.keys(customPhases).length === 0) return;
    setCustomPhases({});
    if (!user) {
      const local = getLocalProgress(courseId);
      saveLocalProgress(courseId, { ...local, customPhases: {} });
      return;
    }
    const nextPhases = Object.fromEntries(Object.keys(customPhases).map((id) => [id, deleteField()]));
    void setDoc(
      doc(firestore, "users", user.uid, "curricula", courseId),
      { customPhases: nextPhases, updatedAt: serverTimestamp() },
      { merge: true }
    ).catch(() => setError("Não foi possível salvar seu planejamento. Tente novamente."));
  }, [courseId, customPhases, user]);

  return { customPhases, setCustomPhase, resetPhases, error };
}
