"use client";

import { useCallback, useEffect, useState } from "react";
import { deleteField, doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { useAuth } from "@/components/AuthProvider";
import { firestore } from "@/lib/firebase";
import { normalizeProgress } from "@/lib/firestore-progress";

export function useCustomPhases(courseId: string) {
  const { user } = useAuth();
  const [customPhases, setCustomPhases] = useState<Record<string, number>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    return onSnapshot(
      doc(firestore, "users", user.uid, "curricula", courseId),
      (snapshot) => {
        setCustomPhases(normalizeProgress(snapshot.data()).customPhases);
        setError("");
      },
      () => setError("Não foi possível carregar seu planejamento salvo.")
    );
  }, [courseId, user]);

  const saveCustomPhase = useCallback(async (subjectId: string, phaseNumber: number) => {
    if (!user) return;
    try {
      await setDoc(
        doc(firestore, "users", user.uid, "curricula", courseId),
        { customPhases: { [subjectId]: phaseNumber }, updatedAt: serverTimestamp() },
        { merge: true }
      );
    } catch {
      setError("Não foi possível salvar seu planejamento. Tente novamente.");
    }
  }, [courseId, user]);

  const setCustomPhase = useCallback((subjectId: string, phaseNumber: number) => {
    const nextPhases = { ...customPhases, [subjectId]: phaseNumber };
    setCustomPhases(nextPhases);
    void saveCustomPhase(subjectId, phaseNumber);
  }, [customPhases, saveCustomPhase]);

  const resetPhases = useCallback(() => {
    if (!user || Object.keys(customPhases).length === 0) return;
    const nextPhases = Object.fromEntries(Object.keys(customPhases).map((id) => [id, deleteField()]));
    setCustomPhases({});
    void setDoc(
      doc(firestore, "users", user.uid, "curricula", courseId),
      { customPhases: nextPhases, updatedAt: serverTimestamp() },
      { merge: true }
    ).catch(() => setError("Não foi possível salvar seu planejamento. Tente novamente."));
  }, [courseId, customPhases, user]);

  return { customPhases, setCustomPhase, resetPhases, error };
}
